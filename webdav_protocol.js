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

// VersionCheck (check for new version)
function netVersionCheck()
{
	$.ajax({
		type: 'GET',
		url: globalVersionCheckURL,
		cache: false,
		crossDomain: false,
		timeout: 30000,
		error: function(objAJAXRequest, strError){
			console.log("Error: [netVersionCheck: '"+globalVersionCheckURL+"'] code: '"+objAJAXRequest.status+"'");
			return false;
		},
		beforeSend: function(req) {
			req.setRequestHeader('X-client', globalXClientHeader);
		},
		contentType: 'text/xml; charset=utf-8',
		processData: true,
		data: '',
		dataType: 'xml',
		complete: function(xml, textStatus)
		{
			if(textStatus!='success')
				return false;

			var count=0;
			var tmp=$(xml.responseXML).find('updates').find(globalAppName.toLowerCase());
			var type=tmp.attr('type');
			var home=tmp.attr('homeURL');
			var version_txt=tmp.attr('version');

			if(type==undefined || type=='' || home==undefined || home=='' || version_txt==undefined || version_txt=='')
				return false;

			var version=version_txt.match(RegExp('^([0-9]+)\.([0-9]+)\.([0-9]+)(?:\.([0-9]+))?$'));
			if(version==null)
				return false;
			if(version[4]==null)
				version[4]='0';
			var version_int=parseInt(parseInt(version[1],10).pad(2)+parseInt(version[2],10).pad(2)+parseInt(version[3],10).pad(2)+parseInt(version[4],10).pad(2),10);

			var current_version=globalVersion.match(RegExp('^([0-9]+)\.([0-9]+)\.([0-9]+)(?:\.([0-9]+))?'));
			if(current_version[4]==null)
				current_version[4]='0';
			var current_version_int=parseInt(parseInt(current_version[1],10).pad(2)+parseInt(current_version[2],10).pad(2)+parseInt(current_version[3],10).pad(2)+parseInt(current_version[4],10).pad(2),10);

			if(current_version_int<version_int)
			{
				var showNofication=false;

				if(globalNewVersionNotifyUsers.length==0)
					showNofication=true;
				else
				{
					for(var i=0;i<globalAccountSettings.length;i++)
						if(globalNewVersionNotifyUsers.indexOf(globalAccountSettings[i].userAuth.userName)!=-1)
						{
							showNofication=true;
							break;
						}
				}

				if(showNofication==true)
				{
					$('div.update_h').html(localization[globalInterfaceLanguage].updateNotification.replace('%name%',globalAppName).replace('%new_ver%','<span id="newversion" class="update_h"></span>').replace('%curr_ver%', '<span id="version" class="update_h"></span>').replace('%url%', '<span id="homeurl" class="update_h" onclick=""></span>'));
					$('div.update_h').find('span#version').text(globalVersion);

					$('div.update_h').find('span#newversion').text(version_txt);
					$('div.update_h').find('span#homeurl').attr('onclick','window.open(\''+home+'\')');
					$('div.update_h').find('span#homeurl').text(home);

					setTimeout(function(){
						var orig_width=$('div.update_d').width();
						$('div.update_d').css('width', '0px');
						$('div.update_d').css('display','');
						$('div.update_d').animate({width: '+='+orig_width+'px'}, 500);
					},5000);
				}
			}
		}
	});
}

// Load the configuration from XML file
function netCheckAndCreateConfiguration(configurationURL)
{
	$.ajax({
		type: 'PROPFIND',
		url: configurationURL.href,
		cache: false,
		crossDomain: (typeof configurationURL.crossDomain=='undefined' ? true : configurationURL.crossDomain),
		xhrFields: {
			withCredentials: (typeof configurationURL.withCredentials=='undefined' ? false : configurationURL.withCredentials)
		},
		timeout: configurationURL.timeOut,
		error: function(objAJAXRequest, strError){
			console.log("Error: [netCheckAndCreateConfiguration: '"+configurationURL.href+"'] code: '"+objAJAXRequest.status+"'"+(objAJAXRequest.status==0 ? ' - see http://www.inf-it.com/'+globalAppName.toLowerCase()+'/misc/readme_network.txt' : ''));
			$('#LoginLoader').fadeOut(1200);
			return false;
		},
		beforeSend: function(req){
			if((typeof globalUseJqueryAuth=='undefined' || globalUseJqueryAuth!=true) && globalLoginUsername!='' && globalLoginPassword!='')
				req.setRequestHeader('Authorization', basicAuth(globalLoginUsername,globalLoginPassword));
			req.setRequestHeader('X-client', globalXClientHeader);
			req.setRequestHeader('Depth', '0');
		},
		username: (typeof globalUseJqueryAuth!='undefined' && globalUseJqueryAuth==true ? globalLoginUsername : null),
		password: (typeof globalUseJqueryAuth!='undefined' && globalUseJqueryAuth==true ? globalLoginPassword : null),
		contentType: 'text/xml; charset=utf-8',
		processData: true,
		data: '<?xml version="1.0" encoding="utf-8"?><D:propfind xmlns:D="DAV:"><D:prop><D:current-user-principal/></D:prop></D:propfind>',
		dataType: 'xml',
		complete: function(xml, textStatus)
		{
			if(textStatus!='success')
				return false;

			var count=0;
			if($(xml.responseXML).children().filterNsNode('multistatus').children().filterNsNode('response').children().filterNsNode('propstat').children().filterNsNode('status').text().match(RegExp('200 OK$')))
			{
				if(typeof globalAccountSettings=='undefined')
					globalAccountSettings=[];

				globalAccountSettings[globalAccountSettings.length]=$.extend({}, configurationURL);
				globalAccountSettings[globalAccountSettings.length-1].type='network';
				globalAccountSettings[globalAccountSettings.length-1].href=configurationURL.href+globalLoginUsername+'/';
				globalAccountSettings[globalAccountSettings.length-1].userAuth={userName: globalLoginUsername, userPassword: globalLoginPassword};
				count++;

				if(configurationURL.additionalResources!=undefined && configurationURL.additionalResources.length>0)
				{
					for(var i=0;i<configurationURL.additionalResources.length;i++)
					{
						if(globalLoginUsername!=configurationURL.additionalResources[i])
						{
							globalAccountSettings[globalAccountSettings.length]=$.extend({}, configurationURL);
							globalAccountSettings[globalAccountSettings.length-1].type='network';
							globalAccountSettings[globalAccountSettings.length-1].href=configurationURL.href+configurationURL.additionalResources[i]+'/';
							globalAccountSettings[globalAccountSettings.length-1].userAuth={userName: globalLoginUsername, userPassword: globalLoginPassword};
							count++;
						}
					}
				}
			}

			if(count)
			{
				var delCount=0, delegIndex=0;
				for(var i=0; i<globalAccountSettings.length;i++)
					if((typeof globalAccountSettings[i].delegation =='boolean' && globalAccountSettings[i].delegation) || (globalAccountSettings[i].delegation instanceof Array && globalAccountSettings[i].delegation.length>0))
						delegIndex=i;

				for(var i=0; i<globalAccountSettings.length;i++)
				{
					if((typeof globalAccountSettings[i].delegation =='boolean' && globalAccountSettings[i].delegation) || (globalAccountSettings[i].delegation instanceof Array && globalAccountSettings[i].delegation.length>0))
					{
						delCount++;
						DAVresourceDelegation(globalAccountSettings[i], i, delegIndex);
					}
				}
				if(delCount==0)
				{
					// start the client
					if(typeof isCardDAVAvaible!='undefined' && isCardDAVAvaible)
					{
						runCardDAV();
					}
					if(typeof isCalDAVAvaible!='undefined' && isCalDAVAvaible)
						runCalDAV();
					globalResourceNumber = globalAccountSettings.length;
					loadAllResources();
				}
			}
			else
				$('#LoginLoader').fadeOut(1200);
		}
	});
}

// Load the configuration from XML file
function netLoadConfiguration(configurationURL)
{
	$.ajax({
		type: 'GET',
		url: configurationURL.href,
		cache: false,
		crossDomain: (typeof configurationURL.crossDomain=='undefined' ? true : configurationURL.crossDomain),
		xhrFields: {
			withCredentials: (typeof configurationURL.withCredentials=='undefined' ? false : configurationURL.withCredentials)
		},
		timeout: configurationURL.timeOut,
		error: function(objAJAXRequest, strError){
			console.log("Error: [loadConfiguration: '"+configurationURL.href+"'] code: '"+objAJAXRequest.status+"'"+(objAJAXRequest.status==0 ? ' - see http://www.inf-it.com/'+globalAppName.toLowerCase()+'/misc/readme_network.txt' : ''));
			$('#LoginLoader').fadeOut(1200);
			return false;
		},
		beforeSend: function(req) {
			if((typeof globalUseJqueryAuth=='undefined' || globalUseJqueryAuth!=true) && globalLoginUsername!='' && globalLoginPassword!='')
				req.setRequestHeader('Authorization', basicAuth(globalLoginUsername,globalLoginPassword));
			req.setRequestHeader('X-client', globalXClientHeader);
		},
		username: (typeof globalUseJqueryAuth!='undefined' && globalUseJqueryAuth==true ? globalLoginUsername : null),
		password: (typeof globalUseJqueryAuth!='undefined' && globalUseJqueryAuth==true ? globalLoginPassword : null),
		contentType: 'text/xml; charset=utf-8',
		processData: true,
		data: '',
		dataType: 'xml',
		complete: function(xml, textStatus)
		{
			if(textStatus!='success')
				return false;

			if(typeof globalAccountSettings=='undefined')
				globalAccountSettings=[];

			var count=0;
			$(xml.responseXML).children('resources').children('resource').each(
				function(index, element)
				{
					if($(element).children().filterNsNode('type').children().filterNsNode('addressbook').length==1 || $(element).children().filterNsNode('type').children().filterNsNode('calendar').length==1)
					{
						var href=$(element).children('href').text();
						var tmp=$(element).children('hreflabel').text();
						var hreflabel=(tmp!='' ? tmp : null);
						var username=$(element).children('userauth').children('username').text();
						var password=$(element).children('userauth').children('password').text();
						var updateinterval=$(element).children('syncinterval').text();
						var settingsaccount=$(element).find('settingsaccount').text();
						var checkcontenttype=$(element).find('checkcontenttype').text();
						var timeout=$(element).children('timeout').text();
						var locktimeout=$(element).children('locktimeout').text();
						
						var collectionTypes = new Array();
						if($(element).children().filterNsNode('type').children().filterNsNode('addressbook').length==1)
							collectionTypes[collectionTypes.length]='addressbook';
						if($(element).children().filterNsNode('type').children().filterNsNode('calendar').length==1)
							collectionTypes[collectionTypes.length]='calendar';

						var tmp=$(element).children('showheader').text();
						var showHeader=((tmp=='false' || tmp=='no' || tmp=='0') ? false : true);
						var tmp=$(element).children('withcredentials').text();
						var withcredentials=((tmp=='true' || tmp=='yes' || tmp=='1') ? true : false);
						var tmp=$(element).children('crossdomain').text();
						var crossdomain=((tmp=='false' || tmp=='no' || tmp=='0') ? false : true);

						var forcereadonly=null;
						var tmp=$(element).children('forcereadonly');
						if(tmp.text()=='true')
							var forcereadonly=true;
						else
						{
							var tmp_ro=[];
							tmp.children('collection').each(
								function(index, element)
								{
									if((matched=$(element).text().match(RegExp('^re(\\|[^:]*|):(.+)$')))!=null && matched.length==3)
										tmp_ro[tmp_ro.length]=new RegExp(matched[2], matched[1].substring(matched[1].length>0 ? 1 : 0));
									else
										tmp_ro[tmp_ro.length]=$(element).text();
								}
							);
							if(tmp_ro.length>0)
								var forcereadonly=tmp_ro;
						}

						var delegation=false;
						var tmp=$(element).children('delegation');
						if(tmp.text()=='true')
							var delegation=true;
						else
						{
							var tmp_de=[];
							tmp.children('resource').each(
								function(index, element)
								{
									if((matched=$(element).text().match(RegExp('^re(\\|[^:]*|):(.+)$')))!=null && matched.length==3)
										tmp_de[tmp_de.length]=new RegExp(matched[2], matched[1].substring(matched[1].length>0 ? 1 : 0));
									else
										tmp_de[tmp_de.length]=$(element).text();
								}
							);
							if(tmp_de.length>0)
								var delegation=tmp_de;
						}

						var ignoreAlarms=false;
						var tmp=$(element).children('ignorealarms');
						if(tmp.text()=='true')
							var ignoreAlarms=true;
						else
						{
							var tmp_ia=[];
							tmp.children('collection').each(
								function(index, element)
								{
									if((matched=$(element).text().match(RegExp('^re(\\|[^:]*|):(.+)$')))!=null && matched.length==3)
										tmp_ia[tmp_ia.length]=new RegExp(matched[2], matched[1].substring(matched[1].length>0 ? 1 : 0));
									else
										tmp_ia[tmp_ia.length]=$(element).text();
								}
							);
							if(tmp_ia.length>0)
								var ignoreAlarms=tmp_ia;
						}

						var backgroundCalendars=[];
						var tmp=$(element).children('backgroundcalendars');
						if(tmp.text()!='')
						{
							tmp.children('collection').each(
								function(index, element)
								{
									if((matched=$(element).text().match(RegExp('^re(\\|[^:]*|):(.+)$')))!=null && matched.length==3)
										backgroundCalendars[backgroundCalendars.length]=new RegExp(matched[2], matched[1].substring(matched[1].length>0 ? 1 : 0));
									else
										backgroundCalendars[backgroundCalendars.length]=$(element).text();
								}
							);
						}

						globalAccountSettings[globalAccountSettings.length]={type: 'network', href: href, hrefLabel: hreflabel, crossDomain: crossdomain, showHeader: showHeader, settingsAccount: settingsaccount, checkContentType: checkcontenttype, forceReadOnly: forcereadonly, withCredentials: withcredentials, userAuth: {userName: username, userPassword: password}, syncInterval: updateinterval, timeOut: timeout, lockTimeOut: locktimeout, delegation: delegation, ignoreAlarms: ignoreAlarms, backgroundCalendars: backgroundCalendars,collectionTypes:collectionTypes};
						count++;
					}
				}
			);
			if(count)
			{
				var delCount=0, delegIndex=0;
				for(var i=0; i<globalAccountSettings.length;i++)
					if((typeof globalAccountSettings[i].delegation =='boolean' && globalAccountSettings[i].delegation) || (globalAccountSettings[i].delegation instanceof Array && globalAccountSettings[i].delegation.length>0))
						delegIndex=i;

				for(var i=0; i<globalAccountSettings.length;i++)
				{
					if((typeof globalAccountSettings[i].delegation =='boolean' && globalAccountSettings[i].delegation) || (globalAccountSettings[i].delegation instanceof Array && globalAccountSettings[i].delegation.length>0))
					{
						delCount++;
						DAVresourceDelegation(globalAccountSettings[i], i, delegIndex);
					}
				}
				if(delCount==0)
				{
					// start the client
					if(typeof isCardDAVAvaible!='undefined' && isCardDAVAvaible)
					{
						runCardDAV();
					}
					if(typeof isCalDAVAvaible!='undefined' && isCalDAVAvaible)
						runCalDAV();

					globalResourceNumber = globalAccountSettings.length;
					loadAllResources();
				}
			}
			else
				$('#LoginLoader').fadeOut(1200);
		}
	});
}

