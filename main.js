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

var globalEventList=new EventList();
var globalMonthlist=new Monthlist();
var globalTODOlist=new GlobalTODOlist();
var globalAppleSupport = new AppleSupportNextDateArray();
var isResourceNumber=false;
var maxAlarmValue=2147000000;

var countPreviousEvents=0;
var countPreviousCalendars=0;
var globalThreadCounter=0;
var maximumThreadNumber=16;

var isDaylight=false;
var globalResourceCalDAVList=new ResourceCalDAVList();

var globalEventIntervalID=null;
var globalResourceRefresh=false;
var globalResourceRefreshNumber=0;
var globalResourceRefreshNumberTodo=0;
var globalCalDAVInitLoad=true;
var globalCalDAVResourceSync=false;
var globalCalDAVCollectionSync=false;
var globalCalendarNumber=0;
var globalCalendarNumberCount=0;

var cleanResourceCalDAVListTemplate=null;
var cleanResourceCalDAVTODOListTemplate=null;
var cleanVcalendarTemplate=null;
var cleanVtodoTemplate=null;
var origResourceCalDAVListTemplate=null;
var origResourceCalDAVTODOListTemplate=null;
var origVcalendarTemplate=null;
var origVtodoTemplate=null;
var origVtodoLoaderTemplate=null;
var origLoaderTemplate=null;
var globalSessionCalendarSelected=null;
var globalSessionTodoCalendarSelected=null;
var globalSessionActiveView=null;
var globalSessionTimeZone=null;
var globalSessionDatepickerFormat=null;
var globalSessionAMPMFormat=null;

var globalCalDAVQs=null;
var globalCalDAVTODOQs=null;
var vR=new Array();
var vRTodo=new Array();
var isResourceComplete=false;
var prevFunctionArray=new Array();
var prevFunctionArrayIterator=0;
var globalWorkerArray=new Array();
var globalIntervalArray=new Array();
var globalResourceErrorCounter=0;
var globalCurrentLoadingResource='';
var timeZonesEnabled=new Array();
var cLcouny=42;
var timezoneKeys=new Array();
var timelist=new Array();
var minelems=[0,15,30,45];
var frequencies = ["SECONDLY", "MINUTELY", "HOURLY", "DAILY", "WEEKLY", "MONTHLY", "YEARLY"];
var globalEventDateStart='';
var globalEventDateEnd='';
var globalViewsList={'month':false, 'multiWeek':false, 'agendaWeek':false, 'agendaDay':false};
var globalToday=new Date();
var isCalDAVLoaded=false;
var isCalDAVAvaible=true;

var globalCalEvent=null;
var globalCalTodo=null;
var globalJsEvent=null;
var globalRevertFunction=null;
var globalPrevDragEventAllDay=null;
var globalPrevDate='';

var globalWindowFocus=true;
var globalLoginUsername='';
var globalLoginPassword='';
var isUserLogged=false;
var globalActiveApp='';
var globalAvailableAppsArray=new Array();
var globalEnableAppSwitch=true;
var globalAppName='CalDavZAP';
var globalVersion='0.9.1.2';
var globalVersionCheckURL=(location.protocol=='file:' ? 'http:' : location.protocol)+'//www.inf-it.com/versioncheck/'+globalAppName+'/?v='+globalVersion;
var globalXClientHeader=globalAppName+' '+globalVersion+' (Inf-IT CalDAV Web Client)';
var globalResourceNumberCount=0;
var globalResourceNumber=0;
var globalResourceIntervalID=null;
var globalCollectionIntervalID=null;
var globalObjectLoading=false;
var settingsLoaded=false;
var globalKBNavigationPaddingRate=0.2;
var globalParallelAjaxCallCardDAVEnabled=true;
var globalParallelAjaxCallCalDAVEnabled=true;
var SVG_select='<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="0px" y="0px" width="19px" height="19px" viewBox="0 0 19 19" overflow="visible" enable-background="new 0 0 19 19" xml:space="preserve"><defs></defs><rect x="2" fill="#585858" width="17" height="19"/><polygon fill="#FFFFFF" points="14,7 10.5,13 7,7 "/><rect fill="#FFFFFF" width="2" height="19"/></svg>';
var SVG_select_b='<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="0px" y="0px" width="19px" height="19px" viewBox="0 0 19 19" overflow="visible" enable-background="new 0 0 19 19" xml:space="preserve"><defs></defs><rect x="2" fill="#585858" width="17" height="19"/><polygon fill="#FFFFFF" points="14,7 10.5,13 7,7 "/><rect fill="#2D2D2D" width="2" height="19"/></svg>';
var SVG_select_dis='<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="0px" y="0px" width="22px" height="19px" viewBox="0 0 22 19" overflow="visible" enable-background="new 0 0 22 19" xml:space="preserve"><defs></defs><rect fill="#FFFFFF" width="22" height="19"/></svg>';


var globalSettings={
	inactiveCollections: (typeof globalInactiveCollections!='undefined' && globalInactiveCollections!=null && globalInactiveCollections!='') ? globalInactiveCollections : new Array(),
	inactiveTodoCollections: (typeof globalInactiveTodoCollections!='undefined' && globalInactiveTodoCollections!=null && globalInactiveTodoCollections!='') ? globalInactiveTodoCollections : new Array(),
	TodoListFilterSelected: (typeof globalTodoListFilterSelected!='undefined' && globalTodoListFilterSelected!=null && globalTodoListFilterSelected!='') ? globalTodoListFilterSelected : ['filterAction', 'filterProgress'],
	activeView: (typeof globalActiveView!='undefined' && globalActiveView!=null && globalActiveView!='') ? globalActiveView : 'multiWeek', 
	activeApp: (typeof globalDefaultActiveApp!='undefined' && globalDefaultActiveApp!=null && globalDefaultActiveApp!='') ? globalDefaultActiveApp : 'CalDavZAP',
	calendarSelected: (typeof globalCalendarSelected!='undefined' && globalCalendarSelected!=null && globalCalendarSelected!='') ? globalCalendarSelected : '',
	TodoCalendarSelected: (typeof globalTodoCalendarSelected!='undefined' && globalTodoCalendarSelected!=null && globalTodoCalendarSelected!='') ? globalTodoCalendarSelected : '',
	addressbookSelected: (typeof globalAddressbookSelected!='undefined' && globalAddressbookSelected!=null && globalAddressbookSelected!='') ? globalAddressbookSelected : '',
	timezoneSelected: (typeof globalTimeZone!='undefined' && globalTimeZone!=null && globalTimeZone!='') ? globalTimeZone : ''
};
// Timepicker hack (prevent IE to re-open the datepicker on date click + focus)
var globalTmpTimePickerHackTime=new Object();

