//aqui realizamos la coneccion con la base de datos

const { MongoClient } = require("mongodb");

const url = "mongodb://127.0.0.1:27017"; // no usar localhost!!

//generamos un nuevo cliente para el servicio de MongoDb
const client = new MongoClient(url);

//Inidcamos el nombre exacto de nuestra base de datos
const dbName = "Ada";

//creamos una función asincronica para realizar la conección
const main = async () => {
  //con el cliente generado con MongoClient, realizamos la conección, no olvidar el "await"
  await client.connect();
  console.log("Conectado");
  //una vez conectados, retornamos la coneección a la base de datos y la colección
  return client.db(dbName).collection("desarrolladores");
};

module.exports = main;
