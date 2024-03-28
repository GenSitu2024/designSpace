/*
	System Driver
	Author : Nan Cao (nancao.org)
*/
// var compsvg = vis.compsvg().size([$("#mainview").width(), $("#mainview").width() * 0.6]),

//cookie title
var COOKIE_TITLE = "videobrowser_idvx_tongji_cookie";

// var NStrategyFull=["comparison", "unitization", "accumulation", "proportion"];
var NTransformationFull=['yes','no']
var NBindingTypeFull=['length','volume','area','quantity','time','tempreture','concept']
var NPresentationFormFull= ['static','dynamic']
var NLayoutFull=['juxtaposition','fusion']
//visual	haptic	sound	other (taste, smell)
var NUserFull = ["Individual","Group", "Public" ]
var NTopicFull = ["Society&History(include media)","Entertainment,Sports&Culture", "Environment(Surroudings/Nature),Geography&Ecology" ,"Health,Life&Emotion","Science", "Industry,Architecture&Engineering", "Unspecified&MixedTopics"]
var NPresentationFull = ["XR","Event","Artifact","Installation"]
var NGoalFull = ["comprehension", "communication",	"archive"	,"engagement"	,"reflection" ,	"analysis"]
var NdataOriginFull = ['Environmental data',"Participant-generated",	"Collected&Uploaded"	,"Unspecified" ]
var NSituatednessFull = [ "physical referent",	"physical referent proxy",	"environment",	"environment proxy"]
var NrepresentationFormFull = [ "visual"	,"haptic"	,"sound",	"other (taste, smell)"]

var parameter = {
	'txt':'',
	'year':[1996,2022],
	'User':[],
	'Topic':[],
	"Goal":[],
	"Presentation":[],
	"dataOrigin": [],
	"Situatedness":[],
	'representationForm':[],
	'Description':[],
	"Sourcelink":[],
	'intent':{'task': [],'domain': [], 'data': [], 'visualization': [], 'interaction': []},

	removeAll: function(intentItem) {
		this.intent[intentItem].splice(0, this.intent[intentItem].length);
		return true;
	},
	appendToIntent: function(item, intentItem) {
		this.intent[intentItem].push(item);
		return this.intent[intentItem].length;
	}
}
// layout UI and setup events

$(document).ready(function() {

	setupTooltips();
	loadData();
	setupHandlers();

	if(!$.cookie(COOKIE_TITLE))
		cookieSetting();
});



//set cookie
function cookieSetting() {
	$.cookie(COOKIE_TITLE, true, { expires: 365, path: "/", source:true});
}

function setupTooltips() {
	$("#idvx-task").tooltip({
		selector: '[data-toggle="tooltip"]',
		container: "body",
		placement: "auto bottom"
	});

	$("#idvx-videoContainer").tooltip({
		selector: '[data-toggle="tooltip"]',
		container: ".idvx-content-row",
		placement: "auto bottom"
	});
}

function isContained(aa,bb){
 
	   if(!(aa instanceof Array)||!(bb instanceof Array)||((aa.length < bb.length))){
			return false;
	    }

	    var aaStr = aa.toString();
	    for (var i = 0 ;i < bb.length;i++) {
	        if(aaStr.indexOf(bb[i]) < 0) return false;
	    }
	    return true;
}

