import Control from './control';

class Button extends Control {
  public node: HTMLButtonElement;
  public onClick: () => void;

  constructor(parentNode: HTMLElement, caption: string) {
    super(parentNode, 'button', 'button', caption);
    this.node.classList.add(caption)
    this.node.onclick = () => {
      console.log(`${caption}`)
      this.onClick && this.onClick();
    }
  }
}

export default Button;
