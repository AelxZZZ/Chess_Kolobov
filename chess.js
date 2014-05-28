
var blackOrWhite = true; //если true - ходят белые, иначе черные
var isFigureSelected = false; // выбрана ли фигура
var figureSelected = null; // ячейка с фигурой
var blKing = false;
var whKing = false;

//pawn - пешка
//rook - ладья
//khight - конь
//bitshop - слон
//queen - ферзь
//king - король

var chessImage = {
	'bPawn' : '<img color = "black" src= "figures/brown/Brown_P.ico"/>',
	'bRook' : '<img color = "black" src= "figures/brown/Brown_R.ico"/>',
	'bKnight' : '<img color = "black" src= "figures/brown/Brown_N.ico"/>',
	'bBitshop' : '<img color = "black" src= "figures/brown/Brown_B.ico"/>',
	'bQueen' : '<img color = "black" src= "figures/brown/Brown_Q.ico"/>',
	'bKing' : '<img color = "black" src= "figures/brown/Brown_K.ico"/>',

	'wPawn' : '<img color = "white" src= "figures/light/White_P.ico" />',
	'wRook' : '<img color = "white" src= "figures/light/White_R.ico"/>',
	'wKnight' : '<img color = "white" src= "figures/light/White_N.ico"/>',
	'wBitshop' : '<img color = "white" src= "figures/light/White_B.ico"/>',
	'wQueen' : '<img color = "white" src= "figures/light/White_Q.ico"/>',
	'wKing' : '<img color = "white" src= "figures/light/White_K.ico"/>'
}

var firstPosition = [       //матрица(список) фигур (начальная)
{"item": 'bRook', "type": "rook"}, {"item": 'bKnight', "type": "knight"}, {"item": 'bBitshop', "type": "bitshop"}, {"item": 'bQueen', "type": "queen"}, {"item": 'bKing', "type": "king"}, {"item": 'bBitshop', "type": "bitshop"}, {"item": 'bKnight', "type": "knight"}, {"item": 'bRook', "type": "rook"},
{"item": 'bPawn', "type": "pawn", "first": true}, {"item": 'bPawn', "type": "pawn", "first": true}, {"item": 'bPawn', "type": "pawn", "first": true}, {"item": 'bPawn', "type": "pawn", "first": true}, {"item": 'bPawn', "type": "pawn", "first": true}, {"item": 'bPawn', "type": "pawn", "first": true}, {"item": 'bPawn', "type": "pawn", "first": true}, {"item": 'bPawn', "type": "pawn", "first": true},
{}, {}, {}, {}, {}, {}, {}, {},
{}, {}, {}, {}, {}, {}, {}, {},
{}, {}, {}, {}, {}, {}, {}, {},
{}, {}, {}, {}, {}, {}, {}, {},
{"item": 'wPawn', "type": "pawn", "first": true}, {"item": 'wPawn', "type": "pawn", "first": true}, {"item": 'wPawn', "type": "pawn", "first": true}, {"item": 'wPawn', "type": "pawn", "first": true}, {"item": 'wPawn', "type": "pawn", "first": true}, {"item": 'wPawn', "type": "pawn", "first": true}, {"item": 'wPawn', "type": "pawn", "first": true}, {"item": 'wPawn', "type": "pawn", "first": true},
{"item": 'wRook', "type": "rook"}, {"item": 'wKnight', "type": "knight"}, {"item": 'wBitshop', "type": "bitshop"}, {"item": 'wQueen', "type": "queen"}, {"item": 'wKing', "type": "king"}, {"item": 'wBitshop', "type": "bitshop"}, {"item": 'wKnight', "type": "knight"}, {"item": 'wRook', "type": "rook"}
];

var currentPosition = firstPosition.slice(); // Хитрое копирование

function render() {       //отрисовка шахматной доски и помещение на нее фигур
	var table = $("#tableChess");

	for (var i = 0; i < 8; i++) {
		var tr = $("<tr />");

		for (var j = 0; j < 8; j++) {
			var imageName = firstPosition[i * 8 + j]["item"];
			var imageSource = chessImage[imageName];

			if ((i%2 == 0 && j%2 == 0) || (i%2 == 1 && j%2 == 1)) {
				var td = $("<td />", {
					"width": "52px",
					"height": "52px",
					"bgcolor": "8B4513",
					"data-x": j,
					"data-y": i,
					"class": "cell"
				}).html(imageSource); //помещает фигуру в ячейку таблицы
			} else {
				var td = $("<td />", {
					"width": "52px",
					"height": "52px",
					"bgcolor": "F0E68C",
					"data-x": j,
					"data-y": i,
					"class": "cell"
				}).html(imageSource);
			}
			
			tr.append(td); // добавление внутрь элемента
		}

		table.append(tr);
	}
}