function loadAllResources()
{
	if(globalResourceIntervalID==null)
	{
		netFindResource(globalAccountSettings[0], 0, true, 0);
		function reloadResources() 
		{
			if((typeof isCardDAVAvaible!='undefined' && isCardDAVAvaible && (globalCardDAVInitLoad || globalCardDAVResourceSync)) || (typeof isCalDAVAvaible!='undefined' && isCalDAVAvaible && (globalCalDAVInitLoad || globalCalDAVResourceSync)))
				return false;
			if(globalWindowFocus==false)
				return false;
			globalCardDAVResourceSync=true;
			globalCalDAVResourceSync=true;
			if(typeof isCalDAVAvaible!='undefined' && isCalDAVAvaible!=null && isCalDAVAvaible)
			{
				globalCalDAVResourceSync = true;
				globalToday.setHours(0);
				globalToday.setMinutes(0);
				globalToday.setSeconds(0); 
				globalToday.setMilliseconds(0);

				var currentToday=new Date();
				currentToday.setHours(0);
				currentToday.setMinutes(0);
				currentToday.setSeconds(0); 
				currentToday.setMilliseconds(0);
				if(currentToday.getTime()!=globalToday.getTime())
				{
					globalViewsList['month']=true;
					globalViewsList['multiWeek']=true;
					globalViewsList['agendaWeek']=true;
					globalViewsList['agendaDay']=true;
					$('#calendar').fullCalendar('updateGrid');
					$('#calendar').fullCalendar('gotoDate', currentToday);
					globalViewsList[$('#calendar').fullCalendar('getView').name]=false;
					$('#todoList').fullCalendar('gotoDate', currentToday);
					globalToday=currentToday;
				}
			}
			netFindResource(globalAccountSettings[0], 0, false, 0);
			checkBeforeClose();
		}
		globalResourceIntervalID=setInterval(reloadResources, globalSyncResourcesInterval);
	}
}



function loadNextApplication(forceLoad)
{
	if(globalCollectionIntervalID==null)
	{
		if(typeof isCardDAVAvaible!='undefined' && isCardDAVAvaible!=null)
			setAddressbookNumber();
		if(typeof isCalDAVAvaible!='undefined' && isCalDAVAvaible!=null)
			setCalendarNumber();
		
		globalCollectionIntervalID=setInterval(function() {
		if((typeof isCardDAVAvaible!='undefined' && isCardDAVAvaible!=null && isCardDAVAvaible && (globalCardDAVInitLoad || globalCardDAVCollectionSync)) || (typeof isCalDAVAvaible!='undefined' && isCalDAVAvaible!=null && isCalDAVAvaible && (globalCalDAVInitLoad || globalCalDAVCollectionSync)) || !globalWindowFocus)
			return false;
		loadNextApplication(false);
		}, globalAccountSettings[0].syncInterval);
			
	}
	if(typeof isCardDAVAvaible!='undefined' && isCardDAVAvaible!=null && !globalCardDAVCollectionSync && globalResourceCardDAVList.collections.length>0)
	{
		globalCardDAVCollectionSync=true;
		CardDAVnetLoadCollection(globalResourceCardDAVList.collections[0], forceLoad, false, null, 0, globalResourceCardDAVList.collections,true);
	}
	else if(typeof isCalDAVAvaible!='undefined' && isCalDAVAvaible!=null && !globalCalDAVCollectionSync && globalResourceCalDAVList.collections.length>0)
	{
		globalCalDAVCollectionSync=true;
		CalDAVnetLoadCollection(globalResourceCalDAVList.collections[0], forceLoad, 0, globalResourceCalDAVList.collections);
	}
	else
	{
		if((typeof isCalDAVAvaible!='undefined' && isCalDAVAvaible!=null && !isCalDAVLoaded) || (typeof isCardDAVAvaible!='undefined' && isCardDAVAvaible!=null && !isCardDAVLoaded))
			$('#MainLoader').fadeOut(1200, function(){$('#MainLoader').css('left','50px');});
		if(typeof isCardDAVAvaible!='undefined' && isCardDAVAvaible!=null)
		{
			globalCardDAVCollectionSync=false;
			if(!isCardDAVLoaded)
				isCardDAVLoaded=true;
		}
		if(typeof isCalDAVAvaible!='undefined' && isCalDAVAvaible!=null)
		{
			globalCalDAVCollectionSync=false;
			if(!isCalDAVLoaded)
				isCalDAVLoaded=true;
		}
	}
}



function checkForApplication(inputApp)
{
	if(!globalEnableAppSwitch || globalObjectLoading)
		return false;

	globalEnableAppSwitch=false;
	globalActiveApp=inputApp;
	if(inputApp=='CalDavZAP')
	{
		$('#SystemCardDAV, #SystemCalDAVTODO, #SystemSettings').animate({opacity : 0}, 666, function(){
			$('#SystemCardDAV, #SystemCalDAVTODO, #SystemSettings').css('visibility','hidden');
		});
		$('#SystemCalDAV').css('visibility','visible');
		$('#SystemCalDAV').animate({opacity : 1}, 666, function(){globalEnableAppSwitch=true;});
	}
	else if(inputApp=='CalDavTODO')
	{
		$('#SystemCardDAV, #SystemCalDAV, #SystemSettings').animate({opacity : 0}, 666, function(){
			$('#SystemCardDAV, #SystemCalDAV, #SystemSettings').css('visibility','hidden');
		});
		$('#SystemCalDAVTODO').css('visibility','visible');
		$('#SystemCalDAVTODO').animate({opacity : 1}, 666, function(){globalEnableAppSwitch=true;});
	}
	else if(inputApp=='CardDavMATE')
	{
		$('#SystemCalDAV, #SystemCalDAVTODO, #SystemSettings').animate({opacity : 0},666,function(){
			$('#SystemCalDAV, #SystemCalDAVTODO, #SystemSettings').css('visibility','hidden');
		});
		$('#SystemCardDAV').css('visibility','visible');
		$('#SystemCardDAV').animate({opacity : 1}, 666, function(){globalEnableAppSwitch=true;});
	}

	else if(inputApp=='Settings')
	{
		$('.resourceSettings[data-type="Password"]').trigger('click');

		$('#SystemCardDAV, #SystemCalDAV, #SystemCalDAVTODO').animate({opacity : 0},666,function(){
			$('#SystemCardDAV, #SystemCalDAV, #SystemCalDAVTODO').css('visibility','hidden');
		});
		$('#SystemSettings').css('visibility','visible');
		$('#SystemSettings').animate({opacity : 1}, 666, function(){globalEnableAppSwitch=true;});
	}
}

