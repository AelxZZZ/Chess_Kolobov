
var blackOrWhite = true; //���� true - ����� �����, ����� ������
var isFigureSelected = false; // ������� �� ������
var figureSelected = null; // ������ � �������

//pawn - �����
//rook - �����
//khight - ����
//bitshop - ����
//queen - �����
//king - ������

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

var firstPosition = [       //�������(������) ����� (���������)
{"item": 'bRook', "type": "rook"}, {"item": 'bKnight', "type": "knight"}, {"item": 'bBitshop', "type": "bitshop"}, {"item": 'bQueen', "type": "queen"}, {"item": 'bKing', "type": "king"}, {"item": 'bBitshop', "type": "bitshop"}, {"item": 'bKnight', "type": "knight"}, {"item": 'bRook', "type": "rook"},
{"item": 'bPawn', "type": "pawn", "first": true}, {"item": 'bPawn', "type": "pawn", "first": true}, {"item": 'bPawn', "type": "pawn", "first": true}, {"item": 'bPawn', "type": "pawn", "first": true}, {"item": 'bPawn', "type": "pawn", "first": true}, {"item": 'bPawn', "type": "pawn", "first": true}, {"item": 'bPawn', "type": "pawn", "first": true}, {"item": 'bPawn', "type": "pawn", "first": true},
{}, {}, {}, {}, {}, {}, {}, {},
{}, {}, {}, {}, {}, {}, {}, {},
{}, {}, {}, {}, {}, {}, {}, {},
{}, {}, {}, {}, {}, {}, {}, {},
{"item": 'wPawn', "type": "pawn", "first": true}, {"item": 'wPawn', "type": "pawn", "first": true}, {"item": 'wPawn', "type": "pawn", "first": true}, {"item": 'wPawn', "type": "pawn", "first": true}, {"item": 'wPawn', "type": "pawn", "first": true}, {"item": 'wPawn', "type": "pawn", "first": true}, {"item": 'wPawn', "type": "pawn", "first": true}, {"item": 'wPawn', "type": "pawn", "first": true},
{"item": 'wRook', "type": "rook"}, {"item": 'wKnight', "type": "knight"}, {"item": 'wBitshop', "type": "bitshop"}, {"item": 'wQueen', "type": "queen"}, {"item": 'wKing', "type": "king"}, {"item": 'wBitshop', "type": "bitshop"}, {"item": 'wKnight', "type": "knight"}, {"item": 'wRook', "type": "rook"}
];

var currentPosition = firstPosition.slice(); // ������ �����������

function render() {       //��������� ��������� ����� � ��������� �� ��� �����
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
				}).html(imageSource); //�������� ������ � ������ �������
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
			
			tr.append(td); // ���������� ������ ��������
		}

		table.append(tr);
	}
}

var proverka = function(x,y, itemColor, color){                     //��������� ������ �� ���������� ��������� ��� ��������� �����
	if( x < 8 && x >= 0 && y < 8 && y >= 0 && itemColor != color)
	{
		return true;
	} else{
		return false;
	}
}

