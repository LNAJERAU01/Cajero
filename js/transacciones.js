let retiros = JSON.parse(localStorage.getItem('retiros'));
let depositos = JSON.parse(localStorage.getItem('depositos'));
let pagos = JSON.parse(localStorage.getItem('pagos'));

let ul_retiros = document.getElementById("lista_retiros");
let ul_depositos = document.getElementById("lista_depositos");
let ul_pagos = document.getElementById("lista_pagos");

let total_retiros = 0;
let total_depositos = 0;
let total_pagos = 0;

retiros.forEach(
	element => {
		let li = document.createElement('li');
		li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'lh-sm');

		let div = document.createElement('div');
		let h =  document.createElement('h6');
		h.classList.add('my-0');
		h.appendChild(document.createTextNode(element.fecha));
		
		let small = document.createElement('small');
		small.classList.add("text-muted");
		small.appendChild(document.createTextNode(element.hora));

		let span = document.createElement('span');
		span.classList.add('text-muted');
		span.appendChild(document.createTextNode('- $ '+ parseFloat(element.valor_ret).toFixed(2)));
		
		total_retiros+=parseFloat(element.valor_ret).toFixed(2);
		
		div.appendChild(h);
		div.appendChild(small);
		li.appendChild(div);
		li.appendChild(span);
		
		ul_retiros.appendChild(li);
	}
);	

depositos.forEach(
	element => {
		let li = document.createElement('li');
		li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'lh-sm');

		let div = document.createElement('div');
		let h =  document.createElement('h6');
		h.classList.add('my-0');
		h.appendChild(document.createTextNode(element.fecha));
		
		let small = document.createElement('small');
		small.classList.add("text-muted");
		small.appendChild(document.createTextNode(element.hora));

		let span = document.createElement('span');
		span.classList.add('text-muted');
		span.appendChild(document.createTextNode('$ '+ parseFloat(element.valor_dep).toFixed(2)));
		
		total_depositos+=parseFloat(element.valor_dep).toFixed(2);
		
		div.appendChild(h);
		div.appendChild(small);
		li.appendChild(div);
		li.appendChild(span);
		
		ul_depositos.appendChild(li);
	}
);

pagos.forEach(
	element => {
		let li = document.createElement('li');
		li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'lh-sm');

		let div = document.createElement('div');
		let h =  document.createElement('h6');
		h.classList.add('my-0');
		h.appendChild(document.createTextNode(element.serv));
		
		let small = document.createElement('small');
		small.classList.add("text-muted");
		small.appendChild(document.createTextNode(element.fecha+" "+element.hora));

		let span = document.createElement('span');
		span.classList.add('text-muted');
		span.appendChild(document.createTextNode('- $ '+ parseFloat(element.valor_pago).toFixed(2)));
		
		total_pagos+=parseFloat(element.valor_pago).toFixed(2);

		div.appendChild(h);
		div.appendChild(small);
		li.appendChild(div);
		li.appendChild(span);
		
		ul_pagos.appendChild(li);
	}
);

const ctx = document.getElementById('myChart');

new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Deposito','Retiros','Pagos'],
      datasets: [{
	  label: 'Transacciones',
	  data: [parseFloat(total_depositos), parseFloat(total_retiros), parseFloat(total_pagos)],
	  backgroundColor: [
		  'rgb(255, 99, 132)',
		  'rgb(54, 162, 235)',
		  'rgb(255, 205, 86)'
	  ]}],
    hoverOffset: 4
    }
});
