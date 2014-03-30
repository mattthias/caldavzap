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

function updateTodoFormDimensions(setHeight)
{
	$('#CATodo').removeCss('width');
	$('#CATodo').css('width',$('#todo_details_template').css('width'));

	if(setHeight)
	{
		$('#CATodo').removeCss('height');
		$('#CATodo').css('height',$('#todo_details_template').css('height'));
	}
}

function updateEventFormDimensions(setHeight)
{
	$('#CAEvent').removeCss('width');
	$('#CAEvent').css('width',$('#event_details_template').css('width'));

	if(setHeight)
	{
		$('#CAEvent').removeCss('height');
		$('#CAEvent').css('height',$('#event_details_template').css('height'));
	}
}

function setFormPosition(jsEvent, confirmRepeat)
{
	var position_x,
	position_y,
	dist_x,
	dist_y;

	$('#event_details_template').removeCss('max-height');

	if(jsEvent)
	{
		if(jsEvent.pageX<=($('#main').width()/2))
		{
			position_v='left';
			dist_x=jsEvent.pageX;
		}
		else
		{
			position_v='right';
			dist_x=$('body').width()-jsEvent.pageX;
		}

		/*if(jsEvent.pageY<=($('#main').height()/2))
		{
			position_h='top';
			dist_y=jsEvent.pageY;
		}
		else
		{
			position_h='top';
			dist_y=jsEvent.pageY-$('#event_details_template').height();
		}*/
		position_h='top';
		dist_y=Math.max(25, jsEvent.pageY-(confirmRepeat ? $('#CAEvent').height() : $('#event_details_template').height()));
	}
	else
	{
		position_v='right';
		position_h='top';
		dist_x=25;
		if(todoToggle)
			dist_x+=225;
		dist_y=25;
	}

	//$('#event_details_template').removeCss('left');
	$('#CAEvent').removeCss('left');
	//$('#event_details_template').removeCss('right');
	$('#CAEvent').removeCss('right');
	//$('#event_details_template').removeCss('top');
	$('#CAEvent').removeCss('top');
	//$('#event_details_template').removeCss('bottom');
	$('#CAEvent').removeCss('bottom');
	//$('#event_details_template').css(position_v, dist_x);
	$('#CAEvent').css(position_v, dist_x);
	//$('#event_details_template').css(position_h, dist_y);
	$('#CAEvent').css(position_h, dist_y);
	$('#event_details_template').css('max-height', $('#main').height()-dist_y+20+'px');
	$('#CAEvent').css('max-height', $('#main').height()-dist_y+20+'px');
}

function setTodoPosition(jsEvent)
{
	var dist,
	pointY=0;
	$('#todo_details_template').removeCss('max-height');
	$('#CATodo').removeCss('max-height');

	if(jsEvent!=undefined)
	{
		if(jsEvent.pageY!=undefined)
			pointY=jsEvent.pageY;
		else
			pointY=jsEvent.clientY;
	}

	if(jsEvent)
	{
		/*if((pointY)+$('#todo_details_template').height()<$(window).height())
			dist=jsEvent.pageY;
		else
			dist=pointY-$('#todo_details_template').height();*/
		dist=Math.max(25, jsEvent.pageY-$('#todo_details_template').height());
	}
	else
		dist=25;

	//$('#todo_details_template').removeCss('left');
	$('#CATodo').removeCss('left');
	//$('#todo_details_template').removeCss('right');
	$('#CATodo').removeCss('right');
	//$('#todo_details_template').removeCss('top');
	$('#CATodo').removeCss('top');
	//$('#todo_details_template').removeCss('bottom');
	$('#CATodo').removeCss('bottom');
	//$('#todo_details_template').css('top', dist);
	$('#CATodo').css('top', dist);
	$('#todo_details_template').css('right', 0);
	$('#CATodo').css('right', 25);
	$('#todo_details_template').css('max-height', $('#main').height()-dist+20+'px');
	$('#CATodo').css('max-height', $('#main').height()-dist+20+'px');
}

function showTimezones(selTimezone, todoSelector)
{
	if(!globalTimeZoneSupport)
		return false;
	if(todoSelector=='')
	{
		var idSelector=$('#event_details_template');
		var timezone_option=idSelector.find('[data-type="timezones"]').find('option').remove();
	}
	else if(todoSelector=='TODO')
	{
		var idSelector=$('#todo_details_template');
		var timezone_option=idSelector.find('[data-type="timezonesTODO"]').find('option').remove();
	}
	else if(todoSelector=='Picker')
	{
		var idSelector=$('#timezoneWrapper');
		$('#timezonePicker').html('<option data-type=""></option>');
		var timezone_option=idSelector.find('#timezonePicker').find('option').remove();
	}
	else if(todoSelector=='PickerTODO')
	{
		var idSelector=$('#timezoneWrapperTODO');
		$('#timezonePickerTODO').html('<option data-type=""></option>');
		var timezone_option=idSelector.find('#timezonePickerTODO').find('option').remove();
	}

	
	for(var izone in timezoneKeys)
	{
		if(timeZonesEnabled.indexOf(timezoneKeys[izone])==-1)
			continue;
		if(!isNaN(izone))
		{
			var tmp=null;
			tmp=timezone_option;
			tmp.attr('data-type',timezoneKeys[izone]);
			if(izone==0)
			{
				tmp.text(localization[globalInterfaceLanguage].localTime);
				tmp.attr('value','local');
//				if((todoSelector=='PickerTODO' || todoSelector=='Picker') && typeof globalTimeZone != 'undefined' && globalTimeZone != null)
//					tmp.attr('value',globalTimeZone);
				idSelector.find('#timezone'+todoSelector).append(tmp.clone());
					
				if(!(selTimezone in timezones) && selTimezone!= '' && selTimezone!= 'local' && (typeof globalRemoveUnknownTimezone == 'undefined' || globalRemoveUnknownTimezone == null || !globalRemoveUnknownTimezone))
				{
					tmp.text(localization[globalInterfaceLanguage].customTimezone);
					tmp.attr('value','custom');
					if((todoSelector=='PickerTODO' || todoSelector=='Picker') && typeof globalTimeZone != 'undefined' && globalTimeZone != null)
						tmp.attr('value',globalTimeZone);
					idSelector.find('#timezone'+todoSelector).append(tmp.clone());
				}
			}
			else
			{
				tmp.text(timezoneKeys[izone]);
				tmp.attr('value',timezoneKeys[izone]);
				idSelector.find('#timezone'+todoSelector).append(tmp.clone());
			}
		}
	}

	if(!selTimezone && typeof globalSessionTimeZone!='undefined' && globalSessionTimeZone)
		selTimezone=globalSessionTimeZone;

	if(selTimezone in timezones)
		$('#timezone'+todoSelector).val(selTimezone);
	else 
	{
		if((typeof globalRemoveUnknownTimezone != 'undefined' && globalRemoveUnknownTimezone != null && globalRemoveUnknownTimezone) || selTimezone == 'local')
			$('#timezone'+todoSelector).val('local');
		else 
			$('#timezone'+todoSelector).val('custom');
	}
}