var pawnStep = function(x, y, color){     //��������� � ���������� ������ ��������� ����� �����
	var possibleStep = [];                //��� ������

	if (color == "black") {
	
		var item = k(x+1, y+1);
		var itemColor = $(item).children().attr("color"); //����� ��� ����, ����� �������� ���� ������ � ������ ���������� ����
		
		if (currentPosition[(y + 1)*8+x+1]["item"] != undefined &&  itemColor != color && (x+1) < 8) { //����������� ������ ���������, �������� ��
			possibleStep.push({"x": x + 1, "y": (y + 1) });
		}
		
		item = k(x-1, y+1);
		itemColor = $(item).children().attr("color"); 
		
		if (currentPosition[(y + 1)*8+x-1]["item"] != undefined &&  itemColor != color && (x-1)>=0) { //����������� ����� ���������, �������� ��
			possibleStep.push({"x": x - 1, "y": (y + 1) });
		}
		
		item = k(x, y+1);
		itemColor = $(item).children().attr("color");
		
		if (currentPosition[(y + 1)*8+x]["item"] != undefined &&  itemColor != color) { //����������� ������ ����� ������, �������� ��
			possibleStep.push({"x": x, "y": (y + 1) });
		} 
		
		// ���������� �������� �������� ���� ������
		if (currentPosition[y*8 + x]["first"]) {                      //���� ������ ���, �� ����� ������� ����� ������
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

var knightStep = function(x, y, color){
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

var kingStep = function(x, y, color){
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

var queenStep = function(x, y, color){
	
};

var bitshopStep = function (x, y, color){
	
};

var rookStep = function(x, y, color){
	
};

var stepsObject = {   //� ����������� �� ���� ����� ������ ���������� ������ ������� ���� ������
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

function changePosition(x, y, xNew, yNew) {              //����� �������
	if (canWeChangePosition(xNew, yNew)) {
		var currItem = currentPosition[y*8 + x];
		if (currItem["type"] == "pawn") {               //����� ������� ����, ����� ����� ������ ������ �� 1 ������
			currItem["first"] = false;
		}
		currentPosition[yNew*8 + xNew] = currItem;       //���������� ������ � �������
		currentPosition[y*8 + x] = {};                   //�������� �� � ������� ������� � �������
		$(".possible-step").removeClass("possible-step"); //�������� ������ ��������� ���� �� ���� ������, ������� ���
		$(".select").removeClass("select");               //�������� ������ ��������� �� ���� ������, ������� ���
		isFigureSelected = false;                       //������ ������ �� �������
		figureSelected = null;                          //���� �����
		blackOrWhite = !blackOrWhite;                    //������� ���� � ����������
		k(x, y).html("");                                //�������� �� � ������� �������
		k(xNew, yNew).html(chessImage[currItem["item"]]);//��������� ������ �� ��������� �����
	} /*else {
		// �������, ��� �� ����� �����
	}*/
}

function canWeChangePosition(x, y) {                 //�������� �� ����������� ����� �������
	if (k(x, y).hasClass('possible-step'))
		return true;
	else
		return false;
}

function showPossibleStep(elem) {
	var x = parseInt($(elem).attr('data-x')),         //��������� ��������� ������ �� �����
		y = parseInt($(elem).attr('data-y'));
	var obj = getItemObject(x, y);                    //�������� ������ � ������� ������������
	var type = obj["type"];
	var color = $(elem).children().attr('color');

	var possSteps = stepsObject[type](x, y, color);   //������������ ������ ��������� �����

	for (var i = 0; i < possSteps.length; i++) {
		var temp = possSteps[i];
		k(temp["x"], temp["y"]).addClass('possible-step');//������������� ��������� �����
	}
}

function getItemObject(x, y) {
	var elem = currentPosition[y*8 + x]
	return elem;
}

//var previousSelect = [];


$(document).ready(function(){
	render();//��������� ����� � ������

	$('td').on('click', function() {
		//console.log($(this).attr('data-x') + ' - ' + $(this).attr('data-y')); //helper
		//Selected(this);
		if(blackOrWhite)
		{
			var figureColor = $(this).children().attr('color');//���� ������
			if (figureColor == "white" || isFigureSelected) {
				//console.log(figureColor);//��������

				if (figureColor == $(figureSelected).children().attr('color')) {//���� ���������� ������ � ����� �� ������, ��� � ���������
					isFigureSelected = false;                                   //���������� ����������� ��������� �� ����� ������
					$(".possible-step").removeClass("possible-step");
					$(".select").removeClass("select");
				}

				if(isFigureSelected) //������ �������, ����� �������
				{
					var x = parseInt($(figureSelected).attr('data-x'));
					var	y = parseInt($(figureSelected).attr('data-y'));

					var xNew = parseInt($(this).attr('data-x'));
					var	yNew = parseInt($(this).attr('data-y'));
					changePosition(x, y, xNew, yNew);
				} else {
					//���� ������ �� �������, �������� � ������������ ��������� ����
					Selected(this);//�������� ������ � ������ �������
					figureSelected = $(this);
					showPossibleStep(figureSelected);
				}
			}
		} else { //��� ���� ����� ������ ��� ������
			var figureColor = $(this).children().attr('color');//���� ������
			if (figureColor == "black" || isFigureSelected) {
				//console.log(figureColor);//��������

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
					Selected(this);//�������� ������ � ������ �������
					figureSelected = $(this);
					showPossibleStep(figureSelected);
				}
			}
		}
	});
})