var proverka = function(x,y, itemColor, color){                     //проверяет фигура ли противника находится под возможным ходом
	if( x < 8 && x >= 0 && y < 8 && y >= 0 && itemColor != color)
	{
		return true;
	} else{
		return false;
	}
}

var pawnStep = function(x, y, color){     //формирует и возвращает массив возможных ходов пешки
	var possibleStep = [];                //сам массив

	if (color == "black") {
	
		var item = k(x+1, y+1);
		var itemColor = $(item).children().attr("color"); //нужен для того, чтобы получить цвет фигуры в клетке возможного хода
		
		if (currentPosition[(y + 1)*8+x+1]["item"] != undefined &&  itemColor != color && (x+1) < 8) { //проверяется правая диагональ, свободна ли
			possibleStep.push({"x": x + 1, "y": (y + 1) });
		}
		
		item = k(x-1, y+1);
		itemColor = $(item).children().attr("color"); 
		
		if (currentPosition[(y + 1)*8+x-1]["item"] != undefined &&  itemColor != color && (x-1)>=0) { //проверяется левая диагональ, свободна ли
			possibleStep.push({"x": x - 1, "y": (y + 1) });
		}
		
		item = k(x, y+1);
		itemColor = $(item).children().attr("color");
		
		if (currentPosition[(y + 1)*8+x]["item"] != undefined &&  itemColor != color) { //проверяется клетка перед пешкой, свободна ли
			possibleStep.push({"x": x, "y": (y + 1) });
		} 
		
		// добавление варианта простого хода вперед
		if (currentPosition[y*8 + x]["first"]) {                      //Если первый ход, то можно сходить через клетку
			possibleStep.push({"x": x, "y": (y + 1) });
			possibleStep.push({"x": x, "y": (y + 2) });
		} else {
			possibleStep.push({"x": x, "y": (y + 1) });
		}
	} else {
	
		var item = k(x+1, y-1);
		var itemColor = $(item).children().attr("color");
		
		if (currentPosition[(y - 1)*8+x+1]["item"] != undefined &&  itemColor != color && (x+1)<8) {
			possibleStep.push({"x": x + 1, "y": (y - 1) });
		}
		
		item = k(x-1, y-1);
		itemColor = $(item).children().attr("color");
		
		if (currentPosition[(y - 1)*8+x-1]["item"] != undefined &&  itemColor != color && (x-1)>=0) {
			possibleStep.push({"x": x - 1, "y": (y - 1) });
		} 
		
		item = k(x, y-1);
		itemColor = $(item).children().attr("color");
		
		if (currentPosition[(y - 1)*8+x]["item"] != undefined &&  itemColor != color) {
			possibleStep.push({"x": x, "y": (y - 1) });
		} 
		
		if (currentPosition[y*8 + x]["first"]) {
			possibleStep.push({"x": x, "y": (y - 1) });
			possibleStep.push({"x": x, "y": (y - 2) });
		} else {
			possibleStep.push({"x": x, "y": (y - 1) });
		}
	}

	return possibleStep;
};

var knightStep = function(x, y, color){   //формирует и возвращает массив возможных ходов коня
	var possibleStep = [];
	
	var array = [{"x": (x + 1), "y": (y - 2) }, {"x": (x - 1), "y": (y - 2) },
	{"x": (x + 1), "y": (y + 2) }, {"x": (x - 1), "y": (y + 2) }, 
	{"x": (x - 2), "y": (y + 1) }, {"x": (x - 2), "y": (y - 1) }, 
	{"x": (x + 2), "y": (y + 1) }, {"x": (x + 2), "y": (y - 1) }];
	
	var item;
		
	for (var i = 0; i < 8; i++)
	{
		item = k(array[i]["x"], array[i]["y"]);
		if( proverka(array[i]["x"], array[i]["y"], $(item).children().attr("color"), color))
		{
			possibleStep.push({"x": array[i]["x"], "y": array[i]["y"]});
		}
	}
	return possibleStep;
};

