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

import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class DbserviceService {
  // variable para guardar la conexión a la DB
  public database!: SQLiteObject;


  //Storage
  private _storage: Storage | null = null;


  tablaRol: string = "CREATE TABLE IF NOT EXISTS Rol (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR(120) NOT NULL);";
  tablaPregunta: string = "CREATE TABLE IF NOT EXISTS Pregunta (id INTEGER PRIMARY KEY AUTOINCREMENT, pregunta VARCHAR(120) NOT NULL);";
  tablaUsuario: string = "CREATE TABLE IF NOT EXISTS Usuario (id INTEGER PRIMARY KEY AUTOINCREMENT, rut VARCHAR(9), dvrut VARCHAR(1), nombre VARCHAR(60), apellido  VARCHAR(60), telefono VARCHAR(9), correo VARCHAR(40) NOT NULL, clave VARCHAR(30) NOT NULL, respuesta VARCHAR(30) NOT NULL, rol INTEGER, pregunta INTEGER, foto text, FOREIGN KEY (rol) REFERENCES Rol(id), FOREIGN KEY (pregunta) REFERENCES Pregunta(id));";

  tablaRegion: string = "CREATE TABLE IF NOT EXISTS Region (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR(60) NOT NULL);";
  tablaComuna: string = "CREATE TABLE IF NOT EXISTS Comuna (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR(60) NOT NULL, cost_envio INTEGER NOT NULL, region INTEGER, FOREIGN KEY (region) REFERENCES Region(id));";
  tablaDireccion: string = "CREATE TABLE IF NOT EXISTS Direccion (id INTEGER PRIMARY KEY AUTOINCREMENT, calle VARCHAR(40), numero INTEGER, cod_postal INTEGER, region VARCHAR(25), comuna VARCHAR(35), usuario INTEGER, FOREIGN KEY (usuario) REFERENCES Usuario(id));";

  tablaCategoria: string = "CREATE TABLE IF NOT EXISTS Categoria (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR(60) NOT NULL);";
  tablaProducto: string = "CREATE TABLE IF NOT EXISTS Producto (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR(120) NOT NULL, descripcion VARCHAR(1600) NOT NULL, precio INTEGER NOT NULL, stock INTEGER NOT NULL, req_minimo VARCHAR(800), req_recomendado VARCHAR(800), foto TEXT NOT NULL);";
  tablaCPunion: string = "CREATE TABLE IF NOT EXISTS CPunion (id INTEGER PRIMARY KEY AUTOINCREMENT, producto INTEGER, categoria INTEGER, FOREIGN KEY (producto) REFERENCES Producto(id), FOREIGN KEY (categoria) REFERENCES Categoria(id));";

  tablaCompra: string = "CREATE TABLE IF NOT EXISTS Compra (id INTEGER PRIMARY KEY AUTOINCREMENT, fech_compra DATE, fech_despacho DATE, fech_entrega DATE, costo_desp INTEGER, total INTEGER, carrito BOOLEAN NOT NULL, usuario INTEGER, FOREIGN KEY (usuario) REFERENCES Usuario(id));";
  tablaDetalle: string = "CREATE TABLE IF NOT EXISTS Detalle (id INTEGER PRIMARY KEY AUTOINCREMENT, cantidad INTEGER NOT NULL, subtotal INTEGER, producto INTEGER, compra INTEGER, nombre VARCHAR(120), precio INTEGER, foto TEXT,FOREIGN KEY (producto) REFERENCES Producto(id), FOREIGN KEY (compra) REFERENCES Compra(id));";

  //------------------//
  /* INSERT DE DATOS */
  //------------------//

  //Insert de Roles
  insertRolCliente: string = "INSERT OR IGNORE INTO Rol (id,nombre) VALUES (1, 'cliente');";
  insertRolVendedor: string = "INSERT OR IGNORE INTO Rol (id,nombre) VALUES (2, 'vendedor');";
  insertRolAdministrador: string = "INSERT OR IGNORE INTO Rol (id,nombre) VALUES (3, 'administrador');";

  //Insert de Preguntas
  insertPregunta1: string = "INSERT OR IGNORE INTO Pregunta (id,pregunta) VALUES (1, '¿Como se llamó tu primera mascota?');";
  insertPregunta2: string = "INSERT OR IGNORE INTO Pregunta (id,pregunta) VALUES (2, '¿Como se llama tu primera pareja?');";
  insertPregunta3: string = "INSERT OR IGNORE INTO Pregunta (id,pregunta) VALUES (3, '¿Cual es tu modelo de tanque favorito?');";

  //Insert de Usuarios
  insertUsuario1: string = "INSERT OR IGNORE INTO Usuario (id,correo,clave,respuesta,pregunta,rol, foto) VALUES (1, 'aneurysm@gmail.cl','Aneurysm4521#','Aneurisma',3,3,'/assets/icon.png');";

  //Insert de Compra/Carrito
  insertCompra1: string = "INSERT OR IGNORE INTO Compra (id, carrito, usuario) VALUES (1, 0, 1);";

  //Insert de Categorias
  insertCat1: string = "INSERT OR IGNORE INTO Categoria (id,nombre) VALUES (1, 'RPG');";
  insertCat2: string = "INSERT OR IGNORE INTO Categoria (id,nombre) VALUES (2, 'Acción');";
  insertCat3: string = "INSERT OR IGNORE INTO Categoria (id,nombre) VALUES (3, 'Aventura');";
  insertCat4: string = "INSERT OR IGNORE INTO Categoria (id,nombre) VALUES (4, 'Fantasia');";
  insertCat5: string = "INSERT OR IGNORE INTO Categoria (id,nombre) VALUES (5, 'Terror');";
  insertCat6: string = "INSERT OR IGNORE INTO Categoria (id,nombre) VALUES (6, 'FPS');";
  insertCat7: string = "INSERT OR IGNORE INTO Categoria (id,nombre) VALUES (7, 'Simulador');";
  insertCat8: string = "INSERT OR IGNORE INTO Categoria (id,nombre) VALUES (8, 'Cooperativo');";
  insertCat9: string = "INSERT OR IGNORE INTO Categoria (id,nombre) VALUES (9, 'Souls');";
  insertCat10: string = "INSERT OR IGNORE INTO Categoria (id,nombre) VALUES (10, 'Fantasia oscura');";
  insertCat11: string = "INSERT OR IGNORE INTO Categoria (id,nombre) VALUES (11, 'Humor');";

  //Insert de Productos
  insertProd1: string = "INSERT OR IGNORE INTO Producto (id, nombre, descripcion, precio, stock, req_minimo, req_recomendado, foto) VALUES (1, 'Resident Evil Village', 'Resident Evil Village es la última entrega de la icónica serie de survival horror. En este juego, asumirás el papel de Ethan Winters, quien se embarca en una aterradora misión para rescatar a su hija secuestrada en un misterioso pueblo. Enfréntate a horrores grotescos y criaturas aterradoras mientras descubres los oscuros secretos que acechan en cada esquina.', 30000, 23, 'Requiere un procesador y un sistema operativo de 64 bits\nSO: Windows 10 (64 bit)\nProcesador: AMD Ryzen 3 1200 / Intel Core i5-7500\nMemoria: 8 GB de RAM\nGráficos: AMD Radeon\nRX 560 with 4GB VRAM / NVIDIA GeForce GTX 1050 Ti with 4GB VRAM\nDirectX: Versión 12\nNotas adicionales: Rendimiento estimado (con prioridad al rendimiento): 1080p/60fps. ・La tasa de imágenes será menor en escenas de gráficos intensos. ・AMD Radeon RX 6700 XT o NVIDIA GeForce RTX 2060 son necesarias para activar el trazado de rayos.', 'Requiere un procesador y un sistema operativo de 64 bits\nSO: Windows 10 (64 bit)\nProcesador: AMD Ryzen 5 3600 / Intel Core i7 8700\nMemoria: 16 GB de RAM\nGráficos: AMD Radeon RX 5700 / NVIDIA GeForce GTX 1070\nDirectX: Versión 12\nNotas adicionales: Rendimiento estimado: 1080p/60fps ・La tasa de imágenes será menor en escenas de gráficos intensos. ・AMD Radeon RX 6700 XT o NVIDIA GeForce RTX 2070 son necesarias para activar el trazado de rayos.', '/assets/Cover/RE_Village.jpg')";
  insertProd2: string = "INSERT OR IGNORE INTO Producto (id, nombre, descripcion, precio, stock, req_minimo, req_recomendado, foto) VALUES (2, 'Dark Messiah of Might and Magic','Dark Messiah of Might and Magic es un emocionante juego de rol y acción que te sumerge en un mundo épico de magia y aventuras. Ambientado en un reino oscuro y peligroso, te convertirás en el héroe destinado a enfrentarse a las fuerzas del mal que amenazan con destruir todo a su paso. \nEn este juego, explorarás un vasto y detallado mundo medieval lleno de misterios, monstruos y secretos por descubrir. Utilizarás poderes mágicos asombrosos, habilidades de combate cuerpo a cuerpo y un arsenal de armas impresionantes para enfrentarte a tus enemigos y desafíos en tu búsqueda por la gloria.', 7000, 15, 'procesador AMD Athlon™ o Pentium® a 2,4 GHz, 512 MB de RAM, tarjeta de vídeo de 128 MB, 7 GB de espacio en el disco duro, Windows XP, ratón, teclado, conexión a Internet', 'procesador AMD Athlon™ o Pentium® a 3 GHz, tarjeta de vídeo DX9 de 256 MB, 7 GB de espacio en el disco duro, Windows XP, ratón, teclado, conexión a Internet', '/assets/Cover/DarkMessiah.png')";
  insertProd3: string = "INSERT OR IGNORE INTO Producto (id, nombre, descripcion, precio, stock, req_minimo, req_recomendado, foto) VALUES (3, 'Minecraft', 'Minecraft es un mundo de aventuras y creatividad sin límites. En este juego, te encontrarás en un vasto y pixelado mundo en el que podrás construir, explorar y sobrevivir a tu manera. Tu única limitación es tu imaginación mientras construyes estructuras impresionantes, exploras misteriosas cuevas y enfrentas a criaturas en un entorno lleno de posibilidades.', 12000, 90, 'CPU: Intel Pentium D ó AMD Athlon 64 (K8) 2.6 GHz\nRAM: 2GB\nGPU (Integrada): Intel HD Graphics ó AMD (antes ATI) Radeon HD con OpenGL 2.1\nTarjeta gráfica: Nvidia GeForce 9600 GT ó AMD Radeon HD 2400 con OpenGL 3.1\nDisco duro: Al menos 200 MB libres\nJava: Java 6 Release 45', 'CPU: Intel Core i3 ó AMD Athlon II (K10) 2.8 GHz\nRAM: 4GB\nTarjeta gráfica: GeForce 2xx Series ó AMD Radeon HD 5xxx Series con OpenGL 3.3\nDisco duro: 1GB\nJava: Java 7', '/assets/Cover/Minecraft.png')";
  insertProd4: string = "INSERT OR IGNORE INTO Producto (id, nombre, descripcion, precio, stock, req_minimo, req_recomendado, foto) VALUES (4, 'Monster Hunter World', 'Monster Hunter World te sumerge en un emocionante mundo de caza y aventura. En este juego, te convertirás en un cazador de monstruos experto, persiguiendo bestias colosales en una variedad de entornos asombrosos. Utiliza una amplia gama de armas y estrategias para rastrear, derrotar y recolectar recursos de tus presas mientras te conviertes en el maestro de la caza.', 69990, 100, 'Requiere un procesador y un sistema operativo de 64 bits\nSO: WINDOWS® 7, 8, 8.1, 10 (requiere 64 bits)\nProcesador: Intel®Core™ i5 4460 or Core™ i3 9100F or AMD FX™-6300 or Ryzen™ 3 3200G\nMemoria: 8 GB de RAM\nGráficos: NVIDIA®GeForce®GTX 760 or GTX1050 or AMD Radeon™ R7 260x or RX 560\nDirectX: Versión 11\nRed: Conexión de banda ancha a Internet\nAlmacenamiento: 52 GB de espacio disponible\nTarjeta de sonido: DirectSound (DirectX® 9.0c o superior)\nNotas adicionales: Con estos requisitos podrás jugar a 1080p/30fps, eligiendo la configuración gráfica baja. Se necesita un procesador y sistema operativo de 64 bits.', 'Requiere un procesador y un sistema operativo de 64 bits\nSO: WINDOWS® 7, 8, 8.1, 10 (requiere 64 bits)\nProcesador: Intel®Core™ i7 3770 or Core™ i3 8350 or Core™ i3 9350F or AMD Ryzen™ 5 1500X or Ryzen™ 5 3400G\nMemoria: 8 GB de RAM\nGráficos: NVIDIA®GeForce®GTX 1060(VRAM 3GB) or GTX 1650 or AMD Radeon™ RX 480 or RX 570\nDirectX: Versión 11\nRed: Conexión de banda ancha a Internet\nAlmacenamiento: 52 GB de espacio disponible\nTarjeta de sonido: DirectSound (DirectX® 9.0c o superior)\nNotas adicionales: Con estos requisitos podrás jugar a 1080p/30fps, eligiendo la configuración gráfica alta. Se necesita un procesador y sistema operativo de 64 bits. El API de DirectX 12 requiere Windows 10 (versión 1809 o superior) y una GPU con 4GB de VRAM (tarjeta gráfica o de vídeo).', '/assets/Cover/mh_world.jpg')";
  insertProd5: string = "INSERT OR IGNORE INTO Producto (id, nombre, descripcion, precio, stock, req_minimo, req_recomendado, foto) VALUES (5, 'Berserk: Band of the Hawk', 'Berserk: Band of the Hawk es un emocionante juego de acción basado en el famoso manga y anime Berserk. En este juego, te unirás a Guts y otros personajes icónicos en su sangrienta y épica lucha contra hordas de enemigos. Experimenta la historia de Berserk mientras desatas poderosos ataques y te enfrentas a desafiantes jefes en un mundo oscuro y violento.', 39990, 82, 'Requiere un procesador y un sistema operativo de 64 bits\nSO: Windows® 10 (64bit required)\nProcesador: Core i7 870 over\nMemoria: 4 GB de RAM\nGráficos: NVIDIA Geforce GTS 450\nDirectX: Versión 11\nRed: Conexión de banda ancha a Internet\nAlmacenamiento: 20 GB de espacio disponible\nTarjeta de sonido: DirectX 9.0c over\nNotas adicionales: 640×480 pixel over, High Color, VRAM 1GB over', 'Requiere un procesador y un sistema operativo de 64 bits\nSO: Windows® 10 (64bit required)\nProcesador: Core i7 2600 over\nMemoria: 8 GB de RAM\nGráficos: NVIDIA GeForce GTX980 (3840x2160) / GTX760 (1920x1080)\nDirectX: Versión 11\nRed: Conexión de banda ancha a Internet\nAlmacenamiento: 20 GB de espacio disponible\nTarjeta de sonido: DirectX 9.0c over\nNotas adicionales: 1920x1080 pixel over, True Color, 4K compatible', '/assets/Cover/Berserk.jpg')";
  insertProd6: string = "INSERT OR IGNORE INTO Producto (id, nombre, descripcion, precio, stock, req_minimo, req_recomendado, foto) VALUES (6, 'Deadpool', 'Deadpool es un juego de acción y comedia que captura la esencia del carismático antihéroe de Marvel. En este juego, te pondrás en la piel de Deadpool mientras emprendes una misión llena de humor, violencia y situaciones extravagantes. Utiliza tus habilidades regenerativas y un variado arsenal de armas para enfrentarte a enemigos mientras desencadenas el caos de la manera más irreverente posible.', 280000, 3, 'SO: Windows 8, Windows 7, Windows Vista, Windows XP\nProcesador: Intel Core 2 Duo E8200 @ 2.66 GHz ó AMD Phenom X3 8750\nMemoria: 2GB RAM\nTarjeta gráfica: GeForce 8800 GT series con 512 MB RAM ó ATI Radeon HD4850 con 512MB RAM\nDirectX®:9.0c\nDisco duro libre: 7GB\nSonido: DirectX® 9.0c ó superior', 'N/A', '/assets/Cover/deadpool.jpg')";
  insertProd7: string = "INSERT OR IGNORE INTO Producto (id, nombre, descripcion, precio, stock, req_minimo, req_recomendado, foto) VALUES (7, 'Resident Evil 5', 'Resident Evil 5 es un juego de supervivencia y acción que te lleva a un mundo infestado de zombis y peligros biológicos. En este juego, te unirás a Chris Redfield y Sheva Alomar en una lucha desesperada por detener la propagación del virus letal en África. Enfrenta hordas de enemigos infectados y resuelve acertijos mientras te sumerges en una trama intensa y llena de giros.', 12000, 44, 'Sistema operativo compatible: Windows®10\nProcesador: Intel Core™ 2 Quad 2,4 GHz o mejor, AMD Phenom™ II x4 3,4 GHZ o mejor\nMemoria: 4GB o mejor\nGráficos: 512 MB de VRAM, NVIDIA® GeForce serie 9800 o superior, ATI Radeon HD 7770 o superior\nPantalla: Resolución mínima de 800 x 600 píxeles\nSonido: Compatible con DirectSound (DirectX 9.0c o superior)\nDirectX®: DirectX 9.0c / Shader 3.0 o mejor\nDisco duro: 15 GB de espacio libre en el disco duro\nPeriféricos: Teclado y ratón\nSe requiere conexión a Internet para la activación del juego.', 'Sistema operativo compatible: Windows®10\nProcesador: Intel Core™ i5-3570 o mejor, AMD Phenom™ II x4 3.4GHZ o mejor\nMemoria: 4GB o mejor\nGráficos: 512 MB VRAM, NVIDIA(R) GeForce® GTX 650 o mejor, ATI Radeon HD 7770 o mejor\nPantalla: Resolución mínima de 1280 x 720 píxeles\nSonido: Compatible con DirectSound (DirectX 9.0c o superior)\nDirectX®: DirectX 9.0c / Shader 3.0 o mejor\nDisco duro: 15 GB de espacio libre en el disco duro\nPeriféricos: teclado y ratón, compatible con controlador\nSe requiere conexión a Internet para la activación del juego.','/assets/Cover/RE5.jpg')";
  insertProd8: string = "INSERT OR IGNORE INTO Producto (id, nombre, descripcion, precio, stock, req_minimo, req_recomendado, foto) VALUES (8, 'Dragons Dogma: Dark Arisen', 'Dragons Dogma: Dark Arisen es un emocionante juego de rol de acción que te transporta a un mundo de fantasía lleno de monstruos y magia. En este juego, encarnarás al Arisen, un héroe destinado a enfrentarse a un dragón que amenaza el mundo. Reúne un grupo de seguidores, explora un mundo abierto lleno de peligros y descubre misterios mientras te enfrentas a desafíos épicos.', 15990, 12, 'SO: Windows Vista o posterior (32 o 64 bits)\nProcesador: CPU Intel Core i5 660 o equivalente\nMemoria: 4 GB de RAM\nGráficos: Radeon HD 5870 o equivalente\nDirectX: versión 9.0c\nRojo: Conexión de banda ancha a Internet\nAlmacenamiento: 20 GB de espacio disponible\nTarjeta de sonido: Tarjeta de sonido compatible con DirectX o chip de audio integrado', 'Sistema operativo: Windows 7/8/10\nProcesador: Intel Core i7-4770K o equivalente\nMemoria: 8 GB de RAM\nGráficos: NVIDIA GeForce GTX 760 o equivalente\nDirectX: versión 9.0c\nRojo: Conexión de banda ancha a Internet\nAlmacenamiento: 20 GB de espacio disponible\nTarjeta de sonido: Tarjeta de sonido compatible con DirectX o chip de audio integrado', '/assets/Cover/DDDA.jpg')";
  insertProd9: string = "INSERT OR IGNORE INTO Producto (id, nombre, descripcion, precio, stock, req_minimo, req_recomendado, foto) VALUES (9, 'Dark Souls III', 'Dark Souls III es un desafiante juego de rol de acción que te sumerge en un oscuro y misterioso mundo lleno de peligros y enemigos temibles. En este juego, asumirás el papel de un no-muerto en busca de un poder ancestral y enfrentarás a monstruos y jefes colosales en tu viaje. La muerte es implacable, pero la perseverancia y el aprendizaje son clave para sobrevivir en este mundo brutal.', 40000, 15, 'SO: Windows 7 SP1 64bit, Windows 8.1 64bit Windows 10 64bit\nProcesador: Intel Core i3-2100 / AMD® FX-6300\nMemoria: 4 GB de RAM\nGráficos: NVIDIA® GeForce GTX 750 Ti / ATI Radeon HD 7950\nDirectX: Versión 11\nRed: Conexión de banda ancha a Internet\nAlmacenamiento: 25 GB de espacio disponible\nTarjeta de sonido: DirectX 11 sound device\nNotas adicionales: Internet connection required for online play and product activation', 'SO: Windows 7 SP1 64bit, Windows 8.1 64bit Windows 10 64bit\nProcesador: Intel Core i7-3770 / AMD® FX-8350\nMemoria: 8 GB de RAM\nGráficos: NVIDIA® GeForce GTX 970 / ATI Radeon R9 series\nDirectX: Versión 11\nRed: Conexión de banda ancha a Internet\nAlmacenamiento: 25 GB de espacio disponible\nTarjeta de sonido: DirectX 11 sound device\nNotas adicionales: Internet connection required for online play and product activation', '/assets/Cover/DarkSouls3.jpg')";
  insertProd10: string = "INSERT OR IGNORE INTO Producto (id, nombre, descripcion, precio, stock, req_minimo, req_recomendado, foto) VALUES (10, 'Dark Souls II', 'Dark Souls II es la continuación de la legendaria saga Souls. En este juego, te aventurarás en un mundo igualmente implacable, lleno de desafíos mortales y secretos oscuros. Enfrenta la maldición y descubre la verdad detrás de esta tierra desolada en tu búsqueda de redención.', 20000, 15, 'SO: Windows Vista SP2, Windows 7 SP1, Windows 8\nProcesador: AMD® Phenom II™ X2 555 3.2Ghz or Intel® Pentium Core ™ 2 Duo E8500 3.17Ghz\nMemoria: 2 GB de RAM\nGráficos: NVIDIA® GeForce® 9600GT, ATI Radeon™ HD 5870\nDirectX: Versión 9.0c\nRed: Conexión de banda ancha a Internet\nAlmacenamiento: 12 GB de espacio disponible\nTarjeta de sonido: DirectX 9 sound device\nNotas adicionales: Controller support: Microsoft Xbox 360® Controller for Windows® (or equivalent) recommended', 'SO: Windows 7 SP1, Windows 8\nProcesador: Intel® CoreTM i3 2100 3.10GHz or AMD® A8 3870K 3.0GHz\nMemoria: 4 GB de RAM\nGráficos: NVIDIA® GeForce® GTX 750 or ATI Radeon™ HD 6870 or higher\nDirectX: Versión 9.0c\nRed: Conexión de banda ancha a Internet\nAlmacenamiento: 15 GB de espacio disponible\nTarjeta de sonido: DirectX 9 sound device\nNotas adicionales: Controller support: Microsoft Xbox 360® Controller for Windows® (or equivalent) recommended', '/assets/Cover/DarkSouls2.jpg')";
  insertProd11: string = "INSERT OR IGNORE INTO Producto (id, nombre, descripcion, precio, stock, req_minimo, req_recomendado, foto) VALUES (11, 'Dark Souls: REMASTERED', 'Dark Souls es el juego que dio inicio a la legendaria serie Souls. Sumérgete en un mundo sombrío y desafiante donde cada paso puede ser tu último al enfrentarte a enemigos mortales y jefes colosales. La paciencia, la estrategia y la valentía son tus mejores aliados en esta batalla por la supervivencia.', 20000, 15, 'Requiere un procesador y un sistema operativo de 64 bits\nSO: Windows 7 64-bit, Service Pack 1\nProcesador: Intel Core i5-2300 2.8 GHz / AMD FX-6300, 3.5 GHz\nMemoria: 6 GB de RAM\nGráficos: GeForce GTX 460, 1 GB / Radeon HD 6870, 1 GB\nDirectX: Versión 11\nAlmacenamiento: 8 GB de espacio disponible\nTarjeta de sonido: DirectX 11 sound device\nNotas adicionales: Low Settings, 60 FPS @ 1080p', 'Requiere un procesador y un sistema operativo de 64 bits\nSO: Windows 10 64-bit\nProcesador: Intel Core i5-4570 3.2 GHz / AMD FX-8350 4.2 GHz\nMemoria: 8 GB de RAM\nGráficos: GeForce GTX 660, 2 GB / Radeon HD 7870, 2 GB\nDirectX: Versión 11\nAlmacenamiento: 8 GB de espacio disponible\nTarjeta de sonido: DirectX 11 sound device\nNotas adicionales: High Settings, 60 FPS @ 1080p', '/assets/Cover/DarkSoulsR.jpg')";
  insertProd12: string = "INSERT OR IGNORE INTO Producto (id, nombre, descripcion, precio, stock, req_minimo, req_recomendado, foto) VALUES (12, 'It Takes Two', 'It Takes Two es una emocionante aventura cooperativa que te sumerge en un mundo de fantasía como nunca antes. En este juego, te embarcarás en una épica odisea como dos personajes, Cody y May, que han sido transformados en muñecos. Juntos, deberán superar desafíos y resolver acertijos en un emocionante viaje para reconectar su relación y volver a ser humanos.', 39990, 90, 'Requiere un procesador y un sistema operativo de 64 bits\nSO: Windows 8.1 64-bit or Windows 10 64-bit\nProcesador: Intel Core i3-2100T or AMD FX 6100\nMemoria: 8 GB de RAM\nGráficos: Nvidia GeForce GTX 660 or AMD R7 260x\nDirectX: Versión 11\nRed: Conexión de banda ancha a Internet\nAlmacenamiento: 50 GB de espacio disponible', 'Requiere un procesador y un sistema operativo de 64 bits\nSO: Windows 8.1 64-bit or Windows 10 64-bit\nProcesador: Intel Core i5 3570K or AMD Ryzen 3 1300x\nMemoria: 16 GB de RAM\nGráficos: Nvidia GeForce GTX 980 or AMD R9 290X\nDirectX: Versión 11\nRed: Conexión de banda ancha a Internet\nAlmacenamiento: 50 GB de espacio disponible', '/assets/Cover/ItTakesTwo.jpg')";
  insertProd13: string = "INSERT OR IGNORE INTO Producto (id, nombre, descripcion, precio, stock, req_minimo, req_recomendado, foto) VALUES (13, 'NieR: Automata', 'NieR: Automata es un juego de acción y rol aclamado por la crítica que te lleva a un mundo post-apocalíptico habitado por máquinas y androides. En este juego, controlarás a 2B, 9S y A2, tres androides en una lucha desesperada por la supervivencia y la búsqueda de respuestas en un conflicto existencial. Experimenta una narrativa emocionante y una jugabilidad fluida en esta obra maestra de Yoko Taro.', 30000, 28, 'SO: Windows 7 /8.1 /10 64bit\nProcesador: Intel Core i3 2100 or AMD A8-6500\nMemoria: 4 GB de RAM\nGráficos: NVIDIA GeForce GTX 770 VRAM 2GB or AMD Radeon R9 270X VRAM 2GB\nDirectX: Versión 11\nRed: Conexión de banda ancha a Internet\nAlmacenamiento: 50 GB de espacio disponible\nTarjeta de sonido: DirectX® 11 supported\nNotas adicionales: Mouse, keyboard and game pad (XInput only). Screen resolution: 1280x720. This product only supports MS-IME keyboard input. There is a possibility that other IME will not function correctly with it.', 'SO: Windows 8.1 /10 64bit\nProcesador: Intel Core i5 4670 or AMD A10-7850K\nMemoria: 8 GB de RAM\nGráficos: NVIDIA GeForce GTX 980 VRAM 4GB or AMD Radeon R9 380X VRAM 4GB\nDirectX: Versión 11\nRed: Conexión de banda ancha a Internet\nAlmacenamiento: 50 GB de espacio disponible\nTarjeta de sonido: DirectX® 11 supported\nNotas adicionales: Mouse, keyboard and game pad (XInput only). Screen resolution: 1920x1080. Depending on the monitor and PC graphics card environment and setup used, this title can expand its display resolution to 4K. However, please be aware that 4K resolutions are not officially supported. This product only supports MS-IME keyboard input. There is a possibility that other IME will not function correctly with it.', '/assets/Cover/NieR_Automata.jpg')";
  insertProd14: string = "INSERT OR IGNORE INTO Producto (id, nombre, descripcion, precio, stock, req_minimo, req_recomendado, foto) VALUES (14, 'NieR Replicant ver.1.22474487139...', 'NieR Replicant ver.1.22474487139... es una remasterización del clásico juego de rol de acción que te sumerge en un mundo post-apocalíptico lleno de misterios y emociones. En este juego, acompañarás al protagonista en su búsqueda para salvar a su hermana Yonah de una enfermedad mortal y descubrir la verdad detrás de la devastación que ha caído sobre el mundo.', 35000, 30, 'Requiere un procesador y un sistema operativo de 64 bits\nSO: Windows® 10 64-bit\nProcesador: AMD Ryzen™ 3 1300X; Intel® Core™ i5-6400\nMemoria: 8 GB de RAM\nGráficos: AMD Radeon™ R9 270X; NVIDIA® GeForce® GTX 960\nDirectX: Versión 11\nAlmacenamiento: 26 GB de espacio disponible\nTarjeta de sonido: DirectX Compatible Sound Card\nNotas adicionales: 60 FPS @ 1280x720', 'Requiere un procesador y un sistema operativo de 64 bits\nSO: Windows® 10 64-bit\nProcesador: AMD Ryzen™ 3 1300X; Intel® Core™ i5-6400\nMemoria: 16 GB de RAM\nGráficos: AMD Radeon™ RX Vega 56; NVIDIA® GeForce® GTX 1660\nDirectX: Versión 11\nAlmacenamiento: 26 GB de espacio disponible\nTarjeta de sonido: DirectX Compatible Sound Card\nNotas adicionales: 60 FPS @ 1920x1080', '/assets/Cover/NierReplicant.jpg')";

  /* 
  1 - Resident evil Village
  2 - Dark Messiah of Might and Magic
  3 - Minecraft
  4 - MH World
  5 - Berserk
  6 - Deadpool
  7 - Residente evil 5
  8 - Dragons Dogma: Dark Arisen
  9 - Dark Souls 3
  10 - Dark Souls 2
  11 - Dark Souls RE
  12 - It Takes Two
  13 - Nier Automata
  14 - Nier Replicant
  */
  //Insert de Union
  insertUnion1_1: string = "INSERT OR IGNORE INTO CPunion (id,producto,categoria) VALUES (1, 1, 2);";
  insertUnion1_2: string = "INSERT OR IGNORE INTO CPunion (id,producto,categoria) VALUES (2, 1, 3);";
  insertUnion1_3: string = "INSERT OR IGNORE INTO CPunion (id,producto,categoria) VALUES (3, 1, 5);";
  insertUnion1_4: string = "INSERT OR IGNORE INTO CPunion (id,producto,categoria) VALUES (4, 1, 1);";

  insertUnion2_1: string = "INSERT OR IGNORE INTO CPunion (id,producto,categoria) VALUES (5, 2, 1);";
  insertUnion2_2: string = "INSERT OR IGNORE INTO CPunion (id,producto,categoria) VALUES (6, 2, 2);";
  insertUnion2_3: string = "INSERT OR IGNORE INTO CPunion (id,producto,categoria) VALUES (7, 2, 3);";
  insertUnion2_4: string = "INSERT OR IGNORE INTO CPunion (id,producto,categoria) VALUES (8, 2, 4);";

  insertUnion3_1: string = "INSERT OR IGNORE INTO CPunion (id,producto,categoria) VALUES (9, 3, 3);";
  insertUnion3_2: string = "INSERT OR IGNORE INTO CPunion (id,producto,categoria) VALUES (10, 3, 4);";
  insertUnion3_3: string = "INSERT OR IGNORE INTO CPunion (id,producto,categoria) VALUES (11, 3, 7);";
  insertUnion3_4: string = "INSERT OR IGNORE INTO CPunion (id,producto,categoria) VALUES (12, 3, 8);";

  insertUnion4_1: string = "INSERT OR IGNORE INTO CPunion (id,producto,categoria) VALUES (13, 4, 2);";
  insertUnion4_2: string = "INSERT OR IGNORE INTO CPunion (id,producto,categoria) VALUES (14, 4, 3);";
  insertUnion4_3: string = "INSERT OR IGNORE INTO CPunion (id,producto,categoria) VALUES (15, 4, 4);";
  insertUnion4_4: string = "INSERT OR IGNORE INTO CPunion (id,producto,categoria) VALUES (16, 4, 7);";

  insertUnion5_1: string = "INSERT OR IGNORE INTO CPunion (id,producto,categoria) VALUES (17, 5, 2);";
  insertUnion5_2: string = "INSERT OR IGNORE INTO CPunion (id,producto,categoria) VALUES (18, 5, 3);";
  insertUnion5_3: string = "INSERT OR IGNORE INTO CPunion (id,producto,categoria) VALUES (19, 5, 10);";

  insertUnion6_1: string = "INSERT OR IGNORE INTO CPunion (id,producto,categoria) VALUES (20, 6, 2);";
  insertUnion6_2: string = "INSERT OR IGNORE INTO CPunion (id,producto,categoria) VALUES (21, 6, 3);";
  insertUnion6_3: string = "INSERT OR IGNORE INTO CPunion (id,producto,categoria) VALUES (22, 6, 11);";

  insertUnion7_1: string = "INSERT OR IGNORE INTO CPunion (id,producto,categoria) VALUES (23, 7, 2);";
  insertUnion7_2: string = "INSERT OR IGNORE INTO CPunion (id,producto,categoria) VALUES (24, 7, 3);";
  insertUnion7_3: string = "INSERT OR IGNORE INTO CPunion (id,producto,categoria) VALUES (25, 7, 4);";
  insertUnion7_4: string = "INSERT OR IGNORE INTO CPunion (id,producto,categoria) VALUES (26, 7, 5);";

  insertUnion8_1: string = "INSERT OR IGNORE INTO CPunion (id,producto,categoria) VALUES (27, 8, 1);";
  insertUnion8_2: string = "INSERT OR IGNORE INTO CPunion (id,producto,categoria) VALUES (28, 8, 2);";
  insertUnion8_3: string = "INSERT OR IGNORE INTO CPunion (id,producto,categoria) VALUES (29, 8, 3);";
  insertUnion8_4: string = "INSERT OR IGNORE INTO CPunion (id,producto,categoria) VALUES (30, 8, 4);";

  insertUnion9_1: string = "INSERT OR IGNORE INTO CPunion (id,producto,categoria) VALUES (31, 9, 2);";
  insertUnion9_2: string = "INSERT OR IGNORE INTO CPunion (id,producto,categoria) VALUES (32, 9, 3);";
  insertUnion9_3: string = "INSERT OR IGNORE INTO CPunion (id,producto,categoria) VALUES (33, 9, 9);";
  insertUnion9_4: string = "INSERT OR IGNORE INTO CPunion (id,producto,categoria) VALUES (34, 9, 10);";

  insertUnion10_1: string = "INSERT OR IGNORE INTO CPunion (id,producto,categoria) VALUES (35, 10, 2);";
  insertUnion10_2: string = "INSERT OR IGNORE INTO CPunion (id,producto,categoria) VALUES (36, 10, 3);";
  insertUnion10_3: string = "INSERT OR IGNORE INTO CPunion (id,producto,categoria) VALUES (37, 10, 9);";
  insertUnion10_4: string = "INSERT OR IGNORE INTO CPunion (id,producto,categoria) VALUES (38, 10, 10);";

  insertUnion11_1: string = "INSERT OR IGNORE INTO CPunion (id,producto,categoria) VALUES (39, 11, 2);";
  insertUnion11_2: string = "INSERT OR IGNORE INTO CPunion (id,producto,categoria) VALUES (40, 11, 3);";
  insertUnion11_3: string = "INSERT OR IGNORE INTO CPunion (id,producto,categoria) VALUES (41, 11, 9);";
  insertUnion11_4: string = "INSERT OR IGNORE INTO CPunion (id,producto,categoria) VALUES (42, 11, 10);";

  insertUnion12_1: string = "INSERT OR IGNORE INTO CPunion (id,producto,categoria) VALUES (43, 12, 2);";
  insertUnion12_2: string = "INSERT OR IGNORE INTO CPunion (id,producto,categoria) VALUES (44, 12, 3);";
  insertUnion12_3: string = "INSERT OR IGNORE INTO CPunion (id,producto,categoria) VALUES (45, 12, 9);";
  insertUnion12_4: string = "INSERT OR IGNORE INTO CPunion (id,producto,categoria) VALUES (46, 12, 10);";

  insertUnion13_1: string = "INSERT OR IGNORE INTO CPunion (id,producto,categoria) VALUES (47, 13, 1);";
  insertUnion13_2: string = "INSERT OR IGNORE INTO CPunion (id,producto,categoria) VALUES (48, 13, 2);";
  insertUnion13_3: string = "INSERT OR IGNORE INTO CPunion (id,producto,categoria) VALUES (49, 13, 3);";

  insertUnion14_1: string = "INSERT OR IGNORE INTO CPunion (id,producto,categoria) VALUES (50, 14, 1);";
  insertUnion14_2: string = "INSERT OR IGNORE INTO CPunion (id,producto,categoria) VALUES (51, 14, 2);";
  insertUnion14_3: string = "INSERT OR IGNORE INTO CPunion (id,producto,categoria) VALUES (52, 14, 3);";

  //Insert de Direcciones
  insertDir1: string = "INSERT OR IGNORE INTO Direccion (id,calle, numero, cod_postal, region, comuna, usuario) VALUES (1, 'Mar de Chile', 1684, 7789890, 'Metropolitana', 'Cerro Navia', 1);";
  insertDir2: string = "INSERT OR IGNORE INTO Direccion (id,usuario) VALUES (2, 2);";

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


  async init() {
    // If using, define drivers here: await this.storage.defineDriver();
    const storage = await this._storage!.create();
    this._storage = storage;
  }

  // Create and expose methods that users of this service can
  // call, for example:
  public set(key: string, value: any) {
    this._storage?.set(key, value);
  }

  public get(key: string) {
    this._storage?.get(key);
  }

  public remove(key: string) {
    this._storage?.remove(key);
  }

  public clear() {
    this._storage?.clear;
  }

  public getAll() {
    this._storage?.keys();
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
      this.presentAlert("Error", "Error en la base de datos", "Error de buscar en Base de datos (Tabla Rol): " + e.message);
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
      this.presentAlert("Error", "Error en la base de datos", "Error de buscar en Base de datos (Tabla Pregunta): " + e.message);
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
            apellido: res.rows.item(i).apellido,
            telefono: res.rows.item(i).telefono,
            correo: res.rows.item(i).correo,
            clave: res.rows.item(i).clave,
            respuesta: res.rows.item(i).respuesta,

            //Datos Foraneos
            rol: res.rows.item(i).rol,
            pregunta: res.rows.item(i).pregunta,
            foto: res.rows.item(0).foto,
          })
        }
      }
      //Actualizamos el observable
      this.actualizarDB.next(items as any);
    }).catch(e => {
      this.presentAlert("Error", "Error en la base de datos", "Error de buscar en Base de datos (Tabla Usuario): " + e.message);
    })
  }

  encontrarUsuario(correo: any): Promise<Usuario | null> {
    return new Promise((resolve) => {
      this.database.executeSql('SELECT * FROM Usuario WHERE correo=?;', [correo]).then(res => {
        if (res.rows.length > 0) {
          const usuario: Usuario = {
            id: res.rows.item(0).id,
            rut: res.rows.item(0).rut,
            dvrut: res.rows.item(0).dvrut,
            nombre: res.rows.item(0).nombre,
            apellido: res.rows.item(0).apellido,
            telefono: res.rows.item(0).telefono,
            correo: res.rows.item(0).correo,
            clave: res.rows.item(0).clave,
            respuesta: res.rows.item(0).respuesta,
            rol: res.rows.item(0).rol,
            pregunta: res.rows.item(0).pregunta,
            foto: res.rows.item(0).foto,
          };
          resolve(usuario);
        } else {
          resolve(null); // No se encontró un usuario con ese correo
        }
      })
        .catch(e => {
          this.presentAlert("Error", "Error en la base de datos", "Error al buscar en la base de datos (Tabla Usuario): " + e.message);
        });
    });
  }

  encontrarUsuarioID(id: any): Promise<Usuario | null> {
    return new Promise((resolve) => {
      this.database.executeSql('SELECT * FROM Usuario WHERE id=?;', [id]).then(res => {
        if (res.rows.length > 0) {
          const usuario: Usuario = {
            id: res.rows.item(0).id,
            rut: res.rows.item(0).rut,
            dvrut: res.rows.item(0).dvrut,
            nombre: res.rows.item(0).nombre,
            apellido: res.rows.item(0).apellido,
            telefono: res.rows.item(0).telefono,
            correo: res.rows.item(0).correo,
            clave: res.rows.item(0).clave,
            respuesta: res.rows.item(0).respuesta,
            rol: res.rows.item(0).rol,
            pregunta: res.rows.item(0).pregunta,
            foto: res.rows.item(0).foto,
          };
          resolve(usuario);
        } else {
          resolve(null); // No se encontró un usuario con ese correo
        }
      })
        .catch(e => {
          this.presentAlert("Error", "Error en la base de datos", "Error al buscar en la base de datos (Tabla Usuario): " + e.message);
        });
    });
  }

  agregarUsuario(correo: any, clave: any, respuesta: any, rol: any, pregunta: any, foto:any) {
    return this.database.executeSql('INSERT INTO Usuario (correo, clave, respuesta, rol, pregunta, foto) VALUES (?,?,?,?,?,?);', [correo, clave, respuesta, rol, pregunta, foto]).then(res => {
      this.buscarUsuario();
    }).catch(e => {
      this.presentAlert("Error", "Error en la base de datos", "Error de agregar nuevos datos Base de datos (Tabla Usuario): " + e.message);
    })
  }

  actualizarUsuario(id: any, rut: any, dvrut: any, nombre: any, apellido: any, telefono: any, foto:any) {
    return this.database.executeSql('UPDATE Usuario SET rut=?, dvrut=?, nombre=?, apellido=?, telefono=?, foto=?  WHERE id=?;', [rut, dvrut, nombre, apellido, telefono, foto, id]).then(res => {
      this.buscarUsuario();
    }).catch(e => {
      this.presentAlert("Error", "Error en la base de datos", "Error al actualizar la información del usuario: " + e.message);
    })
  }

  actualizarClave(id: any, clave: any) {
    return this.database.executeSql('UPDATE Usuario SET clave=?  WHERE id=?;', [clave, id]).then(res => {
      this.buscarUsuario();
    }).catch(e => {
      this.presentAlert("Error", "Error en la base de datos", "Error al cambiar clave del usuario: " + e.message);
    })
  }

  actualizarRol(id: any, rol: any) {
    return this.database.executeSql('UPDATE Usuario SET rol=?  WHERE id=?;', [rol, id]).then(res => {
      this.buscarUsuario();
    }).catch(e => {
      this.presentAlert("Error", "Error en la base de datos", "Error al cambiar clave del usuario: " + e.message);
    })
  }

  borrarUsuario(id: any) {
    return this.database.executeSql('DELETE FROM Usuario WHERE id=?;', [id]).then(res => {
      this.buscarUsuario();
    }).catch(e => {
      this.presentAlert("Error", "Error en la base de datos", "Error al borrar : " + e.message);
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
      this.presentAlert("Error", "Error en la base de datos", "Error de buscar en Base de datos (Tabla Region): " + e.message);
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
      this.presentAlert("Error", "Error en la base de datos", "Error de buscar en Base de datos (Tabla Comuna): " + e.message);
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
            cod_postal: res.rows.item(i).cod_postal,
            region: res.rows.item(i).region,
            comuna: res.rows.item(i).comuna,

            //Foranea
            usuario: res.rows.item(i).usuario
          })
        }
      }
      //Actualizamos el observable
      this.actualizarDB.next(items as any);
    }).catch(e => {
      this.presentAlert("Error", "Error en la base de datos", "Error de buscar en Base de datos (Tabla Direccion): " + e.message);
    })
  }

  agregarDireccion(usuario: any) {
    return this.database.executeSql('INSERT INTO Direccion (usuario) VALUES (?);', [usuario]).then(res => {
      this.buscarDireccion();
    }).catch(e => {
      this.presentAlert("Error", "Error en la base de datos", "Error de agregar nuevos datos Base de datos (Tabla Direccion): " + e.message);
    })
  }

  actualizarDireccion(calle: any, numero: any, cod_postal: any, region: any, comuna: any, usuario: any) {
    return this.database.executeSql('UPDATE Direccion SET calle=?, numero=?, cod_postal=?, region=?, comuna=? WHERE usuario=?;', [calle, numero, cod_postal, region, comuna, usuario]).then(res => {
      this.buscarDireccion();
    }).catch(e => {
      this.presentAlert("Error", "Error en la base de datos", "Error al actualizar datos en la base de datos (Tabla Direccion): " + e.message);
    })
  }

  encontrarDireccionPorID(userID: any): Promise<Direccion | null> {
    return new Promise((resolve) => {
      this.database.executeSql('SELECT * FROM Direccion WHERE usuario=?', [userID]).then(res => {
        if (res.rows.length > 0) {
          const direccion: Direccion = {
            id: res.rows.item(0).id,
            calle: res.rows.item(0).calle,
            numero: res.rows.item(0).numero,
            cod_postal: res.rows.item(0).cod_postal,
            region: res.rows.item(0).region,
            comuna: res.rows.item(0).comuna,

            //Foranea
            usuario: res.rows.item(0).usuario
          }
          resolve(direccion);
        } else {
          resolve(null); // No se encontró un usuario con ese correo
        }
      }).catch(e => {
        this.presentAlert("Error", "Error en la base de datos", "Error de buscar en Base de datos (Tabla Direccion): " + e.message);
      });
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
      this.presentAlert("Error", "Error en la base de datos", "Error de buscar en Base de datos (Tabla Categoria): " + e.message);
    })
  }

  encontrarCategoria(id: any): Promise<Categoria | null> {
    return new Promise((resolve) => {
      this.database.executeSql('SELECT * FROM Categoria WHERE id=?', [id]).then(res => {
        if (res.rows.length > 0) {
          const categoria: Categoria = {
            id: res.rows.item(0).id,
            nombre: res.rows.item(0).nombre
          }
          resolve(categoria);
        } else {
          resolve(null); // No se encontró un usuario con ese correo
        }
      }).catch(e => {
        this.presentAlert("Error", "Error en la base de datos", "Error de buscar en Base de datos (Tabla Categoria): " + e.message);
      });
    })
  }

  agregarCategoria(nombre: any) {
    return this.database.executeSql('INSERT INTO Categoria (nombre) VALUES (?);', [nombre]).then(res => {
      this.buscarDireccion();
    }).catch(e => {
      this.presentAlert("Error", "Error en la base de datos", "Error de agregar nuevos datos Base de datos (Tabla Categoria): " + e.message);
    })
  }

  borrarCategoria(id: any) {
    return this.database.executeSql('DELETE FROM Categoria WHERE id=?;', [id]).then(res => {
      this.buscarCategoria();
    }).catch(e => {
      this.presentAlert("Error", "Error en la base de datos", "Error al borrar datos en la base de datos (Tabla Categoria): " + e.message);
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
            req_minimo: res.rows.item(i).req_minimo,
            req_recomendado: res.rows.item(i).req_recomendado,
            foto: res.rows.item(i).foto
          })
        }
      }

      //Actualizamos el observable
      this.actualizarDB.next(items as any);
    }).catch(e => {
      this.presentAlert("Error", "Error en la base de datos", "Error de buscar en Base de datos (Tabla Producto): " + e.message);
    })
  }

  encontrarProducto(id: any): Promise<Producto | null> {
    return new Promise((resolve) => {
      this.database.executeSql('SELECT * FROM Producto WHERE id=?;', [id]).then(res => {
        if (res.rows.length > 0) {
          const producto: Producto = {
            id: res.rows.item(0).id,
            nombre: res.rows.item(0).nombre,
            descripcion: res.rows.item(0).descripcion,
            precio: res.rows.item(0).precio,
            stock: res.rows.item(0).stock,
            req_minimo: res.rows.item(0).req_minimo,
            req_recomendado: res.rows.item(0).req_recomendado,
            foto: res.rows.item(0).foto
          };
          resolve(producto);
        } else {
          resolve(null); // No se encontró un producto con ese correo
        }
      }).catch(e => {
        this.presentAlert("Error", "Error en la base de datos", "Error al buscar producto por su id: " + e.message);
      });
    });
  }

  agregarProducto(nombre: any, descripcion: any, precio: any, stock: any, req_minimo: any, req_recomendado: any, foto: any) {
    return this.database.executeSql('INSERT INTO Producto (nombre, descripcion, precio, stock, req_minimo, req_recomendado, foto) VALUES (?,?,?,?,?,?,?);', [nombre, descripcion, precio, stock, req_minimo, req_recomendado, foto]).then(res => {
      this.buscarProducto();
    }).catch(e => {
      this.presentAlert("Error", "Error en la base de datos", "Error de agregar nuevos datos Base de datos (Tabla Producto): " + e.message);
    })
  }

  UltimaIDProducto(): Promise<number> {
    return new Promise<number>((resolve) => {
      this.database.executeSql('SELECT MAX(id) as last_id FROM Producto', [])
        .then(res => {
          if (res.rows.length > 0) {
            const id = res.rows.item(0).last_id;
            resolve(id);
          }
        })
        .catch(e => {
          this.presentAlert("Error", "Error en la base de datos", "Error de la ultima ID de la tabla Producto: " + e.message);
        });
    });
  }

  actualizarProducto(id: any, nombre: any, descripcion: any, precio: any, stock: any, req_minimo: any, req_recomendado: any, foto: any) {
    return this.database.executeSql('UPDATE producto SET nombre=?, descripcion=?, precio=?, stock=?, req_minimo=?,req_recomendado=?, foto=? WHERE id=?;', [nombre, descripcion, precio, stock, req_minimo, req_recomendado, foto, id]).then(res => {
      this.buscarProducto();
    }).catch(e => {
      this.presentAlert("Error", "Error en la base de datos", "Error al actualizar datos en la base de datos (Tabla Producto): " + e.message);
    })
  }

  actualizarStock(id: any, stock: any) {
    return this.database.executeSql('UPDATE Producto SET stock=? WHERE id=?;', [stock, id]).then(res => {
      this.buscarProducto();
    }).catch(e => {
      this.presentAlert("Error", "Error en la base de datos", "Error al actualizar datos en la base de datos (Tabla Producto): " + e.message);
    })
  }

  borrarProducto(id: any) {
    return this.database.executeSql('DELETE FROM Producto WHERE id=?;', [id]).then(res => {
      this.buscarProducto();
    }).catch(e => {
      this.presentAlert("Error", "Error en la base de datos", "Error al borrar datos en la base de datos (Tabla Producto): " + e.message);
    })
  }

  //---------------------------------------------//
  /* FUNCIONES PARA TRABAJAR CON LA TABLA CPunion*/
  //---------------------------------------------//

  buscarUnionCP() {
    return this.database.executeSql('SELECT * FROM CPunion', []).then(res => {
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
      this.presentAlert("Error", "Error en la base de datos", "Error al buscar datos en la tabla 'CPunion': " + e.message);
    })
  }

  agregarUnionCP(producto: any, categoria: any) {
    return this.database.executeSql('INSERT INTO CPunion (producto, categoria) VALUES (?,?);', [producto, categoria]).then(res => {
      this.buscarUnionCP();
    }).catch(e => {
      this.presentAlert("Error", "Error en la base de datos", "Error al agregar datos en la tabla 'CPunion': " + e.message);
    })
  }

  borrarUnionCP(id: any) {
    return this.database.executeSql('DELETE FROM CPunion WHERE producto=?;', [id]).then(res => {
      this.buscarUnionCP();
    }).catch(e => {
      this.presentAlert("Error", "Error en la base de datos", "Error al borrar datos en la tabla 'CPunion': " + e.message);
    })
  }

  encontrarUnionPorProducto(id: any): Promise<CPUnion[] | null> {
    return new Promise((resolve) => {
      this.database.executeSql('SELECT * FROM CPunion WHERE producto=?;', [id]).then(res => {
        if (res.rows.length > 0) {
          console.log(res.rows.length);
          //recorrer el arreglo items
          let items: CPUnion[] = [];
          for (var i = 0; i < res.rows.length; i++) {
            //Guardar dentro de la variable
            items.push({
              id: res.rows.item(i).id,
              producto: res.rows.item(i).producto,
              categoria: res.rows.item(i).categoria
            })
            console.log(items);
          }
          resolve(items);
        } else {
          resolve(null); // No se encontró un producto con ese correo
        }
      }).catch(e => {
        this.presentAlert("Error", "Error en la base de datos", "Error al buscar por producto en la tabla 'CPunion': " + e.message);
      });
    });
  }

  actualizarUnion(id: any, producto: any, categoria:any) {
    return this.database.executeSql('UPDATE CP_union SET producto=?, categoria=? WHERE id=?;', [producto, categoria, id]).then(res => {
      this.buscarUnionCP();
    }).catch(e => {
      this.presentAlert("Error", "Error en la base de datos", "Error al actualizar datos en la tabla 'CP_union': " + e.message);
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
            producto: res.rows.item(i).producto,
            compra: res.rows.item(i).compra,
            nombre: res.rows.item(i).nombre,
            precio: res.rows.item(i).precio,
            foto: res.rows.item(i).foto,
          })
        }
      }
      //Actualizamos el observable
      this.actualizarDB.next(items as any);
    }).catch(e => {
      this.presentAlert("Error", "Error en la base de datos", "Error al buscar en la tabla 'Detalle': " + e.message);
    })
  }

  encontrarDetalle(idCompra: any): Promise<Detalle[] | null> {
    return new Promise((resolve) => {
      this.database.executeSql('SELECT * FROM Detalle WHERE compra=?;', [idCompra]).then(res => {
        if (res.rows.length > 0) {

          let items: Detalle[] = [];
          for (var i = 0; i < res.rows.length; i++) {
            //Guardar dentro de la variable
            items.push({
              id: res.rows.item(i).id,
              cantidad: res.rows.item(i).cantidad,
              subtotal: res.rows.item(i).subtotal,
              producto: res.rows.item(i).producto,
              compra: res.rows.item(i).compra,
              nombre: res.rows.item(i).nombre,
              precio: res.rows.item(i).precio,
              foto: res.rows.item(i).foto,
            })
            console.log(items);
          }
          console.log(items);
          resolve(items);
        } else {
          resolve(null); // No se encontró un producto con ese correo
        }
      }).catch(e => {
        this.presentAlert("Error", "Error en la base de datos", "Error al buscar por compra en la tabla 'Detalle': " + e.message);
      });
    });
  }

  agregarDetalle(cantidad: any, subtotal: any, producto: any, compra: any, nombre: any, precio: any, foto: any) {
    return this.database.executeSql('INSERT INTO Detalle (cantidad,subtotal,producto,compra, nombre, precio, foto) VALUES (?,?,?,?,?,?,?);', [cantidad, subtotal, producto, compra, nombre, precio, foto]).then(res => {
      this.buscarDetalle();
    }).catch(e => {
      this.presentAlert("Error", "Error en la base de datos", "Error al agregar datos en la tabla 'Detalle': " + e.message);
    })
  }

  crearDetalle(cantidad: any, producto: any, compra: any) {
    return this.database.executeSql('INSERT INTO Detalle (cantidad,producto,compra) VALUES (?,?,?);', [cantidad, producto, compra]).then(res => {
      this.buscarDetalle();
    }).catch(e => {
      this.presentAlert("Error", "Error en la base de datos", "Error al agregar datos en la tabla 'Detalle': " + e.message);
    })
  }

  actualizarDetalle(id: any, cantidad: any, subtotal: any, producto: any) {
    return this.database.executeSql('UPDATE Detalle SET cantidad=?, subtotal=?, producto=? WHERE id=?;', [cantidad, subtotal, producto, id]).then(res => {
      this.buscarDetalle();
    }).catch(e => {
      this.presentAlert("Error", "Error en la base de datos", "Error al actualizar datos en la tabla 'Detalle': " + e.message);
    })
  }

  actualizarInfoDetalle(id: any, cantidad: any, subtotal: any, producto: any, nombre: any, precio: any, foto: any) {
    return this.database.executeSql('UPDATE Detalle SET cantidad=?, subtotal=?, producto=?, nombre=?, precio=?, foto=? WHERE id=?;', [cantidad, subtotal, producto, nombre, precio, foto, id]).then(res => {
      this.buscarDetalle();
    }).catch(e => {
      this.presentAlert("Error", "Error en la base de datos", "Error al actualizar datos en la tabla 'Detalle': " + e.message);
    })
  }

  borrarDetalle(id: any) {
    return this.database.executeSql('DELETE FROM Detalle WHERE id=?;', [id]).then(res => {
      this.buscarDetalle();
    }).catch(e => {
      this.presentAlert("Error", "Error en la base de datos", "Error al borrar datos de la tabla 'Detalle': " + e.message);
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
            usuario: res.rows.item(i).usuario,
          })
        }
      }
      //Actualizamos el observable
      this.actualizarDB.next(items as any);
    }).catch(e => {
      this.presentAlert("Error", "Error en la base de datos", "Error al buscar en la tabla 'Compra': " + e.message);
    })
  }

  encontrarCompra(id: any): Promise<Compra | null> {
    return new Promise((resolve) => {
      this.database.executeSql('SELECT * FROM Compra WHERE usuario=? and carrito=0;', [id]).then(res => {
        if (res.rows.length > 0) {
          const compra: Compra = {
            id: res.rows.item(0).id,
            fech_compra: res.rows.item(0).fech_compra,
            fech_despacho: res.rows.item(0).fech_despacho,
            fech_entrega: res.rows.item(0).fech_entrega,
            costo_desp: res.rows.item(0).costo_desp,
            total: res.rows.item(0).total,
            carrito: res.rows.item(0).carrito,
            usuario: res.rows.item(0).usuario,
          };
          console.log(compra);
          resolve(compra);
        } else {
          resolve(null); // No se encontró un producto con ese correo
        }
      }).catch(e => {
        this.presentAlert("Error", "Error en la base de datos", "Error al buscar por usuario en la tabla 'Compra': " + e.message);
      });
    });
  }

  encontrarComprasUsuario(id: any): Promise<Compra[] | null> {
    return new Promise((resolve) => {
      this.database.executeSql('SELECT * FROM Compra WHERE usuario=? and carrito=1;', [id]).then(res => {
        if (res.rows.length > 0) {
          let items: Compra[] = [];
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
              usuario: res.rows.item(i).usuario,
            });
          }
          console.log(items);
          resolve(items);
        } else {
          resolve(null); // No se encontró un producto con ese correo
        }
      }).catch(e => {
        this.presentAlert("Error", "Error en la base de datos", "Error al buscar por usuario en la tabla 'Compra': " + e.message);
      });
    });
  }

  encontrarCompraID(id: any): Promise<Compra | null> {
    return new Promise((resolve) => {
      this.database.executeSql('SELECT * FROM Compra WHERE id=?;', [id]).then(res => {
        if (res.rows.length > 0) {
          const compra: Compra = {
            id: res.rows.item(0).id,
            fech_compra: res.rows.item(0).fech_compra,
            fech_despacho: res.rows.item(0).fech_despacho,
            fech_entrega: res.rows.item(0).fech_entrega,
            costo_desp: res.rows.item(0).costo_desp,
            total: res.rows.item(0).total,
            carrito: res.rows.item(0).carrito,
            usuario: res.rows.item(0).usuario,
          };
          console.log(compra);
          resolve(compra);
        } else {
          resolve(null); // No se encontró un producto con ese correo
        }
      }).catch(e => {
        this.presentAlert("Error", "Error en la base de datos", "Error al buscar por usuario en la tabla 'Compra': " + e.message);
      });
    });
  }

  agregarCompra(usuario: any) {
    return this.database.executeSql('INSERT INTO Compra (carrito, usuario) VALUES (0,?);', [usuario]).then(res => {
      this.buscarCompra();
    }).catch(e => {
      this.presentAlert("Error", "Error en la base de datos", "Error de agregar nuevos datos en la tabla 'Compra': " + e.message);
    })
  }

  agregarCarrito(usuario: any) {
    return this.database.executeSql('INSERT INTO Compra (carrito, usuario) VALUES (0,?);', [usuario]).then(res => {
      this.buscarCompra();
    }).catch(e => {
      this.presentAlert("Error", "Error en la base de datos", "Error de agregar nuevos datos en la tabla 'Compra': " + e.message);
    })
  }

  actualizarCompra(id: any, fech_compra: any, fech_despacho: any, fech_entrega: any, costo_desp: any, total: any, carrito: any, usuario: any) {
    return this.database.executeSql('UPDATE Compra SET fech_compra=?, fech_despacho=?, fech_entrega=?, costo_desp=?, total=?, carrito=?, usuario=? WHERE id=?;', [fech_compra, fech_despacho, fech_entrega, costo_desp, total, carrito, usuario, id]).then(res => {
      this.buscarCompra();
    }).catch(e => {
      this.presentAlert("Error", "Error en la base de datos", "Error al actualizar datos en la tabla 'Compra': " + e.message);
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

  fetchUnion(): Observable<CPUnion[]> {
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
        this.presentAlert("Error", "Error en la base de datos", "Error al crear Base de datos: " + e.message);
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
      await this.database.executeSql(this.tablaCPunion, []);

      await this.database.executeSql(this.tablaCompra, []);
      await this.database.executeSql(this.tablaDetalle, []);

      //actualizamos el observable de la DB
      this.isdDBReady.next(true);
    } catch (e: any) {
      this.presentAlert("Error", "Error en la base de datos", "Error al crear Tablas: " + e.message);
    }
  }

  async insertarDatos() {
    try {
      await this.database.executeSql(this.insertRolCliente, []);
      await this.database.executeSql(this.insertRolVendedor, []);
      await this.database.executeSql(this.insertRolAdministrador, []);

      await this.database.executeSql(this.insertPregunta1, []);
      await this.database.executeSql(this.insertPregunta2, []);
      await this.database.executeSql(this.insertPregunta3, []);

      await this.database.executeSql(this.insertUsuario1, []);

      await this.database.executeSql(this.insertCompra1, []);

      await this.database.executeSql(this.insertCat1, []);
      await this.database.executeSql(this.insertCat2, []);
      await this.database.executeSql(this.insertCat3, []);
      await this.database.executeSql(this.insertCat4, []);
      await this.database.executeSql(this.insertCat5, []);
      await this.database.executeSql(this.insertCat6, []);
      await this.database.executeSql(this.insertCat7, []);
      await this.database.executeSql(this.insertCat8, []);
      await this.database.executeSql(this.insertCat9, []);
      await this.database.executeSql(this.insertCat10, []);
      await this.database.executeSql(this.insertCat11, []);

      await this.database.executeSql(this.insertDir1, []);
      await this.database.executeSql(this.insertDir2, []);

      await this.database.executeSql(this.insertProd1, []);
      await this.database.executeSql(this.insertProd2, []);
      await this.database.executeSql(this.insertProd3, []);
      await this.database.executeSql(this.insertProd4, []);
      await this.database.executeSql(this.insertProd5, []);
      await this.database.executeSql(this.insertProd6, []);
      await this.database.executeSql(this.insertProd7, []);
      await this.database.executeSql(this.insertProd8, []);
      await this.database.executeSql(this.insertProd9, []);
      await this.database.executeSql(this.insertProd10, []);
      await this.database.executeSql(this.insertProd11, []);
      await this.database.executeSql(this.insertProd12, []);
      await this.database.executeSql(this.insertProd13, []);
      await this.database.executeSql(this.insertProd14, []);

      await this.database.executeSql(this.insertUnion1_1, []);
      await this.database.executeSql(this.insertUnion1_2, []);
      await this.database.executeSql(this.insertUnion1_3, []);
      await this.database.executeSql(this.insertUnion1_4, []);
      //
      await this.database.executeSql(this.insertUnion2_1, []);
      await this.database.executeSql(this.insertUnion2_2, []);
      await this.database.executeSql(this.insertUnion2_3, []);
      await this.database.executeSql(this.insertUnion2_4, []);
      //
      await this.database.executeSql(this.insertUnion3_1, []);
      await this.database.executeSql(this.insertUnion3_2, []);
      await this.database.executeSql(this.insertUnion3_3, []);
      await this.database.executeSql(this.insertUnion3_4, []);
      //
      await this.database.executeSql(this.insertUnion4_1, []);
      await this.database.executeSql(this.insertUnion4_2, []);
      await this.database.executeSql(this.insertUnion4_3, []);
      await this.database.executeSql(this.insertUnion4_4, []);
      //
      await this.database.executeSql(this.insertUnion5_1, []);
      await this.database.executeSql(this.insertUnion5_2, []);
      await this.database.executeSql(this.insertUnion5_3, []);
      //
      await this.database.executeSql(this.insertUnion6_1, []);
      await this.database.executeSql(this.insertUnion6_2, []);
      await this.database.executeSql(this.insertUnion6_3, []);
      //
      await this.database.executeSql(this.insertUnion7_1, []);
      await this.database.executeSql(this.insertUnion7_2, []);
      await this.database.executeSql(this.insertUnion7_3, []);
      await this.database.executeSql(this.insertUnion7_4, []);
      //
      await this.database.executeSql(this.insertUnion8_1, []);
      await this.database.executeSql(this.insertUnion8_2, []);
      await this.database.executeSql(this.insertUnion8_3, []);
      await this.database.executeSql(this.insertUnion8_4, []);
      //
      await this.database.executeSql(this.insertUnion9_1, []);
      await this.database.executeSql(this.insertUnion9_2, []);
      await this.database.executeSql(this.insertUnion9_3, []);
      await this.database.executeSql(this.insertUnion9_4, []);
      //
      await this.database.executeSql(this.insertUnion10_1, []);
      await this.database.executeSql(this.insertUnion10_2, []);
      await this.database.executeSql(this.insertUnion10_3, []);
      await this.database.executeSql(this.insertUnion10_4, []);
      //
      await this.database.executeSql(this.insertUnion11_1, []);
      await this.database.executeSql(this.insertUnion11_2, []);
      await this.database.executeSql(this.insertUnion11_3, []);
      await this.database.executeSql(this.insertUnion11_4, []);
      //
      await this.database.executeSql(this.insertUnion12_1, []);
      await this.database.executeSql(this.insertUnion12_2, []);
      await this.database.executeSql(this.insertUnion12_3, []);
      await this.database.executeSql(this.insertUnion12_4, []);
      //
      await this.database.executeSql(this.insertUnion13_1, []);
      await this.database.executeSql(this.insertUnion13_2, []);
      await this.database.executeSql(this.insertUnion13_3, []);
      //
      await this.database.executeSql(this.insertUnion14_1, []);
      await this.database.executeSql(this.insertUnion14_2, []);
      await this.database.executeSql(this.insertUnion14_3, []);

    } catch (e: any) {
      this.presentAlert("Error", "Error en la base de datos", "Error al insertar datos: " + e.message);
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


  async presentAlert(head: string, subhead: string, msj: string) {
    const alert = await this.alertController.create({
      header: head,
      subHeader: subhead,
      message: msj,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
