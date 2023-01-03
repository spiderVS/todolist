import Button from './components/button';
import Control from './components/control';
import Database from './components/database'

interface MyRecord{
  fsdg: number;
  fdgfsdg: string;
  name: string;
  email: string; 
  id?: IDBValidKey;  
}

class Application {
  public iDB: Database;

  constructor(parentNode:HTMLElement) {
    this.iDB = new Database();
    this.iDB.init('testdb');

    let readAllButton = new Button(parentNode, 'list1');
    readAllButton.onClick = async () => {
      let arr = await this.iDB.readAll<MyRecord>('testCollection');
      console.log(arr);
    }

    let filterButton = new Button(parentNode, 'filtered list');
    filterButton.onClick = async () => {
        let result = await this.iDB.readFiltered<MyRecord>('testCollection', (item)=>item.email.length<2);
     // let newRec = await this.iDB.write<MyRecord>('testCollection', {fsdg:34, fdgfsdg:'fdgdsg', name:'fdgdg', email:'adgsergfdt4'});
      console.log('-> ',  result);
    }
  }
}

export default Application;