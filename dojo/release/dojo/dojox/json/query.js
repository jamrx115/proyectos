/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


dojo._hasResource["dojox.json.query"]||(dojo._hasResource["dojox.json.query"]=!0,dojo.provide("dojox.json.query"),function(){dojox.json._slice=function(b,c,d,f){for(var a=b.length,g=[],d=d||a,c=c<0?Math.max(0,c+a):Math.min(a,c),d=d<0?Math.max(0,d+a):Math.min(a,d);c<d;c+=f)g.push(b[c]);return g};dojox.json._find=function(b,c){function d(a){c&&(c===!0&&!(a instanceof Array)?f.push(a):a[c]&&f.push(a[c]));for(var b in a){var h=a[b];c?h&&typeof h=="object"&&d(h):f.push(h)}}var f=[];if(c instanceof Array){if(c.length==
1)return b[c[0]];for(var a=0;a<c.length;a++)f.push(b[c[a]])}else d(b);return f};dojox.json._distinctFilter=function(b,c){for(var d=[],f={},a=0,g=b.length;a<g;++a){var e=b[a];if(c(e,a,b))if(typeof e=="object"&&e){if(!e.__included)e.__included=!0,d.push(e)}else f[e+typeof e]||(f[e+typeof e]=!0,d.push(e))}a=0;for(g=d.length;a<g;++a)d[a]&&delete d[a].__included;return d};dojox.json.query=function(b,c){function d(i){e=i+"("+e}function f(i,a,b,c,d,e,f,h){return g[h].match(/[\*\?]/)||f=="~"?"/^"+g[h].substring(1,
g[h].length-1).replace(/\\([btnfr\\"'])|([^\w\*\?])/g,"\\$1$2").replace(/([\*\?])/g,"[\\w\\W]$1")+(f=="~"?"$/i":"$/")+".test("+a+")":i}var a=0,g=[],b=b.replace(/"(\\.|[^"\\])*"|'(\\.|[^'\\])*'|[\[\]]/g,function(i){a+=i=="["?1:i=="]"?-1:0;return i=="]"&&a>0?"`]":i.charAt(0)=='"'||i.charAt(0)=="'"?"`"+(g.push(i)-1):i}),e="";b.replace(/(\]|\)|push|pop|shift|splice|sort|reverse)\s*\(/,function(){throw Error("Unsafe function call");});for(var b=b.replace(/([^=]=)([^=])/g,"$1=$2").replace(/@|(\.\s*)?[a-zA-Z\$_]+(\s*:)?/g,
function(a){return a.charAt(0)=="."?a:a=="@"?"$obj":(a.match(/:|^(\$|Math|true|false|null)$/)?"":"$obj.")+a}).replace(/\.?\.?\[(`\]|[^\]])*\]|\?.*|\.\.([\w\$_]+)|\.\*/g,function(a,b,c){return(b=a.match(/^\.?\.?(\[\s*\^?\?|\^?\?|\[\s*==)(.*?)\]?$/))?(c="",a.match(/^\./)&&(d("dojox.json._find"),c=",true)"),d(b[1].match(/\=/)?"dojo.map":b[1].match(/\^/)?"dojox.json._distinctFilter":"dojo.filter"),c+",function($obj){return "+b[2]+"})"):(b=a.match(/^\[\s*([\/\\].*)\]/))?".concat().sort(function(a,b){"+
b[1].replace(/\s*,?\s*([\/\\])\s*([^,\\\/]+)/g,function(a,b,c){return"var av= "+c.replace(/\$obj/,"a")+",bv= "+c.replace(/\$obj/,"b")+";if(av>bv||bv==null){return "+(b=="/"?1:-1)+";}\nif(bv>av||av==null){return "+(b=="/"?-1:1)+";}\n"})+"return 0;})":(b=a.match(/^\[(-?[0-9]*):(-?[0-9]*):?(-?[0-9]*)\]/))?(d("dojox.json._slice"),","+(b[1]||0)+","+(b[2]||0)+","+(b[3]||1)+")"):a.match(/^\.\.|\.\*|\[\s*\*\s*\]|,/)?(d("dojox.json._find"),(a.charAt(1)=="."?",'"+c+"'":a.match(/,/)?","+a:"")+")"):a}).replace(/(\$obj\s*((\.\s*[\w_$]+\s*)|(\[\s*`([0-9]+)\s*`\]))*)(==|~)\s*`([0-9]+)/g,
f).replace(/`([0-9]+)\s*(==|~)\s*(\$obj\s*((\.\s*[\w_$]+)|(\[\s*`([0-9]+)\s*`\]))*)/g,function(a,b,c,d,e,g,h,j){return f(a,d,e,g,h,j,c,b)}),b=e+(b.charAt(0)=="$"?"":"$")+b.replace(/`([0-9]+|\])/g,function(a,b){return b=="]"?"]":g[b]}),h=eval("1&&function($,$1,$2,$3,$4,$5,$6,$7,$8,$9){var $obj=$;return "+b+"}"),j=0;j<arguments.length-1;j++)arguments[j]=arguments[j+1];return c?h.apply(this,arguments):h}}());