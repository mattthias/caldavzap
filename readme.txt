Easy setup:
The easiest way to use this client is to copy it into DAViCal subdirectory (usually /usr/share/davical/htdocs/)
  and accessing this subdirectory by a browser (this is "easy setup" and it not requires any additional configuration).


Complete instructions:

1.) First always try your setup without SSL!
2.) Optional Apache configuration (use to disable caching and other settings in .htaccess):
    <Directory /client/directory/>
        AllowOverride FileInfo Limit
        Order allow,deny
        allow from all
    </Directory>

Normal setup:
- copy the source code into your server directory
- set the href value (URL to your server - not resource!), for example: http://server.com:8080/caldav.php/ (see config.js for more examples)
- open the client web page, try to login and check the console log in your browser
    - if the crossDomain settings is automatically detected as false you are done
    - otherwise:
        - DAViCal: update your Apache configuration (on the server where your Davical is installed) and reload the Apache (see misc/config_davical.txt)
        - OS X: patch your OS X calendarserver installation and update your settings (see misc/readme_lion.txt)
        - Other: add required headers for cross-domain setup to your server software (for inspiration see misc/config_davical.txt)

Devel setup (recommended only for skilled developers):
- copy the source code into your server directory and update the globalAccountSettings in config.js
    note: if you want to set the crossDomain value in globalAccountSettings manually (by default it is automatically detected),
        set it to true if the client origin (protocol,domain,port) is not exactly the same as your Davical origin, otherwise set it to false
        for example:
            Davical installation: http://my.server.com:8080/
            client installation: http://my.server.com/ (the default port for http is 80)
            =>    crossDomain=true (the port is not the same)

            Davical installation: http://my.server.com/ (the default port for http is 80)
            client installation: http://my.server.com/client/ (the default port for http is 80)
            =>    crossDomain=false (the protocol,domain and also the port is the same)

            Davical installation: http://server.com/ (the default port for http is 80)
            client installation: http://www.server.com/client/ (the default port for http is 80)
            =>    crossDomain=true (the domain is not the same)

            Davical installation: https://server.com:8443/
            client installation: http://server.com/client/ (the default port for http is 80)
            =>    crossDomain=true (the protocol and the port is not the same)
- note: if your crossDomain is set manually to true (or it is automatically set to true by the client itself /see the console log/),
    you need to update your Apache configuration (on the server where your DAViCal is installed) and reload the Apache (see misc/config_davical.txt)
- done :)

Special setup = instead of storing the configuration statically in config.js generate it dynamically as XML (requires PHP >= 5.3):
- copy the source code into your server directory, disable the globalAccountSettings and update the
    globalNetworkAccountSettings in config.js:
      the href value must be set to your client installation auth directory
- update your auth/config.inc:
    set the $config['auth_method'] to 'generic' (this is the default)
    set the $config['accounts'] - usually you need to change only the "http://www.server.com:80" part of the
      href value but you can also change the syncinterval and timeout values
    set the $config['auth_send_authenticate_header'] to true
- update your auth/plugins/generic_conf.inc:
    set the $pluginconfig['base_url'] to your Davical installation URL
- visit the auth directory manually by browser and enter your Davical username and password - you will get
    a configuration XML for your installation (if not, check your previous settings again)
- update your auth/config.inc:
    set the $config['auth_send_authenticate_header'] back to false
- see step 3 in "Normal setup"
- done :)

Secure setup:
- use SSL (https instead of http)

If something not works check the console log in your browser.
