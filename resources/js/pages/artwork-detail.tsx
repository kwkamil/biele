import { Head, Link, router, usePage } from '@inertiajs/react'
import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import { toast } from 'sonner'
import { copyToClipboard } from '@/utils/clipboard'

interface Artist {
  id: number
  name: string
  slug: string
  biography: string
}

interface Gallery {
  id: number
  name: string
  slug: string
}

interface Artwork {
  id: number
  title: string
  slug: string
  category: string
  style: string
  theme: string
  price_min: number
  price_max: number
  medium: string
  dimensions: string
  description: string
  featured_image: string
  additional_images: string[]
  artist: Artist
  gallery: Gallery
  created_at: string
}

interface ArtworkDetailProps {
  slug: string
}

export default function ArtworkDetail({ slug }: ArtworkDetailProps) {
  const [artwork, setArtwork] = useState<Artwork | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSaved, setIsSaved] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showInquiryForm, setShowInquiryForm] = useState(false)

  useEffect(() => {
    fetchArtwork()
    checkIfSaved()
  }, [slug])

  const fetchArtwork = async () => {
    try {
      const response = await fetch(`/api/artworks/${slug}`)
      if (!response.ok) {
        throw new Error('Dzieło nie zostało znalezione')
      }
      const data = await response.json()
      setArtwork(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd')
    } finally {
      setLoading(false)
    }
  }

  const checkIfSaved = async () => {
    try {
      const response = await fetch('/api/saved-artworks', {
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
        }
      })
      const data = await response.json()
      const savedIds = data.data.map((item: any) => item.artwork_id)
      setIsSaved(savedIds.includes(artwork?.id))
    } catch (error) {
      console.error('Failed to check if saved:', error)
    }
  }

  const toggleSaved = async () => {
    if (!artwork) return

    try {
      if (isSaved) {
        const response = await fetch(`/api/saved-artworks/${artwork.id}`, {
          method: 'DELETE',
          credentials: 'same-origin',
          headers: {
            'Accept': 'application/json',
          }
        })
        const data = await response.json()
        setIsSaved(false)
        toast.success(data.message || 'Artwork removed from saved')
      } else {
        const response = await fetch('/api/saved-artworks', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
          },
          body: JSON.stringify({ artwork_id: artwork.id })
        })
        const data = await response.json()
        setIsSaved(true)
        toast.success(data.message || 'Artwork saved successfully')
      }
    } catch (error) {
      console.error('Failed to toggle saved:', error)
      toast.error('Failed to save artwork. Please try again.')
    }
  }

  const formatPrice = (min: number, max: number) => {
    if (min && max) {
      return `${min.toLocaleString()} - ${max.toLocaleString()} zł`
    } else if (min) {
      return `od ${min.toLocaleString()} zł`
    } else if (max) {
      return `do ${max.toLocaleString()} zł`
    }
    return 'Cena do uzgodnienia'
  }

  const allImages = artwork ? [artwork.featured_image, ...(artwork.additional_images || [])].filter(Boolean) : []

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Ładowanie...</div>
      </div>
    )
  }

  if (error || !artwork) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Dzieło nie zostało znalezione'}
          </h1>
          <Link href="/catalog" className="text-blue-600 hover:underline">
            Powrót do katalogu
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head title={artwork.title} />

      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                {allImages.length > 0 ? (
                  <img
                    src={`/storage/${allImages[currentImageIndex]}`}
                    alt={artwork.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    Brak zdjęcia
                  </div>
                )}
              </div>

              {/* Image Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {allImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        currentImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={`/storage/${image}`}
                        alt={`${artwork.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{artwork.title}</h1>
                  <button
                    onClick={toggleSaved}
                    className={`text-3xl ${isSaved ? 'text-red-500' : 'text-gray-300'}`}
                  >
                    ♥
                  </button>
                </div>

                <p className="text-xl text-gray-600 mb-4">
                  <Link
                    href={`/artists/${artwork.artist.slug}`}
                    className="hover:underline"
                  >
                    {artwork.artist.name}
                  </Link>
                </p>

                <div className="flex gap-2 mb-4">
                  {artwork.category && (
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                      {artwork.category}
                    </span>
                  )}
                  {artwork.style && (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                      {artwork.style}
                    </span>
                  )}
                  {artwork.theme && (
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                      {artwork.theme}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold text-gray-700">Technika:</span>
                  <p className="text-gray-900">{artwork.medium || 'Nie podano'}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Wymiary:</span>
                  <p className="text-gray-900">{artwork.dimensions || 'Nie podano'}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Galeria:</span>
                  <p className="text-gray-900">{artwork.gallery.name}</p>
                </div>
              </div>

              {artwork.description && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Opis</h2>
                  <p className="text-gray-700 leading-relaxed">{artwork.description}</p>
                </div>
              )}

              {artwork.artist.biography && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">O artyście</h2>
                  <p className="text-gray-700 leading-relaxed">{artwork.artist.biography}</p>
                </div>
              )}

              <div className="bg-gray-100 p-4 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 mb-4">
                  {formatPrice(artwork.price_min, artwork.price_max)}
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setShowInquiryForm(true)}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 font-semibold"
                  >
                    Wyślij zapytanie do galerii
                  </button>

                  <button
                    onClick={toggleSaved}
                    className={`w-full py-3 px-4 rounded-md font-semibold ${
                      isSaved
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {isSaved ? 'Usuń ze schowka' : 'Dodaj do schowka'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Inquiry Modal */}
        {showInquiryForm && (
          <InquiryModal
            artworkId={artwork.id}
            artworkTitle={artwork.title}
            onClose={() => setShowInquiryForm(false)}
          />
        )}
      </div>
    </>
  )
}

