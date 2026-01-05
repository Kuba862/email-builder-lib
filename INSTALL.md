# Installation and Build Instructions

## Requirements

- Node.js (v14 or newer)
- npm or yarn

## Installing Dependencies

```bash
npm install
```

## Building the Library

### Production Build (minified)

```bash
npm run build
```

This will generate:
- `dist/email-builder.min.js` - minified JavaScript file
- `dist/email-builder.min.css` - minified CSS file

### Development Build

```bash
npm run dev
```

This will run webpack in watch mode, which will automatically rebuild files on changes.

### Development Server

```bash
npm run serve
```

This will start webpack-dev-server on port 8080 with automatic hot reloading.

## Usage in Your Project

After building the library, copy the files from the `dist/` directory to your project:

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

## Project Structure

```
builder/
├── src/              # Source code
│   ├── blocks/       # Block definitions
│   ├── core/         # Library core
│   └── styles/       # CSS styles
├── dist/             # Built files (generated)
├── examples/         # Usage examples
├── package.json      # npm configuration
└── webpack.config.js # Build configuration
```

