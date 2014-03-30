/*
CalDavZAP - the open source CalDAV Web Client
Copyright (C) 2011-2013
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
		return (stringA.charAt(pos)=='' || alphabet.indexOf(stringA.charAt(pos))<alphabet.indexOf(stringB.charAt(pos))) ? -dir : dir;
	}
}

function customResourceCompare(objA, objB)
{
	return objA.displayValue.customCompare(objB.displayValue, globalSortAlphabet, 1, false);
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
// Usage:	$('[id=vcard_editor]').find(':attrCaseInsensitive(data-type,"'+typeList[i]+'")')
jQuery.expr[':'].attrCaseInsensitive=function(elem, index, match)
{
	var matchParams=match[3].split(','),
		attribute=matchParams[0].replace(/^\s*|\s*$/g,''),
		value=matchParams[1].replace(/^\s*"|"\s*$/g,'').toLowerCase();
	return jQuery(elem)['attr'](attribute)!=undefined && jQuery(elem)['attr'](attribute)==value;
}

// Escape vCalendar value - RFC2426 (Section 2.4.2)
function vcalendarEscapeValue(inputValue)
{
	return (inputValue==undefined ? '' : inputValue).replace(/(,|;|\\)/g,"\\$1").replace(/\n/g,'\\n');
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
