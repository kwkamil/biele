import { Head, Link } from '@inertiajs/react'
import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'

interface Gallery {
  id: number
  name: string
  slug: string
  description: string
  contact_email: string
  artworks_count: number
}

export default function Galleries() {
  const [galleries, setGalleries] = useState<Gallery[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGalleries()
  }, [])

  const fetchGalleries = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/galleries')
      const data = await response.json()
      setGalleries(data.data)
    } catch (error) {
      console.error('Failed to fetch galleries:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head title="Galerie" />

      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Wszystkie galerie</h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="text-xl text-gray-900">Ładowanie...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleries.map((gallery) => (
                <div
                  key={gallery.id}
                  className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {gallery.name}
                  </h3>

                  <div className="mb-4">
                    <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {gallery.artworks_count} {gallery.artworks_count === 1 ? 'dzieło' : 'dzieł'}
                    </span>
                  </div>

                  {gallery.description && (
                    <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                      {gallery.description}
                    </p>
                  )}

                  {gallery.contact_email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>📧</span>
                      <a
                        href={`mailto:${gallery.contact_email}`}
                        className="hover:text-blue-600"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {gallery.contact_email}
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {galleries.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">Brak galerii do wyświetlenia</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