//bind functions concerned to all handlers
function setupHandlers() {
	//set up the search handler
	// $("#input-searchBar").on("focus", searchCSS);
	// $("#input-searchBar").blur(searchCSSReturn);
	// $("#input-searchBar").on("keyup", onSearchK);
	$("#idvx-searchBar-button").on("click", onSearchC);

	//set up Analogy Strategy 
	$("#idvx-NDpanel").on("click", ".idvx-bottom-btn", onFilterToggleND1);
	$(".idvx-User-panelBody").on("click", ".idvx-collapsed-entry", onFilterToggleND1); //icons

	// set up transformation        修改这一行的内容
	$("#idvx-NDpanel").on("click", ".idvx-bottom-btn", onFilterToggleND2);
	$(".idvx-Topic-panelBody").on("click", ".idvx-collapsed-entry", onFilterToggleND2); //icons

	$("#idvx-NDpanel").on("click", ".idvx-bottom-btn", onFilterToggleND3);
	$(".idvx-Presentation-panelBody").on("click", ".idvx-collapsed-entry", onFilterToggleND3); //icons

	$("#idvx-NDpanel").on("click", ".idvx-bottom-btn", onFilterToggleND4);
	$(".idvx-Goal-panelBody").on("click", ".idvx-collapsed-entry", onFilterToggleND4); //icons

	$("#idvx-NDpanel").on("click", ".idvx-bottom-btn", onFilterToggleND5);
	$(".idvx-dataOrigin-panelBody").on("click", ".idvx-collapsed-entry", onFilterToggleND5); //icons

	$("#idvx-NDpanel").on("click", ".idvx-bottom-btn", onFilterToggleND6);
	$(".idvx-Situatedness-panelBody").on("click", ".idvx-collapsed-entry", onFilterToggleND6); //icons

	$("#idvx-NDpanel").on("click", ".idvx-bottom-btn", onFilterToggleND7);
	$(".idvx-representationForm-panelBody").on("click", ".idvx-collapsed-entry", onFilterToggleND7); //icons


	//set up Modals in video container
	$("#idvx-videoContainer").on("click", ".idvx-singleContainer", onVideoClick);
	$("#myModal").on("hidden.bs.modal", onModalHidden);
}


var itemsMap = {}; //filtered data
var itemsShortMap = {};
// load data from json file
function loadData() {
	$.getJSON("list/dataset2.json", function(data) {
		itemsMap = {};
		itemsShortMap = {};

		$.each(data, function(i, d) {

			if(!itemsShortMap[d.id])
				itemsShortMap[d.id] = {"id":d.id, "User":d.User,"Topic":d.Topic, "Presentation":d.Presentation, "Goal":d.Goal, "dataOrigin":d.dataOrigin, "Sourcelink":d.Sourcelink, "Situatedness":d.Situatedness,"representationForm":d.representationForm, "Description":d.Description }; //d is an Object

			d.png = new Image(); 
			d.png.src = "thumbnail/"+d.id+".png";
			// console.log(d)

			itemsMap[i] = d;
		});

		configureTimeFilter();
		updateDisplayedContent();
		// console.log("ready_data");
	})
}

