export function createSaveTemplateModalHTML() {
  return `
    <!-- Save Template Modal -->
    <div class="modal-overlay" id="save-template-modal" style="display: none;">
      <div class="modal-content" style="max-width: 500px;">
        <div class="modal-header">
          <h2 id="save-template-modal-title">Save Template</h2>
          <button class="modal-close" id="btn-save-template-modal-close">×</button>
        </div>
        <div class="modal-body">
          <div id="save-template-mode-info" style="background: #e8f4f8; padding: 10px; border-radius: 4px; margin-bottom: 15px; display: none;">
            <div style="font-size: 12px; color: #2c3e50; font-weight: 500;">Editing template: <span id="loaded-template-name"></span></div>
            <div style="font-size: 11px; color: #7f8c8d; margin-top: 4px;">You can update this template or save as a new one</div>
          </div>
          
          <div class="form-group">
            <label>Template Name: <span style="color: red;">*</span></label>
            <input type="text" id="template-name" placeholder="Enter template name" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
          </div>
          <div class="form-group">
            <label>Description:</label>
            <textarea id="template-description" placeholder="Enter template description (optional)" rows="4" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; resize: vertical;"></textarea>
          </div>
          <div id="save-template-error" style="color: red; margin-top: 10px; display: none;"></div>
          <div id="save-template-success" style="color: green; margin-top: 10px; display: none;"></div>
        </div>
        <div class="modal-footer" id="save-template-modal-footer">
          <button class="modal-btn" id="btn-save-template-modal-cancel">Cancel</button>
          <button class="modal-btn" id="btn-save-template-modal-save-as-new" style="display: none;">Save as New</button>
          <button class="modal-btn primary" id="btn-save-template-modal-update" style="display: none;">Update Template</button>
          <button class="modal-btn primary" id="btn-save-template-modal-save">Save Template</button>
        </div>
      </div>
    </div>
  `;
}

