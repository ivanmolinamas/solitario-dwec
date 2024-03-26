/***** INICIO DECLARACIÓN DE VARIABLES GLOBALES *****/

console.log("Carga Solitario.js")
window.addEventListener("load", inicio);
//window.addEventListener("load", comenzar_juego)


// Array de palos:
let palos = ["ova", "cua", "hex", "cir"];
// Array de número de cartas:
//let numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
// En las pruebas iniciales solo se trabajará con cuatro cartas por palo:
let numeros = [9, 10, 11, 12];

// Paso (top y left) en pixeles de una carta a la siguiente en un mazo:
let paso = 5;

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
let cont_inicial = document.getElementById("cont_inicial");
let cont_sobrantes = document.getElementById("contador_sobrantes");
let cont_receptor1 = document.getElementById("cont_receptor1");
let cont_receptor2 = document.getElementById("cont_receptor2");
let cont_receptor3 = document.getElementById("cont_receptor3");
let cont_receptor4 = document.getElementById("cont_receptor4");
let cont_movimientos = document.getElementById("cont_movimientos");

// Tiempo
let cont_tiempo = document.getElementById("cont_tiempo"); // span cuenta tiempo
let segundos = 0;    // cuenta de segundos
let temporizador = null; // manejador del temporizador

/***** FIN DECLARACIÓN DE VARIABLES GLOBALES *****/

//BOTON RESET COMENTADO!!!!!!!!!!!
// Rutina asociada a boton reset: comenzar_juego
//document.getElementById("reset").onclick = comenzar_juego;

// El juego arranca ya al cargar la página: no se espera a reiniciar
/*** !!!!!!!!!!!!!!!!!!! CÓDIGO !!!!!!!!!!!!!!!!!!!! **/

//window.onload = comenzar_juego;
window.addEventListener("load", comenzar_juego)


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
			imgCarta.setAttribute("alt", "Carta de baraja");
			imgCarta.setAttribute("width", "85");
			var carta = [
				imgCarta,
				numero,
				palo
			]
			//metemos las carats en un array
			mazo_inicial.push(carta);
			//console.log(mazo_inicial);
		}
	}



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
function inicio() {
	console.log("linea de iniciar tiempo boton");
	document.getElementById("iniciarTiempo").addEventListener("click", arrancar_tiempo)
}


function arrancar_tiempo() {
	/*** !!!!!!!!!!!!!!!!!!! CÓDIGO !!!!!!!!!!!!!!!!!!!! **/
	console.log("Ping arranca_tiempo");
	var cont_tiempo = document.getElementById("contador_tiempo");

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
function barajar(mazo) {
	/*** !!!!!!!!!!!!!!!!!!! CÓDIGO !!!!!!!!!!!!!!!!!!!! **/
	console.log("PING BARAJAR MAZO")
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
	/*** !!!!!!!!!!!!!!!!!!! CÓDIGO !!!!!!!!!!!!!!!!!!!! **/
	// poner las cartas en el tapete
	//añadir los elementos del mazo en un div del array
	console.log("funcion cargar tapete inicial");
	//tapete es el div con id tapete_inicial	
	var tapete = document.getElementById("inicial");
	// Crear un nuevo div para las cartas del tapete
	var tapete_cartas = document.createElement("div");


	//variables de inicio de posiciones horizontal y vertical
	let posicionHorizontal = 0;
	let posicionVertical = 0;

	// Iterar sobre cada carta en el array baraja
	mazo.forEach(carta => {
		// Agregar la clase "principal" a cada carta
		//carta.classList.add("principal");
		var imgCarta = carta[0];
		// Establecer la posición de la carta
		imgCarta.classList.add("carta")
		imgCarta.style.left = `${posicionHorizontal}px`;
		imgCarta.style.top = `${posicionVertical}px`;

		// Aumentar la posición para la siguiente carta
		posicionHorizontal += 6; // Ajusta este valor según el desplazamiento horizontal deseado
		posicionVertical += 6; // Ajusta este valor según el desplazamiento vertical deseado

		// Agregar la carta al contenedor en el documento HTML
		tapete_cartas.appendChild(imgCarta);

	});
	// Agregar el nuevo div de cartas al tapete inicial
	tapete.appendChild(tapete_cartas);
} // cargar_tapete_inicial

/**
	  Esta función debe incrementar el número correspondiente al contenido textual
		  del elemento que actúa de contador
*/
function inc_contador(contador) {
	contador.innerHTML = +contador.innerHTML + 1;
} // inc_contador

/**
	Idem que anterior, pero decrementando 
*/
function dec_contador(contador) {
	/*** !!!!!!!!!!!!!!!!!!! CÓDIGO !!!!!!!!!!!!!!!!!!!! ***/
	contador.innerHTML = +contador.innerHTML + 1;
} // dec_contador

/**
	Similar a las anteriores, pero ajustando la cuenta al valor especificado
*/
function set_contador(contador, valor) {
	/*** !!!!!!!!!!!!!!!!!!! CÓDIGO !!!!!!!!!!!!!!!!!!!! **/
	contador.innerHTML = valor;
} // set_contador


console.log("Mazo inicial:")
console.log(mazo_inicial);


// Desarrollo de la continuación del juego
// Funciones drag & drop
/*** !!!!!!!!!!!!!!!!!!! CÓDIGO !!!!!!!!!!!!!!!!!!!! **/

// Crear funcion que mueva cartas a los diferentes zonzas receptoras
// la ide es que coja la imagen y la cambie del array de mazo al array receptor
//abra que borrar de uno y agregar a otro
//deberia tener dataset el html

//debera haber una funcion que actualize los receptores, sobrantes y mazo cada movimiento
//en funcion de si es receptor, mazo o sobrante tendra una posicion sobre el tapete
//es importante diferenciar entre los tres por el tema de la posicion

//abra que comprobar que sean movimientos validos




