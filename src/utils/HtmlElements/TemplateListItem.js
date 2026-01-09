/**
 * Creates HTML for a template list item
 */
export function createTemplateListItemHTML(template) {
  const createdDate = new Date(template.created_at).toLocaleDateString();
  const updatedDate = new Date(template.updated_at).toLocaleDateString();
  
  return `
    <div class="template-list-item" data-template-id="${template.id}">
      <div class="template-item-header">
        <div class="template-item-icon">📄</div>
        <div class="template-item-info">
          <div class="template-item-name">${template.name || 'Untitled'}</div>
          <div class="template-item-meta">
            <span class="template-item-date">Updated: ${updatedDate}</span>
          </div>
        </div>
      </div>
      ${template.description ? `<div class="template-item-description">${template.description}</div>` : ''}
      <div class="template-item-actions">
        <button class="template-btn-load" data-template-id="${template.id}" title="Load template">Load</button>
        <button class="template-btn-delete" data-template-id="${template.id}" title="Delete template">Delete</button>
      </div>
    </div>
  `;
}

