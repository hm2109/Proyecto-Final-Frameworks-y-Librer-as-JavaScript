class CandyGame {
	/*
		Properties:
		-----------------------------
		candyBoard
		candyPoints
		candyMovements
		pointsElement;
		movementsElement;
	*/

	constructor(boardElement, pointsElement, movementsElement) {
		var candys
		var candyColumn = []
		var counter = 0;

		this.boardElement = boardElement; //Contiene el elemento HTML donde se encuentra el tablero de juego
		this.candyBoard = []; //Guarda los caramelos mostrados en el tablero de juego
		this.candyPoints = 0; //Contiene los puntos acumulados por el usuario durante el juego
		this.candyMovements = 0; //Contiene la cantidad de movimientos realizados por el usuario
		this.pointsElement = pointsElement //Contiene el elemento HTML donde se publicarán los puntos obtenidos
		this.movementsElement = movementsElement //Contiene el elemento HTML donde se publicarán los movimientos realizados

		//Genera un arreglo con los caramelos que serán cargados en el tablero de juego
		candys = this.RandomGenerator(35)

		//Recorre el arreglo y carga los caramelos generados en el tablero de juego
		for (var i = 0; i < candys.length; i++) {
			candyColumn.push(candys[i]);
			counter = counter + 1;
			if (counter == 7) {
				this.candyBoard.push(candyColumn);
				counter = 0;
				candyColumn = []
			};
		};

		this.FillCandyBoard();
	}

	RandomGenerator(quantity) {
		var candys = [];
		var i;

		for(i=0; i < quantity; i++) {
			candys.push(Math.floor(Math.random() * (5 - 1) + 1)); 
		}
		return candys;
	}

	FillCandyBoard() {
		var position;
		var candyRow;
		var rowElement;
		var candy;
		var clase;
		var time;
		var i;

		i = 0;
			
		//Crea los elementos HTML con cada uno de los caramelos cargados en el tablero de juego
		while (i < this.candyBoard.length) {

			for (var j = 0; j < this.candyBoard[i].length; j++) {
				rowElement = $('.col-' + parseInt(j + 1));
				if (this.candyBoard[i][j] == 1) {
					rowElement.prepend('<img class="candy-' + i + '-' + j + '" src="image/1.png"/>');
				} else if (this.candyBoard[i][j] == 2) {
					rowElement.prepend('<img class="candy-' + i + '-' + j + '" src="image/2.png"/>');
				} else if (this.candyBoard[i][j] == 3) {
					rowElement.prepend('<img class="candy-' + i + '-' + j + '" src="image/3.png"/>');
				} else {
					rowElement.prepend('<img class="candy-' + i + '-' + j + '" src="image/4.png"/>');
				};

				candy = document.getElementsByClassName('candy-' + i + '-' + j);
				candy[0].style.position = 'absolute';
				candy[0].style.top = '130.3125px';
				candy[0].style.display = 'none';
			};

			//Determina la posición del elemento
			if (i == 4) {
				position = 610.3125;
				time = 250;
			} else if (i == 3) {
				position = 490.3125;
				time = 300;
			} else if (i == 2) {
				position = 370.3125;
				time = 350;
			} else if (i == 1) {
				position = 250.3125;
				time = 400;
			} else {
				position = 130.3125;
				time = 1500;
			};


			if (i == 0) {
				$('img[class*="candy-' + i + '"]').show().delay(time);
			} else {
				$('img[class*="candy-' + i + '"]').show();
				$('img[class*="candy-' + i + '"]').animate(
					{
						top: position + 'px',
					},
					{
						duration: time,
						easing: 'linear',
						queue: false
					}
				);				
			}
				
			i = i + 1;
		};

		this.SetDragConfiguration();
		this.CheckMatchedCandys(this, this.RefillCandyBoard);
	}

	SetDragConfiguration() {
		var clase = this;
		var movementAllowed;
		var originalPosition;

		$('img[class*="candy-"]').draggable(
			{
				start: function(event, ui) {
					originalPosition = ui.originalPosition;
					event.target.style.zIndex = 99;
				},
     			stop: function (event, ui) {
     				if (movementAllowed == true) {
     					clase.SwapCandyPosition(event, ui);	
     				}
     			},
     			revert: function() {
      				var revertMovement;
      				var self;

      				self = $(this);

      				revertMovement = clase.CheckValidMove(originalPosition, self);

      				if (revertMovement == false) {
      					movementAllowed = true;	
      				} else {
      					movementAllowed = false;
      				};
      				
      				return revertMovement;
     			}
      		}
      	);
	}

	SwapCandyPosition(event, ui) {
		var elementMoved;
		var elementSwaped;
		var srcElementMoved;
		var srcElementSwaped;
		var srcElementTemp;
		var originalScreenPosition
     	var distanceX;
     	var distanceY;
		var elementY;
		var elementX;
		var idCandyBoardMoved;
		var idCandyBoardSwaped;

		this.candyMovements = this.candyMovements + 1;
		//Obtiene el elemento que ha sido movido
		elementMoved = $('.' + event.target.className.substring(0, 9));

		//Obtiene su posición original
		originalScreenPosition = ui.originalPosition;

		//Obtiene las coordenadas X,Y del elemento que ha sido movido
		elementX = parseInt(elementMoved[0].className.substring(8, 9));
		elementY = parseInt(elementMoved[0].className.substring(6, 7));

		//Obtiene la distancia del movimiento para luego validar su dirección
     	distanceX = ui.offset.left - originalScreenPosition.left;
     	distanceY = ui.offset.top - originalScreenPosition.top;

     	//Valida la dirección del movimiento
     	if ((distanceY > 0) && ((distanceX > -20) && (distanceX < 20))) {

   			//El movimiento se hizo hacia abajo

   			//Intercambia los elmentos a nivdel de la estructura HTML
   			elementSwaped = $('.candy-' + parseInt(elementY + 1) + '-' + elementX);

   			//Intercambia los valores en el arreglo que guarda las posiciones en el tablero de juego
   			idCandyBoardMoved = this.candyBoard[elementY][elementX];
   			idCandyBoardSwaped = this.candyBoard[parseInt(elementY) + 1][elementX];
   			this.candyBoard[elementY][elementX] = idCandyBoardSwaped;
   			this.candyBoard[parseInt(elementY) + 1][elementX] = idCandyBoardMoved;

     	} else if ((distanceX > 0) && ((distanceY > -20) && (distanceY < 20))) {

   			//El movimiento se hizo hacia la derecha

   			//Intercambia los elmentos a nivdel de la estructura HTML
   			elementSwaped = $('.candy-' + elementY + '-' + parseInt(elementX + 1));

   			//Intercambia los valores en el arreglo que guarda las posiciones en el tablero de juego
   			idCandyBoardMoved = this.candyBoard[elementY][elementX];
   			idCandyBoardSwaped = this.candyBoard[elementY][parseInt(elementX) + 1];
   			this.candyBoard[elementY][elementX] = idCandyBoardSwaped;
   			this.candyBoard[elementY][(elementX + 1)] = idCandyBoardMoved;

     	} else if ((distanceY < 0) && ((distanceX > -20) && (distanceX < 20))) {
     			
   			//El movimiento se hizo hacia arriba

   			//Intercambia los elmentos a nivdel de la estructura HTML
   			elementSwaped = $('.candy-' + parseInt(elementY - 1) + '-' + elementX);

   			//Intercambia los valores en el arreglo que guarda las posiciones en el tablero de juego
   			idCandyBoardMoved = this.candyBoard[elementY][elementX];
   			idCandyBoardSwaped = this.candyBoard[parseInt(elementY - 1)][elementX];
   			this.candyBoard[elementY][elementX] = idCandyBoardSwaped;
   			this.candyBoard[parseInt(elementY - 1)][elementX] = idCandyBoardMoved;     			

   		} else if ((distanceX < 0) && ((distanceY > -20) && (distanceY < 20))) {

   			//El movimiento se hizo hacia la izquierda

   			//Intercambia los elmentos a nivel de la estructura HTML
   			elementSwaped = $('.candy-' + elementY + '-' + parseInt(elementX - 1));

   			//Intercambia los valores en el arreglo que guarda las posiciones en el tablero de juego
   			idCandyBoardMoved = this.candyBoard[elementY][elementX];
   			idCandyBoardSwaped = this.candyBoard[elementY][elementX - 1];
   			this.candyBoard[elementY][elementX] = idCandyBoardSwaped;
  			this.candyBoard[elementY][(elementX - 1)] = idCandyBoardMoved;

     	};

   		srcElementTemp = elementSwaped.eq(0).attr('src');
   		elementSwaped.eq(0).attr('src', elementMoved.eq(0).attr('src'));
   		elementMoved.eq(0).attr('src', srcElementTemp);

     	//Restituye la posición del elemento movido
   		elementMoved.css(
   			{
   				'top': originalScreenPosition.top,
   				'left': originalScreenPosition.left
   			}
   		);

   		this.movementsElement.html(this.candyMovements);

   		this.CheckMatchedCandys(this, this.RefillCandyBoard);


	}

	CheckValidMove(originalPosition, self) {
		var candyClassElementMoved;
		var distanceY;
		var distanceX;
		var elementY;
		var elementX;
		var result;
		var movementDirection;

		//Obtiene las coordenadas del elemento movido
		candyClassElementMoved = self[0].className.substring(0, 9);
		elementY = parseInt(candyClassElementMoved.substring(6, 7));
		elementX = parseInt(candyClassElementMoved.substring(8, 9));

		//Calcula la distancia del movimiento
		distanceY = self[0].offsetTop - originalPosition.top;
		distanceX = self[0].offsetLeft - originalPosition.left;


		//Determina la dirección

     	if ((distanceY > 0) && ((distanceX > -20) && (distanceX < 20))) {

   			//El movimiento se hizo hacia abajo
   			movementDirection = 1;

     	} else if ((distanceX > 0) && ((distanceY > -20) && (distanceY < 20))) {

   			//El movimiento se hizo hacia la derecha
   			movementDirection = 2;

     	} else if ((distanceY < 0) && ((distanceX > -20) && (distanceX < 20))) {
     			
   			//El movimiento se hizo hacia arriba
   			movementDirection = 3;

   		} else if ((distanceX < 0) && ((distanceY > -20) && (distanceY < 20))) {

   			//El movimiento se hizo hacia la izquierda
   			movementDirection = 4;

     	};

     	if (movementDirection != undefined) {

			//Valida si el movimiento es legal en el eje X
			if (elementX == 0) {
				if (distanceX < - 20) {
					result = true;
				} else {
					result = false;
				}
			} else if (elementX == 6) {
				if (distanceX > 20) {
					result = true;
				} else {
					result = false;
				};
			} else {
				result = false;
			};

			//Si es legal en el eje X valida si es legal en el eje Y
			if (result == false) {
				if (elementY == 0) {
					if (distanceY < - 20) {
						result = true;
					} else {
						result = false;
					};
				} else if (elementY == 4) {
					if (distanceY > 20) {
						result = true;
					} else {
						result = false;
					};
				} else {
					result = false;
				};
			};

			//Si es legal en el eje X y en el eje Y, valida si es legal en la distancia del movimiento
			if (result == false) {
				if ((distanceY > 140) || (distanceY < -140)) {
					result = true;
				} else if ((distanceX > 265) || (distanceX < -265)) {
					result = true;
				} else {
					result = false;
				};
			};

			//Si es legal en el eje X, en el eje Y y en la distancia, valida si hay opciones de emparejamiento disponibles
			if (result == false) {
				//El movimiento fue hacia abajo
				if (movementDirection == 1) {
					if ((elementY == 0) || (elementY == 1)) {
						if (elementX == 0) {
							if
							(
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 2][elementX]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 3][elementX])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX + 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX + 2])) ||

								((this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY][elementX + 1]) && (this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY][elementX + 2]))
							) {
								result = false;
							} else {
								result = true;
							};
						} else if (elementX == 1) {
							if
							(
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 2][elementX]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 3][elementX])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX + 1])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX + 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX + 2])) ||

								((this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY][elementX - 1]) && (this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY][elementX + 1])) ||
								((this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY][elementX + 1]) && (this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY][elementX + 2]))
							) {
								result = false;
							} else {
								result = true;
							};
						} else if (elementX == 6) {
							if
							(
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 2][elementX]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 3][elementX])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX - 2])) ||

								((this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY][elementX - 1]) && (this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY][elementX - 2]))
							) {
								result = false;
							} else {
								result = true;
							};
						} else if (elementX == 5) {
							if
							(
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 2][elementX]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 3][elementX])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX + 1])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX - 2])) ||

								((this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY][elementX - 1]) && (this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY][elementX + 1])) ||
								((this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY][elementX - 1]) && (this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY][elementX - 2]))
							) {
								result = false;
							} else {
								result = true;
							};
						} else {
							if
							(
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 2][elementX]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 3][elementX])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX + 1])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX - 2])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX + 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX + 2])) ||

								((this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY][elementX - 1]) && (this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY][elementX + 1])) ||
								((this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY][elementX - 1]) && (this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY][elementX - 2])) ||
								((this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY][elementX + 1]) && (this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY][elementX + 2]))
							) {
								result = false;
							} else {
								result = true;
							};
						};
					} else if (elementY == this.candyBoard.length - 2) {
						if (elementX == 0) {
							if
							(
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX + 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX + 2])) ||

								((this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY - 1][elementX]) && (this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY - 2][elementX])) ||
								((this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY][elementX + 1]) && (this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY][elementX + 2]))
							) {
								result = false;
							} else {
								result = true;
							};
						} else if (elementX == 1) {
							if
							(
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX + 1])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX + 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX + 2])) ||

								((this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY - 1][elementX]) && (this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY - 2][elementX])) ||
								((this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY][elementX - 1]) && (this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY][elementX + 1])) ||
								((this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY][elementX + 1]) && (this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY][elementX + 2]))
							) {
								result = false;
							} else {
								result = true;
							};
						} else if (elementX == 6) {
							if
							(
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX - 2])) ||

								((this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY - 1][elementX]) && (this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY - 2][elementX])) ||
								((this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY][elementX - 1]) && (this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY][elementX - 2]))
							) {
								result = false;
							} else {
								result = true;
							};
						} else if (elementX == 5) {
							if
							(
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX + 1])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX - 2])) ||

								((this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY - 1][elementX]) && (this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY - 2][elementX])) ||
								((this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY][elementX - 1]) && (this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY][elementX + 1])) ||
								((this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY][elementX - 1]) && (this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY][elementX - 2]))
							) {
								result = false;
							} else {
								result = true;
							};
						} else {
							if
							(
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX + 1])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX - 2])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX + 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX + 2])) ||

								((this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY - 1][elementX]) && (this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY - 2][elementX])) ||
								((this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY][elementX - 1]) && (this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY][elementX + 1])) ||
								((this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY][elementX - 1]) && (this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY][elementX - 2])) ||
								((this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY][elementX + 1]) && (this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY][elementX + 2]))
							) {
								result = false;
							} else {
								result = true;
							};						
						};
					} else if (elementY == this.candyBoard.length - 1) {
						result = true;
					} else {
						if (elementX == 0) {
							if
							(
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX + 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX + 2])) ||

								((this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY - 1][elementX]) && (this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY - 2][elementX])) ||
								((this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY][elementX + 1]) && (this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY][elementX + 2]))
							) {
								result = false;
							} else {
								result = true;
							};
						} else if (elementX == 1) {
							if
							(
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX + 1])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX + 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX + 2])) ||

								((this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY][elementX - 1]) && (this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY][elementX + 1])) ||
								((this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY][elementX + 1]) && (this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY][elementX + 2]))
							) {
								result = false;
							} else {
								result = true;
							};
						} else if (elementX == 6) {
							if
							(
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX - 2])) ||

								((this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY][elementX - 1]) && (this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY][elementX - 2]))
							) {
								result = false;
							} else {
								result = true;
							};
						} else if (elementX == 5) {
							if
							(
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX + 1])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX - 2])) ||

								((this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY - 1][elementX]) && (this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY - 2][elementX])) ||
								((this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY][elementX - 1]) && (this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY][elementX + 1])) ||
								((this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY][elementX - 1]) && (this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY][elementX - 2]))
							) {
								result = false;
							} else {
								result = true;
							};
						} else {
							if
							(
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX + 1])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX - 2])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX + 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX + 2])) ||

								((this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY][elementX - 1]) && (this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY][elementX + 1])) ||
								((this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY][elementX - 1]) && (this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY][elementX - 2])) ||
								((this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY][elementX + 1]) && (this.candyBoard[elementY + 1][elementX] == this.candyBoard[elementY][elementX + 2]))
							) {
								result = false;
							} else {
								result = true;
							};
						};					
					}
	 			//El movimiento fue hacia la derecha
				} else if (movementDirection == 2) {
					if ((elementX == 0) || (elementX == 1)) {
						if (elementY == 0) {
							if (
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY][elementX + 2]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY][elementX + 3])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX + 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 2][elementX + 1])) ||

								((this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY + 1][elementX]) && (this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY + 2][elementX]))
							) {
								result = false;
							} else {
								result = true;
							};
						} else if (elementY == 1) {
							if (
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY][elementX + 2]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY][elementX + 3])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX + 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX + 1])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX + 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 2][elementX + 1])) ||

								((this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY - 1][elementX]) && (this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY + 1][elementX])) ||
								((this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY + 1][elementX]) && (this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY + 2][elementX]))
							) {
								result = false;
							} else {
								result = true;
							};
						} else if (elementY == 4) {
							if (
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY][elementX + 2]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY][elementX + 3])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX + 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 2][elementX + 1])) ||

								((this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY - 1][elementX]) && (this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY - 2][elementX]))
							) {
								result = false;
							} else {
								result = true;
							};
						} else if (elementY == 3) {
							if (
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY][elementX + 2]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY][elementX + 3])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX + 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX + 1])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX + 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 2][elementX + 1])) ||

								((this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY - 1][elementX]) && (this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY + 1][elementX])) ||
								((this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY - 1][elementX]) && (this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY - 2][elementX]))
							) {
								result = false;
							} else {
								result = true;
							};
						} else {
							if 
							(
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY][elementX + 2]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY][elementX + 3])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX + 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX + 1])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX + 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 2][elementX + 1])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX + 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 2][elementX + 1])) ||

								((this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY][elementX - 1]) && (this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY][elementX - 2])) ||
								((this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY - 1][elementX]) && (this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY + 1][elementX])) ||
								((this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY - 1][elementX]) && (this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY - 2][elementX])) ||
								((this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY + 1][elementX]) && (this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY + 2][elementX]))
							) {
								result = false;
							} else {
								result = true;
							};						
						};
					} else if (elementX == this.candyBoard[elementY].length - 2) {
						if (elementY == 0) {
							if (
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX + 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 2][elementX + 1])) ||

								((this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY][elementX - 1]) && (this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY][elementX - 2])) ||
								((this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY + 1][elementX]) && (this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY + 2][elementX]))
							) {
								result = false;
							} else {
								result = true;
							};
						} else if (elementY == 1) {
							if (
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX + 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX + 1])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX + 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 2][elementX + 1])) ||

								((this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY][elementX - 1]) && (this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY][elementX - 2])) ||
								((this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY - 1][elementX]) && (this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY + 1][elementX])) ||
								((this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY + 1][elementX]) && (this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY + 2][elementX]))
							) {
								result = false;
							} else {
								result = true;
							};
						} else if (elementY == 4) {
							if (
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX + 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 2][elementX + 1])) ||

								((this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY][elementX - 1]) && (this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY][elementX - 2])) ||
								((this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY - 1][elementX]) && (this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY - 2][elementX]))
							) {
								result = false;
							} else {
								result = true;
							};
						} else if (elementY == 3) {
							if (
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX + 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX + 1])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX + 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 2][elementX + 1])) ||

								((this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY][elementX - 1]) && (this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY][elementX - 2])) ||
								((this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY - 1][elementX]) && (this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY + 1][elementX])) ||
								((this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY - 1][elementX]) && (this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY - 2][elementX]))
							) {
								result = false;
							} else {
								result = true;
							};
						} else {
							if 
							(
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX + 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX + 1])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX + 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 2][elementX + 1])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX + 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 2][elementX + 1])) ||

								((this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY][elementX - 1]) && (this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY][elementX - 2])) ||
								((this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY - 1][elementX]) && (this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY + 1][elementX])) ||
								((this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY - 1][elementX]) && (this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY - 2][elementX])) ||
								((this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY + 1][elementX]) && (this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY + 2][elementX]))
							) {
								result = false;
							} else {
								result = true;
							};						
						};
					} else if (elementY == this.candyBoard[elementY].length - 1) {
						result = true;
					} else {
						if (elementY == 0) {
							if (
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY][elementX + 2]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY][elementX + 3])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX + 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 2][elementX + 1])) ||

								((this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY][elementX - 1]) && (this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY][elementX - 2])) ||
								((this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY + 1][elementX]) && (this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY + 2][elementX]))
							) {
								result = false;
							} else {
								result = true;
							};
						} else if (elementY == 1) {
							if (
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY][elementX + 2]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY][elementX + 3])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX + 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX + 1])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX + 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 2][elementX + 1])) ||

								((this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY][elementX - 1]) && (this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY][elementX - 2])) ||
								((this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY - 1][elementX]) && (this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY + 1][elementX])) ||
								((this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY + 1][elementX]) && (this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY + 2][elementX]))
							) {
								result = false;
							} else {
								result = true;
							};
						} else if (elementY == 4) {
							if (
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY][elementX + 2]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY][elementX + 3])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX + 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 2][elementX + 1])) ||

								((this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY][elementX - 1]) && (this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY][elementX - 2])) ||
								((this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY - 1][elementX]) && (this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY - 2][elementX]))
							) {
								result = false;
							} else {
								result = true;
							};
						} else if (elementY == 3) {
							if (
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY][elementX + 2]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY][elementX + 3])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX + 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX + 1])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX + 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 2][elementX + 1])) ||

								((this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY][elementX - 1]) && (this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY][elementX - 2])) ||
								((this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY - 1][elementX]) && (this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY + 1][elementX])) ||
								((this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY - 1][elementX]) && (this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY - 2][elementX]))
							) {
								result = false;
							} else {
								result = true;
							};
						} else {
							if 
							(
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY][elementX + 2]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY][elementX + 3])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX + 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX + 1])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX + 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 2][elementX + 1])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX + 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 2][elementX + 1])) ||

								((this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY][elementX - 1]) && (this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY][elementX - 2])) ||
								((this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY - 1][elementX]) && (this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY + 1][elementX])) ||
								((this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY - 1][elementX]) && (this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY - 2][elementX])) ||
								((this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY + 1][elementX]) && (this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY + 2][elementX]))
							) {
								result = false;
							} else {
								result = true;
							};						
						};
					};
				//El movimiento fue hacia arriba
				} else if (movementDirection == 3) {
					if ((elementY == this.candyBoard.length - 1) || (elementY == this.candyBoard.length - 2)){
						if (elementX == 0) {
							if (
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 2][elementX]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 3][elementX])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX + 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX + 2])) ||

								((this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY][elementX + 1]) && (this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY][elementX + 2]))
							) {
								result = false;
							} else {
								result = true;
							};
						} else if (elementX == 1) {
							if (
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 2][elementX]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 3][elementX])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX + 1])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX + 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX + 2])) ||

								((this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY][elementX - 1]) && (this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY][elementX + 1])) ||
								((this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY][elementX + 1]) && (this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY][elementX + 2]))
							) {
								result = false;
							} else {
								result = true;
							};
						} else if (elementX == 6) {
							if (
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 2][elementX]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 3][elementX])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX - 2])) ||

								((this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY][elementX - 1]) && (this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY][elementX - 2]))
							) {
								result = false;
							} else {
								result = true;
							};
						} else if (elementX == 5) {
							if (
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 2][elementX]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 3][elementX])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX + 1])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX - 2])) ||

								((this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY][elementX - 1]) && (this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY][elementX + 1])) ||
								((this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY][elementX - 1]) && (this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY][elementX - 2]))
							) {
								result = false;
							} else {
								result = true;
							};
						} else {
							if (
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 2][elementX]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 3][elementX])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX + 1])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX - 2])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX + 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX + 2])) ||

								((this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY][elementX - 1]) && (this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY][elementX + 1])) ||
								((this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY][elementX - 1]) && (this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY][elementX - 2])) ||
								((this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY][elementX + 1]) && (this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY][elementX + 2]))
							) {
								result = false;
							} else {
								result = true;
							};
						};
					} else if (elementY == 1) {
						if (elementX == 0) {
							if (
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX + 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX + 2])) ||

								((this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY + 1][elementX]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 2][elementX])) ||
								((this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY][elementX + 1]) && (this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY][elementX + 2]))
							) {
								result = false;
							} else {
								result = true;
							};
						} else if (elementX == 1) {
							if (
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX + 1])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX + 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX + 2])) ||

								((this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY + 1][elementX]) && (this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY + 2][elementX])) ||
								((this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY][elementX - 1]) && (this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY][elementX + 1])) ||
								((this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY][elementX + 1]) && (this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY][elementX + 2]))
							) {
								result = false;
							} else {
								result = true;
							};
						} else if (elementX == 6) {
							if (
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX - 2])) ||

								((this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY + 1][elementX]) && (this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY + 2][elementX])) ||
								((this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY][elementX - 1]) && (this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY][elementX - 2]))
							) {
								result = false;
							} else {
								result = true;
							};
						} else if (elementX == 5) {
							if (
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX + 1])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX - 2])) ||

								((this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY + 1][elementX]) && (this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY + 2][elementX])) ||
								((this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY][elementX - 1]) && (this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY][elementX + 1])) ||
								((this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY][elementX - 1]) && (this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY][elementX - 2]))
							) {
								result = false;
							} else {
								result = true;
							};
						} else {
							if (
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX + 1])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX - 2])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX + 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX + 2])) ||

								((this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY + 1][elementX]) && (this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY + 2][elementX])) ||
								((this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY][elementX - 1]) && (this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY][elementX + 1])) ||
								((this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY][elementX - 1]) && (this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY][elementX - 2])) ||
								((this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY][elementX + 1]) && (this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY][elementX + 2]))
							) {
								result = false;
							} else {
								result = true;
							};
						};					
					} else if (elementY == 0) {
						result = true;
					} else {
						if (elementX == 0) {
							if (
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX + 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX + 2])) ||

								((this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY][elementX + 1]) && (this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY][elementX + 2]))
							) {
								result = false;
							} else {
								result = true;
							};
						} else if (elementX == 1) {
							if (
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX + 1])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX + 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX + 2])) ||

								((this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY][elementX - 1]) && (this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY][elementX + 1])) ||
								((this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY][elementX + 1]) && (this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY][elementX + 2]))
							) {
								result = false;
							} else {
								result = true;
							};
						} else if (elementX == 6) {
							if (
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX - 2])) ||

								((this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY][elementX - 1]) && (this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY][elementX - 2]))
							) {
								result = false;
							} else {
								result = true;
							};
						} else if (elementX == 5) {
							if (
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX + 1])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX - 2])) ||

								((this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY][elementX - 1]) && (this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY][elementX + 1])) ||
								((this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY][elementX - 1]) && (this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY][elementX - 2]))
							) {
								result = false;
							} else {
								result = true;
							};
						} else {
							if (
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX + 1])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX - 2])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX + 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX + 2])) ||

								((this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY][elementX - 1]) && (this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY][elementX + 1])) ||
								((this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY][elementX - 1]) && (this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY][elementX - 2])) ||
								((this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY][elementX + 1]) && (this.candyBoard[elementY - 1][elementX] == this.candyBoard[elementY][elementX + 2]))
							) {
								result = false;
							} else {
								result = true;
							};						
						};
					}
				//El movimiento fue hacia la izquierda
				} else if (movementDirection == 4) {
					if ((elementX == 6) || (elementX == 5)) {
						if (elementY == 0) {
							if (
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY][elementX - 2]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY][elementX - 3])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 2][elementX - 1])) ||

								((this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY + 1][elementX]) && (this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY + 2][elementX]))
							) {
								result = false;
							} else {
								result = true;
							};
						} else if (elementY == 1) {
							if (
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY][elementX - 2]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY][elementX - 3])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX - 1])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 2][elementX - 1])) ||

								((this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY - 1][elementX]) && (this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY + 1][elementX])) ||
								((this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY + 1][elementX]) && (this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY + 2][elementX]))
							) {
								result = false;
							} else {
								result = true;
							};
						} else if (elementY == 4) {
							if (
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY][elementX - 2]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY][elementX - 3])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 2][elementX - 1])) ||

								((this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY - 1][elementX]) && (this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY - 2][elementX]))
							) {
								result = false;
							} else {
								result = true;
							};
						} else if (elementY == 3) {
							if (
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY][elementX - 2]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY][elementX - 3])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX - 1])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 2][elementX - 1])) ||

								((this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY - 1][elementX]) && (this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY + 1][elementX])) ||
								((this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY - 1][elementX]) && (this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY - 2][elementX]))
							) {
								result = false;
							} else {
								result = true;
							};
						} else {
							if 
							(
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY][elementX + 2]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY][elementX + 3])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX + 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX + 1])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX + 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 2][elementX + 1])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX + 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 2][elementX + 1])) ||

								((this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY][elementX - 1]) && (this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY][elementX - 2])) ||
								((this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY - 1][elementX]) && (this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY + 1][elementX])) ||
								((this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY - 1][elementX]) && (this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY - 2][elementX])) ||
								((this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY + 1][elementX]) && (this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY + 2][elementX]))
							) {
								result = false;
							} else {
								result = true;
							};						
						}
					} else if (elementX == 1) {
						if (elementY == 0) {
							if (
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 2][elementX - 1])) ||

								((this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY][elementX + 1]) && (this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY][elementX + 2])) ||
								((this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY + 1][elementX]) && (this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY + 2][elementX]))
							) {
								result = false;
							} else {
								result = true;
							};
						} else if (elementY == 1) {
							if (
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX - 1])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 2][elementX - 1])) ||

								((this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY][elementX + 1]) && (this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY][elementX + 2])) ||
								((this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY - 1][elementX]) && (this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY + 1][elementX])) ||
								((this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY + 1][elementX]) && (this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY + 2][elementX]))
							) {
								result = false;
							} else {
								result = true;
							};
						} else if (elementY == 4) {
							if (
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 2][elementX - 1])) ||

								((this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY][elementX + 1]) && (this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY][elementX + 2])) ||
								((this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY - 1][elementX]) && (this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY - 2][elementX]))
							) {
								result = false;
							} else {
								result = true;
							};
						} else if (elementY == 3) {
							if (
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX - 1])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 2][elementX - 1])) ||

								((this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY][elementX + 1]) && (this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY][elementX + 2])) ||
								((this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY - 1][elementX]) && (this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY + 1][elementX])) ||
								((this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY - 1][elementX]) && (this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY - 2][elementX]))
							) {
								result = false;
							} else {
								result = true;
							};
						} else {
							if 
							(
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX - 1])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 2][elementX - 1])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 2][elementX - 1])) ||

								((this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY][elementX - 1]) && (this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY][elementX + 2])) ||
								((this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY - 1][elementX]) && (this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY + 1][elementX])) ||
								((this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY - 1][elementX]) && (this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY - 2][elementX])) ||
								((this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY + 1][elementX]) && (this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY + 2][elementX]))
							) {
								result = false;
							} else {
								result = true;
							};						
						}					
					} else if (elementX == 0) {
						result = true;
					} else {
						if (elementY == 0) {
							if (
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY][elementX - 2]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY][elementX - 3])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 2][elementX - 1])) ||

								((this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY][elementX + 1]) && (this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY][elementX + 2])) ||
								((this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY + 1][elementX]) && (this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY + 2][elementX]))
							) {
								result = false;
							} else {
								result = true;
							};
						} else if (elementY == 1) {
							if (
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY][elementX - 2]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY][elementX - 3])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX - 1])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 2][elementX - 1])) ||

								((this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY][elementX + 1]) && (this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY][elementX + 2])) ||
								((this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY - 1][elementX]) && (this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY + 1][elementX])) ||
								((this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY + 1][elementX]) && (this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY + 2][elementX]))
							) {
								result = false;
							} else {
								result = true;
							};
						} else if (elementY == 4) {
							if (
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY][elementX - 2]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY][elementX - 3])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 2][elementX - 1])) ||

								((this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY][elementX + 1]) && (this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY][elementX + 2])) ||
								((this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY - 1][elementX]) && (this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY - 2][elementX]))
							) {
								result = false;
							} else {
								result = true;
							};
						} else if (elementY == 3) {
							if (
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY][elementX - 2]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY][elementX - 3])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX - 1])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 2][elementX - 1])) ||

								((this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY][elementX + 1]) && (this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY][elementX + 2])) ||
								((this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY - 1][elementX]) && (this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY + 1][elementX])) ||
								((this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY - 1][elementX]) && (this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY - 2][elementX]))
							) {
								result = false;
							} else {
								result = true;
							};
						} else {
							if 
							(
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY][elementX - 2]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY][elementX - 3])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX - 1])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY - 2][elementX - 1])) ||
								((this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 1][elementX - 1]) && (this.candyBoard[elementY][elementX] == this.candyBoard[elementY + 2][elementX - 1])) ||

								((this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY][elementX + 1]) && (this.candyBoard[elementY][elementX + 1] == this.candyBoard[elementY][elementX + 2])) ||
								((this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY - 1][elementX]) && (this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY + 1][elementX])) ||
								((this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY - 1][elementX]) && (this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY - 2][elementX])) ||
								((this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY + 1][elementX]) && (this.candyBoard[elementY][elementX - 1] == this.candyBoard[elementY + 2][elementX]))
							) {
								result = false;
							} else {
								result = true;
							};						
						};
					};
				};
			};
     	} else {
     		result = true;
     	}

		//Devuelve el resultado de la validación
		return result;
	}

	CheckMatchedCandys(self, callback) {
		var elementsMatchedX = [];
		var elementsMatchedY = [];
		var elementsMatchedTemp = [];
		var totalElementsMatched = [];
		var keepMatching;
		var keepMatchingTemp;
		var elementY;
		var elementX;
		var xLength;
		var yLength;
		var Y;
		var X;
		var yTemp;
		var xTemp;
		var candyMatched;
		var candyMatchedTemp;
		var count;
		var elementFound;

		elementY = 0;
		xLength = self.candyBoard[0].length;
		yLength = self.candyBoard.length;

		//Ciclo que recorre las filas del tablero
		while (elementY < yLength) {
			elementX = 0;
			Y = elementY;
			X = elementX + 1;
			
			//Cilclo que recorre las columnas del tablero
			while (elementX < xLength) {


				if (self.candyBoard[elementY][elementX] != 0) {
					candyMatched = {
						y : elementY,
						x : elementX
					};

					elementsMatchedX.push(candyMatched);
					elementsMatchedY.push(candyMatched);

					keepMatching = true;

					//Busca coincidencias hacia la derecha del elemento actual
					while (keepMatching) {
						if (X < xLength) {
							if (self.candyBoard[elementY][elementX] == self.candyBoard[Y][X]) {
								candyMatched = {
									y : Y,
									x : X,
								};
								elementsMatchedX.push(candyMatched);
								elementsMatchedTemp.push(candyMatched);
								
								//Evalúa las posiciones superiores del elemento emparejado para verificar que sean del mismo tipo y en caso afirmativo los inserta en un vector temporal
								keepMatchingTemp = true;
								yTemp = Y - 1;
								xTemp = X;
								while ((keepMatchingTemp) && (yTemp < yLength) && (yTemp >= 0)) {
									if (self.candyBoard[yTemp][xTemp] == self.candyBoard[Y][X]) {
										candyMatchedTemp = {
											y: yTemp,
											x: xTemp
										};
										elementsMatchedTemp.push(candyMatchedTemp);
										yTemp = yTemp - 1;
									} else {
										keepMatchingTemp = false;
									};
								};

								//Evalúa las posiciones inferiores del elemento emparejado para verificar que sean del mismo tipo y en caso afirmativo los inserta en un vector temporal
								keepMatchingTemp = true;
								yTemp = Y + 1;
								xTemp = X;
								while ((keepMatchingTemp) && (yTemp < yLength) && (yTemp >= 0)) {
									if (self.candyBoard[yTemp][xTemp] == self.candyBoard[Y][X]) {
										candyMatchedTemp = {
											y: yTemp,
											x: xTemp
										};
										elementsMatchedTemp.push(candyMatchedTemp);
										yTemp = yTemp + 1;
									} else {
										keepMatchingTemp = false;
									};
								};

								if (elementsMatchedTemp.length > 2) {
									for (var t = 0; t < elementsMatchedTemp.length; t++) {
										elementsMatchedY.push(elementsMatchedTemp[t]);
									};
								};
								elementsMatchedTemp = [];
								X = X + 1;
							} else {
								keepMatching = false;
							};
						} else {
							keepMatching = false;
						};
					};

					keepMatching = true;
					Y = elementY;
					X = elementX - 1;

					//Busca coincidencias hacia la izquierda del elemento actual
					while (keepMatching) {
						if (X >= 0) {
							if (self.candyBoard[elementY][elementX] == self.candyBoard[Y][X]) {
								candyMatched = {
									y : Y,
									x : X
								};
								elementsMatchedX.push(candyMatched);
								elementsMatchedTemp.push(candyMatched);

								//Evalúa las posiciones superiores del elemento emparejado para verificar que sean del mismo tipo y en caso afirmativo los inserta en un vector temporal
								keepMatchingTemp = true;
								yTemp = Y - 1;
								xTemp = X;
								while ((keepMatchingTemp) && (yTemp < yLength) && (yTemp >= 0)) {
									if (self.candyBoard[yTemp][xTemp] == self.candyBoard[Y][X]) {
										candyMatchedTemp = {
											y: yTemp,
											x: xTemp
										};
										elementsMatchedTemp.push(candyMatchedTemp);
										yTemp = yTemp - 1;
									} else {
										keepMatchingTemp = false;
									};
								};

								//Evalúa las posiciones inferiores del elemento emparejado para verificar que sean del mismo tipo y en caso afirmativo los inserta en un vector temporal
								keepMatchingTemp = true;
								yTemp = Y + 1;
								xTemp = X;
								while ((keepMatchingTemp) && (yTemp < yLength) && (yTemp >= 0)) {
									if (self.candyBoard[yTemp][xTemp] == self.candyBoard[Y][X]) {
										candyMatchedTemp = {
											y: yTemp,
											x: xTemp
										};
										elementsMatchedTemp.push(candyMatchedTemp);
										yTemp = yTemp + 1;
									} else {
										keepMatchingTemp = false;
									};
								};

								if (elementsMatchedTemp.length > 2) {
									for (var t = 0; t < elementsMatchedTemp.length; t++) {
										elementsMatchedY.push(elementsMatchedTemp[t]);
									};
								};
								elementsMatchedTemp = [];
								X = X - 1;
							} else {
								keepMatching = false;
							};						
						} else {
							keepMatching = false;
						};
					};

					if (elementsMatchedX < 3) {
						elementsMatchedX = [];
						elementsMatchedY = [];
						elementFound = elementsMatchedX.find(function(element) {
							return ((element.y == elementY) && (element.x == elemenX));
						});
						if (elementFound != undefined) {
							elementsMatchedX.splice(elementFound, 1);
						};
					};

					keepMatching = true;
					Y = elementY + 1;
					X = elementX;

					//Busca coincidencias en las filas inferiores
					while (keepMatching) {
						if (Y < yLength) {
							if (self.candyBoard[elementY][elementX] == self.candyBoard[Y][X]) {
								candyMatched = {
									y : Y,
									x : X
								};
								elementsMatchedY.push(candyMatched);
								elementsMatchedTemp.push(candyMatched);								

								//Evalúa las posiciones a la derecha del elemento emparejado para verificar que sean del mismo tipo y en caso afirmativo los inserta en un vector temporal
								keepMatchingTemp = true;
								yTemp = Y;
								xTemp = X + 1;
								while ((keepMatchingTemp) && (xTemp < xLength) && (xTemp >= 0)) {
									if (self.candyBoard[yTemp][xTemp] == self.candyBoard[Y][X]) {
										candyMatchedTemp = {
											y: yTemp,
											x: xTemp
										};
										elementsMatchedTemp.push(candyMatchedTemp);
										xTemp = xTemp + 1;
									} else {
										keepMatchingTemp = false;
									};
								};

								//Evalúa las posiciones a la izquierda del elemento emparejado para verificar que sean del mismo tipo y en caso afirmativo los inserta en un vector temporal
								keepMatchingTemp = true;
								yTemp = Y;
								xTemp = X - 1;
								while ((keepMatchingTemp) && (xTemp < xLength) && (xTemp >= 0)) {
									if (self.candyBoard[yTemp][xTemp] == self.candyBoard[Y][X]) {
										candyMatchedTemp = {
											y: yTemp,
											x: xTemp
										};
										elementsMatchedTemp.push(candyMatchedTemp);
										xTemp = xTemp - 1;
									} else {
										keepMatchingTemp = false;
									};
								};

								if (elementsMatchedTemp.length > 2) {
									for (var t = 0; t < elementsMatchedTemp.length; t++) {
										elementsMatchedX.push(elementsMatchedTemp[t]);
									};
								};
								elementsMatchedTemp = [];
								Y = Y + 1;
							} else {
								keepMatching = false;
							};						
						} else {
							keepMatching = false;
						};
					};

					keepMatching = true;
					Y = elementY - 1;
					X = elementX;

					//Busca coincidencias en las filas superiores
					while (keepMatching) {
						if (Y >= 0) {
							if (self.candyBoard[elementY][elementX] == self.candyBoard[Y][X]) {
								candyMatched = {
									y : Y,
									x : X
								};
								elementsMatchedY.push(candyMatched);
								elementsMatchedTemp.push(candyMatched);								

								//Evalúa las posiciones a la derecha del elemento emparejado para verificar que sean del mismo tipo y en caso afirmativo los inserta en un vector temporal
								keepMatchingTemp = true;
								yTemp = Y;
								xTemp = X - 1;
								while ((keepMatchingTemp) && (xTemp < xLength) && (xTemp >= 0)) {
									if (self.candyBoard[yTemp][xTemp] == self.candyBoard[Y][X]) {
										candyMatchedTemp = {
											y: yTemp,
											x: xTemp
										};
										elementsMatchedTemp.push(candyMatchedTemp);
										xTemp = xTemp - 1;
									} else {
										keepMatchingTemp = false;
									};
								};

								//Evalúa las posiciones a la izquierda del elemento emparejado para verificar que sean del mismo tipo y en caso afirmativo los inserta en un vector temporal
								keepMatchingTemp = true;
								yTemp = Y;
								xTemp = X - 1;
								while ((keepMatchingTemp) && (xTemp < xLength) && (xTemp >= 0)) {
									if (self.candyBoard[yTemp][xTemp] == self.candyBoard[Y][X]) {
										candyMatchedTemp = {
											y: yTemp,
											x: xTemp
										};
										elementsMatchedTemp.push(candyMatchedTemp);
										xTemp = xTemp - 1;
									} else {
										keepMatchingTemp = false;
									};
								};

								if (elementsMatchedTemp.length > 2) {
									for (var t = 0; t < elementsMatchedTemp.length; t++) {
										elementsMatchedX.push(elementsMatchedTemp[t]);
									};
								};
								elementsMatchedTemp = [];								
								Y = Y - 1;
							} else {
								keepMatching = false;
							};
						} else {
							keepMatching = false;
						};
					};

					if (elementsMatchedY < 3) {
						elementFound = elementsMatchedY.find(function(element) {
							return ((element.y == elementY) && (element.x == elementX));
						});
						if (elementFound != undefined) {
							elementsMatchedY.splice(elementFound, 1);
						};
					};

					if (elementsMatchedX.length >= 3) {
					
						for (var i = 0; i < elementsMatchedX.length; i++) {
							self.candyBoard[elementsMatchedX[i].y][elementsMatchedX[i].x] = 0
							self.candyPoints = self.candyPoints + 1;
							totalElementsMatched.push(elementsMatchedX[i]);
						};


					};
					if (elementsMatchedY.length >= 3) {
					
						for (var i = 0; i < elementsMatchedY.length; i++) {
							self.candyBoard[elementsMatchedY[i].y][elementsMatchedY[i].x] = 0
							self.candyPoints = self.candyPoints + 1;
							totalElementsMatched.push(elementsMatchedY[i]);
						};
					};


				};

				elementsMatchedX = [];
				elementsMatchedY = [];
				elementX = elementX + 1;
				X = elementX + 1;
				Y = elementY;
			};

			elementY = elementY  + 1;
		};

		self.pointsElement.html(self.candyPoints);

		if (totalElementsMatched.length > 0) {
			count = 0;

			while (count <= 3) {

				Y = 0;

				while (Y < totalElementsMatched.length) {

					$('.candy-' + totalElementsMatched[Y].y + '-' + totalElementsMatched[Y].x).eq(0).fadeOut(150).fadeIn(150);

					Y = Y + 1;
				};

				count = count + 1;
			};

			elementY = 0;

			setTimeout(function() {
				Y = 0;

				while(Y < totalElementsMatched.length) {

					$('.candy-' + totalElementsMatched[Y].y + '-' + totalElementsMatched[Y].x).eq(0).attr('src', '');
					Y = Y + 1
				};

				callback(self, self.CheckMatchedCandys);

			}, 1500);
		};

	}

	RefillCandyBoard(self, callback) {
		var currentY;
		var currentPosition;
		var position;
		var time;
		var positionsToMove = [];
		var refillPosition;
		var candyEmpty;
		var newCandy;
		var newPosition;
		var currentNewCandy;
		var candy;
		var positionsToFill = [];
		var arrayPosition;
		var columnNotMoved;
		var columnToFill;
		var t;

		candyEmpty = 0;
		currentNewCandy = 0;


		//Recorre el tablero determinando los caramelos que deben cambiar de posicion y los agrega al arreglo de posiciones a rellenar
		for (var j = 0; j < self.candyBoard[0].length; j ++) {
			for (var i = (self.candyBoard.length - 1); i >= 0 ; i--) {
				if (self.candyBoard[i][j] == 0) {
					currentY = (i - 1);
					while (currentY >= 0) {
						if ((self.candyBoard[currentY][j] != 0) && (self.candyBoard[currentY][j] != undefined)) {
							refillPosition = {
								y : currentY,
								x : j,
								newY : i,
								newX : j,
								newSrc: $('.candy-' + currentY + '-' + j).eq(0).attr('src'),
								actualPosition: $('.candy-' + currentY + '-' + j).eq(0).position().top
							};
							positionsToMove.push(refillPosition);
							self.candyBoard[i][j] = self.candyBoard[currentY][j];
							self.candyBoard[currentY][j] = 0;
							break;
						} else {
							currentY = currentY - 1;
						};
					};
				}
			};
		};

		//Cuenta la cantidad de elementos vacíos
		for (var j = 0; j < self.candyBoard[0].length; j ++) {
			for (var i = (self.candyBoard.length - 1); i >= 0 ; i--) {
				if (self.candyBoard[i][j] == 0) {
					if (arrayPosition == undefined) {
						refillPosition = {
							y : i,
							x : j,
							newCandy : true
						};
						positionsToFill.push(refillPosition);
					};
					candyEmpty = candyEmpty + 1;
				};
			};
		};

		console.log('Antes de mover los elementos ');

		for (t = 0; t < self.candyBoard.length; t++) {
			console.log(self.candyBoard[t]);
		};

		for (var i = 0; i < positionsToMove.length; i++) {
			//Determina la posición del elemento
			if (positionsToMove[i].newY == 4) {
				position = 610.3125;
				time = 250;
			} else if (positionsToMove[i].newY == 3) {
				position = 490.3125;
				time = 300;
			} else if (positionsToMove[i].newY == 2) {
				position = 370.3125;
				time = 350;
			} else if (positionsToMove[i].newY == 1) {
				position = 250.3125;
				time = 400;
			} else {
				position = 130.3125;
				time = 750;
			};

			(function(i) {

				$('img[class*="candy-' + positionsToMove[i].y + '-' + positionsToMove[i].x + '"]').animate(
					{
						top: position + 'px',
					},
					{
						duration: time,
						easing: 'linear',
						queue: false,
						complete: function() {
							var columnElements;
							var minorElement;
							var newCandy;

							$('.candy-' + positionsToMove[i].newY + '-' + positionsToMove[i].newX).eq(0).attr('src', positionsToMove[i].newSrc);
							$('.candy-' + positionsToMove[i].y + '-' + positionsToMove[i].x).eq(0).attr('src', '');
							$('.candy-' + positionsToMove[i].y + '-' + positionsToMove[i].x).eq(0).css('top', positionsToMove[i].actualPosition);

							//Obtiene los elementos precedentes del elemento actual que deben ser movidos
							minorElement = positionsToMove.filter(function(element) {
								return ((element.x == positionsToMove[i].x) && (element.y < positionsToMove[i].y));
							});

							console.log('Moviendo elementos: Estoy en la columna ' + positionsToMove[i].x);
							console.log('Moviendo elementos: Encontre ' + minorElement.length + ' elementos encima del elemento y:' + positionsToMove[i].y + ' x: ' + positionsToMove[i].x);

							//Si no hay elementos precendentes que mover crea los nuevos caramelos para las posiciones vacias
							if (minorElement.length == 0) {

								//Obtiene las posiciones vacias que se encuentran encima de la posición actual
								columnElements = positionsToFill.filter(function(element) {
									return ((element.x == positionsToMove[i].x) && (element.y < positionsToMove[i].newY));
								});

								//Si existen posiciones vacias
								if (columnElements.length > 0) {

									//Genera los nuevos caramelos
									newCandy = self.RandomGenerator(columnElements.length);

									console.log('Moviendo elementos: Voy a insertar ' + newCandy.length + ' caramelos');

									currentNewCandy = 0;

									for (var j = 0; j < columnElements.length; j++) {

										if (newCandy[currentNewCandy] == 1) {
											$('.candy-' + columnElements[j].y + '-' + columnElements[j].x).eq(0).attr('src', 'image/1.png');
										} else if (newCandy[currentNewCandy] == 2) {
											$('.candy-' + columnElements[j].y + '-' + columnElements[j].x).eq(0).attr('src', 'image/2.png');
										} else if (newCandy[currentNewCandy] == 3) {
											$('.candy-' + columnElements[j].y + '-' + columnElements[j].x).eq(0).attr('src', 'image/3.png');
										} else {
											$('.candy-' + columnElements[j].y + '-' + columnElements[j].x).eq(0).attr('src', 'image/4.png');
										};
										self.candyBoard[columnElements[j].y][columnElements[j].x] = newCandy[currentNewCandy];
										candy = document.getElementsByClassName('candy-' + columnElements[j].y + '-' + columnElements[j].x);
										candy[0].style.position = 'absolute';
										candy[0].style.top = '130.3125px';
										candy[0].style.display = 'none';
										currentNewCandy = currentNewCandy + 1;

										//Determina la posición del elemento
										if (columnElements[j].y == 4) {
											position = 610.3125;
											time = 250;
										} else if (columnElements[j].y == 3) {
											position = 490.3125;
											time = 300;
										} else if (columnElements[j].y == 2) {
											position = 370.3125;
											time = 350;
										} else if (columnElements[j].y == 1) {
											position = 250.3125;
											time = 400;
										} else {
											position = 130.3125;
											time = 750;
										};

										$('img[class*="candy-' + columnElements[j].y + '-' + columnElements[j].x + '"]').show().delay(time);
										candy = document.getElementsByClassName('candy-' + columnElements[j].y + '-' + columnElements[j].x);
										candy[0].style.display = 'block';

										$('img[class*="candy-' + columnElements[j].y + '-' + columnElements[j].x + '"]').animate(
											{
												top: position + 'px',
											},
											{
												duration: time,
												easing: 'linear',
												queue: true,
											}
										);
									};
								};
							};
 						}
					}
				);
			})(i)
		};

		setTimeout(function() {

			console.log('Antes de rellenar posiciones sin elementos movidos');

			for (t = 0; t < self.candyBoard.length; t++) {
				console.log(self.candyBoard[t]);
			};

			//Recorre las columnas del tablero
			for (var k = 0; k < self.candyBoard[0].length; k++) {

				//Obtiene las posiciones que deben ser rellenadas en la columna actual
				columnToFill = positionsToFill.filter(function(element) {
					return (element.x == k);
				})

				if (columnToFill.length > 0) {

					console.log('Rellenando espacios: Conseguí ' + columnToFill.length + ' espacios por rellenar en la columna ' + k);

					//Obtiene las posiciones que deben ser movidas en la columna actual
					columnNotMoved = positionsToMove.filter(function(element) {
						return (element.x == k);
					});

					//Si no se debe mover ningún elmento en la columna actual
					if (columnNotMoved.length == 0) {

						//Genera los nuevos caramelos
						newCandy = self.RandomGenerator(columnToFill.length);

						currentNewCandy = 0;

						for (var l = 0; l < columnToFill.length; l++) {
							if (newCandy[currentNewCandy] == 1) {
								$('.candy-' + columnToFill[l].y + '-' + columnToFill[l].x).eq(0).attr('src', 'image/1.png');
							} else if (newCandy[currentNewCandy] == 2) {
								$('.candy-' + columnToFill[l].y + '-' + columnToFill[l].x).eq(0).attr('src', 'image/2.png');
							} else if (newCandy[currentNewCandy] == 3) {
								$('.candy-' + columnToFill[l].y + '-' + columnToFill[l].x).eq(0).attr('src', 'image/3.png');
							} else {
								$('.candy-' + columnToFill[l].y + '-' + columnToFill[l].x).eq(0).attr('src', 'image/4.png');
							};
							self.candyBoard[columnToFill[l].y][columnToFill[l].x] = newCandy[currentNewCandy];
							candy = document.getElementsByClassName('candy-' + columnToFill[l].y + '-' + columnToFill[l].x);
							candy[0].style.position = 'absolute';
							candy[0].style.top = '130.3125px';
							candy[0].style.display = 'none';
							currentNewCandy = currentNewCandy + 1;

							//Determina la posición del elemento
							if (columnToFill[l].y == 4) {
								position = 610.3125;
								time = 250;
							} else if (columnToFill[l].y == 3) {
								position = 490.3125;
								time = 300;
							} else if (columnToFill[l].y == 2) {
								position = 370.3125;
								time = 350;
							} else if (columnToFill[l].y == 1) {
								position = 250.3125;
								time = 400;
							} else {
								position = 130.3125;
								time = 750;
							};

							$('img[class*="candy-' + columnToFill[l].y + '-' + columnToFill[l].x + '"]').show().delay(time);
							candy = document.getElementsByClassName('candy-' + columnToFill[l].y + '-' + columnToFill[l].x);
							candy[0].style.display = 'block';

							$('img[class*="candy-' + columnToFill[l].y + '-' + columnToFill[l].x + '"]').animate(
								{
									top: position + 'px',
								},
								{
									duration: time,
									easing: 'linear',
									queue: true,
								}
							);
						};
					};
				};
			}

		}, 750);

		setTimeout(function() {

			console.log('Antes de llamar al callback');

			for (t = 0; t < self.candyBoard.length; t++) {
				console.log(self.candyBoard[t]);
			};			
			callback(self, self.RefillCandyBoard);
		}, 850)
	}
}