//update the displayed content
function updateDisplayedContent() {
	var container = $("#idvx-videoContainer");
	container.empty();
	$(".tooltip").remove();
	// console.log(parameter)

	var timeRangeMin = parameter.year[0];
	var timeRangeMax = parameter.year[1];
	// var NObject = parameter.object;  //array
	var NUser = parameter.User;  //object
	var NTopic = parameter.Topic;
	var NPresentation = parameter.Presentation;
	var NGoal = parameter.Goal;
	var NdataOrigin = parameter.dataOrigin;
	var NSituatedness = parameter.Situatedness;
	var NrepresentationForm = parameter.representationForm;
	var NDescription = parameter.Description;
	var NSourcelink = parameter.Sourcelink;
	var consistentId = {};  //if an was out or repeating
	// console.log(parameter)
	// console.log(NIntent)
	//filter video contents according to parameter
	var eligibleItems = []; //eligible array
	// console.log(itemsMap)
	$.each(itemsMap, function(i, d) {
		var ID = d.id;
		//initialize a identical array : [object mark, intent mark]
		if(!consistentId[ID] || consistentId[ID] != -1)
			consistentId[ID] = 1;
		else
			return ;

		//filter time range
		
		if((d.years < timeRangeMin) || (d.years > timeRangeMax)) {
			consistentId[ID] = -1;
			return ;
		}

		//filter search txt
		if(!isRelevantToSearch(d))
			return ;


	var NPresentation = parameter.Presentation;
	var NGoal = parameter.Goal;
	var NdataOrigin = parameter.dataOrigin;
	var NSituatedness = parameter.Situatedness;
	var NrepresentationForm = parameter.representationForm;
	// var NDescription = parameter.Description;
	// var NSourcelink = parameter.Sourcelink;
		if(NUser.length>=1 && typeof(d.User)=="string" && (isContained(d.User,NUser) || isContained(NUser,d.User))){ return;}
		else if (isContained(NUser,Array(d.User))){return;}

		if(NTopic.length>=1 && typeof(d.Topic)=="string" && (isContained(d.Topic,NTopic) || isContained(NTopic,d.Topic))){ return;}
		else if (isContained(NTopic,Array(d.Topic))){return;}

		if(NPresentation.length>=1 && typeof(d.Presentation)=="string" && (isContained(d.Presentation,NPresentation) || isContained(NPresentation,d.Presentation))){ return;}
		else if (isContained(NPresentation,Array(d.Presentation))){return;}

		if(NGoal.length>=1 && typeof(d.Goal)=="string" && (isContained(d.Goal,NGoal) || isContained(NGoal,d.Goal))){ return;}
		else if (isContained(NGoal,Array(d.Goal))){return;}
	
		if(NdataOrigin.length>=1 && typeof(d.dataOrigin)=="string" && (isContained(d.dataOrigin,NdataOrigin) || isContained(NdataOrigin,d.dataOrigin))){ return;}
		else if (isContained(NdataOrigin,Array(d.dataOrigin))){return;}

		if(NSituatedness.length>=1 && typeof(d.Situatedness)=="string" && (isContained(d.Situatedness,NSituatedness) || isContained(NSituatedness,d.Situatedness))){ return;}
		else if (isContained(NSituatedness,Array(d.Situatedness))){return;}

		if(NrepresentationForm.length>=1 && typeof(d.representationForm)=="string" && (isContained(d.representationForm,NrepresentationForm) || isContained(NrepresentationForm,d.representationForm))){ return;}
		else if (isContained(NrepresentationForm,Array(d.representationForm))){return;}

		if(eligibleItems[eligibleItems.length-1] && (eligibleItems[eligibleItems.length-1]["id"] == ID))
			return ;
		//  console.log(eligibleItems)
		//append the eligible item into the Object
		var itemInfo = {"id":d.id,"Title":d.Title, "Description":d.Description, "Classification":d.Classification, "Topic":d.Topic, "png":d.png, "Source":d.Source, "Sourcelink":d.Sourcelink};
		// var itemInfo = {"id":ID, "name":d.Name, "Author":d.Author, "years":d.years, "png":d.png, "PaperTitle":d.PaperTitle};
		eligibleItems.push(itemInfo);
		//  console.log(eligibleItems)
	});
	

	if(!eligibleItems.length) {
		container.append("<p class=\"text-muted\">No eligible videos found.</p>");
	} else {
		$.each(eligibleItems, function(i, d) {

			var element = $("<div class=\"idvx-singleContainer\" data-toggle=\"tooltip\" data-target=\"#myModal\">");
			// console.log("-----",element)
			element.attr("data-id", d.id);
			// element.prop("infomation", d.Strategy + ", " + d.Transformation + " transformation"+", "+d.BindingType+", "+d.PresentationForm+", "+d.Layout);
			// console.log(d)
			var image = $("<img class=\"idvx-videoImg\">");
			
			image.attr("src", d.png.src);
			// console.log(d)
			element.append(image);
			container.append(element);
		});
	}

	updateDisplayedCount();
	// console.log("ready_filtercontent");

	//display all eligible items on screen

}


function updateDisplayedCount(){
	$("#idvx-searchBar-relativeNum").text($("#idvx-videoContainer .idvx-singleContainer").size());
}

//Search Bar
function searchCSS() {
	$(this).attr("placeholder", "");
	$(this).css("text-indent", 0);
	$("#magnify").hide();
}

function searchCSSReturn () {
	var value = $(this).val();
	value = $.trim(value);
	if(!value || value == " "){
		$(this).val("");
		$(this).attr("placeholder", "Search title");
		$(this).css("text-indent", "18px");
		$("#magnify").show();
	}
}

