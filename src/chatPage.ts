import { Component } from "./component/Component";
import { popupService } from "./component/Popupservice";
import Signal from "./signal";

class ChatModel{
  socket: WebSocket;
  onMessage: Signal<string> = new Signal();
  constructor(){
    this.socket = new WebSocket('ws:/localhost:4080');
    this.socket.onmessage = (ev)=>{
      this.onMessage.emit(ev.data);
    }
  }

  sendMessage(message: string) {
    this.socket.send(message);
    
  }

}

export class  Chat extends Component {
    messageContainer: Component;
    chatInput: Component;
    model: ChatModel = new ChatModel();

    constructor(parentNode: HTMLElement | null = null) {
      super(parentNode, 'div', ['main']);
      this.messageContainer = new Component(this.element);
      this.chatInput = new Component(this.element, 'input');
      this.model.onMessage.add((message)=>{
        let msg = new Component(this.messageContainer.element, 'div',[], message);
      });
      this.chatInput.element.onkeyup =(e)=>{
        if (e.key=='Enter'){
          this.model.sendMessage((this.chatInput.element as HTMLInputElement).value);
          (this.chatInput.element as HTMLInputElement).value = '';
        }
      }
    }
  }