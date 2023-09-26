import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Rol } from './User/rol';
import { Pregunta } from './User/pregunta';
import { Usuario } from './User/usuario';
import { Region } from './Direction/region';
import { Comuna } from './Direction/comuna';
import { Direccion } from './Direction/direccion';
import { Categoria } from './Product/categoria';
import { Producto } from './Product/producto';
import { Detalle } from './Purchase/detalle';
import { Compra } from './Purchase/compra';
import { CPUnion } from './Product/cp-union';

@Injectable({
  providedIn: 'root'
})
export class DbserviceService {
  // variable para guardar la conexión a la DB
  public database!: SQLiteObject;

  tablaRol: string = "CREATE TABLE IF NOT EXISTS Rol (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR(120) NOT NULL);";
  tablaPregunta: string = "CREATE TABLE IF NOT EXISTS Pregunta (id INTEGER PRIMARY KEY AUTOINCREMENT, pregunta VARCHAR(120) NOT NULL);";
  tablaUsuario: string = "CREATE TABLE IF NOT EXISTS Usuario (id INTEGER PRIMARY KEY AUTOINCREMENT, rut VARCHAR(9), dvrut VARCHAR(1), nombre VARCHAR(60), apellido_pa  VARCHAR(60), apellido_ma  VARCHAR(60), telefono VARCHAR(9), correo VARCHAR(40) NOT NULL, clave VARCHAR(30) NOT NULL, respuesta VARCHAR(30) NOT NULL, rol INTEGER, pregunta INTEGER, FOREIGN KEY (rol) REFERENCES Rol(id), FOREIGN KEY (pregunta) REFERENCES Pregunta(id));";

  tablaRegion: string = "CREATE TABLE IF NOT EXISTS Region (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR(60) NOT NULL);";
  tablaComuna: string = "CREATE TABLE IF NOT EXISTS Comuna (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR(60) NOT NULL, cost_envio INTEGER NOT NULL, region INTEGER, FOREIGN KEY (region) REFERENCES Region(id));";
  tablaDireccion: string = "CREATE TABLE IF NOT EXISTS Direccion (id INTEGER PRIMARY KEY AUTOINCREMENT, calle VARCHAR(40) NOT NULL, numero INTEGER NOT NULL, cod_postal INTEGER NOT NULL, comuna INTEGER, usuario INTEGER, FOREIGN KEY (comuna) REFERENCES Comuna(id), FOREIGN KEY (usuario) REFERENCES Usuario(id));";

  tablaCategoria: string = "CREATE TABLE IF NOT EXISTS Categoria (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR(60) NOT NULL);";
  tablaProducto: string = "CREATE TABLE IF NOT EXISTS Producto (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR(120) NOT NULL, descripcion VARCHAR(600) NOT NULL, precio INTEGER NOT NULL, stock INTEGER NOT NULL, foto TEXT NOT NULL);";
  tablaCP_union: string = "CREATE TABLE IF NOT EXISTS CP_union (id INTEGER PRIMARY KEY AUTOINCREMENT, producto INTEGER, categoria INTEGER, FOREIGN KEY (producto) REFERENCES Producto(id), FOREIGN KEY (categoria) REFERENCES Categoria(id));";

  tablaDetalle: string = "CREATE TABLE IF NOT EXISTS Detalle (id INTEGER PRIMARY KEY AUTOINCREMENT, cantidad INTEGER NOT NULL, subtotal INTEGER NOT NULL, producto INTEGER,FOREIGN KEY (producto) REFERENCES Detalle(id));";
  tablaCompra: string = "CREATE TABLE IF NOT EXISTS Compra (id INTEGER PRIMARY KEY AUTOINCREMENT, fech_compra DATE NOT NULL, fech_despacho DATE NOT NULL, fech_entrega DATE NOT NULL, costo_desp INTEGER NOT NULL, total INTEGER NOT NULL, carrito BOOLEAN NOT NULL, estado VARCHAR(30) NOT NULL, usuario INTEGER, detalle INTEGER, FOREIGN KEY (usuario) REFERENCES Usuario(id), FOREIGN KEY (detalle) REFERENCES Detalle(id));";

  //------------------//
  /* INSERT DE DATOS */
  //------------------//

