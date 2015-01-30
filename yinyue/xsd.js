/**
 *  全局函数处理
 *  -----------------------------
 *  作者：叼怎么写！- -||
 *  时间：2014-03-26
 *  准则：Zpote、字面量对象
 *  联系：wechat--shoe11414255
 *  一张网页，要经历怎样的过程，才能抵达用户面前
 *  一个特效，要经历这样的修改，才能让用户点个赞
 *  一个产品，创意源于生活，源于内心，需要慢慢品味
 *********************************************************************************************/
var car2 = {
/****************************************************************************************************/
/*  对象私有变量/函数返回值/通用处理函数
*****************************************************************************************************/	
/*************************
 *  = 对象变量，判断函数
 *************************/
	_events 		: {},									// 自定义事件---this._execEvent('scrollStart');
	_windowHeight	: $(window).height(),					// 设备屏幕高度
	_windowWidth 	: $(window).width(),

	_rotateNode		: $('.p-ct'),							// 旋转体

	_page 			: $('.m-page'),							// 模版页面切换的页面集合
	_pageNum		: $('.m-page').size(),					// 模版页面的个数
	_pageNow		: 0,									// 页面当前的index数
	_pageNext		: null,									// 页面下一个的index数

	_touchStartValY	: 0,									// 触摸开始获取的第一个值
	_touchDeltaY	: 0,									// 滑动的距离

	_moveStart		: true,									// 触摸移动是否开始
	_movePosition	: null,									// 触摸移动的方向（上、下）
	_movePosition_c	: null,									// 触摸移动的方向的控制
	_mouseDown		: false,								// 判断鼠标是否按下
	_moveFirst		: true,
	_moveInit		: false,

	_firstChange	: false,

	_map 			: $('.ylmap'),							// 地图DOM对象
	_mapValue		: null,									// 地图打开时，存储最近打开的一个地图
	_mapIndex		: null,									// 开启地图的坐标位置

	_audioNode		: $('.u-audio'),						// 声音模块
	_audio			: null,									// 声音对象
	_audio_val		: true,									// 声音是否开启控制
	
	_elementStyle	: document.createElement('div').style,	// css属性保存对象

	_UC 			: RegExp("Android").test(navigator.userAgent)&&RegExp("UC").test(navigator.userAgent)? true : false,
	_weixin			: RegExp("MicroMessenger").test(navigator.userAgent)? true : false,
	_iPhoen			: RegExp("iPhone").test(navigator.userAgent)||RegExp("iPod").test(navigator.userAgent)||RegExp("iPad").test(navigator.userAgent)? true : false,
	_Android		: RegExp("Android").test(navigator.userAgent)? true : false,
	_IsPC			: function(){ 
						var userAgentInfo = navigator.userAgent; 
						var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"); 
						var flag = true; 
						for (var v = 0; v < Agents.length; v++) { 
							if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; } 
						} 
						return flag; 
					} ,


	
	

 
 	
 	
 

/**
 *  对象函数事件绑定处理
 *  -->start touch开始事件
 *  -->mov   move移动事件
 *  -->end   end结束事件
 */
 	
 
	

/**
 *  media资源管理
 *  -->绑定声音控制事件
 *  -->函数处理声音的开启和关闭
 *  -->异步加载声音插件（延迟做）
 *  -->声音初始化
 *  -->视频初始化
 *  -->声音和视频切换的控制
 */
 	// 声音初始化
 	audio_init : function(){
 		// media资源的加载
		var options_audio = {
			loop: true,
            preload: "auto",
            src: car2._audioNode.attr('data-src')
		}
		
        car2._audio = new Audio(); 

        for(var key in options_audio){
            if(options_audio.hasOwnProperty(key) && (key in car2._audio)){
                car2._audio[key] = options_audio[key];
            }
        }
        car2._audio.load();
 	},

 	// 声音事件绑定
 	audio_addEvent : function(){
 		if(car2._audioNode.length<=0) return;

 		// 声音按钮点击事件
 		var txt = car2._audioNode.find('.txt_audio'),
 			time_txt = null;
 		car2._audioNode.find('.btn_audio').on('click',car2.audio_contorl);

 		// 声音打开事件
 		$(car2._audio).on('play',function(){
 			car2._audio_val = false;

 			audio_txt(txt,true,time_txt);

 			// 开启音符冒泡
 			$.fn.coffee.start();
 			$('.coffee-steam-box').show(500);
 		})

 		// 声音关闭事件
 		$(car2._audio).on('pause',function(){
 			audio_txt(txt,false,time_txt)

 			// 关闭音符冒泡
 			$.fn.coffee.stop();
 			$('.coffee-steam-box').hide(500);
 		})

 		function audio_txt(txt,val,time_txt){
 			if(val) txt.text('打开');
 			else txt.text('关闭');

 			if(time_txt) clearTimeout(time_txt);

 			txt.removeClass('z-move z-hide');
 			time_txt = setTimeout(function(){
 				txt.addClass('z-move').addClass('z-hide');
 			},1000)
 		}
 	},

 	// 声音控制函数
 	audio_contorl : function(){
 		if(!car2._audio_val){
 			car2.audio_stop();
 		}else{
 			car2.audio_play();
 		}
 	},	

 	// 声音播放
 	audio_play : function(){
 		car2._audio_val = false;
 		if(car2._audio) car2._audio.play();
 	},

 	// 声音停止
 	audio_stop	: function(){
 		car2._audio_val = true;
 		if(car2._audio) car2._audio.pause(); 
 	},

 	// 视频初始化
 	video_init : function(){
 		$('.btn_play').on('click touchstart', function(e){
 			var target = $(e.target),
 				vid = target.attr('data-vid');
 			if (!vid) return;
 			
 			// if (false && /iPhone|ipod/i.test(navigator.userAgent)) {	//所有都使用iframe
 			// 	this.target = target;
 				
 			// 	this.clearIFrame();

 			// 	new vjs.auth().getAuth({vid: vid}, vjs.proxy(this, this.authSucc), vjs.proxy(this, this.authFail));
 			// } else {
 				if (target.next().hasClass('ifr_player')) return;

 				car2.clearIFrame();

 				var tpl = '<div class="ifr_player"><iframe src="http://minisite.letv.com/playermms/index.shtml?vid='+vid+'" width="100%" height="100%" style="width:100%;height:100%;" frameborder="0"></iframe></div>';
 				target.parent().append(tpl); 
 			// }
 		});
 	},

 	clearIFrame : function() {
 		car2.audio_stop();
 		$('.ifr_player').each(function(){
 			$(this).remove();
 		});
 		$('video').each(function(){
 			$(this).remove();
 		});
 	},

 
 	//处理声音和动画的切换
	media_control : function(){
		if(!car2._audio) return;
		if($('video').length<=0) return;

		$(car2._audio).on('play', function(){
			$('video').each(function(){
				if(!this.paused){
					this.pause();
				}
			});	
		});

		$('video').on('play', function(){
			if(!car2._audio_val){
				car2.audio_contorl();			
			}
		});
	},

	// media管理初始化
	media_init : function(){
		// 声音初始化
		car2.audio_init();

        // 视频初始化
        car2.video_init();

		// 绑定音乐加载事件
		car2.audio_addEvent();

		// 音频切换
		car2.media_control();
	},




