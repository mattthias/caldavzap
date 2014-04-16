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

function checkTimezone(timezone)
{
	if(timezone in timezones)
		return timezone;
	else if(timezone in timezones_alt)
		return checkTimezone(timezones_alt[timezone]);
	return null;
}
function CalDAVeditor_cleanup()
{
	CalDAVcleanupRegexEnvironment();
	/*************************** BAD HACKS SECTION ***************************/
	/* IE or FF */
	if($.browser.msie || $.browser.mozilla)
	{
		// ADD empty SVG to interface (we will replace it later)
		$('<svg data-type="select_icon"></svg>').css('display', 'none').insertAfter($('#event_details_template, #todo_details_template').find('select'));
	}
	/*************************** END OF BAD HACKS SECTION ***************************/

	/*************************** BAD HACKS SECTION ***************************/
	if($.browser.msie || $.browser.mozilla)
	{
		var newSVG=$(SVG_select).attr('data-type', 'select_icon').css({'pointer-events': 'none', 'z-index': '1', 'display': 'inline', 'margin-left': '-19px', 'vertical-align': 'top', 'background-color': '#ffffff'});	// background-color = stupid IE9 bug
		$('#event_details_template, #todo_details_template').find('svg[data-type="select_icon"]').replaceWith($('<div>').append($(newSVG).clone()).html());
	}
	/*************************** END OF BAD HACKS SECTION ***************************/
}

function animate_messageCalendar(messageSelector, messageTextSelector, duration, operation)
{
	if(operation==undefined)
		operation='+=';
	var height=$(messageTextSelector).height()+14;
	var animation=500;

	$(messageSelector).animate({
			'max-height': height+'px',
			height: (operation==undefined ? '+=' : operation)+height+'px'
		},
		animation,
		function(){
			if(operation=='+=')
				setTimeout(function(){animate_messageCalendar(messageSelector, messageTextSelector, 0, '-=');}, duration);
		}
	);
	return duration+2*animation;
}

function show_editor_messageCalendar(inputPosition, inputSetClass, inputMessage, inputDuration, callback)
{
	var formShown='';

	if($('#todo_details_template').css('display')!='none')
		formShown='Todo';
	else
		formShown='Event';

	if(inputPosition==undefined || inputPosition=='in')
	{
		messageSelector='#'+formShown+'InMessage';
		messageTextSelector='#'+formShown+'InMessageText';
	}
	else
	{
		messageSelector='#'+formShown+'Message';
		messageTextSelector='#'+formShown+'MessageText';
	}

	$(messageTextSelector).attr('class', inputSetClass);
	$(messageTextSelector).text(inputMessage);

	var a=animate_messageCalendar(messageSelector, messageTextSelector, inputDuration);

	if(callback!=undefined)
		callback(a);
}

function show_editor_loader_messageCalendar(inputForm, inputSetClass, inputMessage, callback)
{
	var formShown='';

	if(inputForm=='vtodo')
		formShown='#todoLoader';
	else
		formShown='#CAEvent';

	messageSelector=formShown+' .saveLoader';
	messageTextSelector=formShown+' .saveLoaderInfo';

	$(messageTextSelector).addClass(inputSetClass);
	$(messageTextSelector).text(inputMessage);
	setTimeout(function(){
		if(inputForm=='vtodo')
			$(formShown).hide();
		else
			$(messageSelector).hide();
		$(messageTextSelector).text('');
		$(messageTextSelector).removeClass(inputSetClass);
		if(callback!=undefined)
			callback(globalHideInfoMessageAfter);
	}, globalHideInfoMessageAfter);

}

window.onkeydown=function(event)
{
	if(event.which==27)
	{
		if(globalActiveApp=='CalDavZAP' && $('#CAEvent').is(':visible') && $('#EventDisabler').is(':hidden'))
			$('#closeButton').click();
		else if(globalActiveApp=='Projects' && $('#ProjectEventForm').is(':visible') && $('#ProjectsDisabler').is(':hidden'))
			$('#cancelActivity').click();
	}
};

function items(etag, from, end, name, isall, uid, color, rid, ev_id, note, displayValue, alertTime, alertNote, untilDate, type, interval, after, repeatStart, repeatEnd, byMonthDay, repeatCount, realRepeatCount, vcalendar, location, alertTimeOut, timeZone, realStart ,realEnd, byDay, rec_id, wkst, classType, avail, hrefUrl,compareString,priority,searchData,status)
{
	this.etag=etag;
	this.id=uid;
	this.start=from;
	this.end=end;
	this.title=name;
	this.allDay=isall;
	this.color=color;
	this.res_id=rid;
	this.ev_id=ev_id;
	this.note=note;
	this.displayValue=displayValue;
	this.alertTime=alertTime;
	this.alertNote=alertNote;
	this.untilDate=untilDate;
	this.repeatStart=repeatStart;
	this.repeatEnd=repeatEnd;
	this.type=type;
	this.interval=interval;
	this.after=after;
	this.byMonthDay=byMonthDay;
	this.repeatCount=repeatCount;
	this.realRepeatCount=realRepeatCount;
	this.vcalendar=vcalendar;
	this.location=location;
	this.alertTimeOut=alertTimeOut;
	this.timeZone=timeZone;
	this.realStart=realStart;
	this.realEnd=realEnd;
	this.byDay=byDay;
	this.rec_id=rec_id;
	this.wkst=wkst;
	this.classType=classType;
	this.avail=avail;
	this.hrefUrl=hrefUrl;
	this.compareString=compareString;
	this.priority=priority;
	this.searchData=searchData;
	this.status=status;
}

function todoItems(from, to, untilDate, type, interval, after, wkst, repeatStart, repeatEnd, repeatCount, realRepeatCount, byDay, location, note, title, uid, vcalendar, color, etag, alertTime, alertNote, status, filterStatus,  rec_id, repeatHash,  percent, displayValue, res_id, compareString, timeZone, realStart, realEnd, alertTimeOut,classType, url, completedOn, sequence,priority,finalString,searchData)
{
	this.start=from;
	this.end=to;
	this.untilDate=untilDate;
	this.type=type;
	this.interval=interval;
	this.after=after;
	this.wkst=wkst;
	this.repeatStart=repeatStart;
	this.repeatEnd=repeatEnd;
	this.repeatCount=repeatCount;
	this.realRepeatCount=realRepeatCount;
	this.byDay=byDay;
	this.location=location;
	this.note=note;
	this.title=title;
	this.id=uid;
	this.vcalendar=vcalendar;
	this.color=color;
	this.etag=etag;
	this.alertTime=alertTime;
	this.alertNote=alertNote;
	this.status=status;
	this.filterStatus=filterStatus;
	this.percent=percent;
	this.displayValue=displayValue;
	this.res_id=res_id;
	this.compareString=compareString;
	this.alertTimeOut=alertTimeOut;
	this.timeZone=timeZone;
	this.realStart=realStart;
	this.realEnd=realEnd;
	this.classType=classType;
	this.url=url;
	this.isTODO=true;
	this.rec_id= rec_id;
	this.repeatHash= repeatHash;
	this.completedOn=completedOn;
	this.sequence=sequence;
	this.priority=priority;
	this.finalString=finalString;
	this.searchData=searchData;
}

function rgb2hex(rgb)
{
	rgb=rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d*)?|(?:\.\d+)))?\)$/);
	function hex(x)
	{
		return ("0"+parseInt(x).toString(16)).slice(-2);
	}
	return "#"+hex(rgb[1])+hex(rgb[2])+hex(rgb[3]);
}

function setLoadingLimit(forceLoad, allSyncMode)
{
	if(forceLoad)
	{
		if(globalSettings.eventstartpastlimit!=null && (allSyncMode || globalLimitLoading=='past'))
		{
			var pastDate = new Date(globalLoadedLimit.getTime());
			pastDate.setDate(pastDate.getDate()-7);
			globalBeginPast = new Date(pastDate.getTime());
		}
		if(globalSettings.eventstartfuturelimit!=null && (allSyncMode || globalLimitLoading=='future'))
		{
			var futureDate = new Date(globalToLoadedLimit.getTime());
			futureDate.setDate(futureDate.getDate()+14);
			globalBeginFuture = new Date(futureDate.getTime());
		}
	}
}

function initSearchEngine()
{
	globalCalDAVQs=$('input[data-type="PH_CalDAVsearch"]').quicksearch('#SystemCalDavZAP .event_item',{
				delay: 500,
				hide: function(){
					$(this).addClass('searchCalDAV_hide');
					if(this.tagName.toLowerCase()=='tr' && $(this).is(':last-child'))
					{
						if($(this).siblings().addBack().not('.searchCalDAV_hide').length)
							$(this).parent().prev().find('tr').removeClass('searchCalDAV_hide');
						else
							$(this).parent().prev().find('tr').addClass('searchCalDAV_hide');
					}
				},
				show: function(){
					$(this).removeClass('searchCalDAV_hide');
					if(this.tagName.toLowerCase() == 'tr' && $(this).is(':last-child'))
						$(this).parent().prev().find('tr').removeClass('searchCalDAV_hide');
				},
				prepareQuery: function(val){
					return val.multiReplace(globalSearchTransformAlphabet).toLowerCase().split(' ');
				}
		});

		globalCalDAVTODOQs=$('input[data-type="PH_CalDAVTODOsearch"]').quicksearch('#SystemCalDavTODO .event_item',{
				delay: 500,
				onAfter: function () {
					if(!$('#TodoDisabler').is(':visible'))
						if(!$('#todoList').find('.fc-event-selected:visible').length)
							$('#todoList').fullCalendar('selectEvent');
				},
				hide: function(){
					$(this).addClass('searchCalDAV_hide');
				},
				show: function(){
					$(this).removeClass('searchCalDAV_hide');
				},
				prepareQuery: function(val){
					return val.multiReplace(globalSearchTransformAlphabet).toLowerCase().split(' ');
				}
		});
}

//SORRY FOR THAT-----------------------------------------------------------------------------------------------------
function checkEventLoader(inputCounter, needRefresh)
{
	inputCounter.counter++;
	if(inputCounter.counter==inputCounter.collectionLength)
	{
		if(inputCounter.listType=='vevent')
			$('#ResourceCalDAVList [data-id="'+inputCounter.uid+'"]').removeClass('r_operate');
		else
			$('#ResourceCalDAVTODOList [data-id="'+inputCounter.uid+'"]').removeClass('r_operate');

		if((globalLimitTodoLoading=='' && globalLimitLoading=='') || (globalSettings.eventstartpastlimit==null && globalSettings.eventstartfuturelimit==null))
		{
			if(inputCounter.listType=='vevent')
				globalAccountSettings[inputCounter.resourceIndex].calendarNo--;
			else if(inputCounter.listType=='vtodo')
				globalAccountSettings[inputCounter.resourceIndex].todoNo--;

			if(((globalAccountSettings[inputCounter.resourceIndex].calendarNo==0) && (globalAccountSettings[inputCounter.resourceIndex].todoNo==0) && globalCalDAVInitLoad) || (!globalCalDAVInitLoad))
			{
				updateMainLoader(needRefresh,undefined,inputCounter.uid);
			}
		}
		else if(globalOnlyCalendarNumberCount==globalOnlyCalendarNumber || globalOnlyTodoCalendarNumberCount==globalTodoCalendarNumber)
			updateMainLoader(needRefresh,inputCounter.listType,inputCounter.uid);
	}
}

function getResourceByCollection(calendarUID)
{
	var coll = globalResourceCalDAVList.getCollectionByUID(calendarUID);
	var tmp=coll.accountUID.match(vCalendar.pre['accountUidParts']);

	var resourceCalDAV_href=tmp[1]+tmp[3]+tmp[4];
	var resourceCalDAV_user=tmp[2];

	for(var i=0;i<globalAccountSettings.length;i++)
		if(globalAccountSettings[i].href==resourceCalDAV_href && globalAccountSettings[i].userAuth.userName==resourceCalDAV_user)
			resourceSettings=globalAccountSettings[i];

	return resourceSettings;
}

function updateMainLoaderText(type)
{
	if(globalCalDAVInitLoad)
	{
		globalCalendarNumberCount++;
		$('#MainLoaderInner').html(localization[globalInterfaceLanguage].loadingCalendars.replace('%act%', globalCalendarNumberCount).replace('%total%', globalCalendarNumber));
	}
	else if((globalLimitTodoLoading!='' || globalLimitLoading!='') && (globalSettings.eventstartpastlimit!=null || globalSettings.eventstartfuturelimit!=null))
	{
		if(type=='vevent' && (globalLimitLoading=='past' || globalLimitLoading=='future'))
		{
			globalOnlyCalendarNumberCount++;
			$('#CalendarLoader .loaderInfo').html(localization[globalInterfaceLanguage].loadingCalendars.replace('%act%', globalOnlyCalendarNumberCount).replace('%total%', globalOnlyCalendarNumber));
		}
		else if(type=='vtodo' && (globalLimitTodoLoading=='pastTodo' || globalLimitTodoLoading=='futureTodo'))
		{
			globalOnlyTodoCalendarNumberCount++;
			$('#CalendarLoaderTODO .loaderInfo').html(localization[globalInterfaceLanguage].loadingCalendars.replace('%act%', globalOnlyTodoCalendarNumberCount).replace('%total%', globalTodoCalendarNumber));
		}
	}
	else if(isAvaible('Settings') && globalSettingsSaving && globalFirstHideLoader)
	{
		globalLoadedCollectionsCount++;
		$('#SettingsFormOverlay').find('.saveLoaderInfo').text('Loading calendars '+globalLoadedCollectionsCount+' of '+globalLoadedCollectionsNumber);
	}
}

function updateMainLoaderTextFinal()
{
	$('#MainLoaderInner').html(localization[globalInterfaceLanguage].renderingE);
}

function updateMainLoaderTextTimezone()
{
	$('#MainLoaderInner').html(localization[globalInterfaceLanguage].timezoneChange);
}

function updateMainLoader(needRefresh,type,collUID)
{
	if((type==null && $('.r_operate').length==0) || (type=='vtodo' && $('#ResourceCalDAVTODOList .r_operate').length==0) || (type=='vevent' && $('#ResourceCalDAVList .r_operate').length==0))
	{
		var rex = vCalendar.pre['accountUidParts'];
		if(globalCalDAVInitLoad)
		{
			updateMainLoaderTextFinal();
			var counter = 0;
			for(calendarUID in globalEventList.displayEventsArray)
				counter++;
			for(calendarUID in globalEventList.displayTodosArray)
				counter++;

			var beforeScroll = $('#main').width()-$('#calendar').width();
			var beforeScrollTodo = $('#mainTODO').width()-$('#todoList').width();
			for(calendarUID in globalEventList.displayEventsArray)
				setTimeout(function(calendarUID){
					if(globalSettings.displayhiddenevents || globalVisibleCalDAVCollections.indexOf(calendarUID)!=-1)
					{
						var bg = false;
						var tmpUID = calendarUID.match(rex);
						var hrefUID='';
						if(tmpUID!=null)
							hrefUID = tmpUID[4];

						var resource = getResourceByCollection(calendarUID);
						if(typeof resource.backgroundCalendars!='undefined' && resource.backgroundCalendars!=null && resource.backgroundCalendars!='')
						{
							var rbCalendars = '';
							if(resource.backgroundCalendars instanceof Array)
								rbCalendars=resource.backgroundCalendars;
							else
								rbCalendars = [resource.backgroundCalendars];
							for(var j=0; j<rbCalendars.length;j++)
							{
								if (typeof rbCalendars[j]=='string')
								{
									var index = hrefUID.indexOf(rbCalendars[j]);
									if(index!=-1)
										if(hrefUID.length == (index+rbCalendars[j].length))
											bg=true;
								}
								else if (typeof rbCalendars[j]=='object' && hrefUID.match(rbCalendars[j])!=null)
									bg = true;
							}
						}
						if(globalResourceCalDAVList.getEventCollectionByUID(calendarUID).makeLoaded)
							globalResourceCalDAVList.getEventCollectionByUID(calendarUID).fcSource = $('#calendar').fullCalendar('addEventSource', globalEventList.displayEventsArray[calendarUID], bg);
					}
					counter--;
					if(counter == 0)
					{
						var afterScroll = $('#main').width()-$('#calendar').width();
						rerenderCalendar(beforeScroll!=afterScroll);
						var afterScrollTodo = $('#mainTODO').width()-$('#todoList').width();
						rerenderTodo(beforeScrollTodo!=afterScrollTodo);
						$('#calendar').fullCalendar('findToday');
						globalCalDAVInitLoad=false;
						$('#todoList').fullCalendar('allowSelectEvent',true);
						$('#todoList').fullCalendar('selectEvent', $('.fc-view-todo .fc-list-day').find('.fc-event:visible:first'));
						globalCalWidth=$('#main').width();
						$('#SystemCalDavZAP .fc-header-center ').removeClass('r_operate_all');
						showTimezones(globalSessionTimeZone, 'Picker');
						showTimezones(globalSessionTimeZone, 'PickerTODO');
						loadNextApplication(true);
					}
				},10,calendarUID);

			for(calendarUID in globalEventList.displayTodosArray)
				setTimeout(function(calendarUID){
					if(globalSettings.displayhiddenevents || globalVisibleCalDAVTODOCollections.indexOf(calendarUID)!=-1)
					{
						if(globalResourceCalDAVList.getTodoCollectionByUID(calendarUID).makeLoaded)
							globalResourceCalDAVList.getTodoCollectionByUID(calendarUID).fcSource = $('#todoList').fullCalendar('addEventSource', globalEventList.displayTodosArray[calendarUID]);
					}
					counter--;
					if(counter == 0)
					{
						var afterScroll = $('#main').width()-$('#calendar').width();
						rerenderCalendar(beforeScroll!=afterScroll);
						var afterScrollTodo = $('#mainTODO').width()-$('#todoList').width();
						rerenderTodo(beforeScrollTodo!=afterScrollTodo);
						$('#calendar').fullCalendar('findToday');
						globalCalDAVInitLoad=false;
						$('#todoList').fullCalendar('allowSelectEvent',true);
						$('#todoList').fullCalendar('selectEvent', $('.fc-view-todo .fc-list-day').find('.fc-event:visible:first'));
						globalCalWidth=$('#main').width();
						$('#SystemCalDavZAP .fc-header-center ').removeClass('r_operate_all');
						showTimezones(globalSessionTimeZone, 'Picker');
						showTimezones(globalSessionTimeZone, 'PickerTODO');
						loadNextApplication(true);
					}
				},10,calendarUID);
		}
		else
		{
			if(type==null || type=='vevent')
			{
				if((globalSettings.displayhiddenevents || globalVisibleCalDAVCollections.indexOf(collUID)!=-1) && globalLimitLoading=='' && needRefresh && typeof collUID!= 'undefined' && globalResourceCalDAVList.getEventCollectionByUID(collUID)!=null && globalResourceCalDAVList.getEventCollectionByUID(collUID).fcSource==null)
				{
					var bg = false;
					var tmpUID = collUID.match(rex);
					var hrefUID='';
					if(tmpUID!=null)
						hrefUID = tmpUID[4];

					var resource = getResourceByCollection(collUID);
					if(typeof resource.backgroundCalendars!='undefined' && resource.backgroundCalendars!=null && resource.backgroundCalendars!='')
					{
						var rbCalendars = '';
						if(resource.backgroundCalendars instanceof Array)
							rbCalendars=resource.backgroundCalendars;
						else
							rbCalendars = [resource.backgroundCalendars];
						for(var j=0; j<rbCalendars.length;j++)
						{
							if (typeof rbCalendars[j]=='string')
							{
								var index = hrefUID.indexOf(rbCalendars[j]);
								if(index!=-1)
									if(hrefUID.length == (index+rbCalendars[j].length))
										bg=true;
							}
							else if (typeof rbCalendars[j]=='object' && hrefUID.match(rbCalendars[j])!=null)
								bg = true;
						}
					}
					globalResourceCalDAVList.getEventCollectionByUID(collUID).fcSource = $('#calendar').fullCalendar('addEventSource', globalEventList.displayEventsArray[collUID], bg);
				}
				if(needRefresh)
					refetchCalendarEvents();
				setTimeout(function(){
					if(globalLimitLoading!='' && (globalSettings.eventstartpastlimit!=null || globalSettings.eventstartfuturelimit!=null))
					{
						$('#CalendarLoader').css('display', 'none');
						$('#CalendarLoader').find('.loaderInfo').text(localization[globalInterfaceLanguage].calendarLoader);
						globalLimitLoading = '';
						globalOnlyCalendarNumberCount = 0;
					}
					$('#SystemCalDavZAP .fc-header-center ').removeClass('r_operate_all');
				},10);
			}
			if(type==null || type=='vtodo')
			{
				if((globalSettings.displayhiddenevents || globalVisibleCalDAVTODOCollections.indexOf(collUID)!=-1) && globalLimitTodoLoading=='' && needRefresh && typeof collUID!= 'undefined' && globalResourceCalDAVList.getTodoCollectionByUID(collUID)!=null && globalResourceCalDAVList.getTodoCollectionByUID(collUID).fcSource==null)
				{
					globalResourceCalDAVList.getTodoCollectionByUID(collUID).fcSource = $('#todoList').fullCalendar('addEventSource', globalEventList.displayTodosArray[collUID]);
				}
				if(needRefresh)
					refetchTodoEvents();
				setTimeout(function(){
					if(globalLimitTodoLoading!='' && (globalSettings.eventstartpastlimit!=null || globalSettings.eventstartfuturelimit!=null))
					{
						$('#CalendarLoaderTODO').css('display', 'none');
						$('#CalendarLoaderTODO').find('.loaderInfo').text(localization[globalInterfaceLanguage].calendarLoader);
						globalLimitTodoLoading = '';
						globalOnlyTodoCalendarNumberCount = 0;
					}
				},10);
			}
			showTimezones(globalSessionTimeZone, 'Picker');
			showTimezones(globalSessionTimeZone, 'PickerTODO');
			if(isAvaible('Settings') && globalSettingsSaving && globalLoadedCollectionsCount == globalLoadedCollectionsNumber)
			{
				globalSettingsSaving=false;
				setTimeout(function(){
					$('#SettingsFormOverlay').hide();
					$('#SettingsFormOverlay').find('.saveLoaderInfo').text('');
					$('.settingsButtons, #ResourceSettingsListOverlay').css('display','none');
				},globalHideInfoMessageAfter);
			}
		}
	}
}

function checkFontColor(hexColor)
{
	if((hexColor!='') && (hexColor!=undefined))
	{
		var color=hexColor;
		var cutHex=((color.charAt(0)=="#") ? color.substring(1, 7) : color);

		var resultColor;
		/*
		var R=parseInt(cutHex.substring(0, 2), 16);
		var G=parseInt(cutHex.substring(2, 4), 16);
		var B=parseInt(cutHex.substring(4, 6), 16);

		var a=1-(0.299*R+0.587*G+0.114*B)/255;
		*/
		var a=checkColorBrightness(cutHex);
		if(a<140)
			resultColor='#ffffff'; // dark colors - white font
		else
			resultColor='#404040'; // bright colors - black font

		return resultColor;
	}

	return '#000';
}

function checkFor(data_id)
{
	if(typeof vCalendar.tplM['contentline_TRIGGER']!='undefined' && vCalendar.tplM['contentline_TRIGGER']!='' &&
		vCalendar.tplM['contentline_TRIGGER']!=null && vCalendar.tplM['contentline_TRIGGER'].length>0)
			vCalendar.tplM['contentline_TRIGGER'].splice(data_id-1, 1);

	if(typeof vCalendar.tplM['contentline_VANOTE']!='undefined' && vCalendar.tplM['contentline_VANOTE']!='' &&
		vCalendar.tplM['contentline_VANOTE']!=null && vCalendar.tplM['contentline_VANOTE'].length>0)
			vCalendar.tplM['contentline_VANOTE'].splice(data_id-1, 1);

	if(typeof vCalendar.tplM['contentline_ACTION']!='undefined' && vCalendar.tplM['contentline_ACTION']!='' &&
		vCalendar.tplM['contentline_ACTION']!=null && vCalendar.tplM['contentline_ACTION'].length>0)
			vCalendar.tplM['contentline_ACTION'].splice(data_id-1, 1);

	if(typeof vCalendar.tplM['unprocessedVALARM']!='undefined' && vCalendar.tplM['unprocessedVALARM']!='' &&
		vCalendar.tplM['unprocessedVALARM']!=null && vCalendar.tplM['unprocessedVALARM'].length>0)
			vCalendar.tplM['unprocessedVALARM'].splice(data_id-1, 1);
}

