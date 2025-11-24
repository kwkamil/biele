<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Potwierdź swoje zapytanie</title>
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
            background-color: #2563eb;
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
            background-color: #2563eb;
            color: white;
            text-decoration: none;
            padding: 15px 30px;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
        }
        .button:hover {
            background-color: #1d4ed8;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 20px 40px;
            text-align: center;
            font-size: 14px;
            color: #6b7280;
        }
        .artwork-list {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 6px;
            margin: 20px 0;
        }
        .artwork-item {
            margin-bottom: 8px;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎨 Potwierdź swoje zapytanie</h1>
        </div>

        <div class="content">
            <h2>Dzień dobry {{ $inquiry->first_name }},</h2>

            <p>Dziękujemy za zainteresowanie naszymi dziełami sztuki. Aby potwierdzić swoje zapytanie, prosimy o kliknięcie poniższego linku:</p>

            <div style="text-align: center;">
                <a href="{{ $verificationUrl }}" class="button">Potwierdź zapytanie</a>
            </div>

            <div class="artwork-list">
                <h3>Wybrane dzieła:</h3>
                @php
                    $artworks = \App\Models\Artwork::whereIn('id', $inquiry->artwork_ids)->with(['artist'])->get();
                @endphp
                @foreach($artworks as $artwork)
                    <div class="artwork-item">
                        • <strong>{{ $artwork->title }}</strong> - {{ $artwork->artist->name }}
                    </div>
                @endforeach
            </div>

            <p><strong>Twoje dane:</strong></p>
            <ul>
                <li>Imię i nazwisko: {{ $inquiry->full_name }}</li>
                <li>Email: {{ $inquiry->email }}</li>
                @if($inquiry->company)
                    <li>Firma: {{ $inquiry->company }}</li>
                @endif
            </ul>

            @if($inquiry->message)
                <p><strong>Twoja wiadomość:</strong></p>
                <p style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; font-style: italic;">
                    {{ $inquiry->message }}
                </p>
            @endif

            <p><strong>Ważne:</strong> Link weryfikacyjny jest ważny przez 24 godziny. Po potwierdzeniu, galeria otrzyma automatyczne powiadomienie o Twoim zapytaniu.</p>

            <p>Jeśli nie wysyłałeś tego zapytania, możesz zignorować tę wiadomość.</p>
        </div>

        <div class="footer">
            <p>© {{ date('Y') }} Katalog Dzieł Sztuki</p>
            <p>Ta wiadomość została wysłana automatycznie, nie odpowiadaj na nią.</p>
        </div>
    </div>
</body>
</html>