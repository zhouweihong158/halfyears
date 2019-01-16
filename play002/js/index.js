$(function () {
    orient();
    $(window).on('orientationchange', function(e) {
        orient();
    });
    var audio = document.querySelector('audio');
    setInterval(function () {
        document.addEventListener('webkitvisibilitychange', function() {
            if(document.webkitVisibilityState=='hidden') {
                audio.pause();
                // AudioContext.close();
            }else{
                audio.play();
            }
        });
    },100);

    //定义变量开始
    var mydisc=0.4;
    var bossdisc=0.18;
    var initmine=2;
    var initbosss=3;
    var flag=false;
    var time = 0;
    var bossclicknum=0;
    var myclicknum=0;
    var wait;
    var winnum=0;

    //定义变量结束
    //开始灰色倒计时事件
    $('.countdown').pietimer({
            seconds: 1,
            color: 'rgba(96, 96, 96, 0.6)',
             },function(){// 回调函数 // console.log("结束咯！");
        $(".clickbtn").addClass("redclick");
    });
     //结束灰色倒计时事件
     //开始点击红色按钮事件
     $("#banner").on("click",".clickbtn",function () {
         flag=true;
         if (time == 0) {
             time = 1; //设定间隔时间（秒）
             // 启动计时器，倒计时time秒后自动关闭计时器。
             var index = setInterval(function(){
                 time--;
                 if (time == 0) {
                     clearInterval(index);
                 }}, 1000);
             myclicknum++;
             $("#bosss").css("width",`${initbosss-bossdisc*myclicknum}rem`);
             $(".clickbtn").removeClass("redclick");
             $('.grayred').pietimer('start');
             var myimg=document.querySelector("#myimg");
             if(myimg==null){
                 var imgText = `<div class="myimgdiv"><img src="image/xiangshangdaodan.gif?${new Date().getTime()}" id="myimg"/></div>`;
                 $("#banner").append(imgText);
             }else {
                 $("#myimg").replaceWith(`<img src="image/xiangshangdaodan.gif?${new Date().getTime()}" id="myimg"/>`);
             }
         }else{}
     });
    // 触发红色按钮boss船进行攻击开始
    setInterval(function () {
        if(flag==true){
            bossclicknum++;
            if(bossclicknum<=5){
                $("#mine").css("width",`${initmine-mydisc*bossclicknum}rem`);
                if(bossclicknum>=3){
                    $("#times").css("opacity","1");
                    $(".yellowbtn").css("display","block");
                    $(".sos").css("opacity","1").addClass("yellowclick");
                    $(".redborder").addClass("redborderimage");
                }
                if(bossclicknum==5&&!$("#mine").hasClass("widths")){
                    $("#banner").append("<div class='myexplosion'></div>");
                    $("#myimg").attr("src","image/xiaochuanbaozha.gif");
                    $("#myboat").addClass("myboatanimate");
                    $(".myboatanimate").on("animationend webkitAnimationEnd", function(){
                        $(".clickbtn").removeClass("redclick");
                        $("#myboat").css("backgroundImage","url('image/zuoxiajiaochuancanhai.png')");
                        $("#banner").append("<a href='javascript:void(0)' class='advertising down' style='z-index:2'></a>");
                    })
                }
                var bossimg=document.querySelector("#bossimg");
                if(bossimg==null){
                    var imgTextboss = `<div class="bossimgdiv"><img src="image/xiangxiadaodan.gif?${new Date().getTime()}" id="bossimg"/></divcla>`;
                    $("#banner").append(imgTextboss);
                }else {
                    $("#bossimg").replaceWith(`<img src="image/xiangxiadaodan.gif?${new Date().getTime()}" id="bossimg"/>`);
                }
                if($("#mine").hasClass("widths")){
                    flag=false;
                    $("#mine").css("width","2rem");
                        setInterval(function () {
                            if(parseInt(winnum)>999){
                                clearInterval();
                           }else if(parseInt(winnum)==999){
                                $("#banner").append("<a href='javascript:void(0)' class='advertising down' style='z-index:2'></a>");
                                winnum+=49.95;
                            }else{
                                winnum+=49.95;
                                $("#scorenum").html(parseInt(winnum));
                                if(parseInt(winnum)==499){
                                    $("#bosss").css("width","0");
                                    $("#boss").addClass("bossboatanimate");
                                    $(".bossboatanimate").on("animationend webkitAnimationEnd", function(){
                                        $("#boss").css({"backgroundImage":"url('image/bosschuancanhai.png')","width":"2.77rem", "height":"1.59rem"});
                                    });
                                    $("#banner").append("<div class='bossbaozha'></div>");
                                }
                           }
                        },100);
                }
            }else{
                return false;
            }
        }
    },2000);
    // 触发红色按钮boss船进行攻击结束
    // 结束点击红色按钮事件
    // 开始急救信号点击事件
    $("#banner").on("click",".sos",function () {
            if($(".sos").hasClass("yellowclick")){
                  $(".redborder").removeClass("redborderimage");
                  $(".sos").removeClass("yellowclick");   //黄色按钮不能点击
                  $("#friends").addClass("friendsanimate");    //友军出现
                  $(".friendsanimate").on("animationend webkitAnimationEnd", function(){  //动画结束时事件 
                       var friendimgleftText = `<img src="image/xiangxiadaodan.gif?${new Date().getTime()}" class="friendleftimg"/>`;
                       $("#banner").append(friendimgleftText).addClass("friend");
                       var friendimgrightText = `<img src="image/xiangxiadaodan.gif?${new Date().getTime()}" class="friendrightimg"/>`;
                      $("#banner").append(friendimgrightText);
                 });

                $("#mine").addClass("widths");
            }
        });

    function timeOut(){
        setInterval(function () {
            if($(".sos").hasClass("yellowclick")){
                wait = $(".second").html();
                if(wait!=0){
                    wait--;
                    $('.second').html(wait);
                }else{
                    $("#times").remove();
                    $(".sos").remove();
                    $(".yellowbtn").remove();
                    $(".redborder").removeClass("redborderimage");
                }
            }
        },1000);
    }
    timeOut();
    //急救信号倒计时三秒结束
    //开始下载按钮点击事件
    $("#banner").on("click",".down",function () {
        // audio.pause();
        var userAgent = navigator.userAgent || navigator.vendor;
        var url = "https://itunes.apple.com/app/fleet-command-win-legion-war/id1039748465";
        var android = "https://play.google.com/store/apps/details?id=com.movga.fleetcommand.gp";
        if (/android/i.test(userAgent)) {
            url = android;
        }
        $(".down").attr("href",url);
    });
    //结束下载按钮点击事件

});