function login()
{
	$('#LoginLoader').fadeTo(1200, 1, function(){
		globalLoginUsername=$('#LoginPage').find('[data-type="system_username"]').val();
		globalLoginPassword=$('#LoginPage').find('[data-type="system_password"]').val();
		loadConfig();
	});
}

function logout()
{
	if(globalResourceIntervalID!=null)
		clearInterval(globalResourceIntervalID);
	if(globalCollectionIntervalID!=null)
		clearInterval(globalCollectionIntervalID);
	settingsLoaded=false;
	var settings=saveSettings();
	for(var i=0;i<globalAccountSettings.length;i++)
		if(globalAccountSettings[i].href.indexOf(globalLoginUsername)!=-1 && globalAccountSettings[i].settingsAccount)
		{
			netSaveSettings(globalAccountSettings[i], settings);
			break;
		}
	
	globalCollectionIntervalID=null;	
	globalResourceIntervalID=null;
	globalLoginUsername='';
	globalLoginPassword='';
	globalResourceNumber=0;
	globalResourceNumberCount=0;
	$('#LoginPage').fadeTo(2000, 1, function(){
		if(typeof isCalDAVLoaded!='undefined' && isCalDAVLoaded)
		{
			logoutCalDAV();
			isCalDAVLoaded=false;
		}

		if(typeof isCardDAVLoaded!='undefined' && isCardDAVLoaded)
		{
			logoutCardDAV();
			isCardDAVLoaded=false;
		}
		if(typeof isProjectsLoaded!='undefined' && isProjectsLoaded)
		{
			isProjectsLoaded = false;
		}

		for(var i=globalAccountSettings.length-1;i>=0;i--)
			if(globalAccountSettings[i].type=='network')
				globalAccountSettings.splice(i, 1);

		if(typeof globalDemoMode=='undefined')
		{
			$('[data-type="system_username"]').val('').change();
			$('[data-type="system_password"]').val('').change();
		}

		$('.integration_d').hide();

		isUserLogged=false;

		if(typeof globalDefaultActiveApp=='undefined' || globalDefaultActiveApp==null)
		{
			if(typeof isCalDAVAvaible!='undefined' && isCalDAVAvaible!=null)
				globalActiveApp='CalDavZAP';
			else if(typeof isCardDAVAvaible!='undefined' && isCardDAVAvaible!=null)
				globalActiveApp='CardDavMATE';
		}
		else
			globalActiveApp=globalDefaultActiveApp;
		
	//	if(globalActiveApp=='CalDavZAP' || globalActiveApp=='CalDavTODO')
		if(typeof isCardDAVAvaible!='undefined' && isCardDAVAvaible)
			mainCardDAV();
		if(typeof isCalDAVAvaible!='undefined' && isCalDAVAvaible)
			mainCalDAV();
		if(typeof isSettingsAvaible!='undefined' && isSettingsAvaible!=null) 
			translateSettings();
	//	else
			
	});
}

function init()
{
	// browser check
	if(($.browser.msie && parseInt($.browser.version, 10)<9) || $.browser.opera)
		$('#login_message').css('display','').find('td').text(localization[globalInterfaceLanguage].unsupportedBrowser);

	if(typeof globalDemoMode!='undefined')
	{
		if(typeof globalDemoMode.userName!=undefined)
			$('[data-type="system_username"]').val(globalDemoMode.userName).change();
		if(typeof globalDemoMode.userPassword!=undefined)
			$('[data-type="system_password"]').val(globalDemoMode.userPassword).change();
	}

	if(typeof globalAvailableAppsArray!='undefined' && globalAvailableAppsArray!=null && globalAvailableAppsArray.length == 2 && globalAvailableAppsArray.indexOf('CalDavZAP')!=-1) {
		setLogoCalDAV();
	}
	loadConfig();
}

function run()
{
	isUserLogged=true;
	window.onfocus=function(){globalWindowFocus=true;}
	window.onblur=function(){if(typeof globalBackgroundSync!='undefined' && globalBackgroundSync==false) globalWindowFocus=false;}
	$('#LoginPage').fadeOut(2000);

	if(typeof globalAccountSettings=='undefined')
	{
		console.log('Error: \'no account configured\': see config.js!');
		return false;
	}

	if(typeof globalNewVersionNotifyUsers=='undefined' || globalNewVersionNotifyUsers!=null)
		netVersionCheck();

	// Automatically detect crossDomain settings
	var detectedHref=location.protocol+'//'+location.hostname+(location.port ? ':'+location.port : '');
	for(var i=0;i<globalAccountSettings.length;i++)
	{
		if(globalAccountSettings[i].crossDomain==undefined || typeof globalAccountSettings[i].crossDomain!='boolean')
		{
			if(globalAccountSettings[i].href.indexOf(detectedHref)==0)
				globalAccountSettings[i].crossDomain=false;
			else
				globalAccountSettings[i].crossDomain=true;

			console.log("Info: [account: '"+globalAccountSettings[i].href.replace('\/\/', '//'+globalAccountSettings[i].userAuth.userName+'@')+"'] crossDomain set to: '"+(globalAccountSettings[i].crossDomain==true ? 'true' : 'false')+"'");
		}
	}

	if(typeof globalAvailableAppsArray!='undefined' && globalAvailableAppsArray!=null && globalAvailableAppsArray.length>1)
	{
		$('.integration_d').css('display', 'block');
		if(globalAvailableAppsArray.indexOf('CalDavZAP')!=-1) {
			$('#intCaldav').attr({'alt':localization[globalInterfaceLanguage].txtCalendar, 'title':localization[globalInterfaceLanguage].txtCalendar});
			$('#intCaldav').css('display', 'block');
		}
		if(globalAvailableAppsArray.indexOf('CalDavTODO')!=-1) {
			$('#intCaldavTodo').attr({'alt':localization[globalInterfaceLanguage].txtTodo, 'title':localization[globalInterfaceLanguage].txtTodo});
			$('#intCaldavTodo').css('display', 'block');
		}
		if(globalAvailableAppsArray.indexOf('CardDavMATE')!=-1) {
			$('#intCarddav').attr({'alt':localization[globalInterfaceLanguage].txtAddressbook, 'title':localization[globalInterfaceLanguage].txtAddressbook});
			$('#intCarddav').css('display', 'block');
		}
		if(globalAvailableAppsArray.indexOf('Settings')!=-1) {
			$('#intSettings').attr({'alt':localization[globalInterfaceLanguage].txtSettings, 'title':localization[globalInterfaceLanguage].txtSettings});
			$('#intSettings').css('display', 'block');
		}
	}
}

