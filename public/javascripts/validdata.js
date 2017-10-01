var validdata = {
	username: function(message) {
		if ("" == message) return "Can not be empty";
		else if (message.length < 6) return "Not less than 6";
		else if (message.length > 18) return "Not more than 18";
		else if (!/^[a-z]/i.test(message)) return "Must begin with an English letter";
		else if (!/^\w*$/.test(message)) return "Can only be English letters, numbers or underscores";
		else return "ok";
	},
	email: function(message) {
		if ("" == message) return "Can not be empty";
		else if (!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(message)) return "E-mail format invalid";
		else return "ok";
	},
	password: function(message) {
		if ("" == message) return "不能为空";
		else if (message.length < 6 || message.length > 12) return "Password is 6-12";
		else if (!/^[a-z0-9_\-]*$/i.test(message)) return "The password has a number, uppercase and lowercase letters, underlined, in the crossed"
		else {
			_password = message;
			return "ok";
		}
	},
	repassword: function(message) {
		if ("" == message) return "Can not be empty";
		else return _password == message ? "ok" : "Two passwords are not consistent";
	},
	nikiname: function(message) {
		if ("" == message) return "Can not be empty";
		else return /^\w*$/.test(message) ? "ok" : "Can only be English letters, numbers or underlined";
	}
};


var _password;


if (typeof module == 'object') {
	module.exports = validdata;
}