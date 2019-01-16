$(function () {
    var charSheet=['image/hangmu1.png',
        'image/hangmu2.png',
        'image/hangmu3.png',
    ];
    var landboat=``;
    if(is_land){
        landboat=`<div id="first" class="boatnum"></div><div id="second" class="boatnum"></div><div id="third" class="boatnum"></div><div id="fourth" class="boatnum"></div><div id="fifth" class="boatnum"></div>`;
    }else{
       landboat=`<div id="first" class="boatnum"></div><div id="second" class="boatnum"></div><div id="third" class="boatnum"></div><div id="fourth" class="boatnum"></div><div id="fifth" class="boatnum"></div><div id="sixth" class="boatnum"></div><div id="seventh" class="boatnum"></div><div id="eighth" class="boatnum"></div><div id="ninth" class="boatnum"></div>`;
    }
    $("body").append(landboat);
    var bodywidth = $('body').width();
    let score=$("#score");
    let life=$("#life");
    let boatnums=$(".boatnum");
    let speeds=15;
    var capsule=document.getElementById("myselfboat");
    let boatnumshuzu=document.getElementsByClassName("boatnum");
    let flag=true;
    for(let i=0;i<boatnums.length;i++){
            let xiabiao=Math.floor(Math.random()*charSheet.length);
            let randompos=Math.floor(Math.random()*100);
            $(boatnums[i]).css({backgroundImage:`url(`+charSheet[xiabiao]+`)`});
            //0 2 4 6 8 向左走     1 3 5 7 向右走
            if(i%2==0){
                //向右走
                $(boatnums[i]).css({transform:`rotate(180deg)`,left:`${randompos}%`});
            }
            else {
                //向左走
                $(boatnums[i]).css({right:`${randompos}%`});
            }
        }
    let y=0;
    let  myselfboat=$("#myselfboat");
    let bs=0;
    let beichu=0;
    if(is_land){
        bs=14.2857142857143;
        beichu=6;
    }
    else {
        bs=8.333333333333;
        beichu=11;
    }
    $("#leftb").on("touchstart",function (e) {
        e.preventDefault();
        if(flag) {
            let result=parseInt(score.html()) % beichu;
            if (result >= 1) {
                score.html(parseInt(score.html()) - 1);
                myselfboat.animate({bottom: `-=` + bs + `%`}, 100, "linear");
            }
        }
    });
    $("#rightb").on("touchstart",function (e) {
        e.preventDefault();
        if(flag){
          boatanimate();
        }
    });

function boatanimate() {
    myselfboat.animate({bottom:`+=`+bs+`%`},100,"linear",function () {
        score.html(parseInt(score.html())+1);
        let resu=parseInt(score.html())%beichu;
        if(resu==0){
            flag=false;
            y+=100;
            speeds+=5;
            if(speeds>=50){
                speeds=50;
            }
            $(".boatnum").css({zIndex:-9});
            $("#box").animate({
                'background-position-y': y + '%',
            },1000,function(){
                flag=true;
                $(".boatnum").css({zIndex:9});
            });
            myselfboat.animate({bottom:`0`},1000);
        }
    });
}
var pengzhuangnum=[];
    function moveboat(speeds){
        for(let i=0;i<boatnums.length;i++) {
            if (i % 2 == 0) {
                $(boatnums[i]).animate({left: `+=` + speeds + `%`}, 400, "linear",function () {
                    let boatnumss = $(boatnums[i]).css("left").slice(0, -2);
                    if (boatnumss > bodywidth) {
                        $(boatnums[i]).css({left: `-20%`});
                    }
                });
            }
            else {
                $(boatnums[i]).animate({right: `+=` + speeds + `%`}, 400,"linear", function () {
                    let boatnumssr = $(boatnums[i]).css("right").slice(0, -2);
                    if (boatnumssr > bodywidth) {
                        $(boatnums[i]).css({right: `-20%`});
                    }
                });
            }
        }
    }
    var move=setInterval(function (){
        moveboat(speeds);
    },300);
   var drop=setInterval(function () {
       if(flag){
           impactinterval();
       }
       },10);

function impactinterval() {
    for(var j=0;j<boatnumshuzu.length;j++){
        var impacts=impact(capsule,boatnumshuzu[j]);
        if(impacts!=false){
            flag=false;
            let ids=impacts.getAttribute("id");
            let indexsof=pengzhuangnum.indexOf(ids);
            if(indexsof===-1){
                pengzhuangnum.push(ids);
                if(pengzhuangnum.length==1){
                    $(".boatnum").css({zIndex:-9});
                    life.html(parseInt(life.html())-1);
                    myselfboat.append(`<img src="image/bossbigexplore.gif?${new Date().getTime()}" alt="" class="explore">`);
                    if(life.html()<=0){
                        clearInterval(move);
                        clearInterval(drop);
                        myselfboat.delay(2000).animate({opacity:0},2000,function () {
                            $("body").append(`<a href="javascript:void(0)" class="downloads bannerfail down"></a>`);
                        })
                    }else{
                        myselfboat.delay(2000).animate({bottom:`0%`},2000,function () {
                            score.html(parseInt(score.html())-parseInt(score.html()%beichu));
                            pengzhuangnum=[];
                            flag=true;
                            $(".boatnum").css({zIndex:9});
                        });
                    }
                }
            }
        }
    }
}

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