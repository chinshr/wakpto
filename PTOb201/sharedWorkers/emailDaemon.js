﻿/*** @author admin*//*	Here, we add the "onconnect" function to this worker (== to this .js file)	It's in this function that we receive messages from other threads, other workers,	asking us to do something*/onconnect = function(msg) // called when a new SharedWorker is created.{	// In a SharedWorker, we get the communication port in evt.ports[0]    var thePort = msg.ports[0];       thePort.onmessage = function(messageEvt)    {    	var sessionRef = currentSession(); // Get session.		var promoteToken = sessionRef.promoteWith("Administrator"); //temporarily make this session Admin level.	    	// The message is in the "data" member of the argument		var message = messageEvt.data;       	// The caller is supposed to have set a "what" property, to tell us what		// he wants us to do. We dispatch the message and act accordingly.		// Notice that the caller can set more properties in messageEvt.				switch(message.what) 		{			case 'htmlEmailTest':			var username = 'wakandaPTO'; // enter a valid account here			var password = 'Wakanda2013';  // enter a valid password here			var address = 'smtp.gmail.com';			var port = 465;  // SSL port			var mail = require('waf-mail/mail');			var recip = "drobbins@4d.com";			 			var message = new mail.Mail();			message.setBodyType("text/html");			message.from= username + '@gmail.com';			message.to=recip;			message.subject = "Test in HTML in a single call";			message.setBody('<html><b><i>Hello San Jose in bold!</i></b><br>This is normal text.</html>'); // that's all			message.send(address, port , true, username, password);			break;						case 'requestTimeOff':			try 			{				var theRequestor = ds.User(message.requestorID);				var requestLineItems = message.requestLineItems;				var notes = message.notes;				var firstDayOff = message.firstDayOff;				var lastDayOff = message.lastDayOff;				var myManager = theRequestor.myManager;				var myManagerEmail = myManager.email;				var messageBody;								//New Mail Module...				var username = 'wakandaPTO'; // enter a valid account here				var password = 'Wakanda2013';  // enter a valid password here				var address = 'smtp.gmail.com';				var port = 465;  // SSL port				var mail = require('waf-mail/mail');				var recip = new Array(myManagerEmail);				//... new mail module end.								/*				var mail = require("waf-mail/SMTP"); //to load the module													var rec = new Array(myManagerEmail);								var messageBody = myManager.fullName + ",\n";				messageBody += " " + "\n";				messageBody += theRequestor.fullName + " has requested time off from ";				messageBody += firstDayOff + " to " + lastDayOff + "." + "\n";				messageBody += " " + "\n";								requestLineItems.forEach(function(lineItem) {					if (lineItem.compensation === "Paid Time Off") {						messageBody += lineItem.dateRequested + ": " + lineItem.compensation + "  " + lineItem.hoursRequested + "\n";					} else {						messageBody += lineItem.dateRequested + ": " + lineItem.compensation + "\n";					}				});							messageBody += " " + "\n";				messageBody += " " + "\n";				messageBody += notes;								messageBody += " " + "\n";				messageBody += " " + "\n";								messageBody += " " + "http://4dpto.cloudapp.net";								var messageSubject = "(Test Only) PTO request from " + theRequestor.fullName;					*/												//New Mail Module again...				//message body start				messageBody = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';				messageBody += '<html>';				messageBody += '<head>';				messageBody += '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />';				messageBody += '<title>PTO Request</title>';				messageBody += '<style type="text/css">';								//messageBody += 'background-color:#B0C4DE;';								messageBody += 'ul {';				messageBody += 'list-style: none;';				messageBody += '}';								messageBody += 'a {';				messageBody += 'text-decoration: none;';				messageBody += 'font-weight: bold;';				messageBody += 'color: #6699CC;';				messageBody += '}';								messageBody += '#wrapDiv {';				messageBody += 'width: 100%;';				messageBody += 'background-color:#FFFFFF;';				messageBody += 'border:1px solid #DFDFDF;';				messageBody += 'padding: 3px;';				messageBody += 'color: #202020;';				messageBody += 'font-size: 14px;';				messageBody += '}';				messageBody += '#bannerDiv {';				messageBody += 'background-color:#B0C4DE;';				messageBody += 'color: #FFFFFF;';				messageBody += 'padding: 5px 30px;';				messageBody += 'font-size:22px;';				messageBody += '}';								messageBody += '#messageDiv {';				messageBody += 'padding: 10px';				messageBody += '}';								messageBody += '#notesDiv {';				messageBody += 'background-color:#F0F8FF;';				//messageBody += 'color: #FFFFFF;';				messageBody += 'padding: 5px;';				messageBody += 'border: 1px solid gray;';				messageBody += '}';								/*				messageBody += '#banner {';				messageBody += 'float: left;';				messageBody += 'width: 100%;';				messageBody += 'list-style: none;';				messageBody += 'background-color: #6699CC;';				messageBody += 'margin: 2px;';				messageBody += '}';												messageBody += '#listLogo {';				messageBody += 'float: left;';				messageBody += 'margin: 0px;';				messageBody += 'padding: 8px 14px;';				messageBody += '}';								messageBody += '#listTitle {';				messageBody += 'float: right;';				messageBody += 'color: #FFFFFF;';				messageBody += 'font-size: 18px;';				messageBody += 'margin: 0px;';				messageBody += 'padding: 8px 14px;';				messageBody += '}';								messageBody += '#messageDiv {';				messageBody += 'clear: both;';				messageBody += '}';				*/				messageBody += '</style>';				messageBody += '</head>';								messageBody += '<body>';				messageBody += '<div id="wrapDiv">';				messageBody += '<div id="bannerDiv">';				messageBody += '<p>';				messageBody += '4D US - Paid Time Off';				messageBody += '</p>';				messageBody += '</div>';				/*				messageBody += '<ul id="banner">';				messageBody += '<li id="listLogo">';				messageBody += '<img src="http://www.4d.com/sites/default/files/common/image/_intl/newsletter/monthly/wakanda/wakanda-logo-trans.png"/>';				messageBody += '</li>';				messageBody += '<li id="listTitle">';				messageBody += '4D PTO - Powered by Wakanda';				messageBody += '</li>';				messageBody += '</ul>';				*/				messageBody += '<div id="messageDiv">';				messageBody += '<p>';				messageBody += myManager.fullName ;				messageBody += '</p>';				messageBody += '<p>';				messageBody += '<strong>';				messageBody += theRequestor.fullName;				messageBody += '</strong>';				messageBody += " has requested time off from ";				messageBody += '</strong>';				messageBody += firstDayOff + " to " + lastDayOff + ".";				messageBody += '</p>';								messageBody += '<ul>';				var lineItemText;				requestLineItems.forEach(function(lineItem) {					if (lineItem.compensation === "Paid Time Off") {						lineItemText = lineItem.dateRequested + ": " + lineItem.compensation + "  " + lineItem.hoursRequested;					} else {						lineItemText = lineItem.dateRequested + ": " + lineItem.compensation;					}										messageBody += '<li>';					messageBody += lineItemText;					messageBody += '</li>';				});				messageBody += '</ul>';												messageBody += '<div id="notesDiv">';				messageBody += "<p>";				messageBody += notes;				messageBody += "</p>";				messageBody += "</div>";				messageBody += "<p>";				messageBody += '<a href="http://4dpto.cloudapp.net">4D PTO</a>';				messageBody += "</p>";				messageBody += '</div>';								messageBody += '</div>';				messageBody += '</body>';				messageBody += '</head>';				messageBody += '</html>';				//end message body								var messageSubject = "(Test Only) PTO request from " + theRequestor.fullName;									var message = new mail.Mail();				message.setBodyType("text/html");				message.from = 'wakandaPTO@gmail.com';				message.to = recip;				message.subject = messageSubject;				message.setBody(messageBody); // that's all				message.send(address, port , true, username, password);				//... end new mail module again.																//mail.send('smtp.gmail.com', 465, true, 'wakandaPTO', 'Wakanda2013', 'wakandaPTO@gmail.com', rec, messageSubject, messageBody);			}						catch (err)			{				//debugger;				new ds.Log({					createDate: new Date(), 					message: err.message,					line: err.line,					name: err.name,					sourceID: err.sourceID,					sourceURL: err.sourceURL				}).save();			}			break;									case 'requestApproved':						try 			{				var theRequestor = ds.User(message.requestorID);				var notes = message.notes;				var status = message.status;				var requestLineItems = message.requestLineItems;				var firstDayOff = message.firstDayOff;				var lastDayOff = message.lastDayOff;				var myManager = theRequestor.myManager;				var requestorEmail = theRequestor.email;				var mail = require("waf-mail/SMTP"); //to load the module													var rec = new Array(requestorEmail);				var messageBody = theRequestor.fullName + ",\n";				messageBody += " " + "\n";				if (status === "rejected") {					messageBody += myManager.fullName + " has rejected your requested time off from ";				} else {					messageBody += myManager.fullName + " has approved your requested time off from ";				}				messageBody += firstDayOff + " to " + lastDayOff + "." + "\n";				messageBody += " " + "\n";								requestLineItems.forEach(function(lineItem) {					if (lineItem.compensation === "Paid Time Off") {						messageBody += lineItem.dateRequested + ": " + lineItem.compensation + "  " + lineItem.hoursRequested + "\n";					} else {						messageBody += lineItem.dateRequested + ": " + lineItem.compensation + "\n";					}				});												messageBody += " " + "\n";				messageBody += " " + "\n";				messageBody += notes;								messageBody += " " + "\n";				messageBody += " " + "\n";								messageBody += " " + "http://4dpto.cloudapp.net";								if (status === "rejected") {					var messageSubject = "(Test Only) PTO Request Rejected";				} else {					var messageSubject = "(Test Only) PTO Request Approved";				}																		mail.send('smtp.gmail.com', 465, true, 'wakandaPTO', 'Wakanda2013', 'wakandaPTO@gmail.com', rec, messageSubject, messageBody);			}						catch (err)			{				//debugger;				new ds.Log({					createDate: new Date(), 					message: err.message,					line: err.line,					name: err.name,					sourceID: err.sourceID,					sourceURL: err.sourceURL				}).save();			}			break;						/*			var username = 'wakandaPTO'; // enter a valid account here			var password = 'Wakanda2012'; // enter a valid password here			var address = 'smtp.gmail.com';			var port = 465; // SSL port for gmail			*/						/*			var mail = require("waf-mail/mail"); //to load the module			var mailMessage = new mail.Mail();			mailMessage.addField('Content-Type', 'text/html'); // Specify that body is HTML formatted.			mailMessage.addField('From', username + '@gmail.com');			mailMessage.addField('To', myManager.email);			*/						//mail.addField('Content-Type', 'text/html'); // Specify that body is HTML formatted.											/*			var messageBody = "<body>";			messageBody += myManager.fullName + ",<br><br>";			messageBody += theRequestor.fullName + " has requested Paid Time Off.";			messageBody += "</body>";			*/						/*			mailMessage.addField('Subject', messageSubject); 			mailMessage.setBody(messageBody);			mailMessage.send(address , port , true, username, password);			*/															case "stop":			thePort.postMessage({responseType: "close"});			close();			break;						default:			thePort.postMessage({responseType: "default"});			break;		}				sessionRef.unPromote(promoteToken); //put the session back to normal.    }} //onconnect