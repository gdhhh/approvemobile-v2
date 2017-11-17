import { Device } from '@ionic-native/device';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import 'rxjs/add/operator/map';


/**
  使用说明：
  建表：
  this.sqlService.execSql(obj.sql).then(() => {
                console.info(obj.desc, '表名:', obj.tableName, '创建成功');
            }).catch(err => {
                console.error("出错了", err.error.message);
            });
  更新：
  let sql = "update depot set depot_name='" + data.depot_name + "' where depot_no='" + item.depot_no + "'";
                this.sqlService.execSql(sql, []).then(() => {

                }).catch((err) => {
                    console.error(err);
                });
            }
  查询：
  let output = [];
  let sql = "select * from XXX";
        this.sqlService.execSql(sql, []).then((data) => {
            for (let i = 0; i < data.res.rows.length; i++) {
                output.push(data.res.rows.item(i));
            }
             console.log(output );
        }).catch((err) => {
            console.error(err);
        });
 */
@Injectable()
export class SqlServiceProvider {
  private _browserDB: any;
  private _deviceDB: SQLiteObject;
  private win: any = window;

  constructor(public http: Http,
    public sqlite: SQLite,
    public device: Device
  ) {
    //区分平台
    if (this.device.platform == "iOS" || this.device.platform == "Android") {
      sqlite.create({
        name: 'appdata.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        this._deviceDB = db;
        // db.executeSql('CREATE TABLE ICONS (ID integer,NAME TEXT,RIGHT integer)', {}).then(() => {
        //   console.log('执行sql');
        // }).catch(e => console.log(e))
      });
    } else {
      this._browserDB = sqlite.create({
        name: 'appdata.db',
        location: 'default'
      })
    }
  }


  /**
    * 执行SQL语句，返回一个承诺,通过 .then(result=>{}).catch(err=>{})来处理结果
    * @param sql  sql语句
    * @param params sql参数值，可选参数，只有sql语句中用到 ? 传参方式时，params参数值才有效
    */
  execSql(sql: string, params = []): Promise<any> {
    if (this.device.platform == "iOS" || this.device.platform == "Android") {
      return this._deviceDB.executeSql(sql, {})
          .then(res => {
            console.log('执行sql' + res);
            return res;
          }).catch(e =>
            console.log(e)
          );
    } else {
      return new Promise((resolve, reject) => {
        try {
          this._browserDB.transaction((tx) => {
            tx.executeSql(sql, params,
              (tx, res) => resolve({ tx: tx, res: res }),
              (tx, err) => reject({ tx: tx, err: err }));
          },
            (err) => reject({ err: err }));
        } catch (err) {
          reject({ err: err });
        }
      });
    }
  }


  /**
   * 检查表名是否存在
   * 存在返回true,不存在返回false
   * @param tableName 表名
   */
  checkIsTableExist(tableName) :Promise<boolean> {
    let sql = 'SELECT name FROM sqlite_master WHERE type="table" AND name="'+tableName+'"';
    let db = this._browserDB;
    //检查表是否存在   
    if (this.device.platform == "iOS" || this.device.platform == "Android"){
      db = this._deviceDB
    }

    return db.executeSql(sql,{}).then(data => {
      let result: any;
      if (this.device.platform == "iOS" || this.device.platform == "Android") {
        result = data;
      } else {
        result = data.res;
      }
      if(result.rows && result.rows.length > 0){
        //数据表存在，不需要创建
        return true;
      }else{
        //数据表不存在，创建新表
        return false;
      }
      
    }).catch((err) => {
      console.log(err);
      return false;
    });   
  }

  /**
   * 检查是否有ICON自定义权限
   * 存在返回true,不存在返回false
   * @param sql 
   */
  checkIsSetIconRights(sql) :Promise<any> {
    let db = this._browserDB;
    //检查是否自定义权限   
    if (this.device.platform == "iOS" || this.device.platform == "Android"){
      db = this._deviceDB
    }
    return db.executeSql(sql,{}).then(data => {
      let result: any;
      if (this.device.platform == "iOS" || this.device.platform == "Android") {
        result = data;
      } else {
        result = data.res;
      }
      if(result.rows && result.rows.length > 0){
        //数据表存在，不需要创建
        return true;
      }else{
        //数据表不存在，创建新表
        return false;
      }
      
    }).catch((err) => {
      console.log(err);
      return false;
    });   
  }

  query(sql: string, params = []) :Promise<any> {
    let output = [];
    if (this.device.platform == "iOS" || this.device.platform == "Android") {
      return this._deviceDB.executeSql(sql, {})
          .then(res => {
            console.log('执行sql' + res);
            return res;
          }).catch(e =>
            console.log(e)
          );
    }
      // if (this.device.platform == "iOS" || this.device.platform == "Android") {
      //   result = data;
      // } else {
      //   result = data.res;
      // }
      // for (let i = 0; i < result.rows.length; i++) {
      //   output.push(result.rows.item(i));
      // }
      // return output;
  
  }
}
