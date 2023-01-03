export default class Core {
  public node: HTMLElement;

  constructor(
    parentNode: HTMLElement | null = null,
    tagName: keyof HTMLElementTagNameMap = 'div',
    className = '',
    textContent = ''
  ) {
    const element = document.createElement(tagName);
    element.className = className;
    element.innerHTML = textContent;
    parentNode && parentNode.append(element);
    this.node = element;
  }

  destroy(): void {
    this.node.remove();
  }
}
