// JavaScript Document
window.onload=function(){
		var totol=document.documentElement.clientHeight;
		var wrap=document.getElementById("wrap");
		colHeight=totol-wrap.offsetTop;
		wrap.style.height=colHeight+"px";
		
var map = new BMap.Map('map_container', {defaultCursor: 'default'});
var pt_center = new BMap.Point(116.365484,39.969626);
map.centerAndZoom(pt_center,19 );  
var top_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT});// 左上角，添加比例尺
var top_left_navigation = new BMap.NavigationControl();
map.addControl(top_left_control);  //添加控件和比例尺     
map.addControl(top_left_navigation); 
map.enableScrollWheelZoom();
	
var options = {renderOptions: {map: map, panel: "results", pageCapacity:5,  autoViewport: true,selectFirstResult: false}};
var myLocalsearch = new BMap.LocalSearch(map,options);

document.getElementById("fuzzysearch").onkeydown=function(e){
var curKey=e.which;
if (curKey==13){
document.getElementById("btn_fsearch").click();
return false;}
}

document.getElementById("longitude").onkeydown=function(e){
var curKey=e.which;
var lat=document.getElementById("latitude").value;
if (curKey==13&&lat!=""){
document.getElementById("btn_lsearch").click();
return false;}
}

document.getElementById("latitude").onkeydown=function(e){
var curKey=e.which;
var lon=document.getElementById("longitude").value;
if (curKey==13&&lon!=""){
document.getElementById("btn_lsearch").click();
return false;}
}

//智能搜索
document.getElementById("btn_fsearch").addEventListener("click", function(){
	document.getElementById("results").style.display="block";
    var fSearchValue = document.getElementById("fuzzysearch").value;
    myLocalsearch.search(fSearchValue); 
});
//洗刷地图
document.getElementById("btn_clear").addEventListener("click", function(){
	map.clearOverlays();
	myLocalsearch.clearResults();
	document.getElementById("results").style.display="none";
});

//经纬度定点
document.getElementById("btn_lsearch").addEventListener("click", function(){
	if(document.getElementById("longitude").value != "" && document.getElementById("latitude").value != ""){
		map.clearOverlays(); 
		var new_point = new BMap.Point(document.getElementById("longitude").value,document.getElementById("latitude").value);
		var marker = new BMap.Marker(new_point);  // 创建标注
		map.addOverlay(marker);              // 将标注添加到地图中
		map.panTo(new_point);      
	}
	document.getElementById("results").style.display="none";
});

//地图点击点显示经纬度等信息 
map.addEventListener('click', function(e){
	var info = new BMap.InfoWindow('', {width: 260});
	var projection = this.getMapType().getProjection();
 
	var lngLat = e.point;
	var lngLatStr = "经纬度：" + lngLat.lng + ", " + lngLat.lat;
 
	var worldCoordinate = projection.lngLatToPoint(lngLat);
	var worldCoordStr = "平面坐标：" + worldCoordinate.x + ", " + worldCoordinate.y;
 
	var pixelCoordinate = new BMap.Pixel(Math.floor(worldCoordinate.x * Math.pow(2, this.getZoom() - 18)),
	Math.floor(worldCoordinate.y * Math.pow(2, this.getZoom() - 18)));
	var pixelCoordStr = "像素坐标：" + pixelCoordinate.x + ", " + pixelCoordinate.y;

	var tileCoordinate = new BMap.Pixel(Math.floor(pixelCoordinate.x / 256),
	Math.floor(pixelCoordinate.y / 256));
	var tileCoordStr = "图块坐标：" + tileCoordinate.x + ", " + tileCoordinate.y;
 
	var viewportCoordinate = map.pointToPixel(lngLat);
	var viewportCoordStr = "可视区域坐标：" + viewportCoordinate.x + ", " +
	viewportCoordinate.y;
	var overlayCoordinate = map.pointToOverlayPixel(lngLat);
	var overlayCoordStr = "覆盖物坐标：" + overlayCoordinate.x + ", " +
	overlayCoordinate.y;
 
	 //这里只显示经纬度和像素坐标
	info.setContent(lngLatStr +pixelCoordStr);//+ worldCoordStr  + tileCoordStr +viewportCoordStr + overlayCoordStr);
	map.openInfoWindow(info, lngLat);
	//在点击的点上添加marker
	var marker = new BMap.Marker(new BMap.Point(lngLat.lng,lngLat.lat)); // 创建点
	map.addOverlay(marker);
	var opts = {
		  position : lngLat,    // 指定文本标注所在的地理位置
		  offset   : new BMap.Size(5, 5)    //设置文本偏移量
		}
	//添加label显示经纬度和像素坐标信息
	var label = new BMap.Label(lngLatStr +'</br>'+ pixelCoordStr, opts);  // 创建文本标注对象
			label.setStyle({
				 color : "black",
				 fontSize : "12px",
				// height : "20px",
				 lineHeight : "20px",
				 fontFamily:"微软雅黑"
			 });
		 
	map.addOverlay(label);  
//鼠标在label上右击去除marker和坐标信息
	label.addEventListener("rightclick", function () {
        map.removeOverlay(marker);
		map.removeOverlay(label);
		 
    });
});
}