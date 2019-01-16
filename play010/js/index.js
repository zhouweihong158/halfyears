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
    $('.fire_btn').hide();
    var tsTime = setTimeout(()=>{
        $('.ts_fra').fadeOut(1000);
        clearTimeout(tsTime);
    },1000)
    //全局变量敌船 和 炮弹数 击毁敌船数量
    var shipAry = [];
    var bullNum = 15;
    var desshipNum = 10;
    //全局变量存放指针旋转角度
    var needAngle;
    //全局变量存放是否能够击中
    var canfal;    
    //全局变量存放按钮控制
    var canPre = true;
    //指针定时器变量存放数组中
    var needAry = [];
    /*字体大小*/
    var baseSize = parseFloat($('html').css('font-size'));
    /** */
    var map = $('#map');
    var w = map.width();
    var h = map.height();
    var tShip = parseFloat($('.ourship').css('top')); //我方船只top 相对页面
    var lShip = parseFloat($('.ourship').css('left')); //我方船只left 相对页面
    var tGun = parseFloat($('.gun').css('top')) + tShip; //我方炮筒top 相对页面
    var lGun = parseFloat($('.gun').css('left')) + lShip; //我方炮筒left 相对页面
    var wGun = parseFloat($('.gun').width()); //我方炮筒宽度
    var hGun = parseFloat($('.gun').height()); //我方炮筒高度
    var tAim = parseFloat($('.aim').css('top')) + tShip; //我方瞄准器top 相对页面
    var lAim = parseFloat($('.aim').css('left')) + lShip; //我方瞄准器left 相对页面
    var wdirBall = parseFloat($('.dirball').width()); //我方瞄准小球宽度
    //var rAim = parseFloat($('.aim').css('borderLeftWidth')); //我方瞄准器半径 等于小球宽度
    var wAim = parseFloat($('.aim').width()) //我方瞄准器宽度
    var hAim = parseFloat($('.aim').height()) //我方瞄准器高度
    var ang = 0; //炮筒旋转角度
    var cmove;
    needBeg();
    //小球滑动事件绑定遮罩层
    $('.ourship').on('touchstart','.mask',function(e){
        //needBeg();
        cmove = true;
        e.preventDefault();
        if($('.ts_fra').is(':visible')){
            $('.ts_fra').hide();
        }
        $('.hand').hide();
        $('.fire_btn').show();
        //cleNeedTimFun();
    })
    $('.ourship').on('touchmove','.mask',function(e) {        
        e.preventDefault();
        if(cmove){
            let _touch = e.originalEvent.targetTouches[0];
            let touchX = _touch.pageX;
            let touchY = _touch.pageY;
            if(is_land){
                let nTop = touchY - tAim - wdirBall - wdirBall / 2;
                //let nTop = touchY - tAim - wdirBall / 2;
                if(nTop < -wdirBall){
                    nTop = -wdirBall;
                }
                if(nTop > hAim){
                    nTop = hAim;
                }
                // if(nTop > hAim){
                //     nTop = hAim
                // }
                // if(nTop < - wdirBall / 2){
                //     nTop = - wdirBall / 2
                // }
                //(wAim/2 - (nLeft+wdirBall/2))2 + (nTop+wdirBall/2) 2 = (wAim / 2 + wdirBall/2)2
                let nLeft =Math.sqrt(Math.pow(hAim / 2 + wdirBall/2,2) - Math.pow(hAim / 2 - (nTop + wdirBall / 2),2)) - wdirBall / 2;
                $('.dirball').css('left',nLeft);
                $('.dirball').css('top', nTop);
                //小球中心相对页面top left
                let tBallCenter = tAim + nTop + wdirBall * 3 / 2;//tAim + nTop + wdirBall / 2;
                let lBallCenter = lAim + nLeft + wdirBall / 2;//lAim + nLeft + wdirBall * 3 / 2;
                //炮筒旋转中心相对于页面top left
                let tGunCenter = tGun + hGun * 50 / 100; //tGun + hGun * 80.55555555 / 100;
                let lGunCenter = lGun + wGun * 80.55555555 / 100;//lGun + wGun * 50 / 100;
                //console.log(tBallCenter,lBallCenter,tGunCenter,lGunCenter)
                //炮筒旋转角度
                ang = Math.atan((tBallCenter - tGunCenter) / (lBallCenter - lGunCenter)) / Math.PI * 180;
                //console.log(ang)
                $('.gun').css('transform',`rotate(${ang}deg)`);
                //根据角度求出子弹垂直和水平偏移量
            }else{
                let nLeft = touchX - lAim - wdirBall - wdirBall / 2;
                //let nTop = touchY - tAim - wdirBall / 2;
                if(nLeft < -wdirBall){
                    nLeft = -wdirBall;
                }
                if(nLeft > wAim){
                    nLeft = wAim;
                }
                // if(nTop > hAim){
                //     nTop = hAim
                // }
                // if(nTop < - wdirBall / 2){
                //     nTop = - wdirBall / 2
                // }
                //(wAim/2 - (nLeft+wdirBall/2))2 + (nTop+wdirBall/2) 2 = (wAim / 2 + wdirBall/2)2
                let nTop =Math.sqrt(Math.pow(wAim / 2 + wdirBall/2,2) - Math.pow(wAim / 2 - (nLeft + wdirBall / 2),2)) - wdirBall / 2;
                $('.dirball').css('left',nLeft);
                $('.dirball').css('top', nTop);
                //小球中心相对页面top left
                let tBallCenter = tAim + nTop + wdirBall / 2;
                let lBallCenter = lAim + nLeft + wdirBall * 3 / 2;
                //炮筒旋转中心相对于页面top left
                let tGunCenter = tGun + hGun * 80.55555555 / 100;
                let lGunCenter = lGun + wGun * 50 / 100;
                //console.log(tBallCenter,lBallCenter,tGunCenter,lGunCenter)
                //炮筒旋转角度
                ang = Math.atan(- (lBallCenter - lGunCenter) / (tBallCenter - tGunCenter)) / Math.PI * 180;
                //console.log(ang)
                $('.gun').css('transform',`rotate(${ang}deg)`);
                //根据角度求出子弹垂直和水平偏移量
            }
        }
    })
    $('.ourship').on('touchend','.mask',function(e){
        e.preventDefault();
        cmove = false;
        needTimFun();        
    })
    //创建敌船类
    class EneShip{
        constructor(){
            this.shipCla = '';
            this.ship = null;
        }
        creShip(config){
            this.ship = $('<div></div>');
            this.shipCla = 'eneship';
            if(is_land){
                this.width = 0.39 * baseSize;
                this.height = 2 * baseSize;
                let start = parseFloat($('.logo').css('left')) + parseFloat($('.logo').width());
                let end = parseFloat(w * 0.63);
                this.top = rm(0,- this.height + parseFloat($('.desship_fra').css('top')));
                this.left = rm(start,end - this.width);
            }else{
                this.width = 2 * baseSize;
                this.height = 0.39 * baseSize;
                let start = parseFloat($('.logo').css('top')) + parseFloat($('.logo').height());
                let end = parseFloat(h * 0.63);
                this.top = rm(start,end - this.height);
                this.left = rm(0,w - this.width);
            }
            this.ship
            .addClass(this.shipCla).css({
                'top': this.top,
                'left': this.left
            })
            .appendTo(map);
        }
        desShip(){
            //var that = this;
            if(this.ship){
                this.ship.addClass('des_ship');
            }   
            $(`<img src="image/boom.gif?${new Date().getTime()}"/>`).addClass('boomsty').appendTo($('.eneship')).fadeOut(1000,function(){
                this.remove(); 
            })
            this.ship.on('animationend webkitAnimationEnd',() => {
                this.ship.fadeOut(1000,() => {
                    this.ship.remove();
                    this.ship = null;
                    shipAry.pop();
                    desshipNum--;
                    $('.desnum').html(desshipNum);
                    if(desshipNum <= 0){
                        desshipNum ==0;
                        vic();
                    }else if(desshipNum > 0 && bullNum > 0){
                        shipAry.push(new EneShip());
                        shipAry[0].creShip();
                    }else if(desshipNum > 0 && bullNum <= 0){
                        def();
                    }
                });
            })
        }
    }
    //创建炮弹
    class Bullet{
        constructor(){
            this.bullet = null;
            this.bullCla = '';
            this.bulStepTime = null;
            this.fal = false;
            this.dro = false; //新增变量控制炮弹落水
            this.cenDis; // 子弹底部距离旋转中心距离
            this.lpyl; //子弹沿炮中心旋转垂直方向相对偏移量
            this.tpyl; //子弹沿炮中心旋转平行方向相对偏移量
            this.spd;//子弹的速度
        }
        creBul(config){
            this.bullCla = 'bullet';
            this.bullet = $('<div></div>');
            if(is_land){
                this.top = tGun + hGun / 2 - 0.25 * baseSize / 2;//tGun - 0.36 * baseSize;
                this.left = lGun - 0.36 * baseSize;//lGun + wGun / 2 - 0.25 * baseSize / 2;
                this.oriLeft = `${(wGun * 80.55555555 / 100) / (0.36 * baseSize) * 100 + 100}%`; //'50%';
                this.oriTop = '50%';//`${(hGun * 80.55555555 / 100) / (0.36 * baseSize) * 100 + 100}%`;
            }else{
                this.top = tGun - 0.36 * baseSize;
                this.left = lGun + wGun / 2 - 0.25 * baseSize / 2;
                this.oriLeft = '50%';
                this.oriTop = `${(hGun * 80.55555555 / 100) / (0.36 * baseSize) * 100 + 100}%`;
            }
            this.ang = ang;
            this.fal = canfal;
            this.dro = false;
            this.spd = 0.1;
            //console.log(this.oriLeft,this.oriTop)
            $(`<img src="image/bullet.gif?${new Date().getTime()}"/>`).addClass('firesty').appendTo($('.gun'))
            .fadeOut(1000,function(){
                this.remove();                            
            })
            this.bullet.addClass(this.bullCla).css({'top':this.top,'left':this.left,'transformOrigin':`${this.oriLeft} ${this.oriTop}`,'transform':`rotate(${this.ang}deg)`}).appendTo(map);
            //console.log(this.oriTop)
            if(is_land){
                this.cenDis = parseFloat(this.bullet.width()) * parseFloat(this.oriLeft) / 100 + parseFloat(this.bullet.width()) / 2;
                this.lpyl = this.cenDis - this.cenDis * Math.cos(this.ang * Math.PI / 180); //  left 值比实际值小 值为正
                this.tpyl = -this.cenDis * Math.sin(this.ang * Math.PI / 180); //旋转角度为正 top 值比实际值大 值为正值
            }else{
                this.cenDis = parseFloat(this.bullet.height()) * parseFloat(this.oriTop) / 100 + parseFloat(this.bullet.height()) / 2;
                //console.log(this.ang);
                //console.log(Math.sin(this.ang));
                //console.log(this.cenDis);
                this.lpyl = this.cenDis * Math.sin(this.ang * Math.PI / 180); //旋转角度为正 left值比实际值小 值为正值
                this.tpyl = this.cenDis - this.cenDis * Math.cos(this.ang * Math.PI / 180); //top 值比实际值小 值为正 
                //console.log(this.lpyl,this.tpyl); 定位值 + 偏移量 = 实际值
            }
            this.bulStep();
        }
        bulStep(){
            this.bulStepTime = setInterval(() => {
                if(!this.fal){
                    if(this.bullet){
                        var that = this;
                        if(is_land){
                            this.bullet.css('left',function(index,value){
                                return parseFloat(value) - that.spd * Math.cos(that.ang * Math.PI / 180) * baseSize;
                            })
                            this.bullet.css('top',function(index,value){
                                return parseFloat(value) - that.spd * Math.sin(that.ang * Math.PI / 180) * baseSize;
                            })
                        }else{
                            this.bullet.css('left',function(index,value){
                                return parseFloat(value) + that.spd * Math.sin(that.ang * Math.PI / 180) * baseSize;
                            })
                            this.bullet.css('top',function(index,value){
                                return parseFloat(value) - that.spd * Math.cos(that.ang * Math.PI / 180) * baseSize;
                            })
                        }
                        if(this.bullet){
                            let nL = parseFloat(this.bullet.css('left'));
                            let nT = parseFloat(this.bullet.css('top'));
                            // console.log(nL,nL + this.lpyl)
                            if(is_land){
                                // if(nL + this.lpyl <= parseFloat(this.bullet.height()) || nL + this.lpyl >= w - parseFloat(this.bullet.height())){
                                //     this.dro = true;
                                //     this.bulFal();
                                // }else if(nT + this.tpyl <= 0 || nT + this.tpyl >= h - parseFloat(this.bullet.height())){
                                //     this.dro = true;
                                //     this.bulFal();
                                if(nL <= 0 && nL > w){
                                    if(this.buller){
                                        this.bullet.remove();
                                    }
                                }else if(nT <= 0 && nT > h){
                                    if(this.buller){
                                        this.bullet.remove();
                                    }
                                }else if($('.eneship') && nL + this.lpyl <= parseFloat($('.eneship').css('left'))){
                                    this.dro = true;
                                    this.bulFal();
                                }
                            }else{
                                // if(nL + this.lpyl <= parseFloat(this.bullet.height()) || nL + this.lpyl >= w - parseFloat(this.bullet.height())){
                                //     this.dro = true;
                                //     this.bulFal();
                                // }else if(nT + this.tpyl <= 0 || nT + this.tpyl >= h - parseFloat(this.bullet.height())){
                                //     this.dro = true;
                                //     this.bulFal();
                                if(nL <= 0 && nL > w){
                                    if(this.buller){
                                        this.bullet.remove();
                                    }
                                }else if(nT <= 0 && nT > h){
                                    if(this.buller){
                                        this.bullet.remove();
                                    }
                                }else if($('.eneship') && nT + this.tpyl <= parseFloat($('.eneship').css('top'))){
                                    this.dro = true;
                                    this.bulFal();
                                }     
                            }                    
                        }
                    }
                    this.bulPz();
                }else{
                    let tGunCenter,lGunCenter,tStaEne,lStaEne,tEndEne,lEndEne,staAng,endAng;
                    if(is_land){
                        //炮筒旋转中心相对于页面top left
                        tGunCenter = tGun + hGun * 50 / 100;
                        lGunCenter = lGun + wGun * 80.55555555 / 100;
                        //敌船上下底部top left
                        tStaEne = parseFloat(shipAry[0].ship.css('top')) + parseFloat(shipAry[0].ship.height());
                        lStaEne = parseFloat(shipAry[0].ship.css('left')) + parseFloat(shipAry[0].ship.width());
                        tEndEne = parseFloat(shipAry[0].ship.css('top'));
                        lEndEne = parseFloat(shipAry[0].ship.css('left')) + parseFloat(shipAry[0].ship.width());
                        //如果开火为miss需计算角度
                        staAng = Math.atan((tGunCenter - tStaEne) / (lGunCenter - lStaEne)) / Math.PI * 180;
                        endAng = Math.atan((tGunCenter - tEndEne) / (lGunCenter - lEndEne)) / Math.PI * 180;  
                    }else{
                        //炮筒旋转中心相对于页面top left
                        tGunCenter = tGun + hGun * 80.55555555 / 100;
                        lGunCenter = lGun + wGun * 50 / 100;
                        //敌船左右底部top left
                        tStaEne = parseFloat(shipAry[0].ship.css('top')) + parseFloat(shipAry[0].ship.height());
                        lStaEne = parseFloat(shipAry[0].ship.css('left'));
                        tEndEne = parseFloat(shipAry[0].ship.css('top')) + parseFloat(shipAry[0].ship.height());
                        lEndEne = parseFloat(shipAry[0].ship.css('left')) + parseFloat(shipAry[0].ship.width());
                        //如果开火为miss需计算角度
                        staAng = Math.atan(- (lGunCenter - lStaEne) / (tGunCenter - tStaEne)) / Math.PI * 180;
                        endAng = Math.atan(- (lGunCenter - lEndEne) / (tGunCenter - tEndEne)) / Math.PI * 180;   
                    }
                    if(this.ang >= staAng && this.ang <= endAng){
                        if(this.bullet){
                            var that = this;
                            if(is_land){
                                this.bullet.css('left',function(index,value){
                                    return parseFloat(value) - that.spd * Math.cos(that.ang * Math.PI / 180) * baseSize;
                                })
                                this.bullet.css('top',function(index,value){
                                    return parseFloat(value) - that.spd * Math.sin(that.ang * Math.PI / 180) * baseSize;
                                })
                            }else{
                                this.bullet.css('left',function(index,value){
                                    return parseFloat(value) + that.spd * Math.sin(that.ang * Math.PI / 180) * baseSize;
                                })
                                this.bullet.css('top',function(index,value){
                                    return parseFloat(value) - that.spd * Math.cos(that.ang * Math.PI / 180) * baseSize;
                                })
                            }
                            if(this.bullet){
                                let nL = parseFloat(this.bullet.css('left'));
                                let nT = parseFloat(this.bullet.css('top'));
                                if(is_land){
                                    if(nL + this.lpyl <= lStaEne + (lGun - lStaEne) / 8){
                                        this.bulFal();
                                    }   
                                }else{
                                    if(nT + this.tpyl <= tStaEne + (tGun - tStaEne) / 8){
                                        this.bulFal();
                                    }   
                                }                                                                 
                            }  
                        }
                    }else{
                        if(this.bullet){
                            let that = this;
                            if(is_land){
                                this.bullet.css('left',function(index,value){
                                    return parseFloat(value) - that.spd * Math.cos(that.ang * Math.PI / 180) * baseSize;
                                })
                                this.bullet.css('top',function(index,value){
                                    return parseFloat(value) - that.spd * Math.sin(that.ang * Math.PI / 180) * baseSize;
                                })
                            }else{
                                this.bullet.css('left',function(index,value){
                                    return parseFloat(value) + that.spd * Math.sin(that.ang * Math.PI / 180) * baseSize;
                                })
                                this.bullet.css('top',function(index,value){
                                    return parseFloat(value) - that.spd * Math.cos(that.ang * Math.PI / 180) * baseSize;
                                })
                            }
                            if(this.bullet){
                                let nL = parseFloat(this.bullet.css('left'));
                                let nT = parseFloat(this.bullet.css('top'));
                                // if(nT + this.tpyl <= this.top - Math.abs(this.left /  Math.tan(this.ang * Math.PI / 180) /2)){
                                //     // this.top - this.left /  Math.tan(this.ang * Math.PI / 180) /2
                                //     this.bulFal();
                                // }
                                if(is_land){
                                    // if(nL + this.lpyl <= parseFloat(this.bullet.height()) || nL + this.lpyl >= w - parseFloat(this.bullet.height())){
                                    //     this.dro = true;
                                    //     this.bulFal();
                                    // }else if(nT + this.tpyl <= 0 || nT + this.tpyl >= h - parseFloat(this.bullet.height())){
                                    //     this.dro = true;
                                    //     this.bulFal();
                                    if(nL <= 0 && nL > w){
                                        if(this.buller){
                                            this.bullet.remove();
                                        }
                                    }else if(nT <= 0 && nT > h){
                                        if(this.buller){
                                            this.bullet.remove();
                                        }
                                    }else if($('.eneship') && nL + this.lpyl <= parseFloat($('.eneship').css('left'))){
                                        this.dro = true;
                                        this.bulFal();
                                    }
                                }else{
                                    // if(nL + this.lpyl <= parseFloat(this.bullet.height()) || nL + this.lpyl >= w - parseFloat(this.bullet.height())){
                                    //     this.dro = true;
                                    //     this.bulFal();
                                    // }else if(nT + this.tpyl <= 0 || nT + this.tpyl >= h - parseFloat(this.bullet.height())){
                                    //     this.dro = true;
                                    //     this.bulFal();
                                    if(nL <= 0 && nL > w){
                                        if(this.buller){
                                            this.bullet.remove();
                                        }
                                    }else if(nT <= 0 && nT > h){
                                        if(this.buller){
                                            this.bullet.remove();
                                        }
                                    }else if($('.eneship') && nT + this.tpyl <= parseFloat($('.eneship').css('top'))){
                                        this.dro = true;
                                        this.bulFal();
                                    }
                                }                                  
                            }  
                        }
                    }
                }
            },10)
        }
        bulPz(){
            if(shipAry[0] && this.bullet){
                if( parseFloat(this.bullet.css('left')) + this.bullet.width() + this.lpyl > parseFloat(shipAry[0].ship.css('left')) && parseFloat(this.bullet.css('left')) + this.lpyl < parseFloat(shipAry[0].ship.css('left')) +shipAry[0].ship.width() && parseFloat(this.bullet.css('top')) + this.bullet.height() + this.tpyl > parseFloat(shipAry[0].ship.css('top')) && parseFloat(this.bullet.css('top')) + this.tpyl < parseFloat(shipAry[0].ship.css('top')) +shipAry[0].ship.height()){
                    this.bullet.remove();
                    this.bullet = null;
                    clearInterval(this.bulStepTime);
                    shipAry[0].desShip();
                    canPre = true;
                    needTimFun();
                }
            }
        }
        bulFal(){
            this.fal = canfal;
            //let that = this;
            if((this.fal || this.dro) && this.bullet){
                canPre = true;
                needTimFun();
                // let nL = parseFloat(this.bullet.css('left'))// - 0.125 * w / 7.5;
                // let nT = parseFloat(this.bullet.css('top'))// - 0.36 * h / 13.34;
                clearInterval(this.bulStepTime);
                // if(this.bullet){
                //     this.bullet.remove();
                //     this.bullet = null;   
                // } 
                if(is_land){
                    $(`<img src="image/water.gif?${new Date().getTime()}"/>`).addClass('watsty').css({
                        'top': '-100%',
                        'left': 0,
                        'transform': `rotate(${this.ang}deg)`
                    }).appendTo(this.bullet)
                }else{
                    $(`<img src="image/water.gif?${new Date().getTime()}"/>`).addClass('watsty').css({
                        'top': 0,
                        'left': 0,
                        'transform': `rotate(${this.ang}deg)`
                    }).appendTo(this.bullet)
                }
                // .fadeOut(1000,function(){
                //     this.remove();
                // })
                if(this.bullet){
                    this.bullet.fadeOut(800,()=>{
                        this.bullet.remove();
                        this.bullet = null;
                        if(bullNum <= 0 && desshipNum > 0){
                            def();
                        }
                    })  
                } 
            }
        }
    }
    //开火按钮绑定事件
    $('.fire_btn').on('touchstart',function(e){
        e.preventDefault();
        if(bullNum >= 1 && canPre){
            if($('.fir_hand').is(':visible')){
                $('.fir_hand').hide();
            }
            canPre = false;
            cleNeedTimFun()
            needAngle = parseFloat($('.needle').get(0).style.transform.slice(7));
            if(needAngle >= 0 && needAngle <= 36){
                canfal = false;
            }else if(needAngle >= 144 && needAngle <= 216){
                canfal = false;
            }else if(needAngle >= 324 && needAngle <= 360){
                canfal = false;
            }else{
                canfal = true;
            }
            //console.log(canfal);
            var bul = new Bullet();
            bul.creBul();
            bullNum--;
            // if(bullNum <= 0 && desshipNum > 0){
            //     def();
            // }
            $('.bulletnum').html(bullNum);
        }
    })
    shipAry.push(new EneShip());
    shipAry[0].creShip();
    //指针旋转事件
    function needRot(){
        let spd = 12 - desshipNum;
        if(spd >= 6){
            spd =6;
        } 
        let needAng = parseFloat($('.needle').get(0).style.transform.slice(7));
        needAng += spd;
        if(needAng >= 360){
            needAng =0;
        }
        $('.needle').get(0).style.transform = `rotate(${needAng}deg)`;
        //console.log($('.needle').get(0).style.transform.slice(7))
    }
    //指针旋转定时器函数
    function needTimFun(){
        if(needAry.length == 0){
            //needBeg();
            needAry.push(setInterval(()=>{
                needRot()
            },10))
        }
    }
    //清除指针旋转定时器函数
    function cleNeedTimFun(){
        if(needAry.length > 0){ 
            clearInterval(needAry[0]);
            needAry.pop();
        }
    }
    //指针重置函数
    function needBeg(){
        $('.needle').get(0).style.transform = `rotate(270deg)`; 
    }
    //随机生成数
    function rm(m,n) {
        return Math.random() * (n-m) + m;
    }
    //开火按钮加入文字
    var hitfont = ['H','I','T']
    for(let i = 0;i < 6;i++){
        if(i < 3){
            $(`<div class="fontsty hitsty">${hitfont[i]}</div>`).css({
                'transform':`rotate(${-22 + i * 22}deg)`   
            }).appendTo($('.fire_btn'));
        }else{
            $(`<div class="fontsty hitsty">${hitfont[i - 3]}</div>`).css({
                'transform':`rotate(${-22 + (i - 3) * 22 + 180}deg)`   
            }).appendTo($('.fire_btn'));
        }
    }
    var misfont = ['M','I','S','S'];
    for(let i = 0;i < 8;i++){
        if(i < 4){
            $(`<div class="fontsty missty">${misfont[i]}</div>`).css({
                'transform':`rotate(${-118 + i * 21}deg)`   
            }).appendTo($('.fire_btn'));
        }else{
            $(`<div class="fontsty missty">${misfont[i - 4]}</div>`).css({
                'transform':`rotate(${-118 + (i - 4) * 21 + 180}deg)`   
            }).appendTo($('.fire_btn'));
        }
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