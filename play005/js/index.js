$(function () {
    var section = $('#section');
    var time=$(".time");
    var num=2;  //倒计时初始值
    var bodywidth = $('body').width();
    let bodyheight=$('body').height();
    var distancenum=$("#distancsnum");
    var timer;
    var cointimer;
    var gametimer;
    var pollTimer;
    var distanceInterval;
    var capsule=document.querySelector("#capsule");
    var classs=["watermineone","waterminethree","waterminefour","dead"];
    var charSheet=['image/watermine1.png',
        'image/watermine3.png',
        'image/watermine4.png',
        'image/dead.png'
    ];
    var shuzu=[];
    var coinarr=[];
    $("#begin").click(function () {
           polling();
           $("#begin").remove();
       //   数字倒计时
        var timeinterval=setInterval(function () {
            $("#capsule").addClass("capsuleanimate");
            time.css("opacity","0");
            if(num<0){
                time.remove();
                clearInterval(timeinterval);
            }
            time.eq(num).addClass("timeanimate");
            num--;
        },1000);
      });
    //定时器加在背景滚动的身上
    let yuansugeshus=0;
    var coininsert;
    var insertcoinnum=0;
  coininsert=setInterval(function () {
      let backgroundPositionYY;
          if(is_land==false){
          backgroundPositionYY=section.css("backgroundPositionY").slice(0,-1);
      }else if(is_land==true){
              backgroundPositionYY=section.css("backgroundPositionX").slice(1,-1);
          }
          if(backgroundPositionYY>=300){
              insertcoinnum++;
              let coinlefts=`${(bodywidth-80)* Math.random()}px`;
              let cointops=`${(bodyheight-80)*Math.random()}px`;
              if(is_land==false){
                  $("body").append(`<div id="gold" coinnum="coinnum`+insertcoinnum+`" style="top: 0;left:`+coinlefts+`;" class="coindropanimates"></div>`);
              }else if(is_land==true){
                  $("body").append(`<div id="gold" coinnum="coinnum`+insertcoinnum+`" style="right: 0;top:`+cointops+`;" class="coindropanimates"></div>`);
              }
          }
    },4000);
  distanceInterval=setInterval(function () {
       if($("#times").children().length>0){
           return false;
       }else {
           let backgroundPositionY;
           if(is_land==false){
               backgroundPositionY=section.css("backgroundPositionY").slice(0,-1);
           }else if(is_land==true){
               backgroundPositionY=section.css("backgroundPositionX").slice(1,-1);
           }
           if(backgroundPositionY>=3600){
               clearInterval(gametimer);
               distancenum.html(340);
               clearTimeout(cointimer);
               clearTimeout(pollTimer);
               clearInterval(distanceInterval);
               clearInterval(coininsert);
               capsule.removeEventListener("touchstart", dragStart,false);
               capsule.removeEventListener("touchmove", dragMove,false);
               capsule.removeEventListener("touchend", dragEnd,false);
               $("#gold").remove();
               $("div[id^='yuansunum']").remove();
               $("body").append(`<a href="javascript:void(0)" class="downloads bannerfail down"></a>`);
           }
           else{
               let distancenumy=((backgroundPositionY-200)/10).toFixed(2);
               distancenum.html(distancenumy);
           }
       }
   },100);

    var capsule=document.getElementById("capsule");

    //背景图动
    var x =0;
    function polling() {
        x += 25;
        if(is_land==false){
            section.animate({
               'background-position-y': x + '%',
            },500,'linear');
        }else if(is_land==true){
            section.animate({
                'background-position-x': -x + '%',
            },500,'linear');
        }
       pollTimer=setTimeout(polling, 500);
    }

    var yuansunum=0;
    let pengzhuangnum=[];
  gametimer=setInterval(function () {
        if($("#times").children().length>0){
            return false;
        }else {
            yuansunum++;
           let xiabiao=Math.floor(Math.random()*charSheet.length);
          let lefts=`${(bodywidth-100)* Math.random()}px`;
          let tops=`${(bodyheight-100)*Math.random()}px`;
            let desbox;
            if(is_land==false){
                desbox=$(`<div id="yuansunum`+yuansunum+`" class="`+classs[xiabiao]+`"></div>`).css({"backgroundImage":`url(`+charSheet[xiabiao]+`)`,top:0,left:lefts});
            }else if(is_land==true){
                desbox=$(`<div id="yuansunum`+yuansunum+`" class="`+classs[xiabiao]+`"></div>`).css({"backgroundImage":`url(`+charSheet[xiabiao]+`)`,right:0,top:tops});
            }
            section.append(desbox);
            function drop(){
                if(is_land==false){
                    desbox.animate({
                        'top': '100%',
                    }, 4000, 'linear',function () {
                        desbox.remove();
                    });
                }else if(is_land==true){
                    desbox.animate({
                        'right': '100%',
                    }, 4000, 'linear',function () {
                        desbox.remove();
                    });
                }
                timer=setTimeout(drop, 4000);
            }
            drop();
            drag();
            yuansugeshus++;
            let sorti=document.querySelector(`#yuansunum${yuansugeshus}`);
            shuzu.push(sorti);
            for(var j=0;j<shuzu.length;j++){
                var impacts=impact(capsule,shuzu[j]);
                if(impacts!=false){
                    let ids=impacts.getAttribute("id");
                    let indexsof=pengzhuangnum.indexOf(ids);
                    if(indexsof===-1){
                        pengzhuangnum.push(ids);
                        if(pengzhuangnum.length==1){
                            $("#"+pengzhuangnum[0]).append(`<img src="image/bossbigexplore.gif" alt="" class="explore">`);
                            $("#capsulecoat").css({opacity:0});
                        }
                        else if(pengzhuangnum.length>=2){
                            clearTimeout(cointimer);
                            clearTimeout(pollTimer);
                            clearTimeout(timer);
                            clearInterval(distanceInterval);
                            clearInterval(coininsert);
                            clearInterval(gametimer);
                            $("#capsule").remove();
                            capsule.removeEventListener("touchstart", dragStart,false);
                            capsule.removeEventListener("touchmove", dragMove,false);
                            capsule.removeEventListener("touchend", dragEnd,false);
                            $("#"+pengzhuangnum[1]).append(`<img src="image/bossbigexplore.gif" alt="" class="explore">`).addClass("exploreanimate");
                            $(".exploreanimate").on("animationend webkitAnimationEnd", function(){  //动画结束时事件 
                                //    跳出广告页
                                $("div[id^='yuansunum']").remove();
                                $("#gold").remove();
                                $("body").append(`<a href="javascript:void(0)" class="downloads bannerfail down"></a>`)
                            });
                        }
                    }
                }
            }
            var gold=document.querySelectorAll("#gold");
                for(let n=0;n<gold.length;n++){
                    let coinadd=impact(capsule,gold[n]);
                    if(coinadd!=false){
                        let coinnumexist=coinadd.getAttribute("coinnum");
                        let coinsof=coinarr.indexOf(coinnumexist);
                        if(coinsof==-1){
                            // console.log($("#gold[coinnum="+coinnumexist+"]"));
                            $("#gold[coinnum="+coinnumexist+"]").addClass("pauses").addClass("scalegold").promise().done(function () {
                                    $(this).css({'transform':'scale(2)','transition': 'all 1s', opacity: 0.5}).delay(500).promise().done(function () {
                                            $(this).css({'transform':'scale(0)','transition': 'all 1s',opacity:0})
                                    })
                                })
                            // $("#gold[coinnum="+coinnumexist+"]").addClass("pauses").hide();
                            coinarr.push(coinnumexist);
                            let getcoinnum=coinarr.length;
                            $(".getcoinnum").html(getcoinnum);
                            if(getcoinnum>=10){
                                //   成功
                                clearTimeout(cointimer);
                                clearTimeout(pollTimer);
                                clearTimeout(timer);
                                clearInterval(distanceInterval);
                                clearInterval(coininsert);
                                clearInterval(gametimer);
                                $("#capsule").remove();
                                capsule.removeEventListener("touchstart", dragStart,false);
                                capsule.removeEventListener("touchmove", dragMove,false);
                                capsule.removeEventListener("touchend", dragEnd,false);
                                $("div[id^='yuansunum']").remove();
                                $("#gold").remove();
                                $("body").append(`<a href="javascript:void(0)" class="downloads bannersuccess down"></a>`);
                            }
                        }
                    }
                }

        }
    },375);

    //拖拽事件开始完成
    function drag() {
        capsule.addEventListener("touchstart", dragStart,false);
        capsule.addEventListener("touchmove", dragMove,false);
        capsule.addEventListener("touchend", dragEnd,false);
    }
    var isdrag = true;
    var tempX, s, tempY, m;
    function dragStart(e) {
        isdrag = true;
        tempX = parseInt($("#capsule").css("left") + 0);
        tempY = parseInt($("#capsule").css("top") + 0);
        s = e.touches[0].pageX;
        m = e.touches[0].pageY;
    }
    function dragMove(e) {
        if (isdrag) {
            var curX = tempX + e.touches[0].pageX - s;
            var curY = tempY + e.touches[0].pageY - m;
            //边界判断
            curX = curX < 0 ? 0 : curX;
            curY = curY < 0 ? 0 : curY;
            curX = curX < document.documentElement.clientWidth - 20 ? curX : document.documentElement.clientWidth - 20;
            curY = curY < document.documentElement.clientHeight - 20 ? curY : document.documentElement.clientHeight - 20;
            $("#capsule").css({
                "left": curX,
                "top": curY
            });
            //禁止浏览器默认事件
            e.preventDefault();
        }

    }
    function dragEnd() {
        isdrag = false;
    }
    //拖拽事件结束完成
    //碰撞检测开始
    function impact(obj, dobj) {
        var o = {
            xx: getDefaultStyle(obj, 'left'),
            yy: getDefaultStyle(obj, 'top'),
            w: getDefaultStyle(obj, 'width'),
            h: getDefaultStyle(obj, 'height')
        }
        var d = {
            xx: getDefaultStyle(dobj, 'left'),
            yy: getDefaultStyle(dobj, 'top'),
            w: getDefaultStyle(dobj, 'width'),
            h: getDefaultStyle(dobj, 'height')
        }
        var px, py;
        px = o.xx <= d.xx ? d.xx : o.xx;
        py = o.yy <= d.yy ? d.yy : o.yy;
        // 判断点是否都在两个对象中
        if (px >= o.xx && px <= o.xx + o.w && py >= o.yy && py <= o.yy + o.h && px >= d.xx && px <= d.xx + d.w && py >= d.yy && py <= d.yy + d.h) {
            return dobj;
        } else {
            return false;
        }
    }
    function getDefaultStyle(obj, attribute) {
        return parseInt(window.getComputedStyle(obj)[attribute]);
    }
    //碰撞检测结束
    //下载开始
    $("body").on("click",".down",function () {
        var userAgent = navigator.userAgent || navigator.vendor;
        var url = "https://itunes.apple.com/app/fleet-command-win-legion-war/id1039748465";
        var android = "https://play.google.com/store/apps/details?id=com.movga.fleetcommand.gp";
        if (/android/i.test(userAgent)) {
            url = android;
        }
        $(".down").attr("href",url);
    });
    //下载开始

});