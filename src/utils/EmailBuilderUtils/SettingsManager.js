import { HTMLRenderer } from '../../core/HTMLRenderer';

export class SettingsManager {
  constructor(emailBuilder) {
    this.emailBuilder = emailBuilder;
  }

  openEditorSettings() {
    // Generate current template HTML and load it into the textarea,
    // so that the user can edit it.
    // If there is customHTML, show it, otherwise generate from blocks
    try {
      let currentHtml;
      if (this.emailBuilder.options.customHTML) {
        currentHtml = this.emailBuilder.options.customHTML;
      } else {
        currentHtml = HTMLRenderer.renderToStaticMarkup(this.emailBuilder.document, {
          rootBlockId: this.emailBuilder.options.rootBlockId
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
    this.emailBuilder.options.projectTitle = $('#setting-project-title').val();
    this.emailBuilder.options.emailSubject = $('#setting-email-subject').val();
    const editedHTML = $('#setting-custom-css').val();
    this.emailBuilder.options.lineWrapping = $('#setting-line-wrapping').is(':checked');
    
    // If HTML was edited, save it as customHTML
    if (editedHTML && editedHTML.trim()) {
      // Extract body content from full HTML
      const bodyContent = this.extractBodyContent(editedHTML);
      if (bodyContent) {
        this.emailBuilder.options.customHTML = editedHTML;
        // Update preview with edited HTML
        this.emailBuilder.renderPreview();
      } else {
        // If it was not possible to extract, save as customCSS (old way)
        this.emailBuilder.options.customCSS = editedHTML;
        this.emailBuilder.options.customHTML = null;
      }
    } else {
      this.emailBuilder.options.customHTML = null;
      this.emailBuilder.options.customCSS = editedHTML;
    }
    
    // Update header title
    $(this.emailBuilder.container).find('.header-title').text(this.emailBuilder.options.projectTitle || 'editor test');
    
    this.closeEditorSettings();
  }

  extractBodyContent(html) {
    try {
      // Try to extract body content from full HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const body = doc.querySelector('body');
      
      if (body) {
        // Return body content (without body tag)
        return body.innerHTML;
      }
      
      // If there is no body, check if it is already only content
      if (html.includes('<div') || html.includes('<table') || html.includes('<p')) {
        return html;
      }
      
      return null;
    } catch (e) {
      console.error('Error extracting body content:', e);
      return null;
    }
  }
}

