

class Sala{
    constructor (codigo,nombreSala,maxJugadores,anfitrion){
        this.codigo = codigo;
        this.nombreSala = nombreSala;
        this.maxJugadores = maxJugadores;
        this.jugadores = [anfitrion];
        this.anfitrionId = anfitrion.id;
        this.estado = "esperando";
    }

    //Funciones
    agregarJugador(jugador){
        if( !this.estaLlena()){
            //Añadimos el jugador a la lista de la sala
            this.jugadores.push(jugador);
            return true;
        }
        else{
            return false;
        }
        

    }

   quitarJugador(id) {

        //Eliminamos al jugador de la sala
        this.jugadores = this.jugadores.filter(j => j.id !== id);
    }
    estaLlena(){

        //Para saber si la sala esta llena o no averiguamos la longitud de la lista  y comparamos con el maximo de jugadore
        return this.jugadores.length >= this.maxJugadores;
    }

    
    estaVacia(){
        //Para saber si la sala esta vacia o no averiguamos la longitud de la lista 
        
         return this.jugadores.length < 1;


    }
}

// Exportamos la clase sala 
module.exports = Sala