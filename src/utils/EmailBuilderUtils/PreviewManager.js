import { HTMLRenderer } from '../../core/HTMLRenderer';
import { createCustomHtmlNotificationHTML } from '../HtmlElements/CustomHtmlNotification';

export class PreviewManager {
  constructor(emailBuilder) {
    this.emailBuilder = emailBuilder;
  }

  renderPreview() {
    console.log('PreviewManager.renderPreview called');
    console.log('Document:', this.emailBuilder.document);
    console.log('Root block ID:', this.emailBuilder.options.rootBlockId);
    console.log('Root block exists:', !!this.emailBuilder.document?.[this.emailBuilder.options.rootBlockId]);
    console.log('Container:', this.emailBuilder.container);
    
    // Try to find preview element in container context first, then globally
    let $preview = $(this.emailBuilder.container).find('#email-preview');
    if (!$preview.length) {
      console.log('Preview not found in container, trying global selector...');
      $preview = $('#email-preview');
    }
    
    console.log('Preview element found:', $preview.length > 0);
    console.log('Preview element:', $preview[0]);
    console.log('Preview element parent:', $preview.length > 0 ? $preview.parent()[0] : 'N/A');
    
    if (!$preview.length) {
      console.error('Preview element not found!');
      console.error('Container HTML:', $(this.emailBuilder.container).html()?.substring(0, 500));
      return;
    }
    
    // Always render blocks - allows editing through the panel
    // customHTML will only be used when exporting
    const html = this.emailBuilder.previewRenderer.renderPreviewBlocks(this.emailBuilder.document, this.emailBuilder.options.rootBlockId);
    console.log('Rendered HTML length:', html ? html.length : 0);
    console.log('Rendered HTML preview:', html ? html.substring(0, 200) : 'empty');
    
    $preview.html(html);
    console.log('HTML set to preview element');
    console.log('Preview element innerHTML length after setting:', $preview.html()?.length || 0);
    console.log('Preview element computed styles:', {
      display: $preview.css('display'),
      visibility: $preview.css('visibility'),
      opacity: $preview.css('opacity'),
      width: $preview.css('width'),
      height: $preview.css('height'),
      position: $preview.css('position')
    });
    console.log('Preview element is visible:', $preview.is(':visible'));
    console.log('Preview element offset:', $preview.offset());
    console.log('Preview element dimensions:', {
      width: $preview.width(),
      height: $preview.height(),
      outerWidth: $preview.outerWidth(),
      outerHeight: $preview.outerHeight()
    });
    
    this.emailBuilder.attachBlockEvents();
    
    // If there is customHTML, show a notification that it will be used when exporting
    if (this.emailBuilder.options.customHTML) {
      this.showCustomHTMLNotification();
    } else {
      this.hideCustomHTMLNotification();
    }
    
    console.log('Preview rendered successfully');
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

