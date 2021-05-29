import { DashBoardModel } from "./Dashboardmodel";
import { IDashboardRecord } from "./IdashboardRecord";

export class DashBoardController {
    constructor(private model: DashBoardModel) {}
  
    deleteItem(index: number) {
      this.model.setData(
        this.model.getData().filter((item, i) => {
          return index !== i;
        })
      );
    }
  
    editItem(obj: IDashboardRecord, index: number) {
      this.model.setData(
        this.model.getData().map((item, i) => {
          if (index == i) {
            return obj;
          }
          return item;
        })
      );
    }
  }