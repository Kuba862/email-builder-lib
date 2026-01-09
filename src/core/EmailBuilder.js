import { BlockRegistry } from './BlockRegistry';
import { HTMLRenderer } from './HTMLRenderer';
import { EventHandler } from '../utils/EmailBuilderUtils/EventHandler';
import { DragAndDropHandler } from '../utils/EmailBuilderUtils/DragAndDropHandler';
import { PreviewRenderer } from '../utils/EmailBuilderUtils/PreviewRenderer';
import { Renderer } from '../utils/EmailBuilderUtils/Renderer';
import { PreviewManager } from '../utils/EmailBuilderUtils/PreviewManager';
import { TabManager } from '../utils/EmailBuilderUtils/TabManager';
import { SettingsManager } from '../utils/EmailBuilderUtils/SettingsManager';
import { BlockManager } from '../utils/EmailBuilderUtils/BlockManager';
import { SidebarManager } from '../utils/EmailBuilderUtils/SidebarManager';
import { BlockEventsManager } from '../utils/EmailBuilderUtils/BlockEventsManager';
import { ExportManager } from '../utils/EmailBuilderUtils/ExportManager';
import { EmailPreviewManager } from '../utils/EmailBuilderUtils/EmailPreviewManager';
import { TemplateAPIManager } from '../utils/EmailBuilderUtils/TemplateAPIManager';
import { TemplateSaveManager } from '../utils/EmailBuilderUtils/TemplateSaveManager';
import { TemplateListManager } from '../utils/EmailBuilderUtils/TemplateListManager';

