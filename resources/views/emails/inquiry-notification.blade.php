<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Nowe zapytanie o dzieła</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8f9fa;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background-color: #059669;
            color: white;
            padding: 30px 40px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .content {
            padding: 40px;
        }
        .button {
            display: inline-block;
            background-color: #059669;
            color: white;
            text-decoration: none;
            padding: 15px 30px;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
        }
        .button:hover {
            background-color: #047857;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 20px 40px;
            text-align: center;
            font-size: 14px;
            color: #6b7280;
        }
        .customer-info {
            background-color: #f0f9ff;
            padding: 20px;
            border-radius: 6px;
            margin: 20px 0;
            border-left: 4px solid #2563eb;
        }
        .artwork-list {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 6px;
            margin: 20px 0;
        }
        .artwork-item {
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 1px solid #e5e7eb;
        }
        .artwork-item:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }
        .artwork-title {
            font-weight: 600;
            font-size: 16px;
            color: #1f2937;
        }
        .artwork-details {
            font-size: 14px;
            color: #6b7280;
            margin-top: 5px;
        }
        .status-badge {
            background-color: #10b981;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            display: inline-block;
            margin-left: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📧 Nowe zapytanie o dzieła</h1>
        </div>

        <div class="content">
            <h2>Otrzymano nowe potwierdzone zapytanie <span class="status-badge">ZWERYFIKOWANE</span></h2>

            <p>Klient potwierdził swój adres email i jest zainteresowany dziełami z Twojej galerii:</p>

            <div class="customer-info">
                <h3>📋 Dane klienta:</h3>
                <ul>
                    <li><strong>Imię i nazwisko:</strong> {{ $inquiry->full_name }}</li>
                    <li><strong>Email:</strong> {{ $inquiry->email }}</li>
                    @if($inquiry->company)
                        <li><strong>Firma:</strong> {{ $inquiry->company }}</li>
                    @endif
                    <li><strong>Data zapytania:</strong> {{ $inquiry->created_at->format('d.m.Y H:i') }}</li>
                    <li><strong>Data potwierdzenia:</strong> {{ $inquiry->email_verified_at->format('d.m.Y H:i') }}</li>
                </ul>
            </div>

            @if($inquiry->message)
                <div style="background-color: #fffbeb; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                    <h3>💬 Wiadomość od klienta:</h3>
                    <p style="font-style: italic; margin: 0;">{{ $inquiry->message }}</p>
                </div>
            @endif

            <div class="artwork-list">
                <h3>🎨 Wybrane dzieła ({{ count($artworks) }}):</h3>
                @foreach($artworks as $artwork)
                    <div class="artwork-item">
                        <div class="artwork-title">{{ $artwork->title }}</div>
                        <div class="artwork-details">
                            <strong>Artysta:</strong> {{ $artwork->artist->name }} •
                            <strong>Galeria:</strong> {{ $artwork->gallery->name }}
                            @if($artwork->category)
                                • <strong>Kategoria:</strong> {{ $artwork->category }}
                            @endif
                            @if($artwork->price_min || $artwork->price_max)
                                <br><strong>Cena:</strong>
                                @if($artwork->price_min && $artwork->price_max)
                                    {{ number_format($artwork->price_min, 0, ',', ' ') }} - {{ number_format($artwork->price_max, 0, ',', ' ') }} zł
                                @elseif($artwork->price_min)
                                    od {{ number_format($artwork->price_min, 0, ',', ' ') }} zł
                                @elseif($artwork->price_max)
                                    do {{ number_format($artwork->price_max, 0, ',', ' ') }} zł
                                @endif
                            @endif
                        </div>
                    </div>
                @endforeach
            </div>

            <div style="text-align: center; margin: 30px 0;">
                <a href="{{ config('app.url') }}/admin/inquiries/{{ $inquiry->id }}/edit" class="button">
                    Zobacz szczegóły w panelu galerii
                </a>
            </div>

            <p><strong>Następne kroki:</strong></p>
            <ul>
                <li>Skontaktuj się z klientem pod adresem: <strong>{{ $inquiry->email }}</strong></li>
                <li>Odpowiedz na zapytanie w ciągu 24-48 godzin dla najlepszych wyników</li>
                <li>Możesz zarządzać zapytaniem w swoim panelu galerii</li>
            </ul>
        </div>

        <div class="footer">
            <p>© {{ date('Y') }} Katalog Dzieł Sztuki - Panel Administracyjny</p>
            <p>ID zapytania: #{{ $inquiry->id }} | Automatyczne powiadomienie</p>
        </div>
    </div>
</body>
</html>