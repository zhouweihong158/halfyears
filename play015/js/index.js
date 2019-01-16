$(function () {
    orient();
    setInterval(function () {
        $(window).on('orientationchange', function(e) {
            orient();
        });
    },100);
    // var audio = document.querySelector('audio');
    // setInterval(function () {
    //     document.addEventListener('webkitvisibilitychange', function() {
    //         if(document.webkitVisibilityState=='hidden') {
    //             audio.pause();
    //         }else {
    //             audio.play();
    //         }
    //     });
    // },100);    
    //字体大小
    var baseSize = parseFloat($('html').css('font-size'));    
    //
    var map = $('#map');
    var w = map.width();
    var h = map.height();
    var plate = $('.plate');
    //发射台的top left w h
    var tLauMap,lLauMap,wLau,hLau;
    if(is_land){
        tLauMap = 204 / 750 * h;
        lLauMap = 1174 / 1334 * w;
        wLau = 1.40 * baseSize;
        hLau = 3.46 * baseSize;
    }else{
        tLauMap = 1144 / 1334 * h;
        lLauMap = 202 / 750 * w;
        wLau = 3.46 * baseSize;
        hLau = 1.40 * baseSize;
    }
    // console.log(tLauMap,lLauMap,wLau,hLau);    
    //发射台开始不可以发射
    var canPre = false;
    //数组存放7套阵型船中心的坐标,下标0为旋转中心    
    var matPos;
    var matPosition = [
        [
            {x : 370 / 750,y : 518 / 1334},
            {x : 370 / 750,y : 518 / 1334,z : 20},
            {x : 244 / 750,y : 446 / 1334,z : 20},
            {x : 498 / 750,y : 584 / 1334,z : 20},
            {x : 530 / 750,y : 344 / 1334,z : 90},
            {x : 454 / 750,y : 420 / 1334,z : 90},
            {x : 284 / 750,y : 622 / 1334,z : 90},
            {x : 212 / 750,y : 702 / 1334,z : 90}
        ],
        [
            {x : 368 / 750,y : 554 / 1334},
            {x : 368 / 750,y : 554 / 1334,z : 90},
            {x : 276 / 750,y : 352 / 1334,z : 90},
            {x : 186 / 750,y : 706 / 1334,z : 90},
            {x : 102 / 750,y : 502 / 1334,z : 20},
            {x : 226 / 750,y : 526 / 1334,z : 20},
            {x : 510 / 750,y : 580 / 1334,z : 20},
            {x : 646 / 750,y : 616 / 1334,z : 20}
        ],
        [
            {x : 380 / 750,y : 550 / 1334},
            {x : 380 / 750,y : 550 / 1334,z : 0},
            {x : 236 / 750,y : 298 / 1334,z : 45},
            {x : 304 / 750,y : 426 / 1334,z : 45},
            {x : 452 / 750,y : 694 / 1334,z : 45},
            {x : 518 / 750,y : 804 / 1334,z : 45},
            {x : 430 / 750,y : 358 / 1334,z : 90},
            {x : 314 / 750,y : 758 / 1334,z : 90}
        ],
        [
            {x : 370 / 750,y : 556 / 1334},
            {x : 370 / 750,y : 556 / 1334,z : 45},
            {x : 428 / 750,y : 340 / 1334,z : 45},
            {x : 522 / 750,y : 446 / 1334,z : -45},
            {x : 614 / 750,y : 556 / 1334,z : 45},
            {x : 138 / 750,y : 580 / 1334,z : 45},
            {x : 218 / 750,y : 672 / 1334,z : -45},
            {x : 314 / 750,y : 774 / 1334,z : 45}
        ],
        [
            {x : 394 / 750,y : 546 / 1334},
            {x : 394 / 750,y : 546 / 1334,z : 25},
            {x : 254 / 750,y : 386 / 1334,z : 25},
            {x : 334 / 750,y : 466 / 1334,z : 25},
            {x : 480 / 750,y : 626 / 1334,z : 25},
            {x : 424 / 750,y : 382 / 1334,z : -45},
            {x : 570 / 750,y : 552 / 1334,z : -45},
            {x : 232 / 750,y : 552 / 1334,z : -45},
            {x : 370 / 750,y : 722 / 1334,z : -45}
        ],
        [
            {x : 394 / 750,y : 546 / 1334},
            {x : 356 / 750,y : 590 / 1334,z : 25},
            {x : 200 / 750,y : 400 / 1334,z : 25},
            {x : 300 / 750,y : 486 / 1334,z : 25},
            {x : 462 / 750,y : 610 / 1334,z : 25},
            {x : 568 / 750,y : 710 / 1334,z : 25},
            {x : 366 / 750,y : 308 / 1334,z : -45},
            {x : 538 / 750,y : 442 / 1334,z : -45},
            {x : 296 / 750,y : 762 / 1334,z : -45}
        ],
        [
            {x : 394 / 750,y : 546 / 1334},
            {x : 340 / 750,y : 328 / 1334,z : -45},
            {x : 454 / 750,y : 406 / 1334,z : -35},
            {x : 554 / 750,y : 462 / 1334,z : -25},
            {x : 270 / 750,y : 478 / 1334,z : 25},
            {x : 486 / 750,y : 628 / 1334,z : 25},
            {x : 196 / 750,y : 644 / 1334,z : -25},
            {x : 298 / 750,y : 712 / 1334,z : -35},
            {x : 410 / 750,y : 778 / 1334,z : -45}
        ]
    ];
    if(is_land){
        matPos = [];
        for(let i = 0;i < matPosition.length;i++){
            matPos[i] = [];
            for(let j = 0;j < matPosition[i].length;j++){
                matPos[i][j] = {};
                matPos[i][j].y = 1 - matPosition[i][j].x;
                matPos[i][j].x = matPosition[i][j].y;
                matPos[i][j].z = matPosition[i][j].z;
            }
        }
    }else{
        matPos = matPosition;
    }
    //数组存放船的宽高
    var shipSize;
    if(is_land){
        shipSize = [
            {
                sh : 0.25 * baseSize,
                sw: 1.31 * baseSize
            },
            {
                sh : 0.29 * baseSize,
                sw: 1.25 * baseSize
            },
            {
                sh : 0.40 * baseSize,
                sw: 1.43 * baseSize
            },
            {
                sh : 0.48 * baseSize,
                sw: 1.47 * baseSize
            }
        ]  
    }else{
        shipSize = [
            {
                sw : 0.25 * baseSize,
                sh: 1.31 * baseSize
            },
            {
                sw : 0.29 * baseSize,
                sh: 1.25 * baseSize
            },
            {
                sw : 0.40 * baseSize,
                sh: 1.43 * baseSize
            },
            {
                sw : 0.48 * baseSize,
                sh: 1.47 * baseSize
            }
        ]  
    }    
    //创建阵型类
    class Shipmat{
        constructor(config){            
            this.ships = [];            
            this.spd = 0;
            this.center = null;
            this.rotAng = 0;
            this.matInd = config.matInd;
            this.center = matPos[this.matInd][0];
        }
        creShip(){ 
            $('.dia').removeClass('diabri').addClass('diadim');  
            let spdAry = [6,-6];
            this.spd = spdAry[rm(0,1)];
            for(let i = 1; i < matPos[this.matInd].length; i ++){
                this.ships[i-1] = {};
                let sizeInd = rm(0,3);
                this.ships[i-1].width = shipSize[sizeInd].sw;
                this.ships[i-1].height = shipSize[sizeInd].sh;
                this.ships[i-1].top = matPos[this.matInd][i].y * h - this.ships[i-1].height / 2; 
                this.ships[i-1].left = matPos[this.matInd][i].x * w - this.ships[i-1].width / 2;
                this.ships[i-1].ang = matPos[this.matInd][i].z;
                this.ships[i-1].peaArr = [];
                this.ships[i-1].ship = $('<div></div>');
                this.ships[i-1].ship.addClass(`c${sizeInd}`).css({
                    width : this.ships[i-1].width,
                    height : this.ships[i-1].height,
                    top : `${this.ships[i-1].top}px`,
                    left : `${this.ships[i-1].left}px`,
                    transformOrigin: 'center center',
                    transform : `rotate(${this.ships[i-1].ang}deg)`                    
                    /*transformOrigin : `${(this.center.x * w - this.ships[i-1].left) / this.ships[i-1].width * 100}% ${(this.center.y * h - this.ships[i-1].top) / this.ships[i-1].height * 100}%`,*/             
                }).appendTo(plate);                            
            }       
            // console.log(this.ships)   
            this.shipRot();  
        }
        shipRot(){      
            this.rotAng = 0;  
            canPre = true;    
            this.rotTime = setInterval(()=>{                            
                this.rotAng += this.spd;                
                this.rotAng % 360 >=0 ? this.rotAng = this.rotAng % 360 : this.rotAng = this.rotAng % 360 + 360;
                plate.css({
                    transformOrigin: `${this.center.x * 100}%   ${this.center.y * 100}%`,
                    transform: `rotate(${this.rotAng}deg)`,                    
                });  
                for(let i = 0; i < this.ships.length; i++) {
                    if(this.ships[i] && this.ships[i].ship){   
                        // this.ships[i].get(0).style.transform = `rotate(${this.rotAng}deg)`    
                        /* this.ships[i].ship.css('transform',`rotate(${this.rotAng}deg)`);*/
                        // console.log(this.rotAng) 
                        // console.log(this.ships[0].css('top'),this.ships[0].css('left'))
                        // console.log(this.ships[i].get(0).style.transform)                      
                        let shipTruPos = truPos(this.center.x * w,this.center.y * h,this.ships[i].left,this.ships[i].top,this.rotAng,this.ships[i].width,this.ships[i].height);
                        this.ships[i].peaArr = peaPos(shipTruPos.left,shipTruPos.top,shipTruPos.width,shipTruPos.height,shipTruPos.rotang + this.ships[i].ang);
                    }                    
                }
            },40)
        }          
    }
    var matIndArr = rmtot(0,6,4);
    // console.log(matIndArr)
    var shipArr = [];
    for(let i = 0; i < matIndArr.length; i++) {
        shipArr.push(new Shipmat({matInd : 
            // 6
            matIndArr[i]
        }));
        // console.log(shipArr);
    }
    shipArr[0].creShip();
    //    
    //创建导弹类
    class Rocket{
        constructor(){
            this.rocCla = 'rocket';
            this.rocket = null;
            this.width;
            this.height;
            this.spd;
            this.rocSteTime = null;
            this.peaArr = [];
            this.isPz = false;            
        }
        creRoc(){
            this.rocket = $('<div></div>');
            this.spd = 0.2 * baseSize;
            if(is_land){
                this.width = 1.27 * baseSize;
                this.height = 0.17 * baseSize;            
                this.rocket.addClass(this.rocCla).css({
                    'width': this.width,
                    'height': this.height,
                    'bottom': '48.1502%',
                    // 'top': '0%'
                }).appendTo($('.launch'));
            }else{
                this.width = 0.17 * baseSize;
                this.height = 1.27 * baseSize;            
                this.rocket.addClass(this.rocCla).css({
                    'width': this.width,
                    'height': this.height,
                    'left': '48.1502%',
                    // 'top': '0%'
                }).appendTo($('.launch'));
            }    
            this.rocSte()
        }
        rocSte(){     
            var that = this;                  
            this.rocSteTime = setInterval(() => {
                this.watPz();
                if(this.rocket){
                    if(is_land){
                        this.rocket.css('left',function(index,value){
                            return parseFloat(value) - that.spd;
                        })  
                    }else{
                        this.rocket.css('top',function(index,value){
                            return parseFloat(value) - that.spd;
                        })  
                    }            
                    let ntRocMap = parseFloat(this.rocket.css('top')) + tLauMap;
                    let nlRocMap = parseFloat(this.rocket.css('left')) + lLauMap;                
                    // console.log(ntRocMap)
                    this.peaArr = peaPos(nlRocMap,ntRocMap,this.width,this.height,0);
                    // console.log(this.peaArr)
                    if(is_land){
                        if(nlRocMap <= - this.width){
                            clearInterval(this.rocSteTime);
                            this.rocket.remove();
                            this.rocket = null;
                            this.peaArr = [];
                            if(!this.isPz){
                                def();
                            }else if(this.isPz && shipArr[0].ships.some(s => s.ship.children('.boom').length == 0)){
                                canPre = true;
                            }
                            roc.pop();                        
                        }
                    }else{
                        if(ntRocMap <= - this.height){
                            clearInterval(this.rocSteTime);
                            this.rocket.remove();
                            this.rocket = null;
                            this.peaArr = [];
                            if(!this.isPz){
                                def();
                            }else if(this.isPz && shipArr[0].ships.some(s => s.ship.children('.boom').length == 0)){
                                canPre = true;
                            }
                            roc.pop();                        
                        }
                    }                    
                }
                 
            },10);                       
        }
        watPz(){
            for(let i = 0; i < shipArr[0].ships.length; i++){                
                if(shipArr[0].ships[i]){
                    if(shipArr[0].ships[i].ship && shipArr[0].ships[i].peaArr.length && !shipArr[0].ships[i].ship.children('.boom').length && roc[roc.length - 1] && roc[roc.length - 1].peaArr.length){
                        if(isPz(shipArr[0].ships[i].peaArr,roc[roc.length - 1].peaArr)){ 
                            this.isPz = true;
                            $('.dia').removeClass('diadim').addClass('diabri'); 
                            $(`<img src="image/lvup.gif?${new Date().getTime()}"/>`).addClass('lvup').css({
                                top: `${is_land? '-140%' : '-140%'}`,
                                left: `${is_land? '-5%' : '-5%'}`
                            }).appendTo($('.dia')).fadeOut(1000,function() {
                                this.remove();
                            });
                            $(`<img src="image/boom.gif?${new Date().getTime()}"/>`).addClass('boom').css({
                                top: `${is_land ? '-240%' : '-50%'}`,
                                left:`${is_land ? '0%' : '-200%'}`
                            }).appendTo(shipArr[0].ships[i].ship).fadeOut(1000,()=>{ 
                                shipArr[0].ships[i].ship.remove();
                                shipArr[0].ships[i].ship = null;
                                shipArr[0].ships[i].peaArr = [];                                
                                delete shipArr[0].ships[i];                                
                                if(shipArr[0].ships.every(s => s === undefined)){
                                    //console.log(111)
                                    clearInterval(shipArr[0].rotTime)
                                    shipArr.shift();
                                    canPre = false;
                                    if(shipArr.length > 0){
                                        shipArr[0].creShip();
                                    }
                                    else{
                                        vic();
                                    }
                                }  
                            })                        
                        }
                    }   
                }                                 
            }
            // shipArr[0].ships.every(f => console.log(f))
            // if(shipArr[0].ships.every(f => f !==undefined)){
            //     console.log(1);
            // }else{
            //     console.log(2);
            // }  
        }             
    } 
    var roc = [];      
    $('.launch').on('touchstart',function(e) {
        if($('.hand').length){
            $('.hand').remove();
        }
        e.preventDefault();
        if(canPre){
            roc.push(new Rocket());
            roc[roc.length - 1].creRoc();
            canPre = false;
        }        
    })
    //随机生成整数
    function rm(m,n) {
        return Math.round(Math.random() * (n-m) + m);
    }
    //随机生成范围内z个不同的整数
    function rmtot(m,n,z){
        let arr = [];
        while(arr.length < z){
            let tmp = rm(m,n);
            for(var i = 0;i < arr.length;i++){
                if(tmp == arr[i]){
                    break;
                }
            }
            if(i >= arr.length){
                arr.push(tmp)
            }
        }
        return arr;
    }
    //定义一个函数产生某两个角度之间的劣弧差值(0 ~ 360)
    function angSub(ang1,ang2){
        return Math.abs(ang1 - ang2) <= (360 - Math.abs(ang1 - ang2)) ? Math.abs(ang1 - ang2) : (360 - Math.abs(ang1 - ang2));
    }
    //后一点相对于前一点的旋转角度(-pi 到 pi之间) 在前一点水平往右为0deg
    function relAng(x1,y1,x2,y2) {
        var relAng;
        if(x2 != x1){
            relAng = Math.atan((y2 - y1) / (x2 - x1));
            if(x2 - x1 < 0 && relAng >= 0){
                relAng = relAng - Math.PI
            }else if(x2 - x1 < 0 && relAng < 0){
                relAng = relAng + Math.PI
            }
        }else{
            if(y2 <= y1){
                relAng = - Math.PI / 2;
            }else{
                relAng = Math.PI / 2;
            }
        }
        return relAng * 180 / Math.PI
    }
    //后一物体中心相对前一点旋转某角度后相对于坐标原点的坐标值,ang为角度值
    //x1,y1 为旋转中心点坐标 x2,y2 为旋转物体left top值 rotang为旋转角度 w,h 旋转物的宽高 
    //tru 真实
    function truPos(x1,y1,x2,y2,rotang,w,h){
        var relAng; // 相对角度
        var cdis;
        var trupos = {};
        if(x2 + w / 2 != x1){
            relAng = Math.atan((y2 + h / 2 - y1) / (x2 + w / 2 - x1));
            if(x2 + w / 2 - x1 < 0 && relAng >= 0){
                relAng = relAng - Math.PI
            }else if(x2 + w / 2 - x1 < 0 && relAng < 0){
                relAng = relAng + Math.PI
            }
        }else{
            if(y2 + h / 2 <= y1){
                relAng = - Math.PI / 2;
            }else{
                relAng = Math.PI / 2;
            }
        }
        cdis = Math.sqrt(Math.pow((y2 + h / 2 - y1),2) + Math.pow((x2 + w / 2 - x1),2));
        trupos.left = cdis * Math.cos(relAng + rotang / 180 * Math.PI) + x1 - w / 2;
        trupos.top = cdis * Math.sin(relAng + rotang / 180 * Math.PI) + y1 - h / 2;
        trupos.width = w;
        trupos.height = h;
        trupos.rotang = rotang;
        return trupos;
    }
    //已至两点坐标 后点绕前一点旋转某角度后点的坐标
    function rotPos(x1,y1,x2,y2,rotang){
        var begAng = relAng(x1,y1,x2,y2);
        var nowAng = begAng + rotang;
        var coor = {};
        var dis = Math.sqrt(Math.pow((y2 - y1),2) + Math.pow((x2 - x1),2));
        coor.x = Math.cos(nowAng * Math.PI / 180) * dis + x1;
        coor.y = Math.sin(nowAng * Math.PI / 180) * dis + y1;
        return coor;
    }    
    //根据矩形的top left width height 以及绕自身中心的旋转角度求出四个点的坐标
    //pea 顶点
    function peaPos(x,y,w,h,rotang){
        var peaArr = [];
        peaArr.push(rotPos(x + w / 2,y + h / 2,x,y,rotang));
        peaArr.push(rotPos(x + w / 2,y + h / 2,x + w,y,rotang));
        peaArr.push(rotPos(x + w / 2,y + h / 2,x + w,y + h,rotang));
        peaArr.push(rotPos(x + w / 2,y + h / 2,x,y + h,rotang));
        return peaArr;
    }
    // console.log(peaPos(-10,-10,20,20,45))    
    //成功
    function vic(){
        canPre = false;
        setTimeout(function(){
            $("#map").append("<a href='javascript:void(0)' class='advertising advic down' style='z-index:100'></a>");
        },1000)
    }
    //失败
    function def(){
        canPre = false;
        setTimeout(function(){
            $("#map").append("<a href='javascript:void(0)' class='advertising addef down' style='z-index:100'></a>");
        },1000)
    }
    //下载
    $("body").on("click",".down",function () {
        var userAgent = navigator.userAgent || navigator.vendor;
        var url = "https://itunes.apple.com/app/fleet-command-win-legion-war/id1039748465";
        var android = "https://play.google.com/store/apps/details?id=com.movga.fleetcommand.gp";
        if (/android/i.test(userAgent)) {
            url = android;
        }
        $(".down").attr("href",url);
    });
   
});