function checkForTodo(data_id)
{
	if(typeof vCalendar.tplM['VTcontentline_TRIGGER']!='undefined' && vCalendar.tplM['VTcontentline_TRIGGER']!='' &&
		vCalendar.tplM['VTcontentline_TRIGGER']!=null && vCalendar.tplM['VTcontentline_TRIGGER'].length>0)
			vCalendar.tplM['VTcontentline_TRIGGER'].splice(data_id-1, 1);

	if(typeof vCalendar.tplM['VTcontentline_VANOTE']!='undefined' && vCalendar.tplM['VTcontentline_VANOTE']!='' &&
		vCalendar.tplM['VTcontentline_VANOTE']!=null && vCalendar.tplM['VTcontentline_VANOTE'].length>0)
			vCalendar.tplM['VTcontentline_VANOTE'].splice(data_id-1, 1);

	if(typeof vCalendar.tplM['VTcontentline_ACTION']!='undefined' && vCalendar.tplM['VTcontentline_ACTION']!='' &&
		vCalendar.tplM['VTcontentline_ACTION']!=null && vCalendar.tplM['VTcontentline_ACTION'].length>0)
			vCalendar.tplM['VTcontentline_ACTION'].splice(data_id-1, 1);

	if(typeof vCalendar.tplM['VTunprocessedVALARM']!='undefined' && vCalendar.tplM['VTunprocessedVALARM']!='' &&
		vCalendar.tplM['VTunprocessedVALARM'] != null && vCalendar.tplM['VTunprocessedVALARM'].length>0)
			vCalendar.tplM['VTunprocessedVALARM'].splice(data_id-1, 1);
}

function div(op1, op2)
{
	var a=(op1/op2);

	var b=(op1%op2)/op2;
	return a-b;
}

function binarySearch(array, first, last, value)
{
	var mid=0;
	value=value.getTime();
	while(first<=last)
	{
		mid=div((first+last), 2);
		var date3=$.fullCalendar.parseDate(array[mid].sortStart);
		date3=date3.getTime();

		if(date3<value)
			first=mid+1;
		else if(date3>value)
			last=mid-1;
		else
			break;
	}
	return mid;
}

function parseISO8601(str)
{
	// we assume str is a UTC date ending in 'Z'
	var err=0;
	if(str.indexOf('T')!=-1)
	{
		var parts=str.split('T');

		if(parts.length>1)
			var dateParts=parts[0].split('-');
		else
			return null;

		if(dateParts.length>1)
			var timeParts=parts[1].split('Z');
		else
			return null;

		var timeSubParts=timeParts[0].split(':');
		if(timeSubParts.length>1)
			var timeSecParts=timeSubParts[2].split('.');
		else
			return null;

		var timeHours=Number(timeSubParts[0]);
		_date=new Date;
		_date.setFullYear(Number(dateParts[0]));
		_date.setMonth(Number(dateParts[1])-1);
		_date.setDate(Number(dateParts[2]));
		_date.setHours(Number(timeHours));
		_date.setMinutes(Number(timeSubParts[1]));
		_date.setSeconds(Number(timeSecParts[0]));
		if(timeSecParts[1])
			_date.setUTCMilliseconds(Number(timeSecParts[1]));

		// by using setUTC methods the date has already been converted to local time(?)
		return _date;
	}
	else
	{
		var dateParts=str.split('-');

		if(dateParts.length!=3)
			return null;

		_date=new Date;
		_date.setFullYear(Number(dateParts[0]));
		_date.setMonth(Number(dateParts[1])-1);
		_date.setDate(Number(dateParts[2]));

		return _date;
	}
}

function getValidRepeatDay(inputDate, RepeatDay)
{
	var newDate='';
	if(typeof RepeatDay=='string')
		newDate=$.fullCalendar.parseDate(RepeatDay);
	else
		newDate = new Date(RepeatDay.getTime());

	var monthNumber=inputDate.getMonth()+2;
	var dayOfMonth=newDate.getDate();
	
	if(monthNumber>12)
		monthNumber=1;

	var lastDayInMonth=new Date(inputDate.getFullYear(), monthNumber, 0);
		lastDayInMonth=lastDayInMonth.getDate();

	if(lastDayInMonth<dayOfMonth)
		return lastDayInMonth;
	else
		return dayOfMonth;
}

function loadRepeatEvents(inputRepeatEvent,prevLimit,toLimit)
{
	var frequency=inputRepeatEvent.frequency;
	var monthPlus=0, dayPlus=0;
	if(frequency=="DAILY\r\n" || frequency=="DAILY")
	{
		monthPlus=0,
		dayPlus=1;
	}
	else if(frequency=="WEEKLY\r\n" || frequency=="WEEKLY")
	{
		monthPlus=0,
		dayPlus=7;
	}
	else if(frequency=="MONTHLY\r\n" || frequency=="MONTHLY")
	{
		monthPlus=1,
		dayPlus=0;
	}
	else if(frequency=="YEARLY\r\n" || frequency=="YEARLY")
	{
		monthPlus=12,
		dayPlus=0;
	}
			
	var td='', td2='';
	var valOffsetFrom='',intOffset='';
	if(inputRepeatEvent.realStart)
		var varDate=new Date(inputRepeatEvent.realStart.getTime());
	else
		var varDate=new Date(inputRepeatEvent.start.getTime());
	if(inputRepeatEvent.realEnd)
		var varEndDate=new Date(inputRepeatEvent.realEnd.getTime());
	else
		var varEndDate=new Date(inputRepeatEvent.end.getTime());
	var repeatFromLine=new Date(prevLimit.getFullYear(), prevLimit.getMonth(), prevLimit.getDate(), 0, 0, 0);
	var repeatCount=inputRepeatEvent.repeatCount;
	var realRepeatCount=inputRepeatEvent.repeatCount;
	var byMonthDay=inputRepeatEvent.byMonthDay;
	var realStart,realEnd;
	if(inputRepeatEvent.realUntilDate=='')
		untilDate=toLimit;
	else
		untilDate=inputRepeatEvent.realUntilDate;
	if(inputRepeatEvent.realUntil=='')
		if(untilDate<repeatFromLine)
			return;
		
	if(byMonthDay!='' && dayPlus==0)
		byMonthDay=varDate.getDate()+dayPlus;

	var dayDifference=varEndDate.getTime()-varDate.getTime();
	var iterator=0;
	var ruleString=inputRepeatEvent.vcalendar.match(vCalendar.pre['contentline_RRULE2'])[0].match(vCalendar.pre['contentline_parse'])[4];
	var dates = new Array();
	if(ruleString.indexOf('BYMONTH=')!=-1 || ruleString.indexOf('BYMONTHDAY=')!=-1 || ruleString.indexOf('BYDAY=')!=-1)
	{
		if(inputRepeatEvent.rulePartsArray.length>0)
		{
			 
			if(inputRepeatEvent.lastGenDate!='')
			{
				var lastGen = new Date(inputRepeatEvent.lastGenDate.getTime());
				
				var onePrevNext = new Date(prevLimit.getTime());
				onePrevNext.setDate(0);
				inputRepeatEvent.lastGenDate.setDate(1);
				inputRepeatEvent.lastGenDate.setMonth(onePrevNext.getMonth()-1);
				//inputRepeatEvent.lastGenDate.setFullYear(onePrevNext.getFullYear());
				var objR =processRule(inputRepeatEvent.vcalendar,inputRepeatEvent.lastGenDate,inputRepeatEvent.rulePartsArray.slice(),[inputRepeatEvent.lastGenDate],frequencies.indexOf(inputRepeatEvent.frequency),toLimit,inputRepeatEvent.interval,inputRepeatEvent.uid,inputRepeatEvent.rCount,inputRepeatEvent.start,inputRepeatEvent.wkst,inputRepeatEvent.classType);
			}
			else 
				var objR =processRule(inputRepeatEvent.vcalendar,inputRepeatEvent.start,inputRepeatEvent.rulePartsArray.slice(),[inputRepeatEvent.start],frequencies.indexOf(inputRepeatEvent.frequency),toLimit,inputRepeatEvent.interval,inputRepeatEvent.uid,inputRepeatEvent.rCount,inputRepeatEvent.start,inputRepeatEvent.wkst,inputRepeatEvent.classType);
		
			dates=objR.dates;
			inputRepeatEvent.rCount=objR.rCount;
		}
		for(var idt=0;idt<dates.length;idt++)
		{
			varDate=new Date(dates[idt].getTime());
			varEndDate=new Date(varDate.getTime()+dayDifference);
			iterator++;
			
			if((varDate.getTime()-repeatFromLine.getTime())<0)
				continue;
			if((varDate.getTime()-toLimit.getTime())>=0)
				break;
			if(inputRepeatEvent.realUntil=='')
				var count=untilDate-varDate;
			else
				var count = inputRepeatEvent.realUntil - inputRepeatEvent.realRepeatCount;
			if(untilDate&&count<0 || inputRepeatEvent.realUntilDate==''&&count<=0)
				break;
			else
			{
					if(inputRepeatEvent.frequency=="YEARLY")
					{									
						if(inputRepeatEvent.lastYear!=varDate.getFullYear())
						{
							inputRepeatEvent.lastYear=varDate.getFullYear();
							if(inputRepeatEvent.lastYear>0 && inputRepeatEvent.rCount%inputRepeatEvent.interval!=0)
							{
								inputRepeatEvent.rCount++;
								continue;
							}			
							inputRepeatEvent.rCount++;
						}
					}
					realRepeatCount++;
					inputRepeatEvent.realRepeatCount=realRepeatCount;
					if(inputRepeatEvent.rec_id_array.length>0)
					{
						var checkCont = false;
						for(var ir=0;ir<inputRepeatEvent.rec_id_array.length;ir++)
						{
							var recString = inputRepeatEvent.rec_id_array[ir].split(';')[0];
							if(recString.charAt(recString.length-1)=='Z')
							{
								if(globalSettings.timezonesupport && inputRepeatEvent.timeZone in timezones)
								{
									var recValOffsetFrom=getOffsetByTZ(inputRepeatEvent.timeZone, varDate);
									var recTime = new Date(recString.parseComnpactISO8601().getTime());
									if(recValOffsetFrom)
									{
										var rintOffset=recValOffsetFrom.getSecondsFromOffset()*1000;
										recTime.setTime(recTime.getTime()+rintOffset);
									}
									if(recTime.toString()+inputRepeatEvent.rec_id_array[ir].split(';')[1] == varDate+inputRepeatEvent.stringUID)
										checkCont=true;
								}
							}
							else
							{
								if(recString.parseComnpactISO8601().toString()+inputRepeatEvent.rec_id_array[ir].split(';')[1] == varDate+inputRepeatEvent.stringUID)
									checkCont=true;
							}
						}
						if(checkCont)
							continue;
					}
					if(!inputRepeatEvent.allDay)
					{
						var dateStart, dateEnd;
						if(inputRepeatEvent.timeZone in timezones)
							valOffsetFrom=getOffsetByTZ(inputRepeatEvent.timeZone, varDate);

						realStart=new Date(varDate.getTime());
						dateStart=new Date(realStart.getTime());
						if(valOffsetFrom)
						{
							intOffset=(getLocalOffset(dateStart)*-1*1000)-valOffsetFrom.getSecondsFromOffset()*1000;
							dateStart.setTime(dateStart.getTime()+intOffset);
						}
						if(inputRepeatEvent.exDates.length>0)
							if(inputRepeatEvent.exDates.indexOf(dateStart.toString())!=-1)
								continue;
						realEnd=new Date(varEndDate.getTime());
						dateEnd=new Date(realEnd.getTime());
						if(intOffset)
							dateEnd.setTime(dateEnd.getTime()+intOffset);
					}
					else
					{
						realStart=new Date(varDate.getTime());
						if(inputRepeatEvent.exDates.length>0)
							if(inputRepeatEvent.exDates.indexOf(realStart.toString())!=-1)
								continue;
						var dateStart=$.fullCalendar.formatDate(varDate,"yyyy-MM-dd'T'HH:mm:ss");
						realEnd=new Date(varEndDate.getTime());
						var dateEnd=$.fullCalendar.formatDate(varEndDate,"yyyy-MM-dd'T'HH:mm:ss");
					}

					if(inputRepeatEvent.alertTime.length>0)
					{
						var repeatAlarm='',
						myVarDate='',
						alertString='';
						if(!inputRepeatEvent.collection.ignoreAlarms)
							for(var v=0;v<inputRepeatEvent.alertTime.length;v++)
							{
								if((inputRepeatEvent.alertTime[v].charAt(0)=='-') || (inputRepeatEvent.alertTime[v].charAt(0)=='+'))
								{
									var startTime;
									if(inputRepeatEvent.alertTime[v].charAt(0)=='-')
									{
										if(typeof dateStart=='string')
											startTime = $.fullCalendar.parseDate(dateStart);
										else
											startTime=new Date(dateStart.getTime());
										aTime=startTime.getTime() - parseInt(inputRepeatEvent.alertTime[v].substring(1, inputRepeatEvent.alertTime[v].length-1));
									}
									else if(inputRepeatEvent.alertTime[v].charAt(0)=='+')
									{
										if(typeof dateEnd=='string')
											startTime = $.fullCalendar.parseDate(dateEnd);
										else
											startTime=new Date(dateEnd.getTime());
										aTime=startTime.getTime() + parseInt(inputRepeatEvent.alertTime[v].substring(1, inputRepeatEvent.alertTime[v].length-1));
									}
									var now=new Date();
					
									if(aTime>now)
									{
										var delay=aTime-now;
										if(maxAlarmValue<delay)
											delay=maxAlarmValue;
										inputRepeatEvent.alertTimeOut[inputRepeatEvent.alertTimeOut.length]=setTimeout(function(startTime){
											showAlertEvents(inputRepeatEvent.uid, (aTime-now),{start:new Date(startTime.getTime), allDay:inputRepeatEvent.allDay, title:inputRepeatEvent.title,color:inputRepeatEvent.color});
										}, delay,startTime);
									}
								}
							}
					}
					repeatCount++;
					inputRepeatEvent.repeatCount=repeatCount;
					var tmpObj=new items(inputRepeatEvent.etag, dateStart,dateEnd, inputRepeatEvent.title, inputRepeatEvent.allDay,inputRepeatEvent.uid,inputRepeatEvent.evcolor, inputRepeatEvent.rid, inputRepeatEvent.evid, inputRepeatEvent.note, inputRepeatEvent.displayValue, inputRepeatEvent.alertTime, inputRepeatEvent.alertNote, inputRepeatEvent.realUntilDate, inputRepeatEvent.frequency, inputRepeatEvent.interval, inputRepeatEvent.realUntil, inputRepeatEvent.repeatStart, inputRepeatEvent.repeatEnd, byMonthDay, inputRepeatEvent.repeatCount, inputRepeatEvent.realRepeatCount, inputRepeatEvent.vcalendar, inputRepeatEvent.location, inputRepeatEvent.alertTimeOut,inputRepeatEvent.timeZone,realStart, realEnd, inputRepeatEvent.byDay, inputRepeatEvent.rec_id,inputRepeatEvent.wkst,inputRepeatEvent.classType,inputRepeatEvent.avail,inputRepeatEvent.hrefUrl,inputRepeatEvent.compareString,inputRepeatEvent.priority,inputRepeatEvent.title.toLowerCase().multiReplace(globalSearchTransformAlphabet),inputRepeatEvent.status);
					globalEventList.displayEventsArray[inputRepeatEvent.rid].splice(globalEventList.displayEventsArray[inputRepeatEvent.rid].length, 0, tmpObj);
					inputRepeatEvent.lastGenDate = new Date(varDate.getTime());
			}
		}
	}
	else
	{
		while(true)
		{
			var dayNumberStart=varDate.getDate()+dayPlus;
			var dayNumberEnd=varEndDate.getDate()+dayPlus;
			if(dayPlus==0)
			{
				dayNumberStart=getValidRepeatDay(varDate,inputRepeatEvent.start);
				dayNumberEnd=getValidRepeatDay(varEndDate,inputRepeatEvent.end);
			}

			if(varEndDate.getDate()>=dayNumberEnd)
			{
				varEndDate.setDate(dayNumberEnd);
				varEndDate.setMonth(varEndDate.getMonth()+monthPlus);
			}
			else
			{
				varEndDate.setMonth(varEndDate.getMonth()+monthPlus);
				varEndDate.setDate(dayNumberEnd);
			}

			varDate=new Date(varEndDate.getTime()-dayDifference);

			if(byMonthDay!='' && dayPlus==0)
				if(byMonthDay!=dayNumberStart)
					continue;

			iterator++;

			if((varDate.getTime()-repeatFromLine.getTime())<0)
				continue;
			if((varDate.getTime()-toLimit.getTime())>=0)
				break;

			var count=untilDate-varDate;
			if(count<0)
				break;
			else
			{
				if(inputRepeatEvent.byDay.length>0)
					if(inputRepeatEvent.byDay.indexOf(varDate.getDay().toString())==-1)
						continue;
				
				if((iterator%inputRepeatEvent.interval)==0)
				{
					realRepeatCount++;
					inputRepeatEvent.realRepeatCount=realRepeatCount;
					if(inputRepeatEvent.rec_id_array.length>0)
					{
						var checkCont = false;
						for(var ir=0;ir<inputRepeatEvent.rec_id_array.length;ir++)
						{
							var recString = inputRepeatEvent.rec_id_array[ir].split(';')[0];
							if(recString.charAt(recString.length-1)=='Z')
							{
								if(globalSettings.timezonesupport && inputRepeatEvent.timeZone in timezones)
								{
									var recValOffsetFrom=getOffsetByTZ(inputRepeatEvent.timeZone, varDate);
									var recTime = new Date(recString.parseComnpactISO8601().getTime());
									if(recValOffsetFrom)
									{
										var rintOffset=recValOffsetFrom.getSecondsFromOffset()*1000;
										recTime.setTime(recTime.getTime()+rintOffset);
									}	
									if(recTime.toString()+inputRepeatEvent.rec_id_array[ir].split(';')[1] == varDate+inputRepeatEvent.stringUID)
										checkCont=true;
								}
							}
							else
							{
								if(recString.parseComnpactISO8601().toString()+inputRepeatEvent.rec_id_array[ir].split(';')[1] == varDate+inputRepeatEvent.stringUID)
									checkCont=true;
							}
						}
						if(checkCont)
							continue;
					}
					if(!inputRepeatEvent.allDay)
					{
						var dateStart, dateEnd;
						if(inputRepeatEvent.timeZone in timezones)
							valOffsetFrom=getOffsetByTZ(inputRepeatEvent.timeZone, varDate);

						realStart=new Date(varDate.getTime());
						dateStart=new Date(realStart.getTime());
						if(valOffsetFrom)
						{
							intOffset=(getLocalOffset(dateStart)*-1*1000)-valOffsetFrom.getSecondsFromOffset()*1000;
							dateStart.setTime(dateStart.getTime()+intOffset);
						}
						if(inputRepeatEvent.exDates.length>0)
							if(inputRepeatEvent.exDates.indexOf(dateStart.toString())!=-1)
								continue;
						realEnd=new Date(varEndDate.getTime());
						dateEnd=new Date(realEnd.getTime());
						if(intOffset)
							dateEnd.setTime(dateEnd.getTime()+intOffset);
					}
					else
					{
						realStart=new Date(varDate.getTime());
						if(inputRepeatEvent.exDates.length>0)
							if(inputRepeatEvent.exDates.indexOf(realStart.toString())!=-1)
								continue;
						var dateStart=$.fullCalendar.formatDate(varDate,"yyyy-MM-dd'T'HH:mm:ss");
						realEnd=new Date(varEndDate.getTime());
						var dateEnd=$.fullCalendar.formatDate(varEndDate,"yyyy-MM-dd'T'HH:mm:ss");
					}

					if(inputRepeatEvent.alertTime.length>0)
					{
						var repeatAlarm='',
						myVarDate='',
						alertString='';
						if(!inputRepeatEvent.collection.ignoreAlarms)
							for(var v=0;v<inputRepeatEvent.alertTime.length;v++)
							{
								if((inputRepeatEvent.alertTime[v].charAt(0)=='-') || (inputRepeatEvent.alertTime[v].charAt(0)=='+'))
								{
									var startTime;
									if(inputRepeatEvent.alertTime[v].charAt(0)=='-')
									{
										if(typeof dateStart=='string')
											startTime = $.fullCalendar.parseDate(dateStart);
										else
											startTime=new Date(dateStart.getTime());
										aTime=startTime.getTime() - parseInt(inputRepeatEvent.alertTime[v].substring(1, inputRepeatEvent.alertTime[v].length-1));
									}
									else if(inputRepeatEvent.alertTime[v].charAt(0)=='+')
									{
										if(typeof dateEnd=='string')
											startTime = $.fullCalendar.parseDate(dateEnd);
										else
											startTime=new Date(dateEnd.getTime());
										aTime=startTime.getTime() + parseInt(inputRepeatEvent.alertTime[v].substring(1, inputRepeatEvent.alertTime[v].length-1));
									}
									var now=new Date();
					
									if(aTime>now)
									{
										var delay=aTime-now;
										if(maxAlarmValue<delay)
											delay=maxAlarmValue;
										inputRepeatEvent.alertTimeOut[inputRepeatEvent.alertTimeOut.length]=setTimeout(function(startTime){
											showAlertEvents(inputRepeatEvent.uid, (aTime-now),{start:new Date(startTime.getTime()), allDay:inputRepeatEvent.allDay, title:inputRepeatEvent.title,color:inputRepeatEvent.color});
										}, delay,startTime);
									}
								}
							}
					}
					repeatCount++;
					inputRepeatEvent.repeatCount=repeatCount;
					var tmpObj=new items(inputRepeatEvent.etag, dateStart,dateEnd, inputRepeatEvent.title, inputRepeatEvent.allDay,inputRepeatEvent.uid,inputRepeatEvent.evcolor, inputRepeatEvent.rid, inputRepeatEvent.evid, inputRepeatEvent.note, inputRepeatEvent.displayValue, inputRepeatEvent.alertTime, inputRepeatEvent.alertNote, inputRepeatEvent.realUntilDate, inputRepeatEvent.frequency, inputRepeatEvent.interval, inputRepeatEvent.realUntil, inputRepeatEvent.repeatStart, inputRepeatEvent.repeatEnd, byMonthDay, inputRepeatEvent.repeatCount, inputRepeatEvent.realRepeatCount, inputRepeatEvent.vcalendar, inputRepeatEvent.location, inputRepeatEvent.alertTimeOut,inputRepeatEvent.timeZone,realStart, realEnd, inputRepeatEvent.byDay, inputRepeatEvent.rec_id,inputRepeatEvent.wkst,inputRepeatEvent.classType,inputRepeatEvent.avail,inputRepeatEvent.hrefUrl,inputRepeatEvent.compareString,inputRepeatEvent.priority,inputRepeatEvent.title.toLowerCase().multiReplace(globalSearchTransformAlphabet),inputRepeatEvent.status);
					globalEventList.displayEventsArray[inputRepeatEvent.rid].splice(globalEventList.displayEventsArray[inputRepeatEvent.rid].length, 0, tmpObj);
				}
			}
		}
	}
}

