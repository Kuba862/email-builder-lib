import { BaseBlock } from '../core/BaseBlock';

export class ContainerBlock extends BaseBlock {
  getDefaultData() {
    return {
      style: {
        padding: { top: 16, right: 24, bottom: 16, left: 24 },
        backgroundColor: '#FFFFFF'
      },
      props: {},
      childrenIds: []
    };
  }

  render() {
    const style = this.getStyleString();
    const blockId = this.data.blockId || '';
    const isPreview = blockId && blockId !== 'root';
    
    if (isPreview) {
      return `<div class="block-container" data-block-id="${blockId}" style="${style}">{{children}}</div>`;
    } else {
      return `<div class="block-container" style="${style}">{{children}}</div>`;
    }
  }

  static getSidebarHTML(data) {
    return `
      <div class="sidebar-section">
        <label>Padding Top:</label>
        <input type="number" data-field="style.padding.top" data-type="object" value="${data.style?.padding?.top || 16}">
      </div>
      <div class="sidebar-section">
        <label>Padding Right:</label>
        <input type="number" data-field="style.padding.right" data-type="object" value="${data.style?.padding?.right || 24}">
      </div>
      <div class="sidebar-section">
        <label>Padding Bottom:</label>
        <input type="number" data-field="style.padding.bottom" data-type="object" value="${data.style?.padding?.bottom || 16}">
      </div>
      <div class="sidebar-section">
        <label>Padding Left:</label>
        <input type="number" data-field="style.padding.left" data-type="object" value="${data.style?.padding?.left || 24}">
      </div>
      <div class="sidebar-section">
        <label>Background Color:</label>
        <input type="color" data-field="style.backgroundColor" value="${data.style?.backgroundColor || '#FFFFFF'}">
      </div>
    `;
  }
}

