import { Link, router, usePage } from '@inertiajs/react'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const { auth } = usePage().props as any
  const [savedCount, setSavedCount] = useState(0)

  useEffect(() => {
    loadSavedCount()
  }, [])

  const loadSavedCount = async () => {
    try {
      const response = await fetch('/api/saved-artworks', {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        }
      })
      const data = await response.json()
      setSavedCount(data.data.length)
    } catch (error) {
      console.error('Failed to load saved count:', error)
    }
  }

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <Link href="/catalog" className="text-3xl font-bold text-gray-900 hover:text-blue-600">
            Katalog dzieł sztuki
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/catalog"
              className="text-gray-700 hover:text-blue-600"
            >
              Katalog
            </Link>
            <Link
              href="/artists"
              className="text-gray-700 hover:text-blue-600"
            >
              Artyści
            </Link>
            <Link
              href="/galleries"
              className="text-gray-700 hover:text-blue-600"
            >
              Galerie
            </Link>
            <button
              onClick={() => router.visit('/saved')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Schowek ({savedCount})
            </button>
            {auth.user ? (
              <>
                {auth.user.role === 'admin' && (
                  <button
                    onClick={() => window.location.href = '/admin'}
                    className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900"
                  >
                    Panel admina
                  </button>
                )}
                {auth.user.role === 'gallery' && (
                  <button
                    onClick={() => window.location.href = '/gallery/dashboard'}
                    className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                  >
                    Panel galerii
                  </button>
                )}
                <Link
                  href="/logout"
                  method="post"
                  as="button"
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Wyloguj się
                </Link>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Zaloguj się
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
