/*
CalDavZAP - the open source CalDAV Web Client
Copyright (C) 2011-2014
    Jan Mate <jan.mate@inf-it.com>
    Andrej Lezo <andrej.lezo@inf-it.com>
    Matej Mihalik <matej.mihalik@inf-it.com>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

// Used to match XML element names with any namespace
jQuery.fn.filterNsNode=function(nameOrRegex)
{
	return this.filter(
		function()
		{
			if(nameOrRegex instanceof RegExp)
				return (this.nodeName.match(nameOrRegex) || this.nodeName.replace(RegExp('^[^:]+:',''),'').match(nameOrRegex));
			else
				return (this.nodeName===nameOrRegex || this.nodeName.replace(RegExp('^[^:]+:',''),'')===nameOrRegex);
		}
	);
};

// Escape jQuery selector
function jqueryEscapeSelector(inputValue)
{
	return (inputValue==undefined ? '' : inputValue).toString().replace(/([ !"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g,'\\$1');
}

// Generate random string (UID)
function generateUID()
{
	uidChars='0123456789abcdefghijklmnopqrstuvwxyz';
	UID='';
	for(i=0;i<32;i++)
	{
		if(i==8 || i==12 || i==16 || i==20) UID+='-';
		UID+=uidChars.charAt(Math.floor(Math.random()*(uidChars.length-1)));
	}
	return UID;
}


// IE compatibility
if (typeof window.btoa=='undefined' && typeof base64.encode!='undefined') window.btoa=base64.encode;

// Create Basic auth string (for HTTP header)
function basicAuth(user, password)
{
	var tok=user+':'+password;
	var hash=btoa(tok);
	return 'Basic '+hash;
}

// multiply regex replace {'regex': value, 'regex': value}
String.prototype.multiReplace=function(hash)
{
	var str=this, key;
	for(key in hash)
		str=str.replace(new RegExp(key,'g'), hash[key]);
	return str;
};

// Used for sorting the contact and resource list ...
String.prototype.customCompare=function(stringB, alphabet, dir, caseSensitive)
{
	var stringA=this;

	if(alphabet==undefined || alphabet==null)
		return stringA.localeCompare(stringB);
	else
	{
		var pos=0,
		min=Math.min(stringA.length, stringB.length);
		dir=dir || 1;
		caseSensitive=caseSensitive || false;
		if(!caseSensitive)
		{
			stringA=stringA.toLowerCase();
			stringB=stringB.toLowerCase();
		}
		while(stringA.charAt(pos)===stringB.charAt(pos) && pos<min){pos++;}

		if(stringA.charAt(pos)=='')
			return -dir;
		else
		{
			var index1=alphabet.indexOf(stringA.charAt(pos));
			var index2=alphabet.indexOf(stringB.charAt(pos));

			if(index1==-1 || index2==-1)
				return stringA.localeCompare(stringB);
			else
				return (index1<index2 ? -dir : dir);
		}
	}
}

function customResourceCompare(objA, objB)
{
	return objA.displayValue.customCompare(objB.displayValue, globalSortAlphabet, 1, false);
}

function checkColorBrightness(hex)
{
	var R=parseInt(hex.substring(0, 2), 16);
	var G=parseInt(hex.substring(2, 4), 16);
	var B=parseInt(hex.substring(4, 6), 16);
	return Math.sqrt(0.241*R*R+0.691*G*G+0.068*B*B);
}

// Get unique values from array
Array.prototype.unique=function()
{
	var o={}, i, l=this.length, r=[];
	for(i=0;i<l;i++)
		o[this[i]]=this[i];
	for(i in o)
		r.push(o[i]);
	return r;
};

// Recursive replaceAll
String.prototype.replaceAll=function(stringToFind,stringToReplace)
{
	var temp=this;
	while(temp.indexOf(stringToFind)!=-1)
		temp=temp.replace(stringToFind,stringToReplace);
	return temp;
}

// Pad number with leading zeroes
Number.prototype.pad=function(size){
	var s=String(this);
	while(s.length<size)
		s='0'+s;
	return s;
}

// Case insensitive search for attributes
// Usage:	$('#selector').find(':attrCaseInsensitive(data-type,"'+typeList[i]+'")')
jQuery.expr[':'].attrCaseInsensitive=function(elem, index, match)
{
	var matchParams=match[3].split(','),
		attribute=matchParams[0].replace(/^\s*|\s*$/g,''),
		value=matchParams[1].replace(/^\s*"|"\s*$/g,'').toLowerCase();
	return jQuery(elem)['attr'](attribute)!=undefined && jQuery(elem)['attr'](attribute)==value;
}

// Capitalize given string
function capitalize(string)
{
	return string.charAt(0).toUpperCase()+string.slice(1).toLowerCase();
}

function hexToRgb(hex, transparency) {
	var bigint=parseInt(hex.substring(1), 16);
	var r=(bigint >> 16) & 255;
	var g=(bigint >> 8) & 255;
	var b=bigint & 255;

	return 'rgba('+r+','+g+','+b+','+transparency+')';
}

function dataGetChecked(resourceListSelector)
{
	var checkedArr=$(resourceListSelector).find('input[type=checkbox]:visible:checked').filter('[data-id]').filter(function(){return this.indeterminate==false}).map(function(){return $(this).attr('data-id')}).get();

	for(i=checkedArr.length-1; i>=0; i--)
		if(checkedArr[i].match(new RegExp('[^/]$'))!=null && checkedArr.indexOf(checkedArr[i].replace(new RegExp('[^/]+$'), ''))!=-1)
			checkedArr.splice(i, 1);

	return checkedArr;
}

function resourceChBoxClick(obj, resourceListSelector, headerSelector, returnChecked)
{
	$(obj).parent().nextUntil(headerSelector).find('input[type=checkbox]:visible').prop('checked', $(obj).prop('checked')).prop('indeterminate', false);
	if(returnChecked)
		return dataGetChecked(resourceListSelector);
}

function collectionChBoxClick(obj, resourceListSelector, headerSelector, collectionSelector, groupSelector, returnChecked)
{
	if(collectionSelector.match('_item$'))
	{
		var tmp_coh=$(obj).parent().prevAll(headerSelector).first();
		var tmp_co_chbxs=tmp_coh.nextUntil(headerSelector).find('input[type=checkbox]:visible');
	}
	else
	{
		var tmp_coh=$(obj).parent().parent().prevAll(headerSelector).first();
		var tmp_co_chbxs=tmp_coh.nextUntil(headerSelector).find(collectionSelector).find('input[type=checkbox]:visible');
	}

	if(groupSelector!=null)
	{
		if($(obj).prop('checked')==false && $(obj).prop('indeterminate')==false && $(obj).attr('data-ind')=='false' &&
		$(obj).parent().next(groupSelector).height()>0/* note: ':visible' is not working! */)
		{
			$(obj).prop('indeterminate', true);
			$(obj).prop('checked', true);
			$(obj).attr('data-ind', 'true');
			tmp_coh.find('input[type=checkbox]:visible').prop('indeterminate', true).prop('checked', false);

			if(returnChecked)
				return dataGetChecked(resourceListSelector);
			return true;
		}
		else if($(obj).attr('data-ind')=='true')
			$(obj).attr('data-ind', 'false');

		$(obj).parent().next(groupSelector).find('input[type=checkbox]').prop('checked', $(obj).prop('checked'));
	}

	if(tmp_co_chbxs.length==tmp_co_chbxs.filter(':checked').length)
		tmp_coh.find('input[type=checkbox]:visible').prop('checked', true).prop('indeterminate', false);
	else if(tmp_co_chbxs.filter(':checked').length==0 && tmp_co_chbxs.filter(function(){return this.indeterminate==true}).length==0)
		tmp_coh.find('input[type=checkbox]:visible').prop('checked', false).prop('indeterminate', false);
	else
		tmp_coh.find('input[type=checkbox]:visible').prop('indeterminate', true).prop('checked', false);

	if(returnChecked)
		return dataGetChecked(resourceListSelector);
}