function loadConfig()
{
	if(isUserLogged)
		return false;
	var configLoaded=true;
	// Automatically detect crossDomain settings
	var detectedHref=location.protocol+'//'+location.hostname+(location.port ? ':'+location.port : '');

	// check username and password against the server and create config from globalNetworkCheckSettings
	if(typeof globalNetworkCheckSettings!='undefined' && globalNetworkCheckSettings!=null)
	{
		if(globalLoginUsername=='' || globalLoginPassword=='')
		{
			$('#LoginPage').fadeTo(500, 1, function(){if(typeof globalDemoMode=='undefined') $('[data-type="system_username"]').focus()});
			$('#LoginLoader').fadeOut(1200);
			return false;
		}
		else
		{
			if(globalNetworkCheckSettings.crossDomain==undefined || typeof globalNetworkCheckSettings.crossDomain!='boolean')
			{
				if(globalNetworkCheckSettings.href.indexOf(detectedHref)==0)
					globalNetworkCheckSettings.crossDomain=false;
				else
					globalNetworkCheckSettings.crossDomain=true;

				console.log("Info: [globalNetworkCheckSettings: '"+globalNetworkCheckSettings.href+"'] crossDomain set to: '"+(globalNetworkCheckSettings.crossDomain==true ? 'true' : 'false')+"'");
			}
			// show the logout button
				if(typeof globalAvailableAppsArray!='undefined' && globalAvailableAppsArray!=null && globalAvailableAppsArray.length>1)
				{
					$('#intLogout').css('display', 'block');
					$('#intLogout').attr({'alt':localization[globalInterfaceLanguage].altLogout, 'title':localization[globalInterfaceLanguage].altLogout});
				}
				else
				{
					$('#Logout').css('display', 'block');
					$('#logoutShower').css('display', 'block');
					$('#logoutSettings').css('display', 'block');
				}
			netCheckAndCreateConfiguration(globalNetworkCheckSettings);
			return true;
		}
	}

	// load the configuration XML(s) from the network
	if(typeof globalNetworkAccountSettings!='undefined' && globalNetworkAccountSettings!=null)
	{
		if(globalLoginUsername=='' || globalLoginPassword=='')
		{
			$('#LoginPage').fadeTo(500, 1, function(){if(typeof globalDemoMode=='undefined') $('[data-type="system_username"]').focus()});
			$('#LoginLoader').fadeOut(1200);
			return false;
		}
		else
		{
			if(globalNetworkAccountSettings.crossDomain==undefined || typeof globalNetworkAccountSettings.crossDomain!='boolean')
			{
				if(globalNetworkAccountSettings.href.indexOf(detectedHref)==0)
					globalNetworkAccountSettings.crossDomain=false;
				else
					globalNetworkAccountSettings.crossDomain=true;

				console.log("Info: [globalNetworkAccountSettings: '"+globalNetworkAccountSettings.href+"'] crossDomain set to: '"+(globalNetworkAccountSettings.crossDomain==true ? 'true' : 'false')+"'");
			}
			// show the logout button
			if(typeof globalAvailableAppsArray!='undefined' && globalAvailableAppsArray!=null && globalAvailableAppsArray.length>1)
			{
				$('#intLogout').css('display', 'block');
				$('#intLogout').attr({'alt':localization[globalInterfaceLanguage].altLogout, 'title':localization[globalInterfaceLanguage].altLogout});
			}
			else
			{
				$('#Logout').css('display', 'block');
				$('#logoutShower').css('display', 'block');
				$('#logoutSettings').css('display', 'block');
			}
			netLoadConfiguration(globalNetworkAccountSettings);
			return true;
		}
	}
	if((typeof globalNetworkAccountSettings=='undefined' || globalNetworkAccountSettings==null) && (typeof globalNetworkCheckSettings=='undefined' || globalNetworkCheckSettings==null) && 
 		(typeof globalAccountSettings!='undefined' && globalAccountSettings!=null) && globalAccountSettings.length>0)
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
}

