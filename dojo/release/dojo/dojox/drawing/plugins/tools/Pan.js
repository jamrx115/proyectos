/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dojox.drawing.plugins.tools.Pan"])dojo._hasResource["dojox.drawing.plugins.tools.Pan"]=!0,dojo.provide("dojox.drawing.plugins.tools.Pan"),dojo.require("dojox.drawing.plugins._Plugin"),dojox.drawing.plugins.tools.Pan=dojox.drawing.util.oo.declare(dojox.drawing.plugins._Plugin,function(a){this.domNode=a.node;var b;this.toolbar=a.scope;this.connect(this.toolbar,"onToolClick",this,function(){this.onSetPan(!1)});this.connect(this.keys,"onKeyUp",this,"onKeyUp");this.connect(this.keys,
"onKeyDown",this,"onKeyDown");this.connect(this.keys,"onArrow",this,"onArrow");this.connect(this.anchors,"onAnchorUp",this,"checkBounds");this.connect(this.stencils,"register",this,"checkBounds");this.connect(this.canvas,"resize",this,"checkBounds");this.connect(this.canvas,"setZoom",this,"checkBounds");this.connect(this.canvas,"onScroll",this,function(){this._blockScroll?this._blockScroll=!1:(b&&clearTimeout(b),b=setTimeout(dojo.hitch(this,"checkBounds"),200))});this._mouseHandle=this.mouse.register(this)},
{selected:!1,keyScroll:!1,type:"dojox.drawing.plugins.tools.Pan",onPanUp:function(a){if(a.id==this.button.id)this.onSetPan(!1)},onKeyUp:function(a){switch(a.keyCode){case 32:this.onSetPan(!1);break;case 39:case 37:case 38:case 40:clearInterval(this._timer)}},onKeyDown:function(a){if(a.keyCode==32)this.onSetPan(!0)},interval:20,onArrow:function(a){this._timer&&clearInterval(this._timer);this._timer=setInterval(dojo.hitch(this,function(a){this.canvas.domNode.parentNode.scrollLeft+=a.x*10;this.canvas.domNode.parentNode.scrollTop+=
a.y*10},a),this.interval)},onSetPan:function(a){if(a===!0||a===!1)this.selected=!a;console.log("ON SET PAN:",this.selected);this.selected?(this.selected=!1,this.button.deselect()):(this.selected=!0,this.button.select());this.mouse.setEventMode(this.selected?"pan":"")},onPanDrag:function(a){this.canvas.domNode.parentNode.scrollTop-=a.move.y;this.canvas.domNode.parentNode.scrollLeft-=a.move.x;this.canvas.onScroll()},onUp:function(a){this.keyScroll=a.withinCanvas?!0:!1},onStencilUp:function(){this.checkBounds()},
onStencilDrag:function(){},checkBounds:function(){var a=-Infinity,b=-1E4,i=0,j=0,k=this.stencils.group?this.stencils.group.getTransform():{dx:0,dy:0},d=this.mouse.scrollOffset(),e=this.canvas.height,f=this.canvas.width,l=this.canvas.zoom,g=this.canvas.parentHeight,h=this.canvas.parentWidth;this.stencils.withSelected(function(c){c=c.getBounds();a=Math.max(c.x2+k.dx,a);b=Math.max(c.y2+k.dy,b)});this.stencils.withUnselected(function(c){c=c.getBounds();a=Math.max(c.x2,a);b=Math.max(c.y2,b)});b*=l;var m=
0,n=0;b>g||d.top?(e=Math.max(b,g+d.top),j=d.top,m+=this.canvas.getScrollWidth()):!j&&e>g&&(e=g);a*=l;a>h||d.left?(f=Math.max(a,h+d.left),i=d.left,n+=this.canvas.getScrollWidth()):!i&&f>h&&(f=h);f+=m*2;e+=n*2;this._blockScroll=!0;this.stencils.group&&this.stencils.group.applyTransform({dx:0,dy:0});this.stencils.withUnselected(function(a){a.transformPoints({dx:0,dy:0})});this.canvas.setDimensions(f,e,i,j)}}),dojox.drawing.plugins.tools.Pan.setup={name:"dojox.drawing.plugins.tools.Pan",tooltip:"Pan Tool",
iconClass:"iconPan",button:!1},dojox.drawing.register(dojox.drawing.plugins.tools.Pan.setup,"plugin");