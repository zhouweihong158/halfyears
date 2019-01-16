$(function () {
    var section = $('#section');
    var bodywidth = $(window).width();
    let bodyheight=$('body').height();
    let realcontainer=$("#realcontainer");
    let lr;
    var distanceInterval;
    var classs=["watermineone","waterminethree","waterminefour"];
    var charSheet=['image/watermine1.png',
        'image/watermine3.png',
        'image/watermine4.png',
    ];
    var shuzu=[];
    let clickslefts;
    let inittop=parseInt($("#capsule").css("top").slice(0,-2));
    let x=0;
    let dropTimeout;
    let  nowtops=0;
    let nowlefts=0;
    var capsule=document.getElementById("capsule");
    var yuansunum=0;
    let pengzhuangnum=[];
    //左边
    let clicknumsss=0;
    let yuansugeshus=0;
    let landinterval;
    function insetrt(){
        yuansunum++;
        let xiabiao=Math.floor(Math.random()*charSheet.length);
        let lefts=`${(bodywidth-100)* Math.random()}px`;
        let tops=`${(bodyheight-100)*Math.random()}px`;
        let desbox;
        if(is_land==false){
            desbox=$(`<div id="yuansunum`+yuansunum+`" class="`+classs[xiabiao]+` zhadan"></div>`).css({"backgroundImage":`url(`+charSheet[xiabiao]+`)`,top:`-5%`,left:lefts});
            section.append(desbox);
        }
        else if(is_land==true){
            desbox=$(`<div id="yuansunum`+yuansunum+`" class="`+classs[xiabiao]+`"></div>`).css({"backgroundImage":`url(`+charSheet[xiabiao]+`)`,right:0,top:tops});
            section.append(desbox);
            function dropl() {
                desbox.animate({'right': '100%'},4000,'linear',function () {
                    desbox.remove();
                })
                timer=setTimeout(dropl,8000);
            }
            dropl();
        }
        yuansugeshus++;
        let sorti=document.querySelector(`#yuansunum${yuansugeshus}`);
        shuzu.push(sorti);
    }

    $("#begin").on("touchstart",function (e) {
        if($("#guide").length>0){
            $("#guide").remove();
        }
        e.preventDefault();
        section.removeClass("stoped");
        nowtops=parseInt($("#capsule").css("top").slice(0,-2));
        nowlefts=parseInt($("#capsule").css("left").slice(0,-2));
        x+=10;
        clicknumsss++;
        if(clicknumsss==1){
            if(is_land==true){
                polling();
                landinterval=setInterval(function () {
                    insetrt()
                },750)
            }
        }
        st = e.touches[0].pageX;
        lr=st/bodywidth;
        if(is_land==false){
            section.animate({
                'background-position-y': x + '%',
            },200,'linear',function(){
                section.addClass("stoped");
            });
            if(clicknumsss%2==0){
                insetrt();
            }
            dropport()
            function dropport(){
                $(".zhadan").animate({
                    'top': '+=10%',
                },200,'linear');
                for(let d=0;d<$(".zhadan").length;d++){
                    if(parseInt($($(".zhadan")[d]).css("top").slice(0,-2))>bodyheight){
                        $($(".zhadan")[d]).remove();
                    }
                }
            }

            if(nowtops>170){
                nowtops-=20;
            }else {
                nowtops-=0;
            }
            if(lr<0.5){
                rotatedeg=`rotate(-45deg)`;
                clickslefts=nowlefts-60;
                if(clickslefts<=50){
                    clickslefts=50;
                }
            }
            else if(lr>=0.5){
                rotatedeg=`rotate(45deg)`;
                clickslefts=nowlefts+60;
                if(clickslefts>=bodywidth-50){
                    clickslefts=bodywidth-50;
                }
            }
            $("#capsule").append(`<img src="image/left.gif?${new Date().getTime()}" alt="" class="lvyan">`).css({transform:rotatedeg}).stop().animate({top:nowtops+`px`,left:clickslefts+`px`});
        }
        else if(is_land==true){
            if(nowtops>80){
                nowtops-=80;
            }else if(nowtops<=80){
                nowtops-=0;
            }else {
                nowtops-=0;
            }
            rotatedeg=`rotate(-30deg)`;
            clickslefts=nowlefts+30;
            if(clickslefts>=bodywidth-500){
                clickslefts=nowlefts;
            }
            $("#capsule").append(`<img src="image/hengban.gif?${new Date().getTime()}" alt="" class="lvyan">`).css({transform:rotatedeg}).stop().animate({top:nowtops+`px`,left:clickslefts+`px`});
        }
        clearInterval(dropTimeout);
        dropTimeout=setInterval(function () {
            if(section.hasClass("stoped")){
                dropani();
            }
        },500);
      });


    var y =0;
    function polling() {
        y += 25;
        if(is_land==true){
            section.animate({
                'background-position-x': -y + '%',
            },500,'linear',function () {
                section.addClass("stoped");
            });
        }
        pollTimer=setTimeout(polling, 500);
    }
    function dropani() {
        nowtops=parseInt($("#capsule").css("top").slice(0,-2));
        if(is_land==false){
            if(nowtops<inittop){
                nowtops+=100;
            }else {
                nowtops+=0;
            }
        }
        else if(is_land==true){
            if(nowtops<=bodyheight-150){
                nowtops+=100;
            }
        }
        $("#capsule").css({transform:`rotate(0)`}).stop().animate({top:nowtops+`px`},500,`linear`);
    }

    distanceInterval=setInterval(function () {
           if($("#guide").length>0){
               return false;
           }
           else {
               let backgroundPositionY;
               if(is_land==false){
                   backgroundPositionY=section.css("backgroundPositionY").slice(0,-1);
               }else if(is_land==true){
                   backgroundPositionY=section.css("backgroundPositionX").slice(1,-1);
               }
               if(backgroundPositionY>=3000){
                   clearInterval(dropTimeout);
                   if(is_land==true){
                       clearInterval(landinterval);
                       clearTimeout(pollTimer);
                   }
                   realcontainer.css({width:`100%`});
                   clearInterval(distanceInterval);
                   $("div[id^='yuansunum']").remove();
                   $("body").append(`<a href="javascript:void(0)" class="downloads bannersuccess down"></a>`);
               }
               else{
                   let distancenumy=Math.floor((backgroundPositionY)/30);
                   realcontainer.css({width:`${distancenumy}%`});
               }
           }
    },100);
    setInterval(function () {
      for(var j=0;j<shuzu.length;j++){
          var impacts=impact(capsule,shuzu[j]);
          if(impacts!=false){
              let ids=impacts.getAttribute("id");
              let indexsof=pengzhuangnum.indexOf(ids);
              if(indexsof===-1){
                  pengzhuangnum.push(ids);
                  if(pengzhuangnum.length==1){
                      $("#"+pengzhuangnum[0]).append(`<img src="image/bossbigexplore.gif?${new Date().getTime()}" alt="" class="explore">`);
                      $("#capsulecoat").css({opacity:0});
                  }
                  else if(pengzhuangnum.length>=2){
                      clearInterval(dropTimeout);
                      clearInterval(distanceInterval);
                      if(is_land==true){
                          clearInterval(landinterval);
                          clearTimeout(pollTimer);
                      }
                      $("#capsule").remove();
                      $("#"+pengzhuangnum[1]).append(`<img src="image/bossbigexplore.gif?${new Date().getTime()}" alt="" class="explore">`).addClass("exploreanimate");
                      $(".exploreanimate").on("animationend webkitAnimationEnd", function(){  //动画结束时事件 
                          //   跳出广告页
                          $("div[id^='yuansunum']").remove();
                          $("#gold").remove();
                          $("body").append(`<a href="javascript:void(0)" class="downloads bannerfail down"></a>`)
                      });

                  }
              }
          }
      }
  },10);
    // 碰撞检测开始
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