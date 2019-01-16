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
    var map = $('#map');
    var w = map.width();
    var h = map.height();
    //console.log(w,h)
    //全局创建对象分别接受三个位置己方的船
    var ourShips = {};
    //接受三个位置地方的船
    var eneShips = {};
    //钻石数量
    var dia = 10;
    //制造敌船
    var creEneTime = [];
    //钻石增长
    var diaTime;
    //创建战船类
    //游戏时间
    var gameTime;
    class OurShip{
        constructor(){
            this.lv = 1;
            this.shipcla = '';
            this.fycla = '';
            this.hp = 100;
            this.ship = null;
            this.att  = 10;
            this.hpFra = null;
            this.uparrow = null;
            this.fire = null;
            this.uptx = null;
            this.attTime = null;
            this.watTime = null;
            this.watDiaTime = null;
            this.canUp = false;
        }
        //创造船
        creShip(config) {
            let attAry = [17, 25, 40];
            let fylAry = [1, 3, 3];
            this.lv = config.lv || 1;
            this.shipcla = `our_ship${parseInt(this.lv)}`;
            this.fycla = config.fycla;
            this.hp = 100;
            this.att  = attAry[parseInt(this.lv) - 1];
            this.fyl = fylAry[parseInt(this.lv) - 1];
            this.canUp = false;
            this.ship = $('<div></div>');
            this.hpFra = $('<div></div>').addClass('our_hpfra').append('<div class="our_hp"></div>')
            this.uparrow = $('<div></div>').addClass('our_uparrow')
            switch(this.lv){
                case 1:
                    dia -= 10;
                    this.ship.addClass(this.shipcla).addClass(this.fycla).append(this.hpFra).append(this.uparrow).appendTo(map);
                    break;
                case 2:
                    this.ship.addClass(this.shipcla).addClass(this.fycla).append(this.hpFra).append(this.uparrow)
        .appendTo(map);
                    break;
                case 3:
                    this.ship.addClass(this.shipcla).addClass(this.fycla).append(this.hpFra).append(this.uparrow)
        .appendTo(map);
                break;
                default:
                    break;
            }
            this.watShip();
            this.watDia();
            this.lvup();      
        }
        //监听钻石
        watDia(){
            this.watDiaTime = setInterval(() => {
                switch(this.lv){
                    case 1:
                    if(dia >= 40){
                        if(this.ship){
                            this.ship.find('.our_uparrow').show();
                            this.canUp = true;
                        }
                    }else{
                        //if(!this.ship.children('.our_uparrow').is(':hidden')){
                        this.ship.children('.our_uparrow').hide();
                        this.canUp = false;
                        //}
                    }
                    break;
                    case 2:
                    if(dia >= 120){
                        if(this.ship){
                            this.ship.find('.our_uparrow').show();
                            this.canUp = true;
                        }
                    }else{
                        //if(!this.ship.children('.our_uparrow').is(':hidden')){
                        this.ship.children('.our_uparrow').hide();
                        this.canUp = false;
                        //}
                    }
                    break;
                    default:
                        this.ship.children('.our_uparrow').hide();
                        this.canUp = false;
                    break;
                }
            },500)
        }
        //升级
        lvup(){
            this.ship.on('click',()=>{
                if(this.canUp){
                    switch(this.lv){
                        case 1:
                            dia -= 40;
                            break;
                        case 2:
                            dia -= 120;
                            break;
                        default:
                            break;
                    }
                    //console.log(this)
                    this.ship.children('.our_uparrow').hide();
                    this.canUp = false;
                    var that = this;
                    clearInterval(this.attTime);
                    clearInterval(this.watDiaTime);
                    clearInterval(this.watTime);
                    $(`.fy_fra${this.fycla.slice(-1)}`).hide();
                    ourShips[that.fycla] = (ourShips[that.fycla] === undefined?[]:ourShips[that.fycla]).concat(new OurShip());
                    ourShips[that.fycla][ourShips[that.fycla].length - 1].creShip({fycla: that.fycla,lv: ++that.lv})
                    $(`<img src="image/shengji.gif?${new Date().getTime()}"/>`).addClass('our_uptx').appendTo(this.ship).fadeOut(500,function(){
                        this.remove();
                        if(that.ship){
                            that.ship.remove();
                            that.ship = null;
                        }
                    })
                }
            })
        }
        watShip(){
            this.watTime = setInterval(()=>{
                if(eneShips[`attwz${this.fycla.slice(-1)}`]){
                    clearInterval(this.watTime)
                    this.attShip();
                }
            },100)
        }
        attShip(){
            for(var i = 0;i < eneShips[`attwz${this.fycla.slice(-1)}`].length;i++){
                if(eneShips[`attwz${this.fycla.slice(-1)}`][i].hp > 0){
                    //let that = this;
                    this.attTime = setInterval(()=>{
                        $(`<img src="image/kaipao.gif?${new Date().getTime()}"/>`).addClass('our_fire').appendTo(this.ship).fadeOut(1000,function(){
                            this.remove();                            
                        })
                        eneShips[`attwz${this.fycla.slice(-1)}`][i].hp -= this.att;
                        eneShips[`attwz${this.fycla.slice(-1)}`][i].beAtt();
                        if(eneShips[`attwz${this.fycla.slice(-1)}`][i].hp <= 0){
                            clearInterval(this.attTime)
                            if(this.ship){
                                this.watShip();
                            }
                        }//else{
                            // $(`<img src="image/kaipao.gif?${new Date().getTime()}"/>`).addClass('our_fire').appendTo(this.ship).fadeOut(1000,function(){
                            //     this.remove();                            
                            // })
                        //}
                    },1000)
                    break;
                }
            }
            if(i == eneShips[`attwz${this.fycla.slice(-1)}`].length){
                this.watShip();
            }   
        }
        beAtt(){
            if(this.hp > 0 && this.ship){
                this.ship.find('.our_hp').animate({width:`${this.hp / 100 * 1.42}rem`})
            }
            if(this.hp <= 0) {
                if(this.ship){
                    this.ship.unbind('click');
                    clearInterval(this.attTime);
                    clearInterval(this.watDiaTime);
                    //this.canUp = false;
                    clearInterval(this.watTime);
                    this.ship.remove();
                    this.ship = null;
                    if(!ourShips[this.fycla][ourShips[this.fycla].length - 1].ship){
                        $(`.fy_fra${this.fycla.slice(-1)}`).show();
                    }
                }
                
                // if(this.ship){
                //     this.ship.fadeOut(100,()=>{
                //         clearInterval(this.attTime);
                //         clearInterval(this.watDiaTime);
                //         clearInterval(this.watTime);
                //         if(this.ship){
                //             this.ship.remove();
                //             this.ship = null;
                //             $(`.fy_fra${this.fycla.slice(-1)}`).show();
                //             }
                //     });
                // }
            }
        }
    }
    //创建敌船类
    class EneShip{
        constructor(){
            this.shipcla = '';
            this.attcla = '';
            this.hp = 100;
            this.ship = null;
            this.hpFra = null;
            this.shipStepTime = null;
            this.top = '';
            this.left = '';
            this.num = 0;
            this.att = 10;
            this.watTime = null;
            this.attTime = null;
        }
        creShip(config) {
            this.shipcla = 'ene_ship';
            this.attcla = config.attcla;
            this.num = config.num;
            //this.top = - (this.num % 5 + 1) * 2.45;
            if(is_land){
                this.left = - 2.45;
            }else{
                this.top = - 2.45;
            }
            this.ship= $('<div></div>');
            this.hp =100;
            this.att = 10;
            this.hpFra = $('<div></div>').addClass('ene_hpfra').append('<div class="ene_hp"></div>');
            if(is_land){
                this.ship.addClass(this.shipcla).addClass(this.attcla).css({'left':`${this.left}rem`})
            .append(this.hpFra)
            .appendTo(map);
            }else{
                this.ship.addClass(this.shipcla).addClass(this.attcla).css({'top':`${this.top}rem`})
            .append(this.hpFra)
            .appendTo(map);
            }
            this.shipStep();
            this.watShip();
        }
        shipStep() {
            this.shipStepTime = setInterval(()=>{
                if(this.ship){
                    if(is_land){
                        this.ship.animate({left: '+=0.077rem'},100,'linear',()=>{
                            if(this.ship){
                                let nLeft = parseInt(this.ship.css('left'));
                                if(nLeft > 0.69 * w - 2.45 * baseSize){
                                    this.ship.stop();
                                    clearInterval(gameTime);
                                    endClear();
                                    def();
                                }
                            }
                        });
                    }else{
                        this.ship.animate({top: '+=0.077rem'},100,'linear',()=>{
                            if(this.ship){
                                let nTop = parseInt(this.ship.css('top'));
                                if(nTop > 0.69 * h - 2.45 * baseSize){
                                    this.ship.stop();
                                    clearInterval(gameTime);
                                    endClear();
                                    def();
                                }
                            }
                        });
                    }
                    // this.ship.css("top", function(index, value) {return parseFloat(value) + 0.46;});
                    // if(this.hp > 0){
                    //     let nTop = parseInt(this.ship.css('top'))
                    //     if(nTop > 0.69 * h -2.45 * baseSize){
                    //     //if(nTop > 6.83 * baseSize * 667 / h){
                    //         clearInterval(gameTime);
                    //         endClear();
                    //         def();
                    //     }   
                    //     if(nTop >= h){
                    //         this.ship.remove();
                    //         this.ship = null; 
                    //     }
                    // }
                }
            },100)
        }
        beAtt(){
            //var that= this;
            $(`<img src="image/baozha.gif?${new Date().getTime()}"/>`)
            .addClass('ene_boom').appendTo(this.ship)
            .fadeOut(700,function(){
                this.remove();
            })
            if(this.ship){
                //console.log(this.hp)
                this.ship.find('.ene_hp').animate({width:`${this.hp / 100 * 1.42}rem`})
            }
            if(this.hp <= 0) {
                clearInterval(this.attTime)
                clearInterval(this.watTime)
                clearInterval(this.shipStepTime)
                if(this.ship){
                    // this.ship.fadeOut(100,()=>{
                        this.ship.remove();
                        this.ship = null;
                    // });
                }
            }      
        }
        watShip(){
            this.watTime = setInterval(()=>{
                for(var k = 0;k < eneShips[`attwz${this.attcla.slice(-1)}`].length;k++){
                    if(eneShips[`attwz${this.attcla.slice(-1)}`][k].ship){
                        break;
                    }
                }
                if(this.num == k){
                    if(ourShips[`fywz${this.attcla.slice(-1)}`]){
                        clearInterval(this.watTime)
                        this.attShip();
                    }
                }
            },100)
        }
        attShip(){
            for(var i = ourShips[`fywz${this.attcla.slice(-1)}`].length - 1;i >= 0;i--){
                if(ourShips[`fywz${this.attcla.slice(-1)}`][i].hp > 0){
                    this.attTime = setInterval(()=>{
                        ourShips[`fywz${this.attcla.slice(-1)}`][i].hp -= this.att;
                        ourShips[`fywz${this.attcla.slice(-1)}`][i].hp += ourShips[`fywz${this.attcla.slice(-1)}`][i].fyl;
                        ourShips[`fywz${this.attcla.slice(-1)}`][i].beAtt();
                        if(ourShips[`fywz${this.attcla.slice(-1)}`][i].hp <= 0 || ourShips[`fywz${this.attcla.slice(-1)}`][i].ship == null){
                            clearInterval(this.attTime)
                            this.watShip();
                        }
                    },1000)
                    break;
                }
            }
            if(i == -1){
                this.watShip();
            } 
            
        } 
    }
    //防御框绑定事件
    $('.fy_fras').on('click','.fy_fra',function(){
        if($.isEmptyObject(ourShips)){
            $('.ts_fra').hide();
            gameTime = setTimeout(()=>{
                clearInterval(gameTime);
                endClear();
                vic();
            },60000)
            //钻石增长
            diaTime = setInterval(() => {
                dia += 15;
                $('.dia_num').html(dia);
            },1000)
        }
        let fyind = $(this).index() + 1;
        if(dia >= 10){
            ourShips[`fywz${fyind}`] = (ourShips[`fywz${fyind}`] === undefined?[]:ourShips[`fywz${fyind}`]).concat(new OurShip());
            ourShips[`fywz${fyind}`][ourShips[`fywz${fyind}`].length - 1].creShip({fycla: `fywz${fyind}`})
            $(this).hide()
            if(eneShips[`attwz${fyind}`] === undefined){
                var i =0;
                creEneTime[fyind] = setInterval(()=>{
                    if(eneShips[`attwz${fyind}`] === undefined){
                        eneShips[`attwz${fyind}`] = [].concat(new EneShip());
                        eneShips[`attwz${fyind}`][eneShips[`attwz${fyind}`].length - 1].creShip({attcla: `attwz${fyind}`,num: i});
                        //eneShips[`attwz${fyind}`][eneShips[`attwz${fyind}`].length - 1].shipStep();
                        i++;
                    }else{
                        var maxNum = 0;
                        for(let j = 0;j < eneShips[`attwz${fyind}`].length; j++){
                            if(eneShips[`attwz${fyind}`][j].hp > 0){
                                maxNum++;
                            }
                        }
                        if(is_land){
                            if(maxNum < 4 && maxNum > 0 && parseInt(eneShips[`attwz${fyind}`][eneShips[`attwz${fyind}`].length - 1].ship.css('left')) >= 0){
                                eneShips[`attwz${fyind}`] = eneShips[`attwz${fyind}`].concat(new EneShip());
                                eneShips[`attwz${fyind}`][eneShips[`attwz${fyind}`].length - 1].creShip({attcla: `attwz${fyind}`,num: i});
                                i++;
                            }else if(maxNum <= 0){
                                eneShips[`attwz${fyind}`] = eneShips[`attwz${fyind}`].concat(new EneShip());
                                eneShips[`attwz${fyind}`][eneShips[`attwz${fyind}`].length - 1].creShip({attcla: `attwz${fyind}`,num: i});
                                i++;
                            }       
                        }else{
                            if(maxNum < 4 && maxNum > 0 && parseInt(eneShips[`attwz${fyind}`][eneShips[`attwz${fyind}`].length - 1].ship.css('top')) >= 0){
                                eneShips[`attwz${fyind}`] = eneShips[`attwz${fyind}`].concat(new EneShip());
                                eneShips[`attwz${fyind}`][eneShips[`attwz${fyind}`].length - 1].creShip({attcla: `attwz${fyind}`,num: i});
                                i++;
                            }else if(maxNum <= 0){
                                eneShips[`attwz${fyind}`] = eneShips[`attwz${fyind}`].concat(new EneShip());
                                eneShips[`attwz${fyind}`][eneShips[`attwz${fyind}`].length - 1].creShip({attcla: `attwz${fyind}`,num: i});
                                i++;
                            } 
                        }              
                    }
                    // var maxNum = 0;
                    // for(var j = 0;j < eneShips[`attwz${fyind}`].length; j++){
                    //     if(eneShips[`attwz${fyind}`][j].ship){
                    //         maxNum++;
                    //     }
                    // }
                    // eneShips[`attwz${fyind}`] =(eneShips[`attwz${fyind}`] === undefined?[]:eneShips[`attwz${fyind}`]).concat(new EneShip());
                    
                    // eneShips[`attwz${fyind}`][eneShips[`attwz${fyind}`].length - 1].creShip({attcla: `attwz${fyind}`,num: i});
                    // i++;
                },1000)
            }
        }
    })
    
    //绑定开始事件
    $('.btn_begin').on('click',function() {
        $(this).hide();
        $('.ts_fra').show();
        $('.fy_fra').show();
    })
    //结束清除
    function endClear(){
        clearInterval(diaTime);
        clearInterval(creEneTime[1]);
        clearInterval(creEneTime[2]);
        clearInterval(creEneTime[3]);
        for(let attCla in eneShips){
            for(let j = 0;j < eneShips[attCla].length;j++){
                if(eneShips[attCla][j]){
                    clearInterval(eneShips[attCla][j].attTime)
                    clearInterval(eneShips[attCla][j].watTime)
                    clearInterval(eneShips[attCla][j].shipStepTime)
                }
            }
        }
        for(let fyCla in ourShips){
            for(let m = 0;m < ourShips[fyCla].length;m++){
                if(ourShips[fyCla][m].ship){
                    ourShips[fyCla][m].ship.unbind('click');
                    clearInterval(ourShips[fyCla][m].attTime)
                    clearInterval(ourShips[fyCla][m].watTime)
                    clearInterval(ourShips[fyCla][m].watDiaTime)
                }
            }
        }
        $('.fy_fra').hide();
        // $('.our_uparrow').hide();
    }
    //成功
    function vic(){
        setTimeout(function(){
            $("#map").append("<a href='javascript:void(0)' class='advertising advic down' style='z-index:100'></a>");
        },1000)
    }
    //失败
    function def(){
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