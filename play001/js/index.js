$(function () {
        orient();
        setInterval(function () {
            $(window).on('orientationchange', function(e) {
                orient();
              });
        },100);
        var num=0;
        var num1=0;
        var num2=0;
        var num3=0;
        var num4=0;
        $("#button1").html("<img style='width: 100%;height:100%;float:left' class='btn1' src='image/huisehuweijian.png'>");
        $("#button2").html("<img style='width: 100%;height:100%;float:left' class='btn2'  src='image/huisehangmu.png'>");
        $("#button3").html("<img style='width: 100%;height:100%;float:left' class='btn3'  src='image/huisezhanliejian.png'>");
        $("#number1").click(function () {
            $("#number1").removeClass("animate").css("opacity","1");
            $("#box").append("<div id='bulid1'></div><img src='image/buildlight1.gif' alt=''  class='buildside buildside1'>");
            $("#number2").css("display","block").addClass("animate");
        });
        $("#number2").click(function () {
            $("#number2").removeClass("animate").css("opacity","1");
            $(".buildside1").remove();
            $("#box").append("<div id='bulid2'></div><img src='image/buildlight2.gif' alt=''  class='buildside  buildside2'>");
            $("#number3").css("display","block").addClass("animate");
        });
        $("#number3").click(function () {
            $("#number3").removeClass("animate").css("opacity","1");
            $(".buildside2").remove();
            $("#box").append("<div id='bulid3'></div><img src='image/buildlight3.gif' alt=''  class='buildside  buildside3'>");
            $("#number4").css("display","block").addClass("animate");
        });
        $("#number4").click(function () {
            $("#number4").removeClass("animate").css("opacity","1").addClass("clicked");
            $(".buildside3").remove();
            $("#box").append("<div id='bulid4'></div><img src='image/buildlight4.gif' alt=''  class='buildside  buildside4'>");
            $(".jiantou1").removeClass("none");
            $("#bulid1").css("zIndex","1");
            $("#bulid2").css("zIndex","0");
            $("#bulid3").css("zIndex","0");
            $("#bulid4").css("zIndex","0");
        });

        $("#box").on("click","#bulid1", function() {
            if(!$("#number4").hasClass("clicked")){
                return false;
            }else{
                if((num1==0&&num2==0&&num3==0&&num4==0)||(num1==1&&num2==1&&num3==1&&num4==1)){
                    $(".buildside4").remove();
                    $(".jiantou2").removeClass("none");
                    $(".jiantou1").css("backgroundImage", "url('image/tanchutiekuang.png')").removeClass("jiantouanimate").addClass("fade");
                    num++;
                    num1++;
                    if (num == 5) {
                        $(".btn2").attr("src", 'image/hangmu.png');
                        if($("#box").has('.boat1')&&!$(".btn1").hasClass("btnbling")){
                            $(".btn2").addClass("btnbling");
                        }
                        $(".jiantou2").addClass("jiantouanimate").removeClass("fade").css("backgroundImage", "url('image/jiantou.png')");
                    } else if (num >= 8) {
                        return false;
                    }
                    let scorer1=Number($("#tscore1").html());
                    $("#tscore1").html(scorer1+50);
                    $("#bulid1").css("zIndex", "0");
                    $("#bulid2").css("zIndex", "1");
                }else{
                    return false;
                }
            }

        });
        $("#box").on("click","#bulid2", function(){
            if(!$("#number4").hasClass("clicked")){
                return false;
            }else{
                if((num1==1&&num2==0&&num3==0&&num4==0)||(num1==2&&num2==1&&num3==1&&num4==1)) {
                    $(".jiantou3").removeClass("none");
                    $(".jiantou2").css("backgroundImage", "url('image/tanchuyoutong.png')").addClass("fade");
                    num++;
                    num2++;
                    $("#bulid2").css("zIndex", "0");
                    $("#bulid3").css("zIndex", "1");
                    if (num == 6) {
                        $(".jiantou3").addClass("jiantouanimate").removeClass("fade").css("backgroundImage", "url('image/jiantou.png')");
                    } else if (num >= 8) {
                        return false;
                    }
                    let scorer2=Number($("#tscore2").html());
                    $("#tscore2").html(scorer2+50);
                }else{
                    return false;
                }
            }
        });
        $("#box").on("click","#bulid3", function(){
            if(!$("#number4").hasClass("clicked")){
                return false;
            }else{
                if((num1==1&&num2==1&&num3==0&&num4==0)||(num1==2&&num2==2&&num3==1&&num4==1)) {
                    $(".jiantou4").removeClass("none");
                    $(".jiantou3").css("backgroundImage","url('image/tanchutongkuang.png')").removeClass("jiantouanimate").addClass("fade");
                    num++;
                    num3++;
                    if(num==3){
                        $(".btn1").attr("src",'image/huweijian.png').addClass("btnbling");
                    }else if(num==7){
                        $(".btn3").attr("src",'image/zhanliejian.png');
                        if($("#box").has(".boat2")&&!$(".btn2").hasClass("btnbling")&&!$(".btn1").hasClass("btnbling")){
                            $(".btn3").addClass("btnbling");
                        }
                        $(".jiantou4").addClass("none");
                    }else if(num>=8){
                        return false;
                    }
                    let scorer3=Number($("#tscore3").html());
                    $("#tscore3").html(scorer3+50);
                    $("#bulid3").css("zIndex","0");
                    $("#bulid4").css("zIndex","1");
                }else{
                    return false;
                }
            }
        });
        $("#box").on("click","#bulid4", function(){
            if(!$("#number4").hasClass("clicked")){
                return false;
            }else{
                if(num1==1&&num2==1&&num3==1&&num4==0){
                    $(".jiantou4").css("backgroundImage","url('image/tanchuzuanshi.png')").addClass("fade");
                    num++;
                    num4++;
                    if(num==4){
                        $(".jiantou1").addClass("jiantouanimate").removeClass("fade").css("backgroundImage","url('image/jiantou.png')");
                    }else if(num>=8){
                        return false;
                    }
                    let scorer4= Number($("#tscore4").html());
                    $("#tscore4").html(50+scorer4);
                    $("#bulid4").css("zIndex","0");
                    $("#bulid1").css("zIndex","1");
                }else{
                    return false;
                }
            }
        });
        $(".btn1").click(function(){
            // $("#bulid4").css("zIndex","0");
            if($(".btn2").hasClass('btnbling')||$(".btn3").hasClass('btnbling')||!$(".btn1").hasClass('btnbling')){
                return false;
            }else{
                $(this).removeClass("btnbling");
                $("#box").append("<div class='boat1'></div>");
                if(num>=5){
                    $(".btn2").addClass('btnbling');
                }
                let scoreb1r1=Number($("#tscore1").html())-50;
                $("#tscore1").html(scoreb1r1);
            }
        });
        $(".btn2").click(function () {
            if($(".btn1").hasClass('btnbling')||$(".btn3").hasClass('btnbling')||!$(".btn2").hasClass('btnbling')){
                return false;
            }else{
                $(this).removeClass("btnbling");
                if(num==7){
                    $(".btn3").addClass('btnbling');
                }
                $("#box").append("<div class='boat2'></div>");
                let scoreb2r1=Number($("#tscore1").html())-50;
                $("#tscore1").html(scoreb2r1);
                let scoreb2r2=Number($("#tscore2").html())-50;
                $("#tscore2").html(scoreb2r2);
                let scoreb2r3=Number($("#tscore3").html())-50;
                $("#tscore3").html(scoreb2r3);
                let scoreb2r4=Number($("#tscore4").html())-50;
                $("#tscore4").html(scoreb2r4);
            }
        });
        $(".btn3").click(function(){
            if($(".btn1").hasClass('btnbling')||$(".btn2").hasClass('btnbling')||!$(".btn3").hasClass('btnbling')){
                return false;
            }else{
                $("#box").append("<div class='boat3 boat3animate'></div>");
                $(".boat1").addClass("boat1animate");
                $(".boat2").addClass("boat2animate");
                $(".boat3animate").on("animationend webkitAnimationEnd", function(){ //动画结束时事件 
                    $(".btn3").removeClass("btnbling");
                    $("#box").append("<a href='' class='down'><div class='downloads' style='z-index: 2'></div></a>");
                });
                let scoreb3r3=Number($("#tscore3").html())-50;
                $("#tscore3").html(scoreb3r3);
                let scoreb3r2=Number($("#tscore2").html())-50;
                $("#tscore2").html(scoreb3r2);
            }
        });




        // Detect platform from user agent

        $("#box").on("click",".downloads",function () {

            var userAgent = navigator.userAgent || navigator.vendor;
            var url = "https://itunes.apple.com/app/fleet-command-win-legion-war/id1039748465";
            var android = "https://play.google.com/store/apps/details?id=com.movga.fleetcommand.gp";
            if (/android/i.test(userAgent)) {
                url = android;
            }
            $(".down").attr("href",url);
            // mraid.open(url);
            // var u = navigator.userAgent;
            // var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
            // var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
            // if (isAndroid) {
            //     $(".down").attr("href","https://play.google.com/store/apps/details?id=com.movga.fleetcommand.gp");
            // }
            // if (isIOS) {

            // }
        })
    });
