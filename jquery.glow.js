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
 With jQuery 3.1.1

 Version 1.1

 Added blink feature to blink over one second.
 Example:
 $("#testimg").glow({ radius: "20", color:"green", disable:true, blink:true });

 Version 1.2

 Added configurable blink timegap feature
 Example:
 $("#testimg").glow({ radius: "20", color: "blue", disable: true, blink: true, timegap: 2000 });

 Version 1.3
 Added Edge and fixed older browser support

 */
(function ($) {
    var moved = false;
    var originalPos = null;
    $.fn.glow = function (options) {

        //Check if it is needed to remove effect
        var disable = false;

        var innerElement = null;

        var detectBrowser = function() {
            if (navigator.userAgent.search("MSIE") >= 0) {
                return "msie";
            }
            else if (navigator.userAgent.search("Trident") >= 0) {
                return "trident";
            }
            else if (navigator.userAgent.search("Chrome") >= 0 || navigator.userAgent.search("Opera") >= 0) {
                return "blink";
            }
            else if (navigator.userAgent.search("Firefox") >= 0) {
                return "gecko";
            }
            else if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
                return "webkit";
            }
            else {
                return "blink";
            }
        };

        var glowEnabled = true;
        var blinkInterval;
        var IntervalGap = 1000;

        //Check for initial vars and add default values
        //Default color: Red
        //Default size 2 pixels
        if (typeof (options.radius) === "undefined") {
            options = $.extend({
                radius: "2px"
            }, options);
        }
        if (typeof (options.originalPos) !== "undefined") {
            originalPos = options.originalPos;
        }
        if (typeof (options.color) === "undefined") {
            options = $.extend({
                color: "red"
            }, options);
        }

        if (typeof (options.disable) !== "undefined") {
            disable = true;
            glowEnabled = false;
        }

        if (typeof (options.timegap) === "undefined") {
            options = $.extend({
                timegap: "1000"
            }, options);
        }

        if (typeof (options.timegap) !== "undefined") {
            IntervalGap = options.timegap;
        }

        if (typeof (options.blink) !== "undefined") {
            if (options.blink) {
                originalPos = $(this).offset();

                disable = true;
                glowEnabled = false;
                var curObject = this;
                var curSettings = options;

                blinkInterval = setInterval(function () {

                    var element = $(curObject).data('element');

                    if (glowEnabled) {
                        $(curObject).glow({ radius: curSettings.radius, color: curSettings.color, originalPos: originalPos, element: element });
                        glowEnabled = false;
                    } else {
                        $(curObject).glow({ radius: curSettings.radius, color: curSettings.color, disable: true, originalPos: originalPos, element: element });
                        glowEnabled = true;
                    }
                }, IntervalGap);
            } else {
                clearInterval(blinkInterval);
            }
        }

        $(this).each(function (index) {

            var browser = detectBrowser();
            var oId = $(this).attr("id");

            if (browser == "msie") {
                if (!disable) {
                    $(this).offset({
                        left: $(this).offset().left - parseInt(options.radius),
                        top: $(this).offset().top - parseInt(options.radius)
                    });
                    $(this).css("filter", "progid:DXImageTransform.Microsoft.Glow(color='" + options.color + "',Strength='" + options.radius + "')");
                } else {

                    if (originalPos != null) {
                        $(this).offset({left: originalPos.left, top: originalPos.top});
                    }

                    $(this).css("filter", "");
                }
            } else if (browser == "trident") {
                var width = $(this).width();
                var height = $(this).height();

                var filter = disable == false ? 'url(\'#glow2' + oId + '\')' : "";

                if (!options.element) {
                    var element = $('<svg id="' + oId + '" xmlns="http://www.w3.org/2000/svg">' +
                        '<defs>' +
                        '<filter id="glow2' + oId + '">' +
                        '<feGaussianBlur in="SourceAlpha" stdDeviation="' + options.radius + '"/>' +
                        '<feOffset dx="0" dy="0" result="offsetblur"/>' +
                        '<feFlood flood-color="' + options.color + '"/>' +
                        '<feComposite in2="offsetblur" operator="in"/>' +
                        '<feMerge>' +
                        '<feMergeNode/>' +
                        '<feMergeNode in="SourceGraphic"/>' +
                        '</feMerge>' +
                        '</filter>' +
                        '</defs>' +
                        '<image filter="' + filter +'" height="' + height + '" width="' + width + '" xlink:href="' + $(this).attr("src") + '"></image>' +
                        '</svg>');

                    element.attr("style", $(this).attr("style"));
                    $(this).replaceWith(element);
                    $(this).data('element', element);
                } else {
                    if (filter == "") {
                        $(options.element).find("image").removeAttr("filter");
                    } else {
                        $(options.element).find("image").attr("filter", filter);
                    }
                }
            } else if (browser == "webkit" || browser == "blink") {
                if (!disable) {
                    $(this).css("-webkit-filter", "drop-shadow(0px 0px " + options.radius + "px " + options.color + ")");
                } else {
                    $(this).css("-webkit-filter", "");
                }
                //Mozilla uses SVG effects, so we need add SVG nodes at the HTML
            } else if (browser == "gecko") {
                if (!disable) {
                    $('body').append($('<svg id="filter_' + oId + '" height="0" xmlns="http://www.w3.org/2000/svg">' +
                        '<filter id="glow2' + oId + '">' +
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
                    $(this).css('filter', 'url("#glow2' + oId + '")');
                } else {
                    $(this).css("filter", "");
                    $('body').find("#filter_" + oId).remove();
                }
            }
        });
    };
    $.fn.glow.enabled = true;
})(jQuery);