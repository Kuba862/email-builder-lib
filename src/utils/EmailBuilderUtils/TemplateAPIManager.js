import { HTMLRenderer } from '../../core/HTMLRenderer';

/**
 * Template API Manager - optional integration with backend API
 * This manager handles saving/loading templates from API
 * Can be disabled by not providing API options
 */
export class TemplateAPIManager {
  constructor(emailBuilder) {
    this.emailBuilder = emailBuilder;
    this.apiBaseUrl = emailBuilder.options.apiBaseUrl || null;
    this.apiEnabled = !!this.apiBaseUrl;
  }

  /**
   * Saves current template to API
   * @param {string} name - Template name
   * @param {string} description - Optional description
   * @returns {Promise<object>} Saved template data
   */
  async saveTemplate(name, description = '') {
    if (!this.apiEnabled) {
      throw new Error('API is not enabled. Provide apiBaseUrl in options.');
    }

    try {
      const document = this.emailBuilder.getDocument();
      let htmlContent = null;

      // Generate HTML if customHTML is not set
      if (!this.emailBuilder.options.customHTML) {
        htmlContent = HTMLRenderer.renderToStaticMarkup(document, {
          rootBlockId: this.emailBuilder.options.rootBlockId
        });
      } else {
        htmlContent = this.emailBuilder.options.customHTML;
      }

      const response = await fetch(`${this.apiBaseUrl}/api/templates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          document,
          html_content: htmlContent
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save template');
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving template:', error);
      throw error;
    }
  }

  /**
   * Updates existing template in API
   * @param {number} templateId - Template ID
   * @param {string} name - Template name
   * @param {string} description - Optional description
   * @returns {Promise<object>} Updated template data
   */
  async updateTemplate(templateId, name, description = '') {
    if (!this.apiEnabled) {
      throw new Error('API is not enabled. Provide apiBaseUrl in options.');
    }

    try {
      const document = this.emailBuilder.getDocument();
      let htmlContent = null;

      if (!this.emailBuilder.options.customHTML) {
        htmlContent = HTMLRenderer.renderToStaticMarkup(document, {
          rootBlockId: this.emailBuilder.options.rootBlockId
        });
      } else {
        htmlContent = this.emailBuilder.options.customHTML;
      }

      const response = await fetch(`${this.apiBaseUrl}/api/templates/${templateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          document,
          html_content: htmlContent
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update template');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating template:', error);
      throw error;
    }
  }

  /**
   * Loads template from API
   * @param {number} templateId - Template ID
   * @returns {Promise<object>} Template data
   */
  async loadTemplate(templateId) {
    if (!this.apiEnabled) {
      throw new Error('API is not enabled. Provide apiBaseUrl in options.');
    }

    try {
      const response = await fetch(`${this.apiBaseUrl}/api/templates/${templateId}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to load template');
      }

      const template = await response.json();
      
      console.log('Template loaded from API:', template);
      
      // Load template into editor
      if (template.document) {
        // Parse document if it's a string
        let document;
        if (typeof template.document === 'string') {
          try {
            document = JSON.parse(template.document);
          } catch (e) {
            console.error('Error parsing document string:', e);
            throw new Error('Invalid document format');
          }
        } else {
          document = template.document;
        }
        
        console.log('Setting document:', document);
        this.emailBuilder.setDocument(document);
        console.log('Document set, rendering preview...');
      } else {
        console.warn('No document in template response');
      }
      
      // Only set customHTML if it exists and document is not set
      // If we have document, we should render from blocks, not customHTML
      if (template.html_content && !template.document) {
        this.emailBuilder.options.customHTML = template.html_content;
      } else if (template.html_content && template.document) {
        // If both exist, prefer document (blocks) over customHTML
        this.emailBuilder.options.customHTML = null;
      }

      // Update project title from template name
      if (template.name) {
        this.emailBuilder.options.projectTitle = template.name;
        // Update header title in UI
        $(this.emailBuilder.container).find('.header-title').text(template.name);
      }

      // Store loaded template ID and name for update functionality
      this.emailBuilder.loadedTemplateId = template.id;
      this.emailBuilder.loadedTemplateName = template.name;
      this.emailBuilder.loadedTemplateDescription = template.description || '';

      console.log('Template loading completed. Document keys:', Object.keys(this.emailBuilder.document || {}));
      console.log('Root block exists:', !!this.emailBuilder.document?.[this.emailBuilder.options.rootBlockId]);

      return template;
    } catch (error) {
      console.error('Error loading template:', error);
      throw error;
    }
  }

  /**
   * Gets all templates from API
   * @returns {Promise<Array>} List of templates
   */
  async getAllTemplates() {
    if (!this.apiEnabled) {
      throw new Error('API is not enabled. Provide apiBaseUrl in options.');
    }

    try {
      const response = await fetch(`${this.apiBaseUrl}/api/templates`);

      if (!response.ok) {
        throw new Error('Failed to fetch templates');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching templates:', error);
      throw error;
    }
  }

  /**
   * Deletes template from API
   * @param {number} templateId - Template ID
   * @returns {Promise<object>} Deletion result
   */
  async deleteTemplate(templateId) {
    if (!this.apiEnabled) {
      throw new Error('API is not enabled. Provide apiBaseUrl in options.');
    }

    try {
      const response = await fetch(`${this.apiBaseUrl}/api/templates/${templateId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete template');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  }
}

