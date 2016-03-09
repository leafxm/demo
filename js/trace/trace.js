// JavaScript Document

	
	var map = new BMap.Map("map",{minZoom:17,maxZoom:19});          // 创建地图实例
    var pt_center = new BMap.Point(116.364506, 39.969775);
    map.centerAndZoom(pt_center,19 );             // 初始化地图，设置中心点坐标和地图级别
    map.disableScrollWheelZoom(); // 不允许滚轮缩放
	//外层时间循环相关变量
	var j=0;
    var TimeID=null;
	//内层时间循环相关变量
	 var movei=0;
     var moveTime=null;
	
	function  Bpoint(Longitude,Latitude) //声明对象
     {    
        this.Latitude= Latitude; 
		this.Longitude = Longitude;
     }
	 //要用到的数据，存放地点信息
	var lonlat=new Array();
	lonlat.push(new Bpoint(116.363419, 39.970383),new Bpoint(116.362642, 39.968984),new Bpoint(116.367057, 39.96899),new Bpoint(116.365332,39.970335),new Bpoint(116.363302, 39.969775),new Bpoint(116.365463, 39.969246));
	//要用到的数据，存放转移信息
	var data= {"N":new Array(new Array(60,30,30,0,0,0),new Array(36,24,18,42,0,0),new Array(0,0,0,120,0,0),new Array(12,0,0,0,36,72),new Array(48,24,24,24,0,0),new Array(0,0,0,120,0,0),new Array(0,0,0,96,24,0),new Array(0,0,0,24,36,60)),
		"M":new Array(new Array(new Array(0,0,0,24,0,0),new Array(0,0,0,6,0,0),new Array(0,0,0,12,0,0),new Array(0,0,0,0,0,0),new Array(0,0,0,0,0,0),new Array(0,0,0,0,0,0)),
		new Array(new Array(0,0,0,36,0,0),new Array(0,0,0,24,0,0),new Array(0,0,0,18,0,0),new Array(0,0,0,0,0,0),new Array(0,0,0,0,0,0),new Array(0,0,0,0,0,0)),
		new Array(new Array(0,0,0,0,0,0),new Array(0,0,0,0,0,0),new Array(0,0,0,0,0,0),new Array(12,0,0,0,36,72),new Array(0,0,0,0,0,0),new	Array(0,0,0,0,0,0)),
		new Array(new Array(0,0,0,0,0,0),new Array(0,0,0,0,0,0),new Array(0,0,0,0,0,0),new Array(0,0,0,0,0,0),new Array(12,24,0,0,0,0),new Array(24,0,24,24,0,0)),
		new Array(new Array(0,0,0,48,0,0),new Array(0,0,0,24,0,0),new Array(0,0,0,24,0,0),new Array(0,0,0,0,0,0),new Array(0,0,0,0,0,0),new Array(0,0,0,0,0,0)),
		new Array(new Array(0,0,0,0,0,0),new Array(0,0,0,0,0,0),new Array(0,0,0,0,0,0),new Array(0,0,0,0,24,0),new Array(0,0,0,0,0,0),new Array(0,0,0,0,0,0)),
		new Array(new Array(0,0,0,0,0,0),new Array(0,0,0,0,0,0),new Array(0,0,0,0,0,0),new Array(0,0,0,0,36,60),new Array(0,0,0,24,0,0),new Array(0,0,0,0,0,0)))};
		
	map.addEventListener("tilesloaded", function () {
		//设置点在最佳视野内
			var points=new Array();
			for (var i=0;i<lonlat.length;i++){	
			points[i]= new BMap.Point(lonlat[i].Longitude,lonlat[i].Latitude)
		}
		map.setViewport(points);	
  			});
    map.addEventListener("tilesloaded",getMove);
	function getMove(){   
	    j = 0;
		movei=0;
	    window.clearTimeout(TimeID);
		map.clearOverlays();
		window.clearTimeout(moveTime);
        map.removeEventListener("tilesloaded",getMove);
		delay();
	}
	
	
	function delay(){ 
		if(j<data.N.length) {
			//地图显示表示地点的圆点，用不同颜色表示人数不同
			map.clearOverlays();
			var length=24; 
			for (var i=0;i<lonlat.length;i++){	
				var myLabel = new BMap.Label("<p>"+data.N[j][i]+"</p>",     //为lable填写内容
               	{
					position: new BMap.Point(lonlat[i].Longitude,lonlat[i].Latitude)});           //label的位置
					myLabel.setStyle({       //给label设置样式，任意的CSS都是可以的
  		    		height:length+"px",                //高度
    				width:length+"px",                 //宽
					borderRadius:length/2+"px",
					opacity:"0.8",			//透明度
					border:"0", 
					color:"black",
					fontSize:"22px",               //字号
					textAlign:"center",            //文字水平居中显示
					lineHeight:"20px",            //行高，文字垂直居中显示
				});
				//设置人数区别
		   		var a0=30,a1=60,a2=90,a3=120;  														
				//根据信号强度不同设置不同颜色							
				if(data.N[j][i]<a0){ 
					myLabel.setStyle({background:"#ffcc00", }); 
				}
				else if(data.N[j][i]<a1) {   
					myLabel.setStyle({background:"#ff9900",});    
				}
				else if(data.N[j][i]<a2) {   	
					myLabel.setStyle({background:"#ff6600",});          					
				}
				else if(data.N[j][i]<a3) {   
					myLabel.setStyle({background:"#ff3300",});                			
				}
				else  {   
					myLabel.setStyle({background:"#ff0000",});                 			
				}
				map.addOverlay(myLabel);
				
				//偏移量	
				lon=0.00015/32*12;
				lat=0.00011/32*12;	
				//添加轨迹
				if(j<data.N.length-1){
					for(var k=0;k<6;k++){
						if(data.M[j][i][k]!=0){
						var polyline = new BMap.Polyline([
							new BMap.Point(lonlat[i].Longitude+lon, lonlat[i].Latitude-lat),new BMap.Point(lonlat[k].Longitude+lon, lonlat[k].Latitude-lat)], {strokeColor:"#FFCC00", strokeWeight:3, strokeOpacity:0.8});
							map.addOverlay(polyline);
					}
				}
			}
			}
			//设置循环，先内层表示转移的动画循环完毕后再外层表示下次聚集状况，注意时间差
			window.clearTimeout(moveTime);
			if(j<data.N.length-1){
			moveTime= window.setTimeout(function(){delayMove();}, 500);		}				
			TimeID = window.setTimeout(function(){delay();}, 5000);
        }
        else{ 
			window.clearTimeout(moveTime);
           j = 0;
           window.clearTimeout(TimeID);
         }	
    }
	
	//设置全局变量用于删除上次轨迹上的标注
	var moveMarker=new Array();
	function delayMove(){
		var movei_max=8;
		lon=0.00015/32*12;
		lat=0.00011/32*12;	
		if(movei<movei_max){
			var markerNum=0;
			for(var i=0;i<6;i++){
				for(var k=0;k<6;k++){ 
					if(data.M[j][i][k]!=0){								  
						map.removeOverlay(moveMarker[markerNum]);		
						var d_lon=(lonlat[k].Longitude-lonlat[i].Longitude)/(movei_max)*(movei+1);
						var d_lat=(lonlat[k].Latitude-lonlat[i].Latitude)/(movei_max)*(movei+1);
						var marker= new BMap.Label("<p>"+data.M[j][i][k]+"</p>",     //为lable填写内容
						{	offset:new BMap.Size(-16,-16),                  //label的偏移量，为了让label的中心显示在点上
							position:new BMap.Point(lonlat[i].Longitude+lon+d_lon,lonlat[i].Latitude-lat+d_lat)});
						marker.setStyle({                                   //给label设置样式，任意的CSS都是可以的
							fontSize:"14px",               //字号
							border:"0",                    //边
							height:"25px",                //高度
							width:"25px",                 //宽
							textAlign:"center",            //文字水平居中显示
							background:"url(img/trace/marker.png)",    //背景图片
							color:"blue",
							fontWeight:"bold",
						});
						moveMarker[markerNum]=marker;
						markerNum++;
						map.addOverlay(marker);	
					}
				}
			}
			movei++;
			moveTime= window.setTimeout(function(){delayMove();}, 500);	
		}else{
			var markerNum=0;
			for(var i=0;i<6;i++){
				for(var k=0;k<6;k++){ 
					if(data.M[j][i][k]!=0){					
						map.removeOverlay(moveMarker[markerNum]);
						markerNum++;
					}				
				}
			}
			//在内循环结束后j++
			j++;
			movei=0;
			window.clearTimeout(moveTime);
		}
	}	
	
	//暂停、开始、从头开始效果实现
	document.getElementById("stop").addEventListener("click",function(){
		var btn=document.getElementById("stop");
		if(btn.value=="暂停"){
			
			btn.value="开始";
		  	window.clearTimeout(TimeID);
			window.clearTimeout(moveTime);
		}else{
			btn.value="暂停";
			//暂停后再到delay开始的时间设置
			var delayTime=500;
			
			if(movei!=0){
				moveTime= window.setTimeout(function(){delayMove();}, 500);
				delayTime=500*(10-movei);		
			}
		if(j==(data.N.length-1)&&movei==0)	{getMove()}else{
			TimeID = window.setTimeout(function(){delay();},delayTime);	
		}
		}
	});
	document.getElementById("start").addEventListener("click",function(){	
		document.getElementById("stop").value="暂停";
	  getMove();
	}); 