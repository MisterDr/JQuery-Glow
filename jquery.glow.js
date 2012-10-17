/*

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


*/
(function ($) {
    $.fn.glow = function (options) {
        //Check if it is needed to remove effect
        var disable = false;

        //Check for initial vars and add default values
        //Default color: Red
        //Default size 2 pixels
        if (typeof (options.radius) === "undefined") {
            options = $.extend({
                radius: "2px"
            }, options);
        }
        if (typeof (options.color) === "undefined") {
            options = $.extend({
                color: "red"
            }, options);
        }

        if (typeof (options.disable) !== "undefined") {
            disable = true;
        }

        $(this).each(function (index) {
            if ($.browser.msie) {
                if (!disable) {
                    $(this).css("filter", "progid:DXImageTransform.Microsoft.Glow(color='" + options.color + "',Strength='" + options.radius + "')");
                } else {
                    $(this).css("filter", "");
                }
            } else if ($.browser.webkit) {
                if (!disable) {
                    $(this).css("-webkit-filter", "drop-shadow(0px 0px " + options.radius + "px " + options.color + ")");
                } else {
                    $(this).css("-webkit-filter", "");
                }
                //Mozilla uses SVG effects, so we need add SVG nodes at the HTML
            } else if ($.browser.mozilla) {
                if (!disable) {
                    $('body').append($('<svg height="0" xmlns="http://www.w3.org/2000/svg">' +
                    '<filter id="glow2">' +
                        '<feGaussianBlur in="SourceAlpha" stdDeviation="' + options.radius + '"/>' +
                        '<feOffset dx="0" dy="0" result="offsetblur"/>' +
                        '<feFlood flood-color="' + options.color + '"/>' +
                        '<feComposite in2="offsetblur" operator="in"/>' +
                        '<feMerge>' +
                            '<feMergeNode/>' +
                            '<feMergeNode in="SourceGraphic"/>' +
                        '</feMerge>' +
                    '</filter>' +
                '</svg>'));
                    $(this).css('filter', 'url("#glow2")');
                } else {
                    $(this).css("filter", "");
                }
            }
        });
    }
})(jQuery);