function showTodoForm(todo, mod, repeatOne, confirmRepeat)
{
	$('#CATodo').css('display','none');
	$('#todo_details_template').remove();
	$('#CATodo').html(cleanVtodoTemplate);
	$('#noteTODO').autosize();
	$("#showTODO").val('');
	$("#uidTODO").val('');
	$("#etagTODO").val('');
	$("#vcalendarUIDTODO").val('');
	globalPrevDate='';
	globalObjectLoading=true;
	if(confirmRepeat)
	{
		$('#showTODO').val(todo.id);
		$('#repeatTodo').val(true);
		$('#CATodo').show();
		$('#repeatConfirmBoxTODO').css('visibility', 'visible');
		if(todo.repeatCount!='' && todo.repeatCount == 1)
		{
			$('#editFutureTODO').css('display','none');
			if($('#editFutureTODO').next('br').length>0)
				$('#editFutureTODO').next().remove();
		}
		else if($('#editFutureTODO').css('display')=='none')
		{
			$('#editFutureTODO').css('display','block');
			if($('#editFutureTODO').next('br').length==0)
				$('#editFutureTODO').after('<br/>')
		}
		
		$('#repeatConfirmBoxContentTODO').html('<b>'+todo.title+"</b> "+localization[globalInterfaceLanguage].repeatBoxContentTODO);
		$('#repeatConfirmBoxQuestionTODO').html(localization[globalInterfaceLanguage].repeatBoxQuestionTODO);
		$('#todo_details_template').css('visibility', 'hidden');
		globalObjectLoading=false;
		$('#CATodo').show(200);
		$('#todoForm').scrollTop(0);
		return true;
	}

	if(mod=='show' && repeatOne=='futureOnly')
	{
		if(todo.start!=null)
			$('#futureStartTODO').val(todo.realRepeatCount+';'+todo.start);
		else if(todo.end!=null)
			$('#futureStartTODO').val(todo.realRepeatCount+';'+todo.end);
	}
	
	if(mod=='show')
	{
		var checkDataStart='';
		if(todo.start)
			checkDataStart=$.fullCalendar.formatDate(todo.start, "yyyyMMdd'T'HHmmss'Z'");
		if($('.fc-event-selected').attr("data-start") != checkDataStart)
		{
			 $('.fc-view-todo .fc-table-dateinfo, .fc-view-todo .fc-table-datepicker').css('opacity','0.5')
		}
		else
		{
			 $('.fc-view-todo .fc-table-dateinfo, .fc-view-todo .fc-table-datepicker').css('opacity','1')
		}
	}
	
	if(repeatOne=='editOnly')
		if(todo!=null && (todo.type || todo.rec_id))
		{
			var eventsSorted=jQuery.grep(globalEventList.displayTodosArray[todo.res_id],function(e){if(e.id==todo.id)return true}).sort(repeatStartCompare);
			
			if(eventsSorted.indexOf(todo)!=-1)
			{
				if(eventsSorted.indexOf(todo)<(eventsSorted.length-1))
					showTodoNextNav();
				if(eventsSorted.indexOf(todo)!=0)
					showTodoPrevNav();
				
				var uncomplete=0;
				for(var ij=eventsSorted.indexOf(todo); ij<eventsSorted.length; ij++)
					if(eventsSorted[ij].status!='COMPLETED')
						uncomplete++;
				if(uncomplete>0 && eventsSorted.indexOf(todo)<(eventsSorted.length-1))
					showTodoNextNav(true);
				
				var uncomplete=0;
				for(var ij=eventsSorted.indexOf(todo); ij>=0; ij--)
					if(eventsSorted[ij].status!='COMPLETED')
						uncomplete++;
				if(uncomplete>0 && eventsSorted.indexOf(todo)!=0)
					showTodoPrevNav(true);
			}		
		}
	
	if(todo!=null)
	{
		var prior=parseInt(todo.priority,10);
		if(prior==5)
			$('#priority_TODO').val(5);
		else if(prior>5 && prior<10)
		{
			$('#priority_TODO [data-type="priority_TODO_low"]').attr('value',prior)
			$('#priority_TODO').val(prior);
		}
		else if(prior<5 && prior>0)
		{
			$('#priority_TODO [data-type="priority_TODO_high"]').attr('value',prior)
			$('#priority_TODO').val(prior);
		}
		else
			$('#priority_TODO').val(0);
	}
	
	if(todo!=null)
		var sliderValue=todo.percent;
	else
		sliderValue=0;

		var cals=globalResourceCalDAVList.sortedTodoCollections;
		var todoCalendarObj = $('#todo_calendar');
		var calSelected = $('.resourceCalDAVTODO_item.resourceCalDAV_item_selected').attr('data-id');
		for(var i=0;i<cals.length;i++)
		{
			if( cals[i].uid!=undefined && ((todo!=null && todo.res_id==cals[i].uid) || (!cals[i].permissions_read_only && (vRTodo.indexOf(cals[i].uid)==-1 || calSelected==cals[i].uid))))
			{
				todoCalendarObj.append(new Option(cals[i].displayValue,cals[i].uid));
			}
		}

	if(mod!='new')
		fullVcalendarToTodoData(todo);
	else
		CalDAVeditor_cleanup();

	if(mod=='new')
	{
		$('#deleteTODO').hide();
		$('#resetTODO').hide();
		$('#editTODO').hide();
		$('#showTODO').val('');

		if($('#ResourceCalDAVTODOList').find('.resourceCalDAVTODO_item.resourceCalDAV_item_selected').length>0 && $('#todo_calendar').find('option[value="'+$('#ResourceCalDAVTODOList').find('.resourceCalDAVTODO_item.resourceCalDAV_item_selected').attr("data-id")+'"]').length>0)
			$('#todo_calendar').val($('#ResourceCalDAVTODOList').find('.resourceCalDAVTODO_item.resourceCalDAV_item_selected').attr("data-id"));
		else
			$('#todo_calendar').val($('#todo_calendar').find('option[value!="choose"]:first').attr('value'));
		//$('[data-type="name_TODO"]').attr('placeholder', localization[globalInterfaceLanguage].pholderNewTODO);

		showTimezones('', 'TODO');
		$('.timezone_rowTODO').css('display','none')
	}
	$('#CATodo').show();
	$('#todo_details_template').show();
	if(typeof globalAppleRemindersMode!='undefined' && globalAppleRemindersMode!=null && globalAppleRemindersMode)
	{
		$('[data-type="todo_type_start"], [data-type="todo_type_both"]').remove();
		if(typeof globalAppleRemindersMode == 'string' && globalAppleRemindersMode.toLowerCase()=='ios6')
		{
			$('#url_trTODO').hide();
			$('#location_row_TODO').hide();
		}
		$('[data-type="STATUS_CANCELLED_TODO"],[data-type="STATUS_IN-PROCESS_TODO"]').remove();
	}		
	if(mod=='show')
	{
		$('#showTODO').val(todo.id);
		$('#todoDetailsTable :input[type!="button"]').prop('disabled', true);
		
			if(todo.timeZone)
				showTimezones(todo.timeZone,'TODO');
			else
				showTimezones('local','TODO');
		
		if(todo.etag!='')
			$('#todo_calendar').val(todo.res_id);

		$('#nameTODO').val(todo.title);
		if(todo.status=='CANCELLED')
			$('#nameTODO').addClass('title_cancelled');

		if(todo.start!=null || todo.end!=null)
		{
			if((typeof globalAppleRemindersMode=='undefined' || globalAppleRemindersMode==null || !globalAppleRemindersMode) && ((todo.start!=null && todo.end!=null && repeatOne!='') || (!todo.type && todo.realStart!='' && todo.realEnd!='' && repeatOne=='') || (todo.type && todo.repeatStart!='' && todo.repeatEnd!='' && repeatOne=='')))
				$('#todo_type').val('both');
			else if((typeof globalAppleRemindersMode=='undefined' || globalAppleRemindersMode==null || !globalAppleRemindersMode) && ((todo.start!=null && todo.end==null && repeatOne!='') || (!todo.type && todo.realStart!='' && todo.realEnd=='' && repeatOne=='') || (todo.type && todo.repeatStart!='' && todo.repeatEnd=='' && repeatOne=='')))
				$('#todo_type').val('start');
			else
				$('#todo_type').val('due');
			if(globalTimeZoneSupport)
			$('.timezone_rowTODO').show();
		}
		else
		{
			$('#todo_type').val('none');
			$('.timezone_rowTODO').css('display','none');
		}
		if(todo.start!='' && todo.start!=null)
		{
			var date,
			year,
			month,
			day,
			hour,
			minute;
			
			if(todo.realStart)
				date=$.fullCalendar.parseDate(todo.realStart);
			else
				date=$.fullCalendar.parseDate(todo.start);
			
			if($('#showTODO').val()!='' && todo.repeatStart!='' && repeatOne=='')
				date=todo.repeatStart;
			else if($('#showTODO').val()!='' && todo.repeatStart=='' && repeatOne=='' && todo.type)
				date='';
			
			if(date)
			{
				(date.getHours())<10 ? (hour='0'+(date.getHours())) : (hour=date.getHours());
				(date.getMinutes())<10 ? (minute='0'+(date.getMinutes())) : (minute=date.getMinutes());
			
				var formattedDate=$.datepicker.formatDate(globalSessionDatepickerFormat, date);
				$('#date_fromTODO').val(formattedDate);
				if($('#todo_type').val=='both')
					globalPrevDate = new Date(date.getTime());
				$('#time_fromTODO').val($.fullCalendar.formatDate(date, (globalSessionAMPMFormat ? 'hh:mm TT' : 'HH:mm')));
			}	
		}
		if(todo.end!='' && todo.end!=null)
		{
			if(todo.realEnd)
				date=$.fullCalendar.parseDate(todo.realEnd);
			else
				date=$.fullCalendar.parseDate(todo.end);
			
			if($('#showTODO').val()!='' && todo.repeatEnd!='' && repeatOne=='')
				date=todo.repeatEnd;
			else if($('#showTODO').val()!='' && todo.repeatEnd=='' && repeatOne=='' && todo.type)
				date='';
			
			if(date)
			{
				(date.getHours())<10 ? (hour='0'+(date.getHours())) : (hour=date.getHours());
				(date.getMinutes())<10 ? (minute='0'+(date.getMinutes())) : (minute=date.getMinutes());

				var formattedDate_to=$.datepicker.formatDate(globalSessionDatepickerFormat, date);
				$('#date_toTODO').val(formattedDate_to);
				$('#time_toTODO').val($.fullCalendar.formatDate(date, (globalSessionAMPMFormat ? 'hh:mm TT' : 'HH:mm')));
			}
		}
		if(repeatOne=='editOnly' && todo.rec_id=='')
		{
			if(todo.repeatStart!='' && todo.start)
			{
				if(typeof todo.realStart=='object')
					$('#recurrenceIDTODO').val($.fullCalendar.formatDate(todo.realStart, "yyyyMMdd'T'HHmmss"));
				else if(typeof todo.realStart =='string')
					$('#recurrenceIDTODO').val($.fullCalendar.formatDate($.fullCalendar.parseDate(todo.realStart), "yyyyMMdd'T'HHmmss"));
			}
			else if(todo.repeatEnd!='' && todo.end)
			{
				if(typeof todo.realEnd =='object')
					$('#recurrenceIDTODO').val($.fullCalendar.formatDate(todo.realEnd, "yyyyMMdd'T'HHmmss"));
				else if(typeof todo.realEnd =='string')
					$('#recurrenceIDTODO').val($.fullCalendar.formatDate($.fullCalendar.parseDate(todo.realEnd), "yyyyMMdd'T'HHmmss"));
			}
		}
		else
			$('#recurrenceIDTODO').val(todo.rec_id);

		if(todo.rec_id || repeatOne=='editOnly' || repeatOne=='futureOnly')
		{
			var savedEvs=jQuery.grep(globalEventList.displayTodosArray[todo.res_id],function(e){if(e.id==todo.id && (e.repeatCount<2 || !e.repeatCount))return true});
			if(savedEvs.length>1 || (repeatOne=='futureOnly' && todo.repeatCount>1) || (repeatOne=='editOnly' && todo.type!=''))
			{
				$('#deleteTODO').attr('onclick',"updateEventFormDimensions(true);$('#todoLoader').show();saveTodo(true);");
			}
		}
		
		if(todo.completedOn!='' && todo.completedOn!=null)
		{
			var date,
			year,
			month,
			day,
			hour,
			minute;
			

		//	(todo.completedOn.getHours())<10 ? (hour='0'+(todo.completedOn.getHours())) : (hour=todo.completedOn.getHours());
		//	(todo.completedOn.getMinutes())<10 ? (minute='0'+(todo.completedOn.getMinutes())) : (minute=todo.completedOn.getMinutes());
			if(typeof todo.completedOn=='string')
				date = $.fullCalendar.parseDate(todo.completedOn);
			else if(typeof todo.completedOn=='object')
				date=new Date(todo.completedOn.getTime());
				
			var formattedDate=$.datepicker.formatDate(globalSessionDatepickerFormat, date);
			$('#completedOnDate').val(formattedDate);
			$('#completedOnTime').val($.fullCalendar.formatDate(date, (globalSessionAMPMFormat ? 'hh:mm TT' : 'HH:mm')));
			$('.completedOnTr').show();
		}
		
		var alarmDate='';
		var alarmIterator=0;

		for(alarmIterator=0;alarmIterator<todo.alertTime.length;alarmIterator++)
		{
			if(alarmIterator>0)
				todo_alert_add(alarmIterator);

			$(".alertTODO[data-id="+(alarmIterator+1)+"]").val("message");

			if(todo.alertTime[alarmIterator].charAt(0)=='-' || todo.alertTime[alarmIterator].charAt(0)=='+')
			{
				var alVal=parseInt(todo.alertTime[alarmIterator].substring(1, todo.alertTime[alarmIterator].length-1));
				var alString='';

				if(todo.alertTime[alarmIterator].charAt(todo.alertTime[alarmIterator].length-1)=="W")
				{
					alVal=alVal/1000/60/60/24/7;
					alString='weeks';
				}
				else if(todo.alertTime[alarmIterator].charAt(todo.alertTime[alarmIterator].length-1)=="D")
				{
					alVal=alVal/1000/60/60/24;
					alString='days';
				}
				else if(todo.alertTime[alarmIterator].charAt(todo.alertTime[alarmIterator].length-1)=="H")
				{
					alVal=alVal/1000/60/60;
					alString='hours';
				}
				else if(todo.alertTime[alarmIterator].charAt(todo.alertTime[alarmIterator].length-1)=="M")
				{
					alVal=alVal/1000/60;
					alString='minutes';
				}
				else if(todo.alertTime[alarmIterator].charAt(todo.alertTime[alarmIterator].length-1)=="S")
				{
					alVal=alVal/1000;
					alString='seconds';
				}

				if(todo.alertTime[alarmIterator].charAt(0)=='-')
					alString+="_before";
				else
					alString+="_after"

				$(".alert_message_detailsTODO[data-id="+(alarmIterator+1)+"]").val(alString);
				$(".before_after_inputTODO[data-id="+(alarmIterator+1)+"]").val(alVal);
				$('.alert_detailsTODO[data-id="'+(alarmIterator+1)+'"]').show();
				$('.alert_message_dateTODO[data-id="'+(alarmIterator+1)+'"]').show();
				$('.before_after_inputTODO[data-id="'+(alarmIterator+1)+'"]').show();
				$(".message_date_inputTODO[data-id="+(alarmIterator+1)+"]").hide();
				$(".message_time_inputTODO[data-id="+(alarmIterator+1)+"]").hide();
			}
			else
			{
				alarmDate=$.fullCalendar.parseDate(todo.alertTime[alarmIterator]);
				(alarmDate.getHours())<10 ? (hour='0'+(alarmDate.getHours())) : (hour=alarmDate.getHours());
				(alarmDate.getMinutes())<10 ? (minute='0'+(alarmDate.getMinutes())) : (minute=alarmDate.getMinutes());

				$(".alert_message_detailsTODO[data-id="+(alarmIterator+1)+"]").val('on_date');
				var formattedAlarmDate=$.datepicker.formatDate(globalSessionDatepickerFormat, alarmDate);

				$(".message_date_inputTODO[data-id="+(alarmIterator+1)+"]").val(formattedAlarmDate);
				$(".message_time_inputTODO[data-id="+(alarmIterator+1)+"]").val($.fullCalendar.formatDate(alarmDate, (globalSessionAMPMFormat ? 'hh:mm TT' : 'HH:mm')));

				$('.alert_detailsTODO[data-id="'+(alarmIterator+1)+'"]').show();
				$('.alert_message_dateTODO[data-id="'+(alarmIterator+1)+'"]').show();
			}
		}

		if(alarmIterator>0)
			todo_alert_add(alarmIterator);
		if(todo.type!='' && repeatOne!='editOnly')
		{
			var ruleString=todo.vcalendar.match(vCalendar.pre['contentline_RRULE2'])[0].match(vCalendar.pre['contentline_parse'])[4];
			if(ruleString.indexOf('BYMONTH=')!=-1 || ruleString.indexOf('BYMONTHDAY=')!=-1 || ruleString.indexOf('BYDAY=')!=-1)
			{
				var pars=ruleString.split(';');
				
				if(pars.indexElementOf('BYMONTH=')!=-1 && pars.indexElementOf('BYMONTHDAY=')==-1 && pars.indexElementOf('BYDAY=')==-1)
					pars[pars.length] = "BYMONTHDAY="+todo.start.getDate();
				if(todo.type=="DAILY")
				{
					$("#repeat_TODO option[value='DAILY']").prop('selected', true);
					$('#repeat_interval_TODO [data-type="txt_interval"]').text(localization[globalInterfaceLanguage].repeatDays);
				}
				else if(todo.type=="WEEKLY")
				{
					$("#repeat_TODO option[value='CUSTOM_WEEKLY']").prop('selected', true);
					$('#repeat_interval_TODO [data-type="txt_interval"]').text(localization[globalInterfaceLanguage].repeatWeeks);
					
					for(var ri=0;ri<pars.length;ri++)
					{
						if(pars[ri].indexOf("BYDAY=")!=-1)
						{
							var byDay=pars[ri].split('=')[1];
							byDay=byDay.replace(/\d*MO/,1).replace(/\d*TU/,2).replace(/\d*WE/,3).replace(/\d*TH/,4).replace(/\d*FR/,5).replace(/\d*SA/,6).replace(/\d*SU/,0).split(',');
							for(var rj=0;rj<byDay.length;rj++)
							{
								if(!isNaN(parseInt(byDay[rj],10)))
									$('#week_custom_TODO .customTable td[data-type="'+byDay[rj]+'"]').addClass('selected');
							}
						}
					}
					$('#week_custom_TODO').show();
				}
				else if(todo.type=="MONTHLY")
				{
					$("#repeat_TODO option[value='CUSTOM_MONTHLY']").prop('selected', true).change();
					$('#repeat_interval_TODO [data-type="txt_interval"]').text(localization[globalInterfaceLanguage].repeatMonths);
					
							
					for(var ri=0;ri<pars.length;ri++)
					{
						if(pars[ri].indexOf("BYDAY=")!=-1)
						{
							var byDay=pars[ri].split('=')[1];
							byDay=byDay.split(',');
							for(var rj=0;rj<byDay.length;rj++)
							{
								var checkString = byDay[rj].match('[-+]?[0-9]*');
								byDay[rj] = byDay[rj].replace(checkString[0],'');
								if(!isNaN(parseInt(checkString[0],10)))
								{
									switch(parseInt(checkString[0],10))
									{
										case 1:
												$('#repeat_month_custom_select_TODO').val('first');
												break;
										case 2:
												$('#repeat_month_custom_select_TODO').val('second');
												break;
										case 3:
												$('#repeat_month_custom_select_TODO').val('third');
												break;
										case 4:
												$('#repeat_month_custom_select_TODO').val('fourth');
												break;
										case 5:
												$('#repeat_month_custom_select_TODO').val('fifth');
												break;
										case -1:
												$('#repeat_month_custom_select_TODO').val('last');
												break;
										default:
												$('#repeat_month_custom_select_TODO').val('every');
												break;
										
										
									}
									$('#repeat_month_custom_select2_TODO').val(byDay[rj]);
								}
							}
						}
						else if(pars[ri].indexOf("BYMONTHDAY=")!=-1)
						{
							$('#repeat_month_custom_select_TODO').val('custom').change();
							var byMonthDay=pars[ri].split('=')[1];
							byMonthDay=byMonthDay.split(',');
							for(var rj=0; rj<byMonthDay.length;rj++)
							{
								if(parseInt(byMonthDay[rj],10)==-1)
								{
									$('#repeat_month_custom_select_TODO').val('last').change();
									$('#repeat_month_custom_select2_TODO').val("DAY");
									
								}
								else
									$('#month_custom2_TODO .customTable td[data-type="'+(parseInt(byMonthDay[rj],10))+'"]').addClass('selected');
							}
						}
					}
				}
				else if(todo.type=="YEARLY")
				{
					$("#repeat_TODO option[value='CUSTOM_YEARLY']").prop('selected', true).change();
					$('#repeat_interval_TODO [data-type="txt_interval"]').text(localization[globalInterfaceLanguage].repeatYears);
					var isMonthDay=false;
					for(var ri=0;ri<pars.length;ri++)
					{
						if(pars[ri].indexOf("BYDAY=")!=-1)
						{
							var byDay=pars[ri].split('=')[1];
							byDay=byDay.split(',');
							for(var rj=0;rj<byDay.length;rj++)
							{
								var checkString = byDay[rj].match('[-+]?[0-9]*');
								byDay[rj] = byDay[rj].replace(checkString[0],'');
								if(!isNaN(parseInt(checkString[0],10)))
								{
									switch(parseInt(checkString[0],10))
									{
										case 1:
												$('#repeat_year_custom_select1_TODO').val('first');
												break;
										case 2:
												$('#repeat_year_custom_select1_TODO').val('second');
												break;
										case 3:
												$('#repeat_year_custom_select1_TODO').val('third');
												break;
										case 4:
												$('#repeat_year_custom_select1_TODO').val('fourth');
												break;
										case 5:
												$('#repeat_year_custom_select1_TODO').val('fifth');
												break;
										case -1:
												$('#repeat_year_custom_select1_TODO').val('last');
												break;
										default:
												$('#repeat_year_custom_select1_TODO').val('every');
												break;
										
										
									}
									$('#repeat_year_custom_select2_TODO').val(byDay[rj]);
								}
							}
						}
						else if(pars[ri].indexOf("BYMONTHDAY=")!=-1)
						{
							$('#repeat_year_custom_select1_TODO').val('custom').change()
							var byMonthDay=pars[ri].split('=')[1];
							byMonthDay=byMonthDay.split(',');
							for(var rj=0; rj<byMonthDay.length;rj++)
							{
								if(parseInt(byMonthDay[rj],10)==-1)
								{
									$('#repeat_year_custom_select1_TODO').val('last').change();
									$('#repeat_year_custom_select2_TODO').val("DAY");
									
								}
								else
									$('#year_custom1_TODO .customTable td[data-type="'+(parseInt(byMonthDay[rj],10))+'"]').addClass('selected');
							}
							isMonthDay=true;
						}
						else if(pars[ri].indexOf("BYMONTH=")!=-1)
						{
							var byMonth=pars[ri].split('=')[1];
							byMonth=byMonth.split(',');
							for(var rj=0; rj<byMonth.length;rj++)
								$('#year_custom3_TODO .customTable td[data-type="'+(parseInt(byMonth[rj],10)-1)+'"]').addClass('selected');
						}
					}
				}
				
				if(todo.after=='' && todo.untilDate=='')
					$("#repeat_end_details_TODO option[value='never']").prop('selected', true);
				else if(todo.after!='')
				{
					$("#repeat_end_details_TODO option[value='after']").prop('selected', true);
					$('#repeat_end_after_TODO').val(todo.after);
				}
				else if(todo.untilDate!='')
				{
					date=$.fullCalendar.parseDate(todo.untilDate);
					$("#repeat_end_details_TODO option[value='on_date']").prop('selected', true);
					var formattedRepeatDate=$.datepicker.formatDate(globalSessionDatepickerFormat, date);
					$('#repeat_end_date_TODO').val(formattedRepeatDate);
				}

				$('#repeat_interval_detail_TODO').val(todo.interval);
				$('#repeat_interval_TODO').show();

				if(todo.byDay.length>0)
				{
					var businessArray=new Array();
					if(typeof globalWeekendDays!='undefined' && globalWeekendDays!=null && globalWeekendDays.length>0)
						for(var i=0;i<7;i++)
							if(globalWeekendDays.indexOf(i)==-1)
								businessArray[businessArray.length]=i+'';
					var businessCount=0;
					var weekendCount=0;
					for(var i=0;i<byDay.length;i++)
					{
						if(businessArray.indexOf(byDay[i])!=-1)
							businessCount++;
						if(globalWeekendDays.indexOf(parseInt(byDay[i],10))!=-1)
							weekendCount++;
					
					}
					
					if(businessArray.length>0 && businessArray.length==businessCount)
					{
						$("#repeat_TODO option[value='BUSINESS']").prop('selected', true);
						$('#repeat_interval_TODO').hide();
						$('#week_custom_TODO').hide();
					}
					else if(globalWeekendDays.length>0 && globalWeekendDays.length==weekendCount)
					{
						$("#repeat_TODO option[value='WEEKEND']").prop('selected', true);
						$('#repeat_interval_TODO').hide();
						$('#week_custom_TODO').hide();
					}
				}
			}
			else
			{
				if(todo.type=="DAILY")
				{
					$("#repeat_TODO option[value='DAILY']").prop('selected', true);
					$('#repeat_interval_TODO [data-type="txt_interval"]').text(localization[globalInterfaceLanguage].repeatDays);
				}
				else if(todo.type=="WEEKLY")
				{
					$("#repeat_TODO option[value='WEEKLY']").prop('selected', true);
					$('#repeat_interval_TODO [data-type="txt_interval"]').text(localization[globalInterfaceLanguage].repeatWeeks);
				}
				else if(todo.type=="MONTHLY")
				{
					$("#repeat_TODO option[value='MONTHLY']").prop('selected', true);
					$('#repeat_interval_TODO [data-type="txt_interval"]').text(localization[globalInterfaceLanguage].repeatMonths);
				}
				else if(todo.type=="YEARLY")
				{
					$("#repeat_TODO option[value='YEARLY']").prop('selected', true);
					$('#repeat_interval_TODO [data-type="txt_interval"]').text(localization[globalInterfaceLanguage].repeatYears);
				}

				if(todo.after=='' && todo.untilDate=='')
					$("#repeat_end_details_TODO option[value='never']").prop('selected', true);
				else if(todo.after!='')
				{
					$("#repeat_end_details_TODO option[value='after']").prop('selected', true);
					$('#repeat_end_after_TODO').val(todo.after);
				}
				else if(todo.untilDate!='')
				{
					date=$.fullCalendar.parseDate(todo.untilDate);
					$("#repeat_end_details_TODO option[value='on_date']").prop('selected', true);
					var formattedRepeatDate=$.datepicker.formatDate(globalSessionDatepickerFormat, date);
					$('#repeat_end_date_TODO').val(formattedRepeatDate);
				}

				$('#repeat_interval_detail_TODO').val(todo.interval);
				$('#repeat_interval_TODO').show();
				$('#repeatTodo').val(true);
			}
		}
		else
			$('#repeatTodo').val(false);
			
		if(todo.start!=null || todo.end!=null)
		{
			if(globalTimeZoneSupport)
				$('.timezone_rowTODO').show()
		}
		else
			$('.timezone_rowTODO').css('display', 'none');


		if(todo.status!='')
			$('#statusTODO').find('option[value='+todo.status+']').prop('selected', true);

		$('#noteTODO').val(todo.note).trigger('autosize.resize');
		
		if(todo.classType!='')
			$('#typeTODO').val(todo.classType.toLowerCase());
		else 
			$('#typeTODO').val('public');
		
		if(todo!=null && mod!='new')
		{
			var uidArray = todo.id.match(RegExp('^(https?://)([^@/]+(?:@[^@/]+)?)@([^/]+)(.*/)([^/]+/)([^/]*)', 'i'));
			
			if(decodeURIComponent(uidArray[4]).indexOf(uidArray[2])==-1)
				$('.row_typeTODO').css('display','none');
		}
					
		$('#uidTODO').val(todo.id);
		$('#url_TODO').val(todo.url);
		$('#location_TODO').val(todo.location);
		$('#etagTODO').val(todo.etag);
		$('#vcalendarHashTODO').val(hex_sha256(todo.vcalendar));
		var stringUIDcurrent=todo.vcalendar.match(vCalendar.pre['contentline_UID']);

		if(stringUIDcurrent!=null)
			stringUIDcurrent=stringUIDcurrent[0].match(vCalendar.pre['contentline_parse'])[4];

		if(stringUIDcurrent)
			$('#vcalendarUIDTODO').val(stringUIDcurrent);
	}
	
	
	if($('#todo_type').val()=='start')
	{
		$('.dateTrFromTODO').show();
		$('.dateTrToTODO').hide();
	}	
	else if($('#todo_type').val()=='due')
	{
		$('.dateTrToTODO').show();
		$('.dateTrFromTODO').hide();
	}
	else if($('#todo_type').val()=='both')
	{
		$('.dateTrToTODO').show();
		$('.dateTrFromTODO').show();
	}
	else
	{
		$('.dateTrToTODO').hide();
		$('.dateTrFromTODO').hide();
		$('#repeat_row_TODO').hide();
	}		
	
	if($('#repeat_TODO option:selected').attr('data-type')!="repeat_no-repeat")
		$('#repeat_details_TODO').show();

	if($('#repeat_end_details_TODO option:selected').attr('data-type')=="repeat_details_on_date")
	{
		$('#repeat_end_after_TODO').hide();
		$('#repeat_end_date_TODO').show();
	}

	if($('#repeat_end_details_TODO option:selected').attr('data-type')=="repeat_details_after")
	{
		$('#repeat_end_after_TODO').show();
		$('#repeat_end_date_TODO').hide();
	}

	if($('#repeat_end_details_TODO option:selected').attr('data-type')=="repeat_details_never")
	{
		$('#repeat_end_after_TODO').hide();
		$('#repeat_end_date_TODO').hide();
	}
	

	if(mod=='show')
	{
		if($('#ResourceCalDAVList').find('[data-id="'+todo.res_id+'"]').hasClass("resourceCalDAV_item_ro"))
			$('#editTODO').hide();

		$('#saveTODO').hide();
		$('#resetTODO').hide();
		$('#deleteTODO').hide();
		$('#todoDetailsTable :input[type!="button"]').prop('disabled', true);
		$('#todoDetailsTable :input[type="text"]').prop('readonly', true);
		$('#todoDetailsTable textarea').prop('readonly', true);
		
		$('#percentageSlider').slider({disabled: true});
		
		/*************************** BAD HACKS SECTION ***************************/
		// here we fix the cross OS/cross broser problems (unfixable in pure CSS)
		if($.browser.webkit && !!window.chrome)	/* Chrome */
		{
			if(navigator.platform.toLowerCase().indexOf('win')==0)	/* Windows version */
			{
				$('#todo_details_template').find('input').css('text-indent', '2px');
				$('#todo_details_template').find('select').css({'padding-left': '0px', 'padding-right': '13px'});
			}
			else	/* non-Windows version */
				$('#todo_details_template').find('input').css('text-indent', '1px');
		}
		else if($.browser.msie)	/* IE */
		{
			if(parseInt($.browser.version, 10)==10)	/* IE 10 (because there are no more conditional comments) */
			{
				$('#todo_details_template').find('select').css({'padding-top': '1px', 'padding-left': '0px', 'padding-right': '0px'});
				$('#todo_details_template').find('textarea').css('padding-top', '3px');
				$('#todo_details_template').find('input[type=button]').css('padding-top', '2px');
			}
		}

		if($.browser.msie || $.browser.mozilla)
		{
			var newSVG=$(SVG_select_dis).attr('data-type', 'select_icon').css({'pointer-events': 'none', 'z-index': '1', 'display': 'inline', 'margin-left': '-22px', 'vertical-align': 'top', 'background-color': '#ffffff'});	// background-color = stupid IE9 bug
			$('#todo_details_template').find('svg[data-type="select_icon"]').replaceWith($('<div>').append($(newSVG).clone()).html());
		}
		/*************************** END OF BAD HACKS SECTION ***************************/
	}
	if(repeatOne=='editOnly' || $('#recurrenceIDTODO').val()!='')
	{
		$('#repeat_TODO').parent().parent().css('display', 'none');
		$('#week_custom_TODO').css('display', 'none');
		$('#month_custom1_TODO').css('display', 'none');
		$('#month_custom2_TODO').css('display', 'none');
		$('#year_custom1_TODO').css('display', 'none');
		$('#year_custom2_TODO').css('display', 'none');
		$('#year_custom3_TODO').css('display', 'none');
		$('#repeat_details_TODO').css('display', 'none');
	}

	if(repeatOne=='editOnly' || repeatOne=='futureOnly' || $('#recurrenceIDTODO').val())
		$('#calendarLineTODO').hide();

	if(todo && todo.after && repeatOne=='futureOnly')
			$('#repeat_end_after_TODO').val(todo.after - todo.realRepeatCount + 1);
			
	$("#percenteCompleteValue").val(sliderValue);

	$("#percentageSlider").slider({
		animate: true,
		range: "min",
		value: sliderValue,
		min: 0,
		max: 100,
		step: 1,

		//this gets a live reading of the value and prints it on the page
		slide: function(event, ui)
		{
			$("#percenteCompleteValue").val(ui.value);
			$(this).parent().parent().find('img').css('display', 'none');
		},

		//this updates the hidden form field so we can submit the data using a form
		change: function(event, ui) {
			var status;

			if (ui.value > 99)
				status='COMPLETED';
			else if(ui.value > 0 && (typeof globalAppleRemindersMode=='undefined' || globalAppleRemindersMode==null || !globalAppleRemindersMode))
				status='IN-PROCESS';
			else
				status='NEEDS-ACTION';

			$('#statusTODO').val(status);
			todoStatusChanged(status);
		}
	});

	if(!globalTimeZoneSupport)
		$('.timezone_rowTODO').css('display', 'none');

	//updateTodoFormDimensions();

	//if(window.event!=undefined)
	//	setTodoPosition(window.event);
	//else
	//	setTodoPosition(event);

	if($('#todo_type').val()=='none')
	{
		$('.alert_message_detailsTODO').each(function(){
			if($(this).val()=='on_date')
				$(this).find('option').not(':selected').remove();
			else
			{
				var dataID=$(this).parent().parent().attr('data-id');
				$('#todo_details_template').find('tr[data-id="'+dataID+'"]').remove();
			}
		});
	}
	if(mod!='new')
		$('#closeTODO').hide();
	globalObjectLoading=false;
	$('#CATodo').show(200);
	$('#todoForm').scrollTop(0);
}

