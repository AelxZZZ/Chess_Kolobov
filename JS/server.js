var io = require('socket.io').listen(8080);//('http://192.168.25.55:8080/');
var num = 0; //количество игроков
//var i = 1; //номер комнаты
var rooms = [{"id": [], "count": "ZERO"}];//массив комнат

io.sockets.on('connection', function (socket) {
	
	var isFreeRoom = false; //если true комната заполнена

	for (var i = 1; i < rooms.length; i++) {
	//добавляется id игрока в первую комнату, где есть один игрок
		if (rooms[i]['count'] == 1) {
			rooms[i]['count'] = 2;
			rooms[i]['id'].push(socket.id);
			isFreeRoom = true;
			break;
		}
	}

	if (isFreeRoom) {
	//комната заполнена, игра начинается
		socket.join('room' + i);
		socket.broadcast.in('room' + i).emit('start', 'white');
		socket.emit('chat', true);
		socket.emit('start', 'black');
		console.log('Игрок отправлен в комнату ' + i);
	} else {
	//добавление id игрока в пустую комнату
		rooms.push({"id": [socket.id], "count": 1});
		socket.join('room' + (rooms.length - 1));
		socket.emit('chat', true);
		console.log('Игрок отправлен в комнату ' + (rooms.length - 1));
	}

	num++;
	console.log('Игрок подключен. Кол-во игроков: '+num);

	socket.on('step', function (x,y,x1,y1) {
		console.log('Приняты координаты x: %d, y: %d, x1: %d, y1: %d', x,y,x1,y1);
		for (var i = 1; i < rooms.length; i++) {
		//пробегаем по комнатам и рассылем step сопернику, если в комнате есть совпадение по id
			if (rooms[i]['id'][0] == socket.id || rooms[i]['id'][1] == socket.id) {
				socket.broadcast.in('room' + i).emit('step',parseInt(x),parseInt(y),parseInt(x1),parseInt(y1));
				break;
			}
		}
	});

	socket.on('finish', function() {
		for (var i = 1; i < rooms.length; i++) {
		//пробегаем по комнатам и рассылем finish сопернику, если в комнате есть совпадение по id
			if (rooms[i]['id'][0] == socket.id || rooms[i]['id'][1] == socket.id) {
				socket.broadcast.in('room' + i).emit('finish');
				break;
			}
		}
	});

	socket.on('new message', function(data) {
		for (var i = 1; i < rooms.length; i++) {
		//пробегаем по комнатам и рассылем message сопернику, если в комнате есть совпадение по id
			if (rooms[i]['id'][0] == socket.id || rooms[i]['id'][1] == socket.id) {
				socket.broadcast.in('room' + i).emit('new message', data);
				break;
			}
		}
		
	});

	socket.on('disconnect', function () {
		
		for (var i = 1; i < rooms.length; i++) {
			//пробегаем по комнатам
			if (rooms[i]['id'][0] == socket.id || rooms[i]['id'][1] == socket.id) {
				console.log("Rooms: " + (rooms.length-1));//вывод сколько комнат есть(-1,так как одна шаблонная)
				console.log("i: " + i);//какая комната сейчас
				console.log("ID: " + socket.id);//id игрока от которого пришел disconect
				console.log(rooms);//вывод массива комнат
				num--;//уменьшение количества игроков
				socket.leave('room' + i);//приславший игрок покидает комнату
				rooms[i]["count"] -= 1; //уменьшение количество игроков в комнате
				if (rooms[i]["count"] == 0) {//если в комнате нет игроков
					rooms.splice(i, 1);//вырезает комнату(с "i" , второй аргумент - сколько удалять)
					return;
				}
				var temp = (rooms[i]['id'][0] == socket.id) ? 1 : 0;
				console.log(temp); //игрок который остался 0-первый, 1-второй
				io.to('room' + i).emit('disconnect');//вариант отправки сообщения в комнату
				break;
			}
		}
		
		/*if(rooms[i]['id'][0] == socket.id){
		var temp = 1;
		}else{
		vat temp = 0;
		}*/
		
		console.log('Игрок отключен. Кол-во игроков: ' + num);
	});
});