﻿/*** @author admin*//*	Here, we add the "onconnect" function to this worker (== to this .js file)	It's in this function that we receive messages from other threads, other workers,	asking us to do something*/onconnect = function(msg) // called when a new SharedWorker is created.{	// In a SharedWorker, we get the communication port in evt.ports[0]    var thePort = msg.ports[0];       thePort.onmessage = function(messageEvt)    {    	var sessionRef = currentSession(); // Get session.		var promoteToken = sessionRef.promoteWith("Administrator"); //temporarily make this session Admin level.	    	// The message is in the "data" member of the argument		var message = messageEvt.data;       	// The caller is supposed to have set a "what" property, to tell us what		// he wants us to do. We dispatch the message and act accordingly.		// Notice that the caller can set more properties in messageEvt.				switch(message.what) 		{			case 'requestTimeOff':			try 			{				var theRequestor = ds.User(message.requestorID);				var requestLineItems = message.requestLineItems;				var notes = message.notes;				var firstDayOff = message.firstDayOff;				var lastDayOff = message.lastDayOff;				var myManager = theRequestor.myManager;				var myManagerEmail = myManager.email;				var mail = require("waf-mail/SMTP"); //to load the module													var rec = new Array(myManagerEmail);				var messageBody = myManager.fullName + ",\n";				messageBody += " " + "\n";				messageBody += theRequestor.fullName + " has requested time off from ";				messageBody += firstDayOff + " to " + lastDayOff + "." + "\n";				messageBody += " " + "\n";				/**/				requestLineItems.forEach(function(lineItem) {					if (lineItem.compensation === "Paid Time Off") {						messageBody += lineItem.dateRequested + ": " + lineItem.compensation + "  " + lineItem.hoursRequested + "\n";					} else {						messageBody += lineItem.dateRequested + ": " + lineItem.compensation + "\n";					}				});								messageBody += " " + "\n";				messageBody += " " + "\n";				messageBody += notes;								var messageSubject = "(Test Only) PTO request from " + theRequestor.fullName;										mail.send('smtp.gmail.com', 465, true, 'wakandaPTO', 'Wakanda2013', 'wakandaPTO@gmail.com', rec, messageSubject, messageBody);			}						catch (err)			{				//debugger;				new ds.Log({					createDate: new Date(), 					message: err.message,					line: err.line,					name: err.name,					sourceID: err.sourceID,					sourceURL: err.sourceURL				}).save();			}			break;									case 'requestApproved':						try 			{				var theRequestor = ds.User(message.requestorID);				var notes = message.notes;				var status = message.status;				var requestLineItems = message.requestLineItems;				var firstDayOff = message.firstDayOff;				var lastDayOff = message.lastDayOff;				var myManager = theRequestor.myManager;				var requestorEmail = theRequestor.email;				var mail = require("waf-mail/SMTP"); //to load the module													var rec = new Array(requestorEmail);				var messageBody = theRequestor.fullName + ",\n";				messageBody += " " + "\n";				if (status === "rejected") {					messageBody += myManager.fullName + " has rejected your requested time off from ";				} else {					messageBody += myManager.fullName + " has approved your requested time off from ";				}				messageBody += firstDayOff + " to " + lastDayOff + "." + "\n";				messageBody += " " + "\n";								requestLineItems.forEach(function(lineItem) {					if (lineItem.compensation === "Paid Time Off") {						messageBody += lineItem.dateRequested + ": " + lineItem.compensation + "  " + lineItem.hoursRequested + "\n";					} else {						messageBody += lineItem.dateRequested + ": " + lineItem.compensation + "\n";					}				});												messageBody += " " + "\n";				messageBody += " " + "\n";				messageBody += notes;								if (status === "rejected") {					var messageSubject = "(Test Only) PTO Request Rejected";				} else {					var messageSubject = "(Test Only) PTO Request Approved";				}																		mail.send('smtp.gmail.com', 465, true, 'wakandaPTO', 'Wakanda2013', 'wakandaPTO@gmail.com', rec, messageSubject, messageBody);			}						catch (err)			{				//debugger;				new ds.Log({					createDate: new Date(), 					message: err.message,					line: err.line,					name: err.name,					sourceID: err.sourceID,					sourceURL: err.sourceURL				}).save();			}			break;						/*			var username = 'wakandaPTO'; // enter a valid account here			var password = 'Wakanda2012'; // enter a valid password here			var address = 'smtp.gmail.com';			var port = 465; // SSL port for gmail			*/						/*			var mail = require("waf-mail/mail"); //to load the module			var mailMessage = new mail.Mail();			mailMessage.addField('Content-Type', 'text/html'); // Specify that body is HTML formatted.			mailMessage.addField('From', username + '@gmail.com');			mailMessage.addField('To', myManager.email);			*/						//mail.addField('Content-Type', 'text/html'); // Specify that body is HTML formatted.											/*			var messageBody = "<body>";			messageBody += myManager.fullName + ",<br><br>";			messageBody += theRequestor.fullName + " has requested Paid Time Off.";			messageBody += "</body>";			*/						/*			mailMessage.addField('Subject', messageSubject); 			mailMessage.setBody(messageBody);			mailMessage.send(address , port , true, username, password);			*/															case "stop":			thePort.postMessage({responseType: "close"});			close();			break;						default:			thePort.postMessage({responseType: "default"});			break;		}				sessionRef.unPromote(promoteToken); //put the session back to normal.    }} //onconnect