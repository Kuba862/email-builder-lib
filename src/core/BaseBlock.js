export class BaseBlock {
  constructor(data = {}) {
    this.data = {
      ...this.getDefaultData(),
      ...data
    };
  }

  getDefaultData() {
    return {
      style: {},
      props: {}
    };
  }

  render() {
    throw new Error('render() method must be implemented');
  }

  getStyleString() {
    if (!this.data.style) return '';
    
    const style = this.data.style;
    const styleParts = [];

    if (style.padding) {
      const p = style.padding;
      styleParts.push(`padding: ${p.top || 0}px ${p.right || 0}px ${p.bottom || 0}px ${p.left || 0}px;`);
    }

    if (style.margin) {
      const m = style.margin;
      styleParts.push(`margin: ${m.top || 0}px ${m.right || 0}px ${m.bottom || 0}px ${m.left || 0}px;`);
    }

    if (style.backgroundColor) {
      styleParts.push(`background-color: ${style.backgroundColor};`);
    }

    if (style.textAlign) {
      styleParts.push(`text-align: ${style.textAlign};`);
    }

    if (style.fontSize) {
      styleParts.push(`font-size: ${style.fontSize}px;`);
    }

    if (style.fontWeight) {
      styleParts.push(`font-weight: ${style.fontWeight};`);
    }

    if (style.color) {
      styleParts.push(`color: ${style.color};`);
    }

    if (style.width) {
      styleParts.push(`width: ${style.width};`);
    }

    if (style.height) {
      styleParts.push(`height: ${style.height};`);
    }

    return styleParts.join(' ');
  }
}