function showEventForm(date, allDay, calEvent, jsEvent, mod, repeatOne, confirmRepeat)
{
	$('#event_details_template').remove();
	$('#CAEvent').html(cleanVcalendarTemplate);
	$('#note').autosize({callback: function(){checkEventFormScrollBar();}});
	$("#show").val('');
	$("#uid").val('');
	$("#etag").val('');
	$("#repeatCount").val('');
	$("#repeatEvent").val('');
	$("#recurrenceID").val('');
	$("#futureStart").val('');
	$("#vcalendarHash").val('');
	$("#vcalendarUID").val('');
	globalPrevDate='';
	if(confirmRepeat)
	{
		$('#show').val(calEvent.id);
		$('#repeatEvent').val(true);
		$('#CAEvent').show();
		$('#repeatConfirmBox').css('visibility', 'visible');
		if(calEvent.repeatCount!='' && calEvent.repeatCount == 1)
		{
			$('#editFuture').css('display','none');
			if($('#editFuture').next('br').length>0)
				$('#editFuture').next().remove();
		}
		else if($('#editFuture').css('display')=='none')
		{
			$('#editFuture').css('display','block');
			if($('#editFuture').next('br').length==0)
				$('#editFuture').after('<br/>')
		}
		$('#repeatConfirmBoxContent').html('<b>'+calEvent.title+"</b> "+localization[globalInterfaceLanguage].repeatBoxContent);
		$('#repeatConfirmBoxQuestion').html(localization[globalInterfaceLanguage].repeatBoxQuestion);

		$('#CAEvent').height($('#repeatConfirmBox').height());
		updateEventFormDimensions();
		setFormPosition(jsEvent, true);
		$('#event_details_template').scrollTop(0);
		return true;
	}

	if(mod=='show' && repeatOne=='futureOnly')
	{
		$('#futureStart').val(calEvent.realRepeatCount+';'+calEvent.start);
	}
	if(mod!='new')
		fullVcalendarToData(calEvent);
	else
		CalDAVeditor_cleanup();
	
	
	if(calEvent!=null && (calEvent.type || calEvent.rec_id))
	{
		var eventsSorted=jQuery.grep(globalEventList.displayEventsArray[calEvent.res_id],function(e){if(e.id==calEvent.id)return true}).sort(repeatStartCompare);
		
		if(eventsSorted.indexOf(calEvent)!=-1)
		{
			if(eventsSorted.indexOf(calEvent)<(eventsSorted.length-1))
				showEventNextNav();
			if(eventsSorted.indexOf(calEvent)!=0)
				showEventPrevNav();
		}		
	}
	
	
	var cals=globalResourceCalDAVList.sortedCollections;
	var calendarObj = $('#event_calendar');
	var calSelected = $('.resourceCalDAV_item.resourceCalDAV_item_selected').attr('data-id');
		for(var i=0;i<cals.length;i++)
		{
			if( cals[i].uid!=undefined && ((calEvent!=null && calEvent.res_id==cals[i].uid) || (!cals[i].permissions_read_only && (vR.indexOf(cals[i].uid)==-1 || calSelected==cals[i].uid))))
			{
				calendarObj.append(new Option(cals[i].displayValue,cals[i].uid));
			}
		}

	if(mod=='new')
	{
		$('#show').val('');
		$('#editButton').hide();
		$('#resetButton').hide();
		$('#deleteButton').hide();

		if($('#ResourceCalDAVList').find('.resourceCalDAV_item.resourceCalDAV_item_selected').length>0 && $('#event_calendar').find('option[value="'+$('#ResourceCalDAVList').find('.resourceCalDAV_item.resourceCalDAV_item_selected').attr("data-id")+'"]').length>0)
			$('.R_calendar').val($('#ResourceCalDAVList').find('.resourceCalDAV_item.resourceCalDAV_item_selected').attr("data-id"));
		else
			$('#event_calendar').val($('#event_calendar').find('option[value!="choose"]:first').attr('value'));
	}

	if(mod=='drop')
	{
		if(calEvent.etag!='')
			$('#event_calendar').val(calEvent.res_id);
	}

	if(mod=='new')
	{
		//$('[data-type="name"]').attr('placeholder', localization[globalInterfaceLanguage].pholderNewEvent);
		var date_to=null;
		if(calEvent!=null)
		{
			if(calEvent.realStart)
				date=calEvent.realStart;
			else
				date=calEvent.start;

			if(calEvent.realEnd)
				date_to=calEvent.realEnd;
			else
				date_to=calEvent.end;
		}

		var color='';
		if($('#ResourceCalDAVList').find('.resourceCalDAV_item.resourceCalDAV_item_selected').length>0)
			color=rgb2hex($('#ResourceCalDAVList').find('.resourceCalDAV_item.resourceCalDAV_item_selected').find('.resourceCalDAVColor').css('background-color'));

		if(allDay)
		{
			$('#calendar').fullCalendar('renderEvent', new items('', date, date_to, localization[globalInterfaceLanguage].pholderNewEvent, true, 'fooUID',color, '', '', '', '', '', '', '', '', '', '', '', '', '','', '', '', '', '', '', '', '', '',''));
			globalCalDAVQs.cache();

			if(globalDisplayHiddenEvents)
				for(var k=1;k<globalResourceCalDAVList.collections.length;k++)
					if(globalResourceCalDAVList.collections[k].uid!=undefined)
					{
						var pos=vR.indexOf(globalResourceCalDAVList.collections[k].uid);
						if(pos!=-1)
							$("#SystemCalDAV div [data-res-id='"+globalResourceCalDAVList.collections[k].uid+"']").addClass('checkCalDAV_hide');
					}
		}
		else
		{
			if((date_to==null) || ((date_to-date)==0))
				date_to=new Date(date.getFullYear(),date.getMonth(), date.getDate(),date.getHours()+1,date.getMinutes(),date.getSeconds());

			$('#calendar').fullCalendar('renderEvent', new items('', date, date_to, localization[globalInterfaceLanguage].pholderNewEvent, false, 'fooUID',color, '', '', '', '', '', '','', '', '', '', '', '', '','', '', '', '', '', '', '', '', '',''));
			globalCalDAVQs.cache();

			if(globalDisplayHiddenEvents)
				for(var k=1;k<globalResourceCalDAVList.collections.length;k++)
					if(globalResourceCalDAVList.collections[k].uid!=undefined)
					{
						var pos=vR.indexOf(globalResourceCalDAVList.collections[k].uid);
						if(pos!=-1)
							$("#SystemCalDAV div [data-res-id='"+globalResourceCalDAVList.collections[k].uid+"']").addClass('checkCalDAV_hide');
					}
		}

		if(allDay)
		{
			$('#allday').prop('checked', true);
			$('#time_from_cell').css('visibility', 'hidden');
			$('#time_to_cell').css('visibility', 'hidden');
			$('.timezone_row').css('display', 'none');
		}
		showTimezones('', '');
	}

	if(mod=='show' || mod=='drop')
	{
		if(calEvent.status=='CANCELLED')
			$('#name').addClass('title_cancelled');

		$('#name').val(calEvent.title);
		$('#location').val(calEvent.location);

		if(calEvent.allDay==true)
		{
			$('#allday').prop('checked', true);
			$('#time_from_cell').css('visibility', 'hidden');
			$('#time_to_cell').css('visibility', 'hidden');
			$('.timezone_row').css('display', 'none');
		}

		if(calEvent.end)
			if(calEvent.realEnd && (mod!='drop'  || repeatOne!='editOnly'))
				date_to=calEvent.realEnd;
			else
				date_to=calEvent.end;

		$('#note').val(calEvent.note).trigger('autosize.resize');
		if(typeof calEvent.classType!='undefined' && calEvent.classType!=null && calEvent.classType!='')
			$('#type').val(calEvent.classType.toLowerCase());
		else 
			$('#type').val('public');
		
		if(calEvent.status!='')
			$('#status').val(calEvent.status);
		else 
			$('#status').val('NONE');
		
		if(calEvent!=null && mod!='new')
		{
			var uidArray = calEvent.id.match(RegExp('^(https?://)([^@/]+(?:@[^@/]+)?)@([^/]+)(.*/)([^/]+/)([^/]*)', 'i'));
			if(decodeURIComponent(uidArray[4]).indexOf(uidArray[2])==-1)
				$('.row_type').css('display','none');
		}
		
		if(calEvent.avail == 'OPAQUE')
			$('#avail').val('busy');
		else
			$('#avail').val('free');
		
		if(calEvent!=null)
		{
			var prior=parseInt(calEvent.priority,10);
			if(prior==5)
				$('#priority').val(5);
			else if(prior>5 && prior<10)
			{
				$('#priority [data-type="priority_low"]').attr('value',prior)
				$('#priority').val(prior);
			}
			else if(prior<5 && prior>0)
			{
				$('#priority [data-type="priority_high"]').attr('value',prior)
				$('#priority').val(prior);
			}
			else
				$('#priority').val(0);
		}
		
		$('#uid').val(calEvent.id);
		$('#url_EVENT').val(calEvent.hrefUrl+'');
		$('#vcalendarHash').val(hex_sha256(calEvent.vcalendar));
		$('#etag').val(calEvent.etag);
		var stringUIDcurrent=calEvent.vcalendar.match(vCalendar.pre['contentline_UID']);

		if(stringUIDcurrent!=null)
			stringUIDcurrent=stringUIDcurrent[0].match(vCalendar.pre['contentline_parse'])[4];

		if(stringUIDcurrent)
			$('#vcalendarUID').val(stringUIDcurrent);

		var alarmDate='';
		for(var alarmIterator=0;alarmIterator<calEvent.alertTime.length;alarmIterator++)
		{
			if(alarmIterator>0)
				event_alert_add(alarmIterator);

			$(".alert[data-id="+(alarmIterator+1)+"]").val("message");
			if(calEvent.alertTime[alarmIterator].charAt(0)=='-' || calEvent.alertTime[alarmIterator].charAt(0)=='+')
			{
				var alVal=parseInt(calEvent.alertTime[alarmIterator].substring(1, calEvent.alertTime[alarmIterator].length-1));
				var alString='';

				if(calEvent.alertTime[alarmIterator].charAt(calEvent.alertTime[alarmIterator].length-1)=="W")
				{
					alVal=alVal/1000/60/60/24/7;
					alString='weeks';
				}
				else if(calEvent.alertTime[alarmIterator].charAt(calEvent.alertTime[alarmIterator].length-1)=="D")
				{
					alVal=alVal/1000/60/60/24;
					alString='days';
				}
				else if(calEvent.alertTime[alarmIterator].charAt(calEvent.alertTime[alarmIterator].length-1)=="H")
				{
					alVal=alVal/1000/60/60;
					alString='hours';
				}
				else if(calEvent.alertTime[alarmIterator].charAt(calEvent.alertTime[alarmIterator].length-1)=="M")
				{
					alVal=alVal/1000/60;
					alString='minutes';
				}
				else if(calEvent.alertTime[alarmIterator].charAt(calEvent.alertTime[alarmIterator].length-1)=="S")
				{
					alVal=alVal/1000;
					alString='seconds';
				}

				if(calEvent.alertTime[alarmIterator].charAt(0)=='-')
					alString+="_before";
				else
					alString+="_after"

				$(".alert_message_details[data-id="+(alarmIterator+1)+"]").val(alString);
				$(".before_after_input[data-id="+(alarmIterator+1)+"]").val(alVal);
				$('.alert_details[data-id="'+(alarmIterator+1)+'"]').show();
				$('.alert_message_date[data-id="'+(alarmIterator+1)+'"]').show();
				$('.before_after_input[data-id="'+(alarmIterator+1)+'"]').show();
				$(".message_date_input[data-id="+(alarmIterator+1)+"]").hide();
				$(".message_time_input[data-id="+(alarmIterator+1)+"]").hide();
			}
			else
			{
				alarmDate=$.fullCalendar.parseDate(calEvent.alertTime[alarmIterator]);
				(alarmDate.getHours())<10 ? (hour='0'+(alarmDate.getHours())) : (hour=alarmDate.getHours());
				(alarmDate.getMinutes())<10 ? (minute='0'+(alarmDate.getMinutes())) : (minute=alarmDate.getMinutes());

				$(".alert_message_details[data-id="+(alarmIterator+1)+"]").val('on_date');
				var formattedAlarmDate=$.datepicker.formatDate(globalSessionDatepickerFormat, alarmDate);

				$(".message_date_input[data-id="+(alarmIterator+1)+"]").val(formattedAlarmDate);
				$(".message_time_input[data-id="+(alarmIterator+1)+"]").val($.fullCalendar.formatDate(alarmDate, (globalSessionAMPMFormat ? 'hh:mm TT' : 'HH:mm')));

				$('.alert_details[data-id="'+(alarmIterator+1)+'"]').show();
				$('.alert_message_date[data-id="'+(alarmIterator+1)+'"]').show();
			}
		}

		if(alarmIterator>0)
			event_alert_add(alarmIterator+2);

		if(calEvent.type!='' && repeatOne!='editOnly')
		{
			var ruleString=calEvent.vcalendar.match(vCalendar.pre['contentline_RRULE2'])[0].match(vCalendar.pre['contentline_parse'])[4];
			if(ruleString.indexOf('BYMONTH=')!=-1 || ruleString.indexOf('BYMONTHDAY=')!=-1 || ruleString.indexOf('BYDAY=')!=-1)
			{
				pars=ruleString.split(';');
				
				if(pars.indexElementOf('BYMONTH=')!=-1 && pars.indexElementOf('BYMONTHDAY=')==-1 && pars.indexElementOf('BYDAY=')==-1)
					pars[pars.length] = "BYMONTHDAY="+calEvent.start.getDate();
				if(calEvent.type=="DAILY")
				{
					$("#repeat option[value='DAILY']").prop('selected', true);
					$('#repeat_interval [data-type="txt_interval"]').text(localization[globalInterfaceLanguage].repeatDays);
				}
				else if(calEvent.type=="WEEKLY")
				{
					$("#repeat option[value='CUSTOM_WEEKLY']").prop('selected', true);
					$('#repeat_interval [data-type="txt_interval"]').text(localization[globalInterfaceLanguage].repeatWeeks);
					
					for(var ri=0;ri<pars.length;ri++)
					{
						if(pars[ri].indexOf("BYDAY=")!=-1)
						{
							var byDay=pars[ri].split('=')[1];
							byDay=byDay.replace(/\d*MO/,1).replace(/\d*TU/,2).replace(/\d*WE/,3).replace(/\d*TH/,4).replace(/\d*FR/,5).replace(/\d*SA/,6).replace(/\d*SU/,0).split(',');
							for(var rj=0;rj<byDay.length;rj++)
							{
								if(!isNaN(parseInt(byDay[rj],10)))
									$('#week_custom .customTable td[data-type="'+byDay[rj]+'"]').addClass('selected');
							}
						}
					}
					$('#week_custom').show();
				}
				else if(calEvent.type=="MONTHLY")
				{
					$("#repeat option[value='CUSTOM_MONTHLY']").prop('selected', true).change();
					$('#repeat_interval [data-type="txt_interval"]').text(localization[globalInterfaceLanguage].repeatMonths);
					
							
					for(var ri=0;ri<pars.length;ri++)
					{
						if(pars[ri].indexOf("BYDAY=")!=-1)
						{
							var byDay=pars[ri].split('=')[1];
							byDay=byDay.split(',');
							for(var rj=0;rj<byDay.length;rj++)
							{
								var checkString = byDay[rj].match('[-+]?[0-9]*');
								byDay[rj] = byDay[rj].replace(checkString[0],'');
								if(!isNaN(parseInt(checkString[0],10)))
								{
									switch(parseInt(checkString[0],10))
									{
										case 1:
												$('#repeat_month_custom_select').val('first');
												break;
										case 2:
												$('#repeat_month_custom_select').val('second');
												break;
										case 3:
												$('#repeat_month_custom_select').val('third');
												break;
										case 4:
												$('#repeat_month_custom_select').val('fourth');
												break;
										case 5:
												$('#repeat_month_custom_select').val('fifth');
												break;
										case -1:
												$('#repeat_month_custom_select').val('last');
												break;
										default:
												$('#repeat_month_custom_select').val('every');
												break;
										
										
									}
									$('#repeat_month_custom_select2').val(byDay[rj]);
								}
							}
						}
						else if(pars[ri].indexOf("BYMONTHDAY=")!=-1)
						{
							$('#repeat_month_custom_select').val('custom').change();
							var byMonthDay=pars[ri].split('=')[1];
							byMonthDay=byMonthDay.split(',');
							for(var rj=0; rj<byMonthDay.length;rj++)
							{
								if(parseInt(byMonthDay[rj],10)==-1)
								{
									$('#repeat_month_custom_select').val('last').change();
									$('#repeat_month_custom_select2').val("DAY");
									
								}
								else
									$('#month_custom2 .customTable td[data-type="'+(parseInt(byMonthDay[rj],10))+'"]').addClass('selected');
							}
						}
					}
				}
				else if(calEvent.type=="YEARLY")
				{
					$("#repeat option[value='CUSTOM_YEARLY']").prop('selected', true).change();
					$('#repeat_interval [data-type="txt_interval"]').text(localization[globalInterfaceLanguage].repeatYears);
					var isMonthDay=false;
					for(var ri=0;ri<pars.length;ri++)
					{
						if(pars[ri].indexOf("BYDAY=")!=-1)
						{
							var byDay=pars[ri].split('=')[1];
							byDay=byDay.split(',');
							for(var rj=0;rj<byDay.length;rj++)
							{
								var checkString = byDay[rj].match('[-+]?[0-9]*');
								byDay[rj] = byDay[rj].replace(checkString[0],'');
								if(!isNaN(parseInt(checkString[0],10)))
								{
									switch(parseInt(checkString[0],10))
									{
										case 1:
												$('#repeat_year_custom_select1').val('first');
												break;
										case 2:
												$('#repeat_year_custom_select1').val('second');
												break;
										case 3:
												$('#repeat_year_custom_select1').val('third');
												break;
										case 4:
												$('#repeat_year_custom_select1').val('fourth');
												break;
										case 5:
												$('#repeat_year_custom_select1').val('fifth');
												break;
										case -1:
												$('#repeat_year_custom_select1').val('last');
												break;
										default:
												$('#repeat_year_custom_select1').val('every');
												break;
										
										
									}
									$('#repeat_year_custom_select2').val(byDay[rj]);
								}
							}
						}
						else if(pars[ri].indexOf("BYMONTHDAY=")!=-1)
						{
							$('#repeat_year_custom_select1').val('custom').change()
							var byMonthDay=pars[ri].split('=')[1];
							byMonthDay=byMonthDay.split(',');
							for(var rj=0; rj<byMonthDay.length;rj++)
							{
								if(parseInt(byMonthDay[rj],10)==-1)
								{
									$('#repeat_year_custom_select1').val('last').change();
									$('#repeat_year_custom_select2').val("DAY");
									
								}
								else
									$('#year_custom1 .customTable td[data-type="'+(parseInt(byMonthDay[rj],10))+'"]').addClass('selected');
							}
							isMonthDay=true;
						}
						else if(pars[ri].indexOf("BYMONTH=")!=-1)
						{
							var byMonth=pars[ri].split('=')[1];
							byMonth=byMonth.split(',');
							for(var rj=0; rj<byMonth.length;rj++)
								$('#year_custom3 .customTable td[data-type="'+(parseInt(byMonth[rj],10)-1)+'"]').addClass('selected');
						}
					}
				}
				
				if(calEvent.after=='' && calEvent.untilDate=='')
					$("#repeat_end_details option[value='never']").prop('selected', true);
				else if(calEvent.after!='')
				{
					$("#repeat_end_details option[value='after']").prop('selected', true);
					$('#repeat_end_after').val(calEvent.after);
				}
				else if(calEvent.untilDate!='')
				{
					date=$.fullCalendar.parseDate(calEvent.untilDate);
					$("#repeat_end_details option[value='on_date']").prop('selected', true);
					var formattedRepeatDate=$.datepicker.formatDate(globalSessionDatepickerFormat, date);
					$('#repeat_end_date').val(formattedRepeatDate);
				}

				$('#repeat_interval_detail').val(calEvent.interval);
				$('#repeat_interval').show();

				if(calEvent.byDay.length>0)
				{
					var businessArray=new Array();
					if(typeof globalWeekendDays!='undefined' && globalWeekendDays!=null && globalWeekendDays.length>0)
						for(var i=0;i<7;i++)
							if(globalWeekendDays.indexOf(i)==-1)
								businessArray[businessArray.length]=i+'';
					var businessCount=0;
					var weekendCount=0;
					for(var i=0;i<byDay.length;i++)
					{
						if(businessArray.indexOf(byDay[i])!=-1)
							businessCount++;
						if(globalWeekendDays.indexOf(parseInt(byDay[i],10))!=-1)
							weekendCount++;
					
					}
					
					if(businessArray.length>0 && businessArray.length==businessCount)
					{
						$("#repeat option[value='BUSINESS']").prop('selected', true);
						$('#repeat_interval').hide();
						$('#week_custom').hide();
					}
					else if(globalWeekendDays.length>0 && globalWeekendDays.length==weekendCount)
					{
						$("#repeat option[value='WEEKEND']").prop('selected', true);
						$('#repeat_interval').hide();
						$('#week_custom').hide();
					}
				}

			}
			else
			{
				if(calEvent.type=="DAILY")
				{
					$("#repeat option[value='DAILY']").prop('selected', true);
					$('#repeat_interval [data-type="txt_interval"]').text(localization[globalInterfaceLanguage].repeatDays);
				}
				else if(calEvent.type=="WEEKLY")
				{
					$("#repeat option[value='WEEKLY']").prop('selected', true);
					$('#repeat_interval [data-type="txt_interval"]').text(localization[globalInterfaceLanguage].repeatWeeks);
				}
				else if(calEvent.type=="MONTHLY")
				{
					$("#repeat option[value='MONTHLY']").prop('selected', true);
					$('#repeat_interval [data-type="txt_interval"]').text(localization[globalInterfaceLanguage].repeatMonths);
				}
				else if(calEvent.type=="YEARLY")
				{
					$("#repeat option[value='YEARLY']").prop('selected', true);
					$('#repeat_interval [data-type="txt_interval"]').text(localization[globalInterfaceLanguage].repeatYears);
				}

				if(calEvent.after=='' && calEvent.untilDate=='')
					$("#repeat_end_details option[value='never']").prop('selected', true);
				else if(calEvent.after!='')
				{
					$("#repeat_end_details option[value='after']").prop('selected', true);
					$('#repeat_end_after').val(calEvent.after);
				}
				else if(calEvent.untilDate!='')
				{
					date=$.fullCalendar.parseDate(calEvent.untilDate);
					$("#repeat_end_details option[value='on_date']").prop('selected', true);
					var formattedRepeatDate=$.datepicker.formatDate(globalSessionDatepickerFormat, date);
					$('#repeat_end_date').val(formattedRepeatDate);
				}

				$('#repeat_interval_detail').val(calEvent.interval);
				$('#repeat_interval').show();

				if(calEvent.byDay.length>0)
				{
					if(calEvent.byDay.indexOf('1')!=-1 && calEvent.byDay.indexOf('2')!=-1 && calEvent.byDay.indexOf('3')!=-1 && calEvent.byDay.indexOf('4')!=-1 && calEvent.byDay.indexOf('5')!=-1 && calEvent.byDay.indexOf('6')==-1 && calEvent.byDay.indexOf('0')==-1)
					{
						$("#repeat option[value='BUSINESS']").prop('selected', true);
						$('#repeat_interval').hide();
					}
					else if(calEvent.byDay.indexOf('1')==-1 && calEvent.byDay.indexOf('2')==-1 && calEvent.byDay.indexOf('3')==-1 && calEvent.byDay.indexOf('4')==-1 && calEvent.byDay.indexOf('5')==-1 && calEvent.byDay.indexOf('6')!=-1 && calEvent.byDay.indexOf('0')!=-1)
					{
						$("#repeat option[value='WEEKEND']").prop('selected', true);
						$('#repeat_interval').hide();
					}
				}
			$('#repeatEvent').val(true);
			}
		}
		else
			$('#repeatEvent').val(false);

		if(calEvent.timeZone)
			showTimezones(calEvent.timeZone,'');
		else
			showTimezones('local','');
	}

	var year,
	month,
	day,
	hour,
	minute;
	if(mod=='show')
		$('#show').val(calEvent.id);
	if(mod=='show' || mod=='drop')
	{
		$('#repeatCount').val(calEvent.repeatCount);
		if(calEvent.realStart && (mod!='drop' || repeatOne!='editOnly'))
			date=calEvent.realStart;
		else
			date=calEvent.start;

		if($('#show').val())
		{
			if(calEvent.repeatStart && repeatOne=='')
				date=calEvent.repeatStart;
			if(calEvent.repeatEnd && repeatOne=='')
				date_to=calEvent.repeatEnd;
		}
		if(repeatOne=='editOnly')
		{
			if((mod=='drop' && globalPrevDragEventAllDay) || (mod!='drop' && calEvent.allDay))
			{
				if(calEvent.realStart)
					$('#recurrenceID').val($.fullCalendar.formatDate(calEvent.realStart, "yyyyMMdd"));
				else
					$('#recurrenceID').val($.fullCalendar.formatDate(date, "yyyyMMdd"));
			}
			else
			{
				if(calEvent.realStart)
					$('#recurrenceID').val($.fullCalendar.formatDate(calEvent.realStart, "yyyyMMdd'T'HHmmss"));
				else
					$('#recurrenceID').val($.fullCalendar.formatDate(date, "yyyyMMdd'T'HHmmss"));
			}
		}
		else
			$('#recurrenceID').val(calEvent.rec_id);

		if(calEvent.rec_id || repeatOne=='editOnly' || repeatOne=='futureOnly')
		{
			var savedEvs=jQuery.grep(globalEventList.displayEventsArray[calEvent.res_id],function(e){if(e.id==calEvent.id && (e.repeatCount<2 || !e.repeatCount))return true});
			if(savedEvs.length>1 || (repeatOne=='futureOnly' && calEvent.repeatCount>1) || (repeatOne=='editOnly' && calEvent.type!=''))
				$('#deleteButton').attr('onclick',"updateEventFormDimensions(true);$('#CAEvent .saveLoader').show();save(false, true);");
		}
	}

	var formattedDate=$.datepicker.formatDate(globalSessionDatepickerFormat, date);
	$('#date_from').val(formattedDate);	
	if(!allDay)
	{
		$('#time_from').val($.fullCalendar.formatDate(date, (globalSessionAMPMFormat ? 'hh:mm TT' : 'HH:mm')));
		globalPrevDate=new Date(date.getTime());
	}
	else
	{
		var startDateB = new Date(date.getTime())
		if(typeof globalCalendarStartOfBusiness!='undefined' && globalCalendarStartOfBusiness!=null)
			startDateB.setHours(globalCalendarStartOfBusiness);
		else
			startDateB.setHours(0);
			
		startDateB.setMinutes(0);
		$('#time_from').val($.fullCalendar.formatDate(startDateB, (globalSessionAMPMFormat ? 'hh:mm TT' : 'HH:mm')));
		globalPrevDate=new Date(startDateB.getTime());
	}

	if(date_to==null)
		date_to=date;

	(date_to.getHours())<10 ? (hour='0'+(date_to.getHours())): (hour=date_to.getHours());
	(date_to.getMinutes())<10 ? (minute='0'+(date_to.getMinutes())): (minute=date_to.getMinutes());
	var formattedDate_to=$.datepicker.formatDate(globalSessionDatepickerFormat, date_to);
	$('#date_to').val(formattedDate_to);

	if(!allDay)
		$('#time_to').val($.fullCalendar.formatDate(date_to, (globalSessionAMPMFormat ? 'hh:mm TT' : 'HH:mm')));
	else
	{
		var endDateB = new Date(date.getTime())
		if(typeof globalCalendarEndOfBusiness!='undefined' && globalCalendarEndOfBusiness!=null)
			endDateB.setHours(globalCalendarEndOfBusiness);
		else
			endDateB.setHours(0);
		endDateB.setMinutes(0);
		$('#time_to').val($.fullCalendar.formatDate(endDateB, (globalSessionAMPMFormat ? 'hh:mm TT' : 'HH:mm')));
	}

	if($('#repeat option:selected').attr('data-type')!="repeat_no-repeat")
		$('#repeat_details').show();

	if($('#repeat_end_details option:selected').attr('data-type')=="repeat_details_on_date")
	{
		$('#repeat_end_after').hide();
		$('#repeat_end_date').show();
	}

	if($('#repeat_end_details option:selected').attr('data-type')=="repeat_details_after")
	{
		$('#repeat_end_after').show();
		$('#repeat_end_date').hide();
	}

	if($('#repeat_end_details option:selected').attr('data-type')=="repeat_details_never")
	{
		$('#repeat_end_after').hide();
		$('#repeat_end_date').hide();
	}

	if(mod=='show')
	{
		$('#saveButton').hide();
		$('#resetButton').hide();
		$('#deleteButton').hide();
		if($('#ResourceCalDAVList').find('[data-id="'+calEvent.res_id+'"]').hasClass("resourceCalDAV_item_ro"))
			$('#editButton').hide();
		$('#eventDetailsTable :input[type!="button"]').prop('disabled', true);
		$('#eventDetailsTable :input[type="text"]').prop('readonly', true);
		$('#eventDetailsTable .customTable td').addClass('disabled');
		$('#eventDetailsTable textarea').prop('readonly', true);

		/*************************** BAD HACKS SECTION ***************************/
		// here we fix the cross OS/cross broser problems (unfixable in pure CSS)
		if($.browser.webkit && !!window.chrome)	/* Chrome */
		{
			if(navigator.platform.toLowerCase().indexOf('win')==0)	/* Windows version */
			{
				$('#event_details_template').find('input').css('text-indent', '2px');
				$('#event_details_template').find('select').css({'padding-left': '0px', 'padding-right': '13px'});
			}
			else	/* non-Windows version */
				$('#event_details_template').find('input').css('text-indent', '1px');
		}
		else if($.browser.msie)	/* IE */
		{
			if(parseInt($.browser.version, 10)==10)	/* IE 10 (because there are no more conditional comments) */
			{
				$('#event_details_template').find('select').css({'padding-top': '1px', 'padding-left': '0px', 'padding-right': '0px'});
				$('#event_details_template').find('textarea').css('padding-top', '3px');
				$('#event_details_template').find('input[type=button]').css('padding-top', '2px');
			}
		}

		if($.browser.msie || $.browser.mozilla)
		{
			var newSVG=$(SVG_select_dis).attr('data-type', 'select_icon').css({'pointer-events': 'none', 'z-index': '1', 'display': 'inline', 'margin-left': '-22px', 'vertical-align': 'top', 'background-color': '#ffffff'});	// background-color = stupid IE9 bug
			$('#event_details_template').find('svg[data-type="select_icon"]').replaceWith($('<div>').append($(newSVG).clone()).html());
		}
		/*************************** END OF BAD HACKS SECTION ***************************/
		if(calEvent.etag!='')
			$('#event_calendar').val(calEvent.res_id);
	}

	if(repeatOne=='editOnly' || $('#recurrenceID').val()!='')
	{
		$('#repeat').parent().parent().css('display', 'none');
		$('#week_custom').css('display', 'none');
		$('#month_custom1').css('display', 'none');
		$('#month_custom2').css('display', 'none');
		$('#year_custom1').css('display', 'none');
		$('#year_custom2').css('display', 'none');
		$('#year_custom3').css('display', 'none');
		$('#repeat_details').css('display', 'none');
	}

	if(repeatOne=='editOnly' || repeatOne=='futureOnly' || $('#recurrenceID').val())
		$('#calendarLine').hide();

	if(calEvent && calEvent.after && repeatOne=='futureOnly')
			$('#repeat_end_after').val(calEvent.after - calEvent.realRepeatCount + 1);

	if(!globalTimeZoneSupport)
		$('.timezone_row').css('display', 'none');

	if(mod!='drop')
	{
		$('#CAEvent').show();
		$('#event_details_template').show();
		updateEventFormDimensions();
		setFormPosition(jsEvent);
	}

	checkEventFormScrollBar();
	$('#event_details_template').scrollTop(0);
}

