
   Glow effect plugin for jQuery using CSS3 and filters
    	It uses filters to add glow effects on PNG images

	Copyright (c) 1997-2012 Djenad Razic, Machinez Design
	http://www.machinezdesign.com

	Licensed under the MIT license:
		http://www.opensource.org/licenses/mit-license.php
	  
	Project home:
		https://github.com/MisterDr/JQuery-Glow

    Usage:
        Enable glow and set color and radius:
            $("#testimg").glow({ radius: "20", color:"green"});
        Disable glow:
		    $("#testimg").glow({ radius: "20", color:"green", disable:true }); 
        or
            $("#testimg").glow({ disable:true }); 

    Version 1.0

	Tested on:
	IPad (IOS 6 required), Chrome 18.0, Firefox 16.0.1, IE 9 (Lower versions should work by Microsoft's browser specifications)
    With jQuery 1.7.2

    Version 1.1

         Added blink feature to blink over one second.
	     Example:
		$("#testimg").glow({ radius: "20", color:"green", disable:true, blink:true }); 
