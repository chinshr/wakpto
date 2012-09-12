
function ptoLogin(userName, password) {
	//Need permission to read User class for new session.
	var sessionRef = currentSession(); // Get session.
	var promoteToken = sessionRef.promoteWith("Administrator"); //temporarily make this session Admin level.
	
	debugger
	
	var myUser = ds.User({login:userName});
	if (myUser === null) {
		return false;
	} else {
		//we will handle login
		if (myUser.validatePassword(password)) {
			var theGroups = [];
			
			switch (myUser.role) {
				case "Admin":
				theGroups = ['Administrator'];
				break;

				case "Manager":
				theGroups = ['Manager'];
				break;
				
				case "Payroll":
				theGroups = ['Payroll', 'Manager'];
				break;

				default:
				theGroups = ['Employee'];
				break;
			}


			/*
			switch (myUser.accessLevel) {
				case 1:
				theGroups = ['Internal'];
				break;
		
				case 2:
				theGroups = ['Administrator'];
				break;

				case 3:
				theGroups = ['Manager'];
				break;

				case 4:
				theGroups = ['Employee'];
				break;
				
				case 5:
				theGroups = ['Payroll'];
				break;
			}
			*/
			
			
			var connectTime = new Date();
			return {
				ID: myUser.ID,
				name: myUser.login,
				fullName: myUser.fullName,
				belongsTo: theGroups,
				storage: { 	time: connectTime,
							ptoHours: myUser.ptoHours,
							floatingDays: myUser.floatingDays
				}
			}
			
		} else {
			
		return {error: 1024, errorMessage: "invalid login"};
		}
		
	}
	
	sessionRef.unPromote(promoteToken); //put the session back to normal.
} //ptoLogin