function startEditModeEvent()
{
	$('#timezonePicker').prop('disabled', true);
	$('#EventDisabler').fadeIn(globalEditorFadeAnimation);
	$('#CAEvent .formNav').css('display', 'none');
	$('#CAEvent textarea.header').removeClass('leftspace rightspace');
	$('#editButton').hide();
	$('#saveButton').show();
	$('#resetButton').show();
	$('#deleteButton').show();
	$('#show').val('');
	$('#eventDetailsTable :input[disabled]').prop('disabled', false);
	$('#eventDetailsTable :input[type="text"]').prop('readonly', false);
	$('#eventDetailsTable .customTable td').removeClass('disabled');
	$('#eventDetailsTable textarea').prop('readonly', false);
	/*************************** BAD HACKS SECTION ***************************/
	if($.browser.msie || $.browser.mozilla)
	{
		var newSVG=$(SVG_select).attr('data-type', 'select_icon').css({'pointer-events': 'none', 'z-index': '1', 'display': 'inline', 'margin-left': '-19px', 'vertical-align': 'top', 'background-color': '#ffffff'});	// background-color = stupid IE9 bug
		$('#event_details_template').find('svg[data-type="select_icon"]').replaceWith($('<div>').append($(newSVG).clone()).html());
	}
	/*************************** END OF BAD HACKS SECTION ***************************/

	$('#name').focus();
}

