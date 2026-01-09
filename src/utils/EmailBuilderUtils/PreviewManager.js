import { HTMLRenderer } from '../../core/HTMLRenderer';
import { createCustomHtmlNotificationHTML } from '../HtmlElements/CustomHtmlNotification';

export class PreviewManager {
  constructor(emailBuilder) {
    this.emailBuilder = emailBuilder;
  }

  renderPreview() {
    const $preview = $('#email-preview');
    
    // Always render blocks - allows editing through the panel
    // customHTML will only be used when exporting
    const html = this.emailBuilder.previewRenderer.renderPreviewBlocks(this.emailBuilder.document, this.emailBuilder.options.rootBlockId);
    $preview.html(html);
    this.emailBuilder.attachBlockEvents();
    
    // If there is customHTML, show a notification that it will be used when exporting
    if (this.emailBuilder.options.customHTML) {
      this.showCustomHTMLNotification();
    } else {
      this.hideCustomHTMLNotification();
    }
  }

  showCustomHTMLNotification() {
    // Remove previous notification if it exists
    $('#custom-html-notification').remove();
    
    // Add notification to the top of the preview
    const $preview = $('#email-preview');
    const $notification = $(createCustomHtmlNotificationHTML());
    $preview.prepend($notification);
    
    // Button to clear customHTML
    $('#clear-custom-html').on('click', (e) => {
      e.preventDefault();
      this.emailBuilder.options.customHTML = null;
      this.hideCustomHTMLNotification();
      // Update textarea in settings
      if ($('#editor-settings-modal').is(':visible')) {
        const currentHTML = HTMLRenderer.renderToStaticMarkup(this.emailBuilder.document, {
          rootBlockId: this.emailBuilder.options.rootBlockId
        });
        $('#setting-custom-css').val(currentHTML);
      }
    });
  }

  hideCustomHTMLNotification() {
    $('#custom-html-notification').remove();
  }
}

