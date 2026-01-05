import { BaseBlock } from '../core/BaseBlock';

export class HeadingBlock extends BaseBlock {
  getDefaultData() {
    return {
      style: {
        padding: { top: 16, right: 0, bottom: 16, left: 0 },
        fontSize: 24,
        fontWeight: 'bold',
        color: '#242424',
        textAlign: 'left'
      },
      props: {
        text: 'Heading',
        level: 'h1'
      }
    };
  }

  render() {
    const style = this.getStyleString();
    const blockId = this.data.blockId || '';
    const level = this.data.props?.level || 'h1';
    const text = this.data.props?.text || '';
    const isPreview = blockId && blockId !== 'root';
    
    if (isPreview) {
      return `
        <div class="block-wrapper" data-block-id="${blockId}">
          <div class="block-controls">
            <button class="block-move-up">↑</button>
            <button class="block-move-down">↓</button>
            <button class="block-delete">×</button>
          </div>
          <${level} class="block-heading" style="${style}">${text}</${level}>
        </div>
      `;
    } else {
      return `<${level} class="block-heading" style="${style}">${text}</${level}>`;
    }
  }

  static getSidebarHTML(data) {
    return `
      <div class="sidebar-section">
        <label>Text:</label>
        <input type="text" data-field="props.text" value="${data.props?.text || ''}">
      </div>
      <div class="sidebar-section">
        <label>Level:</label>
        <select data-field="props.level">
          <option value="h1" ${data.props?.level === 'h1' ? 'selected' : ''}>H1</option>
          <option value="h2" ${data.props?.level === 'h2' ? 'selected' : ''}>H2</option>
          <option value="h3" ${data.props?.level === 'h3' ? 'selected' : ''}>H3</option>
          <option value="h4" ${data.props?.level === 'h4' ? 'selected' : ''}>H4</option>
        </select>
      </div>
      <div class="sidebar-section">
        <label>Font size:</label>
        <input type="number" data-field="style.fontSize" value="${data.style?.fontSize || 24}">
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
    `;
  }
}