function startEditModeTodo()
{
	$('#timezonePickerTODO').prop('disabled', true);
	$('#TodoDisabler').fadeIn(globalEditorFadeAnimation);
	$('#CATodo .formNav').css('display', 'none');
	$('#CATodo textarea.header').removeClass('leftspace rightspace');
	$('#editTODO').hide();
	$('#closeTODO').show();
	$('#saveTODO').show();
	$('#resetTODO').show();
	$('#deleteTODO').show();
	$('#showTODO').val('');

	$('#todoDetailsTable :input[disabled]').prop('disabled', false);
	$('#todoDetailsTable :input[type="text"]').prop('readonly', false);
	$('#todoDetailsTable textarea').prop('readonly', false);
	/*************************** BAD HACKS SECTION ***************************/
	if($.browser.msie || $.browser.mozilla)
	{
		var newSVG=$(SVG_select).attr('data-type', 'select_icon').css({'pointer-events': 'none', 'z-index': '1', 'display': 'inline', 'margin-left': '-19px', 'vertical-align': 'top', 'background-color': '#ffffff'});	// background-color = stupid IE9 bug
		$('#todo_details_template').find('svg[data-type="select_icon"]').replaceWith($('<div>').append($(newSVG).clone()).html());
	}
	/*************************** END OF BAD HACKS SECTION ***************************/

	$('#percentageSlider').slider({
		disabled: false
	});
	$('#nameTODO').focus();
}

