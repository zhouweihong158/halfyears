function Vec (x, y) {
	this.x = x;
	this.y = y;
}
Vec.distance = function (v1, v2) {
	var dx = v2.x - v1.x,
		dy = v2.y - v1.y;		
	return Math.sqrt(dx * dx + dy * dy);
};

Vec.add = function (v1, v2) {
	return new Vec(v1.x + v2.x, v1.y + v2.y);
};

Vec.substract = function (v1, v2) {
	return new Vec(v2.x - v1.x, v2.y - v1.y);
};

Vec.dot = function (v1, v2) {
	return v1.x * v2.x + v1.y * v2.y;
};
Vec.normL = function({x,y}){
    return {x : y,y : -x}
}
Vec.len = function({x,y}){
    return Math.sqrt(x * x + y * y)
}
// Vec.prototype = {
// 	length : function () {
// 		return Math.sqrt(this.x * this.x + this.y * this.y);
// 	},
// 	normalize : function () {
// 		var l = this.length();
// 		return new Vec(this.x / l, this.y / l);
// 	},
// 	normL : function () {
// 		return new Vec(this.y, -this.x);
// 	}
// };
//判断两个矩形(凸多边形)是否相撞 顶点坐标以顺时针或逆时针排列
function isPz(a,b){
   var vecArr = toVec(a).concat(toVec(b));   
   //法向量数组
   var  norArr = [];
   for(let i = 0; i < vecArr.length; i++){
       norArr.push(Vec.normL(vecArr[i]));
   }
//    console.log(norArr.length);
   for(let j = 0; j < norArr.length; j++){
    //    console.log(isCon(a,b,norArr[j]))
       if(!isCon(a,b,norArr[j])){
           return false;
       }
   }
   return true;
}
// isPz([{x:1,y:1},{x:2,y:2},{x:5,y:5}],[{x:7,y:1},{x:2,y:8},{x:4,y:9}])
//将数组内的n个点转为n个向量
function toVec(point){//point 顶点坐标数组
    var verArr = [];
    for(let i = 1,pre = 0; i < point.length; i++){
        verArr.push(Vec.substract(point[pre],point[i]));
        pre = i;
    }
    verArr.push(Vec.substract(point[point.length - 1],point[0]));
    return verArr;
}
// console.log(toVec([{x:1,y:1},{x:2,y:2},{x:5,y:5}]))
//比较两个图形中个点在法向量上投影是否重合
function isCon(a = [], b = [], c = {}){
    let apro = [], bpro = [];
    for(let i = 0; i < a.length; i++){
        apro.push(Vec.dot(a[i],c) / Vec.len(c))
    }
    for(let j = 0; j < b.length; j++){
        bpro.push(Vec.dot(b[j],c) / Vec.len(c))
    }
    px(apro);
    px(bpro);
    // console.log(apro,bpro)
    let amin = apro[0],amax = apro[apro.length - 1];
    let bmin = bpro[0],bmax = bpro[bpro.length - 1];
    let tmin,tmax;
    if(amin < bmin){
        tmin = amin;
    }else{
        tmin = bmin;
    }
    if(amax > bmax){
        tmax = amax;
    }else{
        tmax = bmax;
    }    
    if((amax - amin + bmax - bmin) > (tmax - tmin)){
        return true
    }else{
        return false
    }
}
// isCon([{x:1,y:4},{x:5,y:3},{x:1,y:7}],[{x:5,y:8},{x:2,y:9},{x:11,y:27}],{x:2,y:0})
//排序由小到大
function px(arr) {
    for(let i = 0; i < arr.length; i++){
        for(let j = 0; j < arr.length - i - 1;j++){
            if(arr[j] > arr[j+1]){
                var tmp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = tmp;
            }
        }
    }
    return arr;
}