// Save the client settings (stored as DAV property on server)
function netSaveSettings(inputResource, inputSettings)
{
	var re=new RegExp('^(https?://)([^/]+)', 'i');
	var tmp=inputResource.href.match(re);

	var baseHref=tmp[1]+tmp[2];
	var uidBase=tmp[1]+inputResource.userAuth.userName+'@'+tmp[2];
	var saveHref = inputResource.href;
	if(typeof globalSettingsType!='undefined' && globalSettingsType!='' && globalSettingsType!=null)
	{
		if(globalSettingsType=='addressbook-home-set')
			saveHref = inputResource.abhref;
		else if(globalSettingsType=='calendar-home-set')
			saveHref = inputResource.cahref;
	}
	
	$.ajax({
		type: 'PROPPATCH',
		url: saveHref,
		cache: false,
		crossDomain: (typeof inputResource.crossDomain=='undefined' ? true: inputResource.crossDomain),
		xhrFields: {
			withCredentials: (typeof inputResource.withCredentials=='undefined' ? false: inputResource.withCredentials)
		},
		timeout: inputResource.timeOut,
		error: function(objAJAXRequest, strError){
			console.log("Error: [netSaveSettings: '"+uidBase+"'] code: '"+objAJAXRequest.status+"'"+(objAJAXRequest.status==0 ? ' (this error code usually means network connection error, or your browser is trying to make a cross domain query, but it is not allowed by the destination server or the browser itself)': ''));
			return false;
		},
		beforeSend: function(req){
			if((typeof globalUseJqueryAuth=='undefined' || globalUseJqueryAuth!=true) && inputResource.userAuth.userName!='' && inputResource.userAuth.userPassword!='')
				req.setRequestHeader('Authorization', basicAuth(inputResource.userAuth.userName, inputResource.userAuth.userPassword));

			req.setRequestHeader('X-client', globalXClientHeader);
			req.setRequestHeader('Depth', '0');
		},
		username: (typeof globalUseJqueryAuth!='undefined' && globalUseJqueryAuth==true ? inputResource.userAuth.userName : null),
		password: (typeof globalUseJqueryAuth!='undefined' && globalUseJqueryAuth==true ? inputResource.userAuth.userPassword : null),
		contentType: 'text/xml',
		processData: true,
		data: '<?xml version="1.0" encoding="utf-8"?><D:propertyupdate xmlns:D="DAV:"><D:set><D:prop><I:settings xmlns:I="http://inf-it.com/ns/cal/">'+inputSettings+'</I:settings></D:prop></D:set></D:propertyupdate>',
		dataType: 'xml',
		complete: function(xml, textStatus)
		{
			switch(textStatus)
			{
				case 'success' :
				case 'nocontent':
					return false;
					break;
			}
		}
	});
	return true;
}

function DAVresourceDelegation(inputResource, index, lastIndex)
{
	globalCalDAVResourceSync=false;

	var re=new RegExp('^(https?://)([^/]+)', 'i');
	var tmp=inputResource.href.match(re);
	
	var baseHref=tmp[1]+tmp[2];
	var uidBase=tmp[1]+inputResource.userAuth.userName+'@'+tmp[2];

	$.ajax({
		type: 'REPORT',
		url: inputResource.href,
		cache: false,
		crossDomain: (typeof inputResource.crossDomain=='undefined' ? true: inputResource.crossDomain),
		xhrFields: {
			withCredentials: (typeof inputResource.withCredentials=='undefined' ? false: inputResource.withCredentials)
		},
		timeout: inputResource.timeOut,
		error: function(objAJAXRequest, strError)
		{
			console.log("Error: [netLoadResource: '"+uidBase+"'] code: '"+objAJAXRequest.status+"'"+(objAJAXRequest.status==0 ? ' (this error code usually means network connection error, or your browser is trying to make a cross domain query, but it is not allowed by the destination server or the browser itself)': ''));
		},
		beforeSend: function(req){
			if((typeof globalUseJqueryAuth=='undefined' || globalUseJqueryAuth!=true) && inputResource.userAuth.userName!='' && inputResource.userAuth.userPassword!='')
				req.setRequestHeader('Authorization', basicAuth(inputResource.userAuth.userName, inputResource.userAuth.userPassword));

			req.setRequestHeader('X-client', globalXClientHeader);
			req.setRequestHeader('Depth', '0');
		},
		username: (typeof globalUseJqueryAuth!='undefined' && globalUseJqueryAuth==true ? inputResource.userAuth.userName : null),
		password: (typeof globalUseJqueryAuth!='undefined' && globalUseJqueryAuth==true ? inputResource.userAuth.userPassword : null),
		contentType: 'text/xml',
		processData: true,
		data: '<A:expand-property xmlns:A="DAV:"><A:property name="calendar-proxy-read-for" namespace="http://calendarserver.org/ns/"><A:property name="email-address-set" namespace="http://calendarserver.org/ns/"/>'+
				'<A:property name="displayname" namespace="DAV:"/><A:property name="calendar-user-address-set" namespace="urn:ietf:params:xml:ns:caldav"/>'+
				'</A:property><A:property name="calendar-proxy-write-for" namespace="http://calendarserver.org/ns/"><A:property name="email-address-set" namespace="http://calendarserver.org/ns/"/>'+
				'<A:property name="displayname" namespace="DAV:"/><A:property name="calendar-user-address-set" namespace="urn:ietf:params:xml:ns:caldav"/>'+
				'</A:property>'+
				'</A:expand-property>',
		dataType: 'xml',
		complete: function(xml, textStatus){
			if(textStatus!='success')
				return false;

			var hrefArray = new Array();
			if(typeof globalAccountSettings=='undefined')
				globalAccountSettings=[];
			var hostPart = tmp[0];		
			var propElement = $(xml.responseXML).children().filterNsNode('multistatus').children().filterNsNode('response').children().filterNsNode('propstat').
			children().filterNsNode('prop');

			var searchR = new Array();
			searchR[searchR.length] = $(propElement).children().filterNsNode('calendar-proxy-read-for');
			searchR[searchR.length] = $(propElement).children().filterNsNode('calendar-proxy-write-for');
			for(var m=0;m<searchR.length; m++)
			{
				searchR[m].children().filterNsNode('response').children().filterNsNode('propstat').
				children().filterNsNode('prop').children().filterNsNode('calendar-user-address-set').each(
				function(index, element)
				{
					var href = $(element).children().filterNsNode('href');
					if(href.length > 1)
						hrefArray[hrefArray.length] = $(href[1]).text();
					var found = false;
					for(var i=0;i<globalAccountSettings.length;i++)
						if(decodeURIComponent(globalAccountSettings[i].href) == (hostPart+$(href[1]).text()))
							found = true;
					if(!found)
					{
						var enabled = false;
						if(inputResource.delegation instanceof Array && inputResource.delegation.length>0)
						{
							for(var j=0; j<inputResource.delegation.length; j++)
								if(typeof inputResource.delegation[j]=='string')
								{
									var index = ($(href[1]).text()).indexOf(inputResource.delegation[j]);
									if(index!=-1)
										if(($(href[1]).text()).length == (index+inputResource.delegation[j].length))
											enabled=true;	
								}
								else if(typeof inputResource.delegation[j]=='object')
								{
									if($(href[1]).text().match(inputResource.delegation[j]) != null)
										enabled=true;
								}
						}
						else
							enabled=true;
							
						if(enabled)
						{
							globalAccountSettings[globalAccountSettings.length]=$.extend({}, inputResource);
							globalAccountSettings[globalAccountSettings.length-1].type=inputResource.type;
							globalAccountSettings[globalAccountSettings.length-1].href=decodeURIComponent(hostPart+$(href[1]).text());
							globalAccountSettings[globalAccountSettings.length-1].userAuth = { userName : inputResource.userAuth.userName, userPassword : inputResource.userAuth.userPassword};
						}
						
					}
				});
			}		
			if(index==lastIndex)
			{
				// start the client
				if(typeof isCardDAVAvaible!='undefined' && isCardDAVAvaible)
				{
					runCardDAV();
				}
				if(typeof isCalDAVAvaible!='undefined' && isCalDAVAvaible)
					runCalDAV();
				
				globalResourceNumber = globalAccountSettings.length;
				loadAllResources();
			}
		}
	});
}

