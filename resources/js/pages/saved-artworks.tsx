import { Head, Link, router, usePage } from '@inertiajs/react'
import { useState, useEffect } from 'react'
import { getAPIHeaders } from '@/utils/csrf'
import Navbar from '@/components/Navbar'

interface Artist {
  id: number
  name: string
  slug: string
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
  price_min: number
  price_max: number
  featured_image: string
  artist: Artist
  gallery: Gallery
}

interface SavedItem {
  id: number
  artwork_id: number
  artwork: Artwork
  created_at: string
}

export default function SavedArtworks() {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [showInquiryForm, setShowInquiryForm] = useState(false)

  useEffect(() => {
    fetchSavedItems()
  }, [])

  const fetchSavedItems = async () => {
    try {
      const response = await fetch('/api/saved-artworks', {
        credentials: 'include',
        headers: getAPIHeaders(),
      })
      const data = await response.json()
      setSavedItems(data.data)
    } catch (error) {
      console.error('Failed to fetch saved items:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeItem = async (artworkId: number) => {
    try {
      await fetch(`/api/saved-artworks/${artworkId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: getAPIHeaders(),
      })
      setSavedItems(prev => prev.filter(item => item.artwork_id !== artworkId))
      setSelectedItems(prev => prev.filter(id => id !== artworkId))
    } catch (error) {
      console.error('Failed to remove item:', error)
    }
  }

  const toggleSelectItem = (artworkId: number) => {
    setSelectedItems(prev =>
      prev.includes(artworkId)
        ? prev.filter(id => id !== artworkId)
        : [...prev, artworkId]
    )
  }

  const selectAll = () => {
    setSelectedItems(savedItems.map(item => item.artwork_id))
  }

  const clearSelection = () => {
    setSelectedItems([])
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Ładowanie...</div>
      </div>
    )
  }

  return (
    <>
      <Head title="Schowek" />

      <div className="min-h-screen bg-gray-50">
        <Navbar />

        {/* Schowek Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Schowek ({savedItems.length})
                </h2>
              </div>

              {savedItems.length > 0 && (
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-600">
                    Zaznaczono: {selectedItems.length} / {savedItems.length}
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={selectAll}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Zaznacz wszystkie
                    </button>
                    <button
                      onClick={clearSelection}
                      className="text-gray-600 hover:underline text-sm"
                    >
                      Odznacz wszystkie
                    </button>
                  </div>
                  <button
                    onClick={() => setShowInquiryForm(true)}
                    disabled={selectedItems.length === 0}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Wyślij zapytanie ({selectedItems.length})
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {savedItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl text-gray-300 mb-4">💾</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Twój schowek jest pusty
              </h2>
              <p className="text-gray-600 mb-8">
                Przeglądaj katalog i dodawaj dzieła do schowka, klikając ikonę serca.
              </p>
              <Link
                href="/catalog"
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
              >
                Przejdź do katalogu
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {savedItems.map((savedItem) => (
                <div
                  key={savedItem.id}
                  className="bg-white rounded-lg shadow p-6 flex items-center gap-6"
                >
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(savedItem.artwork_id)}
                    onChange={() => toggleSelectItem(savedItem.artwork_id)}
                    className="w-5 h-5 text-blue-600"
                  />

                  {/* Image */}
                  <div className="flex-shrink-0">
                    {savedItem.artwork.featured_image ? (
                      <img
                        src={`/storage/${savedItem.artwork.featured_image}`}
                        alt={savedItem.artwork.title}
                        className="w-20 h-20 object-cover rounded-lg text-gray-800"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500 text-xs">Brak</span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold mb-1 text-gray-900">
                      <Link
                        href={`/artworks/${savedItem.artwork.slug}`}
                        className="hover:text-blue-600"
                      >
                        {savedItem.artwork.title}
                      </Link>
                    </h3>

                    <p className="text-gray-600 mb-2">
                      <Link
                        href={`/artists/${savedItem.artwork.artist.slug}`}
                        className="hover:underline"
                      >
                        {savedItem.artwork.artist.name}
                      </Link>
                      {' • '}
                      {savedItem.artwork.gallery.name}
                    </p>

                    <div className="flex items-center gap-4">
                      {savedItem.artwork.category && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          {savedItem.artwork.category}
                        </span>
                      )}
                      <span className="text-sm text-gray-500">
                        Dodano: {new Date(savedItem.created_at).toLocaleDateString('pl-PL')}
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900 mb-2">
                      {formatPrice(savedItem.artwork.price_min, savedItem.artwork.price_max)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Link
                      href={`/artworks/${savedItem.artwork.slug}`}
                      className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 text-center"
                    >
                      Szczegóły
                    </Link>
                    <button
                      onClick={() => removeItem(savedItem.artwork_id)}
                      className="bg-red-100 text-red-700 px-3 py-1 rounded-md text-sm hover:bg-red-200"
                    >
                      Usuń
                    </button>
                  </div>
                </div>
              ))}

              {/* Bottom Actions */}
              {savedItems.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6 mt-8">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-semibold text-gray-900">
                        Wybrane dzieła: {selectedItems.length}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Zaznacz dzieła i wyślij zapytanie do galerii
                      </p>
                    </div>
                    <button
                      onClick={() => setShowInquiryForm(true)}
                      disabled={selectedItems.length === 0}
                      className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                    >
                      Wyślij zapytanie o wybrane dzieła
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Inquiry Modal */}
        {showInquiryForm && (
          <InquiryModal
            artworkIds={selectedItems}
            artworkTitles={savedItems
              .filter(item => selectedItems.includes(item.artwork_id))
              .map(item => item.artwork.title)}
            onClose={() => setShowInquiryForm(false)}
          />
        )}
      </div>
    </>
  )
}

function InquiryModal({ artworkIds, artworkTitles, onClose }: {
  artworkIds: number[]
  artworkTitles: string[]
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
          artwork_ids: artworkIds
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
                Wysłaliśmy na Twój adres <strong>{formData.email}</strong> wiadomość z linkiem weryfikacyjnym
                dla {artworkIds.length} {artworkIds.length === 1 ? 'dzieła' : 'dzieł'}.
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
      <div className="bg-white rounded-lg p-6 max-w-lg mx-4 w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Zapytanie o dzieła</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-600 mb-2">Wybrane dzieła ({artworkTitles.length}):</p>
          <ul className="text-sm text-gray-700 max-h-32 overflow-y-auto">
            {artworkTitles.map((title, index) => (
              <li key={index} className="py-1 text-gray-700">• {title}</li>
            ))}
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Imię i nazwisko"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            readOnly={isAutoFilled}
            className={`w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 placeholder-gray-500 ${
              isAutoFilled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
            }`}
          />

          <input
            type="text"
            placeholder="Firma/Pracownia (opcjonalnie)"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
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