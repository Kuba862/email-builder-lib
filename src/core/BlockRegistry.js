export class BlockRegistry {
  static blocks = {};

  static register(type, blockClass) {
    this.blocks[type] = blockClass;
  }

  static get(type) {
    return this.blocks[type];
  }

  static getAll() {
    return Object.keys(this.blocks);
  }

  static createBlock(type, data = {}) {
    const BlockClass = this.get(type);
    if (!BlockClass) {
      throw new Error(`Block type "${type}" is not registered`);
    }
    return new BlockClass(data);
  }
}

