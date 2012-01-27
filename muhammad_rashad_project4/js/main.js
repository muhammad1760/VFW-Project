//Rashad Muhammad
//Project 4
//VFW - 1201

//Wait until the DOM is ready - Document has loaded completely.
window.addEventListener("DOMContentLoaded", function() {
	//getElementById(). Shortcut to grab Element by Id.
	function $(x) {
		var theElement = document.getElementById(x);
		return theElement; 
	}
	//Create Select field element $ populate w/ options. Below, formTag is an array of all form elements
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
	//Variable defaults. An array is created to hold options for our drop down menu
	var showChannels = ["Choose Channel", "HBO", "Showtime", "Cinemax", "Starz", "ABC", "NBC", "CBS", "CNN", "HLN", "MSNBC", "FOX News",  
						"TLC", "Oxygen", "OWN", "Discovery", "History", "VH1", "MTV", "BET", "Misc"],
		daynightValue,
		dayofweekValue = "",
		errMsg = $('errors');
	makeCats();
	//Find value of selected radio button.
	function getSelectedRadio(){
		var radios = document.forms[0].dayornight;
		for (var i=0; i<radios.length; i++){
			if(radios[i].checked){
				daynightValue = radios[i].value;
			}
		}
	}
	function getCheckboxValue(){
		var checkbx = document.forms[0].showday;
		for (var i=0; i<checkbx.length; i++){
			//I knew there had to be a way to list the array items without overwriting and assigning 
			//only one value to multiple checked items. I found the missing piece:   "\n"  on 
			//www.blog.highub.com/javascript/javascript-core-get-form-checkbox-array-values/
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
	function storeData(key){
		//If no key exists, then it's a brand new item and a new key is needed.
		if (!key){
			var id= Math.floor(Math.random()*10000001);
		}
		//Set the id to the existing key being edited so that it'll save over the data.
		//The key is the same key passed from editSubmit event handler to the validate
		//function, and finally passed here into the storeData function.
		else{
			id = key;
		}
		
		//Gather up all form field values & store in an object.
		//Object properties contain an array with the form label and input values
		getSelectedRadio();
		getCheckboxValue();
		var item 				={};
			item.showname		=["Name of TV Show:", $('showname').value];
			item.startdate		=["Date Entered:", $('startdate').value];
			item.starttime		=["Show Time:", $('starttime').value];
			item.dayornight		=["Day/Night:", daynightValue];
			item.channel		=["Show Channel:", $('channels').value];
			item.showday		=["Show Day(s):", dayofweekValue];
			item.favorite	 	=["My Favorite Meter. On a scale of 1 to 10 this show is:", $('favrating').value];
			item.comments		=["Comments about this show:", $('comments').value];
		//Save data into Local Storage: Use Stringify to convert object to a string. "[object, object]"
		localStorage.setItem(id, JSON.stringify(item));
		alert("Show Saved!");
	}
		function getData() {
			toggleControls("on");
			if (localStorage.length === 0){
				alert("You have no shows saved so default data was added.");
				autoFillData();
			}
			//Write data from localStorage to the browser.
			var makeDiv = document.createElement('div');
			makeDiv.setAttribute("id", "items");
			var makeList = document.createElement('ul');
			makeDiv.appendChild(makeList);
			document.body.appendChild(makeDiv);
			$('items').style.display = "block";
			for (var i=0, j=localStorage.length; i<j; i++){
				var makeli= document.createElement('li');
				var linksLi = document.createElement('li');
				makeList.appendChild(makeli);
				var key = localStorage.key(i);
				var value = localStorage.getItem(key);
				//Convert string from localStorage value to an object using JSON.parse() 
				var obj = JSON.parse(value);
				var makeSubList = document.createElement('ul');
				makeli.appendChild(makeSubList);
				getImage(obj.channel[1], makeSubList);
				for (var t in obj){
					var makeSubli = document.createElement('li');
					makeSubList.appendChild(makeSubli);
					var optsubText = obj[t][0]+" "+ obj[t][1];
					makeSubli.innerHTML = optsubText;
					makeSubList.appendChild(linksLi);
				}
				makeItemLinks(localStorage.key(i), linksLi);  //Creates edit & delete links for each item in local storage.
			}
		}
		//Get the image for right category being displayed
		function getImage(catName, makeSubList){
			var imageLi = document.createElement('li');
			makeSubList.appendChild(imageLi);
			var newImage = document.createElement('img');
			var setSrc = newImage.setAttribute("src", "images/"+ catName +".png");
			imageLi.appendChild(newImage);
		}
		
		//Auto populate Local Storage using JSON object
		function autoFillData(){
			//JSON Object data is coming from json.js which is loaded from additem.html
			//This will store the JSON object into Local Storage.
			for(var n in json){
				var id = Math.floor(Math.random()*10000001);
				localStorage.setItem(id, JSON.stringify(json[n]));
			}
		}
		
		//Creates edit and delete links when displayed
		function makeItemLinks(key, linksLi) {
			//Adds an edit single item link.
			var editLink = document.createElement('a');
			editLink.href = "#";
			editLink.key = key;
			var editText = "Edit Show";
			editLink.addEventListener("click", editItem);
			editLink.innerHTML = editText;
			linksLi.appendChild(editLink);
			//Adds a delete single item link.
			var deleteLink = document.createElement('a');
			deleteLink.href = "#";
			deleteLink.key = key;
			var deleteText = "Delete Show";
			deleteLink.addEventListener("click", deleteItem);
			deleteLink.innerHTML = deleteText;
			linksLi.appendChild(deleteLink);
		}
		//Gets data from Local Storage.
		function editItem(){
			var value = localStorage.getItem(this.key);
			var item = JSON.parse(value);
			
			//Shows the form.
			toggleControls("off");
			
			//Populates form fields w/current Local Storage values.
			$('showname').value	= item.showname[1];
			$('startdate').value= item.startdate[1];
			$('starttime').value= item.starttime[1];
			var radios = document.forms[0].dayornight;
			for(var i=0; i<radios.length; i++){
				if (radios[i].value == "AM" && item.dayornight[1]=="AM"){
					radios[i].setAttribute("checked", "checked");
				}
				else if (radios[i].value == "PM" && item.dayornight[1] =="PM"){
					radios[i].setAttribute("checked", "checked");
				}
			}
			$('channels').value	= item.channel[1];
			var checkbx = document.forms[0].showday;
			for(var i=0; i<checkbx.length; i++){
				
				if (checkbx[i].value === "Sunday" && item.showday[1] === "Sunday"){					
					checkbx[i].setAttribute("checked", "checked");
				}
				if (checkbx[i].value === "Monday" && item.showday[1] === "Monday"){					
					checkbx[i].setAttribute("checked", "checked");
				}
				if (checkbx[i].value === "Tuesday" && item.showday[1] === "Tuesday"){					
					checkbx[i].setAttribute("checked", "checked");
				}
				if (checkbx[i].value === "Wednesday" && item.showday[1] === "Wednesday"){					
					checkbx[i].setAttribute("checked", "checked");
				}
				if (checkbx[i].value === "Thursday" && item.showday[1] === "Thursday"){					
					checkbx[i].setAttribute("checked", "checked");
				}
				if (checkbx[i].value === "Friday" && item.showday[1] === "Friday"){					
					checkbx[i].setAttribute("checked", "checked");
				}
				if (checkbx[i].value === "Saturday" && item.showday[1] === "Saturday"){					
					checkbx[i].setAttribute("checked", "checked");
				}
			}			
			$('favrating').value= item.favorite[1];
			$('comments').value	= item.comments[1];
			//Remove the initial listener from the input "save contact" button.
			save.removeEventListener("click", storeData);
			//Change Submit button value to "Edit" button
			$('submit').value = "Edit Show";
			var editSubmit = $('submit');
			//Save the key value established in this function as a property of the editSubmit event
			//so I can use that value when I save the data I edited.
			editSubmit.addEventListener("click", validate);
			editSubmit.key = this.key;			
		}
		
		function deleteItem(){
			var ask = confirm("Are you sure you want to delete this show?");
			if(ask){
				localStorage.removeItem(this.key);
				alert("Show was deleted!");
				window.location.reload();
			}
			else{
				alert("Show was not deleted!");
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
		
		function validate(e){
			//Define elements to be check.
			var getShowName = $('showname');
			var getStartTime = $('starttime');
			var getChannel = $('channels');
			//var getDayOfWeek = showday;
			
			//Reset Error Messages
			errMsg.innerHTML = "";
			getShowName.style.border = "none";
			getStartTime.style.border = "none";
			getChannel.style.border = "none";
						
			//Get Error Messages
			var msgArray = [];
			
			//Show Name Validation
			if(getShowName.value === "") {
				var showNameError = "Please enter the show's title.";
				getShowName.style.border = "1px solid red";
				msgArray.push(showNameError);
			}
			//Show Time Validation
			var st =/^([0-1][0-9]|[2][0-3])(:([0-5][0-9])){1,2}$/;
			if(!(st.exec(getStartTime.value))){
				var showTimeError = "Please enter a valid show time.";
				getStartTime.style.border = "1px solid red";
				msgArray.push(showTimeError);
			}
			
			//Show Channel Validation
			if(getChannel.value === "Choose Channel") {
				var showChannelError = "Please choose the show's channel.";
				getChannel.style.border = "1px solid red";
				msgArray.push(showChannelError);
			}
			
			//If there are errors, display them on the screen.
			if(msgArray.length >= 1){
				for(var i=0, j=msgArray.length; i<j; i++){
					var txt = document.createElement('li');
					txt.innerHTML = msgArray[i];
					errMsg.appendChild(txt);
				}
				e.preventDefault();
				return false;
			}
			//If form is validated, then store the data to Local Storage. Also, send the key value (from the editData
			//function). this key value was passed through the editSubmit event listener as a property.
			else {
				storeData(this.key);
			}
		}
	//Set Link and Submit Click Events. Some event listeners to run functions on the page.
	var displayData = $('displayData');
	displayData.addEventListener("click", getData);
	var clearData = $('clear');
	clearData.addEventListener("click", clearLocal);
	var save = $('submit');
	save.addEventListener("click", validate);
});