function netFindResource(inputResource, inputResourceIndex, forceLoad, indexR)
{
	if(indexR<globalAccountSettings.length)
	{
		globalResourceNumberCount++;
		$('#MainLoaderInner').html(localization[globalInterfaceLanguage].loadingResources.replace('%act%', globalResourceNumberCount).replace('%total%', globalResourceNumber));
	}
	if(typeof inputResource!='undefined' && typeof inputResource.collectionTypes!='undefined' && inputResource.collectionTypes!=null && (inputResource.collectionTypes.indexOf('calendar')==-1)&&inputResource.collectionTypes.indexOf('addressbook')==-1)
	{	
		indexR++;
		netFindResource(globalAccountSettings[indexR], inputResourceIndex, forceLoad, indexR);
		return false;
	}

	if(indexR>=globalAccountSettings.length)
	{
		globalCalDAVResourceSync=false;
		globalCardDAVResourceSync=false;
		if(typeof isCalDAVAvaible!='undefined' && isCalDAVAvaible!=null)
		{
			selectActiveCalendar();
			var cals=globalResourceCalDAVList.TodoCollections;
			var calendarsArray=new Array();
			
			for(var i=0;i<cals.length;i++)
				if(cals[i].uid!=undefined)
					calendarsArray[calendarsArray.length]={displayValue:cals[i].displayvalue,uid:cals[i].uid, permissions_read_only:cals[i].permissions.read_only};
			calendarsArray.sort(customResourceCompare);
			globalResourceCalDAVList.sortedTodoCollections = calendarsArray;
			
			var cals=globalResourceCalDAVList.collections;
			calendarsArray=new Array();
			
			for(var i=0;i<cals.length;i++)
				if(cals[i].uid!=undefined)
					calendarsArray[calendarsArray.length]={displayValue:cals[i].displayvalue,uid:cals[i].uid, permissions_read_only:cals[i].permissions.read_only};
			calendarsArray.sort(customResourceCompare);
			globalResourceCalDAVList.sortedCollections = calendarsArray;
		}
		
		if((typeof isCalDAVAvaible!='undefined' && isCalDAVAvaible!=null && !isCalDAVLoaded) || (typeof isCardDAVAvaible!='undefined' && isCardDAVAvaible!=null && !isCardDAVLoaded))
			loadNextApplication(true);
		return false;
	}
	var re=new RegExp('^(https?://)([^/]+)','i');
	var tmp=inputResource.href.match(re);
	var settingsXML = '';
	if(inputResource.href.indexOf(globalLoginUsername)!=-1 && inputResource.settingsAccount && (typeof globalSettingsType=='undefined' || globalSettingsType=='' || globalSettingsType==null || (typeof globalSettingsType!='undefined' && globalSettingsType!='' && globalSettingsType!=null && globalSettingsType=='principal-URL')))
	{
		settingsXML = '<I:cal-settings xmlns:I="http://inf-it.com/ns/cal/"/><I:settings xmlns:I="http://inf-it.com/ns/cal/"/>';
	}
	var baseHref=tmp[1]+tmp[2];
	var uidBase=tmp[1]+inputResource.userAuth.userName+'@'+tmp[2];
	$.ajax({
		type: 'PROPFIND',
		url: inputResource.href,
		cache: false,
		crossDomain: (typeof inputResource.crossDomain=='undefined' ? true : inputResource.crossDomain),
		xhrFields: {
			withCredentials: (typeof inputResource.withCredentials=='undefined' ? false : inputResource.withCredentials)
		},
		timeout: inputResource.timeOut,
		error: function(objAJAXRequest, strError){
			console.log("Error: [netFindResource: '"+uidBase+"'] code: '"+objAJAXRequest.status+"'"+(objAJAXRequest.status==0 ? ' - see http://www.inf-it.com/'+globalAppName.toLowerCase()+'/misc/readme_network.txt' : ''));
			indexR++;
			if(indexR==globalAccountSettings.length)
			{
				$('#MainLoader').fadeOut(1200);
			}
			netFindResource(globalAccountSettings[indexR], inputResourceIndex, forceLoad, indexR);
			return false;
		},
		beforeSend: function(req) {
			if((typeof globalUseJqueryAuth=='undefined' || globalUseJqueryAuth!=true) && inputResource.userAuth.userName!='' && inputResource.userAuth.userPassword!='')
				req.setRequestHeader('Authorization', basicAuth(inputResource.userAuth.userName,inputResource.userAuth.userPassword));

			req.setRequestHeader('X-client', globalXClientHeader);
			req.setRequestHeader('Depth', '0');
			if((typeof isCardDAVAvaible!='undefined' && isCardDAVAvaible && (!globalCardDAVInitLoad && !globalCardDAVResourceSync)) || (typeof isCalDAVAvaible!='undefined' && isCalDAVAvaible && (!globalCalDAVInitLoad && !globalCalDAVResourceSync))||(typeof isProjectsAvaible!='undefined' && isProjectsAvaible && isProjectsLoaded))
				if(typeof isSettingsAvaible!='undefined' && isSettingsAvaible!=null && $('#SystemSettings').css('visibility')=='visible' && $('.resourceSettings.resourceSettings_selected').attr('data-type')=='Password')
				{
					indexR++;
					if(indexR==globalAccountSettings.length)
					{
						$('#MainLoader').fadeOut(1200);
					}
					netFindResource(globalAccountSettings[indexR], inputResourceIndex, forceLoad, indexR);
					return false;
				}
		},
		username: (typeof globalUseJqueryAuth!='undefined' && globalUseJqueryAuth==true ? inputResource.userAuth.userName : null),
		password: (typeof globalUseJqueryAuth!='undefined' && globalUseJqueryAuth==true ? inputResource.userAuth.userPassword : null),
		contentType: 'text/xml; charset=utf-8',
		processData: true,
		data: '<?xml version="1.0" encoding="utf-8"?><D:propfind xmlns:D="DAV:"><D:prop>'+settingsXML+'<D:current-user-privilege-set/><D:displayname/><D:resourcetype/><L:calendar-home-set xmlns:L="urn:ietf:params:xml:ns:caldav"/><R:addressbook-home-set xmlns:R="urn:ietf:params:xml:ns:carddav"/></D:prop></D:propfind>',
		dataType: 'xml',
		complete: function(xml, textStatus)
		{
			if(textStatus!='success')
				return false;
			
			if(inputResource.href.indexOf(globalLoginUsername)!=-1 && inputResource.settingsAccount && (typeof globalSettingsType=='undefined' || globalSettingsType=='' || globalSettingsType==null || (typeof globalSettingsType!='undefined' && globalSettingsType!='' && globalSettingsType!=null && globalSettingsType=='principal-URL')))
			{
				var settings=$(xml.responseXML).children().filterNsNode('multistatus').children().filterNsNode('response').children().filterNsNode('propstat').children().filterNsNode('prop').children().filterNsNode('settings').text();
				if(settings!='')
				{
					loadSettings(settings);
				}
				else
				{
					var calSettings=$(xml.responseXML).children().filterNsNode('multistatus').children().filterNsNode('response').children().filterNsNode('propstat').children().filterNsNode('prop').children().filterNsNode('cal-settings').text();
					if(calSettings!='')
						loadSettings(calSettings);
					else
						loadSettings(JSON.stringify(globalSettings));
				}
			}				
			var response=$(xml.responseXML).children().filterNsNode('multistatus').children().filterNsNode('response');

			var addressbook_home=response.children().filterNsNode('propstat').children().filterNsNode('prop').children().filterNsNode('addressbook-home-set').children().filterNsNode('href').text();
			if(addressbook_home=='')	// addressbook-home-set has no 'href' value -> SabreDav
				addressbook_home=response.children().filterNsNode('href').text().replace('/principals/users/caldav.php','/caldav.php');

			if(addressbook_home.match(RegExp('^https?://','i'))!=null)	// absolute URL returned
				inputResource.abhref=addressbook_home;
			else	// relative URL returned
				inputResource.abhref=baseHref+addressbook_home;


			var calendar_home=response.children().filterNsNode('propstat').children().filterNsNode('prop').children().filterNsNode('calendar-home-set').children().filterNsNode('href').text();
			if(calendar_home=='')	// addressbook-home-set has no 'href' value -> SabreDav
				calendar_home=response.children().filterNsNode('href').text().replace('/principals/users/caldav.php','/caldav.php');

			if(calendar_home.match(RegExp('^https?://','i'))!=null)	// absolute URL returned
				inputResource.cahref=calendar_home;
			else	// relative URL returned
				inputResource.cahref=baseHref+calendar_home;
			
			if(typeof isCardDAVAvaible!='undefined' && isCardDAVAvaible!=null && isCardDAVAvaible && typeof isCalDAVAvaible!='undefined' && isCalDAVAvaible!=null && isCalDAVAvaible)
			{
				if(inputResource.abhref == inputResource.cahref)
					netLoadResource(inputResource, inputResource.abhref, false, inputResourceIndex, forceLoad, indexR);
				else
					netLoadResource(inputResource, inputResource.abhref, true, inputResourceIndex, forceLoad, indexR);
			}
			else if(typeof isCardDAVAvaible!='undefined' && isCardDAVAvaible!=null && isCardDAVAvaible)
				netLoadResource(inputResource, inputResource.abhref, false, inputResourceIndex, forceLoad, indexR);
			else if(typeof isCalDAVAvaible!='undefined' && isCalDAVAvaible!=null && isCalDAVAvaible)
				netLoadResource(inputResource, inputResource.cahref, false, inputResourceIndex, forceLoad, indexR);
		}
	});
}

