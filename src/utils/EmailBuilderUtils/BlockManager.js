import { BlockRegistry } from '../../core/BlockRegistry';

export class BlockManager {
  constructor(emailBuilder) {
    this.emailBuilder = emailBuilder;
  }

  /**
   * Generates a unique block ID using timestamp and random string
   * @returns {string} Unique block identifier
   */
  generateBlockId() {
    return 'block-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Adds a new block to the document and renders the preview
   * @param {string} type - Block type (e.g., 'Text', 'Image', 'Button')
   * @param {object} data - Optional block data to override defaults
   * @param {string|null} parentBlockId - ID of parent block (null = root)
   */
  addBlock(type, data = {}, parentBlockId = null) {
    const blockId = this.generateBlockId();
    let parentId = parentBlockId || this.emailBuilder.options.rootBlockId;
    let parentBlock = this.emailBuilder.document[parentId];

    if (!parentBlock) {
      console.warn(`Parent block ${parentId} not found, adding to root`);
      parentId = this.emailBuilder.options.rootBlockId;
      parentBlock = this.emailBuilder.document[parentId];
    }

    this.emailBuilder.document[blockId] = {
      type: type,
      data: {
        ...BlockRegistry.get(type).getDefaultData ? BlockRegistry.get(type).getDefaultData() : {},
        ...data
      }
    };

    if (!parentBlock.data.childrenIds) {
      parentBlock.data.childrenIds = [];
    }
    parentBlock.data.childrenIds.push(blockId);

    this.emailBuilder.renderPreview();
    this.emailBuilder.selectBlock(blockId);
  }

  /**
   * Adds a new block to a specific column within a Columns block
   * @param {string} type - Block type to add
   * @param {string} columnsBlockId - ID of the Columns block
   * @param {number} columnIndex - Index of the column (0-based)
   */
  addBlockToColumn(type, columnsBlockId, columnIndex) {
    const blockId = this.generateBlockId();
    const columnsBlock = this.emailBuilder.document[columnsBlockId];

    if (!columnsBlock || columnsBlock.type !== 'Columns') {
      console.warn(`Columns block ${columnsBlockId} not found, adding to root`);
      this.addBlock(type);
      return;
    }

    // Create new block
    this.emailBuilder.document[blockId] = {
      type: type,
      data: {
        ...BlockRegistry.get(type).getDefaultData ? BlockRegistry.get(type).getDefaultData() : {}
      }
    };

    // Initialize columnChildrenIds if it doesn't exist
    if (!columnsBlock.data.columnChildrenIds) {
      const columns = columnsBlock.data.props?.columns || 2;
      columnsBlock.data.columnChildrenIds = Array(columns).fill(null).map(() => []);
    }

    // Make sure the column exists
    if (!columnsBlock.data.columnChildrenIds[columnIndex]) {
      columnsBlock.data.columnChildrenIds[columnIndex] = [];
    }

    // Add block to the appropriate column
    columnsBlock.data.columnChildrenIds[columnIndex].push(blockId);

    this.emailBuilder.renderPreview();
    this.emailBuilder.selectBlock(blockId);
  }

  /**
   * Selects a block, updates the sidebar with editing options, and highlights it visually
   * @param {string} blockId - ID of the block to select
   */
  selectBlock(blockId) {
    this.emailBuilder.selectedBlockId = blockId;
    const block = this.emailBuilder.document[blockId];
    if (!block) return;

    const BlockClass = BlockRegistry.get(block.type);
    if (!BlockClass) return;

    this.emailBuilder.renderSidebar(blockId, block);
    
    // Visual selection
    $('#email-preview').find('[data-block-id]').removeClass('selected');
    $('#email-preview').find(`[data-block-id="${blockId}"]`).addClass('selected');
  }

  /**
   * Deletes a block from the document after user confirmation
   * Removes the block from all parent containers and columns
   * @param {string} blockId - ID of the block to delete
   */
  deleteBlock(blockId) {
    if (confirm('Are you sure you want to delete this block?')) {
      delete this.emailBuilder.document[blockId];
      
      // Remove from childrenIds of all parents
      Object.keys(this.emailBuilder.document).forEach(key => {
        const block = this.emailBuilder.document[key];
        // Remove from normal childrenIds list
        if (block.data && block.data.childrenIds) {
          block.data.childrenIds = block.data.childrenIds.filter(id => id !== blockId);
        }
        // Remove from columnChildrenIds list
        if (block.data && block.data.columnChildrenIds) {
          block.data.columnChildrenIds.forEach(columnChildren => {
            if (Array.isArray(columnChildren)) {
              const index = columnChildren.indexOf(blockId);
              if (index !== -1) {
                columnChildren.splice(index, 1);
              }
            }
          });
        }
      });

      this.emailBuilder.selectedBlockId = null;
      $('#sidebar-content').html('<p>Select a block to edit</p>');
      if (this.emailBuilder.activeTab === 'design') {
        this.emailBuilder.switchTab('content');
      }
      this.emailBuilder.renderPreview();
    }
  }

  /**
   * Finds the parent block that contains the specified block
   * @param {string} blockId - ID of the block to find parent for
   * @returns {object|null} Object with parentId, type ('normal' or 'column'), and columnIndex if applicable
   */
  findParentBlock(blockId) {
    // Search through all blocks to find which one contains this blockId
    for (const [parentId, block] of Object.entries(this.emailBuilder.document)) {
      // Check in childrenIds (for Container and other blocks)
      if (block.data && block.data.childrenIds && Array.isArray(block.data.childrenIds)) {
        if (block.data.childrenIds.includes(blockId)) {
          return { parentId, type: 'normal' };
        }
      }
      
      // Check in columnChildrenIds (for Columns block)
      if (block.data && block.data.columnChildrenIds && Array.isArray(block.data.columnChildrenIds)) {
        for (let i = 0; i < block.data.columnChildrenIds.length; i++) {
          const columnChildren = block.data.columnChildrenIds[i] || [];
          if (columnChildren.includes(blockId)) {
            return { parentId, type: 'column', columnIndex: i };
          }
        }
      }
    }
    return null;
  }

  /**
   * Moves a block to appear after another block in the root container
   * @param {string} blockId - ID of the block to move
   * @param {string} afterBlockId - ID of the block to place it after
   */
  moveBlockAfter(blockId, afterBlockId) {
    const rootBlock = this.emailBuilder.document[this.emailBuilder.options.rootBlockId];
    const childrenIds = rootBlock.data.childrenIds || [];
    
    const fromIndex = childrenIds.indexOf(blockId);
    const toIndex = childrenIds.indexOf(afterBlockId);
    
    if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
      childrenIds.splice(fromIndex, 1);
      const newIndex = childrenIds.indexOf(afterBlockId) + 1;
      childrenIds.splice(newIndex, 0, blockId);
      this.emailBuilder.renderPreview();
    }
  }

