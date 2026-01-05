import './styles/main.css';
import { EmailBuilder } from './core/EmailBuilder';
import { BlockRegistry } from './core/BlockRegistry';
import { HTMLRenderer } from './core/HTMLRenderer';

// Registration of basic blocks
import { ContainerBlock } from './blocks/ContainerBlock';
import { TextBlock } from './blocks/TextBlock';
import { HeadingBlock } from './blocks/HeadingBlock';
import { ImageBlock } from './blocks/ImageBlock';
import { ButtonBlock } from './blocks/ButtonBlock';
import { DividerBlock } from './blocks/DividerBlock';
import { SpacerBlock } from './blocks/SpacerBlock';
import { ColumnsBlock } from './blocks/ColumnsBlock';

// Registration of blocks
BlockRegistry.register('Container', ContainerBlock);
BlockRegistry.register('Text', TextBlock);
BlockRegistry.register('Heading', HeadingBlock);
BlockRegistry.register('Image', ImageBlock);
BlockRegistry.register('Button', ButtonBlock);
BlockRegistry.register('Divider', DividerBlock);
BlockRegistry.register('Spacer', SpacerBlock);
BlockRegistry.register('Columns', ColumnsBlock);

// Export for global usage (when library is loaded by <script>)
// This is the most important - we set EmailBuilder as a global variable
if (typeof window !== 'undefined') {
  window.EmailBuilder = EmailBuilder;
  window.EmailBuilderCore = {
    BlockRegistry,
    HTMLRenderer
  };
}

// Export for CommonJS
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EmailBuilder;
  module.exports.EmailBuilder = EmailBuilder;
  module.exports.BlockRegistry = BlockRegistry;
  module.exports.HTMLRenderer = HTMLRenderer;
}

// Export for ES6 modules
export default EmailBuilder;
export { EmailBuilder, BlockRegistry, HTMLRenderer };

