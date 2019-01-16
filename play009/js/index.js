$(function () {
    //四只船
    let charSheet;
    if(is_land==true){
        charSheet=['image/ship4land.png',
            'image/ship3land.png',
            'image/ship2land.png',
            'image/ship1land.png',
        ];
    }else if(is_land==false){
        charSheet=['image/ship4.png',
            'image/ship3.png',
            'image/ship2.png',
            'image/ship1.png',
        ];
    }
    //四只船对应的参数
    let canshu=[9,7,5,2];
    //插入分数盒子
    let getscorestr=`<p class="getscore"></p>`;
    //出船数
    let boatnum=0;
    //出船距离
    let jumplength;
    let allscore=$(".allscore");
    let boat;
    let nummbers;
    //总和
    let zonghe;
    //截取压力条宽度
    let energywidth=$("#energy").css("width").slice(0,-2);
    let dataid;
    let jsons={};
    function start(){
        //随机取下标
        let chartxiabiao=Math.floor(Math.random()*charSheet.length);
        //插入船
        let insertcontent=$(`<div class="boat"></div>`).css({"backgroundImage":`url(`+charSheet[chartxiabiao]+`)`}).attr("data-id",chartxiabiao);
        $("#box").append(insertcontent);
        //如果第一只船，加遮照，加手指
        if(boatnum==0){
            addmask();
        }
        boat=document.querySelector(".boat");
        boat.addEventListener("touchstart",touchstarts,false);
        function touchstarts(e) {
            e.preventDefault();
            if(!$(this).hasClass("touchstart")){
                $(this).addClass("touchstart");
                nummbers=parseInt(allscore.html());
                if(boatnum==0){
                    removemask();
                }
                $("#energyzhezhao").addClass("energyanimate").removeClass("pauses");
            }
        }
        boat.addEventListener("touchend",touchends,false);
        function touchends(e) {
            e.preventDefault();
            if(!$(this).hasClass("touchend")){
                boatnum++;
                $(this).addClass("touchend");
                $(".energyanimate").addClass("pauses");
                dataid=$(this).attr("data-id");
                let runwidth=$("#energyzhezhao").css("width").slice(0,-2);
                let percent=(1-runwidth/energywidth)*100;
                jumplength=Math.round((percent*10)/canshu[dataid]);
                console.log(jumplength);
                $("#score").append(getscorestr);
                if(jumplength<100&&jumplength>0){
                    $(".getscore").addClass("green");
                    tops=`${53-(40*jumplength)/100}%`;
                } else if(jumplength>=100){
                    $(".getscore").addClass("red");
                    tops=`0%`;
                }
                if(is_land==true){
                    jsons.right=tops;
                }else {
                    jsons.top=tops;
                }
                $(this).animate(jsons,3000,function (){
                    $(".getnum").html(boatnum);
                    if(jumplength>=100){
                        $(".boat").addClass("deadship").css({backgroundImage: `url('image/deadship.png')`});
                        jumplength=0;
                    }
                    zonghe=nummbers+jumplength;
                    $(".getscore").html(`+`+jumplength).addClass("getscoreopacity");
                    if(jumplength>=80){
                        $(".greatlanguage").addClass("greatanimates");
                    }
                    $(".getscoreopacity").on("animationend webkitAnimationEnd",function(){
                        $("#energyzhezhao").css({width:`100%`});
                        $(".getscore").removeClass("getscoreopacity").addClass("addgetscore");
                        $(".boat").fadeTo(1000,0.01,function () {
                            allscore.html(zonghe);
                            $(".boat").remove();
                            $("#energyzhezhao").removeClass("energyanimate");
                            if(boatnum<10){
                                $(".greatlanguage").removeClass("greatanimates");
                                start();
                            }else {
                                allscore.addClass("scalescore");
                                $(".scalescore").on("animationend webkitAnimationEnd",function () {
                                    $("#box").append(`<a href="javascript:void(0)" class="downloads bannersuccess down"></a>`);
                                })
                            }
                        });
                    });
                });
            }
        }
    }
    start();
    function addmask(){
        $("#box").append(`<div id="zhezhao"><div class="holdlanguage">Hold and release</div></div>`);
        $(".boat").append(`<div id="cursor"></div>`).addClass("zindex opacitys");
        $("#enter").addClass("zindex");
        $("#force").addClass("zindex opacitys");
    }
    function removemask(){
        $("#zhezhao").remove();
        $("#cursor").css({opacity:0});
        $("#enter").removeClass("zindex");
        $(".boat").removeClass("zindex opacitys");
        $("#force").removeClass("zindex opacitys");
    }
    $("#box").on("click",".down",function () {
        var userAgent = navigator.userAgent || navigator.vendor;
        var url = "https://itunes.apple.com/app/fleet-command-win-legion-war/id1039748465";
        var android = "https://play.google.com/store/apps/details?id=com.movga.fleetcommand.gp";
        if (/android/i.test(userAgent)) {
            url = android;
        }
        $(".down").attr("href",url);
    });
});