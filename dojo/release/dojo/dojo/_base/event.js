/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dojo._base.event"]&&(dojo._hasResource["dojo._base.event"]=!0,dojo.provide("dojo._base.event"),dojo.require("dojo._base.connect"),function(){var d=dojo._event_listener={add:function(a,b,c){if(a){b=d._normalizeEventName(b);c=d._fixCallback(b,c);if(!dojo.isIE&&(b=="mouseenter"||b=="mouseleave"))var e=c,b=b=="mouseenter"?"mouseover":"mouseout",c=function(b){if(!dojo.isDescendant(b.relatedTarget,a))return e.call(this,b)};a.addEventListener(b,c,!1);return c}},remove:function(a,b,
c){if(a){b=d._normalizeEventName(b);if(!dojo.isIE&&(b=="mouseenter"||b=="mouseleave"))b=b=="mouseenter"?"mouseover":"mouseout";a.removeEventListener(b,c,!1)}},_normalizeEventName:function(a){return a.slice(0,2)=="on"?a.slice(2):a},_fixCallback:function(a,b){return a!="keypress"?b:function(a){return b.call(this,d._fixEvent(a,this))}},_fixEvent:function(a){switch(a.type){case "keypress":d._setKeyChar(a)}return a},_setKeyChar:function(a){a.keyChar=a.charCode>=32?String.fromCharCode(a.charCode):"";a.charOrCode=
a.keyChar||a.keyCode},_punctMap:{106:42,111:47,186:59,187:43,188:44,189:45,190:46,191:47,192:96,219:91,220:92,221:93,222:39}};dojo.fixEvent=function(a,b){return d._fixEvent(a,b)};dojo.stopEvent=function(a){a.preventDefault();a.stopPropagation()};var i=dojo._listener;dojo._connect=function(a,b,c,e,h){h=a&&(a.nodeType||a.attachEvent||a.addEventListener)?h?2:1:0;c=[dojo._listener,d,i][h].add(a,b,dojo.hitch(c,e));return[a,b,c,h]};dojo._disconnect=function(a,b,c,e){[dojo._listener,d,i][e].remove(a,b,c)};
dojo.keys={BACKSPACE:8,TAB:9,CLEAR:12,ENTER:13,SHIFT:16,CTRL:17,ALT:18,META:dojo.isSafari?91:224,PAUSE:19,CAPS_LOCK:20,ESCAPE:27,SPACE:32,PAGE_UP:33,PAGE_DOWN:34,END:35,HOME:36,LEFT_ARROW:37,UP_ARROW:38,RIGHT_ARROW:39,DOWN_ARROW:40,INSERT:45,DELETE:46,HELP:47,LEFT_WINDOW:91,RIGHT_WINDOW:92,SELECT:93,NUMPAD_0:96,NUMPAD_1:97,NUMPAD_2:98,NUMPAD_3:99,NUMPAD_4:100,NUMPAD_5:101,NUMPAD_6:102,NUMPAD_7:103,NUMPAD_8:104,NUMPAD_9:105,NUMPAD_MULTIPLY:106,NUMPAD_PLUS:107,NUMPAD_ENTER:108,NUMPAD_MINUS:109,NUMPAD_PERIOD:110,
NUMPAD_DIVIDE:111,F1:112,F2:113,F3:114,F4:115,F5:116,F6:117,F7:118,F8:119,F9:120,F10:121,F11:122,F12:123,F13:124,F14:125,F15:126,NUM_LOCK:144,SCROLL_LOCK:145,copyKey:dojo.isMac&&!dojo.isAIR?dojo.isSafari?91:224:17};var k=dojo.isMac?"metaKey":"ctrlKey";dojo.isCopyKey=function(a){return a[k]};dojo.mouseButtons=dojo.isIE<9||dojo.isIE&&dojo.isQuirks?{LEFT:1,MIDDLE:4,RIGHT:2,isButton:function(a,b){return a.button&b},isLeft:function(a){return a.button&1},isMiddle:function(a){return a.button&4},isRight:function(a){return a.button&
2}}:{LEFT:0,MIDDLE:1,RIGHT:2,isButton:function(a,b){return a.button==b},isLeft:function(a){return a.button==0},isMiddle:function(a){return a.button==1},isRight:function(a){return a.button==2}};if(dojo.isIE){var l=function(a,b){try{return a.keyCode=b}catch(c){return 0}},f=dojo._listener,g=dojo._ieListenersName="_"+dojo._scopeName+"_listeners";if(!dojo.config._allow_leaks)var i=f=dojo._ie_listener={handlers:[],add:function(a,b,c){var a=a||dojo.global,d=a[b];if(!d||!d[g]){var h=dojo._getIeDispatcher();
h.target=d&&j.push(d)-1;h[g]=[];d=a[b]=h}return d[g].push(j.push(c)-1)},remove:function(a,b,c){var e;e=(a=(a||dojo.global)[b])&&a[g],b=e;a&&b&&c--&&(delete j[b[c]],delete b[c])}},j=f.handlers;dojo.mixin(d,{add:function(a,b,c){if(a){b=d._normalizeEventName(b);if(b=="onkeypress"){var e=a.onkeydown;if(!e||!e[g]||!e._stealthKeydownHandle){var h=d.add(a,"onkeydown",d._stealthKeyDown),e=a.onkeydown;e._stealthKeydownHandle=h;e._stealthKeydownRefs=1}else e._stealthKeydownRefs++}return f.add(a,b,d._fixCallback(c))}},
remove:function(a,b,c){b=d._normalizeEventName(b);f.remove(a,b,c);if(b=="onkeypress")b=a.onkeydown,--b._stealthKeydownRefs<=0&&(f.remove(a,"onkeydown",b._stealthKeydownHandle),delete b._stealthKeydownHandle)},_normalizeEventName:function(a){return a.slice(0,2)!="on"?"on"+a:a},_nop:function(){},_fixEvent:function(a,b){if(!a)a=(b&&(b.ownerDocument||b.document||b).parentWindow||window).event;if(!a)return a;a.target=a.srcElement;a.currentTarget=b||a.srcElement;a.layerX=a.offsetX;a.layerY=a.offsetY;var c=
a.srcElement,c=c&&c.ownerDocument||document,c=dojo.isIE<6||c.compatMode=="BackCompat"?c.body:c.documentElement,e=dojo._getIeDocumentElementOffset();a.pageX=a.clientX+dojo._fixIeBiDiScrollLeft(c.scrollLeft||0)-e.x;a.pageY=a.clientY+(c.scrollTop||0)-e.y;if(a.type=="mouseover")a.relatedTarget=a.fromElement;if(a.type=="mouseout")a.relatedTarget=a.toElement;if(dojo.isIE<9||dojo.isQuirks)a.stopPropagation=d._stopPropagation,a.preventDefault=d._preventDefault;return d._fixKeys(a)},_fixKeys:function(a){switch(a.type){case "keypress":var b=
"charCode"in a?a.charCode:a.keyCode;b==10?(b=0,a.keyCode=13):b==13||b==27?b=0:b==3&&(b=99);a.charCode=b;d._setKeyChar(a)}return a},_stealthKeyDown:function(a){var b=a.currentTarget.onkeypress;if(b&&b[g]){var c=a.keyCode,e=(c!=13||dojo.isIE>=9&&!dojo.isQuirks)&&c!=32&&c!=27&&(c<48||c>90)&&(c<96||c>111)&&(c<186||c>192)&&(c<219||c>222);if(e||a.ctrlKey){e=e?0:c;if(a.ctrlKey)if(c==3||c==13)return;else e>95&&e<106?e-=48:!a.shiftKey&&e>=65&&e<=90?e+=32:e=d._punctMap[e]||e;c=d._synthesizeEvent(a,{type:"keypress",
faux:!0,charCode:e});b.call(a.currentTarget,c);if(dojo.isIE<9||dojo.isIE&&dojo.isQuirks)a.cancelBubble=c.cancelBubble;a.returnValue=c.returnValue;l(a,c.keyCode)}}},_stopPropagation:function(){this.cancelBubble=!0},_preventDefault:function(){this.bubbledKeyCode=this.keyCode;this.ctrlKey&&l(this,0);this.returnValue=!1}});dojo.stopEvent=dojo.isIE<9||dojo.isQuirks?function(a){a=a||window.event;d._stopPropagation.call(a);d._preventDefault.call(a)}:dojo.stopEvent}d._synthesizeEvent=function(a,b){var c=
dojo.mixin({},a,b);d._setKeyChar(c);c.preventDefault=function(){a.preventDefault()};c.stopPropagation=function(){a.stopPropagation()};return c};dojo.isOpera&&dojo.mixin(d,{_fixEvent:function(a){switch(a.type){case "keypress":var b=a.which;b==3&&(b=99);b=b<41&&!a.shiftKey?0:b;a.ctrlKey&&!a.shiftKey&&b>=65&&b<=90&&(b+=32);return d._synthesizeEvent(a,{charCode:b})}return a}});if(dojo.isWebKit)d._add=d.add,d._remove=d.remove,dojo.mixin(d,{add:function(a,b,c){if(a){var e=d._add(a,b,c);if(d._normalizeEventName(b)==
"keypress")e._stealthKeyDownHandle=d._add(a,"keydown",function(a){var b=a.keyCode,e=b!=13&&b!=32&&(b<48||b>90)&&(b<96||b>111)&&(b<186||b>192)&&(b<219||b>222);if(e||a.ctrlKey){e=e?0:b;if(a.ctrlKey)if(b==3||b==13)return;else e>95&&e<106?e-=48:!a.shiftKey&&e>=65&&e<=90?e+=32:e=d._punctMap[e]||e;b=d._synthesizeEvent(a,{type:"keypress",faux:!0,charCode:e});c.call(a.currentTarget,b)}});return e}},remove:function(a,b,c){a&&(c._stealthKeyDownHandle&&d._remove(a,"keydown",c._stealthKeyDownHandle),d._remove(a,
b,c))},_fixEvent:function(a){switch(a.type){case "keypress":if(a.faux)break;var b=a.charCode;return d._synthesizeEvent(a,{charCode:b>=32?b:0,faux:!0})}return a}})}(),dojo.isIE))dojo._ieDispatcher=function(d,i){var k=Array.prototype,l=dojo._ie_listener.handlers,f=d.callee,g=f[dojo._ieListenersName],f=(f=l[f.target])&&f.apply(i,d),g=[].concat(g),j;for(j in g){var a=l[g[j]];!(j in k)&&a&&a.apply(i,d)}return f},dojo._getIeDispatcher=function(){return new Function(dojo._scopeName+"._ieDispatcher(arguments, this)")},
dojo._event_listener._fixCallback=function(d){var i=dojo._event_listener._fixEvent;return function(k){return d.call(this,i(k,this))}};