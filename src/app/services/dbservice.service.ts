import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DbserviceService {
  Rol: string = "CREATE TABLE IF NOT EXISTS Rol (id_rol INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT NOT NULL CHECK(length(nombre) <= 120))";
  Pregunta: string = "CREATE TABLE IF NOT EXISTS pregunta (id_preg INTEGER PRIMARY KEY AUTOINCREMENT, pregunta TEXT NOT NULL CHECK(length(pregunta) <= 120))";
  Usuario: string = "CREATE TABLE IF NOT EXISTS usuario (id_usuario INTEGER PRIMARY KEY AUTOINCREMENT, rut TEXT NOT NULL CHECK(length(rut) <= 9)), dvrut TEXT NOT NULL CHECK(length(rut) <= 1)), nombre TEXT NOT NULL CHECK(length(nombre) <= 60), apellido_pa  TEXT NOT NULL CHECK(length(apellido_pa) <= 60), apellido_ma  TEXT NOT NULL CHECK(length(apellido_pa) <= 60), telefono INTEGER NOT NULL CHECK(length(telefono) <= 9), correo TEXT NOT NULL CHECK(length(correo) <= 40), clave TEXT NOT NULL CHECK(length(clave) <= 30), respuesta TEXT NOT NULL CHECK(length(respuesta) <= 30), rol INTEGER, pregunta INTEGER, FOREIGN KEY (rol) REFERENCES Rol(id_rol), FOREIGN KEY (pregunta) REFERENCES Pregunta(id_preg))";

  Region: string = "CREATE TABLE IF NOT EXISTS region (id_region INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT NOT NULL CHECK(length(nombre) <= 60))";
  Comuna: string = "CREATE TABLE IF NOT EXISTS comuna (id_comuna INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT NOT NULL CHECK(length(nombre) <= 60), cost_envio INTEGER NOT NULL, region INTEGER, FOREIGN KEY (region) REFERENCES Region(id_region))";
  Direccion: string = "CREATE TABLE IF NOT EXISTS direccion (id_rol INTEGER PRIMARY KEY AUTOINCREMENT, calle TEXT NOT NULL CHECK(length(calle) <= 40), numero INTEGER NOT NULL, cod_postal INTEGER NOT NULL CHECK(length(cod_postal) <= 7), comuna INTEGER, FOREIGN KEY (comuna) REFERENCES Comuna(id_comuna))";
  
  Categoria: string = "CREATE TABLE IF NOT EXISTS categoria (id_cat INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT NOT NULL CHECK(length(nombre) <= 60))";
  Producto: string = "CREATE TABLE IF NOT EXISTS producto (id_prod INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT NOT NULL CHECK(length(nombre) <= 120), descripcion TEXT NOT NULL CHECK(length(descripcion) <= 600), precio INTEGER NOT NULL, stock INTEGER NOT NULL, foto TEXT NOT NULL, categoria INTEGER, FOREIGN KEY (categoria) REFERENCES Categoria(id_cat))";

  Detalle: string = "CREATE TABLE IF NOT EXISTS detalle (id_detalle INTEGER PRIMARY KEY AUTOINCREMENT, cantidad INTEGER NOT NULL, subtotal INTEGER NOT NULL)";
  Estado: string = "CREATE TABLE IF NOT EXISTS estado (id_estado INTEGER PRIMARY KEY AUTOINCREMENT, estado TEXT NOT NULL CHECK(length(estado) <= 20))";
  Compra: string = "CREATE TABLE IF NOT EXISTS compra (id_compra INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT NOT NULL CHECK(length(nombre) <= 60), fech_compra DATE NOT NULL, fech_despacho DATE NOT NULL, fech_entrega DATE NOT NULL, costo_desp INTEGER NOT NULL, total INTEGER NOT NULL, carrito BOOLEAN NOT NULL, detalle INTEGER, estado INTEGER, FOREIGN KEY (detalle) REFERENCES Detalle(id_detalle), FOREIGN KEY (estado) REFERENCES Rol(id_estado))";
  Historial: string = "CREATE TABLE IF NOT EXISTS historial (id_historial INTEGER PRIMARY KEY AUTOINCREMENT, nombre_prod TEXT NOT NULL CHECK(length(nombre) <= 120), precio INTEGER NOT NULL, foto TEXT NOT NULL, cantidad INTEGER NOT NULL, subtotal INTEGER NOT NULL, compra INTEGER, FOREIGN KEY (compra) REFERENCES Compra(id_compra))";

  constructor() { }
}
