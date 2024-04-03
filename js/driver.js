var COOKIE_TITLE = "videobrowser_idvx_tongji_cookie";

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

	$("#idvx-searchBar-button").on("click", onSearchC);

	$("#idvx-NDpanel").on("click", ".idvx-bottom-btn", onFilterToggleND1);
	$(".idvx-User-panelBody").on("click", ".idvx-collapsed-entry", onFilterToggleND1); //icons

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

	$("#idvx-videoContainer").on("click", ".idvx-singleContainer", onVideoClick);
	$("#myModal").on("hidden.bs.modal", onModalHidden);
}


var itemsMap = {}; 
var itemsShortMap = {};

function loadData() {
	$.getJSON("list/dataset2.json", function(data) {
		itemsMap = {};
		itemsShortMap = {};

		$.each(data, function(i, d) {

			if(!itemsShortMap[d.id])
				itemsShortMap[d.id] = {"id":d.id, "User":d.User,"Topic":d.Topic, "Presentation":d.Presentation, "Goal":d.Goal, "dataOrigin":d.dataOrigin, "Sourcelink":d.Sourcelink, "Situatedness":d.Situatedness,"representationForm":d.representationForm, "Description":d.Description }; //d is an Object

			d.png = new Image(); 
			d.png.src = "thumbnail/"+d.id+".png";

			itemsMap[i] = d;
		});

		configureTimeFilter();
		updateDisplayedContent();
	})
}