var kingStep = function(x, y, color){     //формирует и возвращает массив возможных ходов короля
	var possibleStep = [];
	
	var array = [{"x": (x + 1), "y": (y - 1) }, {"x": x, "y": (y - 1) },
	{"x": (x - 1), "y": (y - 1) }, {"x": (x - 1), "y": y }, 
	{"x": (x + 1), "y": y }, {"x": (x - 1), "y": (y + 1) }, 
	{"x": (x + 1), "y": (y + 1) }, {"x": x, "y": (y + 1) }];
	
	var item;
		
	for (var i = 0; i < 8; i++)
	{
		item = k(array[i]["x"], array[i]["y"]);
		if( proverka(array[i]["x"], array[i]["y"], $(item).children().attr("color"), color))
		{
			possibleStep.push({"x": array[i]["x"], "y": array[i]["y"]});
		}
	}
	return possibleStep;
};

var rookStep = function(x, y, color){     //формирует и возвращает массив возможных ходов ладьи
	var possibleStep = [];
	var item;
	
	for (var i = 1; (x+i) < 8; i++) // вправо
	{
		item = k((x+i), y);
		
		if (currentPosition[y*8+x+i]["item"] == undefined) 
		{                                                 //попадаем сюда, если клетка пустая
			possibleStep.push({"x": (x+i), "y": y});  
		}else{                                            //else добавляем возможный ход, если в клетке фигура противника и
			if( proverka((x+i), y, $(item).children().attr("color"), color))
			{
				possibleStep.push({"x": (x+i), "y": y});
			}
			break;                                        //выскакиваем из цикла
		}
	}
	
	for (var i = 1; (x-i) >= 0; i++) // влево
	{
		item = k((x-i), y);
		
		if (currentPosition[y*8+x-i]["item"] == undefined) 
		{
			possibleStep.push({"x": (x-i), "y": y});  
		}else{
			if( proverka((x-i), y, $(item).children().attr("color"), color))
			{
				possibleStep.push({"x": (x-i), "y": y});
			}
			break;
		}
	}
	
	for (var i = 1; (y-i) >= 0; i++) // вверх
	{
		item = k(x, (y-i));
		
		if (currentPosition[(y-i)*8+x]["item"] == undefined) 
		{
			possibleStep.push({"x": x, "y": (y-i)});  
		}else{
			if( proverka(x, (y-i), $(item).children().attr("color"), color))
			{
				possibleStep.push({"x": x, "y": (y-i)});
			}
			break;
		}
	}
	
	for (var i = 1; (y+i) < 8; i++) //вниз
	{
		item = k(x, (y+i));
		
		if (currentPosition[(y+i)*8+x]["item"] == undefined) 
		{
			possibleStep.push({"x": x, "y": (y+i)}); 
		}else{
			if( proverka(x, (y+i), $(item).children().attr("color"), color))
			{
				possibleStep.push({"x": x, "y": (y+i)});
			}
			break;
		}
	}
	
	return possibleStep;
};

var bitshopStep = function (x, y, color){ //формирует и возвращает массив возможных ходов слона
	var possibleStep = [];
	var item;
	
	for (var i = 1; (x+i) < 8 && (y-i) >=0; i++) // вправо-вверх
	{
		item = k((x+i), (y-i));
		
		if (currentPosition[(y-i)*8+(x+i)]["item"] == undefined) 
		{
			possibleStep.push({"x": (x+i), "y": (y-i)});
		}else{
			if( proverka((x+i), (y-i), $(item).children().attr("color"), color))
			{
				possibleStep.push({"x": (x+i), "y": (y-i)});
			}
			break;
		}
	}
	
	for (var i = 1; (x-i) >= 0 && (y-i) >=0; i++) // влево-вверх
	{
		item = k((x-i), (y-i));
		
		if (currentPosition[(y-i)*8+(x-i)]["item"] == undefined) 
		{
			possibleStep.push({"x": (x-i), "y": (y-i)});
		}else{
			if( proverka((x-i), (y-i), $(item).children().attr("color"), color))
			{
				possibleStep.push({"x": (x-i), "y": (y-i)});
			}
			break;
		}
	}
	
	for (var i = 1; (x+i) < 8 && (y+i) < 8; i++) // вправо-вниз
	{
		item = k((x+i), (y+i));
		
		if (currentPosition[(y+i)*8+(x+i)]["item"] == undefined) 
		{
			possibleStep.push({"x": (x+i), "y": (y+i)});
		}else{
			if( proverka((x+i), (y+i), $(item).children().attr("color"), color))
			{
				possibleStep.push({"x": (x+i), "y": (y+i)});
			}
			break;
		}
	}
	
	for (var i = 1; (x-i) >= 0 && (y+i) < 8; i++) //влево-вниз
	{
		item = k((x-i), (y+i));
		
		if (currentPosition[(y+i)*8+(x-i)]["item"] == undefined) 
		{
			possibleStep.push({"x": (x-i), "y": (y+i)});
		}else{
			if( proverka((x-i), (y+i), $(item).children().attr("color"), color))
			{
				possibleStep.push({"x": (x-i), "y": (y+i)});
			}
			break;
		}
	}
	
	return possibleStep;
};

