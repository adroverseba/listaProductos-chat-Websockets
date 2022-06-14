const fs = require("fs");

class Mensajes {
  constructor({ fileName }) {
    this.fileName = fileName;
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
      return objeto;
    } catch (error) {
      console.log(error);
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
      // console.log(read);   // verificacion de funcionamiento
      return read;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports=Mensajes;
