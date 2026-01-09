import { BlockRegistry } from '../../core/BlockRegistry';

export class SidebarManager {
  constructor(emailBuilder) {
    this.emailBuilder = emailBuilder;
  }

  renderSidebar(blockId, block) {
    const BlockClass = BlockRegistry.get(block.type);
    const $sidebar = $('#sidebar-content');
    
    let html = `<h3>Edit: ${block.type}</h3>`;
    html += BlockClass.getSidebarHTML ? BlockClass.getSidebarHTML(block.data) : '<p>No editing options available</p>';
    
    $sidebar.html(html);
    
    // Switch to design tab if not already
    if (this.emailBuilder.activeTab !== 'design') {
      this.emailBuilder.switchTab('design');
    }
    
    // Attach events
    this.attachSidebarEvents(blockId);
  }

  attachSidebarEvents(blockId) {
    const self = this.emailBuilder;
    const $sidebar = $('#sidebar-content');
    const block = this.emailBuilder.document[blockId];

    // All inputs and textarea
    $sidebar.find('input, textarea, select').on('change input', function() {
      const $field = $(this);
      const fieldName = $field.data('field');
      const fieldType = $field.data('type') || 'string';
      
      let value = $field.val();
      
      if (fieldType === 'number') {
        value = parseInt(value) || parseFloat(value) || 0;
      } else if (fieldType === 'boolean') {
        value = $field.is(':checked');
      } else if (fieldType === 'object') {
        // For styles and other objects
        const path = fieldName.split('.');
        if (path.length === 2) {
          if (!self.document[blockId].data[path[0]]) {
            self.document[blockId].data[path[0]] = {};
          }
          self.document[blockId].data[path[0]][path[1]] = value;
        }
      } else {
        if (fieldName.includes('.')) {
          const path = fieldName.split('.');
          if (path.length === 2) {
            if (!self.document[blockId].data[path[0]]) {
              self.document[blockId].data[path[0]] = {};
            }
            self.document[blockId].data[path[0]][path[1]] = value;
          }
        } else {
          self.document[blockId].data[fieldName] = value;
        }
      }

      // Special handling for Columns block - when columns count changes, update columnChildrenIds
      if (block && block.type === 'Columns' && fieldName === 'props.columns') {
        // Ensure that props exists
        if (!block.data.props) {
          block.data.props = {};
        }
        
        // Ensure that value is saved as a number in props
        block.data.props.columns = parseInt(value) || 2;
        
        const oldColumns = block.data.columnChildrenIds?.length || block.data.props.columns || 2;
        const newColumns = block.data.props.columns;
        
        if (!block.data.columnChildrenIds) {
          block.data.columnChildrenIds = Array(oldColumns).fill(null).map(() => []);
        }
        
        // Adjust columnChildrenIds array size to match new number of columns
        if (newColumns > oldColumns) {
          // Add new empty columns
          for (let i = oldColumns; i < newColumns; i++) {
            block.data.columnChildrenIds.push([]);
          }
        } else if (newColumns < oldColumns) {
          // Remove excess columns (keep children in the remaining columns)
          block.data.columnChildrenIds = block.data.columnChildrenIds.slice(0, newColumns);
        }
        
        // Update columnWidths to match the new number of columns
        block.data.props.columnWidths = Array(newColumns).fill(null).map(() => `${100 / newColumns}%`);
      }

      self.renderPreview();
    });
  }
}

