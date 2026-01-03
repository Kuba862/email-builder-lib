import { BaseBlock } from '../core/BaseBlock';

export class ColumnsBlock extends BaseBlock {
  getDefaultData() {
    return {
      style: {
        padding: { top: 16, right: 0, bottom: 16, left: 0 }
      },
      props: {
        columns: 2,
        columnWidths: ['50%', '50%'],
        gap: 16
      },
      childrenIds: []
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
    
    // Renderuj kolumny - w emailach używamy tabeli
    let columnsHtml = '';
    for (let i = 0; i < columns; i++) {
      const width = columnWidths[i] || `${100 / columns}%`;
      columnsHtml += `
        <td style="width: ${width}; padding: 0 ${gap / 2}px; vertical-align: top;">
          <div class="column-content" data-column-index="${i}">
            <!-- Kolumna ${i + 1} -->
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
        <label>Liczba kolumn:</label>
        <select data-field="props.columns">
          <option value="2" ${data.props?.columns === 2 ? 'selected' : ''}>2</option>
          <option value="3" ${data.props?.columns === 3 ? 'selected' : ''}>3</option>
        </select>
      </div>
      <div class="sidebar-section">
        <label>Odstęp między kolumnami (px):</label>
        <input type="number" data-field="props.gap" value="${data.props?.gap || 16}" min="0">
      </div>
    `;
  }
}

