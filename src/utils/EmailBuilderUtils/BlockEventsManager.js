export class BlockEventsManager {
  constructor(emailBuilder) {
    this.emailBuilder = emailBuilder;
  }

  attachBlockEvents() {
    const self = this.emailBuilder;
    const $preview = $('#email-preview');

    // Click on a block to select it
    $preview.find('[data-block-id]').off('click').on('click', function(e) {
      e.stopPropagation();
      const blockId = $(this).data('block-id');
      self.selectBlock(blockId);
    });

    // Delete button to delete the block
    $preview.find('.block-delete').off('click').on('click', function(e) {
      e.stopPropagation();
      const blockId = $(this).closest('[data-block-id]').data('block-id');
      self.deleteBlock(blockId);
    });

    // Move up button to move the block up
    $preview.find('.block-move-up').off('click').on('click', function(e) {
      e.stopPropagation();
      const blockId = $(this).closest('[data-block-id]').data('block-id');
      self.moveBlockUp(blockId);
    });

    $preview.find('.block-move-down').off('click').on('click', function(e) {
      e.stopPropagation();
      const blockId = $(this).closest('[data-block-id]').data('block-id');
      self.moveBlockDown(blockId);
    });

    // Re-attach drag and drop for blocks
    this.emailBuilder.dragAndDropHandler.attachBlockDragAndDrop();
    
    // Re-attach container drop zones after render
    this.emailBuilder.dragAndDropHandler.attachContainerDropZones();
    
    // Re-attach column drop zones after render
    this.emailBuilder.dragAndDropHandler.attachColumnDropZones();
  }
}

