import { Head, Link } from '@inertiajs/react'
import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'

interface Artist {
  id: number
  name: string
  slug: string
  photo: string
  biography: string
  artworks_count: number
}

export default function Artists() {
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchArtists()
  }, [])

  const fetchArtists = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/artists')
      const data = await response.json()
      setArtists(data.data)
    } catch (error) {
      console.error('Failed to fetch artists:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head title="Artyści" />

      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Wszyscy artyści</h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="text-xl text-gray-900">Ładowanie...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {artists.map((artist) => (
                <Link
                  key={artist.id}
                  href={`/artists/${artist.slug}`}
                  className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow cursor-pointer block"
                >
                  {artist.photo ? (
                    <img
                      src={`/storage/${artist.photo}`}
                      alt={artist.name}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">Brak zdjęcia</span>
                    </div>
                  )}

                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {artist.name}
                    </h3>

                    <div className="mb-3">
                      <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {artist.artworks_count} {artist.artworks_count === 1 ? 'dzieło' : 'dzieł'}
                      </span>
                    </div>

                    {artist.biography && (
                      <p className="text-sm text-gray-700 line-clamp-3">
                        {artist.biography}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {artists.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">Brak artystów do wyświetlenia</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
