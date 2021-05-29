import { Component } from "./Component";
import { DashBoardController } from "./Dashboardcontroller";
import { DashboardItem } from "./Dashboarditem";
import { DashBoardModel } from "./Dashboardmodel";
import { IDashboardRecord } from "./IdashboardRecord";
import { popupService } from "./Popupservice";


export class Dashboard extends Component {
    private items: Array<DashboardItem> = [];
    public model: DashBoardModel;
    private controller: DashBoardController;
    constructor(parentNode: HTMLElement | null = null) {
      super(parentNode, 'div', ['list']);
      this.model = new DashBoardModel();
      this.controller = new DashBoardController(this.model);
      this.model.onUpdate.add((data) => {
        this.setData(data);
      });
    }
  
    private addItem(data: IDashboardRecord, index: number) {
      const dashboardItem = new DashboardItem(this.element);
      dashboardItem.setData(data);
      dashboardItem.onDelete = () => {
        this.controller.deleteItem(index);
      };
  
  
      dashboardItem.onEdit = () => {      
        popupService.showEditPopup(
          (obj) => {
            this.controller.editItem(obj, index);
            return null;
          },
          () => {},
          data
        );
      };
      this.items.push(dashboardItem);
    }
  
    private setData(data: Array<IDashboardRecord>) {
      this.clear();
      data.forEach((item, index) => this.addItem(item, index));
    }
  
    private clear() {
      this.items.forEach((item) => item.destroy());
      this.items = [];
    }
  }