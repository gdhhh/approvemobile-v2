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
      this._deviceDB.executeSql(sql,{}).then(() => {
        console.log('执行sql');
      }).catch(e => console.log(e))
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

}