function InquiryModal({ artworkId, artworkTitle, onClose }: {
  artworkId: number
  artworkTitle: string
  onClose: () => void
}) {
  const { auth } = usePage<{ auth: { user: { name: string; email: string } | null } }>().props

  // Auto-populate form data from logged-in user
  const getInitialFormData = () => {
    if (auth.user) {
      return {
        name: auth.user.name,
        email: auth.user.email,
        company: '',
      }
    }
    return {
      name: '',
      email: '',
      company: '',
    }
  }

  const [formData, setFormData] = useState(getInitialFormData())
  const isAutoFilled = !!auth.user
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [inquiryData, setInquiryData] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Split name into first_name and last_name for backend
      const nameParts = formData.name.trim().split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''

      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: formData.email,
          company: formData.company,
          artwork_ids: [artworkId]
        })
      })

      if (response.ok) {
        const data = await response.json()
        setInquiryData(data.data)
        setSubmitted(true)
        // Don't auto-close - let user read the verification message
      } else {
        throw new Error('Wystąpił błąd podczas wysyłania zapytania')
      }
    } catch (error) {
      alert('Wystąpił błąd podczas wysyłania zapytania')
      console.error('Failed to submit inquiry:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-lg mx-4">
          <div className="text-center">
            <div className="text-blue-600 text-6xl mb-4">📧</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sprawdź swoją pocztę e-mail!</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm leading-relaxed">
                Wysłaliśmy na Twój adres <strong>{formData.email}</strong> wiadomość z linkiem weryfikacyjnym.
                Kliknij w link, aby potwierdzić zapytanie i wysłać je do galerii.
              </p>
            </div>

            <div className="space-y-2 text-sm text-gray-600 mb-6">
              <p>✉️ Sprawdź skrzynkę odbiorczą</p>
              <p>📁 Zajrzyj też do folderu SPAM</p>
              <p>⏰ Link jest ważny przez 24 godziny</p>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Rozumiem
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4 w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Zapytanie o dzieło</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <p className="text-gray-600 mb-4">Dzieło: <strong className="text-gray-900">{artworkTitle}</strong></p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Imię i nazwisko"
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            readOnly={isAutoFilled}
            className={`w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 placeholder-gray-500 ${
              isAutoFilled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
            }`}
          />

          <input
            type="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            readOnly={isAutoFilled}
            className={`w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 placeholder-gray-500 ${
              isAutoFilled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
            }`}
          />

          <input
            type="text"
            placeholder="Firma/Pracownia (opcjonalnie)"
            value={formData.company}
            onChange={(e) => setFormData({...formData, company: e.target.value})}
            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 placeholder-gray-500"
          />

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300"
            >
              Anuluj
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Wysyłanie...' : 'Wyślij zapytanie'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}