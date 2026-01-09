export class DragAndDropHandler {
  constructor(emailBuilder) {
    this.emailBuilder = emailBuilder;
    this.container = emailBuilder.container;
  }

  attach() {
    const self = this.emailBuilder;
    const $preview = $('#email-preview');

    // Make content blocks draggable (only attach once)
    $(this.container).find('.content-block-item').off('dragstart dragend').each(function() {
      const $block = $(this);
      
      $block.on('dragstart', function(e) {
        const blockType = $block.data('block-type');
        self.draggedBlockType = blockType;
        $block.addClass('dragging');
        e.originalEvent.dataTransfer.effectAllowed = 'copy';
        e.originalEvent.dataTransfer.setData('text/html', blockType);
      });

      $block.on('dragend', function() {
        $block.removeClass('dragging');
        self.draggedBlockType = null;
      });
    });

    // Make preview area a drop zone
    $preview.off('dragover drop dragleave').on('dragover', function(e) {
      e.preventDefault();
      e.stopPropagation();
      $(this).addClass('drag-over');
      e.originalEvent.dataTransfer.dropEffect = 'copy';
    });

    $preview.on('dragleave', function(e) {
      $(this).removeClass('drag-over');
    });

    $preview.on('drop', function(e) {
      e.preventDefault();
      e.stopPropagation();
      $(this).removeClass('drag-over');

      // If the drop occurred inside .container-children or .column-children,
      // leave the handling to the delegated handler
      const $target = $(e.target);
      if ($target.closest('.container-children').length || $target.closest('.column-children').length) {
        return;
      }
      
      if (self.draggedBlockType) {
        self.addBlock(self.draggedBlockType);
        self.draggedBlockType = null;
      }
    });

    // Make container children areas drop zones
    this.attachContainerDropZones();
    
    // Make column children areas drop zones
    this.attachColumnDropZones();
  }

  attachContainerDropZones() {
    const self = this.emailBuilder;
    const $preview = $('#email-preview');

    // Handle drop zones inside containers - use event delegation on preview
    // This ensures it works even after re-renders
    $preview.off('dragover', '.container-children').on('dragover', '.container-children', function(e) {
      // Only handle if we're dragging a new block type (not reordering existing blocks)
      if (!self.draggedBlockType) {
        return;
      }
      
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      $(this).addClass('container-drop-zone');
      e.originalEvent.dataTransfer.dropEffect = 'copy';
      return false;
    });

    $preview.off('dragenter', '.container-children').on('dragenter', '.container-children', function(e) {
      e.preventDefault();
      e.stopPropagation();
      $(this).addClass('container-drop-zone');
    });

    $preview.off('dragleave', '.container-children').on('dragleave', '.container-children', function(e) {
      // Only remove class if we're actually leaving the element
      const rect = this.getBoundingClientRect();
      const x = e.originalEvent.clientX;
      const y = e.originalEvent.clientY;
      if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
        $(this).removeClass('container-drop-zone');
      }
    });

    $preview.off('drop', '.container-children').on('drop', '.container-children', function(e) {
      console.log('Drop event on container-children, draggedBlockType:', self.draggedBlockType);
      
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      $(this).removeClass('container-drop-zone');
      
      if (self.draggedBlockType) {
        const $containerChildren = $(this);
        let containerId = $containerChildren.data('container-id');
        
        // Fallback: try to find container-id from parent block-wrapper
        if (!containerId) {
          const $parentWrapper = $containerChildren.closest('.block-wrapper[data-block-id]');
          if ($parentWrapper.length) {
            containerId = $parentWrapper.data('block-id');
          }
        }
        
        console.log('Dropping into container:', containerId, 'block type:', self.draggedBlockType);
        if (containerId && containerId !== self.options.rootBlockId) {
          self.addBlock(self.draggedBlockType, {}, containerId);
        } else {
          console.warn('No valid container-id found, adding to root');
          self.addBlock(self.draggedBlockType);
        }
        self.draggedBlockType = null;
      } else {
        console.warn('No draggedBlockType set, cannot add block');
      }
      return false;
    });
  }

  attachColumnDropZones() {
    const self = this.emailBuilder;
    const $preview = $('#email-preview');

    // Handle drop zones inside columns - use event delegation on preview
    $preview.off('dragover', '.column-children').on('dragover', '.column-children', function(e) {
      // Only handle if we're dragging a new block type (not reordering existing blocks)
      if (!self.draggedBlockType) {
        return;
      }
      
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      $(this).addClass('column-drop-zone');
      e.originalEvent.dataTransfer.dropEffect = 'copy';
      return false;
    });

    $preview.off('dragenter', '.column-children').on('dragenter', '.column-children', function(e) {
      e.preventDefault();
      e.stopPropagation();
      $(this).addClass('column-drop-zone');
    });

    $preview.off('dragleave', '.column-children').on('dragleave', '.column-children', function(e) {
      // Only remove class if we're actually leaving the element
      const rect = this.getBoundingClientRect();
      const x = e.originalEvent.clientX;
      const y = e.originalEvent.clientY;
      if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
        $(this).removeClass('column-drop-zone');
      }
    });

    $preview.off('drop', '.column-children').on('drop', '.column-children', function(e) {
      console.log('Drop event on column-children, draggedBlockType:', self.draggedBlockType);
      
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      $(this).removeClass('column-drop-zone');
      
      if (self.draggedBlockType) {
        const $columnChildren = $(this);
        const columnsBlockId = $columnChildren.data('columns-block-id');
        const columnIndex = parseInt($columnChildren.data('column-index')) || 0;
        
        console.log('Dropping into column:', columnIndex, 'of columns block:', columnsBlockId, 'block type:', self.draggedBlockType);
        
        if (columnsBlockId) {
          self.addBlockToColumn(self.draggedBlockType, columnsBlockId, columnIndex);
        } else {
          console.warn('No columns-block-id found, adding to root');
          self.addBlock(self.draggedBlockType);
        }
        self.draggedBlockType = null;
      } else {
        console.warn('No draggedBlockType set, cannot add block');
      }
      return false;
    });
  }

  attachBlockDragAndDrop() {
    const self = this.emailBuilder;
    const $preview = $('#email-preview');

    // Make existing blocks draggable for reordering
    // But skip containers - they should not be draggable, only their children
    $preview.find('[data-block-id]').each(function() {
      const $block = $(this);
      const blockId = $block.data('block-id');
      const block = self.document[blockId];
      
      // Don't make containers and columns draggable - they should accept drops instead
      if (block && (block.type === 'Container' || block.type === 'Columns')) {
        $block.attr('draggable', 'false');
        return;
      }
      
      $block.attr('draggable', 'true');
      
      $block.off('dragstart').on('dragstart', function(e) {
        e.stopPropagation();
        e.originalEvent.dataTransfer.effectAllowed = 'move';
        e.originalEvent.dataTransfer.setData('text/plain', blockId);
        $block.addClass('dragging-block');
      });

      $block.off('dragend').on('dragend', function() {
        $block.removeClass('dragging-block');
      });
    });

    // Handle drop on blocks for reordering
    // But skip if dropping into a container
    $preview.find('[data-block-id]').off('dragover drop dragleave').on('dragover', function(e) {
      // Skip if this is a container/columns or if we're over container-children/column-children
      if ($(this).find('.container-children, .column-children').length || 
          $(e.target).closest('.container-children, .column-children').length) {
        return;
      }
      
      e.preventDefault();
      e.stopPropagation();
      const blockId = $(this).data('block-id');
      const draggedId = e.originalEvent.dataTransfer.getData('text/plain');
      if (blockId && draggedId && blockId !== draggedId) {
        $(this).addClass('drop-target');
      }
    });

    $preview.find('[data-block-id]').on('dragleave', function() {
      $(this).removeClass('drop-target');
    });

    $preview.find('[data-block-id]').on('drop', function(e) {
      // Skip if dropping into a container or column
      if ($(e.target).closest('.container-children, .column-children').length) {
        return;
      }
      
      e.preventDefault();
      e.stopPropagation();
      $(this).removeClass('drop-target');
      
      const targetBlockId = $(this).data('block-id');
      const draggedBlockId = e.originalEvent.dataTransfer.getData('text/plain');
      
      if (draggedBlockId && targetBlockId && draggedBlockId !== targetBlockId) {
        self.moveBlockAfter(draggedBlockId, targetBlockId);
      }
    });
  }
}

