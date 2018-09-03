/**
 * Admui-iframe v1.2.0 (http://www.admui.com/)
 * Copyright 2015-2018 Admui Team
 * Licensed under the Admui License 1.0 (http://www.admui.com/about/#license)
 */
(function (window, document, $) {
    'use strict';

    /* global layer */

    //layer基础配置
    if(typeof layer !== 'undefined'){
        layer.config({
            extend: '../retina.css'
        });
    }

// 一睹为快
// ================================================
    $('.getting-started > .btn').on('click', function () {
        var icon;

        switch ($(this).index('.getting-started > .btn')) {
            case 0:
                icon = -1;
                (function changeIcon() {
                    var index = parent.layer.alert('Hi，你好！ 点击确认更换图标', {
                        icon: icon,
                        shadeClose: true,
                        title: icon === -1 ? '初体验 - layer ' + layer.v : 'icon：' + icon + ' - layer ' + layer.v
                    }, changeIcon);
                    if (8 === ++icon) {
                        parent.layer.close(index);
                    }
                }());
                break;
            case 1:
                icon = 0;
                (function changeIcon1() {
                    parent.layer.alert('我们对layer的皮肤进行了部分重写，使其支持Retina屏幕，这可能会对第三方皮肤造成影响', {
                        icon: icon,
                        shadeClose: true,
                        skin: 'layer-ext-moon'
                    });
                }());
                break;

            case 2:
                //询问框
                parent.layer.confirm('您是如何看待前端开发？', {
                    btn: ['重要', '奇葩'] //按钮
                }, function () {
                    parent.layer.msg('的确很重要', {icon: 1});
                }, function () {
                    parent.layer.msg('也可以这样', {
                        time: 20000, //20s后自动关闭
                        btn: ['明白了', '知道了']
                    });
                });
                break;

            case 3:
                //提示层
                parent.layer.msg('玩命提示中');
                break;

            case 4:
                //墨绿深蓝风
                parent.layer.alert('墨绿风格，点击确认看深蓝', {
                    skin: 'layui-layer-molv', //样式类名
                    closeBtn: 0
                }, function () {
                    parent.layer.alert('偶吧深蓝style', {
                        skin: 'layui-layer-lan',
                        closeBtn: 0,
                        anim: 4 //动画类型
                    });
                });
                break;

            case 5:
                //捕获页
                parent.layer.open({
                    type: 1,
                    shade: false,
                    title: false, //不显示标题
                    content: $('.layer-notice'), //捕获的元素
                    cancel: function () {
                        parent.layer.msg('捕获就是从页面已经存在的元素上，包裹layer的结构', {time: 5000, icon: 6});
                    }
                });
                break;

            case 6:
                //页面层
                parent.layer.open({
                    type: 1,
                    skin: 'layui-layer-rim', //加上边框
                    area: ['420px', '240px'], //宽高
                    content: '<div>任意html内容</div>'
                });
                break;

            case 7:
                parent.layer.open({
                    type: 1,
                    skin: 'layui-layer-demo',
                    closeBtn: false,
                    area: '350px',
                    anim: 2,
                    shadeClose: true,
                    content: '<div>即传入skin:"样式名"，然后你就可以为所欲为了。<br>你怎么样给她整容都行<br><br><br>我是华丽的酱油==。</div>'
                });
                break;

            case 8:
                layer.tips('Hi，我是tips', this);
                break;

            case 9:
                //iframe层
                parent.layer.open({
                    type: 2,
                    title: 'layer mobile页',
                    shadeClose: true,
                    shade: 0.8,
                    area: ['380px', '90%'],
                    content: '//layer.layui.com/mobile/' //iframe的url
                });
                break;

            case 10:
                //iframe窗
                parent.layer.open({
                    type: 2,
                    title: false,
                    closeBtn: 0, //不显示关闭按钮
                    shade: [0],
                    area: ['340px', '215px'],
                    offset: 'rb', //右下角弹出
                    time: 2000, //2秒后自动关闭
                    anim: 2,
                    content: ['//layer.layui.com/test/guodu.html', 'no'], //iframe的url，no代表不显示滚动条
                    end: function () { //此处用于演示
                        parent.layer.open({
                            type: 2,
                            title: '很多时候，我们想最大化看，比如像这个页面。',
                            shadeClose: true,
                            shade: false,
                            maxmin: true, //开启最大化最小化按钮
                            area: ['960px', '500px'],
                            content: '//fly.layui.com/'
                        });
                    }
                });
                break;

            case 11:
                var ii = parent.layer.load(0, {shade: false});
                setTimeout(function () {
                    parent.layer.close(ii);
                }, 5000);
                break;
            case 12:
                var iii = parent.layer.load(1, {
                    shade: [0.1, '#fff']
                });
                setTimeout(function () {
                    parent.layer.close(iii);
                }, 3000);
                break;
            case 13:
                layer.tips('我是另外一个tips，只不过我长得跟之前那位稍有些不一样。', this, {
                    tips: [1, '#3595CC'],
                    time: 4000
                });
                break;
            case 14:
                parent.layer.prompt({title: '输入任何口令，并确认', formType: 1}, function (pass, index) {
                    parent.layer.close(index);
                    parent.layer.prompt({title: '随便写点啥，并确认', formType: 2}, function (text, index) {
                        parent.layer.close(index);
                        parent.layer.msg('演示完毕！您的口令：' + pass + '<br>您最后写下了：' + text);
                    });
                });
                break;
            case 15:
                parent.layer.tab({
                    area: ['600px', '300px'],
                    tab: [{
                        title: '无题',
                        content: '<div>欢迎体验layer.tab<br>此时此刻不禁让人吟诗一首：<br>一入前端深似海<br>从此妹纸是浮云<br>以下省略七个字<br>。。。。。。。<br>——贤心</div>'
                    }, {
                        title: 'TAB2',
                        content: '<div>TAB2该说些啥</div>'
                    }, {
                        title: 'TAB3',
                        content: '<div>有一种坚持叫：layer</div>'
                    }]
                });
                break;
            case 16:
                $.getJSON('/public/data/examples/components/layer-photos.json', function (json) {
                    // 见：public/themes/classic/global/js/configs/site-configs.js
                    parent.layer.photos({
                        photos: json
                    });
                });
                break;
            default:
                parent.layer.msg('Hi!');
                break;
        }
    });

// 再试牛刀
// ================================================
    $('.advanced .btn').on('click', function () {
        switch ($(this).index('.advanced button')) {
            case 0:
                //信息框-例1
                parent.layer.alert('见到你真的很高兴', {icon: 6});
                break;
            case 1:
                //信息框-例2
                parent.layer.msg('你确定你很帅么？', {
                    time: 0, //不自动关闭
                    btn: ['必须啊', '丑到爆'],
                    yes: function (index) {
                        parent.layer.close(index);
                        parent.layer.msg('雅蠛蝶 O.o', {
                            icon: 6,
                            time: 0,
                            btn: ['嗷', '嗷', '嗷']
                        });
                    }
                });
                break;
            case 2:
                //信息框-例3
                parent.layer.msg('这是最常用的吧');
                break;
            case 3:
                //信息框-例4
                parent.layer.msg('不开心。。', {icon: 5});

                break;
            case 4:
                //信息框-例5
                parent.layer.msg('玩命卖萌中', function () {
                    //关闭后的操作
                });
                break;
            case 5:
                //页面层-自定义
                parent.layer.open({
                    type: 1,
                    title: false,
                    closeBtn: 0,
                    shadeClose: true,
                    skin: 'yourclass',
                    content: '自定义HTML内容'
                });
                break;
            case 6:
                //页面层-城市
                parent.layer.open({
                    type: 1,
                    title: false,
                    area: ['600px','338px'],
                    skin: 'layui-layer-nobg', //没有背景色
                    shade: 0,
                    content: $('#city')
                });
                break;
            case 7:
                //iframe层-父子操作
                parent.layer.open({
                    type: 2,
                    area: ['700px', '450px'],
                    fixed: false, //不固定
                    shade: 0,
                    maxmin: true,
                    content: $.ctx + '/examples/components/advanced/_layer-iframe.html'
                });
                break;
            case 8:
                //iframe层-多媒体
                parent.layer.open({
                    type: 2,
                    title: false,
                    area: ['630px', '360px'],
                    shade: 0.8,
                    closeBtn: 0,
                    shadeClose: true,
                    content: '//player.youku.com/embed/XMjY3MzgzODg0'
                });
                parent.layer.msg('点击任意处关闭');
                break;
            case 9:
                //iframe层-禁滚动条
                parent.layer.open({
                    type: 2,
                    area: ['360px', '500px'],
                    skin: 'layui-layer-rim', //加上边框
                    content: ['//layer.layui.com/mobile/', 'no']
                });
                break;
            case 10:
                //加载层-默认风格
                parent.layer.load();
                //此处演示关闭
                setTimeout(function () {
                    parent.layer.closeAll('loading');
                }, 2000);
                break;
            case 11:
                //加载层-风格2
                parent.layer.load(1);
                //此处演示关闭
                setTimeout(function () {
                    parent.layer.closeAll('loading');
                }, 2000);
                break;
            case 12:
                //加载层-风格3
                parent.layer.load(2);
                //此处演示关闭
                setTimeout(function () {
                    parent.layer.closeAll('loading');
                }, 2000);
                break;
            case 13:
                //加载层-风格4
                parent.layer.msg('加载中', {
                    icon: 16,
                    shade: 0.01
                });
                break;
            case 14:
                //打酱油
                parent.layer.msg('尼玛，打个酱油', {icon: 4});
                break;
            case 15:
                layer.tips('上', this, {
                    tips: [1, '#000']
                });
                break;
            case 16:
                layer.tips('默认就是向右的', this);
                break;
            case 17:
                layer.tips('下', this, {
                    tips: 3
                });
                break;
            case 18:
                layer.tips('在很久很久以前，在很久很久以前，在很久很久以前……', this, {
                    tips: [4, '#78BA32']
                });
                break;
            case 19:
                layer.tips('不会销毁之前的', this, {tipsMore: true});
                break;
            case 20:
                //默认prompt
                parent.layer.prompt(function (val, index) {
                    parent.layer.msg('得到了' + val);
                    parent.layer.close(index);
                });
                break;
            case 21:
                //屏蔽浏览器滚动条
                parent.layer.open({
                    content: '浏览器滚动条已锁',
                    scrollbar: false
                });
                break;
            case 22:
                //弹出即全屏
                var index = parent.layer.open({
                    type: 2,
                    content: '//layim.layui.com',
                    area: ['320px', '195px'],
                    maxmin: true
                });
                parent.layer.full(index);
                break;
            case 23:
                //正上方
                parent.layer.msg('灵活运用offset', {
                    offset: 't',
                    anim: 6
                });
                break;
            default:
                parent.layer.msg('Hi!');
                break;
        }
    });

// 更多示例
// ================================================
    var demo = {
        //多窗口模式，层叠置顶
        multiple: function (that) {
            parent.layer.open({
                type: 2, //此处以iframe举例
                title: '当你选择该窗体时，即会在最顶端',
                area: ['390px', '330px'],
                shade: 0,
                offset: [ //为了演示，随机坐标
                    Math.random() * ($(window).height() - 300),
                    Math.random() * ($(window).width() - 390)
                ],
                maxmin: true,
                content: '//layer.layui.com/test/settop.html',
                btn: ['继续弹出', '全部关闭'], //只是为了演示
                yes: function () {
                    $(that).trigger('click'); //此处只是为了演示，实际使用可以剔除
                },
                btn2: function () {
                    parent.layer.closeAll();
                },
                zIndex: parent.layer.zIndex, //重点1
                success: function (layero) {
                    parent.layer.setTop(layero); //重点2
                }
            });
        },
        //配置一个透明的询问框
        confirmTm: function () {
            parent.layer.closeAll();
            parent.layer.msg('大部分参数都是可以公用的<br>合理搭配，展示不一样的风格', {
                time: 20000, btn: ['明白了', '知道了', '哦']
            });
        },
        //示范一个公告层
        notice: function () {
            parent.layer.open({
                type: 1,
                title: false,
                closeBtn: false,
                area: '300px;',
                shade: 0.8,
                id: 'LAY_layuipro',
                resize: false,
                content: '<div style="margin: -20px;padding: 50px; background-color: #393D49; color: #e2e2e2;">你知道吗？亲！<br>layer ≠ layui<br><br>layer只是作为Layui的一个弹层模块，由于其用户基数较大，所以常常会有人以为layui是layerui<br><br>layer虽然已被 Layui 收编为内置的弹层模块，但仍然会作为一个独立组件全力维护、升级。<br><br>我们此后的征途是星辰大海 ^_^</div>',
                btn: ['火速围观', '残忍拒绝'],
                btnAlign: 'c',
                moveType: 1,
                success: function (layero) {
                    var btn = layero.find('.layui-layer-btn');
                    btn.find('.layui-layer-btn0').attr({
                        href: 'http://www.layui.com/',
                        target: '_blank'
                    });
                }
            });
        },
        //边缘弹出
        offset: function (othis) {
            var type = othis.data('type'), text = othis.text();
            parent.layer.open({
                type: 1,
                offset: type,
                id: 'LAY_demo' + type,
                content: '<div style="padding: 20px 100px">' + text + '</div>',
                btn: '关闭全部',
                btnAlign: 'c',
                shade: 0,
                yes: function () {
                    parent.layer.closeAll();
                }
            });
        }
    };

    $('.more > .btn').on('click', function () {
        var othis = $(this), method = othis.attr('method');
        demo[method].call(this, othis);
    });
})(window, document, jQuery);