var queenStep = function(x, y, color){    //формирует и возвращает массив возможных ходов дамы
	var possibleStep = [];
	
	possibleStep = rookStep(x, y, color);// дама ходит как ладья
	
	var array = bitshopStep(x, y, color); // как слон
	var i = 0;
		
	while (array[i])                     //добавление ходов слона в общий массив ходов
	{
		possibleStep.push({"x": array[i]["x"], "y": array[i]["y"]});
		i++;
	}
	
	return possibleStep;
};

var stepsObject = {   //в зависимости от того какая фигура, вызывается нужная функция хода фигуры
	"pawn": pawnStep,
	"queen": queenStep,
	"knight": knightStep,
	"bitshop": bitshopStep,
	"rook": rookStep,
	"king": kingStep
};

function k(x ,y) {
   return $('tr').eq(y).children().eq(x);
}

function Selected (tmp) 
{
	$(tmp).addClass('select');
	isFigureSelected = true;
}

/*function Mat (x, y) //может ли двигаться фигура
{
	var item = k(x, y);                              
	var color = $(item).children().attr("color");
	var obj = getItemObject(x, y);                    //получает фигуру с данными координатами
	var type = obj["type"];                           //тип фигуры

	var futureSteps = stepsObject[type](x, y, color);
	if (futureSteps.length == 0)
	{
		return true;
	}else{
		return false;
	}
}*/

function Shah (x, y)
{
	var item = k(x, y);                              
	var color = $(item).children().attr("color");
	var obj = getItemObject(x, y);                    //получает фигуру с данными координатами
	var type = obj["type"];                           //тип фигуры

	var futureSteps = stepsObject[type](x, y, color); //массив возможных ходов фигуры
	for (var i=0; i < futureSteps.length; i++) //пробегаем по массиву
	{
		var curX = futureSteps[i]["x"];
		var curY = futureSteps[i]["y"];
		var curItem = k(curX, curY);
		var curColor = $(curItem).children().attr("color");
		
		if (color != curColor && currentPosition[curY*8+curX]["type"] == "king") //проверяем, находится ли король под ударом текущей фигуры в след ходе
		{

			/*if(Mat(curX, curY))
			{
				alert("Shah i mat!!!")
			}else{
				alert("Shah!")
			}*/
			alert("Shah!");   //если да, то Шах
		}
	}
}

function changePosition(x, y, xNew, yNew) {              //смена позиции
	if (canWeChangePosition(xNew, yNew)) {
		var currItem = currentPosition[y*8 + x];
		if (currItem["type"] == "pawn") {               //после первого хода, пешка может ходить только на 1 клетку
			currItem["first"] = false;
		}
		if (currItem["item"] == "bPawn") { 
			currItem["item"] == "bQueen"
		}
		currentPosition[yNew*8 + xNew] = currItem;       //переставка фигуры в матрице
		currentPosition[y*8 + x] = {};                   //стиранее ее с прошлой позиции в матрице
		$(".possible-step").removeClass("possible-step"); //удаление класса возможные ходы со всех клеток, имевших его
		$(".select").removeClass("select");               //удаление класса выбранных со всех клеток, имевших его
		isFigureSelected = false;                       //фигура больше не выбрана
		figureSelected = null;                          //тоже самое
		blackOrWhite = !blackOrWhite;                    //переход хода к противнику
		
		k(x, y).html("");						//стиранее ее с прошлой позиции
		if (currItem["item"] == "bPawn" && yNew == 7) {   //если черная пешка дошла до конца поля, становиться дамой
			currItem["item"] = "bQueen";
			currItem["type"] = "queen";
		}
		if (currItem["item"] == "wPawn" && yNew == 0) {   //если белая пешка дошла до конца поля, становиться дамой
			currItem["item"] = "wQueen";
			currItem["type"] = "queen";
		}
		k(xNew, yNew).html(chessImage[currItem["item"]]);//отрисовка фигуры на шахматной доске
		
		Shah(xNew, yNew); //проверка на шах
	} else {
		alert("Wrong step!");
	}
	
}

