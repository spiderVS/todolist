import Signal from "../signal";
import { IDashboardRecord } from "./IdashboardRecord";

const apiUrl = 'http://localhost:4040/todoListService/';

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

export class DashBoardServerModel {
  state: DashBoardModel;
  constructor() {
    this.state = new DashBoardModel();
  }

  getList() {
    fetch(`${apiUrl}read`).then(res => res.json()).then(list => {
      this.state.setData(list);
    })
  }

  addRecord(record: IDashboardRecord) {
    let base64Record = btoa(JSON.stringify(record));
    fetch(`${apiUrl}write?record=${base64Record}`).then(res => res.text()).then(() => {
      this.getList();
    });
  }

  deleteRecord(id:string) {
    fetch(`${apiUrl}delete?id=${id}`).then(res => res.text()).then(() => {
      this.getList();
    });
  }

  updateRecord(record: IDashboardRecord, id:string) {
    let base64Record = btoa(JSON.stringify(record));
    fetch(`${apiUrl}update?id=${id}&record=${base64Record}`).then(res => res.text()).then(() => {
      this.getList();
    });
  }

}