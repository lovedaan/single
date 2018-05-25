/*
 * @Author: Marte
 * @Date:   2017-08-20 17:21:11
 * @Last Modified by:   Marte
 * @Last Modified time: 2018-04-14 11:22:23
 */

require.config({
    baseUrl: './',
    paths: {
        'avalon': 'lib/avalon/avalon.shim'
    },
    shim: {}
});

require(['avalon', 'util', 'animateFun'], function(avalon, util, animateFun) {

    var vm = avalon.define({
        $id: 'mainContorller',
        wokrsList: [{
            text: '这是第一个图片',
            src: 'images/worksimg1.jpg'
        }, {
            text: '这是第二个图片',
            src: 'images/worksimg2.jpg'
        }, {
            text: '这是第三个图片',
            src: 'images/worksimg3.jpg'
        }, {
            text: '这是第四个图片',
            src: 'images/worksimg4.jpg'
        }],
        oNav: null,
        oLiNav: null,
        oArrow: null,
        mainContent: null,
        conList: null,
        pageCon: null,
        aliList: null,
        oHeader: null,
        banner: null,
        bannerLi: null,
        bannerSpan: null,
        slideMenuLi: null,
        oList: null,
        oLiLen: '',
        contentHeight: 0,
        iNow: 0,
        oldIndex: 0,
        offBtn: true,
        //程序的初始化应用入口
        init: function() {
            vm.oNav = util.getDom('#nav');
            vm.oLiNav = util.getAllDom('#nav li');
            vm.oArrow = util.getDom('#arrow');
            vm.mainContent = util.getDom('#main-content');
            vm.conList = util.getDom('#con-list');
            vm.oHeader = util.getDom('#header');
            vm.banner = util.getDom('#banner');
            vm.bannerLi = util.getAllDom('#banner .imgList li', vm.banner);
            vm.bannerSpan = util.getAllDom('#banner .circleList span', vm.conList);
            vm.aliList = util.getAllDom('#con-list li', vm.conList);
            vm.pageCon = util.getAllDom('#con-list li .pageCon', vm.conList);
            vm.slideMenuLi = util.getAllDom('#slide-menu span', vm.mainContent);
            vm.oList = util.getDom('#imgCanlist');
            vm.oLiLen = vm.oLiNav.length;

            //调用初始化事件
            vm.initEvent();
        },
        //程序的初始化事件
        initEvent: function() {
            vm.initLoading(function() {
                animateFun[0].inAn();
                vm.bindBanner();
            });
            vm.contentAuto();
            vm.initAnimate();
            vm.bindNav();
            vm.mousewheelMove();
            vm.createCanvasLi();
            window.addEventListener('resize', vm.contentAuto);

            //vm.toMove(4);
        },
        //首页banner图的控制
        bindBanner: function() {
            var len = vm.bannerLi.length;
            var oldIndex = 0;
            var iNum = 0;
            var timer = null;
            for (var i = 0; i < len; i++) {
                vm.bannerSpan[i].index = i;
                vm.bannerSpan[i].onclick = function() {
                    for (var i = 0; i < len; i++) {
                        vm.bannerSpan[i].className = '';
                    }
                    this.className = 'active';

                    if (oldIndex < this.index) {
                        vm.bannerLi[oldIndex].className = 'leftHide';
                        vm.bannerLi[this.index].className = 'rightShow';
                    } else if (oldIndex > this.index) {
                        vm.bannerLi[oldIndex].className = 'rightHide';
                        vm.bannerLi[this.index].className = 'leftShow';
                    }

                    oldIndex = this.index;
                    iNum = this.index;
                }
            }

            clearInterval(timer);
            timer = setInterval(autoPlay, 3000);

            function autoPlay() {
                iNum++;
                if (iNum == len) {
                    iNum = 0;
                }
                for (var i = 0; i < len; i++) {
                    vm.bannerSpan[i].className = '';
                }
                vm.bannerSpan[iNum].className = 'active';


                vm.bannerLi[oldIndex].className = 'leftHide';
                vm.bannerLi[iNum].className = 'rightShow';

                oldIndex = iNum;

            }

            vm.banner.addEventListener('mouseenter', function() {
                clearInterval(timer);
            });

            vm.banner.addEventListener('mouseleave', function() {
                clearInterval(timer);
                timer = setInterval(autoPlay, 3000);
            });
        },
        //顶部导航的切换和侧边导航的切换逻辑
        bindNav: function() {
            var oDiv = util.getAllDom('#nav li div', vm.oLiNav[0])[0];
            util.reTransition(vm.oArrow);
            util.reTransition(oDiv);
            vm.oArrow.style.left = vm.oLiNav[0].offsetLeft + vm.oLiNav[0].offsetWidth / 2 + 'px';
            oDiv.style.width = '100%';
            for (var i = 0; i < vm.oLiLen; i++) {
                vm.oLiNav[i].index = i;
                vm.slideMenuLi[i].index = i;
                vm.oLiNav[i].onclick = function() {
                    vm.toMove(this.index, 'oLi');
                    vm.iNow = this.index;
                }
                vm.slideMenuLi[i].onclick = function() {
                    vm.toMove(this.index, 'oLi');
                    vm.iNow = this.index;
                }
            }
        },
        /*
         *这个是核心的运动主体，页面切换
         *有三个因素可以切换页面
         *1.点击顶部的导航
         *2.左侧的侧边导航
         *3.鼠标滚轮，向上或向下
         *每一个操作都会带动其他的，全局维护一个iNow变量来联动
         */
        toMove: function(index) {
            //上一个页面要执行出场动画
            //当前要页面要执行入场动画

            animateFun[vm.oldIndex].outAn();
            animateFun[index].inAn();


            for (var i = 0; i < vm.oLiLen; i++) {
                var oDiv = util.getAllDom('#nav li div', vm.oLiNav[i])[0];
                oDiv.style.width = '0';
                vm.slideMenuLi[i].className = '';
            }

            var oDiv = util.getAllDom('#nav li div', vm.oLiNav[index])[0];
            util.setTransition(vm.oArrow);
            util.setTransition(oDiv);
            vm.slideMenuLi[index].className = 'active';
            oDiv.style.width = '100%';
            vm.oArrow.style.left = vm.oLiNav[index].offsetLeft + vm.oLiNav[index].offsetWidth / 2 + 'px';
            vm.conList.style.top = -vm.contentHeight * index + 'px';
            //每次把当前的index索引赋值给vm.oldIndex
            //那么vm.oldIndex就是上一个页面的索引
            vm.oldIndex = index;
        },
        //鼠标滚动的业务
        mousewheelMove: function() {
            //detail的值 1--->向下  -1 ---> 向上
            util.mousewheel(vm.mainContent, function(ev, detail) {
                //console.log(detail);
                if (!vm.offBtn) {
                    return;
                }
                vm.offBtn = false;
                if (detail == 1) {
                    vm.iNow != vm.oLiLen - 1 && vm.iNow++;
                } else {
                    vm.iNow != 0 && vm.iNow--;
                }
                vm.toMove(vm.iNow);

                ev.preventDefault();
                setTimeout(function() {
                    vm.offBtn = true;
                }, 700);
            });

            /* util.listenTransition(vm.conList, function(ev) {
                 console.log(ev);
             });*/
        },
        //动态生成canvas标签
        createCanvasLi: function() {
            for (var i = 0; i < 8; i++) {
                var li = document.createElement('li');
                li.style.backgroundPosition = -i * 118 + 'px 0px';
                vm.oList.appendChild(li);
            }

            vm.bindCanvasLi();
        },
        //操作canvas，生成绚丽的粒子动画
        bindCanvasLi: function() {
            var oC = null;
            var aLi = vm.oList.querySelectorAll('#imgCanlist li');
            var len = aLi.length;
            for (var i = 0; i < len; i++) {
                aLi[i].index = i;
                aLi[i].onmouseenter = function() {
                    for (var i = 0; i < len; i++) {
                        aLi[i].className = '';
                    }
                    createCanvas(this.index);
                    this.className = 'active';
                }

                aLi[i].onmouseleave = function() {
                    if (oC) {
                        this.removeChild(oC);
                        oC = null;
                        this.className = '';
                    }
                }
            }

            function createCanvas(index) {
                if (!oC) {
                    oC = document.createElement('canvas');
                    oC.id = 'c1';
                    oC.width = 118;
                    oC.height = 418;
                    aLi[index].appendChild(oC);
                    runMove(oC);
                }
            }

            function runMove(oC) {
                var ctx = oC.getContext("2d");
                var setArr = [];
                setInterval(function() {
                    //console.log(setArr.length);
                    ctx.clearRect(0, 0, oC.width, oC.height);

                    for (var i = 0; i < setArr.length; i++) {
                        setArr[i].num += 5;

                        setArr[i].x = setArr[i].startX - Math.sin(setArr[i].num * Math.PI / 180) * setArr[i].step;
                        setArr[i].y = setArr[i].startY - (setArr[i].num * Math.PI / 180) * setArr[i].step;

                        if (setArr[i].y <= 50) {
                            setArr.splice(i, 1);
                        }
                    }

                    for (var i = 0; i < setArr.length; i++) {
                        ctx.beginPath();
                        ctx.moveTo(setArr[i].x, setArr[i].y);
                        ctx.fillStyle = 'rgba(' + setArr[i].rColor + ',' + setArr[i].gColor + ',' + setArr[i].bColor + ',' + setArr[i].a + ')';
                        ctx.arc(setArr[i].x, setArr[i].y, setArr[i].r, 0, 2 * Math.PI);
                        ctx.closePath();
                        ctx.fill();
                    }

                }, 1000 / 60);

                setInterval(function() {

                    var w = Math.random() * oC.width;
                    var h = oC.height - 150;
                    var r = Math.random() * 6 + 2; // 2-8
                    var rColor = parseInt(Math.random() * 255);
                    var gColor = parseInt(Math.random() * 255);
                    var bColor = parseInt(Math.random() * 255);
                    var a = 1;
                    var num = 0;
                    var step = Math.random() * 20 + 10;
                    var startX = w;
                    var startY = h;
                    setArr.push({
                        x: w,
                        y: h,
                        r: r,
                        rColor: rColor,
                        gColor: gColor,
                        bColor: bColor,
                        a: a,
                        num: num,
                        step: step,
                        startX: startX,
                        startY: startY
                    });

                }, 100);
            }
        },
        //动态调整页面的版心
        contentAuto: function() {
            vm.contentHeight = util.viewHeight() - vm.oHeader.offsetHeight;
            vm.mainContent.style.height = vm.contentHeight + 'px';
            for (var i = 0; i < vm.oLiLen; i++) {
                vm.aliList[i].style.height = vm.contentHeight + 'px';
                vm.pageCon[i].style.height = vm.contentHeight + 'px';
            }
        },
        //loading动画，图片预加载
        initLoading: function(callback) {
            var arrImg = ['images/about1.jpg', 'images/about2.jpg', 'images/about3.jpg', 'images/about4.jpg', 'images/about1.jpg', 'images/pencel1.png', 'images/pencel2.png', 'images/pencel3.png', 'images/plane1.png', 'images/plane2.png', 'images/plane3.png', 'images/logo.png', 'images/robot.png', 'images/home.png', 'images/home_gruen.png', 'images/worksimg1.jpg', 'images/worksimg2.jpg', 'images/worksimg3.jpg', 'images/worksimg4.jpg', 'images/team.png', 'images/zoomico.png'];
            var loading = util.getDom('#loading');
            var div = util.getAllDom('#loading div', loading);
            var bar = util.getDom('#loading span');
            var viewWidth = util.viewWidth();
            var iNum = 0;
            var len = arrImg.length;
            for (var i = 0; i < len; i++) {
                var oImg = new Image();
                oImg.src = arrImg[i];
                oImg.onload = function() {
                    iNum++;
                    util.css(bar, {
                        'width': iNum / len * 100 + '%'
                    });
                    if (iNum == len) {
                        bar.style.display = 'none';
                        util.css(div[0], {
                            'top': -viewWidth / 2 + 'px',
                            'transition': '2s'
                        });
                        util.css(div[1], {
                            'bottom': -viewWidth / 2 + 'px',
                            'transition': '2s'
                        });
                        setTimeout(function() {
                            loading.style.display = 'none';
                            callback && callback();
                        }, 800);
                    }
                }

                oImg.onerror = function() {
                    bar.style.display = 'none';
                    util.css(div[0], {
                        'top': -viewWidth / 2 + 'px',
                        'transition': '2s'
                    });
                    util.css(div[1], {
                        'bottom': -viewWidth / 2 + 'px',
                        'transition': '2s'
                    });
                    setTimeout(function() {
                        loading.style.display = 'none';
                        callback && callback();
                    }, 800);
                }
            }
        },
        //初始化所有页面的动画，全部置于出场的状态
        //第一屏调用入场
        initAnimate: function() {
            //初始化调用全部的出场动画
            var len = animateFun.length;

            for (var i = 0; i < len; i++) {
                if (i != 0) {
                    animateFun[i].outAn();
                }
            }
        }
    });

    avalon.scan(document.body);
    vm.init();
});

