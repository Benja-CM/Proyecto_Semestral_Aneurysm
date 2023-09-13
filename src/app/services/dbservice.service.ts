import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DbserviceService {
  // variable para guardar la conexión a la DB
  public database!: SQLiteObject;

  tablaRol: string = "CREATE TABLE IF NOT EXISTS rol (id_rol INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR(120) NOT NULL;)";
  tablaPregunta: string = "CREATE TABLE IF NOT EXISTS pregunta (id_preg INTEGER PRIMARY KEY AUTOINCREMENT, pregunta VARCHAR(120) NOT NULL;)";
  tablaUsuario: string = "CREATE TABLE IF NOT EXISTS usuario (id_usuario INTEGER PRIMARY KEY AUTOINCREMENT, rut VARCHAR(9) NOT NULL, dvrut VARCHAR(1) NOT NULL, nombre VARCHAR(60) NOT NULL, apellido_pa  VARCHAR(60) NOT NULL, apellido_ma  VARCHAR(60) NOT NULL, telefono VARCHAR(9) NOT NULL, correo VARCHAR(40) NOT NULL, clave VARCHAR(30) NOT NULL, respuesta VARCHAR(30) NOT NULL, rol INTEGER, pregunta INTEGER, FOREIGN KEY (rol) REFERENCES Rol(id_rol), FOREIGN KEY (pregunta) REFERENCES Pregunta(id_preg);)";

  tablaRegion: string = "CREATE TABLE IF NOT EXISTS region (id_region INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR(60) NOT NULL;)";
  tablaComuna: string = "CREATE TABLE IF NOT EXISTS comuna (id_comuna INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR(60) NOT NULL, cost_envio INTEGER NOT NULL, region INTEGER, FOREIGN KEY (region) REFERENCES Region(id_region);)";
  tablaDireccion: string = "CREATE TABLE IF NOT EXISTS direccion (id_rol INTEGER PRIMARY KEY AUTOINCREMENT, calle VARCHAR(40) NOT NULL, numero INTEGER NOT NULL, cod_postal INTEGER NOT NULL, comuna INTEGER, FOREIGN KEY (comuna) REFERENCES Comuna(id_comuna);)";

  tablaCategoria: string = "CREATE TABLE IF NOT EXISTS categoria (id_cat INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR(60) NOT NULL;)";
  tablaProducto: string = "CREATE TABLE IF NOT EXISTS producto (id_prod INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR(120) NOT NULL, descripcion VARCHAR(600) NOT NULL, precio INTEGER NOT NULL, stock INTEGER NOT NULL, foto TEXT NOT NULL, categoria INTEGER, FOREIGN KEY (categoria) REFERENCES Categoria(id_cat);)";

  tablaDetalle: string = "CREATE TABLE IF NOT EXISTS detalle (id_detalle INTEGER PRIMARY KEY AUTOINCREMENT, cantidad INTEGER NOT NULL, subtotal INTEGER NOT NULL;)";
  tablaCompra: string = "CREATE TABLE IF NOT EXISTS compra (id_compra INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR(60) NOT NULL, fech_compra DATE NOT NULL, fech_despacho DATE NOT NULL, fech_entrega DATE NOT NULL, costo_desp INTEGER NOT NULL, total INTEGER NOT NULL, carrito BOOLEAN NOT NULL, estado VARCHAR(30) NOT NULL, detalle INTEGER, FOREIGN KEY (detalle) REFERENCES Detalle(id_detalle);)";

  //observable para manipular el estado de la DB
  private isdDBReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private sqlite: SQLite,
    private platform: Platform,
    private alertController: AlertController) {
      this.crearDB();
  }

  crearDB() {
    //verificar plataforma
    this.platform.ready().then(() => {
      //creamos la DB
      this.sqlite.create({
        name: 'DBApplication.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        //guardar conexion a DB
        this.database = db;
        //llamar a la función para que cree las tablas
        this.crearTabla();
      }).catch(e => {
        this.presentAlert("Error al crear Base de datos: " + e);
      })

    })
  }

  async crearTabla() {
    try {
      //ejecutar los create table
      await this.database.executeSql(this.tablaRol, []);
      await this.database.executeSql(this.tablaPregunta, []);
      await this.database.executeSql(this.tablaUsuario, []);
      
      await this.database.executeSql(this.tablaRegion, []);
      await this.database.executeSql(this.tablaComuna, []);
      await this.database.executeSql(this.tablaDireccion, []);

      await this.database.executeSql(this.tablaCategoria, []);
      await this.database.executeSql(this.tablaProducto, []);

      await this.database.executeSql(this.tablaDetalle, []);
      await this.database.executeSql(this.tablaCompra, []);

      //actualizamos el observable de la DB
      this.isdDBReady.next(true);
    } catch (e) {
      this.presentAlert("Error al crear Base de datos: " + e);
    }
  }


  async presentAlert(msj: string) {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Important message',
      message: 'This is an alert!',
      buttons: ['OK'],
    });

    await alert.present();
  }
}