// Search Bar
function onSearchC() {
	parameter.txt = $("#input-searchBar").val().toLowerCase();
	$("#input-searchBar").blur();
	updateDisplayedContent();

	var txt = parameter.txt;
	// console.log(txt);
}

// Search Bar
// function onSearchK(event) {
// 	if(event.keyCode == 13)
// 		$("#idvx-searchBar-button").trigger("click");
// }

// var searchKeys = ['intent', 'name', 'object', 'sub-intent', 'subject', 'technique', 'visualization', 'year'];
// var searchKeys = ['Name','PaperTitle','Author'];
//if search txt in relevant values
function isRelevantToSearch(item) {
	var query = parameter.txt ? parameter.txt.trim() : null;
	// console.log(query)
	//check if users do not send in search txt
	if(!query || !item)
		return true;

	for(var i = 0; i < searchKeys.length; i++) {
		if((item[searchKeys[i]].toLowerCase()).indexOf(query) != -1)
			return true;
	}

	return false;
}


// Configures the time filter
var timeFilterNum = [1996,2022];  //all corresponded years

function configureTimeFilter() {
	// console.log("ready_filter");
	
	// Update labels
	$("#left_Num").text(timeFilterNum[0]);
	// $("#right_Num").text(timeFilterNum[timeFilterEntries.length-1]);
	$("#right_Num").text(timeFilterNum[1]);
	// console.log("ready_num");
	
	// Setup the slider
	$("#timeFilter").slider({
		range: true,
		min: 199600,
		max: 202220,
		values: [199600, 202220],
		slide: function(event, ui) {

			timeFilterNum[0] = parseInt(ui.values[0]/ 100);
			timeFilterNum[1] = parseInt(ui.values[1]/ 100);

			// d3.json("",function(e,d){
			// 	compsvg.data(d).update()
			// })

			if (timeFilterNum) {
				$("#left_Num").text(timeFilterNum[0]);
				$("#right_Num").text(timeFilterNum[1]);
				parameter.year = timeFilterNum;
			}

			
			updateDisplayedContent();
		}
	});
};





// set User
function onFilterToggleND1() {
	var element = $(this);
	
	//keywords in parameter.object should be excluded!
	// var keywordOnClick = element.children(".panel-collapse").text().toLowerCase();
	var keywordOnClick = element.attr("name");
	console.log("nihao",keywordOnClick)

	if (!element.hasClass("active"))
		element.children(".true").show();
	else
		element.children(".true").hide();

	if (element.hasClass("active") && ($.inArray(keywordOnClick, parameter.User)<0))
		parameter.User.push(keywordOnClick);
	else if(!element.hasClass("active") && $.inArray(keywordOnClick, parameter.User)>=0)
		parameter.User.splice($.inArray(keywordOnClick, parameter.User), 1);
	console.log("zhelishi",parameter)

	// element.children(".true").toggle();
	updateDisplayedContent();
	// console.log("onFilterToggle "+ keywordOnClick +" changed");
}


// set 
function onFilterToggleND2() {
	var element = $(this);
	
	//keywords in parameter.object should be excluded!
	// var keywordOnClick = element.children(".panel-collapse").text().toLowerCase();
	var keywordOnClick = element.attr("name");

	if (!element.hasClass("active"))
		element.children(".true").show();
	else
		element.children(".true").hide();

	if (element.hasClass("active") && ($.inArray(keywordOnClick, parameter.Topic)<0))
		parameter.Topic.push(keywordOnClick);
	else if(!element.hasClass("active") && $.inArray(keywordOnClick, parameter.Topic)>=0)
		parameter.Topic.splice($.inArray(keywordOnClick, parameter.Topic), 1);

	updateDisplayedContent();

}

function onFilterToggleND3() {
	var element = $(this);

	var keywordOnClick = element.attr("name");
	console.log(keywordOnClick)

	if (!element.hasClass("active"))
		element.children(".true").show();
	else
		element.children(".true").hide();

	if (element.hasClass("active") && ($.inArray(keywordOnClick, parameter.Presentation)<0))
		parameter.Presentation.push(keywordOnClick);
	else if(!element.hasClass("active") && $.inArray(keywordOnClick, parameter.Presentation)>=0)
		parameter.Presentation.splice($.inArray(keywordOnClick, parameter.Presentation), 1);

	updateDisplayedContent();
}