function netLoadResource(inputResource, inputHref, hrefMode, inputResourceIndex, forceLoad, indexR)
{
	var re=new RegExp('^(https?://)([^/]+)','i');
	inputResource.addressbookNo=0;
	globalAccountSettings[indexR].calendarNo=0;
	globalAccountSettings[indexR].todoNo=0;
	var tmp=inputResource.abhref.match(re);
	var baseHref=tmp[1]+tmp[2];
	var uidBase=tmp[1]+inputResource.userAuth.userName+'@'+tmp[2];

	var tmp=inputResource.href.match(RegExp('^(https?://)(.*)','i'));
	var origUID=tmp[1]+inputResource.userAuth.userName+'@'+tmp[2];
	
	if(typeof globalSubscribedCalendars!='undefined' && globalSubscribedCalendars!=null && typeof inputResource.calendars!='undefined' && inputResource.calendars!=null && inputResource.calendars.length>0)
	{
		var tmp1=inputResource.href.match(RegExp('^(https?://)(.*)', 'i'));
		var origUID1=tmp1[1]+inputResource.userAuth.userName+'@'+tmp1[2];
		var resultTimestamp=new Date().getTime();
		for(var k=0; k<globalSubscribedCalendars.calendars.length;k++)
		{
			color = globalSubscribedCalendars.calendars[k].color;
			if(color=='')
			{
				var par=(uidBase+globalSubscribedCalendars.calendars[k].href).split('/');
				var hash=hex_sha256(hex_sha256(par[par.length-3]+'/'+par[par.length-2]+'/'));
				var hex=hash.substring(0,6);
				while(checkColorBrightness(hex)>=252)
					hex=hex_sha256(hex_sha256(hash)).substring(0,6);
				color='#'+hex;
			}
			var syncRequired = true;
			var uidPArts = (uidBase+'/'+globalSubscribedCalendars.calendars[k].href+'/').split('/');
			if(globalSubscribedCalendars.calendars[k].typeList.indexOf('vevent')!=-1)
			{
				globalResourceCalDAVList.insertResource({typeList:globalSubscribedCalendars.calendars[k].typeList,listType:'vevent', syncRequired:syncRequired, ecolor: color, timestamp: resultTimestamp, uid: uidBase+'/'+globalSubscribedCalendars.calendars[k].href+'/', timeOut: inputResource.timeOut, displayvalue: globalSubscribedCalendars.calendars[k].displayName, userAuth: globalSubscribedCalendars.calendars[k].userAuth, resourceIndex: indexR, url: baseHref, accountUID: origUID1, href: globalSubscribedCalendars.calendars[k].href, hrefLabel: globalSubscribedCalendars.hrefLabel, showHeader: globalSubscribedCalendars.showHeader, permissions: {full: [], read_only: true}, crossDomain: inputResource.crossDomain, withCredentials: inputResource.withCredentials, interval: null, waitInterval: null, displayEventsArray: new Array(), pastUnloaded: '', fcSource: null,subscription: true, urlArray: new Array(), ignoreAlarms:globalSubscribedCalendars.calendars[k].ignoreAlarm,webdav_bind:false}, indexR, true);
				if(inputResource!=undefined)
					inputResource.calendarNo++;
				syncRequired = false;
			}
			if(globalSubscribedCalendars.calendars[k].typeList.indexOf('vtodo')!=-1)
			{
				globalResourceCalDAVList.insertResource({typeList:globalSubscribedCalendars.calendars[k].typeList,listType:'vtodo', syncRequired:syncRequired, ecolor: color, timestamp: resultTimestamp, uid: uidBase+'/'+globalSubscribedCalendars.calendars[k].href+'/', timeOut: inputResource.timeOut, displayvalue: globalSubscribedCalendars.calendars[k].displayName, userAuth: globalSubscribedCalendars.calendars[k].userAuth, resourceIndex: indexR, url: baseHref, accountUID: origUID1, href: globalSubscribedCalendars.calendars[k].href, hrefLabel: globalSubscribedCalendars.hrefLabel, showHeader: globalSubscribedCalendars.showHeader, permissions: {full: [], read_only: true}, crossDomain: inputResource.crossDomain, withCredentials: inputResource.withCredentials, interval: null, waitInterval: null, displayEventsArray: new Array(), pastUnloaded: '', fcSource: null,subscription: true, urlArray: new Array(), ignoreAlarms:globalSubscribedCalendars.calendars[k].ignoreAlarm,webdav_bind:false}, indexR, false);
				if(inputResource!=undefined)
					inputResource.todoNo++;
			}
		}
		if(globalSubscribedCalendars.calendars.length>1)
		{
			$('.resourceCalDAV_header').find('[value^="+subscribed"]').show();
			$('.resourceCalDAV_header').find('[value^="-subscribed"]').show();
		}
		if(typeof globalResourceErrorCounter!='undefined' && globalResourceErrorCounter!=null)
		{
			globalResourceErrorCounter--;
			if((globalResourceErrorCounter==0) && ($('.r_error').length==0))
				$('#SystemCalDAV .fc-header-center').removeClass('r_error_all');
		}
		//recursive call for resource loading
		indexR++;
		netFindResource(globalAccountSettings[indexR], inputResourceIndex,  forceLoad, indexR);
		return true;
	}
	
	var settingsXML = '';
	if(inputResource.href.indexOf(globalLoginUsername)!=-1 && inputResource.settingsAccount && typeof globalSettingsType!='undefined' && globalSettingsType!='' && globalSettingsType!=null)
		if((globalSettingsType=='addressbook-home-set' && inputResource.abhref == inputHref) || (globalSettingsType=='calendar-home-set' && inputResource.cahref == inputHref))
			settingsXML = '<I:cal-settings xmlns:I="http://inf-it.com/ns/cal/"/><I:settings xmlns:I="http://inf-it.com/ns/cal/"/>';
	
	$.ajax({
		type: 'PROPFIND',
		url: inputHref,
		cache: false,
		crossDomain: (typeof inputResource.crossDomain=='undefined' ? true : inputResource.crossDomain),
		xhrFields: {
			withCredentials: (typeof inputResource.withCredentials=='undefined' ? false : inputResource.withCredentials)
		},
		timeout: inputResource.timeOut,
		error: function(objAJAXRequest, strError){
			console.log("Error: [netLoadResource: '"+uidBase+"'] code: '"+objAJAXRequest.status+"'"+(objAJAXRequest.status==0 ? ' - see http://www.inf-it.com/'+globalAppName.toLowerCase()+'/misc/readme_network.txt' : ''));

			$('#SystemCalDAV .fc-header-center').addClass('r_error_all');
			
			if(typeof globalResourceErrorCounter!='undefined' && globalResourceErrorCounter!=null)
				globalResourceErrorCounter++;
			
			if(hrefMode)
				netLoadResource(inputResource, inputResource.cahref, false, inputResourceIndex, forceLoad, indexR);
			else
			{
				indexR++;
				if(indexR==globalAccountSettings.length)
				{
					$('#MainLoader').fadeOut(1200);
				}
				netFindResource(globalAccountSettings[indexR], inputResourceIndex, forceLoad, indexR);
			}
			return false;
		},
		beforeSend: function(req){
			if((typeof globalUseJqueryAuth=='undefined' || globalUseJqueryAuth!=true) && inputResource.userAuth.userName!='' && inputResource.userAuth.userPassword!='')
				req.setRequestHeader('Authorization', basicAuth(inputResource.userAuth.userName, inputResource.userAuth.userPassword));

			req.setRequestHeader('X-client', globalXClientHeader);
			req.setRequestHeader('Depth', '1');
			if((typeof isCardDAVAvaible!='undefined' && isCardDAVAvaible && (!globalCardDAVInitLoad && !globalCardDAVResourceSync)) || (typeof isCalDAVAvaible!='undefined' && isCalDAVAvaible && (!globalCalDAVInitLoad && !globalCalDAVResourceSync))||(typeof isProjectsAvaible!='undefined' && isProjectsAvaible && isProjectsLoaded))
				if(typeof isSettingsAvaible!='undefined' && isSettingsAvaible!=null && $('#SystemSettings').css('visibility')=='visible' && $('.resourceSettings.resourceSettings_selected').attr('data-type')=='Password')
			{
				indexR++;
				if(indexR==globalAccountSettings.length)
				{
					$('#MainLoader').fadeOut(1200);
				}
				netFindResource(globalAccountSettings[indexR], inputResourceIndex, forceLoad, indexR);
				return false;
			}
		},
		username: (typeof globalUseJqueryAuth!='undefined' && globalUseJqueryAuth==true ? inputResource.userAuth.userName : null),
		password: (typeof globalUseJqueryAuth!='undefined' && globalUseJqueryAuth==true ? inputResource.userAuth.userPassword : null),
		contentType: 'text/xml; charset=utf-8',
		processData: true,
		data: '<?xml version="1.0" encoding="utf-8"?><D:propfind xmlns:D="DAV:"><D:prop>'+settingsXML+'<D:current-user-privilege-set/><D:displayname/><D:supportedlock/><D:resourcetype/><D:supported-report-set/><D:sync-token/><A:calendar-color xmlns:A="http://apple.com/ns/ical/"/><L:supported-calendar-component-set xmlns:L="urn:ietf:params:xml:ns:caldav"/><R:max-image-size xmlns:R="urn:ietf:params:xml:ns:carddav"/></D:prop></D:propfind>',
		dataType: 'xml',
		complete: function(xml, textStatus)
		{
			var Rname='',
			color='';
			if(textStatus!='success')
				return false;
			var calendarNo=0;
			var resultTimestamp=new Date().getTime();

			if(inputResource.href.indexOf(globalLoginUsername)!=-1 && inputResource.settingsAccount && typeof globalSettingsType!='undefined' && globalSettingsType!='' && globalSettingsType!=null)
			{
				if((globalSettingsType=='addressbook-home-set' && inputResource.abhref == inputHref) || (globalSettingsType=='calendar-home-set' && inputResource.cahref == inputHref))
				{
					var settings=$(xml.responseXML).children().filterNsNode('multistatus').children().filterNsNode('response').children().filterNsNode('propstat').children().filterNsNode('prop').children().filterNsNode('settings').text();
					if(settings!='')
					{
						loadSettings(settings);
					}
					else
					{
						var calSettings=$(xml.responseXML).children().filterNsNode('multistatus').children().filterNsNode('response').children().filterNsNode('propstat').children().filterNsNode('prop').children().filterNsNode('cal-settings').text();
						if(calSettings!='')
							loadSettings(calSettings);
						else
							loadSettings(JSON.stringify(globalSettings));
					}
				}	
			}
			else if(inputResource.href.indexOf(globalLoginUsername)!=-1)
				loadSettings(JSON.stringify(globalSettings));			
			
			$(xml.responseXML).children().filterNsNode('multistatus').children().filterNsNode('response').each(function(index, element){
				$(element).children().filterNsNode('propstat').each(function(pindex, pelement){
					var resources=$(pelement).children().filterNsNode('prop');

					if(resources.children().filterNsNode('calendar-color').length==1)
					{
						color=resources.children().filterNsNode('calendar-color').text();
						if(color.length==9)
							color=color.substring(0, 7);
					}
					
					var typeList = new Array();
					resources.children().filterNsNode('supported-calendar-component-set').children().filterNsNode('comp').each(function(pindex, pelement){
						typeList[typeList.length] = pelement.getAttribute('name').toLowerCase();					
					});
					
					if(typeof inputResource!='undefined' && typeof inputResource.collectionTypes!='undefined' && inputResource.collectionTypes!=null && inputResource.collectionTypes.indexOf('calendar')!=-1 ||
						typeof inputResource=='undefined' || inputResource.collectionTypes==null)
						if(typeof isCalDAVAvaible !='undefined' && resources.children().filterNsNode('resourcetype').children().filterNsNode('calendar').length==1 && resources.children().filterNsNode('resourcetype').children().filterNsNode('collection').length==1)
						{
							var permissions=new Array();
							resources.children().filterNsNode('current-user-privilege-set').children().filterNsNode('privilege').each(
								function(index, element)
								{
									$(element).children().each(
										function(index, element)
										{
											permissions[permissions.length]=$(element).prop('tagName').replace(/^[^:]+:/,'');
										}
									);
								}
							);

							var read_only=false;
							var href=$(element).children().filterNsNode('href').text();

							if(permissions.length>0 && permissions.indexOf('all')==-1 && permissions.indexOf('write')==-1 && permissions.indexOf('write-content')==-1)
								read_only=true;
							else if(inputResource.forceReadOnly!=undefined && (inputResource.forceReadOnly==true || inputResource.forceReadOnly instanceof Array))
							{
								if(inputResource.forceReadOnly instanceof Array)
								{
									for(var j=0; j<inputResource.forceReadOnly.length; j++)
										if(typeof inputResource.forceReadOnly[j]=='string')
										{
											var index = href.indexOf(inputResource.forceReadOnly[j]);
											if(index!=-1)
												if(href.length == (index+inputResource.forceReadOnly[j].length))
													read_only=true;
										}
										else if(typeof inputResource.forceReadOnly[j]=='object')
										{
											if(href.match(inputResource.forceReadOnly[j]) != null)
												read_only=true;
										}
								}
								else 
									read_only=true;
							}
							var displayvalue=resources.children().filterNsNode('displayname').text();
							var tmp_dv=href.match(RegExp('.*/([^/]+)/$', 'i'));

							if(displayvalue=='') // MacOSX Lion Server
								displayvalue=tmp_dv[1];

							if(color=='')
							{
								var par=(uidBase+href).split('/');
								var hash=hex_sha256(hex_sha256(par[par.length-3]+'/'+par[par.length-2]+'/'));
								var hex=hash.substring(0,6);
								while(checkColorBrightness(hex)>=252)
									hex=hex_sha256(hex_sha256(hash)).substring(0,6);
								color='#'+hex;
							}
							var ignoreAlarms = false;
							var uidPArts = (uidBase+href).split('/');
							if(typeof inputResource.ignoreAlarms =='boolean' && inputResource.ignoreAlarms)
								ignoreAlarms = true;
							else if(inputResource.ignoreAlarms instanceof Array && inputResource.ignoreAlarms.length>0)
							{
								for(var j=0; j<inputResource.ignoreAlarms.length; j++)
								{
									if(typeof inputResource.ignoreAlarms[j]=='string')
									{
										var index = href.indexOf(inputResource.ignoreAlarms[j]);
										if(index!=-1)
											if(href.length == (index+inputResource.ignoreAlarms[j].length))
												ignoreAlarms=true;
									}
									else if (typeof inputResource.ignoreAlarms[j]=='object' && href.match(inputResource.ignoreAlarms[j])!=null)
										ignoreAlarms = true;
								}
							}

							// insert the resource
							var webdav_bind = false;
							if(resources.children().filterNsNode('resourcetype').children().filterNsNode('webdav-binding').length==1)
								webdav_bind=true;

							var checkContentType=(inputResource.checkContentType==undefined ? true : inputResource.checkContentType);

							var syncRequired=true;
							if(typeList.indexOf('vevent')!=-1)
							{
								globalResourceCalDAVList.insertResource({typeList:typeList, listType:'vevent', ecolor: color, timestamp: resultTimestamp, uid: uidBase+href, timeOut: inputResource.timeOut, displayvalue: displayvalue, userAuth: inputResource.userAuth, resourceIndex: indexR, url: baseHref, accountUID: origUID, href: href, hrefLabel: inputResource.hrefLabel, showHeader: inputResource.showHeader, permissions: {full: permissions, read_only: read_only}, crossDomain: inputResource.crossDomain, withCredentials: inputResource.withCredentials, interval: null, waitInterval: null, displayEventsArray: new Array(), pastUnloaded: '', fcSource: null, subscription: false, urlArray:null, ignoreAlarms:ignoreAlarms,webdav_bind:webdav_bind, syncRequired:syncRequired, checkContentType: checkContentType}, indexR, true);
								if(globalAccountSettings[indexR]!=undefined)
									globalAccountSettings[indexR].calendarNo++;
								syncRequired = false;
							}
							if(typeList.indexOf('vtodo')!=-1)
							{
								globalResourceCalDAVList.insertResource({typeList:typeList, listType:'vtodo', ecolor: color, timestamp: resultTimestamp, uid: uidBase+href, timeOut: inputResource.timeOut, displayvalue: displayvalue, userAuth: inputResource.userAuth, resourceIndex: indexR, url: baseHref, accountUID: origUID, href: href, hrefLabel: inputResource.hrefLabel, showHeader: inputResource.showHeader, permissions: {full: permissions, read_only: read_only}, crossDomain: inputResource.crossDomain, withCredentials: inputResource.withCredentials, interval: null, waitInterval: null, displayEventsArray: new Array(), pastUnloaded: '', fcSource: null, subscription: false, urlArray:null, ignoreAlarms:ignoreAlarms,webdav_bind:webdav_bind,syncRequired:syncRequired, checkContentType: checkContentType}, indexR, false);
								if(globalAccountSettings[indexR]!=undefined)
									globalAccountSettings[indexR].todoNo++;
							}
						}

						if(typeof inputResource!='undefined' && typeof inputResource.collectionTypes!='undefined' && inputResource.collectionTypes!=null && inputResource.collectionTypes.indexOf('addressbook')!=-1 || typeof inputResource=='undefined' || inputResource.collectionTypes==null)
							if(typeof isCardDAVAvaible !='undefined' && resources.children().filterNsNode('resourcetype').children().filterNsNode('addressbook').length==1 && resources.children().filterNsNode('resourcetype').children().filterNsNode('collection').length==1)
							{
								var permissions=new Array();
								resources.children().filterNsNode('current-user-privilege-set').children().filterNsNode('privilege').each(
									function(index, element)
									{
										$(element).children().each(
											function(index, element)
											{
												permissions[permissions.length]=$(element).prop('tagName').replace(/^[^:]+:/,'');
											}
										);
									}
								);

								var disableLocking=false;
								var tmp_lock_support=resources.children().filterNsNode('supportedlock').children().filterNsNode('lockentry').children().filterNsNode('lockscope').children().filterNsNode('exclusive');
								if(typeof tmp_lock_support=='undefined' || tmp_lock_support.length==undefined || tmp_lock_support.length==0)
									disableLocking=true;

								var href=$(element).children().filterNsNode('href').text();
								var tmp_cn=href.match(RegExp('/([^/]+)/?$'));	// collection name

								var read_only=false;
								if((permissions.length>0 && permissions.indexOf('all')==-1 && permissions.indexOf('write')==-1 &&  permissions.indexOf('write-content')==-1) || (inputResource.forceReadOnly!=undefined && (inputResource.forceReadOnly==true || inputResource.forceReadOnly instanceof Array && inputResource.forceReadOnly.indexOf(tmp_cn[1])!=-1)))
									read_only=true;

								var displayvalue=resources.children().filterNsNode('displayname').text();
								var synctoken=resources.children().filterNsNode('sync-token').text();

								var tmp_dv=href.match(RegExp('.*/([^/]+)/$','i'));
								if(displayvalue=='')	// OS X Server
									displayvalue=tmp_dv[1];

								var checkContentType=(inputResource.checkContentType==undefined ? true : inputResource.checkContentType);
								// insert the resource
								globalResourceCardDAVList.insertResource({timestamp: resultTimestamp, uid: uidBase+href, timeOut: inputResource.timeOut, displayvalue: displayvalue, userAuth: inputResource.userAuth, url: baseHref, accountUID: origUID, href: href, hrefLabel: inputResource.hrefLabel, permissions: {full: permissions, read_only: read_only}, crossDomain: inputResource.crossDomain, withCredentials: inputResource.withCredentials, checkContentType: checkContentType, isLoaded:false, indexResource:indexR, disableLocking: disableLocking, syncToken: synctoken}, inputResourceIndex);
								inputResource.addressbookNo++;
							}
				});
			});

			isResourceNumber=true;
			if(globalAccountSettings[indexR].calendarNo>1 || ((indexR+1)<globalAccountSettings.length && !globalAccountSettings[indexR+1].showHeader && globalAccountSettings[indexR].calendarNo==1))
			{
				var str=inputResource.abhref.match(RegExp('^(https?://)(.*)', 'i'))[2];
				$('.resourceCalDAV_header').find('[value^="+'+str.substring(str.indexOf('/'), str.length-1)+'"]').show();
				$('.resourceCalDAV_header').find('[value^="-'+str.substring(str.indexOf('/'), str.length-1)+'"]').show();
			}
			if(globalAccountSettings[indexR].todoNo>1 || ((indexR+1)<globalAccountSettings.length && !globalAccountSettings[indexR+1].showHeader && globalAccountSettings[indexR].todoNo==1))
			{
				var str=inputResource.abhref.match(RegExp('^(https?://)(.*)', 'i'))[2];
				$('.resourceCalDAVTODO_header').find('[value^="+'+str.substring(str.indexOf('/'), str.length-1)+'"]').show();
				$('.resourceCalDAVTODO_header').find('[value^="-'+str.substring(str.indexOf('/'), str.length-1)+'"]').show();
			}
			
			if(typeof globalResourceCalDAVList != 'undefined' && globalResourceCalDAVList!=null)
				globalResourceCalDAVList.removeOldResources(inputResource.href, resultTimestamp);
			if(typeof globalResourceCardDAVList != 'undefined' && globalResourceCardDAVList!=null)
				globalResourceCardDAVList.removeOldResources(inputResource.href, inputResourceIndex, resultTimestamp);
			
			if(typeof globalResourceErrorCounter!='undefined' && globalResourceErrorCounter!=null)
			{
				globalResourceErrorCounter--;
				if((globalResourceErrorCounter==0) && ($('.r_error').length==0))
					$('#SystemCalDAV .fc-header-center').removeClass('r_error_all');
			}
			//recursive call for resource loading
			if(hrefMode)
				netLoadResource(inputResource, inputResource.cahref, false, inputResourceIndex, forceLoad, indexR)
			else
			{
				indexR++;
				netFindResource(globalAccountSettings[indexR], inputResourceIndex, forceLoad, indexR);
			}
		}
	});
}
function deleteVcalendarFromCollection(inputUID,inputForm, putMode)
{
	var tmp=inputUID.match(RegExp('^(https?://)([^@/]+(?:@[^@/]+)?)@([^/]+)(.*/)([^/]+/)([^/]*)', 'i'));
	var collection_uid=tmp[1]+tmp[2]+'@'+tmp[3]+tmp[4]+tmp[5];
	var put_href=tmp[1]+tmp[3]+tmp[4]+tmp[5]+tmp[6];

	var resourceCalDAV_href=tmp[1]+tmp[3]+tmp[4];
	var resourceCalDAV_user=tmp[2];

	var resourceSettings=null;

	rid=inputUID.substring(0, inputUID.lastIndexOf('/')+1);
	if(inputForm=='vevent')
		var resources=globalResourceCalDAVList.collections;
	else
		var resources=globalResourceCalDAVList.TodoCollections;

	for(var j=0;j<resources.length;j++)
	{
		if(rid==resources[j].uid)
		{
			var tmp=resources[j].accountUID.match(RegExp('^(https?://)([^@/]+(?:@[^@/]+)?)@([^/]+)(.*/)', 'i'));
			var resourceCalDAV_href=tmp[1]+tmp[3]+tmp[4];
			var resourceCalDAV_user=tmp[2];

			// find the original settings for the resource and user
			for(var i=0;i<globalAccountSettings.length;i++)
				if(globalAccountSettings[i].href==resourceCalDAV_href && globalAccountSettings[i].userAuth.userName==resourceCalDAV_user)
					resourceSettings=globalAccountSettings[i];
			break;
		}
	}

	if(resourceSettings==null)
		return false;
	// the begin of each error message
	if(inputForm=='vevent')
		var errBegin=localization[globalInterfaceLanguage].errUnableDeleteBeginCalDAV;
	else
		var errBegin=localization[globalInterfaceLanguage].errUnableDeleteTodoBeginCalDAV;

	var vcalendarList=new Array();
	$.ajax({
		type: 'DELETE',
		url: put_href,
		cache: false,
		crossDomain: true,
		xhrFields: {
			withCredentials: (typeof resourceSettings.withCredentials=='undefined' ? false: resourceSettings.withCredentials)
		},
		timeout: resourceSettings.timeOut,
		error: function(objAJAXRequest, strError){
			switch (objAJAXRequest.status)
			{
				case 401:
					show_editor_loader_messageCalendar(inputForm, 'message_error', errBegin.replace('%%', localization[globalInterfaceLanguage].errHttp401));
					break;
				case 403:
					show_editor_loader_messageCalendar(inputForm, 'message_error', errBegin.replace('%%', localization[globalInterfaceLanguage].errHttp403));
					break;
				case 405:
					show_editor_loader_messageCalendar(inputForm, 'message_error', errBegin.replace('%%', localization[globalInterfaceLanguage].errHttp405));
					break;
				case 408:
					show_editor_loader_messageCalendar(inputForm, 'message_error', errBegin.replace('%%', localization[globalInterfaceLanguage].errHttp408));
					break;
				case 410:
				if(inputForm=='vevent')
					show_editor_loader_messageCalendar(inputForm, 'message_error', errBegin.replace('%%', localization[globalInterfaceLanguage].CalDAVerrHttp410));
				else
					show_editor_loader_messageCalendar(inputForm, 'message_error', errBegin.replace('%%', localization[globalInterfaceLanguage].CalDAVerrTodoHttp410));
					break;
				case 500:
					show_editor_loader_messageCalendar(inputForm, 'message_error', errBegin.replace('%%', localization[globalInterfaceLanguage].errHttp500));
					break;
				default:
					show_editor_loader_messageCalendar(inputForm, 'message_error', errBegin.replace('%%', localization[globalInterfaceLanguage].errHttpCommon.replace('%%', objAJAXRequest.status)));
					break;
			}
			return false;
		},
		beforeSend: function(req)
		{
			if((typeof globalUseJqueryAuth=='undefined' || globalUseJqueryAuth!=true) && resourceSettings.userAuth.userName!='' && resourceSettings.userAuth.userPassword!='')
				req.setRequestHeader('Authorization', basicAuth(resourceSettings.userAuth.userName, resourceSettings.userAuth.userPassword));

			req.setRequestHeader('X-client', globalXClientHeader);
		},
		username: (typeof globalUseJqueryAuth!='undefined' && globalUseJqueryAuth==true ? resourceSettings.userAuth.userName : null),
		password: (typeof globalUseJqueryAuth!='undefined' && globalUseJqueryAuth==true ? resourceSettings.userAuth.userPassword : null),
		contentType: 'text/calendar',
		processData: true,
		data: '',
		dataType: 'text',
		complete: function(text, textStatus){
			switch(textStatus)
			{
				case 'success' :
				case 'nocontent':
				if(inputForm=='vevent')
					globalEventList.removeOldEvent(inputUID, true, true);
				else if(putMode)
					globalEventList.removeOldEvent(inputUID, true, false);
				if(putMode)
					return true;

				if(inputForm=='vevent')
				{
					show_editor_loader_messageCalendar('vevent', 'message_success', localization[globalInterfaceLanguage].txtAllDeleted, function(a)
					{
						//setTimeout(function()
						//{
							$('#show').val('');
							$('#CAEvent').hide();
							$('#event_details_template').remove();
							$('#CAEvent').append(cleanVcalendarTemplate);
							$('#EventDisabler').fadeOut(globalEditorFadeAnimation, function(){
								$('#timezonePicker').prop('disabled', false);
							});
							
						//}, a);
					});
				}
				else
				{
					show_editor_loader_messageCalendar('vtodo', 'message_success', localization[globalInterfaceLanguage].txtAllDeletedTodo, function(a)
					{
						//setTimeout(function()
						//{
							$('#showTODO').val('');
-							$('#TodoDisabler').fadeOut(globalEditorFadeAnimation, function(){
								$('#timezonePickerTODO').prop('disabled', false);
							});
							globalEventList.removeOldEvent(inputUID, true, false);
						//}, a);
					});
				}
				return true;
			}
			return false;
		}
	});
}