$(document).ready(function() {
	//Obtiene el elemento que contiene el botón de inicio
	startButtonElement = $('.btn-reinicio');

	//Asigna el evento que se dispará al presionar el botón de inicio
	startButtonElement.eq(0).on('click', GameStart);

	TitleAnimation();
});

//Función que inicia la partida de juego
function GameStart() {
	var gameTableElement;
	var panelScore;
	var timeDisplayElement;
	var pointsElement;
	var movementsElement;
	var panelTimeElement;	
	var startButtonElement;
	var panelEndGameTitleElement;
	var candyElements;
	var timer;
	var candyGame;

	//Valida que no exista una instancia de la clase CandyGame y una instancia de la clase timerClass
	if ((candyGame == undefined) || (timer == undefined)) {

		//Obtiene los elementos del tablero de juego y restituye sus características css
		gameTableElement = $('.panel-tablero').eq(0);
		gameTableElement.css('width', '70%');
		gameTableElement.css('height', '620px');
		gameTableElement.css('display', 'flex');
		panelScoreElement = $('.panel-score').eq(0);
		panelScoreElement.css('width', '25%')
		panelTimeElement = $('.time');
		panelTimeElement.show();
		panelTimeElement.css('width', '100%');
		panelTimeElement.css('height', '20%');
		panelEndGameTitleElement = $('.titulo-over').eq(0);
		if (panelEndGameTitleElement != undefined) {
			panelEndGameTitleElement.remove();
		};

		//Valida que no existan caramelos en el tablero de juego y en caso afirmativo los elimina
		candyElements = $('img[class*="candy-');
		if (candyElements != undefined) {
			candyElements.remove();
		};

		pointsElement = $('#score-text');
		movementsElement = $('#movimientos-text');
		startButtonElement = $('.btn-reinicio');
		candyGame = new CandyGame(gameTableElement, pointsElement, movementsElement);

		//Obtiene el elemento que contiene el reloj de juego e inicializa el timer
		timeDisplayElement = $('#clock');
		timer = new Timer(timeDisplayElement[0], 120, GameOver);
		timer.countDown();

		startButtonElement.eq(0).html('Reiniciar');		
	} else {

		//En caso de que exista una instancia de cada clase, detiene el temporizador, reinicializa las variables de objetos y llama nuevamente a la función GameStart
		timer.timerStop();
		timer = undefined;
		candyGame = undefined;

		GameStart();
	};
};

