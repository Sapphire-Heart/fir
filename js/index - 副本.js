window.onload=function(){
	var canvas1=document.querySelector("#canvas1");
	var canvas2=document.querySelector("#canvas2");
	var ctx1=canvas1.getContext("2d");
	var ctx2=canvas2.getContext("2d");
    var restart=document.querySelector("#restart");
	var huiqi=document.querySelector("#huiqi");
	huaqipan=function(){
		// 清除画布
		ctx1.clearRect(0,0,600,600);
		ctx2.clearRect(0,0,600,600);

		// 绘制棋盘
		for(var i=0;i<15;i++){

			// 画横向的线
			ctx1.strokeStyle="#222";
			ctx1.beginPath();
			ctx1.moveTo(20.5,20.5+i*40)
			ctx1.lineTo(580.5,20.5+i*40);
			ctx1.stroke();

			// 画纵向的线
			ctx1.strokeStyle="#222";
			ctx1.beginPath();
			ctx1.moveTo(20.5+i*40,20.5)
			ctx1.lineTo(20.5+i*40,580.5);
			ctx1.stroke();
		}
		ctx1.beginPath();	
		ctx1.arc(300,300,3,0,Math.PI*2)
		ctx1.fill();

		// 四星点坐标用到的 数组
		var z=[140.5,460.5];
		for (var i=0;i<z.length;i++){
			for(var j=0;j<z.length;j++){
				ctx1.beginPath();
				ctx1.arc(z[i],z[j],3,0,Math.PI*2)
				ctx1.fill();
			}
		}
	}
	huaqipan();
	
	// 落子
	/*var luozi=function(x,y,color){
		ctx2.save();
        ctx2.shadowOffsetX = 4;         //给棋子加阴影效果
        ctx2.shadowOffsetY = 4;
        ctx2.shadowBlur = 4;
        ctx2.shadowColor = 'rgba(0,0,0,0.4)';

  		var zx=40*x+20.5;
  		var zy=40*y+20.5;

  		var black=ctx2.createRadialGradient(zx,zy,1,zx,zy,18);
  		black.addColorStop(0.2,"#222");
        black.addColorStop(1,"#000");

        var white=ctx2.createRadialGradient(zx,zy,1,zx,zy,18);
  		white.addColorStop(0.2,"#fff");
        white.addColorStop(1,"#ddd");

        ctx2.fillStyle=color?black:white;
        ctx2.beginPath();
        ctx2.arc(zx,zy,15,0,Math.PI*2);
        ctx2.fill();

        ctx2.restore();
  	}*/
    var heizi=document.querySelector("#heizi");
  	var baizi=document.querySelector("#baizi");
  	var luozi=function(x,y,color){
  		var zx=40*x-4;
  		var zy=40*y-4;
  		if(color){
  			ctx2.drawImage(heizi,0,0,100,100,zx,zy,50,50);
  		}else{
 			ctx2.drawImage(baizi,0,0,100,100,zx,zy,50,50);
  		}
  	}

  	// 下棋
	qizi={}  // 字典  用来记录哪些位置有棋子

	// 表示谁该落子，有x属性就说明该下白棋了
	kaiguan=localStorage.x?false:true;

	canvas2.onclick=function(e){
		// console.log(e.offsetX);
		// console.log(Math.round((e.offsetX-20.5)/40));
		var x=Math.round((e.offsetX-20.5)/40);   // 四舍五入  确定点击的位置离哪个落点近
		var y=Math.round((e.offsetY-20.5)/40);
		if(qizi[x+"_"+y]){return};   // 通过字典判断  x + '_' + y  是否存在，是的话就是有子啦
		luozi(x,y,kaiguan);
		qizi[x+"_"+y]=kaiguan?"black":"white";  // 保存下的是黑子还是白子
		localStorage.data=JSON.stringify(qizi);
		if(kaiguan){
            if(panduan(x,y,'black')){
                alert('黑棋赢')
                if(confirm('再来一局？')){
                    localStorage.clear();
                    qizi = {};
                    huaqipan();
                    kaiguan = true;
                    return;
                }else{
                    canvas2.onclick = null;
                }
            }
        }else{
			if(panduan(x,y,'white')){
                alert('白棋赢')
                if(confirm('再来一局？')){
                    localStorage.clear();
                    qizi = {};
                    huaqipan();
                    kaiguan = true;
                    return;
                }else{
                    canvas2.onclick = null;
                }
            }
        }
        kaiguan = !kaiguan;
        localStorage.data = JSON.stringify(qizi);     //把对象转成字符串  存入localStorage  落子之后  localStorage.data  里边就有数据啦
        
        if(!kaiguan){       //刚下完黑棋为真
            localStorage.x = 1;       //随意给x属性一个值，主要是要有x这个属性
        }else{          //如果刚下的是白棋，就把x这个属性删掉
            localStorage.removeItem('x');
        }
        console.log(localStorage.x);
	}
	var xy2id = function(x,y){
		return x + '_' + y;
	}

	//判断输赢算法
    var panduan = function (x,y,color){
        var shuju = filter(color);
        var tx,ty,hang = 1,shu = 1,zuoxie = 1,youxie = 1;
        tx=x;ty=y;while( shuju[ xy2id( tx-1,ty ) ]){tx--;hang++};
        tx=x;ty=y;while( shuju[ xy2id( tx+1,ty ) ]){tx++;hang++};
        if(hang >= 5){return true};
        tx=x;ty=y;while( shuju[ xy2id( tx,ty-1 ) ]){ty--;shu++};
        tx=x;ty=y;while( shuju[ xy2id( tx,ty+1 ) ]){ty++;shu++};
        if(shu >= 5){return true};
        tx=x;ty=y;while( shuju[ xy2id( tx+1,ty-1 ) ]){tx++;ty--;zuoxie++};
        tx=x;ty=y;while( shuju[ xy2id( tx-1,ty+1 ) ]){tx--;ty++;zuoxie++};
        if(zuoxie >= 5){return true};
        tx=x;ty=y;while( shuju[ xy2id( tx-1,ty-1 ) ]){tx--;ty--;youxie++};
        tx=x;ty=y;while( shuju[ xy2id( tx+1,ty+1 ) ]){tx++;ty++;youxie++};
        if(youxie >= 5){return true};
    }
    var filter = function (color) {
        var r = {};
        for(var i in qizi){
            if(qizi[i] == color){
                r[i] = qizi[i];
            }
        }
        return r;
    }

	// 如果本地存储中有棋盘的数据，读取这些数据并绘制到页面中 	
	if(localStorage.data){
		qizi=JSON.parse(localStorage.data);
		for(var i in qizi){
			var x=i.split("_")[0];
			var y=i.split("_")[1];
			luozi(x,y,(qizi[i]=="black")?true:false);
			// kaiguan=!kaiguan;
		}
	}
	restart.onclick=function(){
		localStorage.clear();
        qizi = {};
        huaqipan();
        kaiguan = true;
	}

    // 悔棋
    huiqi.onclick=function(){
        huaqipan();
        var colorarr=[];
        var zuobiaoarr=[];
        data=JSON.parse(localStorage.data);
        if(JSON.stringify(data)==0){
            huiqi.onclick=null;
            return;
        }
        for(var i in data){
            zuobiaoarr.push(i);
            colorarr.push(data[i]);   
        }
        colorarr.pop();
        zuobiaoarr.pop();
        for(var i=0;i<colorarr.length;i++){
            var x=zuobiaoarr[i].split("_")[0];
            var y=zuobiaoarr[i].split("_")[1];
            luozi(x,y,(colorarr[i]=='black')?true:false);
            if(((colorarr[i]=='black')?true:false)){
                localStorage.x="1";
            }else{
                localStorage.removeItem("x");
            } 
        }
        //更新localStorage
        data={};
        for(var i=0;i<zuobiaoarr.length;i++){
            var x=zuobiaoarr[i].split("_")[0];
            var y=zuobiaoarr[i].split("_")[1];
            data[x+'_'+y]=colorarr[i];
        }
        localStorage.data=JSON.stringify(data);
        location.reload();
    }



}