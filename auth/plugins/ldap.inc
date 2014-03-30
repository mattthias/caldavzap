<?php
    require_once(dirname(__FILE__).'/ldap_conf.inc');

    function ldap_authenticate()
    {
	global $pluginconfig;
	if($_SERVER['PHP_AUTH_USER']!="" && $_SERVER['PHP_AUTH_PW']!="")
	{
	    $ds = ldap_connect($pluginconfig['host']);
	    $r  = ldap_search($ds, $pluginconfig['basedn'], '(&('.$pluginconfig['user_attr'].'='.$_SERVER['PHP_AUTH_USER'].')'.(isset($pluginconfig['filter']) && $pluginconfig['filter']!='' ? '('.$pluginconfig['filter'].')' : '' ).')');
	    if($r)
	    {
		$result = @ldap_get_entries($ds, $r);
		if($result[0])
		{
		    @ldap_set_option($ds, LDAP_OPT_PROTOCOL_VERSION, 3);
		    if(@ldap_bind($ds, $result[0]['dn'], $_SERVER['PHP_AUTH_PW']))
		    {
			@ldap_unbind($bi);
			return 1;	// Auth successful
		    }
		}
	    }
	    return -1;	// Auth unsuccessful
	}
	return 0;	// Empty username or password
    }
?>