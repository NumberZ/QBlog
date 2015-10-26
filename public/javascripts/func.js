function regFunc() {
	var xmlhttp;
	if(window.xmlhttpRequest){
		xmlhttp = new XMLHttpRequest;
	}else {
		xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
	}
	xmlhttp.onreadystatechange = function() {
		if(xmlhttp.readyState == 4 && xmlhttp.status == 200){

		}
	}
	xmlhttp.open("POST",'/reg',true);
	xmlhttp.send();
}