function onFilterToggleND4() {
	var element = $(this);

	var keywordOnClick = element.attr("name");
	console.log(keywordOnClick)

	if (!element.hasClass("active"))
		element.children(".true").show();
	else
		element.children(".true").hide();

	if (element.hasClass("active") && ($.inArray(keywordOnClick, parameter.Goal)<0))
		parameter.Goal.push(keywordOnClick);
	else if(!element.hasClass("active") && $.inArray(keywordOnClick, parameter.Goal)>=0)
		parameter.Goal.splice($.inArray(keywordOnClick, parameter.Goal), 1);

	updateDisplayedContent();
}

function onFilterToggleND5() {
	var element = $(this);

	var keywordOnClick = element.attr("name");
	console.log(keywordOnClick)

	if (!element.hasClass("active"))
		element.children(".true").show();
	else
		element.children(".true").hide();

	if (element.hasClass("active") && ($.inArray(keywordOnClick, parameter.dataOrigin)<0))
		parameter.dataOrigin.push(keywordOnClick);
	else if(!element.hasClass("active") && $.inArray(keywordOnClick, parameter.dataOrigin)>=0)
		parameter.dataOrigin.splice($.inArray(keywordOnClick, parameter.dataOrigin), 1);

	updateDisplayedContent();
}

function onFilterToggleND6() {
	var element = $(this);

	var keywordOnClick = element.attr("name");
	console.log(keywordOnClick)

	if (!element.hasClass("active"))
		element.children(".true").show();
	else
		element.children(".true").hide();

	if (element.hasClass("active") && ($.inArray(keywordOnClick, parameter.Situatedness)<0))
		parameter.Situatedness.push(keywordOnClick);
	else if(!element.hasClass("active") && $.inArray(keywordOnClick, parameter.Situatedness)>=0)
		parameter.Situatedness.splice($.inArray(keywordOnClick, parameter.Situatedness), 1);

	updateDisplayedContent();
}

function onFilterToggleND7() {
	var element = $(this);

	var keywordOnClick = element.attr("name");
	console.log(keywordOnClick)

	if (!element.hasClass("active"))
		element.children(".true").show();
	else
		element.children(".true").hide();

	if (element.hasClass("active") && ($.inArray(keywordOnClick, parameter.representationForm)<0))
		parameter.representationForm.push(keywordOnClick);
	else if(!element.hasClass("active") && $.inArray(keywordOnClick, parameter.representationForm)>=0)
		parameter.representationForm.splice($.inArray(keywordOnClick, parameter.representationForm), 1);

	updateDisplayedContent();
}



function onFilterToggleNI() {
	var element = $(this);
	var collapseContainer = element.parents(".panel-collapse").prev();

	//the names of keyword and its container
	var keywordOnClick = element.attr("Name").toLowerCase();
	var keywordContainer = collapseContainer.attr("id").toLowerCase();
	// console.log(parameter.object)
	// console.log(parameter)
	// console.log(element)
	if (element.hasClass("active") && ($.inArray(keywordOnClick, parameter.intent[keywordContainer])<0))
		parameter.intent[keywordContainer].push(keywordOnClick);
	else if(!element.hasClass("active") && $.inArray(keywordOnClick, parameter.intent[keywordContainer]>=0))
		parameter.intent[keywordContainer].splice($.inArray(keywordOnClick, parameter.intent[keywordContainer]), 1);
	//  console.log(parameter)
	updateDisplayedContent();
	// console.log(keywordOnClick+" in "+keywordContainer+" acted");
}

