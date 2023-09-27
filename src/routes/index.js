const { Router } = require("express");
const main = require("../db");

const route = Router();

//En base a que ahora en cada ruta se hará una consulta a la base de
//datos de monogDB, es importante hacer que la función controladora, en cargada
//de manejar los objetos de Requeste y Response sean asincronas y
//con un bloque trycatch para el manejo de errores

//ruta para que se den una idea de como sería insertar un nuevo usuario en la base de datos
route.post("/create", async (req, res) => {
  try {
    const newUser = req.body; //==> la información del usuario que se insertará
    const collection = await main(); //generamos la conección
    //utlizamos la misma sintaxis que manejamos en el shell de monogDb para interactuar con la base de datos
    const data = await collection.insertOne(newUser);
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json("Esto no sirvio : (");
  }
});

route.get("/edad/:edad", async (req, res) => {
  try {
    const { edad } = req.params;

    const collection = await main();
    //                              si le pasamos la edad en string, no nos devolvera nada devido que en la base de datos en un dato numerico
    const data = await collection.findOne({ edad: parseInt(edad) });

    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json("Esto no sirvio : (");
  }
});

//AGGREAGATIONS

//las agregaciones son una herramienta muy poderosa de mongo, la cual nos permite
//realizar una serie de pasos sobre una cantidad de información, con el fin de darle una mayo
//legibilidad, y facilitar su manipulación o lectura. Las agregaciones pueden tener distintas etapas

route.get("/salarios-por-departamento", async (req, res) => {
  const collection = await main();

  const agregacion = await collection
    .aggregate([
      {
        $group: {
          _id: "$rol",
          contador: { $sum: "$salario" },
        },
      },
    ])
    .toArray(); //ya que son distintos datos, le decimos que nos lo de en Array
  res.json(agregacion);
});

route.get("/agregacion", async (req, res) => {
  const collection = await main();

  const agregacion = await collection
    .aggregate([
      //primer etapa
      { $match: { edad: { $gt: 10 } } }, //encontrar
      //segunda etapa
      { $limit: 5 }, //pone un limite
      //tercera etapa
      { $sort: { edad: -1 } }, //de mayor a menor para caso contrario poner 1

      //cuarta etapa
      {
        $group: {
          _id: "$rol",
          contador: { $sum: "$salario" },
        },
      },
      //quinta etapa
      {
        $project: {
          contador: 1, //le indico que solo muestre x propiedad
        },
      },
    ])
    .toArray();
  res.json(agregacion);
});

module.exports = route;