function globalMain()
{
	/*************************** BAD HACKS SECTION ***************************/
	// here we fix the cross OS/cross broser problems (unfixable in pure CSS)
	if($.browser.webkit && !!window.chrome)	/* Chrome */
	{
		if(navigator.platform.toLowerCase().indexOf('win')==0)	/* Windows version */
		{
			$('#LoginPage, #vCardTemplate, #event_details_template, #todo_details_template, #SettingsTemplate').find('input').css('text-indent', '2px');
			$('#LoginPage, #vCardTemplate, #event_details_template, #todo_details_template, #SettingsTemplate').find('select').css({'padding-left': '0px', 'padding-right': '13px'});
		}
		else	/* non-Windows version */
			$('#LoginPage, #vCardTemplate, #event_details_template, #todo_details_template, #SettingsTemplate').find('input').css('text-indent', '1px');
	}
	else if($.browser.msie)	/* IE */
	{
		if(parseInt($.browser.version, 10)==10)	/* IE 10 (because there are no more conditional comments) */
		{
			$('select').css({'padding-top': '1px', 'padding-left': '0px', 'padding-right': '0px'});
			$('textarea').css('padding-top', '3px');

			$('input[type=button]').css('padding-top', '2px');
		}

		// ADD SVG to login screen
		var newSVG=$(SVG_select).attr('data-type', 'select_icon').css({'pointer-events': 'none', 'z-index': '1', 'display': 'inline', 'margin-left': '-19px', 'vertical-align': 'top', 'background-color': '#ffffff'});	// background-color = stupid IE9 bug
		$('#Login').find('select[data-type="language"]').after($($('<div>').append($(newSVG).clone()).html()));
	}
	else if($.browser.mozilla)
	{
		// ADD SVG to login screen
		var newSVG=$(SVG_select).attr('data-type', 'select_icon').css({'pointer-events': 'none', 'z-index': '1', 'display': 'inline', 'margin-left': '-19px', 'vertical-align': 'top', 'background-color': '#ffffff'});	// background-color = stupid IE9 bug
		$('#Login').find('select[data-type="language"]').after($($('<div>').append($(newSVG).clone()).html()));
	}
	/*************************** END OF BAD HACKS SECTION ***************************/

	/* language selector */
	var lang_num=0;
	var language_option=$('#Login').find('[data-type="language"]').find('option');
	$('#Login').find('[data-type="language"]').html('');

	if(typeof globalInterfaceCustomLanguages!='undefined' && globalInterfaceCustomLanguages.length!=undefined && globalInterfaceCustomLanguages.length>0)
	{
		for(var i=0;i<globalInterfaceCustomLanguages.length;i++)
			if(localization[globalInterfaceCustomLanguages[i]]!=undefined)
			{
				var tmp=language_option;
				tmp.attr('data-type',globalInterfaceCustomLanguages[i]);
				tmp.text(localization[globalInterfaceCustomLanguages[i]]['_name_']);
				$('#Login').find('[data-type="language"]').append(tmp.clone());
				lang_num++;
			}
	}
	if(lang_num==0)	// no language option, use the default (all languages from localization.js)
	{
		for(var loc in localization)
		{
			var tmp=language_option;
			tmp.attr('data-type',loc);
			tmp.text(localization[loc]['_name_']);	// translation
			$('#Login').find('[data-type="language"]').append(tmp.clone());
		}
	}

	if(typeof globalEnabledApps=='undefined' || globalEnabledApps==null)
	{
		if(typeof isCalDAVAvaible!='undefined' && isCalDAVAvaible!=null)
		{
			globalAvailableAppsArray[globalAvailableAppsArray.length]='CalDavZAP';
			globalAvailableAppsArray[globalAvailableAppsArray.length]='CalDavTODO';
		}
		if(typeof isCardDAVAvaible!='undefined' && isCardDAVAvaible!=null)
			globalAvailableAppsArray[globalAvailableAppsArray.length]='CardDavMATE';
		if(typeof isSettingsAvaible!='undefined' && isSettingsAvaible!=null)
			globalAvailableAppsArray[globalAvailableAppsArray.length]='Settings';
	}
	else
		globalAvailableAppsArray=globalEnabledApps;

	if(typeof globalDefaultActiveApp=='undefined' || globalDefaultActiveApp==null)
	{
		if(typeof isCardDAVAvaible!='undefined' && isCardDAVAvaible!=null)
			globalActiveApp='CardDavMATE';
		else if(typeof isCalDAVAvaible!='undefined' && isCalDAVAvaible!=null)
			globalActiveApp='CalDavZAP';
	}
	else
		globalActiveApp=globalDefaultActiveApp;

	// create backup from the original editor objects (needed for localization switching)
	if(typeof globalAvailableAppsArray!='undefined' && globalAvailableAppsArray!=null && globalAvailableAppsArray.indexOf('CardDavMATE')!=-1)
	{
		globalMainCardDAV();
	}

	if(typeof globalAvailableAppsArray!='undefined' && globalAvailableAppsArray!=null && globalAvailableAppsArray.indexOf('CalDavZAP')!=-1)
	{
		globalMainCalDAV();
	}

	// select the globalInterfaceLanguage in the interface
	$('[data-type="language"]').find('[data-type='+globalInterfaceLanguage+']').prop('selected',true);

//	if(globalActiveApp=='CalDavZAP' || globalActiveApp=='CalDavTODO')
	if(typeof isCardDAVAvaible!='undefined' && isCardDAVAvaible)
		mainCardDAV();
	if(typeof isCalDAVAvaible!='undefined' && isCalDAVAvaible)
		mainCalDAV();
	if(typeof isSettingsAvaible!='undefined' && isSettingsAvaible!=null) 
		translateSettings();
	//else
}
function resetSettings()
{
	globalSettings.inactiveCollections=(typeof globalInactiveCollections!='undefined' && globalInactiveCollections!=null && globalInactiveCollections!='') ? globalInactiveCollections : new Array();
	globalSettings.inactiveTodoCollections=(typeof globalInactiveTodoCollections!='undefined' && globalInactiveTodoCollections!=null && globalInactiveTodoCollections!='') ? globalInactiveTodoCollections : new Array();
	globalSettings.TodoListFilterSelected=(typeof globalTodoListFilterSelected!='undefined' && globalTodoListFilterSelected!=null && globalTodoListFilterSelected!='') ? globalTodoListFilterSelected : ['filterAction', 'filterProgress'];
	globalSettings.activeView=(typeof globalActiveView!='undefined' && globalActiveView!=null && globalActiveView!='') ? globalActiveView : 'multiWeek';
	activeApp: (typeof globalDefaultActiveApp!='undefined' && globalDefaultActiveApp!=null && globalDefaultActiveApp!='') ? globalDefaultActiveApp : 'CalDavZAP',
	globalSettings.calendarSelected=(typeof globalCalendarSelected!='undefined' && globalCalendarSelected!=null && globalCalendarSelected!='') ? globalCalendarSelected : '';
	globalSettings.TodoCalendarSelected=(typeof globalTodoCalendarSelected!='undefined' && globalTodoCalendarSelected!=null && globalTodoCalendarSelected!='') ? globalTodoCalendarSelected : '';
	globalSettings.timezoneSelected=(typeof globalTimeZone!='undefined' && globalTimeZone!=null && globalTimeZone!='') ? globalTimeZone : '',
	globalSettings.addressbookSelected=(typeof globalAddressbookSelected!='undefined' && globalAddressbookSelected!=null && globalAddressbookSelected!='') ? globalAddressbookSelected : ''
}

