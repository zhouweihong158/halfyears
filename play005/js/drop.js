/*
* @Author: 20911
* @Date:   2017-08-23 09:06:11
* @Last Modified by:   20911
* @Last Modified time: 2017-08-24 00:17:00
*/

function Game(){
    this.charSheet=[['Q','img/Q.png'],
        ['W','img/W.png'],
        ['E','img/E.png'],
        ['R','img/R.png'],
        ['T','img/T.png'],
        ['Y','img/Y.png'],
        ['U','img/U.png'],
        ['I','img/I.png'],
        ['O','img/O.png'],
        ['P','img/P.png'],
        ['A','img/A.png'],
        ['S','img/S.png'],
        ['D','img/D.png'],
        ['F','img/F.png'],
        ['G','img/G.png'],
        ['H','img/H.png'],
        ['J','img/J.png'],
        ['K','img/K.png'],
        ['L','img/L.png'],
        ['Z','img/Z.png'],
        ['X','img/X.png'],
        ['C','img/C.png'],
        ['V','img/v.png'],
        ['B','img/B.png'],
        ['N','img/N.png'],
        ['M','img/M.png']
    ];
    this.length=5;
    this.element=[];
    this.speed=10;
    this.num=0;
    this.score=0;
    this.guanqia=10;
    this.position=[];
    this.dijiguan=1;
    this.shengmingzhi=20;

}
Game.prototype={
    start:function(){
        this.products(this.length);
        this.drop();
        this.key();
    },
    products:function(length){
        for(let i=0;i<length;i++){
            this.product();
        }

    },
    checkRepeat:function(num){
        // let that=this;
        //   return that.element.some(function(value){
        //        return value.innerText==that.charSheet[num];
        // })
        return this.element.some(value=>{
            return value.innerText==this.charSheet[num][0];
        })

    },
    checkPosition:function(lefts){
        return this.position.some(function(value){
            console.log(2)
            return Math.abs(lefts-value)<70;
        })
    },
    product:function(){
        let xiabiao;
        do{
            xiabiao=Math.floor(Math.random()*this.charSheet.length);
        }while(this.checkRepeat(xiabiao));


        let div=document.createElement("div");
        div.classList.add("fangkuai");
        div.innerText=this.charSheet[xiabiao][0];
        document.body.appendChild(div);
        // let lefts=(window.innerWidth-400)*Math.random()+200;
        let  lefts;
        do{
            lefts=(window.innerWidth-400)*Math.random()+200;
        }while(this.checkPosition(lefts));
        let tops=Math.random()*100;
        div.style.top=`${tops}px`;
        div.style.backgroundImage=`url(${this.charSheet[xiabiao][1]})`;
        div.style.left=`${lefts}px`;
        this.element.push(div);
        this.position.push(lefts);

    },

    drop:function(){
        let that=this;
        console.log(this);


        //普通函数来写
        this.t=setInterval(function(){
            for(let i=0;i<that.element.length;i++){//不用element.length
                let oftop=that.element[i].offsetTop;
                that.element[i].style.top=`${oftop+that.speed}px`;//为啥放在这里？
                if(oftop>=300){
                    document.body.removeChild(that.element[i]);
                    let shengmingzhi=document.querySelector(".shengmingzhi>span");
                    that.shengmingzhi--;
                    shengmingzhi.innerText=that.shengmingzhi;
                    that.element.splice(i,1);
                    that.position.splice(i,1);
                }
            }
            if(that.element.length<that.length){
                that.product();
            }
        }, 500)
        // 箭头函数来写
        // setInterval(()=>{
        // 	console.log(this);
        // 	for(let i=0;i<this.element.length;i++){
        // 		let oftop=this.element[i].offsetTop;
        // 		this.element[i].style.top=`${oftop+this.speed}px`;
        // 	}
        // }, 500)

    },
    key:function(){
        let that=this;

        let defenzhi=document.querySelector(".jifen>span");
        console.log(defenzhi);

        document.onkeydown=function(e){
            let char=String.fromCharCode(e.keyCode);//keyCode  大小写
            for(let i=0;i<that.element.length;i++){
                if(char==that.element[i].innerText){

                    document.body.removeChild(that.element[i]);
                    that.position.splice(i,1);
                    that.element.splice(i,1);
                    that.score++;
                    console.log(that.score);
                    defenzhi.innerText=that.score;
                    if(that.score==that.guanqia){

                        confirm("要进入下一关吗？");
                        that.next();
                    }
                }

            }
        }

    },
    next:function(){
        clearInterval(this.t);
        let dijiguanzhi=document.querySelector(".dijiguan>span");
        this.dijiguan++;
        dijiguanzhi.innerText=this.dijiguan;
        this.length++;
        for(let i=0;i<this.element.length;i++){
            document.body.removeChild(this.element[i]);
        }
        this.element=[];
        this.position=[];
        this.start();
        this.guanqia+=10;
    }
}