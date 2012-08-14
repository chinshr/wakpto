﻿/*** @author admin*/function ptoLogin(userName, password) {	console.log("User Name: " + userName + " " + "Password: " + password);	//Need permission to read User class for new session.	var sessionRef = currentSession(); // Get session.	var promoteToken = sessionRef.promoteWith("Administrator"); //temporarily make this session Admin level.		var myUser = ds.User({login:userName});	if (myUser === null) {		return false;	} else {		//we will handle login		if (myUser.validatePassword(password)) {			var theGroups = [];			switch (myUser.accessLevel) {				case 1:				theGroups = ['Internal'];				break;						case 2:				theGroups = ['Administrator'];				break;				case 3:				theGroups = ['Manager'];				break;				case 4:				theGroups = ['Employee'];				break;								case 5:				theGroups = ['Payroll'];				break;			}						var connectTime = new Date();			return {				ID: myUser.ID,				name: myUser.login,				fullName: myUser.fullName,				belongsTo: theGroups,				storage: { 	time: connectTime,							ptoHours: myUser.ptoHours,							floatingDays: myUser.floatingDays				}			}					} else {					return {error: 1024, errorMessage: "invalid login"};		}			}		sessionRef.unPromote(promoteToken); //put the session back to normal.} //ptoLoginfunction daysOffRequested(firstDayOff, lastDayOff) {	var myDayPointer = firstDayOff;	var myLastDay = lastDayOff;	var oneDay = 24*60*60*1000;	var daysRequested = Math.round(Math.abs((firstDayOff.getTime() - lastDayOff.getTime())/(oneDay)));	daysRequested += 1;	//Now take out Weekends and Holidays.	while (myDayPointer <= myLastDay) { // Loop thru the requested days off.		theDayNumber = myDayPointer.getDay();		if ((theDayNumber == 0) || (theDayNumber == 6) || (is4DHoliday(myDayPointer))) {				 	//This day is weekend or holiday.		 	daysRequested -= 1;		}		myDayPointer.setDate(myDayPointer.getDate()+1); // Go to next requested day off.	}//while (myDayPointer <= myLastDay)		return daysRequested;}function monthDiff(d1, d2) {	var months;	months = (d2.getFullYear() - d1.getFullYear()) * 12;	months -= d1.getMonth() + 1;	months += d2.getMonth();	return months;}//Get the elapsed pay periods for the user.function elapsedPayPeriods(userEntity) {	var seedPTOHours = userEntity.ptoHours;	var seedPTOAccrualRate= userEntity.ptoAccrualRate;	var seedPTODate = userEntity.ptoSeedDate;		if ((seedPTOHours !== null) && (seedPTOAccrualRate !== null) && (seedPTODate !== null)) {		var seedDay = seedPTODate.getDate();		var todaysDate = new Date();		var mm = todaysDate.getMonth()+1; //January is 0!		var yyyy = todaysDate.getFullYear();		var dd = todaysDate.getDate();		var numberOfPayPeriodsElapsed = monthDiff(seedPTODate, todaysDate) * 2;		if (seedDay < 15) {			numberOfPayPeriodsElapsed += 2;		} else {			numberOfPayPeriodsElapsed += 1;		}		if (dd > 14) {			numberOfPayPeriodsElapsed += 1;			} 	} else {		numberOfPayPeriodsElapsed = 0;	}			return numberOfPayPeriodsElapsed;	}/**/function isThisDayAlreadyRequested(dateRequested, userEntity) {	var dayAlreadyRequested = false;	//var userPTOs = ds.PTO_Request.query("requestorUUID = :1", userEntity.userUUID);	var userPTOs = userEntity.pTO_RequestCollection; //Load this user's PTOs.	var userRequestLineItems = userPTOs.requestLineItemCollection; // Load users line items.	var result = userRequestLineItems.query("dateRequested = :1", dateRequested);	if (result.length > 0) {dayAlreadyRequested = true;}		return dayAlreadyRequested;}//Has the user already requested one of these days off?function duplicatePTORequest(ptoEntity, userEntity) {	var duplicate = false;	var myDayPointer = ptoEntity.firstDayOff;	var myLastDay = ptoEntity.lastDayOff;		if (myLastDay != null) {		while (myDayPointer <= myLastDay) { // Loop thru the requested days off.			if (isThisDayAlreadyRequested(myDayPointer, userEntity)) {duplicate = true;}			myDayPointer.setDate(myDayPointer.getDate()+1); // Go to next requested day off.		} //while (myDayPointer <= myLastDay) 	} else {		if (isThisDayAlreadyRequested(myDayPointer, userEntity)) {duplicate = true;}	}//if (myLastDay != null)		return duplicate;}function getCompensationMethod(userEntity) {	var compensationMethod;	 	if (userEntity.floatingDays >0) {		compensationMethod = "Floating Day";	} else {		compensationMethod = "Paid Time Off";	}		return compensationMethod;}function updateUserAcccount(userEntity, compensationMethod, hours) {	var sessionRef = currentSession(); // Get session.	var promoteToken = sessionRef.promoteWith("Administrator"); //temporarily make this session Admin level.	if (compensationMethod == "Floating Day") {		userEntity.floatingDays -= 1;	} else {		var numberOfElapsedPayPeriods = elapsedPayPeriods(userEntity);		var currentDate = new Date();		userEntity.ptoSeedDate = currentDate;		currentPTOHours = userEntity.ptoHours + (numberOfElapsedPayPeriods * userEntity.ptoAccrualRate);		//currentPTOHours -= 8; 		currentPTOHours -= hours;		userEntity.ptoHours = currentPTOHours;	}		userEntity.save();	sessionRef.unPromote(promoteToken); //put the session back to normal.}function addPTOLineItem(ptoEntity, userEntity, myDayPointer) { 	var compMethod = getCompensationMethod(userEntity); 	if (compMethod == "Floating Day") {var hours = 0;}  	else { 		if (userEntity.ptoHours >= 8) 			var hours = 8; 		else var hours = userEntity.ptoHours; 	} 	new ds.RequestLineItem({ 		dateRequested: myDayPointer,		hoursRequested: hours,		compensation: compMethod,		ptoRequest: ptoEntity	}).save();		updateUserAcccount(userEntity, compMethod, hours);}function isThisDayAlreadyRequested(dateRequested, userEntity) {	var dayAlreadyRequested = false;	//var userPTOs = ds.PTO_Request.query("requestorUUID = :1", userEntity.userUUID);	var userPTOs = userEntity.pTO_RequestCollection; //Load this user's PTOs.	var userRequestLineItems = userPTOs.requestLineItemCollection; // Load users line items.	var result = userRequestLineItems.query("dateRequested = :1", dateRequested);	if (result.length > 0) {dayAlreadyRequested = true;}		return dayAlreadyRequested;}//Has the user already requested one of these days off?function duplicatePTORequest(ptoEntity, userEntity) {	var duplicate = false;	var myDayPointer = ptoEntity.firstDayOff;	var myLastDay = ptoEntity.lastDayOff;		if (myLastDay != null) {		while (myDayPointer <= myLastDay) { // Loop thru the requested days off.			if (isThisDayAlreadyRequested(myDayPointer, userEntity)) {duplicate = true;}			myDayPointer.setDate(myDayPointer.getDate()+1); // Go to next requested day off.		} //while (myDayPointer <= myLastDay) 	} else {		if (isThisDayAlreadyRequested(myDayPointer, userEntity)) {duplicate = true;}	}//if (myLastDay != null)		return duplicate;}var dates = {    convert:function(d) {        // Converts the date in d to a date-object. The input can be:        //   a date object: returned without modification        //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.        //   a number     : Interpreted as number of milliseconds        //                  since 1 Jan 1970 (a timestamp)         //   a string     : Any format supported by the javascript engine, like        //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.        //  an object     : Interpreted as an object with year, month and date        //                  attributes.  **NOTE** month is 0-11.        return (            d.constructor === Date ? d :            d.constructor === Array ? new Date(d[0],d[1],d[2]) :            d.constructor === Number ? new Date(d) :            d.constructor === String ? new Date(d) :            typeof d === "object" ? new Date(d.year,d.month,d.date) :            NaN        );    },    compare:function(a,b) {        // Compare two dates (could be of any type supported by the convert        // function above) and returns:        //  -1 : if a < b        //   0 : if a = b        //   1 : if a > b        // NaN : if a or b is an illegal date        // NOTE: The code inside isFinite does an assignment (=).        return (            isFinite(a=this.convert(a).valueOf()) &&            isFinite(b=this.convert(b).valueOf()) ?            (a>b)-(a<b) :            NaN        );    },    inRange:function(d,start,end) {        // Checks if date in d is between dates in start and end.        // Returns a boolean or NaN:        //    true  : if d is between start and end (inclusive)        //    false : if d is before start or after end        //    NaN   : if one or more of the dates is illegal.        // NOTE: The code inside isFinite does an assignment (=).       return (            isFinite(d=this.convert(d).valueOf()) &&            isFinite(start=this.convert(start).valueOf()) &&            isFinite(end=this.convert(end).valueOf()) ?            start <= d && d <= end :            NaN        );    }};function formatDate(dateObject) {	var curr_date = dateObject.getDate();	var curr_month = dateObject.getMonth();	curr_month++;	var curr_year = dateObject.getFullYear();	return curr_month + "/" + curr_date + "/" + curr_year;}function is4DHoliday(theDay) {	var currentDayIsA4DHoliday = false;	var the4DHolidays = ds.Holiday.all();	var numberOf4DHolidays = the4DHolidays.length;	for (var i = 0; i < numberOf4DHolidays; i++) {		var thisHoliday = the4DHolidays[i].date;				DaysDiff = Math.floor((theDay.getTime() - thisHoliday.getTime())/(1000*60*60*24));		if (DaysDiff === 0) {		//vacationDateCompare = dates.compare(theDay, thisHoliday);		//if (vacationDateCompare === 0) {		//if (theDay.getTime() === thisHoliday.getTime()) {			currentDayIsA4DHoliday = true;		} 	} //for (var i = 0; i < numberOf4DHolidays; i++)	return currentDayIsA4DHoliday;}