function saveSettings()
{
	globalSettings.inactiveCollections.splice(0, globalSettings.inactiveCollections.length);
	globalSettings.inactiveTodoCollections.splice(0, globalSettings.inactiveTodoCollections.length);
	globalSettings.TodoListFilterSelected.splice(0, globalSettings.TodoListFilterSelected.length);

	if(typeof isCalDAVAvaible!='undefined' && isCalDAVAvaible!=null && isCalDAVAvaible)
	{
		for(var i=0;i<vR.length;i++)
		{
			var uidPart=vR[i].match(RegExp('^(https?://)(.*)', 'i'))[1];
			var uidPart2= vR[i].match(RegExp('^(https?://)(.*)', 'i'))[2].split('@')[2];
			globalSettings.inactiveCollections.splice(globalSettings.inactiveCollections.length , 0, uidPart+uidPart2);
		}

		for(var i=0;i<vRTodo.length;i++)
		{
			var uidPart=vRTodo[i].match(RegExp('^(https?://)(.*)', 'i'))[1];
			var uidPart2= vRTodo[i].match(RegExp('^(https?://)(.*)', 'i'))[2].split('@')[2];
			globalSettings.inactiveTodoCollections.splice(globalSettings.inactiveTodoCollections.length , 0, uidPart+uidPart2);
		}

		var view= $('#calendar').fullCalendar('getView');
		globalSettings.activeView=view.name;
		
		globalSettings.currentDate=view.start.getFullYear()+'-'+(view.start.getMonth()+1)+'-'+view.start.getDate();
		globalSettings.timezoneSelected=globalSessionTimeZone;
		
		if($('#SystemCalDAV').css('visibility')=='visible')
			globalSettings.activeApp='CalDavZAP';
		else if($('#SystemCalDAVTODO').css('visibility')=='visible')
			globalSettings.activeApp='CalDavTODO';
		else if(isCardDAVAvaible && $('#SystemCardDAV').css('visibility')=='visible')
			globalSettings.activeApp='CardDavMATE';
		

		var uidSelected=$('#ResourceCalDAVList').find('.resourceCalDAV_item_selected').attr('data-id');
		if(uidSelected!=undefined && uidSelected!='')
		{
			var par=uidSelected.split('/');
			globalSettings.calendarSelected=par[par.length-3]+'/'+par[par.length-2]+'/';
		}
		
		uidSelected=$('#ResourceCalDAVTODOList').find('.resourceCalDAV_item_selected').attr('data-id');
		if(uidSelected!=undefined && uidSelected!='')
		{
			var par=uidSelected.split('/');
			globalSettings.TodoCalendarSelected=par[par.length-3]+'/'+par[par.length-2]+'/';
		}
		
		var filterArray = $('.fc-filter-option-selected');
		for(var i=0; i<filterArray.length; i++)
			globalSettings.TodoListFilterSelected.splice(globalSettings.TodoListFilterSelected.length,0,$($('.fc-filter-option-selected')[i]).attr('data-type'));
	}
	if(typeof isCardDAVAvaible!='undefined' && isCardDAVAvaible!=null && isCardDAVAvaible)
	{
		if($('#ResourceCardDAVList').find('.group.resourceCardDAV_selected').length>0)
			var uidASelected=$('#ResourceCardDAVList').find('.group.resourceCardDAV_selected').attr('data-id');
		else if($('#ResourceCardDAVList').find('.resourceCardDAV_selected').length>0)
			var uidASelected=$('#ResourceCardDAVList').find('.resourceCardDAV_selected').attr('data-id');
		else
			var uidASelected='';
		if(uidASelected!=undefined && uidASelected!='')
			globalSettings.addressbookSelected=uidASelected;
	}
	var strobj=JSON.stringify(globalSettings);
	return strobj;
}

function loadSettings(strobj)
{
	if(settingsLoaded)
		return false;
	eval('objNew='+strobj);
	if(typeof objNew=='object')
	{
		if(typeof isCalDAVAvaible!='undefined' && isCalDAVAvaible!=null && isCalDAVAvaible)
		{
			if(typeof objNew.inactiveCollections!='undefined' && objNew.inactiveCollections!=null)
				globalSettings.inactiveCollections=objNew.inactiveCollections;
			else if(typeof globalInactiveCollections!='undefined')
				globalSettings.inactiveCollections=globalInactiveCollections;
			
			if(typeof objNew.inactiveTodoCollections!='undefined' && objNew.inactiveTodoCollections!=null)
				globalSettings.inactiveTodoCollections=objNew.inactiveTodoCollections;
			else if(typeof globalInactiveTodoCollections!='undefined')
				globalSettings.inactiveTodoCollections=globalInactiveTodoCollections;
			
			if(typeof objNew.TodoListFilterSelected!='undefined' && objNew.TodoListFilterSelected!=null)
				globalSettings.TodoListFilterSelected=objNew.TodoListFilterSelected;
			else if(typeof globalTodoListFilterSelected!='undefined')
				globalSettings.TodoListFilterSelected=globalTodoListFilterSelected;

			if(typeof objNew.calendarSelected!='undefined' && objNew.calendarSelected!=null)
				globalSettings.calendarSelected=objNew.calendarSelected;
			else if(typeof globalCalendarSelected!='undefined')
				globalSettings.calendarSelected=globalCalendarSelected;
				
			if(typeof objNew.TodoCalendarSelected!='undefined' && objNew.TodoCalendarSelected!=null)
				globalSettings.TodoCalendarSelected=objNew.TodoCalendarSelected;
			else if(typeof globalTodoCalendarSelected!='undefined')
				globalSettings.TodoCalendarSelected=globalTodoCalendarSelected;

			if(typeof objNew.timezoneSelected!='undefined' && objNew.timezoneSelectednull)
				globalSettings.timezoneSelected=objNew.timezoneSelected;
			else if(typeof globalTimeZone!='undefined')
				globalSettings.timezoneSelected=globalTimeZone;

			if(typeof objNew.activeApp!='undefined' && objNew.activeApp!=null)
				globalSettings.activeApp=objNew.activeApp;
			else if(typeof globalDefaultActiveApp!='undefined')
				globalSettings.activeApp=globalDefaultActiveApp;

			if(typeof objNew.activeView!='undefined' && objNew.activeView!=null)
				globalSettings.activeView=objNew.activeView;
			else if(typeof globalActiveView!='undefined')
				globalSettings.activeView=globalActiveView;
		}
		if(typeof isCardDAVAvaible!='undefined' && isCardDAVAvaible!=null && isCardDAVAvaible)
		{
			if(typeof objNew.addressbookSelected!='undefined' && objNew.addressbookSelected!=null)
				globalSettings.addressbookSelected=objNew.addressbookSelected;
			else if(typeof globalAddressbookSelected!='undefined')
				globalSettings.addressbookSelected=globalAddressbookSelected;
		}
	}
	if(typeof isCalDAVAvaible!='undefined' && isCalDAVAvaible!=null && isCalDAVAvaible)
	{
		for(var i=0;i<globalSettings.inactiveCollections.length;i++)
		{
			var uidPart=globalSettings.inactiveCollections[i].match(RegExp('^(https?://)(.*)', 'i'))[1];
			var uidPart2=globalSettings.inactiveCollections[i].match(RegExp('^(https?://)(.*)', 'i'))[2];
			var uidPart3=globalAccountSettings[0].userAuth.userName;
			vR.splice(vR.length, 0, uidPart+uidPart3+'@'+uidPart2);
		}
		
		for(var i=0;i<globalSettings.inactiveTodoCollections.length;i++)
		{
			var uidPart=globalSettings.inactiveTodoCollections[i].match(RegExp('^(https?://)(.*)', 'i'))[1];
			var uidPart2=globalSettings.inactiveTodoCollections[i].match(RegExp('^(https?://)(.*)', 'i'))[2];
			var uidPart3=globalAccountSettings[0].userAuth.userName;
			vRTodo.splice(vRTodo.length, 0, uidPart+uidPart3+'@'+uidPart2);
		}

		if(typeof globalSettings.calendarSelected!='undefined' && globalSettings.calendarSelected!=null)
			globalSessionCalendarSelected=globalSettings.calendarSelected;
		
		if(typeof globalSettings.TodoCalendarSelected!='undefined' && globalSettings.TodoCalendarSelected!=null)
			globalSessionTodoCalendarSelected=globalSettings.TodoCalendarSelected;
		
		if(typeof globalSettings.timezoneSelected!='undefined' && globalSettings.timezoneSelected!=null)
			globalSessionTimeZone=globalSettings.timezoneSelected;

		$('#timezonePicker').html('<option data-type=""></option>');
		initFullCalendar();
		initTodoList();
	}
	if(typeof isCardDAVAvaible!='undefined' && isCardDAVAvaible!=null && isCardDAVAvaible)
		if(typeof globalSettings.addressbookSelected!='undefined' && globalSettings.addressbookSelected!=null)
			globalSessionAddressbookSelected=globalSettings.addressbookSelected;
		

	settingsLoaded=true;
	if(typeof isCalDAVAvaible!='undefined' && isCalDAVAvaible!=null && isCalDAVAvaible && (globalSettings.activeApp=='CalDavTODO' || globalSettings.activeApp=='CalDavZAP'))
		globalActiveApp=globalSettings.activeApp;
	else if(typeof isCardDAVAvaible!='undefined' && isCardDAVAvaible!=null && isCardDAVAvaible && globalSettings.activeApp=='CardDavMATE')
		globalActiveApp=globalSettings.activeApp;
	checkForApplication(globalActiveApp);
}
function checkBeforeClose()
{
	if((typeof isCalDAVAvaible!='undefined' && isCalDAVAvaible!=null && isCalDAVAvaible && globalCalDAVInitLoad) || (typeof isCardDAVAvaible!='undefined' && isCardDAVAvaible!=null && isCardDAVAvaible && globalCardDAVInitLoad))
		return false;
	var preSettings=JSON.stringify(globalSettings);
	var settings=saveSettings();

	if(preSettings==settings)
		return false;

	for(var i=0;i<globalAccountSettings.length;i++)
		if(globalAccountSettings[i].href.indexOf(globalLoginUsername)!=-1 && globalAccountSettings[i].settingsAccount)
		{
			netSaveSettings(globalAccountSettings[i], settings);
			break;
		}
}
window.onload=globalMain;function Monthlist()
{
	var now=new Date();
	this.actualMonth=new Date(now.getFullYear(), now.getMonth(), 1);
	this.nextMonth=new Date(this.actualMonth.getFullYear(), this.actualMonth.getMonth()+12, this.actualMonth.getDate(), 0, 0, 0);
	this.prevMonth=new Date(this.actualMonth.getFullYear(), this.actualMonth.getMonth()-11, this.actualMonth.getDate(), 0, 0, 0);
	this.staticStartInterval=this.prevMonth;
	this.staticEndInterval=this.nextMonth;
	this.token=false;

	this.reset=function()
	{
		var now=new Date();
		this.actualMonth=new Date(now.getFullYear(), now.getMonth(), 1);
		this.nextMonth=new Date(this.actualMonth.getFullYear(), this.actualMonth.getMonth()+12, this.actualMonth.getDate(), 0, 0, 0);
		this.prevMonth=new Date(this.actualMonth.getFullYear(), this.actualMonth.getMonth()-11, this.actualMonth.getDate(), 0, 0, 0);
		this.staticStartInterval=this.prevMonth;
		this.staticEndInterval=this.nextMonth;
		this.token=false;
	}
}

