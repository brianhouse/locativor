Locative Media
==============

This project is about exploring how media might relate to physical location. "Locativor" is an open-source, minimal web-application platform that uses MapBox, Leaflet, and JQuery. When a mobile browser is open to a Locativor map, it will center on the user's current location. Markers can be added to the map, and when the user is close enough to a hotspot, associated content will load. Content can be either a short text, an image, or video/sound from [Vimeo](http://vimeo.com).

Use Locativor to create an experience. This might be conceived of as a tour, an intervention, a mixed-reality gallery, a pedagogical project, a fiction. Draw on your expertise from past exercises: the dérive, place mapping, data interpretation, ethnography, monuments, and acoustic ecology / rhythmanalysis. 

We will have 20 minutes to review each experience, though it can be longer.


Locativor
---------

You may modify the Locativor software as needed to suit your project.

`locativor.js` - The logic that loads content and controls the display of the map. Includes variables for the MapBox tiles to display, which you should change to your own custom designed maps. 

`index.html` - The HTML and CSS that specifies the map. No need to modify this unless desired. You might want to change colors and fonts to match your aesthetic. Change the title field.

`hotspots.json` - This file is in JSON format; see below.


Composing Hotspots
------------------

Each hotspot comprises a latitude/longitude, a radius (in feet), a color (in [CSS hex](http://www.w3schools.com/tags/ref_colorpicker.asp)), optional text, optional image, and optional video.

Find the desired latitude/longtitude by physically going to the desired site and reading the display. You can also use a [geocoder](http://geocoder.us).

Set radius liberally as mobile devices are not always accurate. 30 ft might be appropriate for the street in front of a given property.

Text should be pasted directly in the JSON markup. Warning: be careful of non-ASCII characters! Do not use Microsoft word to edit your text. Note that if you want to use quotes in your text, you will have to escape them.

Images should be the filename of the image, which should be uploaded in your directory. Use PNG format, and keep them reasonably sized.

To add video or sound, create your content and upload to an account on Vimeo. Put the Vimeo video ID (eg, 61742609) in the video field. 



Fixing Bugs
-----------

Use Safari to test your application locally (Chrome will not work due to security restrictions). To see error messages, turn on the Develop menu in Safari->Preferences->Advanced. Then choose Develop->Show Error Console.

If you have errors in your hotspots.json file, use a JSON validator such as [http://jsonlint.com/](http://jsonlint.com/).



Uploading Files
---------------

We will use the [expgeo.org](http://expgeo.org) domain to run our web apps. To upload your code, use an SFTP (Secure File Transfer Protocol) application such as [Transmit](http://panic.com/transmit/). Each group should have its own folder in the "www" directory. To access your app, visit http://openposts.org/YOURGROUPFOLDER

SFTP Info
Domain: expgeo.org
Username: dm7047
Password: 
Directory: www/YOURGROUPFOLDER



### Copyright/License

Copyright (c) 2013 Brian House

This code is released under the MIT License and is completely free to use for any purpose. See the LICENSE file for details.