function loadRepeatTodo(inputRepeatTodo,prevLimit)
{
	var frequency=inputRepeatTodo.frequency;
	var monthPlus=0, dayPlus=0;
	if(frequency=="DAILY\r\n" || frequency=="DAILY")
	{
		monthPlus=0,
		dayPlus=1;
	}
	else if(frequency=="WEEKLY\r\n" || frequency=="WEEKLY")
	{
		monthPlus=0,
		dayPlus=7;
	}
	else if(frequency=="MONTHLY\r\n" || frequency=="MONTHLY")
	{
		monthPlus=1,
		dayPlus=0;
	}
	else if(frequency=="YEARLY\r\n" || frequency=="YEARLY")
	{
		monthPlus=12,
		dayPlus=0;
	}
			
	var td='', td2='';
	var valOffsetFrom='',intOffset='',realStart,realEnd;
	var lastObjStart='';
	for(var it=globalEventList.displayTodosArray[inputRepeatTodo.rid].length-1;it>=0;it--)
		if(globalEventList.displayTodosArray[inputRepeatTodo.rid][it].id==inputRepeatTodo.uid && globalEventList.displayTodosArray[inputRepeatTodo.rid][it].type!='')
		{
			//if(prevLimit <= inputRepeatTodo.realUntilDate  && prevLimit < globalEventList.displayTodosArray[inputRepeatTodo.rid][it].start)
			//{
			//	if(inputRepeatTodo.uid=='https://xtest.ytest@nms.sk@nms.sk:8443/caldav.php/xtest.ytest%40nms.sk/nms/889be6c638a18900eb562813e1336b591e2c781df261a1034c59f5bdde6e159c.ics')
			//	console.log(globalEventList.displayTodosArray[inputRepeatTodo.rid][it].start)
			//	globalEventList.displayTodosArray[inputRepeatTodo.rid].splice(it, 1);
			//}
			//if(it>0)
			//{
				if(globalEventList.displayTodosArray[inputRepeatTodo.rid][it].start=='' || globalEventList.displayTodosArray[inputRepeatTodo.rid][it].end=='')
					return false;
				if(globalEventList.displayTodosArray[inputRepeatTodo.rid][it].start!=null)
				{
					if(typeof globalEventList.displayTodosArray[inputRepeatTodo.rid][it].start=='string')
						lastObjStart=$.fullCalendar.parseDate(globalEventList.displayTodosArray[inputRepeatTodo.rid][it].start);
					else 
						lastObjStart=new Date(globalEventList.displayTodosArray[inputRepeatTodo.rid][it].start.getTime());
				}
				else if(globalEventList.displayTodosArray[inputRepeatTodo.rid][it].end!=null)
				{
					if(typeof globalEventList.displayTodosArray[inputRepeatTodo.rid][it].end=='string')
						lastObjStart=$.fullCalendar.parseDate(globalEventList.displayTodosArray[inputRepeatTodo.rid][it].end);
					else 
						lastObjStart=new Date(globalEventList.displayTodosArray[inputRepeatTodo.rid][it].end.getTime());
				}
			//}
			globalEventList.displayTodosArray[inputRepeatTodo.rid].splice(it, 1);
			inputRepeatTodo.repeatCount--;
			break;
		}
	if(lastObjStart=='')
		return false;
	var repeatFromLine=new Date(lastObjStart.getFullYear(), lastObjStart.getMonth(), lastObjStart.getDate(), 0, 0, 0);
	var repeatCount=inputRepeatTodo.repeatCount;
	var realRepeatCount=inputRepeatTodo.repeatCount;
	var byMonthDay=inputRepeatTodo.byMonthDay;
	if(inputRepeatTodo.realUntilDate=='')
		untilDate=globalToLoadedLimitTodo;
	else
		untilDate=inputRepeatTodo.realUntilDate;
	if(inputRepeatTodo.realUntil=='')
		if(untilDate<repeatFromLine)
			return;
		
		var ruleString=inputRepeatTodo.vcalendar.match(vCalendar.pre['contentline_RRULE2'])[0].match(vCalendar.pre['contentline_parse'])[4];
		var isSpecialRule=false;
		if(ruleString.indexOf('BYMONTH=')!=-1 || ruleString.indexOf('BYMONTHDAY=')!=-1 || ruleString.indexOf('BYDAY=')!=-1)
			isSpecialRule=true;
		var staticDate='';
		if(inputRepeatTodo.repeatStart)
		{
			var staticDate=inputRepeatTodo.repeatStart;
			var varDate=new Date($.fullCalendar.parseDate(inputRepeatTodo.repeatStart).getTime());
		}
		else if(inputRepeatTodo.repeatEnd)
		{
			var staticDate=inputRepeatTodo.repeatEnd;
			var varDate=new Date($.fullCalendar.parseDate(inputRepeatTodo.repeatEnd).getTime());
		}
		if(inputRepeatTodo.repeatEnd)
			var varEndDate=new Date($.fullCalendar.parseDate(inputRepeatTodo.repeatEnd).getTime());
//		else
//			var varEndDate=new Date(end.getTime());
		
		var lastGenDate='';
		var repeatStart=new Date(varDate.getTime());
//		var repeatEnd=new Date(varEndDate.getTime());
	
					
		var rCount = 0, dayDifference=0;
		if(inputRepeatTodo.repeatEnd)
			dayDifference=varEndDate.getTime()-varDate.getTime();
		var iterator=0;
		var lastYear=0;
		var dateStart,dateEnd;
		if(isSpecialRule)
		{
			if(inputRepeatTodo.rulePartsArray.length>0)
			{
				var repeatTodoStart;
				
				if(inputRepeatTodo.start!='')
				{
					if(typeof inputRepeatTodo.start=='string')
						repeatTodoStart=$.fullCalendar.parseDate(inputRepeatTodo.start);
					else 
						repeatTodoStart=new Date(inputRepeatTodo.start.getTime());
				}
				else if(inputRepeatTodo.end!=null)
				{
					if(typeof inputRepeatTodo.end=='string')
						repeatTodoStart=$.fullCalendar.parseDate(inputRepeatTodo.end);
					else 
						repeatTodoStart=new Date(inputRepeatTodo.end.getTime());
				}
				
				var repeatLimit = new Date(globalToLoadedLimitTodo.getTime());
				//repeatLimit.setMonth(repeatLimit.getMonth() + 2);
				if(inputRepeatTodo.lastGenDate!='')
				{
					var lastGen = new Date(inputRepeatTodo.lastGenDate.getTime());
					
					var onePrevNext = new Date(prevLimit.getTime());
					onePrevNext.setDate(0);
					inputRepeatTodo.lastGenDate.setDate(1);
					inputRepeatTodo.lastGenDate.setMonth(onePrevNext.getMonth()-1);
					inputRepeatTodo.lastGenDate.setFullYear(onePrevNext.getFullYear());
					var objR =processRule(inputRepeatTodo.vcalendar,inputRepeatTodo.lastGenDate,inputRepeatTodo.rulePartsArray.slice(),[inputRepeatTodo.lastGenDate],frequencies.indexOf(inputRepeatTodo.frequency),repeatLimit,inputRepeatTodo.interval,inputRepeatTodo.id,inputRepeatTodo.rCount,repeatTodoStart,inputRepeatTodo.wkst);
				}
				else 
					var objR =processRule(inputRepeatTodo.vcalendar,repeatTodoStart,inputRepeatTodo.rulePartsArray.slice(),[repeatTodoStart],frequencies.indexOf(inputRepeatTodo.frequency),repeatLimit,inputRepeatTodo.interval,inputRepeatTodo.id,inputRepeatTodo.rCount,repeatTodoStart,inputRepeatTodo.wkst);
			
				dates=objR.dates;
				inputRepeatTodo.rCount=objR.rCount;
			}
			realRepeatCount++;
			for(var idt=0;idt<dates.length;idt++)
			{
				if(inputRepeatTodo.repeatEnd!='' && inputRepeatTodo.repeatStart!='')
				{
					varDate=new Date(dates[idt].getTime());
					varEndDate=new Date(varDate.getTime()+dayDifference);
				}
				else if(inputRepeatTodo.repeatEnd=='' && inputRepeatTodo.repeatStart!='')
				{
					varDate=new Date(dates[idt].getTime());
					if(idt<(dates.length-1))
					{
						varEndDate=new Date(dates[idt+1].getTime());
						varEndDate.setMinutes(varEndDate.getMinutes()-1);
					}
					else
						varEndDate = null;
				}
				else if(inputRepeatTodo.repeatEnd!='' && inputRepeatTodo.repeatStart=='')
				{
					varEndDate=new Date(dates[idt].getTime());
					if(idt>0)
					{
						varDate=new Date(dates[idt-1].getTime());
						varDate.setMinutes(varDate.getMinutes()+1);
					}
				}
				
				if((varDate.getTime()-repeatFromLine.getTime())<0)
					continue;
				if((varDate.getTime()-globalToLoadedLimitTodo.getTime())>=0)
					break;
				if(inputRepeatTodo.realUntil=='')
					var count=untilDate-varDate;
				else
					var count = inputRepeatTodo.realUntil - inputRepeatTodo.realRepeatCount;
				if(count<0)
					break;
				else
				{
					iterator++;
					if(inputRepeatTodo.frequency=="YEARLY")
					{									
						if(inputRepeatTodo.lastYear!=varDate.getFullYear())
						{
							inputRepeatTodo.lastYear=varDate.getFullYear();
							if(inputRepeatTodo.lastYear>0 && inputRepeatTodo.rCount%inputRepeatTodo.interval!=0)
							{
								inputRepeatTodo.rCount++;
								continue;
							}			
							inputRepeatTodo.rCount++;
						}
					}
					realRepeatCount++;
					inputRepeatTodo.realRepeatCount=realRepeatCount;
					if(inputRepeatTodo.realUntilDate=='' && inputRepeatTodo.repeatEnd=='' && realRepeatCount > inputRepeatTodo.realUntil)
						varEndDate=null;
					if(inputRepeatTodo.recurrence_id_array.length>0)
					{
						var checkCont = false;
						for(var ir=0;ir<inputRepeatTodo.recurrence_id_array.length;ir++)
						{
							var recString = inputRepeatTodo.recurrence_id_array[ir].split(';')[0];
							if(recString.charAt(recString.length-1)=='Z')
							{
								if(globalSettings.timezonesupport && inputRepeatTodo.tzName in timezones)
								{
									var recValOffsetFrom=getOffsetByTZ(inputRepeatTodo.tzName, varDate);
									var recTime = new Date(recString.parseComnpactISO8601().getTime());
									if(recValOffsetFrom)
									{
										var rintOffset=recValOffsetFrom.getSecondsFromOffset()*1000;
										recTime.setTime(recTime.getTime()+rintOffset);
									}
									if(recTime.toString()+inputRepeatTodo.recurrence_id_array[ir].split(';')[1] == varDate+inputRepeatTodo.stringUID)
										checkCont=true;
								}
							}
							else
							{
								if(recString.parseComnpactISO8601().toString()+inputRepeatTodo.recurrence_id_array[ir].split(';')[1] == varDate+inputRepeatTodo.stringUID)
									checkCont=true;
							}
							if(checkCont)
								continue;
						}
					}
				if(globalSettings.timezonesupport && inputRepeatTodo.tzName in timezones)
					valOffsetFrom=getOffsetByTZ(inputRepeatTodo.tzName, varDate);
				realStart=new Date(varDate.getTime());
				
				dateStart=new Date(varDate.getTime());
				if(valOffsetFrom)
				{
					intOffset=(getLocalOffset(dateStart)*-1*1000)-valOffsetFrom.getSecondsFromOffset()*1000;
					dateStart.setTime(dateStart.getTime()+intOffset);
				}
				if(inputRepeatTodo.exDates.length>0)
					if(inputRepeatTodo.exDates.indexOf(dateStart.toString())!=-1)
						continue;
				if(varEndDate!=null)
				{
					realEnd=new Date(varEndDate.getTime());
					dateEnd=new Date(varEndDate.getTime());
					if(intOffset)
						dateEnd.setTime(dateEnd.getTime()+intOffset);
				}
				else
				{
					dateEnd=null;
					realEnd=null;
				}
				
				
					
					if(inputRepeatTodo.alertTime.length>0 && dateEnd!=null)
					{
						var repeatAlarm='',
						myVarDate='',
						alertString='';
						if(!inputRepeatTodo.collection.ignoreAlarms)
							for(var v=0;v<inputRepeatTodo.alertTime.length;v++)
							{
								if(inputRepeatTodo.alertTime[v].charAt(0)=='-' || inputRepeatTodo.alertTime[v].charAt(0)=='+')
								{
									var aTime=dateEnd;
									aTime=aTime.getTime();
									var dur=parseInt(inputRepeatTodo.alertTime[v].substring(1, inputRepeatTodo.alertTime[v].length-1));
									if(inputRepeatTodo.alertTime[v].charAt(0)=='-')
										aTime=aTime-dur;
									else
										aTime=aTime+dur;

									var now=new Date();
								}
								else
								{
									aTime=$.fullCalendar.parseDate(inputRepeatTodo.alertTime[v]);
									now=new Date();
								}
								if(aTime>now)
								{
									var delay=aTime-now;
									if(maxAlarmValue<delay)
										delay=maxAlarmValue;

									inputRepeatTodo.alertTimeOut[inputRepeatTodo.alertTimeOut.length]=setTimeout(function(){showAlertTODO(inputRepeatTodo.uid, (aTime-now), {start:dateStart, allDay:all, title:title, color:inputRepeatTodo.evcolor, status:inputRepeatTodo.status});}, delay);
								}
							}
					}
					
					repeatCount++;
					inputRepeatTodo.repeatCount=repeatCount;
					var tmpObj=new todoItems(dateStart, dateEnd, inputRepeatTodo.realUntilDate, inputRepeatTodo.frequency, inputRepeatTodo.interval, inputRepeatTodo.realUntil, inputRepeatTodo.wkst,  inputRepeatTodo.repeatStart, inputRepeatTodo.repeatEnd, inputRepeatTodo.repeatCount, inputRepeatTodo.realRepeatCount,inputRepeatTodo.byDay, inputRepeatTodo.location, inputRepeatTodo.note, inputRepeatTodo.title, inputRepeatTodo.uid, inputRepeatTodo.vcalendar, inputRepeatTodo.evcolor, inputRepeatTodo.etag, inputRepeatTodo.alertTime, inputRepeatTodo.alertNote, inputRepeatTodo.status, inputRepeatTodo.filterStatus, inputRepeatTodo.rec_id, inputRepeatTodo.repeatHash, inputRepeatTodo.percent, inputRepeatTodo.displayValue, inputRepeatTodo.rid, inputRepeatTodo.compareString, inputRepeatTodo.tzName, realStart, realEnd, inputRepeatTodo.alertTimeOut,inputRepeatTodo.classType,inputRepeatTodo.url,inputRepeatTodo.completedOn,inputRepeatTodo.sequence,inputRepeatTodo.priority,inputRepeatTodo.finalAString,inputRepeatTodo.title.toLowerCase().multiReplace(globalSearchTransformAlphabet));
					globalEventList.displayTodosArray[inputRepeatTodo.rid].splice(globalEventList.displayTodosArray[inputRepeatTodo.rid].length, 0, tmpObj);
					lastGenDate = new Date(dateStart.getTime());
				}
			}
			/*if(inputRepeatTodo.repeatEnd=='')
			{
				repeatCount++;
				inputRepeatTodo.repeatCount=repeatCount;
				var tmpObj=new todoItems(dateStart, inputRepeatTodo.end, inputRepeatTodo.realUntilDate, inputRepeatTodo.frequency, inputRepeatTodo.interval, inputRepeatTodo.realUntil, inputRepeatTodo.wkst,  inputRepeatTodo.repeatStart, inputRepeatTodo.repeatEnd, inputRepeatTodo.repeatCount, inputRepeatTodo.realRepeatCount,inputRepeatTodo.byDay, inputRepeatTodo.location, inputRepeatTodo.note, inputRepeatTodo.title, inputRepeatTodo.uid, inputRepeatTodo.vcalendar, inputRepeatTodo.evcolor, inputRepeatTodo.etag, inputRepeatTodo.alertTime, inputRepeatTodo.alertNote, inputRepeatTodo.status, inputRepeatTodo.filterStatus, inputRepeatTodo.rec_id, inputRepeatTodo.repeatHash, inputRepeatTodo.percent, inputRepeatTodo.displayValue, inputRepeatTodo.rid, inputRepeatTodo.compareString, inputRepeatTodo.tzName, realStart, realEnd, inputRepeatTodo.alertTimeOut,inputRepeatTodo.classType,inputRepeatTodo.url,inputRepeatTodo.completedOn,inputRepeatTodo.sequence,inputRepeatTodo.priority,inputRepeatTodo.finalAString,inputRepeatTodo.title.toLowerCase().multiReplace(globalSearchTransformAlphabet));
				globalEventList.displayTodosArray[inputRepeatTodo.rid].splice(globalEventList.displayTodosArray[inputRepeatTodo.rid].length, 0, tmpObj);
				inputRepeatTodo.lastGenDate = new Date(varDate.getTime());
			}*/
		}
		else
		{
			var rtDate='';
			var prevStart=new Date(varDate.getTime());
			var counterRepeat=0;
			if(inputRepeatTodo.realStart!='')
				rtDate=new Date($.fullCalendar.parseDate(inputRepeatTodo.realStart).getTime());
			else if(inputRepeatTodo.realEnd!='')
				rtDate=new Date($.fullCalendar.parseDate(inputRepeatTodo.realEnd).getTime());
			while(true)
			{
				if(counterRepeat>0)
				{
				
					iterator++;
						
				realRepeatCount++;
				inputRepeatTodo.realRepeatCount=realRepeatCount;
									
						if(globalSettings.timezonesupport && inputRepeatTodo.tzName in timezones)
							valOffsetFrom=getOffsetByTZ(inputRepeatTodo.tzName, varDate);

						if(inputRepeatTodo.repeatEnd!='' && inputRepeatTodo.repeatStart!='')
						{
							dateStart=new Date(prevStart.getTime());
							dateEnd=new Date(dateStart.getTime()+dayDifference);
						}
						else if(inputRepeatTodo.repeatEnd=='' && inputRepeatTodo.repeatStart!='')
						{
							dateStart=new Date(prevStart.getTime());
							dateEnd=new Date(varDate.getTime());
							dateEnd.setMinutes(dateEnd.getMinutes()-1);
						}
						else if(inputRepeatTodo.repeatEnd!='' && inputRepeatTodo.repeatStart=='')
						{
							dateEnd=new Date(varDate.getTime());
							dateStart=new Date(prevStart.getTime());
							dateStart.setMinutes(dateStart.getMinutes()+1);
						}
						realStart=new Date(dateStart.getTime());
						if(valOffsetFrom)
						{
							intOffset=(getLocalOffset(dateStart)*-1*1000)-valOffsetFrom.getSecondsFromOffset()*1000;
							dateStart.setTime(dateStart.getTime()+intOffset);
						}
						realEnd=new Date(dateEnd.getTime());
						
						var recIDfound=false;
						if(inputRepeatTodo.recurrence_id_array.length>0)
						{
							for(var ir=0;ir<inputRepeatTodo.recurrence_id_array.length;ir++)
							{
								var recString = inputRepeatTodo.recurrence_id_array[ir].split(';')[0];
								if(recString.charAt(recString.length-1)=='Z')
								{
									if(globalSettings.timezonesupport && inputRepeatTodo.tzName in timezones)
									{
										var recValOffsetFrom=getOffsetByTZ(inputRepeatTodo.tzName, varDate);
										var recTime = new Date(recString.parseComnpactISO8601().getTime());
										if(recValOffsetFrom)
										{
											var rintOffset=recValOffsetFrom.getSecondsFromOffset()*1000;
											recTime.setTime(recTime.getTime()+rintOffset);
										}
										if(recTime.toString()+inputRepeatTodo.recurrence_id_array[ir].split(';')[1] == varDate+inputRepeatTodo.stringUID)
											recIDfound=true;
									}
								}
								else
								{
									if(recString.parseComnpactISO8601().toString()+inputRepeatTodo.recurrence_id_array[ir].split(';')[1] == varDate+inputRepeatTodo.stringUID)
										recIDfound=true;
								}
							}
						}
						if(inputRepeatTodo.exDates.length>0)
							if(inputRepeatTodo.exDates.indexOf(dateStart.toString())!=-1)
								recIDfound=true;
						if(intOffset)
							dateEnd.setTime(dateEnd.getTime()+intOffset);
					
					if(!recIDfound && ((dateStart.getTime()-repeatFromLine.getTime())>0) && (iterator%inputRepeatTodo.interval)==0)	
					{
						realRepeatCount++;
						inputRepeatTodo.realRepeatCount=realRepeatCount;
						
						if(inputRepeatTodo.alertTime.length>0)
						{
							var repeatAlarm='',
							myVarDate='',
							alertString='';
							if(!inputRepeatTodo.collection.ignoreAlarms)
								for(var v=0;v<inputRepeatTodo.alertTime.length;v++)
								{
									if(inputRepeatTodo.alertTime[v].charAt(0)=='-' || inputRepeatTodo.alertTime[v].charAt(0)=='+')
									{
										var aTime=dateEnd;
										aTime=aTime.getTime();
										var dur=parseInt(inputRepeatTodo.alertTime[v].substring(1, inputRepeatTodo.alertTime[v].length-1));
										if(inputRepeatTodo.alertTime[v].charAt(0)=='-')
											aTime=aTime-dur;
										else
											aTime=aTime+dur;

										var now=new Date();
									}
									else
									{
										aTime=$.fullCalendar.parseDate(inputRepeatTodo.alertTime[v]);
										now=new Date();
									}
									if(aTime>now)
									{
										var delay=aTime-now;
										if(maxAlarmValue<delay)
											delay=maxAlarmValue;

										inputRepeatTodo.alertTimeOut[inputRepeatTodo.alertTimeOut.length]=setTimeout(function(){showAlertTODO(inputRepeatTodo.uid, (aTime-now), {start:dateStart, allDay:all, title:title, color:inputRepeatTodo.evcolor, status:inputRepeatTodo.status});}, delay);
									}
								}
						}
						if(inputRepeatTodo.realEnd=='' && (dateEnd.getTime()-globalToLoadedLimitTodo.getTime())>=0)
							break;
						var tmpObj=new todoItems(dateStart, dateEnd, inputRepeatTodo.realUntilDate, inputRepeatTodo.frequency, inputRepeatTodo.interval, inputRepeatTodo.realUntil, inputRepeatTodo.wkst,  inputRepeatTodo.repeatStart, inputRepeatTodo.repeatEnd, inputRepeatTodo.repeatCount, inputRepeatTodo.realRepeatCount, inputRepeatTodo.byDay, inputRepeatTodo.location, inputRepeatTodo.note, inputRepeatTodo.title, inputRepeatTodo.uid, inputRepeatTodo.vcalendar, inputRepeatTodo.evcolor, inputRepeatTodo.etag, inputRepeatTodo.alertTime, inputRepeatTodo.alertNote, inputRepeatTodo.status, inputRepeatTodo.filterStatus, inputRepeatTodo.rec_id, inputRepeatTodo.repeatHash, inputRepeatTodo.percent, inputRepeatTodo.displayValue, inputRepeatTodo.rid, inputRepeatTodo.compareString, inputRepeatTodo.tzName, realStart, realEnd, inputRepeatTodo.alertTimeOut,inputRepeatTodo.classType,inputRepeatTodo.url,inputRepeatTodo.completedOn,inputRepeatTodo.sequence,inputRepeatTodo.priority,inputRepeatTodo.finalAString,inputRepeatTodo.title.toLowerCase().multiReplace(globalSearchTransformAlphabet));
						globalEventList.displayTodosArray[inputRepeatTodo.rid].splice(globalEventList.displayTodosArray[inputRepeatTodo.rid].length, 0, tmpObj);
						inputRepeatTodo.lastGenDate = new Date(dateStart.getTime());
					}
				}
				if((varDate.getTime()-repeatFromLine.getTime())>0)
					counterRepeat++;
				prevStart=new Date(varDate.getTime());
				var dayNumberDate=rtDate.getDate()+dayPlus;

				if(dayPlus==0 && monthPlus==1)
					dayNumberDate=getValidRepeatDay(rtDate,staticDate);
						
				if(rtDate.getDate()>=dayNumberDate)
				{
					rtDate.setDate(dayNumberDate);
					rtDate.setMonth(rtDate.getMonth()+monthPlus);
				}
				else
				{
					rtDate.setMonth(rtDate.getMonth()+monthPlus);
					rtDate.setDate(dayNumberDate);
				}
				varDate=new Date(rtDate.getTime());
				if((prevStart.getTime()-globalToLoadedLimitTodo.getTime())>=0)
					break;
				if(inputRepeatTodo.repeatStart!='' )
					var count=untilDate-prevStart;
				else
					var count=untilDate-varDate;
				if(count<0)
					break;
			}
			if(inputRepeatTodo.realEnd=='')
			{
				realRepeatCount++;
				inputRepeatTodo.realRepeatCount=realRepeatCount;
				var tmpObj=new todoItems(dateStart, inputRepeatTodo.end, inputRepeatTodo.realUntilDate, inputRepeatTodo.frequency, inputRepeatTodo.interval, inputRepeatTodo.realUntil, inputRepeatTodo.wkst,  inputRepeatTodo.repeatStart, inputRepeatTodo.repeatEnd, inputRepeatTodo.repeatCount, inputRepeatTodo.realRepeatCount, inputRepeatTodo.byDay, inputRepeatTodo.location, inputRepeatTodo.note, inputRepeatTodo.title, inputRepeatTodo.uid, inputRepeatTodo.vcalendar, inputRepeatTodo.evcolor, inputRepeatTodo.etag, inputRepeatTodo.alertTime, inputRepeatTodo.alertNote, inputRepeatTodo.status, inputRepeatTodo.filterStatus, inputRepeatTodo.rec_id, inputRepeatTodo.repeatHash, inputRepeatTodo.percent, inputRepeatTodo.displayValue, inputRepeatTodo.rid, inputRepeatTodo.compareString, inputRepeatTodo.tzName, realStart, realEnd, inputRepeatTodo.alertTimeOut,inputRepeatTodo.classType,inputRepeatTodo.url,inputRepeatTodo.completedOn,inputRepeatTodo.sequence,inputRepeatTodo.priority,inputRepeatTodo.finalAString,inputRepeatTodo.title.toLowerCase().multiReplace(globalSearchTransformAlphabet));
				globalEventList.displayTodosArray[inputRepeatTodo.rid].splice(globalEventList.displayTodosArray[inputRepeatTodo.rid].length, 0, tmpObj);
				inputRepeatTodo.lastGenDate = new Date(prevStart.getTime());
			}
		}
}


