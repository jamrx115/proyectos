/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dojox.drawing.annotations.BoxShadow"])dojo._hasResource["dojox.drawing.annotations.BoxShadow"]=!0,dojo.provide("dojox.drawing.annotations.BoxShadow"),dojox.drawing.annotations.BoxShadow=dojox.drawing.util.oo.declare(function(a){this.stencil=a.stencil;this.util=a.stencil.util;this.mouse=a.stencil.mouse;this.style=a.stencil.style;delete a.stencil;this.options=dojo.mixin({size:6,mult:4,alpha:0.05,place:"BR",color:"#646464"},a);this.options.color=new dojo.Color(this.options.color);
this.options.color.a=this.options.alpha;switch(this.stencil.shortType){case "image":case "rect":this.method="createForRect";break;case "ellipse":this.method="createForEllipse";break;case "line":this.method="createForLine";break;case "path":this.method="createForPath";break;case "vector":this.method="createForZArrow";break;default:console.warn("A shadow cannot be made for Stencil type ",this.stencil.type)}this.method&&(this.render(),this.stencil.connectMult([[this.stencil,"onTransform",this,"onTransform"],
this.method=="createForZArrow"?[this.stencil,"render",this,"render"]:[this.stencil,"render",this,"onRender"],[this.stencil,"onDelete",this,"destroy"]]))},{showing:!0,render:function(){this.container&&this.container.removeShape();this.container=this.stencil.container.createGroup();this.container.moveToBack();var a=this.options,d=this.method=="createForPath"?this.stencil.points:this.stencil.data;this[this.method](a,a.size,a.mult,d,d.r||1,a.place,a.color)},hide:function(){if(this.showing)this.showing=
!1,this.container.removeShape()},show:function(){if(!this.showing)this.showing=!0,this.stencil.container.add(this.container)},createForPath:function(a,d,e,c,f,b,i){for(var a=d*e/4,h=/B/.test(b)?a:/T/.test(b)?a*-1:0,g=/R/.test(b)?a:/L/.test(b)?a*-1:0,b=1;b<=d;b++)if(a=b*e,dojox.gfx.renderer=="svg"){var j=[];dojo.forEach(c,function(a,b){b==0?j.push("M "+(a.x+g)+" "+(a.y+h)):j.push((a.t||"L ")+(a.x+g)+" "+(a.y+h))},this);j.push("Z");this.container.createPath(j.join(", ")).setStroke({width:a,color:i,
cap:"round"})}else{var k=this.container.createPath({}).setStroke({width:a,color:i,cap:"round"});dojo.forEach(this.points,function(a,b){b==0||a.t=="M"?k.moveTo(a.x+g,a.y+h):a.t=="Z"?k.closePath():k.lineTo(a.x+g,a.y+h)},this);k.closePath()}},createForLine:function(a,d,e,c,f,b,i){f=d*e/4;a=/B/.test(b)?f:/T/.test(b)?f*-1:0;b=/R/.test(b)?f:/L/.test(b)?f*-1:0;for(f=1;f<=d;f++){var h=f*e;this.container.createLine({x1:c.x1+b,y1:c.y1+a,x2:c.x2+b,y2:c.y2+a}).setStroke({width:h,color:i,cap:"round"})}},createForEllipse:function(a,
d,e,c,f,b,i){for(var a=d*e/8,h=/B/.test(b)?a:/T/.test(b)?a*-1:0,b=/R/.test(b)?a*0.8:/L/.test(b)?a*-0.8:0,g=1;g<=d;g++){var j=g*e;this.container.createEllipse({cx:c.cx+b,cy:c.cy+h,rx:c.rx-a,ry:c.ry-a,r:f}).setStroke({width:j,color:i})}},createForRect:function(a,d,e,c,f,b,i){for(var a=d*e/2,h=/B/.test(b)?a:/T/.test(b)?0:a/2,b=/R/.test(b)?a:/L/.test(b)?0:a/2,g=1;g<=d;g++){var j=g*e;this.container.createRect({x:c.x+b,y:c.y+h,width:c.width-a,height:c.height-a,r:f}).setStroke({width:j,color:i})}},arrowPoints:function(){var a=
this.stencil.data,d=this.stencil.getRadius(),e=this.style.zAngle+30,e=this.util.pointOnCircle(a.x1,a.y1,d*0.75,e),a={start:{x:a.x1,y:a.y1},x:e.x,y:e.y},e=this.util.angle(a),c=this.util.length(a),d=this.style.arrows.length,f=this.style.arrows.width/3;c<d&&(d=c/2);c=this.util.pointOnCircle(a.x,a.y,-d,e-f);e=this.util.pointOnCircle(a.x,a.y,-d,e+f);return[{x:a.x,y:a.y},c,e]},createForZArrow:function(a,d,e,c,f,b,i){if(!(this.stencil.data.cosphi<1)&&this.stencil.points[0])for(var c=d*e/4,h=/B/.test(b)?
c:/T/.test(b)?c*-1:0,g=/R/.test(b)?c:/L/.test(b)?c*-1:0,b=1;b<=d;b++){a=b*e;c=this.arrowPoints();if(!c)break;if(dojox.gfx.renderer=="svg"){var j=[];dojo.forEach(c,function(a,b){b==0?j.push("M "+(a.x+g)+" "+(a.y+h)):j.push((a.t||"L ")+(a.x+g)+" "+(a.y+h))},this);j.push("Z");this.container.createPath(j.join(", ")).setStroke({width:a,color:i,cap:"round"}).setFill(i)}else{var k=this.container.createPath({}).setStroke({width:a,color:i,cap:"round"});dojo.forEach(c,function(a,b){b==0||a.t=="M"?k.moveTo(a.x+
g,a.y+h):a.t=="Z"?k.closePath():k.lineTo(a.x+g,a.y+h)},this);k.closePath()}f=this.stencil.points;this.container.createLine({x1:f[0].x,y1:f[0].y,x2:c[0].x,y2:c[0].y}).setStroke({width:a,color:i,cap:"round"})}},onTransform:function(){this.render()},onRender:function(){this.container.moveToBack()},destroy:function(){this.container&&this.container.removeShape()}});