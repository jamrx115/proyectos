/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dojox.date.posix"])dojo._hasResource["dojox.date.posix"]=!0,dojo.provide("dojox.date.posix"),dojo.require("dojo.date"),dojo.require("dojo.date.locale"),dojo.require("dojo.string"),dojox.date.posix.strftime=function(a,b,f){for(var c=null,d=function(a,b){return dojo.string.pad(a,b||2,c||"0")},n=dojo.date.locale._getGregorianBundle(f),e=function(b){switch(b){case "a":return dojo.date.locale.getNames("days","abbr","format",f)[a.getDay()];case "A":return dojo.date.locale.getNames("days",
"wide","format",f)[a.getDay()];case "b":case "h":return dojo.date.locale.getNames("months","abbr","format",f)[a.getMonth()];case "B":return dojo.date.locale.getNames("months","wide","format",f)[a.getMonth()];case "c":return dojo.date.locale.format(a,{formatLength:"full",locale:f});case "C":return d(Math.floor(a.getFullYear()/100));case "d":return d(a.getDate());case "D":return e("m")+"/"+e("d")+"/"+e("y");case "e":return c==null&&(c=" "),d(a.getDate());case "f":return c==null&&(c=" "),d(a.getMonth()+
1);case "G":dojo.unimplemented("unimplemented modifier 'G'");break;case "F":return e("Y")+"-"+e("m")+"-"+e("d");case "H":return d(a.getHours());case "I":return d(a.getHours()%12||12);case "j":return d(dojo.date.locale._getDayOfYear(a),3);case "k":return c==null&&(c=" "),d(a.getHours());case "l":return c==null&&(c=" "),d(a.getHours()%12||12);case "m":return d(a.getMonth()+1);case "M":return d(a.getMinutes());case "n":return"\n";case "p":return n["dayPeriods-format-wide-"+(a.getHours()<12?"am":"pm")];
case "r":return e("I")+":"+e("M")+":"+e("S")+" "+e("p");case "R":return e("H")+":"+e("M");case "S":return d(a.getSeconds());case "t":return"\t";case "T":return e("H")+":"+e("M")+":"+e("S");case "u":return String(a.getDay()||7);case "U":return d(dojo.date.locale._getWeekOfYear(a));case "V":return d(dojox.date.posix.getIsoWeekOfYear(a));case "W":return d(dojo.date.locale._getWeekOfYear(a,1));case "w":return String(a.getDay());case "x":return dojo.date.locale.format(a,{selector:"date",formatLength:"full",
locale:f});case "X":return dojo.date.locale.format(a,{selector:"time",formatLength:"full",locale:f});case "y":return d(a.getFullYear()%100);case "Y":return String(a.getFullYear());case "z":return b=a.getTimezoneOffset(),(b>0?"-":"+")+d(Math.floor(Math.abs(b)/60))+":"+d(Math.abs(b)%60);case "Z":return dojo.date.getTimezoneName(a);case "%":return"%"}},j="",g=0,i=0,h=null;(i=b.indexOf("%",g))!=-1;){j+=b.substring(g,i++);switch(b.charAt(i++)){case "_":c=" ";break;case "-":c="";break;case "0":c="0";break;
case "^":h="upper";break;case "*":h="lower";break;case "#":h="swap";break;default:c=null,i--}g=e(b.charAt(i++));switch(h){case "upper":g=g.toUpperCase();break;case "lower":g=g.toLowerCase();break;case "swap":for(var h=g.toLowerCase(),m="",k="",l=0;l<g.length;l++)k=g.charAt(l),m+=k==h.charAt(l)?k.toUpperCase():k.toLowerCase();g=m}h=null;j+=g;g=i}j+=b.substring(g);return j},dojox.date.posix.getStartOfWeek=function(a,b){isNaN(b)&&(b=dojo.cldr.supplemental.getFirstDayOfWeek?dojo.cldr.supplemental.getFirstDayOfWeek():
0);var f=b;f-=a.getDay()>=b?a.getDay():7-a.getDay();var c=new Date(a);c.setHours(0,0,0,0);return dojo.date.add(c,"day",f)},dojox.date.posix.setIsoWeekOfYear=function(a,b){if(!b)return a;var f=dojox.date.posix.getIsoWeekOfYear(a),c=b-f;b<0&&(c=dojox.date.posix.getIsoWeeksInYear(a)+b+1-f);return dojo.date.add(a,"week",c)},dojox.date.posix.getIsoWeekOfYear=function(a){var b=dojox.date.posix.getStartOfWeek(a,1),a=new Date(a.getFullYear(),0,4),a=dojox.date.posix.getStartOfWeek(a,1),a=b.getTime()-a.getTime();
return a<0?dojox.date.posix.getIsoWeeksInYear(b):Math.ceil(a/6048E5)+1},dojox.date.posix.getIsoWeeksInYear=function(a){function b(a){return a+Math.floor(a/4)-Math.floor(a/100)+Math.floor(a/400)}a=a.getFullYear();return b(a)%7==4||b(a-1)%7==3?53:52};