function getPrevMonths(viewStart)
{
	
	if(globalLimitLoading!='future' && globalLimitLoading!='past' && globalSettings.eventstartpastlimit!=null && viewStart < globalLoadedLimit)
	{
		globalLoadedLimit.setMonth(globalLoadedLimit.getMonth()-globalSettings.eventstartpastlimit-1);
		globalOnlyCalendarNumberCount = 0
		$('#CalendarLoader').css('display', 'block');
		globalLimitLoading='past';
		CalDAVnetLoadCollection(globalResourceCalDAVList.collections[0], true, false, 0, globalResourceCalDAVList.collections);
	}
}

function getNextMonths(viewEnd)
{
	if(globalLimitLoading!='future' && globalLimitLoading!='past' && viewEnd > globalToLoadedLimit)
	{
		var limitSet = (globalSettings.eventstartfuturelimit!=null);
		var futureLimit = limitSet ? globalSettings.eventstartfuturelimit : 2;
		var prevLimit = new Date(globalBeginFuture.getTime());
		globalToLoadedLimit.setMonth(globalToLoadedLimit.getMonth()+futureLimit+1);
		var futureDate = new Date(globalToLoadedLimit.getTime());
		futureDate.setDate(futureDate.getDate()+14);

		if(limitSet)
		{
			globalOnlyCalendarNumberCount = 0;
			$('#CalendarLoader').css('display', 'block');
			globalLimitLoading='future';
		}

		for (var i=0;i<globalEventList.repeatable.length;i++)
			loadRepeatEvents(globalEventList.repeatable[i],prevLimit,futureDate);

		if(limitSet)
			CalDAVnetLoadCollection(globalResourceCalDAVList.collections[0], true, false, 0, globalResourceCalDAVList.collections);
		else
			globalBeginFuture = new Date(futureDate.getTime());

		refetchCalendarEvents();
	}
}

function getPrevMonthsTodo()
{
	if(globalLimitTodoLoading=='futureTODO' && globalLimitTodoLoading=='pastTODO')
		return false;
	var actualTodoMonth = new Date($('#todoList').fullCalendar('getView').start.getTime());
	actualTodoMonth.setDate(1);

	if(globalSettings.eventstartpastlimit!=null && actualTodoMonth < globalLoadedLimitTodo)
	{
		globalLoadedLimitTodo.setMonth(globalLoadedLimitTodo.getMonth()-globalSettings.eventstartpastlimit-1);
		globalOnlyTodoCalendarNumberCount = 0;
		$('#CalendarLoaderTODO').css('display', 'block');
		globalLimitTodoLoading='pastTodo';
		CalDAVnetLoadCollection(globalResourceCalDAVList.TodoCollections[0], true, false, 0, globalResourceCalDAVList.TodoCollections);
	}
}

function getNextMonthsTodo()
{
	if(globalLimitTodoLoading=='futureTODO' && globalLimitTodoLoading=='pastTODO')
		return false;
	//var limitSet = (!globalSettings.appleremindersmode && globalSettings.eventstartfuturelimit!=null)
	var limitSet=false;
	var futureLimit = limitSet ? globalSettings.eventstartfuturelimit : 2;
	var actualTodoMonth = new Date($('#todoList').fullCalendar('getView').end.getTime());
	actualTodoMonth.setMonth(actualTodoMonth.getMonth()+1);
	actualTodoMonth.setDate(1);

	if(actualTodoMonth > globalToLoadedLimitTodo)
	{
		var prevLimit = new Date(globalToLoadedLimitTodo.getTime());
		globalToLoadedLimitTodo.setMonth(globalToLoadedLimitTodo.getMonth()+futureLimit+1);

		if(limitSet)
		{
			globalOnlyTodoCalendarNumberCount = 0;
			$('#CalendarLoaderTODO').css('display', 'block');
			globalLimitTodoLoading='futureTodo';
		}

		for (var i=0;i<globalEventList.repeatableTodo.length;i++)
			loadRepeatTodo(globalEventList.repeatableTodo[i],prevLimit);

		if(limitSet)
			CalDAVnetLoadCollection(globalResourceCalDAVList.TodoCollections[0], true, false, 0, globalResourceCalDAVList.TodoCollections);

		refetchTodoEvents();
	}
}

function showAlertEvents(inputUID, realDelay, alarmObject)
{
	if(maxAlarmValue<realDelay)
	{
		var delay=realDelay-maxAlarmValue;
		if(maxAlarmValue<delay)
			setTimeout(function(){showAlertEvents(inputUID, delay,alarmObject);}, maxAlarmValue);
		else
			setTimeout(function(){showAlertEvents(inputUID, delay,alarmObject);}, delay);
		return false;
	}
	var rid=inputUID.substring(0, inputUID.lastIndexOf('/')+1);

	if(globalSettings.showhiddenalarms)
		hiddenCheck = true;
	else
		hiddenCheck = false;

	if((alarmObject!=undefined && hiddenCheck) || (alarmObject!=undefined && !hiddenCheck && globalVisibleCalDAVCollections.indexOf(rid)!=-1))
	{
		$('#alertBox').css('visibility', 'visible');
		$('#AlertDisabler').fadeIn(globalEditorFadeAnimation)

		var date=$.fullCalendar.parseDate(alarmObject.start);
		var dateString='';
		var formattedDate = $.datepicker.formatDate(globalSettings.datepickerformat,date);
		if(formattedDate!='')
			dateString+=' : '+formattedDate;

		var timeString='';
		if(!alarmObject.allDay)
		{
			var timeS = $.fullCalendar.formatDate(date, globalSettings.ampmformat?'h:mm TT{ - h:mm TT}':'H:mm{ - H:mm}')
			if(timeS!='')
				timeString=' - '+timeS;
		}

		$('#alertBoxContent').append("<div class='alert_item'><img src='images/calendarB.svg' alt='Calendar'/><label>"+alarmObject.title+dateString+timeString+"</label></div>");
	}
}

function showAlertTODO(inputUID, realDelay, alarmObject)
{
	if(globalSettings.ignorecompletedorcancelledalarms && (alarmObject.status=='COMPLETED' || alarmObject.status== 'CANCELLED'))
		return false;
	if(maxAlarmValue<realDelay)
	{
		var delay=realDelay-maxAlarmValue;

		if(maxAlarmValue<delay)
			setTimeout(function(){showAlertTODO(inputUID, delay, alarmObject);}, maxAlarmValue);
		else
			setTimeout(function(){showAlertTODO(inputUID, delay, alarmObject);}, delay);

		return false;
	}

	resDate='';
	var rid=inputUID.substring(0, inputUID.lastIndexOf('/')+1);

	if(globalSettings.showhiddenalarms)
		hiddenCheck = true;
	else
		hiddenCheck = false;

	if(hiddenCheck || (!hiddenCheck && globalVisibleCalDAVTODOCollections.indexOf(rid)!=-1))
	{
		$('#alertBox').css('visibility', 'visible');
		$('#AlertDisabler').fadeIn(globalEditorFadeAnimation);

		var dateString='';
		var date=$.fullCalendar.parseDate(alarmObject.start);
		var formattedDate=$.datepicker.formatDate(globalSettings.datepickerformat,date);
		if(formattedDate!='')
			dateString=' : '+formattedDate;

		var timeString=''
		var timeS = $.fullCalendar.formatDate(date,globalSettings.ampmformat?'h:mm TT{ - h:mm TT}':'H:mm{ - H:mm}');
		if(timeS!='')
			timeString=' - '+timeS;
		$('#alertBoxContent').append("<div class='alert_item'><img src='images/todoB.svg' alt='Todo'/><label>"+alarmObject.title+dateString+timeString+"</label></div>");
	}
}

function clearAlertEvents()
{
	$('#alertBoxContent').html('');
	$('#alertBox').css('visibility', 'hidden');
	$('#AlertDisabler').fadeOut(globalEditorFadeAnimation);
}

function addAndEdit(isFormHidden, deleteMode)
{
	var inputUID='';
	if($('#uid').val()!='')
		var coll = globalResourceCalDAVList.getEventCollectionByUID($('#uid').val().substring(0, $('#uid').val().lastIndexOf('/')+1));
	else
		var coll = globalResourceCalDAVList.getEventCollectionByUID($('#event_calendar').val());
	var res = getAccount(coll.accountUID);
	var tmp=res.href.match(vCalendar.pre['hrefRex']);
	var origUID=tmp[1]+res.userAuth.userName+'@'+tmp[2];

	if($('#etag').val()!='')
		inputUID=$('#uid').val();
	else if($('#event_calendar').val()!='choose')
		inputUID = $('#event_calendar').val()+'';
	else
		return false;
	dataToVcalendar(origUID, inputUID, $('#etag').val(), '', isFormHidden, deleteMode);
}

function interResourceEdit(delUID,isFormHidden)
{
	var inputUID='';
	if($('#uid').val()!='')
		var coll = globalResourceCalDAVList.getEventCollectionByUID($('#uid').val().substring(0, $('#uid').val().lastIndexOf('/')+1));
	else
		var coll = globalResourceCalDAVList.getEventCollectionByUID($('#event_calendar').val());
	var res = getAccount(coll.accountUID);
	var tmp=res.href.match(vCalendar.pre['hrefRex']);
	var origUID=tmp[1]+res.userAuth.userName+'@'+tmp[2];

	$('#etag').val('');
	var srcUID=$('#uid').val().substring($('#uid').val().lastIndexOf('/')+1, $('#uid').val().length);

	inputUID=$('#event_calendar').val()+srcUID;

	dataToVcalendar(origUID, inputUID, '', delUID,isFormHidden);

}

function save(isFormHidden, deleteMode)
{
	$('#event_details_template').scrollTop(0);
	if(!deleteMode)
	{
		if($('#event_details_template').find('img[data-type=invalidSmall]').filter(function(){return this.style.display != 'none'}).length>0)
		{
			show_editor_loader_messageCalendar('vevent', 'message_error', localization[globalInterfaceLanguage].txtErorInput);
			return false;
		}
		var a=$.datepicker.parseDate(globalSettings.datepickerformat, $('#date_from').val());
		var a2=$.datepicker.parseDate(globalSettings.datepickerformat, $('#date_to').val());

		var datetime_from=$.fullCalendar.formatDate(a, 'yyyy-MM-dd');
		var datetime_to=$.fullCalendar.formatDate(a2, 'yyyy-MM-dd');
		var time_from='00:00';
		var time_to='00:00';
		if(!$('#allday').prop('checked'))
		{
			if($('#time_from').val()!='' && $('#time_to').val()!='')
			{
				time_from=new Date(Date.parse("01/02/1990, "+$('#time_from').val()));
				time_from=$.fullCalendar.formatDate(time_from, 'HH:mm');
				time_to=new Date(Date.parse("01/02/1990, "+$('#time_to').val()));
				time_to=$.fullCalendar.formatDate(time_to, 'HH:mm');
			}
		}
		if($.fullCalendar.parseDate(datetime_from+'T'+time_from+'Z')>$.fullCalendar.parseDate(datetime_to+'T'+time_to+'Z'))
		{
			show_editor_loader_messageCalendar('vevent', 'message_error', localization[globalInterfaceLanguage].txtErrorDates);
			return false;
		}
	}

	var calUID=$('#uid').val().substring(0, $('#uid').val().lastIndexOf('/'));

	var newUID=$('#event_calendar').val().substring(0, $('#event_calendar').val().length-1);
	if($('#event_calendar').val()!='choose')
	{
		if($('#name').val()=='')
			$('#name').val(localization[globalInterfaceLanguage].pholderNewEvent);

		if(newUID==calUID || ($('#etag').val()=='' && $('#event_calendar').val()!='choose'))
			addAndEdit(isFormHidden, deleteMode);
		else if(calUID.substring(0, calUID.lastIndexOf('/'))==newUID.substring(0, newUID.lastIndexOf('/')))
		{
			//move();
			var delUID=$('#uid').val();
			interResourceEdit(delUID, isFormHidden);
		}
		else if(calUID.substring(0, calUID.lastIndexOf('/'))!=newUID.substring(0, newUID.lastIndexOf('/')) && $('#etag').val()!='')
		{
			var delUID=$('#uid').val();
			interResourceEdit(delUID, isFormHidden);
		}
	}
	else
		show_editor_loader_messageCalendar('vevent', 'message_error', localization[globalInterfaceLanguage].txtNotChoose);
}

function deleteEvent()
{
	var delUID=$('#uid').val();

	if(delUID!='')
		deleteVcalendarFromCollection(delUID,'vevent');
}

function disableAll()
{
	var counter=0;
	$('#ResourceCalDAVList').children(':visible').each(function(i, e){
		if($(e).hasClass('resourceCalDAV_item') && $(e).find('input').prop('checked'))
			counter++;
	});
	if(!counter)
		return false;

	if(!globalSettings.displayhiddenevents)
	{
		globalResourceRefreshNumber++;
		$('#CalendarLoader').css('display','block');
		var beforeScroll = $('#main').width()-$('#calendar').width();
		$('#calendar').fullCalendar('removeEvents');
		$('#calendar').fullCalendar('removeEventSources');
		var afterScroll = $('#main').width()-$('#calendar').width();
		rerenderCalendar(beforeScroll!=afterScroll);
	}

	for(var j=0;j<globalResourceCalDAVList.collections.length;j++)
	{
		if(globalResourceCalDAVList.collections[j].href!=undefined)
		{
			var uid=globalResourceCalDAVList.collections[j].uid;
			var check=$('#ResourceCalDAVList').find('[name^="'+uid+'"]');
			if(check.prop('checked'))
			{
				var pos=globalVisibleCalDAVCollections.indexOf(uid);
				if(pos!=-1)
					globalVisibleCalDAVCollections.splice(pos, 1);
				check.prop('checked', false);
				if(globalSettings.displayhiddenevents)
					hideCalendarEvents(uid);
			}
			collectionChBoxClick(check.get(0), '#'+check.parent().parent().attr('id'), '.resourceCalDAV_header', '.resourceCalDAV_item', null, false)
		}
		/*else
		{
			var check=$('#ResourceCalDAVList').children().eq(globalResourceCalDAVList.collections[j].index+1).find('input');
			if(check.prop('checked'))
				check.prop('checked', false);
		}*/
	}

	if(!globalSettings.displayhiddenevents)
	{
		globalResourceRefreshNumber--;
		if(!globalResourceRefreshNumber)
			$('#CalendarLoader').hide();
	}
}

function enableAll()
{
	var counter=0;
	$('#ResourceCalDAVList').children(':visible').each(function(i, e){
		if($(e).hasClass('resourceCalDAV_item') && !$(e).find('input').prop('checked'))
			counter++;
	});
	if(!counter)
		return false;

	if(!globalSettings.displayhiddenevents)
	{
		globalResourceRefreshNumber++;
		$('#CalendarLoader').css('display','block');
	}

	var beforeScroll = $('#main').width()-$('#calendar').width();
	var rex = vCalendar.pre['accountUidParts'];
	for(var j=0;j<globalResourceCalDAVList.collections.length;j++)
	{
		if(globalResourceCalDAVList.collections[j].href!=undefined)
		{
			var uid=globalResourceCalDAVList.collections[j].uid;
			var check=$('#ResourceCalDAVList').find('[name^="'+uid+'"]');
			if(!check.prop('checked'))
			{
				check.prop('checked', true);
				var pos=globalVisibleCalDAVCollections.indexOf(uid);
				if(pos==-1)
				{
					globalVisibleCalDAVCollections[globalVisibleCalDAVCollections.length]=uid;
					if(globalSettings.displayhiddenevents)
						showCalendarEvents(uid);
					else
					{
						var bg = false;
						var tmpUID = uid.match(rex);
						var hrefUID='';
						if(tmpUID!=null)
							hrefUID = tmpUID[4];
						var resource = getResourceByCollection(uid);
						if(typeof resource.backgroundCalendars!='undefined' && resource.backgroundCalendars!=null && resource.backgroundCalendars!='')
						{
							var rbCalendars = '';
							if(resource.backgroundCalendars instanceof Array)
								rbCalendars=resource.backgroundCalendars;
							else
								rbCalendars = [resource.backgroundCalendars];
							for(var k=0; k<rbCalendars.length;k++)
							{
								if (typeof rbCalendars[k]=='string')
								{
									var index = hrefUID.indexOf(rbCalendars[k]);
									if(index!=-1)
										if(hrefUID.length == (index+rbCalendars[k].length))
											bg=true;
								}
								else if (typeof rbCalendars[k]=='object' && hrefUID.match(rbCalendars[k])!=null)
									bg = true;
							}
						}
						globalResourceCalDAVList.collections[j].fcSource = $('#calendar').fullCalendar('addEventSource', globalEventList.displayEventsArray[uid], bg);
					}
				}
			}
			collectionChBoxClick(check.get(0), '#'+check.parent().parent().attr('id'), '.resourceCalDAV_header', '.resourceCalDAV_item', null, false)
		}
/*		else
		{
			var check=$('#ResourceCalDAVList').children().eq(globalResourceCalDAVList.collections[j].index+1).find('input');
			if(!check.prop('checked'))
				check.prop('checked', true);
		}*/
	}

	if(!globalSettings.displayhiddenevents)
	{
		var afterScroll = $('#main').width()-$('#calendar').width();
		rerenderCalendar(beforeScroll!=afterScroll);
		globalResourceRefreshNumber--;
		if(!globalResourceRefreshNumber)
			$('#CalendarLoader').hide();
	}
}

function disableAllTodo()
{
	var counter=0;
	$('#ResourceCalDAVTODOList').children(':visible').each(function(i, e){
		if($(e).hasClass('resourceCalDAVTODO_item') && $(e).find('input').prop('checked'))
			counter++;
	});
	if(!counter)
		return false;

	if(!globalSettings.displayhiddenevents)
	{
		globalResourceRefreshNumberTodo++;
		$('#CalendarLoaderTODO').css('display','block');
		var beforeScroll = $('#mainTODO').width()-$('#todoList').width();
		$('#todoList').fullCalendar( 'removeEvents');
		$('#todoList').fullCalendar( 'removeEventSources');
		var afterScroll = $('#mainTODO').width()-$('#todoList').width();
		rerenderTodo(beforeScroll!=afterScroll);
	}

	for(var j=0;j<globalResourceCalDAVList.TodoCollections.length;j++)
	{
		if(globalResourceCalDAVList.TodoCollections[j].href!=undefined)
		{
			var uid=globalResourceCalDAVList.TodoCollections[j].uid;
			var check=$('#ResourceCalDAVTODOList').find('[name^="'+uid+'"]');
			if(check.prop('checked'))
			{
				var pos=globalVisibleCalDAVTODOCollections.indexOf(uid);
				if(pos!=-1)
					globalVisibleCalDAVTODOCollections.splice(pos, 1);
				check.prop('checked', false);
				if(globalSettings.displayhiddenevents)
					hideCalendarTodos(uid);
			}
			collectionChBoxClick(check.get(0), '#'+check.parent().parent().attr('id'), '.resourceCalDAVTODO_header', '.resourceCalDAVTODO_item', null, false);
		}
		/*else
		{
			var check=$('#ResourceCalDAVTODOList').children().eq(globalResourceCalDAVList.TodoCollections[j].index+1).find('input');
			if(check.prop('checked'))
				check.prop('checked', false);
		}*/
	}

	if(!globalSettings.displayhiddenevents)
	{
		globalResourceRefreshNumberTodo--;
		if(!globalResourceRefreshNumberTodo)
			$('#CalendarLoaderTODO').hide();
	}
}

function enableAllTodo()
{
	var counter=0;
	$('#ResourceCalDAVTODOList').children(':visible').each(function(i, e){
		if($(e).hasClass('resourceCalDAVTODO_item') && !$(e).find('input').prop('checked'))
			counter++;
	});
	if(!counter)
		return false;

	if(!globalSettings.displayhiddenevents)
	{
		globalResourceRefreshNumberTodo++;
		$('#CalendarLoaderTODO').css('display','block');
	}

	var beforeScroll = $('#mainTODO').width()-$('#todoList').width();
	var rex = vCalendar.pre['accountUidParts'];
	for(var j=0;j<globalResourceCalDAVList.TodoCollections.length;j++)
	{
		if(globalResourceCalDAVList.TodoCollections[j].href!=undefined)
		{
			var uid=globalResourceCalDAVList.TodoCollections[j].uid;
			var check=$('#ResourceCalDAVTODOList').find('[name^="'+uid+'"]');
			if(!check.prop('checked'))
			{
				check.prop('checked', true);
				var pos=globalVisibleCalDAVTODOCollections.indexOf(uid);
				if(pos==-1)
				{
					globalVisibleCalDAVTODOCollections[globalVisibleCalDAVTODOCollections.length]=uid;
					if(globalSettings.displayhiddenevents)
						showCalendarTodos(uid);
					else
					{
						var bg = false;
						var tmpUID = uid.match(rex);
						var hrefUID='';
						if(tmpUID!=null)
							hrefUID = tmpUID[4];
						var resource = getResourceByCollection(uid);
						if(typeof resource.backgroundCalendars!='undefined' && resource.backgroundCalendars!=null && resource.backgroundCalendars!='')
						{
							var rbCalendars = '';
							if(resource.backgroundCalendars instanceof Array)
								rbCalendars=resource.backgroundCalendars;
							else
								rbCalendars = [resource.backgroundCalendars];
							for(var k=0; k<rbCalendars.length;k++)
							{
								if (typeof rbCalendars[k]=='string')
								{
									var index = hrefUID.indexOf(rbCalendars[k]);
									if(index!=-1)
										if(hrefUID.length == (index+rbCalendars[k].length))
											bg=true;
								}
								else if (typeof rbCalendars[k]=='object' && hrefUID.match(rbCalendars[k])!=null)
									bg = true;
							}
						}
						globalResourceCalDAVList.TodoCollections[j].fcSource = $('#todoList').fullCalendar('addEventSource', globalEventList.displayTodosArray[globalResourceCalDAVList.TodoCollections[j].uid], bg);
					}
				}
			}
			collectionChBoxClick(check.get(0), '#'+check.parent().parent().attr('id'), '.resourceCalDAVTODO_header', '.resourceCalDAVTODO_item', null, false);
		}
/*		else
		{
			var check=$('#ResourceCalDAVTODOList').children().eq(globalResourceCalDAVList.TodoCollections[j].index+1).find('input');
			if(!check.prop('checked'))
				check.prop('checked', true);
		}*/
	}

	if(!globalSettings.displayhiddenevents)
	{
		var afterScroll = $('#mainTODO').width()-$('#todoList').width();
		rerenderTodo(beforeScroll!=afterScroll);
		globalResourceRefreshNumberTodo--;
		if(!globalResourceRefreshNumberTodo)
			$('#CalendarLoaderTODO').hide();
	}
}

function disableResource(header)
{
	if(!globalSettings.displayhiddenevents)
	{
		globalResourceRefreshNumber++;
		$('#CalendarLoader').show();
	}

	var beforeScroll = $('#main').width()-$('#calendar').width();
	$(header).nextUntil('.resourceCalDAV_header').each(function(i, e){
		var uid=$(e).attr('data-id');
		var pos=globalVisibleCalDAVCollections.indexOf(uid);
		if(pos!=-1)
		{
			globalVisibleCalDAVCollections.splice(pos, 1);
			if(globalSettings.displayhiddenevents)
				hideCalendarEvents(uid);
			else
				$('#calendar').fullCalendar('removeEventSource', globalResourceCalDAVList.getCollectionByUID(uid).fcSource);
		}
	});

	if(!globalSettings.displayhiddenevents)
	{
		var afterScroll = $('#main').width()-$('#calendar').width();
		rerenderCalendar(beforeScroll!=afterScroll);
		globalResourceRefreshNumber--;
		if(!globalResourceRefreshNumber)
			$('#CalendarLoader').hide();
	}
}

