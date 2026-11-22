//Importamos express
const express = require("express");
//Creamos la app
const app = express();
// Guardamos un puerto 
const PORT = process.env.PORT || 3000;
//Vamos a dar una respuesta cuando alguien haga una peticion como por ejemplo entrar

function respuesta(req,res){
    res.send("Servidor De Parchis Funcionando");
}

app.get("/",respuesta);

//Vamos a hacer que escuche el puerto asignado y nos de mensaje por consola
app.listen(PORT, () =>{
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
})