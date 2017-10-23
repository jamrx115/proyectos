/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dijit._Templated"])dojo._hasResource["dijit._Templated"]=!0,dojo.provide("dijit._Templated"),dojo.require("dijit._Widget"),dojo.require("dojo.string"),dojo.require("dojo.parser"),dojo.require("dojo.cache"),dojo.declare("dijit._Templated",null,{templateString:null,templatePath:null,widgetsInTemplate:!1,_skipNodeCache:!1,_earlyTemplatedStartup:!1,constructor:function(){this._attachPoints=[];this._attachEvents=[]},_stringRepl:function(a){var b=this.declaredClass,e=this;return dojo.string.substitute(a,
this,function(a,d){d.charAt(0)=="!"&&(a=dojo.getObject(d.substr(1),!1,e));if(typeof a=="undefined")throw Error(b+" template:"+d);return a==null?"":d.charAt(0)=="!"?a:a.toString().replace(/"/g,"&quot;")},this)},buildRendering:function(){var a=dijit._Templated.getCachedTemplate(this.templatePath,this.templateString,this._skipNodeCache),b;if(dojo.isString(a)){if(b=dojo._toDom(this._stringRepl(a)),b.nodeType!=1)throw Error("Invalid template: "+a);}else b=a.cloneNode(!0);this.domNode=b;this.inherited(arguments);
this._attachTemplateNodes(b);if(this.widgetsInTemplate)a=this._startupWidgets=dojo.parser.parse(b,{noStart:!this._earlyTemplatedStartup,template:!0,inherited:{dir:this.dir,lang:this.lang},propsThis:this,scope:"dojo"}),this._supportingWidgets=dijit.findWidgets(b),this._attachTemplateNodes(a,function(a,b){return a[b]});this._fillContent(this.srcNodeRef)},_fillContent:function(a){var b=this.containerNode;if(a&&b)for(;a.hasChildNodes();)b.appendChild(a.firstChild)},_attachTemplateNodes:function(a,b){for(var b=
b||function(a,b){return a.getAttribute(b)},e=dojo.isArray(a)?a:a.all||a.getElementsByTagName("*"),f=dojo.isArray(a)?0:-1;f<e.length;f++){var d=f==-1?a:e[f];if(!this.widgetsInTemplate||!b(d,"dojoType")&&!b(d,"data-dojo-type")){var c=b(d,"dojoAttachPoint")||b(d,"data-dojo-attach-point");if(c)for(var h=c.split(/\s*,\s*/);c=h.shift();)dojo.isArray(this[c])?this[c].push(d):this[c]=d,this._attachPoints.push(c);if(c=b(d,"dojoAttachEvent")||b(d,"data-dojo-attach-event"))for(var h=c.split(/\s*,\s*/),i=dojo.trim;c=
h.shift();)if(c){var g=null;c.indexOf(":")!=-1?(g=c.split(":"),c=i(g[0]),g=i(g[1])):c=i(c);g||(g=c);this._attachEvents.push(this.connect(d,c,g))}(c=b(d,"waiRole"))&&dijit.setWaiRole(d,c);(c=b(d,"waiState"))&&dojo.forEach(c.split(/\s*,\s*/),function(a){a.indexOf("-")!=-1&&(a=a.split("-"),dijit.setWaiState(d,a[0],a[1]))})}}},startup:function(){dojo.forEach(this._startupWidgets,function(a){a&&!a._started&&a.startup&&a.startup()});this.inherited(arguments)},destroyRendering:function(){dojo.forEach(this._attachPoints,
function(a){delete this[a]},this);this._attachPoints=[];dojo.forEach(this._attachEvents,this.disconnect,this);this._attachEvents=[];this.inherited(arguments)}}),dijit._Templated._templateCache={},dijit._Templated.getCachedTemplate=function(a,b,e){var f=dijit._Templated._templateCache,d=b||a,c=f[d];if(c){try{if(!c.ownerDocument||c.ownerDocument==dojo.doc)return c}catch(h){}dojo.destroy(c)}b||(b=dojo.cache(a,{sanitize:!0}));b=dojo.string.trim(b);if(e||b.match(/\$\{([^\}]+)\}/g))return f[d]=b;else{a=
dojo._toDom(b);if(a.nodeType!=1)throw Error("Invalid template: "+b);return f[d]=a}},dojo.isIE&&dojo.addOnWindowUnload(function(){var a=dijit._Templated._templateCache,b;for(b in a){var e=a[b];typeof e=="object"&&dojo.destroy(e);delete a[b]}}),dojo.extend(dijit._Widget,{dojoAttachEvent:"",dojoAttachPoint:"",waiRole:"",waiState:""});