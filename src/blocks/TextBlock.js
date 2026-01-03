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
        text: 'Wpisz swój tekst tutaj...'
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
        <label>Tekst:</label>
        <textarea data-field="props.text" rows="4">${data.props?.text || ''}</textarea>
      </div>
      <div class="sidebar-section">
        <label>Rozmiar czcionki:</label>
        <input type="number" data-field="style.fontSize" value="${data.style?.fontSize || 14}">
      </div>
      <div class="sidebar-section">
        <label>Kolor tekstu:</label>
        <input type="color" data-field="style.color" value="${data.style?.color || '#242424'}">
      </div>
      <div class="sidebar-section">
        <label>Wyrównanie:</label>
        <select data-field="style.textAlign">
          <option value="left" ${data.style?.textAlign === 'left' ? 'selected' : ''}>Lewo</option>
          <option value="center" ${data.style?.textAlign === 'center' ? 'selected' : ''}>Środek</option>
          <option value="right" ${data.style?.textAlign === 'right' ? 'selected' : ''}>Prawo</option>
        </select>
      </div>
      <div class="sidebar-section">
        <label>Padding Top:</label>
        <input type="number" data-field="style.padding.top" data-type="object" value="${data.style?.padding?.top || 8}">
      </div>
      <div class="sidebar-section">
        <label>Padding Bottom:</label>
        <input type="number" data-field="style.padding.bottom" data-type="object" value="${data.style?.padding?.bottom || 8}">
      </div>
    `;
  }
}

