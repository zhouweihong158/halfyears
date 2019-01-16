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
    /*字体大小*/
    var baseSize = parseFloat($('html').css('font-size'));    
    /** */
    var map = $('#map');
    var w = map.width();
    var h = map.height();    
    //全局变量存放三层保护罩
    var celAry = [];
    //防御框的边长
    var dCelFra = 4.97 * baseSize;
    //存放防御框相对于界面top left值
    var tFraMap = parseFloat($('.cell_fra').css('top'));
    var lFraMap = parseFloat($('.cell_fra').css('left'));
    //全局变量存放宝箱相对于界面的top left值
    var tTreMap = tFraMap + parseFloat($('.treasure').css('top'));
    var lTreMap = lFraMap + parseFloat($('.treasure').css('left'));
    //宝箱的宽高
    var wTre = 1.86 * baseSize; 
    var hTre = 1.05 * baseSize;
    //发射台的宽高
    var wLaunch,hLaunch;
    if(is_land){
        wLaunch = 3.14 * baseSize;
        hLaunch = 3.46 * baseSize;
    }else{
        wLaunch = 3.46 * baseSize;
        hLaunch = 3.14 * baseSize;
    }
    //存放发射台相对于界面的top left值
    var tLauMap = parseFloat($('.launch').css('top'));
    var lLauMap = parseFloat($('.launch').css('left'));
    //创建保护罩类
    class Cell{
        constructor(config){
            this.cellCla = 'cell';
            this.pos = config.pos;
            this.posCla = `cell_${this.pos}`;
            this.cell = null;
            this.mouObj = {}; //存放挂载物体 类型 和 在 cell 上的表盘刻度(表盘刻度最右边为0deg,顺时针增加到359deg)
            this.rotAng = 0; //cell 旋转的角度
            //变量存放在被攻击点的表盘刻度挂载
            this.tarAng;            
            this.rotTime = null; //存放旋转的定时器
            //存放挂载物的角度差值(近似范围)
            this.angWid = 0;
            //挂载物的半径
            this.mrad;
            //保护罩半径
            this.crad;
            //中心距离
            this.cdis;
            //间隔总数
            this.intTol;
            this.width;
            this.height;
            this.hp;
        }
        creCell(){
            let wAry = [3.16, 4.13, 4.97];
            this.cell = $('<div></div>');
            this.width = wAry[`${this.pos}`] * baseSize;
            this.height = wAry[`${this.pos}`] * baseSize;
            this.cell.addClass(this.cellCla).addClass(this.posCla).css({
                'width': this.width,
                'height': this.height 
            }).appendTo($('.cell_fra'));
            this.cellRot();
            this.hp = 5;
            this.crad = this.width / 2;
            this.mrad = 0.7 * baseSize / 2;
            this.mouEle();
            this.cell.children().hide();
        }
        //cell旋转
        cellRot(){
            if(this.pos == 2){
                this.rotTime = setInterval(() => {
                    this.rotSty(1.2)
                },10)
            }else if(this.pos == 1) {
                let spd = 2.5;
                let count = 0;
                this.rotTime = setInterval(() => {
                    count++;
                    if(count % 200 == 0){
                        spd = -spd;
                    }
                    this.rotSty(spd)
                },10)
            }else if(this.pos == 0) {
                let spd = 5.0;
                let count = 0;
                this.rotTime = setInterval(() => {
                    count++;
                    if(count % 150 == 0){
                        spd = -spd;
                    }
                    this.rotSty(spd)
                },10)
            }
        }
        //cell旋转方法
        rotSty(spd){
            this.cell.get(0).style.transfrom ? (this.rotAng = parseFloat(this.cell.get(0).style.transfrom.slice(7))) : this.rotAng == 0;
            this.rotAng += spd;            
            this.rotAng % 360 >=0 ? this.rotAng = this.rotAng % 360 : this.rotAng = this.rotAng % 360 + 360;
            this.cell.get(0).style.transform = `rotate(${this.rotAng}deg)`;
            if(is_land){
                this.tarAng = 180 -this.rotAng >=0 ? 180 - this.rotAng : 540 - this.rotAng;
            }else{
                this.tarAng = 90 -this.rotAng >=0 ? 90 - this.rotAng : 450 - this.rotAng;
            }
            // console.log(this.tarAng);
        }
        //挂载砖石或炸弹
        mouEle(){
            //中心距离
            this.cdis = this.crad + this.mrad;  
            this.angWid = Math.ceil(Math.asin(this.mrad / this.cdis) * 180 / Math.PI);
            //console.log(this.angWid)
            this.intTol = Math.floor(360 / this.angWid / 4);
            if(this.pos == 0){
                let wzAry = rmtot(0,this.intTol,2);               
                this.mouSty('tor',wzAry[0] * this.angWid * 4);
                this.mouSty('tor',wzAry[1] * this.angWid * 4);
            }else if(this.pos == 1){
                let wzAry = rmtot(0,this.intTol,4);
                this.mouSty('dia',wzAry[0] * this.angWid * 4);
                this.mouSty('tor',wzAry[1] * this.angWid * 4);
                this.mouSty('tor',wzAry[2] * this.angWid * 4);
                this.mouSty('tor',wzAry[3] * this.angWid * 4);                
            }else if(this.pos == 2){
                let wzAry = rmtot(0,this.intTol,1);
                this.mouSty('dia',wzAry[0] * this.angWid * 4)
            }
        }
        //挂载方法 参数 类型和位置
        mouSty(type,celAng){
            //挂载物中心的top left 相对于cell中心
            //Math.sin(celAng) * cdis + crad //top
            //Math.cos(celAng) * cdis + crad //left
            //挂载物相对于cell的top left
            let mT = Math.sin(celAng / 180 * Math.PI) * this.cdis + this.crad - this.mrad;
            let mL = Math.cos(celAng / 180 * Math.PI) * this.cdis + this.crad - this.mrad;
            this.mouObj[type] === undefined && (this.mouObj[type] = {});
            this.mouObj[type][celAng] = $('<div></div>');
            this.mouObj[type][celAng].addClass(type).css({
                'top': mT,
                'left': mL,
                'transform-origin': '50% 50%',
                'transform': `rotate(${celAng - 90}deg)` 
            }).appendTo(this.cell);
            //console.log(this.mouObj)
        }
        //保护罩被攻击方法 ?等rocketstep事件再定
        beAtt(){
            //cell中心和导弹中心的距离
            let cdis = this.crad + 1.27 * baseSize / 2;
            let mT,mL;
            if(is_land){
                mT = Math.sin(this.tarAng / 180 * Math.PI) * cdis + this.crad - 0.17 * baseSize / 2;
                mL = Math.cos(this.tarAng / 180 * Math.PI) * cdis + this.crad - 1.27 * baseSize / 2;
            }else{
                mT = Math.sin(this.tarAng / 180 * Math.PI) * cdis + this.crad - 1.27 * baseSize / 2;
                mL = Math.cos(this.tarAng / 180 * Math.PI) * cdis + this.crad - 0.17 * baseSize / 2;
            }            
            //创建保护罩被攻击痕迹对象
            let rift = $('<div></div>');
            if(is_land){
                rift.addClass('rift').css({
                    'top': '-15%',
                    'left': '98%'
                });
            }else{
                rift.addClass('rift').css({
                    'top': '-34%',
                    'left': '-14%'
                });
            }
            this.mouObj['rocket'] === undefined && (this.mouObj['rocket'] = {});
            this.mouObj['rocket'][this.tarAng] = $('<div></div>');
            if(is_land){
                this.mouObj['rocket'][this.tarAng].addClass('rocket').css({
                    'top': mT,
                    'left': mL,
                    'width': 1.27 * baseSize,
                    'height': 0.17 * baseSize,
                    'transform-origin': 'center center',
                    'transform': `rotate(${this.tarAng - 180}deg)`
                }).append(rift).appendTo(this.cell);
            }else{
                this.mouObj['rocket'][this.tarAng].addClass('rocket').css({
                    'top': mT,
                    'left': mL,
                    'width': 0.17 * baseSize,
                    'height': 1.27 * baseSize,
                    'transform-origin': 'center center',
                    'transform': `rotate(${this.tarAng - 90}deg)`
                }).append(rift).appendTo(this.cell);
            }
            this.hp--;
            this.cell.css('opacity',function(index,value) {
                return value -= 0.05;
            })
            if(this.hp <= 0) {
                this.beDes();
            }else{
                canPre = true;
            }
            // console.log(this.mouObj);
            //console.log(this.tarAng)
        }
        beDes(){
            var that = this;
            celAry.pop();
            // console.log(celAry)
            $(`<img src="image/cell_bro.gif?${new Date().getTime()}"/>`).addClass('cell_bro').css({
                'width' : this.cell.width(),
                'height': this.cell.height()
            }).appendTo(this.cell).fadeOut(1000,function() {
                canPre = true;
                that.cell.remove();
                if(celAry.length > 0){
                    //celAry[celAry.length - 1].mouEle();
                    celAry[celAry.length - 1].cell.children().show();
                }                
            })            
        }
    }
    //创建导弹类
    class Rocket{
        constructor(){
            this.rocCla = 'rocket';
            this.rocket = null;
            this.width;
            this.height;
            this.spd;
            this.rocSteTime = null;            
        }
        creRoc(){
            this.rocket = $('<div></div>');
            if(is_land){
                this.width = 1.27 * baseSize;
                this.height = 0.17 * baseSize;
                this.rocket.addClass(this.rocCla).css({
                    'width': this.width,
                    'height': this.height,
                    'top': '38.15028901%',
                    // 'right': '0%'
                }).appendTo($('.launch'));
            }else{
                this.width = 0.17 * baseSize;
                this.height = 1.27 * baseSize;
                this.rocket.addClass(this.rocCla).css({
                    'width': this.width,
                    'height': this.height,
                    'left': '38.15028901%',
                    // 'top': '0%'
                }).appendTo($('.launch'));
            }
            //定义变量rocket是否碰撞挂载物
            this.isMou = false;
            this.rocSte();
            //console.log(this);
        }
        rocSte(){
            let that = this;
            //火箭移动速度
            //竖版导弹初始位置相对于页面top
            let tRocMap = tLauMap;
            //横版导弹初始位置相对于页面left
            let lRocMap = lLauMap + parseFloat(this.rocket.css('left'));
            //竖版防护罩2相对于页面top
            let tCleMap2 = tFraMap;//parseFloat($('.cell_2').css('top'));
            //横版保护罩2相对于页面left
            let lCelMap2 = lFraMap;
            //防护罩2的宽度
            let dCel2 = 4.97 * baseSize;//$('.cell_2').width();
            if(is_land){
                this.spd =  (lCelMap2 - (lRocMap + this.width)) / 667 * w / 50 * 4;
            }else{
                this.spd =  (tRocMap - (tCleMap2 + dCel2)) / 667 * h / 50 * 6;
            }
            this.rocSteTime = setInterval(() => {
                if(is_land){
                    this.rocket.css('left',function(index,value) {
                        // console.log(parseFloat(value) - that.spd)
                        return parseFloat(value) + that.spd;
                    })
                    let nlRocMap = lLauMap + parseFloat(this.rocket.css('left'));
                    if(celAry.length > 0){
                        let nCel = celAry[celAry.length - 1];
                        if(nlRocMap + this.width >= (parseFloat(nCel.cell.css('left')) + lFraMap)){
                            //this.rocket.remove();
                            if(nCel.hp > 0){                            
                                this.rocAtt();
                            }             
                        }
                    }else if(celAry.length == 0){
                        if(nlRocMap + this.width >= lTreMap) {
                            // console.log(lTreMap)
                            rocnum--;
                            $('.rocnum').html(rocnum);
                            clearInterval(this.rocSteTime);
                            vic();
                        }
                    }
                }else{
                    this.rocket.css('top',function(index,value) {
                        return parseFloat(value) - that.spd;
                    })
                    let ntRocMap = tLauMap + parseFloat(this.rocket.css('top'));
                    if(celAry.length > 0){
                        let nCel = celAry[celAry.length - 1];
                        if(ntRocMap <= (parseFloat(nCel.cell.css('top')) + tFraMap + nCel.cell.height())){
                            //this.rocket.remove();
                            if(nCel.hp > 0){                            
                                this.rocAtt();
                            }             
                        }
                    }else if(celAry.length == 0){
                        if(ntRocMap <= tTreMap + hTre) {
                            rocnum--;
                            $('.rocnum').html(rocnum);
                            clearInterval(this.rocSteTime);
                            vic();
                        }
                    }
                }                                
            },10)
        }
        rocAtt(){
            clearInterval(this.rocSteTime);
            //this.rocket.remove();            
            let nCel = celAry[celAry.length - 1]
            let nCelMou = nCel.mouObj;
            //nCel.beAtt();
            for(let type in nCelMou){
                if(type == 'dia'){                    
                    if(!this.isMou){
                        for(let celAng in nCelMou[type]){
                            //console.log(angSub(nCel.tarAng,parseFloat(celAng)),nCel.angWid)
                            if((angSub(nCel.tarAng,parseFloat(celAng)) <= nCel.angWid) && nCelMou[type][celAng] && !nCelMou[type][celAng].hasClass('rock')){
                                //console.log(nCelMou[type][celAng].hasClass('rock'))
                                rocnum--;
                                $('.rocnum').html(rocnum);                                
                                this.isMou = true;
                                this.rocket.remove();                                
                                nCel.beAtt();
                                nCelMou[type][celAng].addClass('rock');
                                nCelMou[type][celAng].on('animationend webkitAnimationEnd',function() {
                                    this.remove();                                    
                                    delete nCelMou[type][celAng];                                 
                                })
                            }
                        }
                    }
                }else if(type == 'tor'){
                    // console.log(this)
                    if(!this.isMou){
                        for(let celAng in nCelMou[type]){
                            if((angSub(nCel.tarAng,parseFloat(celAng)) <= nCel.angWid * 1.2) && nCelMou[type][celAng] && !nCelMou[type][celAng].children('.tor_boom').length){
                                canPre = true;
                                bolnum--;
                                if(bolnum < 1){
                                    rocnum--;
                                }
                                if(bolnum <= 0){
                                    def()
                                }
                                $('.rocnum').html(rocnum);
                                $('.bolnum').html(bolnum);           
                                this.isMou = true;
                                this.rocket.remove();
                                $(`<img src="image/tor_boom.gif?${new Date().getTime()}"/>`).addClass('tor_boom').css({
                                    'top': '-80%',
                                    'left': '-50%'
                                }).appendTo(nCelMou[type][celAng]).fadeOut(1000,function(){
                                    this.remove();
                                    if(nCelMou[type][celAng]){
                                        nCelMou[type][celAng].remove();    
                                        delete nCelMou[type][celAng];    
                                    }                     
                                })
                            }                           
                        }
                    }
                }else if(type == 'rocket'){
                    if(!this.isMou){
                        for(let celAng in nCelMou[type]){
                            if(angSub(nCel.tarAng,parseFloat(celAng)) <= 5){
                                canPre = true;
                                bolnum--;
                                if(bolnum < 1){
                                    rocnum--;
                                }                                
                                if(bolnum <= 0){
                                    def()
                                }
                                $('.rocnum').html(rocnum);
                                $('.bolnum').html(bolnum);
                                this.isMou = true;
                                $(`<img src="image/roc_boom.gif?${new Date().getTime()}"/>`).addClass('roc_boom').css({
                                    'top': `${is_land?'-800%':'-80%'}`,
                                    'left': `${is_land?'-50%':'-800%'}`
                                }).appendTo(this.rocket)
                                .fadeOut(1000,() => {
                                    this.rocket.remove();
                                })
                            }                           
                        }
                    }
                }
            }
            if(!this.isMou){                
                rocnum--;
                $('.rocnum').html(rocnum);
                this.rocket.remove();
                nCel.beAtt();
            }
        }        
    }
    //创建三层保护罩
    celAry.push(new Cell({pos: 0}));
    celAry.push(new Cell({pos: 1}));
    celAry.push(new Cell({pos: 2}));
    for(let i = 0;i < celAry.length;i++){
        celAry[i].creCell();
    }
    //初始挂载
    //celAry[celAry.length - 1].mouEle();
    celAry[celAry.length - 1].cell.children().show();
    //变量存放火箭数量 血量
    var rocnum = 16;
    var bolnum = 2;
    //全局变量 创建导弹 放入一个数组中
    var roc = [];
    //全局变量 控制可点击
    var canPre = true;
    $('.launch').on('touchstart',function(e) {
        e.preventDefault();
        if($('.hand').is(':visible')){
            $('.hand').hide();
        }
        if($('.h_light').is(':visible')){
            $('.h_light').hide();
        }        
        if(rocnum > 0 && bolnum > 0 && canPre){
            roc.push(new Rocket());
            roc[roc.length - 1].creRoc();            
        }
        canPre = false;      
    })
    //随机生成整数
    function rm(m,n) {
        return Math.round(Math.random() * (n-m) + m);
    }
    //随机生成范围内n个不同的整数
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