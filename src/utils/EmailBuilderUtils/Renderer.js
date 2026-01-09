import { BlockRegistry } from '../../core/BlockRegistry';
import { createContentBlockItemHTML } from '../HtmlElements/ContentBlockItem';
import { createEmailBuilderLayoutHTML } from '../HtmlElements/EmailBuilderLayout';

export class Renderer {
  constructor(emailBuilder) {
    this.emailBuilder = emailBuilder;
  }

  render() {
    const $container = $(this.emailBuilder.container);
    $container.empty();

    // Main layout - Mailchimp style
    const layoutHtml = createEmailBuilderLayoutHTML(this.emailBuilder.options, this.emailBuilder.activeTab);
    $container.html(layoutHtml);

    this.renderContentBlocks();
    this.emailBuilder.renderPreview();
    this.emailBuilder.dragAndDropHandler.attach();
  }

  renderContentBlocks() {
    const $grid = $('#content-blocks-grid');
    const blockTypes = BlockRegistry.getAll();

    $grid.empty();
    
    blockTypes.forEach(type => {
      const html = createContentBlockItemHTML(type);
      const $block = $(html);
      $grid.append($block);
    });
  }
}

