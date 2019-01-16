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
    /*定义变量*/
    var btnList = [1,1,1,0];  //按钮
    var fras = [1,1,1];       //绿框
    var imgSrc = ['boatImg','colImg','walImg'];  //防御摆放 5,2,3
    var fyz = [5,2,3]    //防御值
    var myEne = []; //我方防御
    var npcEne = 6;
    /*按钮闪烁*/
    btn_sh();
    $('.btn_list').on('click','.pre',function() {
        let ind = $(this).index();
        //console.log(btnList[ind])
        if(btnList[ind] == 2){
            $('.btn_list .pre').removeClass('btn_op');
        }
    })    
    /*按钮绑定事件*/       
    $('.btn_boat').on('click',function() {
        if(btnList[0] == 1 && btnList[1]!=2 && btnList[2] !=2) {                       
            $(this).addClass('btn_boat_press');            
            btnList[0] = 2;
            for(let i = 0; i < fras.length; i++) {
                let fra = $('.fra')[i];
                if(fras[i] == 1) {                    
                    $(fra).removeClass('none');            
                }else{
                    $(fra).addClass('none');
                }
            }
        }
    })
    $('.btn_col').on('click',function() {
        if(btnList[1] == 1 && btnList[0]!=2 && btnList[2] !=2) {
            $(this).addClass('btn_col_press');            
            btnList[1] = 2;
            for(let i = 0; i < fras.length; i++) {
                let fra = $('.fra')[i];
                if(fras[i] == 1) {                    
                    $(fra).removeClass('none');            
                }else{
                    $(fra).addClass('none');
                }
            }
        }
    })
    $('.btn_wal').on('click',function() {
        if(btnList[2] == 1 && btnList[1]!=2 && btnList[0] !=2) { 
            $(this).addClass('btn_wal_press');
            btnList[2] = 2;
            for(let i = 0; i < fras.length; i++) {
                let fra = $('.fra')[i];
                if(fras[i] == 1) {                    
                    $(fra).removeClass('none');            
                }else{
                    $(fra).addClass('none');
                }
            }
        }
    })
    
    /*添加防御*/
    $('.fras').on('click','.fra',function() {
        for(let j = 0; j < btnList.length - 1; j++) {
            if(btnList[j] == 2){
                let fraInd = $(this).index();
                fras[fraInd] = 0;
                //console.log(fras);
                for(let i = 0; i < btnList.length - 1; i++) {
                    if(btnList[i] == 2) {
                        btnList[i] = 3;
                        // btnList[i+1] = 1;
                        let fangyu = `<div class="fangyu fangyu${fraInd+1} ${imgSrc[i]}"></div>`;
                        $('#banner').append(fangyu);
                        myEne[fraInd] = fyz[i];
                    }
                }
                if(btnList[0] == 3 && btnList[1] ==3 && btnList[2] ==3){
                    $('.btn_rea').addClass('btn_op');
                }
                $('.fra').addClass('none');
                btn_sh();
                // console.log(myEne);
            }
        }
                
    })
    /* ready开火*/
    $('.btn_rea').on('click',function() {
        var a = 0;
        for(let i = 0;i < btnList.length - 1; i++)  {
            a += btnList[i];
        }
        if(a == 9){
            btnList[3] = 1;
        }
        if(btnList[3] == 1) {
            $('.btn_rea').removeClass('btn_op');            
            $(this).addClass('btn_rea_press');
            btnList[3] = 2;            
            for(let i = 0; i < fras.length; i++) {
                let fra = $('.fra')[i];
                if(fras[i] == 1) {                    
                    $(fra).removeClass('none');            
                }else{
                    $(fra).addClass('none');
                }
            }
            //开始攻防 一
            if(myEne.toString() == '2,3,5' ) {
                (async function() {
                    let npcFireTime = null;
                    let plFireTime = null;
                    await new Promise(  function(open) {
                        plFireTime = setInterval(() => {
                            pfSty(is_land,3)
                            setTimeout(function(){
                                pFire(is_land);
                            },1000)
                        },2000)
                        npcFireTime = setInterval(() => {
                            nfSty(is_land)
                            setTimeout(function(){
                                nFire(is_land,1);
                            },1000)
                            if(myEne[2] == 0) {
                                clearInterval(plFireTime);
                                clearInterval(npcFireTime);
                                $('.nfSty,.pfSty3').remove();
                                setTimeout(function(){
                                    $('.pl_fire,.npc_fire1').remove();
                                },1001)                                
                                open();
                            }
                            myEne[2]--;
                        },2000) 
                    })
                    await new Promise(function(open) {
                        $('.fangyu3').addClass('boatAni');
                        $('.fangyu2').addClass('walAni');
                        $('.fangyu1').addClass('colAni');
                        $('.pl_city').addClass('cityAni');
                        $('.boatAni').on("animationend webkitAnimationEnd", function(){
                            aDes(is_land,[2,1]);
                        })                      
                        setTimeout(function() {
                            open();
                        },1000)
                    })
                    // await new Promise(function(open) {
                    //     $('.boatAni').on("animationend webkitAnimationEnd", function(){
                    //         aDes(is_land,[2,1]);
                    //     })
                    //     setTimeout(() => {
                    //         open()
                    //     },1000)
                    // })
                    await new Promise(function() {
                        def();
                    })                                   
                })()                
            }
            //开始攻防 二
            if(myEne.toString() == '3,2,5' ) {
                (async function() {
                    let npcFireTime = null;
                    let plFireTime = null;
                    await new Promise(  function(open) {
                        plFireTime = setInterval(() => {
                            pfSty(is_land,3)
                            setTimeout(function(){
                                pFire(is_land);
                            },1000)                             
                        },2000)
                        npcFireTime = setInterval(() => {
                            nfSty(is_land)
                            setTimeout(function(){
                                nFire(is_land,1);
                            },1000)                            
                            if(myEne[2] == 0) {
                                clearInterval(plFireTime);
                                clearInterval(npcFireTime);
                                $('.pfSty3,.nfSty').remove();
                                setTimeout(function(){
                                    $('.pl_fire,.npc_fire1').remove();
                                },1001) 
                                open();
                            }
                            myEne[2]--;
                        },2000) 
                    })
                    await new Promise(function(open) {
                        $('.fangyu3').addClass('boatAni');
                        $('.fangyu1').addClass('walAni');
                        $('.fangyu2').addClass('colAni');
                        $('.pl_city').addClass('cityAni');
                        $('.boatAni').on("animationend webkitAnimationEnd", function(){
                            aDes(is_land,[1,2]);
                        })                        
                        setTimeout(function() {
                            open();
                        },1000)
                    })
                    // await new Promise(function(open) {                        
                    //     $('.boatAni').on("animationend webkitAnimationEnd", function(){
                    //         aDes(is_land,[1,2]);
                    //     })
                    //     setTimeout(() => {
                    //         open()
                    //     },1000)
                    // })
                    await new Promise(function() {
                        def();
                    })                                   
                })()                
            }
            //开始攻防 三
            if(myEne.toString() == '3,5,2' ) {
                (async function() {
                    let npcFireTime = null;
                    let npcFireTimes = null;
                    let plFireTime = null;
                    let plFireTimes = null;
                    await new Promise(  function(open) {
                        plFireTime = setInterval(() => {
                            pfSty(is_land,2)
                            setTimeout(function(){
                                pFire(is_land);
                            },1000)
                            if(npcEne > 4){
                                npcEne--;
                            }   
                        },2000)
                        npcFireTime = setInterval(() => {
                            nfSty(is_land);
                            setTimeout(function(){
                                nFire(is_land,1);
                            },1000)                            
                            if(myEne[2] == 0) {
                                clearInterval(plFireTime);
                                clearInterval(npcFireTime);
                                $('.nfSty,.pfSty2').remove();
                                setTimeout(function(){
                                    $('.npc_fire1,.pl_fire').remove();
                                },1001)
                                open();
                            }
                            myEne[2]--;
                        },2000) 
                    })
                    await new Promise(function(open) {
                        $('.fangyu3').addClass('colAni');
                        $('.colAni').on("animationend webkitAnimationEnd", function(){
                            cDes(is_land,3);
                        })
                        plFireTimes = setInterval(() => {
                            pfSty(is_land,2);
                            setTimeout(function(){
                                pFire(is_land);
                            },1000)                            
                            if(npcEne == 0) {
                                clearInterval(plFireTimes);
                                clearInterval(npcFireTimes);
                                $('.nfSty,.pfSty2').remove();
                                setTimeout(function(){
                                    $('.npc_fire2,.pl_fire').remove();
                                },1001)
                                $('.npc_boat').addClass('npcAni');
                                $('.npcAni').on("animationend webkitAnimationEnd", function(){
                                    nDes(is_land);                                    
                                    $('.npc_boom').remove();
                                    setTimeout(function() {
                                        vic();
                                    },1000)                                    
                                })
                            }
                            if(npcEne > 0){
                                npcEne--;
                            }
                        },2000)
                        npcFireTimes = setInterval(() => {
                            nfSty(is_land);
                            setTimeout(function(){
                                nFire(is_land,2);
                            },1000)      
                        },2000)
                        // setTimeout(function() {
                        //     open();
                        // },1000)
                    })
                    // await new Promise(function(open) {
                    //     $('.colAni').on("animationend webkitAnimationEnd", function(){
                    //         cDes(is_land,3);
                    //     })                        
                    // })                                                       
                })()                
            }
            //开始攻防 四
            if(myEne.toString() == '2,5,3' ) {
                (async function() {
                    let npcFireTime = null;
                    let npcFireTimes = null;
                    let plFireTime = null;
                    let plFireTimes = null;
                    await new Promise(  function(open) {
                        plFireTime = setInterval(() => {
                            pfSty(is_land,2);
                            setTimeout(function(){
                                pFire(is_land);
                            },1000)
                            if(npcEne > 3){
                                npcEne--;
                            }   
                        },2000)
                        npcFireTime = setInterval(() => {
                            nfSty(is_land);
                            setTimeout(function(){
                                nFire(is_land,1);
                            },1000)                            
                            if(myEne[2] == 0) {
                                clearInterval(plFireTime);
                                clearInterval(npcFireTime);
                                $('.pfSty2,.nfSty').remove();
                                setTimeout(function(){
                                    $('.npc_fire1,.pl_fire').remove();
                                },1001) 
                                open();
                            }
                            myEne[2]--;
                        },2000) 
                    })
                    await new Promise(function(open) {
                        $('.fangyu3').addClass('walAni');
                        $('.walAni').on("animationend webkitAnimationEnd", function(){
                            wDes(is_land,3)
                        })
                        plFireTimes = setInterval(() => {
                            pfSty(is_land,2)
                            setTimeout(function(){
                                pFire(is_land);
                            },1000)                            
                            if(npcEne == 0) {
                                clearInterval(plFireTimes);
                                clearInterval(npcFireTimes);
                                $('.pfSty2,.nfSty').remove();
                                setTimeout(function(){
                                    $('.npc_fire2,.pl_fire').remove();
                                },1001)
                                $('.npc_boat').addClass('npcAni');
                                $('.npcAni').on("animationend webkitAnimationEnd", function(){
                                    nDes(is_land);                                    
                                    $('.npc_boom').remove();
                                    setTimeout(function() {
                                        vic();
                                    },1000)                                    
                                })
                            }
                            if(npcEne > 0){
                                npcEne--;
                            }
                        },2000)
                        npcFireTimes = setInterval(() => {
                            nfSty(is_land);
                            setTimeout(function(){
                                nFire(is_land,2);
                            },1000)
                        },2000)
                        // setTimeout(function() {
                        //     open();
                        // },1000)
                    })
                    // await new Promise(function(open) {
                    //      $('.walAni').on("animationend webkitAnimationEnd", function(){
                    //         wDes(is_land,3)
                    //     })                        
                    // })                                                       
                })()                
            }
            //开始攻防 五
            if(myEne.toString() == '5,2,3' ) {
                (async function() {
                    let npcFireTime = null;
                    let npcFireTimes = null;
                    let npcFireTimet = null;
                    let plFireTime = null;
                    let plFireTimes = null;
                    let plFireTimet = null;                    
                    await new Promise(  function(open) {
                        plFireTime = setInterval(() => {
                            pfSty(is_land,1)
                            setTimeout(function(){
                                pFire(is_land);
                            },1000)                            
                            if(npcEne > 3){
                                npcEne--;
                            }   
                        },2000)
                        npcFireTime = setInterval(() => {
                            nfSty(is_land);
                            setTimeout(function(){
                                nFire(is_land,1);
                            },1000)                            
                            if(myEne[2] == 0) {
                                clearInterval(plFireTime);
                                clearInterval(npcFireTime);
                                $('.pfSty1,.nfSty').remove();
                                setTimeout(function(){
                                    $('.npc_fire1,.pl_fire').remove();
                                },1001)
                                open();
                            }
                            myEne[2]--;
                        },2000) 
                    })
                    await new Promise(function(open) {
                         $('.fangyu3').addClass('walAni');
                         $('.walAni').on("animationend webkitAnimationEnd", function(){
                            wDes(is_land,3);                                
                        })
                        plFireTimes = setInterval(() => {
                            pfSty(is_land,1);
                            setTimeout(function(){
                                pFire(is_land);
                            },1000)                            
                            if(npcEne > 1){
                                npcEne--;
                            }
                        },2000)
                        npcFireTimes = setInterval(() => {
                            nfSty(is_land);
                            setTimeout(function(){
                                nFire(is_land,2);
                            },1000)                            
                            if(myEne[1] == 0){
                                clearInterval(npcFireTimes);
                                clearInterval(plFireTimes);
                                $('.pfSty1,.nfSty').remove();
                                setTimeout(function(){
                                    $('.npc_fire2,.pl_fire').remove();
                                },1001)
                                open();
                            }
                            myEne[1]--;                            
                        },2000)
                        // setTimeout(function() {
                        //     $('.walAni').on("animationend webkitAnimationEnd", function(){
                        //         wDes(is_land,3);                                
                        //     })
                            
                        // },1000)
                    })
                    await new Promise(function(open) {
                        $('.fangyu2').addClass('colAni');
                        $('.colAni').on("animationend webkitAnimationEnd", function(){
                            cDes(is_land,2)                                
                        })
                        plFireTimet = setInterval(() => {
                            pfSty(is_land,1);
                            setTimeout(function(){
                                pFire(is_land);
                            },1000)
                            if(npcEne == 0){
                                clearInterval(npcFireTimet);
                                clearInterval(plFireTimet);
                                $('.pfSty1,.nfSty').remove();
                                setTimeout(function(){
                                    $('.npc_fire3,.pl_fire').remove();
                                },1001)
                                open();
                            }
                            npcEne--;
                        },2000)
                        npcFireTimet = setInterval(() => {
                            nfSty(is_land);
                            setTimeout(function(){
                                nFire(is_land,3);
                            },1000)                                                                       
                        },2000)
                        // setTimeout(function() {                          
                        //     $('.colAni').on("animationend webkitAnimationEnd", function(){
                        //         cDes(is_land,2)                                
                        //     })
                        // },1000)
                    })
                    await new Promise(function() {
                        $('.npc_boat').addClass('npcAni');
                        $('.npcAni').on("animationend webkitAnimationEnd", function(){
                            nDes(is_land);                            
                            $('.npc_boom').remove();
                            setTimeout(function() {
                                vic();
                            },1000)                                    
                        })
                    })                                                       
                })()                
            }
            //开始攻防 六
            if(myEne.toString() == '5,3,2' ) {
                (async function() {
                    let npcFireTime = null;
                    let npcFireTimes = null;
                    let npcFireTimet = null;
                    let plFireTime = null;
                    let plFireTimes = null;
                    let plFireTimet = null;                    
                    await new Promise(  function(open) {
                        plFireTime = setInterval(() => {
                            pfSty(is_land,1);
                            setTimeout(function(){
                                pFire(is_land);
                            },1000)                            
                            if(npcEne > 4){
                                npcEne--;
                            }   
                        },2000)
                        npcFireTime = setInterval(() => {
                            nfSty(is_land);
                            setTimeout(function(){
                                nFire(is_land,1);
                            },1000)                            
                            if(myEne[2] == 0) {
                                clearInterval(plFireTime);
                                clearInterval(npcFireTime);
                                $('.pfSty1,.nfSty').remove();
                                setTimeout(function(){
                                    $('.npc_fire1,.pl_fire').remove();
                                },1001)
                                open();
                            }
                            myEne[2]--;
                        },2000) 
                    })
                    await new Promise(function(open) {
                        $('.fangyu3').addClass('colAni');
                        $('.colAni').on("animationend webkitAnimationEnd", function(){
                            cDes(is_land,3);                                
                        })
                        plFireTimes = setInterval(() => {
                            pfSty(is_land,1);
                            setTimeout(function(){
                                pFire(is_land);
                            },1000)                            
                            if(npcEne > 1){
                                npcEne--;
                            }
                        },2000)
                        npcFireTimes = setInterval(() => {
                            nfSty(is_land);
                            setTimeout(function(){
                                nFire(is_land,2);
                            },1000)                            
                            if(myEne[1] == 0){
                                clearInterval(npcFireTimes);
                                clearInterval(plFireTimes);
                                $('.pfSty1,.nfSty').remove();
                                setTimeout(function(){
                                    $('.npc_fire2,.pl_fire').remove();
                                },1001)
                                open();
                            }
                            myEne[1]--;                            
                        },2000)
                        // setTimeout(function() {
                        //     $('.colAni').on("animationend webkitAnimationEnd", function(){
                        //         cDes(is_land,3);                                
                        //     })                            
                        // },1000)
                    })
                    await new Promise(function(open) {
                        $('.fangyu2').addClass('walAni');
                        $('.walAni').on("animationend webkitAnimationEnd", function(){
                            wDes(is_land,2)                               
                        })
                        plFireTimet = setInterval(() => {
                            pfSty(is_land,1);
                            setTimeout(function(){
                                pFire(is_land);
                            },1000)                            
                            if(npcEne == 0){
                                clearInterval(npcFireTimet);
                                clearInterval(plFireTimet);
                                $('.pfSty1,.nfSty').remove();
                                setTimeout(function(){
                                    $('.npc_fire3,.pl_fire').remove();
                                },1001)
                                open();
                            }
                            npcEne--;
                        },2000)
                        npcFireTimet = setInterval(() => {
                            nfSty(is_land);
                            setTimeout(function(){
                                nFire(is_land,3);
                            },1000)                                                                     
                        },2000)
                        // setTimeout(function() {
                        //      $('.walAni').on("animationend webkitAnimationEnd", function(){
                        //         wDes(is_land,2)                               
                        //     })
                        // },1000)
                    })
                    await new Promise(function() {
                        $('.npc_boat').addClass('npcAni');
                        $('.npcAni').on("animationend webkitAnimationEnd", function(){
                            nDes(is_land);
                            $('.npc_boom').remove();
                            setTimeout(function() {
                                vic();
                            },1000)                                    
                        })
                    })                                                       
                })()                
            }
        }
    })
    //主动攻击
    function pFire(is_land){
        let plFire;
        if(is_land){
            plFire = `<img src="image/all_boom_H.gif?${new Date().getTime()}" class="pl_fire">`; 
        }else{
            plFire = `<img src="image/all_boom.gif?${new Date().getTime()}" class="pl_fire">`;
        }
        if($('.pl_fire').length == 0){
            $('#banner').append(plFire);
        }else{                        
            $('.pl_fire').replaceWith(plFire);
        }
    }
    //敌人攻击
    function nFire(is_land,sc){
        let npcFire;
        if(is_land){
            npcFire = `<img src="image/all_boom_H.gif?${new Date().getTime()}" class="npc_fire${sc}">`;
        }else{
            npcFire = `<img src="image/all_boom.gif?${new Date().getTime()}" class="npc_fire${sc}">`;
        }                            
        if($('.npc_fire1').length == 0){
            $('#banner').append(npcFire);
        }else{                        
            $('.npc_fire1').replaceWith(npcFire);
        }
    }   
    //失败
    function def(){
        $("#banner").append("<div class='def' style='z-index:2'></div>");
        setTimeout(function(){
            $('.def').remove();
            $("#banner").append("<a href='javascript:void(0)' class='advertising addef down' style='z-index:2'></a>");
        },1000)
    }
    //成功
    function vic(){
        $("#banner").append("<div class='vic' style='z-index:2'></div>");
        setTimeout(function(){
            $('.vic').remove();
            $("#banner").append("<a href='javascript:void(0)' class='advertising advic down' style='z-index:2'></a>");
        },1000)
    }
    //友军全部摧毁
    function aDes(is_land,arr){
        if(is_land){
            $('.fangyu3').css('backgroundImage',`url("image/player_boat_destroy_H.png")`);
            $(`.fangyu${arr[0]}`).css('backgroundImage',`url("image/wall_destroy_H.png")`);
             $(`.fangyu${arr[1]}`).css('backgroundImage',`url("image/column_destroy_H.png")`);
        }else{
            $('.fangyu3').css('backgroundImage',`url("image/player_boat_destroy.png")`);
            $(`.fangyu${arr[0]}`).css('backgroundImage',`url("image/wall_destroy.png")`);
            $(`.fangyu${arr[1]}`).css('backgroundImage',`url("image/column_destroy.png")`);
        }
        $('.pl_city').css('backgroundImage',`url("image/player_city_destroy.png")`);
    }
    //敌军被摧毁
    function nDes(is_land){
        if(is_land){
            $('.npc_boat').css('backgroundImage',`url("image/npc_boat_destroy_H.png")`);
        }else{
            $('.npc_boat').css('backgroundImage',`url("image/npc_boat_destroy.png")`);
        }
    }
    //column摧毁
    function cDes(is_land,ind){
        if(is_land){
            $(`.fangyu${ind}`).css('backgroundImage',`url("image/column_destroy_H.png")`);
        }else{
            $(`.fangyu${ind}`).css('backgroundImage',`url("image/column_destroy.png")`);
        }
    }
    //wall摧毁
    function wDes(is_land,ind){
        if(is_land){
            $(`.fangyu${ind}`).css('backgroundImage',`url("image/wall_destroy_H.png")`);
        }else{
            $(`.fangyu${ind}`).css('backgroundImage',`url("image/wall_destroy.png")`);
        }
    }
    //down按钮
    $("#banner").on("click",".down",function () {
        var userAgent = navigator.userAgent || navigator.vendor;
        var url = "https://itunes.apple.com/app/fleet-command-win-legion-war/id1039748465";
        var android = "https://play.google.com/store/apps/details?id=com.movga.fleetcommand.gp";
        if (/android/i.test(userAgent)) {
            url = android;
        }
        $(".down").attr("href",url);
    });
    //npc开火特效
    function nfSty(is_land){
        let nfSty;
        if(is_land){
            nfSty = `<img src="image/npc_boat_fire_H.gif?${new Date().getTime()}" class="nfSty">`; 
        }else{
            nfSty = `<img src="image/npc_boat_fire.gif?${new Date().getTime()}" class="nfSty">`;
        }
        if($('.nfSty').length == 0){
            $('#banner').append(nfSty);
        }else{                        
            $('.nfSty').replaceWith(nfSty);
        }       
    }
    //pl开火特效
    function pfSty(is_land,ind){
        let pfSty;
        if(is_land){
            pfSty = `<img src="image/player_boat_fire_H.gif?${new Date().getTime()}" class="pfSty${ind}">`;
        }else{
            pfSty = `<img src="image/player_boat_fire.gif?${new Date().getTime()}" class="pfSty${ind}">`;
        }
        if($(`.pfSty${ind}`).length == 0){
            $('#banner').append(pfSty);
        }else{                        
            $(`.pfSty${ind}`).replaceWith(pfSty);
        }
    }
    //按钮闪烁
    function btn_sh(){
        for(let i = 0; i < btnList.length; i++){
            if(btnList[i] == 1){
                //console.log($('.btn_list').children('i'))
                $(`.btn_list>li:eq(${i})`).addClass('btn_op')
            }
        }
    } 
});