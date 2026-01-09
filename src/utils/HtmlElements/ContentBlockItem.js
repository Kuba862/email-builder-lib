const blockIcons = {
  'Text': '📝',
  'Heading': '📰',
  'Image': '🖼️',
  'Button': '🔘',
  'Divider': '➖',
  'Spacer': '↕️',
  'Columns': '📊',
  'Container': '📦'
};

export function createContentBlockItemHTML(type) {
  const icon = blockIcons[type] || '📦';
  return `
    <div class="content-block-item" draggable="true" data-block-type="${type}">
      <div class="block-icon">${icon}</div>
      <div class="block-label">${type}</div>
    </div>
  `;
}

export { blockIcons };

