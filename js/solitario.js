/***** INICIO DECLARACIÓN DE VARIABLES GLOBALES *****/



// Array de palos:
let palos = ["ova", "cua", "hex", "cir"];
// Array de número de cartas:
//let numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
// En las pruebas iniciales solo se trabajará con cuatro cartas por palo:
let numeros = [9, 10, 11, 12];

// Paso (top y left) en pixeles de una carta a la siguiente en un mazo:
let paso = 15;

// Tapetes				
let tapete_inicial = document.getElementById("inicial");
let tapete_sobrantes = document.getElementById("sobrantes");
let tapete_receptor1 = document.getElementById("receptor1");
let tapete_receptor2 = document.getElementById("receptor2");
let tapete_receptor3 = document.getElementById("receptor3");
let tapete_receptor4 = document.getElementById("receptor4");

// Mazos
let mazo_inicial = [];
let mazo_sobrantes = [];
let mazo_receptor1 = [];
let mazo_receptor2 = [];
let mazo_receptor3 = [];
let mazo_receptor4 = [];

// Contadores de cartas
let cont_inicial = document.getElementById("contador_inicial");
let cont_sobrantes = document.getElementById("contador_sobrantes");
let cont_receptor1 = document.getElementById("contador_receptor1");
let cont_receptor2 = document.getElementById("contador_receptor2");
let cont_receptor3 = document.getElementById("contador_receptor3");
let cont_receptor4 = document.getElementById("contador_receptor4");
let cont_movimientos = document.getElementById("contador_movimientos");

let numMovimientos = 0;
let numCartasTapete = 0;
let numCartasReceptor1 = 0;
let numCartasReceptor2 = 0;
let numCartasReceptor3 = 0;
let numCartasReceptor4 = 0;


// Tiempo
//let cont_tiempo = document.getElementById("cont_tiempo"); // span cuenta tiempo
let segundos = 0;    // cuenta de segundos
let temporizador = null; // manejador del temporizador

/***** FIN DECLARACIÓN DE VARIABLES GLOBALES *****/


//BOTON RESET COMENTADO!!!!!!!!!!!
// Rutina asociada a boton reset: comenzar_juego
document.getElementById("reset").onclick = comenzar_juego;

// El juego arranca ya al cargar la página: no se espera a reiniciar
/*** !!!!!!!!!!!!!!!!!!! CÓDIGO !!!!!!!!!!!!!!!!!!!! **/

//window.onload = comenzar_juego;
window.addEventListener("load", comenzar_juego)

document.getElementById("reset").addEventListener("click", reiniciarJuego);


//window.addEventListener("load", inicio);
//window.addEventListener("load", comenzar_juego)


// Desarrollo del comienzo del juego
function comenzar_juego() {
	/* Crear baraja, es decir crear el mazo_inicial. Este será un array cuyos 
	elementos serán elementos HTML <img>, siendo cada uno de ellos una carta.
	Sugerencia: en dos bucles "for", bárranse los "palos" y los "numeros", formando
	oportunamente el nombre del fichero "png" que contiene a la carta (recuérdese poner
	el "path" correcto en la URL asociada al atributo "src" de <img>). Una vez creado
	el elemento <img>, inclúyase como elemento del array "mazo_inicial". 
	*/

	/*** !!!!!!!!!!!!!!!!!!! CÓDIGO !!!!!!!!!!!!!!!!!!!! **/

	//generar la baraja
	generarBaraja();

	// Barajar
	barajar(mazo_inicial);

	// Dejar mazo_inicial en tapete inicial
	cargar_tapete_inicial(mazo_inicial);

	// Puesta a cero de contadores de mazos
	set_contador(cont_sobrantes, 0);
	set_contador(cont_receptor1, 0);
	set_contador(cont_receptor2, 0);
	set_contador(cont_receptor3, 0);
	set_contador(cont_receptor4, 0);
	set_contador(cont_movimientos, 0);

	// Arrancar el conteo de tiempo
	arrancar_tiempo();

} // comenzar_juego