function GlobalTODOlist()
{
	this.todos=new Array();
	this.reset=function()
	{
		this.todos.splice(0, this.todos.length);
		this.todos=new Array();
	}
}

function logoutCalDAV()
{
	vR.splice(0, vR.length);
	vRTodo.splice(0, vRTodo.length);
	globalCalendarNumber=0;
	globalCalendarNumberCount=0;
	globalCalDAVCollectionSync=false;
	globalEventList.reset();
	globalResourceCalDAVList.reset();
	globalTODOlist.reset();
	globalMonthlist.reset();
	globalViewsList={'month': false, 'multiWeek': false, 'agendaWeek': false, 'agendaDay': false, 'table': false};

	if(globalEventIntervalID!=null)
		clearInterval(globalEventIntervalID);
		
	$('#EventDisabler, #TodoDisabler, #AlertDisabler').fadeOut(2000, function(){
		$('#timezonePicker, #timezonePickerTODO').prop('disabled', false);
	});
	searchToggle=false;
	$('#main').animate({top: 24}, 0);
	$('#searchForm').hide();
	$('#searchInput').val('');
	$('#searchInput').keyup();
	$('#searchInput').blur();

	$('#calendar').fullCalendar('destroy');
	$('#todoList').fullCalendar('destroy');
	$('#SystemCalDAV').animate({opacity : 0},200,function(){
		$('#SystemCalDAV').css('visibility','hidden');
	});
}

function mainCalDAV()
{
	localizeCalDAV();
	init();
}

function localizeCalDAV()
{
	globalCalDAVInitLoad = true; 
	$('#ResourceCalDAVList').html(origResourceCalDAVListTemplate);
	$('#ResourceCalDAVTODOList').html(origResourceCalDAVTODOListTemplate);
	$('#CAEvent').html(origVcalendarTemplate);
	$('#CATodo').html(origVtodoTemplate);
	$('#todoLoader').html(origVtodoLoaderTemplate);
	$('#MainLoaderInner').html(origLoaderTemplate);
	resetSettings();
	translate();
	initTimepicker();
	$('input[placeholder],textarea[placeholder]').placeholder();
	cleanResourceCalDAVListTemplate=$('#ResourceCalDAVListTemplate').clone().wrap('<div>').parent().html();
	cleanResourceCalDAVTODOListTemplate=$('#ResourceCalDAVTODOListTemplate').clone().wrap('<div>').parent().html();
	cleanVcalendarTemplate=$('#CAEvent .saveLoader').clone().wrap('<div>').parent().html() + $('#repeatConfirmBox').clone().wrap('<div>').parent().html() + $('#event_details_template').clone().wrap('<div>').parent().html();
	cleanVtodoTemplate=$('#repeatConfirmBoxTODO').clone().wrap('<div>').parent().html() + $('#todo_details_template').clone().wrap('<div>').parent().html();
}

