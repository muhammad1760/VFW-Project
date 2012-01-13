//Rashad Muhammad
//Project 2
//VFW - 1201



window.addEventListener("DOMContentLoaded", function() {
	function $(x) {
		var theElement = document.getElementById(x);
		return theElement; 
	}
	//Create select field element $ populate w/ options. Below, formTag is an array of all form elements.
	function makeCats(){
		var formTag = document.getElementsByTagName("form"),  		
			selectLi = $('select'),
			makeSelect = document.createElement('select');
			makeSelect.setAttribute("id", "channels");
		for (var i=0, j=showChannels.length; i<j; i++){
			var makeOption = document.createElement('option');
			var optText = showChannels[i];
			makeOption.setAttribute("value", optText);
			makeOption.innerHTML = optText;  						 
			makeSelect.appendChild(makeOption);
		}
		selectLi.appendChild(makeSelect);
	}
	//An array is created to hold options for the drop down menu.
	var showChannels = ["Choose Channel", "HBO", "Showtime", "Cinemax", "Starz", "REELZ", "ABC", "NBC", "CBS", "CNN", "HLN", "MSNBC", "FOX News", "Discovery", 
						"TLC", "Oxygen", "OWN", "History", "VH1", "MTV", "BET", "Misc"],
		daynightValue,
		dayofweekValue = "";
	makeCats();
	function getSelectedRadio(){
		var radios = document.forms[0].dayornight;
		for (var i=0; i<radios.length; i++){
			if(radios[i].checked){
				daynightValue = radios[i].value;
			}
		}
	}
	/*I knew there had to be a way to list the array items without overwriting values and assigning 
	  only one value to multiple checked items. I found the missing piece:   "\n"  on 
	  www.blog.highub.com/javascript/javascript-core-get-form-checkbox-array-values/	*/
	function getCheckboxValue(){
		var checkbx = document.forms[0].showday;
		for (var i=0; i<checkbx.length; i++){
			if (checkbx[i].checked){
				dayofweekValue += checkbx[i].value + "\n";				
			}
		}
	}
	function toggleControls(t){
		switch(t){
			case "on":
				$('showsForm').style.display = "none";
				$('clear').style.display = "inline";
				$('displayData').style.display = "none";
				$('addNew').style.display = "inline";
				break;
			case "off":
				$('showsForm').style.display = "block";
				$('clear').style.display = "inline";
				$('displayData').style.display = "inline";
				$('addNew').style.display = "none";
				$('items').style.display = "none";
				break;
			default:
				return false;
		}
	}
	function storeData(){
		var id= Math.floor(Math.random()*10000001);
		//Takes all form field values & stores them in an object.
		getSelectedRadio();
		getCheckboxValue();
		var item 				={};
			item.showname		=["Name of TV Show:", $('showname').value];
			item.startdate		=["Date Entered:", $('startdate').value];
			item.starttime		=["Show Time:", $('starttime').value];
			item.dayornight		=["Day/Night:", daynightValue];
			item.channel		=["Show Channel:", $('channels').value];
			item.dayofweek		=["Show Day(s):", dayofweekValue];
			item.favorite	 	=["My Favorite Meter. On a scale of 1 to 10 this show is:", $('favrating').value];
			item.comments		=["Comments about this show:", $('comments').value];
		localStorage.setItem(id, JSON.stringify(item));
		alert("Show Saved!");
	}
		function getData() {
			toggleControls("on");
			if (localStorage.length === 0){
				alert("You have no shows saved.");
			}
			var makeDiv = document.createElement('div');
			makeDiv.setAttribute("id", "items");
			var makeList = document.createElement('ul');
			makeDiv.appendChild(makeList);
			document.body.appendChild(makeDiv);
			$('items').style.display = "block";
			for (var i=0, j=localStorage.length; i<j; i++){
				var makeli= document.createElement('li');
				makeList.appendChild(makeli);
				var key = localStorage.key(i);
				var value = localStorage.getItem(key); 
				var obj = JSON.parse(value);
				var makeSubList = document.createElement('ul');
				makeli.appendChild(makeSubList);
				for (var t in obj){
					var makeSubli = document.createElement('li');
					makeSubList.appendChild(makeSubli);
					var optsubText = obj[t][0]+" "+ obj[t][1];
					makeSubli.innerHTML = optsubText;
				}
			}
		}
		function clearLocal(){
			if (localStorage.length === 0){
				alert("No data in storage.");
			}
			else{
				localStorage.clear();
				alert("All shows are deleted!");
				window.location.reload();
				return false;
			}
		}
	var displayData = $('displayData');
	displayData.addEventListener("click", getData);
	var clearData = $('clear');
	clearData.addEventListener("click", clearLocal);
	var save = $('submit');
	save.addEventListener("click", storeData);
});