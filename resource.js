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

function CalDAVloadResources(resourceCalDAVList, forceLoad)
{
	if(forceLoad!=true && globalWindowFocus==false)
		return false;

	if(!(resourceCalDAVList instanceof Array))
		resourceCalDAVList=[resourceCalDAVList];

	var isLast=false;
	CalDAVnetFindResource(resourceCalDAVList[0], forceLoad, 0);
}

// ResourceCalDAVList Class
function ResourceCalDAVList()
{
	this.collections=new Array();
	this.TodoCollections=new Array();
	this.calendarsLoaded=null;
	this.counterList=new Array();
	this.sortedTodoCollections=new Array();
	this.sortedCollections=new Array();

	this.reset=function()
	{
		this.TodoCollections.splice(0, this.TodoCollections.length);
		this.collections.splice(0, this.collections.length);
		this.counterList=new Array();
		this.sortedTodoCollections=new Array();
		this.sortedCollections=new Array();
	}

	// resource header value
	this.getHeaderValue=function(inputResource)
	{
		if(typeof inputResource.hrefLabel=='string' && inputResource.hrefLabel!='')
			var result=inputResource.hrefLabel;
		else
		{
			if(!inputResource.subscription)
			{
				var re=new RegExp('^(https?://)([^@/]+(?:@[^@/]+)?)@([^/]+).*/([^/]*)/','i');
				var tmp=inputResource.accountUID.match(re);
				var result=tmp[3].replace(RegExp(':[0-9]+$'),'')+'/'+decodeURIComponent(tmp[4]).replace(RegExp('(@.*)?$'),'');
			}
			else
				result = localization[globalInterfaceLanguage].txtSubscribed;
		}
		if(typeof globalResourceHeaderShowLogin!='undefined' && globalResourceHeaderShowLogin==true && !inputResource.subscription)
			result+=' ['+inputResource.userAuth.userName.replace(RegExp('@.*$'),'')+']';
		
		return result;
	}

	this.getSortKey=function(inputResource, resourceSortMode, index)
	{
		var re=new RegExp('^(https?://)([^@/]+(?:@[^@/]+)?)@([^/]+)(.*/)([^/]+/)([^/]+/)([^/]*)', 'i');
		var tmp=inputResource.uid.match(re);
		var firstPart='';
		if(!inputResource.subscription)
			firstPart='A';
		else
			firstPart='B';
		if(typeof resourceSortMode=='undefined' || resourceSortMode)
			firstPart+=tmp[1]+tmp[3]+'/'+tmp[5];
		else
		{
			if(tmp[5].charAt(tmp[5].length-1)=='/')
			tmp[5]=tmp[5].substring(0, tmp[5].length-1);
			
			firstPart+=index.pad(String(globalAccountSettings.length).length);
		}
		return firstPart+' '+inputResource.userAuth.userName+' '+inputResource.displayvalue;
	}

	// Resource list is not sorted, instead "insert sort" is performed
	this.insertResource=function(inputResource, index, isEvent)
	{
		inputResource.sortkey=this.getSortKey(inputResource, globalResourceAlphabetSorting, index);
		var collObject={};
		var todoString = '';
		if(isEvent)
			collObject = this.collections;
		else
		{
			collObject = this.TodoCollections;
			todoString = 'TODO';
		}
			
		// do not insert entry with duplicate UID
		for(var i=0;i<collObject.length;i++)
			if(collObject[i].uid==inputResource.uid)
			{
				collObject[i].urlArray={};
				if(collObject[i].displayvalue==inputResource.displayvalue && collObject[i].permissions.read_only==inputResource.permissions.read_only)
				{
					collObject[i]=$.extend(inputResource, {fcSource: collObject[i].fcSource, syncToken: collObject[i].syncToken, forceSyncPROPFIND: collObject[i].forceSyncPROPFIND});
					return 0;
				}
				else
				{
					// the collection name is changed and must be moved to correct place (we first remove it and then reinsert)
					this.removeResource(inputResource.uid, false,isEvent);
					break;
				}
			}

		// create header
		var headerObject={headerOnly: true, displayvalue: this.getHeaderValue(inputResource), index:0};
		// find the index where to insert the new resource
		var insertIndex=collObject.length;

		for(var i=0;i<collObject.length;i++)
			if(collObject[i].headerOnly==undefined && collObject[i].sortkey.customCompare(inputResource.sortkey, globalSortAlphabet, 1, false)==1)
			{
				insertIndex=i;
				// if the object predecessor is header which is different from current header we must go upward
				if(i>0 && collObject[i-1].headerOnly==true && collObject[i-1].displayvalue!=headerObject.displayvalue)
					--insertIndex;
				break;
			}

		// check for header existence
		var headerMiss=1;
		for(var i=0;i<collObject.length;i++)
			if(collObject[i].headerOnly==true && collObject[i].displayvalue==headerObject.displayvalue)
			{
				
				headerMiss=0;
				break;
			}
		// insert header if not exists
		if(headerMiss)
		{	
			headerObject.index=insertIndex;
			collObject.splice(insertIndex, 0, headerObject);
		}

		// insert the resource
		if(collObject.length==1 && globalCalDAVInitLoad)
			$('#SystemCalDAV .fc-header-center ').addClass('r_operate_all');

		this.counterList[inputResource.uid]={collectionLength: 0, counter: 0, uid: inputResource.uid, isLoading: false, isSaving: false};
		
		collObject.splice(insertIndex+headerMiss, 0, inputResource);
		
		if(!isEvent)
		{
			globalEventList.displayTodosArray[inputResource.uid]=new Array();
			globalEventList.todos[inputResource.uid]={};
		}
		else
		{
			globalEventList.displayEventsArray[inputResource.uid]=new Array();
			globalEventList.events[inputResource.uid]={};
		}

		var str=inputResource.href.substring(0, inputResource.href.length-1);
		if(headerMiss)
		{
			if(!inputResource.subscription)
				var str2=str.substring(0, str.lastIndexOf('/'));
			else 
				var str2='subscribed';
			var newElement=$('#ResourceCalDAV'+todoString+'ListTemplate').find('.resourceCalDAV'+todoString+'_header').clone().wrap('<div>');
			//newElement=newElement.text(headerObject.displayvalue);
			newElement=newElement.html("<span style='cursor:pointer;margin-left:1px;padding-top:1px;' value='+"+str2+"'><img class='add_rem_ctrl' alt='"+localization[globalInterfaceLanguage].resourceEnable+"' title='"+localization[globalInterfaceLanguage].resourceEnable+"' src='images/add_cal.svg' /></span><span style='cursor:pointer;margin-left:3px;margin-right:6px;padding-top:1px;' value='-"+str2+"'><img class='add_rem_ctrl' alt='"+localization[globalInterfaceLanguage].resourceDisable+"' title='"+localization[globalInterfaceLanguage].resourceDisable+"' src='images/remove_cal.svg' /></span><div class='resourceCalDAVText'>"+$('<div/>').text(headerObject.displayvalue).html()+"</div>");

			if(typeof inputResource.showHeader!='undefined' && !inputResource.showHeader)
				newElement=newElement.css('display', 'none');

			newElement=newElement.parent().html();
			$('#ResourceCalDAV'+todoString+'List').children().eq(insertIndex).after(newElement);
			
			if(!inputResource.subscription)
			{
				/*$('#ResourceCalDAV'+todoString+'List').find('[value^="-'+str.substring(0, str.lastIndexOf('/'))+'"]').click(function(){
					disableResource($(this).parent());
				});

				$('#ResourceCalDAV'+todoString+'List').find('[value^="+'+str.substring(0, str.lastIndexOf('/'))+'"]').click(function(){
					enableResource($(this).parent());
				});*/
				
				var minus = $('#ResourceCalDAV'+todoString+'List').find('[value^="-'+str.substring(0, str.lastIndexOf('/'))+'"]');
				var plus = $('#ResourceCalDAV'+todoString+'List').find('[value^="+'+str.substring(0, str.lastIndexOf('/'))+'"]');
				
				if(todoString=='')
				{
					minus.click(function(){
						disableResource($(this).parent());
					})
					plus.click(function(){
						enableResource($(this).parent());
					})
				}
				else
				{
					minus.click(function(){
						disableResourceTodo($(this).parent());
					})
					plus.click(function(){
						enableResourceTodo($(this).parent());
					})
				}
			}
			else
			{
				
				$('#ResourceCalDAV'+todoString+'List').find('[value^="-subscribed"]').click(function(){
					disableResource($(this).parent());
				});

				$('#ResourceCalDAV'+todoString+'List').find('[value^="+subscribed"]').click(function(){
					enableResource($(this).parent());
				});
			}
		}

		// insert the resource to interface
		var newElement = $('#ResourceCalDAV'+todoString+'ListTemplate').find('.resourceCalDAV'+todoString+'_item').clone().wrap('<div>');
		var par=inputResource.uid.split('/');

		if(inputResource.permissions.read_only)
			newElement.addClass('resourceCalDAV_item_ro');

		var checked='';
		if(todoString=='')
		{
			if(vR.indexOf(inputResource.uid)==-1)
				checked="checked='checked'";
		}
		else
		{
			if(vRTodo.indexOf(inputResource.uid)==-1)
				checked="checked='checked'";
		}
		newElement=newElement.attr('data-id', inputResource.uid);
		if(globalCalDAVInitLoad)
			newElement=newElement.addClass('r_operate');
			
		newElement=newElement.html("<div class='resourceCalDAVColor' style='background:"+inputResource.ecolor+";'></div><input type='checkbox' name="+inputResource.uid+" "+checked+" value='ok'/>"+$('<div/>').text(inputResource.displayvalue).html());
		newElement=newElement.parent().html();
		$('#ResourceCalDAV'+todoString+'List').children().eq(insertIndex+headerMiss).after(newElement);

		var checkC=$('#ResourceCalDAV'+todoString+'List').find('[name^="'+inputResource.uid+'"]');
		if(todoString=='TODO')
		{
			checkC.click(function(evt){
				evt.stopPropagation();

				if(this.checked==true)
					enableCalendarTodo(inputResource.uid);
				else
					disableCalendarTodo(inputResource.uid);
			});
		}
		else
		{
			checkC.click(function(evt){
				evt.stopPropagation();

				if(this.checked==true)
					enableCalendar(inputResource.uid);
				else
					disableCalendar(inputResource.uid);
			});
		}
	
	$('#ResourceCalDAV'+todoString+'List').find('[data-id^="'+inputResource.uid+'"]').click(function(){
			var check=$('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV'+todoString+'_item.resourceCalDAV_item_selected');
			if(check!='')
				check.removeClass("resourceCalDAV_item_selected");

			$('#ResourceCalDAV'+todoString+'List').find('[data-id^="'+inputResource.uid+'"]').addClass('resourceCalDAV_item_selected');
		});
		if(!globalCalDAVInitLoad)
		{
			if(inputResource.listType=='vevent')
				CalDAVnetLoadCollection(inputResource, false, globalResourceCalDAVList.collections.length-1, globalResourceCalDAVList.collections);
			else
				CalDAVnetLoadCollection(inputResource, false, globalResourceCalDAVList.TodoCollections.length-1, globalResourceCalDAVList.TodoCollections);
		}
	}

	this.removeOldResources=function(inputUidBase, inputTimestamp)
	{
		var tmp=inputUidBase.match(RegExp('^(https?://)(.*)', 'i'));
		var inputHref=tmp[2];
		for(var i=this.collections.length-1;i>=0;i--)
		{
			//console.log(this.collections[i]);
			if(this.collections[i]!=undefined && !this.collections[i].subscription && this.collections[i].timestamp!=undefined && this.collections[i].accountUID.indexOf(inputHref)!=-1 && this.collections[i].timestamp<inputTimestamp)
			{
				var uidRemoved=this.collections[i].uid;
				//if(globalEventList.displayEventsArray[uidRemoved].length>0) 
				//{
					$('#calendar').fullCalendar('removeEventSource', this.collections[i].fcSource);
					if(globalDisplayHiddenEvents)
					{
						for(var k=1;k<globalResourceCalDAVList.collections.length;k++)
						{
							if(globalResourceCalDAVList.collections[k].uid!=undefined)
							{
								var pos=vR.indexOf(globalResourceCalDAVList.collections[k].uid);
								if(pos!=-1)
									$("#SystemCalDAV div [data-res-id='"+globalResourceCalDAVList.collections[k].uid+"']").addClass('checkCalDAV_hide');
							}
						}
					}
				//}
				var item=$('#ResourceCalDAVList').find('[data-id^="'+jqueryEscapeSelector(this.collections[i].uid)+'"]');
				var item_prev=item.prev();
				item.remove();
				this.collections.splice(i, 1);

				// if next item is undefined or it is a header and the previous item is header delete it
				if((this.collections[i]==undefined || this.collections[i].headerOnly==true) && this.collections[i-1].headerOnly==true)
				{
					item_prev.remove();
					this.collections.splice(--i, 1);
				}
			}
		}
		for(var i=this.TodoCollections.length-1;i>=0;i--)
		{
			//console.log(this.collections[i]);
			if(this.TodoCollections[i]!=undefined && !this.TodoCollections[i].subscription && this.TodoCollections[i].timestamp!=undefined && this.TodoCollections[i].accountUID.indexOf(inputHref)!=-1 && this.TodoCollections[i].timestamp<inputTimestamp)
			{
				var uidRemoved=this.TodoCollections[i].uid;
				//if(globalEventList.displayEventsArray[uidRemoved].length>0) 
				//{
					$('#todoList').fullCalendar('removeEventSource', this.TodoCollections[i].fcSource);
					
				//}
				var item=$('#ResourceCalDAVTODOList').find('[data-id^="'+jqueryEscapeSelector(this.TodoCollections[i].uid)+'"]');
				var item_prev=item.prev();
				item.remove();
				this.TodoCollections.splice(i, 1);

				// if next item is undefined or it is a header and the previous item is header delete it
				if((this.TodoCollections[i]==undefined || this.TodoCollections[i].headerOnly==true) && this.TodoCollections[i-1].headerOnly==true)
				{
					item_prev.remove();
					this.TodoCollections.splice(--i, 1);
				}
			}
		}
	}

	this.removeResource=function(inputUid, loadNext,isEvent)
	{
		if(idEvent)
			for(var i=this.collections.length-1;i>=0;i--)
				if(this.collections[i]!=undefined && this.collections[i].timestamp!=undefined && this.collections[i].uid.indexOf(inputUidBase)==0 && this.collections[i].timestamp<inputTimestamp)
				{
					var uidRemoved=this.collections[i].uid;
					var item=$('#ResourceCalDAVList').find('[data-id^="'+jqueryEscapeSelector(this.collections[i].uid)+'"]');
					var item_prev=item.prev();
					item.remove();
					this.collections.splice(i, 1);

					// if next item is undefined or it is a header and the previous item is header delete it
					if((this.collections[i]==undefined || this.collections[i].headerOnly==true) && this.collections[i-1].headerOnly==true)
					{
						item_prev.remove();
						this.collections.splice(--i, 1);
					}
				}
		else
			for(var i=this.TodoCollections.length-1;i>=0;i--)
				if(this.TodoCollections[i]!=undefined && this.TodoCollections[i].timestamp!=undefined && this.TodoCollections[i].uid.indexOf(inputUidBase)==0 && this.TodoCollections[i].timestamp<inputTimestamp)
				{
					var uidRemoved=this.TodoCollections[i].uid;
					var item=$('#ResourceCalDAVTODOList').find('[data-id^="'+jqueryEscapeSelector(this.collections[i].uid)+'"]');
					var item_prev=item.prev();
					item.remove();
					this.collections.splice(i, 1);

					// if next item is undefined or it is a header and the previous item is header delete it
					if((this.TodoCollections[i]==undefined || this.TodoCollections[i].headerOnly==true) && this.TodoCollections[i-1].headerOnly==true)
					{
						item_prev.remove();
						this.TodoCollections.splice(--i, 1);
					}
				}
	}

	this.getCollectionByUID=function(inputUID)
	{
		for(var i=0;i<this.collections.length;i++)
		{
			if(this.collections[i].uid==inputUID)
				return this.collections[i];
		}
		for(var i=0;i<this.TodoCollections.length;i++)
		{
			if(this.TodoCollections[i].uid==inputUID)
				return this.TodoCollections[i];
		}
		return null;
	}
	this.getEventCollectionByUID=function(inputUID)
	{
		for(var i=0;i<this.collections.length;i++)
		{
			if(this.collections[i].uid==inputUID)
				return this.collections[i];
		}
		return null;
	}
	this.getTodoCollectionByUID=function(inputUID)
	{
		for(var i=0;i<this.TodoCollections.length;i++)
		{
			if(this.TodoCollections[i].uid==inputUID)
				return this.TodoCollections[i];
		}
		return null;
	}
	this.getTodoCollectionAndIndexByUID=function(inputUID)
	{
		for(var i=0;i<this.TodoCollections.length;i++)
		{
			if(this.TodoCollections[i].uid==inputUID)
				return {coll:this.TodoCollections[i],index:i};
		}
		return null;
	}

	this.getResources=function()
	{
		return this.collections;
	}

	this.getSyncResourceArray=function()
	{
		return this.syncResourceArray;
	}
}
