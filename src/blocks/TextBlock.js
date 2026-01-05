import { BaseBlock } from '../core/BaseBlock';

export class TextBlock extends BaseBlock {
  getDefaultData() {
    return {
      style: {
        padding: { top: 8, right: 0, bottom: 8, left: 0 },
        fontSize: 14,
        color: '#242424',
        textAlign: 'left'
      },
      props: {
        text: 'Enter your text here...'
      }
    };
  }

  render() {
    const style = this.getStyleString();
    const blockId = this.data.blockId || '';
    const isPreview = blockId && blockId !== 'root';
    
    if (isPreview) {
      return `
        <div class="block-wrapper" data-block-id="${blockId}">
          <div class="block-controls">
            <button class="block-move-up">↑</button>
            <button class="block-move-down">↓</button>
            <button class="block-delete">×</button>
          </div>
          <p class="block-text" style="${style}">${this.data.props?.text || ''}</p>
        </div>
      `;
    } else {
      return `<p class="block-text" style="${style}">${this.data.props?.text || ''}</p>`;
    }
  }

  static getSidebarHTML(data) {
    return `
      <div class="sidebar-section">
        <label>Text:</label>
        <textarea data-field="props.text" rows="4">${data.props?.text || ''}</textarea>
      </div>
      <div class="sidebar-section">
        <label>Font size:</label>
        <input type="number" data-field="style.fontSize" value="${data.style?.fontSize || 14}">
      </div>
      <div class="sidebar-section">
        <label>Text color:</label>
        <input type="color" data-field="style.color" value="${data.style?.color || '#242424'}">
      </div>
      <div class="sidebar-section">
        <label>Text alignment:</label>
        <select data-field="style.textAlign">
          <option value="left" ${data.style?.textAlign === 'left' ? 'selected' : ''}>Left</option>
          <option value="center" ${data.style?.textAlign === 'center' ? 'selected' : ''}>Center</option>
          <option value="right" ${data.style?.textAlign === 'right' ? 'selected' : ''}>Right</option>
        </select>
      </div>
      <div class="sidebar-section">
        <label>Padding top (px):</label>
        <input type="number" data-field="style.padding.top" data-type="object" value="${data.style?.padding?.top || 8}">
      </div>
      <div class="sidebar-section">
        <label>Padding bottom (px):</label>
        <input type="number" data-field="style.padding.bottom" data-type="object" value="${data.style?.padding?.bottom || 8}">
      </div>
    `;
  }
}

