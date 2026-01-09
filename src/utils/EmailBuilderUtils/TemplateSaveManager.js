export class TemplateSaveManager {
  constructor(emailBuilder) {
    this.emailBuilder = emailBuilder;
  }

  /**
   * Opens the save template modal
   */
  openSaveTemplateModal() {
    const hasLoadedTemplate = !!this.emailBuilder.loadedTemplateId;
    
    // Set values based on whether template is loaded
    if (hasLoadedTemplate) {
      // Template is loaded - show update mode
      $('#template-name').val(this.emailBuilder.loadedTemplateName || this.emailBuilder.options.projectTitle || '');
      $('#template-description').val(this.emailBuilder.loadedTemplateDescription || '');
      $('#loaded-template-name').text(this.emailBuilder.loadedTemplateName || 'Untitled');
      $('#save-template-mode-info').show();
      $('#save-template-modal-title').text('Update Template');
      
      // Show update and save as new buttons
      $('#btn-save-template-modal-save').hide();
      $('#btn-save-template-modal-update').show();
      $('#btn-save-template-modal-save-as-new').show();
    } else {
      // New template - show save mode
      $('#template-name').val(this.emailBuilder.options.projectTitle || '');
      $('#template-description').val('');
      $('#save-template-mode-info').hide();
      $('#save-template-modal-title').text('Save Template');
      
      // Show only save button
      $('#btn-save-template-modal-save').show();
      $('#btn-save-template-modal-update').hide();
      $('#btn-save-template-modal-save-as-new').hide();
    }
    
    $('#save-template-error').hide().text('');
    $('#save-template-success').hide().text('');
    
    // Show modal
    $('#save-template-modal').fadeIn(200);
    $('#template-name').focus();
  }

  /**
   * Closes the save template modal
   */
  closeSaveTemplateModal() {
    $('#save-template-modal').fadeOut(200);
    $('#template-name').val('');
    $('#template-description').val('');
    $('#save-template-error').hide().text('');
    $('#save-template-success').hide().text('');
    $('#save-template-mode-info').hide();
  }

  /**
   * Saves template as new to backend API
   */
  async saveTemplate() {
    const name = $('#template-name').val().trim();
    const description = $('#template-description').val().trim();

    // Validate
    if (!name) {
      $('#save-template-error').text('Template name is required').show();
      $('#template-name').focus();
      return;
    }

    $('#save-template-error').hide();
    $('#save-template-success').hide();

    // Check if API is configured
    if (!this.emailBuilder.options.apiBaseUrl) {
      $('#save-template-error').text('API is not configured. Please provide apiBaseUrl in EmailBuilder options.').show();
      return;
    }

    // Disable save button during request
    const $saveBtn = $('#btn-save-template-modal-save');
    const originalText = $saveBtn.text();
    $saveBtn.prop('disabled', true).text('Saving...');

    try {
      const savedTemplate = await this.emailBuilder.saveTemplateToAPI(name, description);
      
      // Clear loaded template ID since we're saving as new
      this.emailBuilder.loadedTemplateId = null;
      this.emailBuilder.loadedTemplateName = null;
      this.emailBuilder.loadedTemplateDescription = null;
      
      $('#save-template-success').text(`Template "${savedTemplate.name}" saved successfully!`).show();
      
      // Trigger event to refresh templates list
      $(this.emailBuilder.container).trigger('templateSaved');
      
      // Close modal after 1.5 seconds
      setTimeout(() => {
        this.closeSaveTemplateModal();
      }, 1500);
    } catch (error) {
      console.error('Error saving to API:', error);
      $('#save-template-error').text(`Failed to save template: ${error.message}`).show();
    } finally {
      // Re-enable save button
      $saveBtn.prop('disabled', false).text(originalText);
    }
  }

  /**
   * Updates existing template in backend API
   */
  async updateTemplate() {
    const name = $('#template-name').val().trim();
    const description = $('#template-description').val().trim();

    // Validate
    if (!name) {
      $('#save-template-error').text('Template name is required').show();
      $('#template-name').focus();
      return;
    }

    if (!this.emailBuilder.loadedTemplateId) {
      $('#save-template-error').text('No template loaded to update').show();
      return;
    }

    $('#save-template-error').hide();
    $('#save-template-success').hide();

    // Check if API is configured
    if (!this.emailBuilder.options.apiBaseUrl) {
      $('#save-template-error').text('API is not configured. Please provide apiBaseUrl in EmailBuilder options.').show();
      return;
    }

    // Disable update button during request
    const $updateBtn = $('#btn-save-template-modal-update');
    const originalText = $updateBtn.text();
    $updateBtn.prop('disabled', true).text('Updating...');

    try {
      const updatedTemplate = await this.emailBuilder.updateTemplateInAPI(
        this.emailBuilder.loadedTemplateId,
        name,
        description
      );
      
      // Update loaded template info
      this.emailBuilder.loadedTemplateName = updatedTemplate.name;
      this.emailBuilder.loadedTemplateDescription = updatedTemplate.description || '';
      
      $('#save-template-success').text(`Template "${updatedTemplate.name}" updated successfully!`).show();
      
      // Trigger event to refresh templates list
      $(this.emailBuilder.container).trigger('templateSaved');
      
      // Close modal after 1.5 seconds
      setTimeout(() => {
        this.closeSaveTemplateModal();
      }, 1500);
    } catch (error) {
      console.error('Error updating template:', error);
      $('#save-template-error').text(`Failed to update template: ${error.message}`).show();
    } finally {
      // Re-enable update button
      $updateBtn.prop('disabled', false).text(originalText);
    }
  }

  /**
   * Saves template as new (even if one is loaded)
   */
  async saveAsNew() {
    // Temporarily clear loaded template ID to save as new
    const originalTemplateId = this.emailBuilder.loadedTemplateId;
    this.emailBuilder.loadedTemplateId = null;
    
    try {
      await this.saveTemplate();
    } finally {
      // Restore original template ID (in case save failed)
      if (originalTemplateId) {
        this.emailBuilder.loadedTemplateId = originalTemplateId;
      }
    }
  }
}

