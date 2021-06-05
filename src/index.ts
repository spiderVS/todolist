import './styles.scss';
import Signal from './signal';
import { PopupService, popupService } from './component/Popupservice';
import { Component } from './component/Component';
import {Chat} from './chatPage';
import { Header } from './component/Header';
import { Main } from './component/Main';



class App extends Component {
  header: Header;
  //main: Main;
  chat: Chat;
  popupLayer: Component;

  constructor(parentNode: HTMLElement, popupService: PopupService) {
    super(parentNode, 'div', ['body']);
    this.header = new Header(this.element);
    this.chat = new Chat(this.element);//new Main(this.element);
    this.popupLayer = new Component(this.element);
    popupService.init(this.popupLayer.element);
  }
}


const app = new App(document.body, popupService);
(window as any).app = app;
