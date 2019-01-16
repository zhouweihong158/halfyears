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
    var baseSize = parseInt($('html').css('font-size'));
    //console.log(baseSize)
    /*背景*/
    var map = $('#map');
    var w = parseInt(map.width());
    var h = parseInt(map.height());
    function bgmove(){
        if(is_land){
            map.css('backgroundPositionX',function(index,value){
                return parseInt(value) - 4
            })
        }else{
            map.css('backgroundPositionY',function(index,value){
                return parseInt(value) + 4
            })
        }
    }
    //开始界面
    function loading(){
        this.load = [];
        this.cla = [];
        this.loadTime = null;
    }
    loading.prototype.creLoa = function(config) {
        this.cla = config.cla;
        let i = 0;
        this.loadTime = setInterval(()=>{
            this.load[i] = $('<div></div>');
            this.load[i].addClass(this.cla[i]).appendTo(map).fadeOut(1000,function(){
                this.remove();
            });
            i++;
            if(i >= 3){
                clearInterval(this.loadTime)
            }
        },1000)
    }
    /*己方*/
    function ourShip() {
        this.ship = null;
        this.cla = null;
        this.top = 0;
        this.left = 0;
        this.width = 0;
        this.height = 0;
        this.lv = 1;
        this.hp = 0;
        this.pzShiTime = null;
        this.kzqOb = true;
        this.kzq = true;
    }
    //己方船创建
    ourShip.prototype.creShip = function(config) {
        this.lv = 1;
        this.cla = config.cla;
        this.top = config.top * h / 100;
        this.left = config.left * w / 100;
        this.width = config.width * baseSize;
        this.height = config.height * baseSize;
        this.hp = 2;
        this.kzqOb = true;
        this.kzq = true;
        this.ship = $('<div></div>')
        this.ship.css({
            'width' : this.width,
            'height' : this.height,
            'top' : this.top,
            'left' : this.left
        }).addClass(this.cla).append('<div class="pro"></div>')
        .appendTo(map);
        //this.step();
    }
    ourShip.prototype.step = function() {
        var that = this;
        let cmove = false;
        this.ship.on('touchstart',function(e){
            cmove = true;
            e.stopPropagation();
            e.preventDefault?e.preventDefault():e.returnValue = false;
        })
        this.ship.on('touchmove', function(e) {
            e.stopPropagation();
            e.preventDefault?e.preventDefault():e.returnValue = false;
            if(cmove){
                let _touch = e.originalEvent.targetTouches[0];
                let touchX = _touch.pageX;
                let touchY = _touch.pageY;
                if(touchX - that.width / 2 > 0 && touchX + that.width / 2 < w && touchY - that.height / 2 >0 && touchY + that.height / 2 < h){
                    this.left = touchX - that.width / 2;
                    this.top = touchY - that.height / 2;
                    $(this).css('left', this.left);
                    $(this).css('top', this.top);
                }
            }
        })
        this.ship.on('touchend',function(e){
            e.stopPropagation();
            e.preventDefault?e.preventDefault():e.returnValue = false;
            cmove = false;
        })
        this.pz();
    }
    //爆炸
    ourShip.prototype.boom = function() {
        if(this.ship.children('.pro')){
            this.ship.children('.pro').hide();
        }
        let nT = parseInt(this.ship.css('top'));
        let nL = parseInt(this.ship.css('left'));
        if(is_land){
            $(`<img src="image/explore.gif?${new Date().getTime()}">`).addClass('boom').css({
                'top': nT - 1.5 * baseSize,
                'left': nL - 0.7 * baseSize
            }).appendTo(map)        
            .fadeOut(2000,function(){
                this.remove()
            });
        }else{
            $(`<img src="image/explore.gif?${new Date().getTime()}">`).addClass('boom').css({
                'top': nT,
                'left': nL -1.5 * baseSize
            }).appendTo(map)        
            .fadeOut(2000,function(){
                this.remove()
            });
        }
        this.hp--;
        if(this.hp <= 0){
            this.ship.remove();
            clearInterval(this.pzShiTime);
            clearInterval(bullet.creBulTime);
            clearInterval(obs.creObsTime);
            clearInterval(obs.steObsTime);
            clearInterval(timer);
            def();
        }  
    }
    //己方船碰撞障碍
    ourShip.prototype.pz = function() {
        this.pzShiTime = setInterval(() => {
            if(this.kzqOb){
                for(var i = 0; i < obs.obs.length; i++ ){
                    if(obs.obs[i] !== undefined){
                        if(parseInt(this.ship.css('left')) + this.ship.width() > parseInt(obs.obs[i].css('left')) && parseInt(this.ship.css('left')) < parseInt(obs.obs[i].css('left')) + obs.obs[i].width() && parseInt(this.ship.css('top')) + this.ship.height() > parseInt(obs.obs[i].css('top')) && parseInt(this.ship.css('top')) < parseInt(obs.obs[i].css('top')) + obs.obs[i].height()){
                            this.boom();
                            this.kzqOb = false;
                            let kzqTimer = setTimeout(()=>{
                                this.kzqOb = true;
                                clearTimeout(kzqTimer);
                            },1500)
                                //console.log(boomAry)
                            // }
                        }
                    }           
                }
            }
            if(this.kzq){
                if(eneShip.ship != undefined && this.ship != undefined){
                    if(parseInt(this.ship.css('left')) + this.ship.width() > parseInt(eneShip.ship.css('left')) && parseInt(this.ship.css('left')) < parseInt(eneShip.ship.css('left')) + eneShip.ship.width() && parseInt(this.ship.css('top')) + this.ship.height() > parseInt(eneShip.ship.css('top')) && parseInt(this.ship.css('top')) < parseInt(eneShip.ship.css('top')) + eneShip.ship.height()){
                        this.boom();
                        this.kzq = false;
                        //clearInterval(this.pzShiTimeBos);
                        let kzqTimer = setTimeout(()=>{
                            this.kzq = true;
                            clearTimeout(kzqTimer);
                        },3000)
                    }
                }
            }
        },100)
    }
    //升级
    ourShip.prototype.lvup = function() {
        if(this.lv < 3){
            this.lv++;
            // let nW = parseInt(this.ship.css('width'));
            // let nH = parseInt(this.ship.css('height'));
            let nT = parseInt(this.ship.css('top'));
            let nL = parseInt(this.ship.css('left'));
            //console.log(nT)
            if(is_land){
                $(`<img src="image/lvup.gif?${new Date().getTime()}">`).addClass('lvup').css({
                    'top': nT - 1.2 * baseSize,
                    'left': nL - 0.7 * baseSize
                }).appendTo(map).fadeOut(1000,function(){
                    this.remove();
                    bullet.lvup();
                });
            }else{
                $(`<img src="image/lvup.gif?${new Date().getTime()}">`).addClass('lvup').css({
                    'top': nT - 0.7 * baseSize,
                    'left': nL - 1.5 * baseSize
                }).appendTo(map).fadeOut(1000,function(){
                    this.remove();
                    bullet.lvup();
                });
            }            
        }   
    }
    //子弹类
    function bullets() {
        this.bullet = [];
        this.creBulTime = null;
        this.steBulTime = null;
        this.pzBulTime = null;
        //this.pzBulTimeBos = null;
        this.lv = 1;
        this.cla = null;
        this.top = 0;
        this.left = 0;
        this.width = 0;
        this.height = 0;
    }
    //创建子弹
    bullets.prototype.creBul = function(config) {
        let bullAry;
        if(is_land){
            bullAry = [{width: 0.36,height: 0.14},{width: 0.36,height: 0.44},{width: 0.36,height: 0.80}]
        }else{
            bullAry = [{width: 0.14,height: 0.36},{width: 0.44,height: 0.36},{width: 0.80,height: 0.36}]
        }
        
        let i= 0;
        this.creBulTime = setInterval(()=>{
            this.bullet[i] = $('<div></div>');
            this.lv = config.lv;
            this.cla = `bullet${this.lv}`
            this.top = parseInt($('.ship').css('top')) + ship.height / 2 - this.height / 2;
            this.left = parseInt($('.ship').css('left')) + ship.width / 2 - this.width / 2;
            this.width = bullAry[parseInt(this.cla.slice(-1)) - 1].width * baseSize;
            this.height = bullAry[parseInt(this.cla.slice(-1)) - 1].height * baseSize;
            this.bullet[i].addClass(this.cla).css({
            'top' : this.top,
            'left' : this.left,
            'width' : this.width,
            'height' : this.height
        })
        .appendTo(map);
        i++;
        },400)
        this.step();
    }
    //移动子弹
    bullets.prototype.step = function() {
        this.steBulTime = setInterval(() => {
            for(let i = 0;i < this.bullet.length;i++){
                if(this.bullet[i] !== undefined){
                    var begBul;
                    if(is_land){
                        this.bullet[i].css('left',function(index,value){
                            return parseInt(value) + 2;
                        })
                        begBul = parseInt(this.bullet[i].css('left'));
                        if(begBul >=  w){
                            this.bullet[i].remove();
                            delete this.bullet[i];
                        }
                    }else{
                        this.bullet[i].css('top',function(index,value){
                            return parseInt(value) - 2;
                        })
                        begBul = parseInt(this.bullet[i].css('top'));
                        if(begBul <=  0){
                            this.bullet[i].remove();
                            //this.bullet.splice(i,1)
                            delete this.bullet[i];
                        }
                    }
                    
                }
            }
        },10)
        this.pz();
        //this.pzs(); 
    }
    //子弹升级
    bullets.prototype.lvup = function() {
        clearInterval(this.creBulTime);
        clearInterval(this.steBulTime);
        for(let i = 0;i < this.bullet.length;i++){
            if(this.bullet[i] !== undefined){
                this.bullet[i].remove();
            }
        }
        this.bullet = [];
        var nlv = this.lv;
        if(nlv < 3){
            nlv++
        }
        //this.cla = `bullet${lv}`;
        if(ship.hp > 0){
            this.creBul({lv : nlv});
        }
    }
    //子弹碰撞
    bullets.prototype.pz = function() {
        this.pzBulTime = setInterval(()=>{
            for(let i = 0; i < this.bullet.length; i++){
                for(let j = 0; j < obs.obs.length; j++){
                    if(this.bullet[i] != undefined && obs.obs[j] != undefined){
                        if( parseInt(this.bullet[i].css('left')) + this.bullet[i].width() > parseInt(obs.obs[j].css('left')) && parseInt(this.bullet[i].css('left')) < parseInt(obs.obs[j].css('left')) +obs.obs[j].width() && parseInt(this.bullet[i].css('top')) + this.bullet[i].height() > parseInt(obs.obs[j].css('top')) && parseInt(this.bullet[i].css('top')) < parseInt(obs.obs[j].css('top')) +obs.obs[j].height()){
                            this.bullet[i].remove();
                            delete this.bullet[i];
                        }
                    }
                }
            }
            for(let i = 0; i < this.bullet.length; i++){
                if(this.bullet[i] != undefined && eneShip.ship != undefined){
                    if( parseInt(this.bullet[i].css('left')) + this.bullet[i].width() > parseInt(eneShip.ship.css('left')) && parseInt(this.bullet[i].css('left')) < parseInt(eneShip.ship.css('left')) +eneShip.ship.width() && parseInt(this.bullet[i].css('top')) + this.bullet[i].height() > parseInt(eneShip.ship.css('top')) && parseInt(this.bullet[i].css('top')) < parseInt(eneShip.ship.css('top')) +eneShip.ship.height()){
                        this.bullet[i].remove();
                        delete this.bullet[i];
                        eneShip.bru();
                    }
                }
            }
        },100)
    }
    //敌船类
    function eneShip() {
        this.cla = null;
        this.width = 0;
        this.height = 0;
        this.top = 0;
        this.left = 0;
        this.lv = 1;
        this.hp = 0;
        this.ship = null;
        this.spd = 0;
        //this.steShiTime = null;
    }
    //敌船创建
    eneShip.prototype.creShip = function(config) {
        let spdAry = [2, 4, 6];
        let hpAry = [2,3,4];
        this.lv = config.lv;
        this.cla = `eneShip${this.lv}`
        this.spd = spdAry[parseInt(this.cla.slice(-1) - 1)]
        // this.width = config.width * baseSize;
        // this.height = config.height * baseSize;
        this.top = 0 * h / 100;
        this.left = 80 * w / 100;
        //this.lv = config.lv;
        this.hp = hpAry[parseInt(this.cla.slice(-1) - 1)];
        this.ship = $('<div></div>');
        this.ship.addClass(this.cla).css({
            // 'width': this.width,
            // 'height': this.height,
            'top': this.top,
            'left':this.left
        }).appendTo(map);
        //console.log(this.top)
        this.step(this.spd);
    }
    //敌船移动
    eneShip.prototype.step = function(spd) {
        let nLeft = parseInt(this.ship.css('left'));
        let nTop = parseInt(this.ship.css('top'));
        let nWidth = parseInt(this.ship.width());
        let nHeight = parseInt(this.ship.height());
        let spdX = spd;
        let spdY = spd;
        if(is_land){
            this.steShiTime = setInterval(()=>{
                if(nLeft < w /2 || nLeft > w - nWidth){
                    spdX = -spdX;
                }else{
                    spdX =spdX;
                }
                if(nTop < 0 || nTop > h - nHeight){
                    spdY = -spdY;
                }else{
                    spdY = spdY;
                }
                nTop += spdY;
                nLeft += spdX;
                this.ship.css({
                    'left':nLeft,
                    'top': nTop
                })
            },20)
        }else{
            this.steShiTime = setInterval(()=>{
                if(nLeft < 0 || nLeft > w - nWidth){
                    spdX = -spdX;
                }else{
                    spdX =spdX;
                }
                if(nTop < 0 || nTop > h / 2 - nHeight){
                    spdY = -spdY;
                }else{
                    spdY = spdY;
                }
                nTop += spdY;
                nLeft += spdX;
                this.ship.css({
                    'left':nLeft,
                    'top': nTop
                })
            },20)
        }        
    }
    //敌船被攻击
    eneShip.prototype.bru = function() {
        this.hp--;
        if(this.hp == 0){
            this.boom();
        }
    }
    //敌船爆炸
    eneShip.prototype.boom = function() {
        let nT = parseInt(this.ship.css('top'));
        let nL = parseInt(this.ship.css('left'));
        if(is_land){
            $(`<img src="image/explore.gif?${new Date().getTime()}">`).addClass('boom').css({
                'top': nT - 1.5 * baseSize,
                'left': nL - 0.7 * baseSize
            }).appendTo(map)        
            .fadeOut(2000,function(){
                this.remove()
            });
        }else{
            $(`<img src="image/explore.gif?${new Date().getTime()}">`).addClass('boom').css({
                'top': nT - 1.5 * baseSize,
                'left': nL - 1.5 * baseSize
            }).appendTo(map)        
            .fadeOut(2000,function(){
                this.remove()
            });
        }        
        if(ship.hp > 0){
            ship.lvup();
        }
        if(this.lv < 3) {
            this.ship.remove();
            this.ship = null;
            clearInterval(this.steShiTime)
            this.lv++;
            this.creShip({lv : this.lv})
        }else{
            vic();
            this.ship.remove();
            this.ship = null;
            clearInterval(this.steShiTime);
            clearInterval(obs.creObsTime);
            clearInterval(obs.steObsTime);
            clearInterval(timer);
            ship.kzqOb = false;
            //ship.ship.remove();
            clearInterval(bullet.creBulTime); 
        }
    }
    //创建障碍物
    function obstacle() {
        this.cla = null;
        this.width = 0;
        this.height = 0;
        this.top = 0;
        this.left = 0;
        this.obs = [];
        this.creObsTime = null;
        this.steObsTime = null;
    }
    obstacle.prototype.creObs = function(tint) {
        let obHgt = [1.37,1.34,1,1.3,1.67]
        let obWdt = [2.10,2.09,0.93,1.42,1.64]
        let i = 0;        
        this.creObsTime = setInterval(()=>{
            let ind = Math.ceil(rm(0,5));
            this.obs[i] = $('<div></div>');
            this.cla = `obstacle${ind}`;
            //this.width = config.width * baseSize;
            //this.height = config.height * baseSize;
            if(is_land){
                this.top = rm(0,h - obHgt[ind - 1] * baseSize);
                this.left = w;
            }else{
                this.top = 0 - obHgt[ind - 1] * baseSize;
                this.left = rm(0,w -obWdt[ind - 1] * baseSize)
            }            
            this.obs[i].addClass(this.cla).css({
                top: this.top,
                left: this.left
            }).appendTo(map);
            i++;
        },tint)
        this.step();
    }
    obstacle.prototype.step = function() {
        this.steObsTime = setInterval(()=>{
            for(let i = 0;i < this.obs.length;i++){
                if(this.obs[i] != undefined){
                    //console.log(w,h)
                    if(is_land){
                        this.obs[i].css('left',function(index,value){
                            return parseInt(value) - 4;
                        });
                        let nLeft = parseInt(this.obs[i].css('left'));
                        //console.log(nLeft)
                        // nLeft -= 4;
                        // this.obs[i].css('left',nLeft);
                        if(nLeft <= 0){
                            this.obs[i].remove(); 
                            delete obs.obs[i]
                        }
                    }else{
                        this.obs[i].css('top',function(index,value){
                            return parseInt(value) + 4;
                        });
                        let nTop = parseInt(this.obs[i].css('top'));
                        // nTop += 4;
                        // this.obs[i].css('top',nTop);
                        if(nTop >= h){
                            this.obs[i].remove();
                            //this.obs.splice(i,1)
                            delete this.obs[i]
                        }
                    }
                }                
            }
        },10)
    }
    //失败
    function def(){
        setTimeout(function(){
            $("#map").append("<a href='javascript:void(0)' class='advertising addef down' style='z-index:100'></a>");
        },1000)
    }
    //成功
    function vic(){
        setTimeout(function(){
            $("#map").append("<a href='javascript:void(0)' class='advertising advic down' style='z-index:100'></a>");
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
    $('#map').on('touchstart',function(e){
        e.preventDefault();
    })
    $('#map').on('touchmove',function(e){
        e.preventDefault();
    })
    $('#map').on('touchend',function(e){
        e.preventDefault();
    })
    var timer;
    var load;
    var obs;
    var ship;
    var bullet;
    var eneShip;
    ship = new ourShip();
    //console.log(ship)
    if(is_land){
        ship.creShip(
            {
                width: 1.97,
                height: 0.39,
                top: 48.26666666,
                left: 42.57871064,
                cla : 'ship'
            }
        );
    }else{
        ship.creShip(
            {
                width: 0.39,
                height: 1.97,
                top: 42.65367316,
                left: 47.33333333,
                cla : 'ship'
            }
        );
    }
    // $('<div><div>').css({
    //     width: '0.5rem',
    //     height: '0.5rem',
    //     position: 'absolute',
    //     bottom: '40px',
    //     right: '40px',
    //     background: 'red',
    //     zIndex: 6
    // }).addClass('anniu1').appendTo(map)
    // $('<div><div>').css({
    //     width: '0.5rem',
    //     height: '0.5rem',
    //     position: 'absolute',
    //     bottom: '40px',
    //     left: '40px',
    //     background: 'green',
    //     zIndex: 6
    // }).addClass('anniu2').appendTo(map)
    load = new loading();
    obs = new obstacle();
    eneShip = new eneShip()
    load.creLoa({
        cla: ['load1','load2','load3']
    });
    setTimeout(() =>{
        $('.languagefont').remove();
        timer = setInterval(bgmove,10);
        ship.step();
        bullet = new bullets();
        bullet.creBul({
            lv : 1
        });
    },4000)
    setTimeout(()=>{
        obs.creObs(800);
    },7000)
    setTimeout(()=>{
        eneShip.creShip({
            lv: 1
        });
    },15000)
    function rm(m,n) {
        return Math.random() * (n-m) + m;
    }
});