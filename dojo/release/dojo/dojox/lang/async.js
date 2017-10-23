/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


dojo._hasResource["dojox.lang.async"]||(dojo._hasResource["dojox.lang.async"]=!0,dojo.provide("dojox.lang.async"),function(){var d=dojo,e=d.Deferred,h=d.forEach,k=d.some,d=dojox.lang.async,l=Array.prototype.slice,j=Object.prototype.toString;d.seq=function(a){var c=j.call(a)=="[object Array]"?a:arguments;return function(a){var b=new e;h(c,function(a){b.addCallback(a)});b.callback(a);return b}};d.par=function(a){var c=j.call(a)=="[object Array]"?a:arguments;return function(a){var b=Array(c.length),
f=function(){h(b,function(a){a instanceof e&&a.fired<0&&a.cancel()})},g=new e(f),i=c.length;h(c,function(m,i){var g;try{g=m(a)}catch(c){g=c}b[i]=g});k(b,function(a){return a instanceof Error?(f(),g.errback(a),!0):!1})||h(b,function(a,c){a instanceof e?a.addCallbacks(function(a){b[c]=a;--i||g.callback(b)},function(a){f();g.errback(a)}):--i});i||g.callback(b);return g}};d.any=function(a){var c=j.call(a)=="[object Array]"?a:arguments;return function(d){var b=Array(c.length),f=!0;cancel=function(a){h(b,
function(b,c){c!=a&&b instanceof e&&b.fired<0&&b.cancel()})};a=new e(cancel);h(c,function(a,c){var f;try{f=a(d)}catch(e){f=e}b[c]=f});k(b,function(b,c){return!(b instanceof e)?(cancel(c),a.callback(b),!0):!1})||h(b,function(b,c){b.addBoth(function(b){f&&(f=!1,cancel(c),a.callback(b))})});return a}};d.select=function(a,c){var d=j.call(c)=="[object Array]"?c:l.call(arguments,1);return function(b){return(new e).addCallback(a).addCallback(function(a){return typeof a=="number"&&a>=0&&a<d.length?d[a](b):
Error("async.select: out of range")}).callback(b)}};d.ifThen=function(a,c,d){return function(b){return(new e).addCallback(a).addCallback(function(a){return(a?c:d)(b)}).callback(b)}};d.loop=function(a,c){return function(d){function b(a){h.errback(a)}function f(a){a?i.addCallback(c).addCallback(g):h.callback(a);return a}function g(c){i=(new e).addCallback(a).addCallback(f).addErrback(b);i.callback(c)}var i,h=new e(function(){i.cancel()});g(d);return h}}}());