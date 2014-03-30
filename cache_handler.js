// OFFLINE CACHE DEBUGGING

/*var cacheStatusValues=[];
cacheStatusValues[0]='uncached';
cacheStatusValues[1]='idle';
cacheStatusValues[2]='checking';
cacheStatusValues[3]='downloading';
cacheStatusValues[4]='updateready';
cacheStatusValues[5]='obsolete';

var cache=window.applicationCache;
cache.addEventListener('cached', logEvent, false);
cache.addEventListener('checking', logEvent, false);
cache.addEventListener('downloading', logEvent, false);
cache.addEventListener('error', logEvent, false);
cache.addEventListener('noupdate', logEvent, false);
cache.addEventListener('obsolete', logEvent, false);
cache.addEventListener('progress', logEvent, false);
cache.addEventListener('updateready', logEvent, false);

function logEvent(e)
{
	var online, status, type, message;
	online=(navigator.onLine) ? 'yes' : 'no';
	status=cacheStatusValues[cache.status];
	type=e.type;
	message='online: '+online;
	message+=', event: '+type;
	message+=', status: '+status;
	if(type=='error' && navigator.onLine)
		message+=' (prolly a syntax error in manifest)';
	console.log(message);
}

window.applicationCache.addEventListener('updateready', function(){
		window.applicationCache.swapCache();
		console.log('swap cache has been called');
	}, false
);

//setInterval(function(){cache.update()}, 10000);*/

// Check if a new cache is available on page load.
//window.addEventListener('load', function(e){

window.applicationCache.addEventListener('cached', function(e){
	if(true)
	{
		// Browser downloaded a new app cache.
		// Swap it in and reload the page to get the new hotness.
		window.location.reload();
	}
	else
	{
		// Manifest didn't changed. Nothing new to server.
		$('#LoginPage .window').css('display', 'inline-block');
	}
}, false);

window.applicationCache.addEventListener('updateready', function(e){
	if(window.applicationCache.status == window.applicationCache.UPDATEREADY)
	{
		// Browser downloaded a new app cache.
		// Swap it in and reload the page to get the new hotness.
		window.applicationCache.swapCache();
		window.location.reload();
	}
	else
	{
		// Manifest didn't changed. Nothing new to server.
		$('#LoginPage .window').css('display', 'inline-block');
	}
}, false);

window.applicationCache.addEventListener('obsolete', function(e){
	if(window.applicationCache.status == window.applicationCache.OBSOLETE)
	{
		// Browser downloaded a new app cache.
		// Swap it in and reload the page to get the new hotness.
		window.location.reload();
	}
	else
	{
		// Manifest didn't changed. Nothing new to server.
		$('#LoginPage .window').css('display', 'inline-block');
	}
}, false);

window.applicationCache.addEventListener('noupdate', function(e){
	$('#LoginPage .window').css('display', 'inline-block');
}, false);

//}, false);
