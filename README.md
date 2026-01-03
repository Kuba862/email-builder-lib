# Email Builder

A library for building email templates with a drag & drop interface, compatible with jQuery v3.

## Features

- 🎨 **Visual Editor** - Intuitive interface for building emails
- 📦 **Blocks** - Ready-to-use components: Text, Heading, Image, Button, Divider, Spacer, Columns
- 💾 **Export/Import** - Save and load templates in JSON format
- 📧 **HTML Export** - Generate ready-to-use HTML templates for emails
- 🎯 **Compatibility** - Works with jQuery v3 and existing HTML/CSS pages

## Installation

### NPM

```bash
npm install
```

### Build

```bash
# Production build (minified)
npm run build

# Development build (with watch)
npm run dev

# Development server
npm run serve
```

## Usage

### Basic Usage

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Email Builder</title>
  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
  <script src="dist/email-builder.min.js"></script>
  <link rel="stylesheet" href="dist/email-builder.min.css">
</head>
<body>
  <div id="email-builder-container"></div>

  <script>
    $(document).ready(function() {
      const builder = new EmailBuilder('#email-builder-container');
    });
  </script>
</body>
</html>
```

### API

#### Initialization

```javascript
const builder = new EmailBuilder(container, options);
```

- `container` - CSS selector or DOM element
- `options` - Configuration options:
  - `rootBlockId` - Root block ID (default: 'root')

#### Methods

```javascript
// Add a block
builder.addBlock('Text', { props: { text: 'Hello!' } });

// Get document
const document = builder.getDocument();

// Set document (import)
builder.setDocument(document);

// Export JSON (automatic download)
builder.exportJSON();

// Export HTML (automatic download)
builder.exportHTML();

// Import JSON (opens file selection dialog)
builder.importJSON();
```

### Rendering to HTML

```javascript
const { HTMLRenderer } = EmailBuilderCore;
const html = HTMLRenderer.renderToStaticMarkup(document, {
  rootBlockId: 'root'
});
```

## Available Blocks

### Text
Text block with formatting options.

### Heading
H1-H4 headings.

### Image
Images with optional link support.

### Button
Buttons with configurable colors and styles.

### Divider
Horizontal separator line.

### Spacer
Spacing block with specified height.

### Columns
Column layout (2 or 3 columns).

## Document Structure

The document is a JSON object where each key is a block ID:

```json
{
  "root": {
    "type": "Container",
    "data": {
      "backdropColor": "#F8F8F8",
      "canvasColor": "#FFFFFF",
      "textColor": "#242424",
      "fontFamily": "Arial, sans-serif",
      "childrenIds": ["block-123"]
    }
  },
  "block-123": {
    "type": "Text",
    "data": {
      "style": {
        "fontSize": 14,
        "color": "#242424"
      },
      "props": {
        "text": "Hello world!"
      }
    }
  }
}
```

## Extending

### Adding Custom Blocks

```javascript
import { BlockRegistry } from './core/BlockRegistry';
import { BaseBlock } from './core/BaseBlock';

class CustomBlock extends BaseBlock {
  getDefaultData() {
    return {
      style: {},
      props: {}
    };
  }

  render() {
    // Render implementation
    return '<div>Custom Block</div>';
  }

  static getSidebarHTML(data) {
    // HTML for edit panel
    return '<input data-field="props.text" />';
  }
}

BlockRegistry.register('Custom', CustomBlock);
```

## Compatibility

- jQuery v3.x
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive design

## License

Copyright (c) 2024. All rights reserved.

This software is proprietary and confidential. Permission to use, copy, modify, 
or distribute this software, in whole or in part, for any purpose is hereby 
prohibited without the express written permission of the copyright holder.

The software may only be used with explicit written consent from the author.

See [LICENSE](LICENSE) file for full license terms.

## Author

Created for easy email template building in jQuery-based projects.