/**
	Se debe encargar de arrancar el temporizador: cada 1000 ms se
	debe ejecutar una función que a partir de la cuenta autoincrementada
	de los segundos (segundos totales) visualice el tiempo oportunamente con el 
	format hh:mm:ss en el contador adecuado.

	Para descomponer los segundos en horas, minutos y segundos pueden emplearse
	las siguientes igualdades:

	segundos = truncar (   segundos_totales % (60)                 )
	minutos  = truncar ( ( segundos_totales % (60*60) )     / 60   )
	horas    = truncar ( ( segundos_totales % (60*60*24)) ) / 3600 )

	donde % denota la operación módulo (resto de la división entre los operadores)

	Así, por ejemplo, si la cuenta de segundos totales es de 134 s, entonces será:
	   00:02:14

	Como existe la posibilidad de "resetear" el juego en cualquier momento, hay que 
	evitar que exista más de un temporizador simultáneo, por lo que debería guardarse
	el resultado de la llamada a setInterval en alguna variable para llamar oportunamente
	a "clearInterval" en su caso.   
*/


function arrancar_tiempo() {
	/*** !!!!!!!!!!!!!!!!!!! CÓDIGO !!!!!!!!!!!!!!!!!!!! **/
	var cont_tiempo = document.getElementById("contador_tiempo");
	console.log("valor cont_tiempo en arracar tiempo" + cont_tiempo);
	if (temporizador) clearInterval(temporizador);
	var hms = function () {
		var seg = Math.trunc(segundos % 60);
		var min = Math.trunc((segundos % 3600) / 60);
		var hor = Math.trunc((segundos % 86400) / 3600);
		var tiempo = ((hor < 10) ? "0" + hor : "" + hor)
			+ ":" + ((min < 10) ? "0" + min : "" + min)
			+ ":" + ((seg < 10) ? "0" + seg : "" + seg);
		set_contador(cont_tiempo, tiempo);
		segundos++;
	}
	segundos = 0;
	hms(); // Primera visualización 00:00:00
	temporizador = setInterval(hms, 1000);

} // arrancar_tiempo


/**
	Si mazo es un array de elementos <img>, en esta rutina debe ser
	reordenado aleatoriamente. Al ser un array un objeto, se pasa
	por referencia, de modo que si se altera el orden de dicho array
	dentro de la rutina, esto aparecerá reflejado fuera de la misma.
	Para reordenar el array puede emplearse el siguiente pseudo código:

	- Recorramos con i todos los elementos del array
		- Sea j un indice cuyo valor sea un número aleatorio comprendido 
			entre 0 y la longitud del array menos uno. Este valor aleatorio
			puede conseguirse, por ejemplo con la instrucción JavaScript
				Math.floor( Math.random() * LONGITUD_DEL_ARRAY );
		- Se intercambia el contenido de la posición i-ésima con el de la j-ésima

*/
/**
	 * Generar baraja, crea elementos img y el src los botiene de un bucle for generando las imagenes 
	 */
function generarBaraja() {
	//codigo de baraja
	for (let i = 0; i < palos.length; i++) {
		//Se generan los palos
		var palo = palos[i];
		for (let x = 0; x < numeros.length; x++) {
			//declaro la variable numero para el numero de la carta
			var numero = numeros[x];
			//creo la carta
			var imgCarta = document.createElement("img");
			//asingo atributo scr, alt y ancho a la carta 
			imgCarta.setAttribute("src", "imagenes/baraja/" + numero + "-" + palo + ".png");
			imgCarta.setAttribute("alt", "Carta de baraja " + idcarta);
			//le asignamos un ID
			var idcarta = palo + "-" + numero;
			imgCarta.setAttribute("id", idcarta)
			//acemos que sea arrastable
			imgCarta.setAttribute("draggable", "true");
			imgCarta.setAttribute("ondragstart", "dragStart(event)")
			//le asignamos segun el palo el color
			var color = (palo == "ova" || palo == "cua") ? "naranja" : "gris";
			//establecemos dataset numero, palo y color
			imgCarta.dataset.numero = numero;
			imgCarta.dataset.palo = palo;
			imgCarta.dataset.color = color;
			//le damos la posicion de la carta
			//imgCarta.dataset.ubicacion = "mazo";
			//metemos las cartas en el array mazo_inicial
			mazo_inicial.push(imgCarta);
		}
	}
}
function barajar(mazo) {
	// Recorremos el array desde el final hasta el principio
	for (let i = mazo.length - 1; i > 0; i--) {
		// Generamos un índice aleatorio entre 0 y i
		const j = Math.floor(Math.random() * (i + 1));
		// Intercambiamos los elementos en las posiciones i y j
		[mazo[i], mazo[j]] = [mazo[j], mazo[i]];
	}
	return mazo;

} // barajar



