import { BlockRegistry } from '../../core/BlockRegistry';

export class PreviewRenderer {
  constructor(rootBlockId) {
    this.rootBlockId = rootBlockId;
  }

  renderPreviewBlocks(document, blockId) {
    console.log('PreviewRenderer.renderPreviewBlocks called with blockId:', blockId);
    const block = document[blockId];
    if (!block) {
      console.warn('Block not found for blockId:', blockId);
      return '';
    }
    
    console.log('Block found:', { 
      type: block.type, 
      data: block.data,
      childrenIds: block.data?.childrenIds,
      childrenCount: block.data?.childrenIds?.length || 0
    });

    const BlockClass = BlockRegistry.get(block.type);
    if (!BlockClass) {
      console.warn('BlockClass not found for type:', block.type);
      return '';
    }

    // Add blockId to block data
    const blockData = { ...block.data, blockId: blockId };
    const blockInstance = new BlockClass(blockData);
    let html = blockInstance.render();
    console.log('Block rendered HTML length:', html ? html.length : 0);

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
      console.log(`Rendering ${block.data.childrenIds.length} children for block ${blockId}`);
      const childrenHtml = block.data.childrenIds
        .map(childId => {
          console.log(`Rendering child block: ${childId}`);
          return this.renderPreviewBlocks(document, childId);
        })
        .join('');

      console.log(`Children HTML length: ${childrenHtml.length}`);

      // If no children, show placeholder for Container blocks
      if (block.data.childrenIds.length === 0 || childrenHtml === '') {
        if (block.type === 'Container') {
          if (blockId === this.rootBlockId) {
            // Root container placeholder
            html = html.replace('{{children}}', '<div class="container-empty-placeholder" style="padding: 20px; text-align: center; color: #999;">No content blocks yet. Drag blocks from the sidebar to add content.</div>');
          } else {
            // Regular container placeholder
            html = html.replace('{{children}}', '<div class="container-empty-placeholder">Drag elements here</div>');
          }
        } else {
          // For non-container blocks, just use empty string
          html = html.replace('{{children}}', childrenHtml);
        }
      } else {
        html = html.replace('{{children}}', childrenHtml);
      }
    } else if (block.type === 'Container') {
      // Handle case where childrenIds doesn't exist
      if (blockId === this.rootBlockId) {
        html = html.replace('{{children}}', '<div class="container-empty-placeholder" style="padding: 20px; text-align: center; color: #999;">No content blocks yet. Drag blocks from the sidebar to add content.</div>');
      } else {
        html = html.replace('{{children}}', '<div class="container-empty-placeholder">Drag elements here</div>');
      }
    }

    console.log(`Final HTML length for block ${blockId}: ${html.length}`);
    return html;
  }
}

