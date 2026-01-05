import { BaseBlock } from '../core/BaseBlock';

export class ButtonBlock extends BaseBlock {
  getDefaultData() {
    return {
      style: {
        padding: { top: 16, right: 0, bottom: 16, left: 0 },
        textAlign: 'center'
      },
      props: {
        text: 'Click here',
        link: 'https://example.com',
        backgroundColor: '#007bff',
        textColor: '#FFFFFF',
        borderRadius: 4,
        padding: 12
      }
    };
  }

  render() {
    const blockId = this.data.blockId || '';
    const props = this.data.props || {};
    const style = this.data.style || {};
    const isPreview = blockId && blockId !== 'root';
    
    const buttonStyle = `
      display: inline-block;
      padding: ${props.padding || 12}px ${(props.padding || 12) * 2}px;
      background-color: ${props.backgroundColor || '#007bff'};
      color: ${props.textColor || '#FFFFFF'};
      text-decoration: none;
      border-radius: ${props.borderRadius || 4}px;
      font-weight: bold;
    `;
    
    const wrapperStyle = this.getStyleString();
    
    const buttonHtml = `<div class="block-button" style="${wrapperStyle}">
      <a href="${props.link || '#'}" style="${buttonStyle}" target="_blank">${props.text || ''}</a>
    </div>`;
    
    if (isPreview) {
      return `
        <div class="block-wrapper" data-block-id="${blockId}">
          <div class="block-controls">
            <button class="block-move-up">↑</button>
            <button class="block-move-down">↓</button>
            <button class="block-delete">×</button>
          </div>
          ${buttonHtml}
        </div>
      `;
    } else {
      return buttonHtml;
    }
  }

  static getSidebarHTML(data) {
    return `
      <div class="sidebar-section">
        <label>Button text:</label>
        <input type="text" data-field="props.text" value="${data.props?.text || ''}">
      </div>
      <div class="sidebar-section">
        <label>Link URL:</label>
        <input type="text" data-field="props.link" value="${data.props?.link || ''}" placeholder="https://...">
      </div>
      <div class="sidebar-section">
        <label>Background color:</label>
        <input type="color" data-field="props.backgroundColor" value="${data.props?.backgroundColor || '#007bff'}">
      </div>
      <div class="sidebar-section">
        <label>Text color:</label>
        <input type="color" data-field="props.textColor" value="${data.props?.textColor || '#FFFFFF'}">
      </div>
      <div class="sidebar-section">
        <label>Padding (px):</label>
        <input type="number" data-field="props.padding" value="${data.props?.padding || 12}">
      </div>
      <div class="sidebar-section">
        <label>Border radius (px):</label>
        <input type="number" data-field="props.borderRadius" value="${data.props?.borderRadius || 4}">
      </div>
      <div class="sidebar-section">
        <label>Text alignment:</label>
        <select data-field="style.textAlign">
          <option value="left" ${data.style?.textAlign === 'left' ? 'selected' : ''}>Left</option>
          <option value="center" ${data.style?.textAlign === 'center' ? 'selected' : ''}>Center</option>
          <option value="right" ${data.style?.textAlign === 'right' ? 'selected' : ''}>Right</option>
        </select>
      </div>
    `;
  }
}