/*
 *进场和出场动画
 *出场就是，在某个位置就位等待
 *入场就是，从某个位置运动到指定位置
 */
define('animateFun', ['util'], function(util) {

    var banner = util.getDom('#banner');
    var bannerList = util.getDom('#banner .imgList');
    var circleList = util.getDom('#banner .circleList');
    var oPlane1 = util.getDom('#course .plane1');
    var oPlane2 = util.getDom('#course .plane2');
    var oPlane3 = util.getDom('#course .plane3');
    var oPencel1 = util.getDom('#wokrs .pencel1');
    var oPencel2 = util.getDom('#wokrs .pencel2');
    var oPencel3 = util.getDom('#wokrs .pencel3');
    var aboutItem = util.getAllDom('#about .item');
    var leftText = util.getDom('#team .left-text');
    var rightText = util.getDom('#team .right-text');
    var anAll = [{
        inAn: function() {
            //第一屏的进场动画
            //console.log('第一屏的进场动画');
            util.css(bannerList, {
                'transition': '1s',
                'transform': 'translate(0,0)',
                'opacity': '1'
            });
            util.css(circleList, {
                'transition': '1s',
                'transform': 'translate(0,0)',
                'opacity': '1'
            });

        },
        outAn: function() {
            //第一屏的出场动画
            //console.log('第一屏的出场动画');
            util.css(bannerList, {
                'transition': '1s',
                'transform': 'translate(0,-300px)',
                'opacity': '0'
            });
            util.css(circleList, {
                'transition': '1s',
                'transform': 'translate(0,50px)',
                'opacity': '0'
            });
        }
    }, {
        inAn: function() {
            //第二屏的进场动画
            //console.log('第二屏的进场动画');
            util.css(oPlane1, {
                'transform': 'translate(0px,0px)',
                'transition': '1s',
                'opacity': '1'
            });
            util.css(oPlane2, {
                'transform': 'translate(0px,0px)',
                'transition': '1s',
                'opacity': '1'
            });
            util.css(oPlane3, {
                'transform': 'translate(0px,0px)',
                'transition': '1s',
                'opacity': '1'
            });
        },
        outAn: function() {
            //第二屏的出场动画
            //console.log('第二屏的出场动画');
            util.css(oPlane1, {
                'transform': 'translate(-200px,-200px)',
                'transition': '1s',
                'opacity': '0'
            });
            util.css(oPlane2, {
                'transform': 'translate(-200px,200px)',
                'transition': '1s',
                'opacity': '0'
            });
            util.css(oPlane3, {
                'transform': 'translate(200px,-200px)',
                'transition': '1s',
                'opacity': '0'
            });
        }
    }, {
        inAn: function() {
            //第三屏的进场动画
            //console.log('第三屏的进场动画');
            util.css(oPencel1, {
                'transform': 'translate(0px,0px)',
                'transition': '1s',
                'opacity': '1'
            });
            util.css(oPencel2, {
                'transform': 'translate(0px,0px)',
                'transition': '1s',
                'opacity': '1'
            });
            util.css(oPencel3, {
                'transform': 'translate(0px,0px)',
                'transition': '1s',
                'opacity': '1'
            });
        },
        outAn: function() {
            //第三屏的出场动画
            // console.log('第三屏的出场动画');
            util.css(oPencel1, {
                'transform': 'translate(100px,-100px)',
                'transition': '1s',
                'opacity': '0'
            });
            util.css(oPencel2, {
                'transform': 'translate(-100px,100px)',
                'transition': '1s',
                'opacity': '0'
            });
            util.css(oPencel3, {
                'transform': 'translate(100px,100px)',
                'transition': '1s',
                'opacity': '0'
            });
        }
    }, {
        inAn: function() {
            //第四屏的进场动画
            //console.log('第四屏的进场动画');
            util.css(aboutItem[0], {
                'transform': 'rotate(0deg)',
                'transition': '1s'
            });
            util.css(aboutItem[1], {
                'transform': 'rotate(0deg)',
                'transition': '1s'
            });
        },
        outAn: function() {
            //第四屏的出场动画
            //console.log('第四屏的出场动画');
            util.css(aboutItem[0], {
                'transform': 'rotate(40deg)',
                'transition': '1s'
            });
            util.css(aboutItem[1], {
                'transform': 'rotate(-20deg)',
                'transition': '1s'
            });
        }
    }, {
        inAn: function() {
            //第五屏的进场动画
            //console.log('第五屏的进场动画');
            util.css(leftText, {
                'transition': '1s',
                'transform': 'translate(0px,0px)',
                'opacity': '1'
            });
            util.css(rightText, {
                'transition': '1s',
                'transform': 'translate(0px,0px)',
                'opacity': '1'
            });
        },
        outAn: function() {
            //第五屏的出场动画
            //console.log('第五屏的出场动画');
            util.css(leftText, {
                'transition': '1s',
                'transform': 'translate(-200px,0px)',
                'opacity': '0'
            });
            util.css(rightText, {
                'transition': '1s',
                'transform': 'translate(200px,0px)',
                'opacity': '0'
            });
        }
    }];

    return anAll;
});
/*
 *工具函数
 */
