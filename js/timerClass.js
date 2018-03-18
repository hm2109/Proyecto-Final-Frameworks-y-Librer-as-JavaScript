class Timer {
	/*
		Properties
		-----------------------------
		callbackFunction
		displayElement
		IntervalId
	*/

	//Función que inicializa las variables del cronómetro con el tiempo recibido como paráemtros en segundos
	constructor (displayElement, timerTimeinSeconds, callback) {
		var timeTemp;
		var displayContent = '';

		this.callbackFunction = callback;

		this.displayElement = displayElement;

		if (timerTimeinSeconds > 0) {
			//Obtiene la cantidad de días contenidos en timerTime y calcula el resto
			this.timeDays = parseInt(((timerTimeinSeconds / 60) / 60) / 24);
			timeTemp = (timerTimeinSeconds - ((this.timeDays * 24 ) * 60) * 60);

			//Obtiene la cantidad de horas contenidas en timerTemp (resto de timerTime) y calcula el resto
			this.timeHours = parseInt((timeTemp / 60) / 60);
			timeTemp = (timeTemp - (this.timeHours * 60 ) * 60);

			//Obtiene la cantidad de minutos contenidos en timerTemp y calcula la cantidad de segundos restantes
			this.timeMinutes = parseInt(timeTemp / 60);
			this.timeSeconds = (timeTemp - (this.timeMinutes * 60));

			
			if (this.timeDays > 0) {
				displayContent = timeDays + ':';
				this.displayDays = true;
			};
			if ((this.timeHours > 0) || (this.timeDays > 0)) {
				if (this.timeHours.toString().length < 2) {
					displayContent = displayContent + '0';
				};
				displayContent = displayContent + this.timeHours + ':';
				this.displayHours = true;
			};
			if ((this.timeMinutes > 0) || (this.timeHours > 0) || (this.timeDays > 0)) {
				if (this.timeMinutes.toString().length < 2) {
					displayContent = displayContent + '0';
				};				
				displayContent = displayContent + this.timeMinutes + ':';
				this.displayMinutes = true;
			};
			if ((this.timeSeconds > 0) || (this.timeMinutes > 0) || (this.timeHours > 0) || (this.timeDays > 0)) {
				if (this.timeSeconds.toString().length < 2) {
					displayContent = displayContent + '0';
				};
				displayContent = displayContent + this.timeSeconds;
			} else {
				if (this.timeSeconds.toString().length < 2) {
					displayContent = displayContent + '0';
				};				
				displayContent = '00:' + displayContent + this.timeSeconds;
			};

			//Actualiza el display con el tiempo del cronómetro 
			this.displayElement.innerText = displayContent;
		};
	}

	//Función que realiza el conteo regresivo a partir del cálculo de días, horas, minutos y segundos recibidos como parámetros
	countDown() {
		var clase;

		clase = this;

		//Realiza el conteo regresivo del timer
		this.intervalId = window.setInterval(function() {
			if ((clase.timeSeconds == 0) && (clase.timeMinutes == 0) && (clase.timeHours == 0) && (clase.timeDays == 0))   {
				clearInterval(clase.intervalId);
				clase.callbackFunction();
			} else {
				if (clase.timeSeconds > 0) {
					clase.timeSeconds = clase.timeSeconds - 1;
				} else {
					clase.timeSeconds = 59; 
					if (clase.timeMinutes > 0) {
						clase.timeMinutes = clase.timeMinutes - 1;
					} else {
						clase.timeMinutes = 59;
						if (clase.timeHours > 0) {
							clase.timeHours = clase.timeHours - 1;
						} else {
							clase.timeHours = 23;
							if (clase.timeDays > 0) {
								clase.timeDays = clase.timeDays - 1;
							}
						};
					};
				};
			};
			clase.updateDisplay();
		}, 1000);
	}

	//Función que actualiza el display del timer
	updateDisplay() {
		//Inicializa variable de trabajo
		var displayText = '';

		//Verifica si debe mostrar los días restantes
		if (this.displayDays == true) {
			displayText = displayText + this.timeDays + ' días '; 
		};

		//Verifica si debe mostrar las horas restantes
		if (this.displayHours == true) {
			if (this.timeHours == 0) {
				displayText = displayText + '00:';
			} else if (this.timeHours.toString().length == 1) {
				displayText = displayText + '0' + this.timeHours + ':';
			} else {
				displayText = displayText + this.timeHours + ':'; 	
			};
		};

		//Verifica si debe mostrar los minutos restantes
		if (this.displayMinutes == true) {
			if (this.timeMinutes == 0) {
				displayText = displayText + '00:';
			} else if (this.timeMinutes.toString().length == 1) {
				displayText = displayText + '0' + this.timeMinutes + ':';
			} else {
				displayText = displayText + this.timeMinutes + ':'; 	
			};
		};

		//Formatea el string que contiene la cantidad en segundos del tiempo restante
		if (this.timeSeconds == 0) {
			displayText = displayText + '00';
		} else if (this.timeSeconds.toString().length == 1) {
			displayText = displayText + '0' + this.timeSeconds;
		} else {
			displayText = displayText + this.timeSeconds;
		};

		//Actualiza el contenido del display
		this.displayElement.innerText = displayText;
	}

	timerStop() {
		clearInterval(this.intervalId);		
	}
}