import { Head } from '@inertiajs/react'

interface Props {
  error: string
}

export default function InquiryVerificationError({ error }: Props) {
  return (
    <>
      <Head title="Błąd weryfikacji" />

      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="text-red-600 text-8xl mb-8">⚠️</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Błąd weryfikacji
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              {error}
            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Co możesz zrobić?</h2>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="text-blue-600 text-xl">1️⃣</div>
                </div>
                <div className="ml-3">
                  <p className="text-gray-700">
                    <strong>Sprawdź swoją pocztę</strong> - być może link weryfikacyjny jeszcze nie dotarł
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="text-blue-600 text-xl">2️⃣</div>
                </div>
                <div className="ml-3">
                  <p className="text-gray-700">
                    <strong>Sprawdź folder SPAM</strong> - czasami automatyczne wiadomości trafiają do spamu
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="text-blue-600 text-xl">3️⃣</div>
                </div>
                <div className="ml-3">
                  <p className="text-gray-700">
                    <strong>Wyślij nowe zapytanie</strong> - jeśli link wygasł (24h), wyślij nowe zapytanie
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-yellow-900 mb-2">
              💡 Wskazówka
            </h3>
            <p className="text-yellow-800">
              Linki weryfikacyjne są ważne przez 24 godziny ze względów bezpieczeństwa.
              Po tym czasie musisz wysłać nowe zapytanie.
            </p>
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
              Wyślij nowe zapytanie
            </a>
          </div>
        </div>
      </div>
    </>
  )
}