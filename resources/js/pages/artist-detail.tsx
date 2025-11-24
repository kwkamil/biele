import { Head, Link } from '@inertiajs/react'
import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'

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
  price_min: number
  price_max: number
  featured_image: string
  gallery: Gallery
}

interface Artist {
  id: number
  name: string
  slug: string
  photo: string
  biography: string
  artworks: Artwork[]
}

interface ArtistDetailProps {
  slug: string
}

export default function ArtistDetail({ slug }: ArtistDetailProps) {
  const [artist, setArtist] = useState<Artist | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchArtist()
  }, [slug])

  const fetchArtist = async () => {
    try {
      const response = await fetch(`/api/artists/${slug}`)
      if (!response.ok) {
        throw new Error('Artysta nie został znaleziony')
      }
      const data = await response.json()
      setArtist(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd')
    } finally {
      setLoading(false)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Ładowanie...</div>
      </div>
    )
  }

  if (error || !artist) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Artysta nie został znaleziony'}
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
      <Head title={artist.name} />

      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Artist Info */}
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-shrink-0">
                {artist.photo ? (
                  <img
                    src={`/storage/${artist.photo}`}
                    alt={artist.name}
                    className="w-48 h-48 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">Brak zdjęcia</span>
                  </div>
                )}
              </div>

              <div className="flex-grow">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{artist.name}</h1>

                <div className="mb-6">
                  <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {artist.artworks.length} {artist.artworks.length === 1 ? 'dzieło' : 'dzieł'}
                  </span>
                </div>

                {artist.biography && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Biografia</h2>
                    <p className="text-gray-700 leading-relaxed">{artist.biography}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Artworks */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Dzieła artysty ({artist.artworks.length})
            </h2>

            {artist.artworks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {artist.artworks.map((artwork) => (
                  <div key={artwork.id} className="bg-white rounded-lg shadow overflow-hidden">
                    <Link href={`/artworks/${artwork.slug}`}>
                      {artwork.featured_image ? (
                        <img
                          src={`/storage/${artwork.featured_image}`}
                          alt={artwork.title}
                          className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors">
                          <span className="text-gray-500">Brak zdjęcia</span>
                        </div>
                      )}
                    </Link>

                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2">
                        <Link
                          href={`/artworks/${artwork.slug}`}
                          className="text-gray-900 hover:text-blue-600 transition-colors"
                        >
                          {artwork.title}
                        </Link>
                      </h3>

                      <p className="text-gray-600 text-sm mb-2">
                        {artwork.gallery.name}
                      </p>

                      <div className="flex gap-2 mb-3">
                        {artwork.category && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                            {artwork.category}
                          </span>
                        )}
                        {artwork.style && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                            {artwork.style}
                          </span>
                        )}
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">
                          {formatPrice(artwork.price_min, artwork.price_max)}
                        </span>
                        <Link
                          href={`/artworks/${artwork.slug}`}
                          className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700"
                        >
                          Szczegóły
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-gray-500">
                  Ten artysta nie ma jeszcze opublikowanych dzieł.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}