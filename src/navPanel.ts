import { Component } from "./component/Component";

export class Navigation extends Component {
    constructor(parentNode: HTMLElement | null = null) {
      super(parentNode);

    }

    addLink(text:string, hash:string){
      let link = new Component(this.element, 'a');
      let linkElement = link.element as HTMLAnchorElement;
      linkElement.href = '#'+hash;
      linkElement.textContent = text;
    }
  }