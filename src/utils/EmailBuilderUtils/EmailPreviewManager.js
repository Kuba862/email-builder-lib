import { HTMLRenderer } from '../../core/HTMLRenderer';
import { getDevice, getDeviceCategories } from '../DeviceSizes';

export class EmailPreviewManager {
  constructor(emailBuilder) {
    this.emailBuilder = emailBuilder;
    this.currentPreview = {
      browser: 'chrome',
      device: 'desktop',
      client: 'gmail'
    };
    this.deviceCategories = getDeviceCategories();
  }

  /**
   * Opens a modal with email preview showing the final HTML output
   */
  openPreview() {
    // Generate final HTML
    let html;
    if (this.emailBuilder.options.customHTML) {
      html = this.emailBuilder.options.customHTML;
    } else {
      html = HTMLRenderer.renderToStaticMarkup(this.emailBuilder.document, {
        rootBlockId: this.emailBuilder.options.rootBlockId
      });
    }

    // Update preview size first
    this.updatePreviewSize();
    
    // Render preview
    this.renderPreview(html);
    
    // Show modal
    $('#email-preview-modal').fadeIn(200);
  }

  /**
   * Renders preview with current settings
   */
  renderPreview(html) {
    // Apply client-specific styles
    html = this.applyClientStyles(html, this.currentPreview.client);
    
    // Set the preview content
    const $previewFrame = $('#email-preview-iframe');
    if ($previewFrame.length) {
      const previewDoc = $previewFrame[0].contentDocument || $previewFrame[0].contentWindow.document;
      previewDoc.open();
      previewDoc.write(html);
      previewDoc.close();
    } else {
      // Fallback: use div with innerHTML
      $('#email-preview-content').html(html);
    }

    // Update preview container size based on device
    this.updatePreviewSize();
  }

  /**
   * Applies client-specific CSS styles to simulate different email clients
   */
  applyClientStyles(html, client) {
    const clientStyles = this.getClientStyles(client);
    
    // Insert styles into head
    if (html.includes('</head>')) {
      html = html.replace('</head>', `<style>${clientStyles}</style></head>`);
    } else if (html.includes('<body')) {
      html = html.replace('<body', `<style>${clientStyles}</style><body`);
    } else {
      html = `<style>${clientStyles}</style>${html}`;
    }
    
    return html;
  }

  /**
   * Returns CSS styles specific to email client
   */
  getClientStyles(client) {
    const styles = {
      gmail: `
        /* Gmail specific styles */
        body {
          font-family: Arial, sans-serif;
        }
        .email-container {
          max-width: 600px;
        }
      `,
      outlook: `
        /* Outlook specific styles */
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        table {
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
        }
        .email-container {
          max-width: 600px;
        }
      `,
      apple: `
        /* Apple Mail specific styles */
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .email-container {
          max-width: 600px;
        }
      `,
      yahoo: `
        /* Yahoo Mail specific styles */
        body {
          font-family: Arial, Helvetica, sans-serif;
        }
        .email-container {
          max-width: 600px;
        }
      `,
      default: `
        /* Default styles */
        body {
          font-family: Arial, sans-serif;
        }
        .email-container {
          max-width: 600px;
        }
      `
    };

    return styles[client] || styles.default;
  }

  /**
   * Updates preview container size based on selected device
   */
  updatePreviewSize() {
    const device = getDevice(this.currentPreview.device);
    
    const $previewContainer = $('#email-preview-container');
    const $previewFrame = $('#email-preview-iframe');
    
    $previewContainer.css({
      width: device.width,
      maxWidth: device.maxWidth,
      height: device.height,
      margin: '0 auto',
      border: '1px solid #ddd',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      backgroundColor: '#000',
      position: 'relative'
    });

    // Add device frame styling for mobile devices
    if (device.type === 'mobile') {
      $previewContainer.css({
        borderRadius: '20px',
        padding: '10px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      });
    }

    $previewFrame.css({
      width: '100%',
      height: '100%',
      border: 'none',
      borderRadius: device.type === 'mobile' ? '10px' : '0'
    });
  }

  /**
   * Changes preview browser
   */
  setBrowser(browser) {
    this.currentPreview.browser = browser;
    this.refreshPreview();
  }

  /**
   * Changes preview device
   */
  setDevice(device) {
    this.currentPreview.device = device;
    this.updatePreviewSize();
    this.refreshPreview();
  }

  /**
   * Changes preview email client
   */
  setClient(client) {
    this.currentPreview.client = client;
    this.refreshPreview();
  }

  /**
   * Refreshes the preview with current settings
   */
  refreshPreview() {
    let html;
    if (this.emailBuilder.options.customHTML) {
      html = this.emailBuilder.options.customHTML;
    } else {
      html = HTMLRenderer.renderToStaticMarkup(this.emailBuilder.document, {
        rootBlockId: this.emailBuilder.options.rootBlockId
      });
    }
    this.renderPreview(html);
  }

  /**
   * Closes the email preview modal
   */
  closePreview() {
    $('#email-preview-modal').fadeOut(200);
  }
}