define('util', function() {
    var util = {
        viewWidth: function() {
            return document.documentElement.clientWidth;
        },
        viewHeight: function() {
            return document.documentElement.clientHeight;
        },
        getDom: function(str) {
            return document.querySelector(str);
        },
        getAllDom: function(str, oP) {
            if (oP) {
                return oP.querySelectorAll(str);
            } else {
                return document.querySelectorAll(str);
            }

        },
        css: function(obj, opts) {
            if (!obj) {
                return;
            }

            if (typeof opts == 'object') {
                //设置css样式
                for (var key in opts) {
                    if (key == 'transform' || key == 'transition') {
                        var nowAttr = 'Webkit' + bigLetter(key);
                        obj.style[key] = opts[key];
                        obj.style[nowAttr] = opts[key];
                    } else {
                        obj.style[key] = opts[key];
                    }
                }
            } else {
                //获取值
                return getComputedStyle(obj, null)[opts];
            }


            function bigLetter(str) {
                var a = str.substr(0, 1);
                var b = str.substr(1);
                return a.toUpperCase() + b;
            }
        },
        mousewheel: function(obj, fn) {
            //谷歌和ie
            obj.addEventListener('mousewheel', function(ev) {
                // 往下滚 wheelDelta ：-120
                // 往上滚 wheelDelta ：120
                var detail = isUp(ev);
                fn && fn(ev, detail);
            }, false);
            //火狐的
            obj.addEventListener('DOMMouseScroll', function(ev) {
                // 往下滚 detail ：3
                // 往上滚 detail ：-3
                var detail = isUp(ev);
                fn && fn(ev, detail);
            }, false);

            //判断方向，1--->向下  -1 ---> 向上
            function isUp(ev) {
                if (ev.detail) {
                    return ev.detail > 0 ? 1 : -1;
                } else {
                    return ev.wheelDelta < 0 ? 1 : -1;
                }
            }

        },
        listenTransition: function(obj, fn) {
            obj.addEventListener('transitionEnd', function(ev) {
                fn && fn(ev);
            }, false);

            obj.addEventListener('webkitTransitionEnd', function(ev) {
                fn && fn(ev);
            }, false);
        },
        setTransition: function(obj) {
            obj.style.transition = '0.6s';
            obj.style.Transition = '0.6s';
        },
        reTransition: function(obj) {
            obj.style.transition = 'none';
            obj.style.Transition = 'none';
        }
    };

    return util;
});