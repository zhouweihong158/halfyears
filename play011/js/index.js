$(function () {
    let charSheet=['image/sp001.png',
        'image/sp002.png',
        'image/sp003.png',
        'image/sp004.png',
        'image/sp005.png',
        'image/sp006.png',
    ];
    let partSheet=['image/part000.png',
        'image/part001.png',
        'image/part002.png',
        'image/part003.png',
        'image/part004.png',
        'image/part005.png',
        'image/part006.png',
        'image/part007.png',
        'image/part004.png',
        'image/part005.png',
    ];
    let partInterval;
    let time=1000;
    function random() {
        tops=Math.floor(Math.random()*85);
        lefts=Math.floor(Math.random()*85);
        if(lefts>=2&&lefts<=90&&tops>10&&tops<=75) {
            random();
        }
    }
    let minenum=0;
    let clicknum=0;
    let clickednums=0;
    let starnum=-1;
    let starall=$(".star");
   function insertparts() {
        random();
        let shou= `<img src="image/shou.gif" alt="" class="shou">`;
        let partxiabiao=Math.floor(Math.random()*partSheet.length);
        let insertcontent=$(`<div class="parts" style="top:`+tops+`%;left:`+lefts+`%;'"></div>`).css({"backgroundImage":`url(`+partSheet[partxiabiao]+`)`}).attr("data-id",partxiabiao);
       if($(".parts").length<=0){
           $("#showarea").append(insertcontent);
       }
       let partclick=$(".parts");
       for(let j=0;j<partclick.length;j++){
           // 点击之后效果
           $(partclick[j]).click(function () {
               if(!$(this).hasClass("clicked")){
                   clearInterval(partInterval);
                   $(this).addClass("clicked");
                   clicknum++;
                   clickednums++;
                   if(time>700){
                       time-=25;
                   }else {
                       time=700;
                   }
                  let dataid=$(this).attr("data-id");
                   if(dataid==10||dataid==12){
                       minenum++;
                       let explores=`<img src="image/bossbigexplore.gif?${new Date().getTime()}" alt="" class="explore exploreanimate">`;
                       $("#showarea").append(explores);
                       if(minenum==1){
                           $(".exploreanimate").on("animationend webkitAnimationEnd", function(){  //动画结束时事件 
                               $(".explore").remove();
                           });
                           clicknum=0;
                       }
                       if(minenum==2){
                           $(".exploreanimate").on("animationend webkitAnimationEnd", function(){  //动画结束时事件 
                               $(".explore").remove();
                               insertparts = null;
                               $("#box").append(`<a href="javascript:void(0)" class="down downloads bannerfail"></a>`);
                           });
                       }
                   }else {
                       if(clicknum==3){
                           starnum++;
                           let levelupimage=`<img src="image/leveup.gif?${new Date().getTime()}" alt="" class="leveup leveupanimate">`;
                           $("#showarea").append(levelupimage);
                           $(".leveupanimate").on("animationend webkitAnimationEnd", function(){  //动画结束时事件 
                               $(".leveup").remove();
                               $(".expectaera").css({"backgroundImage":`url(`+charSheet[starnum]+`)`}).addClass("boattransition");
                               $(starall[starnum]).css({"backgroundImage":`url(image/goldstar.png)`}).addClass("startransition");
                               if(starnum==5){
                                   //成功
                                   insertparts = null;
                                   setTimeout(function () {
                                       $("#box").append(`<a href="javascript:void(0)" class="downloads bannersuccess down"></a>`);
                                   },2000)
                               }
                           });
                           clicknum=0;
                       }else {
                           let getin=`<img src="image/getin.gif?${new Date().getTime()}" alt="" class="getin getinanimate">`;
                           $("#showarea").append(getin);
                           $(".getinanimate").on("animationend webkitAnimationEnd", function(){  //动画结束时事件 
                               $(".getin").remove();
                           });
                       }
                   }
                   $(this).addClass("partanimate");
                   $(".partanimate").on("animationend webkitAnimationEnd", function(){  //动画结束时事件 
                       $(this).remove();
                       if(minenum==2||starnum==5){
                       }
                       else {
                           if(typeof insertparts!=="undefined" && insertparts!==null){
                               insertparts();
                           }
                           // insertparts();
                       }
                   });
               }
           });
           partInterval= setTimeout(function () {
               if(!$(partclick[j]).hasClass("clicked")){
                   $(partclick[j]).fadeOut(200,function(){
                       $(partclick[j]).remove();
                       if(typeof insertparts!=="undefined" && insertparts!==null){
                           insertparts();
                       }
                   });
               }else {
                   clearTimeout(partInterval);
               }
           },time);
           if(clickednums==0){
               $(".parts").append(shou).css({zIndex:999});
               $("#box").append(`<div class="zhezhao"></div>`);
               clearTimeout(partInterval);
           }else if(clickednums==1){
               $(".zhezhao").remove();
               partSheet.push('image/mine.png',
                   'image/part006.png',
                   'image/mine.png');
           }
       }
    }
    if(typeof insertparts!=="undefined" && insertparts!==null){
        insertparts();
    }
    $("#box").on("click",".down",function () {
        var userAgent = navigator.userAgent || navigator.vendor;
        var url = "https://itunes.apple.com/app/Bio-Evil-Z-Lab/id1445001642";
        var android = "https://play.google.com/store/apps/details?id=com.mummut.bioevil.gp";
        if (/android/i.test(userAgent)) {
            url = android;
        }
        $(".down").attr("href",url);
    });
});