+function($){'use strict';function transitionEnd(){var el=document.createElement('bootstrap')
var transEndEventNames={WebkitTransition:'webkitTransitionEnd',MozTransition:'transitionend',OTransition:'oTransitionEnd otransitionend',transition:'transitionend'}
for(var name in transEndEventNames){if(el.style[name]!==undefined){return{end:transEndEventNames[name]}}}
return!1}
$.fn.emulateTransitionEnd=function(duration){var called=!1
var $el=this
$(this).one('bsTransitionEnd',function(){called=!0})
var callback=function(){if(!called)$($el).trigger($.support.transition.end)}
setTimeout(callback,duration)
return this}
$(function(){$.support.transition=transitionEnd()
if(!$.support.transition)return
$.event.special.bsTransitionEnd={bindType:$.support.transition.end,delegateType:$.support.transition.end,handle:function(e){if($(e.target).is(this))return e.handleObj.handler.apply(this,arguments)}}})}(jQuery);+function($){'use strict';var Collapse=function(element,options){this.$element=$(element)
this.options=$.extend({},Collapse.DEFAULTS,options)
this.$trigger=$('[data-toggle="collapse"][href="#'+element.id+'"],'+'[data-toggle="collapse"][data-target="#'+element.id+'"]')
this.transitioning=null
if(this.options.parent){this.$parent=this.getParent()}else{this.addAriaAndCollapsedClass(this.$element,this.$trigger)}
if(this.options.toggle)this.toggle()}
Collapse.VERSION='3.3.7'
Collapse.TRANSITION_DURATION=350
Collapse.DEFAULTS={toggle:!0}
Collapse.prototype.dimension=function(){var hasWidth=this.$element.hasClass('width')
return hasWidth?'width':'height'}
Collapse.prototype.show=function(){if(this.transitioning||this.$element.hasClass('in'))return
var activesData
var actives=this.$parent&&this.$parent.children('.panel').children('.in, .collapsing')
if(actives&&actives.length){activesData=actives.data('bs.collapse')
if(activesData&&activesData.transitioning)return}
var startEvent=$.Event('show.bs.collapse')
this.$element.trigger(startEvent)
if(startEvent.isDefaultPrevented())return
if(actives&&actives.length){Plugin.call(actives,'hide')
activesData||actives.data('bs.collapse',null)}
var dimension=this.dimension()
this.$element.removeClass('collapse').addClass('collapsing')[dimension](0).attr('aria-expanded',!0)
this.$trigger.removeClass('collapsed').attr('aria-expanded',!0)
this.transitioning=1
var complete=function(){this.$element.removeClass('collapsing').addClass('collapse in')[dimension]('')
this.transitioning=0
this.$element.trigger('shown.bs.collapse')}
if(!$.support.transition)return complete.call(this)
var scrollSize=$.camelCase(['scroll',dimension].join('-'))
this.$element.one('bsTransitionEnd',$.proxy(complete,this)).emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])}
Collapse.prototype.hide=function(){if(this.transitioning||!this.$element.hasClass('in'))return
var startEvent=$.Event('hide.bs.collapse')
this.$element.trigger(startEvent)
if(startEvent.isDefaultPrevented())return
var dimension=this.dimension()
this.$element[dimension](this.$element[dimension]())[0].offsetHeight
this.$element.addClass('collapsing').removeClass('collapse in').attr('aria-expanded',!1)
this.$trigger.addClass('collapsed').attr('aria-expanded',!1)
this.transitioning=1
var complete=function(){this.transitioning=0
this.$element.removeClass('collapsing').addClass('collapse').trigger('hidden.bs.collapse')}
if(!$.support.transition)return complete.call(this)
this.$element[dimension](0).one('bsTransitionEnd',$.proxy(complete,this)).emulateTransitionEnd(Collapse.TRANSITION_DURATION)}
Collapse.prototype.toggle=function(){this[this.$element.hasClass('in')?'hide':'show']()}
Collapse.prototype.getParent=function(){return $(this.options.parent).find('[data-toggle="collapse"][data-parent="'+this.options.parent+'"]').each($.proxy(function(i,element){var $element=$(element)
this.addAriaAndCollapsedClass(getTargetFromTrigger($element),$element)},this)).end()}
Collapse.prototype.addAriaAndCollapsedClass=function($element,$trigger){var isOpen=$element.hasClass('in')
$element.attr('aria-expanded',isOpen)
$trigger.toggleClass('collapsed',!isOpen).attr('aria-expanded',isOpen)}
function getTargetFromTrigger($trigger){var href
var target=$trigger.attr('data-target')||(href=$trigger.attr('href'))&&href.replace(/.*(?=#[^\s]+$)/,'')
return $(target)}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.collapse')
var options=$.extend({},Collapse.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data&&options.toggle&&/show|hide/.test(option))options.toggle=!1
if(!data)$this.data('bs.collapse',(data=new Collapse(this,options)))
if(typeof option=='string')data[option]()})}
var old=$.fn.collapse
$.fn.collapse=Plugin
$.fn.collapse.Constructor=Collapse
$.fn.collapse.noConflict=function(){$.fn.collapse=old
return this}
$(document).on('click.bs.collapse.data-api','[data-toggle="collapse"]',function(e){var $this=$(this)
if(!$this.attr('data-target'))e.preventDefault()
var $target=getTargetFromTrigger($this)
var data=$target.data('bs.collapse')
var option=data?'toggle':$this.data()
Plugin.call($target,option)})}(jQuery);+function($){'use strict';var Tooltip=function(element,options){this.type=null
this.options=null
this.enabled=null
this.timeout=null
this.hoverState=null
this.$element=null
this.inState=null
this.init('tooltip',element,options)}
Tooltip.VERSION='3.3.7'
Tooltip.TRANSITION_DURATION=150
Tooltip.DEFAULTS={animation:!0,placement:'top',selector:!1,template:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:'hover focus',title:'',delay:0,html:!1,container:!1,viewport:{selector:'body',padding:0}}
Tooltip.prototype.init=function(type,element,options){this.enabled=!0
this.type=type
this.$element=$(element)
this.options=this.getOptions(options)
this.$viewport=this.options.viewport&&$($.isFunction(this.options.viewport)?this.options.viewport.call(this,this.$element):(this.options.viewport.selector||this.options.viewport))
this.inState={click:!1,hover:!1,focus:!1}
if(this.$element[0]instanceof document.constructor&&!this.options.selector){throw new Error('`selector` option must be specified when initializing '+this.type+' on the window.document object!')}
var triggers=this.options.trigger.split(' ')
for(var i=triggers.length;i--;){var trigger=triggers[i]
if(trigger=='click'){this.$element.on('click.'+this.type,this.options.selector,$.proxy(this.toggle,this))}else if(trigger!='manual'){var eventIn=trigger=='hover'?'mouseenter':'focusin'
var eventOut=trigger=='hover'?'mouseleave':'focusout'
this.$element.on(eventIn+'.'+this.type,this.options.selector,$.proxy(this.enter,this))
this.$element.on(eventOut+'.'+this.type,this.options.selector,$.proxy(this.leave,this))}}
this.options.selector?(this._options=$.extend({},this.options,{trigger:'manual',selector:''})):this.fixTitle()}
Tooltip.prototype.getDefaults=function(){return Tooltip.DEFAULTS}
Tooltip.prototype.getOptions=function(options){options=$.extend({},this.getDefaults(),this.$element.data(),options)
if(options.delay&&typeof options.delay=='number'){options.delay={show:options.delay,hide:options.delay}}
return options}
Tooltip.prototype.getDelegateOptions=function(){var options={}
var defaults=this.getDefaults()
this._options&&$.each(this._options,function(key,value){if(defaults[key]!=value)options[key]=value})
return options}
Tooltip.prototype.enter=function(obj){var self=obj instanceof this.constructor?obj:$(obj.currentTarget).data('bs.'+this.type)
if(!self){self=new this.constructor(obj.currentTarget,this.getDelegateOptions())
$(obj.currentTarget).data('bs.'+this.type,self)}
if(obj instanceof $.Event){self.inState[obj.type=='focusin'?'focus':'hover']=!0}
if(self.tip().hasClass('in')||self.hoverState=='in'){self.hoverState='in'
return}
clearTimeout(self.timeout)
self.hoverState='in'
if(!self.options.delay||!self.options.delay.show)return self.show()
self.timeout=setTimeout(function(){if(self.hoverState=='in')self.show()},self.options.delay.show)}
Tooltip.prototype.isInStateTrue=function(){for(var key in this.inState){if(this.inState[key])return!0}
return!1}
Tooltip.prototype.leave=function(obj){var self=obj instanceof this.constructor?obj:$(obj.currentTarget).data('bs.'+this.type)
if(!self){self=new this.constructor(obj.currentTarget,this.getDelegateOptions())
$(obj.currentTarget).data('bs.'+this.type,self)}
if(obj instanceof $.Event){self.inState[obj.type=='focusout'?'focus':'hover']=!1}
if(self.isInStateTrue())return
clearTimeout(self.timeout)
self.hoverState='out'
if(!self.options.delay||!self.options.delay.hide)return self.hide()
self.timeout=setTimeout(function(){if(self.hoverState=='out')self.hide()},self.options.delay.hide)}
Tooltip.prototype.show=function(){var e=$.Event('show.bs.'+this.type)
if(this.hasContent()&&this.enabled){this.$element.trigger(e)
var inDom=$.contains(this.$element[0].ownerDocument.documentElement,this.$element[0])
if(e.isDefaultPrevented()||!inDom)return
var that=this
var $tip=this.tip()
var tipId=this.getUID(this.type)
this.setContent()
$tip.attr('id',tipId)
this.$element.attr('aria-describedby',tipId)
if(this.options.animation)$tip.addClass('fade')
var placement=typeof this.options.placement=='function'?this.options.placement.call(this,$tip[0],this.$element[0]):this.options.placement
var autoToken=/\s?auto?\s?/i
var autoPlace=autoToken.test(placement)
if(autoPlace)placement=placement.replace(autoToken,'')||'top'
$tip.detach().css({top:0,left:0,display:'block'}).addClass(placement).data('bs.'+this.type,this)
this.options.container?$tip.appendTo(this.options.container):$tip.insertAfter(this.$element)
this.$element.trigger('inserted.bs.'+this.type)
var pos=this.getPosition()
var actualWidth=$tip[0].offsetWidth
var actualHeight=$tip[0].offsetHeight
if(autoPlace){var orgPlacement=placement
var viewportDim=this.getPosition(this.$viewport)
placement=placement=='bottom'&&pos.bottom+actualHeight>viewportDim.bottom?'top':placement=='top'&&pos.top-actualHeight<viewportDim.top?'bottom':placement=='right'&&pos.right+actualWidth>viewportDim.width?'left':placement=='left'&&pos.left-actualWidth<viewportDim.left?'right':placement
$tip.removeClass(orgPlacement).addClass(placement)}
var calculatedOffset=this.getCalculatedOffset(placement,pos,actualWidth,actualHeight)
this.applyPlacement(calculatedOffset,placement)
var complete=function(){var prevHoverState=that.hoverState
that.$element.trigger('shown.bs.'+that.type)
that.hoverState=null
if(prevHoverState=='out')that.leave(that)}
$.support.transition&&this.$tip.hasClass('fade')?$tip.one('bsTransitionEnd',complete).emulateTransitionEnd(Tooltip.TRANSITION_DURATION):complete()}}
Tooltip.prototype.applyPlacement=function(offset,placement){var $tip=this.tip()
var width=$tip[0].offsetWidth
var height=$tip[0].offsetHeight
var marginTop=parseInt($tip.css('margin-top'),10)
var marginLeft=parseInt($tip.css('margin-left'),10)
if(isNaN(marginTop))marginTop=0
if(isNaN(marginLeft))marginLeft=0
offset.top+=marginTop
offset.left+=marginLeft
$.offset.setOffset($tip[0],$.extend({using:function(props){$tip.css({top:Math.round(props.top),left:Math.round(props.left)})}},offset),0)
$tip.addClass('in')
var actualWidth=$tip[0].offsetWidth
var actualHeight=$tip[0].offsetHeight
if(placement=='top'&&actualHeight!=height){offset.top=offset.top+height-actualHeight}
var delta=this.getViewportAdjustedDelta(placement,offset,actualWidth,actualHeight)
if(delta.left)offset.left+=delta.left
else offset.top+=delta.top
var isVertical=/top|bottom/.test(placement)
var arrowDelta=isVertical?delta.left*2-width+actualWidth:delta.top*2-height+actualHeight
var arrowOffsetPosition=isVertical?'offsetWidth':'offsetHeight'
$tip.offset(offset)
this.replaceArrow(arrowDelta,$tip[0][arrowOffsetPosition],isVertical)}
Tooltip.prototype.replaceArrow=function(delta,dimension,isVertical){this.arrow().css(isVertical?'left':'top',50*(1-delta/dimension)+'%').css(isVertical?'top':'left','')}
Tooltip.prototype.setContent=function(){var $tip=this.tip()
var title=this.getTitle()
$tip.find('.tooltip-inner')[this.options.html?'html':'text'](title)
$tip.removeClass('fade in top bottom left right')}
Tooltip.prototype.hide=function(callback){var that=this
var $tip=$(this.$tip)
var e=$.Event('hide.bs.'+this.type)
function complete(){if(that.hoverState!='in')$tip.detach()
if(that.$element){that.$element.removeAttr('aria-describedby').trigger('hidden.bs.'+that.type)}
callback&&callback()}
this.$element.trigger(e)
if(e.isDefaultPrevented())return
$tip.removeClass('in')
$.support.transition&&$tip.hasClass('fade')?$tip.one('bsTransitionEnd',complete).emulateTransitionEnd(Tooltip.TRANSITION_DURATION):complete()
this.hoverState=null
return this}
Tooltip.prototype.fixTitle=function(){var $e=this.$element
if($e.attr('title')||typeof $e.attr('data-original-title')!='string'){$e.attr('data-original-title',$e.attr('title')||'').attr('title','')}}
Tooltip.prototype.hasContent=function(){return this.getTitle()}
Tooltip.prototype.getPosition=function($element){$element=$element||this.$element
var el=$element[0]
var isBody=el.tagName=='BODY'
var elRect=el.getBoundingClientRect()
if(elRect.width==null){elRect=$.extend({},elRect,{width:elRect.right-elRect.left,height:elRect.bottom-elRect.top})}
var isSvg=window.SVGElement&&el instanceof window.SVGElement
var elOffset=isBody?{top:0,left:0}:(isSvg?null:$element.offset())
var scroll={scroll:isBody?document.documentElement.scrollTop||document.body.scrollTop:$element.scrollTop()}
var outerDims=isBody?{width:$(window).width(),height:$(window).height()}:null
return $.extend({},elRect,scroll,outerDims,elOffset)}
Tooltip.prototype.getCalculatedOffset=function(placement,pos,actualWidth,actualHeight){return placement=='bottom'?{top:pos.top+pos.height,left:pos.left+pos.width/2-actualWidth/2}:placement=='top'?{top:pos.top-actualHeight,left:pos.left+pos.width/2-actualWidth/2}:placement=='left'?{top:pos.top+pos.height/2-actualHeight/2,left:pos.left-actualWidth}:{top:pos.top+pos.height/2-actualHeight/2,left:pos.left+pos.width}}
Tooltip.prototype.getViewportAdjustedDelta=function(placement,pos,actualWidth,actualHeight){var delta={top:0,left:0}
if(!this.$viewport)return delta
var viewportPadding=this.options.viewport&&this.options.viewport.padding||0
var viewportDimensions=this.getPosition(this.$viewport)
if(/right|left/.test(placement)){var topEdgeOffset=pos.top-viewportPadding-viewportDimensions.scroll
var bottomEdgeOffset=pos.top+viewportPadding-viewportDimensions.scroll+actualHeight
if(topEdgeOffset<viewportDimensions.top){delta.top=viewportDimensions.top-topEdgeOffset}else if(bottomEdgeOffset>viewportDimensions.top+viewportDimensions.height){delta.top=viewportDimensions.top+viewportDimensions.height-bottomEdgeOffset}}else{var leftEdgeOffset=pos.left-viewportPadding
var rightEdgeOffset=pos.left+viewportPadding+actualWidth
if(leftEdgeOffset<viewportDimensions.left){delta.left=viewportDimensions.left-leftEdgeOffset}else if(rightEdgeOffset>viewportDimensions.right){delta.left=viewportDimensions.left+viewportDimensions.width-rightEdgeOffset}}
return delta}
Tooltip.prototype.getTitle=function(){var title
var $e=this.$element
var o=this.options
title=$e.attr('data-original-title')||(typeof o.title=='function'?o.title.call($e[0]):o.title)
return title}
Tooltip.prototype.getUID=function(prefix){do prefix+=~~(Math.random()*1000000)
while(document.getElementById(prefix))
return prefix}
Tooltip.prototype.tip=function(){if(!this.$tip){this.$tip=$(this.options.template)
if(this.$tip.length!=1){throw new Error(this.type+' `template` option must consist of exactly 1 top-level element!')}}
return this.$tip}
Tooltip.prototype.arrow=function(){return(this.$arrow=this.$arrow||this.tip().find('.tooltip-arrow'))}
Tooltip.prototype.enable=function(){this.enabled=!0}
Tooltip.prototype.disable=function(){this.enabled=!1}
Tooltip.prototype.toggleEnabled=function(){this.enabled=!this.enabled}
Tooltip.prototype.toggle=function(e){var self=this
if(e){self=$(e.currentTarget).data('bs.'+this.type)
if(!self){self=new this.constructor(e.currentTarget,this.getDelegateOptions())
$(e.currentTarget).data('bs.'+this.type,self)}}
if(e){self.inState.click=!self.inState.click
if(self.isInStateTrue())self.enter(self)
else self.leave(self)}else{self.tip().hasClass('in')?self.leave(self):self.enter(self)}}
Tooltip.prototype.destroy=function(){var that=this
clearTimeout(this.timeout)
this.hide(function(){that.$element.off('.'+that.type).removeData('bs.'+that.type)
if(that.$tip){that.$tip.detach()}
that.$tip=null
that.$arrow=null
that.$viewport=null
that.$element=null})}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.tooltip')
var options=typeof option=='object'&&option
if(!data&&/destroy|hide/.test(option))return
if(!data)$this.data('bs.tooltip',(data=new Tooltip(this,options)))
if(typeof option=='string')data[option]()})}
var old=$.fn.tooltip
$.fn.tooltip=Plugin
$.fn.tooltip.Constructor=Tooltip
$.fn.tooltip.noConflict=function(){$.fn.tooltip=old
return this}}(jQuery);(function(factory){if(typeof define==='function'&&define.amd){return define(['jquery'],function($){return factory($,window,document)})}else if(typeof exports==='object'){return module.exports=factory(require('jquery'),window,document)}else{return factory(jQuery,window,document)}})(function($,window,document){"use strict";var BROWSER_IS_IE7,BROWSER_SCROLLBAR_WIDTH,DOMSCROLL,DOWN,DRAG,ENTER,KEYDOWN,KEYUP,MOUSEDOWN,MOUSEENTER,MOUSEMOVE,MOUSEUP,MOUSEWHEEL,NanoScroll,PANEDOWN,RESIZE,SCROLL,SCROLLBAR,TOUCHMOVE,UP,WHEEL,cAF,defaults,getBrowserScrollbarWidth,hasTransform,isFFWithBuggyScrollbar,rAF,transform,_elementStyle,_prefixStyle,_vendor;defaults={paneClass:'nano-pane',sliderClass:'nano-slider',contentClass:'nano-content',iOSNativeScrolling:!1,preventPageScrolling:!1,disableResize:!1,alwaysVisible:!1,flashDelay:1500,sliderMinHeight:20,sliderMaxHeight:null,documentContext:null,windowContext:null};SCROLLBAR='scrollbar';SCROLL='scroll';MOUSEDOWN='mousedown';MOUSEENTER='mouseenter';MOUSEMOVE='mousemove';MOUSEWHEEL='mousewheel';MOUSEUP='mouseup';RESIZE='resize';DRAG='drag';ENTER='enter';UP='up';PANEDOWN='panedown';DOMSCROLL='DOMMouseScroll';DOWN='down';WHEEL='wheel';KEYDOWN='keydown';KEYUP='keyup';TOUCHMOVE='touchmove';BROWSER_IS_IE7=window.navigator.appName==='Microsoft Internet Explorer'&&/msie 7./i.test(window.navigator.appVersion)&&window.ActiveXObject;BROWSER_SCROLLBAR_WIDTH=null;rAF=window.requestAnimationFrame;cAF=window.cancelAnimationFrame;_elementStyle=document.createElement('div').style;_vendor=(function(){var i,transform,vendor,vendors,_i,_len;vendors=['t','webkitT','MozT','msT','OT'];for(i=_i=0,_len=vendors.length;_i<_len;i=++_i){vendor=vendors[i];transform=vendors[i]+'ransform';if(transform in _elementStyle){return vendors[i].substr(0,vendors[i].length-1)}}
return!1})();_prefixStyle=function(style){if(_vendor===!1){return!1}
if(_vendor===''){return style}
return _vendor+style.charAt(0).toUpperCase()+style.substr(1)};transform=_prefixStyle('transform');hasTransform=transform!==!1;getBrowserScrollbarWidth=function(){var outer,outerStyle,scrollbarWidth;outer=document.createElement('div');outerStyle=outer.style;outerStyle.position='absolute';outerStyle.width='100px';outerStyle.height='100px';outerStyle.overflow=SCROLL;outerStyle.top='-9999px';document.body.appendChild(outer);scrollbarWidth=outer.offsetWidth-outer.clientWidth;document.body.removeChild(outer);return scrollbarWidth};isFFWithBuggyScrollbar=function(){var isOSXFF,ua,version;ua=window.navigator.userAgent;isOSXFF=/(?=.+Mac OS X)(?=.+Firefox)/.test(ua);if(!isOSXFF){return!1}
version=/Firefox\/\d{2}\./.exec(ua);if(version){version=version[0].replace(/\D+/g,'')}
return isOSXFF&&+version>23};NanoScroll=(function(){function NanoScroll(el,options){this.el=el;this.options=options;BROWSER_SCROLLBAR_WIDTH||(BROWSER_SCROLLBAR_WIDTH=getBrowserScrollbarWidth());this.$el=$(this.el);this.doc=$(this.options.documentContext||document);this.win=$(this.options.windowContext||window);this.body=this.doc.find('body');this.$content=this.$el.children("."+this.options.contentClass);this.$content.attr('tabindex',this.options.tabIndex||0);this.content=this.$content[0];this.previousPosition=0;if(this.options.iOSNativeScrolling&&(this.el.style.WebkitOverflowScrolling!=null)){this.nativeScrolling()}else{this.generate()}
this.createEvents();this.addEvents();this.reset()}
NanoScroll.prototype.preventScrolling=function(e,direction){if(!this.isActive){return}
if(e.type===DOMSCROLL){if(direction===DOWN&&e.originalEvent.detail>0||direction===UP&&e.originalEvent.detail<0){e.preventDefault()}}else if(e.type===MOUSEWHEEL){if(!e.originalEvent||!e.originalEvent.wheelDelta){return}
if(direction===DOWN&&e.originalEvent.wheelDelta<0||direction===UP&&e.originalEvent.wheelDelta>0){e.preventDefault()}}};NanoScroll.prototype.nativeScrolling=function(){this.$content.css({WebkitOverflowScrolling:'touch'});this.iOSNativeScrolling=!0;this.isActive=!0};NanoScroll.prototype.updateScrollValues=function(){var content,direction;content=this.content;this.maxScrollTop=content.scrollHeight-content.clientHeight;this.prevScrollTop=this.contentScrollTop||0;this.contentScrollTop=content.scrollTop;direction=this.contentScrollTop>this.previousPosition?"down":this.contentScrollTop<this.previousPosition?"up":"same";this.previousPosition=this.contentScrollTop;if(direction!=="same"){this.$el.trigger('update',{position:this.contentScrollTop,maximum:this.maxScrollTop,direction:direction})}
if(!this.iOSNativeScrolling){this.maxSliderTop=this.paneHeight-this.sliderHeight;this.sliderTop=this.maxScrollTop===0?0:this.contentScrollTop*this.maxSliderTop/this.maxScrollTop}};NanoScroll.prototype.setOnScrollStyles=function(){var cssValue;if(hasTransform){cssValue={};cssValue[transform]="translate(0, "+this.sliderTop+"px)"}else{cssValue={top:this.sliderTop}}
if(rAF){if(cAF&&this.scrollRAF){cAF(this.scrollRAF)}
this.scrollRAF=rAF((function(_this){return function(){_this.scrollRAF=null;return _this.slider.css(cssValue)}})(this))}else{this.slider.css(cssValue)}};NanoScroll.prototype.createEvents=function(){this.events={down:(function(_this){return function(e){_this.isBeingDragged=!0;_this.offsetY=e.pageY-_this.slider.offset().top;if(!_this.slider.is(e.target)){_this.offsetY=0}
_this.pane.addClass('active');_this.doc.bind(MOUSEMOVE,_this.events[DRAG]).bind(MOUSEUP,_this.events[UP]);_this.body.bind(MOUSEENTER,_this.events[ENTER]);return!1}})(this),drag:(function(_this){return function(e){_this.sliderY=e.pageY-_this.$el.offset().top-_this.paneTop-(_this.offsetY||_this.sliderHeight*0.5);_this.scroll();if(_this.contentScrollTop>=_this.maxScrollTop&&_this.prevScrollTop!==_this.maxScrollTop){_this.$el.trigger('scrollend')}else if(_this.contentScrollTop===0&&_this.prevScrollTop!==0){_this.$el.trigger('scrolltop')}
return!1}})(this),up:(function(_this){return function(e){_this.isBeingDragged=!1;_this.pane.removeClass('active');_this.doc.unbind(MOUSEMOVE,_this.events[DRAG]).unbind(MOUSEUP,_this.events[UP]);_this.body.unbind(MOUSEENTER,_this.events[ENTER]);return!1}})(this),resize:(function(_this){return function(e){_this.reset()}})(this),panedown:(function(_this){return function(e){_this.sliderY=(e.offsetY||e.originalEvent.layerY)-(_this.sliderHeight*0.5);_this.scroll();_this.events.down(e);return!1}})(this),scroll:(function(_this){return function(e){_this.updateScrollValues();if(_this.isBeingDragged){return}
if(!_this.iOSNativeScrolling){_this.sliderY=_this.sliderTop;_this.setOnScrollStyles()}
if(e==null){return}
if(_this.contentScrollTop>=_this.maxScrollTop){if(_this.options.preventPageScrolling){_this.preventScrolling(e,DOWN)}
if(_this.prevScrollTop!==_this.maxScrollTop){_this.$el.trigger('scrollend')}}else if(_this.contentScrollTop===0){if(_this.options.preventPageScrolling){_this.preventScrolling(e,UP)}
if(_this.prevScrollTop!==0){_this.$el.trigger('scrolltop')}}}})(this),wheel:(function(_this){return function(e){var delta;if(e==null){return}
delta=e.delta||e.wheelDelta||(e.originalEvent&&e.originalEvent.wheelDelta)||-e.detail||(e.originalEvent&&-e.originalEvent.detail);if(delta){_this.sliderY+=-delta/3}
_this.scroll();return!1}})(this),enter:(function(_this){return function(e){var _ref;if(!_this.isBeingDragged){return}
if((e.buttons||e.which)!==1){return(_ref=_this.events)[UP].apply(_ref,arguments)}}})(this)}};NanoScroll.prototype.addEvents=function(){var events;this.removeEvents();events=this.events;if(!this.options.disableResize){this.win.bind(RESIZE,events[RESIZE])}
if(!this.iOSNativeScrolling){this.slider.bind(MOUSEDOWN,events[DOWN]);this.pane.bind(MOUSEDOWN,events[PANEDOWN]).bind(""+MOUSEWHEEL+" "+DOMSCROLL,events[WHEEL])}
this.$content.bind(""+SCROLL+" "+MOUSEWHEEL+" "+DOMSCROLL+" "+TOUCHMOVE,events[SCROLL])};NanoScroll.prototype.removeEvents=function(){var events;events=this.events;this.win.unbind(RESIZE,events[RESIZE]);if(!this.iOSNativeScrolling){this.slider.unbind();this.pane.unbind()}
this.$content.unbind(""+SCROLL+" "+MOUSEWHEEL+" "+DOMSCROLL+" "+TOUCHMOVE,events[SCROLL])};NanoScroll.prototype.generate=function(){var contentClass,cssRule,currentPadding,options,pane,paneClass,sliderClass;options=this.options;paneClass=options.paneClass,sliderClass=options.sliderClass,contentClass=options.contentClass;if(!(pane=this.$el.children("."+paneClass)).length&&!pane.children("."+sliderClass).length){this.$el.append("<div class=\""+paneClass+"\"><div class=\""+sliderClass+"\" /></div>")}
this.pane=this.$el.children("."+paneClass);this.slider=this.pane.find("."+sliderClass);if(BROWSER_SCROLLBAR_WIDTH===0&&isFFWithBuggyScrollbar()){currentPadding=window.getComputedStyle(this.content,null).getPropertyValue('padding-right').replace(/[^0-9.]+/g,'');cssRule={right:-14,paddingRight:+currentPadding+14}}else if(BROWSER_SCROLLBAR_WIDTH){cssRule={right:-BROWSER_SCROLLBAR_WIDTH};this.$el.addClass('has-scrollbar')}
if(cssRule!=null){this.$content.css(cssRule)}
return this};NanoScroll.prototype.restore=function(){this.stopped=!1;if(!this.iOSNativeScrolling){this.pane.show()}
this.addEvents()};NanoScroll.prototype.reset=function(){var content,contentHeight,contentPosition,contentStyle,contentStyleOverflowY,paneBottom,paneHeight,paneOuterHeight,paneTop,parentMaxHeight,right,sliderHeight;if(this.iOSNativeScrolling){this.contentHeight=this.content.scrollHeight;return}
if(!this.$el.find("."+this.options.paneClass).length){this.generate().stop()}
if(this.stopped){this.restore()}
content=this.content;contentStyle=content.style;contentStyleOverflowY=contentStyle.overflowY;if(BROWSER_IS_IE7){this.$content.css({height:this.$content.height()})}
contentHeight=content.scrollHeight+BROWSER_SCROLLBAR_WIDTH;parentMaxHeight=parseInt(this.$el.css("max-height"),10);if(parentMaxHeight>0){this.$el.height("");this.$el.height(content.scrollHeight>parentMaxHeight?parentMaxHeight:content.scrollHeight)}
paneHeight=this.pane.outerHeight(!1);paneTop=parseInt(this.pane.css('top'),10);paneBottom=parseInt(this.pane.css('bottom'),10);paneOuterHeight=paneHeight+paneTop+paneBottom;sliderHeight=Math.round(paneOuterHeight/contentHeight*paneHeight);if(sliderHeight<this.options.sliderMinHeight){sliderHeight=this.options.sliderMinHeight}else if((this.options.sliderMaxHeight!=null)&&sliderHeight>this.options.sliderMaxHeight){sliderHeight=this.options.sliderMaxHeight}
if(contentStyleOverflowY===SCROLL&&contentStyle.overflowX!==SCROLL){sliderHeight+=BROWSER_SCROLLBAR_WIDTH}
this.maxSliderTop=paneOuterHeight-sliderHeight;this.contentHeight=contentHeight;this.paneHeight=paneHeight;this.paneOuterHeight=paneOuterHeight;this.sliderHeight=sliderHeight;this.paneTop=paneTop;this.slider.height(sliderHeight);this.events.scroll();this.pane.show();this.isActive=!0;if((content.scrollHeight===content.clientHeight)||(this.pane.outerHeight(!0)>=content.scrollHeight&&contentStyleOverflowY!==SCROLL)){this.pane.hide();this.isActive=!1}else if(this.el.clientHeight===content.scrollHeight&&contentStyleOverflowY===SCROLL){this.slider.hide()}else{this.slider.show()}
this.pane.css({opacity:(this.options.alwaysVisible?1:''),visibility:(this.options.alwaysVisible?'visible':'')});contentPosition=this.$content.css('position');if(contentPosition==='static'||contentPosition==='relative'){right=parseInt(this.$content.css('right'),10);if(right){this.$content.css({right:'',marginRight:right})}}
return this};NanoScroll.prototype.scroll=function(){if(!this.isActive){return}
this.sliderY=Math.max(0,this.sliderY);this.sliderY=Math.min(this.maxSliderTop,this.sliderY);this.$content.scrollTop(this.maxScrollTop*this.sliderY/this.maxSliderTop);if(!this.iOSNativeScrolling){this.updateScrollValues();this.setOnScrollStyles()}
return this};NanoScroll.prototype.scrollBottom=function(offsetY){if(!this.isActive){return}
this.$content.scrollTop(this.contentHeight-this.$content.height()-offsetY).trigger(MOUSEWHEEL);this.stop().restore();return this};NanoScroll.prototype.scrollTop=function(offsetY){if(!this.isActive){return}
this.$content.scrollTop(+offsetY).trigger(MOUSEWHEEL);this.stop().restore();return this};NanoScroll.prototype.scrollTo=function(node){if(!this.isActive){return}
this.scrollTop(this.$el.find(node).get(0).offsetTop);return this};NanoScroll.prototype.stop=function(){if(cAF&&this.scrollRAF){cAF(this.scrollRAF);this.scrollRAF=null}
this.stopped=!0;this.removeEvents();if(!this.iOSNativeScrolling){this.pane.hide()}
return this};NanoScroll.prototype.destroy=function(){if(!this.stopped){this.stop()}
if(!this.iOSNativeScrolling&&this.pane.length){this.pane.remove()}
if(BROWSER_IS_IE7){this.$content.height('')}
this.$content.removeAttr('tabindex');if(this.$el.hasClass('has-scrollbar')){this.$el.removeClass('has-scrollbar');this.$content.css({right:''})}
return this};NanoScroll.prototype.flash=function(){if(this.iOSNativeScrolling){return}
if(!this.isActive){return}
this.reset();this.pane.addClass('flashed');setTimeout((function(_this){return function(){_this.pane.removeClass('flashed')}})(this),this.options.flashDelay);return this};return NanoScroll})();$.fn.nanoScroller=function(settings){return this.each(function(){var options,scrollbar;if(!(scrollbar=this.nanoscroller)){options=$.extend({},defaults,settings);this.nanoscroller=scrollbar=new NanoScroll(this,options)}
if(settings&&typeof settings==="object"){$.extend(scrollbar.options,settings);if(settings.scrollBottom!=null){return scrollbar.scrollBottom(settings.scrollBottom)}
if(settings.scrollTop!=null){return scrollbar.scrollTop(settings.scrollTop)}
if(settings.scrollTo){return scrollbar.scrollTo(settings.scrollTo)}
if(settings.scroll==='bottom'){return scrollbar.scrollBottom(0)}
if(settings.scroll==='top'){return scrollbar.scrollTop(0)}
if(settings.scroll&&settings.scroll instanceof $){return scrollbar.scrollTo(settings.scroll)}
if(settings.stop){return scrollbar.stop()}
if(settings.destroy){return scrollbar.destroy()}
if(settings.flash){return scrollbar.flash()}}
return scrollbar.reset()})};$.fn.nanoScroller.Constructor=NanoScroll});(function(window,document,$,undefined){$.swipebox=function(elem,options){var ui,defaults={useCSS:!0,useSVG:!0,initialIndexOnArray:0,removeBarsOnMobile:!0,hideCloseButtonOnMobile:!1,hideBarsDelay:3000,videoMaxWidth:1140,vimeoColor:'cccccc',beforeOpen:null,afterOpen:null,afterClose:null,afterMedia:null,nextSlide:null,prevSlide:null,loopAtEnd:!1,autoplayVideos:!1,queryStringData:{},toggleClassOnLoad:''},plugin=this,elements=[],$elem,selector=elem.selector,isMobile=navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(Android)|(PlayBook)|(BB10)|(BlackBerry)|(Opera Mini)|(IEMobile)|(webOS)|(MeeGo)/i),isTouch=isMobile!==null||document.createTouch!==undefined||('ontouchstart' in window)||('onmsgesturechange' in window)||navigator.msMaxTouchPoints,supportSVG=!!document.createElementNS&&!!document.createElementNS('http://www.w3.org/2000/svg','svg').createSVGRect,winWidth=window.innerWidth?window.innerWidth:$(window).width(),winHeight=window.innerHeight?window.innerHeight:$(window).height(),currentX=0,html='<div dir="ltr" id="swipebox-overlay">\
					<div id="swipebox-container">\
						<div id="swipebox-slider"></div>\
						<div id="swipebox-top-bar">\
							<div id="swipebox-title"></div>\
						</div>\
						<div id="swipebox-bottom-bar">\
							<div id="swipebox-arrows">\
								<a id="swipebox-prev"></a>\
								<a id="swipebox-next"></a>\
							</div>\
						</div>\
						<a id="swipebox-close"></a>\
					</div>\
			</div>';plugin.settings={};$.swipebox.close=function(){ui.closeSlide()};$.swipebox.extend=function(){return ui};plugin.init=function(){plugin.settings=$.extend({},defaults,options);if($.isArray(elem)){elements=elem;ui.target=$(window);ui.init(plugin.settings.initialIndexOnArray)}else{$(document).on('click',selector,function(event){if(event.target.parentNode.className==='slide current'){return!1}
if(!$.isArray(elem)){ui.destroy();$elem=$(selector);ui.actions()}
elements=[];var index,relType,relVal;if(!relVal){relType='data-rel';relVal=$(this).attr(relType)}
if(!relVal){relType='rel';relVal=$(this).attr(relType)}
if(relVal&&relVal!==''&&relVal!=='nofollow'){$elem=$(selector).filter('['+relType+'="'+relVal+'"]')}else{$elem=$(selector)}
$elem.each(function(){var title=null,href=null;if($(this).attr('title')){title=$(this).attr('title')}
if($(this).attr('href')){href=$(this).attr('href')}
elements.push({href:href,title:title})});index=$elem.index($(this));event.preventDefault();event.stopPropagation();ui.target=$(event.target);ui.init(index)})}};ui={init:function(index){if(plugin.settings.beforeOpen){plugin.settings.beforeOpen()}
this.target.trigger('swipebox-start');$.swipebox.isOpen=!0;this.build();this.openSlide(index);this.openMedia(index);this.preloadMedia(index+1);this.preloadMedia(index-1);if(plugin.settings.afterOpen){plugin.settings.afterOpen(index)}},build:function(){var $this=this,bg;$('body').append(html);if(supportSVG&&plugin.settings.useSVG===!0){bg=$('#swipebox-close').css('background-image');bg=bg.replace('png','svg');$('#swipebox-prev, #swipebox-next, #swipebox-close').css({'background-image':bg})}
if(isMobile&&plugin.settings.removeBarsOnMobile){$('#swipebox-bottom-bar, #swipebox-top-bar').remove()}
$.each(elements,function(){$('#swipebox-slider').append('<div class="slide"></div>')});$this.setDim();$this.actions();if(isTouch){$this.gesture()}
$this.keyboard();$this.animBars();$this.resize()},setDim:function(){var width,height,sliderCss={};if('onorientationchange' in window){window.addEventListener('orientationchange',function(){if(window.orientation===0){width=winWidth;height=winHeight}else if(window.orientation===90||window.orientation===-90){width=winHeight;height=winWidth}},!1)}else{width=window.innerWidth?window.innerWidth:$(window).width();height=window.innerHeight?window.innerHeight:$(window).height()}
sliderCss={width:width,height:height};$('#swipebox-overlay').css(sliderCss)},resize:function(){var $this=this;$(window).resize(function(){$this.setDim()}).resize()},supportTransition:function(){var prefixes='transition WebkitTransition MozTransition OTransition msTransition KhtmlTransition'.split(' '),i;for(i=0;i<prefixes.length;i++){if(document.createElement('div').style[prefixes[i]]!==undefined){return prefixes[i]}}
return!1},doCssTrans:function(){if(plugin.settings.useCSS&&this.supportTransition()){return!0}},gesture:function(){var $this=this,index,hDistance,vDistance,hDistanceLast,vDistanceLast,hDistancePercent,vSwipe=!1,hSwipe=!1,hSwipMinDistance=10,vSwipMinDistance=50,startCoords={},endCoords={},bars=$('#swipebox-top-bar, #swipebox-bottom-bar'),slider=$('#swipebox-slider');bars.addClass('visible-bars');$this.setTimeout();$('body').bind('touchstart',function(event){$(this).addClass('touching');index=$('#swipebox-slider .slide').index($('#swipebox-slider .slide.current'));endCoords=event.originalEvent.targetTouches[0];startCoords.pageX=event.originalEvent.targetTouches[0].pageX;startCoords.pageY=event.originalEvent.targetTouches[0].pageY;$('#swipebox-slider').css({'-webkit-transform':'translate3d('+currentX+'%, 0, 0)','transform':'translate3d('+currentX+'%, 0, 0)'});$('.touching').bind('touchmove',function(event){event.preventDefault();event.stopPropagation();endCoords=event.originalEvent.targetTouches[0];if(!hSwipe){vDistanceLast=vDistance;vDistance=endCoords.pageY-startCoords.pageY;if(Math.abs(vDistance)>=vSwipMinDistance||vSwipe){var opacity=0.75-Math.abs(vDistance)/slider.height();slider.css({'top':vDistance+'px'});slider.css({'opacity':opacity});vSwipe=!0}}
hDistanceLast=hDistance;hDistance=endCoords.pageX-startCoords.pageX;hDistancePercent=hDistance*100/winWidth;if(!hSwipe&&!vSwipe&&Math.abs(hDistance)>=hSwipMinDistance){$('#swipebox-slider').css({'-webkit-transition':'','transition':''});hSwipe=!0}
if(hSwipe){if(0<hDistance){if(0===index){$('#swipebox-overlay').addClass('leftSpringTouch')}else{$('#swipebox-overlay').removeClass('leftSpringTouch').removeClass('rightSpringTouch');$('#swipebox-slider').css({'-webkit-transform':'translate3d('+(currentX+hDistancePercent)+'%, 0, 0)','transform':'translate3d('+(currentX+hDistancePercent)+'%, 0, 0)'})}}else if(0>hDistance){if(elements.length===index+1){$('#swipebox-overlay').addClass('rightSpringTouch')}else{$('#swipebox-overlay').removeClass('leftSpringTouch').removeClass('rightSpringTouch');$('#swipebox-slider').css({'-webkit-transform':'translate3d('+(currentX+hDistancePercent)+'%, 0, 0)','transform':'translate3d('+(currentX+hDistancePercent)+'%, 0, 0)'})}}}});return!1}).bind('touchend',function(event){event.preventDefault();event.stopPropagation();$('#swipebox-slider').css({'-webkit-transition':'-webkit-transform 0.4s ease','transition':'transform 0.4s ease'});vDistance=endCoords.pageY-startCoords.pageY;hDistance=endCoords.pageX-startCoords.pageX;hDistancePercent=hDistance*100/winWidth;if(vSwipe){vSwipe=!1;if(Math.abs(vDistance)>=2*vSwipMinDistance&&Math.abs(vDistance)>Math.abs(vDistanceLast)){var vOffset=vDistance>0?slider.height():-slider.height();slider.animate({top:vOffset+'px','opacity':0},300,function(){$this.closeSlide()})}else{slider.animate({top:0,'opacity':1},300)}}else if(hSwipe){hSwipe=!1;if(hDistance>=hSwipMinDistance&&hDistance>=hDistanceLast){$this.getPrev()}else if(hDistance<=-hSwipMinDistance&&hDistance<=hDistanceLast){$this.getNext()}}else{if(!bars.hasClass('visible-bars')){$this.showBars();$this.setTimeout()}else{$this.clearTimeout();$this.hideBars()}}
$('#swipebox-slider').css({'-webkit-transform':'translate3d('+currentX+'%, 0, 0)','transform':'translate3d('+currentX+'%, 0, 0)'});$('#swipebox-overlay').removeClass('leftSpringTouch').removeClass('rightSpringTouch');$('.touching').off('touchmove').removeClass('touching')})},setTimeout:function(){if(plugin.settings.hideBarsDelay>0){var $this=this;$this.clearTimeout();$this.timeout=window.setTimeout(function(){$this.hideBars()},plugin.settings.hideBarsDelay)}},clearTimeout:function(){window.clearTimeout(this.timeout);this.timeout=null},showBars:function(){var bars=$('#swipebox-top-bar, #swipebox-bottom-bar');if(this.doCssTrans()){bars.addClass('visible-bars')}else{$('#swipebox-top-bar').animate({top:0},500);$('#swipebox-bottom-bar').animate({bottom:0},500);setTimeout(function(){bars.addClass('visible-bars')},1000)}},hideBars:function(){var bars=$('#swipebox-top-bar, #swipebox-bottom-bar');if(this.doCssTrans()){bars.removeClass('visible-bars')}else{$('#swipebox-top-bar').animate({top:'-50px'},500);$('#swipebox-bottom-bar').animate({bottom:'-50px'},500);setTimeout(function(){bars.removeClass('visible-bars')},1000)}},animBars:function(){var $this=this,bars=$('#swipebox-top-bar, #swipebox-bottom-bar');bars.addClass('visible-bars');$this.setTimeout();$('#swipebox-slider').click(function(){if(!bars.hasClass('visible-bars')){$this.showBars();$this.setTimeout()}});$('#swipebox-bottom-bar').hover(function(){$this.showBars();bars.addClass('visible-bars');$this.clearTimeout()},function(){if(plugin.settings.hideBarsDelay>0){bars.removeClass('visible-bars');$this.setTimeout()}})},keyboard:function(){var $this=this;$(window).bind('keyup',function(event){event.preventDefault();event.stopPropagation();if(event.keyCode===37){$this.getPrev()}else if(event.keyCode===39){$this.getNext()}else if(event.keyCode===27){$this.closeSlide()}})},actions:function(){var $this=this,action='touchend click';if(elements.length<2){$('#swipebox-bottom-bar').hide();if(undefined===elements[1]){$('#swipebox-top-bar').hide()}}else{$('#swipebox-prev').bind(action,function(event){event.preventDefault();event.stopPropagation();$this.getPrev();$this.setTimeout()});$('#swipebox-next').bind(action,function(event){event.preventDefault();event.stopPropagation();$this.getNext();$this.setTimeout()})}
$('#swipebox-close').bind(action,function(){$this.closeSlide()})},setSlide:function(index,isFirst){isFirst=isFirst||!1;var slider=$('#swipebox-slider');currentX=-index*100;if(this.doCssTrans()){slider.css({'-webkit-transform':'translate3d('+(-index*100)+'%, 0, 0)','transform':'translate3d('+(-index*100)+'%, 0, 0)'})}else{slider.animate({left:(-index*100)+'%'})}
$('#swipebox-slider .slide').removeClass('current');$('#swipebox-slider .slide').eq(index).addClass('current');this.setTitle(index);if(isFirst){slider.fadeIn()}
$('#swipebox-prev, #swipebox-next').removeClass('disabled');if(index===0){$('#swipebox-prev').addClass('disabled')}else if(index===elements.length-1&&plugin.settings.loopAtEnd!==!0){$('#swipebox-next').addClass('disabled')}},openSlide:function(index){$('html').addClass('swipebox-html');if(isTouch){$('html').addClass('swipebox-touch');if(plugin.settings.hideCloseButtonOnMobile){$('html').addClass('swipebox-no-close-button')}}else{$('html').addClass('swipebox-no-touch')}
$(window).trigger('resize');this.setSlide(index,!0)},preloadMedia:function(index){var $this=this,src=null;if(elements[index]!==undefined){src=elements[index].href}
if(!$this.isVideo(src)){setTimeout(function(){$this.openMedia(index)},1000)}else{$this.openMedia(index)}},openMedia:function(index){var $this=this,src,slide;if(elements[index]!==undefined){src=elements[index].href}
if(index<0||index>=elements.length){return!1}
slide=$('#swipebox-slider .slide').eq(index);if(!$this.isVideo(src)){slide.addClass('slide-loading');$this.loadMedia(src,function(){slide.removeClass('slide-loading');slide.html(this);if(plugin.settings.afterMedia){plugin.settings.afterMedia(index)}})}else{slide.html($this.getVideo(src));if(plugin.settings.afterMedia){plugin.settings.afterMedia(index)}}},setTitle:function(index){var title=null;$('#swipebox-title').empty();if(elements[index]!==undefined){title=elements[index].title}
if(title){$('#swipebox-top-bar').show();$('#swipebox-title').append(title)}else{$('#swipebox-top-bar').hide()}},isVideo:function(src){if(src){if(src.match(/(youtube\.com|youtube-nocookie\.com)\/watch\?v=([a-zA-Z0-9\-_]+)/)||src.match(/vimeo\.com\/([0-9]*)/)||src.match(/youtu\.be\/([a-zA-Z0-9\-_]+)/)||src.match(/mp4|wmv|wma|ogv|ogg|flv/)){return!0}
if(src.toLowerCase().indexOf('swipeboxvideo=1')>=0){return!0}}},parseUri:function(uri,customData){var a=document.createElement('a'),qs={};a.href=decodeURIComponent(uri);if(a.search){qs=JSON.parse('{"'+a.search.toLowerCase().replace('?','').replace(/&/g,'","').replace(/=/g,'":"')+'"}')}
if($.isPlainObject(customData)){qs=$.extend(qs,customData,plugin.settings.queryStringData)}
return $.map(qs,function(val,key){if(val&&val>''){return encodeURIComponent(key)+'='+encodeURIComponent(val)}}).join('&')},getVideo:function(url){var iframe='',youtubeUrl=url.match(/((?:www\.)?youtube\.com|(?:www\.)?youtube-nocookie\.com)\/watch\?v=([a-zA-Z0-9\-_]+)/),youtubeShortUrl=url.match(/(?:www\.)?youtu\.be\/([a-zA-Z0-9\-_]+)/),vimeoUrl=url.match(/(?:www\.)?vimeo\.com\/([0-9]*)/),mp4url=url.match(/mp4|wmv|wma|ogv|ogg|flv/),qs='';if(youtubeUrl||youtubeShortUrl){if(youtubeShortUrl){youtubeUrl=youtubeShortUrl}
qs=ui.parseUri(url,{'autoplay':(plugin.settings.autoplayVideos?'1':'0'),'v':''});iframe='<iframe width="560" height="315" src="//'+youtubeUrl[1]+'/embed/'+youtubeUrl[2]+'?'+qs+'" frameborder="0" allowfullscreen></iframe>'}else if(vimeoUrl){qs=ui.parseUri(url,{'autoplay':(plugin.settings.autoplayVideos?'1':'0'),'byline':'0','portrait':'0','color':plugin.settings.vimeoColor});iframe='<iframe width="560" height="315"  src="//player.vimeo.com/video/'+vimeoUrl[1]+'?'+qs+'" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>'}else if(mp4url){iframe='<video  width="560" height="315"  controls="" name="media" ><source src="'+url+'" type="video/mp4"></video>'}else{iframe='<iframe width="560" height="315" src="'+url+'" frameborder="0" allowfullscreen></iframe>'}
return'<div class="swipebox-video-container" style="max-width:'+plugin.settings.videoMaxWidth+'px"><div class="swipebox-video">'+iframe+'</div></div>'},loadMedia:function(src,callback){if(src.trim().indexOf('#')===0){callback.call($('<div>',{'class':'swipebox-inline-container'}).append($(src).clone().toggleClass(plugin.settings.toggleClassOnLoad)))}
else{if(!this.isVideo(src)){var img=$('<img>').on('load',function(){callback.call(img)});img.attr('src',src)}}},getNext:function(){var $this=this,src,index=$('#swipebox-slider .slide').index($('#swipebox-slider .slide.current'));if(index+1<elements.length){src=$('#swipebox-slider .slide').eq(index).contents().find('iframe').attr('src');$('#swipebox-slider .slide').eq(index).contents().find('iframe').attr('src',src);index++;$this.setSlide(index);$this.preloadMedia(index+1);if(plugin.settings.nextSlide){plugin.settings.nextSlide(index)}}else{if(plugin.settings.loopAtEnd===!0){src=$('#swipebox-slider .slide').eq(index).contents().find('iframe').attr('src');$('#swipebox-slider .slide').eq(index).contents().find('iframe').attr('src',src);index=0;$this.preloadMedia(index);$this.setSlide(index);$this.preloadMedia(index+1);if(plugin.settings.nextSlide){plugin.settings.nextSlide(index)}}else{$('#swipebox-overlay').addClass('rightSpring');setTimeout(function(){$('#swipebox-overlay').removeClass('rightSpring')},500)}}},getPrev:function(){var index=$('#swipebox-slider .slide').index($('#swipebox-slider .slide.current')),src;if(index>0){src=$('#swipebox-slider .slide').eq(index).contents().find('iframe').attr('src');$('#swipebox-slider .slide').eq(index).contents().find('iframe').attr('src',src);index--;this.setSlide(index);this.preloadMedia(index-1);if(plugin.settings.prevSlide){plugin.settings.prevSlide(index)}}else{$('#swipebox-overlay').addClass('leftSpring');setTimeout(function(){$('#swipebox-overlay').removeClass('leftSpring')},500)}},nextSlide:function(index){},prevSlide:function(index){},closeSlide:function(){$('html').removeClass('swipebox-html');$('html').removeClass('swipebox-touch');$(window).trigger('resize');this.destroy()},destroy:function(){$(window).unbind('keyup');$('body').unbind('touchstart');$('body').unbind('touchmove');$('body').unbind('touchend');$('#swipebox-slider').unbind();$('#swipebox-overlay').remove();if(!$.isArray(elem)){elem.removeData('_swipebox')}
if(this.target){this.target.trigger('swipebox-destroy')}
$.swipebox.isOpen=!1;if(plugin.settings.afterClose){plugin.settings.afterClose()}}};plugin.init()};$.fn.swipebox=function(options){if(!$.data(this,'_swipebox')){var swipebox=new $.swipebox(this,options);this.data('_swipebox',swipebox)}
return this.data('_swipebox')}}(window,document,jQuery));$(function(){$('[data-toggle]').on('click',function(e){e.preventDefault();let id=$(this).data('toggle');$(id).toggleClass('is-open')});$('.nano').nanoScroller({scroll:'top'});$('.swipebox').swipebox()})
