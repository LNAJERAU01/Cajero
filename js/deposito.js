(function() {
      // Before using it we must add the parse and format functions
      // Here is a sample implementation using moment.js
      validate.extend(validate.validators.datetime, {
        // The value is guaranteed not to be null or undefined but otherwise it
        // could be anything.
        parse: function(value, options) {
          return +moment.utc(value);
        },
        // Input is a unix timestamp
        format: function(value, options) {
          var format = options.dateOnly ? "YYYY-MM-DD" : "YYYY-MM-DD hh:mm:ss";
          return moment.utc(value).format(format);
        }
      });

      // These are the constraints used to validate the form
      var constraints = {
        deposito: {
			presence: {
			  message:"es requerido"
			  },
			numericality: {
				onlyInteger: false,
				greaterThan: 0,
				message: "debe ser mayor a 0",
				noStrings: true,
				divisibleBy: 5,
				message: "Solo multiplos de 5",
			}
        }
      };

      // Hook up the form so we can prevent it from being posted
      var form = document.querySelector("form#main");
      form.addEventListener("submit", function(ev) {
        ev.preventDefault();
        handleFormSubmit(form);
      });

      // Hook up the inputs to validate on the fly
      var inputs = document.querySelectorAll("input, textarea, select")
      for (var i = 0; i < inputs.length; ++i) {
        inputs.item(i).addEventListener("change", function(ev) {
          var errors = validate(form, constraints) || {};
          showErrorsForInput(this, errors[this.name])
        });
      }

      function handleFormSubmit(form, input) {
        // validate the form against the constraints
        var errors = validate(form, constraints);
        // then we update the form to reflect the results
        showErrors(form, errors || {});
        if (!errors) {
          showSuccess();
        }
      }

      // Updates the inputs with the validation errors
      function showErrors(form, errors) {
        // We loop through all the inputs and show the errors for that input
        _.each(form.querySelectorAll("input[name], select[name]"), function(input) {
          // Since the errors can be null if no errors were found we need to handle
          // that
          showErrorsForInput(input, errors && errors[input.name]);
        });
      }

      // Shows the errors for a specific input
      function showErrorsForInput(input, errors) {
        // This is the root of the input
        var formGroup = closestParent(input.parentNode, "form-group")
          // Find where the error messages will be insert into
          , messages = formGroup.querySelector(".messages");
        // First we remove any old messages and resets the classes
        resetFormGroup(formGroup);
        // If we have errors
        if (errors) {
          // we first mark the group has having errors
          formGroup.classList.add("has-error");
          // then we append all the errors
          _.each(errors, function(error) {
            addError(messages, error);
          });
        } else {
          // otherwise we simply mark it as success
          formGroup.classList.add("has-success");
        }
      }

      // Recusively finds the closest parent that has the specified class
      function closestParent(child, className) {
        if (!child || child == document) {
          return null;
        }
        if (child.classList.contains(className)) {
          return child;
        } else {
          return closestParent(child.parentNode, className);
        }
      }

      function resetFormGroup(formGroup) {
        // Remove the success and error classes
        formGroup.classList.remove("has-error");
        formGroup.classList.remove("has-success");
        // and remove any old messages
        _.each(formGroup.querySelectorAll(".help-block.error"), function(el) {
          el.parentNode.removeChild(el);
        });
      }

      // Adds the specified error with the following markup
      // <p class="help-block error">[message]</p>
      function addError(messages, error) {
        var block = document.createElement("p");
        block.classList.add("help-block");
        block.classList.add("error");
        block.innerText = error;
        messages.appendChild(block);
      }

      function showSuccess() {
        // We made it \:D/}
        swal({
		  title: "¿Desea depositar $"+parseFloat(document.getElementById("deposito").value).toFixed(2)+" ?",
		  text: "¡Una vez aceptado se procedeara con la transacción!",
		  icon: "warning",
		  buttons: true,
		  
		})
		.then((willDelete) => {
		  if (willDelete) {
			
			let today = new Date();
			let ms = Date.parse(today);
			
			let f = new Date();
			let fecha = leftZero(f.getDate()) + "/"+ leftZero(f.getMonth()+1)+ "/" +f.getFullYear();
			let hora = leftZero(f.getHours()) + ":"+ leftZero(f.getMinutes())+ ":" +leftZero(f.getSeconds());
			
			let saldo_actual = parseFloat(localStorage.getItem("saldo_inicio"));
			let valor_dep = parseFloat(document.getElementById("deposito").value);
			let resultado = saldo_actual + valor_dep;
			localStorage.setItem("saldo_inicio", resultado);
			window.parent.actualizarSaldo(parseFloat(resultado).toFixed(2));
			document.getElementById("deposito").value="";
			
			let depositos = JSON.parse(localStorage.getItem('depositos'));
			let objR = {valor_dep,fecha,hora};
			depositos.push(objR);
			localStorage.setItem('depositos', JSON.stringify(depositos));
			
			swal("¡Deposito efectuado con exito!", {
			  icon: "success",
			});
			
			swal({
			  title: "Deposito Efectuado con EXITO!!!",
			  text: "¿Desea un comprobante?",
			  icon: "success",
			  buttons: ["No",true],
			  
			})
			.then((comprobante) => {
			  if (comprobante) {
								
				let today = new Date();
				let ms = Date.parse(today);
				
				let f = new Date();
				let fecha = leftZero(f.getDate()) + "/"+ leftZero(f.getMonth()+1)+ "/" +f.getFullYear();
				let hora = leftZero(f.getHours()) + ":"+ leftZero(f.getMinutes())+ ":" +leftZero(f.getSeconds());
				
				var jsPDF = window.jspdf.jsPDF;
				var doc = new jsPDF();
				doc.addImage("img/Pokemon-Bank.jpg", "JPEG", 20, 15, 40, 23);
				doc.setFontSize(22);
				doc.text(20, 50, 'Comprobante de Desposito');
				doc.setFontSize(14);
				doc.text(20, 60, 'Valor Deposito: $'+parseFloat(valor_dep).toFixed(2));
				doc.text(20, 70, 'Fecha Transaccion: '+fecha);
				doc.text(20, 80, 'Hora Transaccion: '+hora);
				doc.text(20, 90, 'Nuevo Saldo: $'+parseFloat(resultado).toFixed(2));
				
				doc.save('TicketDeposito'+ms+'.pdf');
				
			  } 
			});
					
			
		  } else {
			swal("¡Transacción CANCELADA!",{
				icon: "error",
				dangerMode: true,
			});
		  }
		});
      }
	  function leftZero(valor){
		if(valor<10)
			return "0"+valor;
		else
			return valor;
	  }
 })();