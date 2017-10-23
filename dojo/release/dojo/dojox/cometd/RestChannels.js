/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


dojo._hasResource["dojox.cometd.RestChannels"]||(dojo._hasResource["dojox.cometd.RestChannels"]=!0,dojo.provide("dojox.cometd.RestChannels"),dojo.require("dojox.rpc.Client"),dojo.requireIf(dojox.data&&!!dojox.data.JsonRestStore,"dojox.data.restListener"),function(){dojo.declare("dojox.cometd.RestChannels",null,{constructor:function(a){dojo.mixin(this,a);if(dojox.rpc.Rest&&this.autoSubscribeRoot){var b=dojox.rpc.Rest._get,c=this;dojox.rpc.Rest._get=function(a,f){var d=dojo.xhrGet;dojo.xhrGet=function(a){var b=
c.autoSubscribeRoot;return b&&a.url.substring(0,b.length)==b?c.get(a.url,a):d(a)};var k=b.apply(this,arguments);dojo.xhrGet=d;return k}}},absoluteUrl:function(a,b){return new dojo._Url(a,b)+""},acceptType:"application/rest+json,application/http;q=0.9,*/*;q=0.7",subscriptions:{},subCallbacks:{},autoReconnectTime:3E3,reloadDataOnReconnect:!0,sendAsJson:!1,url:"/channels",autoSubscribeRoot:"/",open:function(){this.started=!0;if(!this.connected){this.connectionId=dojox.rpc.Client.clientId;var a=this.createdClientId?
"Client-Id":"Create-Client-Id";this.createdClientId=!0;var b={Accept:this.acceptType};b[a]=this.connectionId;var a=dojo.xhrPost({headers:b,url:this.url,noStatus:!0}),c=this;this.lastIndex=0;var e,f=function(a){if(typeof dojo=="undefined")return null;if(d&&d.status>400)return e(!0);typeof a=="string"&&(a=a.substring(c.lastIndex));var b=d&&(d.contentType||d.getResponseHeader("Content-Type"))||typeof a!="string"&&"already json";if((b=c.onprogress(d,a,b))&&e())return Error(b);if(!d||d.readyState==4)if(d=
null,c.connected)c.connected=!1,c.open();return a};e=function(a){if(d&&d.status==409)return console.log("multiple tabs/windows open, polling"),c.disconnected(),null;c.createdClientId=!1;c.disconnected();return a};a.addCallbacks(f,e);var d=a.ioArgs.xhr;if(d)d.onreadystatechange=function(){var a;try{if(d.readyState==3)c.readyState=3,a=d.responseText}catch(b){}typeof a=="string"&&f(a)};window.attachEvent&&window.attachEvent("onunload",function(){c.connected=!1;d&&d.abort()});this.connected=!0}},_send:function(a,
b,c){this.sendAsJson?(b.postData=dojo.toJson({target:b.url,method:a,content:c,params:b.content,subscribe:b.headers.Subscribe}),b.url=this.url,a="POST"):b.postData=dojo.toJson(c);return dojo.xhr(a,b,b.postData)},subscribe:function(a,b){b=b||{};b.url=this.absoluteUrl(this.url,a);b.headers&&delete b.headers.Range;var c=this.subscriptions[a],e=b.method||"HEAD",f=b.since,d=b.callback,g=b.headers||(b.headers={});this.subscriptions[a]=f||c||0;var j=this.subCallbacks[a];d&&(this.subCallbacks[a]=j?function(a){j(a);
d(a)}:d);this.connected||this.open();if(c===void 0||c!=f){g["Cache-Control"]="max-age=0";(f=typeof f=="number"?(new Date(f)).toUTCString():f)&&(g["Subscribe-Since"]=f);g.Subscribe=b.unsubscribe?"none":"*";var i=this._send(e,b),h=this;i.addBoth(function(c){var d=i.ioArgs.xhr;c instanceof Error||b.confirmation&&b.confirmation();if(d&&d.getResponseHeader("Subscribed")=="OK"){var e=d.getResponseHeader("Last-Modified");if(d.responseText)h.subscriptions[a]=e||(new Date).toUTCString();else return null}else d&&
!(c instanceof Error)&&delete h.subscriptions[a];if(c instanceof Error){if(h.subCallbacks[a])h.subCallbacks[a](d)}else if(e={responseText:d&&d.responseText,channel:a,getResponseHeader:function(a){return d.getResponseHeader(a)},getAllResponseHeaders:function(){return d.getAllResponseHeaders()},result:c},h.subCallbacks[a])h.subCallbacks[a](e);return c});return i}return null},publish:function(a,b){return this._send("POST",{url:a,contentType:"application/json"},b)},_processMessage:function(a){a.event=
a.event||a.getResponseHeader("Event");if(a.event=="connection-conflict")return"conflict";try{a.result=a.result||dojo.fromJson(a.responseText)}catch(b){}var c=this,e=a.channel=new dojo._Url(this.url,a.source||a.getResponseHeader("Content-Location"))+"";e in this.subscriptions&&a.getResponseHeader&&(this.subscriptions[e]=a.getResponseHeader("Last-Modified"));this.subCallbacks[e]&&setTimeout(function(){c.subCallbacks[e](a)},0);this.receive(a);return null},onprogress:function(a,b,c){if(!c||c.match(/application\/rest\+json/)){c=
b.length;b=b.replace(/^\s*[,\[]?/,"[").replace(/[,\]]?\s*$/,"]");try{var e=dojo.fromJson(b);this.lastIndex+=c}catch(f){}}else dojox.io&&dojox.io.httpParse&&c.match(/application\/http/)?(e="",a&&a.getAllResponseHeaders&&(e=a.getAllResponseHeaders()),e=dojox.io.httpParse(b,e,a.readyState!=4)):typeof b=="object"&&(e=b);if(e){for(a=0;a<e.length;a++)if(this._processMessage(e[a]))return"conflict";return null}if(!a)return"error";if(a.readyState!=4)return null;a.__proto__&&(a={channel:"channel",__proto__:a});
return this._processMessage(a)},get:function(a,b){(b=b||{}).method="GET";return this.subscribe(a,b)},receive:function(a){dojox.data&&dojox.data.restListener&&dojox.data.restListener(a)},disconnected:function(){var a=this;if(this.connected)this.connected=!1,this.started&&setTimeout(function(){var b=a.subscriptions;a.subscriptions={};for(var c in b)a.reloadDataOnReconnect&&dojox.rpc.JsonRest?(delete dojox.rpc.Rest._index[c],dojox.rpc.JsonRest.fetch(c)):a.subscribe(c,{since:b[c]});a.open()},this.autoReconnectTime)},
unsubscribe:function(a,b){b=b||{};b.unsubscribe=!0;this.subscribe(a,b)},disconnect:function(){this.started=!1;this.xhr.abort()}});var g=dojox.cometd.RestChannels.defaultInstance=new dojox.cometd.RestChannels;if(dojox.cometd.connectionTypes)g.startup=function(){g.open();this._cometd._deliver({channel:"/meta/connect",successful:!0})},g.check=function(a,b,c){for(b=0;b<a.length;b++)if(a[b]=="rest-channels")return!c;return!1},g.deliver=function(){},dojo.connect(this,"receive",null,function(a){a.data=a.result;
this._cometd._deliver(a)}),g.sendMessages=function(a){for(var b=0;b<a.length;b++){var c=a[b],e=c.channel,f=this._cometd,d={confirmation:function(){f._deliver({channel:e,successful:!0})}};e=="/meta/subscribe"?this.subscribe(c.subscription,d):e=="/meta/unsubscribe"?this.unsubscribe(c.subscription,d):e=="/meta/connect"?d.confirmation():e=="/meta/disconnect"?(g.disconnect(),d.confirmation()):e.substring(0,6)!="/meta/"&&this.publish(e,c.data)}},dojox.cometd.connectionTypes.register("rest-channels",g.check,
g,!1,!0)}());