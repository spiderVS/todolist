import Control from './control';

class Button extends Control {
  public node: HTMLButtonElement;
  public onClick: () => void;

  constructor(parentNode: HTMLElement, caption: string) {
    super(parentNode, 'button', '', caption);
    this.node.onclick = () => {
      this.onClick && this.onClick();
    }
  }
}

export default Button;