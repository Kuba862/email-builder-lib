import './styles/main.css';
import { EmailBuilder } from './core/EmailBuilder';
import { BlockRegistry } from './core/BlockRegistry';
import { HTMLRenderer } from './core/HTMLRenderer';

// Rejestracja podstawowych bloków
import { ContainerBlock } from './blocks/ContainerBlock';
import { TextBlock } from './blocks/TextBlock';
import { HeadingBlock } from './blocks/HeadingBlock';
import { ImageBlock } from './blocks/ImageBlock';
import { ButtonBlock } from './blocks/ButtonBlock';
import { DividerBlock } from './blocks/DividerBlock';
import { SpacerBlock } from './blocks/SpacerBlock';
import { ColumnsBlock } from './blocks/ColumnsBlock';

// Rejestracja bloków
BlockRegistry.register('Container', ContainerBlock);
BlockRegistry.register('Text', TextBlock);
BlockRegistry.register('Heading', HeadingBlock);
BlockRegistry.register('Image', ImageBlock);
BlockRegistry.register('Button', ButtonBlock);
BlockRegistry.register('Divider', DividerBlock);
BlockRegistry.register('Spacer', SpacerBlock);
BlockRegistry.register('Columns', ColumnsBlock);

// Eksport dla globalnego użycia (gdy biblioteka jest załadowana przez <script>)
// To jest najważniejsze - ustawiamy EmailBuilder jako globalną zmienną
if (typeof window !== 'undefined') {
  window.EmailBuilder = EmailBuilder;
  window.EmailBuilderCore = {
    BlockRegistry,
    HTMLRenderer
  };
}

// Eksport dla CommonJS
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EmailBuilder;
  module.exports.EmailBuilder = EmailBuilder;
  module.exports.BlockRegistry = BlockRegistry;
  module.exports.HTMLRenderer = HTMLRenderer;
}

// Eksport dla ES6 modules
export default EmailBuilder;
export { EmailBuilder, BlockRegistry, HTMLRenderer };

