/**
 * Glamorous Google Analytics - Let you track your website with Google Analytics
 * Documentation and usage in README file
 * 
 * @author Jonas De Smet - Glamorous
 * @date 08.04.2010
 * @copyright Jonas De Smet - Glamorous
 * @version 0.8.1
 * @license BSD http://www.opensource.org/licenses/bsd-license.php
 * 
 */
(function($) {
	// Redefine getScript for caching perspectives
	$.getScript = function(url, callback, errorhandling, cache){ $.ajax({ type: "GET", url: url, success: callback, error: errorhandling, dataType: "script", cache: cache }); }; 
	
	// Call for whole page with all elements by default
	$.glamGA = function(uatracker, settings)
	{
		settings = $.extend({}, $.glamGA.defaults, settings);
		var DEBUG = (settings.debug && $.glamLog !== undefined) ? true : false;
		var pluginname = 'Glamorous GA (global)';
		var domain = document.location.host;
		var extension = domain.substr(domain.lastIndexOf('.')+1);
		var external = [];
		var mails = [];
		var files = [];
		
		function init()
		{	
			//decide if the host is with SSL or not
			var gaHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
			
			try
			{
				//use jQuery to call the Google Analytics JavaScript
				$.getScript(gaHost + "google-analytics.com/ga.js", function(){
					if(DEBUG){$.glamLog('Google Analytics ga.js file loaded succesful', 'INFO', pluginname);}
					setupTracking();						
				}, function(){
					if(DEBUG){$.glamLog('Google Analytics ga.js file failed to load:' + err, 'ERROR', pluginname);}
				}, true);
			} 
			catch(err) 
			{
				if(DEBUG){$.glamLog('A unexpected error has just been triggered', 'ERROR', pluginname);}
			}			
		}
		
		function setupTracking()
		{
			// Get Tracker
			try {
				var pageTracker = _gat._getTracker(uatracker);
				if(DEBUG){$.glamLog('Google Analytics pageTracker received successful', 'INFO', pluginname);}
			}
			catch(err) 
			{
				if(DEBUG){$.glamLog('Google Analytics pageTracker failed to receive: ' + err, 'ERROR', pluginname);}
			}
			
			//Track view for this page
			if(settings.trackPage)
			{
				pageTracker._trackPageview();
				if(DEBUG){$.glamLog('trackPage enabled', 'INFO', pluginname);}
			}
			else
			{
				if(DEBUG){$.glamLog('trackPage disabled', 'WARN', pluginname);}
			}
			
			//Extract all the links from the page and store them in arrays
			var links = $('a');
			var l_length = links.length;
			for (i=0;i<l_length;i++)
			{
				var href = $(links[i]).attr('href');
				
				if (href !== undefined) 
				{
					if ((href.match(/^https?\:/i)) && (!href.match(document.domain))) 
					{
						external.push(links[i]);
					}
					else if (href.match(/^mailto\:/i)) 
					{
						mails.push(links[i]);
					}
					else if ($.inArray(href.split('.')[href.split('.').length - 1], settings.filetypes) >= 0) 
					{
						files.push(links[i]);
					}
				}
			}
			
			if(DEBUG)
			{
				$.glamLog('#external links = '+external.length, 'LOG', pluginname);
				$.glamLog('#mailto links = '+mails.length, 'LOG', pluginname);
				$.glamLog('#download links = '+files.length, 'LOG', pluginname);
			}
			
			//Track all external links
			if(settings.trackLinks)
			{
				$(external).click(function(){
					var link = $(this);
					var linktxt = (link.attr('title') != '' && settings.titleLinks) ? link.attr('title') + ' [' + link.attr('href').replace(/^https?\:\/\//i, '') + ']' : link.attr('href').replace(/^https?\:\/\//i, '');
					pageTracker._trackEvent(settings.categoryLinks, 'Visit', linktxt);
				});
				if(DEBUG){$.glamLog('trackLinks enabled', 'INFO', pluginname);}
			}
			else
			{
				if(DEBUG){$.glamLog('trackLinks disabled', 'WARN', pluginname);}
			}
			
			//Track all mailto links
			if(settings.trackMails)
			{
				$(mails).click(function(){
					var email = $(this);
					var emailtxt = email.attr('href').substring(7);
					pageTracker._trackEvent(settings.categoryMails, 'Click', emailtxt);
				});
				if(DEBUG){$.glamLog('trackMails enabled', 'INFO', pluginname);}
			}
			else
			{
				if(DEBUG){$.glamLog('trackMails disabled', 'WARN', pluginname);}
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
				if(DEBUG){$.glamLog('trackFiles enabled', 'INFO', pluginname);}
			}
			else
			{
				if(DEBUG){$.glamLog('trackFiles disabled', 'WARN', pluginname);}
			}
		}
		
		if((domain !== 'localhost' && extension !== settings.localextension) || settings.localhost)
		{
			if(DEBUG){$.glamLog('Google Analytics enabled', 'INFO', pluginname);}
			init();
		}
		else
		{
			if(DEBUG){$.glamLog('Google Analytics disabled', 'WARN', pluginname);}
		}
	};
	
	// Custom call for one 'action'
	$.glamGA.customTrack = function(uatracker, settings)
	{
		settings = $.extend({}, $.glamGA.customdefaults, settings);
		var DEBUG = (settings.debug && $.glamLog !== undefined) ? true : false;
		var pluginname = 'Glamorous GA (custom)';
		var domain = document.location.host;
		var extension = domain.substr(domain.lastIndexOf('.')+1);
		
		function init()
		{
			//decide if the host is with SSL or not
			var gaHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
			
			try
			{
				//use jQuery to call the Google Analytics JavaScript
				$.getScript(gaHost + "google-analytics.com/ga.js", function(){
					if(DEBUG){$.glamLog('Google Analytics ga.js file loaded succesful', 'INFO', pluginname);}
					trackIt();				
				}, function(){
					if(DEBUG){$.glamLog('Google Analytics ga.js file failed to load:' + err, 'ERROR', pluginname);}
				}, true);
			} 
			catch(err) 
			{
				if(DEBUG){$.glamLog('A unexpected error has just been triggered', 'ERROR', pluginname);}
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
		
		if((domain !== 'localhost' && extension !== settings.localextension) || settings.localhost)
		{
			if(DEBUG){$.glamLog('Google Analytics enabled', 'INFO', pluginname);}
			init();
		}
		else
		{
			if(DEBUG){$.glamLog('Google Analytics disabled', 'WARN', pluginname);}
		}
	};
	
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
		localextension: 'dev',
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
		localextension: 'dev',
		type: 'event',
		url: '/AJAX/example',
		category: 'Custom',
		action: 'Click',
		label: 'example',
		event: 'click'
	};
})(jQuery);