function putVcalendarToCollection(accountUID, inputUID, inputEtag, inputVcalendar, delUID,inputForm,isFormHidden,deleteMode,textArray)
{
	var resultTimestamp=new Date().getTime();

	var hex=hex_sha256(inputVcalendar+(new Date().getTime()));

	var tmp=inputUID.match(RegExp('^(https?://)([^@/]+(?:@[^@/]+)?)@([^/]+)(.*/)([^/]+/)([^/]*)', 'i'));
	var collection_uid=tmp[1]+tmp[2]+'@'+tmp[3]+tmp[4]+tmp[5];

	// if inputEtag is empty, we have a newly created vevent/vtodo and need to create a .ics file name for it
	if(inputEtag!='')
	{
		var put_href=tmp[1]+tmp[3]+tmp[4]+tmp[5]+tmp[6];
		var put_href_part=tmp[4]+tmp[5]+tmp[6];
	}
	else
	{
		if(inputUID.charAt(inputUID.length-1)!='/')
		{
			var put_href=tmp[1]+tmp[3]+tmp[4]+tmp[5]+tmp[6];
			var put_href_part=tmp[4]+tmp[5]+tmp[6];
		}
		else
		{
			var vcalendarFile=hex+'.ics';
			var put_href=tmp[1]+tmp[3]+tmp[4]+tmp[5]+vcalendarFile;
			var put_href_part=tmp[4]+tmp[5]+vcalendarFile;
			inputUID+=vcalendarFile;
		}
	}
	var resourceSettings=null;

	// find the original settings for the resource and user
	var tmp=accountUID.match(RegExp('^(https?://)([^@/]+(?:@[^@/]+)?)@([^/]+)(.*/)', 'i'));

	var resourceCalDAV_href=tmp[1]+tmp[3]+tmp[4];
	var resourceCalDAV_user=tmp[2];

	for(var i=0;i<globalAccountSettings.length;i++)
		if(globalAccountSettings[i].href==resourceCalDAV_href && globalAccountSettings[i].userAuth.userName==resourceCalDAV_user)
			resourceSettings=globalAccountSettings[i];

	if(resourceSettings==null)
		return false;

	// the begin of each error message
	if(inputForm=='vevent')
		var errBegin=localization[globalInterfaceLanguage].errUnableSaveBeginCalDAV;
	else
		var errBegin=localization[globalInterfaceLanguage].errUnableSaveTodoBeginCalDAV;
	var collection=globalResourceCalDAVList.getEventCollectionByUID(collection_uid);
	if(collection==null)
		collection=globalResourceCalDAVList.getTodoCollectionByUID(collection_uid);
	var vcalendarList=new Array();
	$.ajax({
		type: 'PUT',
		url: put_href,
		cache: false,
		crossDomain: (typeof resourceSettings.crossDomain=='undefined' ? true: resourceSettings.crossDomain),
		xhrFields: {
			withCredentials: (typeof resourceSettings.withCredentials=='undefined' ? false: resourceSettings.withCredentials)
		},
		timeout: resourceSettings.timeOut,
		error: function(objAJAXRequest, strError)
		{
			switch (objAJAXRequest.status)
			{
				case 401:
					show_editor_loader_messageCalendar(inputForm, 'message_error', errBegin.replace('%%', localization[globalInterfaceLanguage].errHttp401));
					break;
				case 403:
					show_editor_loader_messageCalendar(inputForm, 'message_error', errBegin.replace('%%', localization[globalInterfaceLanguage].errHttp403));
					break;
				case 405:
					show_editor_loader_messageCalendar(inputForm, 'message_error', errBegin.replace('%%', localization[globalInterfaceLanguage].errHttp405));
					break;
				case 408:
					show_editor_loader_messageCalendar(inputForm, 'message_error', errBegin.replace('%%', localization[globalInterfaceLanguage].errHttp408));
					break;
				case 412:
					show_editor_loader_messageCalendar(inputForm, 'message_error', errBegin.replace('%%', localization[globalInterfaceLanguage].errHttp412));
					netLoadCalendar(globalResourceCalDAVList.getCollectionByUID(collection_uid), [{etag: '', href: put_href_part}], (collection.forceSyncPROPFIND==undefined || collection.forceSyncPROPFIND==false ? true : false), false, true,true, null, null);
					break;
				case 500:
					show_editor_loader_messageCalendar(inputForm, 'message_error', errBegin.replace('%%', localization[globalInterfaceLanguage].errHttp500));
					break;
				default:
					show_editor_loader_messageCalendar(inputForm, 'message_error', errBegin.replace('%%', localization[globalInterfaceLanguage].errHttpCommon.replace('%%', objAJAXRequest.status)));
					break;
			}
			if(inputForm=='vevent' && globalRevertFunction!='')
			{
				globalRevertFunction();
				globalCalDAVQs.cache();
				globalCalDAVTODOQs.cache();
				globalRevertFunction='';
			}
			return false;
		},
		beforeSend: function(req)
		{
			if((typeof globalUseJqueryAuth=='undefined' || globalUseJqueryAuth!=true) && resourceSettings.userAuth.userName!='' && resourceSettings.userAuth.userPassword!='')
				req.setRequestHeader('Authorization', basicAuth(resourceSettings.userAuth.userName, resourceSettings.userAuth.userPassword));

			req.setRequestHeader('X-client', globalXClientHeader);
			if(inputEtag!='')
				req.setRequestHeader('If-Match', inputEtag);
			else // adding new object
				req.setRequestHeader('If-None-Match', '*');
		},
		username: (typeof globalUseJqueryAuth!='undefined' && globalUseJqueryAuth==true ? resourceSettings.userAuth.userName : null),
		password: (typeof globalUseJqueryAuth!='undefined' && globalUseJqueryAuth==true ? resourceSettings.userAuth.userPassword : null),
		contentType: 'text/calendar',
		processData: true,
		data: inputVcalendar,
		dataType: 'text',
		complete: function(jqXHR, textStatus){
		switch(textStatus)
		{
			case 'success' :
			case 'nocontent':
			
				globalRevertFunction='';
				if(delUID!='')
					deleteVcalendarFromCollection(delUID,inputForm, true);
				
				if(textArray.length>0)
				{
					var tArr = textArray[0];
					textArray.splice(0,1);
					putVcalendarToCollection(accountUID, inputUID.substring(0, inputUID.lastIndexOf('/')+1), '', tArr, delUID,inputForm,isFormHidden,deleteMode,textArray)
				}
				var newEtag=jqXHR.getResponseHeader('Etag');
				var isTODO=false;
				globalWindowFocus=false;
				if(inputForm=='vevent')
				{
					var eventSuccessMessage=localization[globalInterfaceLanguage].txtAllSaved;
					if(deleteMode)
						eventSuccessMessage=localization[globalInterfaceLanguage].txtAllDeleted;

					show_editor_loader_messageCalendar(inputForm, 'message_success', eventSuccessMessage, function(a){
						//setTimeout(function(){
							$('#show').val('');
							if(isFormHidden!=true)
							{
								$('#CAEvent').hide();
								$('#calendar').fullCalendar('unselect');
								$('#event_details_template').remove();
								$('#CAEvent').append(cleanVcalendarTemplate);
								$('#EventDisabler').fadeOut(globalEditorFadeAnimation, function(){
								$('#timezonePicker').prop('disabled', true);
								});
							}
						//}, a);
					});
				}
				else
				{
					var todoSuccessMessage=localization[globalInterfaceLanguage].txtAllSavedTodo;
					if(deleteMode)
						todoSuccessMessage=localization[globalInterfaceLanguage].txtAllDeletedTodo;
					show_editor_loader_messageCalendar(inputForm, 'message_success', todoSuccessMessage, function(a){
							//setTimeout(function(){
								$('#showTODO').val('');
								$('#TodoDisabler').fadeOut(globalEditorFadeAnimation, function(){
									$('#timezonePickerTODO').prop('disabled', false);
								});
								
							//}, a);
						});
				}
				if(newEtag!=null)
				{
					rid=inputUID.substring(0, inputUID.lastIndexOf('/')+1);
					if(inputForm=='vevent')
					{
						var resources=globalResourceCalDAVList.collections;
						for(var j=0;j<resources.length;j++)
						{
							if(rid==resources[j].uid)
							{
								if(inputVcalendar!='')
									var vcalendar_clean=vCalendarCleanup(inputVcalendar);
								else
									return true;
								globalEventList.insertEvent(true, resources[j], {isRepeat: false, isTODO: false, untilDate: '', sortStart: '', start: '', end: '', sortkey: '', timestamp: resultTimestamp, accountUID: resources[j].accountUID, uid: inputUID, displayValue: resources[j].displayvalue, evcolor: resources[j].ecolor, etag: newEtag, vcalendar: vcalendar_clean}, true, true,false);									
								break;
							}
						}
					}
					else
					{
						var resources=globalResourceCalDAVList.TodoCollections;
						for(var j=0;j<resources.length;j++)
						{
							if(rid==resources[j].uid)
							{
								if(inputVcalendar!='')
									var vcalendar_clean=vCalendarCleanup(inputVcalendar);
								else
									return true;
								$('#showTODO').val(inputUID);
								
								globalEventList.insertEvent(true, resources[j], {isRepeat: false, isTODO: false, untilDate: '', sortStart: '', start: '', end: '', sortkey: '', timestamp: resultTimestamp, accountUID: resources[j].accountUID, uid: inputUID, displayValue: resources[j].displayvalue, evcolor: resources[j].ecolor, etag: newEtag, vcalendar: vcalendar_clean}, true, false,false);
								if(inputEtag=='')
									$('#todoList').fullCalendar('selectEvent',$('[data-id="'+inputUID+'"]'));
								break;
							}
						}
					}
					
				}
				else
				{
					if(inputForm=='vevent')
						netLoadCalendar(globalResourceCalDAVList.getEventCollectionByUID(collection_uid), [{etag: '', href: put_href_part}], (collection.forceSyncPROPFIND==undefined || collection.forceSyncPROPFIND==false ? true : false), false, true, true, null, null);
					else
					{
						$('#showTODO').val(inputUID);
						netLoadCalendar(globalResourceCalDAVList.getTodoCollectionByUID(collection_uid), [{etag: '', href: put_href_part}], (collection.forceSyncPROPFIND==undefined || collection.forceSyncPROPFIND==false ? true : false), false, true, true, null, null);
					}
				}
				globalWindowFocus=true;

				return true;
				break;
			default:
				if(inputForm=='vevent' && globalRevertFunction!='')
				{
					globalRevertFunction();
					globalCalDAVQs.cache();
					globalCalDAVTODOQs.cache();
					globalRevertFunction='';
				}
				break;
		}
			return false;
		}
	});
}

