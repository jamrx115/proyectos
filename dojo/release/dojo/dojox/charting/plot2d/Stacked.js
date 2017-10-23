/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


dojo._hasResource["dojox.charting.plot2d.Stacked"]||(dojo._hasResource["dojox.charting.plot2d.Stacked"]=!0,dojo.provide("dojox.charting.plot2d.Stacked"),dojo.require("dojox.charting.plot2d.common"),dojo.require("dojox.charting.plot2d.Default"),dojo.require("dojox.lang.functional"),dojo.require("dojox.lang.functional.sequence"),dojo.require("dojox.lang.functional.reversed"),function(){var n=dojox.lang.functional,l=dojox.charting.plot2d.common,t=n.lambda("item.purgeGroup()");dojo.declare("dojox.charting.plot2d.Stacked",
dojox.charting.plot2d.Default,{getSeriesStats:function(){var h=l.collectStackedStats(this.series);this._maxRunLength=h.hmax;return h},render:function(h,i){if(this._maxRunLength<=0)return this;for(var o=n.repeat(this._maxRunLength,"-> 0",0),j=0;j<this.series.length;++j)for(var c=this.series[j],f=0;f<c.data.length;++f){var a=c.data[f];a!==null&&(isNaN(a)&&(a=0),o[f]+=a)}if(this.zoom&&!this.isDataDirty())return this.performZoom(h,i);this.resetEvents();if(this.dirty=this.isDirty()){dojo.forEach(this.series,
t);this._eventSeries={};this.cleanGroup();var e=this.group;n.forEachRev(this.series,function(a){a.cleanGroup(e)})}for(var r=this.chart.theme,u=this.events(),v=this._hScaler.scaler.getTransformerFromModel(this._hScaler),w=this._vScaler.scaler.getTransformerFromModel(this._vScaler),j=this.series.length-1;j>=0;--j)if(c=this.series[j],!this.dirty&&!c.dirty)r.skip(),this._reconnectEvents(c.name);else{c.cleanGroup();var b=r.next(this.opt.areas?"area":"line",[this.opt,c],!0),e=c.group,g,d=dojo.map(o,function(a,
c){return{x:v(c+1)+i.l,y:h.height-i.b-w(a)}},this),f=this.opt.tension?l.curve(d,this.opt.tension):"";if(this.opt.areas)a=dojo.clone(d),this.opt.tension?(a=l.curve(a,this.opt.tension),a+=" L"+d[d.length-1].x+","+(h.height-i.b)+" L"+d[0].x+","+(h.height-i.b)+" L"+d[0].x+","+d[0].y,c.dyn.fill=e.createPath(a).setFill(b.series.fill).getFill()):(a.push({x:d[d.length-1].x,y:h.height-i.b}),a.push({x:d[0].x,y:h.height-i.b}),a.push(d[0]),c.dyn.fill=e.createPolyline(a).setFill(b.series.fill).getFill());if((this.opt.lines||
this.opt.markers)&&b.series.outline)g=l.makeStroke(b.series.outline),g.width=2*g.width+b.series.stroke.width;if(this.opt.markers)c.dyn.marker=b.symbol;var m,p,q;if(b.series.shadow&&b.series.stroke){var k=b.series.shadow,a=dojo.map(d,function(a){return{x:a.x+k.dx,y:a.y+k.dy}});if(this.opt.lines)c.dyn.shadow=this.opt.tension?e.createPath(l.curve(a,this.opt.tension)).setStroke(k).getStroke():e.createPolyline(a).setStroke(k).getStroke();if(this.opt.markers)k=b.marker.shadow,q=dojo.map(a,function(a){return e.createPath("M"+
a.x+" "+a.y+" "+b.symbol).setStroke(k).setFill(k.color)},this)}if(this.opt.lines){if(g)c.dyn.outline=this.opt.tension?e.createPath(f).setStroke(g).getStroke():e.createPolyline(d).setStroke(g).getStroke();c.dyn.stroke=this.opt.tension?e.createPath(f).setStroke(b.series.stroke).getStroke():e.createPolyline(d).setStroke(b.series.stroke).getStroke()}if(this.opt.markers){m=Array(d.length);p=Array(d.length);g=null;if(b.marker.outline)g=l.makeStroke(b.marker.outline),g.width=2*g.width+(b.marker.stroke?b.marker.stroke.width:
0);dojo.forEach(d,function(a,c){var d="M"+a.x+" "+a.y+" "+b.symbol;g&&(p[c]=e.createPath(d).setStroke(g));m[c]=e.createPath(d).setStroke(b.marker.stroke).setFill(b.marker.fill)},this);if(u){var s=Array(m.length);dojo.forEach(m,function(a,b){var e={element:"marker",index:b,run:c,shape:a,outline:p[b]||null,shadow:q&&q[b]||null,cx:d[b].x,cy:d[b].y,x:b+1,y:c.data[b]};this._connectEvents(e);s[b]=e},this);this._eventSeries[c.name]=s}else delete this._eventSeries[c.name]}c.dirty=!1;for(f=0;f<c.data.length;++f)a=
c.data[f],a!==null&&(isNaN(a)&&(a=0),o[f]-=a)}this.dirty=!1;return this}})}());