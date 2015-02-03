(function(){
	
	var docuH = document.documentElement.clientHeight,
		allMoveBox = document.getElementsByClassName('swiper-slide'),
		icount = 0,
		timer = null,
		timer2 = null;
	document.getElementsByClassName('swiper-container').item(0).style.height = docuH + 'px';
	
	var addClass = function (ele,strClass){
		var reg = new RegExp("(?:^| )" + strClass + "(?: |$)");
		if(reg.test(ele.className)){
			//如果此类样式已经存在，则什么也不需要做
		}else{//不存在
			ele.className = ele.className.trim() + " " + strClass;
		}
	};
	
	var removeClass=function (ele,strClass){
		if(!(ele&&ele.nodeType == 1)){	
			alert('第一参数ele需要是一个DOM元素对象');
			throw new Error('第一参数ele需要是一个DOM元素对象');
		}
		if(typeof strClass != 'string'){
			alert('第二参数必须为string类型');
			throw new Error('第二参数必须为string类型');
			
		}
		
		var reg=new RegExp("(?:^| )" + strClass + "(?: |$)","g");
		ele.className = ele.className.replace(reg,'').trim();	
	};
	
	var getIndex=function (ele){
		var nIndex=0;

		var p=ele.previousSibling

		while(p){

			if(p.nodeType==1){
				nIndex++;//让累加一次
			}			
			p=p.previousSibling;//继续判断它的下一个哥哥		
		}
		return nIndex;	

	};
	
	var mySwiper = new Swiper('.swiper-container',{
		paginationClickable: true,
		mode: 'vertical',
		onSlideChangeStart: function(){//当滑块将要滑到下一块时
			var thisDiv = mySwiper.activeSlide(),
				thisIndex = getIndex(thisDiv);

		},
		onSlideChangeEnd: function(){//当滑块滑到下一块时
			var thisDiv = mySwiper.activeSlide(),
				thisIndex = getIndex(thisDiv);
			for(var i = 0; i < allMoveBox.length; i++){
				removeClass(allMoveBox[i],'slide-move');	
			}
			addClass(thisDiv,'slide-move');
			
		}
	});

})()