/*
Permissions (from the davical wiki):
	all - aggregate of all permissions
	read - grants basic read access to the principal or collection.
	unlock - grants access to write content (i.e. update data) to the collection, or collections of the principal.
	read-acl - grants access to read ACLs on the collection, or collections of the principal.
	read-current-user-privilege-set - grants access to read the current user's privileges on the collection, or collections of the   write-acl-grants access to writing ACLs on the collection, or collections of the principal.
	write - aggregate of write-properties, write-content, bind & unbind
	write-properties - grants access to update properties of the principal or collection. In DAViCal, when granted to a user principal, this will only grant access to update properties of the principal's collections and not the user principal itself. When granted to a group or resource principal this will grant access to update the principal properties.
	write - content-grants access to write content (i.e. update data) to the collection, or collections of the principal.
	bind - grants access to creating resources in the collection, or in collections of the principal. Created resources may be new collections, although it is an error to create collections within calendar collections.
	unbind - grants access to deleting resources (including collections) from the collection, or from collections of the principal.
*/


function CalDAVnetLoadCollection(inputCollection, forceLoad, recursiveIterator, collections)
{
	if(recursiveIterator>=collections.length)
	{
		if(!globalCalDAVInitLoad && isCalDAVLoaded)
			loadNextApplication(false);

		return false;
	}

	if(collections.length>0)
	{
		if(inputCollection.uid==undefined || inputCollection.subscription || !inputCollection.syncRequired)
		{
			if(inputCollection.subscription && inputCollection.syncRequired && inputCollection.uid!=undefined)
			{
				netLoadCalendarSubscription(globalAccountSettings[0], inputCollection, recursiveIterator, forceLoad, collections);
			}

			recursiveIterator++;

			if(recursiveIterator>=collections.length && inputCollection.uid!='undefined' && inputCollection.listType=='vevent')
			{
				recursiveIterator=0;
					CalDAVnetLoadCollection(globalResourceCalDAVList.TodoCollections[0], forceLoad, 0, globalResourceCalDAVList.TodoCollections);
			}
			else
				CalDAVnetLoadCollection(collections[recursiveIterator], forceLoad, recursiveIterator, collections);

			if(inputCollection.uid!=undefined)
			{
				if(!inputCollection.syncRequired && globalCalDAVInitLoad)
				{
					if(inputCollection.listType=='vtodo')
						$('#ResourceCalDAVTODOList [data-id="'+inputCollection.uid+'"]').removeClass('r_operate');
					else
						$('#ResourceCalDAVList [data-id="'+inputCollection.uid+'"]').removeClass('r_operate');
					
					globalAccountSettings[inputCollection.resourceIndex].todoNo--;
						if((globalAccountSettings[inputCollection.resourceIndex].calendarNo==0 && globalAccountSettings[inputCollection.resourceIndex].todoNo==0 && globalCalDAVInitLoad) || !globalCalDAVInitLoad)
							updateMainLoader();
				}
			}
			return false;
		}
	}
	var resourceSettings=null;
	// find the original settings for the resource and user
	var tmp=inputCollection.accountUID.match(RegExp('^(https?://)([^@/]+(?:@[^@/]+)?)@([^/]+)(.*/)', 'i'));

	var resourceCalDAV_href=tmp[1]+tmp[3]+tmp[4];
	var resourceCalDAV_user=tmp[2];

	for(var i=0;i<globalAccountSettings.length;i++)
		if(globalAccountSettings[i].href==resourceCalDAV_href && globalAccountSettings[i].userAuth.userName==resourceCalDAV_user)
			resourceSettings=globalAccountSettings[i];

	// POROVNAT S TYM AKO JE TO V CARDDAVMATE
	updateMainLoaderText();

	if(inputCollection.forceSyncPROPFIND!=undefined && inputCollection.forceSyncPROPFIND==true)
		var requestText='<?xml version="1.0" encoding="utf-8"?><D:propfind xmlns:D="DAV:"><D:prop><D:getcontenttype/><D:getetag/></D:prop></D:propfind>';
	else	// if inputCollection.forceSyncPROPFIND is undefined or false
		var requestText='<?xml version="1.0" encoding="utf-8"?><D:sync-collection xmlns:D="DAV:"><D:prop><D:getcontenttype/><D:getetag/></D:prop><D:sync-level>1</D:sync-level>'+(forceLoad==true || inputCollection.syncToken==undefined || inputCollection.syncToken=='' ? '<D:sync-token/>' : '<D:sync-token>'+inputCollection.syncToken+'</D:sync-token>')+'</D:sync-collection>';
	
	$.ajax({
		type: (inputCollection.forceSyncPROPFIND!=undefined && inputCollection.forceSyncPROPFIND==true ? 'PROPFIND' : 'REPORT'),
		url: 	inputCollection.url+inputCollection.href,
		cache: false,
		crossDomain: (typeof inputCollection.crossDomain=='undefined' ? true: inputCollection.crossDomain),
		xhrFields: {
			withCredentials: (typeof inputCollection.withCredentials=='undefined' ? false: inputCollection.withCredentials)
		},
		timeout: inputCollection.timeOut,
		error: function(objAJAXRequest, strError){
			if((objAJAXRequest.status==400 /* bad request */ || objAJAXRequest.status==403 /* forbidden (for stupid servers) */ || objAJAXRequest.status==501 /* unimplemented */) && inputCollection.forceSyncPROPFIND!=true /* prevent recursion */)
			{
				collections[recursiveIterator].forceSyncPROPFIND=true;
				globalCalendarNumberCount--;
				CalDAVnetLoadCollection(collections[recursiveIterator], forceLoad, recursiveIterator, collections);
				return true;
			}
			else
			{
				if(collections.length>0)
				{
					recursiveIterator++;
					if(recursiveIterator>=collections.length && inputCollection.uid!='undefined' && inputCollection.listType=='vevent')
					{
						recursiveIterator=0;
						CalDAVnetLoadCollection(globalResourceCalDAVList.TodoCollections[0], forceLoad, 0, globalResourceCalDAVList.TodoCollections);
					}
					else
						CalDAVnetLoadCollection(collections[recursiveIterator], forceLoad, recursiveIterator, collections);
				}

				if(inputCollection.listType=='vevent')
					$('#ResourceCalDAVList [data-id="'+inputCollection.uid+'"]').removeClass('r_operate');
				else
					$('#ResourceCalDAVTODOList [data-id="'+inputCollection.uid+'"]').removeClass('r_operate');
					
				$('#SystemCalDAV .fc-header-center').addClass('r_error_all');	
				$('[data-id="'+inputCollection.uid+'"]').addClass('r_error');
				
				if(inputCollection.typeList.indexOf('vevent')!=-1)
					globalAccountSettings[inputCollection.resourceIndex].calendarNo--;
				else if(inputCollection.typeList.indexOf('vtodo')!=-1)
					globalAccountSettings[inputCollection.resourceIndex].todoNo--;
				if((globalAccountSettings[inputCollection.resourceIndex].calendarNo==0 && globalAccountSettings[inputCollection.resourceIndex].todoNo==0 && globalCalDAVInitLoad) || !globalCalDAVInitLoad)
					updateMainLoader();

				console.log("Error: [CalDAVnetLoadCollection: '"+inputCollection.url+inputCollection.href+"'] code: '"+objAJAXRequest.status+"'"+(objAJAXRequest.status==0 ? ' - see http://www.inf-it.com/'+globalAppName.toLowerCase()+'/misc/readme_network.txt' : ''));
				return false;
			}
		},
		beforeSend: function(req){
			if((typeof globalUseJqueryAuth=='undefined' || globalUseJqueryAuth!=true) && inputCollection.userAuth.userName!='' && inputCollection.userAuth.userPassword!='')
				req.setRequestHeader('Authorization', basicAuth(inputCollection.userAuth.userName, inputCollection.userAuth.userPassword));

			req.setRequestHeader('X-client', globalXClientHeader);
			req.setRequestHeader('Depth', '1');
			if(typeof isSettingsAvaible!='undefined' && isSettingsAvaible!=null && $('#SystemSettings').css('visibility')=='visible' && $('.resourceSettings.resourceSettings_selected').attr('data-type')=='Password')
			{
				if(collections.length>0)
				{
					recursiveIterator++;
					if(recursiveIterator>=collections.length && inputCollection.uid!='undefined' && inputCollection.listType=='vevent')
					{
						recursiveIterator=0;
						CalDAVnetLoadCollection(globalResourceCalDAVList.TodoCollections[0], forceLoad, 0, globalResourceCalDAVList.TodoCollections);
					}
					else
						CalDAVnetLoadCollection(collections[recursiveIterator], forceLoad, recursiveIterator, collections);
				}
				return false;
			}
		},
		username: (typeof globalUseJqueryAuth!='undefined' && globalUseJqueryAuth==true ? inputCollection.userAuth.userName : null),
		password: (typeof globalUseJqueryAuth!='undefined' && globalUseJqueryAuth==true ? inputCollection.userAuth.userPassword : null),
		contentType: 'text/xml; charset=utf-8',
		processData: true,
		data: requestText,
		dataType: 'xml',
		complete: function(xml, textStatus)
		{
			if(textStatus!='success')
				return false;

			$('[data-id="'+inputCollection.uid+'"]').removeClass('r_error');

			if($('.r_error').length==0)
				$('#SystemCalDAV .fc-header-center').removeClass('r_error_all');

			var vcalendarList=new Array();
			$(xml.responseXML).children().filterNsNode('multistatus').children().filterNsNode(new RegExp('^(sync-)?response$')).each(
				function(index, element)
				{
					var hrefVal=$(element).children().filterNsNode('href').text();
					var etagVal=$(element).children().filterNsNode('propstat').children().filterNsNode('prop').children().filterNsNode('getetag').text();

					var allowContent=false;
					// checkContentType is undocumented but useful if somebody needs to disable it (wrong server response, etc.) 
					if(inputCollection.checkContentType!=false)
					{
						var contenttypeVal=$(element).children().filterNsNode('propstat').children().filterNsNode('prop').children().filterNsNode('getcontenttype').text();
						if(contenttypeVal!=undefined)
						{
							contenttypeValArr=contenttypeVal.toLowerCase().replace(RegExp(' ','g'),'').split(';');
							if(contenttypeValArr.indexOf('text/calendar')!=-1 || contenttypeValArr.indexOf('text/x-vcalendar')!=-1)
								allowContent=true;
						}
					}
					else
						allowContent=true;

					var result=$(element).find('*').filterNsNode('status').text();	// note for 404 there is no propstat!
					var match=false;
					if(hrefVal[hrefVal.length-1]!='/')	/* Google CalDAV problem with resource URL if content type checking is disabled */
					{
						if(allowContent==true)
						{
							if(result.match(RegExp('200 OK$'))) // HTTP OK
							{
								vcalendarList[vcalendarList.length]={etag: etagVal, href: hrefVal};
								match=true;
							}
						}
						if(!match && result.match(RegExp('404 Not Found$'))) // HTTP Not Found
							vcalendarList[vcalendarList.length]={deleted: true, etag: etagVal, href: hrefVal};
					}
				}
			);

			// store the syncToken
			if(inputCollection.forceSyncPROPFIND==undefined || inputCollection.forceSyncPROPFIND==false)
				inputCollection.syncToken=$(xml.responseXML).children().filterNsNode('multistatus').children().filterNsNode('sync-token').text();
		
			netLoadCalendar(inputCollection, vcalendarList, (inputCollection.forceSyncPROPFIND==undefined || inputCollection.forceSyncPROPFIND==false ? true : false), true, forceLoad, false, recursiveIterator, collections);

			vcalendarList=null;
			if(typeof globalParallelAjaxCallCalDAVEnabled!='undefined' && globalParallelAjaxCallCalDAVEnabled!=null && globalParallelAjaxCallCalDAVEnabled)
			{
				if(collections.length>0)
				{
					recursiveIterator++;
					if(recursiveIterator>=collections.length && inputCollection.uid!='undefined' && inputCollection.listType=='vevent')
					{
						recursiveIterator=0;
						CalDAVnetLoadCollection(globalResourceCalDAVList.TodoCollections[0], forceLoad, 0, globalResourceCalDAVList.TodoCollections);
					}
					else
						CalDAVnetLoadCollection(collections[recursiveIterator], forceLoad, recursiveIterator, collections);
				}
			}
		}
	});
}

