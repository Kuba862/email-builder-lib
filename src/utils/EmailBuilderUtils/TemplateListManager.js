import { createTemplateListItemHTML } from '../HtmlElements/TemplateListItem';

export class TemplateListManager {
  constructor(emailBuilder) {
    this.emailBuilder = emailBuilder;
    this.templates = [];
  }

  /**
   * Loads all templates from API and displays them in the sidebar
   */
  async loadTemplates() {
    if (!this.emailBuilder.options.apiBaseUrl) {
      console.warn('API not configured, cannot load templates');
      return;
    }

    try {
      this.templates = await this.emailBuilder.getAllTemplatesFromAPI();
      this.renderTemplates();
    } catch (error) {
      console.error('Error loading templates:', error);
      this.showError('Failed to load templates: ' + error.message);
    }
  }

  /**
   * Renders templates list in the sidebar
   */
  renderTemplates() {
    const $templatesContainer = $('#templates-list-container');
    
    if (!this.templates || this.templates.length === 0) {
      $templatesContainer.html('<div class="templates-empty">No templates found. Create your first template!</div>');
      return;
    }

    let html = '<div class="templates-list">';
    this.templates.forEach(template => {
      html += createTemplateListItemHTML(template);
    });
    html += '</div>';

    $templatesContainer.html(html);
    this.attachTemplateEvents();
  }

  /**
   * Attaches event handlers to template items
   */
  attachTemplateEvents() {
    const self = this.emailBuilder;

    // Load template
    $(this.emailBuilder.container).off('click', '.template-btn-load').on('click', '.template-btn-load', async function(e) {
      e.stopPropagation();
      const templateId = $(this).data('template-id');
      
      try {
        const $btn = $(this);
        $btn.prop('disabled', true).text('Loading...');
        
        await self.loadTemplateFromAPI(templateId);
        
        // Show success message
        self.showNotification('Template loaded successfully!', 'success');
        
        $btn.prop('disabled', false).text('Load');
      } catch (error) {
        console.error('Error loading template:', error);
        self.showNotification('Failed to load template: ' + error.message, 'error');
        $(this).prop('disabled', false).text('Load');
      }
    });

    // Delete template
    $(this.emailBuilder.container).off('click', '.template-btn-delete').on('click', '.template-btn-delete', async function(e) {
      e.stopPropagation();
      const templateId = $(this).data('template-id');
      const templateName = self.templateListManager.templates.find(t => t.id == templateId)?.name || 'this template';
      
      if (confirm(`Are you sure you want to delete "${templateName}"?`)) {
        try {
          const $btn = $(this);
          $btn.prop('disabled', true).text('Deleting...');
          
          await self.deleteTemplateFromAPI(templateId);
          
          // Reload templates list
          await self.templateListManager.loadTemplates();
          
          self.showNotification('Template deleted successfully!', 'success');
        } catch (error) {
          console.error('Error deleting template:', error);
          self.showNotification('Failed to delete template: ' + error.message, 'error');
          $(this).prop('disabled', false).text('Delete');
        }
      }
    });
  }

  /**
   * Shows error message in templates container
   */
  showError(message) {
    const $templatesContainer = $('#templates-list-container');
    $templatesContainer.html(`<div class="templates-error" style="color: red; padding: 10px;">${message}</div>`);
  }

  /**
   * Refreshes templates list
   */
  async refresh() {
    await this.loadTemplates();
  }
}

