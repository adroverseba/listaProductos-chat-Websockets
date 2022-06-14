const fs = require("fs");

class Container {
  constructor({ fileName }) {
    this.fileName = fileName;
  }

  async createFile() {
    try {
      await fs.promises.writeFile(`${__dirname}/${this.fileName}.JSON`, "[]");
    } catch (error) {
      console.log(error);
    }
  }

  async save(objeto) {
    try {
      //genero la lectura del archivo JSON y lo guardo en la variable read
      const read = JSON.parse(
        await fs.promises.readFile(
          `${__dirname}/${this.fileName}.JSON`,
          "utf-8"
        )
      );
      if (objeto.length >= 1) {
        //por cada uno de los elementos del array de objetos a agregar, le asigno un nuevo ID y los agrego al array read
        objeto.forEach((element) => {
          element.id = read.length + 1;
          read.push(element);
        });
      } else {
        //para los casos donde el producto agregado no es un array de objetos le asigno un ID y lo pusheo al array read
        objeto.id = read.length + 1;
        read.push(objeto);
      }
      await fs.promises.writeFile(
        `${__dirname}/${this.fileName}.JSON`,
        JSON.stringify(read, null, 2)
      );
      // console.log(`el ID del elemento nuevo guardado es: ${objeto.id}`);      verificacion de la fucionalidad
      // return objeto;
    } catch (error) {
      console.log(error);
    }
  }

  async getById(id) {
    try {
      const read = JSON.parse(
        await fs.promises.readFile(
          `${__dirname}/${this.fileName}.JSON`,
          "utf-8"
        )
      );
      //genero un localizador de id para saber si el mismo buscado existe o no, en base a eso responder
      const locateId = read.some((element) => element.id == id);
      if (!locateId) {
        // return `El id ingresado no es valido, pruebe con algun numero superior a 0 y menor o igual a ${read.length}`;   if (!producto) res.status(404).send();
        return { error: "producto no encontrado" };
      } else {
        const elemento = read.filter((element) => element.id == id);
        // console.log(elemento); prueba de funcionalidad
        return elemento;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteById(id) {
    try {
      const read = JSON.parse(
        await fs.promises.readFile(
          `${__dirname}/${this.fileName}.JSON`,
          "utf-8"
        )
      );
      const locateID = read.some((element) => element.id == id);
      if (!locateID) {
        return { error: "El elemento que desea borrar no existe" };
      } else {
        read.map((product, index) => {
          if (product.id == id) {
            read.splice(index, 1);
          }
        });
        //recorro todo el array actualizando los valores de los id
        read.map((element, index) => (element.id = index + 1));
        await fs.promises.writeFile(
          `${__dirname}/${this.fileName}.JSON`,
          JSON.stringify(read, null, 2)
        );
        return { mensaje: "Se actualizo correctamente la lista de productos" };
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteAll() {
    try {
      await fs.promises.writeFile(`${__dirname}/${this.fileName}.JSON`, "[]");
      console.log("El contenido ha sido borrado con Exito");
    } catch (error) {
      throw new Error(error);
    }
  }
  async getAll() {
    try {
      const read = JSON.parse(
        await fs.promises.readFile(
          `${__dirname}/${this.fileName}.JSON`,
          "utf-8"
        )
      );
      // console.log(read); // verificacion de funcionamiento
      return read;
    } catch (error) {
      throw new Error(error);
    }
  }

  async modifyById(id, productModify) {
    const read = JSON.parse(
      await fs.promises.readFile(`${__dirname}/${this.fileName}.JSON`, "utf-8")
    );
    const productFind = read.some((producto) => producto.id == id);
    if (productFind) {
      read.map((prod) => {
        if (prod.id == id) {
          prod.title = productModify.title ? productModify.title : prod.title;
          prod.price = productModify.price ? productModify.price : prod.price;
          prod.thumbnail = productModify.thumbnail
            ? productModify.thumbnail
            : prod.thumbnail;
        }
      });
      await fs.promises.writeFile(
        `${__dirname}/${this.fileName}.JSON`,
        JSON.stringify(read, null, 2)
      );
      return read[id - 1];
    } else {
      return { error: "Producto no encontrado" };
    }
  }
}

module.exports = Container;