function canWeChangePosition(x, y) {                 //проверка на возможность смены позиции
	if (k(x, y).hasClass('possible-step'))
		return true;
	else
		return false;
}

function showPossibleStep(elem) {
	var x = parseInt($(elem).attr('data-x')),         //получение координат клетки на доске
		y = parseInt($(elem).attr('data-y'));
	var obj = getItemObject(x, y);                    //получает фигуру с данными координатами
	var type = obj["type"];
	var color = $(elem).children().attr('color');

	var possSteps = stepsObject[type](x, y, color);   //возвращается массив возможных ходов

	for (var i = 0; i < possSteps.length; i++) {
		var temp = possSteps[i];
		k(temp["x"], temp["y"]).addClass('possible-step');//подсвечивание возможных ходов
	}
}

function getItemObject(x, y) {
	var elem = currentPosition[y*8 + x]
	return elem;
}

//var previousSelect = [];


$(document).ready(function(){
	render();//отрисовка доски и шахмат

	$('td').on('click', function() {
		//console.log($(this).attr('data-x') + ' - ' + $(this).attr('data-y')); //helper
		//Selected(this);
		blKing = false; //Флаги, есть ли короли на поле черный
		whKing = false; //                              белый
		
		if(blackOrWhite)
		{
			var figureColor = $(this).children().attr('color');//цвет фигуры
			if (figureColor == "white" || isFigureSelected) {
				//console.log(figureColor);//проверка

				if (figureColor == $(figureSelected).children().attr('color')) {//если выбирается фигура с таким же цветом, что и выбранная
					isFigureSelected = false;                                   //происходит сбрасывание выбранной до этого фигуры
					$(".possible-step").removeClass("possible-step");
					$(".select").removeClass("select");
				}

				if(isFigureSelected) //фигура выбрана, смена позиции
				{
					var x = parseInt($(figureSelected).attr('data-x'));
					var	y = parseInt($(figureSelected).attr('data-y'));

					var xNew = parseInt($(this).attr('data-x'));
					var	yNew = parseInt($(this).attr('data-y'));
					changePosition(x, y, xNew, yNew);
				} else {
					//если фигура не выбрана, выбираем и подсвечиваем возможные ходы
					Selected(this);//выделяем ячейку и фигура выбрана
					figureSelected = $(this);
					showPossibleStep(figureSelected);
				}
			}
		} else { //тут тоже самое только для черных
			var figureColor = $(this).children().attr('color');//цвет фигуры
			if (figureColor == "black" || isFigureSelected) {
				//console.log(figureColor);//проверка

				if (figureColor == $(figureSelected).children().attr('color')) {
					isFigureSelected = false;
					$(".possible-step").removeClass("possible-step");
					$(".select").removeClass("select");
				}

				if(isFigureSelected)
				{
					var x = parseInt($(figureSelected).attr('data-x')),
						y = parseInt($(figureSelected).attr('data-y'));

					var xNew = parseInt($(this).attr('data-x'));
						yNew = parseInt($(this).attr('data-y'));
					changePosition(x, y, xNew, yNew);
				} else {
					Selected(this);//выделяем ячейку и фигура выбрана
					figureSelected = $(this);
					showPossibleStep(figureSelected);
				}
			}
		}
		
		//проверка на конец игры
		for (var i=0; i < currentPosition.length; i++) //если присутствоет король флаг поднимется
		{
			if (currentPosition[i]["item"] == "bKing")
			{
				blKing = true;
			}
			if (currentPosition[i]["item"] == "wKing")
			{
				whKing = true;
			}
		}
		
		if(blKing == false)
		{
			alert("White won! Game end.");
			ExitReload();
		}
		
		if(whKing == false)
		{
			alert("Black won! Game end");
			ExitReload();
		}
		
		function ExitReload()  //функция перезагрузки страницы или ее закрытия послы сыгранной игры
		{
			if (confirm("Do you want to play again?"))
			{
				window.location.reload();
			} else {
				window.close();
			}
		}
	});
})