  //Insert de Roles
  insertRolCliente: string = "INSERT INTO OR IGNORE Rol (id,nombre) VALUES (1, 'cliente');";
  insertRolVendedor: string = "INSERT INTO OR IGNORE Rol (id,nombre) VALUES (2, 'vendedor');";
  insertRolAdministrador: string = "INSERT INTO OR IGNORE Rol (id,nombre) VALUES (3, 'administrador');";

  //Insert de Preguntas
  insertPregunta1: string = "INSERT INTO Pregunta (id,pregunta) VALUES (1, '¿Como se llamó tu primera mascota?');";
  insertPregunta2: string = "INSERT INTO Pregunta (id,pregunta) VALUES (2, '¿Como se llama tu primera pareja?');";
  insertPregunta3: string = "INSERT INTO Pregunta (id,pregunta) VALUES (3, '¿Cual es tu modelo de tanque favorito?');";

  //Insert de Usuarios
  insertUsuario1: string = "INSERT INTO Usuario (id,correo,clave,respuesta,pregunta,rol) VALUES (1, 'benj@gmail.com','hipo4521','No',2,1);";

  //Insert de Categorias
  insertCat1: string = "INSERT INTO Categoria (id,nombre) VALUES (1, 'RPG');";
  insertCat2: string = "INSERT INTO Categoria (id,nombre) VALUES (2, 'Acción');";
  insertCat3: string = "INSERT INTO Categoria (id,nombre) VALUES (3, 'Aventura');";
  insertCat4: string = "INSERT INTO Categoria (id,nombre) VALUES (4, 'Rol');";

  //variables para guardar los observables
  actualizarDB = new BehaviorSubject([]);

