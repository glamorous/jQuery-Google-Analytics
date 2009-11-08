/**
 * @author Jonas De Smet
 * @version  0.5
 * @date 2009-11-06
 * 
 * Glamorous Google Analytics - Let you track your website with Google Analytics
 * Documentation and usage in README file
 * 
 */
(function($) {
	// Redefine getScript for caching perspectives
	$.getScript = function(url, callback, errorhandling, cache){ $.ajax({ type: "GET", url: url, success: callback, error: errorhandling, dataType: "script", cache: cache }); }; 
	
	// Call for whole page with all elements by default
	$.glamGA = function(uatracker, settings)
	{
		settings = $.extend({}, $.glamGA.defaults, settings);
		var DEBUG = (settings.debug) ? true : false;
		var pluginname = 'Glamorous GA (global)';
		var domain = document.location.hostname;
		var external = [];
		var mails = [];
		var files = [];
		
		if(domain != 'localhost' || settings.localhost)
		{
			if(DEBUG){$.glamLog(pluginname,'Google Analytics enabled', 'INFO');}
			init();
		}
		else
		{
			if(DEBUG){$.glamLog(pluginname,'Google Analytics disabled', 'WARN');}
		}
		
		function init()
		{	
			//decide if the host is with SSL or not
			var gaHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
			
			try
			{
				//use jQuery to call the Google Analytics JavaScript
				$.getScript(gaHost + "google-analytics.com/ga.js", function(){
					if(DEBUG){$.glamLog(pluginname,'Google Analytics ga.js file loaded succesful', 'INFO');}
					setupTracking();						
				}, function(){
					if(DEBUG){$.glamLog(pluginname,'Google Analytics ga.js file failed to load:' + err, 'ERROR');}
				}, true);
			} 
			catch(err) 
			{
				if(DEBUG){$.glamLog(pluginname,'A unexpected error has just been triggered', 'ERROR');}
			}			
		}
		
		function setupTracking()
		{
			// Get Tracker
			try {
				var pageTracker = _gat._getTracker(uatracker);
				if(DEBUG){$.glamLog(pluginname,'Google Analytics pageTracker received successful', 'INFO');}
			}
			catch(err) 
			{
				if(DEBUG){$.glamLog(pluginname,'Google Analytics pageTracker failed to receive: ' + err, 'ERROR');}
			}
			
			//Track view for this page
			if(settings.trackPage)
			{
				pageTracker._trackPageview();
				if(DEBUG){$.glamLog(pluginname,'trackPage enabled', 'INFO');}
			}
			else
			{
				if(DEBUG){$.glamLog(pluginname,'trackPage disabled', 'WARN');}
			}
			
			//Extract all the links from the page and store them in arrays
			var links = $('a');
			var l_length = links.length;
			for (i=0;i<l_length;i++)
			{
				var href = $(links[i]).attr('href');
				
				if ((href.match(/^https?\:/i)) && (!href.match(document.domain)))
				{
					external.push(links[i]);
				}
				else if (href.match(/^mailto\:/i))
				{
					mails.push(links[i]);
				}
				else if($.inArray(href.split('.')[href.split('.').length - 1], settings.filetypes) >= 0)
				{
					files.push(links[i]);
				}
			}
			
			if(DEBUG)
			{
				$.glamLog(pluginname,'#external links = '+external.length, 'LOG');
				$.glamLog(pluginname,'#mailto links = '+mails.length, 'LOG');
				$.glamLog(pluginname,'#download links = '+files.length, 'LOG');
			}
			
			//Track all external links
			if(settings.trackLinks)
			{
				$(external).click(function(){
					var link = $(this);
					var linktxt = (link.attr('title') != '' && settings.titleLinks) ? link.attr('title') + ' [' + link.attr('href').replace(/^https?\:\/\//i, '') + ']' : link.attr('href').replace(/^https?\:\/\//i, '');
					pageTracker._trackEvent(settings.categoryLinks, 'Visit', linktxt);
				});
				if(DEBUG){$.glamLog(pluginname,'trackLinks enabled', 'INFO');}
			}
			else
			{
				if(DEBUG){$.glamLog(pluginname,'trackLinks disabled', 'WARN');}
			}
			
			
			//Track all mailto links
			if(settings.trackMails)
			{
				$(mails).click(function(){
					var email = $(this);
					var emailtxt = email.attr('href').substring(7);
					pageTracker._trackEvent(settings.categoryMails, 'Click', emailtxt);
				});
				if(DEBUG){$.glamLog(pluginname,'trackMails enabled', 'INFO');}
			}
			else
			{
				if(DEBUG){$.glamLog(pluginname,'trackMails disabled', 'WARN');}
			}
			
			
			//Track all files links
			if(settings.trackFiles)
			{
				$(files).click(function(){
					var file = $(this);
					var filehref = file.attr('href');
					var fileext = filehref.split('.')[filehref.split('.').length - 1];
					var filename = filehref.substring(filehref.lastIndexOf('/')+1);
					pageTracker._trackEvent(settings.categoryFiles, fileext, filename);
				});
				if(DEBUG){$.glamLog(pluginname,'trackFiles enabled', 'INFO');}
			}
			else
			{
				if(DEBUG){$.glamLog(pluginname,'trackFiles disabled', 'WARN');}
			}
			
		}
			
	}
	
	// Custom call for one 'action'
	$.glamGA.customTrack = function(uatracker, settings)
	{
		settings = $.extend({}, $.glamGA.customdefaults, settings);
		var DEBUG = (settings.debug)? true : false;
		var pluginname = 'Glamorous GA (custom)';
		var domain = document.location.hostname;
		
		if(domain != 'localhost' || settings.localhost)
		{
			if(DEBUG){$.glamLog(pluginname,'Google Analytics enabled', 'INFO');}
			init();
		}
		else
		{
			if(DEBUG){$.glamLog(pluginname,'Google Analytics disabled', 'WARN');}
		}
		
		function init()
		{
			//decide if the host is with SSL or not
			var gaHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
			
			try
			{
				//use jQuery to call the Google Analytics JavaScript
				$.getScript(gaHost + "google-analytics.com/ga.js", function(){
					if(DEBUG){$.glamLog(pluginname,'Google Analytics ga.js file loaded succesful', 'INFO');}
					trackIt();				
				}, function(){
					if(DEBUG){$.glamLog(pluginname,'Google Analytics ga.js file failed to load:' + err, 'ERROR');}
				}, true);
			} 
			catch(err) 
			{
				if(DEBUG){$.glamLog(pluginname,'A unexpected error has just been triggered', 'ERROR');}
			}
		}
		
		function trackIt()
		{
			var pageTracker = _gat._getTracker(uatracker);
			
			if(settings.type == 'event')
			{
				pageTracker._trackEvent(settings.category, settings.action, settings.label);
			}
			else if(settings.type == 'view')
			{
				pageTracker._trackPageview(settings.url);
			}
		}
	}
	
	// Custom call for one or more elements
	$.fn.glamGA = function(uatracker, settings)
	{	
		settings = $.extend({}, $.glamGA.customdefaults, settings);
		return this.each(function() {
			var element = $(this);
			element.bind(settings.event + '.glamGA', function() {
				$.glamGA.customTrack(uatracker, settings);
			});
		});
	};
	

	// Default settings 
	$.glamGA.defaults = 
	{
		debug: false,
		localhost: false,
		trackPage: true,
		trackLinks: true,
		trackMails: true,
		trackFiles: true,
		categoryLinks: 'External',
		categoryMails: 'Email',
		categoryFiles: 'Download',
		titleLinks: true,
		filetypes: ['pdf','doc','xls','csv','jpg', 'mp3', 'rar','txt','ppt','zip','dmg','xml','exe','air']
	};
	
	// Custom default settings
	$.glamGA.customdefaults = 
	{
		debug: false,
		localhost: false,
		type: 'event',
		url: '/AJAX/example',
		category: 'Custom',
		action: 'Click',
		label: 'example',
		event: 'click'
	};
	
	// Glamorous LOGGING
	$.glamLog = function(plugin, message, type) 
	{
		var msg = '['+type+'] '+plugin+' - '+message;
		if(window.console) {
			switch(type)
			{
				case 'DEBUG':
					console.debug(msg);
					break;
				case 'LOG':
					console.log(msg);
					break;
				case 'INFO':
					console.info(msg);
					break;
				case 'WARN':
					console.warn(msg);
					break;
				case 'ERROR':
					console.error(msg);
					break;
			}
		} else {
			alert(msg);
		}
	};

})(jQuery);