import { Component } from "./component/Component";
import { popupService } from "./component/Popupservice";
import Signal from "./signal";

class ChatModel{
  socket: WebSocket;
  userList: Array<string> = [];
  onMessage: Signal<string> = new Signal();
  onUserList: Signal<Array<string>> = new Signal();
  constructor(){
    this.socket = new WebSocket('ws:/localhost:4080');
    this.socket.onopen = () =>{
      this.joinUser();
    }

    this.socket.onmessage = (ev)=>{
      let data = JSON.parse(ev.data);
      console.log(data);
      if (data.type === 'message'){
        this.onMessage.emit(data.senderNick +' -> '+data.messageText);
      }
      /*if (data.type = 'userLeave'){
        this.onMessage.emit(data.senderNick);
      }
      if (data.type = 'userJoin'){
        this.onMessage.emit(data.senderNick);
      }*/
      if (data.type === 'userList'){
        this.onUserList.emit(data.userList);
      }
    }
  }

  sendMessage(message: string) {
    this.socket.send(JSON.stringify({
      service: 'chat',
      endpoint: 'sendMessage',
      params:{
        messageText: message, 
        sessionId: localStorage.getItem('todoListApplicationSessionId')
      }
    }));
    
  }

  joinUser() {
    this.socket.send(JSON.stringify({
      service: 'chat',
      endpoint: 'joinUser',
      params:{
        sessionId: localStorage.getItem('todoListApplicationSessionId')
      }
    }));
    
  }

}

export class  Chat extends Component {
    messageContainer: Component;
    chatInput: Component;
    model: ChatModel = new ChatModel();
  userListContainer: Component;

    constructor(parentNode: HTMLElement | null = null) {
      super(parentNode, 'div', ['main']);
      this.userListContainer = new Component(this.element);
      this.messageContainer = new Component(this.element);
      this.chatInput = new Component(this.element, 'input');
      this.model.onMessage.add((message)=>{
        let msg = new Component(this.messageContainer.element, 'div',[], message);
      });

      this.model.onUserList.add((userList)=>{
        this.userListContainer.element.textContent = userList.join(', ');
      });
      /*setTimeout(()=>{
        this.model.joinUser();
      }, 1000)*/
      
      this.chatInput.element.onkeyup =(e)=>{
        if (e.key=='Enter'){
          this.model.sendMessage((this.chatInput.element as HTMLInputElement).value);
          (this.chatInput.element as HTMLInputElement).value = '';
        }
      }
    }
  }