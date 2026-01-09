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

export class EmailBuilder {
  /**
   * Tworzy nową instancję EmailBuilder i inicjalizuje stan oraz menedżery pomocnicze.
   * @param {HTMLElement|string} container - Kontener DOM lub selektor, w którym ma działać edytor.
   * @param {object} options - Ustawienia początkowe szablonu i edytora.
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
    this.init();
  }

  /**
   * Metoda startowa - renderuje interfejs i podpina główne eventy.
   */
  init() {
    this.render();
    this.attachEvents();
  }

  /**
   * Renderuje główny layout edytora (header, sidebar, canvas, footer).
   */
  render() {
    this.renderer.render();
  }

  /**
   * Renderuje listę dostępnych bloków w panelu „Content”.
   */
  renderContentBlocks() {
    this.renderer.renderContentBlocks();
  }

  /**
   * Renderuje podgląd aktualnego dokumentu e‑maila w obszarze preview.
   */
  renderPreview() {
    this.previewManager.renderPreview();
  }

  /**
   * Pokazuje informację, że przy eksporcie zostanie użyty zapisany custom HTML.
   */
  showCustomHTMLNotification() {
    this.previewManager.showCustomHTMLNotification();
  }

  /**
   * Ukrywa notyfikację o użyciu custom HTML.
   */
  hideCustomHTMLNotification() {
    this.previewManager.hideCustomHTMLNotification();
  }


  /**
   * Podpina wszystkie zdarzenia interfejsu (przyciski, zakładki itp.).
   */
  attachEvents() {
    this.eventHandler.attach();
  }

  /**
   * Przełącza aktywną zakładkę w panelu bocznym (content/design/comments).
   * @param {string} tab - Nazwa zakładki do uaktywnienia.
   */
  switchTab(tab) {
    this.tabManager.switchTab(tab);
  }

  /**
   * Otwiera modal z ustawieniami edytora i ładuje do niego aktualny HTML.
   */
  openEditorSettings() {
    this.settingsManager.openEditorSettings();
  }

  /**
   * Zamyka modal z ustawieniami edytora.
   */
  closeEditorSettings() {
    this.settingsManager.closeEditorSettings();
  }

  /**
   * Zapisuje ustawienia edytora (tytuł, temat, HTML, opcje globalne) i odświeża UI.
   */
  saveEditorSettings() {
    this.settingsManager.saveEditorSettings();
  }

  /**
   * Wyodrębnia zawartość `<body>` z przekazanego HTML lub zwraca sam content.
   * @param {string} html - Pełny dokument HTML lub fragment.
   * @returns {string|null} Zawartość body lub null, jeśli nie udało się wyodrębnić.
   */
  extractBodyContent(html) {
    return this.settingsManager.extractBodyContent(html);
  }

  /**
   * Przenosi blok tak, aby znalazł się zaraz po innym wskazanym bloku w root containerze.
   * @param {string} blockId - ID bloku do przeniesienia.
   * @param {string} afterBlockId - ID bloku, za który ma trafić przenoszony blok.
   */
  moveBlockAfter(blockId, afterBlockId) {
    this.blockManager.moveBlockAfter(blockId, afterBlockId);
  }

  /**
   * Podpina zdarzenia dla bloków w preview (kliknięcia, usuwanie, przesuwanie).
   */
  attachBlockEvents() {
    this.blockEventsManager.attachBlockEvents();
  }

  /**
   * Generuje unikalne ID dla nowego bloku.
   * @returns {string} Wygenerowany identyfikator bloku.
   */
  generateBlockId() {
    return this.blockManager.generateBlockId();
  }

  /**
   * Dodaje nowy blok do dokumentu (do root lub wskazanego kontenera) i zaznacza go.
   * @param {string} type - Typ bloku (np. 'Text', 'Image').
   * @param {object} data - Dane konfiguracyjne bloku.
   * @param {string|null} parentBlockId - ID bloku‑rodzica lub null dla root.
   */
  addBlock(type, data = {}, parentBlockId = null) {
    this.blockManager.addBlock(type, data, parentBlockId);
  }

  /**
   * Dodaje nowy blok do konkretnej kolumny w bloku typu Columns.
   * @param {string} type - Typ dodawanego bloku.
   * @param {string} columnsBlockId - ID bloku Columns.
   * @param {number} columnIndex - Indeks kolumny (0‑based).
   */
  addBlockToColumn(type, columnsBlockId, columnIndex) {
    this.blockManager.addBlockToColumn(type, columnsBlockId, columnIndex);
  }

  /**
   * Ustawia wskazany blok jako aktualnie wybrany i aktualizuje UI.
   * @param {string} blockId - ID bloku do zaznaczenia.
   */
  selectBlock(blockId) {
    this.blockManager.selectBlock(blockId);
  }

  /**
   * Renderuje panel boczny z opcjami edycji dla konkretnego bloku.
   * @param {string} blockId - ID edytowanego bloku.
   * @param {object} block - Dane bloku z dokumentu.
   */
  renderSidebar(blockId, block) {
    this.sidebarManager.renderSidebar(blockId, block);
  }

  /**
   * Podpina zdarzenia formularza w panelu bocznym (inputy, selecty, textarea).
   * @param {string} blockId - ID bloku, którego dane są edytowane.
   */
  attachSidebarEvents(blockId) {
    this.sidebarManager.attachSidebarEvents(blockId);
  }

  /**
   * Usuwa blok z dokumentu (po potwierdzeniu) i odświeża podgląd oraz sidebar.
   * @param {string} blockId - ID bloku do usunięcia.
   */
  deleteBlock(blockId) {
    this.blockManager.deleteBlock(blockId);
  }

  /**
   * Znajduje blok‑rodzica dla wskazanego bloku (kontener lub kolumna).
   * @param {string} blockId - ID bloku potomnego.
   * @returns {object|null} Informacje o rodzicu lub null, jeśli nie znaleziono.
   */
  findParentBlock(blockId) {
    return this.blockManager.findParentBlock(blockId);
  }

  /**
   * Przesuwa blok o jedno miejsce w górę w ramach rodzica (kontenera lub kolumny).
   * @param {string} blockId - ID bloku do przesunięcia.
   */
  moveBlockUp(blockId) {
    this.blockManager.moveBlockUp(blockId);
  }

  /**
   * Przesuwa blok o jedno miejsce w dół w ramach rodzica (kontenera lub kolumny).
   * @param {string} blockId - ID bloku do przesunięcia.
   */
  moveBlockDown(blockId) {
    this.blockManager.moveBlockDown(blockId);
  }

  /**
   * Eksportuje aktualny dokument jako plik JSON.
   */
  exportJSON() {
    this.exportManager.exportJSON();
  }

  /**
   * Eksportuje aktualny szablon jako plik HTML (z bloków lub customHTML).
   */
  exportHTML() {
    this.exportManager.exportHTML();
  }

  /**
   * Importuje dokument JSON z dysku i ładuje go do edytora.
   */
  importJSON() {
    this.exportManager.importJSON();
  }

  /**
   * Zwraca aktualny dokument z blokami.
   * @returns {object} Struktura dokumentu zdefiniowana przez bloki.
   */
  getDocument() {
    return this.document;
  }

  /**
   * Ustawia nowy dokument z blokami i odświeża podgląd.
   * @param {object} document - Nowa struktura dokumentu.
   */
  setDocument(document) {
    this.document = document;
    this.renderPreview();
  }
}

