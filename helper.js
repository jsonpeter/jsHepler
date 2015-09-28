/**
 * Created by json.stank on 2015/9/14.
 */
!function(global){
   //配置文件
   var _$=function(){};
    _$.prototype= {
        //=====弹窗插件========
        layer:  function (obj) {
                var dfconfig = {
                    showBox: "box-layer", //展示的id
                    btnBox: "btn-layer", //点击显示id
                    maskBox: "mask-layer",//弹窗遮罩id
                    closeBox: "close" //关闭id
                };
                var config = typeof obj === "undefined" ? dfconfig : $.extend(dfconfig, obj);
                var objbox = getObjs(config.showBox);
                var objbtn = getObjs(config.btnBox);
                var objclose = getObjs(config.closeBox);
                var objmask = getObjs(config.maskBox);
                var arrobj = [objmask, objbox];
                addEvent(objbtn, "click", function () {
                    var i = 0;
                    while (i in arrobj) {
                        checkState.call(arrobj[i], 'display', 'block') ? arrobj[i].style.display = "none" : arrobj[i].style.display = "block";
                        i++;
                    }
                });
                addEvent(objclose, "click", function () {
                    objmask.style.display = "none";
                    objbox.style.display = "none"
                });
        },
        //=========公告插件==========
        notice:  function (obj) {
                var dfconfig = {
                    bigBox: "notice", //最大的id
                    listBox: "notice-list", //列表ID
                    listType: "a",//循环方式
                    numberBox: "notic-number",
                    number: true,//是否输出数字
                    numberSon: "span:cur:out",//数字框输出格式：（span:输出元素、cur:选中class，out:离开class）
                    speed: "5"//滚动速度
                };
                var config = typeof obj === "undefined" ? dfconfig : $.extend(dfconfig, obj);
                var bigbox = getObjs(config.bigBox);
                var listbox = getObjs(config.listBox);
                var numberBox = getObjs(config.numberBox) || false;
                var sonBox = getObjs_dom(listbox, config.listType);
                var out = config.numberSon.split('\:');
                var noticNow = 0;
                var sonNumber; //数字元素对象
                //是否输出数量
                if (numberBox !== false) {
                    sonNumber = outNumber(numberBox, out, config.number, sonBox.length, noticNow, 'notic-num', function (n) {
                        setnotic(noticNow = n);
                    });
                }
                var _timer=timer(function () {
                    setnotic(noticNow++);
                }, config.speed * 1000);
                addEvent(bigbox,"mouseover",function(){
                     clearInterval(_timer);
                    _timer=0;
                });
                addEvent(bigbox,"mouseout",function(){
                   _timer=timer(function () {
                       setnotic(noticNow++);
                   }, config.speed * 1000);
                });
                //核心方法
                function setnotic() {
                    //获取单行的高度
                    var _o = bigbox.offsetHeight;
                    noticNow = noticNow > sonBox.length - 1 ? 0 : noticNow < 0 ? sonBox.length - 1 : noticNow;
                    $(listbox).animate({marginTop: -(noticNow * _o) + "px"});
                    setCur(sonNumber, noticNow, out);
                }
        },
        //=========幻灯片插件========
        slider:function (obj) {
                //配置
                var dfconfig = {
                    showBox: "slider1", //展示超出元素
                    listType: "li",//以何种方式循环的
                    numberBox: "slider-number",//显示数字的元素，为空则不显示
                    number: true,//数字框是否显示数字
                    numberSon: "span:cur:out",//数字框输出格式：（span:输出元素、cur:选中class，out:离开class）
                    btnleft: "btn-left", //点击切换左边id
                    btnright: "btn-right",//点击切换右边id
                    transition: "", //关闭id
                    direction: "left",//显示方式（left：左右切换、top：上下切换）
                    speed: "5"//切换速度（单位：秒）
                };
                var config = typeof obj === "undefined" ? dfconfig : $.extend(dfconfig, obj);
                var showBox = getObjs(config.showBox);
                var sonBox = getObjs_dom(showBox, config.listType);
                var numberBox = getObjs(config.numberBox) || false;
                var btnleft = getObjs(config.btnleft) || "";
                var btnright = getObjs(config.btnright) || "";
                var out = config.numberSon.split('\:');
                var timerfn = function () {
                };
                var _time;
                var sonNumber; //拥有数字的元素个数
                var slidNow = 0;
                //总宽度
                var _wlist = ~~(sonBox.length * showBox.parentElement.offsetWidth);
                showBox.style.width = _wlist + "px";
                showBox.style.marginLeft="0px";
                var _o =$(sonBox).width(showBox.parentElement.offsetWidth)[0].offsetWidth;
                //先获取li个数并设置ul宽度
                var _slidtion = {
                    //-----左右滚动--------
                    left: function () {
                        timerfn = function () {
                            //获取单个块的宽度
                            var _s = sonBox.length - 1;
                            slidNow = slidNow < 0 ? _s : slidNow > _s ? 0 : slidNow;
                            _o=showBox.parentElement.offsetWidth;
                            var _m = _o * slidNow;
                            //滚动
                            if (_wlist <= _m) {
                                $(showBox).stop(true).animate({marginLeft: "0px"});
                            }
                            else {
                                $(showBox).stop(true).animate({marginLeft: -_m + "px"});
                            }
                        };
                    },
                    //-------上下滚动--------
                    top: function () {
                        //总宽度
                        var _wlist = ~~(sonBox.length * showBox.parentElement.offsetHeight);
                        showBox.style.width = _wlist + "px";
                        showBox.style.marginTop="0px";
                        timerfn = function () {
                            //获取单个块的高度
                            var _o =$(sonBox).height(showBox.parentElement.offsetHeight)[0].offsetHeight;
                            var _s = sonBox.length - 1;
                            slidNow = slidNow < 0 ? _s : slidNow > _s ? 0 : slidNow;
                            var _m = _o * slidNow;
                            //滚动
                            if (_wlist <= _m) {
                                $(showBox).stop(true).animate({marginTop: "0px"});
                            }
                            else {
                                $(showBox).stop(true).animate({marginTop: -_m + "px"});
                            }
                        };
                    }
                };
                //判断展示方式
                _slidtion[config.direction]();
                //切换效果公共方法
               timerfn.prototype.mySetcur = function () {
                    setCur(sonNumber, slidNow, out);
                };
                //是否输出数量
                if (numberBox !== false) {
                    numberBox.innerHTML="";
                    sonNumber = outNumber(numberBox, out, config.number, sonBox.length, slidNow, 'silder-num', function (n) {
                        new timerfn(slidNow = n).mySetcur();
                    });
                }
                //左右切换点击
                addEvent([btnright, btnleft], "click", function () {
                    if (this.id == config.btnleft) {
                        slidNow--;
                    } else {
                        slidNow++
                    }
                    new timerfn(slidNow).mySetcur();
                });
                //走你
               _time=timer(function () {
                   _time=0;
                    new timerfn(slidNow++).mySetcur();
                }, config.speed * 1000);
        }
    };
    //暴露给全局
    global.helper = new _$();
    //输出数字控制 obj目标输出，type输出类型 num输出个数 bl是否显示数字 glob全局统计
    function outNumber(obj,type,bl,num,glob,attr,fn) {
            var i = 0, html;
            var out = type || [];
            for (; i < num; i++) {
                html = document.createElement(out[0]);
                bl == true ? html.innerHTML = i + 1 : "";
                i === 0 ? html.className = out[1] : "";
                html.setAttribute(attr, i);
                obj.appendChild(html);
                //绑定事件
                addEvent(html, "click", function () {
                    glob = this.getAttribute(attr);
                    fn(glob);
                });

            }
            return getObjs_dom(obj, out[0]);
        }

    //设置样式
    function setCur(numobj,glob,arry){
        //当前选中Class设置
        var i=0;
        while(i<numobj.length)
        {
            numobj[i].className=arry[2]||"";
            i++;
        }
        numobj[glob].className=arry[1]||"";
    }
    //事件绑定
    function addEvent(obj,type,handler){
        var _obj=obj instanceof Array?obj:[obj];
        var i=0;
        for(;i<_obj.length;i++){
            !function(_i){
                if(_obj[_i].addEventListener){
                    _obj[_i].addEventListener(type,handler,false)
                }else{
                    _obj[_i].attachEvent("on"+type,function(){
                         handler.call(_obj[_i]);
                    });
                }
            }(i)
        }

    }
    //定时器
    function timer(fn,time){
        return setInterval(fn,time);
    }
    //获取指定的ID
    function getObjs(id){
        return document.getElementById(id);
    }
    //获取节点
    function getObjs_dom(docmt,div){
        var context=docmt||document;
        return context.getElementsByTagName(div);
    }
    //获取样式
    function getStyle(obj,attr){
        return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj, false)[attr];
    }
    //类型检查
    function checkState(proto,type){
        var _style=getStyle(this,proto);
        return _style===type||false;
    }
}(typeof window !== "undefined" ? window : this);
