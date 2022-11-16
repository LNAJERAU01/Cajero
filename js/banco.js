
document.getElementById("user").innerHTML=localStorage.getItem("user_inicio");
document.getElementById("account").innerHTML=localStorage.getItem("cuenta_inicio");
document.getElementById("cash").innerHTML="$"+parseFloat(localStorage.getItem("saldo_inicio")).toFixed(2);

function salir(){
	location.replace("index.html");
}

function actualizarSaldo(valor){
	document.getElementById("cash").innerHTML="$"+valor;
}

function resizeIframe() {
	let obj = document.getElementById("contenido");
	obj.style.height = (obj.contentWindow.document.body.scrollHeight+50) + 'px';
}