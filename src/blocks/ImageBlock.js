import { BaseBlock } from '../core/BaseBlock';

export class ImageBlock extends BaseBlock {
  getDefaultData() {
    return {
      style: {
        padding: { top: 8, right: 0, bottom: 8, left: 0 },
        textAlign: 'left'
      },
      props: {
        src: 'https://via.placeholder.com/600x300',
        alt: 'Image',
        width: '100%',
        link: ''
      }
    };
  }

  render() {
    const style = this.getStyleString();
    const blockId = this.data.blockId || '';
    const props = this.data.props || {};
    const isPreview = blockId && blockId !== 'root';
    
    let imgTag = `<img src="${props.src || ''}" alt="${props.alt || ''}" style="width: ${props.width || '100%'}; max-width: 100%; height: auto; display: block;" />`;
    
    if (props.link) {
      imgTag = `<a href="${props.link}" target="_blank">${imgTag}</a>`;
    }
    
    if (isPreview) {
      return `
        <div class="block-wrapper" data-block-id="${blockId}">
          <div class="block-controls">
            <button class="block-move-up">↑</button>
            <button class="block-move-down">↓</button>
            <button class="block-delete">×</button>
          </div>
          <div class="block-image" style="${style}">${imgTag}</div>
        </div>
      `;
    } else {
      return `<div class="block-image" style="${style}">${imgTag}</div>`;
    }
  }

  static getSidebarHTML(data) {
    return `
      <div class="sidebar-section">
        <label>Image URL:</label>
        <input type="text" data-field="props.src" value="${data.props?.src || ''}" placeholder="https://...">
      </div>
      <div class="sidebar-section">
        <label>Alternative text:</label>
        <input type="text" data-field="props.alt" value="${data.props?.alt || ''}">
      </div>
      <div class="sidebar-section">
        <label>Width:</label>
        <input type="text" data-field="props.width" value="${data.props?.width || '100%'}" placeholder="100% lub 300px">
      </div>
      <div class="sidebar-section">
        <label>Link (optional):</label>
        <input type="text" data-field="props.link" value="${data.props?.link || ''}" placeholder="https://...">
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

