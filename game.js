function $(op){
	return document.querySelectorAll(op);
}
//游戏情景 0为可走，1为墙，2为地雷，3为金币
var arr=[[1,0,3,0,0,2,0,0,0,0,0,0,0,0,0,0],
		 [1,1,3,0,0,0,0,3,0,0,0,0,0,0,0,0],
		 [1,0,3,0,0,0,2,0,0,0,0,0,2,0,0,3],
		 [1,0,3,0,0,0,0,0,0,0,0,0,0,0,3,1],
		 [1,1,3,3,3,3,0,0,0,2,0,0,0,3,0,1],
		 [1,0,3,3,3,3,0,0,0,0,0,3,0,0,1,1],
		 [1,0,3,3,1,3,0,0,0,3,0,3,1,1,0,1],
		 [1,3,3,1,0,1,0,0,0,3,1,1,0,0,0,1],
		 [1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,1],
		 [1,1,2,1,1,1,2,1,1,1,1,1,1,1,1,1]];
//遍历数组，插入图片
var fragment=document.createDocumentFragment();
let countWall=0,
	countBomb=0,
	countGold=0;
let timer;
for (var j = 0; j <16 ; j++)  {
	for (var i = 0; i <10 ; i++) {
		
		switch(arr[i][j]){
			case 0:{
				// console.log('可走');
				break;
			}
			case 1:{
				//插入墙
				// console.log('不可走');
				let div_dom=document.createElement('div');
				div_dom.className="wall";
				div_dom.style.position='absolute';
				div_dom.innerHTML+='<img src="../game/game图片/wall.png">';
				$('.box')[0].appendChild(div_dom);					
				$(".box .wall")[countWall].style.left=j*50+'px';
				$(".box .wall")[countWall].style.top=i*50+'px';
				countWall++;
				break;	
			}
			case 2:{
					//插入地雷
					// console.log('地雷');
					let div_dom=document.createElement('div');
					div_dom.className="bomb";
					div_dom.style.position='absolute';
					div_dom.innerHTML+='<img src="../game/game图片/bomb.png">';
					$('.box')[0].appendChild(div_dom);	
									
					$(".box .bomb")[countBomb].style.left=j*50+'px';
					$(".box .bomb")[countBomb].style.top=i*50+'px';
					countBomb++;
					break;	
				}
			case 3:{
				//插入金币
				// console.log('金币');
				let div_dom=document.createElement('div');
				div_dom.className="gold";
				div_dom.style.position='absolute';
				div_dom.innerHTML+='<img src="../game/game图片/gold.png">';
				$('.box')[0].appendChild(div_dom);					
				$(".box .gold")[countGold].style.left=j*50+'px';
				$(".box .gold")[countGold].style.top=i*50+'px';
				countGold++;
				break;
			}
		}		
	}	
}
//插入玛丽  arr[8][1]arr[x][y]
		let mary=document.createElement('div');
		mary.className="mary";
		mary.style.position='absolute';
		mary.innerHTML+='<img src="../game/game图片/person.png">';
		$('.box')[0].appendChild(mary);
		$(".box .mary")[0].style.left=4*50+'px';
		$(".box .mary")[0].style.top=5*50+'px';
//文档碎片插入页面
// $('.box')[0].appendChild(fragment);
//玛丽的金币数
var count=0;
//函数节流的上一个时间
let _lastTime = null,
	_lastTime2 = null;
//按键的情况
		var key_pressed={},
			key;
		document.addEventListener("keyup",function(e){
			key_pressed[e&&e.keyCode]=false;
		})
		document.addEventListener("keydown",function(e){
			key_pressed[e&&e.keyCode]=true;
		});
