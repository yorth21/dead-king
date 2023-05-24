// Clase para representar un nodo en el tablero de ajedrez
class Nodo {
  constructor(caballos, padre, h) {
    this.caballos = caballos; // Posiciones de los 4 caballos
    this.padre = padre; // Nodo padre en el camino
    this.h = h; // Heurística estimada desde este nodo hasta el nodo final
  }
}

export function buscarCamino(inputCaballos, inputRey) {
  // Validar si hay caballos con mismas posiciones
  function superposicionCaballos(caballos) {
    return caballos.some((item, index) => {
      return caballos.some((element, i) => {
        return i !== index && element.x === item.x && element.y === item.y;
      });
    });
  }

  function superposicionRey(cababallos) {
    return !!cababallos.find(
      (posicion) => posicion.x === inputRey.x && posicion.y === inputRey.y
    );
  }

  function validarFichasSuperpuestas() {
    // Validar caballos superpuestos
    const caballoSuperpuesto = superposicionCaballos(inputCaballos);

    // Validar rey superpuesto
    const reySuperpuesto = superposicionRey(inputCaballos);

    if (caballoSuperpuesto || reySuperpuesto) {
      return true;
    } else {
      return false;
    }
  }

  if (validarFichasSuperpuestas()) {
    console.log("fichas superpuestas");
    return;
  }

  // Funcion para verificar si el EA === EO
  function verificarSiTermino(nodo) {
    const caballos = [...nodo.caballos];
    const estadoRey = reyAmenazado(caballos);
    if (estadoRey) {
      const numPosiblesPosicionesRey = posiblesPosicionesRey.length;
      const numPosicionesReyCubiertas = posicionesReyCubiertas(caballos);
      if (numPosiblesPosicionesRey === numPosicionesReyCubiertas) {
        return true;
      }
    }
    return false;
  }

  // Definir el tablero de ajedrez y las direcciones de movimiento del caballo
  const tamañoTablero = 8;
  const movimientosCaballo = [
    { dx: 2, dy: 1 },
    { dx: 1, dy: 2 },
    { dx: -1, dy: 2 },
    { dx: -2, dy: 1 },
    { dx: -2, dy: -1 },
    { dx: -1, dy: -2 },
    { dx: 1, dy: -2 },
    { dx: 2, dy: -1 },
  ];
  const movimientosRey = [
    { dx: 0, dy: 1 },
    { dx: 1, dy: 1 },
    { dx: 1, dy: 0 },
    { dx: 1, dy: -1 },
    { dx: 0, dy: -1 },
    { dx: -1, dy: -1 },
    { dx: -1, dy: 0 },
    { dx: -1, dy: 1 },
  ];

  // Definir posibles proximos movimientos del rey
  function calcularPosiblesPosicionesRey() {
    const posiciones = [];

    movimientosRey.forEach((movimiento) => {
      const x = inputRey.x + movimiento.dx;
      const y = inputRey.y + movimiento.dy;
      if (dentroDelTablero(x, y)) {
        posiciones.push({ x, y });
      }
    });

    return posiciones;
  }

  // Array con los posibles proximos movimientos del rey
  const posiblesPosicionesRey = calcularPosiblesPosicionesRey();

  // Odernar caballos de menor a mayor distancia
  function ordenarCaballos() {
    return inputCaballos.sort(
      (a, b) =>
        calcularDistanciaCaballo(a.x, a.y) - calcularDistanciaCaballo(b.x, b.y)
    );
  }

  const caballosOrdenados = ordenarCaballos();

  // Definir posibles proximos movimientos de los caballos
  function calcularPosiblesPosicionesCaballos(caballos) {
    const posiciones = [];

    caballos.forEach((caballo) => {
      movimientosCaballo.forEach((movimiento) => {
        const x = caballo.x + movimiento.dx;
        const y = caballo.y + movimiento.dy;
        if (dentroDelTablero(x, y)) {
          posiciones.push({ x, y });
        }
      });
    });

    return posiciones;
  }

  // Función para verificar si un nodo está dentro del tablero
  function dentroDelTablero(x, y) {
    return x >= 1 && x <= tamañoTablero && y >= 1 && y <= tamañoTablero;
  }

  // Función para calcular la heurística H usando la fórmula dada
  function calcularDistanciaCaballo(x, y) {
    return Math.abs(inputRey.x - x) + Math.abs(inputRey.y - y);
  }

  // Suma la distancia de todos los caballos para llegar al rey
  function sumarDistancasCaballos(caballos) {
    let sumaDistanciasCaballos = 0;
    caballos.forEach((caballo) => {
      sumaDistanciasCaballos += calcularDistanciaCaballo(caballo.x, caballo.y);
    });
    return sumaDistanciasCaballos;
  }

  // Definir si el rey esta amenazado
  function reyAmenazado(caballos) {
    const posiblesPosicionesCaballos =
      calcularPosiblesPosicionesCaballos(caballos);
    if (
      posiblesPosicionesCaballos.find(
        (posiciones) =>
          posiciones.x === inputRey.x && posiciones.y === inputRey.y
      )
    ) {
      return 5;
    } else {
      return 0;
    }
  }

  function posicionesReyCubiertas(caballos) {
    const posiblesPosicionesCaballos =
      calcularPosiblesPosicionesCaballos(caballos);
    return posiblesPosicionesRey.filter((posicion) =>
      posiblesPosicionesCaballos.some(
        (caballo) => caballo.x === posicion.x && caballo.y === posicion.y
      )
    ).length;
  }

  // Funcion para penalizar cuando un caballo entre en el rango del rey
  function penalizacionCaballoEnRangoRey(caballos) {
    const caballosEnRangoRey = posiblesPosicionesRey.filter((posicion) =>
      caballos.some(
        (caballo) => caballo.x === posicion.x && caballo.y === posicion.y
      )
    ).length;
    return caballosEnRangoRey * 25;
  }

  // Funcion para penalizar cuando un caballo amenace al rey sin tener todos las posiciones cubiertas
  function penalizacionReyAmenazado(caballos) {
    const estadoRey = reyAmenazado(caballos);
    const posiblesPosicionesCaballos =
      calcularPosiblesPosicionesCaballos(caballos);
    const coincidencias = posiblesPosicionesCaballos.filter(
      (posicion) => posicion.x === inputRey.x && posicion.y === inputRey.y
    ).length;
    if (estadoRey) {
      const numPosiblesPosicionesRey = posiblesPosicionesRey.length;
      const numPosicionesReyCubiertas = posicionesReyCubiertas(caballos);
      if (numPosiblesPosicionesRey === numPosicionesReyCubiertas) {
        return 0;
      }
    }
    return coincidencias * 50;
  }

  // Funcion donde se calcula la heurisitca
  function calcularHeuristica(caballos) {
    let h;
    // H = sumaDistanciasCaballos - (amenazaRey + posicionesReyCubiertas) + (penalizacionCaballoEnRangoRey + penalizacionReyAmenazado)
    h =
      sumarDistancasCaballos(caballos) -
      (reyAmenazado(caballos) + posicionesReyCubiertas(caballos)) +
      penalizacionCaballoEnRangoRey(caballos) +
      penalizacionReyAmenazado(caballos);
    return h;
  }

  // Inicializar la lista abierta y la lista cerrada
  const listaAbierta = [];
  const listaCerrada = [];

  // Crear el nodo inicial y añadirlo a la lista abierta
  const nodoInicial = new Nodo(
    caballosOrdenados,
    null,
    calcularHeuristica(caballosOrdenados)
  );
  listaAbierta.push(nodoInicial);

  // Funcion para obtener el nodo con menor costo
  function obtenerNodoMenorCosto() {
    let nodoMenorCosto = listaAbierta[0];
    for (let i = 1; i < listaAbierta.length; i++) {
      if (listaAbierta[i].h < nodoMenorCosto.h) {
        nodoMenorCosto = listaAbierta[i];
      }
    }
    return nodoMenorCosto;
  }

  // Función para obtener los nodos vecinos válidos para el caballo en una posición dada
  function obtenerNodosVecinos(nodoActual) {
    const nodosVecinos = [];

    // Ciclo par buscar nodos por cada caballo
    nodoActual.caballos.forEach((caballo, index) => {
      for (let i = 0; i < movimientosCaballo.length; i++) {
        const movimiento = movimientosCaballo[i];
        const xVecino = caballo.x + movimiento.dx;
        const yVecino = caballo.y + movimiento.dy;
        if (dentroDelTablero(xVecino, yVecino)) {
          let caballos = [...nodoActual.caballos]; // Crear una copia del array
          caballos[index] = { x: xVecino, y: yVecino };
          // Validar que no haya cababallos superpuestos
          if (!superposicionCaballos(caballos) && !superposicionRey(caballos)) {
            const vecino = new Nodo(
              caballos,
              nodoActual,
              calcularHeuristica(caballos)
            );
            nodosVecinos.push(vecino);
          }
        }
      }
    });
    return nodosVecinos;
  }

  // Función para reconstruir el camino desde el nodo final hasta el nodo inicial
  function reconstruirCamino(nodo) {
    const camino = [nodo];
    let nodoActual = nodo;

    while (nodoActual.padre !== null) {
      camino.unshift(nodoActual.padre);
      nodoActual = nodoActual.padre;
    }

    console.log(camino);
    return camino;
  }

  // Bucle principal del algoritmo "O"
  while (listaAbierta.length > 0) {
    // Obtener el nodo con el costo total más bajo de la lista abierta
    const nodoActual = obtenerNodoMenorCosto();

    // Mover el nodo actual de la lista abierta a la lista cerrada
    listaAbierta.splice(listaAbierta.indexOf(nodoActual), 1);
    listaCerrada.push(nodoActual);

    // Verificar si se ha alcanzado el nodo final
    if (verificarSiTermino(nodoActual)) {
      console.log("WIND!!");
      // Se ha encontrado el camino, reconstruirlo y devolverlo
      return reconstruirCamino(nodoActual);
    }

    /* ========== Obtener los nodos vecino y procesarlos por cada caballo ========== */

    // Obtener los nodos vecinos válidos para el caballo desde la posición actual
    const nodosVecinos = obtenerNodosVecinos(nodoActual);
    // Procesar los vecinos
    for (let i = 0; i < nodosVecinos.length; i++) {
      const vecino = nodosVecinos[i];

      // Verificar si el vecino ya está en la lista cerrada
      if (
        listaCerrada.find((nodo) =>
          nodo.caballos.every(
            (caballo, index) =>
              caballo.x === vecino.caballos[index].x &&
              caballo.y === vecino.caballos[index].y
          )
        )
      ) {
        continue;
      }

      // Verificar si el vecino ya está en la lista abierta y actualizarlo si es necesario
      const nodoAbierto = listaAbierta.find((nodo) =>
        nodo.caballos.every(
          (caballo, index) =>
            caballo.x === vecino.caballos[index].x &&
            caballo.y === vecino.caballos[index].y
        )
      );
      if (nodoAbierto) {
        if (vecino.h < nodoAbierto.h) {
          nodoAbierto.padre = nodoActual;
          nodoAbierto.h = vecino.h;
        }
      } else {
        // Añadir el vecino a la lista abierta
        listaAbierta.push(vecino);
      }
    }
  }

  // No se ha encontrado un camino válido
  return null;
}