/**
	En el elemento HTML que representa el tapete inicial (variable tapete_inicial)
	se deben añadir como hijos todos los elementos <img> del array "mazo".
	Antes de añadirlos, se deberían fijar propiedades como la anchura, la posición,
	coordenadas "top" y "left", algun atributo de tipo "data-", etc.
	Al final se debe ajustar el contador de cartas a la cantidad oportuna
*/
function cargar_tapete_inicial(mazo) {
	//tapete es el div con id tapete_inicial	
	var tapete = document.getElementById("inicial");
	// Crear un nuevo div para las cartas del tapete
	var tapete_cartas = document.createElement("div");
	tapete_cartas.setAttribute("id", "tapete_inicial");

	//variables de inicio de posiciones horizontal y vertical
	let posicionHorizontal = 0;
	let posicionVertical = 0;

	// Iterar sobre cada carta en el array baraja
	mazo.forEach(carta => {
		// Establecer la posición de la carta para cargar el tapete inicial
		carta.classList.add("carta")
		carta.style.left = `${posicionHorizontal}px`;
		carta.style.top = `${posicionVertical}px`;
		//añadimos el dataset ubitacion
		carta.dataset.ubicacion = "mazo";

		// Aumentar la posición para la siguiente carta
		posicionHorizontal += 6; // Ajusta este valor según el desplazamiento horizontal deseado
		posicionVertical += 6; // Ajusta este valor según el desplazamiento vertical deseado

		// Agregar la carta al contenedor en el documento HTML
		tapete_cartas.appendChild(carta);

	});
	// Agregar el nuevo div de cartas al tapete inicial
	tapete.appendChild(tapete_cartas);

	//contador de cartas
	numCartasTapete = mazo_inicial.length;
	set_contador(cont_inicial, numCartasTapete)
} // cargar_tapete_inicial

/**
	  Esta función debe incrementar el número correspondiente al contenido textual
		  del elemento que actúa de contador
*/

function inc_contador(contador) {
	contador.textContent = parseInt(contador.textContent) + 1;
} // inc_contador

/**
	Idem que anterior, pero decrementando 
*/
function dec_contador(contador) {
	/*** !!!!!!!!!!!!!!!!!!! CÓDIGO !!!!!!!!!!!!!!!!!!!! ***/
	contador.textContent = parseInt(contador.textContent) - 1;
} // dec_contador

/**
	Similar a las anteriores, pero ajustando la cuenta al valor especificado
*/
function set_contador(contador, valor) {
	// Verifica si el contador es un elemento del DOM
	if (contador instanceof HTMLElement) {
		// Establece el valor del contador en el HTML
		contador.textContent = valor;
	}
} // set_contador


// contador de cartas sobrantes
function contadorSobrantes() {
	var numeroTotalCartasSobrantes = mazo_sobrantes.length;

	cont_sobrantes.innerHTML = numeroTotalCartasSobrantes;
}


// Funcion reiniciar el Juego
function reiniciarJuego() {
	//Si se reinicia el juego debe:
	// limpiarse los mazos sobrantes y receptores
	//volver a barajar y reiniciar tiempo

	//se formatean los mazos a 0
	mazo_inicial = [];
	mazo_sobrantes = [];
	mazo_receptor1 = [];
	mazo_receptor2 = [];
	mazo_receptor3 = [];
	mazo_receptor4 = [];
	//borramos el div que contiene las cartas
	var tapete = document.getElementById("inicial");
	var hijo = tapete.lastChild; //selecionar el ultimo hijo
	//eliminar el nodo donde estan las cartas del tapete principal
	tapete.removeChild(hijo);
	//se vacian los receptores
	actualizarPosicionCartasHTML();
	//se comienza el juego
	comenzar_juego();
}


// CUANDO MAZO TAPETE PRINCIPAL ESTE A 0 BARAJAR SOBRANTES Y VOLVER A DISPONER

//comprobar que mazo tapete inicial es 0
//si es 0 entonces funcion barajar
//funcion poner sobre el tapete


//LOS TAPETES RECEPTORES LLEVAN CONTADOR DE CARTAS,  Y EL TAPETE PRINCIPAL TAMBIEN!!!



