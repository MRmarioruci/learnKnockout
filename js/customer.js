ko.extenders.minimumLength = function(target, min){/* To onoma aytwn twn duo parametrwn borei na einai oti theleis */
	/* Mesa sto target einai to idio to observable to opoio exeis kanei extend */
	/* Mesa sto min einai h parametros me thn opoia kaleis ton extender */
	/* Sto sygkekrimeno paradeigma einai o minimum arithmos */
	target.minLengthErrorMessage = ko.observable(null);
	target.minLengthError = ko.observable(true);

	target.subscribe(function(newVal){
		if(newVal.length > min){
			target.minLengthError(null);
			target.minLengthErrorMessage(null);
		}else{
			target.minLengthError(true);
			target.minLengthErrorMessage(`Minimum length is ${min} characters`);
		}

		if(!newVal){
			target.minLengthError(null);
			target.minLengthErrorMessage(null);
		}
	})
}
ko.extenders.isEmail = function(target, option){
	target.emailError = ko.observable(null);
	target.emailErrorMessage = ko.observable(true);

	target.subscribe(function(newVal){
		if(newVal){
			var regEx = /\S+@\S+\.\S+/;
			console.log(regEx.test(newVal));
        	if(regEx.test(newVal)){
				target.emailError(null);
				target.emailErrorMessage(null);
			}else{
				target.emailError(true);
				target.emailErrorMessage('Please provide a valid email address');
			}
		}else{
			target.emailError(null);
			target.emailErrorMessage(null);
		}
	})
}

/* ->NOTE Boreis na exeis diaforetikous extender oi opoioi kanoun diaforetika pragmata */
/* ->NOTE Boreis na exeis enan extender o opoios kanei polla pragmata mazi. Dhladh enan full validator */
/* ->NOTE Thewreitai good practice ta open-closing tags na exoun ayth thn morfh
	self.asd = function(){  <--- Ayto anoigei edw panw oxi mia grammh pio katw. Sthn sxolh mas mathainoun to aditheto alla einai lathos

	}
 */

function CustomerViewModel(){
	self = this;
	self.name = ko.observable('').extend({
		minimumLength: 10,
	});
	/* ->NOTE Ena observable borei na exei pollous extenders */
	self.email = ko.observable('').extend({
		isEmail: "Not a valid Email",
		minimumLength: 3
	});
	self.password = ko.observable('').extend({
		minimumLength: 10
	})
	self.address = ko.observable('').extend({
		minimumLength: 10
	});

	self.adMessage = ko.observable(null);
	self.adError = ko.observable(true);
	self.wipe = ko.observable('1');

	self.customersArray = ko.observableArray([
		new Customer({name: "Kostas", email: "kostas@gmail.com", password: "123456", address: "Pera Brexei 16"}),
		new Customer({name: "Farook", email: "farook@hotmail.com", password: "654321", address: "Tris lalloun 2"}),
		new Customer({name: "Leonard", email: "leonard@yahoo.gr", password: "741258", address: "Rema 7"})
	])

	self.canAdd = ko.pureComputed(function(){
		var name = self.name;
		var email = self.email;
		var password = self.password;
		var address = self.address;
		if(!name.minLengthError() && !email.minLengthError() && !password.minLengthError() && !address.minLengthError() && !email.emailError()){
			return true;
		}
		return false;
	})
	/* ------------------------------------ add a customer to the array ------------------------------------ */
	self.addCustomer = function(){
		if(!self.canAdd()) return false;

		var o = {
			name: self.name(),
			email: self.email(),
			password: self.password(),
			address: self.address()
		}
		self.customersArray.push(new Customer(o));

		self.name('');
		self.email('');
		self.password('');
		self.address('');
	};

	/* ------------------------------------ Sorted Fields ------------------------------------ */
	self.sorting = ko.observable('nameAsc');

	self.sortName = function(){
		console.log('Name Pressed');
		if(self.sorting() == 'nameAsc')
			self.sorting('nameDesc');
		else
			self.sorting('nameAsc');
	}

	self.sortEmail = function(){
		console.log('Email Pressed');
		if(self.sorting() == 'emailAsc')
			self.sorting('emailDesc');
		else
			self.sorting('emailAsc');
	}

	self.sortPassword = function(){
		console.log('Password Pressed');
		if(self.sorting() == 'passwordAsc')
			self.sorting('passwordDesc');
		else
			self.sorting('passwordAsc');
	}

	self.sortAddress = function(){
		console.log('Address Pressed');
		if(self.sorting() == 'addressAsc')
			self.sorting('addressDesc');
		else
			self.sorting('addressAsc');
	}
	/* -> Note To error htan oti arxikopoiouses to customersArray me object enw eprepe na valeis mesa Customers.
	Opote meta sto sorting merika htan observables kai merika htan aplo text */
	self.sortedTasks = ko.pureComputed(function(){
		var customersArray = self.customersArray().slice(0);
		var sorting = self.sorting();

		customersArray.sort(function(a, b){
			if(sorting == 'nameAsc'){
				return a.name().localeCompare(b.name());
			}else if(sorting == 'nameDesc'){
				return b.name().localeCompare(a.name());
			} else if(sorting == 'emailAsc') {
				return a.email().localeCompare(b.email());
			} else if(sorting == 'emailDesc') {
				return b.email().localeCompare(a.email());
			} else if(sorting == 'passwordAsc') {
				return a.password().localeCompare(b.password());
			} else if(sorting == 'passwordDesc') {
				return b.password().localeCompare(a.password());
			} else if(sorting == 'addressAsc'){
				return a.address().localeCompare(b.address());
			} else if(sorting == 'addressDesc') {
				return b.address().localeCompare(a.address());
			}
		})
		return customersArray;
	})

	/* ------------------------------------ swicht on/off pop up ------------------------------------ */
	self.isOpen = ko.observable(false);
	self.openModal = function(){
		self.isOpen(!self.isOpen());
	}
	self.modal = ko.pureComputed(function(){
		if(self.isOpen())
			return 'flex';
		else
			return 'none';
	});
}

function Customer(data){
	var customer = this;
	customer.name = ko.observable(data.name);
	customer.email = ko.observable(data.email);
	customer.password = ko.observable(data.password);
	customer.address = ko.observable(data.address);
}
const knockoutApp = document.querySelector("#knockout-customer");
ko.applyBindings(new CustomerViewModel(), knockoutApp);