function netLoadCalendar(inputCollection, vcalendarList, syncReportSupport,  removeUntouched, forceLoad, forceCall, recursiveIterator, collections)
{
	var vcalendarChangedList=new Array();
	var rid='';
	var resultTimestamp=new Date().getTime();
	if(!inputCollection.subscription)
	{
		if(syncReportSupport==true)
		{
			if(inputCollection.listType=='vevent')
				var isEvent = true;
			else
				var isEvent = false;
			for(var i=0;i<vcalendarList.length;i++)
				if(vcalendarList[i].deleted==true)
					globalEventList.removeOldEvent(inputCollection.uid+vcalendarList[i].href.replace(RegExp('.*/', ''), ''), true, isEvent);
				else
					vcalendarChangedList[vcalendarChangedList.length]=vcalendarList[i].href;
		}
		else	// no sync-collection REPORT supported (we need to delete vevents/vtodos by timestamp comparison)
		{
			for(var i=0;i<vcalendarList.length;i++)
			{
				var uid=inputCollection.uid+vcalendarList[i].href.replace(RegExp('.*/',''),'');
				if(!globalEventList.checkAndTouchIfExists(inputCollection.uid,uid,vcalendarList[i].etag,resultTimestamp))
					vcalendarChangedList[vcalendarChangedList.length]=vcalendarList[i].href;
			}
			if(inputCollection.listType=='vevent')
				var isEvent = true;
			else
				var isEvent = false;
			globalEventList.removeOldEvents(inputCollection.uid, resultTimestamp, isEvent);
		}

		// not loaded vCalendars from the last multiget (if any)
		if(recursiveIterator!=null)
			if(collections[recursiveIterator]!=undefined)
				if(collections[recursiveIterator].pastUnloaded!=undefined && collections[recursiveIterator].pastUnloaded!=null && collections[recursiveIterator].pastUnloaded.length>0)
					vcalendarChangedList=vcalendarChangedList.concat(collections[recursiveIterator].pastUnloaded).sort().unique();

		// if nothing is changed on server return
		if(vcalendarChangedList.length==0)
		{
			if(forceLoad)
			{
				if(inputCollection.listType=='vevent')
					$('#ResourceCalDAVList [data-id="'+inputCollection.uid+'"]').removeClass('r_operate');
				else
					$('#ResourceCalDAVTODOList [data-id="'+inputCollection.uid+'"]').removeClass('r_operate');
				
				if(inputCollection.typeList.indexOf('vevent')!=-1)
					globalAccountSettings[inputCollection.resourceIndex].calendarNo--;
				else if(inputCollection.typeList.indexOf('vtodo')!=-1)
					globalAccountSettings[inputCollection.resourceIndex].todoNo--;

				if((globalAccountSettings[inputCollection.resourceIndex].calendarNo==0 && globalAccountSettings[inputCollection.resourceIndex].todoNo==0  && globalCalDAVInitLoad) || !globalCalDAVInitLoad)
					updateMainLoader();
			}
			
			if((typeof globalParallelAjaxCallCalDAVEnabled=='undefined' || globalParallelAjaxCallCalDAVEnabled==null || !globalParallelAjaxCallCalDAVEnabled) && collections.length>0)
			{
				recursiveIterator++;
				if(recursiveIterator>=collections.length && inputCollection.uid!='undefined' && inputCollection.listType=='vevent')
				{
					recursiveIterator=0;
					CalDAVnetLoadCollection(globalResourceCalDAVList.TodoCollections[0], forceLoad, 0, globalResourceCalDAVList.TodoCollections);
				}
				else
					CalDAVnetLoadCollection(collections[recursiveIterator], forceLoad, recursiveIterator, collections);
			}
			return true;
		}
	}
	else
	{
		var evCount=0;
		for(c in vcalendarList)
			if(vcalendarList[c].etag!=undefined && vcalendarList[c].etag!=null)
				evCount++;
		globalResourceCalDAVList.counterList[inputCollection.uid].collectionLength=evCount;
		globalResourceCalDAVList.counterList[inputCollection.uid].counter=0;
		globalResourceCalDAVList.counterList[inputCollection.uid].resourceIndex=inputCollection.resourceIndex;
		globalResourceCalDAVList.counterList[inputCollection.uid].listType=inputCollection.listType;
		globalResourceCalDAVList.counterList[inputCollection.uid].typeList=inputCollection.typeList;
		
//		if(inputCollection.listType=='vevent')
//			$('#ResourceCalDAVList [data-id="'+inputCollection.uid+'"]').addClass('r_operate');
//		else
//			$('#ResourceCalDAVTODOList [data-id="'+inputCollection.uid+'"]').addClass('r_operate');

		if($('.r_operate_all').length==0)
			$('#SystemCalDAV .fc-header-center ').addClass('r_operate_all');
		
		for(eventUID in vcalendarList)
		{
			if(vcalendarList[eventUID].etag==undefined || vcalendarList[eventUID]==null)
				continue;
			var etag=vcalendarList[eventUID].etag;
			var uid=vcalendarList[eventUID].href;
			var vcalendar_raw=vcalendarList[eventUID].eventText;
			if(vcalendar_raw!='')
				var vcalendar_clean=vCalendarCleanup(vcalendar_raw);
			else
			{
				checkEventLoader(globalResourceCalDAVList.counterList[inputCollection.uid],false);
				return true;
			}
			if((check=vcalendar_clean.match(vCalendar.pre['vevent']))!=null)
			{
				if(inputCollection.typeList.indexOf('vevent')!=-1)
					globalEventList.insertEvent(forceCall,inputCollection, {threadChange: '', isRepeat: false, isDrawn: false, isTODO: false, untilDate: '', sortStart: '', start: '', end: '', sortkey: '', timestamp: resultTimestamp, accountUID: inputCollection.accountUID, uid: uid, displayValue: inputCollection.displayvalue, evcolor: inputCollection.ecolor, counter: 0, etag: etag, vcalendar:  'BEGIN:VCALENDAR'+vcalendar_clean+ 'END:VCALENDAR\r\n'}, false, true,true);	// when the inputMode=='sync' we force reload the vevent/vtodo
				else
				{
					checkEventLoader(globalResourceCalDAVList.counterList[inputCollection.uid],false);
				}
			}
			else if((check=vcalendar_clean.match(vCalendar.pre['vtodo']))!=null)
			{
				if(inputCollection.typeList.indexOf('vtodo')!=-1)
					globalEventList.insertEvent(forceCall, inputCollection, {threadChange: '', isRepeat: false, isDrawn: false, isTODO: false, untilDate: '', sortStart: '', start: '', end: '', sortkey: '', timestamp: resultTimestamp, accountUID: inputCollection.accountUID, uid: uid, displayValue: inputCollection.displayvalue, evcolor: inputCollection.ecolor, counter: 0, etag: etag, vcalendar:  'BEGIN:VCALENDAR'+vcalendar_clean+ 'END:VCALENDAR\r\n'}, false, false,true);	// when the inputMode=='sync' we force reload the vevent/vtodo
				else
				{
					checkEventLoader(globalResourceCalDAVList.counterList[inputCollection.uid],false);
				}
			}
			else 
			{
				console.log("Error: '"+uid+"': cannot parse vEvent or vTodo");
				checkEventLoader(globalResourceCalDAVList.counterList[inputCollection.uid],false);
			}
		}

		if(evCount==0)
		{
			if(inputCollection.listType=='vevent')
				$('#ResourceCalDAVList [data-id="'+inputCollection.uid+'"]').removeClass('r_operate');
			else
				$('#ResourceCalDAVTODOList [data-id="'+inputCollection.uid+'"]').removeClass('r_operate');
			
			if(inputCollection.typeList.indexOf('vevent')!=-1)
					globalAccountSettings[inputCollection.resourceIndex].calendarNo--;
			else if(inputCollection.typeList.indexOf('vtodo')!=-1)
				globalAccountSettings[inputCollection.resourceIndex].todoNo--;
			if((globalAccountSettings[inputCollection.resourceIndex].calendarNo==0 && globalAccountSettings[inputCollection.resourceIndex].todoNo==0 && globalCalDAVInitLoad) || !globalCalDAVInitLoad)
				updateMainLoader();
		}
		
		return false;
	}
	if($('.r_operate_all').length==0)
		$('#SystemCalDAV .fc-header-center ').addClass('r_operate_all');

	multigetData='<?xml version="1.0" encoding="utf-8"?><L:calendar-multiget xmlns:D="DAV:" xmlns:L="urn:ietf:params:xml:ns:caldav"><D:prop><D:getetag/><L:calendar-data/></D:prop><D:href>'+vcalendarChangedList.join('</D:href><D:href>')+'</D:href></L:calendar-multiget>';
	var returnValue=false;
	$.ajax({
		type: 'REPORT',
		url: inputCollection.url+inputCollection.href,
		cache: false,
		crossDomain: (typeof inputCollection.crossDomain=='undefined' ? true: inputCollection.crossDomain),
		xhrFields: {
			withCredentials: (typeof inputCollection.withCredentials=='undefined' ? false: inputCollection.withCredentials)
		},
		timeout: inputCollection.timeOut,
		error: function(objAJAXRequest, strError) {
			// unable to load vcalendars, try to load them next time
			if(recursiveIterator!=null)
				if(collections[recursiveIterator].pastUnloaded!=null && inputCollection.pastUnloaded!=undefined)
					collections[recursiveIterator].pastUnloaded=vcalendarChangedList;

			console.log("Error: [netLoadCalendar: '"+inputCollection.url+inputCollection.href+"'] code: '"+objAJAXRequest.status+"'"+(objAJAXRequest.status==0 ? ' - see http://www.inf-it.com/'+globalAppName.toLowerCase()+'/misc/readme_network.txt' : ''));
			if(inputCollection.listType=='vevent')
				$('#ResourceCalDAVList [data-id="'+inputCollection.uid+'"]').removeClass('r_operate');
			else
				$('#ResourceCalDAVTODOList [data-id="'+inputCollection.uid+'"]').removeClass('r_operate');
			$('#SystemCalDAV .fc-header-center').addClass('r_error_all');	
			$('[data-id="'+inputCollection.uid+'"]').addClass('r_error');
			
			if(inputCollection.typeList.indexOf('vevent')!=-1)
				globalAccountSettings[inputCollection.resourceIndex].calendarNo--;
			else if(inputCollection.typeList.indexOf('vtodo')!=-1)
				globalAccountSettings[inputCollection.resourceIndex].todoNo--;

			if((globalAccountSettings[inputCollection.resourceIndex].calendarNo==0 && globalAccountSettings[inputCollection.resourceIndex].todoNo==0 && globalCalDAVInitLoad) || !globalCalDAVInitLoad)
				updateMainLoader();
			
			if((typeof globalParallelAjaxCallCalDAVEnabled=='undefined' || globalParallelAjaxCallCalDAVEnabled==null || !globalParallelAjaxCallCalDAVEnabled) && collections.length>0)
			{
				recursiveIterator++;
				if(recursiveIterator>=collections.length && inputCollection.uid!='undefined' && inputCollection.listType=='vevent')
				{
					recursiveIterator=0;
					CalDAVnetLoadCollection(globalResourceCalDAVList.TodoCollections[0], forceLoad, 0, globalResourceCalDAVList.TodoCollections);
				}
				else
					CalDAVnetLoadCollection(collections[recursiveIterator], forceLoad, recursiveIterator, collections);
			}
			return false;
		},
		beforeSend: function(req){
			if((typeof globalUseJqueryAuth=='undefined' || globalUseJqueryAuth!=true) && inputCollection.userAuth.userName!='' && inputCollection.userAuth.userPassword!='')
				req.setRequestHeader('Authorization', basicAuth(inputCollection.userAuth.userName, inputCollection.userAuth.userPassword));

			req.setRequestHeader('X-client', globalXClientHeader);
		},
		username: (typeof globalUseJqueryAuth!='undefined' && globalUseJqueryAuth==true ? inputCollection.userAuth.userName : null),
		password: (typeof globalUseJqueryAuth!='undefined' && globalUseJqueryAuth==true ? inputCollection.userAuth.userPassword : null),
		contentType: 'text/xml',
		processData: true,
		data: multigetData,
		dataType: 'xml',
		complete: function(xml, textStatus){
			if(textStatus!='success')
				return false;
			var hrefCounter = 0;
			$(xml.responseXML).children().filterNsNode('multistatus').children().filterNsNode('response').children().filterNsNode('href').each(function(index, element){
				hrefCounter++;
			});
			globalResourceCalDAVList.counterList[inputCollection.uid].collectionLength=hrefCounter;
			globalResourceCalDAVList.counterList[inputCollection.uid].counter=0;
			globalResourceCalDAVList.counterList[inputCollection.uid].resourceIndex=inputCollection.resourceIndex;
			globalResourceCalDAVList.counterList[inputCollection.uid].listType=inputCollection.listType;
			globalResourceCalDAVList.counterList[inputCollection.uid].typeList=inputCollection.typeList;
			
			var isXMLEmpty=true;
			$(xml.responseXML).children().filterNsNode('multistatus').children().filterNsNode('response').each(function(index, element){
				if($(element).children().filterNsNode('propstat').children().filterNsNode('status').text().match(RegExp('200 OK$'))) // HTTP OK
				{
					isXMLEmpty=false;
					var etag=$(element).children().filterNsNode('propstat').children().filterNsNode('prop').children().filterNsNode('getetag').text();
					var uid=inputCollection.uid+$(element).children().filterNsNode('href').text().replace(RegExp('.*/', ''), '');
					var vcalendar_raw=$(element).children().filterNsNode('propstat').children().filterNsNode('prop').children().filterNsNode('calendar-data').text();
					if(vcalendar_raw!='')
						var vcalendar_clean=vCalendarCleanup(vcalendar_raw);
					else
					{
						checkEventLoader(globalResourceCalDAVList.counterList[inputCollection.uid],false);
						return true;
					}
					if((vcalendar_clean==undefined) || ((check=vcalendar_clean.match(vCalendar.pre['vcalendar']))==null))
					{
						checkEventLoader(globalResourceCalDAVList.counterList[inputCollection.uid],false);
						console.log("Error: '"+uid+"'': cannot parse vCalendar");
						return true;
					}
						
					if((check=vcalendar_clean.match(vCalendar.pre['vevent']))!=null)
					{
						if(inputCollection.typeList.indexOf('vevent')!=-1)
							globalEventList.insertEvent(forceCall,inputCollection, {threadChange: '', isRepeat: false, isDrawn: false, isTODO: false, untilDate: '', sortStart: '', start: '', end: '', sortkey: '', timestamp: resultTimestamp, accountUID: inputCollection.accountUID, uid: uid, displayValue: inputCollection.displayvalue, evcolor: inputCollection.ecolor, counter: 0, etag: etag, vcalendar: vcalendar_clean}, false, true,true);	// when the inputMode=='sync' we force reload the vevent/vtodo
						else
							checkEventLoader(globalResourceCalDAVList.counterList[inputCollection.uid],false);
					}
					else if((check=vcalendar_clean.match(vCalendar.pre['vtodo']))!=null)
					{
						if(inputCollection.typeList.indexOf('vtodo')!=-1)
							globalEventList.insertEvent(forceCall,inputCollection, {threadChange: '', isRepeat: false, isDrawn: false, isTODO: false, untilDate: '', sortStart: '', start: '', end: '', sortkey: '', timestamp: resultTimestamp, accountUID: inputCollection.accountUID, uid: uid, displayValue: inputCollection.displayvalue, evcolor: inputCollection.ecolor, counter: 0, etag: etag, vcalendar: vcalendar_clean}, false, false, true);	// when the inputMode=='sync' we force reload the vevent/vtodo
						else
							checkEventLoader(globalResourceCalDAVList.counterList[inputCollection.uid],false);
					}
					else 
					{
						console.log("Error: '"+uid+"'': cannot parse vEvent or vTodo");
						checkEventLoader(globalResourceCalDAVList.counterList[inputCollection.uid],false);
						return true;
					}
				}
				else
				{
					var uid=inputCollection.uid+$(element).children().filterNsNode('href').text().replace(RegExp('.*/', ''), '');
					console.log("Error: '"+uid+"'': cannot parse vEvent or vEvent");
					checkEventLoader(globalResourceCalDAVList.counterList[inputCollection.uid],false);
					return true;
				}
			});

			if(isXMLEmpty)
			{
				if(inputCollection.listType=='vevent')
					$('#ResourceCalDAVList [data-id="'+inputCollection.uid+'"]').removeClass('r_operate');
				else
					$('#ResourceCalDAVTODOList [data-id="'+inputCollection.uid+'"]').removeClass('r_operate');
					
				if(inputCollection.typeList.indexOf('vevent')!=-1)
					globalAccountSettings[inputCollection.resourceIndex].calendarNo--;
				else if(inputCollection.typeList.indexOf('vtodo')!=-1)
					globalAccountSettings[inputCollection.resourceIndex].todoNo--;
				if((globalAccountSettings[inputCollection.resourceIndex].calendarNo==0 && globalAccountSettings[inputCollection.resourceIndex].todoNo==0 && globalCalDAVInitLoad) || !globalCalDAVInitLoad)
					updateMainLoader();
			}
			if((typeof globalParallelAjaxCallCalDAVEnabled=='undefined' || globalParallelAjaxCallCalDAVEnabled==null || !globalParallelAjaxCallCalDAVEnabled) && collections.length>0)
			{
				
				recursiveIterator++;
				if(recursiveIterator>=collections.length && inputCollection.uid!='undefined' && inputCollection.listType=='vevent')
				{
					recursiveIterator=0;
					CalDAVnetLoadCollection(globalResourceCalDAVList.TodoCollections[0], forceLoad, 0, globalResourceCalDAVList.TodoCollections);
				}
				else
					CalDAVnetLoadCollection(collections[recursiveIterator], forceLoad, recursiveIterator, collections);
			}
		}
	});
}