function onFilterResetToggleNI() {
	var element = $(this); //collapsed panel
	var elementChildren = $(this).find(".idvx-collapsed-container")[0].children; //the set of small icon
	var keywordOnClick = element.prev().attr("id");
	// console.log(keywordOnClick);

	element.prev().children(".true").toggle();

	//clean the array
	parameter.removeAll(keywordOnClick);
	// console.log("removeAll");

	if (!$(this).hasClass("in")){
		//append all icons into the array
		for(var i=0; i<elementChildren.length; i++) {
			parameter.appendToIntent($(elementChildren[i]).attr("Name").toLowerCase(), keywordOnClick);
			if(!$(elementChildren[i]).hasClass("active")){
				// $(elementChildren[i]).removeClass("active");

				//light all the icons up immediately behind hidden panel
				$(elementChildren[i]).addClass("active");
			}
		}
	} else {
		//check if all icons are lit up
		$.each(elementChildren, function(i, d) {
			if(!$(d).hasClass("active"))
				$(d).addClass("active");
		});
		// console.log("activeAll")
	} 

	updateDisplayedContent();
	// console.log(keywordOnClick+" has been reset.");
}

// 
function onVideoClick(){
	var id = $(this).attr("data-id");

	if (!itemsShortMap[id])
		return ;
	
	$(this).tooltip("hide");
	
	$(this).addClass("active");
	
	displayModalDetails(id);

}

// 点击显示详情
function onModalHidden(){
	$(".idvx-singleContainer.active").removeClass("active");
}

function displayModalDetails(id){

	// console.log('~~~~~',id,itemsMap)

	var result=$.map(itemsMap,function(item,index){
		if(item.id.toString()===id) return item 
	})

	if(result.length===0) return;
	var item = result[0]
	console.log(item)

	$("#myModal .modalContent").empty();

	$("#idvx-modalImage").html("<img class=\"idvx-modalPng\" src=\"thumbnail/" + id + ".png\" >");

	if(item.Description !="no description"){
		$("#idvx-description").html("<b>Description</b>:&nbsp;&nbsp;"  + item.Description);
	}

	$("#idvx-title").html( item.Title);

	$("#idvx-User").html("<b>User</b>:&nbsp;&nbsp;<span style='color: orange;'>" + item.User + "</span>");
	$("#idvx-Topic").html("<b>Topic</b>:&nbsp;&nbsp;<span style='color: orange;'>" +item.Topic+ "</span>");
	$("#idvx-Presentation").html("<b>Presentation</b>:&nbsp;&nbsp;<span style='color: orange;'>"+item.Presentation+ "</span>");
	$("#idvx-Goal").html("<b>Goal</b>:&nbsp;&nbsp;<span style='color: orange;'>" +item.Goal+ "</span>");
	$("#idvx-dataOrigin").html("<b>dataOrigin</b>:&nbsp;&nbsp;<span style='color: orange;'>" +item.dataOrigin+ "</span>");
	$("#idvx-Situatedness").html("<b>Situatedness</b>:&nbsp;&nbsp;<span style='color: orange;'>" +item.Situatedness+ "</span>");
	$("#idvx-representationForm").html("<b>representationForm</b>:&nbsp;&nbsp;<span style='color: orange;'>" +item.representationForm+ "</span>");

	// $("#idvx-topic").html("<b>Topic</b>:&nbsp;<span style='color: orange;'>" + item.Topic+ "</span>");
	// $("#idvx-source").html("<b>Source</b>&nbsp;" + item.Source);
	$("#idvx-Sourcelink").html("<b>Source Link </b>:&nbsp;<a href=\"" + item.Sourcelink + "\" target=\"_blank\">" + item.Sourcelink + "</a>");

	if (typeof item.Description == "string")
		{$("#idvx-Description").html("<i><b>Description:</b></i>&nbsp;&nbsp;" + '<span class="badge progress-bar-danger">'+item.Description+'</span>');}
	else
	   {var DescriptionHTML = "<i><b>Description:</b></i>&nbsp;&nbsp;";
		item.Description.forEach(element=>{DescriptionHTML+= '<span class="badge progress-bar-danger">'+element+'</span>'});
		$("#idvx-Description").html(DescriptionHTML);
	} 

	 console.log("single Modal loaded.ID:" + item.id);

	$("#myModal").modal("show");
}