function todo_alert_add(data_id)
{
	data_id++;

	var newTr1,
	newTr2,
	newTr3;

	newTr1='<tr data-id="'+data_id+'">'+
		'<td><label data-type="alert_TODO" for="alertTODO">alert: </label></td>'+
		'<td colspan="2">'+
		'<select class="long alertTODO" name="alert_typeTODO" data-id="'+data_id+'">'+
		'<option data-type="alert_none_TODO" value="none">none</option>'+
		'<option data-type="alert_message_TODO" value="message">message</option>'+
		'</select>'+
		'</td>'+
		'</tr>';
	newTr2='<tr class="alert_detailsTODO" style="display:none;" data-id="'+data_id+'">'+
		'<td></td>'+
		'<td colspan="2">'+
		'<select class="long alert_message_detailsTODO" name="alert_detailsTODO" data-id="'+data_id+'">'+
		'<option data-type="on_dateTODO" class="todoTimeOptions" value="on_date">On date</option>'+
		($('#todo_type').val()=='none' ? '' : '<option data-type="weeks_beforeTODO" class="todoTimeOptions" value="weeks_before">weeks before</option>'+
		'<option data-type="days_beforeTODO" class="todoTimeOptions" value="days_before">days before</option>'+
		'<option data-type="hours_beforeTODO" class="todoTimeOptions" value="hours_before">hours before</option>'+
		'<option data-type="minutes_beforeTODO" class="todoTimeOptions" value="minutes_before">minutes before</option>'+
		'<option data-type="seconds_beforeTODO" class="todoTimeOptions" value="seconds_before">seconds before</option>'+
		'<option data-type="weeks_afterTODO" class="todoTimeOptions" value="weeks_after">weeks after</option>'+
		'<option data-type="days_afterTODO" class="todoTimeOptions" value="days_after">days after</option>'+
		'<option data-type="hours_afterTODO" class="todoTimeOptions" value="hours_after">hours after</option>'+
		'<option data-type="minutes_afterTODO" class="todoTimeOptions"value="minutes_after">minutes after</option>'+
		'<option data-type="seconds_afterTODO" class="todoTimeOptions" value="seconds_after">seconds after</option>')+
		'</select>'+
		'</td>'+
		'</tr>';
	newTr3='<tr data-id="'+data_id+'" class="alert_message_dateTODO" style="display:none;">'+
		'<td></td>'+
		'<td><input data-id="'+data_id+'" data-type="PH_before_after_alert_TODO" class="small before_after_inputTODO" type="text" style="display:none;" />'+
		'<input data-id="'+data_id+'" class="date small message_date_inputTODO" data-type="PH_alarm_date_TODO" type="text" name="message_dateTODO" /><div class="invalidWrapper"><img data-type="invalidSmall" data-id="'+data_id+'" style="display: none;" src="images/error_b.svg" alt="invalid" /></div></td>'+
		'<td><input data-id="'+data_id+'" data-type="PH_alarm_time_TODO" class="time small message_time_inputTODO" type="text" name="message_timeTODO" /><div class="invalidWrapper"><img data-type="invalidSmall" data-id="'+data_id+'" style="display: none;" src="images/error_b.svg" alt="invalid" /></div></td>'+
		'<tr>';

	$('#url_trTODO').before(newTr1);
	$('#url_trTODO').before(newTr2);
	$('#url_trTODO').before(newTr3);
	translateAlerts();
	$('#todo_details_template').find('input[placeholder],textarea[placeholder]').placeholder();

	/*************************** BAD HACKS SECTION ***************************/
	// here we fix the cross OS/cross broser problems (unfixable in pure CSS)
	if($.browser.webkit && !!window.chrome)	/* Chrome */
	{
		if(navigator.platform.toLowerCase().indexOf('win')==0)	/* Windows version */
		{
			$('#todo_details_template').find('input').css('text-indent', '2px');
			$('#todo_details_template').find('select').css({'padding-left': '0px', 'padding-right': '13px'});
		}
		else	/* non-Windows version */
			$('#todo_details_template').find('input').css('text-indent', '1px');
	}
	else if($.browser.msie)	/* IE */
	{
		if(parseInt($.browser.version, 10)==10)	/* IE 10 (because there are no more conditional comments) */
		{
			$('#todo_details_template').find('select').css({'padding-top': '1px', 'padding-left': '0px', 'padding-right': '0px'});
			$('#todo_details_template').find('textarea').css('padding-top', '3px');
			$('#todo_details_template').find('input[type=button]').css('padding-top', '2px');
		}
	}

	/* IE or FF */
	if($.browser.msie || $.browser.mozilla)
	{
		// ADD empty SVG to interface (we will replace it later)
		$('<svg data-type="select_icon"></svg>').css('display', 'none').insertAfter($('#todo_details_template tr[data-id="'+data_id+'"]').find('select'));
	}

	if($.browser.msie || $.browser.mozilla)
	{
		var newSVG=$(SVG_select).attr('data-type', 'select_icon').css({'pointer-events': 'none', 'z-index': '1', 'display': 'inline', 'margin-left': '-19px', 'vertical-align': 'top', 'background-color': '#ffffff'});	// background-color = stupid IE9 bug
		$('#todo_details_template tr[data-id="'+data_id+'"]').find('svg[data-type="select_icon"]').replaceWith($('<div>').append($(newSVG).clone()).html());
	}
	/*************************** END OF BAD HACKS SECTION ***************************/
}