//Función callback que es pasada como parámetro al timer para que sea ejecutada una vez se termine el tiempo de juego
function GameOver() {
	var panelTableroElement;
	var panelScoreElement;
	var panelTimeElement;
	var panelMovesElement;
	var panelEndGameTitleElement;

	panelEndGameTitleElement = 	'<div class="titulo-over">' +
									'<h5>Juego Terminado</h5>' +
								'</div>';

	panelTableroElement = $('.panel-tablero');
	panelScoreElement = $('.panel-score');
	panelTimeElement = $('.time');
	panelMovesElement = $('.moves');

	panelTableroElement.animate(
		{
			width: '0%',
			height: '0%'
		},
		{
			duration: 1000,
			easing: 'linear',
			queue: false,
			complete: function() {
				panelTableroElement.hide()
			}
		}
	);

	panelMovesElement.animate(
		{
			width: '100%'
			//marginTop: '1%',
			//marginBottom: '1%'
		},
		{
			duration: 1000,
			easing: 'linear',
			queue: false
		}
	);

	panelScoreElement.animate(
		{
			width: '100%'
			//marginTop: '1%',
			//marginBottom: '0%'
		},
		{
			duration: 1000,
			easing: 'linear',
			queue: false
		}
	);

	panelTimeElement.animate(
		{
			width: '0%',
			height: '0%'
		},
		{
			duration: 1000,
			easing: 'linear',
			queue: false,
			complete: function() {
				panelTimeElement.hide()
			}			
		}
	);

	panelScoreElement.prepend(panelEndGameTitleElement).delay(1000);
}

function TitleAnimation() {
	//Realiza la animación del título del tablero
	$('.main-titulo').eq(0).animate(
		{
			color: 'white'
		},
		{
			duration: 500,
			easing: 'linear'
		}
	)
	.animate(
		{
			color: 'red'
		},
		{
			duration: 500,
			easing: 'linear'
		}
	)	
	.animate(
		{
			color: '#DCFF0E'
		},
		{
			duration: 500,
			easing: 'linear',
			complete: function() {
				TitleAnimation(this);
			}
		}
	).delay(1000);
};