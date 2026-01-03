import { BaseBlock } from '../core/BaseBlock';

export class SpacerBlock extends BaseBlock {
  getDefaultData() {
    return {
      style: {},
      props: {
        height: 20
      }
    };
  }

  render() {
    const blockId = this.data.blockId || '';
    const height = this.data.props?.height || 20;
    const isPreview = blockId && blockId !== 'root';
    
    const spacerHtml = `<div class="block-spacer" style="height: ${height}px; width: 100%;"></div>`;
    
    if (isPreview) {
      return `
        <div class="block-wrapper" data-block-id="${blockId}">
          <div class="block-controls">
            <button class="block-move-up">↑</button>
            <button class="block-move-down">↓</button>
            <button class="block-delete">×</button>
          </div>
          ${spacerHtml}
        </div>
      `;
    } else {
      return spacerHtml;
    }
  }

  static getSidebarHTML(data) {
    return `
      <div class="sidebar-section">
        <label>Wysokość (px):</label>
        <input type="number" data-field="props.height" value="${data.props?.height || 20}" min="0">
      </div>
    `;
  }
}