  /**
   * Moves a block up one position in its parent container or column
   * @param {string} blockId - ID of the block to move up
   */
  moveBlockUp(blockId) {
    const parentInfo = this.findParentBlock(blockId);
    if (!parentInfo) {
      parentInfo = { parentId: this.emailBuilder.options.rootBlockId, type: 'normal' };
    }
    
    const parentBlock = this.emailBuilder.document[parentInfo.parentId];
    if (!parentBlock) return;
    
    if (parentInfo.type === 'column') {
      // Move within column
      const columnChildren = parentBlock.data.columnChildrenIds[parentInfo.columnIndex] || [];
      const index = columnChildren.indexOf(blockId);
      
      if (index > 0) {
        [columnChildren[index - 1], columnChildren[index]] = [columnChildren[index], columnChildren[index - 1]];
        this.emailBuilder.renderPreview();
      }
    } else {
      // Move in normal childrenIds
      const childrenIds = parentBlock.data.childrenIds || [];
      const index = childrenIds.indexOf(blockId);
      
      if (index > 0) {
        [childrenIds[index - 1], childrenIds[index]] = [childrenIds[index], childrenIds[index - 1]];
        this.emailBuilder.renderPreview();
      }
    }
  }

  /**
   * Moves a block down one position in its parent container or column
   * @param {string} blockId - ID of the block to move down
   */
  moveBlockDown(blockId) {
    const parentInfo = this.findParentBlock(blockId);
    if (!parentInfo) {
      parentInfo = { parentId: this.emailBuilder.options.rootBlockId, type: 'normal' };
    }
    
    const parentBlock = this.emailBuilder.document[parentInfo.parentId];
    if (!parentBlock) return;
    
    if (parentInfo.type === 'column') {
      // Move within column
      const columnChildren = parentBlock.data.columnChildrenIds[parentInfo.columnIndex] || [];
      const index = columnChildren.indexOf(blockId);
      
      if (index < columnChildren.length - 1) {
        [columnChildren[index], columnChildren[index + 1]] = [columnChildren[index + 1], columnChildren[index]];
        this.emailBuilder.renderPreview();
      }
    } else {
      // Move in normal childrenIds
      const childrenIds = parentBlock.data.childrenIds || [];
      const index = childrenIds.indexOf(blockId);
      
      if (index < childrenIds.length - 1) {
        [childrenIds[index], childrenIds[index + 1]] = [childrenIds[index + 1], childrenIds[index]];
        this.emailBuilder.renderPreview();
      }
    }
  }
}

