const { log } = require("console");
const express = require("express");
const { Server: HttpServer } = require("http");
const { Server: IOServer, Socket } = require("socket.io");
const Container = require("./ddbb/clase-Container");
const Mensajes = require("./ddbb/clase-Mensajes");

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

// instancio objetos de las clases Container y Mensajes
const productos = new Container({ fileName: "products" });
const mensajes = new Mensajes({ fileName: "mensajes" });

//codificacion
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//configuracion de Router
// const routerProductos = require("./routes/api");
// app.use(routerProductos);

// ++++++++++++++++++++++++++++++++++++++++++++++++
// Socket.io
//? PRODUCTOS
io.on("connection", async (socket) => {
  // PRODUCTOS
  console.log(`Nuevo cliente ${socket.id} conectado`);
  socket.emit("productos", await productos.getAll()); // envio a los clientes nuevos conectado los productos
  // recibo el producto  nuevo,  lo guardo y envio la lista
  socket.on("agregarProducto", async (producto) => {
    console.log(producto);
    await productos.save(producto);
    io.sockets.emit("productos", await productos.getAll());
  });

  //? MENSAJES
  // envio todos los mensajes a los conectados
  socket.emit("mensajes", await mensajes.getAll());

  socket.on("new-message", async (data) => {
    await mensajes.save(data);
    io.sockets.emit("mensajes", await mensajes.getAll());
  });
});

/**++++++++++++++++++++++++++++++++++++++++++++++ */
// Server Listen

const PORT = process.env.PORT || 8080;

const connectedServer = httpServer.listen(PORT, () => {
  console.log(
    `Servidor Http con Websockets escuchando en el puerto ${
      connectedServer.address().port
    }`
  );
});

connectedServer.on("error", (error) =>
  console.log(`Error en el server:${error}`)
);
