// JavaScript Document
	/* 地图初始化 */
	var ptCenter=new BMap.Point(116.361757,39.968524);
	var map1 = new BMap.Map("mapDiv1");
	map1.centerAndZoom(ptCenter,19);
	map1.disableScrollWheelZoom();
  
	var map2 = new BMap.Map("mapDiv2"); //设置卫星图为底图
	map2.centerAndZoom(ptCenter,19);
	map2.disableScrollWheelZoom();

	var map3 = new BMap.Map("mapDiv3"); //设置卫星图为底图
	map3.centerAndZoom(ptCenter,19);
	map3.disableScrollWheelZoom();

	map1.addEventListener("moveend", function () {
				  map2.zoomTo(map1.getZoom());
    			  map2.panTo(map1.getCenter());
				  map3.zoomTo(map1.getZoom());
				  map3.panTo(map1.getCenter());
  			});
	map2.addEventListener("moveend", function () {
				  map3.zoomTo(map2.getZoom());
    			  map3.panTo(map2.getCenter());
				  map1.zoomTo(map2.getZoom());
				  map1.panTo(map2.getCenter());
  			});
	map3.addEventListener("moveend", function () {
				  map2.zoomTo(map3.getZoom());
    			  map2.panTo(map3.getCenter());
				  map1.zoomTo(map3.getZoom());
				  map1.panTo(map3.getCenter());
  			});
	
	function  signal(Longitude,Latitude,RSRP) //声明对象
     {
        this.Longitude = Longitude;
        this.Latitude= Latitude;
        this.RSRP= RSRP;
     }	
	var data1=new Array();
	var data2=new Array();
	var data3=new Array();
	function getOperatorNum()
    {
       var str=document.getElementsByName("operator");
		var operatorNum=0;
		for (i=0;i<str.length;i++)
		{
  			if(str[i].checked == true)
 		 {
   			operatorNum++;
 		 }
		}
		return operatorNum;
    }
	/*弹出框显示*/
	document.getElementById("btn").addEventListener("click", function()
	{	
		var operatorNum = getOperatorNum();
		if (operatorNum ==1||operatorNum==0){
			alert("请选择两个或两个以上运营商")
			return;
		}
		map1.clearOverlays();
		map2.clearOverlays();
		map3.clearOverlays();
		data1.push(new signal(116.36175,39.968524,-95),new signal(116.36190,39.968524,-90),new signal(116.36205,39.968524,-80),new signal(116.36220,39.968524,-82),new signal(116.36235,39.968524,-75));
		data2.push(new signal(116.36175,39.968524,-95),new signal(116.36190,39.968524,-100),new signal(116.36205,39.968524,-110),new signal(116.36220,39.968524,-100),new signal(116.36235,39.968524,-90));
		data3.push(new signal(116.36175,39.968524,-90),new signal(116.36190,39.968524,-62),new signal(116.36205,39.968524,-72),new signal(116.36220,39.968524,-80),new signal(116.36235,39.968524,-86));
		document.all.div_show.style.display="block";
		var str=document.getElementsByName("operator"); 
		 $("#opeName1,#opeName2,#opeName3").html("");
		 var str=document.getElementsByName("operator"); 
		document.all.div_show.style.display="block";
		if(operatorNum==3){
    		$("#mapDiv1,#mapDiv2,#mapDiv3").attr("class","chooseThree")	;
			$("#opeName1,#opeName2,#opeName3").attr("class","opeNameThree")	;
			$("#opeName1").append(str[0].value);
			$("#opeName2").append(str[1].value);
			$("#opeName3").append(str[2].value);
			for(var i=0;i<data1.length;i++){
				 map1.addOverlay(setLable(data1[i]));
			}	
			for(var i=0;i<data2.length;i++){
				 map2.addOverlay(setLable(data2[i]));
			}	
			for(var i=0;i<data3.length;i++){
				 map3.addOverlay(setLable(data3[i]));	
			}
			
		}
		else if (operatorNum==2){
			document.all.mapDiv3.display="none";
			$("#mapDiv1,#mapDiv2").attr("class","chooseTwo");
			$("#mapDiv3").attr("class","div2clear")	;
			$("#opeName1,#opeName2").attr("class","opeNameTwo");
			$("#opeName3").attr("class","div2clear");
			var ope="";
			for (i=0;i<str.length;i++){
  				if(str[i].checked == true){
   					ope+=str[i].value+" ";
 				}
			}
			var opename=[];
			var opename= ope.split(" ");
			$("#opeName1").append(opename[0]);
			$("#opeName2").append(opename[1]);
			switch(opename[0]){
				case "移动":
		    		for(var i=0;i<data1.length;i++){
						map1.addOverlay(setLable(data1[i]));
					}	
		    		break;
				case "联通":
		    		for(var i=0;i<data2.length;i++){
						map1.addOverlay(setLable(data2[i]));
					}	
		    		break;
			}
			switch(opename[1]){
				case "联通":
		    		for(var i=0;i<data2.length;i++){
						map2.addOverlay(setLable(data2[i]));
					}	
		    		break;
				case "电信":
		    		for(var i=0;i<data3.length;i++){
						map2.addOverlay(setLable(data3[i]));
					}	
		    		break;
			}
		} 
	});

	  
	/*给地图加标识*/
	function setLable(data){
		var length="32px";
	   var myLabel = new BMap.Label("",     //为lable填写内容
               		            {position:new BMap.Point(data.Longitude,data.Latitude)});           //label的位置
					    myLabel.setStyle({       //给label设置样式，任意的CSS都是可以的
  		    		        height:length ,                //高度
    				        width:length,                 //宽
					        opacity:"0.4",			//透明度
					        border:"0",
					        });	
							if(data.RSRP<=-105){ 
								myLabel.setStyle({background:"red", }); 
							}
							else if(data.RSRP<=-95) {   
								myLabel.setStyle({background:"#FF6600",});    
							}
							else if(data.RSRP<=-85) {   	
								myLabel.setStyle({background:"#FFFF00",});          					}
							else if(data.RSRP<=-75) {   
								myLabel.setStyle({background:"#339933",});                			}
							else if(data.RSRP<=-65) {   
								myLabel.setStyle({background:"#0099CC",});   										           					}
							else  {   
								myLabel.setStyle({background:"#006699",});                 			}
							return myLabel;
	}

	/*关闭弹出框*/
	document.getElementById("div_show_btn").addEventListener("click", function(){	 
		    document.all.div_show.style.display="none";
	   });