// Desarrollo de la continuación del juego
// Funciones drag & drop
/*** !!!!!!!!!!!!!!!!!!! CÓDIGO !!!!!!!!!!!!!!!!!!!! **/



//abra que comprobar que sean movimientos validos

function dragStart(event) {
	event.dataTransfer.setData("Text/plain", event.target.id);
}

function allowDrop(event) {
	event.preventDefault();
	//evento que se activa al pasar un arrastrado por enicma
	//event.target.classList.add("target");
}

/**
 * 
 * esta funcion se activa cuadno se arrastra una carta y se suelta en un area
 * independiente de si es sobre una zona de recepcion o una carta la pondra 
 * en el mazo correspondiente
 */
function drop(event) {
	event.preventDefault();
	var data = event.dataTransfer.getData("Text/plain");

	//obtengo la carta arrastrada por el ID
	cartaArrastrada = document.getElementById(data);

	//obtengo la zona donde se quiere arrastrar la carta
	var zonaDestino = event.target.id;

	//obtengo el padre del destino(por si es carta o es zona div)
	var padre = event.target.parentNode;

	// Obtener el ID del padre
	var idDelPadre = padre.id;

	//obtengo de donde proviene la carta
	var origen = cartaArrastrada.dataset.ubicacion;

	//compruebo si es el padre o el hijo la zona destino
	var idPadreSubstring = idDelPadre.substring(0, 8);

	// en esta variable guardare la zona de destino de la carta
	var idContenedorDestino = zonaDestino;
	//comprobar que el receptor es la carta
	//si el id del padre es receptor o parecido, esta dejando la carta sobre otra carta
	//tambien para la zona de sobrantes
	if ("receptor" == idPadreSubstring || "sobrante" == idPadreSubstring) {
		idContenedorDestino = idDelPadre;//asignamos el id del padre en caso que sea true
	}
	comprobarJugada(cartaArrastrada, origen, idContenedorDestino)
	//usamos la funcion cambioMazo para cambiar las cartas de posicion en los array
	//cambioMazo(cartaArrastrada, origen, idContenedorDestino);



}

let mazos = {
	"mazo": mazo_inicial,
	"sobrantes": mazo_sobrantes,
	"receptor1": mazo_receptor1,
	"receptor2": mazo_receptor2,
	"receptor3": mazo_receptor3,
	"receptor4": mazo_receptor4
};
let contadores = {
	"mazo": cont_inicial,
	"sobrantes": cont_sobrantes,
	"receptor1": cont_receptor1,
	"receptor2": cont_receptor2,
	"receptor3": cont_receptor3,
	"receptor4": cont_receptor4,
}

/**
 * Funcion comprobar jugadas, esta funcion comprueba que se inicie con un 12 y
 * que los colores son alternos
 */
function comprobarJugada(carta, origen, destino) {
	//obtengo la carta y la zona de destino
	//compruebo que la zona de destino esta vacia, y si lo esta la carta debe ser un 12
	var mazoDestino = mazos[destino]
	var cartasEnMazoDestino = mazos[destino].length;

	//variables de numero y color de carta para la jugada
	var numeroCarta = carta.dataset.numero
	var colorCarta = carta.dataset.color
	//comprobamos si el mazo esta vacio
	var mazoVacio = (cartasEnMazoDestino === 0) ? true : false;
	//comprueba que la carta sea un 12
	var esCarta12 = (numeroCarta == 12) ? true : false;
	//comprobamos si la carta va jugada o sobrantes
	var cartaJugada = (destino != "sobrantes") ? true : false;
	//obtenemos el valor del numero de la ultima carta de la pila desitno
	var ultimaCartaEnMazo = mazoDestino[cartasEnMazoDestino - 1];

	//compruego las jugadas en funcion de sus propiedades
	if (cartaJugada) {
		//comprueba que la carta es 12 y el mazo estan vacios
		if (mazoVacio && esCarta12) {
			//movimiento de carta OK 12 a vacio
			cambioMazo(carta, origen, destino);
		}
		if (cartasEnMazoDestino != 0 && (ultimaCartaEnMazo.dataset.numero - 1) == numeroCarta && ultimaCartaEnMazo.dataset.color != colorCarta) {
			//en esta pila hay cartas
			//se acepta la jugada porque la carta es un numero menos a la que hay y diferente color
			cambioMazo(carta, origen, destino);
		}
	} else {
		console.log("carta que va a sobrante");
		cambioMazo(carta, origen, destino);
	}

	//compruebo el estado de los mazos sobrantes y tapete
	barajarYrepartirSobrantes();
}
//Funcion que se le pasa la carta y la zona destino y cambia la carta al array que toca
//borrar la carta de donde estaba quizas pueda saber donde estaba con un data en html
//array -> mazo_receptor1 | HTML -> receptor1 | 

