## jQuery Google Analytics plugin ##

### Why this plugin ###

This plugin is for everyone who want to analyse his visitors with Google Analytics. This plugin replaces the usual use of the tracking code but it can also work together with it. Only with this plugin it's easier for everyone to track pageviews or even actions and events such as clicking on a button. (read [more](http://code.google.com/intl/nl/apis/analytics/docs/tracking/eventTrackerGuide.html) about Google Analytics Event tracking)

### Getting Started ###

To use the Google Analytics plugin, you have to include the jQuery library in your `<head>` tag of your HTML document:

    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js"></script>

For the plugin you have the choice, you can include it in the `<head>` or just above the closing `<body>`-tag. When you put it in the `<head>` you can call the plugin from everywhere in your HTML-file. On the other hand: inline javascript is bad so use an external javascript-file to call the plugin. 
In my examples I have the separate file in mind. So add the end of your HTML-document you should have something like this:

    <script type="text/javascript" src="/js/jquery.glam.ga.js"></script>
    <script type="text/javascript" src="/js/general.js"></script>
    </body>
    </html>

We will use the `general.js`-file for the specefic jQuery-code to call our plugin.

### Basic setup ###

    $(document).ready(function(){
        $.glamGA('UA-*******-*'); //replace 'UA-*******-*' with your specefic UA-code
    });

Yes, it's so simple! The code above is pretty the same as this:

    $(document).ready(function(){
        $.glamGA('UA-*******-*', {
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
        });
    });
    
### More advanced setup ###
    
The above example is the basic use of the plugin with all his _default preferences_. You can change them for customize the plugin, but a little explanation is in his place here. 
First of all, for tracking an event this is the Google Analytics Code:

    _trackEvent(category, action, optional_label, optional_value)

Where:

*  _category_: the name you supply for the group of objects you want to track
*  _action_: a string that is uniquely paired with each category, and commonly used to define the type of user interaction for the web project
*  _label_: an optional string to provide additional dimensions to the event data
*  _value_: an optional integer that you can use to provide numerical data about the user event

(source: [Google](http://code.google.com/intl/nl/apis/analytics/docs/tracking/eventTrackerGuide.html))

These parameters from trackEvent you can find also in the _default prefereces_ (categoryLinks, categoryMails, categoryFiles and titleLinks):

*  **debug**: when true, it will output informational console logs (firebug) or alerts
*  **localhost**: when true, it will be available (and tracking) when developing on the localhost too
*  **trackPage**: when true, the basic pageview tracking is enabled
*  **trackLinks**: when true, it will tracking all external links as events with label 'Visit'
*  **trackMails**: when true, it will tracking all `mailto:`-links as events with
*  **trackFiles**: when true, it will tracking all links to files with an extension in the array you provide in the settings parameter _filetypes_.
*  **categoryLinks**: this 'label' is the 'category' for tracking events for external links
*  **categoryMails**: this 'label' is the 'category' for tracking events for `mailto:`-links
*  **categoryFiles**: this 'label' is the 'category' for tracking events for file-links
*  **titleLinks**: when true, it will use the `title` attribute from the link as optional_label when it's filled in. Otherwise it will use the `href` attribute.
*  **filetypes**: this is an array of all extensions that this plugin has to track

### Advanced setup: custom call ###

It's also possible to call the plugin for one specific need, like tracking a special action or something else without the need of track all the other stuff.

    $.glamGA.customTrack('UA-*******-*', {
								type: 'event',
								category: 'Action',
								action: 'Register',
								label: 'Member'
							});

In the example above, the setting are necessary to set for a custom `_trackEvent`. For the basic use for a `_trackPageview` you can do someting like this:

    $.glamGA.customTrack('UA-*******-*', {
								type: 'view',
								url: '/AJAX/example'
							});

There are a little more options for both of them:

*  **debug**: when true, it will output informational console logs (firebug) or alerts
*  **localhost**: when true, it will be available (and tracking) when developing on the localhost too
*  **type**: 'event' or 'view': 'event' is for `_trackEvent` and 'view' for `_trackPageview`
*  **url**: only necessary when _type_ is 'view': this 'url' will then be tracked as a pageview
*  **category**: category for the `_trackEvent`
*  **action**: action for the `_trackEvent`
*  **label**: label for the `_trackEvent`

### Advanced setup: custom call for one or more elements ###

Maybe you prefer to do some cool jQuery scripting to call the plugin.

    $('a.coolstuff').glamGA('UA-*******-*', settings);

All the settings from the custom call you can use here. Just one is extra setting is necessary so the plugin can do his work. 
You have to provide an extra setting **event**. Default is this 'click'.

## Issues/Bugs ##

If you find one, please inform us with the issue tracker on [github](http://github.com/glamorous/jQuery-Google-Analytics/issues).

## Changelog ##

**0.7.1 - 22/01/2010**

- [bug] Closes #1: Error with links without a 'href' attribute

**0.7 - 16/11/2009**

- Addes 2 semicolons add the ends of the functions

**0.5**

- This is the first version of the plugin but not bullet-proof so not a 1.0 release for now...

## Feature Requests / To come ##

*  Minified and packed versions of the plugin
*  More inline documentation
*  Examples and demo's

If you want something to add on this plugin, feel free to fork the project on [github](http://github.com/glamorous/jQuery-Google-Analytics) or add an [issue](http://github.com/glamorous/jQuery-Google-Analytics/issues) as a feature request.

## License ##

This plugin has a [BSD License](http://www.opensource.org/licenses/bsd-license.php). You can find the license in license.txt that is included with plugin-package