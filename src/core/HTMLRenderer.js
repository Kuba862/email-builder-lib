import { BlockRegistry } from './BlockRegistry';

export class HTMLRenderer {
  static render(document, rootBlockId = 'root') {
    if (!document || !document[rootBlockId]) {
      throw new Error('Invalid document structure');
    }

    const rootBlock = document[rootBlockId];
    // Do not pass blockId - this is final rendering without controls
    return this.renderBlock(rootBlock, document);
  }

  static renderBlock(block, document, blockId = null) {
    const BlockClass = BlockRegistry.get(block.type);
    if (!BlockClass) {
      console.warn(`Block type "${block.type}" not found, skipping`);
      return '';
    }

    // Do not pass blockId for final HTML rendering (only for preview)
    const blockData = { ...block.data };
    // blockId is not passed, so blocks will not render controls

    const blockInstance = new BlockClass(blockData);
    let html = blockInstance.render();

    // Render children if they exist
    if (block.data && block.data.childrenIds && Array.isArray(block.data.childrenIds)) {
      const childrenHtml = block.data.childrenIds
        .map(childId => {
          const childBlock = document[childId];
          if (childBlock) {
            // Do not pass blockId - this is final rendering
            return this.renderBlock(childBlock, document);
          }
          return '';
        })
        .join('');

      // Insert children into HTML block
      html = html.replace('{{children}}', childrenHtml);
    }

    return html;
  }

  static renderToStaticMarkup(document, options = {}) {
    const rootBlockId = options.rootBlockId || 'root';
    const rootBlock = document[rootBlockId];

    if (!rootBlock) {
      throw new Error(`Root block "${rootBlockId}" not found`);
    }

    // Get styles from root block if they exist
    const styles = this.getStyles(rootBlock.data || {});

    const body = this.render(document, rootBlockId);

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Template</title>
  <style>
    ${styles}
    body {
      margin: 0;
      padding: 0;
      font-family: ${rootBlock.data?.fontFamily || 'Arial, sans-serif'};
      background-color: ${rootBlock.data?.backdropColor || '#F8F8F8'};
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: ${rootBlock.data?.canvasColor || '#FFFFFF'};
    }
  </style>
</head>
<body>
  <div class="email-container">
    ${body}
  </div>
</body>
</html>`;
  }

  static getStyles(data) {
    // Basic styles for emails
    return `
    * {
      box-sizing: border-box;
    }
    table {
      border-collapse: collapse;
      width: 100%;
    }
    img {
      max-width: 100%;
      height: auto;
      display: block;
    }
    a {
      text-decoration: none;
    }
    `;
  }
}

