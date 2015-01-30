//音符的漂浮的插件制作--依赖zepto.js widget.js
$.widget( 'Coffee', {
  options:{
    steams            : [], /*漂浮物的类型，种类*/
    steamsFontFamily  : ['Verdana','Geneva','Comic Sans MS','MS Serif','Lucida Sans Unicode','Times New Roman','Trebuchet MS','Arial','Courier New','Georgia'],  /*漂浮物的字体类型*/
    steamFlyTime      : 5000 , /*Steam飞行的时间,单位 ms 。（决定steam飞行速度的快慢）*/
    steamInterval     : 500 ,  /*制造Steam时间间隔,单位 ms.*/
    steamMaxSize      : 30 ,   /*随即获取漂浮物的字体大小*/
    steamHeight       : 200,   /*飞行体的高度*/
    steamWidth        : 300,    /*飞行体的宽度*/
    show:false
  },
  _create:function(){
    // 动画定时器
    var opts = this._options, 
        $el = this.getEl(),
        self = this;
    this.__time_val=null;
    this.__time_wind=null;
    this.__flyFastSlow = 'cubic-bezier(.09,.64,.16,.94)';
    this.options_audio = {
            loop: true,
            preload: "auto",
            src: $('.u-audio').attr('data-src')
      }
    
    this._audio = new Audio(); 

    for(var key in self.options_audio){
      
        if(self.options_audio.hasOwnProperty(key) && (key in self._audio)){
            self._audio[key] = self.options_audio[key];
        }
    }

    // 初始化函数体，生成对应的DOM节点
    // 漂浮的DOM
    this.coffeeSteamBoxWidth = opts.steamWidth;
    this.$coffeeSteamBox = $('<div class="coffee-steam-box"></div>')
      .css({
        'height'   : opts.steamHeight,
        'width'    : opts.steamWidth,
        'left'     : 60,
        'top'      : -50,
        'position' : 'absolute',
        'overflow' : 'hidden',
        'z-index'  : 0 
      })
      .appendTo($el); 
      
      _isplay = $.proxy( this._isplay , this )
      
      $el.on( 'click' + this.eventNs, _isplay );         
      
  },
  _isplay:function(){
     var opts = this._options,self = this;
     opts.show ? (opts.show = false,self.stop(),self._audio.pause()) : 
     (opts.show = true,self.start(),self._audio.play()) 

  },
  stop:function(){
    clearInterval(this.__time_val);
    clearInterval(this.__time_wind);
  },
  start:function(){
    var self = this,
        opts = this._options;
    self.__time_val = setInterval(function(){
        self._steam();
      }, self.rand( opts.steamInterval / 2 , opts.steamInterval * 2 ));

      self.__time_wind = setInterval(function(){
        self._wind();
      },self.rand( 100 , 1000 )+ self.rand( 1000 , 3000))
  },
  _steam:function(){
      var opts = this._options,
      // 设置飞行体的样式
          fontSize = this.rand( 8 , opts.steamMaxSize  ),     // 字体大小
          steamsFontFamily = this.randoms( 1, opts.steamsFontFamily ), // 字体类型
          color = '#'+ this.randoms(6 , '0123456789ABCDEF' ),  // 字体颜色
          position = this.rand( 0, 44 ),                      // 起初位置
          rotate = this.rand(-90,89),                          // 旋转角度
          scale = this.rand02(0.4,1),                          // 大小缩放
          transform =  $.fx.cssPrefix+'transform',        // 设置音符的旋转角度和大小
          transform = transform+':rotate('+rotate+'deg) scale('+scale+');',

      // 生成fly飞行体
     
          $fly = $('<span class="coffee-steam">'+ this.randoms( 1, opts.steams ) +'</span>'),
          left = this.rand( 0 , this.coffeeSteamBoxWidth - opts.steamWidth - fontSize );
      if( left > position ) left = this.rand( 0 , position );
     
      $fly
        .css({
          'position'     : 'absolute',
          'left'         : position,
          'top'          : opts.steamHeight,
          'font-size:'   : fontSize+'px',
          'color'        : color,
          'font-family'  : steamsFontFamily,
          'display'      : 'block',
          'opacity'      : 1
        })
        .attr('style',$fly.attr('style')+transform)
        .appendTo(this.$coffeeSteamBox)
        .animate({
          top   : this.rand(opts.steamHeight/2,0),
          left  : left,
          opacity : 0
        },this.rand( opts.steamFlyTime / 2 , opts.steamFlyTime * 1.2 ),this.__flyFastSlow,function(){
          $fly.remove();
          $fly = null;      
       });
  },
  _wind:function(){
      // 左右浮动的范围值
      var left = this.rand( -10 , 10 );
      left += parseInt(this.$coffeeSteamBox.css('left'));
      if(left>=54) left=54;
      else if(left<=34) left=34;

      // 移动的函数
      this.$coffeeSteamBox.animate({
        left  : left 
      } , this.rand( 1000 , 3000) ,this.__flyFastSlow);
  },
  randoms:function ( length , chars ) {
      var self = this,
          length = length || 1 ,
          hash = '',                  // 
          maxNum = chars.length - 1,  // last-one
          num = 0;                   // fisrt-one
      for( i = 0; i < length; i++ ) {
        num = self.rand( 0 , maxNum - 1  );
        hash += chars.slice( num , num + 1 );
      }

      return hash;
     
  },
  rand:function(mi,ma){   
      var range = ma - mi,
          out = mi + Math.round( Math.random() * range) ; 
      return parseInt(out);

  },
  rand02:function(mi,ma){   
      var range = ma - mi,
          out = mi + Math.random() * range; 
      return parseFloat(out);
  }  
})