import { Head } from '@inertiajs/react'

interface Inquiry {
  id: number
  first_name: string
  last_name: string
  email: string
  company?: string
  message?: string
  status: string
  email_verified_at: string
}

interface Artwork {
  id: number
  title: string
  artist: {
    name: string
    slug: string
  }
  gallery: {
    name: string
  }
}

interface Props {
  inquiry: Inquiry
  artworks?: Artwork[]
  message: string
}

export default function InquiryVerificationSuccess({ inquiry, artworks, message }: Props) {
  return (
    <>
      <Head title="Zapytanie potwierdzone" />

      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full space-y-8">
          <div className="text-center">
            <div className="text-green-600 text-8xl mb-8">✓</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Zapytanie potwierdzone!
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              {message}
            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Szczegóły zapytania</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Dane kontaktowe</h3>
                <p className="text-gray-900">{inquiry.first_name} {inquiry.last_name}</p>
                <p className="text-gray-600">{inquiry.email}</p>
                {inquiry.company && (
                  <p className="text-gray-600">{inquiry.company}</p>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Potwierdzone
                </span>
                <p className="text-sm text-gray-500 mt-1">
                  Potwierdzone: {new Date(inquiry.email_verified_at).toLocaleString('pl-PL')}
                </p>
              </div>
            </div>

            {inquiry.message && (
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Twoja wiadomość</h3>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{inquiry.message}</p>
              </div>
            )}

            {artworks && artworks.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-4">
                  Wybrane dzieła ({artworks.length})
                </h3>
                <div className="space-y-3">
                  {artworks.map((artwork) => (
                    <div key={artwork.id} className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{artwork.title}</p>
                        <p className="text-sm text-gray-600">
                          {artwork.artist.name} • {artwork.gallery.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-2">
              Co dalej?
            </h3>
            <ul className="text-blue-800 space-y-2">
              <li>• Galeria otrzymała powiadomienie o Twoim zapytaniu</li>
              <li>• Spodziewaj się odpowiedzi w ciągu 24-48 godzin</li>
              <li>• Odpowiedź otrzymasz na adres: {inquiry.email}</li>
              <li>• Możesz kontynuować przeglądanie katalogu poniżej</li>
            </ul>
          </div>

          <div className="text-center space-y-4">
            <a
              href="/catalog"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Powrót do katalogu
            </a>
            <br />
            <a
              href="/saved"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Zobacz schowek
            </a>
          </div>
        </div>
      </div>
    </>
  )
}