function groupChBoxClick(obj, resourceListSelector, headerSelector, collectionSelector, groupSelector, returnChecked)
{
	var tmp_cg=$(obj).closest(groupSelector);
	var tmp_cg_chbxs=tmp_cg.find('input[type=checkbox]:visible');
	var tmp_co_chbxs=tmp_cg.prev().find('input[type=checkbox]:visible');

	if(tmp_cg_chbxs.filter(':checked').length==0)
		tmp_co_chbxs.prop('checked', false).prop('indeterminate', false);
	else
		tmp_co_chbxs.prop('indeterminate', true).prop('checked', false);

	return collectionChBoxClick(tmp_co_chbxs, resourceListSelector, headerSelector, collectionSelector, null, returnChecked);
}

// Escape vCalendar value - RFC2426 (Section 2.4.2)
function vcalendarEscapeValue(inputValue)
{
	return (inputValue==undefined ? '' : inputValue).replace(vCalendar.pre['escapeRex'],"\\$1").replace(vCalendar.pre['escapeRex2'],'\\n');
}

// Unescape vCalendar value - RFC2426 (Section 2.4.2)
function vcalendarUnescapeValue(inputValue)
{
	var outputValue='';

	if(inputValue!=undefined)
	{
		for(var i=0;i<inputValue.length;i++)
			if(inputValue[i]=='\\' && i+1<inputValue.length)
			{
				if(inputValue[++i]=='n')
					outputValue+='\n';
				else
					outputValue+=inputValue[i];
			}
			else
				outputValue+=inputValue[i];
	}
	return outputValue;
}

// Split parameters and remove double quotes from values (if parameter values are quoted)
function vcalendarSplitParam(inputValue)
{
	var result=vcalendarSplitValue(inputValue, ';');
	var index;

	for(var i=0;i<result.length;i++)
	{
		index=result[i].indexOf('=');
		if(index!=-1 && index+1<result[i].length && result[i][index+1]=='"' && result[i][result[i].length-1]=='"')
			result[i]=result[i].substring(0,index+1)+result[i].substring(index+2,result[i].length-1);
	}
	return result;
}

// Split string by separator (but not '\' escaped separator)
function vcalendarSplitValue(inputValue, inputDelimiter)
{
	var outputArray=new Array();
	var i=0;
	var j=0;

	for(i=0;i<inputValue.length;i++)
	{
		if(inputValue[i]==inputDelimiter)
		{
			if(outputArray[j]==undefined)
				outputArray[j]='';
			++j;
			continue;
		}
		outputArray[j]=(outputArray[j]==undefined ? '' : outputArray[j])+inputValue[i];
		if(inputValue[i]=='\\' && i+1<inputValue.length)
			outputArray[j]=outputArray[j]+inputValue[++i];
	}
	return outputArray;
}
