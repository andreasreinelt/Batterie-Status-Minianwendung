/*

Made by Andreas Reinelt - 2010/12
reineltandreas@icloud.com

Ohne Erlaubnis nicht bearbeiten, verändern oder Inhalte weiterverwenden. Darf in der Originalversion uneingeschränkt weitergegeben werden.
Don't alter, edit or reuse content without permission. Can be fully distributed in the original version.

*/

var settingsFont,
	settingsSpeed,
	settingsBreak,
	settingsCharge;

function loadSettings() {

	System.Gadget.onSettingsClosing = settingsClosing;
	
	settingsFont = System.Gadget.Settings.readString("Font");
	settingsSpeed = System.Gadget.Settings.read("Speed");
	settingsBreak = System.Gadget.Settings.read("Break");
	settingsCharge = System.Gadget.Settings.read("Charge");
	
	selectFont.options[0] = new Option("TimesNewRoman", "TimesNewRoman", false, (settingsFont == "TimesNewRoman") ? true : false);
	selectFont.options[1] = new Option("SegoeUI", "SegoeUI", false, (settingsFont == "SegoeUI") ? true : false);
	selectFont.options[2] = new Option("Tahoma", "Tahoma", false, (settingsFont == "Tahoma") ? true : false);
	selectFont.options[3] = new Option("- Ohne Beschriftung -", "clear", false, (settingsFont == "clear") ? true : false);
	
	if (settingsSpeed) {
		checkSpeed.checked = true;
	} else {
		checkSpeed.checked = false;
	}
	if (settingsBreak) {
		checkBreak.checked = true;
	} else {
		checkBreak.checked = false;
	}
	if (settingsCharge) {
		checkCharge.checked = true;
	} else {
		checkCharge.checked = false;
	}
}
	
function settingsClosing(event) {
	if (event.closeAction == event.Action.commit) {
		System.Gadget.Settings.write("Setting", true);
		System.Gadget.Settings.writeString("Font", selectFont.value);
		System.Gadget.Settings.write("Speed", (checkSpeed.checked) ? true : false);
		System.Gadget.Settings.write("Break", (checkBreak.checked) ? true : false);
		System.Gadget.Settings.write("Charge", (checkCharge.checked) ? true : false);
	}
}