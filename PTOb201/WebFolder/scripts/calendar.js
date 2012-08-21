
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var documentEvent = {};	// @document
// @endregion// @endlock

// eventHandlers// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		
		
		/*
		myEvents = [
			{title  : 'event1', start  : '2012-08-01'},
			 {title  : 'event2', start  : '2012-08-24'},
			 {title  : 'event3', start  : '2012-09-07'},
		];
		*/
		
		myEvents = waf.ds.RequestLineItem.getCalendarArray();
		
		// Init Full Calendar
	 	$('#calendar').fullCalendar({
        // put your options and callbacks here
        height: 650,
        //weekends: false // will hide Saturdays and Sundays
        
        
        events: myEvents
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
