export class EventHandler {
  constructor(emailBuilder) {
    this.emailBuilder = emailBuilder;
    this.container = emailBuilder.container;
  }

  attach() {
    const self = this.emailBuilder;

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
    });

    // Footer buttons
    $(this.container).on('click', '#btn-back', function(e) {
      e.preventDefault();
      alert('Navigate back');
    });

    $(this.container).on('click', '#btn-save-close', function(e) {
      e.preventDefault();
      self.exportHTML();
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

    // Email Preview
    $(this.container).on('click', '#btn-preview-email', function(e) {
      e.preventDefault();
      self.openEmailPreview();
    });

    $(this.container).on('click', '#btn-preview-close, #btn-preview-close-footer', function(e) {
      e.preventDefault();
      self.closeEmailPreview();
    });

    // Preview Controls
    $(this.container).on('change', '#preview-browser', function() {
      const browser = $(this).val();
      self.emailPreviewManager.setBrowser(browser);
    });

    $(this.container).on('change', '#preview-device', function() {
      const device = $(this).val();
      self.emailPreviewManager.setDevice(device);
    });

    $(this.container).on('change', '#preview-client', function() {
      const client = $(this).val();
      self.emailPreviewManager.setClient(client);
    });

    $(this.container).on('click', '#btn-preview-refresh', function(e) {
      e.preventDefault();
      self.emailPreviewManager.refreshPreview();
    });
  }
}

