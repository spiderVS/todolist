import Signal from "../signal";
import { IDashboardRecord } from "./IdashboardRecord";

export class DashBoardModel {
    private items: Array<IDashboardRecord>;
    public onUpdate: Signal<Array<IDashboardRecord>> = new Signal();
    constructor() {
      this.items = [];
    }
  
    setData(data: Array<IDashboardRecord>) {
      const lastData = this.items;
      this.items = data;
      this.onUpdate.emit(this.items);
    }
  
    getData() {
      return this.items;
    }
  }