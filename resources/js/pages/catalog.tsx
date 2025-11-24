import { Head, Link, router } from '@inertiajs/react'
import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import { toast } from 'sonner'
import { CATEGORIES, STYLES, THEMES } from '@/utils/artworkOptions'

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
  style: string
  theme: string
  price_min: number
  price_max: number
  medium: string
  dimensions: string
  description: string
  featured_image: string
  artist: Artist
  gallery: Gallery
}

interface PaginatedArtworks {
  data: Artwork[]
  current_page: number
  last_page: number
  total: number
}

export default function Catalog() {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0
  })
  const [filters, setFilters] = useState({
    category: '',
    style: '',
    theme: '',
    artist_id: '',
    price_min: '',
    price_max: ''
  })
  const [savedItems, setSavedItems] = useState<number[]>([])

  useEffect(() => {
    fetchArtworks(1)
    loadSavedItems()
  }, [filters])

  const fetchArtworks = async (page: number = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })
      params.append('page', String(page))

      const response = await fetch(`/api/artworks?${params}`)
      const data: PaginatedArtworks = await response.json()
      setArtworks(data.data)
      setPagination({
        current_page: data.current_page,
        last_page: data.last_page,
        total: data.total
      })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      console.error('Failed to fetch artworks:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadSavedItems = async () => {
    try {
      const response = await fetch('/api/saved-artworks', {
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
        }
      })
      const data = await response.json()
      setSavedItems(data.data.map((item: any) => item.artwork_id))
    } catch (error) {
      console.error('Failed to load saved items:', error)
    }
  }

  const toggleSaved = async (artworkId: number) => {
    try {
      if (savedItems.includes(artworkId)) {
        const response = await fetch(`/api/saved-artworks/${artworkId}`, {
          method: 'DELETE',
          credentials: 'same-origin',
          headers: {
            'Accept': 'application/json',
          }
        })
        const data = await response.json()
        setSavedItems(prev => prev.filter(id => id !== artworkId))
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
          body: JSON.stringify({ artwork_id: artworkId })
        })
        const data = await response.json()
        setSavedItems(prev => [...prev, artworkId])
        toast.success(data.message || 'Artwork saved successfully')
      }
    } catch (error) {
      console.error('Failed to toggle saved item:', error)
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

  return (
    <>
      <Head title="Katalog dzieł sztuki" />

      <div className="min-h-screen bg-gray-50">
        <Navbar />

        {/* Filters */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtry</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900"
              >
                <option value="">Wszystkie kategorie</option>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={filters.style}
                onChange={(e) => setFilters({ ...filters, style: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900"
              >
                <option value="">Wszystkie style</option>
                {STYLES.map((style) => (
                  <option key={style} value={style}>
                    {style}
                  </option>
                ))}
              </select>

              <select
                value={filters.theme}
                onChange={(e) => setFilters({ ...filters, theme: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900"
              >
                <option value="">Wszystkie tematy</option>
                {THEMES.map((theme) => (
                  <option key={theme} value={theme}>
                    {theme}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Cena min"
                value={filters.price_min}
                onChange={(e) => setFilters({ ...filters, price_min: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 placeholder-gray-500"
              />

              <input
                type="number"
                placeholder="Cena max"
                value={filters.price_max}
                onChange={(e) => setFilters({ ...filters, price_max: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 placeholder-gray-500"
              />

              <button
                onClick={() => setFilters({
                  category: '', style: '', theme: '', artist_id: '', price_min: '', price_max: ''
                })}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Wyczyść
              </button>
            </div>
          </div>

          {/* Artworks Grid */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="text-xl">Ładowanie...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {artworks.map((artwork) => (
                <Link
                  key={artwork.id}
                  href={`/artworks/${artwork.slug}`}
                  className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow cursor-pointer block"
                >
                  {artwork.featured_image && (
                    <img
                      src={`/storage/${artwork.featured_image}`}
                      alt={artwork.title}
                      className="w-full h-48 object-cover"
                    />
                  )}

                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{artwork.title}</h3>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          toggleSaved(artwork.id)
                        }}
                        className={`text-2xl ${savedItems.includes(artwork.id) ? 'text-red-500' : 'text-gray-300'} hover:scale-110 transition-transform`}
                      >
                        ♥
                      </button>
                    </div>

                    <Link
                      href={`/artists/${artwork.artist.slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-gray-600 hover:text-blue-600 hover:underline inline-block mb-2"
                    >
                      {artwork.artist.name}
                    </Link>

                    <div className="flex gap-2 mb-2">
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

                    <p className="text-sm text-gray-500 mb-2">
                      {artwork.medium} • {artwork.dimensions}
                    </p>

                    <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                      {artwork.description}
                    </p>

                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">
                        {formatPrice(artwork.price_min, artwork.price_max)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {artworks.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">Nie znaleziono dzieł spełniających kryteria</p>
            </div>
          )}

          {/* Pagination */}
          {!loading && pagination.last_page > 1 && (
            <div className="mt-8 flex justify-center items-center gap-2">
              <button
                onClick={() => fetchArtworks(pagination.current_page - 1)}
                disabled={pagination.current_page === 1}
                className="px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Poprzednia
              </button>

              <div className="flex gap-2">
                {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, current page, and pages around current
                  const showPage =
                    page === 1 ||
                    page === pagination.last_page ||
                    (page >= pagination.current_page - 2 && page <= pagination.current_page + 2)

                  // Show ellipsis
                  const showEllipsis =
                    (page === pagination.current_page - 3 && pagination.current_page > 4) ||
                    (page === pagination.current_page + 3 && pagination.current_page < pagination.last_page - 3)

                  if (showEllipsis) {
                    return <span key={page} className="px-2 py-2 text-gray-500">...</span>
                  }

                  if (!showPage) return null

                  return (
                    <button
                      key={page}
                      onClick={() => fetchArtworks(page)}
                      className={`px-4 py-2 rounded-md ${
                        page === pagination.current_page
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}
              </div>

              <button
                onClick={() => fetchArtworks(pagination.current_page + 1)}
                disabled={pagination.current_page === pagination.last_page}
                className="px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Następna
              </button>
            </div>
          )}

          {/* Page info */}
          {!loading && artworks.length > 0 && (
            <div className="mt-4 text-center text-sm text-gray-600">
              Pokazywanie {((pagination.current_page - 1) * 20) + 1} - {Math.min(pagination.current_page * 20, pagination.total)} z {pagination.total} dzieł
            </div>
          )}
        </div>
      </div>
    </>
  )
}