/**************************************************************************************************************/
/*  函数初始化
***************************************************************************************************************/
/**
 *  相关插件的启动
 */
	//插件启动函数
 	plugin : function(){
		

	
	
 	},

 	// 蒙板插件初始化函数处理
 	cover_draw : function(node,url,canvas_url,type,w,h,callback){
		if(node.style.display.indexOf('none')>-1) return;
		
		var lottery = new Lottery(node, canvas_url, type, w, h, callback);
		lottery.init();
	},

	// 蒙板插件回调函数处理
 	start_callback : function(){
 		// 隐藏蒙板
 		$('#j-mengban').removeClass('z-show');
 		setTimeout(function(){
 			$('#j-mengban').addClass('f-hide');
 		},1500)

 		// 开启window的滚动
 		car2._scrollStart();

 		// 开启页面切换
		car2.page_start();

		// 播放声音
		if(!car2._audio) return;
		car2._audioNode.removeClass('f-hide');
		car2._audio.play();

		// 声音启动
		$(document).one("touchstart", function(){
            car2._audio.play();
        });
 	},



	show : function() {
		//主面板显示
		$('.translate-back').removeClass('f-hide');

		// 模版提示隐藏
		setTimeout(function(){
			//loading图片隐藏
			$('.u-pageLoading').addClass('f-hide');
			$('.m-alert').addClass('f-hide');

			// 箭头显示
			$('.u-arrow').removeClass('f-hide');
		},1000)

		// 显示正面
		$('#j-mengban').addClass('z-show');

		// 显示封面内容
		setTimeout(function(){
			$('.translate-back').removeClass('f-hide');
			$('.m-fengye').removeClass('f-hide');
			car2.height_auto(car2._page.eq(car2._pageNow),'false');
		},1000)

		// setTimeout(function(){
//              window.scrollTo(0, 1);
//          }, 0);

		// media初始化
		car2.media_init();

		// 延迟加载后面三个页面图片
		car2.lazy_start();

		// 报名提交执行
		car2.signUp_submit();
		
		
		var channel_id = location.search.substr(location.search.indexOf("channel=") + 8);
		channel_id= channel_id.match(/^\d+/) ; 
		if (!channel_id || isNaN(channel_id) || channel_id<0) {
		channel_id = 1;
		}

	 	$('.p-ct').height($(window).height());
		$('.m-page').height($(window).height());
		$('#j-mengban').height($(window).height());
		$('.translate-back').height($(window).height());

		car2.start_callback();
	},

	// 对象初始化
	init : function(){
	

		// 样式，标签的渲染
		// 对象操作事件处理
	
		// 插件加载
		car2.plugin();
		
		// 禁止滑动
		// this._scrollStop();

		// 绑定全局事件函数处理
		// $(window).on('resize',function(){
		// 	car2.refresh();
		// })
		
		$('input[type="hidden"]').appendTo($('body'));
		
		// 图片预先加载
		$('<img />').attr('src',$('#r-cover').val());
		$('<img />').attr('src',$('.m-fengye').find('.page-con').attr('data-src'));
	}
};

/*初始化对象函数*/
car2.init();


