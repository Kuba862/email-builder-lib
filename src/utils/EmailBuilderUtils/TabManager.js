export class TabManager {
  constructor(emailBuilder) {
    this.emailBuilder = emailBuilder;
  }

  switchTab(tab) {
    this.emailBuilder.activeTab = tab;
    
    // Update tab buttons
    $(this.emailBuilder.container).find('.sidebar-tab').removeClass('active');
    $(this.emailBuilder.container).find(`.sidebar-tab[data-tab="${tab}"]`).addClass('active');
    
    // Show/hide panels
    $(this.emailBuilder.container).find('.sidebar-panel').hide();
    $(this.emailBuilder.container).find(`#sidebar-${tab}-panel`).show();
    
    if (tab === 'design' && this.emailBuilder.selectedBlockId) {
      const block = this.emailBuilder.document[this.emailBuilder.selectedBlockId];
      if (block) {
        this.emailBuilder.renderSidebar(this.emailBuilder.selectedBlockId, block);
      }
    }
  }
}

