import './styles.scss';
import './header.scss';
import Signal from './signal';
import { PopupService, popupService } from './component/Popupservice';
import { Component } from './component/Component';
import {Chat} from './chatPage';
import { Header } from './component/Header';
import { Main } from './component/Main';
import { Auth } from './authPage';
import {Route, Router} from './router';
import {Navigation} from './navPanel';
import { ChessPage } from './chessPage';



class App extends Component {
  //header: Header;
  main: Main;
  chat: Chat;
  auth: Auth;
  popupLayer: Component;
  navigation: Navigation;
  router: Router;
  pageContainer: Component;
  chess: ChessPage;

  constructor(parentNode: HTMLElement, popupService: PopupService) {
    super(parentNode, 'div', ['body']);
    //this.header = new Header(this.element);
    this.navigation = new Navigation(this.element);
    this.router = new Router();
    this.pageContainer = new Component(this.element);

    this.auth = new Auth(this.pageContainer.element);
    this.chat = new Chat(this.pageContainer.element);
    this.main = new Main(this.pageContainer.element);
    this.chess = new ChessPage(this.pageContainer.element);
    
    this.addPage('чат', 'chat', this.chat);
    this.addPage('авторизация', 'auth', this.auth);
    this.addPage('тудушки', 'todos', this.main);
    this.addPage('шахматы', 'shess', this.chess);

    this.popupLayer = new Component(this.element);
    popupService.init(this.popupLayer.element);

    this.router.processHash();
  }

  addPage(linkName: string, pageName:string, pageComponent:Component){
    let route = new Route(pageName, linkName, ()=>{
      pageComponent.element.style.display = '';
      this.navigation.setActive(pageName);
    },()=>{
      pageComponent.element.style.display = 'none';
    });
    this.navigation.addLink(linkName, pageName);
    this.router.addRoute(route);
  }
}


const app = new App(document.body, popupService);
(window as any).app = app;
