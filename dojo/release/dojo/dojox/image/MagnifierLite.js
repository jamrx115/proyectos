/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


dojo._hasResource["dojox.image.MagnifierLite"]||(dojo._hasResource["dojox.image.MagnifierLite"]=!0,dojo.provide("dojox.image.MagnifierLite"),dojo.experimental("dojox.image.MagnifierLite"),dojo.require("dijit._Widget"),dojo.declare("dojox.image.MagnifierLite",dijit._Widget,{glassSize:125,scale:6,postCreate:function(){this.inherited(arguments);this._adjustScale();this._createGlass();this.connect(this.domNode,"onmouseenter","_showGlass");this.connect(this.glassNode,"onmousemove","_placeGlass");this.connect(this.img,
"onmouseout","_hideGlass");this.connect(window,"onresize","_adjustScale")},_createGlass:function(){var a=this.glassNode=dojo.create("div",{style:{height:this.glassSize+"px",width:this.glassSize+"px"},className:"glassNode"},dojo.body());this.surfaceNode=a.appendChild(dojo.create("div"));this.img=dojo.place(dojo.clone(this.domNode),a);dojo.style(this.img,{position:"relative",top:0,left:0,width:this._zoomSize.w+"px",height:this._zoomSize.h+"px"})},_adjustScale:function(){this.offset=dojo.coords(this.domNode,
!0);this._imageSize={w:this.offset.w,h:this.offset.h};this._zoomSize={w:this._imageSize.w*this.scale,h:this._imageSize.h*this.scale}},_showGlass:function(a){this._placeGlass(a);dojo.style(this.glassNode,{visibility:"visible",display:""})},_hideGlass:function(){dojo.style(this.glassNode,{visibility:"hidden",display:"none"})},_placeGlass:function(a){this._setImage(a);var b=Math.floor(this.glassSize/2);dojo.style(this.glassNode,{top:Math.floor(a.pageY-b)+"px",left:Math.floor(a.pageX-b)+"px"})},_setImage:function(a){var b=
(a.pageX-this.offset.l)/this.offset.w,a=(a.pageY-this.offset.t)/this.offset.h;dojo.style(this.img,{top:this._zoomSize.h*a*-1+this.glassSize*a+"px",left:this._zoomSize.w*b*-1+this.glassSize*b+"px"})},destroy:function(a){dojo.destroy(this.glassNode);this.inherited(arguments)}}));