function runCalDAV()
{
	if(!isUserLogged)
		run();
	var filerArray = $('.fc-filter-option-selected');
	for(var i=0; i<filerArray.length; i++)
		$($('.fc-filter-option-selected')[i]).removeClass('fc-filter-option-selected');
	
	timeZonesEnabled=globalTimeZonesEnabled;
	if(typeof globalTimeZone != 'undefined' && globalTimeZone != null)
		timeZonesEnabled.push(globalTimeZone);
	timeZonesEnabled.push('local');
	timeZonesEnabled.push('UTC');
//	$('#SystemCalDAV').animate({opacity : 1},200,function(){
//		$('#SystemCalDAV').css('visibility','visible');
//	});

	// pozriet vygenerovany vystup ktory treba pridat do autocomplete (len raz pri inicializacii softu)
	//for(var i=0;i<timelist.length;i++)
	//	console.log(timelist[i]);
	globalResourceRefreshNumber=0;
	globalResourceRefreshNumberTodo=0;

	$('#MainLoader').css('left','0px');
	$('#MainLoader').fadeIn(200);

	if(typeof globalSubscribedCalendars!='undefined' && globalSubscribedCalendars!=null)
	{
		globalAccountSettings[globalAccountSettings.length]=$.extend({},globalAccountSettings[0]);
		globalAccountSettings[globalAccountSettings.length-1].hrefLabel = globalSubscribedCalendars.hrefLabel;
		globalAccountSettings[globalAccountSettings.length-1].showHeader = globalSubscribedCalendars.showHeader;
		globalAccountSettings[globalAccountSettings.length-1].calendars = globalSubscribedCalendars.calendars;
		globalAccountSettings[globalAccountSettings.length-1].ignoreAlarms = '';
	}
}

function globalMainCalDAV()
{
	$(window).resize(function(evt){
		if(evt.target!=window)
			return;

		if(typeof globalCalDAVInitLoad!='undefined' && !globalCalDAVInitLoad && typeof globalResourceRefresh!='undefined' && !globalResourceRefresh && $('#main').width()!=globalCalWidth) {
			$('#ResizeLoader').show();
		}

		$('#SystemCalDAV .fc-header-title').css('width', $('#main_h_placeholder').width()-$('#SystemCalDAV .fc-header-left').width()-$('#SystemCalDAV .fc-header-right').width()-20);
		$('#ResourceCalDAVList, #ResourceCalDAVTODOList').css('bottom',(typeof globalTimeZoneSupport!='undefined' && globalTimeZoneSupport ? 19 : 0));
		$('#alertBox').css('left', ($(window).width()/2)-($('#alertBox').width()/2));
		$('#calendar').fullCalendar('option', 'contentHeight', $('#main').height() - 14);
		$('#todoList').fullCalendar('allowSelectEvent',false);
		$('#todoList').fullCalendar('option', 'contentHeight', $('#mainTODO').height() - 14);
		$('#todoList').fullCalendar('allowSelectEvent',true);
		$('#todoList').fullCalendar('selectEvent', null, true);
		if(globalCalDAVQs!=null)
			globalCalDAVQs.cache();
		if(globalCalDAVTODOQs!=null)
			globalCalDAVTODOQs.cache();
		if(globalDisplayHiddenEvents)
			for(var k=1;k<globalResourceCalDAVList.collections.length;k++)
				if(globalResourceCalDAVList.collections[k].uid!=undefined)
				{
					var pos=vR.indexOf(globalResourceCalDAVList.collections[k].uid);
					if(pos!=-1)
						$("#SystemCalDAV div [data-res-id='"+globalResourceCalDAVList.collections[k].uid+"']").addClass('checkCalDAV_hide');
				}
		globalCalWidth = $('#main').width();
	});

	/*************************** BAD HACKS SECTION ***************************/
	if($.browser.msie || $.browser.mozilla)
	{
		var newSVG=$(SVG_select_b).attr('data-type', 'select_icon').css({'pointer-events': 'none', 'z-index': '1', 'display': 'inline', 'margin-left': '-19px', 'vertical-align': 'top', 'background-color': '#ffffff'});	// background-color = stupid IE9 bug
		$('#timezoneWrapper, #timezoneWrapperTODO').find('select').after($($('<div>').append($(newSVG).clone()).html()));
	}
	// INFO LABEL ALIGN WITH UNDELYING SELECT FIX
	if($.browser.webkit && !!$.browser.safari)
		$('.infoSpan[data-type="txt_interval"]').css('padding-left', '3px');
	/*************************** END OF BAD HACKS SECTION ***************************/

	setFirstDay();
	origResourceCalDAVListTemplate = $('#ResourceCalDAVListTemplate').clone().wrap('<div>').parent().html();
	origResourceCalDAVTODOListTemplate = $('#ResourceCalDAVTODOListTemplate').clone().wrap('<div>').parent().html();
	origVcalendarTemplate = $('#CAEvent .saveLoader').clone().wrap('<div>').parent().html() + $('#repeatConfirmBox').clone().wrap('<div>').parent().html() + $('#event_details_template').clone().wrap('<div>').parent().html();
	origVtodoTemplate = $('#repeatConfirmBoxTODO').clone().wrap('<div>').parent().html() + $('#todo_details_template').clone().wrap('<div>').parent().html();
	origVtodoLoaderTemplate=$('#todoLoader .saveLoader').clone().wrap('<div>').parent().html();
	origLoaderTemplate = $('#MainLoaderInner').clone().wrap('<div>').html();

	for(var i in timezones)
		timezoneKeys.push(i);

	timezoneKeys.push('0local');
	timezoneKeys.push('1UTC');

	timezoneKeys.sort();

	timezoneKeys[0] = timezoneKeys[0].substring(1);
	timezoneKeys[1] = timezoneKeys[1].substring(1);

	jQuery.extend(timezones,{'UTC':{}});

	if(typeof globalDatepickerFormat!='undefined' && globalDatepickerFormat!=null)
		globalSessionDatepickerFormat=globalDatepickerFormat;
	if(typeof globalAMPMFormat!='undefined' && globalAMPMFormat!=null)
		globalSessionAMPMFormat=globalAMPMFormat;
}

function setCalendarNumber()
{
	if($('.resourceCalDAV_header:visible').length>1 || (!$('.resourceCalDAV_header:visible').length  && $('.resourceCalDAV_item:visible').length>1))
		$('.addRemoveAllCalDAV').show();
	if($('.resourceCalDAVTODO_header:visible').length>1 || (!$('.resourceCalDAVTODO_header:visible').length  && $('.resourceCalDAVTODO_item:visible').length>1))
		$('.addRemoveAllCalDAVTODO').show();
	initSearchEngine();
	for(var i=0; i<globalResourceCalDAVList.collections.length;i++)
		if(globalResourceCalDAVList.collections[i].uid!=undefined && globalResourceCalDAVList.collections[i].syncRequired)
			globalCalendarNumber++;
	for(var i=0; i<globalResourceCalDAVList.TodoCollections.length;i++)
		if(globalResourceCalDAVList.TodoCollections[i].uid!=undefined && globalResourceCalDAVList.TodoCollections[i].syncRequired)
			globalCalendarNumber++;
}

function setLogoCalDAV()
{
	$('img[data-type="system_logo"]').attr('src', 'images/logo_cdz_' + new Date().getDate().pad(2) + '.svg');
}
