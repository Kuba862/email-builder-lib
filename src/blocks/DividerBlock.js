import { BaseBlock } from '../core/BaseBlock';

export class DividerBlock extends BaseBlock {
  getDefaultData() {
    return {
      style: {
        padding: { top: 16, right: 0, bottom: 16, left: 0 }
      },
      props: {
        color: '#E0E0E0',
        height: 1,
        width: '100%'
      }
    };
  }

  render() {
    const style = this.getStyleString();
    const blockId = this.data.blockId || '';
    const props = this.data.props || {};
    const isPreview = blockId && blockId !== 'root';
    
    const dividerStyle = `
      border: none;
      border-top: ${props.height || 1}px solid ${props.color || '#E0E0E0'};
      width: ${props.width || '100%'};
      margin: 0;
    `;
    
    const dividerHtml = `<div class="block-divider" style="${style}">
      <hr style="${dividerStyle}">
    </div>`;
    
    if (isPreview) {
      return `
        <div class="block-wrapper" data-block-id="${blockId}">
          <div class="block-controls">
            <button class="block-move-up">↑</button>
            <button class="block-move-down">↓</button>
            <button class="block-delete">×</button>
          </div>
          ${dividerHtml}
        </div>
      `;
    } else {
      return dividerHtml;
    }
  }

  static getSidebarHTML(data) {
    return `
      <div class="sidebar-section">
        <label>Kolor:</label>
        <input type="color" data-field="props.color" value="${data.props?.color || '#E0E0E0'}">
      </div>
      <div class="sidebar-section">
        <label>Grubość:</label>
        <input type="number" data-field="props.height" value="${data.props?.height || 1}" min="1" max="10">
      </div>
      <div class="sidebar-section">
        <label>Szerokość:</label>
        <input type="text" data-field="props.width" value="${data.props?.width || '100%'}" placeholder="100% lub 300px">
      </div>
    `;
  }
}

