import { BlockRegistry } from '../../core/BlockRegistry';

export class PreviewRenderer {
  constructor(rootBlockId) {
    this.rootBlockId = rootBlockId;
  }

  renderPreviewBlocks(document, blockId) {
    const block = document[blockId];
    if (!block) return '';

    const BlockClass = BlockRegistry.get(block.type);
    if (!BlockClass) return '';

    // Add blockId to block data
    const blockData = { ...block.data, blockId: blockId };
    const blockInstance = new BlockClass(blockData);
    let html = blockInstance.render();

    // Special handling for Columns block - render children in columns
    if (block.type === 'Columns') {
      // Ensure that props exists
      if (!block.data.props) {
        block.data.props = { columns: 2 };
      }
      
      const columns = parseInt(block.data.props.columns) || 2;
      
      // Ensure that columnChildrenIds has the correct number of columns
      if (!block.data.columnChildrenIds || block.data.columnChildrenIds.length !== columns) {
        const existingColumnChildrenIds = block.data.columnChildrenIds || [];
        block.data.columnChildrenIds = Array(columns).fill(null).map((_, i) => {
          return existingColumnChildrenIds[i] || [];
        });
      }
      
      const columnChildrenIds = block.data.columnChildrenIds || [];
      
      // Render children for each column
      for (let i = 0; i < columns; i++) {
        const columnChildren = columnChildrenIds[i] || [];
        const childrenHtml = columnChildren
          .map(childId => this.renderPreviewBlocks(document, childId))
          .join('');
        
        // If no children, show placeholder
        const placeholder = childrenHtml === '' 
          ? '<div class="column-empty-placeholder">Drag elements here</div>'
          : childrenHtml;
        
        html = html.replace(`{{column-${i}-children}}`, placeholder);
      }
    }
    // Render children if they exist (for Container and other blocks)
    else if (block.data && block.data.childrenIds && Array.isArray(block.data.childrenIds)) {
      const childrenHtml = block.data.childrenIds
        .map(childId => this.renderPreviewBlocks(document, childId))
        .join('');

      // If no children and this is a container, show placeholder
      if (childrenHtml === '' && block.type === 'Container' && blockId !== this.rootBlockId) {
        html = html.replace('{{children}}', '<div class="container-empty-placeholder">Drag elements here</div>');
      } else {
        html = html.replace('{{children}}', childrenHtml);
      }
    } else if (block.type === 'Container' && blockId !== this.rootBlockId) {
      // Handle case where childrenIds doesn't exist
      html = html.replace('{{children}}', '<div class="container-empty-placeholder">Drag elements here</div>');
    }

    return html;
  }
}

