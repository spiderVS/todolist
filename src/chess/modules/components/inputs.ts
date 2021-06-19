import Control from './control';
import Signal from './signal';

class Input extends Control {
  public node: HTMLInputElement;
  public onClick: () => void;
  public onValidate: (param: string) => string | null;
  public onInput: Signal<string | void> = new Signal();
  public onChange: Signal<string | void> = new Signal();
  error: Control;
  field: Control;
  caption: Control;
  name: string;
  constructor(parentNode: HTMLElement, caption: string, onValidate: (param: string) => string | null, placeHolder: string = '', type: string, id = 'input') {
    super(parentNode, 'div', 'authform_input');
    this.node.type = type;
    this.node.placeholder = `${placeHolder}`;
    this.name = caption;
    this.caption = new Control(this.node, 'div', 'caption');
    this.caption.node.innerHTML = caption;
    this.field = new Control(this.node, 'input', 'field_input', `${id}`);
    this.error = new Control(this.node, 'div', 'input_error');
    this.onValidate = onValidate;
    this.field.node.classList.add('invalid')
    this.field.node.addEventListener('input', (e) => {
      if (this.onValidate) {
        this.setError(this.onValidate(this.getValue()));
      }
      if (this.onChange) {
        this.onChange.emit(`${this.field.node.classList[1] === 'valid' && (this.field.node as HTMLInputElement).value !== ''}`)
        this.setError(this.onValidate(this.getValue()));
      }
    });
    this.node.oninput = () => {
      console.log(`${this.node.value}`)
      this.onClick && this.onClick();
    }
  }
  getValue() {
    let inputValue = (this.field.node as HTMLInputElement).value;
    return inputValue;
  }
  setError(err: string | null) {
    if (err === null) {
      this.error.node.innerHTML = 'ok';
      this.field.node.classList.remove('invalid');
      this.field.node.classList.add('valid');
    } else {
      this.error.node.textContent = err;
      this.field.node.classList.add('invalid')
      this.field.node.classList.remove('valid');
    }

  }
  //     clearInput(){
  //         (this.field.element as HTMLInputElement).value = '';
  //         this.field.element.classList.add('invalid');
  //         if (this.onValidate) {
  //             this.setError(this.onValidate(this.getValue()));
  //         }
  //         if (this.onChange) {
  //             this.onChange.emmit(`${this.field.element.classList[1]==='valid' && (this.field.element as HTMLInputElement).value !==''}` )
  //             this.setError(this.onValidate(this.getValue()));
  //         }
  //     }

}

export default Input;