function updateDisplayedContent() {
	var container = $("#idvx-videoContainer");
	container.empty();
	$(".tooltip").remove();

	var timeRangeMin = parameter.year[0];
	var timeRangeMax = parameter.year[1];
	var NUser = parameter.User;  //object
	var NTopic = parameter.Topic;
	var consistentId = {};  

	var eligibleItems = []; //eligible array

	$.each(itemsMap, function(i, d) {
		var ID = d.id;
		if(!consistentId[ID] || consistentId[ID] != -1)
			consistentId[ID] = 1;
		else
			return ;
		
		if((d.years < timeRangeMin) || (d.years > timeRangeMax)) {
			consistentId[ID] = -1;
			return ;
		}

		if(!isRelevantToSearch(d))
			return ;


		var NPresentation = parameter.Presentation;
		var NGoal = parameter.Goal;
		var NdataOrigin = parameter.dataOrigin;
		var NSituatedness = parameter.Situatedness;
		var NrepresentationForm = parameter.representationForm;
		// console.log(d.Goal, NGoal)

		if(NUser.length>=1 && typeof(d.User)=="string" && (hasDuplicateElements(NUser,d.User.split(',')))){ ; return;}
		else if (isContained(NUser,Array(d.User))){return;}

		if(NTopic.length>=1 && typeof(d.Topic)=="string" &&  (isContained(d.Topic,NTopic) || isContained(NTopic,d.Topic))){ return;}
		else if (isContained(NTopic,Array(d.Topic))){return;}

		if(NPresentation.length>=1 && typeof(d.Presentation)=="string" && (hasDuplicateElements(NPresentation,d.Presentation.split(',')))){ return;}
		else if (isContained(NPresentation,Array(d.Presentation))){return;}

		// if(NGoal.length>=1 && typeof(d.Goal)=="string" && (isContained(NGoal,d.Goal,NGoal) || isContained(NGoal,d.Goal))){ return;}
		// else if (isContained(NGoal,Array(d.Goal))){return;}

		if (NGoal.length >= 1 && typeof(d.Goal) == "string" && hasDuplicateElements(NGoal,d.Goal.split(','))) {
			// console.log(NGoal,d.Goal.split(','))
			// console.log("符合搜索条件，直接返回");
			return;
		} else if (isContained(NGoal, Array(d.Goal))) {
			// console.log(NGoal,d.Goal.split(','))
			// console.log("NGoal 是 d.Goal 的子集，直接返回");
			return ;
		} else {
			// console.log(NGoal,d.Goal.split(','))
			// console.log("不符合搜索条件");
		}
		
		if(NdataOrigin.length>=1 && typeof(d.dataOrigin)=="string" && hasDuplicateElements(NdataOrigin,d.dataOrigin.split(','))){ return;}
		else if (isContained(NdataOrigin,Array(d.dataOrigin))){return;}

		
		if(NSituatedness.length>=1 && typeof(d.Situatedness)=="string" && hasDuplicateElements(NSituatedness,d.Situatedness.split(','))){ return;}
		// else if (isContained(NSituatedness,Array(d.Situatedness))){return;}
		else{console.log(NSituatedness,d.Situatedness.split(','))}

		if(NrepresentationForm.length>=1 && typeof(d.representationForm)=="string" && hasDuplicateElements(NrepresentationForm,d.representationForm.split(','))){ return;}
		else if (isContained(NrepresentationForm,Array(d.representationForm))){return;}

		if(eligibleItems[eligibleItems.length-1] && (eligibleItems[eligibleItems.length-1]["id"] == ID))
			return ;

		var itemInfo = {"id":d.id,"Title":d.Title, "Description":d.Description, "Classification":d.Classification, "Topic":d.Topic, "png":d.png, "Source":d.Source, "Sourcelink":d.Sourcelink};
		eligibleItems.push(itemInfo);
		//  console.log(eligibleItems)
	});
	

	if(!eligibleItems.length) {
		container.append("<p class=\"text-muted\">No eligible cases found.</p>");
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
}

function hasDuplicateElements(array1, array2) {
    return array1.some(function(item) {
        return array2.includes(item);
    });
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

function isRelevantToSearch(item) {
	var query = parameter.txt ? parameter.txt.trim() : null;

	console.log(item,query)

	if(!query || !item)
		return true;

	for(var i = 0; i < searchKeys.length; i++) {

		if((item[searchKeys[i]].toLowerCase()).indexOf(query) != -1){
			return true;
		}

	}

	return false;
}


// Configures the time filter
var timeFilterNum = [1996,2022];  //all corresponded years

function configureTimeFilter() {

	$("#left_Num").text(timeFilterNum[0]);
	$("#right_Num").text(timeFilterNum[1]);

	// Setup the slider
	$("#timeFilter").slider({
		range: true,
		min: 199600,
		max: 202220,
		values: [199600, 202220],
		slide: function(event, ui) {

			timeFilterNum[0] = parseInt(ui.values[0]/ 100);
			timeFilterNum[1] = parseInt(ui.values[1]/ 100);

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

	updateDisplayedContent();
}


// set 
function onFilterToggleND2() {
	var element = $(this);

	var keywordOnClick = element.attr("name");
	console.log(keywordOnClick)

	if (!element.hasClass("active"))
		element.children(".true").show();
	else
		element.children(".true").hide();

	if (element.hasClass("active") && ($.inArray(keywordOnClick, parameter.Topic)<0))
		parameter.Topic.push(keywordOnClick);
	else if(!element.hasClass("active") && $.inArray(keywordOnClick, parameter.Topic)>=0)
		parameter.Topic.splice($.inArray(keywordOnClick, parameter.Topic), 1);
	
	console.log(parameter)

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


	var keywordOnClick = element.attr("Name").toLowerCase();
	var keywordContainer = collapseContainer.attr("id").toLowerCase();
	if (element.hasClass("active") && ($.inArray(keywordOnClick, parameter.intent[keywordContainer])<0))
		parameter.intent[keywordContainer].push(keywordOnClick);
	else if(!element.hasClass("active") && $.inArray(keywordOnClick, parameter.intent[keywordContainer]>=0))
		parameter.intent[keywordContainer].splice($.inArray(keywordOnClick, parameter.intent[keywordContainer]), 1);
	//  console.log(parameter)
	updateDisplayedContent();
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

	$("#idvx-title").html( item.Title);

	$("#idvx-User").html("<b>User</b>:&nbsp;&nbsp;<span style='color: #b341a0;'>" + item.User + "</span>");
	$("#idvx-Topic").html("<b>Topic</b>:&nbsp;&nbsp;<span style='color: #b341a0;'>" +item.Topic+ "</span>");
	$("#idvx-Presentation").html("<b>Presentation</b>:&nbsp;&nbsp;<span style='color: #b341a0;'>"+item.Presentation+ "</span>");
	$("#idvx-Goal").html("<b>Goal</b>:&nbsp;&nbsp;<span style='color: #b341a0;'>" +item.Goal+ "</span>");
	$("#idvx-dataOrigin").html("<b>dataOrigin</b>:&nbsp;&nbsp;<span style='color: #b341a0;'>" +item.dataOrigin+ "</span>");
	$("#idvx-Situatedness").html("<b>Situatedness</b>:&nbsp;&nbsp;<span style='color: #b341a0;'>" +item.Situatedness+ "</span>");
	$("#idvx-representationForm").html("<b>representationForm</b>:&nbsp;&nbsp;<span style='color: #b341a0;'>" +item.representationForm+ "</span>");

	if (typeof item.Description == "string")
		{$("#idvx-Description").html("<b>Description:</b>&nbsp;&nbsp;" + '<span class="description">'+ item.Description +'</span>');}
	else{
		var DescriptionHTML = "<i><b>Description:</b></i>&nbsp;&nbsp;";
		item.Description.forEach(element=>{DescriptionHTML+= '<span class="description">'+element+'</span>'});
		$("#idvx-Description").html(DescriptionHTML);
	} 
	$("#idvx-Sourcelink").html("<b>Source Link </b>:&nbsp;<a href=\"" + item.Sourcelink + "\" target=\"_blank\">" + item.Sourcelink +'\n' + "</a>");

	 console.log("single Modal loaded.ID:" + item.id);

	$("#myModal").modal("show");
}
