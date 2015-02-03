	var Tab = function(opt){
		var setting = {
			tabCont: '',
			tabClass: '', //选项卡的class
			tabActiveClass: 'active',
			cardCont: '',
			cardClass: 'li', //卡片的class
			cardActiveClass: 'active',
			switchEvent: 'click', //或者 mouseover
			onSwitch: function(index, $tab, $card){}
		};
		for(var k in opt){
			opt.hasOwnProperty(k) && (setting[k] = opt[k]);
		}

		this.$tabCont = typeof setting.tabCont==='string' ? $(setting.tabCont) : setting.tabCont;
		if(!this.$tabCont.length){return}

		this.$cardCont = setting.cardCont ? $(setting.cardCont) : false;
		this.setting = setting;
		this.onSwitch = setting.onSwitch;

		var _this = this;
		this.tabCount = this.$tabCont.on(setting.switchEvent, function(e){
			var $tab = $(e.target);
			if(!$tab.hasClass(setting.tabClass)){
				$tab = $tab.parents('.'+setting.tabClass);
			}
			if($tab.length){
				var index = $tab.attr('data-index');
				if(index!==_this.index){
					_this.switchTo(index, $tab);
				}
			}
		}).find('.'+setting.tabClass).each(function(i){
			this.setAttribute('data-index', i);
		}).length;
		opt = null;
	};
	Tab.prototype = {
		index: 0, //当前选中的选项卡
		tabCount: 0, //选项卡总数
		/*--
			切换到指定Tab项
			-p number index 要切换到的Tab项的下标
			-p jQuery [$tab] 要切换到的Tab项
		*/
		switchTo: function(index, $tab){
			index = parseInt(index);
			if(index<0){
				index += this.tabCount;
				index<0 && (index = 0); //还小于0就设置为0了
			}

			var setting = this.setting;
			var activeClass = setting.tabActiveClass, $card;
			this.$tabCont.find('.'+activeClass).removeClass(activeClass);
			$tab || ($tab = this.$tabCont.find('.'+setting.tabClass).eq(index));
			$tab.addClass(activeClass);
			if(this.$cardCont){
				var activeClass = this.setting.cardActiveClass;
				this.$cardCont.find('.'+activeClass).removeClass(activeClass);
				$card = this.$cardCont.find('.'+setting.cardClass).eq(index);
				$card.addClass(activeClass);
			}
			this.onSwitch(index, $tab, $card);
			this.index = index;
		}
	};