//方向键控制	
window.onkeydown=function(event){
	var e = event || window.event || arguments.callee.caller.arguments[0];
	// var key=e && e.keyCode;
	var sumkey=0;
	for(key in key_pressed){				
		if(key_pressed[key]){
			sumkey+=Number(key);
		}
	};
	//将坐标转化为数组对应位置		
	var left_n=parseInt($(".box .mary")[0].style.left)/50;
	var top_n=parseInt($(".box .mary")[0].style.top)/50;

	// x为高度，y为宽度
	switch(sumkey){
		case 37:{
			clearTimeout(timer);
			//代表向左走后的位置	
			var x=top_n,
				y=left_n-1,
				//向左走
				step=-50;
			gold(left_n,top_n);	
			//出界条件	
			if (x>9||y<0) {
				out(x,y);
			}
			else{
				//玛丽遇到墙
				if (arr[x][y]==1) {
					$(".box .mary")[0].style.left=$(".box .mary")[0].style.left;
					$(".box .mary")[0].style.top=$(".box .mary")[0].style.top;
				}
				//玛丽遇到地雷
				else if(arr[x][y]==2){
					gameover();
					//金币总数为多少
					$('.goldcount')[0].innerHTML="金币总数为"+count;
				}
				//玛丽遇到金币
				else if (arr[top_n][left_n]==3) {
					gold(x,y);
					arr[x][y]=0;
				}
				else {
					throttle2(walk,x,y,step);
					falldown(x+1,y);
				}
			}
			break;
		}		
		case 39:{
			clearTimeout(timer);
			//xy代表向右走后的位置	
			var x=top_n,
				y=left_n+1,
				//向右走，
				step=+50;
			// gold(top_n,left_n);
			//出界条件
			if (x>9||y>15) {

				out(x,y);
			}
			else{
				//玛丽遇到金币此时可能右侧是墙，也可能能够正常走
				if (arr[top_n][left_n]==3) {
					gold(left_n,top_n);
					arr[top_n][left_n]=0;
				}
				//玛丽遇到地雷(和地雷重合时游戏结束)
				else if(arr[x][y]==2) {
					gameover();
					$('.goldcount')[0].innerHTML="金币总数为"+count;				
				}
				//玛丽遇到了墙（不动）
				else if (arr[x][y]==1) {
					$(".box .mary")[0].style.left=$(".box .mary")[0].style.left;
					$(".box .mary")[0].style.top=$(".box .mary")[0].style.top;
				}
				else{
					throttle2(walk,x,y,step);
					//右行使left_n值加一
					console.log('向右走了',x,y);
					//x需要提前判断
					falldown(x+1,y);
					// gold(left_n,top_n);
				}
			}
			break;			
		}
		case 38:{
			//代表执行上跳后的跳的最高的位置	
			var x=top_n-2,
				y=left_n,				
				step=-50;
				//出界
				if (x+1<0) {	
					$(".box .mary")[0].style.left=$(".box .mary")[0].style.left;
					$(".box .mary")[0].style.top=$(".box .mary")[0].style.top;
				}
				else{
					//玛丽遇到金币
					if (arr[top_n][left_n]==3) {	
						gold(left_n,top_n);
						arr[top_n][left_n]=0;
					}
					if (arr[top_n-1][left_n]==3) {
						gold(left_n,top_n-1);
					}	
					else if(arr[top_n-1][left_n]==2){
						gameover();
						//金币总数为多少
						$('.goldcount')[0].innerHTML="金币总数为"+count;					
					}
					throttle(jumpup,x,y,step);	
				}
			break;			
		}
		case 40:{
			// console.log('下落');
			// var x=top_n+1,
			// 	y=left_n,			
			// 	step=+50;
			// jumpdown(x,y,step);
			// clearTimeout(timer);
			// //玛丽遇到金币此时可能右侧是墙，也可能能够正常走
			// 	if (arr[top_n][left_n]==3) {					
			// 		gold(left_n,top_n);
			// 		arr[top_n][left_n]=0;
			// 	}				else if(arr[top_n+1][left_n]==2){
			// 		gameover();
			// 		//金币总数为多少
			// 		$('.goldcount')[0].innerHTML="金币总数为"+count;					
			// 	}
			break;
		}
		case 75:{
			console.log("上+左");
			//xy代表当前的位置
			var x=top_n,
				y=left_n;
			console.log("先上跳");
			throttle(jumpup,x-2,y,-50);
			console.log(left_n,top_n);
			x=top_n;
			y=left_n;
			console.log(x,y);
			console.log("再向左");
			clearTimeout(timer);
			throttle2(walk,x,y-1,-50);
			y=left_n;
			falldown(x+1,y);
			break;	 
		}
		case 77:{
			console.log("上+右");
			//xy代表当前的位置
			var x=top_n,
				y=left_n;
			
			throttle(jumpup,x-2,y,-50);
			x=top_n;
			y=left_n;
			
			throttle2(walk,x,y+1,+50);
			y=left_n;
			console.log(x,y);
			falldown(x+1,y);	
			break;
		}
	}
	//下落函数
	function falldown(x,y){
			timer = setTimeout(function(){
				console.log(x,y);
				if(x<9&&(arr[x][y]==0||arr[x][y]==2||arr[x][y]==3)){//如果可以落下
					console.log('执行了下落函数');
					
					$(".box .mary")[0].style.top=parseInt($(".box .mary")[0].style.top)+50+'px';
					gold(left_n,top_n);	
					x++;		
					top_n++;
					clearTimeout(timer);
					timer = setTimeout(arguments.callee,500);
				}
				else{
					clearTimeout(timer);
				}
			},500);
	}
	//上跳函数
	function jumpup(x,y,step){
		console.log('fffffffffffffff');
	//如果遇到了墙
		if(arr[x+1][y]==1){		
			$(".box .mary")[0].style.top=$(".box .mary")[0].style.top;
		}
		else if(arr[x][y]==1){
			$(".box .mary")[0].style.top=$(".box .mary")[0].style.top;
		}
		else{
			console.log('执行了上跳函数');
			var  formerLocation=$(".box .mary")[0].style.top;
			$(".box .mary")[0].style.top=parseInt($(".box .mary")[0].style.top)+2*step+'px';
			top_n=x;
			console.log(top_n,left_n);
			setTimeout(function(){
				// $(".box .mary")[0].style.top=formerLocation;
				falldown(x+1,y,left_n,top_n);
			},500);
			// top_n=x+2;
			console.log(top_n,left_n);

		}
	}
	//函数节流
	function throttle(fn,x,y,step){	
		let _nowTime = + new Date()
		if (_nowTime - _lastTime > 1500){
			console.log('上跳函数的节流');
			fn(x,y,step);
			_lastTime = _nowTime;
			return _lastTime;
		}
	}
	//
	function throttle2(fn,x,y,step){	
		let _nowTime = + new Date()
		if (_nowTime - _lastTime2 > 500){
			console.log('右移函数的节流');
			fn(x,y,step);
			_lastTime2 = _nowTime;
			return _lastTime2;
		}
	}

	//前进，后退函数
	function walk(x,y,step){
		//如果遇到了墙	
		if(arr[x][y]==1){
			console.log('nextwall');
			$(".box .mary")[0].style.left=$(".box .mary")[0].style.left;
		}
		else{
		//其他情况，玛丽正常向前移动
			$(".box .mary")[0].style.left=parseInt($(".box .mary")[0].style.left)+step+'px';
			left_n=left_n+(step/50);	
			return left_n;
		}
	}
	//遇见金币函数
	function gold(left_n,top_n){
			//所有的金币
	 	var gold_list=$(".box .gold"),
	 		//金币总数
	 		len_gold=$(".box .gold").length;
	 		//调用此函数时,已经吃了一个金币,总数减一,则每调用一次,总数减一
	 		len_gold--;	
	 	for (var i = 0; i < len_gold; i++) {
	 		var left_gold = parseInt(gold_list[i].style.left)/50,
	 			top_gold = parseInt(gold_list[i].style.top)/50;
	 			//定义在for循环中则每次执行循环体,都会进行重新定义		
	 		if (left_n==left_gold&&top_n==top_gold) {	
	 			//移除金币的div
	 			$('.box')[0].removeChild(gold_list[i]);
	 			arr[top_n][left_n]=0;
	 			count++;
	 		}
	 	}
	 	return count;
	 }
};
//出界
function out(x,y){
	if(x>9||y>15||x<-1||y<-1){
		console.log(out);
		$(".box .mary")[0].style.left=$(".box .mary")[0].style.left;
		$(".box .mary")[0].style.top=$(".box .mary")[0].style.top;
	}
}

function jumpdown(x,y,step){
	//如果遇到了墙
	if(arr[x][y]==1){
		$(".box .mary")[0].style.top=$(".box .mary")[0].style.top;
	}
	else{		
		$(".box .mary")[0].style.top=parseInt($(".box .mary")[0].style.top)+step+'px';
	}
}


//游戏结束
function gameover(){
 	$('.gameover')[0].style.display='block';
}
