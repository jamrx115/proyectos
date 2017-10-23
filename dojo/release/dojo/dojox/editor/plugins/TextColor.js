/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


dojo._hasResource["dojox.editor.plugins.TextColor"]||(dojo._hasResource["dojox.editor.plugins.TextColor"]=!0,dojo.provide("dojox.editor.plugins.TextColor"),dojo.require("dijit.TooltipDialog"),dojo.require("dijit.form.Button"),dojo.require("dijit._editor._Plugin"),dojo.require("dojox.widget.ColorPicker"),dojo.require("dojo.i18n"),dojo.requireLocalization("dojox.editor.plugins","TextColor",null,"ROOT,ar,ca,cs,da,de,el,es,fi,fr,he,hu,it,ja,kk,ko,nb,nl,pl,pt,pt-pt,ro,ru,sk,sl,sv,th,tr,zh,zh-tw"),dojo.experimental("dojox.editor.plugins.TextColor"),
dojo.declare("dojox.editor.plugins._TextColorDropDown",[dijit._Widget,dijit._Templated],{templateString:"<div style='display: none; position: absolute; top: -10000; z-index: -10000'><div dojoType='dijit.TooltipDialog' dojoAttachPoint='dialog' class='dojoxEditorColorPicker'><div dojoType='dojox.widget.ColorPicker' dojoAttachPoint='_colorPicker'></div><br><center><button dojoType='dijit.form.Button' type='button' dojoAttachPoint='_setButton'>${setButtonText}</button>&nbsp;<button dojoType='dijit.form.Button' type='button' dojoAttachPoint='_cancelButton'>${cancelButtonText}</button></center></div></div>",
widgetsInTemplate:!0,constructor:function(){var b=dojo.i18n.getLocalization("dojox.editor.plugins","TextColor");dojo.mixin(this,b)},startup:function(){this._started||(this.inherited(arguments),this.connect(this._setButton,"onClick",dojo.hitch(this,function(){this.onChange(this.get("value"))})),this.connect(this._cancelButton,"onClick",dojo.hitch(this,function(){dijit.popup.close(this.dialog);this.onCancel()})),dojo.style(this.domNode,"display","block"))},_setValueAttr:function(b,c){this._colorPicker.set("value",
b,c)},_getValueAttr:function(){return this._colorPicker.get("value")},onChange:function(){},onCancel:function(){}}),dojo.declare("dojox.editor.plugins.TextColor",dijit._editor._Plugin,{buttonClass:dijit.form.DropDownButton,useDefaultCommand:!1,constructor:function(){this._picker=new dojox.editor.plugins._TextColorDropDown;dojo.body().appendChild(this._picker.domNode);this._picker.startup();this.dropDown=this._picker.dialog;this.connect(this._picker,"onChange",function(b){this.editor.execCommand(this.command,
b)});this.connect(this._picker,"onCancel",function(){this.editor.focus()})},updateState:function(){var b=this.editor,c=this.command;if(b&&b.isLoaded&&c.length){var d=this.get("disabled"),a;if(this.button){this.button.set("disabled",d);if(d)return;try{a=b.queryCommandValue(c)||""}catch(e){a=""}}a==""&&(a="#000000");a=="transparent"&&(a="#ffffff");typeof a=="string"?a.indexOf("rgb")>-1&&(a=dojo.colorFromRgb(a).toHex()):(a=((a&255)<<16|a&65280|(a&16711680)>>>16).toString(16),a="#000000".slice(0,7-a.length)+
a);a!==this._picker.get("value")&&this._picker.set("value",a,!1)}},destroy:function(){this.inherited(arguments);this._picker.destroyRecursive();delete this._picker}}),dojo.subscribe(dijit._scopeName+".Editor.getPlugin",null,function(b){if(!b.plugin)switch(b.args.name){case "foreColor":case "hiliteColor":b.plugin=new dojox.editor.plugins.TextColor({command:b.args.name})}}));