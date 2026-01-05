import { BlockRegistry } from './BlockRegistry';
import { HTMLRenderer } from './HTMLRenderer';

export class EmailBuilder {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' 
      ? document.querySelector(container) 
      : container;
    
    if (!this.container) {
      throw new Error('Container element not found');
    }

    this.options = {
      rootBlockId: 'root',
      projectTitle: 'Untitled',
      emailSubject: '',
      customCSS: '',
      customHTML: null, // Edytowany HTML z settings
      lineWrapping: false,
      ...options
    };

    this.document = {
      [this.options.rootBlockId]: {
        type: 'Container',
        data: {
          backdropColor: '#F8F8F8',
          canvasColor: '#FFFFFF',
          textColor: '#242424',
          fontFamily: 'Arial, sans-serif',
          childrenIds: []
        }
      }
    };

    this.selectedBlockId = null;
    this.draggedBlockType = null;
    this.activeTab = 'content';
    this.init();
  }

  init() {
    this.render();
    this.attachEvents();
  }

  render() {
    const $container = $(this.container);
    $container.empty();

    // Main layout - Mailchimp style
    $container.html(`
      <div class="email-builder-wrapper">
        <!-- Top Header -->
        <div class="email-builder-header">
          <div class="header-left">
            <div class="logo">📧</div>
            <span class="header-title">${this.options.projectTitle || 'editor test'}</span>
          </div>
          <div class="header-right">
            <a href="#" class="header-link" id="btn-help">Help</a>
            <div class="header-dropdown">
              <a href="#" class="header-link">Preview and Test <span>▼</span></a>
            </div>
            <button class="header-btn" id="btn-editor-settings">⚙️ Settings</button>
            <button class="header-btn" id="btn-save-template">Save as Template</button>
            <button class="header-btn primary" id="btn-save-exit">Save and Exit</button>
          </div>
        </div>

        <!-- Main Content Area -->
        <div class="email-builder-content">
          <!-- Canvas (Center) -->
          <div class="email-builder-canvas">
            <div class="email-builder-preview" id="email-preview"></div>
          </div>

          <!-- Sidebar (Right) -->
          <div class="email-builder-sidebar">
            <div class="sidebar-tabs">
              <button class="sidebar-tab ${this.activeTab === 'content' ? 'active' : ''}" data-tab="content">Content</button>
              <button class="sidebar-tab ${this.activeTab === 'design' ? 'active' : ''}" data-tab="design">Design</button>
              <button class="sidebar-tab ${this.activeTab === 'comments' ? 'active' : ''}" data-tab="comments">Comments</button>
            </div>
            
            <div class="sidebar-panel" id="sidebar-content-panel">
              <div class="content-blocks-grid" id="content-blocks-grid">
                <!-- Blocks will be rendered here -->
              </div>
              <div class="sidebar-help">
                Need a refresher? <a href="#" id="btn-quick-tour">Take a quick tour.</a>
              </div>
            </div>

            <div class="sidebar-panel" id="sidebar-design-panel" style="display: none;">
              <div class="sidebar-content" id="sidebar-content">
                <p>Select a block to edit</p>
              </div>
            </div>

            <div class="sidebar-panel" id="sidebar-comments-panel" style="display: none;">
              <div class="sidebar-content">
                <p>Comments feature coming soon</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Footer -->
        <div class="email-builder-footer">
          <div class="footer-left">
            <a href="#" class="footer-link" id="btn-back">← Back</a>
          </div>
          <div class="footer-center">
            <span class="breadcrumbs">Template > Design</span>
          </div>
          <div class="footer-right">
            <button class="footer-btn primary" id="btn-save-close">Save & Close →</button>
          </div>
        </div>
      </div>

      <!-- Editor Settings Modal -->
      <div class="modal-overlay" id="editor-settings-modal" style="display: none;">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Editor Settings</h2>
            <button class="modal-close" id="btn-modal-close">×</button>
          </div>
          <div class="modal-body">
            <div class="settings-section">
              <h3>Project Settings</h3>
              <div class="form-group">
                <label>Project Title:</label>
                <input type="text" id="setting-project-title" value="${this.options.projectTitle || ''}">
              </div>
              <div class="form-group">
                <label>Email Subject:</label>
                <input type="text" id="setting-email-subject" value="${this.options.emailSubject || ''}">
              </div>
            </div>

            <div class="settings-section">
              <h3>Global Editor Settings</h3>
              <div class="form-group">
                <label>Theme:</label>
                <select id="setting-theme">
                  <option value="dreamweaver-dark">Dreamweaver (Dark)</option>
                  <option value="light">Light</option>
                  <option value="monokai">Monokai</option>
                  <option value="solarized">Solarized</option>
                </select>
              </div>
              <div class="form-group">
                <label>Custom CSS:</label>
                <textarea id="setting-custom-css" rows="15" placeholder="<!DOCTYPE html>&#10;<html>&#10;  <head>&#10;    <style type=&quot;text/css&quot;>&#10;      /* Your custom CSS here */&#10;    </style>&#10;  </head>&#10;  <body style=&quot;margin:0px; background: #f4f4f4;&quot;>&#10;    <!-- Comment about the code here! -->&#10;">${this.options.customCSS || ''}</textarea>
              </div>
              <div class="form-group">
                <label>
                  <input type="checkbox" id="setting-line-wrapping" ${this.options.lineWrapping ? 'checked' : ''}>
                  Line wrapping
                  <span class="info-icon" title="Enable line wrapping in code editor">ℹ️</span>
                </label>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="modal-btn" id="btn-modal-close-footer">Close</button>
            <button class="modal-btn primary" id="btn-modal-save">Save</button>
          </div>
        </div>
      </div>
    `);

    this.renderContentBlocks();
    this.renderPreview();
    this.attachDragAndDrop();
  }

  renderContentBlocks() {
    const $grid = $('#content-blocks-grid');
    const blockTypes = BlockRegistry.getAll();
    const blockIcons = {
      'Text': '📝',
      'Heading': '📰',
      'Image': '🖼️',
      'Button': '🔘',
      'Divider': '➖',
      'Spacer': '↕️',
      'Columns': '📊',
      'Container': '📦'
    };

    $grid.empty();
    
    blockTypes.forEach(type => {
      const icon = blockIcons[type] || '📦';
      const $block = $(`
        <div class="content-block-item" draggable="true" data-block-type="${type}">
          <div class="block-icon">${icon}</div>
          <div class="block-label">${type}</div>
        </div>
      `);
      $grid.append($block);
    });
  }

  renderPreview() {
    const $preview = $('#email-preview');
    
    // Zawsze renderuj bloki - pozwala to na edycję przez panel
    // customHTML będzie używany tylko przy eksporcie
    const html = this.renderPreviewBlocks(this.document, this.options.rootBlockId);
    $preview.html(html);
    this.attachBlockEvents();
    
    // Jeśli jest customHTML, pokaż informację że będzie użyty przy eksporcie
    if (this.options.customHTML) {
      this.showCustomHTMLNotification();
    } else {
      this.hideCustomHTMLNotification();
    }
  }

  showCustomHTMLNotification() {
    // Usuń poprzednią notyfikację jeśli istnieje
    $('#custom-html-notification').remove();
    
    // Dodaj notyfikację na górze preview
    const $preview = $('#email-preview');
    const $notification = $(`
      <div id="custom-html-notification" style="
        background: #fff3cd;
        border: 1px solid #ffc107;
        border-radius: 4px;
        padding: 12px;
        margin-bottom: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
      ">
        <span>⚠️ Zapisano custom HTML. Będzie użyty przy eksporcie. 
        <a href="#" id="clear-custom-html" style="color: #856404; text-decoration: underline; margin-left: 8px;">Wyczyść i wróć do edycji bloków</a></span>
      </div>
    `);
    $preview.prepend($notification);
    
    // Przycisk do czyszczenia customHTML
    $('#clear-custom-html').on('click', (e) => {
      e.preventDefault();
      this.options.customHTML = null;
      this.hideCustomHTMLNotification();
      // Zaktualizuj textarea w settings
      if ($('#editor-settings-modal').is(':visible')) {
        const currentHTML = HTMLRenderer.renderToStaticMarkup(this.document, {
          rootBlockId: this.options.rootBlockId
        });
        $('#setting-custom-css').val(currentHTML);
      }
    });
  }

  hideCustomHTMLNotification() {
    $('#custom-html-notification').remove();
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
      // Upewnij się, że props istnieje
      if (!block.data.props) {
        block.data.props = { columns: 2 };
      }
      
      const columns = parseInt(block.data.props.columns) || 2;
      
      // Upewnij się, że columnChildrenIds ma odpowiednią liczbę kolumn
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
          ? '<div class="column-empty-placeholder">Przeciągnij elementy tutaj</div>'
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
      if (childrenHtml === '' && block.type === 'Container' && blockId !== this.options.rootBlockId) {
        html = html.replace('{{children}}', '<div class="container-empty-placeholder">Przeciągnij elementy tutaj</div>');
      } else {
        html = html.replace('{{children}}', childrenHtml);
      }
    } else if (block.type === 'Container' && blockId !== this.options.rootBlockId) {
      // Handle case where childrenIds doesn't exist
      html = html.replace('{{children}}', '<div class="container-empty-placeholder">Przeciągnij elementy tutaj</div>');
    }

    return html;
  }

  attachEvents() {
    const self = this;

    // Sidebar tabs
    $(this.container).on('click', '.sidebar-tab', function() {
      const tab = $(this).data('tab');
      self.switchTab(tab);
    });

    // Header buttons
    $(this.container).on('click', '#btn-help', function(e) {
      e.preventDefault();
      alert('Help documentation coming soon!');
    });

    $(this.container).on('click', '#btn-save-template', function(e) {
      e.preventDefault();
      self.exportJSON();
    });

    $(this.container).on('click', '#btn-save-exit', function(e) {
      e.preventDefault();
      self.exportHTML();
      // In a real app, this would save and navigate away
    });

    // Footer buttons
    $(this.container).on('click', '#btn-back', function(e) {
      e.preventDefault();
      // In a real app, this would navigate back
      alert('Navigate back');
    });

    $(this.container).on('click', '#btn-save-close', function(e) {
      e.preventDefault();
      self.exportHTML();
      // In a real app, this would save and close
    });

    // Editor Settings modal
    $(this.container).on('click', '#btn-editor-settings', function(e) {
      e.preventDefault();
      self.openEditorSettings();
    });

    $(this.container).on('click', '#btn-modal-close, #btn-modal-close-footer', function(e) {
      e.preventDefault();
      self.closeEditorSettings();
    });

    $(this.container).on('click', '#btn-modal-save', function(e) {
      e.preventDefault();
      self.saveEditorSettings();
    });

    // Quick tour
    $(this.container).on('click', '#btn-quick-tour', function(e) {
      e.preventDefault();
      alert('Quick tour feature coming soon!');
    });
  }

  switchTab(tab) {
    this.activeTab = tab;
    
    // Update tab buttons
    $(this.container).find('.sidebar-tab').removeClass('active');
    $(this.container).find(`.sidebar-tab[data-tab="${tab}"]`).addClass('active');
    
    // Show/hide panels
    $(this.container).find('.sidebar-panel').hide();
    $(this.container).find(`#sidebar-${tab}-panel`).show();
    
    if (tab === 'design' && this.selectedBlockId) {
      const block = this.document[this.selectedBlockId];
      if (block) {
        this.renderSidebar(this.selectedBlockId, block);
      }
    }
  }

  openEditorSettings() {
    // Wygeneruj aktualny HTML szablonu i wczytaj go do pola tekstowego,
    // żeby użytkownik mógł go edytować.
    // Jeśli jest customHTML, pokaż go, w przeciwnym razie wygeneruj z bloków
    try {
      let currentHtml;
      if (this.options.customHTML) {
        currentHtml = this.options.customHTML;
      } else {
        currentHtml = HTMLRenderer.renderToStaticMarkup(this.document, {
          rootBlockId: this.options.rootBlockId
        });
      }
      $('#setting-custom-css').val(currentHtml);
    } catch (e) {
      console.error('Error generating current template HTML for editor settings:', e);
    }

    $('#editor-settings-modal').fadeIn(200);
  }

  closeEditorSettings() {
    $('#editor-settings-modal').fadeOut(200);
  }

  saveEditorSettings() {
    this.options.projectTitle = $('#setting-project-title').val();
    this.options.emailSubject = $('#setting-email-subject').val();
    const editedHTML = $('#setting-custom-css').val();
    this.options.lineWrapping = $('#setting-line-wrapping').is(':checked');
    
    // Jeśli HTML został edytowany, zapisz go jako customHTML
    if (editedHTML && editedHTML.trim()) {
      // Wyodrębnij body content z pełnego HTML
      const bodyContent = this.extractBodyContent(editedHTML);
      if (bodyContent) {
        this.options.customHTML = editedHTML;
        // Zaktualizuj preview z edytowanym HTML
        this.renderPreview();
      } else {
        // Jeśli nie udało się wyodrębnić, zapisz jako customCSS (stary sposób)
        this.options.customCSS = editedHTML;
        this.options.customHTML = null;
      }
    } else {
      this.options.customHTML = null;
      this.options.customCSS = editedHTML;
    }
    
    // Update header title
    $(this.container).find('.header-title').text(this.options.projectTitle || 'editor test');
    
    this.closeEditorSettings();
  }

  extractBodyContent(html) {
    try {
      // Spróbuj wyodrębnić zawartość body z pełnego HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const body = doc.querySelector('body');
      
      if (body) {
        // Zwróć zawartość body (bez tagu body)
        return body.innerHTML;
      }
      
      // Jeśli nie ma body, sprawdź czy to już jest tylko content
      if (html.includes('<div') || html.includes('<table') || html.includes('<p')) {
        return html;
      }
      
      return null;
    } catch (e) {
      console.error('Error extracting body content:', e);
      return null;
    }
  }

  attachDragAndDrop() {
    const self = this;
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

      // Jeśli drop nastąpił wewnątrz .container-children lub .column-children,
      // zostaw obsługę handlerowi delegowanemu
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
    const self = this;
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

  moveBlockAfter(blockId, afterBlockId) {
    const rootBlock = this.document[this.options.rootBlockId];
    const childrenIds = rootBlock.data.childrenIds || [];
    
    const fromIndex = childrenIds.indexOf(blockId);
    const toIndex = childrenIds.indexOf(afterBlockId);
    
    if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
      childrenIds.splice(fromIndex, 1);
      const newIndex = childrenIds.indexOf(afterBlockId) + 1;
      childrenIds.splice(newIndex, 0, blockId);
      this.renderPreview();
    }
  }

  attachBlockEvents() {
    const self = this;
    const $preview = $('#email-preview');

    // Click on a block
    $preview.find('[data-block-id]').off('click').on('click', function(e) {
      e.stopPropagation();
      const blockId = $(this).data('block-id');
      self.selectBlock(blockId);
    });

    // Delete buttons
    $preview.find('.block-delete').off('click').on('click', function(e) {
      e.stopPropagation();
      const blockId = $(this).closest('[data-block-id]').data('block-id');
      self.deleteBlock(blockId);
    });

    // Move buttons
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
    this.attachBlockDragAndDrop();
    
    // Re-attach container drop zones after render
    this.attachContainerDropZones();
    
    // Re-attach column drop zones after render
    this.attachColumnDropZones();
  }

  attachColumnDropZones() {
    const self = this;
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
    const self = this;
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

  generateBlockId() {
    return 'block-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  addBlock(type, data = {}, parentBlockId = null) {
    const blockId = this.generateBlockId();
    let parentId = parentBlockId || this.options.rootBlockId;
    let parentBlock = this.document[parentId];

    if (!parentBlock) {
      console.warn(`Parent block ${parentId} not found, adding to root`);
      parentId = this.options.rootBlockId;
      parentBlock = this.document[parentId];
    }

    this.document[blockId] = {
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

    this.renderPreview();
    this.selectBlock(blockId);
  }

  addBlockToColumn(type, columnsBlockId, columnIndex) {
    const blockId = this.generateBlockId();
    const columnsBlock = this.document[columnsBlockId];

    if (!columnsBlock || columnsBlock.type !== 'Columns') {
      console.warn(`Columns block ${columnsBlockId} not found, adding to root`);
      this.addBlock(type);
      return;
    }

    // Utwórz nowy blok
    this.document[blockId] = {
      type: type,
      data: {
        ...BlockRegistry.get(type).getDefaultData ? BlockRegistry.get(type).getDefaultData() : {}
      }
    };

    // Zainicjalizuj columnChildrenIds jeśli nie istnieje
    if (!columnsBlock.data.columnChildrenIds) {
      const columns = columnsBlock.data.props?.columns || 2;
      columnsBlock.data.columnChildrenIds = Array(columns).fill(null).map(() => []);
    }

    // Upewnij się, że kolumna istnieje
    if (!columnsBlock.data.columnChildrenIds[columnIndex]) {
      columnsBlock.data.columnChildrenIds[columnIndex] = [];
    }

    // Dodaj blok do odpowiedniej kolumny
    columnsBlock.data.columnChildrenIds[columnIndex].push(blockId);

    this.renderPreview();
    this.selectBlock(blockId);
  }

  selectBlock(blockId) {
    this.selectedBlockId = blockId;
    const block = this.document[blockId];
    if (!block) return;

    const BlockClass = BlockRegistry.get(block.type);
    if (!BlockClass) return;

    this.renderSidebar(blockId, block);
    
    // Visual selection
    $('#email-preview').find('[data-block-id]').removeClass('selected');
    $('#email-preview').find(`[data-block-id="${blockId}"]`).addClass('selected');
  }

  renderSidebar(blockId, block) {
    const BlockClass = BlockRegistry.get(block.type);
    const $sidebar = $('#sidebar-content');
    
    let html = `<h3>Edit: ${block.type}</h3>`;
    html += BlockClass.getSidebarHTML ? BlockClass.getSidebarHTML(block.data) : '<p>No editing options available</p>';
    
    $sidebar.html(html);
    
    // Switch to design tab if not already
    if (this.activeTab !== 'design') {
      this.switchTab('design');
    }
    
    // Attach events
    this.attachSidebarEvents(blockId);
  }

  attachSidebarEvents(blockId) {
    const self = this;
    const $sidebar = $('#sidebar-content');
    const block = this.document[blockId];

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
        // Upewnij się, że props istnieje
        if (!block.data.props) {
          block.data.props = {};
        }
        
        // Upewnij się, że wartość jest zapisana jako liczba w props
        block.data.props.columns = parseInt(value) || 2;
        
        const oldColumns = block.data.columnChildrenIds?.length || block.data.props.columns || 2;
        const newColumns = block.data.props.columns;
        
        if (!block.data.columnChildrenIds) {
          block.data.columnChildrenIds = Array(oldColumns).fill(null).map(() => []);
        }
        
        // Adjust columnChildrenIds array size
        if (newColumns > oldColumns) {
          // Add new empty columns
          for (let i = oldColumns; i < newColumns; i++) {
            block.data.columnChildrenIds.push([]);
          }
        } else if (newColumns < oldColumns) {
          // Remove excess columns (keep children in remaining columns)
          block.data.columnChildrenIds = block.data.columnChildrenIds.slice(0, newColumns);
        }
        
        // Update columnWidths to match new number of columns
        block.data.props.columnWidths = Array(newColumns).fill(null).map(() => `${100 / newColumns}%`);
      }

      self.renderPreview();
    });
  }

  deleteBlock(blockId) {
    if (confirm('Are you sure you want to delete this block?')) {
      delete this.document[blockId];
      
      // Remove from childrenIds of all parents
      Object.keys(this.document).forEach(key => {
        const block = this.document[key];
        // Remove from normal childrenIds
        if (block.data && block.data.childrenIds) {
          block.data.childrenIds = block.data.childrenIds.filter(id => id !== blockId);
        }
        // Remove from columnChildrenIds
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

      this.selectedBlockId = null;
      $('#sidebar-content').html('<p>Select a block to edit</p>');
      if (this.activeTab === 'design') {
        this.switchTab('content');
      }
      this.renderPreview();
    }
  }

  findParentBlock(blockId) {
    // Search through all blocks to find which one contains this blockId
    for (const [parentId, block] of Object.entries(this.document)) {
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

  moveBlockUp(blockId) {
    const parentInfo = this.findParentBlock(blockId);
    if (!parentInfo) {
      parentInfo = { parentId: this.options.rootBlockId, type: 'normal' };
    }
    
    const parentBlock = this.document[parentInfo.parentId];
    if (!parentBlock) return;
    
    if (parentInfo.type === 'column') {
      // Move within column
      const columnChildren = parentBlock.data.columnChildrenIds[parentInfo.columnIndex] || [];
      const index = columnChildren.indexOf(blockId);
      
      if (index > 0) {
        [columnChildren[index - 1], columnChildren[index]] = [columnChildren[index], columnChildren[index - 1]];
        this.renderPreview();
      }
    } else {
      // Move in normal childrenIds
      const childrenIds = parentBlock.data.childrenIds || [];
      const index = childrenIds.indexOf(blockId);
      
      if (index > 0) {
        [childrenIds[index - 1], childrenIds[index]] = [childrenIds[index], childrenIds[index - 1]];
        this.renderPreview();
      }
    }
  }

  moveBlockDown(blockId) {
    const parentInfo = this.findParentBlock(blockId);
    if (!parentInfo) {
      parentInfo = { parentId: this.options.rootBlockId, type: 'normal' };
    }
    
    const parentBlock = this.document[parentInfo.parentId];
    if (!parentBlock) return;
    
    if (parentInfo.type === 'column') {
      // Move within column
      const columnChildren = parentBlock.data.columnChildrenIds[parentInfo.columnIndex] || [];
      const index = columnChildren.indexOf(blockId);
      
      if (index < columnChildren.length - 1) {
        [columnChildren[index], columnChildren[index + 1]] = [columnChildren[index + 1], columnChildren[index]];
        this.renderPreview();
      }
    } else {
      // Move in normal childrenIds
      const childrenIds = parentBlock.data.childrenIds || [];
      const index = childrenIds.indexOf(blockId);
      
      if (index < childrenIds.length - 1) {
        [childrenIds[index], childrenIds[index + 1]] = [childrenIds[index + 1], childrenIds[index]];
        this.renderPreview();
      }
    }
  }

  exportJSON() {
    const json = JSON.stringify(this.document, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'email-template.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  exportHTML() {
    // Jeśli jest customHTML, użyj go zamiast generować z bloków
    let html;
    if (this.options.customHTML) {
      html = this.options.customHTML;
    } else {
      html = HTMLRenderer.renderToStaticMarkup(this.document, {
        rootBlockId: this.options.rootBlockId
      });
    }
    
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'email-template.html';
    a.click();
    URL.revokeObjectURL(url);
  }

  importJSON() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            this.document = JSON.parse(event.target.result);
            this.renderPreview();
            alert('Template imported successfully!');
          } catch (error) {
            alert('Error importing template: ' + error.message);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }

  getDocument() {
    return this.document;
  }

  setDocument(document) {
    this.document = document;
    this.renderPreview();
  }
}