function netLoadCalendarSubscription(inputResource, inputCollection, recursiveIterator, forceLoad, collections)
{
	
	updateMainLoaderText();
	$.ajax({
		type: 'GET',
		url: inputCollection.href,
		cache: false,
		crossDomain: false,
		timeout: 30000,
		error: function(objAJAXRequest, strError){
			console.log("Error: [netLoadCalendarSubscription: '"+inputResource.href+"'] code: '"+objAJAXRequest.status+"'");
			if(inputCollection.listType=='vevent')
					$('#ResourceCalDAVList [data-id="'+inputCollection.uid+'"]').removeClass('r_operate');
				else
					$('#ResourceCalDAVTODOList [data-id="'+inputCollection.uid+'"]').removeClass('r_operate');
					
				$('#SystemCalDAV .fc-header-center').addClass('r_error_all');	
				$('[data-id="'+inputCollection.uid+'"]').addClass('r_error');
				if(inputCollection.typeList.indexOf('vevent')!=-1)
					globalAccountSettings[inputCollection.resourceIndex].calendarNo--;
				else if(inputCollection.typeList.indexOf('vtodo')!=-1)
					globalAccountSettings[inputCollection.resourceIndex].todoNo--;
				if((globalAccountSettings[inputCollection.resourceIndex].calendarNo==0 && globalAccountSettings[inputCollection.resourceIndex].todoNo==0 && globalCalDAVInitLoad) || !globalCalDAVInitLoad)
					updateMainLoader();
			return false;
		},
		beforeSend: function(req) {
			if((typeof globalUseJqueryAuth=='undefined' || globalUseJqueryAuth!=true) && inputResource.userAuth.userName!='' && inputResource.userAuth.userPassword!='')
				req.setRequestHeader('Authorization', basicAuth(inputResource.userAuth.userName, inputResource.userAuth.userPassword));
		},
		username: (typeof globalUseJqueryAuth!='undefined' && globalUseJqueryAuth==true ? inputResource.userAuth.userName : null),
		password: (typeof globalUseJqueryAuth!='undefined' && globalUseJqueryAuth==true ? inputResource.userAuth.userPassword : null),
		contentType: 'text/plain',
		processData: true,
		data: '',
		dataType: 'text',
		complete: function(text,response)
		{
			if(response!='success')
				return false;
			
			var vcalendarText = vCalendarCleanup(text.responseText);
			inputCollection.urlArray={};
			
			if(inputCollection.typeList.indexOf('vevent')!=-1)
			{
				var parseCounter=0;
				while(vcalendarText.match(vCalendar.pre['vevent'])!=null)
				{
					var partEvent=vcalendarText.substring(vcalendarText.indexOf('BEGIN:VEVENT')-2,vcalendarText.indexOf('END:VEVENT')+'END:VEVENT'.length);
					var realEventUID=partEvent.match(vCalendar.pre['contentline_UID']);

					if(realEventUID!=null)
					{
						realEventUID=realEventUID[0].match(vCalendar.pre['contentline_parse'])[4];	
						realEventUID=realEventUID.replace('/','');
					}
					
					var hex = hex_sha256(partEvent);
					if(inputCollection.urlArray != null)
					{
						if(inputCollection.urlArray[inputCollection.uid+realEventUID+'.ics']!=null && inputCollection.urlArray[inputCollection.uid+realEventUID+'.ics']!=undefined)
							inputCollection.urlArray[inputCollection.uid+realEventUID+'.ics'].eventText+=partEvent+'\r\n';
						else
							inputCollection.urlArray[inputCollection.uid+realEventUID+'.ics'] = {etag: hex, href: inputCollection.uid+realEventUID+'.ics', eventText : partEvent+'\r\n'};
					}
					vcalendarText = vcalendarText.replace(partEvent,'');
					parseCounter++;
				}
				if(parseCounter==0)
					console.log("Error: '"+inputCollection.uid+realEventUID+'.ics'+"': cannot parse subscribed vEvent");
			}
			if(inputCollection.typeList.indexOf('vtodo')!=-1)
			{
				var parseCounter=0;
				while(vcalendarText.match(vCalendar.pre['vtodo'])!=null)
				{
					var partEvent=vcalendarText.substring(vcalendarText.indexOf('BEGIN:VTODO')-2,vcalendarText.indexOf('END:VTODO')+'END:VTODO'.length);
					var realEventUID=partEvent.match(vCalendar.pre['contentline_UID']);

					if(realEventUID!=null)
					{
						realEventUID=realEventUID[0].match(vCalendar.pre['contentline_parse'])[4];	
						realEventUID=realEventUID.replace('/','');
					}
					
					var hex = hex_sha256(partEvent);
					if(inputCollection.urlArray != null)
					{
						if(inputCollection.urlArray[inputCollection.uid+realEventUID+'.ics']!=null && inputCollection.urlArray[inputCollection.uid+realEventUID+'.ics']!=undefined)
							inputCollection.urlArray[inputCollection.uid+realEventUID+'.ics'].eventText+=partEvent+'\r\n';
						else
							inputCollection.urlArray[inputCollection.uid+realEventUID+'.ics'] = {etag: hex, href: inputCollection.uid+realEventUID+'.ics', eventText : partEvent+'\r\n'};
					}
					vcalendarText = vcalendarText.replace(partEvent,'');
					parseCounter++;
				}
				if(parseCounter==0)
					console.log("Error: '"+inputCollection.uid+realEventUID+'.ics'+"': cannot parse subscribed vTodo");
			}
				
				if(typeof globalEventList.events[inputCollection.uid] != 'undefined')
				{
					for(event in globalEventList.events[inputCollection.uid])
					{
						if(inputCollection.urlArray[event] == undefined || inputCollection.urlArray[event] == null)
							globalEventList.removeOldEvent(event, true, true);
					}
				}
				else
				{
					for(event in globalEventList.todos[inputCollection.uid])
						if(inputCollection.urlArray[event] == undefined || inputCollection.urlArray[event] == null)
							globalEventList.removeOldEvent(event, true, false);
				}
			
			netLoadCalendar(inputCollection, inputCollection.urlArray, (inputCollection.forceSyncPROPFIND==undefined || inputCollection.forceSyncPROPFIND==false ? true : false), true, forceLoad,false, recursiveIterator, collections);
		}
	});
}
