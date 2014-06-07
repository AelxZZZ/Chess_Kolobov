$(document).ready(function(){
	socket.on('chat', function(data){
	//активация чата
		if (data) {
			$(".chat").css("display", "inline-block");
		}
		chatEnable = true;
	})

	socket.on('new message', function(data) {
	//прием сообщения и запись его в чат
		addNewMessageToTimeline('Противник: ' + data);
	});

	$(".chatForm").submit(function(event){
	//передача сообщения из поля ввода
		socket.emit('new message', $(".chatInput").val());//val получает сообщение из поля
		addNewMessageToTimeline('Я: ' + $(".chatInput").val());
		$(".chatInput").val("");//присваиваем пустую строчку, строке ввода
		event.preventDefault();//метод, для того, чтобы событие не делало, что оно делает по умолчанию
		return false;
	})

	function addNewMessageToTimeline(data) {
	//добавление сообщения в чат
		var msg = $("<div/>", {
			"text": data,
			"class": "message"
		});
		$(".timeline").append(msg);
	}
})