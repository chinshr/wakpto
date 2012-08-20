
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var documentEvent = {};	// @document
// @endregion// @endlock

// eventHandlers// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		// Init Full Calendar
		 	$('#calendar').fullCalendar({
	        // put your options and callbacks here
	        height: 650
	        //weekends: false // will hide Saturdays and Sundays
	        
	        /*
	        events: [
	        	{title  : 'event1', start  : '2012-08-01'},
	        	{title  : 'event2', start  : '2012-09-05'},
	        ]
	        */
		})

	};// @lock

// @region eventManager// @startlock
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
// @endregion
};// @endlock
