<?php
    // LDAP configuration parameters
    $pluginconfig['host']='ldaps://ldap.server.com/';
    $pluginconfig['basedn']='ou=People,dc=server,dc=com';
    $pluginconfig['user_attr']='uid';

    // optional
    $pluginconfig['filter']='accountStatus=active';
?>