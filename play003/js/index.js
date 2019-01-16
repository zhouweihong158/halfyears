$(function () {
    var display=$("#bubbleer li");
    var num=0;
    var final;
    //红色按钮点击开始
    $("#box").on("click",".begin",redclick);
    function redclick(){
        $(".begin").remove();
        $(".download").css("zIndex","1");
        $(".redflashing").removeClass("beforeclick").css({display:"none"});
        $("#zhezhao").css("zIndex","0");
        display.eq(0).css("zIndex","1").find(".bubs").addClass("cur");
        display.eq(3).css("zIndex","1").find(".bubs").addClass("cur").addClass("clicks");
        display.eq(1).css("zIndex","1");
        display.eq(2).css("zIndex","1");
        $(".shoubegin").remove();
        $(".shoustep1").css("display","block");
    }
    //红色按钮点击结束
    //右下角泡泡开始
    display.eq(3).click(function () {
        if(num==1){
            return false;
        }
        else if($(".downloads").length<=0){
            var that=$(this);
            if(that.find(".bubs").hasClass("clicks")){
                num++;
                numfuntion();
                that.find(".bubs").removeClass('cur').removeClass("clicks");
                if(num==1){
                    display.eq(0).find(".bubs").addClass("clicks");
                    $(".shoustep1").remove();
                    $(".shoustep2").css("display","block");
                }
                setTimeout(function () {
                    that.find(".bubs").addClass('cur').addClass("clicks");
                },1000);
            }else {
                return false;
            }
        }else {
            return false;
        }
    });
    //右下角泡泡结束
    //左上角泡泡开始
    display.eq(0).click(function () {
        if($(".downloads").length<=0){
            var that=$(this);
            if(that.find(".bubs").hasClass("clicks")){
                num++;
                numfuntion();
                $(".shoustep2").remove();
                that.find(".bubs").removeClass('cur');
                setTimeout(function () {
                    that.find(".bubs").addClass('cur');
                },1000);
                if(num==2){
                    $("#zhezhao").remove();
                    display.eq(2).find(".bubs").toggleClass('cur');
                    display.eq(1).find(".bubs").toggleClass('cur');
                    final=setTimeout(function () {
                        if(num<17){
                            //boss成功
                            $("#boss").append(`<div class="greengif"></div>`)
                            $(".redflashing").css({display:"block"}).addClass("beforeclick");
                            clearInterval(bossam);
                            clearInterval(bossam2);
                            $(".greengif").addClass("success");
                            $(".success").on("animationend webkitAnimationEnd", function(){  //动画结束时事件 
                                $(".greengif").remove();
                                $("#box").append(`<a href="javascript:void(0)" class="down downloads bannerfail"></a>`);
                            });
                        }else if(num>=17){
                            clearTimeout(final);
                            $(".greengif").addClass("success");
                            $(".success").on("animationend webkitAnimationEnd", function(){  //动画结束时事件 
                                $(".greengif").remove();
                                $("#box").append(`<a href="javascript:void(0)" class="down downloads bannerfail"></a>`);
                            });
                        }
                    },8000);
                }
            }else{
                return false;
            }
        }else {
            return false;
        }
    });
    //左上角泡泡结束
    //右上角泡泡开始
    display.eq(1).click(function (){
        if($(".downloads").length<=0){
            var that=$(this);
            paopao(that);
        }else {
           return false;
        }

    });
    //右上角泡泡结束
    //左下角泡泡开始
    display.eq(2).click(function () {
        if($(".downloads").length<=0){
            var that=$(this);
            paopao(that);
        }else {
            return false;
        }
    });
    //左下角泡泡结束
    function paopao(that) {
        if(that.find(".bubs").hasClass("cur")){
            num++;
            numfuntion();
            that.find(".bubs").removeClass('cur');
            setTimeout(function () {
                that.find(".bubs").addClass('cur');
            },1000);
        }
    }
    // 泡泡结束
    var bossam=setInterval(function () {
        if(num>=2&&num<7){
            bosss(num);
        }else {
            clearInterval();
        }
    },1000);
   var bossam2=setInterval(function () {
        if(num>=7&&num<17){
            bosss(num);
        }else {
            clearInterval();
        }
    },500);
    //失败

//  进度条开始
    var myscore=$(".myscore");
    function numfuntion(){
        //小于2 0级
        if(num<=2){
            myscore.animate({width:`${num*50}%`,speed:1000});
            if(num==2){
                    $(".bossid").remove();
                    $(".myid").remove();
                    insertbossanme();
                    $(".scoreright").append(`<img src="image/nenglangmanshengji.gif?${new Date().getTime()}" class="shengji">`);
                    $(".myboat").append(`<img src="image/shengjitexiao.gif?${new Date().getTime()}" alt="" class="myboatshengji">`);
                    levelchangejindutiao(num);
                    $("#boss").addClass("bossmove");
            }
        }
        //3到7 1级
        else if(num>2&&num<=7){
            myscore.animate({width:`${(num-2)*20}%`,speed:1000});
            if(num==7) {
                $(".scoreright").append(`<img src="image/nenglangmanshengji.gif?${new Date().getTime()}" class="shengji">`);
                $(".myboatshengji").replaceWith(`<img src="image/shengjitexiao.gif?${new Date().getTime()}" alt="" class="myboatshengji">`);
                levelchangejindutiao(num);
            }
        }
        //8到19 2级
        else if(num>7&&num<=17){
            myscore.animate({width:`${(num-7)*10}%`,speed:1000});
            if(num==17) {
                //boss死亡
                clearTimeout(final);
                $(".bossmove").addClass("pauses");
                $(".scoreright").append(`<img src="image/nenglangmanshengji.gif?${new Date().getTime()}" class="shengji">`);
                $(".myboatshengji").replaceWith(`<img src="image/shengjitexiao.gif?${new Date().getTime()}" alt="" class="myboatshengji">`);
                levelchangejindutiao(num);
                $(".nowbossenergy").animate({"width":`0`,"speed":"1000"});
                clearInterval(bossam2);
                clearInterval(bossam);
                $(".myefirst").replaceWith(`<img src="image/shipfire.gif?${new Date().getTime()}" alt="" class="myexplore myefirst">`);
                $(".myesecond").replaceWith(`<img src="image/shipfire.gif?${new Date().getTime()}" alt="" class="myexplore myesecond">`);
                $(".myethird").replaceWith(`<img src="image/shipfire.gif?${new Date().getTime()}" alt="" class="myexplore myethird">`);
                $(".bossexplored").replaceWith(`<img src="image/bossbigexplore.gif?${new Date().getTime()}" alt="" class="bossexplored">`);
                $("#bossimg").addClass("fail");
                $(".fail").on("animationend webkitAnimationEnd", function(){  //动画结束时事件 
                    $(".bossexplored").remove();
                    $("#box").append(`<a href="javascript:void(0)" class="down downloads bannersuccess"></a>`);
                });
            }
        }
    }
var myboat=$(".myboat");
    function levelchangejindutiao(num) {
        setTimeout(function () {
            $(".shengji").remove();
            myscore.animate({width:0,speed:1000});
            if(num>=2&&num<7){
                myboat.addClass("myboatlevelf");
            }else if(num>=7&&num<17){
                myboat.addClass("myboatlevels");
            }else if(num>=17){
                myboat.addClass("myboatlevelt");
            }
        }, 1000);
    }


//    进度条升级结束
//初始化打斗动画开始
    function insertbossanme() {
        //boss被攻击特效
        $("#boss").append(`<img src="image/bosssmallexplore.gif?${new Date().getTime()}" alt="" class="bossexplored">`);
        // 小船攻击特效
        $("#box").append(`<img src="image/shipfire.gif?${new Date().getTime()}" alt="" class="myexplore myefirst">`+
            `<img src="image/shipfire.gif?${new Date().getTime()}" alt="" class="myexplore myesecond">`+
            `<img src="image/shipfire.gif?${new Date().getTime()}" alt="" class="myexplore myethird">`);
    }
//  初始化打斗动画结束
//  替换打斗动画开始
    var dis01=3;
    var dis2=6;
    var cishu=0;
    var shengjishienergy=0;
    var shengji1zhihoucishu=0;
     function bosss(num) {
       if(num>=2){
           cishu++;
           if(num>=2&&num<=7){
               $(".nowbossenergy").css({"width":`${100-cishu*dis01}%`,"speed":"500"});
               if(num==7){
                   shengjishienergy=100-cishu*dis01;
               }
           }
           else {
               if(shengjishienergy==0){
                   if(num==8){
                       shengjishienergy=100-cishu*dis01;
                   }
               }
               shengji1zhihoucishu++;
               $(".nowbossenergy").animate({"width":`${shengjishienergy-shengji1zhihoucishu*dis2}%`,"speed":"500"});
           }
           bossreplace();
       }else {
           return false;
       }

}
function bossreplace(){
    $(".bossexplored").replaceWith(`<img src="image/bosssmallexplore.gif?${new Date().getTime()}" alt="" class="bossexplored">`);
    $(".myefirst").replaceWith(`<img src="image/shipfire.gif?${new Date().getTime()}" alt="" class="myexplore myefirst">`);
    $(".myesecond").replaceWith(`<img src="image/shipfire.gif?${new Date().getTime()}" alt="" class="myexplore myesecond">`);
    $(".myethird").replaceWith(`<img src="image/shipfire.gif?${new Date().getTime()}" alt="" class="myexplore myethird">`);
}
//   替换打斗动画结束
//    广告链接开始
      $("#box").on("click",".down",function () {
        var userAgent = navigator.userAgent || navigator.vendor;
        var url = "https://itunes.apple.com/app/fleet-command-win-legion-war/id1039748465";
        var android = "https://play.google.com/store/apps/details?id=com.movga.fleetcommand.gp";
        if (/android/i.test(userAgent)) {
            url = android;
        }
        $(".down").attr("href",url);
    });
 //   广告链接结束
});