  //observable para manipular el estado de la DB
  private isdDBReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private sqlite: SQLite,
    private platform: Platform,
    private alertController: AlertController) {
    this.crearDB();
  }


  //-----------------------------------------//
  /* FUNCIONES PARA TRBAJAR CON LA TABLA ROL */
  //-----------------------------------------//

  buscarRol() {
    return this.database.executeSql('SELECT * FROM Rol', []).then(res => {
      //variable para almacenar los registros
      let items: Rol[] = [];

      //validamos la cantidad de registros
      if (res.rows.length > 0) {
        //recorrer el arreglo items
        for (var i = 0; i < res.rows.length; i++) {
          //Guardar dentro de la variable
          items.push({
            id: res.rows.item(i).id,
            nombre: res.rows.item(i).nombre
          })
        }
      }
      //Actualizamos el observable
      this.actualizarDB.next(items as any);
    }).catch(e => {
      this.presentAlert("Error de buscar en Base de datos (Tabla Rol): " + e);
    })
  }

  //----------------------------------------------//
  /* FUNCIONES PARA TRBAJAR CON LA TABLA PREGUNTA */
  //----------------------------------------------//

  buscarPregunta() {
    return this.database.executeSql('SELECT * FROM Pregunta', []).then(res => {
      //variable para almacenar los registros
      let items: Pregunta[] = [];

      //validamos la cantidad de registros
      if (res.rows.length > 0) {
        //recorrer el arreglo items
        for (var i = 0; i < res.rows.length; i++) {
          //Guardar dentro de la variable
          items.push({
            id: res.rows.item(i).id,
            pregunta: res.rows.item(i).pregunta
          })
        }
      }
      //Actualizamos el observable
      this.actualizarDB.next(items as any);
    }).catch(e => {
      this.presentAlert("Error de buscar en Base de datos (Tabla Pregunta): " + e);
    })
  }

  //------------------------------------------//
  /* FUNCIONES PARA TRABAJAR LA TABLA USUARIO */
  //------------------------------------------//

  buscarUsuario() {
    return this.database.executeSql('SELECT * FROM Usuario', []).then(res => {
      //variable para almacenar los registros
      let items: Usuario[] = [];

      //validamos la cantidad de registros
      if (res.rows.length > 0) {
        //recorrer el arreglo items
        for (var i = 0; i < res.rows.length; i++) {
          //Guardar dentro de la variable
          items.push({
            id: res.rows.item(i).id,
            rut: res.rows.item(i).rut,
            dvrut: res.rows.item(i).dvrut,
            nombre: res.rows.item(i).nombre,
            apellido_pa: res.rows.item(i).apellido_pa,
            apellido_ma: res.rows.item(i).apellido_ma,
            telefono: res.rows.item(i).telefono,
            correo: res.rows.item(i).correo,
            clave: res.rows.item(i).clave,
            respuesta: res.rows.item(i).respuesta,

            //Datos Foraneos
            rol: res.rows.item(i).rol,
            pregunta: res.rows.item(i).pregunta,
          })
        }
      }
      //Actualizamos el observable
      this.actualizarDB.next(items as any);
    }).catch(e => {
      this.presentAlert("Error de buscar en Base de datos (Tabla Usuario): " + e);
    })
  }

  encontrarUsuario(correo: any): Promise<Usuario | null> {
    return new Promise((resolve) => {
      this.database.executeSql('SELECT * FROM Usuario WHERE correo=?', [correo]).then(res => {
        if (res.rows.length > 0) {
          const usuario: Usuario = {
            id: res.rows.item(0).id,
            rut: res.rows.item(0).rut,
            dvrut: res.rows.item(0).dvrut,
            nombre: res.rows.item(0).nombre,
            apellido_pa: res.rows.item(0).apellido_pa,
            apellido_ma: res.rows.item(0).apellido_ma,
            telefono: res.rows.item(0).telefono,
            correo: res.rows.item(0).correo,
            clave: res.rows.item(0).clave,
            respuesta: res.rows.item(0).respuesta,
            rol: res.rows.item(0).rol,
            pregunta: res.rows.item(0).pregunta,
          };
          resolve(usuario);
        } else {
          resolve(null); // No se encontró un usuario con ese correo
        }
      })
        .catch(e => {
          this.presentAlert("Error al buscar en la base de datos (Tabla Usuario): " + e);
        });
    });
  }

  agregarUsuario(correo: any, clave: any, respuesta: any, rol: any, pregunta: any) {
    return this.database.executeSql('INSERT INTO Usuario (correo, clave, respuesta, rol, pregunta) VALUES (?,?,?,?,?);', [correo, clave, respuesta, rol, pregunta]).then(res => {
      this.buscarUsuario();
    }).catch(e => {
      this.presentAlert("Error de agregar nuevos datos Base de datos (Tabla Usuario): " + e);
    })
  }

  actualizarUsuario(id: any, rut: any, dvrut: any, nombre: any, apellido_pa: any, apellido_ma: any, telefono: any, correo: any, clave: any, respuesta: any, rol: any, pregunta: any) {
    return this.database.executeSql('UPDATE Usuario SET rut=?, dvrut=?, nombre=?, apellido_pa=?, apellido_ma=?, telefono=?, correo=?, clave=?, respuesta=?, rol=?, pregunta=?  WHERE id=?;', [rut, dvrut, nombre, apellido_pa, apellido_ma, telefono, correo, clave, respuesta, rol, pregunta, id]).then(res => {
      this.buscarUsuario();
    }).catch(e => {
      this.presentAlert("Error al actualizar datos en la base de datos (Tabla Usuario): " + e);
    })
  }

  borrarUsuario(id: any) {
    return this.database.executeSql('DELETE FROM Usuario WHERE id=?;', [id]).then(res => {
      this.buscarUsuario();
    }).catch(e => {
      this.presentAlert("Error al borrar datos en la base de datos (Tabla Usuario): " + e);
    })
  }

  //--------------------------------------------//
  /* FUNCIONES PARA TRBAJAR CON LA TABLA REGION */
  //--------------------------------------------//

  buscarRegion() {
    return this.database.executeSql('SELECT * FROM Region', []).then(res => {
      //variable para almacenar los registros
      let items: Region[] = [];

      //validamos la cantidad de registros
      if (res.rows.length > 0) {
        //recorrer el arreglo items
        for (var i = 0; i < res.rows.length; i++) {
          //Guardar dentro de la variable
          items.push({
            id: res.rows.item(i).id,
            nombre: res.rows.item(i).nombre
          })
        }
      }
      //Actualizamos el observable
      this.actualizarDB.next(items as any);
    }).catch(e => {
      this.presentAlert("Error de buscar en Base de datos (Tabla Region): " + e);
    })
  }

  //--------------------------------------------//
  /* FUNCIONES PARA TRBAJAR CON LA TABLA COMUNA */
  //--------------------------------------------//

  buscarComuna() {
    return this.database.executeSql('SELECT * FROM Comuna', []).then(res => {
      //variable para almacenar los registros
      let items: Comuna[] = [];

      //validamos la cantidad de registros
      if (res.rows.length > 0) {
        //recorrer el arreglo items
        for (var i = 0; i < res.rows.length; i++) {
          //Guardar dentro de la variable
          items.push({
            id: res.rows.item(i).id,
            nombre: res.rows.item(i).nombre,
            cost_envio: res.rows.item(i).cost_envio,

            //Foranea
            region: res.rows.item(i).region
          })
        }
      }
      //Actualizamos el observable
      this.actualizarDB.next(items as any);
    }).catch(e => {
      this.presentAlert("Error de buscar en Base de datos (Tabla Comuna): " + e);
    })
    /* “Porque ninguna cosa es imposible para Dios.” (Lucas 1:37) */
  }

  //-----------------------------------------------//
  /* FUNCIONES PARA TRABAJAR CON LA TABLA DIRECCION*/
  //-----------------------------------------------//

  buscarDireccion() {
    return this.database.executeSql('SELECT * FROM Direccion', []).then(res => {
      //variable para almacenar los registros
      let items: Direccion[] = [];

      //validamos la cantidad de registros
      if (res.rows.length > 0) {
        //recorrer el arreglo items
        for (var i = 0; i < res.rows.length; i++) {
          //Guardar dentro de la variable
          items.push({
            id: res.rows.item(i).id,
            calle: res.rows.item(i).calle,
            numero: res.rows.item(i).numero,
            cod_postal: res.rows.item(i).cost_envio,

            //Foranea
            comuna: res.rows.item(i).comuna,
            usuario: res.rows.item(i).usuario
          })
        }
      }
      //Actualizamos el observable
      this.actualizarDB.next(items as any);
    }).catch(e => {
      this.presentAlert("Error de buscar en Base de datos (Tabla Direccion): " + e);
    })
  }

  agregarDireccion(calle: any, numero: any, cod_postal: any, comuna: any, usuario: any) {
    return this.database.executeSql('INSERT INTO Direccion (calle,numero,cod_postal,comuna,usuario) VALUES (?,?,?,?,?);', [calle, numero, cod_postal, comuna, usuario]).then(res => {
      this.buscarDireccion();
    }).catch(e => {
      this.presentAlert("Error de agregar nuevos datos Base de datos (Tabla Direccion): " + e);
    })
  }

  actualizarDireccion(id: any, calle: any, numero: any, cod_postal: any, comuna: any, usuario: any) {
    return this.database.executeSql('UPDATE Direccion SET calle=?, numero=?, cod_postal=?, comuna=?, usuario=? WHERE id=?;', [calle, numero, cod_postal, comuna, usuario, id]).then(res => {
      this.buscarDireccion();
    }).catch(e => {
      this.presentAlert("Error al actualizar datos en la base de datos (Tabla Direccion): " + e);
    })
  }

  //-----------------------------------------------//
  /* FUNCIONES PARA TRABAJAR CON LA TABLA CATEGORIA*/
  //-----------------------------------------------//

  buscarCategoria() {
    return this.database.executeSql('SELECT * FROM Categoria', []).then(res => {
      //variable para almacenar los registros
      let items: Categoria[] = [];

      //validamos la cantidad de registros
      if (res.rows.length > 0) {
        //recorrer el arreglo items
        for (var i = 0; i < res.rows.length; i++) {
          //Guardar dentro de la variable
          items.push({
            id: res.rows.item(i).id,
            nombre: res.rows.item(i).nombre
          })
        }
      }
      //Actualizamos el observable
      this.actualizarDB.next(items as any);
    }).catch(e => {
      this.presentAlert("Error de buscar en Base de datos (Tabla Categoria): " + e);
    })
  }

  agregarCategoria(nombre: any) {
    return this.database.executeSql('INSERT INTO Categoria (nombre) VALUES (?);', [nombre]).then(res => {
      this.buscarDireccion();
    }).catch(e => {
      this.presentAlert("Error de agregar nuevos datos Base de datos (Tabla Categoria): " + e);
    })
  }

  borrarCategoria(id: any) {
    return this.database.executeSql('DELETE FROM Categoria WHERE id=?;', [id]).then(res => {
      this.buscarCategoria();
    }).catch(e => {
      this.presentAlert("Error al borrar datos en la base de datos (Tabla Categoria): " + e);
    })
  }

  //-----------------------------------------------//
  /* FUNCIONES PARA TRABAJAR CON LA TABLA PRODUCTO*/
  //-----------------------------------------------//

  buscarProducto() {
    return this.database.executeSql('SELECT * FROM Producto', []).then(res => {
      //variable para almacenar los registros
      let items: Producto[] = [];

      //validamos la cantidad de registros
      if (res.rows.length > 0) {
        //recorrer el arreglo items
        for (var i = 0; i < res.rows.length; i++) {
          //Guardar dentro de la variable
          items.push({
            id: res.rows.item(i).id,
            nombre: res.rows.item(i).nombre,
            descripcion: res.rows.item(i).descripcion,
            precio: res.rows.item(i).precio,
            stock: res.rows.item(i).stock,
            foto: res.rows.item(i).foto
          })
        }
      }

      //Actualizamos el observable
      this.actualizarDB.next(items as any);
    }).catch(e => {
      this.presentAlert("Error de buscar en Base de datos (Tabla Producto): " + e);
    })
  }

  agregarProducto(nombre: any, descripcion: any, precio: any, stock: any, foto: any) {
    return this.database.executeSql('INSERT INTO Producto (nombre, descripcion, precio, stock, foto) VALUES (?,?,?,?,?);', [nombre, descripcion, precio, stock, foto]).then(res => {
      this.buscarProducto();
    }).catch(e => {
      this.presentAlert("Error de agregar nuevos datos Base de datos (Tabla Producto): " + e);
    })
  }

  actualizarProducto(id: any, nombre: any, descripcion: any, precio: any, stock: any, foto: any) {
    return this.database.executeSql('UPDATE producto SET nombre=?, descripcion=?, precio=?, stock=?, foto=? WHERE id=?;', [nombre, descripcion, precio, stock, foto, id]).then(res => {
      this.buscarProducto();
    }).catch(e => {
      this.presentAlert("Error al actualizar datos en la base de datos (Tabla Direccion): " + e);
    })
  }

  borrarProducto(id: any) {
    return this.database.executeSql('DELETE FROM Producto WHERE id=?;', [id]).then(res => {
      this.buscarProducto();
    }).catch(e => {
      this.presentAlert("Error al borrar datos en la base de datos (Tabla Producto): " + e);
    })
  }

  //---------------------------------------------//
  /* FUNCIONES PARA TRABAJAR CON LA TABLA CP_union*/
  //---------------------------------------------//

  buscarUnionCP() {
    return this.database.executeSql('SELECT * FROM CP_union', []).then(res => {
      //variable para almacenar los registros
      let items: CPUnion[] = [];

      //validamos la cantidad de registros
      if (res.rows.length > 0) {
        //recorrer el arreglo items
        for (var i = 0; i < res.rows.length; i++) {
          //Guardar dentro de la variable
          items.push({
            id: res.rows.item(i).id,
            producto: res.rows.item(i).producto,
            categoria: res.rows.item(i).categoria
          })
        }
      }

      //Actualizamos el observable
      this.actualizarDB.next(items as any);
    }).catch(e => {
      this.presentAlert("Error de buscar en Base de datos (Tabla CP_union): " + e);
    })
  }

  agregarUnionCP(producto: any, categoria: any) {
    return this.database.executeSql('INSERT INTO CP_union (producto, categoria) VALUES (?,?);', [producto, categoria]).then(res => {
      this.buscarUnionCP();
    }).catch(e => {
      this.presentAlert("Error de agregar nuevos datos Base de datos (Tabla CP_union): " + e);
    })
  }

  borrarUnionCP(id: any) {
    return this.database.executeSql('DELETE FROM CP_union WHERE id=?;', [id]).then(res => {
      this.buscarUnionCP();
    }).catch(e => {
      this.presentAlert("Error al borrar datos en la base de datos (Tabla CP_union): " + e);
    })
  }

  buscarUnionPorProducto(id: any) {
    return this.database.executeSql('SELECT * FROM CP_union where id=?', [id]).then(res => {
      //variable para almacenar los registros
      let items: CPUnion[] = [];

      //validamos la cantidad de registros
      if (res.rows.length > 0) {
        //recorrer el arreglo items
        for (var i = 0; i < res.rows.length; i++) {
          //Guardar dentro de la variable
          items.push({
            id: res.rows.item(i).id,
            producto: res.rows.item(i).producto,
            categoria: res.rows.item(i).categoria
          })
        }
      }

      //Actualizamos el observable
      this.actualizarDB.next(items as any);
    }).catch(e => {
      this.presentAlert("Error de buscar por ID en Base de datos (Tabla CP_union): " + e);
    })
  }

  //---------------------------------------------//
  /* FUNCIONES PARA TRABAJAR CON LA TABLA DETALLE*/
  //---------------------------------------------//

  buscarDetalle() {
    return this.database.executeSql('SELECT * FROM Detalle', []).then(res => {
      //variable para almacenar los registros
      let items: Detalle[] = [];

      //validamos la cantidad de registros
      if (res.rows.length > 0) {
        //recorrer el arreglo items
        for (var i = 0; i < res.rows.length; i++) {
          //Guardar dentro de la variable
          items.push({
            id: res.rows.item(i).id,
            cantidad: res.rows.item(i).cantidad,
            subtotal: res.rows.item(i).subtotal,
            producto: res.rows.item(i).producto
          })
        }
      }
      //Actualizamos el observable
      this.actualizarDB.next(items as any);
    }).catch(e => {
      this.presentAlert("Error de buscar en Base de datos (Tabla Detalle): " + e.message);
    })
  }

  agregarDetalle(cantidad: any, subtotal: any, producto: any) {
    return this.database.executeSql('INSERT INTO Detalle (cantidad,subtotal,producto) VALUES (?,?,?);', [cantidad, subtotal, producto]).then(res => {
      this.buscarDetalle();
    }).catch(e => {
      this.presentAlert("Error de agregar nuevos datos Base de datos (Tabla Detalle): " + e.message);
    })
  }

  actualizarDetalle(id: any, cantidad: any, subtotal: any, producto: any) {
    return this.database.executeSql('UPDATE Detalle SET cantidad=?, subtotal=?, producto=? WHERE id=?;', [cantidad, subtotal, producto, id]).then(res => {
      this.buscarDetalle();
    }).catch(e => {
      this.presentAlert("Error al actualizar datos en la base de datos (Tabla Detalle): " + e.message);
    })
  }

  borrarDetalle(id: any) {
    return this.database.executeSql('DELETE FROM Detalle WHERE id=?;', [id]).then(res => {
      this.buscarDetalle();
    }).catch(e => {
      this.presentAlert("Error al borrar datos en la base de datos (Tabla Detalle): " + e.message);
    })
  }

  //--------------------------------------------//
  /* FUNCIONES PARA TRABAJAR CON LA TABLA COMPRA*/
  //--------------------------------------------//

  buscarCompra() {
    return this.database.executeSql('SELECT * FROM Compra', []).then(res => {
      //variable para almacenar los registros
      let items: Compra[] = [];

      //validamos la cantidad de registros
      if (res.rows.length > 0) {
        //recorrer el arreglo items
        for (var i = 0; i < res.rows.length; i++) {
          //Guardar dentro de la variable
          items.push({
            id: res.rows.item(i).id,
            fech_compra: res.rows.item(i).fech_compra,
            fech_despacho: res.rows.item(i).fech_despacho,
            fech_entrega: res.rows.item(i).fech_entrega,
            costo_desp: res.rows.item(i).costo_desp,
            total: res.rows.item(i).total,
            carrito: res.rows.item(i).carrito,
            estado: res.rows.item(i).estado,
            detalle: res.rows.item(i).detalle,
            usuario: res.rows.item(i).usuario,
          })
        }
      }
      //Actualizamos el observable
      this.actualizarDB.next(items as any);
    }).catch(e => {
      this.presentAlert("Error de buscar en Base de datos (Tabla Compra): " + e.message);
    })
  }

  agregarCompra(fech_compra: any, fech_despacho: any, fech_entrega: any, costo_desp: any, total: any, carrito: any, estado: any, detalle: any, usuario: any) {
    return this.database.executeSql('INSERT INTO Compra (fech_compra, fech_despacho, fech_entrega, costo_desp, total, carrito, estado, detalle, usuario) VALUES (?,?,?,?,?,?,?,?,?);', [fech_compra, fech_despacho, fech_entrega, costo_desp, total, carrito, estado, detalle, usuario]).then(res => {
      this.buscarCompra();
    }).catch(e => {
      this.presentAlert("Error de agregar nuevos datos Base de datos (Tabla Compra): " + e.message);
    })
  }

  actualizarCompra(id: any, fech_compra: any, fech_despacho: any, fech_entrega: any, costo_desp: any, total: any, carrito: any, estado: any, detalle: any, usuario: any) {
    return this.database.executeSql('UPDATE Compra SET fech_compra=?, fech_despacho=?, fech_entrega=?, costo_desp=?, total=?, carrito=?, estado=?, detalle=?, usuario=? WHERE id=?;', [fech_compra, fech_despacho, fech_entrega, costo_desp, total, carrito, estado, detalle, usuario, id]).then(res => {
      this.buscarCompra();
    }).catch(e => {
      this.presentAlert("Error al actualizar datos en la base de datos (Tabla Compra): " + e.message);
    })
  }

  /* FUNCIONES VARIAS */
  /* TENGO EL CEREBRO FRITO */

  dbState() {
    return this.isdDBReady.asObservable();
  }

  // USER
  fetchRol(): Observable<Rol[]> {
    return this.actualizarDB.asObservable();
  }

  fetchPregunta(): Observable<Pregunta[]> {
    return this.actualizarDB.asObservable();
  }

  fetchUsuario(): Observable<Usuario[]> {
    return this.actualizarDB.asObservable();
  }

  // DIRECTION
  fetchRegion(): Observable<Region[]> {
    return this.actualizarDB.asObservable();
  }

  fetchComuna(): Observable<Comuna[]> {
    return this.actualizarDB.asObservable();
  }

  fetchDireccion(): Observable<Direccion[]> {
    return this.actualizarDB.asObservable();
  }

  // PRODUCT
  fetchCategoria(): Observable<Categoria[]> {
    return this.actualizarDB.asObservable();
  }

  fetchProducto(): Observable<Producto[]> {
    return this.actualizarDB.asObservable();
  }

  // PURCHASE
  fetchDetalle(): Observable<Detalle[]> {
    return this.actualizarDB.asObservable();
  }

  fetchCompra(): Observable<Compra[]> {
    return this.actualizarDB.asObservable();
  }

  // Funciones para generar db
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
        this.crearTablas();
        this.insertarDatos();
      }).catch(e => {
        this.presentAlert("Error al crear Base de datos: " + e.message);
      })

    })
  }

  async crearTablas() {
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
    } catch (e: any) {
      this.presentAlert("Error al crear Tablas de la Base de datos: " + e.message);
    }
  }

  insertarDatos() {
    try {
      this.database.executeSql(this.insertRolCliente, []);
      this.database.executeSql(this.insertRolVendedor, []);
      this.database.executeSql(this.insertRolAdministrador, []);

      this.database.executeSql(this.insertPregunta1, []);
      this.database.executeSql(this.insertPregunta2, []);
      this.database.executeSql(this.insertPregunta3, []);

      this.database.executeSql(this.insertUsuario1, []);

      this.database.executeSql(this.insertCat1, []);
      this.database.executeSql(this.insertCat2, []);
      this.database.executeSql(this.insertCat3, []);
      this.database.executeSql(this.insertCat4, []);

    } catch (e: any) {
      this.presentAlert("Error al insertar datos en la Base de datos: " + e.message);
    }
  }

  /* 
  “La actitud de ustedes debe ser como la de Cristo Jesús, quien,
  siendo por naturaleza Dios,no consideró el ser igual a Dios como
  algo a qué aferrarse. Por el contrario, se rebajó voluntariamente,
  tomando la naturaleza de siervo y haciéndose semejante a los seres
  humanos. Y, al manifestarse como hombre, se humilló a sí mismo y
  se hizo obediente hasta la muerte, ¡y muerte de cruz!” ~ Filipenses 2:5 – 8
  */


  async presentAlert(msj: string) {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Important message',
      message: msj,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