export class EmailBuilder {
  /**
   * Creates a new instance of EmailBuilder and initializes the state and helper managers.
   * @param {HTMLElement|string} container - Container DOM or selector, in which the editor will work.
   * @param {object} options - Initial template and editor settings.
   */
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
      customHTML: null, // Edited HTML from settings
      lineWrapping: false,
      apiBaseUrl: "http://localhost:3000", // Optional: API base URL for template storage (e.g., 'http://localhost:3000')
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
    this.loadedTemplateId = null; // ID of the loaded template (if it was loaded)
    this.eventHandler = new EventHandler(this);
    this.dragAndDropHandler = new DragAndDropHandler(this);
    this.previewRenderer = new PreviewRenderer(this.options.rootBlockId);
    this.renderer = new Renderer(this);
    this.previewManager = new PreviewManager(this);
    this.tabManager = new TabManager(this);
    this.settingsManager = new SettingsManager(this);
    this.blockManager = new BlockManager(this);
    this.sidebarManager = new SidebarManager(this);
    this.blockEventsManager = new BlockEventsManager(this);
    this.exportManager = new ExportManager(this);
    this.emailPreviewManager = new EmailPreviewManager(this);
    this.templateAPIManager = new TemplateAPIManager(this);
    this.templateSaveManager = new TemplateSaveManager(this);
    this.templateListManager = new TemplateListManager(this);
    this.init();
  }

  /**
   * Main method - renders the interface and attaches the main events.
   */
  init() {
    this.render();
    this.attachEvents();
    
    // Load templates if API is configured
    if (this.options.apiBaseUrl) {
      this.templateListManager.loadTemplates();
    }
  }

  /**
   * Renders the main layout of the editor (header, sidebar, canvas, footer).
   */
  render() {
    this.renderer.render();
  }

  /**
   * Renders the list of available blocks in the "Content" panel.
   */
  renderContentBlocks() {
    this.renderer.renderContentBlocks();
  }

  /**
   * Renders the preview of the current email document in the preview area.
   */
  renderPreview() {
    this.previewManager.renderPreview();
  }

  /**
   * Shows a notification that the saved custom HTML will be used when exporting.
   */
  showCustomHTMLNotification() {
    this.previewManager.showCustomHTMLNotification();
  }

  /**
   * Hides the notification about using custom HTML.
   */
  hideCustomHTMLNotification() {
    this.previewManager.hideCustomHTMLNotification();
  }


  /**
   * Attaches all interface events (buttons, tabs, etc.).
   */
  attachEvents() {
    this.eventHandler.attach();
  }

  /**
   * Switches the active tab in the sidebar (content/design/comments).
   * @param {string} tab - Name of the tab to activate.
   */
  switchTab(tab) {
    this.tabManager.switchTab(tab);
  }

  /**
   * Opens the modal with the editor settings and loads the current HTML into it.
   */
  openEditorSettings() {
    this.settingsManager.openEditorSettings();
  }

  /**
   * Closes the modal with the editor settings.
   */
  closeEditorSettings() {
    this.settingsManager.closeEditorSettings();
  }

  /**
  * Saves the editor settings (title, subject, HTML, global options) and refreshes the UI.
   */
  saveEditorSettings() {
    this.settingsManager.saveEditorSettings();
  }

  /**
   * Extracts the `<body>` content from the passed HTML or returns the content itself.
   * @param {string} html - Full HTML document or fragment.
   * @returns {string|null} Content of the body or null, if it was not possible to extract.
   */
  extractBodyContent(html) {
    return this.settingsManager.extractBodyContent(html);
  }

  /**
   * Moves the block so that it is immediately after the other specified block in the root container.
   * @param {string} blockId - ID of the block to move.
   * @param {string} afterBlockId - ID of the block, after which the moved block will be placed.
   */
  moveBlockAfter(blockId, afterBlockId) {
    this.blockManager.moveBlockAfter(blockId, afterBlockId);
  }

  /**
   * Attaches events for blocks in preview (clicks, deleting, moving).
   */
  attachBlockEvents() {
    this.blockEventsManager.attachBlockEvents();
  }

  /**
   * Generates a unique ID for a new block.
   * @returns {string} Generated block ID.
   */
  generateBlockId() {
    return this.blockManager.generateBlockId();
  }

  /**
   * Adds a new block to the document (to root or to the specified container) and selects it.
   * @param {string} type - Type of the block (e.g. 'Text', 'Image').
   * @param {object} data - Configuration data for the block.
   * @param {string|null} parentBlockId - ID of the parent block or null for root.
   */
  addBlock(type, data = {}, parentBlockId = null) {
    this.blockManager.addBlock(type, data, parentBlockId);
  }

  /**
   * Adds a new block to a specific column in a Columns block.
   * @param {string} type - Type of the block to add.
   * @param {string} columnsBlockId - ID of the Columns block.
   * @param {number} columnIndex - Column index (0-based).
   */
  addBlockToColumn(type, columnsBlockId, columnIndex) {
    this.blockManager.addBlockToColumn(type, columnsBlockId, columnIndex);
  }

  /**
   * Sets the specified block as the currently selected one and updates the UI.
   * @param {string} blockId - ID of the block to select.
   */
  selectBlock(blockId) {
    this.blockManager.selectBlock(blockId);
  }

  /**
   * Renders the sidebar with the editing options for a specific block.
   * @param {string} blockId - ID of the block to edit.
   * @param {object} block - Data of the block from the document.
   */
  renderSidebar(blockId, block) {
    this.sidebarManager.renderSidebar(blockId, block);
  }

  /**
  * Attaches events for the form in the sidebar (inputs, selects, textarea).
   * @param {string} blockId - ID of the block whose data is being edited.
   */
  attachSidebarEvents(blockId) {
    this.sidebarManager.attachSidebarEvents(blockId);
  }

  /**
   * Deletes a block from the document (after confirmation) and refreshes the preview and sidebar.
   * @param {string} blockId - ID of the block to delete.
   */
  deleteBlock(blockId) {
    this.blockManager.deleteBlock(blockId);
  }

  /**
   * Finds the parent block for the specified block (container or column).
   * @param {string} blockId - ID of the child block.
   * @returns {object|null} Information about the parent or null, if it was not found.
   */
  findParentBlock(blockId) {
    return this.blockManager.findParentBlock(blockId);
  }

  /**
   * Moves the block one place up within the parent (container or column).
   * @param {string} blockId - ID of the block to move.
   */
  moveBlockUp(blockId) {
    this.blockManager.moveBlockUp(blockId);
  }

  /**
   * Moves the block one place down within the parent (container or column).
   * @param {string} blockId - ID of the block to move.
   */
  moveBlockDown(blockId) {
    this.blockManager.moveBlockDown(blockId);
  }

  /**
   * Exports the current document as a JSON file.
   */
  exportJSON() {
    this.exportManager.exportJSON();
  }

  /**
   * Exports the current template as an HTML file (with blocks or customHTML).
   */
  exportHTML() {
    this.exportManager.exportHTML();
  }

  /**
   * Imports a JSON document from the disk and loads it into the editor.
   */
  importJSON() {
    this.exportManager.importJSON();
  }

  /**
   * Returns the current document with blocks.
   * @returns {object} Document structure defined by blocks.
   */
  getDocument() {
    return this.document;
  }

  /**
   * Sets a new document with blocks and refreshes the preview.
   * @param {object} document - New document structure.
   */
  setDocument(document) {
    console.log('setDocument called with:', document);
    
    if (!document || typeof document !== 'object') {
      console.error('Invalid document provided to setDocument:', document);
      return;
    }
    
    // Ensure document has root block
    if (!document[this.options.rootBlockId]) {
      console.warn(`Document missing root block "${this.options.rootBlockId}", attempting to fix...`);
      // Try to find any root-like block or create one
      const firstKey = Object.keys(document)[0];
      if (firstKey && document[firstKey]) {
        document[this.options.rootBlockId] = document[firstKey];
        delete document[firstKey];
      } else {
        console.error('Cannot fix document structure');
        return;
      }
    }
    
    this.document = document;
    this.selectedBlockId = null; // Clear selection when loading new document
    
    console.log('Document set, calling renderPreview...');
    this.renderPreview();
    console.log('renderPreview completed');
    
    // Clear sidebar content when loading new document (don't show edit form)
    $('#sidebar-content').html('<p>Select a block to edit</p>');
    console.log('Sidebar cleared');
  }

  /**
   * Opens the modal with the final HTML email preview.
   */
  openEmailPreview() {
    this.emailPreviewManager.openPreview();
  }

  /**
   * Closes the modal with the email preview.
   */
  closeEmailPreview() {
    this.emailPreviewManager.closePreview();
  }

  /**
   * Saves the template to API (requires apiBaseUrl in options).
   * @param {string} name - Template name
   * @param {string} description - Optional description
   * @returns {Promise<object>} Saved template
   */
  async saveTemplateToAPI(name, description = '') {
    return this.templateAPIManager.saveTemplate(name, description);
  }

  /**
   * Updates the template in API (requires apiBaseUrl in options).
   * @param {number} templateId - ID of the template
   * @param {string} name - Template name
   * @param {string} description - Optional description
   * @returns {Promise<object>} Updated template
   */
  async updateTemplateInAPI(templateId, name, description = '') {
    return this.templateAPIManager.updateTemplate(templateId, name, description);
  }

  /**
   * Loads the template from API (requires apiBaseUrl in options).
   * @param {number} templateId - ID of the template
   * @returns {Promise<object>} Loaded template
   */
  async loadTemplateFromAPI(templateId) {
    return this.templateAPIManager.loadTemplate(templateId);
  }

  /**
   * Gets all templates from API (requires apiBaseUrl in options).
   * @returns {Promise<Array>} List of templates
   */
  async getAllTemplatesFromAPI() {
    return this.templateAPIManager.getAllTemplates();
  }

  /**
   * Deletes the template from API (requires apiBaseUrl in options).
   * @param {number} templateId - ID of the template
   * @returns {Promise<object>} Result of deletion
   */
  async deleteTemplateFromAPI(templateId) {
    return this.templateAPIManager.deleteTemplate(templateId);
  }

  /**
   * Opens the modal to save the template (saves to API if available, otherwise exports JSON).
   */
  openSaveTemplateModal() {
    this.templateSaveManager.openSaveTemplateModal();
  }

  /**
   * Closes the modal to save the template.
   */
  closeSaveTemplateModal() {
    this.templateSaveManager.closeSaveTemplateModal();
  }

  /**
   * Loads the list of templates from API and displays them in the sidebar.
   */
  async loadTemplatesList() {
    await this.templateListManager.loadTemplates();
  }

  /**
  * Displays a notification (used by template list manager).
   * @param {string} message - Message to display
   * @param {string} type - Type of notification ('success' or 'error')
   */
  showNotification(message, type = 'success') {
    // Simple notification - can be expanded later
    if (type === 'success') {
      alert(message);
    } else {
      alert('Error: ' + message);
    }
  }
}

