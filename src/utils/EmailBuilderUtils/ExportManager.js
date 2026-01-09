import { HTMLRenderer } from '../../core/HTMLRenderer';

export class ExportManager {
  constructor(emailBuilder) {
    this.emailBuilder = emailBuilder;
  }

  exportJSON() {
    const json = JSON.stringify(this.emailBuilder.document, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'email-template.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  exportHTML() {
    // If there is customHTML, use it instead of generating from blocks
    let html;
    if (this.emailBuilder.options.customHTML) {
      html = this.emailBuilder.options.customHTML;
    } else {
      html = HTMLRenderer.renderToStaticMarkup(this.emailBuilder.document, {
        rootBlockId: this.emailBuilder.options.rootBlockId
      });
    }
    
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
            this.emailBuilder.document = JSON.parse(event.target.result);
            this.emailBuilder.renderPreview();
            alert('Template imported successfully!');
          } catch (error) {
            alert('Error importing template: ' + error.message);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }
}