function enableResource(header)
{
	if(!globalSettings.displayhiddenevents)
	{
		globalResourceRefreshNumber++;
		$('#CalendarLoader').show();
	}

	var beforeScroll = $('#main').width()-$('#calendar').width();
	$(header).nextUntil('.resourceCalDAV_header').each(function(i, e){
		var uid=$(e).attr('data-id');
		var pos=globalVisibleCalDAVCollections.indexOf(uid);
		if(pos==-1)
		{
			globalVisibleCalDAVCollections[globalVisibleCalDAVCollections.length]=uid;
			if(globalSettings.displayhiddenevents)
				showCalendarEvents(uid);
			else
			{
				var bg = false;
				var tmpUID = uid.match(vCalendar.pre['accountUidParts']);
				var hrefUID='';
				if(tmpUID!=null)
					hrefUID = tmpUID[4];
				var resource = getResourceByCollection(uid);
				if(typeof resource.backgroundCalendars!='undefined' && resource.backgroundCalendars!=null && resource.backgroundCalendars!='')
				{
					var rbCalendars = '';
					if(resource.backgroundCalendars instanceof Array)
						rbCalendars=resource.backgroundCalendars;
					else
						rbCalendars = [resource.backgroundCalendars];
					for(var j=0; j<rbCalendars.length;j++)
					{
						if (typeof rbCalendars[j]=='string')
						{
							var index = hrefUID.indexOf(rbCalendars[j]);
							if(index!=-1)
								if(hrefUID.length == (index+rbCalendars[j].length))
									bg=true;
						}
						else if (typeof rbCalendars[j]=='object' && hrefUID.match(rbCalendars[j])!=null)
							bg = true;
					}
				}
				globalResourceCalDAVList.getCollectionByUID(uid).fcSource = $('#calendar').fullCalendar('addEventSource', globalEventList.displayEventsArray[uid], bg);
			}
		}
	});

	if(!globalSettings.displayhiddenevents)
	{
		var afterScroll = $('#main').width()-$('#calendar').width();
		rerenderCalendar(beforeScroll!=afterScroll);
		globalResourceRefreshNumber--;
		if(!globalResourceRefreshNumber)
			$('#CalendarLoader').hide();
	}
}

function disableResourceTodo(header)
{
	if(!globalSettings.displayhiddenevents)
	{
		globalResourceRefreshNumberTodo++;
		$('#CalendarLoaderTODO').show();
	}

	var beforeScroll = $('#mainTODO').width()-$('#todoList').width();
	$(header).nextUntil('.resourceCalDAVTODO_header').each(function(i, e){
		var uid=$(e).attr('data-id');
		var pos=globalVisibleCalDAVTODOCollections.indexOf(uid);
		if(pos!=-1)
		{
			globalVisibleCalDAVTODOCollections.splice(pos, 1);
			if(globalSettings.displayhiddenevents)
				hideCalendarTodos(uid);
			else
				$('#todoList').fullCalendar('removeEventSource', globalResourceCalDAVList.getTodoCollectionByUID(uid).fcSource);
		}
	});

	if(!globalSettings.displayhiddenevents)
	{
		var afterScroll = $('#mainTODO').width()-$('#todoList').width();
		rerenderTodo(beforeScroll!=afterScroll);
		globalResourceRefreshNumberTodo--;
		if(!globalResourceRefreshNumberTodo)
			$('#CalendarLoaderTODO').hide();
	}
}

function enableResourceTodo(header)
{
	if(!globalSettings.displayhiddenevents)
	{
		globalResourceRefreshNumberTodo++;
		$('#CalendarLoaderTODO').show();
	}

	var beforeScroll = $('#mainTODO').width()-$('#todoList').width();
	$(header).nextUntil('.resourceCalDAVTODO_header').each(function(i, e){
		var uid=$(e).attr('data-id');
		var pos=globalVisibleCalDAVTODOCollections.indexOf(uid);
		if(pos==-1)
		{
			globalVisibleCalDAVTODOCollections[globalVisibleCalDAVTODOCollections.length]=uid;
			if(globalSettings.displayhiddenevents)
				showCalendarTodos(uid);
			else
			{
				var bg = false;
				var tmpUID = uid.match(vCalendar.pre['accountUidParts']);
				var hrefUID='';
				if(tmpUID!=null)
					hrefUID = tmpUID[4];
				var resource = getResourceByCollection(uid);
				if(typeof resource.backgroundCalendars!='undefined' && resource.backgroundCalendars!=null && resource.backgroundCalendars!='')
				{
					var rbCalendars = '';
					if(resource.backgroundCalendars instanceof Array)
						rbCalendars=resource.backgroundCalendars;
					else
						rbCalendars = [resource.backgroundCalendars];
					for(var j=0; j<rbCalendars.length;j++)
					{
						if (typeof rbCalendars[j]=='string')
						{
							var index = hrefUID.indexOf(rbCalendars[j]);
							if(index!=-1)
								if(hrefUID.length == (index+rbCalendars[j].length))
									bg=true;
						}
						else if (typeof rbCalendars[j]=='object' && hrefUID.match(rbCalendars[j])!=null)
							bg = true;
					}
				}
				globalResourceCalDAVList.getTodoCollectionByUID(uid).fcSource = $('#todoList').fullCalendar('addEventSource', globalEventList.displayTodosArray[uid], bg);
			}
		}
	});

	if(!globalSettings.displayhiddenevents)
	{
		var afterScroll = $('#mainTODO').width()-$('#todoList').width();
		rerenderTodo(beforeScroll!=afterScroll);
		globalResourceRefreshNumberTodo--;
		if(!globalResourceRefreshNumberTodo)
			$('#CalendarLoaderTODO').hide();
	}
}

function disableCalendar(uid)
{
	var pos=globalVisibleCalDAVCollections.indexOf(uid);
	if(pos!=-1)
	{
		globalVisibleCalDAVCollections.splice(pos, 1);
		if(globalSettings.displayhiddenevents)
			hideCalendarEvents(uid);
		else
		{
			var beforeScroll = $('#main').width()-$('#calendar').width();
			globalResourceRefreshNumber++;
			$('#CalendarLoader').show();
			$('#calendar').fullCalendar( 'removeEventSource', globalResourceCalDAVList.getCollectionByUID(uid).fcSource);
			globalResourceRefreshNumber--;

			if(!globalResourceRefreshNumber)
			{
				var afterScroll = $('#main').width()-$('#calendar').width();
				rerenderCalendar(beforeScroll!=afterScroll);
				$('#CalendarLoader').hide();
			}
		}
	}
}

function enableCalendar(uid)
{
	var pos=globalVisibleCalDAVCollections.indexOf(uid);
	if(pos==-1)
	{
		globalVisibleCalDAVCollections[globalVisibleCalDAVCollections.length]=uid;
		if(globalSettings.displayhiddenevents)
			showCalendarEvents(uid);
		else
		{
			var beforeScroll = $('#main').width()-$('#calendar').width();
			globalResourceRefreshNumber++;
			$('#CalendarLoader').show();
			var bg = false;
			var tmpUID = uid.match(vCalendar.pre['accountUidParts']);
			var hrefUID='';
			if(tmpUID!=null)
				hrefUID = tmpUID[4];
			var resource = getResourceByCollection(uid);
			if(typeof resource.backgroundCalendars!='undefined' && resource.backgroundCalendars!=null && resource.backgroundCalendars!='')
			{
				var rbCalendars = '';
				if(resource.backgroundCalendars instanceof Array)
					rbCalendars=resource.backgroundCalendars;
				else
					rbCalendars = [resource.backgroundCalendars];
				for(var j=0; j<rbCalendars.length;j++)
				{
					if (typeof rbCalendars[j]=='string')
					{
						var index = hrefUID.indexOf(rbCalendars[j]);
						if(index!=-1)
							if(hrefUID.length == (index+rbCalendars[j].length))
								bg=true;
					}
					else if (typeof rbCalendars[j]=='object' && hrefUID.match(rbCalendars[j])!=null)
						bg = true;
				}
			}
			globalResourceCalDAVList.getCollectionByUID(uid).fcSource = $('#calendar').fullCalendar('addEventSource', globalEventList.displayEventsArray[uid], bg);
			globalResourceRefreshNumber--;

			if(!globalResourceRefreshNumber)
			{
				var afterScroll = $('#main').width()-$('#calendar').width();
				rerenderCalendar(beforeScroll!=afterScroll);
				$('#CalendarLoader').hide();
			}
		}
	}
}

function disableCalendarTodo(uid)
{
	var pos=globalVisibleCalDAVTODOCollections.indexOf(uid);
	if(pos!=-1)
	{
		globalVisibleCalDAVTODOCollections.splice(pos, 1);
		if(globalSettings.displayhiddenevents)
			hideCalendarTodos(uid);
		else
		{
			var beforeScroll = $('#mainTODO').width()-$('#todoList').width();
			globalResourceRefreshNumberTodo++;
			$('#CalendarLoaderTODO').show();
			$('#todoList').fullCalendar( 'removeEventSource', globalResourceCalDAVList.getTodoCollectionByUID(uid).fcSource);
			globalResourceRefreshNumberTodo--;

			if(!globalResourceRefreshNumberTodo)
			{
				var afterScroll = $('#mainTODO').width()-$('#todoList').width();
				rerenderTodo(beforeScroll!=afterScroll);
				$('#CalendarLoaderTODO').hide();
			}
		}
	}
}

function enableCalendarTodo(uid)
{
	var pos=globalVisibleCalDAVTODOCollections.indexOf(uid);
	if(pos==-1)
	{
		globalVisibleCalDAVTODOCollections[globalVisibleCalDAVTODOCollections.length]=uid;
		if(globalSettings.displayhiddenevents)
			showCalendarTodos(uid);
		else
		{
			var beforeScroll = $('#mainTODO').width()-$('#todoList').width();
			globalResourceRefreshNumberTodo++;
			$('#CalendarLoaderTODO').show();
			var bg = false;
			var tmpUID = uid.match(vCalendar.pre['accountUidParts']);
			var hrefUID='';
			if(tmpUID!=null)
				hrefUID = tmpUID[4];
			var resource = getResourceByCollection(uid);
			if(typeof resource.backgroundCalendars!='undefined' && resource.backgroundCalendars!=null && resource.backgroundCalendars!='')
			{
				var rbCalendars = '';
				if(resource.backgroundCalendars instanceof Array)
					rbCalendars=resource.backgroundCalendars;
				else
					rbCalendars = [resource.backgroundCalendars];
				for(var j=0; j<rbCalendars.length;j++)
				{
					if (typeof rbCalendars[j]=='string')
					{
						var index = hrefUID.indexOf(rbCalendars[j]);
						if(index!=-1)
							if(hrefUID.length == (index+rbCalendars[j].length))
								bg=true;
					}
					else if (typeof rbCalendars[j]=='object' && hrefUID.match(rbCalendars[j])!=null)
						bg = true;
				}
			}
			globalResourceCalDAVList.getTodoCollectionByUID(uid).fcSource = $('#todoList').fullCalendar('addEventSource', globalEventList.displayTodosArray[uid], bg);
			globalResourceRefreshNumberTodo--;

			if(!globalResourceRefreshNumberTodo)
			{
				var afterScroll = $('#mainTODO').width()-$('#todoList').width();
				rerenderTodo(beforeScroll!=afterScroll);
				$('#CalendarLoaderTODO').hide();
			}
		}
	}
}

function getoffsetString(offset)
{
	if(offset<0)
	{
		offset*=-1;
		offset='-'+(offset<10 ? '0' : '')+offset.toString().split('.')[0]+(offset.toString().split('.').length>1 ? '30' : '00')
	}
	else
		offset='+'+(offset<10 ? '0' : '')+offset.toString().split('.')[0]+(offset.toString().split('.').length>1 ? '30' : '00')

	return offset;
}

Date.prototype.stdTimezoneOffset=function()
{
	var jan=new Date(this.getFullYear(), 0, 1);
	var jul=new Date(this.getFullYear(), 6, 1);
	return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
}

Date.prototype.dst=function()
{
	return this.getTimezoneOffset()<this.stdTimezoneOffset();
}

function setGlobalDateFunction()
{
	var date=new Date();
	var offset=date.getTimezoneOffset()*(-1)*60*1000;
}
function initFullCalendar()
{
	$('#calendar').fullCalendar({
		eventMode: true,
		contentHeight: $('#main').height() - 14, // -14px for 7px padding on top and bottom
		windowResize: function(view){
			if(globalCalDAVQs!=null)
				globalCalDAVQs.cache();
			if(globalSettings.displayhiddenevents)
				hideEventCalendars();
			globalCalWidth = $('#main').width();
			$('#ResizeLoader').hide();
		},
		bindingMode: globalSettings.openformmode,
		startOfBusiness: globalSettings.calendarstartofbusiness,
		endOfBusiness: globalSettings.calendarendofbusiness,
		showWeekNumbers: true,
		showDatepicker: true,
		//ignoreTimezone: !globalSettings.timezonesupport,
		titleFormat: {
			month: globalSettings.titleformatmonth,
			multiWeek: globalSettings.titleformatweek,
			week: globalSettings.titleformatweek,
			day: globalSettings.titleformatday,
			table: globalSettings.titleformattable,
		},
		columnFormat: {
			month: 'ddd',
			multiWeek: 'ddd',
			week: globalSettings.columnformatagenda,
			day: globalSettings.columnformatagenda,
			table: globalSettings.columnformatagenda,
		},
		timeFormat: {
			agenda: globalSettings.timeformatagenda,
			list: globalSettings.ampmformat ? 'hh:mm TT{ - hh:mm TT}' : 'HH:mm{ - HH:mm}',
			listFull: globalSettings.ampmformat ? globalSettings.timeformatlist + ' hh:mm TT{ - ' + globalSettings.timeformatlist +' hh:mm TT}' : globalSettings.timeformatlist + ' HH:mm{ - ' + globalSettings.timeformatlist + ' HH:mm}',
			listFullAllDay: globalSettings.timeformatlist + '{ - ' + globalSettings.timeformatlist + '}',
			'': globalSettings.timeformatbasic
		},
		axisFormat: globalSettings.ampmformat ? 'h:mm TT' : 'H:mm',
		buttonText: {
			month: localization[globalInterfaceLanguage].fullCalendarMonth,
			multiWeek: localization[globalInterfaceLanguage].fullCalendarMultiWeek,
			week: localization[globalInterfaceLanguage].fullCalendarAgendaWeek,
			day: localization[globalInterfaceLanguage].fullCalendarAgendaDay,
			table: localization[globalInterfaceLanguage].fullCalendarTable,
			today: localization[globalInterfaceLanguage].fullCalendarTodayButton,
			prevMonth: localization[globalInterfaceLanguage].loadPrevMonth,
			nextMonth: localization[globalInterfaceLanguage].loadNextMonth,
		},
		allDayText: localization[globalInterfaceLanguage].fullCalendarAllDay,
		monthNames: localization[globalInterfaceLanguage].monthNames,
		monthNamesShort: localization[globalInterfaceLanguage].monthNamesShort,
		dayNames: localization[globalInterfaceLanguage].dayNames,
		dayNamesShort: localization[globalInterfaceLanguage].dayNamesShort,		
		dayEventSizeStrict: true,
		dayClick: function(date, allDay, jsEvent, view){
			$('#show').val('');
			$('#CAEvent').hide();
			$('#timezonePicker').prop('disabled', true);
			$('#EventDisabler').fadeIn(globalEditorFadeAnimation, function(){
				showEventForm(date, allDay, null, jsEvent, 'new','');
				$('#name').focus();
			});
		},
		beforeViewDisplay: function(view){
			// Hide scrollbar to force view rendering on full width
			if(globalAllowFcRerender)
				$('#main').css('overflow','hidden');
		},
		viewDisplay: function(view){
			// Allow scrollbar if previosly hidden
			if(globalAllowFcRerender)
				$('#main').css('overflow','');
			// If scrollbar present, force view rendering on reduced width
			if(globalAllowFcRerender && $('#main').width() - $('#calendar').width())
			{
				globalAllowFcRerender=false;
				$('#calendar').fullCalendar('render');
				return false;
			}

			globalCalWidth=$('#main').width();
			if(globalCalDAVQs!=null)
				globalCalDAVQs.cache();
			if(globalSettings.displayhiddenevents)
				hideEventCalendars();
			globalAllowFcRerender=true;
		},
		firstDay: globalSettings.datepickerfirstdayofweek,
		weekendDays: globalSettings.weekenddays,
		header: {
			left: 'prev,next today',
			center: 'title',
			right: 'month,multiWeek,agendaWeek,agendaDay'
		},
		listSections: 'day',
		headerContainer: $('#main_h_placeholder'),
		defaultView: globalSettings.activeview,
		editable: true,
		currentTimeIndicator: true,
		unselectAuto: false,
		eventClick: function(calEvent, jsEvent, view){
			globalEventDateStart=new Date(calEvent.start.getTime());

			if(calEvent.end!=null)
				globalEventDateEnd=new Date(calEvent.end.getTime());
			else
				globalEventDateEnd=new Date(calEvent.start.getTime());
			globalCalEvent=calEvent;
			globalJsEvent=jsEvent;
			if(calEvent.type=='')
				showEventForm(null, calEvent.allDay, calEvent, jsEvent, 'show', '');
			else
				showEventForm(null, calEvent.allDay, calEvent, jsEvent, 'show', 'editOnly');
		},
		eventDragStart: function(calEvent, jsEvent, ui, view){
			globalPrevDragEventAllDay=calEvent.allDay;
			globalEventDateStart=new Date(calEvent.start.getTime());
			if(calEvent.end!=null)
				globalEventDateEnd=new Date(calEvent.end.getTime());
			else
				globalEventDateEnd=new Date(calEvent.start.getTime());
		},
		eventDrop: function(calEvent, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view){
			if(calEvent.rid!='')
			{
				var coll = globalResourceCalDAVList.getCollectionByUID(calEvent.res_id);
				if(coll!=null && coll.permissions.read_only)
				{
					revertFunc();
					return false;
				}
					
			}
			if(calEvent.realStart && calEvent.realEnd)
			{
				var checkDate=new Date(calEvent.realStart.getFullYear(), calEvent.realStart.getMonth(), calEvent.realStart.getDate()+dayDelta, calEvent.realStart.getHours(), calEvent.realStart.getMinutes()+minuteDelta,0);
				var checkDateEnd=new Date(calEvent.realEnd.getFullYear(), calEvent.realEnd.getMonth(), calEvent.realEnd.getDate()+dayDelta, calEvent.realEnd.getHours(), calEvent.realEnd.getMinutes()+minuteDelta,0);
				if(calEvent.type!='')
				{
					calEvent.start=checkDate;
					calEvent.end=checkDateEnd;
				}
				else
				{
					calEvent.realStart=checkDate;
					calEvent.realEnd=checkDateEnd;
				}
			}
			else
			{
				calEvent.realStart=calEvent.start;
				calEvent.realEnd=calEvent.end;
			}

			globalRevertFunction=revertFunc;
			if(calEvent.type!='')
				showEventForm(null, calEvent.allDay, calEvent, jsEvent, 'drop', 'editOnly');
			else
				showEventForm(null, calEvent.allDay, calEvent, jsEvent, 'drop', '');

			save(true);
			globalPrevDragEvent = null;
		},
		eventResizeStart: function(calEvent, jsEvent, ui, view){
			globalEventDateStart=new Date(calEvent.start.getTime());
			if(calEvent.end!=null)
				globalEventDateEnd=new Date(calEvent.end.getTime());
			else
				globalEventDateEnd=new Date(calEvent.start.getTime());
		},
		eventResize: function(calEvent, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view){
			if(calEvent.rid!='')
			{
				var coll = globalResourceCalDAVList.getCollectionByUID(calEvent.res_id);
				if(coll!=null && coll.permissions.read_only)
				{
					revertFunc();
					return false;
				}
					
			}

			if(calEvent.realStart && calEvent.realEnd)
			{
				var checkDateEnd = new Date(calEvent.realEnd.getFullYear(),calEvent.realEnd.getMonth(), calEvent.realEnd.getDate()+dayDelta, calEvent.realEnd.getHours(),calEvent.realEnd.getMinutes()+minuteDelta,0);
				if(calEvent.type!='')
				{
					calEvent.end=checkDateEnd;
				}
				else
				{
					calEvent.realEnd=checkDateEnd;
				}
			}
			else
			{
				calEvent.realEnd=calEvent.end;
			}
			globalRevertFunction=revertFunc;

			if(calEvent.type!='')
				showEventForm(null, calEvent.allDay, calEvent, jsEvent, 'drop', 'editOnly');
			else
				showEventForm(null, calEvent.allDay, calEvent, jsEvent, 'drop', '');

			save(true);
		},
		eventResizeHelperCreated: function(calEvent, jsEvent, element, helper, view){
			if(element.hasClass('searchCalDAV_hide'))
				helper.addClass('searchCalDAV_hide');
			if(element.hasClass('checkCalDAV_hide'))
				helper.addClass('checkCalDAV_hide');
		},
		selectable: true,
		selectHelper: false,
		select: function(startDate, endDate, allDay, jsEvent, view){
			$('#show').val('');
			$('#CAEvent').hide();
			$('#timezonePicker').prop('disabled', true);
			$('#EventDisabler').fadeIn(globalEditorFadeAnimation, function(){
				var calEvent=new Object();
				calEvent.start=startDate;
				calEvent.end=endDate;
				showEventForm(null, allDay, calEvent, jsEvent, 'new', '');
				$('#name').focus();
			});
		},
		eventAfterRender: function(event, element, view){
			element.attr("data-res-id",event.res_id);
			element.attr("data-id",event.id);
			element.attr("title",event.title.replace(vCalendar.pre['compressNewLineRex']," "));
			element.addClass("event_item");
			if(event.status == 'CANCELLED')
				$(element).find('.fc-event-title').css('text-decoration', 'line-through');

			if(event.searchData)
			{
				var searchElem;
				if(view.name=='table')
					searchElem = $('<td>');
				else
					searchElem = $('<div>');
				element.append(searchElem.attr({'data-type':'searchable_data', 'style':'display:none;'}).html(event.searchData.replace(vCalendar.pre['compressNewLineRex']," ")));
			}

			if(view.name!='table')
				$(element).find('.fc-event-title, .fc-event-title-strict, .fc-event-time').css('color',checkFontColor(event.color));
		},
		viewChanged: function(view) {
			$('#CAEvent').hide();
		},
		todayClick: function() {
			$('#CAEvent').hide();
		},
		prevClick: function() {
			$('#CAEvent').hide();
			getPrevMonths($('#calendar').fullCalendar('getView').start);
		},
		nextClick: function() {
			$('#CAEvent').hide();
			getNextMonths($('#calendar').fullCalendar('getView').end);
		}
	});
}

function initTodoList()
{
	$('#todoList').fullCalendar({
		eventMode: false,
		showUnstartedEvents: globalSettings.appleremindersmode,
		simpleFilters: globalSettings.appleremindersmode,
		contentHeight: $('#mainTODO').height() - 14, //-14px for 7px padding on top and bottom
		windowResize: function(view){
			if(globalCalDAVTODOQs!=null)
				globalCalDAVTODOQs.cache();
			if(globalSettings.displayhiddenevents)
				hideTodoCalendars();
		},
		showDatepicker: true,
		titleFormat: {
			todo: globalSettings.titleformattable,
		},
		columnFormat: {
			todo: globalSettings.columnformatagenda,
		},
		timeFormat: {
			list: globalSettings.ampmformat ? globalSettings.timeformatlist + ' hh:mm TT' : globalSettings.timeformatlist + ' HH:mm',
		},
		axisFormat: globalSettings.ampmformat ? 'h:mm TT' : 'H:mm',
		buttonText: {
			today: localization[globalInterfaceLanguage].fullCalendarTodayButton,
			filtersHeader: localization[globalInterfaceLanguage].txtStatusFiltersHeaderTODO,
			filtersFooter: localization[globalInterfaceLanguage].txtStatusFiltersFooterTODO,
			filterAction: localization[globalInterfaceLanguage].txtStatusNeedsActionTODO,
			filterProgress: localization[globalInterfaceLanguage].txtStatusInProcessTODO,
			filterCompleted: localization[globalInterfaceLanguage].txtStatusCompletedTODO,
			filterCanceled: localization[globalInterfaceLanguage].txtStatusCancelledTODO,
		},
		allDayText: localization[globalInterfaceLanguage].fullCalendarAllDay,
		monthNames: localization[globalInterfaceLanguage].monthNames,
		monthNamesShort: localization[globalInterfaceLanguage].monthNamesShort,
		dayNames: localization[globalInterfaceLanguage].dayNames,
		dayNamesShort: localization[globalInterfaceLanguage].dayNamesShort,
		defaultFilters: globalSettings.todolistfilterselected,
		viewDisplay: function(view){
			if(globalCalDAVTODOQs!=null)
				globalCalDAVTODOQs.cache();
			if(globalSettings.displayhiddenevents)
				hideTodoCalendars();
			$('.fc-view-todo .fc-table-dateinfo, .fc-view-todo .fc-table-datepicker').css('opacity','1');
		},
		firstDay: globalSettings.datepickerfirstdayofweek,
		weekendDays: globalSettings.weekenddays,
		header: {
			left: 'prev,next today',
			center: '',
			right: ''
		},
		listSections: 'day',
		headerContainer: $('#mainTODO_h_placeholder'),
		defaultView: 'todo',
		editable: true,
		selectEmpty: function(){
			$('#CATodo').attr('style','display:none');
			$('#todoColor').css('background-color','');
		},
		eventClick: function(calTodo, jsEvent, view){
			if($('#todoInEdit').val()=='true')
				return false;

			globalCalTodo=calTodo;
			if(calTodo.type=='')
				showTodoForm(calTodo, 'show', '');
			else
			{
				if(globalSettings.appleremindersmode && (calTodo.status=='COMPLETED' || calTodo.status== 'CANCELLED'))
					showTodoForm(calTodo, 'show', '');
				else if(!globalSettings.appleremindersmode || typeof globalAppleSupport.nextDates[calTodo.id] != 'undefined')
					showTodoForm(calTodo, 'show', 'editOnly');
				else
					showTodoForm(calTodo, 'show', '');
			}
		},
		eventAfterRender: function(event, element, view){
			element.attr("data-res-id",event.res_id);
			element.attr("data-repeat-hash",event.repeatHash);
			if(event.start)
				element.attr("data-start", $.fullCalendar.formatDate(event.start, "yyyyMMdd'T'HHmmss'Z'"));
			else
				element.attr("data-start", '');
			element.attr("data-id",event.id);
			element.addClass("event_item");
			var title = event.title.replace(vCalendar.pre['compressNewLineRex']," ");
			if(event.status == 'CANCELLED')
				$(element).css('text-decoration', 'line-through');
			switch(event.filterStatus)
			{
				case 'filterAction':
					title+=' ('+localization[globalInterfaceLanguage].txtStatusNeedsActionTODO+')';
					break;
				case 'filterProgress':
					title+=' ('+localization[globalInterfaceLanguage].txtStatusInProcessTODO+')';
					break;
				case 'filterCompleted':
					if(event.completedOn)
						title+=' ('+localization[globalInterfaceLanguage].txtCompletedOn+' '+$.fullCalendar.formatDate(event.completedOn, globalSettings.timeformatlist+' '+$('#todoList').fullCalendar('getOption','axisFormat'))+')';
					else
						title+=' ('+localization[globalInterfaceLanguage].txtStatusCompletedTODO+')';
					break;
				case 'filterCanceled':
					title+=' ('+localization[globalInterfaceLanguage].txtStatusCancelledTODO+')';
					break;
				default:
					break;
			}
			element.attr("title",title);
			if(event.searchData)
				element.append($('<td>').attr({'data-type':'searchable_data', 'style':'display:none;'}).html(event.searchData.replace(vCalendar.pre['compressNewLineRex']," ")));
		},
		prevClick: function() {
			getPrevMonthsTodo();
		},
		nextClick: function() {
			getNextMonthsTodo();
		}
	});
	$('#todoList').fullCalendar('allowSelectEvent',false);
}

