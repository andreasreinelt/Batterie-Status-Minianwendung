/*

Made by Andreas Reinelt - 2010/12
reineltandreas@icloud.com

Ohne Erlaubnis nicht bearbeiten, verändern oder Inhalte weiterverwenden. Darf in der Originalversion uneingeschränkt weitergegeben werden.
Don't alter, edit or reuse content without permission. Can be fully distributed in the original version.

*/

var setanimate = setInterval("animate()",15),
	setstatus = setInterval("status()",2000);

var PLC, // Status; PowerLineConnected 
	BPR, // Status; BatteriePercentRemaining
	of=0, // Animation; Startpunkt
	to=0, // Animation; Endpunkt
	upc=0, // Init; upcounter; Sobald zum aktuellen Batteriestand hochgezählt wurde
	i=0, // Init; Zum aktuellen Batteriestand hochzählen
	b=0, // Einstellungen; Pausiert die Animation
	c=0, // Einstellungen; Geschwindigkeit verlangsamen; längere Pause bis zum hochzählen
	settingsFont, // Einstellungen; Schriftart
	settingsSpeed, // Einstellungen; Geschwindigkeit
	settingsBreak, // Einstellungen; Animation Pausieren
	settingsCharge, // Einstellungen; Aufladen Animation abschalten
	PT, // Einstellungen; Schriftart; Percent Text
	TS, // Einstellungen; Schriftart; Text Shadow
	BP, // Status; Textwert; Batterie Percent
	PS, // Status; Textwert; Percent Shadow
	settingsRed, // Einstellungen; Farbe; Rot
	settingsGre, // Einstellungen; Farbe; Grau
	settingsGry, // Einstellungen; Farbe; Grün
	noBatterie; // Status; Akku entfernt, nur Ladekabel

function init() {
	if (System.Gadget.Settings.read("Setting")) {
		settingsFont = System.Gadget.Settings.readString("Font");
		settingsSpeed = System.Gadget.Settings.read("Speed");
		settingsBreak = System.Gadget.Settings.read("Break");
		settingsCharge = System.Gadget.Settings.read("Charge");
	} else {
		settingsFont = "TimesNewRoman";
		settingsSpeed = false;
		settingsBreak = true;
		settingsCharge = true;
	}
	
	if (settingsSpeed) {
		clearInterval(setanimate);
		setanimate = setInterval("animate()",30);
	} else {
		clearInterval(setanimate);
		setanimate = setInterval("animate()",15);
	}
	
	PT = document.getElementById("percent");
	TS = document.getElementById("shadow");
	PT.className = settingsFont;
	TS.className = settingsFont;
	
	status();

	System.Gadget.settingsUI = "settings.html";
	System.Gadget.onSettingsClosed = settingsClosed;
	
	if (!System.Gadget.Settings.read("Setting")) {
		System.Gadget.Settings.write("Setting", true);
		System.Gadget.Settings.writeString("Font", settingsFont);
		System.Gadget.Settings.write("Speed", settingsSpeed);
		System.Gadget.Settings.write("Break", settingsBreak);
		System.Gadget.Settings.write("Charge", settingsCharge);
	}
}

function status() {
	BPR = System.Machine.PowerStatus.batteryPercentRemaining;
	PLC = System.Machine.PowerStatus.isPowerLineConnected;
	
	if (!settingsCharge) {
		PLC = false;
	}
	
	if (BPR>100) {
	BPR=100;
	upc=1;
	PLC=false; //26.10.11 Hinzugefügt: Verhindert Aufladen Animation bei keinem Akku
	noBatterie = true;
	animate();
	} else {
	noBatterie = false;
	}

	if (PLC) {
		if (to<=24 && BPR>=25) {
			if (settingsSpeed && c<1) {
				c++;
			} else {
				to=25;
				upc=0;
				c=0;
				animate();
			}
		} else if (to<=49 && BPR>=50) {
			to=50;
			upc=0;
			animate();
		} else if (to<=74 && BPR>=75) {
			to=75;
			upc=0;
			animate();
		} else if (to==BPR) {
			if (BPR<=97) {
				if (settingsBreak && b<5) {
					b++;
				} else {
					to=0;
					b=0;
					animate();
				}
			}
		} else {
			to=BPR;
			upc=0;
			animate();
		}
	}

	if (of!=BPR && !PLC) {
		to=BPR;
		animate();
	}
	
	if (upc==1) {
		BP = document.getElementById("percent");
		PS = document.getElementById("shadow");
		
		if(!noBatterie) {
			BP.innerHTML = BPR + "%";
			PS.innerHTML = BPR + "%";
		} else {
			BP.innerHTML = "--%";
			PS.innerHTML = "--%";
		}
	}
	
	if(!noBatterie) {
		if(BPR<15) {
			if (!settingsRed) {
				document.getElementById("bar").style.background = "#FF0000";
				settingsRed = true;
				settingsGre = false;
				settingsGry = false;
			}
		} else {
			if (!settingsGre) {
				document.getElementById("bar").style.background = "#009900";
				settingsRed = false;
				settingsGre = true;
				settingsGry = false;
			}
		}
	} else {
		if(!settingsGry) {
			document.getElementById("bar").style.background = "#808080";
			settingsRed = false;
			settingsGre = false;
			settingsGry = true;
		}
	}
}

function animate() {
	if (upc==0 && !noBatterie) {
		if (i<to) {
			i++;
			BP = document.getElementById("percent");
			PS = document.getElementById("shadow");
			BP.innerHTML = i + "%";
			PS.innerHTML = i + "%";
		} else {
			upc=1;
		}
	}

	if (of<to) {
		of++;
		document.getElementById("bar").style.width = of + "px";
	}
	if (of>to) {
		of--;
		document.getElementById("bar").style.width = of + "px";
	}
}

function settingsClosed(event) {
	if (event.closeAction == event.Action.commit) {
		init();
	}
}