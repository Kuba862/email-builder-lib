# Instrukcja instalacji i budowania

## Wymagania

- Node.js (v14 lub nowszy)
- npm lub yarn

## Instalacja zależności

```bash
npm install
```

## Budowanie biblioteki

### Build produkcyjny (minifikowany)

```bash
npm run build
```

To wygeneruje:
- `dist/email-builder.min.js` - minifikowany plik JavaScript
- `dist/email-builder.min.css` - minifikowany plik CSS

### Build deweloperski

```bash
npm run dev
```

To uruchomi webpack w trybie watch, który będzie automatycznie przebudowywał pliki przy zmianach.

### Serwer deweloperski

```bash
npm run serve
```

To uruchomi webpack-dev-server na porcie 8080 z automatycznym odświeżaniem.

## Użycie w projekcie

Po zbudowaniu biblioteki, skopiuj pliki z katalogu `dist/` do swojego projektu:

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
  <script src="dist/email-builder.min.js"></script>
  <link rel="stylesheet" href="dist/email-builder.min.css">
</head>
<body>
  <div id="email-builder"></div>
  <script>
    $(document).ready(function() {
      const builder = new EmailBuilder('#email-builder');
    });
  </script>
</body>
</html>
```

## Struktura projektu

```
builder/
├── src/              # Kod źródłowy
│   ├── blocks/       # Definicje bloków
│   ├── core/         # Rdzeń biblioteki
│   └── styles/       # Style CSS
├── dist/             # Zbudowane pliki (generowane)
├── examples/         # Przykłady użycia
├── package.json      # Konfiguracja npm
└── webpack.config.js # Konfiguracja buildowania
```