function setFirstDayEvent(setDay)
{
	var firstDay=typeof setDay!='undefined'?setDay:globalSettings.datepickerfirstdayofweek;
	var eventWeekDayCells = $('#week_custom .customTable td');
	var eventWeekDayContainer = eventWeekDayCells.parent();
	var eventMonthDayOptions = $('#repeat_month_custom_select2 option');
	var eventYearDayOptions = $('#repeat_year_custom_select2 option');

	for(i=firstDay; i<7; i++)
	{
		eventWeekDayContainer.append(eventWeekDayCells.filter('[data-type="'+i+'"]').detach());
		eventMonthDayOptions.filter('[data-type="'+i+'"]').detach().insertBefore(eventMonthDayOptions.filter('[data-type="month_custom_month"]'));
		eventYearDayOptions.filter('[data-type="'+i+'"]').detach().insertBefore(eventYearDayOptions.filter('[data-type="year_custom_month"]'));
	}

	for(i=0; i<firstDay; i++)
	{
		eventWeekDayContainer.append(eventWeekDayCells.filter('[data-type="'+i+'"]').detach());
		eventMonthDayOptions.filter('[data-type="'+i+'"]').detach().insertBefore(eventMonthDayOptions.filter('[data-type="month_custom_month"]'));
		eventYearDayOptions.filter('[data-type="'+i+'"]').detach().insertBefore(eventYearDayOptions.filter('[data-type="year_custom_month"]'));
	}

	eventWeekDayCells.removeClass('firstCol lastCol');
	eventWeekDayCells.filter('[data-type="'+firstDay+'"]').addClass('firstCol');
	eventWeekDayCells.filter('[data-type="'+(firstDay+6)%7+'"]').addClass('lastCol');
}

function setFirstDayTodo(setDay)
{
	var firstDay=typeof setDay!='undefined'?setDay:globalSettings.datepickerfirstdayofweek;
	var todoWeekDayCells = $('#week_custom_TODO .customTable td');
	var todoWeekDayContainer = todoWeekDayCells.parent();
	var todoMonthDayOptions = $('#repeat_month_custom_select2_TODO option');
	var todoYearDayOptions = $('#repeat_year_custom_select2_TODO option');

	for(i=firstDay; i<7; i++)
	{
		todoWeekDayContainer.append(todoWeekDayCells.filter('[data-type="'+i+'"]').detach());
		todoMonthDayOptions.filter('[data-type="'+i+'"]').detach().insertBefore(todoMonthDayOptions.filter('[data-type="month_custom_month"]'));
		todoYearDayOptions.filter('[data-type="'+i+'"]').detach().insertBefore(todoYearDayOptions.filter('[data-type="year_custom_month"]'));
	}

	for(i=0; i<firstDay; i++)
	{
		todoWeekDayContainer.append(todoWeekDayCells.filter('[data-type="'+i+'"]').detach());
		todoMonthDayOptions.filter('[data-type="'+i+'"]').detach().insertBefore(todoMonthDayOptions.filter('[data-type="month_custom_month"]'));
		todoYearDayOptions.filter('[data-type="'+i+'"]').detach().insertBefore(todoYearDayOptions.filter('[data-type="year_custom_month"]'));
	}

	todoWeekDayCells.removeClass('firstCol lastCol');
	todoWeekDayCells.filter('[data-type="'+firstDay+'"]').addClass('firstCol');
	todoWeekDayCells.filter('[data-type="'+(firstDay+6)%7+'"]').addClass('lastCol');
}

function checkEventFormScrollBar()
{
	if($('#eventDetailsContainer').is(':hidden'))
		return false;

	var baseWidth = 413;
	var scrollWidth = ($('#event_details_template').width() - $('#eventDetailsContainer').width());
	$('#event_details_template').width(baseWidth+scrollWidth);
	$('#eventColor').height($('#eventDetailsContainer').height()+12);
}

function initTimepicker(ampm)
{
	timelist=new Array();
	if(!ampm)
	{
		globalTimePre=new RegExp('^ *((([0-1]?[0-9]|2[0-3]):[0-5]?[0-9])|(([0-1][0-9]|2[0-3])[0-5][0-9])) *$','i');
		// 24 hour format time strings for the autocomplete functionality
		for(var i=0;i<24;i++)
			for(var j=0;j<minelems.length;j++)
				timelist.push(i.pad(2)+':'+minelems[j].pad(2));
	}
	else
	{
		globalTimePre=new RegExp('^ *((((0?[1-9]|1[0-2]):[0-5]?[0-9])|((0[1-9]|1[0-2])[0-5][0-9])) *AM|(((0?[1-9]|1[0-2]):[0-5]?[0-9])|((0[1-9]|1[0-2])[0-5][0-9])) *PM) *$','i');
		// 12 hour format time strings for the autocomplete functionality
		for(var i=0;i<24;i++)
			for(var j=0;j<minelems.length;j++)
				timelist.push((i==0 ? 12 : (i<13 ? i : i-12)).pad(2)+':'+minelems[j].pad(2)+(i<12 ? ' AM' : ' PM'));
	}
}

function showEventPrevNav()
{
	$('#CAEvent .formNav.prev').click(function(){
		eventPrevNavClick();
	});

	$('#CAEvent .header').addClass('leftspace');
	$('#CAEvent .formNav.prev').css('display', 'block');
}

function showEventNextNav()
{
	$('#CAEvent .formNav.next').click(function(){
		eventNextNavClick();
	});
	$('#CAEvent .header').addClass('rightspace');
	$('#CAEvent .formNav.next').css('display', 'block');
}

function showTodoPrevNav(uncompletedOnly)
{
	var type='top';
	if(uncompletedOnly)
		type='bottom';

	$('#CATodo .formNav.prev.'+type).click(function(){
		todoPrevNavClick(uncompletedOnly);
	});

	$('#CATodo .header').addClass('leftspace');
	$('#CATodo .formNav.prev.'+type).css('display', 'block');
}

function showTodoNextNav(uncompletedOnly)
{
	var type='top';
	if(uncompletedOnly)
		type='bottom';

	$('#CATodo .formNav.next.'+type).click(function(){
		todoNextNavClick(uncompletedOnly);
	});

	$('#CATodo .header').addClass('rightspace');
	$('#CATodo .formNav.next.'+type).css('display', 'block');
}

function eventPrevNavClick()
{
	var eventsSorted=jQuery.grep(globalEventList.displayEventsArray[globalCalEvent.res_id],function(e){if(e.id==globalCalEvent.id)return true}).sort(repeatStartCompare);
		
	if(eventsSorted.indexOf(globalCalEvent)!=-1)
	{
		if(eventsSorted.indexOf(globalCalEvent)>0)
		{
			globalCalEvent=eventsSorted[eventsSorted.indexOf(globalCalEvent)-1];
			showEventForm(null, globalCalEvent.allDay, globalCalEvent, globalJsEvent, 'show', 'editOnly');
		}
	}	
}

function eventNextNavClick()
{
	var eventsSorted=jQuery.grep(globalEventList.displayEventsArray[globalCalEvent.res_id],function(e){if(e.id==globalCalEvent.id)return true}).sort(repeatStartCompare);
		
	if(eventsSorted.indexOf(globalCalEvent)!=-1)
	{
		if(eventsSorted.indexOf(globalCalEvent)<(eventsSorted.length-1))
		{
			globalCalEvent=eventsSorted[eventsSorted.indexOf(globalCalEvent)+1];
			showEventForm(null, globalCalEvent.allDay, globalCalEvent, globalJsEvent, 'show', 'editOnly');
		}
	}	
}

function todoPrevNavClick(uncompletedOnly)
{
	var eventsSorted=jQuery.grep(globalEventList.displayTodosArray[globalCalTodo.res_id],function(e){if(e.id==globalCalTodo.id)return true}).sort(repeatStartCompare);

	if(eventsSorted.indexOf(globalCalTodo)!=-1)
	{
		if(eventsSorted.indexOf(globalCalTodo)>0)
		{
			if(uncompletedOnly)
			{
				for(var ij=eventsSorted.indexOf(globalCalTodo)-1; ij>=0; ij--)
					if(eventsSorted[ij].status!='COMPLETED')
					{
						globalCalTodo=eventsSorted[ij];
						break;
					}
			}
			else
				globalCalTodo=eventsSorted[eventsSorted.indexOf(globalCalTodo)-1];
			showTodoForm(globalCalTodo, 'show', 'editOnly');
		}
	}
}

function todoNextNavClick(uncompletedOnly)
{
	var eventsSorted=jQuery.grep(globalEventList.displayTodosArray[globalCalTodo.res_id],function(e){if(e.id==globalCalTodo.id)return true}).sort(repeatStartCompare);
	if(eventsSorted.indexOf(globalCalTodo)!=-1)
	{
		if(eventsSorted.indexOf(globalCalTodo)<(eventsSorted.length-1))
		{
			if(uncompletedOnly)
			{
				for(var ij=eventsSorted.indexOf(globalCalTodo)+1; ij<eventsSorted.length; ij++)
					if(eventsSorted[ij].status!='COMPLETED')
					{
						globalCalTodo=eventsSorted[ij];
						break;
					}
			}
			else
				globalCalTodo=eventsSorted[eventsSorted.indexOf(globalCalTodo)+1];
			showTodoForm(globalCalTodo, 'show', 'editOnly');
		}
	}
}

function todoStatusChanged(status)
{
	if(status=='COMPLETED')
	{
		var today = new Date();
		$('.completedOnTr').show();
		if($('#completedOnDate').val()=='')
			$('#completedOnDate').val($.datepicker.formatDate(globalSettings.datepickerformat, today));
		if($('#completedOnTime').val()=='')
			$('#completedOnTime').val($.fullCalendar.formatDate(today, (globalSettings.ampmformat ? 'hh:mm TT' : 'HH:mm')));
		$('#completedOnDate, #completedOnTime').change();
	}
	else {
		$('#completedOnDate, #completedOnTime').parent().find('img').css('display','none');
		$('.completedOnTr').hide();
	}
}

function initKbTodoNavigation()
{
	$(document.documentElement).keyup(function(event)
	{
		if(typeof globalActiveApp=='undefined' || globalActiveApp!='CalDavTODO' || typeof globalObjectLoading=='undefined' || globalObjectLoading==true)
			return true;
		if($('#SystemCalDavTODO').css('visibility')!='hidden' && isCalDAVLoaded && $('#TodoDisabler').css('display')=='none' && !$('#searchInputTODO').is(':focus'))
		{
			// 37 = left, 38 = up, 39 = right, 40 = down
			var selected_todo=null, next_todo=null;
			if((selected_todo=$('#SystemCalDavTODO').find('.fc-event-selected').parent()).length==1)
			{
				if(event.keyCode == 38 && (next_todo=selected_todo.prevAll('.fc-list-section').find('.fc-event').filter(':visible').last()).length || event.keyCode == 40 && (next_todo=selected_todo.nextAll('.fc-list-section').find('.fc-event').filter(':visible').first()).length)
					$('#todoList').fullCalendar('selectEvent', next_todo);
			}
		}
	});

	$(document.documentElement).keydown(function(event)
	{
		if(typeof globalActiveApp=='undefined' || globalActiveApp!='CalDavTODO' || typeof globalObjectLoading=='undefined' || globalObjectLoading==true)
			return true;

		if($('#SystemCalDavTODO').css('visibility')!='hidden' && isCalDAVLoaded && $('#TodoDisabler').css('display')=='none' && !$('#searchInputTODO').is(':focus'))
		{
			// 37 = left, 38 = up, 39 = right, 40 = down
			var selected_todo=null, next_todo=null;
			if((selected_todo=$('#SystemCalDavTODO').find('.fc-event-selected').parent()).length==1)
			{
				if(event.keyCode == 38 && (next_todo=selected_todo.prevAll('.fc-list-section').find('.fc-event').filter(':visible').last()).length || event.keyCode == 40 && (next_todo=selected_todo.nextAll('.fc-list-section').find('.fc-event').filter(':visible').first()).length)
				{
					switch(event.keyCode)
					{
						case 38:
							event.preventDefault();
							if($('.fc-list-content').scrollTop()>$('.fc-list-content').scrollTop()+next_todo.offset().top-$('.fc-list-content').offset().top-$('.fc-list-content').height()*globalKBNavigationPaddingRate)
								$('.fc-list-content').scrollTop($('.fc-list-content').scrollTop()+next_todo.offset().top-$('.fc-list-content').offset().top-$('.fc-list-content').height()*globalKBNavigationPaddingRate);
							else if($('.fc-list-content').scrollTop()<$('.fc-list-content').scrollTop()+next_todo.offset().top+next_todo.height()-$('.fc-list-content').offset().top-$('.fc-list-content').height()*(1-globalKBNavigationPaddingRate))	// todo invisible (scrollbar moved)
								$('.fc-list-content').scrollTop($('.fc-list-content').scrollTop()+next_todo.offset().top+next_todo.height()-$('.fc-list-content').offset().top-$('.fc-list-content').height()*(1-globalKBNavigationPaddingRate));
							else
								return false;
							break;
						case 40:
							event.preventDefault();
							if($('.fc-list-content').scrollTop()<$('.fc-list-content').scrollTop()+next_todo.offset().top+next_todo.height()-$('.fc-list-content').offset().top-$('.fc-list-content').height()*(1-globalKBNavigationPaddingRate))	// todo invisible (scrollbar moved)
								$('.fc-list-content').scrollTop($('.fc-list-content').scrollTop()+next_todo.offset().top+next_todo.height()-$('.fc-list-content').offset().top-$('.fc-list-content').height()*(1-globalKBNavigationPaddingRate));
							else if($('.fc-list-content').scrollTop()>$('.fc-list-content').scrollTop()+next_todo.offset().top-$('.fc-list-content').offset().top-$('.fc-list-content').height()*globalKBNavigationPaddingRate)
								$('.fc-list-content').scrollTop($('.fc-list-content').scrollTop()+next_todo.offset().top-$('.fc-list-content').offset().top-$('.fc-list-content').height()*globalKBNavigationPaddingRate);
							else
								return false;
							break;
						default:
							break;
					}
				}
				else	// no previous todo and up pressed || no next todo and down pressed
				{
					switch(event.keyCode)
					{
						case 38:
							$('.fc-list-content').scrollTop(0);
							break;
						case 40:
							$('.fc-list-content').scrollTop($('.fc-list-content').prop('scrollHeight'));
							break;
						default:
							break;
					}
				}
			}
		}
	});
}

function translateAlerts()
{
	$('[data-type="alert"]').text(localization[globalInterfaceLanguage].txtAlert);
	$('.alert').find('[data-type="alert_none"]').text(localization[globalInterfaceLanguage].txtAlertNone);
	$('.alert').find('[data-type="alert_message"]').text(localization[globalInterfaceLanguage].txtAlertMessage);
	$('[data-type="PH_before_after_alert"]').attr('placeholder',localization[globalInterfaceLanguage].pholderAfterBeforeVal);
	$('[data-type="PH_alarm_date"]').attr('placeholder',localization[globalInterfaceLanguage].pholderAlarmDate);
	$('[data-type="PH_alarm_time"]').attr('placeholder',localization[globalInterfaceLanguage].pholderAlarmTime);
	$('.alert_details').find('[data-type="on_date"]').text(localization[globalInterfaceLanguage].txtAlertOnDate);
	$('.alert_details').find('[data-type="weeks_before"]').text(localization[globalInterfaceLanguage].txtAlertWeeksBefore);
	$('.alert_details').find('[data-type="days_before"]').text(localization[globalInterfaceLanguage].txtAlertDaysBefore);
	$('.alert_details').find('[data-type="hours_before"]').text(localization[globalInterfaceLanguage].txtAlertHoursBefore);
	$('.alert_details').find('[data-type="minutes_before"]').text(localization[globalInterfaceLanguage].txtAlertMinutesBefore);
	$('.alert_details').find('[data-type="seconds_before"]').text(localization[globalInterfaceLanguage].txtAlertSecondsBefore);
	$('.alert_details').find('[data-type="weeks_after"]').text(localization[globalInterfaceLanguage].txtAlertWeeksAfter);
	$('.alert_details').find('[data-type="days_after"]').text(localization[globalInterfaceLanguage].txtAlertDaysAfter);
	$('.alert_details').find('[data-type="hours_after"]').text(localization[globalInterfaceLanguage].txtAlertHoursAfter);
	$('.alert_details').find('[data-type="minutes_after"]').text(localization[globalInterfaceLanguage].txtAlertMinutesAfter);
	$('.alert_details').find('[data-type="seconds_after"]').text(localization[globalInterfaceLanguage].txtAlertSecondsAfter);

	$('[data-type="alert_TODO"]').text(localization[globalInterfaceLanguage].txtAlertTODO);
	$('.alertTODO').find('[data-type="alert_none_TODO"]').text(localization[globalInterfaceLanguage].txtAlertNone);
	$('.alertTODO').find('[data-type="alert_message_TODO"]').text(localization[globalInterfaceLanguage].txtAlertMessage);
	$('[data-type="PH_before_after_alert_TODO"]').attr('placeholder',localization[globalInterfaceLanguage].pholderAfterBeforeValTODO);
	$('[data-type="PH_alarm_date_TODO"]').attr('placeholder',localization[globalInterfaceLanguage].pholderAlarmDateTODO);
	$('[data-type="PH_alarm_time_TODO"]').attr('placeholder',localization[globalInterfaceLanguage].pholderAlarmTimeTODO);
	$('.alert_detailsTODO').find('[data-type="on_dateTODO"]').text(localization[globalInterfaceLanguage].txtAlertOnDateTODO);
	$('.alert_detailsTODO').find('[data-type="weeks_beforeTODO"]').text(localization[globalInterfaceLanguage].txtAlertWeeksBeforeTODO);
	$('.alert_detailsTODO').find('[data-type="days_beforeTODO"]').text(localization[globalInterfaceLanguage].txtAlertDaysBeforeTODO);
	$('.alert_detailsTODO').find('[data-type="hours_beforeTODO"]').text(localization[globalInterfaceLanguage].txtAlertHoursBeforeTODO);
	$('.alert_detailsTODO').find('[data-type="minutes_beforeTODO"]').text(localization[globalInterfaceLanguage].txtAlertMinutesBeforeTODO);
	$('.alert_detailsTODO').find('[data-type="seconds_beforeTODO"]').text(localization[globalInterfaceLanguage].txtAlertSecondsBeforeTODO);
	$('.alert_detailsTODO').find('[data-type="weeks_afterTODO"]').text(localization[globalInterfaceLanguage].txtAlertWeeksAfterTODO);
	$('.alert_detailsTODO').find('[data-type="days_afterTODO"]').text(localization[globalInterfaceLanguage].txtAlertDaysAfterTODO);
	$('.alert_detailsTODO').find('[data-type="hours_afterTODO"]').text(localization[globalInterfaceLanguage].txtAlertHoursAfterTODO);
	$('.alert_detailsTODO').find('[data-type="minutes_afterTODO"]').text(localization[globalInterfaceLanguage].txtAlertMinutesAfterTODO);
	$('.alert_detailsTODO').find('[data-type="seconds_afterTODO"]').text(localization[globalInterfaceLanguage].txtAlertSecondsAfterTODO);
}

