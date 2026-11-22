//Importamos express, socket.io, http
const express = require("express");
//Creamos la app
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const path = require('path');

// Guardamos un puerto 
const PORT = process.env.PORT || 3000;
//Vamos a dar una respuesta cuando alguien haga una peticion como por ejemplo entrar

function respuesta(req,res){
    res.sendFile(path.join(__dirname, "prueba.html"));
}

app.get("/",respuesta);


io.on("connection", socket =>{
    const id = socket.id
    console.log("Jugador Conectado id: " + id);
    socket.on("disconnect", mensaje =>{
    console.log("Jugador Desconectado id: " + id);
    console.log(mensaje)
})
})



//Vamos a hacer que escuche el puerto asignado y nos de mensaje por consola
http.listen(PORT, () =>{
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
})