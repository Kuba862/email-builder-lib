import { createEmailPreviewModalHTML } from './EmailPreviewModal';

export function createEmailBuilderLayoutHTML(options, activeTab) {
  return `
      <div class="email-builder-wrapper">
        <!-- Top Header -->
        <div class="email-builder-header">
          <div class="header-left">
            <div class="logo">📧</div>
            <span class="header-title">${options.projectTitle || 'editor test'}</span>
          </div>
          <div class="header-right">
            <a href="#" class="header-link" id="btn-help">Help</a>
            <div class="header-dropdown">
              <a href="#" class="header-link" id="btn-preview-email">Preview and Test <span>▼</span></a>
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
              <button class="sidebar-tab ${activeTab === 'content' ? 'active' : ''}" data-tab="content">Content</button>
              <button class="sidebar-tab ${activeTab === 'design' ? 'active' : ''}" data-tab="design">Design</button>
              <button class="sidebar-tab ${activeTab === 'comments' ? 'active' : ''}" data-tab="comments">Comments</button>
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
                <input type="text" id="setting-project-title" value="${options.projectTitle || ''}">
              </div>
              <div class="form-group">
                <label>Email Subject:</label>
                <input type="text" id="setting-email-subject" value="${options.emailSubject || ''}">
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
                <textarea id="setting-custom-css" rows="15" placeholder="<!DOCTYPE html>&#10;<html>&#10;  <head>&#10;    <style type=&quot;text/css&quot;>&#10;      /* Your custom CSS here */&#10;    </style>&#10;  </head>&#10;  <body style=&quot;margin:0px; background: #f4f4f4;&quot;>&#10;    <!-- Comment about the code here! -->&#10;">${options.customCSS || ''}</textarea>
              </div>
              <div class="form-group">
                <label>
                  <input type="checkbox" id="setting-line-wrapping" ${options.lineWrapping ? 'checked' : ''}>
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
      ${createEmailPreviewModalHTML()}
  `;
}