//creo un array con los mazos referenciados con el nombre y su array



//funcion para cambiar las cartas de array, se define que carta, origen y desitno para su cambio
function cambioMazo(carta, origen, destino) {

	//se obtiene el array de destino segun su nombre destino
	mazo_origen = mazos[origen];

	//se obtiene en el array el mazo destino por su nombre
	mazo_destino = mazos[destino];

	//agrego la carta al destino
	mazo_destino.push(carta);

	//quito la ultima carta de origen
	mazo_origen.pop();

	//refresco el HTML
	actualizarPosicionCartasHTML();
	//actualizamos contadores
	console.log(contadores[destino]);
	console.log(contadores[origen]);

	inc_contador(contadores[destino]);
	dec_contador(contadores[origen]);

}


// funcion para actualiar la posicion de las cartas en HTML desde los mazos receptores
function actualizarPosicionCartasHTML() {
	//esta funcion coje los diferentes mazos receptores y los coloca en sus correspondientes receptores
	//cojo las cartas de las pilas
	//construyo a partir de ellas un elemento
	//agrego la imagen correspondiente
	//guardo en el elemento html correspondiente

	// Array de arrays, para iterar con un for sobre los mazos
	let mazos = [mazo_receptor1, mazo_receptor2, mazo_receptor3, mazo_receptor4];

	for (let i = 0; i < mazos.length; i++) {
		var tapete_destino = document.getElementById(`receptor${i + 1}`)

		for (let y = 0; y < mazos[i].length; y++) {
			var carta = mazos[i][y]; //obtengo la carta del array y posicion
			carta.style.left = "10px"; //posicionamos para centrar
			carta.style.top = `${y * paso}px`; //con el bucle for amplio los espacios top
			carta.dataset.ubicacion = `receptor${i + 1}`
			// Agregar la carta al tapete destino en el documento HTML
			tapete_destino.appendChild(carta);
		}
	}

	mazo_sobrantes.forEach(carta => {
		var tapte_sobrantes = document.getElementById("sobrantes");
		carta.style.left = "10px"; //posicionamos para centrar
		carta.style.top = '10px'; //con el bucle for amplio los espacios top
		carta.dataset.ubicacion = 'sobrantes'
		// Agregar la carta al tapte_sobrantes en el documento HTML
		tapte_sobrantes.appendChild(carta);

	});
	contadorSobrantes(); //actualizamos el numero de cartas sobrantes
}

function cartaDragable(carta, pila) {

	//obtengo el array y compruebo si esta vacio
	//si esta vacio no hago nada
	//si esta lleno tengo que, decir que la ultima carta es dragable
	//puedo obtener la longitud del array -1 para poner una condicion
	//si la carta.numero == longitud-1 entonces es dragable
	// true false, dragable con un if o condcional
}

function barajarYrepartirSobrantes() {
	//si el mazo inicial esta vacio y sobrantes hay cartas
	//barajar y vover a disponer
	//var cartasEnInicial = mazo_inicial.length;
	//var cartasEnSobrantes = mazo_sobrantes.length;

	if (mazo_inicial.length == 0 && mazo_sobrantes.length > 0) {
		console.log("ejecuto cambio de sobrante a mazo principal!!")
		//cojo las cartas de sobrantes
		mazo_sobrantes.forEach(carta => {
			mazo_inicial.push(carta);
		});
		//borro mazo sobrantes, ahora estan en mazo inicial
		mazo_sobrantes = [];
		//barajo las cartas
		barajar(mazo_inicial)
		// debo borrar el div de mazo inicial!!!!!!!
		var borrarDiv = document.getElementById("tapete_inicial")
		borrarDiv.remove();

		//dispongo sobre el tapete
		cargar_tapete_inicial(mazo_inicial);

	}
}