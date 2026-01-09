import { BaseBlock } from '../core/BaseBlock';

export class ColumnsBlock extends BaseBlock {
  getDefaultData() {
    const columns = 2; // Default number of columns
    return {
      style: {
        padding: { top: 16, right: 0, bottom: 16, left: 0 }
      },
      props: {
        columns: columns,
        columnWidths: Array(columns).fill(null).map((_, i) => `${100 / columns}%`),
        gap: 16
      },
      columnChildrenIds: Array(columns).fill(null).map(() => []) // Array of arrays - each column has its own list of children
    };
  }

  render() {
    const style = this.getStyleString();
    const blockId = this.data.blockId || '';
    const props = this.data.props || {};
    const columns = props.columns || 2;
    const columnWidths = props.columnWidths || Array(columns).fill(`${100 / columns}%`);
    const gap = props.gap || 16;
    const isPreview = blockId && blockId !== 'root';
    const columnChildrenIds = this.data.columnChildrenIds || [];
    
    // Render columns - in emails we use table
    // Gap is divided between columns: the first column has padding only on the right,
    // the last column only on the left, the middle ones have padding on both sides
    let columnsHtml = '';
    for (let i = 0; i < columns; i++) {
      const width = columnWidths[i] || `${100 / columns}%`;
      const columnId = `${blockId}-col-${i}`;
      
      // Calculate padding for each column
      let paddingLeft = 0;
      let paddingRight = 0;
      
      if (columns === 1) {
        // One column - no gap
        paddingLeft = 0;
        paddingRight = 0;
      } else if (i === 0) {
        // First column - padding only on the right
        paddingLeft = 0;
        paddingRight = gap / 2;
      } else if (i === columns - 1) {
        // Last column - padding only on the left
        paddingLeft = gap / 2;
        paddingRight = 0;
      } else {
        // Middle columns - padding on both sides
        paddingLeft = gap / 2;
        paddingRight = gap / 2;
      }
      
      columnsHtml += `
        <td style="width: ${width}; padding: 0 ${paddingRight}px 0 ${paddingLeft}px; vertical-align: top;">
          <div class="column-children" data-column-id="${columnId}" data-column-index="${i}" data-columns-block-id="${blockId}">
            {{column-${i}-children}}
          </div>
        </td>
      `;
    }
    
    const columnsHtmlContent = `<div class="block-columns" style="${style}">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          ${columnsHtml}
        </tr>
      </table>
    </div>`;
    
    if (isPreview) {
      return `
        <div class="block-wrapper" data-block-id="${blockId}">
          <div class="block-controls">
            <button class="block-move-up">↑</button>
            <button class="block-move-down">↓</button>
            <button class="block-delete">×</button>
          </div>
          ${columnsHtmlContent}
        </div>
      `;
    } else {
      return columnsHtmlContent;
    }
  }

  static getSidebarHTML(data) {
    return `
      <div class="sidebar-section">
        <label>Number of columns:</label>
        <select data-field="props.columns" data-type="number">
          <option value="2" ${data.props?.columns === 2 ? 'selected' : ''}>2</option>
          <option value="3" ${data.props?.columns === 3 ? 'selected' : ''}>3</option>
        </select>
      </div>
      <div class="sidebar-section">
        <label>Gap between columns (px):</label>
        <input type="number" data-field="props.gap" data-type="number" value="${data.props?.gap || 16}" min="0">
      </div>
    `;
  }
}