function translate()
{
// DATEPICKER
	$.datepicker.regional[globalInterfaceLanguage] = {
		monthNames: localization[globalInterfaceLanguage].monthNames,
		monthNamesShort: localization[globalInterfaceLanguage].monthNamesShort,
		dayNames: localization[globalInterfaceLanguage].dayNames,
		dayNamesShort: localization[globalInterfaceLanguage].dayNamesShort,
		dayNamesMin: localization[globalInterfaceLanguage].dayNamesMin};
	$.datepicker.setDefaults($.datepicker.regional[globalInterfaceLanguage]);
// INTERFACE
	//$('[data-type="system_logo"]').attr('alt',localization[globalInterfaceLanguage].altLogo);
	$('[data-type="system_username"]').attr('placeholder',localization[globalInterfaceLanguage].pholderUsername);
	$('[data-type="system_password"]').attr('placeholder',localization[globalInterfaceLanguage].pholderPassword);
	$('[data-type="system_login"]').attr('value',localization[globalInterfaceLanguage].buttonLogin);
	$('[data-type="resourcesCalDAV_txt"]').text(localization[globalInterfaceLanguage].txtResources);
	$('[data-type="choose_calendar_TODO"]').text(localization[globalInterfaceLanguage].txtSelectCalendarTODO);
	$('[data-type="todo_txt"]').text(localization[globalInterfaceLanguage].txtTodo);
	$('#eventFormShower').attr('alt',localization[globalInterfaceLanguage].altAddEvent);
	$('#logoutShower').attr('alt',localization[globalInterfaceLanguage].altLogout);
// TODOS
	$('[data-type="name_TODO"]').attr('placeholder',localization[globalInterfaceLanguage].pholderNameTODO);
	$('[data-type="type_TODO"]').text(localization[globalInterfaceLanguage].txtTypeTODO);
	$('[data-type="todo_type_none"]').text(localization[globalInterfaceLanguage].txtTypeTODONone);
	$('[data-type="todo_type_start"]').text(localization[globalInterfaceLanguage].txtTypeTODOStart);
	$('[data-type="todo_type_due"]').text(localization[globalInterfaceLanguage].txtTypeTODODue);
	$('[data-type="todo_type_both"]').text(localization[globalInterfaceLanguage].txtTypeTODOBoth);
	$('[data-type="date_from_TODO"]').text(localization[globalInterfaceLanguage].txtDateFromTODO);
	$('[data-type="date_to_TODO"]').text(localization[globalInterfaceLanguage].txtDateToTODO);
	$('[data-type="PH_completedOn"]').text(localization[globalInterfaceLanguage].txtCompletedOn);
	$('[data-type="PH_date_from_TODO"]').attr('placeholder',localization[globalInterfaceLanguage].pholderDateFromTODO);
	$('[data-type="PH_time_from_TODO"]').attr('placeholder',localization[globalInterfaceLanguage].pholderTimeFromTODO);
	$('[data-type="PH_date_to_TODO"]').attr('placeholder',localization[globalInterfaceLanguage].pholderDateToTODO);
	$('[data-type="PH_time_to_TODO"]').attr('placeholder',localization[globalInterfaceLanguage].pholderTimeToTODO);
	$('[data-type="PH_completedOnDate"]').attr('placeholder',localization[globalInterfaceLanguage].pholderCompletedOnDate);
	$('[data-type="PH_completedOnTime"]').attr('placeholder',localization[globalInterfaceLanguage].pholderCompletedOnTime);
	$('[data-type="status_TODO"]').text(localization[globalInterfaceLanguage].txtStatus);
	$('[data-type="STATUS_NEEDS-ACTION_TODO"]').text(localization[globalInterfaceLanguage].txtStatusNeedsActionTODO);
	$('[data-type="STATUS_COMPLETED_TODO"]').text(localization[globalInterfaceLanguage].txtStatusCompletedTODO);
	$('[data-type="STATUS_IN-PROCESS_TODO"]').text(localization[globalInterfaceLanguage].txtStatusInProcessTODO);
	$('[data-type="STATUS_CANCELLED_TODO"]').text(localization[globalInterfaceLanguage].txtStatusCancelledTODO);
	$('[data-type="percent_complete_TODO"]').text(localization[globalInterfaceLanguage].txtPercentCompletedTODO);
	$('[data-type="priority_TODO"]').text(localization[globalInterfaceLanguage].txtPriority);
	$('[data-type="priority_TODO_none"]').text(localization[globalInterfaceLanguage].txtPriorityNone);
	$('[data-type="priority_TODO_low"]').text(localization[globalInterfaceLanguage].txtPriorityLow);
	$('[data-type="priority_TODO_medium"]').text(localization[globalInterfaceLanguage].txtPriorityMedium);
	$('[data-type="priority_TODO_high"]').text(localization[globalInterfaceLanguage].txtPriorityHigh);
	$('[data-type="calendar_TODO"]').text(localization[globalInterfaceLanguage].txtCalendarTODO);
	$('[data-type="note_TODO"]').text(localization[globalInterfaceLanguage].txtNoteTODO);
	$('[data-type="PH_note_TODO"]').attr('placeholder',localization[globalInterfaceLanguage].pholderNoteTODO);
	$('[data-type="txt_availTODO"]').text(localization[globalInterfaceLanguage].eventAvailability);
	$('[data-type="BUSY_AVAIL_TODO"]').text(localization[globalInterfaceLanguage].eventAvailabilityBusy);
	$('[data-type="FREE_AVAIL_TODO"]').text(localization[globalInterfaceLanguage].eventAvailabilityFree);
	$('[data-type="txt_typeTODO"]').text(localization[globalInterfaceLanguage].eventType);
	$('[data-type="PUBLIC_TYPE_TODO"]').text(localization[globalInterfaceLanguage].eventTypePublic);
	$('[data-type="PRIVATE_TYPE_TODO"]').text(localization[globalInterfaceLanguage].eventTypePrivate);
	$('[data-type="CONFIDENTIAL_TYPE_TODO"]').text(localization[globalInterfaceLanguage].eventTypeConfidential);
	$('[data-type="txt_url_TODO"]').text(localization[globalInterfaceLanguage].eventURL);
	$('[data-type="url_TODO"]').attr('placeholder',localization[globalInterfaceLanguage].eventURL);
	$('[data-type="todo_prev_nav"]').attr('title',localization[globalInterfaceLanguage].todoPrevNav);
	$('[data-type="todo_next_nav"]').attr('title',localization[globalInterfaceLanguage].todoNextNav);
	$('[data-type="todo_prev_uncompleted_nav"]').attr('title',localization[globalInterfaceLanguage].todoUncompletedPrevNav);
	$('[data-type="todo_next_uncompleted_nav"]').attr('title',localization[globalInterfaceLanguage].todoUncompletedNextNav);
	$("#saveTODO").val(localization[globalInterfaceLanguage].buttonSaveTODO);
	$("#editTODO").val(localization[globalInterfaceLanguage].buttonEditTODO);
	$("#resetTODO").val(localization[globalInterfaceLanguage].buttonResetTODO);
	$("#closeTODO").val(localization[globalInterfaceLanguage].buttonCloseTODO);
	$("#deleteTODO").val(localization[globalInterfaceLanguage].buttonDeleteTODO);
// EVENTS
	$('[data-type="name"]').attr('placeholder',localization[globalInterfaceLanguage].pholderName);
	$('[data-type="location"]').text(localization[globalInterfaceLanguage].txtLocation);
	$('[data-type="PH_location"]').attr('placeholder',localization[globalInterfaceLanguage].pholderLocation);
	$('[data-type="all_day"]').text(localization[globalInterfaceLanguage].txtAllDay);
	$('[data-type="from"]').text(localization[globalInterfaceLanguage].from);
	$('[data-type="to"]').text(localization[globalInterfaceLanguage].to);
	$('[data-type="PH_date_from"]').attr('placeholder',localization[globalInterfaceLanguage].pholderDateFrom);
	$('[data-type="PH_time_from"]').attr('placeholder',localization[globalInterfaceLanguage].pholderTimeFrom);
	$('[data-type="PH_date_to"]').attr('placeholder',localization[globalInterfaceLanguage].pholderDateTo);
	$('[data-type="PH_time_to"]').attr('placeholder',localization[globalInterfaceLanguage].pholderTimeTo);
	$('[data-type="repeat"]').text(localization[globalInterfaceLanguage].txtRepeat);
	$('[data-type="PH_until_date"]').attr('placeholder',localization[globalInterfaceLanguage].pholderUntilDate);
	$('[data-type="PH_repeat_count"]').attr('placeholder',localization[globalInterfaceLanguage].pholderRepeatCount);
	$('[data-type="repeat_end"]').text(localization[globalInterfaceLanguage].txtRepeatEnd);
	$('[data-type="show_as"]').text(localization[globalInterfaceLanguage].txtShowAs);
	$('[data-type="priority"]').text(localization[globalInterfaceLanguage].txtPriority);
	$('[data-type="priority_none"]').text(localization[globalInterfaceLanguage].txtPriorityNone);
	$('[data-type="priority_low"]').text(localization[globalInterfaceLanguage].txtPriorityLow);
	$('[data-type="priority_medium"]').text(localization[globalInterfaceLanguage].txtPriorityMedium);
	$('[data-type="priority_high"]').text(localization[globalInterfaceLanguage].txtPriorityHigh);
	$('[data-type="event_calendar"]').text(localization[globalInterfaceLanguage].txtEventCalendar);
	$('[data-type="choose_calendar"]').text(localization[globalInterfaceLanguage].txtSelectCalendar);
	$('[data-type="note"]').text(localization[globalInterfaceLanguage].txtNote);
	$('[data-type="PH_note"]').attr('placeholder',localization[globalInterfaceLanguage].pholderNote);
	$('[data-type="status"]').text(localization[globalInterfaceLanguage].txtStatus);
	$('[data-type="STATUS_NONE"]').text(localization[globalInterfaceLanguage].txtStatusNone);
	$('[data-type="STATUS_TENTATIVE"]').text(localization[globalInterfaceLanguage].txtStatusTentative);
	$('[data-type="STATUS_CONFIRMED"]').text(localization[globalInterfaceLanguage].txtStatusConfirmed);
	$('[data-type="STATUS_CANCELLED"]').text(localization[globalInterfaceLanguage].txtStatusCancelled);
	$('[data-type="txt_avail"]').text(localization[globalInterfaceLanguage].eventAvailability);
	$('[data-type="BUSY_AVAIL"]').text(localization[globalInterfaceLanguage].eventAvailabilityBusy);
	$('[data-type="FREE_AVAIL"]').text(localization[globalInterfaceLanguage].eventAvailabilityFree);
	$('[data-type="txt_type"]').text(localization[globalInterfaceLanguage].eventType);
	$('[data-type="PUBLIC_TYPE"]').text(localization[globalInterfaceLanguage].eventTypePublic);
	$('[data-type="PRIVATE_TYPE"]').text(localization[globalInterfaceLanguage].eventTypePrivate);
	$('[data-type="CONFIDENTIAL_TYPE"]').text(localization[globalInterfaceLanguage].eventTypeConfidential);
	$('[data-type="txt_url_EVENT"]').text(localization[globalInterfaceLanguage].eventURL);
	$('[data-type="url_EVENT"]').attr('placeholder',localization[globalInterfaceLanguage].eventURL);
	$('[data-type="repeat_no-repeat"]').text(localization[globalInterfaceLanguage].txtNoRepeat);
	$('[data-type="repeat_DAILY"]').text(localization[globalInterfaceLanguage].txtRepeatDay);
	$('[data-type="repeat_WEEKLY"]').text(localization[globalInterfaceLanguage].txtRepeatWeek);
	$('[data-type="repeat_WEEKEND"]').text(localization[globalInterfaceLanguage].txtRepeatWeekend);
	$('[data-type="repeat_MONTHLY"]').text(localization[globalInterfaceLanguage].txtRepeatMonth);
	$('[data-type="repeat_TWO_WEEKLY"]').text(localization[globalInterfaceLanguage].txtRepeatTwoWeek);
	$('[data-type="repeat_YEARLY"]').text(localization[globalInterfaceLanguage].txtRepeatYear);
	$('[data-type="repeat_CUSTOM_WEEKLY"]').text(localization[globalInterfaceLanguage].txtRepeatCustomWeek);
	$('[data-type="repeat_CUSTOM_MONTHLY"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonth);
	$('[data-type="repeat_CUSTOM_YEARLY"]').text(localization[globalInterfaceLanguage].txtRepeatCustomYear);
	$('[data-type="repeat_BUSINESS"]').text(localization[globalInterfaceLanguage].txtRepeatWork);
	$('[data-type="week_custom_txt"]').text(localization[globalInterfaceLanguage].txtRepeatCustomWeekLabel);
	$('[data-type="month_custom2_txt"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthLabel);
	$('[data-type="month_custom_every"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthEvery);
	$('[data-type="month_custom_first"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthFirst);
	$('[data-type="month_custom_second"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthSecond);
	$('[data-type="month_custom_third"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthThird);
	$('[data-type="month_custom_fourth"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthFourth);
	$('[data-type="month_custom_fifth"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthFifth);
	$('[data-type="month_custom_last"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthLast);
	$('[data-type="month_custom_custom"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthCustom);
	$('[data-type="month_custom_month"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthMonth);

	$('[data-type="year_custom1"]').text(localization[globalInterfaceLanguage].txtRepeatCustomYearLabel1);
	$('[data-type="year_custom3"]').text(localization[globalInterfaceLanguage].txtRepeatCustomYearLabel2);
	$('[data-type="year_custom_every"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthEvery);
	$('[data-type="year_custom_first"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthFirst);
	$('[data-type="year_custom_second"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthSecond);
	$('[data-type="year_custom_third"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthThird);
	$('[data-type="year_custom_fourth"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthFourth);
	$('[data-type="year_custom_fifth"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthFifth);
	$('[data-type="year_custom_last"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthLast);
	$('[data-type="year_custom_custom"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthCustom);
	$('[data-type="year_custom_month"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthMonth);

	for(i=0; i<12; i++)
	{
		$('#year_custom3 .customTable td[data-type="'+i+'"]').text(localization[globalInterfaceLanguage].monthNamesShort[i]);
		$('#year_custom3_TODO .customTable td[data-type="'+i+'"]').text(localization[globalInterfaceLanguage].monthNamesShort[i]);
	}

	for(i=0; i<7; i++)
	{
		$('#repeat_month_custom_select2 option[data-type="'+i+'"]').text(localization[globalInterfaceLanguage].dayNames[i]);
		$('#repeat_month_custom_select2_TODO option[data-type="'+i+'"]').text(localization[globalInterfaceLanguage].dayNames[i]);
		$('#repeat_year_custom_select2 option[data-type="'+i+'"]').text(localization[globalInterfaceLanguage].dayNames[i]);
		$('#repeat_year_custom_select2_TODO option[data-type="'+i+'"]').text(localization[globalInterfaceLanguage].dayNames[i]);
	}

	for(i=0; i<7; i++)
	{
		$('#week_custom .customTable td[data-type="'+i+'"]').text(localization[globalInterfaceLanguage].dayNamesMin[i]);
		$('#week_custom_TODO .customTable td[data-type="'+i+'"]').text(localization[globalInterfaceLanguage].dayNamesMin[i]);
	}

	$('[data-type="repeat_details_on_date"]').text(localization[globalInterfaceLanguage].txtRepeatOnDate);
	$('[data-type="repeat_details_after"]').text(localization[globalInterfaceLanguage].txtRepeatAfter);
	$('[data-type="repeat_details_never"]').text(localization[globalInterfaceLanguage].txtRepeatNever);
	$('[data-type="event_prev_nav"]').attr('title',localization[globalInterfaceLanguage].eventPrevNav);
	$('[data-type="event_next_nav"]').attr('title',localization[globalInterfaceLanguage].eventNextNav);
	$("#saveButton").val(localization[globalInterfaceLanguage].buttonSave);
	$("#editButton").val(localization[globalInterfaceLanguage].buttonEdit);
	$("#resetButton").val(localization[globalInterfaceLanguage].buttonReset);
	$("#closeButton").val(localization[globalInterfaceLanguage].buttonClose);
	$("#deleteButton").val(localization[globalInterfaceLanguage].buttonDelete);
	$('#alertsH').text(localization[globalInterfaceLanguage].txtAlertsH);
	$("#alertButton").val(localization[globalInterfaceLanguage].buttonAlert);
	$('[data-type="PH_CalDAVsearch"]').attr('placeholder',localization[globalInterfaceLanguage].CalDAVsearch);

	$('[data-type="addAll"]').attr('title',localization[globalInterfaceLanguage].allEnable);
	$('[data-type="addAll"]').attr('alt',localization[globalInterfaceLanguage].allEnable);
	$('[data-type="removeAll"]').attr('title',localization[globalInterfaceLanguage].allDisable);
	$('[data-type="removeAll"]').attr('alt',localization[globalInterfaceLanguage].allDisable);
	$('[data-type="txt_timezone"]').text(localization[globalInterfaceLanguage].timezone);
	$('[data-type="txt_timezonePicker"]').text(localization[globalInterfaceLanguage].txtTimezonePicker);
	$('[data-type="txt_timezoneTODO"]').text(localization[globalInterfaceLanguage].timezone);
	$('#CalendarLoader').find('.loaderInfo').text(localization[globalInterfaceLanguage].calendarLoader);
	$('#ResizeLoader').find('.loaderInfo').text(localization[globalInterfaceLanguage].resizeLoader);
	$('#CalendarLoaderTODO').find('.loaderInfo').text(localization[globalInterfaceLanguage].calendarLoader);
	$('[data-type="repeat_event"]').text(localization[globalInterfaceLanguage].repeatBoxButton);
	$('[data-type="editOptions"]').attr('value',localization[globalInterfaceLanguage].repeatBoxButton);
	$('[data-type="editOptionsTODO"]').attr('value',localization[globalInterfaceLanguage].repeatBoxButton);
	$('#editAll').val(localization[globalInterfaceLanguage].allEvsButton);
	$('#editFuture').val(localization[globalInterfaceLanguage].allFutureButton);
	$('#editOnlyOne').val(localization[globalInterfaceLanguage].eventOnlyButton);
	$('#editAllTODO').val(localization[globalInterfaceLanguage].allEvsButtonTODO);
	$('#editFutureTODO').val(localization[globalInterfaceLanguage].allFutureButtonTODO);
	$('#editOnlyOneTODO').val(localization[globalInterfaceLanguage].eventOnlyButtonTODO);
	$('[data-type="closeRepeat"]').val(localization[globalInterfaceLanguage].buttonClose);
	$('[data-type="repeat_type"]').text(localization[globalInterfaceLanguage].repeatInterval);

	translateAlerts();
}

function selectActiveCalendar()
{
	var todoString = "";
	$('#ResourceCalDAVList').find('.resourceCalDAV_item_selected').removeClass('resourceCalDAV_item_selected');
	for(var i=0; i<globalResourceCalDAVList.collections.length;i++)
		if(globalResourceCalDAVList.collections[i].uid!=undefined)
		{
			var inputResource = globalResourceCalDAVList.collections[i];
			var par=inputResource.uid.split('/');
			// set todo calendar as selected
			if(globalSettings.calendarselected!='')
			{
				if((par[par.length-3]+'/'+par[par.length-2]+'/')==globalSettings.calendarselected)
				{
					if($('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item_selected:visible').length == 0)
						$('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item:visible[data-id^="'+inputResource.uid+'"]').addClass('resourceCalDAV_item_selected');
				}
				else if(inputResource.uid==globalSettings.calendarselected)
				{
					if($('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item_selected:visible').length == 0)
						$('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item:visible[data-id^="'+inputResource.uid+'"]').addClass('resourceCalDAV_item_selected');
				}
				else if (typeof globalSettings.calendarselected=='object' && inputResource.uid.match(globalSettings.calendarselected)!=null)
				{
					if($('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item_selected:visible').length == 0)
						$('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item:visible[data-id^="'+inputResource.uid+'"]').addClass('resourceCalDAV_item_selected');
				}
			}
		}

	if($('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item_selected:visible').length == 0)
		for(var i=0; i<globalResourceCalDAVList.collections.length;i++)
			if(globalResourceCalDAVList.collections[i].uid!=undefined)
			{
				var inputResource = globalResourceCalDAVList.collections[i];
				var par=inputResource.uid.split('/');
				if(typeof globalCalendarSelected!='undefined' && globalCalendarSelected!=null && globalCalendarSelected!='')
				{
					globalSettings.calendarselected=globalCalendarSelected;
					if((par[par.length-3]+'/'+par[par.length-2]+'/')==globalSettings.calendarselected)
					{
						if($('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item_selected:visible').length == 0)
							$('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item:visible[data-id^="'+inputResource.uid+'"]').addClass('resourceCalDAV_item_selected');
					}
					else if(inputResource.uid==globalSettings.calendarselected)
					{
						if($('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item_selected:visible').length == 0)
							$('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item:visible[data-id^="'+inputResource.uid+'"]').addClass('resourceCalDAV_item_selected');
					}
					else if (typeof globalSettings.calendarselected=='object' && inputResource.uid.match(globalSettings.calendarselected)!=null)
					{
						if($('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item_selected:visible').length == 0)
							$('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item:visible[data-id^="'+inputResource.uid+'"]').addClass('resourceCalDAV_item_selected');
					}
				}
			}

	if($('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item_selected:visible').length == 0  && $('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item[data-id]:visible').length > 0)
	{
		var ui_d = $('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item[data-id]:visible').eq(0).attr('data-id');
		var part_u = ui_d.split('/');
		globalSettings.calendarselected=part_u[part_u.length-3]+'/'+part_u[part_u.length-2]+'/';
		$('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item[data-id]:visible').eq(0).addClass('resourceCalDAV_item_selected');
	}

	todoString = "TODO";
	$('#ResourceCalDAVTODOList').find('.resourceCalDAVTODO_item_selected').removeClass('resourceCalDAV_item_selected');
	for(var i=0; i<globalResourceCalDAVList.TodoCollections.length;i++)
		if(globalResourceCalDAVList.TodoCollections[i].uid!=undefined)
		{
			var inputResource = globalResourceCalDAVList.TodoCollections[i];
			var par=inputResource.uid.split('/');
			// set todo calendar as selected
			if(globalSettings.todocalendarselected!='')
			{

				if((par[par.length-3]+'/'+par[par.length-2]+'/')==globalSettings.todocalendarselected)
				{
					if($('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item_selected:visible').length == 0)
						$('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAVTODO_item:visible[data-id^="'+inputResource.uid+'"]').addClass('resourceCalDAV_item_selected');
				}
				else if(inputResource.uid==globalSettings.todocalendarselected)
				{
					if($('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item_selected:visible').length == 0)
						$('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAVTODO_item:visible[data-id^="'+inputResource.uid+'"]').addClass('resourceCalDAV_item_selected');
				}
				else if (typeof globalSettings.todocalendarselected=='object' && inputResource.uid.match(globalSettings.todocalendarselected)!=null)
				{
					if($('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item_selected:visible').length == 0)
						$('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAVTODO_item:visible[data-id^="'+inputResource.uid+'"]').addClass('resourceCalDAV_item_selected');
				}
			}
		}

	if($('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item_selected:visible').length == 0)
		for(var i=0; i<globalResourceCalDAVList.TodoCollections.length;i++)
			if(globalResourceCalDAVList.TodoCollections[i].uid!=undefined)
			{
				var inputResource = globalResourceCalDAVList.TodoCollections[i];
				var par=inputResource.uid.split('/');
				if(typeof globalTodoCalendarSelected!='undefined' && globalTodoCalendarSelected!=null && globalTodoCalendarSelected!='')
				{
					globalSettings.todocalendarselected=globalTodoCalendarSelected;
					if((par[par.length-3]+'/'+par[par.length-2]+'/')==globalSettings.todocalendarselected)
					{
						if($('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item_selected:visible').length == 0)
							$('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAVTODO_item:visible[data-id^="'+inputResource.uid+'"]').addClass('resourceCalDAV_item_selected');
					}
					else if(inputResource.uid==globalSettings.todocalendarselected)
					{
						if($('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item_selected:visible').length == 0)
							$('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAVTODO_item:visible[data-id^="'+inputResource.uid+'"]').addClass('resourceCalDAV_item_selected');
					}
					else if (typeof globalSettings.todocalendarselected=='object' && inputResource.uid.match(globalSettings.todocalendarselected)!=null)
					{
						if($('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item_selected:visible').length == 0)
							$('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAVTODO_item:visible[data-id^="'+inputResource.uid+'"]').addClass('resourceCalDAV_item_selected');
					}
				}
			}

	if($('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item_selected:visible').length == 0 && $('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAVTODO_item[data-id]:visible').length > 0)
	{
		var ui_d = $('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAVTODO_item[data-id]:visible').eq(0).attr('data-id');
		var part_u = ui_d.split('/');
		globalSettings.todocalendarselected=part_u[part_u.length-3]+'/'+part_u[part_u.length-2]+'/';
		$('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAVTODO_item[data-id]:visible').eq(0).addClass('resourceCalDAV_item_selected');
	}
}

function hideCalendarEvents(uid)
{
	$('#SystemCalDavZAP').find('.event_item[data-res-id="'+uid+'"]').each(function(){
		$(this).addClass('checkCalDAV_hide');
		if(this.tagName.toLowerCase()=='tr')
		{
			if($(this).siblings().addBack().not('.checkCalDAV_hide').length>0)
				$(this).parent().prev().find('tr').removeClass('checkCalDAV_hide');
			else
				$(this).parent().prev().find('tr').addClass('checkCalDAV_hide');
		}
	});
}

function hideCalendarTodos(uid)
{
	$('#SystemCalDavTODO').find('.event_item[data-res-id="'+uid+'"]').addClass('checkCalDAV_hide');
}

function showCalendarEvents(uid)
{
	$('#SystemCalDavZAP').find('.event_item[data-res-id="'+uid+'"]').each(function(){
		$(this).removeClass('checkCalDAV_hide');
		if(this.tagName.toLowerCase() == 'tr')
			$(this).parent().prev().find('tr').removeClass('checkCalDAV_hide');
	});
}

function showCalendarTodos(uid)
{
	$('#SystemCalDavTODO').find('.event_item[data-res-id="'+uid+'"]').removeClass('checkCalDAV_hide');
}

function hideEventCalendars()
{
	for(var k=1;k<globalResourceCalDAVList.collections.length;k++)
	{
		var uid=globalResourceCalDAVList.collections[k].uid;
		if(uid!=undefined && globalVisibleCalDAVCollections.indexOf(uid)==-1)
			hideCalendarEvents(uid);
	}
}

function hideTodoCalendars()
{
	for(var k=1;k<globalResourceCalDAVList.TodoCollections.length;k++)
	{
		var uid=globalResourceCalDAVList.TodoCollections[k].uid;
		if(uid!=undefined && globalVisibleCalDAVTODOCollections.indexOf(uid)==-1)
			hideCalendarTodos(uid);
	}
}

function rerenderCalendar(scrollChanged)
{
	if(scrollChanged)
		$('#calendar').fullCalendar('render');
	globalCalDAVQs.cache();
	if(globalSettings.displayhiddenevents)
		hideEventCalendars();
}

function rerenderTodo(scrollChanged)
{
	if(scrollChanged)
		$('#todoList').fullCalendar('render');
	globalCalDAVTODOQs.cache();
	if(globalSettings.displayhiddenevents)
		hideTodoCalendars();
}

function refetchCalendarEvents()
{
	var beforeScroll = $('#main').width()-$('#calendar').width();
	$('#calendar').fullCalendar('refetchEvents');
	var afterScroll = $('#main').width()-$('#calendar').width();
	rerenderCalendar(beforeScroll!=afterScroll);
}

function refetchTodoEvents()
{
	var beforeScroll = $('#mainTODO').width()-$('#todoList').width();
	$('#todoList').fullCalendar('refetchEvents');
	var afterScroll = $('#mainTODO').width()-$('#todoList').width();
	rerenderTodo(beforeScroll!=afterScroll);
}

function initCalDavDatepicker(element)
{
	var datepickers = element.find('.date');
	datepickers.focus(function(){
		if(!$(this).hasClass('hasDatepicker'))
		{
			$(this).datepicker({
				disabled: $(this).prop('readonly') || $(this).prop('disabled'),
				showMonthAfterYear: false,
				prevText: '',
				nextText: '',
				monthNamesShort: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
				dateFormat: globalSettings.datepickerformat, defaultDate: null, minDate: '-120y', maxDate: '+120y', yearRange: 'c-120:c+120', showAnim: '',
				firstDay: globalSettings.datepickerfirstdayofweek,
				weekendDays: globalSettings.weekenddays,
				beforeShow: function(input, inst)	// set the datepicker value if the date is out of range (min/max)
				{
					inst.dpDiv.addClass('ui-datepicker-simple');

					var valid=true;
					try {var currentDate=$.datepicker.parseDate(globalSettings.datepickerformat, $(this).val())}
					catch (e){valid=false}
					if(valid==true && currentDate!=null)
					{
						var minDateText=$(this).datepicker('option', 'dateFormat', globalSettings.datepickerformat).datepicker('option', 'minDate');
						var maxDateText=$(this).datepicker('option', 'dateFormat', globalSettings.datepickerformat).datepicker('option', 'maxDate');

						var minDate=$.datepicker.parseDate(globalSettings.datepickerformat, minDateText);
						var maxDate=$.datepicker.parseDate(globalSettings.datepickerformat, maxDateText);

						if(currentDate<minDate)
							$(this).val(minDateText);
						else if(currentDate>maxDate)
							$(this).val(maxDateText);
					}

					// Timepicker hack (prevent IE to re-open the datepicker on date click+focus)
					var index=$(this).attr("data-type");
					var d=new Date();
					if(globalTmpTimePickerHackTime[index]!=undefined && d.getTime()-globalTmpTimePickerHackTime[index]<200)
						return false;
				},
				onClose: function(dateText, inst)	// set the datepicker value if the date is out of range (min/max) and reset the value to proper format (for example 'yy-mm-dd' allows '2000-1-1' -> we need to reset the value to '2000-01-01')
				{
					var valid=true;
					try {var currentDate=$.datepicker.parseDate(globalSettings.datepickerformat, dateText)}
					catch (e){valid=false}

					if(valid==true && currentDate!=null)
					{
						var minDateText=$(this).datepicker('option', 'dateFormat', globalSettings.datepickerformat).datepicker('option', 'minDate');
						var maxDateText=$(this).datepicker('option', 'dateFormat', globalSettings.datepickerformat).datepicker('option', 'maxDate');

						var minDate=$.datepicker.parseDate(globalSettings.datepickerformat, minDateText);
						var maxDate=$.datepicker.parseDate(globalSettings.datepickerformat, maxDateText);

						if(currentDate<minDate)
							$(this).val(minDateText);
						else if(currentDate>maxDate)
							$(this).val(maxDateText);
						else
							$(this).val($.datepicker.formatDate(globalSettings.datepickerformat, currentDate));
					}

					// Timepicker hack (prevent IE to re-open the datepicker on date click+focus)
					var index=$(this).attr("data-type");
					var d=new Date();
					globalTmpTimePickerHackTime[index]=d.getTime();
					$(this).focus();
				}
			});

			$(this).mousedown(function(){
				if($(this).datepicker('widget').css('display')=='none')
					$(this).datepicker('show');
				else
					$(this).datepicker('hide');
			});

			$(this).on('keydown', function(event){
				// show datepicker on keydown (up/down/left/right) but only if it not causes cursor position move
				if(this.selectionStart!=undefined && this.selectionStart!=-1)
					if(((event.which==38 || event.which==37) && this.selectionStart==0) || ((event.which==40 || event.which==39) && this.selectionStart==$(this).val().length))
					{
						if($(this).datepicker('widget').css('display')=='none')
							$(this).datepicker('show');
						else
							$(this).datepicker('hide');
					}
			});

			$(this).blur(function(event){
				// handle onblur event because datepicker can be already closed
				// note: because onblur is called more than once we can handle it only if there is a value change!
				var valid=true;
				try {var currentDate=$.datepicker.parseDate(globalSettings.datepickerformat, $(this).val())}
				catch (e) {valid=false}
				if($(this).val()=='')
					valid=false;
				
				if(valid==true && $(this).val()!=$.datepicker.formatDate(globalSettings.datepickerformat, currentDate))
				{
					var minDateText=$(this).datepicker('option', 'dateFormat', globalSettings.datepickerformat).datepicker('option', 'minDate');
					var maxDateText=$(this).datepicker('option', 'dateFormat', globalSettings.datepickerformat).datepicker('option', 'maxDate');
					
					var minDate=$.datepicker.parseDate(globalSettings.datepickerformat, minDateText);
					var maxDate=$.datepicker.parseDate(globalSettings.datepickerformat, maxDateText);
					
					if(currentDate<minDate)
						$(this).val(minDateText);
					else if(currentDate>maxDate)
						$(this).val(maxDateText);
					else
						$(this).val($.datepicker.formatDate(globalSettings.datepickerformat, currentDate));
				}

				if($(this).attr('id')=='date_from')
				{
					var tmptime = $('#time_from').val();
					var validD=true, prevDate = '';
					if(globalPrevDate!='')
						prevDate = new Date(globalPrevDate.getTime());
					try {$.datepicker.parseDate(globalSettings.datepickerformat, $('#date_from').val())}
					catch (e){validD=false}

					if($('#date_from').val()!='' && tmptime.match(globalTimePre)!=null && validD)
					{
						var dateFrom=$.datepicker.parseDate(globalSettings.datepickerformat, $('#date_from').val());
						var datetime_to=$.fullCalendar.formatDate(dateFrom, 'yyyy-MM-dd');
						var aDate=new Date(Date.parse("01/02/1990, "+$('#time_from').val()));
						var time_from=$.fullCalendar.formatDate(aDate, 'HH:mm:ss');
						
						var checkD=$.fullCalendar.parseDate(datetime_to+'T'+time_from);
						globalPrevDate = new Date(checkD.getTime());
					}
					else
						globalPrevDate='';
					if($(this).attr('id')=='date_from' && prevDate!='' && globalPrevDate!='')
					{
						globalPrevDate.setSeconds(0);
						globalPrevDate.setMilliseconds(0);
						prevDate.setSeconds(0);
						prevDate.setMilliseconds(0);
						var diffDate  = globalPrevDate.getTime() - prevDate.getTime();
						
						try {$.datepicker.parseDate(globalSettings.datepickerformat, $('#date_to').val())}
						catch (e){validD=false}
						if($('#date_to').val()!='' && $('#time_to').val().match(globalTimePre)!=null && validD)
						{
							var dateTo=$.datepicker.parseDate(globalSettings.datepickerformat, $('#date_to').val());
							var datetime_to=$.fullCalendar.formatDate(dateTo, 'yyyy-MM-dd');
							var aDateT=new Date(Date.parse("01/02/1990, "+$('#time_to').val()));
							var time_to=$.fullCalendar.formatDate(aDateT, 'HH:mm:ss');
							var checkDT=$.fullCalendar.parseDate(datetime_to+'T'+time_to);
							var toDate = new Date(checkDT.getTime() + diffDate);
							var formattedDate_to=$.datepicker.formatDate(globalSettings.datepickerformat, toDate);
							$('#date_to').val(formattedDate_to);
							$('#time_to').val($.fullCalendar.formatDate(toDate, (globalSettings.ampmformat ? 'hh:mm TT' : 'HH:mm')));
						}
					}
				}
				else if($('#todo_type').val()=='both' && $(this).attr('id')=='date_fromTODO')
				{
					var tmptime = $('#time_fromTODO').val();
					var validD=true, prevDate = '';
					if(globalPrevDate!='')
						prevDate = new Date(globalPrevDate.getTime());
					try {$.datepicker.parseDate(globalSettings.datepickerformat, $('#date_fromTODO').val())}
					catch (e){validD=false}
					if($('#date_fromTODO').val()!='' && tmptime.match(globalTimePre)!=null && validD)
					{
						var dateFrom=$.datepicker.parseDate(globalSettings.datepickerformat, $('#date_fromTODO').val());
						var datetime_to=$.fullCalendar.formatDate(dateFrom, 'yyyy-MM-dd');
						var aDate=new Date(Date.parse("01/02/1990, "+$('#time_fromTODO').val()));
						var time_from=$.fullCalendar.formatDate(aDate, 'HH:mm:ss');
						
						var checkD=$.fullCalendar.parseDate(datetime_to+'T'+time_from);
						globalPrevDate = new Date(checkD.getTime());
					}
					else
						globalPrevDate='';
					
					if($(this).attr('id')=='date_fromTODO' && prevDate!='' && globalPrevDate!='')
					{
						globalPrevDate.setSeconds(0);
						globalPrevDate.setMilliseconds(0);
						prevDate.setSeconds(0);
						prevDate.setMilliseconds(0);
						var diffDate  = globalPrevDate.getTime() - prevDate.getTime();
						
						try {$.datepicker.parseDate(globalSettings.datepickerformat, $('#date_toTODO').val())}
						catch (e){validD=false}
						if($('#date_toTODO').val()!='' && $('#time_toTODO').val().match(globalTimePre)!=null && validD)
						{
							var dateTo=$.datepicker.parseDate(globalSettings.datepickerformat, $('#date_toTODO').val());
							var datetime_to=$.fullCalendar.formatDate(dateTo, 'yyyy-MM-dd');
							var aDateT=new Date(Date.parse("01/02/1990, "+$('#time_toTODO').val()));
							var time_to=$.fullCalendar.formatDate(aDateT, 'HH:mm:ss');
							var checkDT=$.fullCalendar.parseDate(datetime_to+'T'+time_to);
							var toDate = new Date(checkDT.getTime() + diffDate);
							var formattedDate_to=$.datepicker.formatDate(globalSettings.datepickerformat, toDate);
							$('#date_toTODO').val(formattedDate_to);
							$('#time_toTODO').val($.fullCalendar.formatDate(toDate, (globalSettings.ampmformat ? 'hh:mm TT' : 'HH:mm')));
						}
					}
				}
			});

			$(this).bind('keyup change', function(){
				if(!$(this).prop('readonly') && !$(this).prop('disabled'))
				{
					var valid=false;
					
					if($(this).val()!='')
					{
						valid=true;
						try {$.datepicker.parseDate(globalSettings.datepickerformat, $(this).val())}
						catch (e){valid=false}
					}

					if($(this).attr('id')=='completedOnDate')
					{
						if($(this).val()=='')
						{
							if($('#completedOnTime').val()=='')
							{
								valid=true;
								$('#completedOnTime').parent().find('img').css('display', 'none');
							}
							else
								valid=false;
						}
						else
						{
							if(valid)
							{
								if($('#completedOnTime').val()=='')
									$('#completedOnTime').parent().find('img').css('display', 'inline');
								else
									$('#completedOnTime').parent().find('img').css('display', 'none');
							}
						}
					}

					if(valid)
					{
						$(this).parent().find('img').css('display','none');
						if($(this).attr('id')=='date_from' && $('#repeat_end_date').is(':visible'))
							$('#repeat_end_date').keyup();
						if(($(this).attr('id')=='date_fromTODO' || $(this).attr('id')=='date_toTODO') && $('#repeat_end_date_TODO').is(':visible'))
							$('#repeat_end_date_TODO').keyup();
					}
					else
						$(this).parent().find('img').css('display','inline');
					
					if($(this).attr('id')=='repeat_end_date')
					{
						if(valid && $('#date_from').val()!='')
						{
							$(this).parent().find('img').css('display','inline');
							var today=$.datepicker.parseDate(globalSettings.datepickerformat, $('#date_from').val());
							if(today!=null)
							{
								var repeatEnd = $.datepicker.parseDate(globalSettings.datepickerformat, $(this).val());
								if(repeatEnd!=null)
									if(repeatEnd>=today)
										$(this).parent().find('img').css('display','none');
								
							}
						}
					}
					else if(valid && $(this).attr('id')=='repeat_end_date_TODO')
					{
						if($('#date_fromTODO').is(':visible') && $('#date_fromTODO').val()!='')
						{
							$(this).parent().find('img').css('display','inline');
							var today=$.datepicker.parseDate(globalSettings.datepickerformat, $('#date_fromTODO').val());
							if(today!=null)
							{
								var repeatEnd = $.datepicker.parseDate(globalSettings.datepickerformat, $(this).val());
								if(repeatEnd!=null)
									if(repeatEnd>=today)
										$(this).parent().find('img').css('display','none');
								
							}
						}
						else if($('#date_toTODO').is(':visible') && $('#date_toTODO').val()!='')
						{
							$(this).parent().find('img').css('display','inline');
							var today=$.datepicker.parseDate(globalSettings.datepickerformat, $('#date_toTODO').val());
							if(today!=null)
							{
								var repeatEnd = $.datepicker.parseDate(globalSettings.datepickerformat, $(this).val());
								if(repeatEnd!=null)
									if(repeatEnd>=today)
										$(this).parent().find('img').css('display','none');
								
							}
						}
					}
				}
			});

			// show the datepicker after the initialization
			$(this).datepicker('show');
		}
	});
}

function initCalDavTimepicker(element)
{
	var timepickers = element.find('.time');

	timepickers.focus(function(){
		$(this).autocomplete({
			create: function( event, ui ){
				$(this).data("ui-autocomplete").menu.element.addClass('ui-autocomplete-caldav');
			},
			close: function( event, ui ){
				$(this).keyup();
			},
			source: function(request, response){
				var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(request.term), 'i');
				response($.grep(timelist, function(value){
					value = value.label || value.value || value;
					return matcher.test(value) || matcher.test(value.multiReplace(globalSearchTransformAlphabet));
				}));
			},
			minLength: 0
		});
	});

	timepickers.blur(function(){
		var tmptime=$.trim($(this).val());
		if(tmptime.match(globalTimePre)!=null)
		{
			if(tmptime.indexOf(':')==-1)
			{
				if(globalSettings.ampmformat)
				{
					if(tmptime.indexOf(' ')==-1)
						tmptime=tmptime.substring(0,2)+':'+tmptime.substring(2,4)+' '+tmptime.substring(4,6);
					else tmptime=tmptime.substring(0,2)+':'+tmptime.substring(2,4)+' '+tmptime.substring(5,7);
				}
				else tmptime=tmptime.substring(0,2)+':'+tmptime.substring(2,4);
			}
			else
			{
				if(globalSettings.ampmformat)
				{
					var partA=tmptime.split(':')[0];
					partA=parseInt(partA,10);
					var partB=tmptime.split(':')[1].substring(0,tmptime.split(':')[1].length-2);
					partB=parseInt(partB,10);
					tmptime=(partA < 10 ? '0' : '')+partA+':'+(partB < 10 ? '0' : '')+partB+' '+tmptime.split(':')[1].substring(tmptime.split(':')[1].length-2, tmptime.split(':')[1].length);
				}
				else
				{
					var partA=tmptime.split(':')[0];
					partA=parseInt(partA,10);
					var partB=tmptime.split(':')[1];
					partB=parseInt(partB,10);
					tmptime=(partA<10 ? '0' : '')+partA+':'+(partB<10 ? '0' : '')+partB;
				}
			}
			if(tmptime.length==7)
				tmptime=tmptime.substring(0,5)+' '+tmptime.substring(5,7);
			else if(tmptime.length==6 && tmptime.indexOf(':')!=-1)
				tmptime=tmptime.substring(0,2)+':'+tmptime.substring(2,4)+' '+tmptime.substring(4,6);

			$(this).val(tmptime.toUpperCase());
		}

		if($(this).attr('id')=='time_from')
		{
			var validD=true, prevDate = '';
			if(globalPrevDate!='')
				prevDate = new Date(globalPrevDate.getTime());
				
			try {$.datepicker.parseDate(globalSettings.datepickerformat, $('#date_from').val())}
			catch (e){validD=false}
			if(tmptime.match(globalTimePre)!=null && validD)
			{
				var dateFrom=$.datepicker.parseDate(globalSettings.datepickerformat, $('#date_from').val());
				var datetime_to=$.fullCalendar.formatDate(dateFrom, 'yyyy-MM-dd');
				var aDate=new Date(Date.parse("01/02/1990, "+$('#time_from').val()));
				var time_from=$.fullCalendar.formatDate(aDate, 'HH:mm:ss');
				
				var checkD=$.fullCalendar.parseDate(datetime_to+'T'+time_from);
				globalPrevDate = new Date(checkD.getTime());
			}
			else
				globalPrevDate='';
			if($(this).attr('id')=='time_from' && prevDate!='' && globalPrevDate!='')
			{
				globalPrevDate.setSeconds(0);
				globalPrevDate.setMilliseconds(0);
				prevDate.setSeconds(0);
				prevDate.setMilliseconds(0);
				var diffDate  = globalPrevDate.getTime() - prevDate.getTime();
				
				try {$.datepicker.parseDate(globalSettings.datepickerformat, $('#date_to').val())}
				catch (e){validD=false}
				if($('#date_to').val()!='' && $('#time_to').val().match(globalTimePre)!=null && validD)
				{
					var dateTo=$.datepicker.parseDate(globalSettings.datepickerformat, $('#date_to').val());
					var datetime_to=$.fullCalendar.formatDate(dateTo, 'yyyy-MM-dd');
					var aDateT=new Date(Date.parse("01/02/1990, "+$('#time_to').val()));
					var time_to=$.fullCalendar.formatDate(aDateT, 'HH:mm:ss');
					var checkDT=$.fullCalendar.parseDate(datetime_to+'T'+time_to);
					var toDate = new Date(checkDT.getTime() + diffDate);
					var formattedDate_to=$.datepicker.formatDate(globalSettings.datepickerformat, toDate);
					$('#date_to').val(formattedDate_to);
					$('#time_to').val($.fullCalendar.formatDate(toDate, (globalSettings.ampmformat ? 'hh:mm TT' : 'HH:mm')));
				}
			}
		}
		else if($('#todo_type').val()=='both' && $(this).attr('id')=='time_fromTODO')
		{
			var validD=true, prevDate = '';
			if(globalPrevDate!='')
				prevDate = new Date(globalPrevDate.getTime());
			try {$.datepicker.parseDate(globalSettings.datepickerformat, $('#date_fromTODO').val())}
			catch (e){validD=false}
			if(tmptime.match(globalTimePre)!=null && validD)
			{
				var dateFrom=$.datepicker.parseDate(globalSettings.datepickerformat, $('#date_fromTODO').val());
				var datetime_to=$.fullCalendar.formatDate(dateFrom, 'yyyy-MM-dd');
				var aDate=new Date(Date.parse("01/02/1990, "+$('#time_fromTODO').val()));
				var time_from=$.fullCalendar.formatDate(aDate, 'HH:mm:ss');
				
				var checkD=$.fullCalendar.parseDate(datetime_to+'T'+time_from);
				globalPrevDate = new Date(checkD.getTime());
			}
			else
				globalPrevDate='';
			
			if($(this).attr('id')=='time_fromTODO' && prevDate!='' && globalPrevDate!='')
			{
				globalPrevDate.setSeconds(0);
				globalPrevDate.setMilliseconds(0);
				prevDate.setSeconds(0);
				prevDate.setMilliseconds(0);
				var diffDate  = globalPrevDate.getTime() - prevDate.getTime();
				try {$.datepicker.parseDate(globalSettings.datepickerformat, $('#date_toTODO').val())}
				catch (e){validD=false}
				if($('#date_toTODO').val()!='' && $('#time_toTODO').val().match(globalTimePre)!=null && validD)
				{
					var dateTo=$.datepicker.parseDate(globalSettings.datepickerformat, $('#date_toTODO').val());
					var datetime_to=$.fullCalendar.formatDate(dateTo, 'yyyy-MM-dd');
					var aDateT=new Date(Date.parse("01/02/1990, "+$('#time_toTODO').val()));
					var time_to=$.fullCalendar.formatDate(aDateT, 'HH:mm:ss');
					var checkDT=$.fullCalendar.parseDate(datetime_to+'T'+time_to);
					var toDate = new Date(checkDT.getTime() + diffDate);
					var formattedDate_to=$.datepicker.formatDate(globalSettings.datepickerformat, toDate);
					$('#date_toTODO').val(formattedDate_to);
					$('#time_toTODO').val($.fullCalendar.formatDate(toDate, (globalSettings.ampmformat ? 'hh:mm TT' : 'HH:mm')));
				}
			}
		}
	});

	timepickers.bind('keyup change', function(){
		var tmptime=$.trim($(this).val());
		/*if(tmptime.match(globalTimePre)!=null)
		{
			var formattedTime=tmptime.toLowerCase().replace(RegExp(' ','g'),'');	// lower case string without spaces
			if(formattedTime.indexOf(':')==-1)
				var result_time=(parseInt(formattedTime.substr(0,2),10)+(formattedTime.substr(-2)=='pm' ? 12 : 0)).pad(2)+formattedTime.substr(2,2);
			else
				var result_time=(parseInt(formattedTime.split(':')[0],10)+(formattedTime.substr(-2)=='pm' ? 12 : 0)).pad(2)+parseInt(formattedTime.split(':')[1],10).pad(2);
			$(this).parent().find('img').css('display', 'none');
			//console.log('original time from user: "'+tmptime+'", result_time [24 format]: "'+result_time+'"');
		}
		else $(this).parent().find('img').css('display', 'inline');*/
		if($(this).attr('id')!='completedOnTime')
		{
			if(tmptime.match(globalTimePre)==null)
				$(this).parent().find('img').css('display', 'inline');
			else
				$(this).parent().find('img').css('display', 'none');
		}
		else
		{
			if($(this).val()=='')
			{
				if($('#completedOnDate').val()=='')
				{
					$(this).parent().find('img').css('display', 'none');
					$('#completedOnDate').parent().find('img').css('display', 'none');
				}
				else
					$(this).parent().find('img').css('display', 'inline');
			}
			else
			{
				if(tmptime.match(globalTimePre)==null)
					$(this).parent().find('img').css('display', 'inline');
				else
				{
					$(this).parent().find('img').css('display', 'none');
					if($('#completedOnDate').val()=='')
						$('#completedOnDate').parent().find('img').css('display', 'inline');
					else
						$('#completedOnDate').parent().find('img').css('display', 'none');
				}
			}
		}
	});

	timepickers.dblclick(function(){
		if($(this).val()!='')
			return false;

		var now=new Date();
		var todoString='';
		if($(this).attr('id')!=undefined)
			if($(this).attr('id').indexOf('TODO')!=-1)
				todoString='TODO';
		if($(this).attr('id')=='time_to' || (($(this).attr('id')=='time_toTODO')&&($('.dateTrFromTODO').css('display')!='none')))
		{
			var testString=$(this).val();
			if(($('#time_from'+todoString).parent().find('img').css('display')=='none') && ($('#date_from'+todoString).parent().find('img').css('display')=='none')
				&& ($('#date_to'+todoString).parent().find('img').css('display')=='none'))
			{
				var inputDate=$.datepicker.parseDate(globalSettings.datepickerformat,$('#date_from'+todoString).val());
				var formatString=inputDate.getFullYear()+'/'+(inputDate.getMonth()<10 ? '0' : '')+(inputDate.getMonth()+1)+'/'+(inputDate.getDate()<10 ? '0' : '')+inputDate.getDate();

				var timeDate=new Date(Date.parse(formatString+", "+$('#time_from'+todoString).val()));
				now=new Date(timeDate.getTime());

				var inputDate2=$.datepicker.parseDate(globalSettings.datepickerformat,$('#date_to'+todoString).val())
				var formatString2=inputDate2.getFullYear()+'/'+(inputDate2.getMonth()<10 ? '0' : '')+(inputDate2.getMonth()+1)+'/'+(inputDate2.getDate()<10 ? '0' : '')+inputDate2.getDate();

				var timeDateFrom=new Date(Date.parse(formatString2+", "+$('#time_from'+todoString).val()));
				if(formatString==formatString2)
				{
					now.setHours(now.getHours()+1);
					var newTestValue = new Date(Date.parse(formatString2+", "+$.fullCalendar.formatDate(now, (globalSettings.ampmformat ? 'hh:mm TT' : 'HH:mm'))));
					if(newTestValue < timeDateFrom)
					{
						newTestValue.setHours(23);
						newTestValue.setMinutes(59);
						now = new Date(newTestValue.getTime());
					}
				}
			}
		}
		if($(this).attr('id')=='time_from' || $(this).attr('id')=='time_fromTODO')
		{
			if(globalPrevDate!='')
			{
				globalPrevDate.setHours(now.getHours());
				globalPrevDate.setMinutes(now.getMinutes());
			}
		}
		$(this).val($.fullCalendar.formatDate(now, (globalSettings.ampmformat ? 'hh:mm TT' : 'HH:mm')));
		$(this).keyup();
	});
}
