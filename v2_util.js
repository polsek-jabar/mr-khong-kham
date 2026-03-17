//jquery overlay begin
(function($) { 
	$.tools = $.tools || {version: '@VERSION'};
	$.tools.overlay = {
		addEffect: function(name, loadFn, closeFn) {
			effects[name] = [loadFn, closeFn];	
		},
		conf: {  
			close: null,	
			closeOnClick: true,
			closeOnEsc: true,			
			closeSpeed: 'fast',
			effect: 'default',
			fixed: !$.browser.msie || $.browser.version > 6, 
			left: 'center',		
			load: false,
			mask: null,  
			oneInstance: true,
			speed: 'normal',
			target: null,
			top: '10%'
		}
	};
	var instances = [], effects = {};
	$.tools.overlay.addEffect('default', 
		function(pos, onLoad) {
			var conf = this.getConf(),
				 w = $(window);
			if (!conf.fixed)  {
				pos.top += w.scrollTop();
				pos.left += w.scrollLeft();
			}
			pos.position = conf.fixed ? 'fixed' : 'absolute';
			this.getOverlay().css(pos).fadeIn(conf.speed, onLoad);
		}, function(onClose) {
			this.getOverlay().fadeOut(this.getConf().closeSpeed, onClose); 			
		}		
	);		
	function Overlay(trigger, conf) {		
		var self = this,
			 fire = trigger.add(self),
			 w = $(window), 
			 closers,            
			 overlay,
			 opened,
			 maskConf = $.tools.expose && (conf.mask || conf.expose),
			 uid = Math.random().toString().slice(10);		
		if (maskConf) {			
			if (typeof maskConf == 'string') { maskConf = {color: maskConf}; }
			maskConf.closeOnClick = maskConf.closeOnEsc = false;
		}
		var jq = conf.target || trigger.attr("rel");
		overlay = jq ? $(jq) : null || trigger;	
		if (!overlay.length) { throw "Could not find Overlay: " + jq; }
		if (trigger && trigger.index(overlay) == -1) {
			trigger.click(function(e) {				
				self.load(e);
				return e.preventDefault();
			});
		}   			
		$.extend(self, {
			load: function(e) {
				if (self.isOpened()) { return self; }
		 		var eff = effects[conf.effect];
		 		if (!eff) { throw "Overlay: cannot find effect : \"" + conf.effect + "\""; }
				if (conf.oneInstance) {
					$.each(instances, function() {
						this.close(e);
					});
				}
				e = e || $.Event();
				e.type = "onBeforeLoad";
				fire.trigger(e);				
				if (e.isDefaultPrevented()) { return self; }
				opened = true;
				if (maskConf) { $(overlay).expose(maskConf); }
				var top = conf.top,					
					 left = conf.left,
					 oWidth = overlay.width() + parseInt(overlay.css('padding-left')) + parseInt(overlay.css('padding-right')),
					 oHeight = overlay.height() + parseInt(overlay.css('padding-top')) + parseInt(overlay.css('padding-bottom'));
				if (typeof top == 'string')  {
					top = top == 'center' ? Math.max((w.height() - oHeight) / 2, 0) : 
						parseInt(top, 10) / 100 * w.height();			
				}
				if (left == 'center') { left = Math.max((w.width() - oWidth) / 2, 0); }		 		
				eff[0].call(self, {top: top, left: left}, function() {					
					if (opened) {
						e.type = "onLoad";
						fire.trigger(e);
					}
				}); 				
				if (maskConf && conf.closeOnClick) {
					$.mask.getMask().one("click", self.close); 
				}
				if (conf.closeOnClick) {
					$(document).on("click." + uid, function(e) { 
						if (!$(e.target).parents(overlay).length) { 
							self.close(e); 
						}
					});						
				}
				if (conf.closeOnEsc) {
					$(document).on("keydown." + uid, function(e) {
						if (e.keyCode == 27) { 
							self.close(e);	 
						}
					});			
				}
				return self; 
			}, 
			
			close: function(e) {
				if (!self.isOpened()) { return self; }
				e = e || $.Event();
				e.type = "onBeforeClose";
				fire.trigger(e);				
				if (e.isDefaultPrevented()) { return; }
				opened = false;
				effects[conf.effect][1].call(self, function() {
					e.type = "onClose";
					fire.trigger(e); 
				});
				$(document).off("click." + uid + " keydown." + uid);
				if (maskConf) {
					$.mask.close();		
				}
				return self;
			}, 
			getOverlay: function() {
				return overlay;	
			},
			getTrigger: function() {
				return trigger;	
			},
			getClosers: function() {
				return closers;	
			},			
			isOpened: function()  {
				return opened;
			},
			getConf: function() {
				return conf;	
			}			
			
		});
		$.each("onBeforeLoad,onStart,onLoad,onBeforeClose,onClose".split(","), function(i, name) {
			if ($.isFunction(conf[name])) { 
				$(self).on(name, conf[name]); 
			}
			self[name] = function(fn) {
				if (fn) { $(self).on(name, fn); }
				return self;
			};
		});
		closers = overlay.find(conf.close || ".close");	
		if (!closers.length && !conf.close) {
			closers = $('<a class="close"></a>');
			overlay.prepend(closers);	
		}		
		
		closers.click(function(e) { 
			self.close(e);  
		});	
		if (conf.load) { self.load(); }
		
	}
	$.fn.overlay = function(conf) {
		var el = this.data("overlay");
		if (el) { return el; }
		if ($.isFunction(conf)) {
			conf = {onBeforeLoad: conf};	
		}
		conf = $.extend(true, {}, $.tools.overlay.conf, conf);
		this.each(function() {		
			el = new Overlay($(this), conf);
			instances.push(el);
			$(this).data("overlay", el);	
		});
		return conf.api ? el: this;		
	}; 
	
})(jQuery);
(function($) { 
	var t = $.tools.overlay,
		 w = $(window); 
	$.extend(t.conf, { 
		start: { 
			top: null,
			left: null
		},
		
		fadeInSpeed: 'fast',
		zIndex: 9999
	});
	function getPosition(el) {
		var p = el.offset();
		return {
			top: p.top + el.height() / 2, 
			left: p.left + el.width() / 2
		}; 
	}
	var loadEffect = function(pos, onLoad) {
		var overlay = this.getOverlay(),
			 conf = this.getConf(),
			 trigger = this.getTrigger(),
			 self = this,
			 oWidth = overlay.width() + parseInt(overlay.css('padding-left')) + parseInt(overlay.css('padding-right')),
			 img = overlay.data("img"),
			 position = conf.fixed ? 'fixed' : 'absolute'; 
		if (!img) { 
			var bg = overlay.css("backgroundImage");
			if (!bg) { 
				throw "background-image CSS property not set for overlay"; 
			}
			bg = bg.slice(bg.indexOf("(") + 1, bg.indexOf(")")).replace(/\"/g, "");
			overlay.css("backgroundImage", "none");
			img = $('<img src="' + bg + '"/>');
			img.css({border:0, display:'none'}).width(oWidth);			
			$('body').append(img); 
			overlay.data("img", img);
		}
		var itop = conf.start.top || Math.round(w.height() / 2), 
			 ileft = conf.start.left || Math.round(w.width() / 2);
		if (trigger) {
			var p = getPosition(trigger);
			itop = p.top;
			ileft = p.left;
		}
		if (conf.fixed) {
			itop -= w.scrollTop();
			ileft -= w.scrollLeft();
		} else {
			pos.top += w.scrollTop();
			pos.left += w.scrollLeft();				
		}
		img.css({
			position: 'absolute',
			top: itop, 
			left: ileft,
			width: 0,
			zIndex: conf.zIndex
		}).show();
		
		pos.position = position;
		overlay.css(pos);
		img.animate({			
			top: pos.top,
			left: pos.left,
			width: oWidth}, conf.speed, function() {
			overlay.css("zIndex", conf.zIndex + 1).fadeIn(conf.fadeInSpeed, function()  {
				if (self.isOpened() && !$(this).index(overlay)) {	
					onLoad.call(); 
				} else {
					overlay.hide();	
				} 
			});
		}).css("position", position);
		
	};
	var closeEffect = function(onClose) {
		var overlay = this.getOverlay().hide(), 
			 conf = this.getConf(),
			 trigger = this.getTrigger(),
			 img = overlay.data("img"),
			 
			 css = { 
			 	top: conf.start.top, 
			 	left: conf.start.left, 
			 	width: 0 
			 };
		if (trigger) { $.extend(css, getPosition(trigger)); }
		if (conf.fixed) {
			img.css({position: 'absolute'})
				.animate({ top: "+=" + w.scrollTop(), left: "+=" + w.scrollLeft()}, 0);
		}
		img.animate(css, conf.closeSpeed, onClose);	
	};
	t.addEffect("apple", loadEffect, closeEffect); 
})(jQuery);	
//jquery overlay end

function el(id) {
	return document.getElementById(id);
}

function trim(s) {
	return s.replace(/(^\s*)|(\s*$)/g, '') ;
}
    
function isEmpty(s) {
	return s == null || trim(s).length == 0;
}

function isEmail(s) {
	return /^((([a-z]|\d|[!#\