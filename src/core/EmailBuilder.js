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
    this.init();
  }

  init() {
    this.render();
    this.attachEvents();
  }

  render() {
    const $container = $(this.container);
    $container.empty();

    // Główny layout
    $container.html(`
      <div class="email-builder-wrapper">
        <div class="email-builder-toolbar">
          <button class="btn-add-block" data-type="Text">Dodaj Tekst</button>
          <button class="btn-add-block" data-type="Heading">Dodaj Nagłówek</button>
          <button class="btn-add-block" data-type="Image">Dodaj Obraz</button>
          <button class="btn-add-block" data-type="Button">Dodaj Przycisk</button>
          <button class="btn-add-block" data-type="Divider">Dodaj Separator</button>
          <button class="btn-add-block" data-type="Spacer">Dodaj Odstęp</button>
          <button class="btn-add-block" data-type="Columns">Dodaj Kolumny</button>
          <button class="btn-export-json">Eksportuj JSON</button>
          <button class="btn-export-html">Eksportuj HTML</button>
          <button class="btn-import-json">Importuj JSON</button>
        </div>
        <div class="email-builder-content">
          <div class="email-builder-canvas">
            <div class="email-builder-preview" id="email-preview"></div>
          </div>
          <div class="email-builder-sidebar">
            <div class="sidebar-content" id="sidebar-content">
              <p>Wybierz blok aby edytować</p>
            </div>
          </div>
        </div>
      </div>
    `);

    this.renderPreview();
  }

  renderPreview() {
    const $preview = $('#email-preview');
    const html = this.renderPreviewBlocks(this.document, this.options.rootBlockId);
    $preview.html(html);
    this.attachBlockEvents();
  }

  renderPreviewBlocks(document, blockId) {
    const block = document[blockId];
    if (!block) return '';

    const BlockClass = BlockRegistry.get(block.type);
    if (!BlockClass) return '';

    // Dodaj blockId do danych bloku
    const blockData = { ...block.data, blockId: blockId };
    const blockInstance = new BlockClass(blockData);
    let html = blockInstance.render();

    // Renderuj dzieci jeśli istnieją
    if (block.data && block.data.childrenIds && Array.isArray(block.data.childrenIds)) {
      const childrenHtml = block.data.childrenIds
        .map(childId => this.renderPreviewBlocks(document, childId))
        .join('');

      html = html.replace('{{children}}', childrenHtml);
    }

    return html;
  }

  attachEvents() {
    const self = this;

    // Dodawanie bloków
    $(this.container).on('click', '.btn-add-block', function() {
      const type = $(this).data('type');
      self.addBlock(type);
    });

    // Eksport JSON
    $(this.container).on('click', '.btn-export-json', function() {
      self.exportJSON();
    });

    // Eksport HTML
    $(this.container).on('click', '.btn-export-html', function() {
      self.exportHTML();
    });

    // Import JSON
    $(this.container).on('click', '.btn-import-json', function() {
      self.importJSON();
    });
  }

  attachBlockEvents() {
    const self = this;
    const $preview = $('#email-preview');

    // Kliknięcie na blok
    $preview.find('[data-block-id]').off('click').on('click', function(e) {
      e.stopPropagation();
      const blockId = $(this).data('block-id');
      self.selectBlock(blockId);
    });

    // Przyciski usuwania
    $preview.find('.block-delete').off('click').on('click', function(e) {
      e.stopPropagation();
      const blockId = $(this).closest('[data-block-id]').data('block-id');
      self.deleteBlock(blockId);
    });

    // Przyciski przenoszenia
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
  }

  generateBlockId() {
    return 'block-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  addBlock(type, data = {}) {
    const blockId = this.generateBlockId();
    const rootBlock = this.document[this.options.rootBlockId];

    this.document[blockId] = {
      type: type,
      data: {
        ...BlockRegistry.get(type).getDefaultData ? BlockRegistry.get(type).getDefaultData() : {},
        ...data
      }
    };

    if (!rootBlock.data.childrenIds) {
      rootBlock.data.childrenIds = [];
    }
    rootBlock.data.childrenIds.push(blockId);

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
    
    // Wizualne zaznaczenie
    $('#email-preview').find('[data-block-id]').removeClass('selected');
    $('#email-preview').find(`[data-block-id="${blockId}"]`).addClass('selected');
  }

  renderSidebar(blockId, block) {
    const BlockClass = BlockRegistry.get(block.type);
    const $sidebar = $('#sidebar-content');
    
    let html = `<h3>Edytuj: ${block.type}</h3>`;
    html += BlockClass.getSidebarHTML ? BlockClass.getSidebarHTML(block.data) : '<p>Brak opcji edycji</p>';
    
    $sidebar.html(html);
    
    // Podpięcie eventów
    this.attachSidebarEvents(blockId);
  }

  attachSidebarEvents(blockId) {
    const self = this;
    const $sidebar = $('#sidebar-content');

    // Wszystkie inputy i textarea
    $sidebar.find('input, textarea, select').on('change input', function() {
      const $field = $(this);
      const fieldName = $field.data('field');
      const fieldType = $field.data('type') || 'string';
      
      let value = $field.val();
      
      if (fieldType === 'number') {
        value = parseFloat(value) || 0;
      } else if (fieldType === 'boolean') {
        value = $field.is(':checked');
      } else if (fieldType === 'object') {
        // Dla stylów i innych obiektów
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

      self.renderPreview();
    });
  }

  deleteBlock(blockId) {
    if (confirm('Czy na pewno chcesz usunąć ten blok?')) {
      delete this.document[blockId];
      
      // Usuń z childrenIds wszystkich rodziców
      Object.keys(this.document).forEach(key => {
        const block = this.document[key];
        if (block.data && block.data.childrenIds) {
          block.data.childrenIds = block.data.childrenIds.filter(id => id !== blockId);
        }
      });

      this.selectedBlockId = null;
      $('#sidebar-content').html('<p>Wybierz blok aby edytować</p>');
      this.renderPreview();
    }
  }

  moveBlockUp(blockId) {
    const rootBlock = this.document[this.options.rootBlockId];
    const childrenIds = rootBlock.data.childrenIds || [];
    const index = childrenIds.indexOf(blockId);
    
    if (index > 0) {
      [childrenIds[index - 1], childrenIds[index]] = [childrenIds[index], childrenIds[index - 1]];
      this.renderPreview();
    }
  }

  moveBlockDown(blockId) {
    const rootBlock = this.document[this.options.rootBlockId];
    const childrenIds = rootBlock.data.childrenIds || [];
    const index = childrenIds.indexOf(blockId);
    
    if (index < childrenIds.length - 1) {
      [childrenIds[index], childrenIds[index + 1]] = [childrenIds[index + 1], childrenIds[index]];
      this.renderPreview();
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
    const html = HTMLRenderer.renderToStaticMarkup(this.document, {
      rootBlockId: this.options.rootBlockId
    });
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
            alert('Szablon zaimportowany pomyślnie!');
          } catch (error) {
            alert('Błąd podczas importowania: ' + error.message);
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

