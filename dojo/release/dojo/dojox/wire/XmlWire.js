/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


dojo._hasResource["dojox.wire.XmlWire"]||(dojo._hasResource["dojox.wire.XmlWire"]=!0,dojo.provide("dojox.wire.XmlWire"),dojo.require("dojox.xml.parser"),dojo.require("dojox.wire.Wire"),dojo.declare("dojox.wire.XmlWire",dojox.wire.Wire,{_wireClass:"dojox.wire.XmlWire",constructor:function(){},_getValue:function(b){if(!b||!this.path)return b;var c=this.path,a;c.charAt(0)=="/"&&(a=c.indexOf("/",1),c=c.substring(a+1));var c=c.split("/"),d=c.length-1;for(a=0;a<d;a++)if(b=this._getChildNode(b,c[a]),!b)return;
return this._getNodeValue(b,c[d])},_setValue:function(b,c){if(!this.path)return b;var a=b,d=this._getDocument(a),e=this.path,f;if(e.charAt(0)=="/")f=e.indexOf("/",1),a||(a=e.substring(1,f),b=a=d.createElement(a)),e=e.substring(f+1);else if(!a)return;var e=e.split("/"),h=e.length-1;for(f=0;f<h;f++){var g=this._getChildNode(a,e[f]);g||(g=d.createElement(e[f]),a.appendChild(g));a=g}this._setNodeValue(a,e[h],c);return b},_getNodeValue:function(b,c){var a=void 0;if(c.charAt(0)=="@")a=c.substring(1),a=
b.getAttribute(a);else if(c=="text()"){var d=b.firstChild;if(d)a=d.nodeValue}else{a=[];for(d=0;d<b.childNodes.length;d++){var e=b.childNodes[d];e.nodeType===1&&e.nodeName==c&&a.push(e)}}return a},_setNodeValue:function(b,c,a){if(c.charAt(0)=="@")c=c.substring(1),a?b.setAttribute(c,a):b.removeAttribute(c);else if(c=="text()"){for(;b.firstChild;)b.removeChild(b.firstChild);a&&(a=this._getDocument(b).createTextNode(a),b.appendChild(a))}},_getChildNode:function(b,c){var a=1,d=c.indexOf("[");d>=0&&(a=
c.indexOf("]"),a=c.substring(d+1,a),c=c.substring(0,d));for(var d=1,e=0;e<b.childNodes.length;e++){var f=b.childNodes[e];if(f.nodeType===1&&f.nodeName==c){if(d==a)return f;d++}}return null},_getDocument:function(b){return b?b.nodeType==9?b:b.ownerDocument:dojox.xml.parser.parse()}}));