function event_alert_add(data_id)
{
	data_id++;

	var newTr1,
	newTr2,
	newTr3;

	newTr1='<tr data-id="'+data_id+'">'+
		'<td><label data-type="alert" for="alert">alert: </label></td>'+
		'<td colspan="2">'+
		'<select class="long alert" name="alert_type" data-id="'+data_id+'">'+
		'<option data-type="alert_none" value="none">none</option>'+
		'<option data-type="alert_message" value="message">message</option>'+
		'</select>'+
		'</td>'+
		'</tr>';
	newTr2='<tr data-id="'+data_id+'" class="alert_details" style="display:none;">'+
		'<td></td>'+
		'<td colspan="2">'+
		'<select class="long alert_message_details" name="alert_details" data-id="'+data_id+'">'+
		'<option data-type="on_date" value="on_date">On date</option>'+
		($('#allday').prop('checked') ? '' : '<option data-type="weeks_before" value="weeks_before">weeks before</option>'+
			'<option data-type="days_before" value="days_before">days before</option>'+
			'<option data-type="hours_before" value="hours_before">hours before</option>'+
			'<option data-type="minutes_before" value="minutes_before">minutes before</option>'+
			'<option data-type="seconds_before" value="seconds_before">seconds before</option>'+
			'<option data-type="weeks_after" value="weeks_after">weeks after</option>'+
			'<option data-type="days_after" value="days_after">days after</option>'+
			'<option data-type="hours_after" value="hours_after">hours after</option>'+
			'<option data-type="minutes_after" value="minutes_after">minutes after</option>'+
			'<option data-type="seconds_after" value="seconds_after">seconds after</option>')
		+
		'</select>'+
		'</td>'+
		'</tr>';
	newTr3='<tr data-id="'+data_id+'" class="alert_message_date" style="display:none;">'+
		'<td></td>'+
		'<td><input class="small before_after_input" data-type="PH_before_after_alert" type="text" data-id="'+data_id+'" style="display:none;" />'+
		'<input class="date small message_date_input" data-type="PH_alarm_date" type="text" data-id="'+data_id+'" /><div class="invalidWrapper"><img data-type="invalidSmall" data-id="'+data_id+'" style="display: none;" src="images/error_b.svg" alt="invalid" /></div></td>'+
		'<td><input class="time small message_time_input" data-type="PH_alarm_time" type="text" data-id="'+data_id+'" /><div class="invalidWrapper"><img data-type="invalidSmall" data-id="'+data_id+'" style="display: none;" src="images/error_b.svg" alt="invalid" /></div></td>'+
		'<tr>';

	$('#url_tr').before(newTr1);
	$('#url_tr').before(newTr2);
	$('#url_tr').before(newTr3);

	translateAlerts();
	$('#event_details_template').find('input[placeholder],textarea[placeholder]').placeholder();
	

	/*************************** BAD HACKS SECTION ***************************/
	// here we fix the cross OS/cross broser problems (unfixable in pure CSS)
	if($.browser.webkit && !!window.chrome)	/* Chrome */
	{
		if(navigator.platform.toLowerCase().indexOf('win')==0)	/* Windows version */
		{
			$('#event_details_template').find('input').css('text-indent', '2px');
			$('#event_details_template').find('select').css({'padding-left': '0px', 'padding-right': '13px'});
		}
		else	/* non-Windows version */
			$('#event_details_template').find('input').css('text-indent', '1px');
	}
	else if($.browser.msie)	/* IE */
	{
		if(parseInt($.browser.version, 10)==10)	/* IE 10 (because there are no more conditional comments) */
		{
			$('#event_details_template').find('select').css({'padding-top': '1px', 'padding-left': '0px', 'padding-right': '0px'});
			$('#event_details_template').find('textarea').css('padding-top', '3px');
			$('#event_details_template').find('input[type=button]').css('padding-top', '2px');
		}
	}

	/* IE or FF */
	if($.browser.msie || $.browser.mozilla)
	{
		// ADD empty SVG to interface (we will replace it later)
		$('<svg data-type="select_icon"></svg>').css('display', 'none').insertAfter($('#event_details_template tr[data-id="'+data_id+'"]').find('select'));
	}

	if($.browser.msie || $.browser.mozilla)
	{
		var newSVG=$(SVG_select).attr('data-type', 'select_icon').css({'pointer-events': 'none', 'z-index': '1', 'display': 'inline', 'margin-left': '-19px', 'vertical-align': 'top', 'background-color': '#ffffff'});	// background-color = stupid IE9 bug
		$('#event_details_template tr[data-id="'+data_id+'"]').find('svg[data-type="select_icon"]').replaceWith($('<div>').append($(newSVG).clone()).html());
	}
	/*************************** END OF BAD HACKS SECTION ***************************/
}
