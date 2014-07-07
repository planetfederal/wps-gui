/*

  OpenLayers.js -- OpenLayers Map Viewer Library

  Copyright (c) 2006-2013 by OpenLayers Contributors
  Published under the 2-clause BSD license.
  See http://openlayers.org/dev/license.txt for the full text of the license, and http://openlayers.org/dev/authors.txt for full list of contributors.

  Includes compressed code under the following licenses:

  (For uncompressed versions of the code used, please see the
  OpenLayers Github repository: <https://github.com/openlayers/openlayers>)

*/

/**
 * Contains XMLHttpRequest.js <http://code.google.com/p/xmlhttprequest/>
 * Copyright 2007 Sergey Ilinsky (http://www.ilinsky.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * OpenLayers.Util.pagePosition is based on Yahoo's getXY method, which is
 * Copyright (c) 2006, Yahoo! Inc.
 * All rights reserved.
 * 
 * Redistribution and use of this software in source and binary forms, with or
 * without modification, are permitted provided that the following conditions
 * are met:
 * 
 * * Redistributions of source code must retain the above copyright notice,
 *   this list of conditions and the following disclaimer.
 * 
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 * 
 * * Neither the name of Yahoo! Inc. nor the names of its contributors may be
 *   used to endorse or promote products derived from this software without
 *   specific prior written permission of Yahoo! Inc.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE 
 * POSSIBILITY OF SUCH DAMAGE.
 */
/* ======================================================================
    OpenLayers/SingleFile.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

var OpenLayers = {
    /**
     * Constant: VERSION_NUMBER
     */
    VERSION_NUMBER: "Release 2.14 dev",

    /**
     * Constant: singleFile
     * TODO: remove this in 3.0 when we stop supporting build profiles that
     * include OpenLayers.js
     */
    singleFile: true,

    /**
     * Method: _getScriptLocation
     * Return the path to this script. This is also implemented in
     * OpenLayers.js
     *
     * Returns:
     * {String} Path to this script
     */
    _getScriptLocation: (function() {
        var r = new RegExp("(^|(.*?\\/))(OpenLayers[^\\/]*?\\.js)(\\?|$)"),
            s = document.getElementsByTagName('script'),
            src, m, l = "";
        for(var i=0, len=s.length; i<len; i++) {
            src = s[i].getAttribute('src');
            if(src) {
                m = src.match(r);
                if(m) {
                    l = m[1];
                    break;
                }
            }
        }
        return (function() { return l; });
    })(),
    
    /**
     * Property: ImgPath
     * {String} Set this to the path where control images are stored, a path  
     * given here must end with a slash. If set to '' (which is the default) 
     * OpenLayers will use its script location + "img/".
     * 
     * You will need to set this property when you have a singlefile build of 
     * OpenLayers that either is not named "OpenLayers.js" or if you move
     * the file in a way such that the image directory cannot be derived from 
     * the script location.
     * 
     * If your custom OpenLayers build is named "my-custom-ol.js" and the images
     * of OpenLayers are in a folder "/resources/external/images/ol" a correct
     * way of including OpenLayers in your HTML would be:
     * 
     * (code)
     *   <script src="/path/to/my-custom-ol.js" type="text/javascript"></script>
     *   <script type="text/javascript">
     *      // tell OpenLayers where the control images are
     *      // remember the trailing slash
     *      OpenLayers.ImgPath = "/resources/external/images/ol/";
     *   </script>
     * (end code)
     * 
     * Please remember that when your OpenLayers script is not named 
     * "OpenLayers.js" you will have to make sure that the default theme is 
     * loaded into the page by including an appropriate <link>-tag, 
     * e.g.:
     * 
     * (code)
     *   <link rel="stylesheet" href="/path/to/default/style.css"  type="text/css">
     * (end code)
     */
    ImgPath : ''
};
/* ======================================================================
    OpenLayers/BaseTypes/Class.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/SingleFile.js
 */

/**
 * Constructor: OpenLayers.Class
 * Base class used to construct all other classes. Includes support for 
 *     multiple inheritance. 
 *     
 * This constructor is new in OpenLayers 2.5.  At OpenLayers 3.0, the old 
 *     syntax for creating classes and dealing with inheritance 
 *     will be removed.
 * 
 * To create a new OpenLayers-style class, use the following syntax:
 * (code)
 *     var MyClass = OpenLayers.Class(prototype);
 * (end)
 *
 * To create a new OpenLayers-style class with multiple inheritance, use the
 *     following syntax:
 * (code)
 *     var MyClass = OpenLayers.Class(Class1, Class2, prototype);
 * (end)
 * 
 * Note that instanceof reflection will only reveal Class1 as superclass.
 *
 */
OpenLayers.Class = function() {
    var len = arguments.length;
    var P = arguments[0];
    var F = arguments[len-1];

    var C = typeof F.initialize == "function" ?
        F.initialize :
        function(){ P.prototype.initialize.apply(this, arguments); };

    if (len > 1) {
        var newArgs = [C, P].concat(
                Array.prototype.slice.call(arguments).slice(1, len-1), F);
        OpenLayers.inherit.apply(null, newArgs);
    } else {
        C.prototype = F;
    }
    return C;
};

/**
 * Function: OpenLayers.inherit
 *
 * Parameters:
 * C - {Object} the class that inherits
 * P - {Object} the superclass to inherit from
 *
 * In addition to the mandatory C and P parameters, an arbitrary number of
 * objects can be passed, which will extend C.
 */
OpenLayers.inherit = function(C, P) {
   var F = function() {};
   F.prototype = P.prototype;
   C.prototype = new F;
   var i, l, o;
   for(i=2, l=arguments.length; i<l; i++) {
       o = arguments[i];
       if(typeof o === "function") {
           o = o.prototype;
       }
       OpenLayers.Util.extend(C.prototype, o);
   }
};

/**
 * APIFunction: extend
 * Copy all properties of a source object to a destination object.  Modifies
 *     the passed in destination object.  Any properties on the source object
 *     that are set to undefined will not be (re)set on the destination object.
 *
 * Parameters:
 * destination - {Object} The object that will be modified
 * source - {Object} The object with properties to be set on the destination
 *
 * Returns:
 * {Object} The destination object.
 */
OpenLayers.Util = OpenLayers.Util || {};
OpenLayers.Util.extend = function(destination, source) {
    destination = destination || {};
    if (source) {
        for (var property in source) {
            var value = source[property];
            if (value !== undefined) {
                destination[property] = value;
            }
        }

        /**
         * IE doesn't include the toString property when iterating over an object's
         * properties with the for(property in object) syntax.  Explicitly check if
         * the source has its own toString property.
         */

        /*
         * FF/Windows < 2.0.0.13 reports "Illegal operation on WrappedNative
         * prototype object" when calling hawOwnProperty if the source object
         * is an instance of window.Event.
         */

        var sourceIsEvt = typeof window.Event == "function"
                          && source instanceof window.Event;

        if (!sourceIsEvt
           && source.hasOwnProperty && source.hasOwnProperty("toString")) {
            destination.toString = source.toString;
        }
    }
    return destination;
};
/* ======================================================================
    OpenLayers/BaseTypes.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/SingleFile.js
 */

/** 
 * Header: OpenLayers Base Types
 * OpenLayers custom string, number and function functions are described here.
 */

/**
 * Namespace: OpenLayers.String
 * Contains convenience functions for string manipulation.
 */
OpenLayers.String = {

    /**
     * APIFunction: startsWith
     * Test whether a string starts with another string. 
     * 
     * Parameters:
     * str - {String} The string to test.
     * sub - {String} The substring to look for.
     *  
     * Returns:
     * {Boolean} The first string starts with the second.
     */
    startsWith: function(str, sub) {
        return (str.indexOf(sub) == 0);
    },

    /**
     * APIFunction: contains
     * Test whether a string contains another string.
     * 
     * Parameters:
     * str - {String} The string to test.
     * sub - {String} The substring to look for.
     * 
     * Returns:
     * {Boolean} The first string contains the second.
     */
    contains: function(str, sub) {
        return (str.indexOf(sub) != -1);
    },
    
    /**
     * APIFunction: trim
     * Removes leading and trailing whitespace characters from a string.
     * 
     * Parameters:
     * str - {String} The (potentially) space padded string.  This string is not
     *     modified.
     * 
     * Returns:
     * {String} A trimmed version of the string with all leading and 
     *     trailing spaces removed.
     */
    trim: function(str) {
        return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    },
    
    /**
     * APIFunction: camelize
     * Camel-case a hyphenated string. 
     *     Ex. "chicken-head" becomes "chickenHead", and
     *     "-chicken-head" becomes "ChickenHead".
     *
     * Parameters:
     * str - {String} The string to be camelized.  The original is not modified.
     * 
     * Returns:
     * {String} The string, camelized
     */
    camelize: function(str) {
        var oStringList = str.split('-');
        var camelizedString = oStringList[0];
        for (var i=1, len=oStringList.length; i<len; i++) {
            var s = oStringList[i];
            camelizedString += s.charAt(0).toUpperCase() + s.substring(1);
        }
        return camelizedString;
    },
    
    /**
     * APIFunction: format
     * Given a string with tokens in the form ${token}, return a string
     *     with tokens replaced with properties from the given context
     *     object.  Represent a literal "${" by doubling it, e.g. "${${".
     *
     * Parameters:
     * template - {String} A string with tokens to be replaced.  A template
     *     has the form "literal ${token}" where the token will be replaced
     *     by the value of context["token"].
     * context - {Object} An optional object with properties corresponding
     *     to the tokens in the format string.  If no context is sent, the
     *     window object will be used.
     * args - {Array} Optional arguments to pass to any functions found in
     *     the context.  If a context property is a function, the token
     *     will be replaced by the return from the function called with
     *     these arguments.
     *
     * Returns:
     * {String} A string with tokens replaced from the context object.
     */
    format: function(template, context, args) {
        if(!context) {
            context = window;
        }

        // Example matching: 
        // str   = ${foo.bar}
        // match = foo.bar
        var replacer = function(str, match) {
            var replacement;

            // Loop through all subs. Example: ${a.b.c}
            // 0 -> replacement = context[a];
            // 1 -> replacement = context[a][b];
            // 2 -> replacement = context[a][b][c];
            var subs = match.split(/\.+/);
            for (var i=0; i< subs.length; i++) {
                if (i == 0) {
                    replacement = context;
                }
                if (replacement === undefined) {
                    break;
                }
                replacement = replacement[subs[i]];
            }

            if(typeof replacement == "function") {
                replacement = args ?
                    replacement.apply(null, args) :
                    replacement();
            }

            // If replacement is undefined, return the string 'undefined'.
            // This is a workaround for a bugs in browsers not properly 
            // dealing with non-participating groups in regular expressions:
            // http://blog.stevenlevithan.com/archives/npcg-javascript
            if (typeof replacement == 'undefined') {
                return 'undefined';
            } else {
                return replacement; 
            }
        };

        return template.replace(OpenLayers.String.tokenRegEx, replacer);
    },

    /**
     * Property: tokenRegEx
     * Used to find tokens in a string.
     * Examples: ${a}, ${a.b.c}, ${a-b}, ${5}
     */
    tokenRegEx:  /\$\{([\w.]+?)\}/g,
    
    /**
     * Property: numberRegEx
     * Used to test strings as numbers.
     */
    numberRegEx: /^([+-]?)(?=\d|\.\d)\d*(\.\d*)?([Ee]([+-]?\d+))?$/,
    
    /**
     * APIFunction: isNumeric
     * Determine whether a string contains only a numeric value.
     *
     * Examples:
     * (code)
     * OpenLayers.String.isNumeric("6.02e23") // true
     * OpenLayers.String.isNumeric("12 dozen") // false
     * OpenLayers.String.isNumeric("4") // true
     * OpenLayers.String.isNumeric(" 4 ") // false
     * (end)
     *
     * Returns:
     * {Boolean} String contains only a number.
     */
    isNumeric: function(value) {
        return OpenLayers.String.numberRegEx.test(value);
    },
    
    /**
     * APIFunction: numericIf
     * Converts a string that appears to be a numeric value into a number.
     * 
     * Parameters:
     * value - {String}
     * trimWhitespace - {Boolean}
     *
     * Returns:
     * {Number|String} a Number if the passed value is a number, a String
     *     otherwise. 
     */
    numericIf: function(value, trimWhitespace) {
        var originalValue = value;
        if (trimWhitespace === true && value != null && value.replace) {
            value = value.replace(/^\s*|\s*$/g, "");
        }
        return OpenLayers.String.isNumeric(value) ? parseFloat(value) : originalValue;
    }

};

/**
 * Namespace: OpenLayers.Number
 * Contains convenience functions for manipulating numbers.
 */
OpenLayers.Number = {

    /**
     * Property: decimalSeparator
     * Decimal separator to use when formatting numbers.
     */
    decimalSeparator: ".",
    
    /**
     * Property: thousandsSeparator
     * Thousands separator to use when formatting numbers.
     */
    thousandsSeparator: ",",
    
    /**
     * APIFunction: limitSigDigs
     * Limit the number of significant digits on a float.
     * 
     * Parameters:
     * num - {Float}
     * sig - {Integer}
     * 
     * Returns:
     * {Float} The number, rounded to the specified number of significant
     *     digits.
     */
    limitSigDigs: function(num, sig) {
        var fig = 0;
        if (sig > 0) {
            fig = parseFloat(num.toPrecision(sig));
        }
        return fig;
    },
    
    /**
     * APIFunction: format
     * Formats a number for output.
     * 
     * Parameters:
     * num  - {Float}
     * dec  - {Integer} Number of decimal places to round to.
     *        Defaults to 0. Set to null to leave decimal places unchanged.
     * tsep - {String} Thousands separator.
     *        Default is ",".
     * dsep - {String} Decimal separator.
     *        Default is ".".
     *
     * Returns:
     * {String} A string representing the formatted number.
     */
    format: function(num, dec, tsep, dsep) {
        dec = (typeof dec != "undefined") ? dec : 0; 
        tsep = (typeof tsep != "undefined") ? tsep :
            OpenLayers.Number.thousandsSeparator; 
        dsep = (typeof dsep != "undefined") ? dsep :
            OpenLayers.Number.decimalSeparator;

        if (dec != null) {
            num = parseFloat(num.toFixed(dec));
        }

        var parts = num.toString().split(".");
        if (parts.length == 1 && dec == null) {
            // integer where we do not want to touch the decimals
            dec = 0;
        }
        
        var integer = parts[0];
        if (tsep) {
            var thousands = /(-?[0-9]+)([0-9]{3})/; 
            while(thousands.test(integer)) { 
                integer = integer.replace(thousands, "$1" + tsep + "$2"); 
            }
        }
        
        var str;
        if (dec == 0) {
            str = integer;
        } else {
            var rem = parts.length > 1 ? parts[1] : "0";
            if (dec != null) {
                rem = rem + new Array(dec - rem.length + 1).join("0");
            }
            str = integer + dsep + rem;
        }
        return str;
    },

    /**
     * Method: zeroPad
     * Create a zero padded string optionally with a radix for casting numbers.
     *
     * Parameters:
     * num - {Number} The number to be zero padded.
     * len - {Number} The length of the string to be returned.
     * radix - {Number} An integer between 2 and 36 specifying the base to use
     *     for representing numeric values.
     */
    zeroPad: function(num, len, radix) {
        var str = num.toString(radix || 10);
        while (str.length < len) {
            str = "0" + str;
        }
        return str;
    }    
};

/**
 * Namespace: OpenLayers.Function
 * Contains convenience functions for function manipulation.
 */
OpenLayers.Function = {
    /**
     * APIFunction: bind
     * Bind a function to an object.  Method to easily create closures with
     *     'this' altered.
     * 
     * Parameters:
     * func - {Function} Input function.
     * object - {Object} The object to bind to the input function (as this).
     * 
     * Returns:
     * {Function} A closure with 'this' set to the passed in object.
     */
    bind: function(func, object) {
        // create a reference to all arguments past the second one
        var args = Array.prototype.slice.apply(arguments, [2]);
        return function() {
            // Push on any additional arguments from the actual function call.
            // These will come after those sent to the bind call.
            var newArgs = args.concat(
                Array.prototype.slice.apply(arguments, [0])
            );
            return func.apply(object, newArgs);
        };
    },
    
    /**
     * APIFunction: bindAsEventListener
     * Bind a function to an object, and configure it to receive the event
     *     object as first parameter when called. 
     * 
     * Parameters:
     * func - {Function} Input function to serve as an event listener.
     * object - {Object} A reference to this.
     * 
     * Returns:
     * {Function}
     */
    bindAsEventListener: function(func, object) {
        return function(event) {
            return func.call(object, event || window.event);
        };
    },
    
    /**
     * APIFunction: False
     * A simple function to that just does "return false". We use this to 
     * avoid attaching anonymous functions to DOM event handlers, which 
     * causes "issues" on IE<8.
     * 
     * Usage:
     * document.onclick = OpenLayers.Function.False;
     * 
     * Returns:
     * {Boolean}
     */
    False : function() {
        return false;
    },

    /**
     * APIFunction: True
     * A simple function to that just does "return true". We use this to 
     * avoid attaching anonymous functions to DOM event handlers, which 
     * causes "issues" on IE<8.
     * 
     * Usage:
     * document.onclick = OpenLayers.Function.True;
     * 
     * Returns:
     * {Boolean}
     */
    True : function() {
        return true;
    },
    
    /**
     * APIFunction: Void
     * A reusable function that returns ``undefined``.
     *
     * Returns:
     * {undefined}
     */
    Void: function() {}

};

/**
 * Namespace: OpenLayers.Array
 * Contains convenience functions for array manipulation.
 */
OpenLayers.Array = {

    /**
     * APIMethod: filter
     * Filter an array.  Provides the functionality of the
     *     Array.prototype.filter extension to the ECMA-262 standard.  Where
     *     available, Array.prototype.filter will be used.
     *
     * Based on well known example from http://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/filter
     *
     * Parameters:
     * array - {Array} The array to be filtered.  This array is not mutated.
     *     Elements added to this array by the callback will not be visited.
     * callback - {Function} A function that is called for each element in
     *     the array.  If this function returns true, the element will be
     *     included in the return.  The function will be called with three
     *     arguments: the element in the array, the index of that element, and
     *     the array itself.  If the optional caller parameter is specified
     *     the callback will be called with this set to caller.
     * caller - {Object} Optional object to be set as this when the callback
     *     is called.
     *
     * Returns:
     * {Array} An array of elements from the passed in array for which the
     *     callback returns true.
     */
    filter: function(array, callback, caller) {
        var selected = [];
        if (Array.prototype.filter) {
            selected = array.filter(callback, caller);
        } else {
            var len = array.length;
            if (typeof callback != "function") {
                throw new TypeError();
            }
            for(var i=0; i<len; i++) {
                if (i in array) {
                    var val = array[i];
                    if (callback.call(caller, val, i, array)) {
                        selected.push(val);
                    }
                }
            }        
        }
        return selected;
    }
    
};
/* ======================================================================
    OpenLayers/BaseTypes/Bounds.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/BaseTypes/Class.js
 */

/**
 * Class: OpenLayers.Bounds
 * Instances of this class represent bounding boxes.  Data stored as left,
 * bottom, right, top floats. All values are initialized to null, however,
 * you should make sure you set them before using the bounds for anything.
 * 
 * Possible use case:
 * (code)
 *     bounds = new OpenLayers.Bounds();
 *     bounds.extend(new OpenLayers.LonLat(4,5));
 *     bounds.extend(new OpenLayers.LonLat(5,6));
 *     bounds.toBBOX(); // returns 4,5,5,6
 * (end)
 */
OpenLayers.Bounds = OpenLayers.Class({

    /**
     * Property: left
     * {Number} Minimum horizontal coordinate.
     */
    left: null,

    /**
     * Property: bottom
     * {Number} Minimum vertical coordinate.
     */
    bottom: null,

    /**
     * Property: right
     * {Number} Maximum horizontal coordinate.
     */
    right: null,

    /**
     * Property: top
     * {Number} Maximum vertical coordinate.
     */
    top: null,
    
    /**
     * Property: centerLonLat
     * {<OpenLayers.LonLat>} A cached center location.  This should not be
     *     accessed directly.  Use <getCenterLonLat> instead.
     */
    centerLonLat: null,

    /**
     * Constructor: OpenLayers.Bounds
     * Construct a new bounds object. Coordinates can either be passed as four
     * arguments, or as a single argument.
     *
     * Parameters (four arguments):
     * left - {Number} The left bounds of the box.  Note that for width
     *        calculations, this is assumed to be less than the right value.
     * bottom - {Number} The bottom bounds of the box.  Note that for height
     *          calculations, this is assumed to be less than the top value.
     * right - {Number} The right bounds.
     * top - {Number} The top bounds.
     *
     * Parameters (single argument):
     * bounds - {Array(Number)} [left, bottom, right, top]
     */
    initialize: function(left, bottom, right, top) {
        if (OpenLayers.Util.isArray(left)) {
            top = left[3];
            right = left[2];
            bottom = left[1];
            left = left[0];
        }
        if (left != null) {
            this.left = OpenLayers.Util.toFloat(left);
        }
        if (bottom != null) {
            this.bottom = OpenLayers.Util.toFloat(bottom);
        }
        if (right != null) {
            this.right = OpenLayers.Util.toFloat(right);
        }
        if (top != null) {
            this.top = OpenLayers.Util.toFloat(top);
        }
    },

    /**
     * Method: clone
     * Create a cloned instance of this bounds.
     *
     * Returns:
     * {<OpenLayers.Bounds>} A fresh copy of the bounds
     */
    clone:function() {
        return new OpenLayers.Bounds(this.left, this.bottom, 
                                     this.right, this.top);
    },

    /**
     * Method: equals
     * Test a two bounds for equivalence.
     *
     * Parameters:
     * bounds - {<OpenLayers.Bounds>}
     *
     * Returns:
     * {Boolean} The passed-in bounds object has the same left,
     *           right, top, bottom components as this.  Note that if bounds 
     *           passed in is null, returns false.
     */
    equals:function(bounds) {
        var equals = false;
        if (bounds != null) {
            equals = ((this.left == bounds.left) && 
                      (this.right == bounds.right) &&
                      (this.top == bounds.top) && 
                      (this.bottom == bounds.bottom));
        }
        return equals;
    },

    /** 
     * APIMethod: toString
     * Returns a string representation of the bounds object.
     * 
     * Returns:
     * {String} String representation of bounds object. 
     */
    toString:function() {
        return [this.left, this.bottom, this.right, this.top].join(",");
    },

    /**
     * APIMethod: toArray
     * Returns an array representation of the bounds object.
     *
     * Returns an array of left, bottom, right, top properties, or -- when the
     *     optional parameter is true -- an array of the  bottom, left, top,
     *     right properties.
     *
     * Parameters:
     * reverseAxisOrder - {Boolean} Should we reverse the axis order?
     *
     * Returns:
     * {Array} array of left, bottom, right, top
     */
    toArray: function(reverseAxisOrder) {
        if (reverseAxisOrder === true) {
            return [this.bottom, this.left, this.top, this.right];
        } else {
            return [this.left, this.bottom, this.right, this.top];
        }
    },    

    /** 
     * APIMethod: toBBOX
     * Returns a boundingbox-string representation of the bounds object.
     * 
     * Parameters:
     * decimal - {Integer} How many decimal places in the bbox coords?
     *                     Default is 6
     * reverseAxisOrder - {Boolean} Should we reverse the axis order?
     * 
     * Returns:
     * {String} Simple String representation of bounds object.
     *          (e.g. "5,42,10,45")
     */
    toBBOX:function(decimal, reverseAxisOrder) {
        if (decimal== null) {
            decimal = 6; 
        }
        var mult = Math.pow(10, decimal);
        var xmin = Math.round(this.left * mult) / mult;
        var ymin = Math.round(this.bottom * mult) / mult;
        var xmax = Math.round(this.right * mult) / mult;
        var ymax = Math.round(this.top * mult) / mult;
        if (reverseAxisOrder === true) {
            return ymin + "," + xmin + "," + ymax + "," + xmax;
        } else {
            return xmin + "," + ymin + "," + xmax + "," + ymax;
        }
    },
 
    /**
     * APIMethod: toGeometry
     * Create a new polygon geometry based on this bounds.
     *
     * Returns:
     * {<OpenLayers.Geometry.Polygon>} A new polygon with the coordinates
     *     of this bounds.
     */
    toGeometry: function() {
        return new OpenLayers.Geometry.Polygon([
            new OpenLayers.Geometry.LinearRing([
                new OpenLayers.Geometry.Point(this.left, this.bottom),
                new OpenLayers.Geometry.Point(this.right, this.bottom),
                new OpenLayers.Geometry.Point(this.right, this.top),
                new OpenLayers.Geometry.Point(this.left, this.top)
            ])
        ]);
    },
    
    /**
     * APIMethod: getWidth
     * Returns the width of the bounds.
     * 
     * Returns:
     * {Float} The width of the bounds (right minus left).
     */
    getWidth:function() {
        return (this.right - this.left);
    },

    /**
     * APIMethod: getHeight
     * Returns the height of the bounds.
     * 
     * Returns:
     * {Float} The height of the bounds (top minus bottom).
     */
    getHeight:function() {
        return (this.top - this.bottom);
    },

    /**
     * APIMethod: getSize
     * Returns an <OpenLayers.Size> object of the bounds.
     * 
     * Returns:
     * {<OpenLayers.Size>} The size of the bounds.
     */
    getSize:function() {
        return new OpenLayers.Size(this.getWidth(), this.getHeight());
    },

    /**
     * APIMethod: getCenterPixel
     * Returns the <OpenLayers.Pixel> object which represents the center of the
     *     bounds.
     * 
     * Returns:
     * {<OpenLayers.Pixel>} The center of the bounds in pixel space.
     */
    getCenterPixel:function() {
        return new OpenLayers.Pixel( (this.left + this.right) / 2,
                                     (this.bottom + this.top) / 2);
    },

    /**
     * APIMethod: getCenterLonLat
     * Returns the <OpenLayers.LonLat> object which represents the center of the
     *     bounds.
     *
     * Returns:
     * {<OpenLayers.LonLat>} The center of the bounds in map space.
     */
    getCenterLonLat:function() {
        if(!this.centerLonLat) {
            this.centerLonLat = new OpenLayers.LonLat(
                (this.left + this.right) / 2, (this.bottom + this.top) / 2
            );
        }
        return this.centerLonLat;
    },

    /**
     * APIMethod: scale
     * Scales the bounds around a pixel or lonlat. Note that the new 
     *     bounds may return non-integer properties, even if a pixel
     *     is passed. 
     * 
     * Parameters:
     * ratio - {Float} 
     * origin - {<OpenLayers.Pixel> or <OpenLayers.LonLat>}
     *          Default is center.
     *
     * Returns:
     * {<OpenLayers.Bounds>} A new bounds that is scaled by ratio
     *                      from origin.
     */
    scale: function(ratio, origin){
        if(origin == null){
            origin = this.getCenterLonLat();
        }
        
        var origx,origy;

        // get origin coordinates
        if(origin.CLASS_NAME == "OpenLayers.LonLat"){
            origx = origin.lon;
            origy = origin.lat;
        } else {
            origx = origin.x;
            origy = origin.y;
        }

        var left = (this.left - origx) * ratio + origx;
        var bottom = (this.bottom - origy) * ratio + origy;
        var right = (this.right - origx) * ratio + origx;
        var top = (this.top - origy) * ratio + origy;
        
        return new OpenLayers.Bounds(left, bottom, right, top);
    },

    /**
     * APIMethod: add
     * Shifts the coordinates of the bound by the given horizontal and vertical
     *     deltas.
     *
     * (start code)
     * var bounds = new OpenLayers.Bounds(0, 0, 10, 10);
     * bounds.toString();
     * // => "0,0,10,10"
     *
     * bounds.add(-1.5, 4).toString();
     * // => "-1.5,4,8.5,14"
     * (end)
     *
     * This method will throw a TypeError if it is passed null as an argument.
     *
     * Parameters:
     * x - {Float} horizontal delta
     * y - {Float} vertical delta
     *
     * Returns:
     * {<OpenLayers.Bounds>} A new bounds whose coordinates are the same as
     *     this, but shifted by the passed-in x and y values.
     */
    add:function(x, y) {
        if ( (x == null) || (y == null) ) {
            throw new TypeError('Bounds.add cannot receive null values');
        }
        return new OpenLayers.Bounds(this.left + x, this.bottom + y,
                                     this.right + x, this.top + y);
    },
    
    /**
     * APIMethod: extend
     * Extend the bounds to include the <OpenLayers.LonLat>,
     *     <OpenLayers.Geometry.Point> or <OpenLayers.Bounds> specified.
     *
     * Please note that this function assumes that left < right and
     *     bottom < top.
     *
     * Parameters:
     * object - {<OpenLayers.LonLat>, <OpenLayers.Geometry.Point> or
     *     <OpenLayers.Bounds>} The object to be included in the new bounds
     *     object.
     */
    extend:function(object) {
        if (object) {
            switch(object.CLASS_NAME) {
                case "OpenLayers.LonLat":
                    this.extendXY(object.lon, object.lat);
                    break;
                case "OpenLayers.Geometry.Point":
                    this.extendXY(object.x, object.y);
                    break;

                case "OpenLayers.Bounds":
                    // clear cached center location
                    this.centerLonLat = null;

                    if ( (this.left == null) || (object.left < this.left)) {
                        this.left = object.left;
                    }
                    if ( (this.bottom == null) || (object.bottom < this.bottom) ) {
                        this.bottom = object.bottom;
                    }
                    if ( (this.right == null) || (object.right > this.right) ) {
                        this.right = object.right;
                    }
                    if ( (this.top == null) || (object.top > this.top) ) {
                        this.top = object.top;
                    }
                    break;
            }
        }
    },

    /**
     * APIMethod: extendXY
     * Extend the bounds to include the XY coordinate specified.
     *
     * Parameters:
     * x - {number} The X part of the the coordinate.
     * y - {number} The Y part of the the coordinate.
     */
    extendXY:function(x, y) {
        // clear cached center location
        this.centerLonLat = null;

        if ((this.left == null) || (x < this.left)) {
            this.left = x;
        }
        if ((this.bottom == null) || (y < this.bottom)) {
            this.bottom = y;
        }
        if ((this.right == null) || (x > this.right)) {
            this.right = x;
        }
        if ((this.top == null) || (y > this.top)) {
            this.top = y;
        }
    },

    /**
     * APIMethod: containsLonLat
     * Returns whether the bounds object contains the given <OpenLayers.LonLat>.
     * 
     * Parameters:
     * ll - {<OpenLayers.LonLat>|Object} OpenLayers.LonLat or an
     *     object with a 'lon' and 'lat' properties.
     * options - {Object} Optional parameters
     *
     * Acceptable options:
     * inclusive - {Boolean} Whether or not to include the border.
     *     Default is true.
     * worldBounds - {<OpenLayers.Bounds>} If a worldBounds is provided, the
     *     ll will be considered as contained if it exceeds the world bounds,
     *     but can be wrapped around the dateline so it is contained by this
     *     bounds.
     *
     * Returns:
     * {Boolean} The passed-in lonlat is within this bounds.
     */
    containsLonLat: function(ll, options) {
        if (typeof options === "boolean") {
            options =  {inclusive: options};
        }
        options = options || {};
        var contains = this.contains(ll.lon, ll.lat, options.inclusive),
            worldBounds = options.worldBounds;
        if (worldBounds && !contains) {
            var worldWidth = worldBounds.getWidth();
            var worldCenterX = (worldBounds.left + worldBounds.right) / 2;
            var worldsAway = Math.round((ll.lon - worldCenterX) / worldWidth);
            contains = this.containsLonLat({
                lon: ll.lon - worldsAway * worldWidth,
                lat: ll.lat
            }, {inclusive: options.inclusive});
        }
        return contains;
    },

    /**
     * APIMethod: containsPixel
     * Returns whether the bounds object contains the given <OpenLayers.Pixel>.
     * 
     * Parameters:
     * px - {<OpenLayers.Pixel>}
     * inclusive - {Boolean} Whether or not to include the border. Default is
     *     true.
     *
     * Returns:
     * {Boolean} The passed-in pixel is within this bounds.
     */
    containsPixel:function(px, inclusive) {
        return this.contains(px.x, px.y, inclusive);
    },
    
    /**
     * APIMethod: contains
     * Returns whether the bounds object contains the given x and y.
     * 
     * Parameters:
     * x - {Float}
     * y - {Float}
     * inclusive - {Boolean} Whether or not to include the border. Default is
     *     true.
     *
     * Returns:
     * {Boolean} Whether or not the passed-in coordinates are within this
     *     bounds.
     */
    contains:function(x, y, inclusive) {
        //set default
        if (inclusive == null) {
            inclusive = true;
        }

        if (x == null || y == null) {
            return false;
        }

        x = OpenLayers.Util.toFloat(x);
        y = OpenLayers.Util.toFloat(y);

        var contains = false;
        if (inclusive) {
            contains = ((x >= this.left) && (x <= this.right) && 
                        (y >= this.bottom) && (y <= this.top));
        } else {
            contains = ((x > this.left) && (x < this.right) && 
                        (y > this.bottom) && (y < this.top));
        }              
        return contains;
    },

    /**
     * APIMethod: intersectsBounds
     * Determine whether the target bounds intersects this bounds.  Bounds are
     *     considered intersecting if any of their edges intersect or if one
     *     bounds contains the other.
     * 
     * Parameters:
     * bounds - {<OpenLayers.Bounds>} The target bounds.
     * options - {Object} Optional parameters.
     * 
     * Acceptable options:
     * inclusive - {Boolean} Treat coincident borders as intersecting.  Default
     *     is true.  If false, bounds that do not overlap but only touch at the
     *     border will not be considered as intersecting.
     * worldBounds - {<OpenLayers.Bounds>} If a worldBounds is provided, two
     *     bounds will be considered as intersecting if they intersect when 
     *     shifted to within the world bounds.  This applies only to bounds that
     *     cross or are completely outside the world bounds.
     *
     * Returns:
     * {Boolean} The passed-in bounds object intersects this bounds.
     */
    intersectsBounds:function(bounds, options) {
        if (typeof options === "boolean") {
            options =  {inclusive: options};
        }
        options = options || {};
        if (options.worldBounds) {
            var self = this.wrapDateLine(options.worldBounds);
            bounds = bounds.wrapDateLine(options.worldBounds);
        } else {
            self = this;
        }
        if (options.inclusive == null) {
            options.inclusive = true;
        }
        var intersects = false;
        var mightTouch = (
            self.left == bounds.right ||
            self.right == bounds.left ||
            self.top == bounds.bottom ||
            self.bottom == bounds.top
        );
        
        // if the two bounds only touch at an edge, and inclusive is false,
        // then the bounds don't *really* intersect.
        if (options.inclusive || !mightTouch) {
            // otherwise, if one of the boundaries even partially contains another,
            // inclusive of the edges, then they do intersect.
            var inBottom = (
                ((bounds.bottom >= self.bottom) && (bounds.bottom <= self.top)) ||
                ((self.bottom >= bounds.bottom) && (self.bottom <= bounds.top))
            );
            var inTop = (
                ((bounds.top >= self.bottom) && (bounds.top <= self.top)) ||
                ((self.top > bounds.bottom) && (self.top < bounds.top))
            );
            var inLeft = (
                ((bounds.left >= self.left) && (bounds.left <= self.right)) ||
                ((self.left >= bounds.left) && (self.left <= bounds.right))
            );
            var inRight = (
                ((bounds.right >= self.left) && (bounds.right <= self.right)) ||
                ((self.right >= bounds.left) && (self.right <= bounds.right))
            );
            intersects = ((inBottom || inTop) && (inLeft || inRight));
        }
        // document me
        if (options.worldBounds && !intersects) {
            var world = options.worldBounds;
            var width = world.getWidth();
            var selfCrosses = !world.containsBounds(self);
            var boundsCrosses = !world.containsBounds(bounds);
            if (selfCrosses && !boundsCrosses) {
                bounds = bounds.add(-width, 0);
                intersects = self.intersectsBounds(bounds, {inclusive: options.inclusive});
            } else if (boundsCrosses && !selfCrosses) {
                self = self.add(-width, 0);
                intersects = bounds.intersectsBounds(self, {inclusive: options.inclusive});                
            }
        }
        return intersects;
    },
    
    /**
     * APIMethod: containsBounds
     * Returns whether the bounds object contains the given <OpenLayers.Bounds>.
     * 
     * bounds - {<OpenLayers.Bounds>} The target bounds.
     * partial - {Boolean} If any of the target corners is within this bounds
     *     consider the bounds contained.  Default is false.  If false, the
     *     entire target bounds must be contained within this bounds.
     * inclusive - {Boolean} Treat shared edges as contained.  Default is
     *     true.
     *
     * Returns:
     * {Boolean} The passed-in bounds object is contained within this bounds. 
     */
    containsBounds:function(bounds, partial, inclusive) {
        if (partial == null) {
            partial = false;
        }
        if (inclusive == null) {
            inclusive = true;
        }
        var bottomLeft  = this.contains(bounds.left, bounds.bottom, inclusive);
        var bottomRight = this.contains(bounds.right, bounds.bottom, inclusive);
        var topLeft  = this.contains(bounds.left, bounds.top, inclusive);
        var topRight = this.contains(bounds.right, bounds.top, inclusive);
        
        return (partial) ? (bottomLeft || bottomRight || topLeft || topRight)
                         : (bottomLeft && bottomRight && topLeft && topRight);
    },

    /** 
     * APIMethod: determineQuadrant
     * Returns the the quadrant ("br", "tr", "tl", "bl") in which the given
     *     <OpenLayers.LonLat> lies.
     *
     * Parameters:
     * lonlat - {<OpenLayers.LonLat>}
     *
     * Returns:
     * {String} The quadrant ("br" "tr" "tl" "bl") of the bounds in which the
     *     coordinate lies.
     */
    determineQuadrant: function(lonlat) {
    
        var quadrant = "";
        var center = this.getCenterLonLat();
        
        quadrant += (lonlat.lat < center.lat) ? "b" : "t";
        quadrant += (lonlat.lon < center.lon) ? "l" : "r";
    
        return quadrant; 
    },
    
    /**
     * APIMethod: transform
     * Transform the Bounds object from source to dest. 
     *
     * Parameters: 
     * source - {<OpenLayers.Projection>} Source projection. 
     * dest   - {<OpenLayers.Projection>} Destination projection. 
     *
     * Returns:
     * {<OpenLayers.Bounds>} Itself, for use in chaining operations.
     */
    transform: function(source, dest) {
        // clear cached center location
        this.centerLonLat = null;
        var ll = OpenLayers.Projection.transform(
            {'x': this.left, 'y': this.bottom}, source, dest);
        var lr = OpenLayers.Projection.transform(
            {'x': this.right, 'y': this.bottom}, source, dest);
        var ul = OpenLayers.Projection.transform(
            {'x': this.left, 'y': this.top}, source, dest);
        var ur = OpenLayers.Projection.transform(
            {'x': this.right, 'y': this.top}, source, dest);
        this.left   = Math.min(ll.x, ul.x);
        this.bottom = Math.min(ll.y, lr.y);
        this.right  = Math.max(lr.x, ur.x);
        this.top    = Math.max(ul.y, ur.y);
        return this;
    },

    /**
     * APIMethod: wrapDateLine
     * Wraps the bounds object around the dateline.
     *  
     * Parameters:
     * maxExtent - {<OpenLayers.Bounds>}
     * options - {Object} Some possible options are:
     *
     * Allowed Options:
     *                    leftTolerance - {float} Allow for a margin of error 
     *                                            with the 'left' value of this 
     *                                            bound.
     *                                            Default is 0.
     *                    rightTolerance - {float} Allow for a margin of error 
     *                                             with the 'right' value of 
     *                                             this bound.
     *                                             Default is 0.
     * 
     * Returns:
     * {<OpenLayers.Bounds>} A copy of this bounds, but wrapped around the 
     *                       "dateline" (as specified by the borders of 
     *                       maxExtent). Note that this function only returns 
     *                       a different bounds value if this bounds is 
     *                       *entirely* outside of the maxExtent. If this 
     *                       bounds straddles the dateline (is part in/part 
     *                       out of maxExtent), the returned bounds will always 
     *                       cross the left edge of the given maxExtent.
     *.
     */
    wrapDateLine: function(maxExtent, options) {    
        options = options || {};
        
        var leftTolerance = options.leftTolerance || 0;
        var rightTolerance = options.rightTolerance || 0;

        var newBounds = this.clone();
    
        if (maxExtent) {
            var width = maxExtent.getWidth();

            //shift right?
            while (newBounds.left < maxExtent.left && 
                   newBounds.right - rightTolerance <= maxExtent.left ) { 
                newBounds = newBounds.add(width, 0);
            }

            //shift left?
            while (newBounds.left + leftTolerance >= maxExtent.right && 
                   newBounds.right > maxExtent.right ) { 
                newBounds = newBounds.add(-width, 0);
            }
           
            // crosses right only? force left
            var newLeft = newBounds.left + leftTolerance;
            if (newLeft < maxExtent.right && newLeft > maxExtent.left && 
                   newBounds.right - rightTolerance > maxExtent.right) {
                newBounds = newBounds.add(-width, 0);
            }
        }
                
        return newBounds;
    },

    CLASS_NAME: "OpenLayers.Bounds"
});

/** 
 * APIFunction: fromString
 * Alternative constructor that builds a new OpenLayers.Bounds from a 
 *     parameter string.
 *
 * (begin code)
 * OpenLayers.Bounds.fromString("5,42,10,45");
 * // => equivalent to ...
 * new OpenLayers.Bounds(5, 42, 10, 45);
 * (end)
 *
 * Parameters: 
 * str - {String} Comma-separated bounds string. (e.g. "5,42,10,45")
 * reverseAxisOrder - {Boolean} Does the string use reverse axis order?
 *
 * Returns:
 * {<OpenLayers.Bounds>} New bounds object built from the 
 *                       passed-in String.
 */
OpenLayers.Bounds.fromString = function(str, reverseAxisOrder) {
    var bounds = str.split(",");
    return OpenLayers.Bounds.fromArray(bounds, reverseAxisOrder);
};

/** 
 * APIFunction: fromArray
 * Alternative constructor that builds a new OpenLayers.Bounds from an array.
 *
 * (begin code)
 * OpenLayers.Bounds.fromArray( [5, 42, 10, 45] );
 * // => equivalent to ...
 * new OpenLayers.Bounds(5, 42, 10, 45);
 * (end)
 *
 * Parameters:
 * bbox - {Array(Float)} Array of bounds values (e.g. [5,42,10,45])
 * reverseAxisOrder - {Boolean} Does the array use reverse axis order?
 *
 * Returns:
 * {<OpenLayers.Bounds>} New bounds object built from the passed-in Array.
 */
OpenLayers.Bounds.fromArray = function(bbox, reverseAxisOrder) {
    return reverseAxisOrder === true ?
           new OpenLayers.Bounds(bbox[1], bbox[0], bbox[3], bbox[2]) :
           new OpenLayers.Bounds(bbox[0], bbox[1], bbox[2], bbox[3]);
};

/** 
 * APIFunction: fromSize
 * Alternative constructor that builds a new OpenLayers.Bounds from a size.
 *
 * (begin code)
 * OpenLayers.Bounds.fromSize( new OpenLayers.Size(10, 20) );
 * // => equivalent to ...
 * new OpenLayers.Bounds(0, 20, 10, 0);
 * (end)
 *
 * Parameters:
 * size - {<OpenLayers.Size> or Object} <OpenLayers.Size> or an object with
 *     both 'w' and 'h' properties.
 *
 * Returns:
 * {<OpenLayers.Bounds>} New bounds object built from the passed-in size.
 */
OpenLayers.Bounds.fromSize = function(size) {
    return new OpenLayers.Bounds(0,
                                 size.h,
                                 size.w,
                                 0);
};

/**
 * Function: oppositeQuadrant
 * Get the opposite quadrant for a given quadrant string.
 *
 * (begin code)
 * OpenLayers.Bounds.oppositeQuadrant( "tl" );
 * // => "br"
 *
 * OpenLayers.Bounds.oppositeQuadrant( "tr" );
 * // => "bl"
 * (end)
 *
 * Parameters:
 * quadrant - {String} two character quadrant shortstring
 *
 * Returns:
 * {String} The opposing quadrant ("br" "tr" "tl" "bl"). For Example, if 
 *          you pass in "bl" it returns "tr", if you pass in "br" it 
 *          returns "tl", etc.
 */
OpenLayers.Bounds.oppositeQuadrant = function(quadrant) {
    var opp = "";
    
    opp += (quadrant.charAt(0) == 't') ? 'b' : 't';
    opp += (quadrant.charAt(1) == 'l') ? 'r' : 'l';
    
    return opp;
};
/* ======================================================================
    OpenLayers/BaseTypes/Element.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Util.js
 * @requires OpenLayers/BaseTypes.js
 */

/**
 * Namespace: OpenLayers.Element
 */
OpenLayers.Element = {

    /**
     * APIFunction: visible
     * 
     * Parameters: 
     * element - {DOMElement}
     * 
     * Returns:
     * {Boolean} Is the element visible?
     */
    visible: function(element) {
        return OpenLayers.Util.getElement(element).style.display != 'none';
    },

    /**
     * APIFunction: toggle
     * Toggle the visibility of element(s) passed in
     * 
     * Parameters:
     * element - {DOMElement} Actually user can pass any number of elements
     */
    toggle: function() {
        for (var i=0, len=arguments.length; i<len; i++) {
            var element = OpenLayers.Util.getElement(arguments[i]);
            var display = OpenLayers.Element.visible(element) ? 'none' 
                                                              : '';
            element.style.display = display;
        }
    },

    /**
     * APIFunction: remove
     * Remove the specified element from the DOM.
     * 
     * Parameters:
     * element - {DOMElement}
     */
    remove: function(element) {
        element = OpenLayers.Util.getElement(element);
        element.parentNode.removeChild(element);
    },

    /**
     * APIFunction: getHeight
     *  
     * Parameters:
     * element - {DOMElement}
     * 
     * Returns:
     * {Integer} The offset height of the element passed in
     */
    getHeight: function(element) {
        element = OpenLayers.Util.getElement(element);
        return element.offsetHeight;
    },

    /**
     * Function: hasClass
     * Tests if an element has the given CSS class name.
     *
     * Parameters:
     * element - {DOMElement} A DOM element node.
     * name - {String} The CSS class name to search for.
     *
     * Returns:
     * {Boolean} The element has the given class name.
     */
    hasClass: function(element, name) {
        var names = element.className;
        return (!!names && new RegExp("(^|\\s)" + name + "(\\s|$)").test(names));
    },
    
    /**
     * Function: addClass
     * Add a CSS class name to an element.  Safe where element already has
     *     the class name.
     *
     * Parameters:
     * element - {DOMElement} A DOM element node.
     * name - {String} The CSS class name to add.
     *
     * Returns:
     * {DOMElement} The element.
     */
    addClass: function(element, name) {
        if(!OpenLayers.Element.hasClass(element, name)) {
            element.className += (element.className ? " " : "") + name;
        }
        return element;
    },

    /**
     * Function: removeClass
     * Remove a CSS class name from an element.  Safe where element does not
     *     have the class name.
     *
     * Parameters:
     * element - {DOMElement} A DOM element node.
     * name - {String} The CSS class name to remove.
     *
     * Returns:
     * {DOMElement} The element.
     */
    removeClass: function(element, name) {
        var names = element.className;
        if(names) {
            element.className = OpenLayers.String.trim(
                names.replace(
                    new RegExp("(^|\\s+)" + name + "(\\s+|$)"), " "
                )
            );
        }
        return element;
    },

    /**
     * Function: toggleClass
     * Remove a CSS class name from an element if it exists.  Add the class name
     *     if it doesn't exist.
     *
     * Parameters:
     * element - {DOMElement} A DOM element node.
     * name - {String} The CSS class name to toggle.
     *
     * Returns:
     * {DOMElement} The element.
     */
    toggleClass: function(element, name) {
        if(OpenLayers.Element.hasClass(element, name)) {
            OpenLayers.Element.removeClass(element, name);
        } else {
            OpenLayers.Element.addClass(element, name);
        }
        return element;
    },

    /**
     * APIFunction: getStyle
     * 
     * Parameters:
     * element - {DOMElement}
     * style - {?}
     * 
     * Returns:
     * {?}
     */
    getStyle: function(element, style) {
        element = OpenLayers.Util.getElement(element);

        var value = null;
        if (element && element.style) {
            value = element.style[OpenLayers.String.camelize(style)];
            if (!value) {
                if (document.defaultView && 
                    document.defaultView.getComputedStyle) {
                    
                    var css = document.defaultView.getComputedStyle(element, null);
                    value = css ? css.getPropertyValue(style) : null;
                } else if (element.currentStyle) {
                    value = element.currentStyle[OpenLayers.String.camelize(style)];
                }
            }
        
            var positions = ['left', 'top', 'right', 'bottom'];
            if (window.opera &&
                (OpenLayers.Util.indexOf(positions,style) != -1) &&
                (OpenLayers.Element.getStyle(element, 'position') == 'static')) { 
                value = 'auto';
            }
        }
    
        return value == 'auto' ? null : value;
    }

};
/* ======================================================================
    OpenLayers/BaseTypes/LonLat.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/BaseTypes/Class.js
 */

/**
 * Class: OpenLayers.LonLat
 * This class represents a longitude and latitude pair
 */
OpenLayers.LonLat = OpenLayers.Class({

    /** 
     * APIProperty: lon
     * {Float} The x-axis coodinate in map units
     */
    lon: 0.0,
    
    /** 
     * APIProperty: lat
     * {Float} The y-axis coordinate in map units
     */
    lat: 0.0,

    /**
     * Constructor: OpenLayers.LonLat
     * Create a new map location. Coordinates can be passed either as two
     * arguments, or as a single argument.
     *
     * Parameters (two arguments):
     * lon - {Number} The x-axis coordinate in map units.  If your map is in
     *     a geographic projection, this will be the Longitude.  Otherwise,
     *     it will be the x coordinate of the map location in your map units.
     * lat - {Number} The y-axis coordinate in map units.  If your map is in
     *     a geographic projection, this will be the Latitude.  Otherwise,
     *     it will be the y coordinate of the map location in your map units.
     *
     * Parameters (single argument):
     * location - {Array(Float)} [lon, lat]
     */
    initialize: function(lon, lat) {
        if (OpenLayers.Util.isArray(lon)) {
            lat = lon[1];
            lon = lon[0];
        }
        this.lon = OpenLayers.Util.toFloat(lon);
        this.lat = OpenLayers.Util.toFloat(lat);
    },
    
    /**
     * Method: toString
     * Return a readable string version of the lonlat
     *
     * Returns:
     * {String} String representation of OpenLayers.LonLat object. 
     *           (e.g. <i>"lon=5,lat=42"</i>)
     */
    toString:function() {
        return ("lon=" + this.lon + ",lat=" + this.lat);
    },

    /** 
     * APIMethod: toShortString
     * 
     * Returns:
     * {String} Shortened String representation of OpenLayers.LonLat object. 
     *         (e.g. <i>"5, 42"</i>)
     */
    toShortString:function() {
        return (this.lon + ", " + this.lat);
    },

    /** 
     * APIMethod: clone
     * 
     * Returns:
     * {<OpenLayers.LonLat>} New OpenLayers.LonLat object with the same lon 
     *                       and lat values
     */
    clone:function() {
        return new OpenLayers.LonLat(this.lon, this.lat);
    },

    /** 
     * APIMethod: add
     * 
     * Parameters:
     * lon - {Float}
     * lat - {Float}
     * 
     * Returns:
     * {<OpenLayers.LonLat>} A new OpenLayers.LonLat object with the lon and 
     *                       lat passed-in added to this's. 
     */
    add:function(lon, lat) {
        if ( (lon == null) || (lat == null) ) {
            throw new TypeError('LonLat.add cannot receive null values');
        }
        return new OpenLayers.LonLat(this.lon + OpenLayers.Util.toFloat(lon), 
                                     this.lat + OpenLayers.Util.toFloat(lat));
    },

    /** 
     * APIMethod: equals
     * 
     * Parameters:
     * ll - {<OpenLayers.LonLat>}
     * 
     * Returns:
     * {Boolean} Boolean value indicating whether the passed-in 
     *           <OpenLayers.LonLat> object has the same lon and lat 
     *           components as this.
     *           Note: if ll passed in is null, returns false
     */
    equals:function(ll) {
        var equals = false;
        if (ll != null) {
            equals = ((this.lon == ll.lon && this.lat == ll.lat) ||
                      (isNaN(this.lon) && isNaN(this.lat) && isNaN(ll.lon) && isNaN(ll.lat)));
        }
        return equals;
    },

    /**
     * APIMethod: transform
     * Transform the LonLat object from source to dest. This transformation is
     *    *in place*: if you want a *new* lonlat, use .clone() first.
     *
     * Parameters: 
     * source - {<OpenLayers.Projection>} Source projection. 
     * dest   - {<OpenLayers.Projection>} Destination projection. 
     *
     * Returns:
     * {<OpenLayers.LonLat>} Itself, for use in chaining operations.
     */
    transform: function(source, dest) {
        var point = OpenLayers.Projection.transform(
            {'x': this.lon, 'y': this.lat}, source, dest);
        this.lon = point.x;
        this.lat = point.y;
        return this;
    },
    
    /**
     * APIMethod: wrapDateLine
     * 
     * Parameters:
     * maxExtent - {<OpenLayers.Bounds>}
     * 
     * Returns:
     * {<OpenLayers.LonLat>} A copy of this lonlat, but wrapped around the 
     *                       "dateline" (as specified by the borders of 
     *                       maxExtent)
     */
    wrapDateLine: function(maxExtent) {    

        var newLonLat = this.clone();
    
        if (maxExtent) {
            //shift right?
            while (newLonLat.lon < maxExtent.left) {
                newLonLat.lon +=  maxExtent.getWidth();
            }    
           
            //shift left?
            while (newLonLat.lon > maxExtent.right) {
                newLonLat.lon -= maxExtent.getWidth();
            }    
        }
                
        return newLonLat;
    },

    CLASS_NAME: "OpenLayers.LonLat"
});

/** 
 * Function: fromString
 * Alternative constructor that builds a new <OpenLayers.LonLat> from a 
 *     parameter string
 * 
 * Parameters:
 * str - {String} Comma-separated Lon,Lat coordinate string. 
 *                 (e.g. <i>"5,40"</i>)
 * 
 * Returns:
 * {<OpenLayers.LonLat>} New <OpenLayers.LonLat> object built from the 
 *                       passed-in String.
 */
OpenLayers.LonLat.fromString = function(str) {
    var pair = str.split(",");
    return new OpenLayers.LonLat(pair[0], pair[1]);
};

/** 
 * Function: fromArray
 * Alternative constructor that builds a new <OpenLayers.LonLat> from an 
 *     array of two numbers that represent lon- and lat-values.
 * 
 * Parameters:
 * arr - {Array(Float)} Array of lon/lat values (e.g. [5,-42])
 * 
 * Returns:
 * {<OpenLayers.LonLat>} New <OpenLayers.LonLat> object built from the 
 *                       passed-in array.
 */
OpenLayers.LonLat.fromArray = function(arr) {
    var gotArr = OpenLayers.Util.isArray(arr),
        lon = gotArr && arr[0],
        lat = gotArr && arr[1];
    return new OpenLayers.LonLat(lon, lat);
};
/* ======================================================================
    OpenLayers/BaseTypes/Pixel.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/BaseTypes/Class.js
 */

/**
 * Class: OpenLayers.Pixel
 * This class represents a screen coordinate, in x and y coordinates
 */
OpenLayers.Pixel = OpenLayers.Class({
    
    /**
     * APIProperty: x
     * {Number} The x coordinate
     */
    x: 0.0,

    /**
     * APIProperty: y
     * {Number} The y coordinate
     */
    y: 0.0,
    
    /**
     * Constructor: OpenLayers.Pixel
     * Create a new OpenLayers.Pixel instance
     *
     * Parameters:
     * x - {Number} The x coordinate
     * y - {Number} The y coordinate
     *
     * Returns:
     * An instance of OpenLayers.Pixel
     */
    initialize: function(x, y) {
        this.x = parseFloat(x);
        this.y = parseFloat(y);
    },
    
    /**
     * Method: toString
     * Cast this object into a string
     *
     * Returns:
     * {String} The string representation of Pixel. ex: "x=200.4,y=242.2"
     */
    toString:function() {
        return ("x=" + this.x + ",y=" + this.y);
    },

    /**
     * APIMethod: clone
     * Return a clone of this pixel object
     *
     * Returns:
     * {<OpenLayers.Pixel>} A clone pixel
     */
    clone:function() {
        return new OpenLayers.Pixel(this.x, this.y); 
    },
    
    /**
     * APIMethod: equals
     * Determine whether one pixel is equivalent to another
     *
     * Parameters:
     * px - {<OpenLayers.Pixel>|Object} An OpenLayers.Pixel or an object with
     *                                  a 'x' and 'y' properties.
     *
     * Returns:
     * {Boolean} The point passed in as parameter is equal to this. Note that
     * if px passed in is null, returns false.
     */
    equals:function(px) {
        var equals = false;
        if (px != null) {
            equals = ((this.x == px.x && this.y == px.y) ||
                      (isNaN(this.x) && isNaN(this.y) && isNaN(px.x) && isNaN(px.y)));
        }
        return equals;
    },

    /**
     * APIMethod: distanceTo
     * Returns the distance to the pixel point passed in as a parameter.
     *
     * Parameters:
     * px - {<OpenLayers.Pixel>}
     *
     * Returns:
     * {Float} The pixel point passed in as parameter to calculate the
     *     distance to.
     */
    distanceTo:function(px) {
        return Math.sqrt(
            Math.pow(this.x - px.x, 2) +
            Math.pow(this.y - px.y, 2)
        );
    },

    /**
     * APIMethod: add
     *
     * Parameters:
     * x - {Integer}
     * y - {Integer}
     *
     * Returns:
     * {<OpenLayers.Pixel>} A new Pixel with this pixel's x&y augmented by the 
     * values passed in.
     */
    add:function(x, y) {
        if ( (x == null) || (y == null) ) {
            throw new TypeError('Pixel.add cannot receive null values');
        }
        return new OpenLayers.Pixel(this.x + x, this.y + y);
    },

    /**
    * APIMethod: offset
    * 
    * Parameters
    * px - {<OpenLayers.Pixel>|Object} An OpenLayers.Pixel or an object with
    *                                  a 'x' and 'y' properties.
    * 
    * Returns:
    * {<OpenLayers.Pixel>} A new Pixel with this pixel's x&y augmented by the 
    *                      x&y values of the pixel passed in.
    */
    offset:function(px) {
        var newPx = this.clone();
        if (px) {
            newPx = this.add(px.x, px.y);
        }
        return newPx;
    },

    CLASS_NAME: "OpenLayers.Pixel"
});
/* ======================================================================
    OpenLayers/BaseTypes/Size.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/BaseTypes/Class.js
 */

/**
 * Class: OpenLayers.Size
 * Instances of this class represent a width/height pair
 */
OpenLayers.Size = OpenLayers.Class({

    /**
     * APIProperty: w
     * {Number} width
     */
    w: 0.0,
    
    /**
     * APIProperty: h
     * {Number} height
     */
    h: 0.0,


    /**
     * Constructor: OpenLayers.Size
     * Create an instance of OpenLayers.Size
     *
     * Parameters:
     * w - {Number} width
     * h - {Number} height
     */
    initialize: function(w, h) {
        this.w = parseFloat(w);
        this.h = parseFloat(h);
    },

    /**
     * Method: toString
     * Return the string representation of a size object
     *
     * Returns:
     * {String} The string representation of OpenLayers.Size object. 
     * (e.g. <i>"w=55,h=66"</i>)
     */
    toString:function() {
        return ("w=" + this.w + ",h=" + this.h);
    },

    /**
     * APIMethod: clone
     * Create a clone of this size object
     *
     * Returns:
     * {<OpenLayers.Size>} A new OpenLayers.Size object with the same w and h
     * values
     */
    clone:function() {
        return new OpenLayers.Size(this.w, this.h);
    },

    /**
     *
     * APIMethod: equals
     * Determine where this size is equal to another
     *
     * Parameters:
     * sz - {<OpenLayers.Size>|Object} An OpenLayers.Size or an object with
     *                                  a 'w' and 'h' properties.
     *
     * Returns: 
     * {Boolean} The passed in size has the same h and w properties as this one.
     * Note that if sz passed in is null, returns false.
     */
    equals:function(sz) {
        var equals = false;
        if (sz != null) {
            equals = ((this.w == sz.w && this.h == sz.h) ||
                      (isNaN(this.w) && isNaN(this.h) && isNaN(sz.w) && isNaN(sz.h)));
        }
        return equals;
    },

    CLASS_NAME: "OpenLayers.Size"
});
/* ======================================================================
    OpenLayers/Console.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/BaseTypes/Class.js
 */

/**
 * Namespace: OpenLayers.Console
 * The OpenLayers.Console namespace is used for debugging and error logging.
 * If the Firebug Lite (../Firebug/firebug.js) is included before this script,
 * calls to OpenLayers.Console methods will get redirected to window.console.
 * This makes use of the Firebug extension where available and allows for
 * cross-browser debugging Firebug style.
 *
 * Note:
 * Note that behavior will differ with the Firebug extension and Firebug Lite.
 * Most notably, the Firebug Lite console does not currently allow for
 * hyperlinks to code or for clicking on object to explore their properties.
 * 
 */
OpenLayers.Console = {
    /**
     * Create empty functions for all console methods.  The real value of these
     * properties will be set if Firebug Lite (../Firebug/firebug.js script) is
     * included.  We explicitly require the Firebug Lite script to trigger
     * functionality of the OpenLayers.Console methods.
     */
    
    /**
     * APIFunction: log
     * Log an object in the console.  The Firebug Lite console logs string
     * representation of objects.  Given multiple arguments, they will
     * be cast to strings and logged with a space delimiter.  If the first
     * argument is a string with printf-like formatting, subsequent arguments
     * will be used in string substitution.  Any additional arguments (beyond
     * the number substituted in a format string) will be appended in a space-
     * delimited line.
     * 
     * Parameters:
     * object - {Object}
     */
    log: function() {},

    /**
     * APIFunction: debug
     * Writes a message to the console, including a hyperlink to the line
     * where it was called.
     *
     * May be called with multiple arguments as with OpenLayers.Console.log().
     * 
     * Parameters:
     * object - {Object}
     */
    debug: function() {},

    /**
     * APIFunction: info
     * Writes a message to the console with the visual "info" icon and color
     * coding and a hyperlink to the line where it was called.
     *
     * May be called with multiple arguments as with OpenLayers.Console.log().
     * 
     * Parameters:
     * object - {Object}
     */
    info: function() {},

    /**
     * APIFunction: warn
     * Writes a message to the console with the visual "warning" icon and
     * color coding and a hyperlink to the line where it was called.
     *
     * May be called with multiple arguments as with OpenLayers.Console.log().
     * 
     * Parameters:
     * object - {Object}
     */
    warn: function() {},

    /**
     * APIFunction: error
     * Writes a message to the console with the visual "error" icon and color
     * coding and a hyperlink to the line where it was called.
     *
     * May be called with multiple arguments as with OpenLayers.Console.log().
     * 
     * Parameters:
     * object - {Object}
     */
    error: function() {},
    
    /**
     * APIFunction: userError
     * A single interface for showing error messages to the user. The default
     * behavior is a Javascript alert, though this can be overridden by
     * reassigning OpenLayers.Console.userError to a different function.
     *
     * Expects a single error message
     * 
     * Parameters:
     * error - {Object}
     */
    userError: function(error) {
        alert(error);
    },

    /**
     * APIFunction: assert
     * Tests that an expression is true. If not, it will write a message to
     * the console and throw an exception.
     *
     * May be called with multiple arguments as with OpenLayers.Console.log().
     * 
     * Parameters:
     * object - {Object}
     */
    assert: function() {},

    /**
     * APIFunction: dir
     * Prints an interactive listing of all properties of the object. This
     * looks identical to the view that you would see in the DOM tab.
     * 
     * Parameters:
     * object - {Object}
     */
    dir: function() {},

    /**
     * APIFunction: dirxml
     * Prints the XML source tree of an HTML or XML element. This looks
     * identical to the view that you would see in the HTML tab. You can click
     * on any node to inspect it in the HTML tab.
     * 
     * Parameters:
     * object - {Object}
     */
    dirxml: function() {},

    /**
     * APIFunction: trace
     * Prints an interactive stack trace of JavaScript execution at the point
     * where it is called.  The stack trace details the functions on the stack,
     * as well as the values that were passed as arguments to each function.
     * You can click each function to take you to its source in the Script tab,
     * and click each argument value to inspect it in the DOM or HTML tabs.
     * 
     */
    trace: function() {},

    /**
     * APIFunction: group
     * Writes a message to the console and opens a nested block to indent all
     * future messages sent to the console. Call OpenLayers.Console.groupEnd()
     * to close the block.
     *
     * May be called with multiple arguments as with OpenLayers.Console.log().
     * 
     * Parameters:
     * object - {Object}
     */
    group: function() {},

    /**
     * APIFunction: groupEnd
     * Closes the most recently opened block created by a call to
     * OpenLayers.Console.group
     */
    groupEnd: function() {},
    
    /**
     * APIFunction: time
     * Creates a new timer under the given name. Call
     * OpenLayers.Console.timeEnd(name)
     * with the same name to stop the timer and print the time elapsed.
     *
     * Parameters:
     * name - {String}
     */
    time: function() {},

    /**
     * APIFunction: timeEnd
     * Stops a timer created by a call to OpenLayers.Console.time(name) and
     * writes the time elapsed.
     *
     * Parameters:
     * name - {String}
     */
    timeEnd: function() {},

    /**
     * APIFunction: profile
     * Turns on the JavaScript profiler. The optional argument title would
     * contain the text to be printed in the header of the profile report.
     *
     * This function is not currently implemented in Firebug Lite.
     * 
     * Parameters:
     * title - {String} Optional title for the profiler
     */
    profile: function() {},

    /**
     * APIFunction: profileEnd
     * Turns off the JavaScript profiler and prints its report.
     * 
     * This function is not currently implemented in Firebug Lite.
     */
    profileEnd: function() {},

    /**
     * APIFunction: count
     * Writes the number of times that the line of code where count was called
     * was executed. The optional argument title will print a message in
     * addition to the number of the count.
     *
     * This function is not currently implemented in Firebug Lite.
     *
     * Parameters:
     * title - {String} Optional title to be printed with count
     */
    count: function() {},

    CLASS_NAME: "OpenLayers.Console"
};

/**
 * Execute an anonymous function to extend the OpenLayers.Console namespace
 * if the firebug.js script is included.  This closure is used so that the
 * "scripts" and "i" variables don't pollute the global namespace.
 */
(function() {
    /**
     * If Firebug Lite is included (before this script), re-route all
     * OpenLayers.Console calls to the console object.
     */
    var scripts = document.getElementsByTagName("script");
    for(var i=0, len=scripts.length; i<len; ++i) {
        if(scripts[i].src.indexOf("firebug.js") != -1) {
            if(console) {
                OpenLayers.Util.extend(OpenLayers.Console, console);
                break;
            }
        }
    }
})();
/* ======================================================================
    OpenLayers/Lang.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/BaseTypes.js
 * @requires OpenLayers/Console.js
 */

/**
 * Namespace: OpenLayers.Lang
 * Internationalization namespace.  Contains dictionaries in various languages
 *     and methods to set and get the current language.
 */
OpenLayers.Lang = {
    
    /** 
     * Property: code
     * {String}  Current language code to use in OpenLayers.  Use the
     *     <setCode> method to set this value and the <getCode> method to
     *     retrieve it.
     */
    code: null,

    /** 
     * APIProperty: defaultCode
     * {String} Default language to use when a specific language can't be
     *     found.  Default is "en".
     */
    defaultCode: "en",
        
    /**
     * APIFunction: getCode
     * Get the current language code.
     *
     * Returns:
     * {String} The current language code.
     */
    getCode: function() {
        if(!OpenLayers.Lang.code) {
            OpenLayers.Lang.setCode();
        }
        return OpenLayers.Lang.code;
    },
    
    /**
     * APIFunction: setCode
     * Set the language code for string translation.  This code is used by
     *     the <OpenLayers.Lang.translate> method.
     *
     * Parameters:
     * code - {String} These codes follow the IETF recommendations at
     *     http://www.ietf.org/rfc/rfc3066.txt.  If no value is set, the
     *     browser's language setting will be tested.  If no <OpenLayers.Lang>
     *     dictionary exists for the code, the <OpenLayers.String.defaultLang>
     *     will be used.
     */
    setCode: function(code) {
        var lang;
        if(!code) {
            code = (OpenLayers.BROWSER_NAME == "msie") ?
                navigator.userLanguage : navigator.language;
        }
        var parts = code.split('-');
        parts[0] = parts[0].toLowerCase();
        if(typeof OpenLayers.Lang[parts[0]] == "object") {
            lang = parts[0];
        }

        // check for regional extensions
        if(parts[1]) {
            var testLang = parts[0] + '-' + parts[1].toUpperCase();
            if(typeof OpenLayers.Lang[testLang] == "object") {
                lang = testLang;
            }
        }
        if(!lang) {
            OpenLayers.Console.warn(
                'Failed to find OpenLayers.Lang.' + parts.join("-") +
                ' dictionary, falling back to default language'
            );
            lang = OpenLayers.Lang.defaultCode;
        }
        
        OpenLayers.Lang.code = lang;
    },

    /**
     * APIMethod: translate
     * Looks up a key from a dictionary based on the current language string.
     *     The value of <getCode> will be used to determine the appropriate
     *     dictionary.  Dictionaries are stored in <OpenLayers.Lang>.
     *
     * Parameters:
     * key - {String} The key for an i18n string value in the dictionary.
     * context - {Object} Optional context to be used with
     *     <OpenLayers.String.format>.
     * 
     * Returns:
     * {String} A internationalized string.
     */
    translate: function(key, context) {
        var dictionary = OpenLayers.Lang[OpenLayers.Lang.getCode()];
        var message = dictionary && dictionary[key];
        if(!message) {
            // Message not found, fall back to message key
            message = key;
        }
        if(context) {
            message = OpenLayers.String.format(message, context);
        }
        return message;
    }
    
};


/**
 * APIMethod: OpenLayers.i18n
 * Alias for <OpenLayers.Lang.translate>.  Looks up a key from a dictionary
 *     based on the current language string. The value of
 *     <OpenLayers.Lang.getCode> will be used to determine the appropriate
 *     dictionary.  Dictionaries are stored in <OpenLayers.Lang>.
 *
 * Parameters:
 * key - {String} The key for an i18n string value in the dictionary.
 * context - {Object} Optional context to be used with
 *     <OpenLayers.String.format>.
 * 
 * Returns:
 * {String} A internationalized string.
 */
OpenLayers.i18n = OpenLayers.Lang.translate;
/* ======================================================================
    OpenLayers/Util.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/BaseTypes.js
 * @requires OpenLayers/BaseTypes/Bounds.js
 * @requires OpenLayers/BaseTypes/Element.js
 * @requires OpenLayers/BaseTypes/LonLat.js
 * @requires OpenLayers/BaseTypes/Pixel.js
 * @requires OpenLayers/BaseTypes/Size.js
 * @requires OpenLayers/Lang.js
 */

/**
 * Namespace: Util
 */
OpenLayers.Util = OpenLayers.Util || {};

/** 
 * Function: getElement
 * This is the old $() from prototype
 *
 * Parameters:
 * e - {String or DOMElement or Window}
 *
 * Returns:
 * {Array(DOMElement) or DOMElement}
 */
OpenLayers.Util.getElement = function() {
    var elements = [];

    for (var i=0, len=arguments.length; i<len; i++) {
        var element = arguments[i];
        if (typeof element == 'string') {
            element = document.getElementById(element);
        }
        if (arguments.length == 1) {
            return element;
        }
        elements.push(element);
    }
    return elements;
};

/**
 * Function: isElement
 * A cross-browser implementation of "e instanceof Element".
 *
 * Parameters:
 * o - {Object} The object to test.
 *
 * Returns:
 * {Boolean}
 */
OpenLayers.Util.isElement = function(o) {
    return !!(o && o.nodeType === 1);
};

/**
 * Function: isArray
 * Tests that the provided object is an array.
 * This test handles the cross-IFRAME case not caught
 * by "a instanceof Array" and should be used instead.
 * 
 * Parameters:
 * a - {Object} the object test.
 * 
 * Returns:
 * {Boolean} true if the object is an array.
 */
OpenLayers.Util.isArray = function(a) {
    return (Object.prototype.toString.call(a) === '[object Array]');
};

/** 
 * Function: removeItem
 * Remove an object from an array. Iterates through the array
 *     to find the item, then removes it.
 *
 * Parameters:
 * array - {Array}
 * item - {Object}
 * 
 * Returns:
 * {Array} A reference to the array
 */
OpenLayers.Util.removeItem = function(array, item) {
    for(var i = array.length - 1; i >= 0; i--) {
        if(array[i] == item) {
            array.splice(i,1);
            //break;more than once??
        }
    }
    return array;
};

/** 
 * Function: indexOf
 * Seems to exist already in FF, but not in MOZ.
 * 
 * Parameters:
 * array - {Array}
 * obj - {*}
 * 
 * Returns:
 * {Integer} The index at which the first object was found in the array.
 *           If not found, returns -1.
 */
OpenLayers.Util.indexOf = function(array, obj) {
    // use the build-in function if available.
    if (typeof array.indexOf == "function") {
        return array.indexOf(obj);
    } else {
        for (var i = 0, len = array.length; i < len; i++) {
            if (array[i] == obj) {
                return i;
            }
        }
        return -1;   
    }
};


/**
 * Property: dotless
 * {RegExp}
 * Compiled regular expression to match dots (".").  This is used for replacing
 *     dots in identifiers.  Because object identifiers are frequently used for
 *     DOM element identifiers by the library, we avoid using dots to make for
 *     more sensible CSS selectors.
 *
 * TODO: Use a module pattern to avoid bloating the API with stuff like this.
 */
OpenLayers.Util.dotless = /\./g;

/**
 * Function: modifyDOMElement
 * 
 * Modifies many properties of a DOM element all at once.  Passing in 
 * null to an individual parameter will avoid setting the attribute.
 *
 * Parameters:
 * element - {DOMElement} DOM element to modify.
 * id - {String} The element id attribute to set.  Note that dots (".") will be
 *     replaced with underscore ("_") in setting the element id.
 * px - {<OpenLayers.Pixel>|Object} The element left and top position,
 *                                  OpenLayers.Pixel or an object with
 *                                  a 'x' and 'y' properties.
 * sz - {<OpenLayers.Size>|Object} The element width and height,
 *                                 OpenLayers.Size or an object with a
 *                                 'w' and 'h' properties.
 * position - {String}       The position attribute.  eg: absolute, 
 *                           relative, etc.
 * border - {String}         The style.border attribute.  eg:
 *                           solid black 2px
 * overflow - {String}       The style.overview attribute.  
 * opacity - {Float}         Fractional value (0.0 - 1.0)
 */
OpenLayers.Util.modifyDOMElement = function(element, id, px, sz, position, 
                                            border, overflow, opacity) {

    if (id) {
        element.id = id.replace(OpenLayers.Util.dotless, "_");
    }
    if (px) {
        element.style.left = px.x + "px";
        element.style.top = px.y + "px";
    }
    if (sz) {
        element.style.width = sz.w + "px";
        element.style.height = sz.h + "px";
    }
    if (position) {
        element.style.position = position;
    }
    if (border) {
        element.style.border = border;
    }
    if (overflow) {
        element.style.overflow = overflow;
    }
    if (parseFloat(opacity) >= 0.0 && parseFloat(opacity) < 1.0) {
        element.style.filter = 'alpha(opacity=' + (opacity * 100) + ')';
        element.style.opacity = opacity;
    } else if (parseFloat(opacity) == 1.0) {
        element.style.filter = '';
        element.style.opacity = '';
    }
};

/** 
 * Function: createDiv
 * Creates a new div and optionally set some standard attributes.
 * Null may be passed to each parameter if you do not wish to
 * set a particular attribute.
 * Note - zIndex is NOT set on the resulting div.
 * 
 * Parameters:
 * id - {String} An identifier for this element.  If no id is
 *               passed an identifier will be created 
 *               automatically.  Note that dots (".") will be replaced with
 *               underscore ("_") when generating ids.
 * px - {<OpenLayers.Pixel>|Object} The element left and top position,
 *                                  OpenLayers.Pixel or an object with
 *                                  a 'x' and 'y' properties.
 * sz - {<OpenLayers.Size>|Object} The element width and height,
 *                                 OpenLayers.Size or an object with a
 *                                 'w' and 'h' properties.
 * imgURL - {String} A url pointing to an image to use as a 
 *                   background image.
 * position - {String} The style.position value. eg: absolute,
 *                     relative etc.
 * border - {String} The the style.border value. 
 *                   eg: 2px solid black
 * overflow - {String} The style.overflow value. Eg. hidden
 * opacity - {Float} Fractional value (0.0 - 1.0)
 * 
 * Returns: 
 * {DOMElement} A DOM Div created with the specified attributes.
 */
OpenLayers.Util.createDiv = function(id, px, sz, imgURL, position, 
                                     border, overflow, opacity) {

    var dom = document.createElement('div');

    if (imgURL) {
        dom.style.backgroundImage = 'url(' + imgURL + ')';
    }

    //set generic properties
    if (!id) {
        id = OpenLayers.Util.createUniqueID("OpenLayersDiv");
    }
    if (!position) {
        position = "absolute";
    }
    OpenLayers.Util.modifyDOMElement(dom, id, px, sz, position, 
                                     border, overflow, opacity);

    return dom;
};

/**
 * Function: createImage
 * Creates an img element with specific attribute values.
 *  
 * Parameters:
 * id - {String} The id field for the img.  If none assigned one will be
 *               automatically generated.
 * px - {<OpenLayers.Pixel>|Object} The element left and top position,
 *                                  OpenLayers.Pixel or an object with
 *                                  a 'x' and 'y' properties.
 * sz - {<OpenLayers.Size>|Object} The element width and height,
 *                                 OpenLayers.Size or an object with a
 *                                 'w' and 'h' properties.
 * imgURL - {String} The url to use as the image source.
 * position - {String} The style.position value.
 * border - {String} The border to place around the image.
 * opacity - {Float} Fractional value (0.0 - 1.0)
 * delayDisplay - {Boolean} If true waits until the image has been
 *                          loaded.
 * 
 * Returns:
 * {DOMElement} A DOM Image created with the specified attributes.
 */
OpenLayers.Util.createImage = function(id, px, sz, imgURL, position, border,
                                       opacity, delayDisplay) {

    var image = document.createElement("img");

    //set generic properties
    if (!id) {
        id = OpenLayers.Util.createUniqueID("OpenLayersDiv");
    }
    if (!position) {
        position = "relative";
    }
    OpenLayers.Util.modifyDOMElement(image, id, px, sz, position, 
                                     border, null, opacity);

    if (delayDisplay) {
        image.style.display = "none";
        function display() {
            image.style.display = "";
            OpenLayers.Event.stopObservingElement(image);
        }
        OpenLayers.Event.observe(image, "load", display);
        OpenLayers.Event.observe(image, "error", display);
    }
    
    //set special properties
    image.style.alt = id;
    image.galleryImg = "no";
    if (imgURL) {
        image.src = imgURL;
    }
        
    return image;
};

/**
 * Property: IMAGE_RELOAD_ATTEMPTS
 * {Integer} How many times should we try to reload an image before giving up?
 *           Default is 0
 */
OpenLayers.IMAGE_RELOAD_ATTEMPTS = 0;

/**
 * Property: alphaHackNeeded
 * {Boolean} true if the png alpha hack is necessary and possible, false otherwise.
 */
OpenLayers.Util.alphaHackNeeded = null;

/**
 * Function: alphaHack
 * Checks whether it's necessary (and possible) to use the png alpha
 * hack which allows alpha transparency for png images under Internet
 * Explorer.
 * 
 * Returns:
 * {Boolean} true if the png alpha hack is necessary and possible, false otherwise.
 */
OpenLayers.Util.alphaHack = function() {
    if (OpenLayers.Util.alphaHackNeeded == null) {
        var arVersion = navigator.appVersion.split("MSIE");
        var version = parseFloat(arVersion[1]);
        var filter = false;
    
        // IEs4Lin dies when trying to access document.body.filters, because 
        // the property is there, but requires a DLL that can't be provided. This
        // means that we need to wrap this in a try/catch so that this can
        // continue.
    
        try { 
            filter = !!(document.body.filters);
        } catch (e) {}    
    
        OpenLayers.Util.alphaHackNeeded = (filter && 
                                           (version >= 5.5) && (version < 7));
    }
    return OpenLayers.Util.alphaHackNeeded;
};

/** 
 * Function: modifyAlphaImageDiv
 * 
 * Parameters:
 * div - {DOMElement} Div containing Alpha-adjusted Image
 * id - {String}
 * px - {<OpenLayers.Pixel>|Object} OpenLayers.Pixel or an object with
 *                                  a 'x' and 'y' properties.
 * sz - {<OpenLayers.Size>|Object} OpenLayers.Size or an object with
 *                                 a 'w' and 'h' properties.
 * imgURL - {String}
 * position - {String}
 * border - {String}
 * sizing - {String} 'crop', 'scale', or 'image'. Default is "scale"
 * opacity - {Float} Fractional value (0.0 - 1.0)
 */ 
OpenLayers.Util.modifyAlphaImageDiv = function(div, id, px, sz, imgURL, 
                                               position, border, sizing, 
                                               opacity) {

    OpenLayers.Util.modifyDOMElement(div, id, px, sz, position,
                                     null, null, opacity);

    var img = div.childNodes[0];

    if (imgURL) {
        img.src = imgURL;
    }
    OpenLayers.Util.modifyDOMElement(img, div.id + "_innerImage", null, sz, 
                                     "relative", border);
    
    if (OpenLayers.Util.alphaHack()) {
        if(div.style.display != "none") {
            div.style.display = "inline-block";
        }
        if (sizing == null) {
            sizing = "scale";
        }
        
        div.style.filter = "progid:DXImageTransform.Microsoft" +
                           ".AlphaImageLoader(src='" + img.src + "', " +
                           "sizingMethod='" + sizing + "')";
        if (parseFloat(div.style.opacity) >= 0.0 && 
            parseFloat(div.style.opacity) < 1.0) {
            div.style.filter += " alpha(opacity=" + div.style.opacity * 100 + ")";
        }

        img.style.filter = "alpha(opacity=0)";
    }
};

/** 
 * Function: createAlphaImageDiv
 * 
 * Parameters:
 * id - {String}
 * px - {<OpenLayers.Pixel>|Object} OpenLayers.Pixel or an object with
 *                                  a 'x' and 'y' properties.
 * sz - {<OpenLayers.Size>|Object} OpenLayers.Size or an object with
 *                                 a 'w' and 'h' properties.
 * imgURL - {String}
 * position - {String}
 * border - {String}
 * sizing - {String} 'crop', 'scale', or 'image'. Default is "scale"
 * opacity - {Float} Fractional value (0.0 - 1.0)
 * delayDisplay - {Boolean} If true waits until the image has been
 *                          loaded.
 * 
 * Returns:
 * {DOMElement} A DOM Div created with a DOM Image inside it. If the hack is 
 *              needed for transparency in IE, it is added.
 */ 
OpenLayers.Util.createAlphaImageDiv = function(id, px, sz, imgURL, 
                                               position, border, sizing, 
                                               opacity, delayDisplay) {
    
    var div = OpenLayers.Util.createDiv();
    var img = OpenLayers.Util.createImage(null, null, null, null, null, null, 
                                          null, delayDisplay);
    img.className = "olAlphaImg";
    div.appendChild(img);

    OpenLayers.Util.modifyAlphaImageDiv(div, id, px, sz, imgURL, position, 
                                        border, sizing, opacity);
    
    return div;
};


/** 
 * Function: upperCaseObject
 * Creates a new hashtable and copies over all the keys from the 
 *     passed-in object, but storing them under an uppercased
 *     version of the key at which they were stored.
 * 
 * Parameters: 
 * object - {Object}
 * 
 * Returns: 
 * {Object} A new Object with all the same keys but uppercased
 */
OpenLayers.Util.upperCaseObject = function (object) {
    var uObject = {};
    for (var key in object) {
        uObject[key.toUpperCase()] = object[key];
    }
    return uObject;
};

/** 
 * Function: applyDefaults
 * Takes an object and copies any properties that don't exist from
 *     another properties, by analogy with OpenLayers.Util.extend() from
 *     Prototype.js.
 * 
 * Parameters:
 * to - {Object} The destination object.
 * from - {Object} The source object.  Any properties of this object that
 *     are undefined in the to object will be set on the to object.
 *
 * Returns:
 * {Object} A reference to the to object.  Note that the to argument is modified
 *     in place and returned by this function.
 */
OpenLayers.Util.applyDefaults = function (to, from) {
    to = to || {};
    /*
     * FF/Windows < 2.0.0.13 reports "Illegal operation on WrappedNative
     * prototype object" when calling hawOwnProperty if the source object is an
     * instance of window.Event.
     */
    var fromIsEvt = typeof window.Event == "function"
                    && from instanceof window.Event;

    for (var key in from) {
        if (to[key] === undefined ||
            (!fromIsEvt && from.hasOwnProperty
             && from.hasOwnProperty(key) && !to.hasOwnProperty(key))) {
            to[key] = from[key];
        }
    }
    /**
     * IE doesn't include the toString property when iterating over an object's
     * properties with the for(property in object) syntax.  Explicitly check if
     * the source has its own toString property.
     */
    if(!fromIsEvt && from && from.hasOwnProperty
       && from.hasOwnProperty('toString') && !to.hasOwnProperty('toString')) {
        to.toString = from.toString;
    }
    
    return to;
};

/**
 * Function: getParameterString
 * 
 * Parameters:
 * params - {Object}
 * 
 * Returns:
 * {String} A concatenation of the properties of an object in 
 *          http parameter notation. 
 *          (ex. <i>"key1=value1&key2=value2&key3=value3"</i>)
 *          If a parameter is actually a list, that parameter will then
 *          be set to a comma-seperated list of values (foo,bar) instead
 *          of being URL escaped (foo%3Abar). 
 */
OpenLayers.Util.getParameterString = function(params) {
    var paramsArray = [];
    
    for (var key in params) {
      var value = params[key];
      if ((value != null) && (typeof value != 'function')) {
        var encodedValue;
        if (typeof value == 'object' && value.constructor == Array) {
          /* value is an array; encode items and separate with "," */
          var encodedItemArray = [];
          var item;
          for (var itemIndex=0, len=value.length; itemIndex<len; itemIndex++) {
            item = value[itemIndex];
            encodedItemArray.push(encodeURIComponent(
                (item === null || item === undefined) ? "" : item)
            );
          }
          encodedValue = encodedItemArray.join(",");
        }
        else {
          /* value is a string; simply encode */
          encodedValue = encodeURIComponent(value);
        }
        paramsArray.push(encodeURIComponent(key) + "=" + encodedValue);
      }
    }
    
    return paramsArray.join("&");
};

/**
 * Function: urlAppend
 * Appends a parameter string to a url. This function includes the logic for
 * using the appropriate character (none, & or ?) to append to the url before
 * appending the param string.
 * 
 * Parameters:
 * url - {String} The url to append to
 * paramStr - {String} The param string to append
 * 
 * Returns:
 * {String} The new url
 */
OpenLayers.Util.urlAppend = function(url, paramStr) {
    var newUrl = url;
    if(paramStr) {
        var parts = (url + " ").split(/[?&]/);
        newUrl += (parts.pop() === " " ?
            paramStr :
            parts.length ? "&" + paramStr : "?" + paramStr);
    }
    return newUrl;
};

/** 
 * Function: getImagesLocation
 * 
 * Returns:
 * {String} The fully formatted image location string
 */
OpenLayers.Util.getImagesLocation = function() {
    return OpenLayers.ImgPath || (OpenLayers._getScriptLocation() + "img/");
};

/** 
 * Function: getImageLocation
 * 
 * Returns:
 * {String} The fully formatted location string for a specified image
 */
OpenLayers.Util.getImageLocation = function(image) {
    return OpenLayers.Util.getImagesLocation() + image;
};


/** 
 * Function: Try
 * Execute functions until one of them doesn't throw an error. 
 *     Capitalized because "try" is a reserved word in JavaScript.
 *     Taken directly from OpenLayers.Util.Try()
 * 
 * Parameters:
 * [*] - {Function} Any number of parameters may be passed to Try()
 *    It will attempt to execute each of them until one of them 
 *    successfully executes. 
 *    If none executes successfully, returns null.
 * 
 * Returns:
 * {*} The value returned by the first successfully executed function.
 */
OpenLayers.Util.Try = function() {
    var returnValue = null;

    for (var i=0, len=arguments.length; i<len; i++) {
      var lambda = arguments[i];
      try {
        returnValue = lambda();
        break;
      } catch (e) {}
    }

    return returnValue;
};

/**
 * Function: getXmlNodeValue
 * 
 * Parameters:
 * node - {XMLNode}
 * 
 * Returns:
 * {String} The text value of the given node, without breaking in firefox or IE
 */
OpenLayers.Util.getXmlNodeValue = function(node) {
    var val = null;
    OpenLayers.Util.Try( 
        function() {
            val = node.text;
            if (!val) {
                val = node.textContent;
            }
            if (!val) {
                val = node.firstChild.nodeValue;
            }
        }, 
        function() {
            val = node.textContent;
        }); 
    return val;
};

/** 
 * Function: mouseLeft
 * 
 * Parameters:
 * evt - {Event}
 * div - {HTMLDivElement}
 * 
 * Returns:
 * {Boolean}
 */
OpenLayers.Util.mouseLeft = function (evt, div) {
    // start with the element to which the mouse has moved
    var target = (evt.relatedTarget) ? evt.relatedTarget : evt.toElement;
    // walk up the DOM tree.
    while (target != div && target != null) {
        target = target.parentNode;
    }
    // if the target we stop at isn't the div, then we've left the div.
    return (target != div);
};

/**
 * Property: precision
 * {Number} The number of significant digits to retain to avoid
 * floating point precision errors.
 *
 * We use 14 as a "safe" default because, although IEEE 754 double floats
 * (standard on most modern operating systems) support up to about 16
 * significant digits, 14 significant digits are sufficient to represent
 * sub-millimeter accuracy in any coordinate system that anyone is likely to
 * use with OpenLayers.
 *
 * If DEFAULT_PRECISION is set to 0, the original non-truncating behavior
 * of OpenLayers <2.8 is preserved. Be aware that this will cause problems
 * with certain projections, e.g. spherical Mercator.
 *
 */
OpenLayers.Util.DEFAULT_PRECISION = 14;

/**
 * Function: toFloat
 * Convenience method to cast an object to a Number, rounded to the
 * desired floating point precision.
 *
 * Parameters:
 * number    - {Number} The number to cast and round.
 * precision - {Number} An integer suitable for use with
 *      Number.toPrecision(). Defaults to OpenLayers.Util.DEFAULT_PRECISION.
 *      If set to 0, no rounding is performed.
 *
 * Returns:
 * {Number} The cast, rounded number.
 */
OpenLayers.Util.toFloat = function (number, precision) {
    if (precision == null) {
        precision = OpenLayers.Util.DEFAULT_PRECISION;
    }
    if (typeof number !== "number") {
        number = parseFloat(number);
    }
    return precision === 0 ? number :
                             parseFloat(number.toPrecision(precision));
};

/**
 * Function: rad
 * 
 * Parameters:
 * x - {Float}
 * 
 * Returns:
 * {Float}
 */
OpenLayers.Util.rad = function(x) {return x*Math.PI/180;};

/**
 * Function: deg
 *
 * Parameters:
 * x - {Float}
 *
 * Returns:
 * {Float}
 */
OpenLayers.Util.deg = function(x) {return x*180/Math.PI;};

/**
 * Property: VincentyConstants
 * {Object} Constants for Vincenty functions.
 */
OpenLayers.Util.VincentyConstants = {
    a: 6378137,
    b: 6356752.3142,
    f: 1/298.257223563
};

/**
 * APIFunction: distVincenty
 * Given two objects representing points with geographic coordinates, this
 *     calculates the distance between those points on the surface of an
 *     ellipsoid.
 *
 * Parameters:
 * p1 - {<OpenLayers.LonLat>} (or any object with both .lat, .lon properties)
 * p2 - {<OpenLayers.LonLat>} (or any object with both .lat, .lon properties)
 *
 * Returns:
 * {Float} The distance (in km) between the two input points as measured on an
 *     ellipsoid.  Note that the input point objects must be in geographic
 *     coordinates (decimal degrees) and the return distance is in kilometers.
 */
OpenLayers.Util.distVincenty = function(p1, p2) {
    var ct = OpenLayers.Util.VincentyConstants;
    var a = ct.a, b = ct.b, f = ct.f;

    var L = OpenLayers.Util.rad(p2.lon - p1.lon);
    var U1 = Math.atan((1-f) * Math.tan(OpenLayers.Util.rad(p1.lat)));
    var U2 = Math.atan((1-f) * Math.tan(OpenLayers.Util.rad(p2.lat)));
    var sinU1 = Math.sin(U1), cosU1 = Math.cos(U1);
    var sinU2 = Math.sin(U2), cosU2 = Math.cos(U2);
    var lambda = L, lambdaP = 2*Math.PI;
    var iterLimit = 20;
    while (Math.abs(lambda-lambdaP) > 1e-12 && --iterLimit>0) {
        var sinLambda = Math.sin(lambda), cosLambda = Math.cos(lambda);
        var sinSigma = Math.sqrt((cosU2*sinLambda) * (cosU2*sinLambda) +
        (cosU1*sinU2-sinU1*cosU2*cosLambda) * (cosU1*sinU2-sinU1*cosU2*cosLambda));
        if (sinSigma==0) {
            return 0;  // co-incident points
        }
        var cosSigma = sinU1*sinU2 + cosU1*cosU2*cosLambda;
        var sigma = Math.atan2(sinSigma, cosSigma);
        var alpha = Math.asin(cosU1 * cosU2 * sinLambda / sinSigma);
        var cosSqAlpha = Math.cos(alpha) * Math.cos(alpha);
        var cos2SigmaM = cosSigma - 2*sinU1*sinU2/cosSqAlpha;
        var C = f/16*cosSqAlpha*(4+f*(4-3*cosSqAlpha));
        lambdaP = lambda;
        lambda = L + (1-C) * f * Math.sin(alpha) *
        (sigma + C*sinSigma*(cos2SigmaM+C*cosSigma*(-1+2*cos2SigmaM*cos2SigmaM)));
    }
    if (iterLimit==0) {
        return NaN;  // formula failed to converge
    }
    var uSq = cosSqAlpha * (a*a - b*b) / (b*b);
    var A = 1 + uSq/16384*(4096+uSq*(-768+uSq*(320-175*uSq)));
    var B = uSq/1024 * (256+uSq*(-128+uSq*(74-47*uSq)));
    var deltaSigma = B*sinSigma*(cos2SigmaM+B/4*(cosSigma*(-1+2*cos2SigmaM*cos2SigmaM)-
        B/6*cos2SigmaM*(-3+4*sinSigma*sinSigma)*(-3+4*cos2SigmaM*cos2SigmaM)));
    var s = b*A*(sigma-deltaSigma);
    var d = s.toFixed(3)/1000; // round to 1mm precision
    return d;
};

/**
 * APIFunction: destinationVincenty
 * Calculate destination point given start point lat/long (numeric degrees),
 * bearing (numeric degrees) & distance (in m).
 * Adapted from Chris Veness work, see
 * http://www.movable-type.co.uk/scripts/latlong-vincenty-direct.html
 *
 * Parameters:
 * lonlat  - {<OpenLayers.LonLat>} (or any object with both .lat, .lon
 *     properties) The start point.
 * brng     - {Float} The bearing (degrees).
 * dist     - {Float} The ground distance (meters).
 *
 * Returns:
 * {<OpenLayers.LonLat>} The destination point.
 */
OpenLayers.Util.destinationVincenty = function(lonlat, brng, dist) {
    var u = OpenLayers.Util;
    var ct = u.VincentyConstants;
    var a = ct.a, b = ct.b, f = ct.f;

    var lon1 = lonlat.lon;
    var lat1 = lonlat.lat;

    var s = dist;
    var alpha1 = u.rad(brng);
    var sinAlpha1 = Math.sin(alpha1);
    var cosAlpha1 = Math.cos(alpha1);

    var tanU1 = (1-f) * Math.tan(u.rad(lat1));
    var cosU1 = 1 / Math.sqrt((1 + tanU1*tanU1)), sinU1 = tanU1*cosU1;
    var sigma1 = Math.atan2(tanU1, cosAlpha1);
    var sinAlpha = cosU1 * sinAlpha1;
    var cosSqAlpha = 1 - sinAlpha*sinAlpha;
    var uSq = cosSqAlpha * (a*a - b*b) / (b*b);
    var A = 1 + uSq/16384*(4096+uSq*(-768+uSq*(320-175*uSq)));
    var B = uSq/1024 * (256+uSq*(-128+uSq*(74-47*uSq)));

    var sigma = s / (b*A), sigmaP = 2*Math.PI;
    while (Math.abs(sigma-sigmaP) > 1e-12) {
        var cos2SigmaM = Math.cos(2*sigma1 + sigma);
        var sinSigma = Math.sin(sigma);
        var cosSigma = Math.cos(sigma);
        var deltaSigma = B*sinSigma*(cos2SigmaM+B/4*(cosSigma*(-1+2*cos2SigmaM*cos2SigmaM)-
            B/6*cos2SigmaM*(-3+4*sinSigma*sinSigma)*(-3+4*cos2SigmaM*cos2SigmaM)));
        sigmaP = sigma;
        sigma = s / (b*A) + deltaSigma;
    }

    var tmp = sinU1*sinSigma - cosU1*cosSigma*cosAlpha1;
    var lat2 = Math.atan2(sinU1*cosSigma + cosU1*sinSigma*cosAlpha1,
        (1-f)*Math.sqrt(sinAlpha*sinAlpha + tmp*tmp));
    var lambda = Math.atan2(sinSigma*sinAlpha1, cosU1*cosSigma - sinU1*sinSigma*cosAlpha1);
    var C = f/16*cosSqAlpha*(4+f*(4-3*cosSqAlpha));
    var L = lambda - (1-C) * f * sinAlpha *
        (sigma + C*sinSigma*(cos2SigmaM+C*cosSigma*(-1+2*cos2SigmaM*cos2SigmaM)));

    var revAz = Math.atan2(sinAlpha, -tmp);  // final bearing

    return new OpenLayers.LonLat(lon1+u.deg(L), u.deg(lat2));
};

/**
 * Function: getParameters
 * Parse the parameters from a URL or from the current page itself into a 
 *     JavaScript Object. Note that parameter values with commas are separated
 *     out into an Array.
 * 
 * Parameters:
 * url - {String} Optional url used to extract the query string.
 *                If url is null or is not supplied, query string is taken 
 *                from the page location.
 * options - {Object} Additional options. Optional.
 *
 * Valid options:
 *   splitArgs - {Boolean} Split comma delimited params into arrays? Default is
 *       true.
 * 
 * Returns:
 * {Object} An object of key/value pairs from the query string.
 */
OpenLayers.Util.getParameters = function(url, options) {
    options = options || {};
    // if no url specified, take it from the location bar
    url = (url === null || url === undefined) ? window.location.href : url;

    //parse out parameters portion of url string
    var paramsString = "";
    if (OpenLayers.String.contains(url, '?')) {
        var start = url.indexOf('?') + 1;
        var end = OpenLayers.String.contains(url, "#") ?
                    url.indexOf('#') : url.length;
        paramsString = url.substring(start, end);
    }

    var parameters = {};
    var pairs = paramsString.split(/[&;]/);
    for(var i=0, len=pairs.length; i<len; ++i) {
        var keyValue = pairs[i].split('=');
        if (keyValue[0]) {

            var key = keyValue[0];
            try {
                key = decodeURIComponent(key);
            } catch (err) {
                key = unescape(key);
            }
            
            // being liberal by replacing "+" with " "
            var value = (keyValue[1] || '').replace(/\+/g, " ");

            try {
                value = decodeURIComponent(value);
            } catch (err) {
                value = unescape(value);
            }
            
            // follow OGC convention of comma delimited values
            if (options.splitArgs !== false) {
                value = value.split(",");
            }

            //if there's only one value, do not return as array                    
            if (value.length == 1) {
                value = value[0];
            }                
            
            parameters[key] = value;
         }
     }
    return parameters;
};

/**
 * Property: lastSeqID
 * {Integer} The ever-incrementing count variable.
 *           Used for generating unique ids.
 */
OpenLayers.Util.lastSeqID = 0;

/**
 * Function: createUniqueID
 * Create a unique identifier for this session.  Each time this function
 *     is called, a counter is incremented.  The return will be the optional
 *     prefix (defaults to "id_") appended with the counter value.
 * 
 * Parameters:
 * prefix - {String} Optional string to prefix unique id. Default is "id_".
 *     Note that dots (".") in the prefix will be replaced with underscore ("_").
 * 
 * Returns:
 * {String} A unique id string, built on the passed in prefix.
 */
OpenLayers.Util.createUniqueID = function(prefix) {
    if (prefix == null) {
        prefix = "id_";
    } else {
        prefix = prefix.replace(OpenLayers.Util.dotless, "_");
    }
    OpenLayers.Util.lastSeqID += 1; 
    return prefix + OpenLayers.Util.lastSeqID;        
};

/**
 * Constant: INCHES_PER_UNIT
 * {Object} Constant inches per unit -- borrowed from MapServer mapscale.c
 * derivation of nautical miles from http://en.wikipedia.org/wiki/Nautical_mile
 * Includes the full set of units supported by CS-MAP (http://trac.osgeo.org/csmap/)
 * and PROJ.4 (http://trac.osgeo.org/proj/)
 * The hardcoded table is maintain in a CS-MAP source code module named CSdataU.c
 * The hardcoded table of PROJ.4 units are in pj_units.c.
 */
OpenLayers.INCHES_PER_UNIT = { 
    'inches': 1.0,
    'ft': 12.0,
    'mi': 63360.0,
    'm': 39.37,
    'km': 39370,
    'dd': 4374754,
    'yd': 36
};
OpenLayers.INCHES_PER_UNIT["in"]= OpenLayers.INCHES_PER_UNIT.inches;
OpenLayers.INCHES_PER_UNIT["degrees"] = OpenLayers.INCHES_PER_UNIT.dd;
OpenLayers.INCHES_PER_UNIT["nmi"] = 1852 * OpenLayers.INCHES_PER_UNIT.m;

// Units from CS-Map
OpenLayers.METERS_PER_INCH = 0.02540005080010160020;
OpenLayers.Util.extend(OpenLayers.INCHES_PER_UNIT, {
    "Inch": OpenLayers.INCHES_PER_UNIT.inches,
    "Meter": 1.0 / OpenLayers.METERS_PER_INCH,   //EPSG:9001
    "Foot": 0.30480060960121920243 / OpenLayers.METERS_PER_INCH,   //EPSG:9003
    "IFoot": 0.30480000000000000000 / OpenLayers.METERS_PER_INCH,   //EPSG:9002
    "ClarkeFoot": 0.3047972651151 / OpenLayers.METERS_PER_INCH,   //EPSG:9005
    "SearsFoot": 0.30479947153867624624 / OpenLayers.METERS_PER_INCH,   //EPSG:9041
    "GoldCoastFoot": 0.30479971018150881758 / OpenLayers.METERS_PER_INCH,   //EPSG:9094
    "IInch": 0.02540000000000000000 / OpenLayers.METERS_PER_INCH,
    "MicroInch": 0.00002540000000000000 / OpenLayers.METERS_PER_INCH,
    "Mil": 0.00000002540000000000 / OpenLayers.METERS_PER_INCH,
    "Centimeter": 0.01000000000000000000 / OpenLayers.METERS_PER_INCH,
    "Kilometer": 1000.00000000000000000000 / OpenLayers.METERS_PER_INCH,   //EPSG:9036
    "Yard": 0.91440182880365760731 / OpenLayers.METERS_PER_INCH,
    "SearsYard": 0.914398414616029 / OpenLayers.METERS_PER_INCH,   //EPSG:9040
    "IndianYard": 0.91439853074444079983 / OpenLayers.METERS_PER_INCH,   //EPSG:9084
    "IndianYd37": 0.91439523 / OpenLayers.METERS_PER_INCH,   //EPSG:9085
    "IndianYd62": 0.9143988 / OpenLayers.METERS_PER_INCH,   //EPSG:9086
    "IndianYd75": 0.9143985 / OpenLayers.METERS_PER_INCH,   //EPSG:9087
    "IndianFoot": 0.30479951 / OpenLayers.METERS_PER_INCH,   //EPSG:9080
    "IndianFt37": 0.30479841 / OpenLayers.METERS_PER_INCH,   //EPSG:9081
    "IndianFt62": 0.3047996 / OpenLayers.METERS_PER_INCH,   //EPSG:9082
    "IndianFt75": 0.3047995 / OpenLayers.METERS_PER_INCH,   //EPSG:9083
    "Mile": 1609.34721869443738887477 / OpenLayers.METERS_PER_INCH,
    "IYard": 0.91440000000000000000 / OpenLayers.METERS_PER_INCH,   //EPSG:9096
    "IMile": 1609.34400000000000000000 / OpenLayers.METERS_PER_INCH,   //EPSG:9093
    "NautM": 1852.00000000000000000000 / OpenLayers.METERS_PER_INCH,   //EPSG:9030
    "Lat-66": 110943.316488932731 / OpenLayers.METERS_PER_INCH,
    "Lat-83": 110946.25736872234125 / OpenLayers.METERS_PER_INCH,
    "Decimeter": 0.10000000000000000000 / OpenLayers.METERS_PER_INCH,
    "Millimeter": 0.00100000000000000000 / OpenLayers.METERS_PER_INCH,
    "Dekameter": 10.00000000000000000000 / OpenLayers.METERS_PER_INCH,
    "Decameter": 10.00000000000000000000 / OpenLayers.METERS_PER_INCH,
    "Hectometer": 100.00000000000000000000 / OpenLayers.METERS_PER_INCH,
    "GermanMeter": 1.0000135965 / OpenLayers.METERS_PER_INCH,   //EPSG:9031
    "CaGrid": 0.999738 / OpenLayers.METERS_PER_INCH,
    "ClarkeChain": 20.1166194976 / OpenLayers.METERS_PER_INCH,   //EPSG:9038
    "GunterChain": 20.11684023368047 / OpenLayers.METERS_PER_INCH,   //EPSG:9033
    "BenoitChain": 20.116782494375872 / OpenLayers.METERS_PER_INCH,   //EPSG:9062
    "SearsChain": 20.11676512155 / OpenLayers.METERS_PER_INCH,   //EPSG:9042
    "ClarkeLink": 0.201166194976 / OpenLayers.METERS_PER_INCH,   //EPSG:9039
    "GunterLink": 0.2011684023368047 / OpenLayers.METERS_PER_INCH,   //EPSG:9034
    "BenoitLink": 0.20116782494375872 / OpenLayers.METERS_PER_INCH,   //EPSG:9063
    "SearsLink": 0.2011676512155 / OpenLayers.METERS_PER_INCH,   //EPSG:9043
    "Rod": 5.02921005842012 / OpenLayers.METERS_PER_INCH,
    "IntnlChain": 20.1168 / OpenLayers.METERS_PER_INCH,   //EPSG:9097
    "IntnlLink": 0.201168 / OpenLayers.METERS_PER_INCH,   //EPSG:9098
    "Perch": 5.02921005842012 / OpenLayers.METERS_PER_INCH,
    "Pole": 5.02921005842012 / OpenLayers.METERS_PER_INCH,
    "Furlong": 201.1684023368046 / OpenLayers.METERS_PER_INCH,
    "Rood": 3.778266898 / OpenLayers.METERS_PER_INCH,
    "CapeFoot": 0.3047972615 / OpenLayers.METERS_PER_INCH,
    "Brealey": 375.00000000000000000000 / OpenLayers.METERS_PER_INCH,
    "ModAmFt": 0.304812252984505969011938 / OpenLayers.METERS_PER_INCH,
    "Fathom": 1.8288 / OpenLayers.METERS_PER_INCH,
    "NautM-UK": 1853.184 / OpenLayers.METERS_PER_INCH,
    "50kilometers": 50000.0 / OpenLayers.METERS_PER_INCH,
    "150kilometers": 150000.0 / OpenLayers.METERS_PER_INCH
});

//unit abbreviations supported by PROJ.4
OpenLayers.Util.extend(OpenLayers.INCHES_PER_UNIT, {
    "mm": OpenLayers.INCHES_PER_UNIT["Meter"] / 1000.0,
    "cm": OpenLayers.INCHES_PER_UNIT["Meter"] / 100.0,
    "dm": OpenLayers.INCHES_PER_UNIT["Meter"] * 100.0,
    "km": OpenLayers.INCHES_PER_UNIT["Meter"] * 1000.0,
    "kmi": OpenLayers.INCHES_PER_UNIT["nmi"],    //International Nautical Mile
    "fath": OpenLayers.INCHES_PER_UNIT["Fathom"], //International Fathom
    "ch": OpenLayers.INCHES_PER_UNIT["IntnlChain"],  //International Chain
    "link": OpenLayers.INCHES_PER_UNIT["IntnlLink"], //International Link
    "us-in": OpenLayers.INCHES_PER_UNIT["inches"], //U.S. Surveyor's Inch
    "us-ft": OpenLayers.INCHES_PER_UNIT["Foot"], //U.S. Surveyor's Foot
    "us-yd": OpenLayers.INCHES_PER_UNIT["Yard"], //U.S. Surveyor's Yard
    "us-ch": OpenLayers.INCHES_PER_UNIT["GunterChain"], //U.S. Surveyor's Chain
    "us-mi": OpenLayers.INCHES_PER_UNIT["Mile"],   //U.S. Surveyor's Statute Mile
    "ind-yd": OpenLayers.INCHES_PER_UNIT["IndianYd37"],  //Indian Yard
    "ind-ft": OpenLayers.INCHES_PER_UNIT["IndianFt37"],  //Indian Foot
    "ind-ch": 20.11669506 / OpenLayers.METERS_PER_INCH  //Indian Chain
});

/** 
 * Constant: DOTS_PER_INCH
 * {Integer} 72 (A sensible default)
 */
OpenLayers.DOTS_PER_INCH = 72;

/**
 * Function: normalizeScale
 * 
 * Parameters:
 * scale - {float}
 * 
 * Returns:
 * {Float} A normalized scale value, in 1 / X format. 
 *         This means that if a value less than one ( already 1/x) is passed
 *         in, it just returns scale directly. Otherwise, it returns 
 *         1 / scale
 */
OpenLayers.Util.normalizeScale = function (scale) {
    var normScale = (scale > 1.0) ? (1.0 / scale) 
                                  : scale;
    return normScale;
};

/**
 * Function: getResolutionFromScale
 * 
 * Parameters:
 * scale - {Float}
 * units - {String} Index into OpenLayers.INCHES_PER_UNIT hashtable.
 *                  Default is degrees
 * 
 * Returns:
 * {Float} The corresponding resolution given passed-in scale and unit 
 *     parameters.  If the given scale is falsey, the returned resolution will
 *     be undefined.
 */
OpenLayers.Util.getResolutionFromScale = function (scale, units) {
    var resolution;
    if (scale) {
        if (units == null) {
            units = "degrees";
        }
        var normScale = OpenLayers.Util.normalizeScale(scale);
        resolution = 1 / (normScale * OpenLayers.INCHES_PER_UNIT[units]
                                        * OpenLayers.DOTS_PER_INCH);        
    }
    return resolution;
};

/**
 * Function: getScaleFromResolution
 * 
 * Parameters:
 * resolution - {Float}
 * units - {String} Index into OpenLayers.INCHES_PER_UNIT hashtable.
 *                  Default is degrees
 * 
 * Returns:
 * {Float} The corresponding scale given passed-in resolution and unit 
 *         parameters.
 */
OpenLayers.Util.getScaleFromResolution = function (resolution, units) {

    if (units == null) {
        units = "degrees";
    }

    var scale = resolution * OpenLayers.INCHES_PER_UNIT[units] *
                    OpenLayers.DOTS_PER_INCH;
    return scale;
};

/**
 * Function: pagePosition
 * Calculates the position of an element on the page (see
 * http://code.google.com/p/doctype/wiki/ArticlePageOffset)
 *
 * OpenLayers.Util.pagePosition is based on Yahoo's getXY method, which is
 * Copyright (c) 2006, Yahoo! Inc.
 * All rights reserved.
 * 
 * Redistribution and use of this software in source and binary forms, with or
 * without modification, are permitted provided that the following conditions
 * are met:
 * 
 * * Redistributions of source code must retain the above copyright notice,
 *   this list of conditions and the following disclaimer.
 * 
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 * 
 * * Neither the name of Yahoo! Inc. nor the names of its contributors may be
 *   used to endorse or promote products derived from this software without
 *   specific prior written permission of Yahoo! Inc.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE 
 * POSSIBILITY OF SUCH DAMAGE.
 *
 * Parameters:
 * forElement - {DOMElement}
 * 
 * Returns:
 * {Array} two item array, Left value then Top value.
 */
OpenLayers.Util.pagePosition =  function(forElement) {
    // NOTE: If element is hidden (display none or disconnected or any the
    // ancestors are hidden) we get (0,0) by default but we still do the
    // accumulation of scroll position.

    var pos = [0, 0];
    var viewportElement = OpenLayers.Util.getViewportElement();
    if (!forElement || forElement == window || forElement == viewportElement) {
        // viewport is always at 0,0 as that defined the coordinate system for
        // this function - this avoids special case checks in the code below
        return pos;
    }

    // Gecko browsers normally use getBoxObjectFor to calculate the position.
    // When invoked for an element with an implicit absolute position though it
    // can be off by one. Therefore the recursive implementation is used in
    // those (relatively rare) cases.
    var BUGGY_GECKO_BOX_OBJECT =
        OpenLayers.IS_GECKO && document.getBoxObjectFor &&
        OpenLayers.Element.getStyle(forElement, 'position') == 'absolute' &&
        (forElement.style.top == '' || forElement.style.left == '');

    var parent = null;
    var box;

    if (forElement.getBoundingClientRect) { // IE
        box = forElement.getBoundingClientRect();
        var scrollTop = window.pageYOffset || viewportElement.scrollTop;
        var scrollLeft = window.pageXOffset || viewportElement.scrollLeft;
        
        pos[0] = box.left + scrollLeft;
        pos[1] = box.top + scrollTop;

    } else if (document.getBoxObjectFor && !BUGGY_GECKO_BOX_OBJECT) { // gecko
        // Gecko ignores the scroll values for ancestors, up to 1.9.  See:
        // https://bugzilla.mozilla.org/show_bug.cgi?id=328881 and
        // https://bugzilla.mozilla.org/show_bug.cgi?id=330619

        box = document.getBoxObjectFor(forElement);
        var vpBox = document.getBoxObjectFor(viewportElement);
        pos[0] = box.screenX - vpBox.screenX;
        pos[1] = box.screenY - vpBox.screenY;

    } else { // safari/opera
        pos[0] = forElement.offsetLeft;
        pos[1] = forElement.offsetTop;
        parent = forElement.offsetParent;
        if (parent != forElement) {
            while (parent) {
                pos[0] += parent.offsetLeft;
                pos[1] += parent.offsetTop;
                parent = parent.offsetParent;
            }
        }

        var browser = OpenLayers.BROWSER_NAME;

        // opera & (safari absolute) incorrectly account for body offsetTop
        if (browser == "opera" || (browser == "safari" &&
              OpenLayers.Element.getStyle(forElement, 'position') == 'absolute')) {
            pos[1] -= document.body.offsetTop;
        }

        // accumulate the scroll positions for everything but the body element
        parent = forElement.offsetParent;
        while (parent && parent != document.body) {
            pos[0] -= parent.scrollLeft;
            // see https://bugs.opera.com/show_bug.cgi?id=249965
            if (browser != "opera" || parent.tagName != 'TR') {
                pos[1] -= parent.scrollTop;
            }
            parent = parent.offsetParent;
        }
    }
    
    return pos;
};

/**
 * Function: getViewportElement
 * Returns die viewport element of the document. The viewport element is
 * usually document.documentElement, except in IE,where it is either
 * document.body or document.documentElement, depending on the document's
 * compatibility mode (see
 * http://code.google.com/p/doctype/wiki/ArticleClientViewportElement)
 *
 * Returns:
 * {DOMElement}
 */
OpenLayers.Util.getViewportElement = function() {
    var viewportElement = arguments.callee.viewportElement;
    if (viewportElement == undefined) {
        viewportElement = (OpenLayers.BROWSER_NAME == "msie" &&
            document.compatMode != 'CSS1Compat') ? document.body :
            document.documentElement;
        arguments.callee.viewportElement = viewportElement;
    }
    return viewportElement;
};

/** 
 * Function: isEquivalentUrl
 * Test two URLs for equivalence. 
 * 
 * Setting 'ignoreCase' allows for case-independent comparison.
 * 
 * Comparison is based on: 
 *  - Protocol
 *  - Host (evaluated without the port)
 *  - Port (set 'ignorePort80' to ignore "80" values)
 *  - Hash ( set 'ignoreHash' to disable)
 *  - Pathname (for relative <-> absolute comparison) 
 *  - Arguments (so they can be out of order)
 *  
 * Parameters:
 * url1 - {String}
 * url2 - {String}
 * options - {Object} Allows for customization of comparison:
 *                    'ignoreCase' - Default is True
 *                    'ignorePort80' - Default is True
 *                    'ignoreHash' - Default is True
 *
 * Returns:
 * {Boolean} Whether or not the two URLs are equivalent
 */
OpenLayers.Util.isEquivalentUrl = function(url1, url2, options) {
    options = options || {};

    OpenLayers.Util.applyDefaults(options, {
        ignoreCase: true,
        ignorePort80: true,
        ignoreHash: true,
        splitArgs: false
    });

    var urlObj1 = OpenLayers.Util.createUrlObject(url1, options);
    var urlObj2 = OpenLayers.Util.createUrlObject(url2, options);

    //compare all keys except for "args" (treated below)
    for(var key in urlObj1) {
        if(key !== "args") {
            if(urlObj1[key] != urlObj2[key]) {
                return false;
            }
        }
    }

    // compare search args - irrespective of order
    for(var key in urlObj1.args) {
        if(urlObj1.args[key] != urlObj2.args[key]) {
            return false;
        }
        delete urlObj2.args[key];
    }
    // urlObj2 shouldn't have any args left
    for(var key in urlObj2.args) {
        return false;
    }
    
    return true;
};

/**
 * Function: createUrlObject
 * 
 * Parameters:
 * url - {String}
 * options - {Object} A hash of options.
 *
 * Valid options:
 *   ignoreCase - {Boolean} lowercase url,
 *   ignorePort80 - {Boolean} don't include explicit port if port is 80,
 *   ignoreHash - {Boolean} Don't include part of url after the hash (#).
 *   splitArgs - {Boolean} Split comma delimited params into arrays? Default is
 *       true.
 * 
 * Returns:
 * {Object} An object with separate url, a, port, host, and args parsed out 
 *          and ready for comparison
 */
OpenLayers.Util.createUrlObject = function(url, options) {
    options = options || {};

    // deal with relative urls first
    if(!(/^\w+:\/\//).test(url)) {
        var loc = window.location;
        var port = loc.port ? ":" + loc.port : "";
        var fullUrl = loc.protocol + "//" + loc.host.split(":").shift() + port;
        if(url.indexOf("/") === 0) {
            // full pathname
            url = fullUrl + url;
        } else {
            // relative to current path
            var parts = loc.pathname.split("/");
            parts.pop();
            url = fullUrl + parts.join("/") + "/" + url;
        }
    }
  
    if (options.ignoreCase) {
        url = url.toLowerCase(); 
    }

    var a = document.createElement('a');
    a.href = url;
    
    var urlObject = {};
    
    //host (without port)
    urlObject.host = a.host.split(":").shift();

    //protocol
    urlObject.protocol = a.protocol;  

    //port (get uniform browser behavior with port 80 here)
    if(options.ignorePort80) {
        urlObject.port = (a.port == "80" || a.port == "0") ? "" : a.port;
    } else {
        urlObject.port = (a.port == "" || a.port == "0") ? "80" : a.port;
    }

    //hash
    urlObject.hash = (options.ignoreHash || a.hash === "#") ? "" : a.hash;  
    
    //args
    var queryString = a.search;
    if (!queryString) {
        var qMark = url.indexOf("?");
        queryString = (qMark != -1) ? url.substr(qMark) : "";
    }
    urlObject.args = OpenLayers.Util.getParameters(queryString,
            {splitArgs: options.splitArgs});

    // pathname
    //
    // This is a workaround for Internet Explorer where
    // window.location.pathname has a leading "/", but
    // a.pathname has no leading "/".
    urlObject.pathname = (a.pathname.charAt(0) == "/") ? a.pathname : "/" + a.pathname;
    
    return urlObject; 
};
 
/**
 * Function: removeTail
 * Takes a url and removes everything after the ? and #
 * 
 * Parameters:
 * url - {String} The url to process
 * 
 * Returns:
 * {String} The string with all queryString and Hash removed
 */
OpenLayers.Util.removeTail = function(url) {
    var head = null;
    
    var qMark = url.indexOf("?");
    var hashMark = url.indexOf("#");

    if (qMark == -1) {
        head = (hashMark != -1) ? url.substr(0,hashMark) : url;
    } else {
        head = (hashMark != -1) ? url.substr(0,Math.min(qMark, hashMark)) 
                                  : url.substr(0, qMark);
    }
    return head;
};

/**
 * Constant: IS_GECKO
 * {Boolean} True if the userAgent reports the browser to use the Gecko engine
 */
OpenLayers.IS_GECKO = (function() {
    var ua = navigator.userAgent.toLowerCase();
    return ua.indexOf("webkit") == -1 && ua.indexOf("gecko") != -1;
})();

/**
 * Constant: CANVAS_SUPPORTED
 * {Boolean} True if canvas 2d is supported.
 */
OpenLayers.CANVAS_SUPPORTED = (function() {
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
})();

/**
 * Constant: BROWSER_NAME
 * {String}
 * A substring of the navigator.userAgent property.  Depending on the userAgent
 *     property, this will be the empty string or one of the following:
 *     * "opera" -- Opera
 *     * "msie"  -- Internet Explorer
 *     * "safari" -- Safari
 *     * "firefox" -- Firefox
 *     * "mozilla" -- Mozilla
 */
OpenLayers.BROWSER_NAME = (function() {
    var name = "";
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf("opera") != -1) {
        name = "opera";
    } else if (ua.indexOf("msie") != -1) {
        name = "msie";
    } else if (ua.indexOf("safari") != -1) {
        name = "safari";
    } else if (ua.indexOf("mozilla") != -1) {
        if (ua.indexOf("firefox") != -1) {
            name = "firefox";
        } else {
            name = "mozilla";
        }
    }
    return name;
})();

/**
 * Function: getBrowserName
 * 
 * Returns:
 * {String} A string which specifies which is the current 
 *          browser in which we are running. 
 * 
 *          Currently-supported browser detection and codes:
 *           * 'opera' -- Opera
 *           * 'msie'  -- Internet Explorer
 *           * 'safari' -- Safari
 *           * 'firefox' -- Firefox
 *           * 'mozilla' -- Mozilla
 * 
 *          If we are unable to property identify the browser, we 
 *           return an empty string.
 */
OpenLayers.Util.getBrowserName = function() {
    return OpenLayers.BROWSER_NAME;
};

/**
 * Method: getRenderedDimensions
 * Renders the contentHTML offscreen to determine actual dimensions for
 *     popup sizing. As we need layout to determine dimensions the content
 *     is rendered -9999px to the left and absolute to ensure the 
 *     scrollbars do not flicker
 *     
 * Parameters:
 * contentHTML
 * size - {<OpenLayers.Size>} If either the 'w' or 'h' properties is 
 *     specified, we fix that dimension of the div to be measured. This is 
 *     useful in the case where we have a limit in one dimension and must 
 *     therefore meaure the flow in the other dimension.
 * options - {Object}
 *
 * Allowed Options:
 *     displayClass - {String} Optional parameter.  A CSS class name(s) string
 *         to provide the CSS context of the rendered content.
 *     containerElement - {DOMElement} Optional parameter. Insert the HTML to 
 *         this node instead of the body root when calculating dimensions. 
 * 
 * Returns:
 * {<OpenLayers.Size>}
 */
OpenLayers.Util.getRenderedDimensions = function(contentHTML, size, options) {
    
    var w, h;
    
    // create temp container div with restricted size
    var container = document.createElement("div");
    container.style.visibility = "hidden";
        
    var containerElement = (options && options.containerElement) 
        ? options.containerElement : document.body;
    
    // Opera and IE7 can't handle a node with position:aboslute if it inherits
    // position:absolute from a parent.
    var parentHasPositionAbsolute = false;
    var superContainer = null;
    var parent = containerElement;
    while (parent && parent.tagName.toLowerCase()!="body") {
        var parentPosition = OpenLayers.Element.getStyle(parent, "position");
        if(parentPosition == "absolute") {
            parentHasPositionAbsolute = true;
            break;
        } else if (parentPosition && parentPosition != "static") {
            break;
        }
        parent = parent.parentNode;
    }
    if(parentHasPositionAbsolute && (containerElement.clientHeight === 0 || 
                                     containerElement.clientWidth === 0) ){
        superContainer = document.createElement("div");
        superContainer.style.visibility = "hidden";
        superContainer.style.position = "absolute";
        superContainer.style.overflow = "visible";
        superContainer.style.width = document.body.clientWidth + "px";
        superContainer.style.height = document.body.clientHeight + "px";
        superContainer.appendChild(container);
    }
    container.style.position = "absolute";

    //fix a dimension, if specified.
    if (size) {
        if (size.w) {
            w = size.w;
            container.style.width = w + "px";
        } else if (size.h) {
            h = size.h;
            container.style.height = h + "px";
        }
    }

    //add css classes, if specified
    if (options && options.displayClass) {
        container.className = options.displayClass;
    }
    
    // create temp content div and assign content
    var content = document.createElement("div");
    content.innerHTML = contentHTML;
    
    // we need overflow visible when calculating the size
    content.style.overflow = "visible";
    if (content.childNodes) {
        for (var i=0, l=content.childNodes.length; i<l; i++) {
            if (!content.childNodes[i].style) continue;
            content.childNodes[i].style.overflow = "visible";
        }
    }
    
    // add content to restricted container 
    container.appendChild(content);
    
    // append container to body for rendering
    if (superContainer) {
        containerElement.appendChild(superContainer);
    } else {
        containerElement.appendChild(container);
    }
    
    // calculate scroll width of content and add corners and shadow width
    if (!w) {
        w = parseInt(content.scrollWidth);
    
        // update container width to allow height to adjust
        container.style.width = w + "px";
    }        
    // capture height and add shadow and corner image widths
    if (!h) {
        h = parseInt(content.scrollHeight);
    }

    // remove elements
    container.removeChild(content);
    if (superContainer) {
        superContainer.removeChild(container);
        containerElement.removeChild(superContainer);
    } else {
        containerElement.removeChild(container);
    }
    
    return new OpenLayers.Size(w, h);
};

/**
 * APIFunction: getScrollbarWidth
 * This function has been modified by the OpenLayers from the original version,
 *     written by Matthew Eernisse and released under the Apache 2 
 *     license here:
 * 
 *     http://www.fleegix.org/articles/2006/05/30/getting-the-scrollbar-width-in-pixels
 * 
 *     It has been modified simply to cache its value, since it is physically 
 *     impossible that this code could ever run in more than one browser at 
 *     once. 
 * 
 * Returns:
 * {Integer}
 */
OpenLayers.Util.getScrollbarWidth = function() {
    
    var scrollbarWidth = OpenLayers.Util._scrollbarWidth;
    
    if (scrollbarWidth == null) {
        var scr = null;
        var inn = null;
        var wNoScroll = 0;
        var wScroll = 0;
    
        // Outer scrolling div
        scr = document.createElement('div');
        scr.style.position = 'absolute';
        scr.style.top = '-1000px';
        scr.style.left = '-1000px';
        scr.style.width = '100px';
        scr.style.height = '50px';
        // Start with no scrollbar
        scr.style.overflow = 'hidden';
    
        // Inner content div
        inn = document.createElement('div');
        inn.style.width = '100%';
        inn.style.height = '200px';
    
        // Put the inner div in the scrolling div
        scr.appendChild(inn);
        // Append the scrolling div to the doc
        document.body.appendChild(scr);
    
        // Width of the inner div sans scrollbar
        wNoScroll = inn.offsetWidth;
    
        // Add the scrollbar
        scr.style.overflow = 'scroll';
        // Width of the inner div width scrollbar
        wScroll = inn.offsetWidth;
    
        // Remove the scrolling div from the doc
        document.body.removeChild(document.body.lastChild);
    
        // Pixel width of the scroller
        OpenLayers.Util._scrollbarWidth = (wNoScroll - wScroll);
        scrollbarWidth = OpenLayers.Util._scrollbarWidth;
    }

    return scrollbarWidth;
};

/**
 * APIFunction: getFormattedLonLat
 * This function will return latitude or longitude value formatted as 
 *
 * Parameters:
 * coordinate - {Float} the coordinate value to be formatted
 * axis - {String} value of either 'lat' or 'lon' to indicate which axis is to
 *          to be formatted (default = lat)
 * dmsOption - {String} specify the precision of the output can be one of:
 *           'dms' show degrees minutes and seconds
 *           'dm' show only degrees and minutes
 *           'd' show only degrees
 * 
 * Returns:
 * {String} the coordinate value formatted as a string
 */
OpenLayers.Util.getFormattedLonLat = function(coordinate, axis, dmsOption) {
    if (!dmsOption) {
        dmsOption = 'dms';    //default to show degree, minutes, seconds
    }

    coordinate = (coordinate+540)%360 - 180; // normalize for sphere being round

    var abscoordinate = Math.abs(coordinate);
    var coordinatedegrees = Math.floor(abscoordinate);

    var coordinateminutes = (abscoordinate - coordinatedegrees)/(1/60);
    var tempcoordinateminutes = coordinateminutes;
    coordinateminutes = Math.floor(coordinateminutes);
    var coordinateseconds = (tempcoordinateminutes - coordinateminutes)/(1/60);
    coordinateseconds =  Math.round(coordinateseconds*10);
    coordinateseconds /= 10;

    if( coordinateseconds >= 60) { 
        coordinateseconds -= 60; 
        coordinateminutes += 1; 
        if( coordinateminutes >= 60) { 
            coordinateminutes -= 60; 
            coordinatedegrees += 1; 
        } 
    }
    
    if( coordinatedegrees < 10 ) {
        coordinatedegrees = "0" + coordinatedegrees;
    }
    var str = coordinatedegrees + "\u00B0";

    if (dmsOption.indexOf('dm') >= 0) {
        if( coordinateminutes < 10 ) {
            coordinateminutes = "0" + coordinateminutes;
        }
        str += coordinateminutes + "'";
  
        if (dmsOption.indexOf('dms') >= 0) {
            if( coordinateseconds < 10 ) {
                coordinateseconds = "0" + coordinateseconds;
            }
            str += coordinateseconds + '"';
        }
    }
    
    if (axis == "lon") {
        str += coordinate < 0 ? OpenLayers.i18n("W") : OpenLayers.i18n("E");
    } else {
        str += coordinate < 0 ? OpenLayers.i18n("S") : OpenLayers.i18n("N");
    }
    return str;
};

/**
 * Function: getConstructor
 * Take an OpenLayers style CLASS_NAME and return a constructor.
 *
 * Parameters:
 * className - {String} The dot delimited class name (e.g. 'OpenLayers.Foo').
 * 
 * Returns:
 * {Function} The constructor.
 */
OpenLayers.Util.getConstructor = function(className) {
    var Constructor;
    var parts = className.split('.');
    if (parts[0] === "OpenLayers") {
        Constructor = OpenLayers;
    } else {
        // someone extended our base class and used their own namespace
        // this will not work when the library is evaluated in a closure
        // but it is the best we can do (until we ourselves provide a global)
        Constructor = window[parts[0]];
    }
    for (var i = 1, ii = parts.length; i < ii; ++i) {
        Constructor = Constructor[parts[i]];
    }
    return Constructor;
};
/* ======================================================================
    OpenLayers/Feature.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


/**
 * @requires OpenLayers/BaseTypes/Class.js
 * @requires OpenLayers/Util.js
 */

/**
 * Class: OpenLayers.Feature
 * Features are combinations of geography and attributes. The OpenLayers.Feature
 *     class specifically combines a marker and a lonlat.
 */
OpenLayers.Feature = OpenLayers.Class({

    /** 
     * Property: layer 
     * {<OpenLayers.Layer>} 
     */
    layer: null,

    /** 
     * Property: id 
     * {String} 
     */
    id: null,
    
    /** 
     * Property: lonlat 
     * {<OpenLayers.LonLat>} 
     */
    lonlat: null,

    /** 
     * Property: data 
     * {Object} 
     */
    data: null,

    /** 
     * Property: marker 
     * {<OpenLayers.Marker>} 
     */
    marker: null,

    /**
     * APIProperty: popupClass
     * {<OpenLayers.Class>} The class which will be used to instantiate
     *     a new Popup. Default is <OpenLayers.Popup.Anchored>.
     */
    popupClass: null,

    /** 
     * Property: popup 
     * {<OpenLayers.Popup>} 
     */
    popup: null,

    /** 
     * Constructor: OpenLayers.Feature
     * Constructor for features.
     *
     * Parameters:
     * layer - {<OpenLayers.Layer>} 
     * lonlat - {<OpenLayers.LonLat>} 
     * data - {Object} 
     * 
     * Returns:
     * {<OpenLayers.Feature>}
     */
    initialize: function(layer, lonlat, data) {
        this.layer = layer;
        this.lonlat = lonlat;
        this.data = (data != null) ? data : {};
        this.id = OpenLayers.Util.createUniqueID(this.CLASS_NAME + "_"); 
    },

    /** 
     * Method: destroy
     * nullify references to prevent circular references and memory leaks
     */
    destroy: function() {

        //remove the popup from the map
        if ((this.layer != null) && (this.layer.map != null)) {
            if (this.popup != null) {
                this.layer.map.removePopup(this.popup);
            }
        }
        // remove the marker from the layer
        if (this.layer != null && this.marker != null) {
            this.layer.removeMarker(this.marker);
        }

        this.layer = null;
        this.id = null;
        this.lonlat = null;
        this.data = null;
        if (this.marker != null) {
            this.destroyMarker(this.marker);
            this.marker = null;
        }
        if (this.popup != null) {
            this.destroyPopup(this.popup);
            this.popup = null;
        }
    },
    
    /**
     * Method: onScreen
     * 
     * Returns:
     * {Boolean} Whether or not the feature is currently visible on screen
     *           (based on its 'lonlat' property)
     */
    onScreen:function() {
        
        var onScreen = false;
        if ((this.layer != null) && (this.layer.map != null)) {
            var screenBounds = this.layer.map.getExtent();
            onScreen = screenBounds.containsLonLat(this.lonlat);
        }    
        return onScreen;
    },
    

    /**
     * Method: createMarker
     * Based on the data associated with the Feature, create and return a marker object.
     *
     * Returns: 
     * {<OpenLayers.Marker>} A Marker Object created from the 'lonlat' and 'icon' properties
     *          set in this.data. If no 'lonlat' is set, returns null. If no
     *          'icon' is set, OpenLayers.Marker() will load the default image.
     *          
     *          Note - this.marker is set to return value
     * 
     */
    createMarker: function() {

        if (this.lonlat != null) {
            this.marker = new OpenLayers.Marker(this.lonlat, this.data.icon);
        }
        return this.marker;
    },

    /**
     * Method: destroyMarker
     * Destroys marker.
     * If user overrides the createMarker() function, s/he should be able
     *   to also specify an alternative function for destroying it
     */
    destroyMarker: function() {
        this.marker.destroy();  
    },

    /**
     * Method: createPopup
     * Creates a popup object created from the 'lonlat', 'popupSize',
     *     and 'popupContentHTML' properties set in this.data. It uses
     *     this.marker.icon as default anchor. 
     *  
     *  If no 'lonlat' is set, returns null. 
     *  If no this.marker has been created, no anchor is sent.
     *
     *  Note - the returned popup object is 'owned' by the feature, so you
     *      cannot use the popup's destroy method to discard the popup.
     *      Instead, you must use the feature's destroyPopup
     * 
     *  Note - this.popup is set to return value
     * 
     * Parameters: 
     * closeBox - {Boolean} create popup with closebox or not
     * 
     * Returns:
     * {<OpenLayers.Popup>} Returns the created popup, which is also set
     *     as 'popup' property of this feature. Will be of whatever type
     *     specified by this feature's 'popupClass' property, but must be
     *     of type <OpenLayers.Popup>.
     * 
     */
    createPopup: function(closeBox) {

        if (this.lonlat != null) {
            if (!this.popup) {
                var anchor = (this.marker) ? this.marker.icon : null;
                var popupClass = this.popupClass ? 
                    this.popupClass : OpenLayers.Popup.Anchored;
                this.popup = new popupClass(this.id + "_popup", 
                                            this.lonlat,
                                            this.data.popupSize,
                                            this.data.popupContentHTML,
                                            anchor, 
                                            closeBox); 
            }    
            if (this.data.overflow != null) {
                this.popup.contentDiv.style.overflow = this.data.overflow;
            }    
            
            this.popup.feature = this;
        }        
        return this.popup;
    },

    
    /**
     * Method: destroyPopup
     * Destroys the popup created via createPopup.
     *
     * As with the marker, if user overrides the createPopup() function, s/he 
     *   should also be able to override the destruction
     */
    destroyPopup: function() {
        if (this.popup) {
            this.popup.feature = null;
            this.popup.destroy();
            this.popup = null;
        }    
    },

    CLASS_NAME: "OpenLayers.Feature"
});
/* ======================================================================
    OpenLayers/Feature/Vector.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

// TRASH THIS
OpenLayers.State = {
    /** states */
    UNKNOWN: 'Unknown',
    INSERT: 'Insert',
    UPDATE: 'Update',
    DELETE: 'Delete'
};

/**
 * @requires OpenLayers/Feature.js
 * @requires OpenLayers/Util.js
 */

/**
 * Class: OpenLayers.Feature.Vector
 * Vector features use the OpenLayers.Geometry classes as geometry description.
 * They have an 'attributes' property, which is the data object, and a 'style'
 * property, the default values of which are defined in the 
 * <OpenLayers.Feature.Vector.style> objects.
 * 
 * Inherits from:
 *  - <OpenLayers.Feature>
 */
OpenLayers.Feature.Vector = OpenLayers.Class(OpenLayers.Feature, {

    /** 
     * Property: fid 
     * {String} 
     */
    fid: null,
    
    /** 
     * APIProperty: geometry 
     * {<OpenLayers.Geometry>} 
     */
    geometry: null,

    /** 
     * APIProperty: attributes 
     * {Object} This object holds arbitrary, serializable properties that
     *     describe the feature.
     */
    attributes: null,

    /**
     * Property: bounds
     * {<OpenLayers.Bounds>} The box bounding that feature's geometry, that
     *     property can be set by an <OpenLayers.Format> object when
     *     deserializing the feature, so in most cases it represents an
     *     information set by the server. 
     */
    bounds: null,

    /** 
     * Property: state 
     * {String} 
     */
    state: null,
    
    /** 
     * APIProperty: style 
     * {Object} 
     */
    style: null,

    /**
     * APIProperty: url
     * {String} If this property is set it will be taken into account by
     *     {<OpenLayers.HTTP>} when updating or deleting the feature.
     */
    url: null,
    
    /**
     * Property: renderIntent
     * {String} rendering intent currently being used
     */
    renderIntent: "default",
    
    /**
     * APIProperty: modified
     * {Object} An object with the originals of the geometry and attributes of
     * the feature, if they were changed. Currently this property is only read
     * by <OpenLayers.Format.WFST.v1>, and written by
     * <OpenLayers.Control.ModifyFeature>, which sets the geometry property.
     * Applications can set the originals of modified attributes in the
     * attributes property. Note that applications have to check if this
     * object and the attributes property is already created before using it.
     * After a change made with ModifyFeature, this object could look like
     *
     * (code)
     * {
     *     geometry: >Object
     * }
     * (end)
     *
     * When an application has made changes to feature attributes, it could
     * have set the attributes to something like this:
     *
     * (code)
     * {
     *     attributes: {
     *         myAttribute: "original"
     *     }
     * }
     * (end)
     *
     * Note that <OpenLayers.Format.WFST.v1> only checks for truthy values in
     * *modified.geometry* and the attribute names in *modified.attributes*,
     * but it is recommended to set the original values (and not just true) as
     * attribute value, so applications could use this information to undo
     * changes.
     */
    modified: null,

    /** 
     * Constructor: OpenLayers.Feature.Vector
     * Create a vector feature. 
     * 
     * Parameters:
     * geometry - {<OpenLayers.Geometry>} The geometry that this feature
     *     represents.
     * attributes - {Object} An optional object that will be mapped to the
     *     <attributes> property. 
     * style - {Object} An optional style object.
     */
    initialize: function(geometry, attributes, style) {
        OpenLayers.Feature.prototype.initialize.apply(this,
                                                      [null, null, attributes]);
        this.lonlat = null;
        this.geometry = geometry ? geometry : null;
        this.state = null;
        this.attributes = {};
        if (attributes) {
            this.attributes = OpenLayers.Util.extend(this.attributes,
                                                     attributes);
        }
        this.style = style ? style : null; 
    },
    
    /** 
     * Method: destroy
     * nullify references to prevent circular references and memory leaks
     */
    destroy: function() {
        if (this.layer) {
            this.layer.removeFeatures(this);
            this.layer = null;
        }
            
        this.geometry = null;
        this.modified = null;
        OpenLayers.Feature.prototype.destroy.apply(this, arguments);
    },
    
    /**
     * Method: clone
     * Create a clone of this vector feature.  Does not set any non-standard
     *     properties.
     *
     * Returns:
     * {<OpenLayers.Feature.Vector>} An exact clone of this vector feature.
     */
    clone: function () {
        return new OpenLayers.Feature.Vector(
            this.geometry ? this.geometry.clone() : null,
            this.attributes,
            this.style);
    },

    /**
     * Method: onScreen
     * Determine whether the feature is within the map viewport.  This method
     *     tests for an intersection between the geometry and the viewport
     *     bounds.  If a more efficient but less precise geometry bounds
     *     intersection is desired, call the method with the boundsOnly
     *     parameter true.
     *
     * Parameters:
     * boundsOnly - {Boolean} Only test whether a feature's bounds intersects
     *     the viewport bounds.  Default is false.  If false, the feature's
     *     geometry must intersect the viewport for onScreen to return true.
     * 
     * Returns:
     * {Boolean} The feature is currently visible on screen (optionally
     *     based on its bounds if boundsOnly is true).
     */
    onScreen:function(boundsOnly) {
        var onScreen = false;
        if(this.layer && this.layer.map) {
            var screenBounds = this.layer.map.getExtent();
            if(boundsOnly) {
                var featureBounds = this.geometry.getBounds();
                onScreen = screenBounds.intersectsBounds(featureBounds);
            } else {
                var screenPoly = screenBounds.toGeometry();
                onScreen = screenPoly.intersects(this.geometry);
            }
        }    
        return onScreen;
    },

    /**
     * Method: getVisibility
     * Determine whether the feature is displayed or not. It may not displayed
     *     because:
     *     - its style display property is set to 'none',
     *     - it doesn't belong to any layer,
     *     - the styleMap creates a symbolizer with display property set to 'none'
     *          for it,
     *     - the layer which it belongs to is not visible.
     * 
     * Returns:
     * {Boolean} The feature is currently displayed.
     */
    getVisibility: function() {
        return !(this.style && this.style.display == 'none' ||
                 !this.layer ||
                 this.layer && this.layer.styleMap &&
                 this.layer.styleMap.createSymbolizer(this, this.renderIntent).display == 'none' ||
                 this.layer && !this.layer.getVisibility());
    },
    
    /**
     * Method: createMarker
     * HACK - we need to decide if all vector features should be able to
     *     create markers
     * 
     * Returns:
     * {<OpenLayers.Marker>} For now just returns null
     */
    createMarker: function() {
        return null;
    },

    /**
     * Method: destroyMarker
     * HACK - we need to decide if all vector features should be able to
     *     delete markers
     * 
     * If user overrides the createMarker() function, s/he should be able
     *   to also specify an alternative function for destroying it
     */
    destroyMarker: function() {
        // pass
    },

    /**
     * Method: createPopup
     * HACK - we need to decide if all vector features should be able to
     *     create popups
     * 
     * Returns:
     * {<OpenLayers.Popup>} For now just returns null
     */
    createPopup: function() {
        return null;
    },

    /**
     * Method: atPoint
     * Determins whether the feature intersects with the specified location.
     * 
     * Parameters: 
     * lonlat - {<OpenLayers.LonLat>|Object} OpenLayers.LonLat or an
     *     object with a 'lon' and 'lat' properties.
     * toleranceLon - {float} Optional tolerance in Geometric Coords
     * toleranceLat - {float} Optional tolerance in Geographic Coords
     * 
     * Returns:
     * {Boolean} Whether or not the feature is at the specified location
     */
    atPoint: function(lonlat, toleranceLon, toleranceLat) {
        var atPoint = false;
        if(this.geometry) {
            atPoint = this.geometry.atPoint(lonlat, toleranceLon, 
                                                    toleranceLat);
        }
        return atPoint;
    },

    /**
     * Method: destroyPopup
     * HACK - we need to decide if all vector features should be able to
     * delete popups
     */
    destroyPopup: function() {
        // pass
    },

    /**
     * Method: move
     * Moves the feature and redraws it at its new location
     *
     * Parameters:
     * location - {<OpenLayers.LonLat> or <OpenLayers.Pixel>} the
     *         location to which to move the feature.
     */
    move: function(location) {

        if(!this.layer || !this.geometry.move){
            //do nothing if no layer or immoveable geometry
            return undefined;
        }

        var pixel;
        if (location.CLASS_NAME == "OpenLayers.LonLat") {
            pixel = this.layer.getViewPortPxFromLonLat(location);
        } else {
            pixel = location;
        }
        
        var lastPixel = this.layer.getViewPortPxFromLonLat(this.geometry.getBounds().getCenterLonLat());
        var res = this.layer.map.getResolution();
        this.geometry.move(res * (pixel.x - lastPixel.x),
                           res * (lastPixel.y - pixel.y));
        this.layer.drawFeature(this);
        return lastPixel;
    },
    
    /**
     * Method: toState
     * Sets the new state
     *
     * Parameters:
     * state - {String} 
     */
    toState: function(state) {
        if (state == OpenLayers.State.UPDATE) {
            switch (this.state) {
                case OpenLayers.State.UNKNOWN:
                case OpenLayers.State.DELETE:
                    this.state = state;
                    break;
                case OpenLayers.State.UPDATE:
                case OpenLayers.State.INSERT:
                    break;
            }
        } else if (state == OpenLayers.State.INSERT) {
            switch (this.state) {
                case OpenLayers.State.UNKNOWN:
                    break;
                default:
                    this.state = state;
                    break;
            }
        } else if (state == OpenLayers.State.DELETE) {
            switch (this.state) {
                case OpenLayers.State.INSERT:
                    // the feature should be destroyed
                    break;
                case OpenLayers.State.DELETE:
                    break;
                case OpenLayers.State.UNKNOWN:
                case OpenLayers.State.UPDATE:
                    this.state = state;
                    break;
            }
        } else if (state == OpenLayers.State.UNKNOWN) {
            this.state = state;
        }
    },
    
    CLASS_NAME: "OpenLayers.Feature.Vector"
});


/**
 * Constant: OpenLayers.Feature.Vector.style
 * OpenLayers features can have a number of style attributes. The 'default' 
 *     style will typically be used if no other style is specified. These
 *     styles correspond for the most part, to the styling properties defined
 *     by the SVG standard. 
 *     Information on fill properties: http://www.w3.org/TR/SVG/painting.html#FillProperties
 *     Information on stroke properties: http://www.w3.org/TR/SVG/painting.html#StrokeProperties
 *
 * Symbolizer properties:
 * fill - {Boolean} Set to false if no fill is desired.
 * fillColor - {String} Hex fill color.  Default is "#ee9900".
 * fillOpacity - {Number} Fill opacity (0-1).  Default is 0.4 
 * stroke - {Boolean} Set to false if no stroke is desired.
 * strokeColor - {String} Hex stroke color.  Default is "#ee9900".
 * strokeOpacity - {Number} Stroke opacity (0-1).  Default is 1.
 * strokeWidth - {Number} Pixel stroke width.  Default is 1.
 * strokeLinecap - {String} Stroke cap type.  Default is "round".  [butt | round | square]
 * strokeDashstyle - {String} Stroke dash style.  Default is "solid". [dot | dash | dashdot | longdash | longdashdot | solid]
 * graphic - {Boolean} Set to false if no graphic is desired.
 * pointRadius - {Number} Pixel point radius.  Default is 6.
 * pointerEvents - {String}  Default is "visiblePainted".
 * cursor - {String} Default is "".
 * externalGraphic - {String} Url to an external graphic that will be used for rendering points.
 * graphicWidth - {Number} Pixel width for sizing an external graphic.
 * graphicHeight - {Number} Pixel height for sizing an external graphic.
 * graphicOpacity - {Number} Opacity (0-1) for an external graphic.
 * graphicXOffset - {Number} Pixel offset along the positive x axis for displacing an external graphic.
 * graphicYOffset - {Number} Pixel offset along the positive y axis for displacing an external graphic.
 * rotation - {Number} For point symbolizers, this is the rotation of a graphic in the clockwise direction about its center point (or any point off center as specified by graphicXOffset and graphicYOffset).
 * graphicZIndex - {Number} The integer z-index value to use in rendering.
 * graphicName - {String} Named graphic to use when rendering points.  Supported values include "circle" (default),
 *     "square", "star", "x", "cross", "triangle".
 * graphicTitle - {String} Tooltip when hovering over a feature. *deprecated*, use title instead
 * title - {String} Tooltip when hovering over a feature. Not supported by the canvas renderer.
 * backgroundGraphic - {String} Url to a graphic to be used as the background under an externalGraphic.
 * backgroundGraphicZIndex - {Number} The integer z-index value to use in rendering the background graphic.
 * backgroundXOffset - {Number} The x offset (in pixels) for the background graphic.
 * backgroundYOffset - {Number} The y offset (in pixels) for the background graphic.
 * backgroundHeight - {Number} The height of the background graphic.  If not provided, the graphicHeight will be used.
 * backgroundWidth - {Number} The width of the background width.  If not provided, the graphicWidth will be used.
 * label - {String} The text for an optional label. For browsers that use the canvas renderer, this requires either
 *     fillText or mozDrawText to be available.
 * labelAlign - {String} Label alignment. This specifies the insertion point relative to the text. It is a string
 *     composed of two characters. The first character is for the horizontal alignment, the second for the vertical
 *     alignment. Valid values for horizontal alignment: "l"=left, "c"=center, "r"=right. Valid values for vertical
 *     alignment: "t"=top, "m"=middle, "b"=bottom. Example values: "lt", "cm", "rb". Default is "cm".
 * labelXOffset - {Number} Pixel offset along the positive x axis for displacing the label. Not supported by the canvas renderer.
 * labelYOffset - {Number} Pixel offset along the positive y axis for displacing the label. Not supported by the canvas renderer.
 * labelSelect - {Boolean} If set to true, labels will be selectable using SelectFeature or similar controls.
 *     Default is false.
 * labelOutlineColor - {String} The color of the label outline. Default is 'white'. Only supported by the canvas & SVG renderers.
 * labelOutlineWidth - {Number} The width of the label outline. Default is 3, set to 0 or null to disable. Only supported by the  SVG renderers.
 * labelOutlineOpacity - {Number} The opacity (0-1) of the label outline. Default is fontOpacity. Only supported by the canvas & SVG renderers.
 * fontColor - {String} The font color for the label, to be provided like CSS.
 * fontOpacity - {Number} Opacity (0-1) for the label
 * fontFamily - {String} The font family for the label, to be provided like in CSS.
 * fontSize - {String} The font size for the label, to be provided like in CSS.
 * fontStyle - {String} The font style for the label, to be provided like in CSS.
 * fontWeight - {String} The font weight for the label, to be provided like in CSS.
 * display - {String} Symbolizers will have no effect if display is set to "none".  All other values have no effect.
 */ 
OpenLayers.Feature.Vector.style = {
    'default': {
        fillColor: "#ee9900",
        fillOpacity: 0.4, 
        hoverFillColor: "white",
        hoverFillOpacity: 0.8,
        strokeColor: "#ee9900",
        strokeOpacity: 1,
        strokeWidth: 1,
        strokeLinecap: "round",
        strokeDashstyle: "solid",
        hoverStrokeColor: "red",
        hoverStrokeOpacity: 1,
        hoverStrokeWidth: 0.2,
        pointRadius: 6,
        hoverPointRadius: 1,
        hoverPointUnit: "%",
        pointerEvents: "visiblePainted",
        cursor: "inherit",
        fontColor: "#000000",
        labelAlign: "cm",
        labelOutlineColor: "white",
        labelOutlineWidth: 3
    },
    'select': {
        fillColor: "blue",
        fillOpacity: 0.4, 
        hoverFillColor: "white",
        hoverFillOpacity: 0.8,
        strokeColor: "blue",
        strokeOpacity: 1,
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeDashstyle: "solid",
        hoverStrokeColor: "red",
        hoverStrokeOpacity: 1,
        hoverStrokeWidth: 0.2,
        pointRadius: 6,
        hoverPointRadius: 1,
        hoverPointUnit: "%",
        pointerEvents: "visiblePainted",
        cursor: "pointer",
        fontColor: "#000000",
        labelAlign: "cm",
        labelOutlineColor: "white",
        labelOutlineWidth: 3

    },
    'temporary': {
        fillColor: "#66cccc",
        fillOpacity: 0.2, 
        hoverFillColor: "white",
        hoverFillOpacity: 0.8,
        strokeColor: "#66cccc",
        strokeOpacity: 1,
        strokeLinecap: "round",
        strokeWidth: 2,
        strokeDashstyle: "solid",
        hoverStrokeColor: "red",
        hoverStrokeOpacity: 1,
        hoverStrokeWidth: 0.2,
        pointRadius: 6,
        hoverPointRadius: 1,
        hoverPointUnit: "%",
        pointerEvents: "visiblePainted",
        cursor: "inherit",
        fontColor: "#000000",
        labelAlign: "cm",
        labelOutlineColor: "white",
        labelOutlineWidth: 3

    },
    'delete': {
        display: "none"
    }
};    
/* ======================================================================
    OpenLayers/Style.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


/**
 * @requires OpenLayers/BaseTypes/Class.js
 * @requires OpenLayers/Util.js
 * @requires OpenLayers/Feature/Vector.js
 */

/**
 * Class: OpenLayers.Style
 * This class represents a UserStyle obtained
 *     from a SLD, containing styling rules.
 */
OpenLayers.Style = OpenLayers.Class({

    /**
     * Property: id
     * {String} A unique id for this session.
     */
    id: null,
    
    /**
     * APIProperty: name
     * {String}
     */
    name: null,
    
    /**
     * Property: title
     * {String} Title of this style (set if included in SLD)
     */
    title: null,
    
    /**
     * Property: description
     * {String} Description of this style (set if abstract is included in SLD)
     */
    description: null,

    /**
     * APIProperty: layerName
     * {<String>} name of the layer that this style belongs to, usually
     * according to the NamedLayer attribute of an SLD document.
     */
    layerName: null,
    
    /**
     * APIProperty: isDefault
     * {Boolean}
     */
    isDefault: false,
     
    /** 
     * Property: rules 
     * {Array(<OpenLayers.Rule>)}
     */
    rules: null,
    
    /**
     * APIProperty: context
     * {Object} An optional object with properties that symbolizers' property
     * values should be evaluated against. If no context is specified,
     * feature.attributes will be used
     */
    context: null,

    /**
     * Property: defaultStyle
     * {Object} hash of style properties to use as default for merging
     * rule-based style symbolizers onto. If no rules are defined,
     * createSymbolizer will return this style. If <defaultsPerSymbolizer> is set to
     * true, the defaultStyle will only be taken into account if there are
     * rules defined.
     */
    defaultStyle: null,
    
    /**
     * Property: defaultsPerSymbolizer
     * {Boolean} If set to true, the <defaultStyle> will extend the symbolizer
     * of every rule. Properties of the <defaultStyle> will also be used to set
     * missing symbolizer properties if the symbolizer has stroke, fill or
     * graphic set to true. Default is false.
     */
    defaultsPerSymbolizer: false,
    
    /**
     * Property: propertyStyles
     * {Hash of Boolean} cache of style properties that need to be parsed for
     * propertyNames. Property names are keys, values won't be used.
     */
    propertyStyles: null,
    

    /** 
     * Constructor: OpenLayers.Style
     * Creates a UserStyle.
     *
     * Parameters:
     * style        - {Object} Optional hash of style properties that will be
     *                used as default style for this style object. This style
     *                applies if no rules are specified. Symbolizers defined in
     *                rules will extend this default style.
     * options - {Object} An optional object with properties to set on the
     *     style.
     *
     * Valid options:
     * rules - {Array(<OpenLayers.Rule>)} List of rules to be added to the
     *     style.
     * 
     * Returns:
     * {<OpenLayers.Style>}
     */
    initialize: function(style, options) {

        OpenLayers.Util.extend(this, options);
        this.rules = [];
        if(options && options.rules) {
            this.addRules(options.rules);
        }

        // use the default style from OpenLayers.Feature.Vector if no style
        // was given in the constructor
        this.setDefaultStyle(style ||
                             OpenLayers.Feature.Vector.style["default"]);

        this.id = OpenLayers.Util.createUniqueID(this.CLASS_NAME + "_");
    },

    /** 
     * APIMethod: destroy
     * nullify references to prevent circular references and memory leaks
     */
    destroy: function() {
        for (var i=0, len=this.rules.length; i<len; i++) {
            this.rules[i].destroy();
            this.rules[i] = null;
        }
        this.rules = null;
        this.defaultStyle = null;
    },
    
    /**
     * Method: createSymbolizer
     * creates a style by applying all feature-dependent rules to the base
     * style.
     * 
     * Parameters:
     * feature - {<OpenLayers.Feature>} feature to evaluate rules for
     * 
     * Returns:
     * {Object} symbolizer hash
     */
    createSymbolizer: function(feature) {
        var style = this.defaultsPerSymbolizer ? {} : this.createLiterals(
            OpenLayers.Util.extend({}, this.defaultStyle), feature);
        
        var rules = this.rules;

        var rule, context;
        var elseRules = [];
        var appliedRules = false;
        for(var i=0, len=rules.length; i<len; i++) {
            rule = rules[i];
            // does the rule apply?
            var applies = rule.evaluate(feature);
            
            if(applies) {
                if(rule instanceof OpenLayers.Rule && rule.elseFilter) {
                    elseRules.push(rule);
                } else {
                    appliedRules = true;
                    this.applySymbolizer(rule, style, feature);
                }
            }
        }
        
        // if no other rules apply, apply the rules with else filters
        if(appliedRules == false && elseRules.length > 0) {
            appliedRules = true;
            for(var i=0, len=elseRules.length; i<len; i++) {
                this.applySymbolizer(elseRules[i], style, feature);
            }
        }

        // don't display if there were rules but none applied
        if(rules.length > 0 && appliedRules == false) {
            style.display = "none";
        }
        
        if (style.label != null && typeof style.label !== "string") {
            style.label = String(style.label);
        }
        
        return style;
    },
    
    /**
     * Method: applySymbolizer
     *
     * Parameters:
     * rule - {<OpenLayers.Rule>}
     * style - {Object}
     * feature - {<OpenLayer.Feature.Vector>}
     *
     * Returns:
     * {Object} A style with new symbolizer applied.
     */
    applySymbolizer: function(rule, style, feature) {
        var symbolizerPrefix = feature.geometry ?
                this.getSymbolizerPrefix(feature.geometry) :
                OpenLayers.Style.SYMBOLIZER_PREFIXES[0];

        var symbolizer = rule.symbolizer[symbolizerPrefix] || rule.symbolizer;
        
        if(this.defaultsPerSymbolizer === true) {
            var defaults = this.defaultStyle;
            OpenLayers.Util.applyDefaults(symbolizer, {
                pointRadius: defaults.pointRadius
            });
            if(symbolizer.stroke === true || symbolizer.graphic === true) {
                OpenLayers.Util.applyDefaults(symbolizer, {
                    strokeWidth: defaults.strokeWidth,
                    strokeColor: defaults.strokeColor,
                    strokeOpacity: defaults.strokeOpacity,
                    strokeDashstyle: defaults.strokeDashstyle,
                    strokeLinecap: defaults.strokeLinecap
                });
            }
            if(symbolizer.fill === true || symbolizer.graphic === true) {
                OpenLayers.Util.applyDefaults(symbolizer, {
                    fillColor: defaults.fillColor,
                    fillOpacity: defaults.fillOpacity
                });
            }
            if(symbolizer.graphic === true) {
                OpenLayers.Util.applyDefaults(symbolizer, {
                    pointRadius: this.defaultStyle.pointRadius,
                    externalGraphic: this.defaultStyle.externalGraphic,
                    graphicName: this.defaultStyle.graphicName,
                    graphicOpacity: this.defaultStyle.graphicOpacity,
                    graphicWidth: this.defaultStyle.graphicWidth,
                    graphicHeight: this.defaultStyle.graphicHeight,
                    graphicXOffset: this.defaultStyle.graphicXOffset,
                    graphicYOffset: this.defaultStyle.graphicYOffset
                });
            }
        }

        // merge the style with the current style
        return this.createLiterals(
                OpenLayers.Util.extend(style, symbolizer), feature);
    },
    
    /**
     * Method: createLiterals
     * creates literals for all style properties that have an entry in
     * <this.propertyStyles>.
     * 
     * Parameters:
     * style   - {Object} style to create literals for. Will be modified
     *           inline.
     * feature - {Object}
     * 
     * Returns:
     * {Object} the modified style
     */
    createLiterals: function(style, feature) {
        var context = OpenLayers.Util.extend({}, feature.attributes || feature.data);
        OpenLayers.Util.extend(context, this.context);
        
        for (var i in this.propertyStyles) {
            style[i] = OpenLayers.Style.createLiteral(style[i], context, feature, i);
        }
        return style;
    },
    
    /**
     * Method: findPropertyStyles
     * Looks into all rules for this style and the defaultStyle to collect
     * all the style hash property names containing ${...} strings that have
     * to be replaced using the createLiteral method before returning them.
     * 
     * Returns:
     * {Object} hash of property names that need createLiteral parsing. The
     * name of the property is the key, and the value is true;
     */
    findPropertyStyles: function() {
        var propertyStyles = {};

        // check the default style
        var style = this.defaultStyle;
        this.addPropertyStyles(propertyStyles, style);

        // walk through all rules to check for properties in their symbolizer
        var rules = this.rules;
        var symbolizer, value;
        for (var i=0, len=rules.length; i<len; i++) {
            symbolizer = rules[i].symbolizer;
            for (var key in symbolizer) {
                value = symbolizer[key];
                if (typeof value == "object") {
                    // symbolizer key is "Point", "Line" or "Polygon"
                    this.addPropertyStyles(propertyStyles, value);
                } else {
                    // symbolizer is a hash of style properties
                    this.addPropertyStyles(propertyStyles, symbolizer);
                    break;
                }
            }
        }
        return propertyStyles;
    },
    
    /**
     * Method: addPropertyStyles
     * 
     * Parameters:
     * propertyStyles - {Object} hash to add new property styles to. Will be
     *                  modified inline
     * symbolizer     - {Object} search this symbolizer for property styles
     * 
     * Returns:
     * {Object} propertyStyles hash
     */
    addPropertyStyles: function(propertyStyles, symbolizer) {
        var property;
        for (var key in symbolizer) {
            property = symbolizer[key];
            if (typeof property == "string" &&
                    property.match(/\$\{\w+\}/)) {
                propertyStyles[key] = true;
            }
        }
        return propertyStyles;
    },
    
    /**
     * APIMethod: addRules
     * Adds rules to this style.
     * 
     * Parameters:
     * rules - {Array(<OpenLayers.Rule>)}
     */
    addRules: function(rules) {
        Array.prototype.push.apply(this.rules, rules);
        this.propertyStyles = this.findPropertyStyles();
    },
    
    /**
     * APIMethod: setDefaultStyle
     * Sets the default style for this style object.
     * 
     * Parameters:
     * style - {Object} Hash of style properties
     */
    setDefaultStyle: function(style) {
        this.defaultStyle = style; 
        this.propertyStyles = this.findPropertyStyles();
    },
        
    /**
     * Method: getSymbolizerPrefix
     * Returns the correct symbolizer prefix according to the
     * geometry type of the passed geometry
     * 
     * Parameters:
     * geometry - {<OpenLayers.Geometry>}
     * 
     * Returns:
     * {String} key of the according symbolizer
     */
    getSymbolizerPrefix: function(geometry) {
        var prefixes = OpenLayers.Style.SYMBOLIZER_PREFIXES;
        for (var i=0, len=prefixes.length; i<len; i++) {
            if (geometry.CLASS_NAME.indexOf(prefixes[i]) != -1) {
                return prefixes[i];
            }
        }
    },
    
    /**
     * APIMethod: clone
     * Clones this style.
     * 
     * Returns:
     * {<OpenLayers.Style>} Clone of this style.
     */
    clone: function() {
        var options = OpenLayers.Util.extend({}, this);
        // clone rules
        if(this.rules) {
            options.rules = [];
            for(var i=0, len=this.rules.length; i<len; ++i) {
                options.rules.push(this.rules[i].clone());
            }
        }
        // clone context
        options.context = this.context && OpenLayers.Util.extend({}, this.context);
        //clone default style
        var defaultStyle = OpenLayers.Util.extend({}, this.defaultStyle);
        return new OpenLayers.Style(defaultStyle, options);
    },
    
    CLASS_NAME: "OpenLayers.Style"
});


/**
 * Function: createLiteral
 * converts a style value holding a combination of PropertyName and Literal
 * into a Literal, taking the property values from the passed features.
 * 
 * Parameters:
 * value - {String} value to parse. If this string contains a construct like
 *         "foo ${bar}", then "foo " will be taken as literal, and "${bar}"
 *         will be replaced by the value of the "bar" attribute of the passed
 *         feature.
 * context - {Object} context to take attribute values from
 * feature - {<OpenLayers.Feature.Vector>} optional feature to pass to
 *           <OpenLayers.String.format> for evaluating functions in the
 *           context.
 * property - {String} optional, name of the property for which the literal is
 *            being created for evaluating functions in the context.
 * 
 * Returns:
 * {String} the parsed value. In the example of the value parameter above, the
 * result would be "foo valueOfBar", assuming that the passed feature has an
 * attribute named "bar" with the value "valueOfBar".
 */
OpenLayers.Style.createLiteral = function(value, context, feature, property) {
    if (typeof value == "string" && value.indexOf("${") != -1) {
        value = OpenLayers.String.format(value, context, [feature, property]);
        value = (isNaN(value) || !value) ? value : parseFloat(value);
    }
    return value;
};
    
/**
 * Constant: OpenLayers.Style.SYMBOLIZER_PREFIXES
 * {Array} prefixes of the sld symbolizers. These are the
 * same as the main geometry types
 */
OpenLayers.Style.SYMBOLIZER_PREFIXES = ['Point', 'Line', 'Polygon', 'Text',
    'Raster'];
/* ======================================================================
    OpenLayers/Format.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/BaseTypes/Class.js
 * @requires OpenLayers/Util.js
 */

/**
 * Class: OpenLayers.Format
 * Base class for format reading/writing a variety of formats.  Subclasses
 *     of OpenLayers.Format are expected to have read and write methods.
 */
OpenLayers.Format = OpenLayers.Class({
    
    /**
     * Property: options
     * {Object} A reference to options passed to the constructor.
     */
    options: null,
    
    /**
     * APIProperty: externalProjection
     * {<OpenLayers.Projection>} When passed a externalProjection and
     *     internalProjection, the format will reproject the geometries it
     *     reads or writes. The externalProjection is the projection used by
     *     the content which is passed into read or which comes out of write.
     *     In order to reproject, a projection transformation function for the
     *     specified projections must be available. This support may be 
     *     provided via proj4js or via a custom transformation function. See
     *     {<OpenLayers.Projection.addTransform>} for more information on
     *     custom transformations.
     */
    externalProjection: null,

    /**
     * APIProperty: internalProjection
     * {<OpenLayers.Projection>} When passed a externalProjection and
     *     internalProjection, the format will reproject the geometries it
     *     reads or writes. The internalProjection is the projection used by
     *     the geometries which are returned by read or which are passed into
     *     write.  In order to reproject, a projection transformation function
     *     for the specified projections must be available. This support may be
     *     provided via proj4js or via a custom transformation function. See
     *     {<OpenLayers.Projection.addTransform>} for more information on
     *     custom transformations.
     */
    internalProjection: null,

    /**
     * APIProperty: data
     * {Object} When <keepData> is true, this is the parsed string sent to
     *     <read>.
     */
    data: null,

    /**
     * APIProperty: keepData
     * {Object} Maintain a reference (<data>) to the most recently read data.
     *     Default is false.
     */
    keepData: false,

    /**
     * Constructor: OpenLayers.Format
     * Instances of this class are not useful.  See one of the subclasses.
     *
     * Parameters:
     * options - {Object} An optional object with properties to set on the
     *           format
     *
     * Valid options:
     * keepData - {Boolean} If true, upon <read>, the data property will be
     *     set to the parsed object (e.g. the json or xml object).
     *
     * Returns:
     * An instance of OpenLayers.Format
     */
    initialize: function(options) {
        OpenLayers.Util.extend(this, options);
        this.options = options;
    },
    
    /**
     * APIMethod: destroy
     * Clean up.
     */
    destroy: function() {
    },

    /**
     * Method: read
     * Read data from a string, and return an object whose type depends on the
     * subclass. 
     * 
     * Parameters:
     * data - {string} Data to read/parse.
     *
     * Returns:
     * Depends on the subclass
     */
    read: function(data) {
        throw new Error('Read not implemented.');
    },
    
    /**
     * Method: write
     * Accept an object, and return a string. 
     *
     * Parameters:
     * object - {Object} Object to be serialized
     *
     * Returns:
     * {String} A string representation of the object.
     */
    write: function(object) {
        throw new Error('Write not implemented.');
    },

    CLASS_NAME: "OpenLayers.Format"
});     
/* ======================================================================
    OpenLayers/Format/XML.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Format.js
 */

/**
 * Class: OpenLayers.Format.XML
 * Read and write XML.  For cross-browser XML generation, use methods on an
 *     instance of the XML format class instead of on <code>document<end>.
 *     The DOM creation and traversing methods exposed here all mimic the
 *     W3C XML DOM methods.  Create a new parser with the
 *     <OpenLayers.Format.XML> constructor.
 *
 * Inherits from:
 *  - <OpenLayers.Format>
 */
OpenLayers.Format.XML = OpenLayers.Class(OpenLayers.Format, {
    
    /**
     * Property: namespaces
     * {Object} Mapping of namespace aliases to namespace URIs.  Properties
     *     of this object should not be set individually.  Read-only.  All
     *     XML subclasses should have their own namespaces object.  Use
     *     <setNamespace> to add or set a namespace alias after construction.
     */
    namespaces: null,
    
    /**
     * Property: namespaceAlias
     * {Object} Mapping of namespace URI to namespace alias.  This object
     *     is read-only.  Use <setNamespace> to add or set a namespace alias.
     */
    namespaceAlias: null,
    
    /**
     * Property: defaultPrefix
     * {String} The default namespace alias for creating element nodes.
     */
    defaultPrefix: null,
    
    /**
     * Property: readers
     * Contains public functions, grouped by namespace prefix, that will
     *     be applied when a namespaced node is found matching the function
     *     name.  The function will be applied in the scope of this parser
     *     with two arguments: the node being read and a context object passed
     *     from the parent.
     */
    readers: {},
    
    /**
     * Property: writers
     * As a compliment to the <readers> property, this structure contains public
     *     writing functions grouped by namespace alias and named like the
     *     node names they produce.
     */
    writers: {},

    /**
     * Property: xmldom
     * {XMLDom} If this browser uses ActiveX, this will be set to a XMLDOM
     *     object.  It is not intended to be a browser sniffing property.
     *     Instead, the xmldom property is used instead of <code>document<end>
     *     where namespaced node creation methods are not supported. In all
     *     other browsers, this remains null.
     */
    xmldom: null,

    /**
     * Constructor: OpenLayers.Format.XML
     * Construct an XML parser.  The parser is used to read and write XML.
     *     Reading XML from a string returns a DOM element.  Writing XML from
     *     a DOM element returns a string.
     *
     * Parameters:
     * options - {Object} Optional object whose properties will be set on
     *     the object.
     */
    initialize: function(options) {
        if(window.ActiveXObject) {
            this.xmldom = new ActiveXObject("Microsoft.XMLDOM");
        }
        OpenLayers.Format.prototype.initialize.apply(this, [options]);
        // clone the namespace object and set all namespace aliases
        this.namespaces = OpenLayers.Util.extend({}, this.namespaces);
        this.namespaceAlias = {};
        for(var alias in this.namespaces) {
            this.namespaceAlias[this.namespaces[alias]] = alias;
        }
    },
    
    /**
     * APIMethod: destroy
     * Clean up.
     */
    destroy: function() {
        this.xmldom = null;
        OpenLayers.Format.prototype.destroy.apply(this, arguments);
    },
    
    /**
     * Method: setNamespace
     * Set a namespace alias and URI for the format.
     *
     * Parameters:
     * alias - {String} The namespace alias (prefix).
     * uri - {String} The namespace URI.
     */
    setNamespace: function(alias, uri) {
        this.namespaces[alias] = uri;
        this.namespaceAlias[uri] = alias;
    },

    /**
     * APIMethod: read
     * Deserialize a XML string and return a DOM node.
     *
     * Parameters:
     * text - {String} A XML string
     
     * Returns:
     * {DOMElement} A DOM node
     */
    read: function(text) {
        var index = text.indexOf('<');
        if(index > 0) {
            text = text.substring(index);
        }
        var node = OpenLayers.Util.Try(
            OpenLayers.Function.bind((
                function() {
                    var xmldom;
                    /**
                     * Since we want to be able to call this method on the prototype
                     * itself, this.xmldom may not exist even if in IE.
                     */
                    if(window.ActiveXObject && !this.xmldom) {
                        xmldom = new ActiveXObject("Microsoft.XMLDOM");
                    } else {
                        xmldom = this.xmldom;
                        
                    }
                    xmldom.loadXML(text);
                    return xmldom;
                }
            ), this),
            function() {
                return new DOMParser().parseFromString(text, 'text/xml');
            },
            function() {
                var req = new XMLHttpRequest();
                req.open("GET", "data:" + "text/xml" +
                         ";charset=utf-8," + encodeURIComponent(text), false);
                if(req.overrideMimeType) {
                    req.overrideMimeType("text/xml");
                }
                req.send(null);
                return req.responseXML;
            }
        );

        if(this.keepData) {
            this.data = node;
        }

        return node;
    },

    /**
     * APIMethod: write
     * Serialize a DOM node into a XML string.
     * 
     * Parameters:
     * node - {DOMElement} A DOM node.
     *
     * Returns:
     * {String} The XML string representation of the input node.
     */
    write: function(node) {
        var data;
        if(this.xmldom) {
            data = node.xml;
        } else {
            var serializer = new XMLSerializer();
            if (node.nodeType == 1) {
                // Add nodes to a document before serializing. Everything else
                // is serialized as is. This may need more work. See #1218 .
                var doc = document.implementation.createDocument("", "", null);
                if (doc.importNode) {
                    node = doc.importNode(node, true);
                }
                doc.appendChild(node);
                data = serializer.serializeToString(doc);
            } else {
                data = serializer.serializeToString(node);
            }
        }
        return data;
    },

    /**
     * APIMethod: createElementNS
     * Create a new element with namespace.  This node can be appended to
     *     another node with the standard node.appendChild method.  For
     *     cross-browser support, this method must be used instead of
     *     document.createElementNS.
     *
     * Parameters:
     * uri - {String} Namespace URI for the element.
     * name - {String} The qualified name of the element (prefix:localname).
     * 
     * Returns:
     * {Element} A DOM element with namespace.
     */
    createElementNS: function(uri, name) {
        var element;
        if(this.xmldom) {
            if(typeof uri == "string") {
                element = this.xmldom.createNode(1, name, uri);
            } else {
                element = this.xmldom.createNode(1, name, "");
            }
        } else {
            element = document.createElementNS(uri, name);
        }
        return element;
    },

    /**
     * APIMethod: createDocumentFragment
     * Create a document fragment node that can be appended to another node
     *     created by createElementNS.  This will call 
     *     document.createDocumentFragment outside of IE.  In IE, the ActiveX
     *     object's createDocumentFragment method is used.
     *
     * Returns:
     * {Element} A document fragment.
     */
    createDocumentFragment: function() {
        var element;
        if (this.xmldom) {
            element = this.xmldom.createDocumentFragment();
        } else {
            element = document.createDocumentFragment();
        }
        return element;
    },

    /**
     * APIMethod: createTextNode
     * Create a text node.  This node can be appended to another node with
     *     the standard node.appendChild method.  For cross-browser support,
     *     this method must be used instead of document.createTextNode.
     * 
     * Parameters:
     * text - {String} The text of the node.
     * 
     * Returns: 
     * {DOMElement} A DOM text node.
     */
    createTextNode: function(text) {
        var node;
        if (typeof text !== "string") {
            text = String(text);
        }
        if(this.xmldom) {
            node = this.xmldom.createTextNode(text);
        } else {
            node = document.createTextNode(text);
        }
        return node;
    },

    /**
     * APIMethod: getElementsByTagNameNS
     * Get a list of elements on a node given the namespace URI and local name.
     *     To return all nodes in a given namespace, use '*' for the name
     *     argument.  To return all nodes of a given (local) name, regardless
     *     of namespace, use '*' for the uri argument.
     * 
     * Parameters:
     * node - {Element} Node on which to search for other nodes.
     * uri - {String} Namespace URI.
     * name - {String} Local name of the tag (without the prefix).
     * 
     * Returns:
     * {NodeList} A node list or array of elements.
     */
    getElementsByTagNameNS: function(node, uri, name) {
        var elements = [];
        if(node.getElementsByTagNameNS) {
            elements = node.getElementsByTagNameNS(uri, name);
        } else {
            // brute force method
            var allNodes = node.getElementsByTagName("*");
            var potentialNode, fullName;
            for(var i=0, len=allNodes.length; i<len; ++i) {
                potentialNode = allNodes[i];
                fullName = (potentialNode.prefix) ?
                           (potentialNode.prefix + ":" + name) : name;
                if((name == "*") || (fullName == potentialNode.nodeName)) {
                    if((uri == "*") || (uri == potentialNode.namespaceURI)) {
                        elements.push(potentialNode);
                    }
                }
            }
        }
        return elements;
    },

    /**
     * APIMethod: getAttributeNodeNS
     * Get an attribute node given the namespace URI and local name.
     * 
     * Parameters:
     * node - {Element} Node on which to search for attribute nodes.
     * uri - {String} Namespace URI.
     * name - {String} Local name of the attribute (without the prefix).
     * 
     * Returns:
     * {DOMElement} An attribute node or null if none found.
     */
    getAttributeNodeNS: function(node, uri, name) {
        var attributeNode = null;
        if(node.getAttributeNodeNS) {
            attributeNode = node.getAttributeNodeNS(uri, name);
        } else {
            var attributes = node.attributes;
            var potentialNode, fullName;
            for(var i=0, len=attributes.length; i<len; ++i) {
                potentialNode = attributes[i];
                if(potentialNode.namespaceURI == uri) {
                    fullName = (potentialNode.prefix) ?
                               (potentialNode.prefix + ":" + name) : name;
                    if(fullName == potentialNode.nodeName) {
                        attributeNode = potentialNode;
                        break;
                    }
                }
            }
        }
        return attributeNode;
    },

    /**
     * APIMethod: getAttributeNS
     * Get an attribute value given the namespace URI and local name.
     * 
     * Parameters:
     * node - {Element} Node on which to search for an attribute.
     * uri - {String} Namespace URI.
     * name - {String} Local name of the attribute (without the prefix).
     * 
     * Returns:
     * {String} An attribute value or and empty string if none found.
     */
    getAttributeNS: function(node, uri, name) {
        var attributeValue = "";
        if(node.getAttributeNS) {
            attributeValue = node.getAttributeNS(uri, name) || "";
        } else {
            var attributeNode = this.getAttributeNodeNS(node, uri, name);
            if(attributeNode) {
                attributeValue = attributeNode.nodeValue;
            }
        }
        return attributeValue;
    },
    
    /**
     * APIMethod: getChildValue
     * Get the textual value of the node if it exists, or return an
     *     optional default string.  Returns an empty string if no first child
     *     exists and no default value is supplied.
     *
     * Parameters:
     * node - {DOMElement} The element used to look for a first child value.
     * def - {String} Optional string to return in the event that no
     *     first child value exists.
     *
     * Returns:
     * {String} The value of the first child of the given node.
     */
    getChildValue: function(node, def) {
        var value = def || "";
        if(node) {
            for(var child=node.firstChild; child; child=child.nextSibling) {
                switch(child.nodeType) {
                    case 3: // text node
                    case 4: // cdata section
                        value += child.nodeValue;
                }
            }
        }
        return value;
    },

    /**
     * APIMethod: isSimpleContent
     * Test if the given node has only simple content (i.e. no child element
     *     nodes).
     *
     * Parameters:
     * node - {DOMElement} An element node.
     *
     * Returns:
     * {Boolean} The node has no child element nodes (nodes of type 1). 
     */
    isSimpleContent: function(node) {
        var simple = true;
        for(var child=node.firstChild; child; child=child.nextSibling) {
            if(child.nodeType === 1) {
                simple = false;
                break;
            }
        }
        return simple;
    },
    
    /**
     * APIMethod: contentType
     * Determine the content type for a given node.
     *
     * Parameters:
     * node - {DOMElement}
     *
     * Returns:
     * {Integer} One of OpenLayers.Format.XML.CONTENT_TYPE.{EMPTY,SIMPLE,COMPLEX,MIXED}
     *     if the node has no, simple, complex, or mixed content.
     */
    contentType: function(node) {
        var simple = false,
            complex = false;
            
        var type = OpenLayers.Format.XML.CONTENT_TYPE.EMPTY;

        for(var child=node.firstChild; child; child=child.nextSibling) {
            switch(child.nodeType) {
                case 1: // element
                    complex = true;
                    break;
                case 8: // comment
                    break;
                default:
                    simple = true;
            }
            if(complex && simple) {
                break;
            }
        }
        
        if(complex && simple) {
            type = OpenLayers.Format.XML.CONTENT_TYPE.MIXED;
        } else if(complex) {
            return OpenLayers.Format.XML.CONTENT_TYPE.COMPLEX;
        } else if(simple) {
            return OpenLayers.Format.XML.CONTENT_TYPE.SIMPLE;
        }
        return type;
    },

    /**
     * APIMethod: hasAttributeNS
     * Determine whether a node has a particular attribute matching the given
     *     name and namespace.
     * 
     * Parameters:
     * node - {Element} Node on which to search for an attribute.
     * uri - {String} Namespace URI.
     * name - {String} Local name of the attribute (without the prefix).
     * 
     * Returns:
     * {Boolean} The node has an attribute matching the name and namespace.
     */
    hasAttributeNS: function(node, uri, name) {
        var found = false;
        if(node.hasAttributeNS) {
            found = node.hasAttributeNS(uri, name);
        } else {
            found = !!this.getAttributeNodeNS(node, uri, name);
        }
        return found;
    },
    
    /**
     * APIMethod: setAttributeNS
     * Adds a new attribute or changes the value of an attribute with the given
     *     namespace and name.
     *
     * Parameters:
     * node - {Element} Element node on which to set the attribute.
     * uri - {String} Namespace URI for the attribute.
     * name - {String} Qualified name (prefix:localname) for the attribute.
     * value - {String} Attribute value.
     */
    setAttributeNS: function(node, uri, name, value) {
        if(node.setAttributeNS) {
            node.setAttributeNS(uri, name, value);
        } else {
            if(this.xmldom) {
                if(uri) {
                    var attribute = node.ownerDocument.createNode(
                        2, name, uri
                    );
                    attribute.nodeValue = value;
                    node.setAttributeNode(attribute);
                } else {
                    node.setAttribute(name, value);
                }
            } else {
                throw "setAttributeNS not implemented";
            }
        }
    },

    /**
     * Method: createElementNSPlus
     * Shorthand for creating namespaced elements with optional attributes and
     *     child text nodes.
     *
     * Parameters:
     * name - {String} The qualified node name.
     * options - {Object} Optional object for node configuration.
     *
     * Valid options:
     * uri - {String} Optional namespace uri for the element - supply a prefix
     *     instead if the namespace uri is a property of the format's namespace
     *     object.
     * attributes - {Object} Optional attributes to be set using the
     *     <setAttributes> method.
     * value - {String} Optional text to be appended as a text node.
     *
     * Returns:
     * {Element} An element node.
     */
    createElementNSPlus: function(name, options) {
        options = options || {};
        // order of prefix preference
        // 1. in the uri option
        // 2. in the prefix option
        // 3. in the qualified name
        // 4. from the defaultPrefix
        var uri = options.uri || this.namespaces[options.prefix];
        if(!uri) {
            var loc = name.indexOf(":");
            uri = this.namespaces[name.substring(0, loc)];
        }
        if(!uri) {
            uri = this.namespaces[this.defaultPrefix];
        }
        var node = this.createElementNS(uri, name);
        if(options.attributes) {
            this.setAttributes(node, options.attributes);
        }
        var value = options.value;
        if(value != null) {
            node.appendChild(this.createTextNode(value));
        }
        return node;
    },
    
    /**
     * Method: setAttributes
     * Set multiple attributes given key value pairs from an object.
     *
     * Parameters:
     * node - {Element} An element node.
     * obj - {Object || Array} An object whose properties represent attribute
     *     names and values represent attribute values.  If an attribute name
     *     is a qualified name ("prefix:local"), the prefix will be looked up
     *     in the parsers {namespaces} object.  If the prefix is found,
     *     setAttributeNS will be used instead of setAttribute.
     */
    setAttributes: function(node, obj) {
        var value, uri;
        for(var name in obj) {
            if(obj[name] != null && obj[name].toString) {
                value = obj[name].toString();
                // check for qualified attribute name ("prefix:local")
                uri = this.namespaces[name.substring(0, name.indexOf(":"))] || null;
                this.setAttributeNS(node, uri, name, value);
            }
        }
    },

    /**
     * Method: getFirstElementChild
     * Implementation of firstElementChild attribute that works on ie7 and ie8.
     *
     * Parameters:
     * node - {DOMElement} The parent node (required).
     *
     * Returns:
     * {DOMElement} The first child element.
     */
    getFirstElementChild: function(node) {
        if (node.firstElementChild) {
            return node.firstElementChild;
        }
        else {
            var child = node.firstChild;
            while (child.nodeType != 1 && (child = child.nextSibling)) {}
            return child;
        }
    },

    /**
     * Method: readNode
     * Shorthand for applying one of the named readers given the node
     *     namespace and local name.  Readers take two args (node, obj) and
     *     generally extend or modify the second.
     *
     * Parameters:
     * node - {DOMElement} The node to be read (required).
     * obj - {Object} The object to be modified (optional).
     *
     * Returns:
     * {Object} The input object, modified (or a new one if none was provided).
     */
    readNode: function(node, obj) {
        if(!obj) {
            obj = {};
        }
        var group = this.readers[node.namespaceURI ? this.namespaceAlias[node.namespaceURI]: this.defaultPrefix];
        if(group) {
            var local = node.localName || node.nodeName.split(":").pop();
            var reader = group[local] || group["*"];
            if(reader) {
                reader.apply(this, [node, obj]);
            }
        }
        return obj;
    },

    /**
     * Method: readChildNodes
     * Shorthand for applying the named readers to all children of a node.
     *     For each child of type 1 (element), <readSelf> is called.
     *
     * Parameters:
     * node - {DOMElement} The node to be read (required).
     * obj - {Object} The object to be modified (optional).
     *
     * Returns:
     * {Object} The input object, modified.
     */
    readChildNodes: function(node, obj) {
        if(!obj) {
            obj = {};
        }
        var children = node.childNodes;
        var child;
        for(var i=0, len=children.length; i<len; ++i) {
            child = children[i];
            if(child.nodeType == 1) {
                this.readNode(child, obj);
            }
        }
        return obj;
    },

    /**
     * Method: writeNode
     * Shorthand for applying one of the named writers and appending the
     *     results to a node.  If a qualified name is not provided for the
     *     second argument (and a local name is used instead), the namespace
     *     of the parent node will be assumed.
     *
     * Parameters:
     * name - {String} The name of a node to generate.  If a qualified name
     *     (e.g. "pre:Name") is used, the namespace prefix is assumed to be
     *     in the <writers> group.  If a local name is used (e.g. "Name") then
     *     the namespace of the parent is assumed.  If a local name is used
     *     and no parent is supplied, then the default namespace is assumed.
     * obj - {Object} Structure containing data for the writer.
     * parent - {DOMElement} Result will be appended to this node.  If no parent
     *     is supplied, the node will not be appended to anything.
     *
     * Returns:
     * {DOMElement} The child node.
     */
    writeNode: function(name, obj, parent) {
        var prefix, local;
        var split = name.indexOf(":");
        if(split > 0) {
            prefix = name.substring(0, split);
            local = name.substring(split + 1);
        } else {
            if(parent) {
                prefix = this.namespaceAlias[parent.namespaceURI];
            } else {
                prefix = this.defaultPrefix;
            }
            local = name;
        }
        var child = this.writers[prefix][local].apply(this, [obj]);
        if(parent) {
            parent.appendChild(child);
        }
        return child;
    },

    /**
     * APIMethod: getChildEl
     * Get the first child element.  Optionally only return the first child
     *     if it matches the given name and namespace URI.
     *
     * Parameters:
     * node - {DOMElement} The parent node.
     * name - {String} Optional node name (local) to search for.
     * uri - {String} Optional namespace URI to search for.
     *
     * Returns:
     * {DOMElement} The first child.  Returns null if no element is found, if
     *     something significant besides an element is found, or if the element
     *     found does not match the optional name and uri.
     */
    getChildEl: function(node, name, uri) {
        return node && this.getThisOrNextEl(node.firstChild, name, uri);
    },
    
    /**
     * APIMethod: getNextEl
     * Get the next sibling element.  Optionally get the first sibling only
     *     if it matches the given local name and namespace URI.
     *
     * Parameters:
     * node - {DOMElement} The node.
     * name - {String} Optional local name of the sibling to search for.
     * uri - {String} Optional namespace URI of the sibling to search for.
     *
     * Returns:
     * {DOMElement} The next sibling element.  Returns null if no element is
     *     found, something significant besides an element is found, or the
     *     found element does not match the optional name and uri.
     */
    getNextEl: function(node, name, uri) {
        return node && this.getThisOrNextEl(node.nextSibling, name, uri);
    },
    
    /**
     * Method: getThisOrNextEl
     * Return this node or the next element node.  Optionally get the first
     *     sibling with the given local name or namespace URI.
     *
     * Parameters:
     * node - {DOMElement} The node.
     * name - {String} Optional local name of the sibling to search for.
     * uri - {String} Optional namespace URI of the sibling to search for.
     *
     * Returns:
     * {DOMElement} The next sibling element.  Returns null if no element is
     *     found, something significant besides an element is found, or the
     *     found element does not match the query.
     */
    getThisOrNextEl: function(node, name, uri) {
        outer: for(var sibling=node; sibling; sibling=sibling.nextSibling) {
            switch(sibling.nodeType) {
                case 1: // Element
                    if((!name || name === (sibling.localName || sibling.nodeName.split(":").pop())) &&
                       (!uri || uri === sibling.namespaceURI)) {
                        // matches
                        break outer;
                    }
                    sibling = null;
                    break outer;
                case 3: // Text
                    if(/^\s*$/.test(sibling.nodeValue)) {
                        break;
                    }
                case 4: // CDATA
                case 6: // ENTITY_NODE
                case 12: // NOTATION_NODE
                case 10: // DOCUMENT_TYPE_NODE
                case 11: // DOCUMENT_FRAGMENT_NODE
                    sibling = null;
                    break outer;
            } // ignore comments and processing instructions
        }
        return sibling || null;
    },
    
    /**
     * APIMethod: lookupNamespaceURI
     * Takes a prefix and returns the namespace URI associated with it on the given
     *     node if found (and null if not). Supplying null for the prefix will
     *     return the default namespace.
     *
     * For browsers that support it, this calls the native lookupNamesapceURI
     *     function.  In other browsers, this is an implementation of
     *     http://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-lookupNamespaceURI.
     *
     * For browsers that don't support the attribute.ownerElement property, this
     *     method cannot be called on attribute nodes.
     *     
     * Parameters:
     * node - {DOMElement} The node from which to start looking.
     * prefix - {String} The prefix to lookup or null to lookup the default namespace.
     * 
     * Returns:
     * {String} The namespace URI for the given prefix.  Returns null if the prefix
     *     cannot be found or the node is the wrong type.
     */
    lookupNamespaceURI: function(node, prefix) {
        var uri = null;
        if(node) {
            if(node.lookupNamespaceURI) {
                uri = node.lookupNamespaceURI(prefix);
            } else {
                outer: switch(node.nodeType) {
                    case 1: // ELEMENT_NODE
                        if(node.namespaceURI !== null && node.prefix === prefix) {
                            uri = node.namespaceURI;
                            break outer;
                        }
                        var len = node.attributes.length;
                        if(len) {
                            var attr;
                            for(var i=0; i<len; ++i) {
                                attr = node.attributes[i];
                                if(attr.prefix === "xmlns" && attr.name === "xmlns:" + prefix) {
                                    uri = attr.value || null;
                                    break outer;
                                } else if(attr.name === "xmlns" && prefix === null) {
                                    uri = attr.value || null;
                                    break outer;
                                }
                            }
                        }
                        uri = this.lookupNamespaceURI(node.parentNode, prefix);
                        break outer;
                    case 2: // ATTRIBUTE_NODE
                        uri = this.lookupNamespaceURI(node.ownerElement, prefix);
                        break outer;
                    case 9: // DOCUMENT_NODE
                        uri = this.lookupNamespaceURI(node.documentElement, prefix);
                        break outer;
                    case 6: // ENTITY_NODE
                    case 12: // NOTATION_NODE
                    case 10: // DOCUMENT_TYPE_NODE
                    case 11: // DOCUMENT_FRAGMENT_NODE
                        break outer;
                    default: 
                        // TEXT_NODE (3), CDATA_SECTION_NODE (4), ENTITY_REFERENCE_NODE (5),
                        // PROCESSING_INSTRUCTION_NODE (7), COMMENT_NODE (8)
                        uri =  this.lookupNamespaceURI(node.parentNode, prefix);
                        break outer;
                }
            }
        }
        return uri;
    },
    
    /**
     * Method: getXMLDoc
     * Get an XML document for nodes that are not supported in HTML (e.g.
     * createCDATASection). On IE, this will either return an existing or
     * create a new <xmldom> on the instance. On other browsers, this will
     * either return an existing or create a new shared document (see
     * <OpenLayers.Format.XML.document>).
     *
     * Returns:
     * {XMLDocument}
     */
    getXMLDoc: function() {
        if (!OpenLayers.Format.XML.document && !this.xmldom) {
            if (document.implementation && document.implementation.createDocument) {
                OpenLayers.Format.XML.document =
                    document.implementation.createDocument("", "", null);
            } else if (!this.xmldom && window.ActiveXObject) {
                this.xmldom = new ActiveXObject("Microsoft.XMLDOM");
            }
        }
        return OpenLayers.Format.XML.document || this.xmldom;
    },

    CLASS_NAME: "OpenLayers.Format.XML" 

});     

OpenLayers.Format.XML.CONTENT_TYPE = {EMPTY: 0, SIMPLE: 1, COMPLEX: 2, MIXED: 3};

/**
 * APIFunction: OpenLayers.Format.XML.lookupNamespaceURI
 * Takes a prefix and returns the namespace URI associated with it on the given
 *     node if found (and null if not). Supplying null for the prefix will
 *     return the default namespace.
 *
 * For browsers that support it, this calls the native lookupNamesapceURI
 *     function.  In other browsers, this is an implementation of
 *     http://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-lookupNamespaceURI.
 *
 * For browsers that don't support the attribute.ownerElement property, this
 *     method cannot be called on attribute nodes.
 *     
 * Parameters:
 * node - {DOMElement} The node from which to start looking.
 * prefix - {String} The prefix to lookup or null to lookup the default namespace.
 * 
 * Returns:
 * {String} The namespace URI for the given prefix.  Returns null if the prefix
 *     cannot be found or the node is the wrong type.
 */
OpenLayers.Format.XML.lookupNamespaceURI = OpenLayers.Function.bind(
    OpenLayers.Format.XML.prototype.lookupNamespaceURI,
    OpenLayers.Format.XML.prototype
);

/**
 * Property: OpenLayers.Format.XML.document
 * {XMLDocument} XML document to reuse for creating non-HTML compliant nodes,
 * like document.createCDATASection.
 */
OpenLayers.Format.XML.document = null;
/* ======================================================================
    OpenLayers/Format/OGCExceptionReport.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Format/XML.js
 */

/**
 * Class: OpenLayers.Format.OGCExceptionReport
 * Class to read exception reports for various OGC services and versions.
 *
 * Inherits from:
 *  - <OpenLayers.Format.XML>
 */
OpenLayers.Format.OGCExceptionReport = OpenLayers.Class(OpenLayers.Format.XML, {

    /**
     * Property: namespaces
     * {Object} Mapping of namespace aliases to namespace URIs.
     */
    namespaces: {
        ogc: "http://www.opengis.net/ogc"
    },

    /**
     * Property: regExes
     * Compiled regular expressions for manipulating strings.
     */
    regExes: {
        trimSpace: (/^\s*|\s*$/g),
        removeSpace: (/\s*/g),
        splitSpace: (/\s+/),
        trimComma: (/\s*,\s*/g)
    },

    /**
     * Property: defaultPrefix
     */
    defaultPrefix: "ogc",

    /**
     * Constructor: OpenLayers.Format.OGCExceptionReport
     * Create a new parser for OGC exception reports.
     *
     * Parameters:
     * options - {Object} An optional object whose properties will be set on
     *     this instance.
     */

    /**
     * APIMethod: read
     * Read OGC exception report data from a string, and return an object with
     * information about the exceptions.
     *
     * Parameters:
     * data - {String} or {DOMElement} data to read/parse.
     *
     * Returns:
     * {Object} Information about the exceptions that occurred.
     */
    read: function(data) {
        var result;
        if(typeof data == "string") {
            data = OpenLayers.Format.XML.prototype.read.apply(this, [data]);
        }
        var root = data.documentElement;
        var exceptionInfo = {exceptionReport: null}; 
        if (root) {
            this.readChildNodes(data, exceptionInfo);
            if (exceptionInfo.exceptionReport === null) {
                // fall-back to OWSCommon since this is a common output format for exceptions
                // we cannot easily use the ows readers directly since they differ for 1.0 and 1.1
                exceptionInfo = new OpenLayers.Format.OWSCommon().read(data);
            }
        }
        return exceptionInfo;
    },

    /**
     * Property: readers
     * Contains public functions, grouped by namespace prefix, that will
     *     be applied when a namespaced node is found matching the function
     *     name.  The function will be applied in the scope of this parser
     *     with two arguments: the node being read and a context object passed
     *     from the parent.
     */
    readers: {
        "ogc": {
            "ServiceExceptionReport": function(node, obj) {
                obj.exceptionReport = {exceptions: []};
                this.readChildNodes(node, obj.exceptionReport);
            },
            "ServiceException": function(node, exceptionReport) {
                var exception = {
                    code: node.getAttribute("code"),
                    locator: node.getAttribute("locator"),
                    text: this.getChildValue(node)
                };
                exceptionReport.exceptions.push(exception);
            }
        }
    },
    
    CLASS_NAME: "OpenLayers.Format.OGCExceptionReport"
    
});
/* ======================================================================
    OpenLayers/Format/XML/VersionedOGC.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Format/XML.js
 * @requires OpenLayers/Format/OGCExceptionReport.js
 */

/**
 * Class: OpenLayers.Format.XML.VersionedOGC
 * Base class for versioned formats, i.e. a format which supports multiple
 * versions.
 *
 * To enable checking if parsing succeeded, you will need to define a property
 * called errorProperty on the parser you want to check. The parser will then
 * check the returned object to see if that property is present. If it is, it
 * assumes the parsing was successful. If it is not present (or is null), it will
 * pass the document through an OGCExceptionReport parser.
 * 
 * If errorProperty is undefined for the parser, this error checking mechanism
 * will be disabled.
 *
 *
 * 
 * Inherits from:
 *  - <OpenLayers.Format.XML>
 */
OpenLayers.Format.XML.VersionedOGC = OpenLayers.Class(OpenLayers.Format.XML, {
    
    /**
     * APIProperty: defaultVersion
     * {String} Version number to assume if none found.
     */
    defaultVersion: null,
    
    /**
     * APIProperty: version
     * {String} Specify a version string if one is known.
     */
    version: null,

    /**
     * APIProperty: profile
     * {String} If provided, use a custom profile.
     */
    profile: null,

    /**
     * APIProperty: allowFallback
     * {Boolean} If a profiled parser cannot be found for the returned version,
     * use a non-profiled parser as the fallback. Application code using this
     * should take into account that the return object structure might be
     * missing the specifics of the profile. Defaults to false.
     */
    allowFallback: false,

    /**
     * Property: name
     * {String} The name of this parser, this is the part of the CLASS_NAME
     * except for "OpenLayers.Format."
     */
    name: null,

    /**
     * APIProperty: stringifyOutput
     * {Boolean} If true, write will return a string otherwise a DOMElement.
     * Default is false.
     */
    stringifyOutput: false,

    /**
     * Property: parser
     * {Object} Instance of the versioned parser.  Cached for multiple read and
     *     write calls of the same version.
     */
    parser: null,

    /**
     * Constructor: OpenLayers.Format.XML.VersionedOGC.
     * Constructor.
     *
     * Parameters:
     * options - {Object} Optional object whose properties will be set on
     *     the object.
     */
    initialize: function(options) {
        OpenLayers.Format.XML.prototype.initialize.apply(this, [options]);
        var className = this.CLASS_NAME;
        this.name = className.substring(className.lastIndexOf(".")+1);
    },

    /**
     * Method: getVersion
     * Returns the version to use. Subclasses can override this function
     * if a different version detection is needed.
     *
     * Parameters:
     * root - {DOMElement}
     * options - {Object} Optional configuration object.
     *
     * Returns:
     * {String} The version to use.
     */
    getVersion: function(root, options) {
        var version;
        // read
        if (root) {
            version = this.version;
            if(!version) {
                version = root.getAttribute("version");
                if(!version) {
                    version = this.defaultVersion;
                }
            }
        } else { // write
            version = (options && options.version) || 
                this.version || this.defaultVersion;
        }
        return version;
    },

    /**
     * Method: getParser
     * Get an instance of the cached parser if available, otherwise create one.
     *
     * Parameters:
     * version - {String}
     *
     * Returns:
     * {<OpenLayers.Format>}
     */
    getParser: function(version) {
        version = version || this.defaultVersion;
        var profile = this.profile ? "_" + this.profile : "";
        if(!this.parser || this.parser.VERSION != version) {
            var format = OpenLayers.Format[this.name][
                "v" + version.replace(/\./g, "_") + profile
            ];
            if(!format) {
                if (profile !== "" && this.allowFallback) {
                    // fallback to the non-profiled version of the parser
                    profile = "";
                    format = OpenLayers.Format[this.name][
                        "v" + version.replace(/\./g, "_")
                    ];
                }
                if (!format) {
                    throw "Can't find a " + this.name + " parser for version " +
                          version + profile;
                }
            }
            this.parser = new format(this.options);
        }
        return this.parser;
    },

    /**
     * APIMethod: write
     * Write a document.
     *
     * Parameters:
     * obj - {Object} An object representing the document.
     * options - {Object} Optional configuration object.
     *
     * Returns:
     * {String} The document as a string
     */
    write: function(obj, options) {
        var version = this.getVersion(null, options);
        this.parser = this.getParser(version);
        var root = this.parser.write(obj, options);
        if (this.stringifyOutput === false) {
            return root;
        } else {
            return OpenLayers.Format.XML.prototype.write.apply(this, [root]);
        }
    },

    /**
     * APIMethod: read
     * Read a doc and return an object representing the document.
     *
     * Parameters:
     * data - {String | DOMElement} Data to read.
     * options - {Object} Options for the reader.
     *
     * Returns:
     * {Object} An object representing the document.
     */
    read: function(data, options) {
        if(typeof data == "string") {
            data = OpenLayers.Format.XML.prototype.read.apply(this, [data]);
        }
        var root = data.documentElement;
        var version = this.getVersion(root);
        this.parser = this.getParser(version);          // Select the parser
        var obj = this.parser.read(data, options);      // Parse the data

        var errorProperty = this.parser.errorProperty || null;
        if (errorProperty !== null && obj[errorProperty] === undefined) {
            // an error must have happened, so parse it and report back
            var format = new OpenLayers.Format.OGCExceptionReport();
            obj.error = format.read(data);
        }
        obj.version = version;
        obj.requestType = this.name;
        return obj;
    },

    CLASS_NAME: "OpenLayers.Format.XML.VersionedOGC"
});
/* ======================================================================
    OpenLayers/Format/OWSCommon.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Format/XML/VersionedOGC.js
 */

/**
 * Class: OpenLayers.Format.OWSCommon
 * Read OWSCommon. Create a new instance with the <OpenLayers.Format.OWSCommon>
 *     constructor.
 * 
 * Inherits from:
 *  - <OpenLayers.Format.XML.VersionedOGC>
 */
OpenLayers.Format.OWSCommon = OpenLayers.Class(OpenLayers.Format.XML.VersionedOGC, {
    
    /**
     * APIProperty: defaultVersion
     * {String} Version number to assume if none found.  Default is "1.0.0".
     */
    defaultVersion: "1.0.0",
    
    /**
     * Constructor: OpenLayers.Format.OWSCommon
     * Create a new parser for OWSCommon.
     *
     * Parameters:
     * options - {Object} An optional object whose properties will be set on
     *     this instance.
     */

    /**
     * Method: getVersion
     * Returns the version to use. Subclasses can override this function
     * if a different version detection is needed.
     *
     * Parameters:
     * root - {DOMElement}
     * options - {Object} Optional configuration object.
     *
     * Returns:
     * {String} The version to use.
     */
    getVersion: function(root, options) {
        var version = this.version;
        if(!version) {
            // remember version does not correspond to the OWS version
            // it corresponds to the WMS/WFS/WCS etc. request version
            var uri = root.getAttribute("xmlns:ows");
            // the above will fail if the namespace prefix is different than
            // ows and if the namespace is declared on a different element
            if (uri && uri.substring(uri.lastIndexOf("/")+1) === "1.1") {
                version ="1.1.0";
            } 
            if(!version) {
                version = this.defaultVersion;
            }
        }
        return version;
    },

    /**
     * APIMethod: read
     * Read an OWSCommon document and return an object.
     *
     * Parameters:
     * data - {String | DOMElement} Data to read.
     * options - {Object} Options for the reader.
     *
     * Returns:
     * {Object} An object representing the structure of the document.
     */

    CLASS_NAME: "OpenLayers.Format.OWSCommon" 
});
/* ======================================================================
    OpenLayers/Format/OWSCommon/v1.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Format/OWSCommon.js
 */

/**
 * Class: OpenLayers.Format.OWSCommon.v1
 * Common readers and writers for OWSCommon v1.X formats
 *
 * Inherits from:
 *  - <OpenLayers.Format.XML>
 */
OpenLayers.Format.OWSCommon.v1 = OpenLayers.Class(OpenLayers.Format.XML, {
   
    /**
     * Property: regExes
     * Compiled regular expressions for manipulating strings.
     */
    regExes: {
        trimSpace: (/^\s*|\s*$/g),
        removeSpace: (/\s*/g),
        splitSpace: (/\s+/),
        trimComma: (/\s*,\s*/g)
    },

    /**
     * Method: read
     *
     * Parameters:
     * data - {DOMElement} An OWSCommon document element.
     * options - {Object} Options for the reader.
     *
     * Returns:
     * {Object} An object representing the OWSCommon document.
     */
    read: function(data, options) {
        options = OpenLayers.Util.applyDefaults(options, this.options);
        var ows = {};
        this.readChildNodes(data, ows);
        return ows;
    },

    /**
     * Property: readers
     * Contains public functions, grouped by namespace prefix, that will
     *     be applied when a namespaced node is found matching the function
     *     name.  The function will be applied in the scope of this parser
     *     with two arguments: the node being read and a context object passed
     *     from the parent.
     */
    readers: {
        "ows": {
            "Exception": function(node, exceptionReport) {
                var exception = {
                    code: node.getAttribute('exceptionCode'),
                    locator: node.getAttribute('locator'),
                    texts: []
                };
                exceptionReport.exceptions.push(exception);
                this.readChildNodes(node, exception);
            },
            "ExceptionText": function(node, exception) {
                var text = this.getChildValue(node);
                exception.texts.push(text);
            },
            "ServiceIdentification": function(node, obj) {
                obj.serviceIdentification = {};
                this.readChildNodes(node, obj.serviceIdentification);
            },
            "Title": function(node, obj) {
                obj.title = this.getChildValue(node);
            },
            "Abstract": function(node, serviceIdentification) {
                serviceIdentification["abstract"] = this.getChildValue(node);
            },
            "Keywords": function(node, serviceIdentification) {
                serviceIdentification.keywords = {};
                this.readChildNodes(node, serviceIdentification.keywords);
            },
            "Keyword": function(node, keywords) {
                keywords[this.getChildValue(node)] = true;
            },
            "ServiceType": function(node, serviceIdentification) {
                serviceIdentification.serviceType = {
                    codeSpace: node.getAttribute('codeSpace'), 
                    value: this.getChildValue(node)};
            },
            "ServiceTypeVersion": function(node, serviceIdentification) {
                serviceIdentification.serviceTypeVersion = this.getChildValue(node);
            },
            "Fees": function(node, serviceIdentification) {
                serviceIdentification.fees = this.getChildValue(node);
            },
            "AccessConstraints": function(node, serviceIdentification) {
                serviceIdentification.accessConstraints = 
                    this.getChildValue(node);
            },
            "ServiceProvider": function(node, obj) {
                obj.serviceProvider = {};
                this.readChildNodes(node, obj.serviceProvider);
            },
            "ProviderName": function(node, serviceProvider) {
                serviceProvider.providerName = this.getChildValue(node);
            },
            "ProviderSite": function(node, serviceProvider) {
                serviceProvider.providerSite = this.getAttributeNS(node, 
                    this.namespaces.xlink, "href");
            },
            "ServiceContact": function(node, serviceProvider) {
                serviceProvider.serviceContact = {};
                this.readChildNodes(node, serviceProvider.serviceContact);
            },
            "IndividualName": function(node, serviceContact) {
                serviceContact.individualName = this.getChildValue(node);
            },
            "PositionName": function(node, serviceContact) {
                serviceContact.positionName = this.getChildValue(node);
            },
            "ContactInfo": function(node, serviceContact) {
                serviceContact.contactInfo = {};
                this.readChildNodes(node, serviceContact.contactInfo);
            },
            "Phone": function(node, contactInfo) {
                contactInfo.phone = {};
                this.readChildNodes(node, contactInfo.phone);
            },
            "Voice": function(node, phone) {
                phone.voice = this.getChildValue(node);
            },
            "Facsimile": function(node, phone) {
                phone.facsimile = this.getChildValue(node);
            },
            "Address": function(node, contactInfo) {
                contactInfo.address = {};
                this.readChildNodes(node, contactInfo.address);
            },
            "DeliveryPoint": function(node, address) {
                address.deliveryPoint = this.getChildValue(node);
            },
            "City": function(node, address) {
                address.city = this.getChildValue(node);
            },
            "AdministrativeArea": function(node, address) {
                address.administrativeArea = this.getChildValue(node);
            },
            "PostalCode": function(node, address) {
                address.postalCode = this.getChildValue(node);
            },
            "Country": function(node, address) {
                address.country = this.getChildValue(node);
            },
            "ElectronicMailAddress": function(node, address) {
                address.electronicMailAddress = this.getChildValue(node);
            },
            "Role": function(node, serviceContact) {
                serviceContact.role = this.getChildValue(node);
            },
            "OperationsMetadata": function(node, obj) {
                obj.operationsMetadata = {};
                this.readChildNodes(node, obj.operationsMetadata);
            },
            "Operation": function(node, operationsMetadata) {
                var name = node.getAttribute("name");
                operationsMetadata[name] = {};
                this.readChildNodes(node, operationsMetadata[name]);
            },
            "DCP": function(node, operation) {
                operation.dcp = {};
                this.readChildNodes(node, operation.dcp);
            },
            "HTTP": function(node, dcp) {
                dcp.http = {};
                this.readChildNodes(node, dcp.http);
            },
            "Get": function(node, http) {
                if (!http.get) {
                    http.get = [];
                }
                var obj = {
                    url: this.getAttributeNS(node, this.namespaces.xlink, "href")
                };
                this.readChildNodes(node, obj);
                http.get.push(obj);
            },
            "Post": function(node, http) {
                if (!http.post) {
                    http.post = [];
                }
                var obj = {
                    url: this.getAttributeNS(node, this.namespaces.xlink, "href")
                };
                this.readChildNodes(node, obj);
                http.post.push(obj);
            },
            "Parameter": function(node, operation) {
                if (!operation.parameters) {
                    operation.parameters = {};
                }
                var name = node.getAttribute("name");
                operation.parameters[name] = {};
                this.readChildNodes(node, operation.parameters[name]);
            },
            "Constraint": function(node, obj) {
                if (!obj.constraints) {
                    obj.constraints = {};
                }
                var name = node.getAttribute("name");
                obj.constraints[name] = {};
                this.readChildNodes(node, obj.constraints[name]);
            },
            "Value": function(node, allowedValues) {
                allowedValues[this.getChildValue(node)] = true;
            },
            "OutputFormat": function(node, obj) {
                obj.formats.push({value: this.getChildValue(node)});
                this.readChildNodes(node, obj);
            },
            "WGS84BoundingBox": function(node, obj) {
                var boundingBox = {};
                boundingBox.crs = node.getAttribute("crs");
                if (obj.BoundingBox) {
                    obj.BoundingBox.push(boundingBox);
                } else {
                    obj.projection = boundingBox.crs;
                    boundingBox = obj;
               }
               this.readChildNodes(node, boundingBox);
            },
            "BoundingBox": function(node, obj) {
                // FIXME: We consider that BoundingBox is the same as WGS84BoundingBox
                // LowerCorner = "min_x min_y"
                // UpperCorner = "max_x max_y"
                // It should normally depend on the projection
                this.readers['ows']['WGS84BoundingBox'].apply(this, [node, obj]);
            },
            "LowerCorner": function(node, obj) {
                var str = this.getChildValue(node).replace(
                    this.regExes.trimSpace, "");
                str = str.replace(this.regExes.trimComma, ",");
                var pointList = str.split(this.regExes.splitSpace);
                obj.left = pointList[0];
                obj.bottom = pointList[1];
            },
            "UpperCorner": function(node, obj) {
                var str = this.getChildValue(node).replace(
                    this.regExes.trimSpace, "");
                str = str.replace(this.regExes.trimComma, ",");
                var pointList = str.split(this.regExes.splitSpace);
                obj.right = pointList[0];
                obj.top = pointList[1];
                obj.bounds = new OpenLayers.Bounds(obj.left, obj.bottom,
                    obj.right, obj.top);
                delete obj.left;
                delete obj.bottom;
                delete obj.right;
                delete obj.top;
            },
            "Language": function(node, obj) {
                obj.language = this.getChildValue(node);
            }
        }
    },

    /**
     * Property: writers
     * As a compliment to the readers property, this structure contains public
     *     writing functions grouped by namespace alias and named like the
     *     node names they produce.
     */
    writers: {
        "ows": {
            "BoundingBox": function(options, nodeName) {
                var node = this.createElementNSPlus(nodeName || "ows:BoundingBox", {
                    attributes: {
                        crs: options.projection
                    }
                });
                this.writeNode("ows:LowerCorner", options, node);
                this.writeNode("ows:UpperCorner", options, node);
                return node;
            },
            "LowerCorner": function(options) {
                var node = this.createElementNSPlus("ows:LowerCorner", {
                    value: options.bounds.left + " " + options.bounds.bottom });
                return node;
            },
            "UpperCorner": function(options) {
                var node = this.createElementNSPlus("ows:UpperCorner", {
                    value: options.bounds.right + " " + options.bounds.top });
                return node;
            },
            "Identifier": function(identifier) {
                var node = this.createElementNSPlus("ows:Identifier", {
                    value: identifier });
                return node;
            },
            "Title": function(title) {
                var node = this.createElementNSPlus("ows:Title", {
                    value: title });
                return node;
            },
            "Abstract": function(abstractValue) {
                var node = this.createElementNSPlus("ows:Abstract", {
                    value: abstractValue });
                return node;
            },
            "OutputFormat": function(format) {
                var node = this.createElementNSPlus("ows:OutputFormat", {
                    value: format });
                return node;
            }
        }
    },

    CLASS_NAME: "OpenLayers.Format.OWSCommon.v1"

});
/* ======================================================================
    OpenLayers/Format/OWSCommon/v1_1_0.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Format/OWSCommon/v1.js
 */

/**
 * Class: OpenLayers.Format.OWSCommon.v1_1_0
 * Parser for OWS Common version 1.1.0.
 *
 * Inherits from:
 *  - <OpenLayers.Format.OWSCommon.v1>
 */
OpenLayers.Format.OWSCommon.v1_1_0 = OpenLayers.Class(OpenLayers.Format.OWSCommon.v1, {

    /**
     * Property: namespaces
     * {Object} Mapping of namespace aliases to namespace URIs.
     */
    namespaces: {
        ows: "http://www.opengis.net/ows/1.1",
        xlink: "http://www.w3.org/1999/xlink"
    },    
    
    /**
     * Property: readers
     * Contains public functions, grouped by namespace prefix, that will
     *     be applied when a namespaced node is found matching the function
     *     name.  The function will be applied in the scope of this parser
     *     with two arguments: the node being read and a context object passed
     *     from the parent.
     */
    readers: {
        "ows": OpenLayers.Util.applyDefaults({
            "ExceptionReport": function(node, obj) {
                obj.exceptionReport = {
                    version: node.getAttribute('version'),
                    language: node.getAttribute('xml:lang'),
                    exceptions: []
                };
                this.readChildNodes(node, obj.exceptionReport);
            },
            "AllowedValues": function(node, parameter) {
                parameter.allowedValues = {};
                this.readChildNodes(node, parameter.allowedValues);
            },
            "AnyValue": function(node, parameter) {
                parameter.anyValue = true;
            },
            "DataType": function(node, parameter) {
                parameter.dataType = this.getChildValue(node);
            },
            "Range": function(node, allowedValues) {
                allowedValues.range = {};
                this.readChildNodes(node, allowedValues.range);
            },
            "MinimumValue": function(node, range) {
                range.minValue = this.getChildValue(node);
            },
            "MaximumValue": function(node, range) {
                range.maxValue = this.getChildValue(node);
            },
            "Identifier": function(node, obj) {
                obj.identifier = this.getChildValue(node);
            },
            "SupportedCRS": function(node, obj) {
                obj.supportedCRS = this.getChildValue(node);
            }
        }, OpenLayers.Format.OWSCommon.v1.prototype.readers["ows"])
    },

    /**
     * Property: writers
     * As a compliment to the readers property, this structure contains public
     *     writing functions grouped by namespace alias and named like the
     *     node names they produce.
     */
    writers: {
        "ows": OpenLayers.Util.applyDefaults({
            "Range": function(range) {
                var node = this.createElementNSPlus("ows:Range", {
                    attributes: {
                        'ows:rangeClosure': range.closure
                    }
                });
                this.writeNode("ows:MinimumValue", range.minValue, node);
                this.writeNode("ows:MaximumValue", range.maxValue, node);
                return node;
            },
            "MinimumValue": function(minValue) {
                var node = this.createElementNSPlus("ows:MinimumValue", {
                    value: minValue
                });
                return node;
            },
            "MaximumValue": function(maxValue) {
                var node = this.createElementNSPlus("ows:MaximumValue", {
                    value: maxValue
                });
                return node;
            },
            "Value": function(value) {
                var node = this.createElementNSPlus("ows:Value", {
                    value: value
                });
                return node;
            }
        }, OpenLayers.Format.OWSCommon.v1.prototype.writers["ows"])
    },

    CLASS_NAME: "OpenLayers.Format.OWSCommon.v1_1_0"

});
/* ======================================================================
    OpenLayers/Geometry.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */
 
/**
 * @requires OpenLayers/BaseTypes/Class.js
 */

/**
 * Class: OpenLayers.Geometry
 * A Geometry is a description of a geographic object.  Create an instance of
 * this class with the <OpenLayers.Geometry> constructor.  This is a base class,
 * typical geometry types are described by subclasses of this class.
 *
 * Note that if you use the <OpenLayers.Geometry.fromWKT> method, you must
 * explicitly include the OpenLayers.Format.WKT in your build.
 */
OpenLayers.Geometry = OpenLayers.Class({

    /**
     * Property: id
     * {String} A unique identifier for this geometry.
     */
    id: null,

    /**
     * Property: parent
     * {<OpenLayers.Geometry>}This is set when a Geometry is added as component
     * of another geometry
     */
    parent: null,

    /**
     * Property: bounds 
     * {<OpenLayers.Bounds>} The bounds of this geometry
     */
    bounds: null,

    /**
     * Constructor: OpenLayers.Geometry
     * Creates a geometry object.  
     */
    initialize: function() {
        this.id = OpenLayers.Util.createUniqueID(this.CLASS_NAME+ "_");
    },
    
    /**
     * Method: destroy
     * Destroy this geometry.
     */
    destroy: function() {
        this.id = null;
        this.bounds = null;
    },
    
    /**
     * APIMethod: clone
     * Create a clone of this geometry.  Does not set any non-standard
     *     properties of the cloned geometry.
     * 
     * Returns:
     * {<OpenLayers.Geometry>} An exact clone of this geometry.
     */
    clone: function() {
        return new OpenLayers.Geometry();
    },
    
    /**
     * Method: setBounds
     * Set the bounds for this Geometry.
     * 
     * Parameters:
     * bounds - {<OpenLayers.Bounds>} 
     */
    setBounds: function(bounds) {
        if (bounds) {
            this.bounds = bounds.clone();
        }
    },
    
    /**
     * Method: clearBounds
     * Nullify this components bounds and that of its parent as well.
     */
    clearBounds: function() {
        this.bounds = null;
        if (this.parent) {
            this.parent.clearBounds();
        }    
    },
    
    /**
     * Method: extendBounds
     * Extend the existing bounds to include the new bounds. 
     * If geometry's bounds is not yet set, then set a new Bounds.
     * 
     * Parameters:
     * newBounds - {<OpenLayers.Bounds>} 
     */
    extendBounds: function(newBounds){
        var bounds = this.getBounds();
        if (!bounds) {
            this.setBounds(newBounds);
        } else {
            this.bounds.extend(newBounds);
        }
    },
    
    /**
     * APIMethod: getBounds
     * Get the bounds for this Geometry. If bounds is not set, it 
     * is calculated again, this makes queries faster.
     * 
     * Returns:
     * {<OpenLayers.Bounds>}
     */
    getBounds: function() {
        if (this.bounds == null) {
            this.calculateBounds();
        }
        return this.bounds;
    },
    
    /** 
     * APIMethod: calculateBounds
     * Recalculate the bounds for the geometry. 
     */
    calculateBounds: function() {
        //
        // This should be overridden by subclasses.
        //
    },
    
    /**
     * APIMethod: distanceTo
     * Calculate the closest distance between two geometries (on the x-y plane).
     *
     * Parameters:
     * geometry - {<OpenLayers.Geometry>} The target geometry.
     * options - {Object} Optional properties for configuring the distance
     *     calculation.
     *
     * Valid options depend on the specific geometry type.
     * 
     * Returns:
     * {Number | Object} The distance between this geometry and the target.
     *     If details is true, the return will be an object with distance,
     *     x0, y0, x1, and x2 properties.  The x0 and y0 properties represent
     *     the coordinates of the closest point on this geometry. The x1 and y1
     *     properties represent the coordinates of the closest point on the
     *     target geometry.
     */
    distanceTo: function(geometry, options) {
    },
    
    /**
     * APIMethod: getVertices
     * Return a list of all points in this geometry.
     *
     * Parameters:
     * nodes - {Boolean} For lines, only return vertices that are
     *     endpoints.  If false, for lines, only vertices that are not
     *     endpoints will be returned.  If not provided, all vertices will
     *     be returned.
     *
     * Returns:
     * {Array} A list of all vertices in the geometry.
     */
    getVertices: function(nodes) {
    },

    /**
     * Method: atPoint
     * Note - This is only an approximation based on the bounds of the 
     * geometry.
     * 
     * Parameters:
     * lonlat - {<OpenLayers.LonLat>|Object} OpenLayers.LonLat or an
     *     object with a 'lon' and 'lat' properties.
     * toleranceLon - {float} Optional tolerance in Geometric Coords
     * toleranceLat - {float} Optional tolerance in Geographic Coords
     * 
     * Returns:
     * {Boolean} Whether or not the geometry is at the specified location
     */
    atPoint: function(lonlat, toleranceLon, toleranceLat) {
        var atPoint = false;
        var bounds = this.getBounds();
        if ((bounds != null) && (lonlat != null)) {

            var dX = (toleranceLon != null) ? toleranceLon : 0;
            var dY = (toleranceLat != null) ? toleranceLat : 0;
    
            var toleranceBounds = 
                new OpenLayers.Bounds(this.bounds.left - dX,
                                      this.bounds.bottom - dY,
                                      this.bounds.right + dX,
                                      this.bounds.top + dY);

            atPoint = toleranceBounds.containsLonLat(lonlat);
        }
        return atPoint;
    },
    
    /**
     * Method: getLength
     * Calculate the length of this geometry. This method is defined in
     * subclasses.
     * 
     * Returns:
     * {Float} The length of the collection by summing its parts
     */
    getLength: function() {
        //to be overridden by geometries that actually have a length
        //
        return 0.0;
    },

    /**
     * Method: getArea
     * Calculate the area of this geometry. This method is defined in subclasses.
     * 
     * Returns:
     * {Float} The area of the collection by summing its parts
     */
    getArea: function() {
        //to be overridden by geometries that actually have an area
        //
        return 0.0;
    },
    
    /**
     * APIMethod: getCentroid
     * Calculate the centroid of this geometry. This method is defined in subclasses.
     *
     * Returns:
     * {<OpenLayers.Geometry.Point>} The centroid of the collection
     */
    getCentroid: function() {
        return null;
    },

    /**
     * Method: toString
     * Returns a text representation of the geometry.  If the WKT format is
     *     included in a build, this will be the Well-Known Text 
     *     representation.
     *
     * Returns:
     * {String} String representation of this geometry.
     */
    toString: function() {
        var string;
        if (OpenLayers.Format && OpenLayers.Format.WKT) {
            string = OpenLayers.Format.WKT.prototype.write(
                new OpenLayers.Feature.Vector(this)
            );
        } else {
            string = Object.prototype.toString.call(this);
        }
        return string;
    },

    CLASS_NAME: "OpenLayers.Geometry"
});

/**
 * Function: OpenLayers.Geometry.fromWKT
 * Generate a geometry given a Well-Known Text string.  For this method to
 *     work, you must include the OpenLayers.Format.WKT in your build 
 *     explicitly.
 *
 * Parameters:
 * wkt - {String} A string representing the geometry in Well-Known Text.
 *
 * Returns:
 * {<OpenLayers.Geometry>} A geometry of the appropriate class.
 */
OpenLayers.Geometry.fromWKT = function(wkt) {
    var geom;
    if (OpenLayers.Format && OpenLayers.Format.WKT) {
        var format = OpenLayers.Geometry.fromWKT.format;
        if (!format) {
            format = new OpenLayers.Format.WKT();
            OpenLayers.Geometry.fromWKT.format = format;
        }
        var result = format.read(wkt);
        if (result instanceof OpenLayers.Feature.Vector) {
            geom = result.geometry;
        } else if (OpenLayers.Util.isArray(result)) {
            var len = result.length;
            var components = new Array(len);
            for (var i=0; i<len; ++i) {
                components[i] = result[i].geometry;
            }
            geom = new OpenLayers.Geometry.Collection(components);
        }
    }
    return geom;
};
    
/**
 * Method: OpenLayers.Geometry.segmentsIntersect
 * Determine whether two line segments intersect.  Optionally calculates
 *     and returns the intersection point.  This function is optimized for
 *     cases where seg1.x2 >= seg2.x1 || seg2.x2 >= seg1.x1.  In those
 *     obvious cases where there is no intersection, the function should
 *     not be called.
 *
 * Parameters:
 * seg1 - {Object} Object representing a segment with properties x1, y1, x2,
 *     and y2.  The start point is represented by x1 and y1.  The end point
 *     is represented by x2 and y2.  Start and end are ordered so that x1 < x2.
 * seg2 - {Object} Object representing a segment with properties x1, y1, x2,
 *     and y2.  The start point is represented by x1 and y1.  The end point
 *     is represented by x2 and y2.  Start and end are ordered so that x1 < x2.
 * options - {Object} Optional properties for calculating the intersection.
 *
 * Valid options:
 * point - {Boolean} Return the intersection point.  If false, the actual
 *     intersection point will not be calculated.  If true and the segments
 *     intersect, the intersection point will be returned.  If true and
 *     the segments do not intersect, false will be returned.  If true and
 *     the segments are coincident, true will be returned.
 * tolerance - {Number} If a non-null value is provided, if the segments are
 *     within the tolerance distance, this will be considered an intersection.
 *     In addition, if the point option is true and the calculated intersection
 *     is within the tolerance distance of an end point, the endpoint will be
 *     returned instead of the calculated intersection.  Further, if the
 *     intersection is within the tolerance of endpoints on both segments, or
 *     if two segment endpoints are within the tolerance distance of eachother
 *     (but no intersection is otherwise calculated), an endpoint on the
 *     first segment provided will be returned.
 *
 * Returns:
 * {Boolean | <OpenLayers.Geometry.Point>}  The two segments intersect.
 *     If the point argument is true, the return will be the intersection
 *     point or false if none exists.  If point is true and the segments
 *     are coincident, return will be true (and the instersection is equal
 *     to the shorter segment).
 */
OpenLayers.Geometry.segmentsIntersect = function(seg1, seg2, options) {
    var point = options && options.point;
    var tolerance = options && options.tolerance;
    var intersection = false;
    var x11_21 = seg1.x1 - seg2.x1;
    var y11_21 = seg1.y1 - seg2.y1;
    var x12_11 = seg1.x2 - seg1.x1;
    var y12_11 = seg1.y2 - seg1.y1;
    var y22_21 = seg2.y2 - seg2.y1;
    var x22_21 = seg2.x2 - seg2.x1;
    var d = (y22_21 * x12_11) - (x22_21 * y12_11);
    var n1 = (x22_21 * y11_21) - (y22_21 * x11_21);
    var n2 = (x12_11 * y11_21) - (y12_11 * x11_21);
    if(d == 0) {
        // parallel
        if(n1 == 0 && n2 == 0) {
            // coincident
            intersection = true;
        }
    } else {
        var along1 = n1 / d;
        var along2 = n2 / d;
        if(along1 >= 0 && along1 <= 1 && along2 >=0 && along2 <= 1) {
            // intersect
            if(!point) {
                intersection = true;
            } else {
                // calculate the intersection point
                var x = seg1.x1 + (along1 * x12_11);
                var y = seg1.y1 + (along1 * y12_11);
                intersection = new OpenLayers.Geometry.Point(x, y);
            }
        }
    }
    if(tolerance) {
        var dist;
        if(intersection) {
            if(point) {
                var segs = [seg1, seg2];
                var seg, x, y;
                // check segment endpoints for proximity to intersection
                // set intersection to first endpoint within the tolerance
                outer: for(var i=0; i<2; ++i) {
                    seg = segs[i];
                    for(var j=1; j<3; ++j) {
                        x = seg["x" + j];
                        y = seg["y" + j];
                        dist = Math.sqrt(
                            Math.pow(x - intersection.x, 2) +
                            Math.pow(y - intersection.y, 2)
                        );
                        if(dist < tolerance) {
                            intersection.x = x;
                            intersection.y = y;
                            break outer;
                        }
                    }
                }
                
            }
        } else {
            // no calculated intersection, but segments could be within
            // the tolerance of one another
            var segs = [seg1, seg2];
            var source, target, x, y, p, result;
            // check segment endpoints for proximity to intersection
            // set intersection to first endpoint within the tolerance
            outer: for(var i=0; i<2; ++i) {
                source = segs[i];
                target = segs[(i+1)%2];
                for(var j=1; j<3; ++j) {
                    p = {x: source["x"+j], y: source["y"+j]};
                    result = OpenLayers.Geometry.distanceToSegment(p, target);
                    if(result.distance < tolerance) {
                        if(point) {
                            intersection = new OpenLayers.Geometry.Point(p.x, p.y);
                        } else {
                            intersection = true;
                        }
                        break outer;
                    }
                }
            }
        }
    }
    return intersection;
};

/**
 * Function: OpenLayers.Geometry.distanceToSegment
 *
 * Parameters:
 * point - {Object} An object with x and y properties representing the
 *     point coordinates.
 * segment - {Object} An object with x1, y1, x2, and y2 properties
 *     representing endpoint coordinates.
 *
 * Returns:
 * {Object} An object with distance, along, x, and y properties.  The distance
 *     will be the shortest distance between the input point and segment.
 *     The x and y properties represent the coordinates along the segment
 *     where the shortest distance meets the segment. The along attribute
 *     describes how far between the two segment points the given point is.
 */
OpenLayers.Geometry.distanceToSegment = function(point, segment) {
    var result = OpenLayers.Geometry.distanceSquaredToSegment(point, segment);
    result.distance = Math.sqrt(result.distance);
    return result;
};

/**
 * Function: OpenLayers.Geometry.distanceSquaredToSegment
 *
 * Usually the distanceToSegment function should be used. This variant however
 * can be used for comparisons where the exact distance is not important.
 *
 * Parameters:
 * point - {Object} An object with x and y properties representing the
 *     point coordinates.
 * segment - {Object} An object with x1, y1, x2, and y2 properties
 *     representing endpoint coordinates.
 *
 * Returns:
 * {Object} An object with squared distance, along, x, and y properties.
 *     The distance will be the shortest distance between the input point and
 *     segment. The x and y properties represent the coordinates along the
 *     segment where the shortest distance meets the segment. The along
 *     attribute describes how far between the two segment points the given
 *     point is.
 */
OpenLayers.Geometry.distanceSquaredToSegment = function(point, segment) {
    var x0 = point.x;
    var y0 = point.y;
    var x1 = segment.x1;
    var y1 = segment.y1;
    var x2 = segment.x2;
    var y2 = segment.y2;
    var dx = x2 - x1;
    var dy = y2 - y1;
    var along = (dx == 0 && dy == 0) ? 0 : ((dx * (x0 - x1)) + (dy * (y0 - y1))) /
                (Math.pow(dx, 2) + Math.pow(dy, 2));
    var x, y;
    if(along <= 0.0) {
        x = x1;
        y = y1;
    } else if(along >= 1.0) {
        x = x2;
        y = y2;
    } else {
        x = x1 + along * dx;
        y = y1 + along * dy;
    }
    return {
        distance: Math.pow(x - x0, 2) + Math.pow(y - y0, 2),
        x: x, y: y,
        along: along
    };
};
/* ======================================================================
    OpenLayers/Geometry/Collection.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Geometry.js
 */

/**
 * Class: OpenLayers.Geometry.Collection
 * A Collection is exactly what it sounds like: A collection of different 
 * Geometries. These are stored in the local parameter <components> (which
 * can be passed as a parameter to the constructor). 
 * 
 * As new geometries are added to the collection, they are NOT cloned. 
 * When removing geometries, they need to be specified by reference (ie you 
 * have to pass in the *exact* geometry to be removed).
 * 
 * The <getArea> and <getLength> functions here merely iterate through
 * the components, summing their respective areas and lengths.
 *
 * Create a new instance with the <OpenLayers.Geometry.Collection> constructor.
 *
 * Inherits from:
 *  - <OpenLayers.Geometry> 
 */
OpenLayers.Geometry.Collection = OpenLayers.Class(OpenLayers.Geometry, {

    /**
     * APIProperty: components
     * {Array(<OpenLayers.Geometry>)} The component parts of this geometry
     */
    components: null,
    
    /**
     * Property: componentTypes
     * {Array(String)} An array of class names representing the types of
     * components that the collection can include.  A null value means the
     * component types are not restricted.
     */
    componentTypes: null,

    /**
     * Constructor: OpenLayers.Geometry.Collection
     * Creates a Geometry Collection -- a list of geoms.
     *
     * Parameters: 
     * components - {Array(<OpenLayers.Geometry>)} Optional array of geometries
     *
     */
    initialize: function (components) {
        OpenLayers.Geometry.prototype.initialize.apply(this, arguments);
        this.components = [];
        if (components != null) {
            this.addComponents(components);
        }
    },

    /**
     * APIMethod: destroy
     * Destroy this geometry.
     */
    destroy: function () {
        this.components.length = 0;
        this.components = null;
        OpenLayers.Geometry.prototype.destroy.apply(this, arguments);
    },

    /**
     * APIMethod: clone
     * Clone this geometry.
     *
     * Returns:
     * {<OpenLayers.Geometry.Collection>} An exact clone of this collection
     */
    clone: function() {
        var Constructor = OpenLayers.Util.getConstructor(this.CLASS_NAME);
        var geometry = new Constructor();
        for(var i=0, len=this.components.length; i<len; i++) {
            geometry.addComponent(this.components[i].clone());
        }
        
        // catch any randomly tagged-on properties
        OpenLayers.Util.applyDefaults(geometry, this);
        
        return geometry;
    },

    /**
     * Method: getComponentsString
     * Get a string representing the components for this collection
     * 
     * Returns:
     * {String} A string representation of the components of this geometry
     */
    getComponentsString: function(){
        var strings = [];
        for(var i=0, len=this.components.length; i<len; i++) {
            strings.push(this.components[i].toShortString()); 
        }
        return strings.join(",");
    },

    /**
     * APIMethod: calculateBounds
     * Recalculate the bounds by iterating through the components and 
     * calling calling extendBounds() on each item.
     */
    calculateBounds: function() {
        this.bounds = null;
        var bounds = new OpenLayers.Bounds();
        var components = this.components;
        if (components) {
            for (var i=0, len=components.length; i<len; i++) {
                bounds.extend(components[i].getBounds());
            }
        }
        // to preserve old behavior, we only set bounds if non-null
        // in the future, we could add bounds.isEmpty()
        if (bounds.left != null && bounds.bottom != null && 
            bounds.right != null && bounds.top != null) {
            this.setBounds(bounds);
        }
    },

    /**
     * APIMethod: addComponents
     * Add components to this geometry.
     *
     * Parameters:
     * components - {Array(<OpenLayers.Geometry>)} An array of geometries to add
     */
    addComponents: function(components){
        if(!(OpenLayers.Util.isArray(components))) {
            components = [components];
        }
        for(var i=0, len=components.length; i<len; i++) {
            this.addComponent(components[i]);
        }
    },

    /**
     * Method: addComponent
     * Add a new component (geometry) to the collection.  If this.componentTypes
     * is set, then the component class name must be in the componentTypes array.
     *
     * The bounds cache is reset.
     * 
     * Parameters:
     * component - {<OpenLayers.Geometry>} A geometry to add
     * index - {int} Optional index into the array to insert the component
     *
     * Returns:
     * {Boolean} The component geometry was successfully added
     */    
    addComponent: function(component, index) {
        var added = false;
        if(component) {
            if(this.componentTypes == null ||
               (OpenLayers.Util.indexOf(this.componentTypes,
                                        component.CLASS_NAME) > -1)) {

                if(index != null && (index < this.components.length)) {
                    var components1 = this.components.slice(0, index);
                    var components2 = this.components.slice(index, 
                                                           this.components.length);
                    components1.push(component);
                    this.components = components1.concat(components2);
                } else {
                    this.components.push(component);
                }
                component.parent = this;
                this.clearBounds();
                added = true;
            }
        }
        return added;
    },
    
    /**
     * APIMethod: removeComponents
     * Remove components from this geometry.
     *
     * Parameters:
     * components - {Array(<OpenLayers.Geometry>)} The components to be removed
     *
     * Returns: 
     * {Boolean} A component was removed.
     */
    removeComponents: function(components) {
        var removed = false;

        if(!(OpenLayers.Util.isArray(components))) {
            components = [components];
        }
        for(var i=components.length-1; i>=0; --i) {
            removed = this.removeComponent(components[i]) || removed;
        }
        return removed;
    },
    
    /**
     * Method: removeComponent
     * Remove a component from this geometry.
     *
     * Parameters:
     * component - {<OpenLayers.Geometry>} 
     *
     * Returns: 
     * {Boolean} The component was removed.
     */
    removeComponent: function(component) {
        
        OpenLayers.Util.removeItem(this.components, component);
        
        // clearBounds() so that it gets recalculated on the next call
        // to this.getBounds();
        this.clearBounds();
        return true;
    },

    /**
     * APIMethod: getLength
     * Calculate the length of this geometry
     *
     * Returns:
     * {Float} The length of the geometry
     */
    getLength: function() {
        var length = 0.0;
        for (var i=0, len=this.components.length; i<len; i++) {
            length += this.components[i].getLength();
        }
        return length;
    },
    
    /**
     * APIMethod: getArea
     * Calculate the area of this geometry. Note how this function is overridden
     * in <OpenLayers.Geometry.Polygon>.
     *
     * Returns:
     * {Float} The area of the collection by summing its parts
     */
    getArea: function() {
        var area = 0.0;
        for (var i=0, len=this.components.length; i<len; i++) {
            area += this.components[i].getArea();
        }
        return area;
    },

    /** 
     * APIMethod: getGeodesicArea
     * Calculate the approximate area of the polygon were it projected onto
     *     the earth.
     *
     * Parameters:
     * projection - {<OpenLayers.Projection>} The spatial reference system
     *     for the geometry coordinates.  If not provided, Geographic/WGS84 is
     *     assumed.
     * 
     * Reference:
     * Robert. G. Chamberlain and William H. Duquette, "Some Algorithms for
     *     Polygons on a Sphere", JPL Publication 07-03, Jet Propulsion
     *     Laboratory, Pasadena, CA, June 2007 http://trs-new.jpl.nasa.gov/dspace/handle/2014/40409
     *
     * Returns:
     * {float} The approximate geodesic area of the geometry in square meters.
     */
    getGeodesicArea: function(projection) {
        var area = 0.0;
        for(var i=0, len=this.components.length; i<len; i++) {
            area += this.components[i].getGeodesicArea(projection);
        }
        return area;
    },
    
    /**
     * APIMethod: getCentroid
     *
     * Compute the centroid for this geometry collection.
     *
     * Parameters:
     * weighted - {Boolean} Perform the getCentroid computation recursively,
     * returning an area weighted average of all geometries in this collection.
     *
     * Returns:
     * {<OpenLayers.Geometry.Point>} The centroid of the collection
     */
    getCentroid: function(weighted) {
        if (!weighted) {
            return this.components.length && this.components[0].getCentroid();
        }
        var len = this.components.length;
        if (!len) {
            return false;
        }
        
        var areas = [];
        var centroids = [];
        var areaSum = 0;
        var minArea = Number.MAX_VALUE;
        var component;
        for (var i=0; i<len; ++i) {
            component = this.components[i];
            var area = component.getArea();
            var centroid = component.getCentroid(true);
            if (isNaN(area) || isNaN(centroid.x) || isNaN(centroid.y)) {
                continue;
            }
            areas.push(area);
            areaSum += area;
            minArea = (area < minArea && area > 0) ? area : minArea;
            centroids.push(centroid);
        }
        len = areas.length;
        if (areaSum === 0) {
            // all the components in this collection have 0 area
            // probably a collection of points -- weight all the points the same
            for (var i=0; i<len; ++i) {
                areas[i] = 1;
            }
            areaSum = areas.length;
        } else {
            // normalize all the areas where the smallest area will get
            // a value of 1
            for (var i=0; i<len; ++i) {
                areas[i] /= minArea;
            }
            areaSum /= minArea;
        }
        
        var xSum = 0, ySum = 0, centroid, area;
        for (var i=0; i<len; ++i) {
            centroid = centroids[i];
            area = areas[i];
            xSum += centroid.x * area;
            ySum += centroid.y * area;
        }
        
        return new OpenLayers.Geometry.Point(xSum/areaSum, ySum/areaSum);
    },

    /**
     * APIMethod: getGeodesicLength
     * Calculate the approximate length of the geometry were it projected onto
     *     the earth.
     *
     * projection - {<OpenLayers.Projection>} The spatial reference system
     *     for the geometry coordinates.  If not provided, Geographic/WGS84 is
     *     assumed.
     * 
     * Returns:
     * {Float} The appoximate geodesic length of the geometry in meters.
     */
    getGeodesicLength: function(projection) {
        var length = 0.0;
        for(var i=0, len=this.components.length; i<len; i++) {
            length += this.components[i].getGeodesicLength(projection);
        }
        return length;
    },

    /**
     * APIMethod: move
     * Moves a geometry by the given displacement along positive x and y axes.
     *     This modifies the position of the geometry and clears the cached
     *     bounds.
     *
     * Parameters:
     * x - {Float} Distance to move geometry in positive x direction. 
     * y - {Float} Distance to move geometry in positive y direction.
     */
    move: function(x, y) {
        for(var i=0, len=this.components.length; i<len; i++) {
            this.components[i].move(x, y);
        }
    },

    /**
     * APIMethod: rotate
     * Rotate a geometry around some origin
     *
     * Parameters:
     * angle - {Float} Rotation angle in degrees (measured counterclockwise
     *                 from the positive x-axis)
     * origin - {<OpenLayers.Geometry.Point>} Center point for the rotation
     */
    rotate: function(angle, origin) {
        for(var i=0, len=this.components.length; i<len; ++i) {
            this.components[i].rotate(angle, origin);
        }
    },

    /**
     * APIMethod: resize
     * Resize a geometry relative to some origin.  Use this method to apply
     *     a uniform scaling to a geometry.
     *
     * Parameters:
     * scale - {Float} Factor by which to scale the geometry.  A scale of 2
     *                 doubles the size of the geometry in each dimension
     *                 (lines, for example, will be twice as long, and polygons
     *                 will have four times the area).
     * origin - {<OpenLayers.Geometry.Point>} Point of origin for resizing
     * ratio - {Float} Optional x:y ratio for resizing.  Default ratio is 1.
     * 
     * Returns:
     * {<OpenLayers.Geometry>} - The current geometry. 
     */
    resize: function(scale, origin, ratio) {
        for(var i=0; i<this.components.length; ++i) {
            this.components[i].resize(scale, origin, ratio);
        }
        return this;
    },

    /**
     * APIMethod: distanceTo
     * Calculate the closest distance between two geometries (on the x-y plane).
     *
     * Parameters:
     * geometry - {<OpenLayers.Geometry>} The target geometry.
     * options - {Object} Optional properties for configuring the distance
     *     calculation.
     *
     * Valid options:
     * details - {Boolean} Return details from the distance calculation.
     *     Default is false.
     * edge - {Boolean} Calculate the distance from this geometry to the
     *     nearest edge of the target geometry.  Default is true.  If true,
     *     calling distanceTo from a geometry that is wholly contained within
     *     the target will result in a non-zero distance.  If false, whenever
     *     geometries intersect, calling distanceTo will return 0.  If false,
     *     details cannot be returned.
     *
     * Returns:
     * {Number | Object} The distance between this geometry and the target.
     *     If details is true, the return will be an object with distance,
     *     x0, y0, x1, and y1 properties.  The x0 and y0 properties represent
     *     the coordinates of the closest point on this geometry. The x1 and y1
     *     properties represent the coordinates of the closest point on the
     *     target geometry.
     */
    distanceTo: function(geometry, options) {
        var edge = !(options && options.edge === false);
        var details = edge && options && options.details;
        var result, best, distance;
        var min = Number.POSITIVE_INFINITY;
        for(var i=0, len=this.components.length; i<len; ++i) {
            result = this.components[i].distanceTo(geometry, options);
            distance = details ? result.distance : result;
            if(distance < min) {
                min = distance;
                best = result;
                if(min == 0) {
                    break;
                }
            }
        }
        return best;
    },

    /** 
     * APIMethod: equals
     * Determine whether another geometry is equivalent to this one.  Geometries
     *     are considered equivalent if all components have the same coordinates.
     * 
     * Parameters:
     * geometry - {<OpenLayers.Geometry>} The geometry to test. 
     *
     * Returns:
     * {Boolean} The supplied geometry is equivalent to this geometry.
     */
    equals: function(geometry) {
        var equivalent = true;
        if(!geometry || !geometry.CLASS_NAME ||
           (this.CLASS_NAME != geometry.CLASS_NAME)) {
            equivalent = false;
        } else if(!(OpenLayers.Util.isArray(geometry.components)) ||
                  (geometry.components.length != this.components.length)) {
            equivalent = false;
        } else {
            for(var i=0, len=this.components.length; i<len; ++i) {
                if(!this.components[i].equals(geometry.components[i])) {
                    equivalent = false;
                    break;
                }
            }
        }
        return equivalent;
    },

    /**
     * APIMethod: transform
     * Reproject the components geometry from source to dest.
     * 
     * Parameters:
     * source - {<OpenLayers.Projection>} 
     * dest - {<OpenLayers.Projection>}
     * 
     * Returns:
     * {<OpenLayers.Geometry>} 
     */
    transform: function(source, dest) {
        if (source && dest) {
            for (var i=0, len=this.components.length; i<len; i++) {  
                var component = this.components[i];
                component.transform(source, dest);
            }
            this.bounds = null;
        }
        return this;
    },

    /**
     * APIMethod: intersects
     * Determine if the input geometry intersects this one.
     *
     * Parameters:
     * geometry - {<OpenLayers.Geometry>} Any type of geometry.
     *
     * Returns:
     * {Boolean} The input geometry intersects this one.
     */
    intersects: function(geometry) {
        var intersect = false;
        for(var i=0, len=this.components.length; i<len; ++ i) {
            intersect = geometry.intersects(this.components[i]);
            if(intersect) {
                break;
            }
        }
        return intersect;
    },

    /**
     * APIMethod: getVertices
     * Return a list of all points in this geometry.
     *
     * Parameters:
     * nodes - {Boolean} For lines, only return vertices that are
     *     endpoints.  If false, for lines, only vertices that are not
     *     endpoints will be returned.  If not provided, all vertices will
     *     be returned.
     *
     * Returns:
     * {Array} A list of all vertices in the geometry.
     */
    getVertices: function(nodes) {
        var vertices = [];
        for(var i=0, len=this.components.length; i<len; ++i) {
            Array.prototype.push.apply(
                vertices, this.components[i].getVertices(nodes)
            );
        }
        return vertices;
    },


    CLASS_NAME: "OpenLayers.Geometry.Collection"
});
/* ======================================================================
    OpenLayers/Geometry/Point.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Geometry.js
 */

/**
 * Class: OpenLayers.Geometry.Point
 * Point geometry class. 
 * 
 * Inherits from:
 *  - <OpenLayers.Geometry> 
 */
OpenLayers.Geometry.Point = OpenLayers.Class(OpenLayers.Geometry, {

    /** 
     * APIProperty: x 
     * {float} 
     */
    x: null,

    /** 
     * APIProperty: y 
     * {float} 
     */
    y: null,

    /**
     * Constructor: OpenLayers.Geometry.Point
     * Construct a point geometry.
     *
     * Parameters:
     * x - {float} 
     * y - {float}
     * 
     */
    initialize: function(x, y) {
        OpenLayers.Geometry.prototype.initialize.apply(this, arguments);
        
        this.x = parseFloat(x);
        this.y = parseFloat(y);
    },

    /**
     * APIMethod: clone
     * 
     * Returns:
     * {<OpenLayers.Geometry.Point>} An exact clone of this OpenLayers.Geometry.Point
     */
    clone: function(obj) {
        if (obj == null) {
            obj = new OpenLayers.Geometry.Point(this.x, this.y);
        }

        // catch any randomly tagged-on properties
        OpenLayers.Util.applyDefaults(obj, this);

        return obj;
    },

    /** 
     * Method: calculateBounds
     * Create a new Bounds based on the lon/lat
     */
    calculateBounds: function () {
        this.bounds = new OpenLayers.Bounds(this.x, this.y,
                                            this.x, this.y);
    },

    /**
     * APIMethod: distanceTo
     * Calculate the closest distance between two geometries (on the x-y plane).
     *
     * Parameters:
     * geometry - {<OpenLayers.Geometry>} The target geometry.
     * options - {Object} Optional properties for configuring the distance
     *     calculation.
     *
     * Valid options:
     * details - {Boolean} Return details from the distance calculation.
     *     Default is false.
     * edge - {Boolean} Calculate the distance from this geometry to the
     *     nearest edge of the target geometry.  Default is true.  If true,
     *     calling distanceTo from a geometry that is wholly contained within
     *     the target will result in a non-zero distance.  If false, whenever
     *     geometries intersect, calling distanceTo will return 0.  If false,
     *     details cannot be returned.
     *
     * Returns:
     * {Number | Object} The distance between this geometry and the target.
     *     If details is true, the return will be an object with distance,
     *     x0, y0, x1, and x2 properties.  The x0 and y0 properties represent
     *     the coordinates of the closest point on this geometry. The x1 and y1
     *     properties represent the coordinates of the closest point on the
     *     target geometry.
     */
    distanceTo: function(geometry, options) {
        var edge = !(options && options.edge === false);
        var details = edge && options && options.details;
        var distance, x0, y0, x1, y1, result;
        if(geometry instanceof OpenLayers.Geometry.Point) {
            x0 = this.x;
            y0 = this.y;
            x1 = geometry.x;
            y1 = geometry.y;
            distance = Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2));
            result = !details ?
                distance : {x0: x0, y0: y0, x1: x1, y1: y1, distance: distance};
        } else {
            result = geometry.distanceTo(this, options);
            if(details) {
                // switch coord order since this geom is target
                result = {
                    x0: result.x1, y0: result.y1,
                    x1: result.x0, y1: result.y0,
                    distance: result.distance
                };
            }
        }
        return result;
    },
    
    /** 
     * APIMethod: equals
     * Determine whether another geometry is equivalent to this one.  Geometries
     *     are considered equivalent if all components have the same coordinates.
     * 
     * Parameters:
     * geom - {<OpenLayers.Geometry.Point>} The geometry to test. 
     *
     * Returns:
     * {Boolean} The supplied geometry is equivalent to this geometry.
     */
    equals: function(geom) {
        var equals = false;
        if (geom != null) {
            equals = ((this.x == geom.x && this.y == geom.y) ||
                      (isNaN(this.x) && isNaN(this.y) && isNaN(geom.x) && isNaN(geom.y)));
        }
        return equals;
    },
    
    /**
     * Method: toShortString
     *
     * Returns:
     * {String} Shortened String representation of Point object. 
     *         (ex. <i>"5, 42"</i>)
     */
    toShortString: function() {
        return (this.x + ", " + this.y);
    },
    
    /**
     * APIMethod: move
     * Moves a geometry by the given displacement along positive x and y axes.
     *     This modifies the position of the geometry and clears the cached
     *     bounds.
     *
     * Parameters:
     * x - {Float} Distance to move geometry in positive x direction. 
     * y - {Float} Distance to move geometry in positive y direction.
     */
    move: function(x, y) {
        this.x = this.x + x;
        this.y = this.y + y;
        this.clearBounds();
    },

    /**
     * APIMethod: rotate
     * Rotate a point around another.
     *
     * Parameters:
     * angle - {Float} Rotation angle in degrees (measured counterclockwise
     *                 from the positive x-axis)
     * origin - {<OpenLayers.Geometry.Point>} Center point for the rotation
     */
    rotate: function(angle, origin) {
        angle *= Math.PI / 180;
        var radius = this.distanceTo(origin);
        var theta = angle + Math.atan2(this.y - origin.y, this.x - origin.x);
        this.x = origin.x + (radius * Math.cos(theta));
        this.y = origin.y + (radius * Math.sin(theta));
        this.clearBounds();
    },
    
    /**
     * APIMethod: getCentroid
     *
     * Returns:
     * {<OpenLayers.Geometry.Point>} The centroid of the collection
     */
    getCentroid: function() {
        return new OpenLayers.Geometry.Point(this.x, this.y);
    },

    /**
     * APIMethod: resize
     * Resize a point relative to some origin.  For points, this has the effect
     *     of scaling a vector (from the origin to the point).  This method is
     *     more useful on geometry collection subclasses.
     *
     * Parameters:
     * scale - {Float} Ratio of the new distance from the origin to the old
     *                 distance from the origin.  A scale of 2 doubles the
     *                 distance between the point and origin.
     * origin - {<OpenLayers.Geometry.Point>} Point of origin for resizing
     * ratio - {Float} Optional x:y ratio for resizing.  Default ratio is 1.
     * 
     * Returns:
     * {<OpenLayers.Geometry>} - The current geometry. 
     */
    resize: function(scale, origin, ratio) {
        ratio = (ratio == undefined) ? 1 : ratio;
        this.x = origin.x + (scale * ratio * (this.x - origin.x));
        this.y = origin.y + (scale * (this.y - origin.y));
        this.clearBounds();
        return this;
    },
    
    /**
     * APIMethod: intersects
     * Determine if the input geometry intersects this one.
     *
     * Parameters:
     * geometry - {<OpenLayers.Geometry>} Any type of geometry.
     *
     * Returns:
     * {Boolean} The input geometry intersects this one.
     */
    intersects: function(geometry) {
        var intersect = false;
        if(geometry.CLASS_NAME == "OpenLayers.Geometry.Point") {
            intersect = this.equals(geometry);
        } else {
            intersect = geometry.intersects(this);
        }
        return intersect;
    },
    
    /**
     * APIMethod: transform
     * Translate the x,y properties of the point from source to dest.
     * 
     * Parameters:
     * source - {<OpenLayers.Projection>} 
     * dest - {<OpenLayers.Projection>}
     * 
     * Returns:
     * {<OpenLayers.Geometry>} 
     */
    transform: function(source, dest) {
        if ((source && dest)) {
            OpenLayers.Projection.transform(
                this, source, dest); 
            this.bounds = null;
        }       
        return this;
    },

    /**
     * APIMethod: getVertices
     * Return a list of all points in this geometry.
     *
     * Parameters:
     * nodes - {Boolean} For lines, only return vertices that are
     *     endpoints.  If false, for lines, only vertices that are not
     *     endpoints will be returned.  If not provided, all vertices will
     *     be returned.
     *
     * Returns:
     * {Array} A list of all vertices in the geometry.
     */
    getVertices: function(nodes) {
        return [this];
    },

    CLASS_NAME: "OpenLayers.Geometry.Point"
});
/* ======================================================================
    OpenLayers/Geometry/MultiPoint.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Geometry/Collection.js
 * @requires OpenLayers/Geometry/Point.js
 */

/**
 * Class: OpenLayers.Geometry.MultiPoint
 * MultiPoint is a collection of Points.  Create a new instance with the
 * <OpenLayers.Geometry.MultiPoint> constructor.
 *
 * Inherits from:
 *  - <OpenLayers.Geometry.Collection>
 *  - <OpenLayers.Geometry>
 */
OpenLayers.Geometry.MultiPoint = OpenLayers.Class(
  OpenLayers.Geometry.Collection, {

    /**
     * Property: componentTypes
     * {Array(String)} An array of class names representing the types of
     * components that the collection can include.  A null value means the
     * component types are not restricted.
     */
    componentTypes: ["OpenLayers.Geometry.Point"],

    /**
     * Constructor: OpenLayers.Geometry.MultiPoint
     * Create a new MultiPoint Geometry
     *
     * Parameters:
     * components - {Array(<OpenLayers.Geometry.Point>)} 
     *
     * Returns:
     * {<OpenLayers.Geometry.MultiPoint>}
     */

    /**
     * APIMethod: addPoint
     * Wrapper for <OpenLayers.Geometry.Collection.addComponent>
     *
     * Parameters:
     * point - {<OpenLayers.Geometry.Point>} Point to be added
     * index - {Integer} Optional index
     */
    addPoint: function(point, index) {
        this.addComponent(point, index);
    },
    
    /**
     * APIMethod: removePoint
     * Wrapper for <OpenLayers.Geometry.Collection.removeComponent>
     *
     * Parameters:
     * point - {<OpenLayers.Geometry.Point>} Point to be removed
     */
    removePoint: function(point){
        this.removeComponent(point);
    },

    CLASS_NAME: "OpenLayers.Geometry.MultiPoint"
});
/* ======================================================================
    OpenLayers/Geometry/Curve.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Geometry/MultiPoint.js
 */

/**
 * Class: OpenLayers.Geometry.Curve
 * A Curve is a MultiPoint, whose points are assumed to be connected. To 
 * this end, we provide a "getLength()" function, which iterates through 
 * the points, summing the distances between them. 
 * 
 * Inherits: 
 *  - <OpenLayers.Geometry.MultiPoint>
 */
OpenLayers.Geometry.Curve = OpenLayers.Class(OpenLayers.Geometry.MultiPoint, {

    /**
     * Property: componentTypes
     * {Array(String)} An array of class names representing the types of 
     *                 components that the collection can include.  A null 
     *                 value means the component types are not restricted.
     */
    componentTypes: ["OpenLayers.Geometry.Point"],

    /**
     * Constructor: OpenLayers.Geometry.Curve
     * 
     * Parameters:
     * point - {Array(<OpenLayers.Geometry.Point>)}
     */
    
    /**
     * APIMethod: getLength
     * 
     * Returns:
     * {Float} The length of the curve
     */
    getLength: function() {
        var length = 0.0;
        if ( this.components && (this.components.length > 1)) {
            for(var i=1, len=this.components.length; i<len; i++) {
                length += this.components[i-1].distanceTo(this.components[i]);
            }
        }
        return length;
    },

    /**
     * APIMethod: getGeodesicLength
     * Calculate the approximate length of the geometry were it projected onto
     *     the earth.
     *
     * projection - {<OpenLayers.Projection>} The spatial reference system
     *     for the geometry coordinates.  If not provided, Geographic/WGS84 is
     *     assumed.
     * 
     * Returns:
     * {Float} The appoximate geodesic length of the geometry in meters.
     */
    getGeodesicLength: function(projection) {
        var geom = this;  // so we can work with a clone if needed
        if(projection) {
            var gg = new OpenLayers.Projection("EPSG:4326");
            if(!gg.equals(projection)) {
                geom = this.clone().transform(projection, gg);
            }
        }
        var length = 0.0;
        if(geom.components && (geom.components.length > 1)) {
            var p1, p2;
            for(var i=1, len=geom.components.length; i<len; i++) {
                p1 = geom.components[i-1];
                p2 = geom.components[i];
                // this returns km and requires lon/lat properties
                length += OpenLayers.Util.distVincenty(
                    {lon: p1.x, lat: p1.y}, {lon: p2.x, lat: p2.y}
                );
            }
        }
        // convert to m
        return length * 1000;
    },

    CLASS_NAME: "OpenLayers.Geometry.Curve"
});
/* ======================================================================
    OpenLayers/Geometry/LineString.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Geometry/Curve.js
 */

/**
 * Class: OpenLayers.Geometry.LineString
 * A LineString is a Curve which, once two points have been added to it, can 
 * never be less than two points long.
 * 
 * Inherits from:
 *  - <OpenLayers.Geometry.Curve>
 */
OpenLayers.Geometry.LineString = OpenLayers.Class(OpenLayers.Geometry.Curve, {

    /**
     * Constructor: OpenLayers.Geometry.LineString
     * Create a new LineString geometry
     *
     * Parameters:
     * points - {Array(<OpenLayers.Geometry.Point>)} An array of points used to
     *          generate the linestring
     *
     */

    /**
     * APIMethod: removeComponent
     * Only allows removal of a point if there are three or more points in 
     * the linestring. (otherwise the result would be just a single point)
     *
     * Parameters: 
     * point - {<OpenLayers.Geometry.Point>} The point to be removed
     *
     * Returns: 
     * {Boolean} The component was removed.
     */
    removeComponent: function(point) {
        var removed = this.components && (this.components.length > 2);
        if (removed) {
            OpenLayers.Geometry.Collection.prototype.removeComponent.apply(this, 
                                                                  arguments);
        }
        return removed;
    },
    
    /**
     * APIMethod: intersects
     * Test for instersection between two geometries.  This is a cheapo
     *     implementation of the Bently-Ottmann algorigithm.  It doesn't
     *     really keep track of a sweep line data structure.  It is closer
     *     to the brute force method, except that segments are sorted and
     *     potential intersections are only calculated when bounding boxes
     *     intersect.
     *
     * Parameters:
     * geometry - {<OpenLayers.Geometry>}
     *
     * Returns:
     * {Boolean} The input geometry intersects this geometry.
     */
    intersects: function(geometry) {
        var intersect = false;
        var type = geometry.CLASS_NAME;
        if(type == "OpenLayers.Geometry.LineString" ||
           type == "OpenLayers.Geometry.LinearRing" ||
           type == "OpenLayers.Geometry.Point") {
            var segs1 = this.getSortedSegments();
            var segs2;
            if(type == "OpenLayers.Geometry.Point") {
                segs2 = [{
                    x1: geometry.x, y1: geometry.y,
                    x2: geometry.x, y2: geometry.y
                }];
            } else {
                segs2 = geometry.getSortedSegments();
            }
            var seg1, seg1x1, seg1x2, seg1y1, seg1y2,
                seg2, seg2y1, seg2y2;
            // sweep right
            outer: for(var i=0, len=segs1.length; i<len; ++i) {
                seg1 = segs1[i];
                seg1x1 = seg1.x1;
                seg1x2 = seg1.x2;
                seg1y1 = seg1.y1;
                seg1y2 = seg1.y2;
                inner: for(var j=0, jlen=segs2.length; j<jlen; ++j) {
                    seg2 = segs2[j];
                    if(seg2.x1 > seg1x2) {
                        // seg1 still left of seg2
                        break;
                    }
                    if(seg2.x2 < seg1x1) {
                        // seg2 still left of seg1
                        continue;
                    }
                    seg2y1 = seg2.y1;
                    seg2y2 = seg2.y2;
                    if(Math.min(seg2y1, seg2y2) > Math.max(seg1y1, seg1y2)) {
                        // seg2 above seg1
                        continue;
                    }
                    if(Math.max(seg2y1, seg2y2) < Math.min(seg1y1, seg1y2)) {
                        // seg2 below seg1
                        continue;
                    }
                    if(OpenLayers.Geometry.segmentsIntersect(seg1, seg2)) {
                        intersect = true;
                        break outer;
                    }
                }
            }
        } else {
            intersect = geometry.intersects(this);
        }
        return intersect;
    },
    
    /**
     * Method: getSortedSegments
     *
     * Returns:
     * {Array} An array of segment objects.  Segment objects have properties
     *     x1, y1, x2, and y2.  The start point is represented by x1 and y1.
     *     The end point is represented by x2 and y2.  Start and end are
     *     ordered so that x1 < x2.
     */
    getSortedSegments: function() {
        var numSeg = this.components.length - 1;
        var segments = new Array(numSeg), point1, point2;
        for(var i=0; i<numSeg; ++i) {
            point1 = this.components[i];
            point2 = this.components[i + 1];
            if(point1.x < point2.x) {
                segments[i] = {
                    x1: point1.x,
                    y1: point1.y,
                    x2: point2.x,
                    y2: point2.y
                };
            } else {
                segments[i] = {
                    x1: point2.x,
                    y1: point2.y,
                    x2: point1.x,
                    y2: point1.y
                };
            }
        }
        // more efficient to define this somewhere static
        function byX1(seg1, seg2) {
            return seg1.x1 - seg2.x1;
        }
        return segments.sort(byX1);
    },
    
    /**
     * Method: splitWithSegment
     * Split this geometry with the given segment.
     *
     * Parameters:
     * seg - {Object} An object with x1, y1, x2, and y2 properties referencing
     *     segment endpoint coordinates.
     * options - {Object} Properties of this object will be used to determine
     *     how the split is conducted.
     *
     * Valid options:
     * edge - {Boolean} Allow splitting when only edges intersect.  Default is
     *     true.  If false, a vertex on the source segment must be within the
     *     tolerance distance of the intersection to be considered a split.
     * tolerance - {Number} If a non-null value is provided, intersections
     *     within the tolerance distance of one of the source segment's
     *     endpoints will be assumed to occur at the endpoint.
     *
     * Returns:
     * {Object} An object with *lines* and *points* properties.  If the given
     *     segment intersects this linestring, the lines array will reference
     *     geometries that result from the split.  The points array will contain
     *     all intersection points.  Intersection points are sorted along the
     *     segment (in order from x1,y1 to x2,y2).
     */
    splitWithSegment: function(seg, options) {
        var edge = !(options && options.edge === false);
        var tolerance = options && options.tolerance;
        var lines = [];
        var verts = this.getVertices();
        var points = [];
        var intersections = [];
        var split = false;
        var vert1, vert2, point;
        var node, vertex, target;
        var interOptions = {point: true, tolerance: tolerance};
        var result = null;
        for(var i=0, stop=verts.length-2; i<=stop; ++i) {
            vert1 = verts[i];
            points.push(vert1.clone());
            vert2 = verts[i+1];
            target = {x1: vert1.x, y1: vert1.y, x2: vert2.x, y2: vert2.y};
            point = OpenLayers.Geometry.segmentsIntersect(
                seg, target, interOptions
            );
            if(point instanceof OpenLayers.Geometry.Point) {
                if((point.x === seg.x1 && point.y === seg.y1) ||
                   (point.x === seg.x2 && point.y === seg.y2) ||
                   point.equals(vert1) || point.equals(vert2)) {
                    vertex = true;
                } else {
                    vertex = false;
                }
                if(vertex || edge) {
                    // push intersections different than the previous
                    if(!point.equals(intersections[intersections.length-1])) {
                        intersections.push(point.clone());
                    }
                    if(i === 0) {
                        if(point.equals(vert1)) {
                            continue;
                        }
                    }
                    if(point.equals(vert2)) {
                        continue;
                    }
                    split = true;
                    if(!point.equals(vert1)) {
                        points.push(point);
                    }
                    lines.push(new OpenLayers.Geometry.LineString(points));
                    points = [point.clone()];
                }
            }
        }
        if(split) {
            points.push(vert2.clone());
            lines.push(new OpenLayers.Geometry.LineString(points));
        }
        if(intersections.length > 0) {
            // sort intersections along segment
            var xDir = seg.x1 < seg.x2 ? 1 : -1;
            var yDir = seg.y1 < seg.y2 ? 1 : -1;
            result = {
                lines: lines,
                points: intersections.sort(function(p1, p2) {
                    return (xDir * p1.x - xDir * p2.x) || (yDir * p1.y - yDir * p2.y);
                })
            };
        }
        return result;
    },

    /**
     * Method: split
     * Use this geometry (the source) to attempt to split a target geometry.
     * 
     * Parameters:
     * target - {<OpenLayers.Geometry>} The target geometry.
     * options - {Object} Properties of this object will be used to determine
     *     how the split is conducted.
     *
     * Valid options:
     * mutual - {Boolean} Split the source geometry in addition to the target
     *     geometry.  Default is false.
     * edge - {Boolean} Allow splitting when only edges intersect.  Default is
     *     true.  If false, a vertex on the source must be within the tolerance
     *     distance of the intersection to be considered a split.
     * tolerance - {Number} If a non-null value is provided, intersections
     *     within the tolerance distance of an existing vertex on the source
     *     will be assumed to occur at the vertex.
     * 
     * Returns:
     * {Array} A list of geometries (of this same type as the target) that
     *     result from splitting the target with the source geometry.  The
     *     source and target geometry will remain unmodified.  If no split
     *     results, null will be returned.  If mutual is true and a split
     *     results, return will be an array of two arrays - the first will be
     *     all geometries that result from splitting the source geometry and
     *     the second will be all geometries that result from splitting the
     *     target geometry.
     */
    split: function(target, options) {
        var results = null;
        var mutual = options && options.mutual;
        var sourceSplit, targetSplit, sourceParts, targetParts;
        if(target instanceof OpenLayers.Geometry.LineString) {
            var verts = this.getVertices();
            var vert1, vert2, seg, splits, lines, point;
            var points = [];
            sourceParts = [];
            for(var i=0, stop=verts.length-2; i<=stop; ++i) {
                vert1 = verts[i];
                vert2 = verts[i+1];
                seg = {
                    x1: vert1.x, y1: vert1.y,
                    x2: vert2.x, y2: vert2.y
                };
                targetParts = targetParts || [target];
                if(mutual) {
                    points.push(vert1.clone());
                }
                for(var j=0; j<targetParts.length; ++j) {
                    splits = targetParts[j].splitWithSegment(seg, options);
                    if(splits) {
                        // splice in new features
                        lines = splits.lines;
                        if(lines.length > 0) {
                            lines.unshift(j, 1);
                            Array.prototype.splice.apply(targetParts, lines);
                            j += lines.length - 2;
                        }
                        if(mutual) {
                            for(var k=0, len=splits.points.length; k<len; ++k) {
                                point = splits.points[k];
                                if(!point.equals(vert1)) {
                                    points.push(point);
                                    sourceParts.push(new OpenLayers.Geometry.LineString(points));
                                    if(point.equals(vert2)) {
                                        points = [];
                                    } else {
                                        points = [point.clone()];
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if(mutual && sourceParts.length > 0 && points.length > 0) {
                points.push(vert2.clone());
                sourceParts.push(new OpenLayers.Geometry.LineString(points));
            }
        } else {
            results = target.splitWith(this, options);
        }
        if(targetParts && targetParts.length > 1) {
            targetSplit = true;
        } else {
            targetParts = [];
        }
        if(sourceParts && sourceParts.length > 1) {
            sourceSplit = true;
        } else {
            sourceParts = [];
        }
        if(targetSplit || sourceSplit) {
            if(mutual) {
                results = [sourceParts, targetParts];
            } else {
                results = targetParts;
            }
        }
        return results;
    },

    /**
     * Method: splitWith
     * Split this geometry (the target) with the given geometry (the source).
     *
     * Parameters:
     * geometry - {<OpenLayers.Geometry>} A geometry used to split this
     *     geometry (the source).
     * options - {Object} Properties of this object will be used to determine
     *     how the split is conducted.
     *
     * Valid options:
     * mutual - {Boolean} Split the source geometry in addition to the target
     *     geometry.  Default is false.
     * edge - {Boolean} Allow splitting when only edges intersect.  Default is
     *     true.  If false, a vertex on the source must be within the tolerance
     *     distance of the intersection to be considered a split.
     * tolerance - {Number} If a non-null value is provided, intersections
     *     within the tolerance distance of an existing vertex on the source
     *     will be assumed to occur at the vertex.
     * 
     * Returns:
     * {Array} A list of geometries (of this same type as the target) that
     *     result from splitting the target with the source geometry.  The
     *     source and target geometry will remain unmodified.  If no split
     *     results, null will be returned.  If mutual is true and a split
     *     results, return will be an array of two arrays - the first will be
     *     all geometries that result from splitting the source geometry and
     *     the second will be all geometries that result from splitting the
     *     target geometry.
     */
    splitWith: function(geometry, options) {
        return geometry.split(this, options);

    },

    /**
     * APIMethod: getVertices
     * Return a list of all points in this geometry.
     *
     * Parameters:
     * nodes - {Boolean} For lines, only return vertices that are
     *     endpoints.  If false, for lines, only vertices that are not
     *     endpoints will be returned.  If not provided, all vertices will
     *     be returned.
     *
     * Returns:
     * {Array} A list of all vertices in the geometry.
     */
    getVertices: function(nodes) {
        var vertices;
        if(nodes === true) {
            vertices = [
                this.components[0],
                this.components[this.components.length-1]
            ];
        } else if (nodes === false) {
            vertices = this.components.slice(1, this.components.length-1);
        } else {
            vertices = this.components.slice();
        }
        return vertices;
    },

    /**
     * APIMethod: distanceTo
     * Calculate the closest distance between two geometries (on the x-y plane).
     *
     * Parameters:
     * geometry - {<OpenLayers.Geometry>} The target geometry.
     * options - {Object} Optional properties for configuring the distance
     *     calculation.
     *
     * Valid options:
     * details - {Boolean} Return details from the distance calculation.
     *     Default is false.
     * edge - {Boolean} Calculate the distance from this geometry to the
     *     nearest edge of the target geometry.  Default is true.  If true,
     *     calling distanceTo from a geometry that is wholly contained within
     *     the target will result in a non-zero distance.  If false, whenever
     *     geometries intersect, calling distanceTo will return 0.  If false,
     *     details cannot be returned.
     *
     * Returns:
     * {Number | Object} The distance between this geometry and the target.
     *     If details is true, the return will be an object with distance,
     *     x0, y0, x1, and x2 properties.  The x0 and y0 properties represent
     *     the coordinates of the closest point on this geometry. The x1 and y1
     *     properties represent the coordinates of the closest point on the
     *     target geometry.
     */
    distanceTo: function(geometry, options) {
        var edge = !(options && options.edge === false);
        var details = edge && options && options.details;
        var result, best = {};
        var min = Number.POSITIVE_INFINITY;
        if(geometry instanceof OpenLayers.Geometry.Point) {
            var segs = this.getSortedSegments();
            var x = geometry.x;
            var y = geometry.y;
            var seg;
            for(var i=0, len=segs.length; i<len; ++i) {
                seg = segs[i];
                result = OpenLayers.Geometry.distanceToSegment(geometry, seg);
                if(result.distance < min) {
                    min = result.distance;
                    if(details) {
                        best = {
                            distance: min,
                            x0: result.x, y0: result.y,
                            x1: x, y1: y,
                            index: i,
                            indexDistance: new OpenLayers.Geometry.Point(seg.x1, seg.y1).distanceTo(geometry)
                        };
                    } else {
                        best = min;
                    }
                    if(min === 0) {
                        break;
                    }
                }
            }
        } else if(geometry instanceof OpenLayers.Geometry.LineString) { 
            var segs0 = this.getSortedSegments();
            var segs1 = geometry.getSortedSegments();
            var seg0, seg1, intersection, x0, y0;
            var len1 = segs1.length;
            var interOptions = {point: true};
            outer: for(var i=0, len=segs0.length; i<len; ++i) {
                seg0 = segs0[i];
                x0 = seg0.x1;
                y0 = seg0.y1;
                for(var j=0; j<len1; ++j) {
                    seg1 = segs1[j];
                    intersection = OpenLayers.Geometry.segmentsIntersect(seg0, seg1, interOptions);
                    if(intersection) {
                        min = 0;
                        best = {
                            distance: 0,
                            x0: intersection.x, y0: intersection.y,
                            x1: intersection.x, y1: intersection.y
                        };
                        break outer;
                    } else {
                        result = OpenLayers.Geometry.distanceToSegment({x: x0, y: y0}, seg1);
                        if(result.distance < min) {
                            min = result.distance;
                            best = {
                                distance: min,
                                x0: x0, y0: y0,
                                x1: result.x, y1: result.y
                            };
                        }
                    }
                }
            }
            if(!details) {
                best = best.distance;
            }
            if(min !== 0) {
                // check the final vertex in this line's sorted segments
                if(seg0) {
                    result = geometry.distanceTo(
                        new OpenLayers.Geometry.Point(seg0.x2, seg0.y2),
                        options
                    );
                    var dist = details ? result.distance : result;
                    if(dist < min) {
                        if(details) {
                            best = {
                                distance: min,
                                x0: result.x1, y0: result.y1,
                                x1: result.x0, y1: result.y0
                            };
                        } else {
                            best = dist;
                        }
                    }
                }
            }
        } else {
            best = geometry.distanceTo(this, options);
            // swap since target comes from this line
            if(details) {
                best = {
                    distance: best.distance,
                    x0: best.x1, y0: best.y1,
                    x1: best.x0, y1: best.y0
                };
            }
        }
        return best;
    },
    
    /**
     * APIMethod: simplify
     * This function will return a simplified LineString.
     * Simplification is based on the Douglas-Peucker algorithm.
     *
     *
     * Parameters:
     * tolerance - {number} threshold for simplification in map units
     *
     * Returns:
     * {OpenLayers.Geometry.LineString} the simplified LineString
     */
    simplify: function(tolerance){
        if (this && this !== null) {
            var points = this.getVertices();
            if (points.length < 3) {
                return this;
            }
    
            var compareNumbers = function(a, b){
                return (a-b);
            };
    
            /**
             * Private function doing the Douglas-Peucker reduction
             */
            var douglasPeuckerReduction = function(points, firstPoint, lastPoint, tolerance){
                var maxDistance = 0;
                var indexFarthest = 0;
    
                for (var index = firstPoint, distance; index < lastPoint; index++) {
                    distance = perpendicularDistance(points[firstPoint], points[lastPoint], points[index]);
                    if (distance > maxDistance) {
                        maxDistance = distance;
                        indexFarthest = index;
                    }
                }
    
                if (maxDistance > tolerance && indexFarthest != firstPoint) {
                    //Add the largest point that exceeds the tolerance
                    pointIndexsToKeep.push(indexFarthest);
                    douglasPeuckerReduction(points, firstPoint, indexFarthest, tolerance);
                    douglasPeuckerReduction(points, indexFarthest, lastPoint, tolerance);
                }
            };
    
            /**
             * Private function calculating the perpendicular distance
             * TODO: check whether OpenLayers.Geometry.LineString::distanceTo() is faster or slower
             */
            var perpendicularDistance = function(point1, point2, point){
                //Area = |(1/2)(x1y2 + x2y3 + x3y1 - x2y1 - x3y2 - x1y3)|   *Area of triangle
                //Base = v((x1-x2)²+(x1-x2)²)                               *Base of Triangle*
                //Area = .5*Base*H                                          *Solve for height
                //Height = Area/.5/Base
    
                var area = Math.abs(0.5 * (point1.x * point2.y + point2.x * point.y + point.x * point1.y - point2.x * point1.y - point.x * point2.y - point1.x * point.y));
                var bottom = Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
                var height = area / bottom * 2;
    
                return height;
            };
    
            var firstPoint = 0;
            var lastPoint = points.length - 1;
            var pointIndexsToKeep = [];
    
            //Add the first and last index to the keepers
            pointIndexsToKeep.push(firstPoint);
            pointIndexsToKeep.push(lastPoint);
    
            //The first and the last point cannot be the same
            while (points[firstPoint].equals(points[lastPoint])) {
                lastPoint--;
                //Addition: the first point not equal to first point in the LineString is kept as well
                pointIndexsToKeep.push(lastPoint);
            }
    
            douglasPeuckerReduction(points, firstPoint, lastPoint, tolerance);
            var returnPoints = [];
            pointIndexsToKeep.sort(compareNumbers);
            for (var index = 0; index < pointIndexsToKeep.length; index++) {
                returnPoints.push(points[pointIndexsToKeep[index]]);
            }
            return new OpenLayers.Geometry.LineString(returnPoints);
    
        }
        else {
            return this;
        }
    },

    CLASS_NAME: "OpenLayers.Geometry.LineString"
});
/* ======================================================================
    OpenLayers/Geometry/LinearRing.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Geometry/LineString.js
 */

/**
 * Class: OpenLayers.Geometry.LinearRing
 * 
 * A Linear Ring is a special LineString which is closed. It closes itself 
 * automatically on every addPoint/removePoint by adding a copy of the first
 * point as the last point. 
 * 
 * Also, as it is the first in the line family to close itself, a getArea()
 * function is defined to calculate the enclosed area of the linearRing
 * 
 * Inherits:
 *  - <OpenLayers.Geometry.LineString>
 */
OpenLayers.Geometry.LinearRing = OpenLayers.Class(
  OpenLayers.Geometry.LineString, {

    /**
     * Property: componentTypes
     * {Array(String)} An array of class names representing the types of 
     *                 components that the collection can include.  A null 
     *                 value means the component types are not restricted.
     */
    componentTypes: ["OpenLayers.Geometry.Point"],

    /**
     * Constructor: OpenLayers.Geometry.LinearRing
     * Linear rings are constructed with an array of points.  This array
     *     can represent a closed or open ring.  If the ring is open (the last
     *     point does not equal the first point), the constructor will close
     *     the ring.  If the ring is already closed (the last point does equal
     *     the first point), it will be left closed.
     * 
     * Parameters:
     * points - {Array(<OpenLayers.Geometry.Point>)} points
     */

    /**
     * APIMethod: addComponent
     * Adds a point to geometry components.  If the point is to be added to
     *     the end of the components array and it is the same as the last point
     *     already in that array, the duplicate point is not added.  This has 
     *     the effect of closing the ring if it is not already closed, and 
     *     doing the right thing if it is already closed.  This behavior can 
     *     be overridden by calling the method with a non-null index as the 
     *     second argument.
     *
     * Parameters:
     * point - {<OpenLayers.Geometry.Point>}
     * index - {Integer} Index into the array to insert the component
     * 
     * Returns:
     * {Boolean} Was the Point successfully added?
     */
    addComponent: function(point, index) {
        var added = false;

        //remove last point
        var lastPoint = this.components.pop();

        // given an index, add the point
        // without an index only add non-duplicate points
        if(index != null || !point.equals(lastPoint)) {
            added = OpenLayers.Geometry.Collection.prototype.addComponent.apply(this, 
                                                                    arguments);
        }

        //append copy of first point
        var firstPoint = this.components[0];
        OpenLayers.Geometry.Collection.prototype.addComponent.apply(this, 
                                                                [firstPoint]);
        
        return added;
    },
    
    /**
     * APIMethod: removeComponent
     * Removes a point from geometry components.
     *
     * Parameters:
     * point - {<OpenLayers.Geometry.Point>}
     *
     * Returns: 
     * {Boolean} The component was removed.
     */
    removeComponent: function(point) {
        var removed = this.components && (this.components.length > 3);
        if (removed) {
            //remove last point
            this.components.pop();
            
            //remove our point
            OpenLayers.Geometry.Collection.prototype.removeComponent.apply(this, 
                                                                    arguments);
            //append copy of first point
            var firstPoint = this.components[0];
            OpenLayers.Geometry.Collection.prototype.addComponent.apply(this, 
                                                                [firstPoint]);
        }
        return removed;
    },
    
    /**
     * APIMethod: move
     * Moves a geometry by the given displacement along positive x and y axes.
     *     This modifies the position of the geometry and clears the cached
     *     bounds.
     *
     * Parameters:
     * x - {Float} Distance to move geometry in positive x direction. 
     * y - {Float} Distance to move geometry in positive y direction.
     */
    move: function(x, y) {
        for(var i = 0, len=this.components.length; i<len - 1; i++) {
            this.components[i].move(x, y);
        }
    },

    /**
     * APIMethod: rotate
     * Rotate a geometry around some origin
     *
     * Parameters:
     * angle - {Float} Rotation angle in degrees (measured counterclockwise
     *                 from the positive x-axis)
     * origin - {<OpenLayers.Geometry.Point>} Center point for the rotation
     */
    rotate: function(angle, origin) {
        for(var i=0, len=this.components.length; i<len - 1; ++i) {
            this.components[i].rotate(angle, origin);
        }
    },

    /**
     * APIMethod: resize
     * Resize a geometry relative to some origin.  Use this method to apply
     *     a uniform scaling to a geometry.
     *
     * Parameters:
     * scale - {Float} Factor by which to scale the geometry.  A scale of 2
     *                 doubles the size of the geometry in each dimension
     *                 (lines, for example, will be twice as long, and polygons
     *                 will have four times the area).
     * origin - {<OpenLayers.Geometry.Point>} Point of origin for resizing
     * ratio - {Float} Optional x:y ratio for resizing.  Default ratio is 1.
     * 
     * Returns:
     * {<OpenLayers.Geometry>} - The current geometry. 
     */
    resize: function(scale, origin, ratio) {
        for(var i=0, len=this.components.length; i<len - 1; ++i) {
            this.components[i].resize(scale, origin, ratio);
        }
        return this;
    },
    
    /**
     * APIMethod: transform
     * Reproject the components geometry from source to dest.
     *
     * Parameters:
     * source - {<OpenLayers.Projection>}
     * dest - {<OpenLayers.Projection>}
     * 
     * Returns:
     * {<OpenLayers.Geometry>} 
     */
    transform: function(source, dest) {
        if (source && dest) {
            for (var i=0, len=this.components.length; i<len - 1; i++) {
                var component = this.components[i];
                component.transform(source, dest);
            }
            this.bounds = null;
        }
        return this;
    },
    
    /**
     * APIMethod: getCentroid
     *
     * Returns:
     * {<OpenLayers.Geometry.Point>} The centroid of the collection
     */
    getCentroid: function() {
        if (this.components) {
            var len = this.components.length;
            if (len > 0 && len <= 2) {
                return this.components[0].clone();
            } else if (len > 2) {
                var sumX = 0.0;
                var sumY = 0.0;
                var x0 = this.components[0].x;
                var y0 = this.components[0].y;
                var area = -1 * this.getArea();
                if (area != 0) {
                    for (var i = 0; i < len - 1; i++) {
                        var b = this.components[i];
                        var c = this.components[i+1];
                        sumX += (b.x + c.x - 2 * x0) * ((b.x - x0) * (c.y - y0) - (c.x - x0) * (b.y - y0));
                        sumY += (b.y + c.y - 2 * y0) * ((b.x - x0) * (c.y - y0) - (c.x - x0) * (b.y - y0));
                    }
                    var x = x0 + sumX / (6 * area);
                    var y = y0 + sumY / (6 * area);
                } else {
                    for (var i = 0; i < len - 1; i++) {
                        sumX += this.components[i].x;
                        sumY += this.components[i].y;
                    }
                    var x = sumX / (len - 1);
                    var y = sumY / (len - 1);
                }
                return new OpenLayers.Geometry.Point(x, y);
            } else {
                return null;
            }
        }
    },

    /**
     * APIMethod: getArea
     * Note - The area is positive if the ring is oriented CW, otherwise
     *         it will be negative.
     * 
     * Returns:
     * {Float} The signed area for a ring.
     */
    getArea: function() {
        var area = 0.0;
        if ( this.components && (this.components.length > 2)) {
            var sum = 0.0;
            for (var i=0, len=this.components.length; i<len - 1; i++) {
                var b = this.components[i];
                var c = this.components[i+1];
                sum += (b.x + c.x) * (c.y - b.y);
            }
            area = - sum / 2.0;
        }
        return area;
    },
    
    /**
     * APIMethod: getGeodesicArea
     * Calculate the approximate area of the polygon were it projected onto
     *     the earth.  Note that this area will be positive if ring is oriented
     *     clockwise, otherwise it will be negative.
     *
     * Parameters:
     * projection - {<OpenLayers.Projection>} The spatial reference system
     *     for the geometry coordinates.  If not provided, Geographic/WGS84 is
     *     assumed.
     * 
     * Reference:
     * Robert. G. Chamberlain and William H. Duquette, "Some Algorithms for
     *     Polygons on a Sphere", JPL Publication 07-03, Jet Propulsion
     *     Laboratory, Pasadena, CA, June 2007 http://trs-new.jpl.nasa.gov/dspace/handle/2014/40409
     *
     * Returns:
     * {float} The approximate signed geodesic area of the polygon in square
     *     meters.
     */
    getGeodesicArea: function(projection) {
        var ring = this;  // so we can work with a clone if needed
        if(projection) {
            var gg = new OpenLayers.Projection("EPSG:4326");
            if(!gg.equals(projection)) {
                ring = this.clone().transform(projection, gg);
            }
        }
        var area = 0.0;
        var len = ring.components && ring.components.length;
        if(len > 2) {
            var p1, p2;
            for(var i=0; i<len-1; i++) {
                p1 = ring.components[i];
                p2 = ring.components[i+1];
                area += OpenLayers.Util.rad(p2.x - p1.x) *
                        (2 + Math.sin(OpenLayers.Util.rad(p1.y)) +
                        Math.sin(OpenLayers.Util.rad(p2.y)));
            }
            area = area * 6378137.0 * 6378137.0 / 2.0;
        }
        return area;
    },
    
    /**
     * Method: containsPoint
     * Test if a point is inside a linear ring.  For the case where a point
     *     is coincident with a linear ring edge, returns 1.  Otherwise,
     *     returns boolean.
     *
     * Parameters:
     * point - {<OpenLayers.Geometry.Point>}
     *
     * Returns:
     * {Boolean | Number} The point is inside the linear ring.  Returns 1 if
     *     the point is coincident with an edge.  Returns boolean otherwise.
     */
    containsPoint: function(point) {
        var approx = OpenLayers.Number.limitSigDigs;
        var digs = 14;
        var px = approx(point.x, digs);
        var py = approx(point.y, digs);
        function getX(y, x1, y1, x2, y2) {
            return (y - y2) * ((x2 - x1) / (y2 - y1)) + x2;
        }
        var numSeg = this.components.length - 1;
        var start, end, x1, y1, x2, y2, cx, cy;
        var crosses = 0;
        for(var i=0; i<numSeg; ++i) {
            start = this.components[i];
            x1 = approx(start.x, digs);
            y1 = approx(start.y, digs);
            end = this.components[i + 1];
            x2 = approx(end.x, digs);
            y2 = approx(end.y, digs);
            
            /**
             * The following conditions enforce five edge-crossing rules:
             *    1. points coincident with edges are considered contained;
             *    2. an upward edge includes its starting endpoint, and
             *    excludes its final endpoint;
             *    3. a downward edge excludes its starting endpoint, and
             *    includes its final endpoint;
             *    4. horizontal edges are excluded; and
             *    5. the edge-ray intersection point must be strictly right
             *    of the point P.
             */
            if(y1 == y2) {
                // horizontal edge
                if(py == y1) {
                    // point on horizontal line
                    if(x1 <= x2 && (px >= x1 && px <= x2) || // right or vert
                       x1 >= x2 && (px <= x1 && px >= x2)) { // left or vert
                        // point on edge
                        crosses = -1;
                        break;
                    }
                }
                // ignore other horizontal edges
                continue;
            }
            cx = approx(getX(py, x1, y1, x2, y2), digs);
            if(cx == px) {
                // point on line
                if(y1 < y2 && (py >= y1 && py <= y2) || // upward
                   y1 > y2 && (py <= y1 && py >= y2)) { // downward
                    // point on edge
                    crosses = -1;
                    break;
                }
            }
            if(cx <= px) {
                // no crossing to the right
                continue;
            }
            if(x1 != x2 && (cx < Math.min(x1, x2) || cx > Math.max(x1, x2))) {
                // no crossing
                continue;
            }
            if(y1 < y2 && (py >= y1 && py < y2) || // upward
               y1 > y2 && (py < y1 && py >= y2)) { // downward
                ++crosses;
            }
        }
        var contained = (crosses == -1) ?
            // on edge
            1 :
            // even (out) or odd (in)
            !!(crosses & 1);

        return contained;
    },

    /**
     * APIMethod: intersects
     * Determine if the input geometry intersects this one.
     *
     * Parameters:
     * geometry - {<OpenLayers.Geometry>} Any type of geometry.
     *
     * Returns:
     * {Boolean} The input geometry intersects this one.
     */
    intersects: function(geometry) {
        var intersect = false;
        if(geometry.CLASS_NAME == "OpenLayers.Geometry.Point") {
            intersect = this.containsPoint(geometry);
        } else if(geometry.CLASS_NAME == "OpenLayers.Geometry.LineString") {
            intersect = geometry.intersects(this);
        } else if(geometry.CLASS_NAME == "OpenLayers.Geometry.LinearRing") {
            intersect = OpenLayers.Geometry.LineString.prototype.intersects.apply(
                this, [geometry]
            );
        } else {
            // check for component intersections
            for(var i=0, len=geometry.components.length; i<len; ++ i) {
                intersect = geometry.components[i].intersects(this);
                if(intersect) {
                    break;
                }
            }
        }
        return intersect;
    },

    /**
     * APIMethod: getVertices
     * Return a list of all points in this geometry.
     *
     * Parameters:
     * nodes - {Boolean} For lines, only return vertices that are
     *     endpoints.  If false, for lines, only vertices that are not
     *     endpoints will be returned.  If not provided, all vertices will
     *     be returned.
     *
     * Returns:
     * {Array} A list of all vertices in the geometry.
     */
    getVertices: function(nodes) {
        return (nodes === true) ? [] : this.components.slice(0, this.components.length-1);
    },

    CLASS_NAME: "OpenLayers.Geometry.LinearRing"
});
/* ======================================================================
    OpenLayers/Geometry/Polygon.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Geometry/Collection.js
 * @requires OpenLayers/Geometry/LinearRing.js
 */

/**
 * Class: OpenLayers.Geometry.Polygon 
 * Polygon is a collection of Geometry.LinearRings. 
 * 
 * Inherits from:
 *  - <OpenLayers.Geometry.Collection> 
 *  - <OpenLayers.Geometry> 
 */
OpenLayers.Geometry.Polygon = OpenLayers.Class(
  OpenLayers.Geometry.Collection, {

    /**
     * Property: componentTypes
     * {Array(String)} An array of class names representing the types of
     * components that the collection can include.  A null value means the
     * component types are not restricted.
     */
    componentTypes: ["OpenLayers.Geometry.LinearRing"],

    /**
     * Constructor: OpenLayers.Geometry.Polygon
     * Constructor for a Polygon geometry. 
     * The first ring (this.component[0])is the outer bounds of the polygon and 
     * all subsequent rings (this.component[1-n]) are internal holes.
     *
     *
     * Parameters:
     * components - {Array(<OpenLayers.Geometry.LinearRing>)} 
     */

    /** 
     * APIMethod: getArea
     * Calculated by subtracting the areas of the internal holes from the 
     *   area of the outer hole.
     * 
     * Returns:
     * {float} The area of the geometry
     */
    getArea: function() {
        var area = 0.0;
        if ( this.components && (this.components.length > 0)) {
            area += Math.abs(this.components[0].getArea());
            for (var i=1, len=this.components.length; i<len; i++) {
                area -= Math.abs(this.components[i].getArea());
            }
        }
        return area;
    },

    /** 
     * APIMethod: getGeodesicArea
     * Calculate the approximate area of the polygon were it projected onto
     *     the earth.
     *
     * Parameters:
     * projection - {<OpenLayers.Projection>} The spatial reference system
     *     for the geometry coordinates.  If not provided, Geographic/WGS84 is
     *     assumed.
     * 
     * Reference:
     * Robert. G. Chamberlain and William H. Duquette, "Some Algorithms for
     *     Polygons on a Sphere", JPL Publication 07-03, Jet Propulsion
     *     Laboratory, Pasadena, CA, June 2007 http://trs-new.jpl.nasa.gov/dspace/handle/2014/40409
     *
     * Returns:
     * {float} The approximate geodesic area of the polygon in square meters.
     */
    getGeodesicArea: function(projection) {
        var area = 0.0;
        if(this.components && (this.components.length > 0)) {
            area += Math.abs(this.components[0].getGeodesicArea(projection));
            for(var i=1, len=this.components.length; i<len; i++) {
                area -= Math.abs(this.components[i].getGeodesicArea(projection));
            }
        }
        return area;
    },

    /**
     * Method: containsPoint
     * Test if a point is inside a polygon.  Points on a polygon edge are
     *     considered inside.
     *
     * Parameters:
     * point - {<OpenLayers.Geometry.Point>}
     *
     * Returns:
     * {Boolean | Number} The point is inside the polygon.  Returns 1 if the
     *     point is on an edge.  Returns boolean otherwise.
     */
    containsPoint: function(point) {
        var numRings = this.components.length;
        var contained = false;
        if(numRings > 0) {
            // check exterior ring - 1 means on edge, boolean otherwise
            contained = this.components[0].containsPoint(point);
            if(contained !== 1) {
                if(contained && numRings > 1) {
                    // check interior rings
                    var hole;
                    for(var i=1; i<numRings; ++i) {
                        hole = this.components[i].containsPoint(point);
                        if(hole) {
                            if(hole === 1) {
                                // on edge
                                contained = 1;
                            } else {
                                // in hole
                                contained = false;
                            }                            
                            break;
                        }
                    }
                }
            }
        }
        return contained;
    },

    /**
     * APIMethod: intersects
     * Determine if the input geometry intersects this one.
     *
     * Parameters:
     * geometry - {<OpenLayers.Geometry>} Any type of geometry.
     *
     * Returns:
     * {Boolean} The input geometry intersects this one.
     */
    intersects: function(geometry) {
        var intersect = false;
        var i, len;
        if(geometry.CLASS_NAME == "OpenLayers.Geometry.Point") {
            intersect = this.containsPoint(geometry);
        } else if(geometry.CLASS_NAME == "OpenLayers.Geometry.LineString" ||
                  geometry.CLASS_NAME == "OpenLayers.Geometry.LinearRing") {
            // check if rings/linestrings intersect
            for(i=0, len=this.components.length; i<len; ++i) {
                intersect = geometry.intersects(this.components[i]);
                if(intersect) {
                    break;
                }
            }
            if(!intersect) {
                // check if this poly contains points of the ring/linestring
                for(i=0, len=geometry.components.length; i<len; ++i) {
                    intersect = this.containsPoint(geometry.components[i]);
                    if(intersect) {
                        break;
                    }
                }
            }
        } else {
            for(i=0, len=geometry.components.length; i<len; ++ i) {
                intersect = this.intersects(geometry.components[i]);
                if(intersect) {
                    break;
                }
            }
        }
        // check case where this poly is wholly contained by another
        if(!intersect && geometry.CLASS_NAME == "OpenLayers.Geometry.Polygon") {
            // exterior ring points will be contained in the other geometry
            var ring = this.components[0];
            for(i=0, len=ring.components.length; i<len; ++i) {
                intersect = geometry.containsPoint(ring.components[i]);
                if(intersect) {
                    break;
                }
            }
        }
        return intersect;
    },

    /**
     * APIMethod: distanceTo
     * Calculate the closest distance between two geometries (on the x-y plane).
     *
     * Parameters:
     * geometry - {<OpenLayers.Geometry>} The target geometry.
     * options - {Object} Optional properties for configuring the distance
     *     calculation.
     *
     * Valid options:
     * details - {Boolean} Return details from the distance calculation.
     *     Default is false.
     * edge - {Boolean} Calculate the distance from this geometry to the
     *     nearest edge of the target geometry.  Default is true.  If true,
     *     calling distanceTo from a geometry that is wholly contained within
     *     the target will result in a non-zero distance.  If false, whenever
     *     geometries intersect, calling distanceTo will return 0.  If false,
     *     details cannot be returned.
     *
     * Returns:
     * {Number | Object} The distance between this geometry and the target.
     *     If details is true, the return will be an object with distance,
     *     x0, y0, x1, and y1 properties.  The x0 and y0 properties represent
     *     the coordinates of the closest point on this geometry. The x1 and y1
     *     properties represent the coordinates of the closest point on the
     *     target geometry.
     */
    distanceTo: function(geometry, options) {
        var edge = !(options && options.edge === false);
        var result;
        // this is the case where we might not be looking for distance to edge
        if(!edge && this.intersects(geometry)) {
            result = 0;
        } else {
            result = OpenLayers.Geometry.Collection.prototype.distanceTo.apply(
                this, [geometry, options]
            );
        }
        return result;
    },

    CLASS_NAME: "OpenLayers.Geometry.Polygon"
});

/**
 * APIMethod: createRegularPolygon
 * Create a regular polygon around a radius. Useful for creating circles 
 * and the like.
 *
 * Parameters:
 * origin - {<OpenLayers.Geometry.Point>} center of polygon.
 * radius - {Float} distance to vertex, in map units.
 * sides - {Integer} Number of sides. 20 approximates a circle.
 * rotation - {Float} original angle of rotation, in degrees.
 */
OpenLayers.Geometry.Polygon.createRegularPolygon = function(origin, radius, sides, rotation) {  
    var angle = Math.PI * ((1/sides) - (1/2));
    if(rotation) {
        angle += (rotation / 180) * Math.PI;
    }
    var rotatedAngle, x, y;
    var points = [];
    for(var i=0; i<sides; ++i) {
        rotatedAngle = angle + (i * 2 * Math.PI / sides);
        x = origin.x + (radius * Math.cos(rotatedAngle));
        y = origin.y + (radius * Math.sin(rotatedAngle));
        points.push(new OpenLayers.Geometry.Point(x, y));
    }
    var ring = new OpenLayers.Geometry.LinearRing(points);
    return new OpenLayers.Geometry.Polygon([ring]);
};
/* ======================================================================
    OpenLayers/Format/WPSDescribeProcess.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */
 
/**
 * @requires OpenLayers/Format/XML/VersionedOGC.js
 */

/**
 * Class: OpenLayers.Format.WPSDescribeProcess
 * Read WPS DescribeProcess responses. 
 *
 * Inherits from:
 *  - <OpenLayers.Format.VersionedOGC>
 */
OpenLayers.Format.WPSDescribeProcess = OpenLayers.Class(
    OpenLayers.Format.XML.VersionedOGC, {
 

    /**
     * APIProperty: defaultVersion
     * {String} Version number to assume if none found.  Default is "1.0.0".
     */
    defaultVersion: "1.0.0",

    /**
     * Constructor: OpenLayers.Format.WPSDescribeProcess
     * Create a new parser for WPS DescribeProcess.
     *
     * Parameters:
     * options - {Object} An optional object whose properties will be set on
     *     this instance.
     */

    /**
     * APIMethod: read
     * Parse a WPS DescribeProcess and return an object with its information.
     *
     * Parameters:
     * data - {String} or {DOMElement} data to read/parse.
     *
     * Returns:
     * {Object}
     */

    CLASS_NAME: "OpenLayers.Format.WPSDescribeProcess" 

});
/* ======================================================================
    OpenLayers/Format/WPSDescribeProcess/v1_0_0.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */
 
/**
 * @requires OpenLayers/Format/XML.js
 * @requires OpenLayers/Format/WPSDescribeProcess.js
 * @requires OpenLayers/Format/OWSCommon/v1_1_0.js
 */

/**
 * Class: OpenLayers.Format.WPSDescribeProcess.v1_0_0
 * Read WPS DescribeProcess 1.0.0 responses. 
 *
 * Inherits from:
 *  - <OpenLayers.Format.XML>
 */
OpenLayers.Format.WPSDescribeProcess.v1_0_0 = OpenLayers.Class(
    OpenLayers.Format.XML, {
    
    /**
     * Property: namespaces
     * {Object} Mapping of namespace aliases to namespace URIs.
     */
    namespaces: {
        wps: "http://www.opengis.net/wps/1.0.0",
        ows: "http://www.opengis.net/ows/1.1",
        xsi: "http://www.w3.org/2001/XMLSchema-instance"
    },

    /**
     * APIProperty: errorProperty
     * {String} Which property of the returned object to check for in order to
     * determine whether or not parsing has failed. In the case that the
     * errorProperty is undefined on the returned object, the document will be
     * run through an OGCExceptionReport parser.
     */
    errorProperty: "processDescriptions",

    /**
     * Property: schemaLocation
     * {String} Schema location
     */
    schemaLocation: "http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd",

    /**
     * Property: defaultPrefix
     */
    defaultPrefix: "wps",

    /**
     * Property: regExes
     * Compiled regular expressions for manipulating strings.
     */
    regExes: {
        trimSpace: (/^\s*|\s*$/g),
        removeSpace: (/\s*/g),
        splitSpace: (/\s+/),
        trimComma: (/\s*,\s*/g)
    },
    
    /**
     * Constructor: OpenLayers.Format.WPSDescribeProcess
     *
     * Parameters:
     * options - {Object} An optional object whose properties will be set on
     *     this instance.
     */

    /**
     * APIMethod: read
     * Parse a WPS DescribeProcess and return an object with its information.
     * 
     * Parameters: 
     * data - {String} or {DOMElement} data to read/parse.
     *
     * Returns:
     * {Object}
     */
    read: function(data) {
        if(typeof data == "string") {
            data = OpenLayers.Format.XML.prototype.read.apply(this, [data]);
        }
        if(data && data.nodeType == 9) {
            data = data.documentElement;
        }
        var info = {};
        this.readNode(data, info);
        return info;
    },

    /**
     * Property: readers
     * Contains public functions, grouped by namespace prefix, that will
     *     be applied when a namespaced node is found matching the function
     *     name.  The function will be applied in the scope of this parser
     *     with two arguments: the node being read and a context object passed
     *     from the parent.
     */
    readers: {
        "wps": {
            "ProcessDescriptions": function(node, obj) {
                obj.processDescriptions = {};
                this.readChildNodes(node, obj.processDescriptions);
            },
            "ProcessDescription": function(node, processDescriptions) {
                var processVersion = this.getAttributeNS(node, this.namespaces.wps, "processVersion");
                var processDescription = {
                    processVersion: processVersion,
                    statusSupported: (node.getAttribute("statusSupported") === "true"),
                    storeSupported: (node.getAttribute("storeSupported") === "true")
                };
                this.readChildNodes(node, processDescription);
                processDescriptions[processDescription.identifier] = processDescription;
            },
            "DataInputs": function(node, processDescription) {
                processDescription.dataInputs = [];
                this.readChildNodes(node, processDescription.dataInputs);
            },
            "ProcessOutputs": function(node, processDescription) {
                processDescription.processOutputs = [];
                this.readChildNodes(node, processDescription.processOutputs);
            },
            "Output": function(node, processOutputs) {
                var output = {};
                this.readChildNodes(node, output);
                processOutputs.push(output);
            },
            "ComplexOutput": function(node, output) {
                output.complexOutput = {};
                this.readChildNodes(node, output.complexOutput);
            },
            "LiteralOutput": function(node, output) {
                output.literalOutput = {};
                this.readChildNodes(node, output.literalOutput);
            },
            "Input": function(node, dataInputs) {
                var input = {
                    maxOccurs: parseInt(node.getAttribute("maxOccurs")),
                    minOccurs: parseInt(node.getAttribute("minOccurs"))
                };
                this.readChildNodes(node, input);
                dataInputs.push(input);
            },
            "BoundingBoxData": function(node, input) {
                input.boundingBoxData = {};
                this.readChildNodes(node, input.boundingBoxData);
            },
            "CRS": function(node, obj) {
                if (!obj.CRSs) {
                    obj.CRSs = {};
                }
                obj.CRSs[this.getChildValue(node)] = true;
            },
            "LiteralData": function(node, input) {
                input.literalData = {};
                this.readChildNodes(node, input.literalData);
            },
            "ComplexData": function(node, input) {
                input.complexData = {};
                this.readChildNodes(node,  input.complexData);
            },
            "Default": function(node, complexData) {
                complexData["default"] = {};
                this.readChildNodes(node,  complexData["default"]);
            },
            "Supported": function(node, complexData) {
                complexData["supported"] = {};
                this.readChildNodes(node,  complexData["supported"]);
            },
            "Format": function(node, obj) {
                var format = {};
                this.readChildNodes(node, format);
                if (!obj.formats) {
                    obj.formats = {};
                }
                obj.formats[format.mimeType] = true;
            },
            "MimeType": function(node, format) {
                format.mimeType = this.getChildValue(node);
            }
        },
        "ows": OpenLayers.Format.OWSCommon.v1_1_0.prototype.readers["ows"]
    },
    
    CLASS_NAME: "OpenLayers.Format.WPSDescribeProcess" 

});
/* ======================================================================
    OpenLayers/Format/WFST.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Format.js
 */

/**
 * Function: OpenLayers.Format.WFST
 * Used to create a versioned WFS protocol.  Default version is 1.0.0.
 *
 * Returns:
 * {<OpenLayers.Format>} A WFST format of the given version.
 */
OpenLayers.Format.WFST = function(options) {
    options = OpenLayers.Util.applyDefaults(
        options, OpenLayers.Format.WFST.DEFAULTS
    );
    var cls = OpenLayers.Format.WFST["v"+options.version.replace(/\./g, "_")];
    if(!cls) {
        throw "Unsupported WFST version: " + options.version;
    }
    return new cls(options);
};

/**
 * Constant: OpenLayers.Format.WFST.DEFAULTS
 * {Object} Default properties for the WFST format.
 */
OpenLayers.Format.WFST.DEFAULTS = {
    "version": "1.0.0"
};
/* ======================================================================
    OpenLayers/Filter.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


/**
 * @requires OpenLayers/BaseTypes/Class.js
 * @requires OpenLayers/Util.js
 * @requires OpenLayers/Style.js
 */

/**
 * Class: OpenLayers.Filter
 * This class represents an OGC Filter.
 */
OpenLayers.Filter = OpenLayers.Class({
    
    /** 
     * Constructor: OpenLayers.Filter
     * This class represents a generic filter.
     *
     * Parameters:
     * options - {Object} Optional object whose properties will be set on the
     *     instance.
     * 
     * Returns:
     * {<OpenLayers.Filter>}
     */
    initialize: function(options) {
        OpenLayers.Util.extend(this, options);
    },

    /** 
     * APIMethod: destroy
     * Remove reference to anything added.
     */
    destroy: function() {
    },

    /**
     * APIMethod: evaluate
     * Evaluates this filter in a specific context.  Instances or subclasses
     * are supposed to override this method.
     * 
     * Parameters:
     * context - {Object} Context to use in evaluating the filter.  If a vector
     *     feature is provided, the feature.attributes will be used as context.
     * 
     * Returns:
     * {Boolean} The filter applies.
     */
    evaluate: function(context) {
        return true;
    },
    
    /**
     * APIMethod: clone
     * Clones this filter. Should be implemented by subclasses.
     * 
     * Returns:
     * {<OpenLayers.Filter>} Clone of this filter.
     */
    clone: function() {
        return null;
    },
    
    /**
     * APIMethod: toString
     *
     * Returns:
     * {String} Include <OpenLayers.Format.CQL> in your build to get a CQL
     *     representation of the filter returned. Otherwise "[Object object]"
     *     will be returned.
     */
    toString: function() {
        var string;
        if (OpenLayers.Format && OpenLayers.Format.CQL) {
            string = OpenLayers.Format.CQL.prototype.write(this);
        } else {
            string = Object.prototype.toString.call(this);
        }
        return string;
    },
    
    CLASS_NAME: "OpenLayers.Filter"
});
/* ======================================================================
    OpenLayers/Filter/Spatial.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Filter.js
 */

/**
 * Class: OpenLayers.Filter.Spatial
 * This class represents a spatial filter.
 * Currently implemented: BBOX, DWithin and Intersects
 * 
 * Inherits from:
 * - <OpenLayers.Filter>
 */
OpenLayers.Filter.Spatial = OpenLayers.Class(OpenLayers.Filter, {

    /**
     * APIProperty: type
     * {String} Type of spatial filter.
     *
     * The type should be one of:
     * - OpenLayers.Filter.Spatial.BBOX
     * - OpenLayers.Filter.Spatial.INTERSECTS
     * - OpenLayers.Filter.Spatial.DWITHIN
     * - OpenLayers.Filter.Spatial.WITHIN
     * - OpenLayers.Filter.Spatial.CONTAINS
     */
    type: null,
    
    /**
     * APIProperty: property
     * {String} Name of the context property to compare.
     */
    property: null,
    
    /**
     * APIProperty: value
     * {<OpenLayers.Bounds> || <OpenLayers.Geometry>} The bounds or geometry
     *     to be used by the filter.  Use bounds for BBOX filters and geometry
     *     for INTERSECTS or DWITHIN filters.
     */
    value: null,

    /**
     * APIProperty: distance
     * {Number} The distance to use in a DWithin spatial filter.
     */
    distance: null,

    /**
     * APIProperty: distanceUnits
     * {String} The units to use for the distance, e.g. 'm'.
     */
    distanceUnits: null,
    
    /** 
     * Constructor: OpenLayers.Filter.Spatial
     * Creates a spatial filter.
     *
     * Parameters:
     * options - {Object} An optional object with properties to set on the
     *     filter.
     * 
     * Returns:
     * {<OpenLayers.Filter.Spatial>}
     */

   /**
    * Method: evaluate
    * Evaluates this filter for a specific feature.
    * 
    * Parameters:
    * feature - {<OpenLayers.Feature.Vector>} feature to apply the filter to.
    * 
    * Returns:
    * {Boolean} The feature meets filter criteria.
    */
    evaluate: function(feature) {
        var intersect = false;
        switch(this.type) {
            case OpenLayers.Filter.Spatial.BBOX:
            case OpenLayers.Filter.Spatial.INTERSECTS:
                if(feature.geometry) {
                    var geom = this.value;
                    if(this.value.CLASS_NAME == "OpenLayers.Bounds") {
                        geom = this.value.toGeometry();
                    }
                    if(feature.geometry.intersects(geom)) {
                        intersect = true;
                    }
                }
                break;
            default:
                throw new Error('evaluate is not implemented for this filter type.');
        }
        return intersect;
    },

    /**
     * APIMethod: clone
     * Clones this filter.
     * 
     * Returns:
     * {<OpenLayers.Filter.Spatial>} Clone of this filter.
     */
    clone: function() {
        var options = OpenLayers.Util.applyDefaults({
            value: this.value && this.value.clone && this.value.clone()
        }, this);
        return new OpenLayers.Filter.Spatial(options);
    },
    CLASS_NAME: "OpenLayers.Filter.Spatial"
});

OpenLayers.Filter.Spatial.BBOX = "BBOX";
OpenLayers.Filter.Spatial.INTERSECTS = "INTERSECTS";
OpenLayers.Filter.Spatial.DWITHIN = "DWITHIN";
OpenLayers.Filter.Spatial.WITHIN = "WITHIN";
OpenLayers.Filter.Spatial.CONTAINS = "CONTAINS";
/* ======================================================================
    OpenLayers/Filter/FeatureId.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


/**
 * @requires OpenLayers/Filter.js
 */

/**
 * Class: OpenLayers.Filter.FeatureId
 * This class represents a ogc:FeatureId Filter, as being used for rule-based SLD
 * styling
 * 
 * Inherits from:
 * - <OpenLayers.Filter>
 */
OpenLayers.Filter.FeatureId = OpenLayers.Class(OpenLayers.Filter, {

    /** 
     * APIProperty: fids
     * {Array(String)} Feature Ids to evaluate this rule against. 
     *     To be passed inside the params object.
     */
    fids: null,
    
    /** 
     * Property: type
     * {String} Type to identify this filter.
     */
    type: "FID",
    
    /** 
     * Constructor: OpenLayers.Filter.FeatureId
     * Creates an ogc:FeatureId rule.
     *
     * Parameters:
     * options - {Object} An optional object with properties to set on the
     *           rule
     * 
     * Returns:
     * {<OpenLayers.Filter.FeatureId>}
     */
    initialize: function(options) {
        this.fids = [];
        OpenLayers.Filter.prototype.initialize.apply(this, [options]);
    },

    /**
     * APIMethod: evaluate
     * evaluates this rule for a specific feature
     * 
     * Parameters:
     * feature - {<OpenLayers.Feature>} feature to apply the rule to.
     *           For vector features, the check is run against the fid,
     *           for plain features against the id.
     * 
     * Returns:
     * {Boolean} true if the rule applies, false if it does not
     */
    evaluate: function(feature) {
        for (var i=0, len=this.fids.length; i<len; i++) {
            var fid = feature.fid || feature.id;
            if (fid == this.fids[i]) {
                return true;
            }
        }
        return false;
    },
    
    /**
     * APIMethod: clone
     * Clones this filter.
     * 
     * Returns:
     * {<OpenLayers.Filter.FeatureId>} Clone of this filter.
     */
    clone: function() {
        var filter = new OpenLayers.Filter.FeatureId();
        OpenLayers.Util.extend(filter, this);
        filter.fids = this.fids.slice();
        return filter;
    },
    
    CLASS_NAME: "OpenLayers.Filter.FeatureId"
});
/* ======================================================================
    OpenLayers/Format/WFST/v1.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Format/XML.js
 * @requires OpenLayers/Format/WFST.js
 * @requires OpenLayers/Filter/Spatial.js
 * @requires OpenLayers/Filter/FeatureId.js
 */

/**
 * Class: OpenLayers.Format.WFST.v1
 * Superclass for WFST parsers.
 *
 * Inherits from:
 *  - <OpenLayers.Format.XML>
 */
OpenLayers.Format.WFST.v1 = OpenLayers.Class(OpenLayers.Format.XML, {
    
    /**
     * Property: namespaces
     * {Object} Mapping of namespace aliases to namespace URIs.
     */
    namespaces: {
        xlink: "http://www.w3.org/1999/xlink",
        xsi: "http://www.w3.org/2001/XMLSchema-instance",
        wfs: "http://www.opengis.net/wfs",
        gml: "http://www.opengis.net/gml",
        ogc: "http://www.opengis.net/ogc",
        ows: "http://www.opengis.net/ows",
        xmlns: "http://www.w3.org/2000/xmlns/"
    },
    
    /**
     * Property: defaultPrefix
     */
    defaultPrefix: "wfs",

    /**
     * Property: version
     * {String} WFS version number.
     */
    version: null,

    /**
     * Property: schemaLocation
     * {String} Schema location for a particular minor version.
     */
    schemaLocations: null,
    
    /**
     * APIProperty: srsName
     * {String} URI for spatial reference system.
     */
    srsName: null,

    /**
     * APIProperty: extractAttributes
     * {Boolean} Extract attributes from GML.  Default is true.
     */
    extractAttributes: true,
    
    /**
     * APIProperty: xy
     * {Boolean} Order of the GML coordinate true:(x,y) or false:(y,x)
     * Changing is not recommended, a new Format should be instantiated.
     */ 
    xy: true,

    /**
     * Property: stateName
     * {Object} Maps feature states to node names.
     */
    stateName: null,
    
    /**
     * Constructor: OpenLayers.Format.WFST.v1
     * Instances of this class are not created directly.  Use the
     *     <OpenLayers.Format.WFST.v1_0_0> or <OpenLayers.Format.WFST.v1_1_0>
     *     constructor instead.
     *
     * Parameters:
     * options - {Object} An optional object whose properties will be set on
     *     this instance.
     */
    initialize: function(options) {
        // set state name mapping
        this.stateName = {};
        this.stateName[OpenLayers.State.INSERT] = "wfs:Insert";
        this.stateName[OpenLayers.State.UPDATE] = "wfs:Update";
        this.stateName[OpenLayers.State.DELETE] = "wfs:Delete";
        OpenLayers.Format.XML.prototype.initialize.apply(this, [options]);
    },
    
    /**
     * Method: getSrsName
     */
    getSrsName: function(feature, options) {
        var srsName = options && options.srsName;
        if(!srsName) {
            if(feature && feature.layer) {
                srsName = feature.layer.projection.getCode();
            } else {
                srsName = this.srsName;
            }
        }
        return srsName;
    },

    /**
     * APIMethod: read
     * Parse the response from a transaction.  Because WFS is split into
     *     Transaction requests (create, update, and delete) and GetFeature
     *     requests (read), this method handles parsing of both types of
     *     responses.
     *
     * Parameters:
     * data - {String | Document} The WFST document to read
     * options - {Object} Options for the reader
     *
     * Valid options properties:
     * output - {String} either "features" or "object". The default is
     *     "features", which means that the method will return an array of
     *     features. If set to "object", an object with a "features" property
     *     and other properties read by the parser will be returned.
     *
     * Returns:
     * {Array | Object} Output depending on the output option.
     */
    read: function(data, options) {
        options = options || {};
        OpenLayers.Util.applyDefaults(options, {
            output: "features"
        });
        
        if(typeof data == "string") { 
            data = OpenLayers.Format.XML.prototype.read.apply(this, [data]);
        }
        if(data && data.nodeType == 9) {
            data = data.documentElement;
        }
        var obj = {};
        if(data) {
            this.readNode(data, obj, true);
        }
        if(obj.features && options.output === "features") {
            obj = obj.features;
        }
        return obj;
    },
    
    /**
     * Property: readers
     * Contains public functions, grouped by namespace prefix, that will
     *     be applied when a namespaced node is found matching the function
     *     name.  The function will be applied in the scope of this parser
     *     with two arguments: the node being read and a context object passed
     *     from the parent.
     */
    readers: {
        "wfs": {
            "FeatureCollection": function(node, obj) {
                obj.features = [];
                this.readChildNodes(node, obj);
            }
        }
    },
    
    /**
     * Method: write
     * Given an array of features, write a WFS transaction.  This assumes
     *     the features have a state property that determines the operation
     *     type - insert, update, or delete.
     *
     * Parameters:
     * features - {Array(<OpenLayers.Feature.Vector>)} A list of features. See
     *     below for a more detailed description of the influence of the
     *     feature's *modified* property.
     * options - {Object}
     *
     * feature.modified rules:
     * If a feature has a modified property set, the following checks will be
     * made before a feature's geometry or attribute is included in an Update
     * transaction:
     * - *modified* is not set at all: The geometry and all attributes will be
     *     included.
     * - *modified.geometry* is set (null or a geometry): The geometry will be
     *     included. If *modified.attributes* is not set, all attributes will
     *     be included.
     * - *modified.attributes* is set: Only the attributes set in 
     *     *modified.attributes* will be included.
     *     If *modified.geometry* is not set, the geometry will not be included.
     *
     * Valid options include:
     * - *multi* {Boolean} If set to true, geometries will be casted to
     *   Multi geometries before writing.
     *
     * Returns:
     * {String} A serialized WFS transaction.
     */
    write: function(features, options) {
        var node = this.writeNode("wfs:Transaction", {
            features:features,
            options: options
        });
        var value = this.schemaLocationAttr();
        if(value) {
            this.setAttributeNS(
                node, this.namespaces["xsi"], "xsi:schemaLocation",  value
            );
        }
        return OpenLayers.Format.XML.prototype.write.apply(this, [node]);
    },
    
    /**
     * Property: writers
     * As a compliment to the readers property, this structure contains public
     *     writing functions grouped by namespace alias and named like the
     *     node names they produce.
     */
    writers: {
        "wfs": {
            "GetFeature": function(options) {
                var node = this.createElementNSPlus("wfs:GetFeature", {
                    attributes: {
                        service: "WFS",
                        version: this.version,
                        handle: options && options.handle,
                        outputFormat: options && options.outputFormat,
                        maxFeatures: options && options.maxFeatures,
                        "xsi:schemaLocation": this.schemaLocationAttr(options)
                    }
                });
                if (typeof this.featureType == "string") {
                    this.writeNode("Query", options, node);
                } else {
                    for (var i=0,len = this.featureType.length; i<len; i++) { 
                        options.featureType = this.featureType[i]; 
                        this.writeNode("Query", options, node); 
                    } 
                }
                return node;
            },
            "Transaction": function(obj) {
                obj = obj || {};
                var options = obj.options || {};
                var node = this.createElementNSPlus("wfs:Transaction", {
                    attributes: {
                        service: "WFS",
                        version: this.version,
                        handle: options.handle
                    }
                });
                var i, len;
                var features = obj.features;
                if(features) {
                    // temporarily re-assigning geometry types
                    if (options.multi === true) {
                        OpenLayers.Util.extend(this.geometryTypes, {
                            "OpenLayers.Geometry.Point": "MultiPoint",
                            "OpenLayers.Geometry.LineString": (this.multiCurve === true) ? "MultiCurve": "MultiLineString",
                            "OpenLayers.Geometry.Polygon": (this.multiSurface === true) ? "MultiSurface" : "MultiPolygon"
                        });
                    }
                    var name, feature;
                    for(i=0, len=features.length; i<len; ++i) {
                        feature = features[i];
                        name = this.stateName[feature.state];
                        if(name) {
                            this.writeNode(name, {
                                feature: feature, 
                                options: options
                            }, node);
                        }
                    }
                    // switch back to original geometry types assignment
                    if (options.multi === true) {
                        this.setGeometryTypes();
                    }
                }
                if (options.nativeElements) {
                    for (i=0, len=options.nativeElements.length; i<len; ++i) {
                        this.writeNode("wfs:Native", 
                            options.nativeElements[i], node);
                    }
                }
                return node;
            },
            "Native": function(nativeElement) {
                var node = this.createElementNSPlus("wfs:Native", {
                    attributes: {
                        vendorId: nativeElement.vendorId,
                        safeToIgnore: nativeElement.safeToIgnore
                    },
                    value: nativeElement.value
                });
                return node;
            },
            "Insert": function(obj) {
                var feature = obj.feature;
                var options = obj.options;
                var node = this.createElementNSPlus("wfs:Insert", {
                    attributes: {
                        handle: options && options.handle
                    }
                });
                this.srsName = this.getSrsName(feature);
                this.writeNode("feature:_typeName", feature, node);
                return node;
            },
            "Update": function(obj) {
                var feature = obj.feature;
                var options = obj.options;
                var node = this.createElementNSPlus("wfs:Update", {
                    attributes: {
                        handle: options && options.handle,
                        typeName: (this.featureNS ? this.featurePrefix + ":" : "") +
                            this.featureType
                    }
                });
                if(this.featureNS) {
                    this.setAttributeNS(
                        node, this.namespaces.xmlns,
                        "xmlns:" + this.featurePrefix, this.featureNS
                    );
                }
                
                // add in geometry
                var modified = feature.modified;
                if (this.geometryName !== null && (!modified || modified.geometry !== undefined)) {
                    this.srsName = this.getSrsName(feature);
                    this.writeNode(
                        "Property", {name: this.geometryName, value: feature.geometry}, node
                    );
                }
        
                // add in attributes
                for(var key in feature.attributes) {
                    if(feature.attributes[key] !== undefined &&
                                (!modified || !modified.attributes ||
                                (modified.attributes && (key in modified.attributes)))) {
                        this.writeNode(
                            "Property", {name: key, value: feature.attributes[key]}, node
                        );
                    }
                }
                
                // add feature id filter
                this.writeNode("ogc:Filter", new OpenLayers.Filter.FeatureId({
                    fids: [feature.fid]
                }), node);
        
                return node;
            },
            "Property": function(obj) {
                var node = this.createElementNSPlus("wfs:Property");
                this.writeNode("Name", obj.name, node);
                if(obj.value !== null) {
                    this.writeNode("Value", obj.value, node);
                }
                return node;
            },
            "Name": function(name) {
                return this.createElementNSPlus("wfs:Name", {value: name});
            },
            "Value": function(obj) {
                var node;
                if(obj instanceof OpenLayers.Geometry) {
                    node = this.createElementNSPlus("wfs:Value");
                    var geom = this.writeNode("feature:_geometry", obj).firstChild;
                    node.appendChild(geom);
                } else {
                    node = this.createElementNSPlus("wfs:Value", {value: obj});                
                }
                return node;
            },
            "Delete": function(obj) {
                var feature = obj.feature;
                var options = obj.options;
                var node = this.createElementNSPlus("wfs:Delete", {
                    attributes: {
                        handle: options && options.handle,
                        typeName: (this.featureNS ? this.featurePrefix + ":" : "") +
                            this.featureType
                    }
                });
                if(this.featureNS) {
                    this.setAttributeNS(
                        node, this.namespaces.xmlns,
                        "xmlns:" + this.featurePrefix, this.featureNS
                    );
                }
                this.writeNode("ogc:Filter", new OpenLayers.Filter.FeatureId({
                    fids: [feature.fid]
                }), node);
                return node;
            }
        }
    },

    /**
     * Method: schemaLocationAttr
     * Generate the xsi:schemaLocation attribute value.
     *
     * Returns:
     * {String} The xsi:schemaLocation attribute or undefined if none.
     */
    schemaLocationAttr: function(options) {
        options = OpenLayers.Util.extend({
            featurePrefix: this.featurePrefix,
            schema: this.schema
        }, options);
        var schemaLocations = OpenLayers.Util.extend({}, this.schemaLocations);
        if(options.schema) {
            schemaLocations[options.featurePrefix] = options.schema;
        }
        var parts = [];
        var uri;
        for(var key in schemaLocations) {
            uri = this.namespaces[key];
            if(uri) {
                parts.push(uri + " " + schemaLocations[key]);
            }
        }
        var value = parts.join(" ") || undefined;
        return value;
    },
    
    /**
     * Method: setFilterProperty
     * Set the property of each spatial filter.
     *
     * Parameters:
     * filter - {<OpenLayers.Filter>}
     */
    setFilterProperty: function(filter) {
        if(filter.filters) {
            for(var i=0, len=filter.filters.length; i<len; ++i) {
                OpenLayers.Format.WFST.v1.prototype.setFilterProperty.call(this, filter.filters[i]);
            }
        } else {
            if(filter instanceof OpenLayers.Filter.Spatial && !filter.property) {
                // got a spatial filter without property, so set it
                filter.property = this.geometryName;
            }
        }
    },

    CLASS_NAME: "OpenLayers.Format.WFST.v1" 

});
/* ======================================================================
    OpenLayers/Filter/Logical.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


/**
 * @requires OpenLayers/Filter.js
 */

/**
 * Class: OpenLayers.Filter.Logical
 * This class represents ogc:And, ogc:Or and ogc:Not rules.
 * 
 * Inherits from:
 * - <OpenLayers.Filter>
 */
OpenLayers.Filter.Logical = OpenLayers.Class(OpenLayers.Filter, {

    /**
     * APIProperty: filters
     * {Array(<OpenLayers.Filter>)} Child filters for this filter.
     */
    filters: null, 
     
    /**
     * APIProperty: type
     * {String} type of logical operator. Available types are:
     * - OpenLayers.Filter.Logical.AND = "&&";
     * - OpenLayers.Filter.Logical.OR  = "||";
     * - OpenLayers.Filter.Logical.NOT = "!";
     */
    type: null,

    /** 
     * Constructor: OpenLayers.Filter.Logical
     * Creates a logical filter (And, Or, Not).
     *
     * Parameters:
     * options - {Object} An optional object with properties to set on the
     *     filter.
     * 
     * Returns:
     * {<OpenLayers.Filter.Logical>}
     */
    initialize: function(options) {
        this.filters = [];
        OpenLayers.Filter.prototype.initialize.apply(this, [options]);
    },
    
    /** 
     * APIMethod: destroy
     * Remove reference to child filters.
     */
    destroy: function() {
        this.filters = null;
        OpenLayers.Filter.prototype.destroy.apply(this);
    },

    /**
     * APIMethod: evaluate
     * Evaluates this filter in a specific context.
     * 
     * Parameters:
     * context - {Object} Context to use in evaluating the filter.  A vector
     *     feature may also be provided to evaluate feature attributes in 
     *     comparison filters or geometries in spatial filters.
     * 
     * Returns:
     * {Boolean} The filter applies.
     */
    evaluate: function(context) {
        var i, len;
        switch(this.type) {
            case OpenLayers.Filter.Logical.AND:
                for (i=0, len=this.filters.length; i<len; i++) {
                    if (this.filters[i].evaluate(context) == false) {
                        return false;
                    }
                }
                return true;
                
            case OpenLayers.Filter.Logical.OR:
                for (i=0, len=this.filters.length; i<len; i++) {
                    if (this.filters[i].evaluate(context) == true) {
                        return true;
                    }
                }
                return false;
            
            case OpenLayers.Filter.Logical.NOT:
                return (!this.filters[0].evaluate(context));
        }
        return undefined;
    },
    
    /**
     * APIMethod: clone
     * Clones this filter.
     * 
     * Returns:
     * {<OpenLayers.Filter.Logical>} Clone of this filter.
     */
    clone: function() {
        var filters = [];        
        for(var i=0, len=this.filters.length; i<len; ++i) {
            filters.push(this.filters[i].clone());
        }
        return new OpenLayers.Filter.Logical({
            type: this.type,
            filters: filters
        });
    },
    
    CLASS_NAME: "OpenLayers.Filter.Logical"
});


OpenLayers.Filter.Logical.AND = "&&";
OpenLayers.Filter.Logical.OR  = "||";
OpenLayers.Filter.Logical.NOT = "!";
/* ======================================================================
    OpenLayers/Filter/Comparison.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Filter.js
 */

/**
 * Class: OpenLayers.Filter.Comparison
 * This class represents a comparison filter.
 * 
 * Inherits from:
 * - <OpenLayers.Filter>
 */
OpenLayers.Filter.Comparison = OpenLayers.Class(OpenLayers.Filter, {

    /**
     * APIProperty: type
     * {String} type: type of the comparison. This is one of
     * - OpenLayers.Filter.Comparison.EQUAL_TO                 = "==";
     * - OpenLayers.Filter.Comparison.NOT_EQUAL_TO             = "!=";
     * - OpenLayers.Filter.Comparison.LESS_THAN                = "<";
     * - OpenLayers.Filter.Comparison.GREATER_THAN             = ">";
     * - OpenLayers.Filter.Comparison.LESS_THAN_OR_EQUAL_TO    = "<=";
     * - OpenLayers.Filter.Comparison.GREATER_THAN_OR_EQUAL_TO = ">=";
     * - OpenLayers.Filter.Comparison.BETWEEN                  = "..";
     * - OpenLayers.Filter.Comparison.LIKE                     = "~";
     * - OpenLayers.Filter.Comparison.IS_NULL                  = "NULL";
     */
    type: null,
    
    /**
     * APIProperty: property
     * {String}
     * name of the context property to compare
     */
    property: null,
    
    /**
     * APIProperty: value
     * {Number} or {String}
     * comparison value for binary comparisons. In the case of a String, this
     * can be a combination of text and propertyNames in the form
     * "literal ${propertyName}"
     */
    value: null,
    
    /**
     * Property: matchCase
     * {Boolean} Force case sensitive searches for EQUAL_TO and NOT_EQUAL_TO
     *     comparisons.  The Filter Encoding 1.1 specification added a matchCase
     *     attribute to ogc:PropertyIsEqualTo and ogc:PropertyIsNotEqualTo
     *     elements.  This property will be serialized with those elements only
     *     if using the v1.1.0 filter format. However, when evaluating filters
     *     here, the matchCase property will always be respected (for EQUAL_TO
     *     and NOT_EQUAL_TO).  Default is true. 
     */
    matchCase: true,
    
    /**
     * APIProperty: lowerBoundary
     * {Number} or {String}
     * lower boundary for between comparisons. In the case of a String, this
     * can be a combination of text and propertyNames in the form
     * "literal ${propertyName}"
     */
    lowerBoundary: null,
    
    /**
     * APIProperty: upperBoundary
     * {Number} or {String}
     * upper boundary for between comparisons. In the case of a String, this
     * can be a combination of text and propertyNames in the form
     * "literal ${propertyName}"
     */
    upperBoundary: null,

    /** 
     * Constructor: OpenLayers.Filter.Comparison
     * Creates a comparison rule.
     *
     * Parameters:
     * options - {Object} An optional object with properties to set on the
     *           rule
     * 
     * Returns:
     * {<OpenLayers.Filter.Comparison>}
     */
    initialize: function(options) {
        OpenLayers.Filter.prototype.initialize.apply(this, [options]);
        // since matchCase on PropertyIsLike is not schema compliant, we only
        // want to use this if explicitly asked for
        if (this.type === OpenLayers.Filter.Comparison.LIKE 
            && options.matchCase === undefined) {
                this.matchCase = null;
        }
    },

    /**
     * APIMethod: evaluate
     * Evaluates this filter in a specific context.
     * 
     * Parameters:
     * context - {Object} Context to use in evaluating the filter.  If a vector
     *     feature is provided, the feature.attributes will be used as context.
     * 
     * Returns:
     * {Boolean} The filter applies.
     */
    evaluate: function(context) {
        if (context instanceof OpenLayers.Feature.Vector) {
            context = context.attributes;
        }
        var result = false;
        var got = context[this.property];
        if (got === undefined) {
            return false;
        }
        var exp;
        switch(this.type) {
            case OpenLayers.Filter.Comparison.EQUAL_TO:
                exp = this.value;
                if(!this.matchCase &&
                   typeof got == "string" && typeof exp == "string") {
                    result = (got.toUpperCase() == exp.toUpperCase());
                } else {
                    result = (got == exp);
                }
                break;
            case OpenLayers.Filter.Comparison.NOT_EQUAL_TO:
                exp = this.value;
                if(!this.matchCase &&
                   typeof got == "string" && typeof exp == "string") {
                    result = (got.toUpperCase() != exp.toUpperCase());
                } else {
                    result = (got != exp);
                }
                break;
            case OpenLayers.Filter.Comparison.LESS_THAN:
                result = got < this.value;
                break;
            case OpenLayers.Filter.Comparison.GREATER_THAN:
                result = got > this.value;
                break;
            case OpenLayers.Filter.Comparison.LESS_THAN_OR_EQUAL_TO:
                result = got <= this.value;
                break;
            case OpenLayers.Filter.Comparison.GREATER_THAN_OR_EQUAL_TO:
                result = got >= this.value;
                break;
            case OpenLayers.Filter.Comparison.BETWEEN:
                result = (got >= this.lowerBoundary) &&
                    (got <= this.upperBoundary);
                break;
            case OpenLayers.Filter.Comparison.LIKE:
                var regexp = new RegExp(this.value, "gi");
                result = regexp.test(got);
                break;
            case OpenLayers.Filter.Comparison.IS_NULL:
                result = (got === null);
                break;
        }
        return result;
    },
    
    /**
     * APIMethod: value2regex
     * Converts the value of this rule into a regular expression string,
     * according to the wildcard characters specified. This method has to
     * be called after instantiation of this class, if the value is not a
     * regular expression already.
     * 
     * Parameters:
     * wildCard   - {Char} wildcard character in the above value, default
     *              is "*"
     * singleChar - {Char} single-character wildcard in the above value
     *              default is "."
     * escapeChar - {Char} escape character in the above value, default is
     *              "!"
     * 
     * Returns:
     * {String} regular expression string
     */
    value2regex: function(wildCard, singleChar, escapeChar) {
        if (wildCard == ".") {
            throw new Error("'.' is an unsupported wildCard character for " +
                            "OpenLayers.Filter.Comparison");
        }
        

        // set UMN MapServer defaults for unspecified parameters
        wildCard = wildCard ? wildCard : "*";
        singleChar = singleChar ? singleChar : ".";
        escapeChar = escapeChar ? escapeChar : "!";
        
        this.value = this.value.replace(
                new RegExp("\\"+escapeChar+"(.|$)", "g"), "\\$1");
        this.value = this.value.replace(
                new RegExp("\\"+singleChar, "g"), ".");
        this.value = this.value.replace(
                new RegExp("\\"+wildCard, "g"), ".*");
        this.value = this.value.replace(
                new RegExp("\\\\.\\*", "g"), "\\"+wildCard);
        this.value = this.value.replace(
                new RegExp("\\\\\\.", "g"), "\\"+singleChar);
        
        return this.value;
    },
    
    /**
     * Method: regex2value
     * Convert the value of this rule from a regular expression string into an
     *     ogc literal string using a wildCard of *, a singleChar of ., and an
     *     escape of !.  Leaves the <value> property unmodified.
     * 
     * Returns:
     * {String} A string value.
     */
    regex2value: function() {
        
        var value = this.value;
        
        // replace ! with !!
        value = value.replace(/!/g, "!!");

        // replace \. with !. (watching out for \\.)
        value = value.replace(/(\\)?\\\./g, function($0, $1) {
            return $1 ? $0 : "!.";
        });
        
        // replace \* with #* (watching out for \\*)
        value = value.replace(/(\\)?\\\*/g, function($0, $1) {
            return $1 ? $0 : "!*";
        });
        
        // replace \\ with \
        value = value.replace(/\\\\/g, "\\");

        // convert .* to * (the sequence #.* is not allowed)
        value = value.replace(/\.\*/g, "*");
        
        return value;
    },
    
    /**
     * APIMethod: clone
     * Clones this filter.
     * 
     * Returns:
     * {<OpenLayers.Filter.Comparison>} Clone of this filter.
     */
    clone: function() {
        return OpenLayers.Util.extend(new OpenLayers.Filter.Comparison(), this);
    },
    
    CLASS_NAME: "OpenLayers.Filter.Comparison"
});


OpenLayers.Filter.Comparison.EQUAL_TO                 = "==";
OpenLayers.Filter.Comparison.NOT_EQUAL_TO             = "!=";
OpenLayers.Filter.Comparison.LESS_THAN                = "<";
OpenLayers.Filter.Comparison.GREATER_THAN             = ">";
OpenLayers.Filter.Comparison.LESS_THAN_OR_EQUAL_TO    = "<=";
OpenLayers.Filter.Comparison.GREATER_THAN_OR_EQUAL_TO = ">=";
OpenLayers.Filter.Comparison.BETWEEN                  = "..";
OpenLayers.Filter.Comparison.LIKE                     = "~";
OpenLayers.Filter.Comparison.IS_NULL                  = "NULL";
/* ======================================================================
    OpenLayers/Format/Filter.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Format/XML/VersionedOGC.js
 * @requires OpenLayers/Filter/FeatureId.js
 * @requires OpenLayers/Filter/Logical.js
 * @requires OpenLayers/Filter/Comparison.js
 */

/**
 * Class: OpenLayers.Format.Filter
 * Read/Write ogc:Filter. Create a new instance with the <OpenLayers.Format.Filter>
 *     constructor.
 * 
 * Inherits from:
 *  - <OpenLayers.Format.XML.VersionedOGC>
 */
OpenLayers.Format.Filter = OpenLayers.Class(OpenLayers.Format.XML.VersionedOGC, {
    
    /**
     * APIProperty: defaultVersion
     * {String} Version number to assume if none found.  Default is "1.0.0".
     */
    defaultVersion: "1.0.0",
    
    /**
     * APIMethod: write
     * Write an ogc:Filter given a filter object.
     *
     * Parameters:
     * filter - {<OpenLayers.Filter>} An filter.
     * options - {Object} Optional configuration object.
     *
     * Returns:
     * {Elment} An ogc:Filter element node.
     */
    
    /**
     * APIMethod: read
     * Read and Filter doc and return an object representing the Filter.
     *
     * Parameters:
     * data - {String | DOMElement} Data to read.
     *
     * Returns:
     * {<OpenLayers.Filter>} A filter object.
     */

    CLASS_NAME: "OpenLayers.Format.Filter" 
});
/* ======================================================================
    OpenLayers/Filter/Function.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Filter.js
 */

/**
 * Class: OpenLayers.Filter.Function
 * This class represents a filter function.
 * We are using this class for creation of complex 
 * filters that can contain filter functions as values.
 * Nesting function as other functions parameter is supported.
 * 
 * Inherits from:
 * - <OpenLayers.Filter>
 */
OpenLayers.Filter.Function = OpenLayers.Class(OpenLayers.Filter, {

    /**
     * APIProperty: name
     * {String} Name of the function.
     */
    name: null,
    
    /**
     * APIProperty: params
     * {Array(<OpenLayers.Filter.Function> || String || Number)} Function parameters
     * For now support only other Functions, String or Number
     */
    params: null,  
    
    /** 
     * Constructor: OpenLayers.Filter.Function
     * Creates a filter function.
     *
     * Parameters:
     * options - {Object} An optional object with properties to set on the
     *     function.
     * 
     * Returns:
     * {<OpenLayers.Filter.Function>}
     */

    CLASS_NAME: "OpenLayers.Filter.Function"
});

/* ======================================================================
    OpenLayers/BaseTypes/Date.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/SingleFile.js
 */

/**
 * Namespace: OpenLayers.Date
 * Contains implementations of Date.parse and date.toISOString that match the
 *     ECMAScript 5 specification for parsing RFC 3339 dates.
 *     http://tools.ietf.org/html/rfc3339
 */
OpenLayers.Date = {

    /** 
     * APIProperty: dateRegEx
     * The regex to be used for validating dates. You can provide your own
     * regex for instance for adding support for years before BC. Default
     * value is: /^(?:(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?)?(?:(?:T(\d{1,2}):(\d{2}):(\d{2}(?:\.\d+)?)(Z|(?:[+-]\d{1,2}(?::(\d{2}))?)))|Z)?$/
     */
    dateRegEx: /^(?:(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?)?(?:(?:T(\d{1,2}):(\d{2}):(\d{2}(?:\.\d+)?)(Z|(?:[+-]\d{1,2}(?::(\d{2}))?)))|Z)?$/,

    /**
     * APIMethod: toISOString
     * Generates a string representing a date.  The format of the string follows
     *     the profile of ISO 8601 for date and time on the Internet (see
     *     http://tools.ietf.org/html/rfc3339).  If the toISOString method is
     *     available on the Date prototype, that is used.  The toISOString
     *     method for Date instances is defined in ECMA-262.
     *
     * Parameters:
     * date - {Date} A date object.
     *
     * Returns:
     * {String} A string representing the date (e.g.
     *     "2010-08-07T16:58:23.123Z").  If the date does not have a valid time
     *     (i.e. isNaN(date.getTime())) this method returns the string "Invalid
     *     Date".  The ECMA standard says the toISOString method should throw
     *     RangeError in this case, but Firefox returns a string instead.  For
     *     best results, use isNaN(date.getTime()) to determine date validity
     *     before generating date strings.
     */
    toISOString: (function() {
        if ("toISOString" in Date.prototype) {
            return function(date) {
                return date.toISOString();
            };
        } else {
            return function(date) {
                var str;
                if (isNaN(date.getTime())) {
                    // ECMA-262 says throw RangeError, Firefox returns
                    // "Invalid Date"
                    str = "Invalid Date";
                } else {
                    str =
                        date.getUTCFullYear() + "-" +
                        OpenLayers.Number.zeroPad(date.getUTCMonth() + 1, 2) + "-" +
                        OpenLayers.Number.zeroPad(date.getUTCDate(), 2) + "T" +
                        OpenLayers.Number.zeroPad(date.getUTCHours(), 2) + ":" +
                        OpenLayers.Number.zeroPad(date.getUTCMinutes(), 2) + ":" +
                        OpenLayers.Number.zeroPad(date.getUTCSeconds(), 2) + "." +
                        OpenLayers.Number.zeroPad(date.getUTCMilliseconds(), 3) + "Z";
                }
                return str;
            };
        }

    })(),

    /**
     * APIMethod: parse
     * Generate a date object from a string.  The format for the string follows
     *     the profile of ISO 8601 for date and time on the Internet (see
     *     http://tools.ietf.org/html/rfc3339).  We don't call the native
     *     Date.parse because of inconsistency between implmentations.  In
     *     Chrome, calling Date.parse with a string that doesn't contain any
     *     indication of the timezone (e.g. "2011"), the date is interpreted
     *     in local time.  On Firefox, the assumption is UTC.
     *
     * Parameters:
     * str - {String} A string representing the date (e.g.
     *     "2010", "2010-08", "2010-08-07", "2010-08-07T16:58:23.123Z",
     *     "2010-08-07T11:58:23.123-06").
     *
     * Returns:
     * {Date} A date object.  If the string could not be parsed, an invalid
     *     date is returned (i.e. isNaN(date.getTime())).
     */
    parse: function(str) {
        var date;
        var match = str.match(this.dateRegEx);
        if (match && (match[1] || match[7])) { // must have at least year or time
            var year = parseInt(match[1], 10) || 0;
            var month = (parseInt(match[2], 10) - 1) || 0;
            var day = parseInt(match[3], 10) || 1;
            date = new Date(Date.UTC(year, month, day));
            // optional time
            var type = match[7];
            if (type) {
                var hours = parseInt(match[4], 10);
                var minutes = parseInt(match[5], 10);
                var secFrac = parseFloat(match[6]);
                var seconds = secFrac | 0;
                var milliseconds = Math.round(1000 * (secFrac - seconds));
                date.setUTCHours(hours, minutes, seconds, milliseconds);
                // check offset
                if (type !== "Z") {
                    var hoursOffset = parseInt(type, 10);
                    var minutesOffset = parseInt(match[8], 10) || 0;
                    var offset = -1000 * (60 * (hoursOffset * 60) + minutesOffset * 60);
                    date = new Date(date.getTime() + offset);
                }
            }
        } else {
            date = new Date("invalid");
        }
        return date;
    }
};
/* ======================================================================
    OpenLayers/Format/Filter/v1.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */
/**
 * @requires OpenLayers/Format/Filter.js
 * @requires OpenLayers/Format/XML.js
 * @requires OpenLayers/Filter/Function.js
 * @requires OpenLayers/BaseTypes/Date.js
 */

/**
 * Class: OpenLayers.Format.Filter.v1
 * Superclass for Filter version 1 parsers.
 *
 * Inherits from:
 *  - <OpenLayers.Format.XML>
 */
OpenLayers.Format.Filter.v1 = OpenLayers.Class(OpenLayers.Format.XML, {
    
    /**
     * Property: namespaces
     * {Object} Mapping of namespace aliases to namespace URIs.
     */
    namespaces: {
        ogc: "http://www.opengis.net/ogc",
        gml: "http://www.opengis.net/gml",
        xlink: "http://www.w3.org/1999/xlink",
        xsi: "http://www.w3.org/2001/XMLSchema-instance"
    },

    /**
     * Property: defaultPrefix
     */
    defaultPrefix: "ogc",

    /**
     * Property: schemaLocation
     * {String} Schema location for a particular minor version.
     */
    schemaLocation: null,
    
    /**
     * Constructor: OpenLayers.Format.Filter.v1
     * Instances of this class are not created directly.  Use the
     *     <OpenLayers.Format.Filter> constructor instead.
     *
     * Parameters:
     * options - {Object} An optional object whose properties will be set on
     *     this instance.
     */
    initialize: function(options) {
        OpenLayers.Format.XML.prototype.initialize.apply(this, [options]);
    },
    
    /**
     * Method: read
     *
     * Parameters:
     * data - {DOMElement} A Filter document element.
     *
     * Returns:
     * {<OpenLayers.Filter>} A filter object.
     */
    read: function(data) {
        var obj = {};
        this.readers.ogc["Filter"].apply(this, [data, obj]);
        return obj.filter;
    },
    
    /**
     * Property: readers
     * Contains public functions, grouped by namespace prefix, that will
     *     be applied when a namespaced node is found matching the function
     *     name.  The function will be applied in the scope of this parser
     *     with two arguments: the node being read and a context object passed
     *     from the parent.
     */
    readers: {
        "ogc": {
            "_expression": function(node) {
                // only the simplest of ogc:expression handled
                // "some text and an <PropertyName>attribute</PropertyName>"}
                var obj, value = "";
                for(var child=node.firstChild; child; child=child.nextSibling) {
                    switch(child.nodeType) {
                        case 1:
                            obj = this.readNode(child);
                            if (obj.property) {
                                value += "${" + obj.property + "}";
                            } else if (obj.value !== undefined) {
                                value += obj.value;
                            }
                            break;
                        case 3: // text node
                        case 4: // cdata section
                            value += child.nodeValue;
                    }
                }
                return value;
            },
            "Filter": function(node, parent) {
                // Filters correspond to subclasses of OpenLayers.Filter.
                // Since they contain information we don't persist, we
                // create a temporary object and then pass on the filter
                // (ogc:Filter) to the parent obj.
                var obj = {
                    fids: [],
                    filters: []
                };
                this.readChildNodes(node, obj);
                if(obj.fids.length > 0) {
                    parent.filter = new OpenLayers.Filter.FeatureId({
                        fids: obj.fids
                    });
                } else if(obj.filters.length > 0) {
                    parent.filter = obj.filters[0];
                }
            },
            "FeatureId": function(node, obj) {
                var fid = node.getAttribute("fid");
                if(fid) {
                    obj.fids.push(fid);
                }
            },
            "And": function(node, obj) {
                var filter = new OpenLayers.Filter.Logical({
                    type: OpenLayers.Filter.Logical.AND
                });
                this.readChildNodes(node, filter);
                obj.filters.push(filter);
            },
            "Or": function(node, obj) {
                var filter = new OpenLayers.Filter.Logical({
                    type: OpenLayers.Filter.Logical.OR
                });
                this.readChildNodes(node, filter);
                obj.filters.push(filter);
            },
            "Not": function(node, obj) {
                var filter = new OpenLayers.Filter.Logical({
                    type: OpenLayers.Filter.Logical.NOT
                });
                this.readChildNodes(node, filter);
                obj.filters.push(filter);
            },
            "PropertyIsLessThan": function(node, obj) {
                var filter = new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.LESS_THAN
                });
                this.readChildNodes(node, filter);
                obj.filters.push(filter);
            },
            "PropertyIsGreaterThan": function(node, obj) {
                var filter = new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.GREATER_THAN
                });
                this.readChildNodes(node, filter);
                obj.filters.push(filter);
            },
            "PropertyIsLessThanOrEqualTo": function(node, obj) {
                var filter = new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.LESS_THAN_OR_EQUAL_TO
                });
                this.readChildNodes(node, filter);
                obj.filters.push(filter);
            },
            "PropertyIsGreaterThanOrEqualTo": function(node, obj) {
                var filter = new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.GREATER_THAN_OR_EQUAL_TO
                });
                this.readChildNodes(node, filter);
                obj.filters.push(filter);
            },
            "PropertyIsBetween": function(node, obj) {
                var filter = new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.BETWEEN
                });
                this.readChildNodes(node, filter);
                obj.filters.push(filter);
            },
            "Literal": function(node, obj) {
                obj.value = OpenLayers.String.numericIf(
                    this.getChildValue(node), true);
            },
            "PropertyName": function(node, filter) {
                filter.property = this.getChildValue(node);
            },
            "LowerBoundary": function(node, filter) {
                filter.lowerBoundary = OpenLayers.String.numericIf(
                    this.readers.ogc._expression.call(this, node), true);
            },
            "UpperBoundary": function(node, filter) {
                filter.upperBoundary = OpenLayers.String.numericIf(
                    this.readers.ogc._expression.call(this, node), true);
            },
            "Intersects": function(node, obj) {
                this.readSpatial(node, obj, OpenLayers.Filter.Spatial.INTERSECTS);
            },
            "Within": function(node, obj) {
                this.readSpatial(node, obj, OpenLayers.Filter.Spatial.WITHIN);
            },
            "Contains": function(node, obj) {
                this.readSpatial(node, obj, OpenLayers.Filter.Spatial.CONTAINS);
            },
            "DWithin": function(node, obj) {
                this.readSpatial(node, obj, OpenLayers.Filter.Spatial.DWITHIN);
            },
            "Distance": function(node, obj) {
                obj.distance = parseInt(this.getChildValue(node));
                obj.distanceUnits = node.getAttribute("units");
            },
            "Function": function(node, obj) {
                //TODO write decoder for it
                return;
            },
            "PropertyIsNull": function(node, obj) {
                var filter = new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.IS_NULL
                });
                this.readChildNodes(node, filter);
                obj.filters.push(filter);
            }
        }
    },
    
    /**
     * Method: readSpatial
     *
     * Read a {<OpenLayers.Filter.Spatial>} filter.
     * 
     * Parameters:
     * node - {DOMElement} A DOM element that contains an ogc:expression.
     * obj - {Object} The target object.
     * type - {String} One of the OpenLayers.Filter.Spatial.* constants.
     *
     * Returns:
     * {<OpenLayers.Filter.Spatial>} The created filter.
     */
    readSpatial: function(node, obj, type) {
        var filter = new OpenLayers.Filter.Spatial({
            type: type
        });
        this.readChildNodes(node, filter);
        filter.value = filter.components[0];
        delete filter.components;
        obj.filters.push(filter);
    },

    /**
     * APIMethod: encodeLiteral
     * Generates the string representation of a value for use in <Literal> 
     *     elements.  The default encoder writes Date values as ISO 8601 
     *     strings.
     *
     * Parameters:
     * value - {Object} Literal value to encode
     *
     * Returns:
     * {String} String representation of the provided value.
     */
    encodeLiteral: function(value) {
        if (value instanceof Date) {
            value = OpenLayers.Date.toISOString(value);
        }
        return value;
    },

    /**
     * Method: writeOgcExpression
     * Limited support for writing OGC expressions. Currently it supports
     * (<OpenLayers.Filter.Function> || String || Number)
     *
     * Parameters:
     * value - (<OpenLayers.Filter.Function> || String || Number)
     * node - {DOMElement} A parent DOM element 
     *
     * Returns:
     * {DOMElement} Updated node element.
     */
    writeOgcExpression: function(value, node) {
        if (value instanceof OpenLayers.Filter.Function){
            this.writeNode("Function", value, node);
        } else {
            this.writeNode("Literal", value, node);
        }
        return node;
    },    
    
    /**
     * Method: write
     *
     * Parameters:
     * filter - {<OpenLayers.Filter>} A filter object.
     *
     * Returns:
     * {DOMElement} An ogc:Filter element.
     */
    write: function(filter) {
        return this.writers.ogc["Filter"].apply(this, [filter]);
    },
    
    /**
     * Property: writers
     * As a compliment to the readers property, this structure contains public
     *     writing functions grouped by namespace alias and named like the
     *     node names they produce.
     */
    writers: {
        "ogc": {
            "Filter": function(filter) {
                var node = this.createElementNSPlus("ogc:Filter");
                this.writeNode(this.getFilterType(filter), filter, node);
                return node;
            },
            "_featureIds": function(filter) {
                var node = this.createDocumentFragment();
                for (var i=0, ii=filter.fids.length; i<ii; ++i) {
                    this.writeNode("ogc:FeatureId", filter.fids[i], node);
                }
                return node;
            },
            "FeatureId": function(fid) {
                return this.createElementNSPlus("ogc:FeatureId", {
                    attributes: {fid: fid}
                });
            },
            "And": function(filter) {
                var node = this.createElementNSPlus("ogc:And");
                var childFilter;
                for (var i=0, ii=filter.filters.length; i<ii; ++i) {
                    childFilter = filter.filters[i];
                    this.writeNode(
                        this.getFilterType(childFilter), childFilter, node
                    );
                }
                return node;
            },
            "Or": function(filter) {
                var node = this.createElementNSPlus("ogc:Or");
                var childFilter;
                for (var i=0, ii=filter.filters.length; i<ii; ++i) {
                    childFilter = filter.filters[i];
                    this.writeNode(
                        this.getFilterType(childFilter), childFilter, node
                    );
                }
                return node;
            },
            "Not": function(filter) {
                var node = this.createElementNSPlus("ogc:Not");
                var childFilter = filter.filters[0];
                this.writeNode(
                    this.getFilterType(childFilter), childFilter, node
                );
                return node;
            },
            "PropertyIsLessThan": function(filter) {
                var node = this.createElementNSPlus("ogc:PropertyIsLessThan");
                // no ogc:expression handling for PropertyName for now
                this.writeNode("PropertyName", filter, node);
                // handle Literals or Functions for now
                this.writeOgcExpression(filter.value, node);
                return node;
            },
            "PropertyIsGreaterThan": function(filter) {
                var node = this.createElementNSPlus("ogc:PropertyIsGreaterThan");
                // no ogc:expression handling for PropertyName for now
                this.writeNode("PropertyName", filter, node);
                // handle Literals or Functions for now
                this.writeOgcExpression(filter.value, node);
                return node;
            },
            "PropertyIsLessThanOrEqualTo": function(filter) {
                var node = this.createElementNSPlus("ogc:PropertyIsLessThanOrEqualTo");
                // no ogc:expression handling for PropertyName for now
                this.writeNode("PropertyName", filter, node);
                // handle Literals or Functions for now
                this.writeOgcExpression(filter.value, node);
                return node;
            },
            "PropertyIsGreaterThanOrEqualTo": function(filter) {
                var node = this.createElementNSPlus("ogc:PropertyIsGreaterThanOrEqualTo");
                // no ogc:expression handling for PropertyName for now
                this.writeNode("PropertyName", filter, node);
                // handle Literals or Functions for now
                this.writeOgcExpression(filter.value, node);
                return node;
            },
            "PropertyIsBetween": function(filter) {
                var node = this.createElementNSPlus("ogc:PropertyIsBetween");
                // no ogc:expression handling for PropertyName for now
                this.writeNode("PropertyName", filter, node);
                this.writeNode("LowerBoundary", filter, node);
                this.writeNode("UpperBoundary", filter, node);
                return node;
            },
            "PropertyName": function(filter) {
                // no ogc:expression handling for now
                return this.createElementNSPlus("ogc:PropertyName", {
                    value: filter.property
                });
            },
            "Literal": function(value) {
                var encode = this.encodeLiteral ||
                    OpenLayers.Format.Filter.v1.prototype.encodeLiteral;
                return this.createElementNSPlus("ogc:Literal", {
                    value: encode(value)
                });
            },
            "LowerBoundary": function(filter) {
                // handle Literals or Functions for now
                var node = this.createElementNSPlus("ogc:LowerBoundary");
                this.writeOgcExpression(filter.lowerBoundary, node);
                return node;
            },
            "UpperBoundary": function(filter) {
                // handle Literals or Functions for now
                var node = this.createElementNSPlus("ogc:UpperBoundary");
                this.writeNode("Literal", filter.upperBoundary, node);
                return node;
            },
            "INTERSECTS": function(filter) {
                return this.writeSpatial(filter, "Intersects");
            },
            "WITHIN": function(filter) {
                return this.writeSpatial(filter, "Within");
            },
            "CONTAINS": function(filter) {
                return this.writeSpatial(filter, "Contains");
            },
            "DWITHIN": function(filter) {
                var node = this.writeSpatial(filter, "DWithin");
                this.writeNode("Distance", filter, node);
                return node;
            },
            "Distance": function(filter) {
                return this.createElementNSPlus("ogc:Distance", {
                    attributes: {
                        units: filter.distanceUnits
                    },
                    value: filter.distance
                });
            },
            "Function": function(filter) {
                var node = this.createElementNSPlus("ogc:Function", {
                    attributes: {
                        name: filter.name
                    }
                });
                var params = filter.params;
                for(var i=0, len=params.length; i<len; i++){
                    this.writeOgcExpression(params[i], node);
                }
                return node;
            },
            "PropertyIsNull": function(filter) {
                var node = this.createElementNSPlus("ogc:PropertyIsNull");
                this.writeNode("PropertyName", filter, node);
                return node;
            }
        }
    },

    /**
     * Method: getFilterType
     */
    getFilterType: function(filter) {
        var filterType = this.filterMap[filter.type];
        if(!filterType) {
            throw "Filter writing not supported for rule type: " + filter.type;
        }
        return filterType;
    },
    
    /**
     * Property: filterMap
     * {Object} Contains a member for each filter type.  Values are node names
     *     for corresponding OGC Filter child elements.
     */
    filterMap: {
        "&&": "And",
        "||": "Or",
        "!": "Not",
        "==": "PropertyIsEqualTo",
        "!=": "PropertyIsNotEqualTo",
        "<": "PropertyIsLessThan",
        ">": "PropertyIsGreaterThan",
        "<=": "PropertyIsLessThanOrEqualTo",
        ">=": "PropertyIsGreaterThanOrEqualTo",
        "..": "PropertyIsBetween",
        "~": "PropertyIsLike",
        "NULL": "PropertyIsNull",
        "BBOX": "BBOX",
        "DWITHIN": "DWITHIN",
        "WITHIN": "WITHIN",
        "CONTAINS": "CONTAINS",
        "INTERSECTS": "INTERSECTS",
        "FID": "_featureIds"
    },

    CLASS_NAME: "OpenLayers.Format.Filter.v1" 

});
/* ======================================================================
    OpenLayers/Geometry/MultiLineString.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Geometry/Collection.js
 * @requires OpenLayers/Geometry/LineString.js
 */

/**
 * Class: OpenLayers.Geometry.MultiLineString
 * A MultiLineString is a geometry with multiple <OpenLayers.Geometry.LineString>
 * components.
 * 
 * Inherits from:
 *  - <OpenLayers.Geometry.Collection>
 *  - <OpenLayers.Geometry> 
 */
OpenLayers.Geometry.MultiLineString = OpenLayers.Class(
  OpenLayers.Geometry.Collection, {

    /**
     * Property: componentTypes
     * {Array(String)} An array of class names representing the types of
     * components that the collection can include.  A null value means the
     * component types are not restricted.
     */
    componentTypes: ["OpenLayers.Geometry.LineString"],

    /**
     * Constructor: OpenLayers.Geometry.MultiLineString
     * Constructor for a MultiLineString Geometry.
     *
     * Parameters: 
     * components - {Array(<OpenLayers.Geometry.LineString>)} 
     *
     */
    
    /**
     * Method: split
     * Use this geometry (the source) to attempt to split a target geometry.
     * 
     * Parameters:
     * geometry - {<OpenLayers.Geometry>} The target geometry.
     * options - {Object} Properties of this object will be used to determine
     *     how the split is conducted.
     *
     * Valid options:
     * mutual - {Boolean} Split the source geometry in addition to the target
     *     geometry.  Default is false.
     * edge - {Boolean} Allow splitting when only edges intersect.  Default is
     *     true.  If false, a vertex on the source must be within the tolerance
     *     distance of the intersection to be considered a split.
     * tolerance - {Number} If a non-null value is provided, intersections
     *     within the tolerance distance of an existing vertex on the source
     *     will be assumed to occur at the vertex.
     * 
     * Returns:
     * {Array} A list of geometries (of this same type as the target) that
     *     result from splitting the target with the source geometry.  The
     *     source and target geometry will remain unmodified.  If no split
     *     results, null will be returned.  If mutual is true and a split
     *     results, return will be an array of two arrays - the first will be
     *     all geometries that result from splitting the source geometry and
     *     the second will be all geometries that result from splitting the
     *     target geometry.
     */
    split: function(geometry, options) {
        var results = null;
        var mutual = options && options.mutual;
        var splits, sourceLine, sourceLines, sourceSplit, targetSplit;
        var sourceParts = [];
        var targetParts = [geometry];
        for(var i=0, len=this.components.length; i<len; ++i) {
            sourceLine = this.components[i];
            sourceSplit = false;
            for(var j=0; j < targetParts.length; ++j) { 
                splits = sourceLine.split(targetParts[j], options);
                if(splits) {
                    if(mutual) {
                        sourceLines = splits[0];
                        for(var k=0, klen=sourceLines.length; k<klen; ++k) {
                            if(k===0 && sourceParts.length) {
                                sourceParts[sourceParts.length-1].addComponent(
                                    sourceLines[k]
                                );
                            } else {
                                sourceParts.push(
                                    new OpenLayers.Geometry.MultiLineString([
                                        sourceLines[k]
                                    ])
                                );
                            }
                        }
                        sourceSplit = true;
                        splits = splits[1];
                    }
                    if(splits.length) {
                        // splice in new target parts
                        splits.unshift(j, 1);
                        Array.prototype.splice.apply(targetParts, splits);
                        break;
                    }
                }
            }
            if(!sourceSplit) {
                // source line was not hit
                if(sourceParts.length) {
                    // add line to existing multi
                    sourceParts[sourceParts.length-1].addComponent(
                        sourceLine.clone()
                    );
                } else {
                    // create a fresh multi
                    sourceParts = [
                        new OpenLayers.Geometry.MultiLineString(
                            sourceLine.clone()
                        )
                    ];
                }
            }
        }
        if(sourceParts && sourceParts.length > 1) {
            sourceSplit = true;
        } else {
            sourceParts = [];
        }
        if(targetParts && targetParts.length > 1) {
            targetSplit = true;
        } else {
            targetParts = [];
        }
        if(sourceSplit || targetSplit) {
            if(mutual) {
                results = [sourceParts, targetParts];
            } else {
                results = targetParts;
            }
        }
        return results;
    },
    
    /**
     * Method: splitWith
     * Split this geometry (the target) with the given geometry (the source).
     *
     * Parameters:
     * geometry - {<OpenLayers.Geometry>} A geometry used to split this
     *     geometry (the source).
     * options - {Object} Properties of this object will be used to determine
     *     how the split is conducted.
     *
     * Valid options:
     * mutual - {Boolean} Split the source geometry in addition to the target
     *     geometry.  Default is false.
     * edge - {Boolean} Allow splitting when only edges intersect.  Default is
     *     true.  If false, a vertex on the source must be within the tolerance
     *     distance of the intersection to be considered a split.
     * tolerance - {Number} If a non-null value is provided, intersections
     *     within the tolerance distance of an existing vertex on the source
     *     will be assumed to occur at the vertex.
     * 
     * Returns:
     * {Array} A list of geometries (of this same type as the target) that
     *     result from splitting the target with the source geometry.  The
     *     source and target geometry will remain unmodified.  If no split
     *     results, null will be returned.  If mutual is true and a split
     *     results, return will be an array of two arrays - the first will be
     *     all geometries that result from splitting the source geometry and
     *     the second will be all geometries that result from splitting the
     *     target geometry.
     */
    splitWith: function(geometry, options) {
        var results = null;
        var mutual = options && options.mutual;
        var splits, targetLine, sourceLines, sourceSplit, targetSplit, sourceParts, targetParts;
        if(geometry instanceof OpenLayers.Geometry.LineString) {
            targetParts = [];
            sourceParts = [geometry];
            for(var i=0, len=this.components.length; i<len; ++i) {
                targetSplit = false;
                targetLine = this.components[i];
                for(var j=0; j<sourceParts.length; ++j) {
                    splits = sourceParts[j].split(targetLine, options);
                    if(splits) {
                        if(mutual) {
                            sourceLines = splits[0];
                            if(sourceLines.length) {
                                // splice in new source parts
                                sourceLines.unshift(j, 1);
                                Array.prototype.splice.apply(sourceParts, sourceLines);
                                j += sourceLines.length - 2;
                            }
                            splits = splits[1];
                            if(splits.length === 0) {
                                splits = [targetLine.clone()];
                            }
                        }
                        for(var k=0, klen=splits.length; k<klen; ++k) {
                            if(k===0 && targetParts.length) {
                                targetParts[targetParts.length-1].addComponent(
                                    splits[k]
                                );
                            } else {
                                targetParts.push(
                                    new OpenLayers.Geometry.MultiLineString([
                                        splits[k]
                                    ])
                                );
                            }
                        }
                        targetSplit = true;                    
                    }
                }
                if(!targetSplit) {
                    // target component was not hit
                    if(targetParts.length) {
                        // add it to any existing multi-line
                        targetParts[targetParts.length-1].addComponent(
                            targetLine.clone()
                        );
                    } else {
                        // or start with a fresh multi-line
                        targetParts = [
                            new OpenLayers.Geometry.MultiLineString([
                                targetLine.clone()
                            ])
                        ];
                    }
                    
                }
            }
        } else {
            results = geometry.split(this);
        }
        if(sourceParts && sourceParts.length > 1) {
            sourceSplit = true;
        } else {
            sourceParts = [];
        }
        if(targetParts && targetParts.length > 1) {
            targetSplit = true;
        } else {
            targetParts = [];
        }
        if(sourceSplit || targetSplit) {
            if(mutual) {
                results = [sourceParts, targetParts];
            } else {
                results = targetParts;
            }
        }
        return results;
    },

    CLASS_NAME: "OpenLayers.Geometry.MultiLineString"
});
/* ======================================================================
    OpenLayers/Geometry/MultiPolygon.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Geometry/Collection.js
 * @requires OpenLayers/Geometry/Polygon.js
 */

/**
 * Class: OpenLayers.Geometry.MultiPolygon
 * MultiPolygon is a geometry with multiple <OpenLayers.Geometry.Polygon>
 * components.  Create a new instance with the <OpenLayers.Geometry.MultiPolygon>
 * constructor.
 * 
 * Inherits from:
 *  - <OpenLayers.Geometry.Collection>
 */
OpenLayers.Geometry.MultiPolygon = OpenLayers.Class(
  OpenLayers.Geometry.Collection, {

    /**
     * Property: componentTypes
     * {Array(String)} An array of class names representing the types of
     * components that the collection can include.  A null value means the
     * component types are not restricted.
     */
    componentTypes: ["OpenLayers.Geometry.Polygon"],

    /**
     * Constructor: OpenLayers.Geometry.MultiPolygon
     * Create a new MultiPolygon geometry
     *
     * Parameters:
     * components - {Array(<OpenLayers.Geometry.Polygon>)} An array of polygons
     *              used to generate the MultiPolygon
     *
     */

    CLASS_NAME: "OpenLayers.Geometry.MultiPolygon"
});
/* ======================================================================
    OpenLayers/Format/GML.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Format/XML.js
 * @requires OpenLayers/Feature/Vector.js
 * @requires OpenLayers/Geometry/Point.js
 * @requires OpenLayers/Geometry/MultiPoint.js
 * @requires OpenLayers/Geometry/LineString.js
 * @requires OpenLayers/Geometry/MultiLineString.js
 * @requires OpenLayers/Geometry/Polygon.js
 * @requires OpenLayers/Geometry/MultiPolygon.js
 */

/**
 * Class: OpenLayers.Format.GML
 * Read/Write GML. Create a new instance with the <OpenLayers.Format.GML>
 *     constructor.  Supports the GML simple features profile.
 * 
 * Inherits from:
 *  - <OpenLayers.Format.XML>
 */
OpenLayers.Format.GML = OpenLayers.Class(OpenLayers.Format.XML, {
    
    /**
     * APIProperty: featureNS
     * {String} Namespace used for feature attributes.  Default is
     *     "http://mapserver.gis.umn.edu/mapserver".
     */
    featureNS: "http://mapserver.gis.umn.edu/mapserver",
    
    /**
     * APIProperty: featurePrefix
     * {String} Namespace alias (or prefix) for feature nodes.  Default is
     *     "feature".
     */
    featurePrefix: "feature",
    
    /**
     * APIProperty: featureName
     * {String} Element name for features. Default is "featureMember".
     */
    featureName: "featureMember", 
    
    /**
     * APIProperty: layerName
     * {String} Name of data layer. Default is "features".
     */
    layerName: "features",
    
    /**
     * APIProperty: geometryName
     * {String} Name of geometry element.  Defaults to "geometry".
     */
    geometryName: "geometry",
    
    /** 
     * APIProperty: collectionName
     * {String} Name of featureCollection element.
     */
    collectionName: "FeatureCollection",
    
    /**
     * APIProperty: gmlns
     * {String} GML Namespace.
     */
    gmlns: "http://www.opengis.net/gml",

    /**
     * APIProperty: extractAttributes
     * {Boolean} Extract attributes from GML.
     */
    extractAttributes: true,
    
    /**
     * APIProperty: xy
     * {Boolean} Order of the GML coordinate true:(x,y) or false:(y,x)
     * Changing is not recommended, a new Format should be instantiated.
     */ 
    xy: true,
    
    /**
     * Constructor: OpenLayers.Format.GML
     * Create a new parser for GML.
     *
     * Parameters:
     * options - {Object} An optional object whose properties will be set on
     *     this instance.
     */
    initialize: function(options) {
        // compile regular expressions once instead of every time they are used
        this.regExes = {
            trimSpace: (/^\s*|\s*$/g),
            removeSpace: (/\s*/g),
            splitSpace: (/\s+/),
            trimComma: (/\s*,\s*/g)
        };
        OpenLayers.Format.XML.prototype.initialize.apply(this, [options]);
    },

    /**
     * APIMethod: read
     * Read data from a string, and return a list of features. 
     * 
     * Parameters:
     * data - {String} or {DOMElement} data to read/parse.
     *
     * Returns:
     * {Array(<OpenLayers.Feature.Vector>)} An array of features.
     */
    read: function(data) {
        if(typeof data == "string") { 
            data = OpenLayers.Format.XML.prototype.read.apply(this, [data]);
        }
        var featureNodes = this.getElementsByTagNameNS(data.documentElement,
                                                       this.gmlns,
                                                       this.featureName);
        var features = [];
        for(var i=0; i<featureNodes.length; i++) {
            var feature = this.parseFeature(featureNodes[i]);
            if(feature) {
                features.push(feature);
            }
        }
        return features;
    },
    
    /**
     * Method: parseFeature
     * This function is the core of the GML parsing code in OpenLayers.
     *    It creates the geometries that are then attached to the returned
     *    feature, and calls parseAttributes() to get attribute data out.
     *    
     * Parameters:
     * node - {DOMElement} A GML feature node. 
     */
    parseFeature: function(node) {
        // only accept one geometry per feature - look for highest "order"
        var order = ["MultiPolygon", "Polygon",
                     "MultiLineString", "LineString",
                     "MultiPoint", "Point", "Envelope"];
        // FIXME: In case we parse a feature with no geometry, but boundedBy an Envelope,
        // this code creates a geometry derived from the Envelope. This is not correct.
        var type, nodeList, geometry, parser;
        for(var i=0; i<order.length; ++i) {
            type = order[i];
            nodeList = this.getElementsByTagNameNS(node, this.gmlns, type);
            if(nodeList.length > 0) {
                // only deal with first geometry of this type
                parser = this.parseGeometry[type.toLowerCase()];
                if(parser) {
                    geometry = parser.apply(this, [nodeList[0]]);
                    if (this.internalProjection && this.externalProjection) {
                        geometry.transform(this.externalProjection, 
                                           this.internalProjection); 
                    }                       
                } else {
                    throw new TypeError("Unsupported geometry type: " + type);
                }
                // stop looking for different geometry types
                break;
            }
        }

        var bounds;
        var boxNodes = this.getElementsByTagNameNS(node, this.gmlns, "Box");
        for(i=0; i<boxNodes.length; ++i) {
            var boxNode = boxNodes[i];
            var box = this.parseGeometry["box"].apply(this, [boxNode]);
            var parentNode = boxNode.parentNode;
            var parentName = parentNode.localName ||
                             parentNode.nodeName.split(":").pop();
            if(parentName === "boundedBy") {
                bounds = box;
            } else {
                geometry = box.toGeometry();
            }
        }
        
        // construct feature (optionally with attributes)
        var attributes;
        if(this.extractAttributes) {
            attributes = this.parseAttributes(node);
        }
        var feature = new OpenLayers.Feature.Vector(geometry, attributes);
        feature.bounds = bounds;
        
        var firstChild = this.getFirstElementChild(node);
        feature.gml = {
            featureType: firstChild.nodeName.split(":")[1],
            featureNS: firstChild.namespaceURI,
            featureNSPrefix: firstChild.prefix
        };
        feature.type = feature.gml.featureType;
                
        // assign fid - this can come from a "fid" or "id" attribute
        var childNode = node.firstChild;
        var fid;
        while(childNode) {
            if(childNode.nodeType == 1) {
                fid = childNode.getAttribute("fid") ||
                      childNode.getAttribute("id");
                if(fid) {
                    break;
                }
            }
            childNode = childNode.nextSibling;
        }
        feature.fid = fid;
        return feature;
    },
    
    /**
     * Property: parseGeometry
     * Properties of this object are the functions that parse geometries based
     *     on their type.
     */
    parseGeometry: {
        
        /**
         * Method: parseGeometry.point
         * Given a GML node representing a point geometry, create an OpenLayers
         *     point geometry.
         *
         * Parameters:
         * node - {DOMElement} A GML node.
         *
         * Returns:
         * {<OpenLayers.Geometry.Point>} A point geometry.
         */
        point: function(node) {
            /**
             * Three coordinate variations to consider:
             * 1) <gml:pos>x y z</gml:pos>
             * 2) <gml:coordinates>x, y, z</gml:coordinates>
             * 3) <gml:coord><gml:X>x</gml:X><gml:Y>y</gml:Y></gml:coord>
             */
            var nodeList, coordString;
            var coords = [];

            // look for <gml:pos>
            var nodeList = this.getElementsByTagNameNS(node, this.gmlns, "pos");
            if(nodeList.length > 0) {
                coordString = nodeList[0].firstChild.nodeValue;
                coordString = coordString.replace(this.regExes.trimSpace, "");
                coords = coordString.split(this.regExes.splitSpace);
            }

            // look for <gml:coordinates>
            if(coords.length == 0) {
                nodeList = this.getElementsByTagNameNS(node, this.gmlns,
                                                       "coordinates");
                if(nodeList.length > 0) {
                    coordString = nodeList[0].firstChild.nodeValue;
                    coordString = coordString.replace(this.regExes.removeSpace,
                                                      "");
                    coords = coordString.split(",");
                }
            }

            // look for <gml:coord>
            if(coords.length == 0) {
                nodeList = this.getElementsByTagNameNS(node, this.gmlns,
                                                       "coord");
                if(nodeList.length > 0) {
                    var xList = this.getElementsByTagNameNS(nodeList[0],
                                                            this.gmlns, "X");
                    var yList = this.getElementsByTagNameNS(nodeList[0],
                                                            this.gmlns, "Y");
                    if(xList.length > 0 && yList.length > 0) {
                        coords = [xList[0].firstChild.nodeValue,
                                  yList[0].firstChild.nodeValue];
                    }
                }
            }
                
            // preserve third dimension
            if(coords.length == 2) {
                coords[2] = null;
            }
            
            if (this.xy) {
                return new OpenLayers.Geometry.Point(coords[0], coords[1],
                                                 coords[2]);
            }
            else{
                return new OpenLayers.Geometry.Point(coords[1], coords[0],
                                                 coords[2]);
            }
        },
        
        /**
         * Method: parseGeometry.multipoint
         * Given a GML node representing a multipoint geometry, create an
         *     OpenLayers multipoint geometry.
         *
         * Parameters:
         * node - {DOMElement} A GML node.
         *
         * Returns:
         * {<OpenLayers.Geometry.MultiPoint>} A multipoint geometry.
         */
        multipoint: function(node) {
            var nodeList = this.getElementsByTagNameNS(node, this.gmlns,
                                                       "Point");
            var components = [];
            if(nodeList.length > 0) {
                var point;
                for(var i=0; i<nodeList.length; ++i) {
                    point = this.parseGeometry.point.apply(this, [nodeList[i]]);
                    if(point) {
                        components.push(point);
                    }
                }
            }
            return new OpenLayers.Geometry.MultiPoint(components);
        },
        
        /**
         * Method: parseGeometry.linestring
         * Given a GML node representing a linestring geometry, create an
         *     OpenLayers linestring geometry.
         *
         * Parameters:
         * node - {DOMElement} A GML node.
         *
         * Returns:
         * {<OpenLayers.Geometry.LineString>} A linestring geometry.
         */
        linestring: function(node, ring) {
            /**
             * Two coordinate variations to consider:
             * 1) <gml:posList dimension="d">x0 y0 z0 x1 y1 z1</gml:posList>
             * 2) <gml:coordinates>x0, y0, z0 x1, y1, z1</gml:coordinates>
             */
            var nodeList, coordString;
            var coords = [];
            var points = [];

            // look for <gml:posList>
            nodeList = this.getElementsByTagNameNS(node, this.gmlns, "posList");
            if(nodeList.length > 0) {
                coordString = this.getChildValue(nodeList[0]);
                coordString = coordString.replace(this.regExes.trimSpace, "");
                coords = coordString.split(this.regExes.splitSpace);
                var dim = parseInt(nodeList[0].getAttribute("dimension"));
                var j, x, y, z;
                for(var i=0; i<coords.length/dim; ++i) {
                    j = i * dim;
                    x = coords[j];
                    y = coords[j+1];
                    z = (dim == 2) ? null : coords[j+2];
                    if (this.xy) {
                        points.push(new OpenLayers.Geometry.Point(x, y, z));
                    } else {
                        points.push(new OpenLayers.Geometry.Point(y, x, z));
                    }
                }
            }

            // look for <gml:coordinates>
            if(coords.length == 0) {
                nodeList = this.getElementsByTagNameNS(node, this.gmlns,
                                                       "coordinates");
                if(nodeList.length > 0) {
                    coordString = this.getChildValue(nodeList[0]);
                    coordString = coordString.replace(this.regExes.trimSpace,
                                                      "");
                    coordString = coordString.replace(this.regExes.trimComma,
                                                      ",");
                    var pointList = coordString.split(this.regExes.splitSpace);
                    for(var i=0; i<pointList.length; ++i) {
                        coords = pointList[i].split(",");
                        if(coords.length == 2) {
                            coords[2] = null;
                        }
                        if (this.xy) {
                            points.push(new OpenLayers.Geometry.Point(coords[0],
                                                                  coords[1],
                                                                  coords[2]));
                        } else {
                            points.push(new OpenLayers.Geometry.Point(coords[1],
                                                                  coords[0],
                                                                  coords[2]));
                        }
                    }
                }
            }

            var line = null;
            if(points.length != 0) {
                if(ring) {
                    line = new OpenLayers.Geometry.LinearRing(points);
                } else {
                    line = new OpenLayers.Geometry.LineString(points);
                }
            }
            return line;
        },
        
        /**
         * Method: parseGeometry.multilinestring
         * Given a GML node representing a multilinestring geometry, create an
         *     OpenLayers multilinestring geometry.
         *
         * Parameters:
         * node - {DOMElement} A GML node.
         *
         * Returns:
         * {<OpenLayers.Geometry.MultiLineString>} A multilinestring geometry.
         */
        multilinestring: function(node) {
            var nodeList = this.getElementsByTagNameNS(node, this.gmlns,
                                                       "LineString");
            var components = [];
            if(nodeList.length > 0) {
                var line;
                for(var i=0; i<nodeList.length; ++i) {
                    line = this.parseGeometry.linestring.apply(this,
                                                               [nodeList[i]]);
                    if(line) {
                        components.push(line);
                    }
                }
            }
            return new OpenLayers.Geometry.MultiLineString(components);
        },
        
        /**
         * Method: parseGeometry.polygon
         * Given a GML node representing a polygon geometry, create an
         *     OpenLayers polygon geometry.
         *
         * Parameters:
         * node - {DOMElement} A GML node.
         *
         * Returns:
         * {<OpenLayers.Geometry.Polygon>} A polygon geometry.
         */
        polygon: function(node) {
            var nodeList = this.getElementsByTagNameNS(node, this.gmlns,
                                                       "LinearRing");
            var components = [];
            if(nodeList.length > 0) {
                // this assumes exterior ring first, inner rings after
                var ring;
                for(var i=0; i<nodeList.length; ++i) {
                    ring = this.parseGeometry.linestring.apply(this,
                                                        [nodeList[i], true]);
                    if(ring) {
                        components.push(ring);
                    }
                }
            }
            return new OpenLayers.Geometry.Polygon(components);
        },
        
        /**
         * Method: parseGeometry.multipolygon
         * Given a GML node representing a multipolygon geometry, create an
         *     OpenLayers multipolygon geometry.
         *
         * Parameters:
         * node - {DOMElement} A GML node.
         *
         * Returns:
         * {<OpenLayers.Geometry.MultiPolygon>} A multipolygon geometry.
         */
        multipolygon: function(node) {
            var nodeList = this.getElementsByTagNameNS(node, this.gmlns,
                                                       "Polygon");
            var components = [];
            if(nodeList.length > 0) {
                var polygon;
                for(var i=0; i<nodeList.length; ++i) {
                    polygon = this.parseGeometry.polygon.apply(this,
                                                               [nodeList[i]]);
                    if(polygon) {
                        components.push(polygon);
                    }
                }
            }
            return new OpenLayers.Geometry.MultiPolygon(components);
        },
        
        envelope: function(node) {
            var components = [];
            var coordString;
            var envelope;
            
            var lpoint = this.getElementsByTagNameNS(node, this.gmlns, "lowerCorner");
            if (lpoint.length > 0) {
                var coords = [];
                
                if(lpoint.length > 0) {
                    coordString = lpoint[0].firstChild.nodeValue;
                    coordString = coordString.replace(this.regExes.trimSpace, "");
                    coords = coordString.split(this.regExes.splitSpace);
                }
                
                if(coords.length == 2) {
                    coords[2] = null;
                }
                if (this.xy) {
                    var lowerPoint = new OpenLayers.Geometry.Point(coords[0], coords[1],coords[2]);
                } else {
                    var lowerPoint = new OpenLayers.Geometry.Point(coords[1], coords[0],coords[2]);
                }
            }
            
            var upoint = this.getElementsByTagNameNS(node, this.gmlns, "upperCorner");
            if (upoint.length > 0) {
                var coords = [];
                
                if(upoint.length > 0) {
                    coordString = upoint[0].firstChild.nodeValue;
                    coordString = coordString.replace(this.regExes.trimSpace, "");
                    coords = coordString.split(this.regExes.splitSpace);
                }
                
                if(coords.length == 2) {
                    coords[2] = null;
                }
                if (this.xy) {
                    var upperPoint = new OpenLayers.Geometry.Point(coords[0], coords[1],coords[2]);
                } else {
                    var upperPoint = new OpenLayers.Geometry.Point(coords[1], coords[0],coords[2]);
                }
            }
            
            if (lowerPoint && upperPoint) {
                components.push(new OpenLayers.Geometry.Point(lowerPoint.x, lowerPoint.y));
                components.push(new OpenLayers.Geometry.Point(upperPoint.x, lowerPoint.y));
                components.push(new OpenLayers.Geometry.Point(upperPoint.x, upperPoint.y));
                components.push(new OpenLayers.Geometry.Point(lowerPoint.x, upperPoint.y));
                components.push(new OpenLayers.Geometry.Point(lowerPoint.x, lowerPoint.y));
                
                var ring = new OpenLayers.Geometry.LinearRing(components);
                envelope = new OpenLayers.Geometry.Polygon([ring]);
            }
            return envelope; 
        },

        /**
         * Method: parseGeometry.box
         * Given a GML node representing a box geometry, create an
         *     OpenLayers.Bounds.
         *
         * Parameters:
         * node - {DOMElement} A GML node.
         *
         * Returns:
         * {<OpenLayers.Bounds>} A bounds representing the box.
         */
        box: function(node) {
            var nodeList = this.getElementsByTagNameNS(node, this.gmlns,
                                                   "coordinates");
            var coordString;
            var coords, beginPoint = null, endPoint = null;
            if (nodeList.length > 0) {
                coordString = nodeList[0].firstChild.nodeValue;
                coords = coordString.split(" ");
                if (coords.length == 2) {
                    beginPoint = coords[0].split(",");
                    endPoint = coords[1].split(",");
                }
            }
            if (beginPoint !== null && endPoint !== null) {
                return new OpenLayers.Bounds(parseFloat(beginPoint[0]),
                    parseFloat(beginPoint[1]),
                    parseFloat(endPoint[0]),
                    parseFloat(endPoint[1]) );
            }
        }
        
    },
    
    /**
     * Method: parseAttributes
     *
     * Parameters:
     * node - {DOMElement}
     *
     * Returns:
     * {Object} An attributes object.
     */
    parseAttributes: function(node) {
        var attributes = {};
        // assume attributes are children of the first type 1 child
        var childNode = node.firstChild;
        var children, i, child, grandchildren, grandchild, name, value;
        while(childNode) {
            if(childNode.nodeType == 1) {
                // attributes are type 1 children with one type 3 child
                children = childNode.childNodes;
                for(i=0; i<children.length; ++i) {
                    child = children[i];
                    if(child.nodeType == 1) {
                        grandchildren = child.childNodes;
                        if(grandchildren.length == 1) {
                            grandchild = grandchildren[0];
                            if(grandchild.nodeType == 3 ||
                               grandchild.nodeType == 4) {
                                name = (child.prefix) ?
                                        child.nodeName.split(":")[1] :
                                        child.nodeName;
                                value = grandchild.nodeValue.replace(
                                                this.regExes.trimSpace, "");
                                attributes[name] = value;
                            }
                        } else {
                            // If child has no childNodes (grandchildren),
                            // set an attribute with null value.
                            // e.g. <prefix:fieldname/> becomes
                            // {fieldname: null}
                            attributes[child.nodeName.split(":").pop()] = null;
                        }
                    }
                }
                break;
            }
            childNode = childNode.nextSibling;
        }
        return attributes;
    },
    
    /**
     * APIMethod: write
     * Generate a GML document string given a list of features. 
     * 
     * Parameters:
     * features - {Array(<OpenLayers.Feature.Vector>)} List of features to
     *     serialize into a string.
     *
     * Returns:
     * {String} A string representing the GML document.
     */
    write: function(features) {
        if(!(OpenLayers.Util.isArray(features))) {
            features = [features];
        }
        var gml = this.createElementNS("http://www.opengis.net/wfs",
                                       "wfs:" + this.collectionName);
        for(var i=0; i<features.length; i++) {
            gml.appendChild(this.createFeatureXML(features[i]));
        }
        return OpenLayers.Format.XML.prototype.write.apply(this, [gml]);
    },

    /** 
     * Method: createFeatureXML
     * Accept an OpenLayers.Feature.Vector, and build a GML node for it.
     *
     * Parameters:
     * feature - {<OpenLayers.Feature.Vector>} The feature to be built as GML.
     *
     * Returns:
     * {DOMElement} A node reprensting the feature in GML.
     */
    createFeatureXML: function(feature) {
        var geometry = feature.geometry;
        var geometryNode = this.buildGeometryNode(geometry);
        var geomContainer = this.createElementNS(this.featureNS,
                                                 this.featurePrefix + ":" +
                                                 this.geometryName);
        geomContainer.appendChild(geometryNode);
        var featureNode = this.createElementNS(this.gmlns,
                                               "gml:" + this.featureName);
        var featureContainer = this.createElementNS(this.featureNS,
                                                    this.featurePrefix + ":" +
                                                    this.layerName);
        var fid = feature.fid || feature.id;
        featureContainer.setAttribute("fid", fid);
        featureContainer.appendChild(geomContainer);
        for(var attr in feature.attributes) {
            var attrText = this.createTextNode(feature.attributes[attr]); 
            var nodename = attr.substring(attr.lastIndexOf(":") + 1);
            var attrContainer = this.createElementNS(this.featureNS,
                                                     this.featurePrefix + ":" +
                                                     nodename);
            attrContainer.appendChild(attrText);
            featureContainer.appendChild(attrContainer);
        }    
        featureNode.appendChild(featureContainer);
        return featureNode;
    },
    
    /**
     * APIMethod: buildGeometryNode
     */
    buildGeometryNode: function(geometry) {
        if (this.externalProjection && this.internalProjection) {
            geometry = geometry.clone();
            geometry.transform(this.internalProjection, 
                               this.externalProjection);
        }    
        var className = geometry.CLASS_NAME;
        var type = className.substring(className.lastIndexOf(".") + 1);
        var builder = this.buildGeometry[type.toLowerCase()];
        return builder.apply(this, [geometry]);
    },

    /**
     * Property: buildGeometry
     * Object containing methods to do the actual geometry node building
     *     based on geometry type.
     */
    buildGeometry: {
        // TBD retrieve the srs from layer
        // srsName is non-standard, so not including it until it's right.
        // gml.setAttribute("srsName",
        //                  "http://www.opengis.net/gml/srs/epsg.xml#4326");

        /**
         * Method: buildGeometry.point
         * Given an OpenLayers point geometry, create a GML point.
         *
         * Parameters:
         * geometry - {<OpenLayers.Geometry.Point>} A point geometry.
         *
         * Returns:
         * {DOMElement} A GML point node.
         */
        point: function(geometry) {
            var gml = this.createElementNS(this.gmlns, "gml:Point");
            gml.appendChild(this.buildCoordinatesNode(geometry));
            return gml;
        },
        
        /**
         * Method: buildGeometry.multipoint
         * Given an OpenLayers multipoint geometry, create a GML multipoint.
         *
         * Parameters:
         * geometry - {<OpenLayers.Geometry.MultiPoint>} A multipoint geometry.
         *
         * Returns:
         * {DOMElement} A GML multipoint node.
         */
        multipoint: function(geometry) {
            var gml = this.createElementNS(this.gmlns, "gml:MultiPoint");
            var points = geometry.components;
            var pointMember, pointGeom;
            for(var i=0; i<points.length; i++) { 
                pointMember = this.createElementNS(this.gmlns,
                                                   "gml:pointMember");
                pointGeom = this.buildGeometry.point.apply(this,
                                                               [points[i]]);
                pointMember.appendChild(pointGeom);
                gml.appendChild(pointMember);
            }
            return gml;            
        },
        
        /**
         * Method: buildGeometry.linestring
         * Given an OpenLayers linestring geometry, create a GML linestring.
         *
         * Parameters:
         * geometry - {<OpenLayers.Geometry.LineString>} A linestring geometry.
         *
         * Returns:
         * {DOMElement} A GML linestring node.
         */
        linestring: function(geometry) {
            var gml = this.createElementNS(this.gmlns, "gml:LineString");
            gml.appendChild(this.buildCoordinatesNode(geometry));
            return gml;
        },
        
        /**
         * Method: buildGeometry.multilinestring
         * Given an OpenLayers multilinestring geometry, create a GML
         *     multilinestring.
         *
         * Parameters:
         * geometry - {<OpenLayers.Geometry.MultiLineString>} A multilinestring
         *     geometry.
         *
         * Returns:
         * {DOMElement} A GML multilinestring node.
         */
        multilinestring: function(geometry) {
            var gml = this.createElementNS(this.gmlns, "gml:MultiLineString");
            var lines = geometry.components;
            var lineMember, lineGeom;
            for(var i=0; i<lines.length; ++i) {
                lineMember = this.createElementNS(this.gmlns,
                                                  "gml:lineStringMember");
                lineGeom = this.buildGeometry.linestring.apply(this,
                                                                   [lines[i]]);
                lineMember.appendChild(lineGeom);
                gml.appendChild(lineMember);
            }
            return gml;
        },
        
        /**
         * Method: buildGeometry.linearring
         * Given an OpenLayers linearring geometry, create a GML linearring.
         *
         * Parameters:
         * geometry - {<OpenLayers.Geometry.LinearRing>} A linearring geometry.
         *
         * Returns:
         * {DOMElement} A GML linearring node.
         */
        linearring: function(geometry) {
            var gml = this.createElementNS(this.gmlns, "gml:LinearRing");
            gml.appendChild(this.buildCoordinatesNode(geometry));
            return gml;
        },
        
        /**
         * Method: buildGeometry.polygon
         * Given an OpenLayers polygon geometry, create a GML polygon.
         *
         * Parameters:
         * geometry - {<OpenLayers.Geometry.Polygon>} A polygon geometry.
         *
         * Returns:
         * {DOMElement} A GML polygon node.
         */
        polygon: function(geometry) {
            var gml = this.createElementNS(this.gmlns, "gml:Polygon");
            var rings = geometry.components;
            var ringMember, ringGeom, type;
            for(var i=0; i<rings.length; ++i) {
                type = (i==0) ? "outerBoundaryIs" : "innerBoundaryIs";
                ringMember = this.createElementNS(this.gmlns,
                                                  "gml:" + type);
                ringGeom = this.buildGeometry.linearring.apply(this,
                                                                   [rings[i]]);
                ringMember.appendChild(ringGeom);
                gml.appendChild(ringMember);
            }
            return gml;
        },
        
        /**
         * Method: buildGeometry.multipolygon
         * Given an OpenLayers multipolygon geometry, create a GML multipolygon.
         *
         * Parameters:
         * geometry - {<OpenLayers.Geometry.MultiPolygon>} A multipolygon
         *     geometry.
         *
         * Returns:
         * {DOMElement} A GML multipolygon node.
         */
        multipolygon: function(geometry) {
            var gml = this.createElementNS(this.gmlns, "gml:MultiPolygon");
            var polys = geometry.components;
            var polyMember, polyGeom;
            for(var i=0; i<polys.length; ++i) {
                polyMember = this.createElementNS(this.gmlns,
                                                  "gml:polygonMember");
                polyGeom = this.buildGeometry.polygon.apply(this,
                                                                [polys[i]]);
                polyMember.appendChild(polyGeom);
                gml.appendChild(polyMember);
            }
            return gml;

        },
 
        /**
         * Method: buildGeometry.bounds
         * Given an OpenLayers bounds, create a GML box.
         *
         * Parameters:
         * bounds - {<OpenLayers.Geometry.Bounds>} A bounds object.
         *
         * Returns:
         * {DOMElement} A GML box node.
         */
        bounds: function(bounds) {
            var gml = this.createElementNS(this.gmlns, "gml:Box");
            gml.appendChild(this.buildCoordinatesNode(bounds));
            return gml;
        }
    },

    /**
     * Method: buildCoordinates
     * builds the coordinates XmlNode
     * (code)
     * <gml:coordinates decimal="." cs="," ts=" ">...</gml:coordinates>
     * (end)
     *
     * Parameters: 
     * geometry - {<OpenLayers.Geometry>} 
     *
     * Returns:
     * {XmlNode} created xmlNode
     */
    buildCoordinatesNode: function(geometry) {
        var coordinatesNode = this.createElementNS(this.gmlns,
                                                   "gml:coordinates");
        coordinatesNode.setAttribute("decimal", ".");
        coordinatesNode.setAttribute("cs", ",");
        coordinatesNode.setAttribute("ts", " ");

        var parts = [];

        if(geometry instanceof OpenLayers.Bounds){
            parts.push(geometry.left + "," + geometry.bottom);
            parts.push(geometry.right + "," + geometry.top);
        } else {
            var points = (geometry.components) ? geometry.components : [geometry];
            for(var i=0; i<points.length; i++) {
                parts.push(points[i].x + "," + points[i].y);                
            }            
        }

        var txtNode = this.createTextNode(parts.join(" "));
        coordinatesNode.appendChild(txtNode);
        
        return coordinatesNode;
    },

    CLASS_NAME: "OpenLayers.Format.GML" 
});
/* ======================================================================
    OpenLayers/Format/GML/Base.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Format/XML.js
 * @requires OpenLayers/Format/GML.js
 */

/**
 * Though required in the full build, if the GML format is excluded, we set
 * the namespace here.
 */
if(!OpenLayers.Format.GML) {
    OpenLayers.Format.GML = {};
}

/**
 * Class: OpenLayers.Format.GML.Base
 * Superclass for GML parsers.
 *
 * Inherits from:
 *  - <OpenLayers.Format.XML>
 */
OpenLayers.Format.GML.Base = OpenLayers.Class(OpenLayers.Format.XML, {
    
    /**
     * Property: namespaces
     * {Object} Mapping of namespace aliases to namespace URIs.
     */
    namespaces: {
        gml: "http://www.opengis.net/gml",
        xlink: "http://www.w3.org/1999/xlink",
        xsi: "http://www.w3.org/2001/XMLSchema-instance",
        wfs: "http://www.opengis.net/wfs" // this is a convenience for reading wfs:FeatureCollection
    },
    
    /**
     * Property: defaultPrefix
     */
    defaultPrefix: "gml",

    /**
     * Property: schemaLocation
     * {String} Schema location for a particular minor version.
     */
    schemaLocation: null,
    
    /**
     * APIProperty: featureType
     * {Array(String) or String} The local (without prefix) feature typeName(s).
     */
    featureType: null,
    
    /**
     * APIProperty: featureNS
     * {String} The feature namespace.  Must be set in the options at
     *     construction.
     */
    featureNS: null,

    /**
     * APIProperty: featurePrefix
     * {String} Namespace alias (or prefix) for feature nodes.  Default is
     *     "feature".
     */
    featurePrefix: "feature",

    /**
     * APIProperty: geometry
     * {String} Name of geometry element.  Defaults to "geometry". If null, it
     * will be set on <read> when the first geometry is parsed.
     */
    geometryName: "geometry",

    /**
     * APIProperty: extractAttributes
     * {Boolean} Extract attributes from GML.  Default is true.
     */
    extractAttributes: true,
    
    /**
     * APIProperty: srsName
     * {String} URI for spatial reference system.  This is optional for
     *     single part geometries and mandatory for collections and multis.
     *     If set, the srsName attribute will be written for all geometries.
     *     Default is null.
     */
    srsName: null,

    /**
     * APIProperty: xy
     * {Boolean} Order of the GML coordinate true:(x,y) or false:(y,x)
     * Changing is not recommended, a new Format should be instantiated.
     */ 
    xy: true,

    /**
     * Property: geometryTypes
     * {Object} Maps OpenLayers geometry class names to GML element names.
     *     Use <setGeometryTypes> before accessing this property.
     */
    geometryTypes: null,

    /**
     * Property: singleFeatureType
     * {Boolean} True if there is only 1 featureType, and not an array
     *     of featuretypes.
     */
    singleFeatureType: null,
    
    /**
     * Property: autoConfig
     * {Boolean} Indicates if the format was configured without a <featureNS>,
     * but auto-configured <featureNS> and <featureType> during read.
     * Subclasses making use of <featureType> auto-configuration should make
     * the first call to the <readNode> method (usually in the read method)
     * with true as 3rd argument, so the auto-configured featureType can be
     * reset and the format can be reused for subsequent reads with data from
     * different featureTypes. Set to false after read if you want to keep the
     * auto-configured values.
     */

    /**
     * Property: regExes
     * Compiled regular expressions for manipulating strings.
     */
    regExes: {
        trimSpace: (/^\s*|\s*$/g),
        removeSpace: (/\s*/g),
        splitSpace: (/\s+/),
        trimComma: (/\s*,\s*/g),
        featureMember: (/^(.*:)?featureMembers?$/)
    },

    /**
     * Constructor: OpenLayers.Format.GML.Base
     * Instances of this class are not created directly.  Use the
     *     <OpenLayers.Format.GML.v2> or <OpenLayers.Format.GML.v3> constructor
     *     instead.
     *
     * Parameters:
     * options - {Object} An optional object whose properties will be set on
     *     this instance.
     *
     * Valid options properties:
     * featureType - {Array(String) or String} Local (without prefix) feature 
     *     typeName(s) (required for write).
     * featureNS - {String} Feature namespace (required for write).
     * geometryName - {String} Geometry element name (required for write).
     */
    initialize: function(options) {
        OpenLayers.Format.XML.prototype.initialize.apply(this, [options]);
        this.setGeometryTypes();
        if(options && options.featureNS) {
            this.setNamespace(this.featurePrefix, options.featureNS);
        }
        this.singleFeatureType = !options || (typeof options.featureType === "string");
    },
    
    /**
     * Method: read
     *
     * Parameters:
     * data - {DOMElement} A gml:featureMember element, a gml:featureMembers
     *     element, or an element containing either of the above at any level.
     *
     * Returns:
     * {Array(<OpenLayers.Feature.Vector>)} An array of features.
     */
    read: function(data) {
        if(typeof data == "string") { 
            data = OpenLayers.Format.XML.prototype.read.apply(this, [data]);
        }
        if(data && data.nodeType == 9) {
            data = data.documentElement;
        }
        var features = [];
        this.readNode(data, {features: features}, true);
        if(features.length == 0) {
            // look for gml:featureMember elements
            var elements = this.getElementsByTagNameNS(
                data, this.namespaces.gml, "featureMember"
            );
            if(elements.length) {
                for(var i=0, len=elements.length; i<len; ++i) {
                    this.readNode(elements[i], {features: features}, true);
                }
            } else {
                // look for gml:featureMembers elements (this is v3, but does no harm here)
                var elements = this.getElementsByTagNameNS(
                    data, this.namespaces.gml, "featureMembers"
                );
                if(elements.length) {
                    // there can be only one
                    this.readNode(elements[0], {features: features}, true);
                }
            }
        }
        return features;
    },
    
    /**
     * Method: readNode
     * Shorthand for applying one of the named readers given the node
     *     namespace and local name.  Readers take two args (node, obj) and
     *     generally extend or modify the second.
     *
     * Parameters:
     * node - {DOMElement} The node to be read (required).
     * obj - {Object} The object to be modified (optional).
     * first - {Boolean} Should be set to true for the first node read. This
     *     is usually the readNode call in the read method. Without this being
     *     set, auto-configured properties will stick on subsequent reads.
     *
     * Returns:
     * {Object} The input object, modified (or a new one if none was provided).
     */
    readNode: function(node, obj, first) {
        // on subsequent calls of format.read(), we want to reset auto-
        // configured properties and auto-configure again.
        if (first === true && this.autoConfig === true) {
            this.featureType = null;
            delete this.namespaceAlias[this.featureNS];
            delete this.namespaces["feature"];
            this.featureNS = null;
        }
        // featureType auto-configuration
        if (!this.featureNS && (!(node.prefix in this.namespaces) &&
                node.parentNode.namespaceURI == this.namespaces["gml"] &&
                this.regExes.featureMember.test(node.parentNode.nodeName))) {
            this.featureType = node.nodeName.split(":").pop();
            this.setNamespace("feature", node.namespaceURI);
            this.featureNS = node.namespaceURI;
            this.autoConfig = true;
        }
        return OpenLayers.Format.XML.prototype.readNode.apply(this, [node, obj]);
    },
    
    /**
     * Property: readers
     * Contains public functions, grouped by namespace prefix, that will
     *     be applied when a namespaced node is found matching the function
     *     name.  The function will be applied in the scope of this parser
     *     with two arguments: the node being read and a context object passed
     *     from the parent.
     */
    readers: {
        "gml": {
            "_inherit": function(node, obj, container) {
                // To be implemented by version specific parsers
            },
            "featureMember": function(node, obj) {
                this.readChildNodes(node, obj);
            },
            "featureMembers": function(node, obj) {
                this.readChildNodes(node, obj);                
            },
            "name": function(node, obj) {
                obj.name = this.getChildValue(node);
            },
            "boundedBy": function(node, obj) {
                var container = {};
                this.readChildNodes(node, container);
                if(container.components && container.components.length > 0) {
                    obj.bounds = container.components[0];
                }
            },
            "Point": function(node, container) {
                var obj = {points: []};
                this.readChildNodes(node, obj);
                if(!container.components) {
                    container.components = [];
                }
                container.components.push(obj.points[0]);
            },
            "coordinates": function(node, obj) {
                var str = this.getChildValue(node).replace(
                    this.regExes.trimSpace, ""
                );
                str = str.replace(this.regExes.trimComma, ",");
                var pointList = str.split(this.regExes.splitSpace);
                var coords;
                var numPoints = pointList.length;
                var points = new Array(numPoints);
                for(var i=0; i<numPoints; ++i) {
                    coords = pointList[i].split(",");
                    if (this.xy) {
                        points[i] = new OpenLayers.Geometry.Point(
                            coords[0], coords[1], coords[2]
                        );
                    } else {
                        points[i] = new OpenLayers.Geometry.Point(
                            coords[1], coords[0], coords[2]
                        );
                    }
                }
                obj.points = points;
            },
            "coord": function(node, obj) {
                var coord = {};
                this.readChildNodes(node, coord);
                if(!obj.points) {
                    obj.points = [];
                }
                obj.points.push(new OpenLayers.Geometry.Point(
                    coord.x, coord.y, coord.z
                ));
            },
            "X": function(node, coord) {
                coord.x = this.getChildValue(node);
            },
            "Y": function(node, coord) {
                coord.y = this.getChildValue(node);
            },
            "Z": function(node, coord) {
                coord.z = this.getChildValue(node);
            },
            "MultiPoint": function(node, container) {
                var obj = {components: []};
                this.readers.gml._inherit.apply(this, [node, obj, container]);
                this.readChildNodes(node, obj);
                container.components = [
                    new OpenLayers.Geometry.MultiPoint(obj.components)
                ];
            },
            "pointMember": function(node, obj) {
                this.readChildNodes(node, obj);
            },
            "LineString": function(node, container) {
                var obj = {};
                this.readers.gml._inherit.apply(this, [node, obj, container]);
                this.readChildNodes(node, obj);
                if(!container.components) {
                    container.components = [];
                }
                container.components.push(
                    new OpenLayers.Geometry.LineString(obj.points)
                );
            },
            "MultiLineString": function(node, container) {
                var obj = {components: []};
                this.readers.gml._inherit.apply(this, [node, obj, container]);
                this.readChildNodes(node, obj);
                container.components = [
                    new OpenLayers.Geometry.MultiLineString(obj.components)
                ];
            },
            "lineStringMember": function(node, obj) {
                this.readChildNodes(node, obj);
            },
            "Polygon": function(node, container) {
                var obj = {outer: null, inner: []};
                this.readers.gml._inherit.apply(this, [node, obj, container]);
                this.readChildNodes(node, obj);
                obj.inner.unshift(obj.outer);
                if(!container.components) {
                    container.components = [];
                }
                container.components.push(
                    new OpenLayers.Geometry.Polygon(obj.inner)
                );
            },
            "LinearRing": function(node, obj) {
                var container = {};
                this.readers.gml._inherit.apply(this, [node, container]);
                this.readChildNodes(node, container);
                obj.components = [new OpenLayers.Geometry.LinearRing(
                    container.points
                )];
            },
            "MultiPolygon": function(node, container) {
                var obj = {components: []};
                this.readers.gml._inherit.apply(this, [node, obj, container]);
                this.readChildNodes(node, obj);
                container.components = [
                    new OpenLayers.Geometry.MultiPolygon(obj.components)
                ];
            },
            "polygonMember": function(node, obj) {
                this.readChildNodes(node, obj);
            },
            "GeometryCollection": function(node, container) {
                var obj = {components: []};
                this.readers.gml._inherit.apply(this, [node, obj, container]);
                this.readChildNodes(node, obj);
                container.components = [
                    new OpenLayers.Geometry.Collection(obj.components)
                ];
            },
            "geometryMember": function(node, obj) {
                this.readChildNodes(node, obj);
            }
        },
        "feature": {
            "*": function(node, obj) {
                // The node can either be named like the featureType, or it
                // can be a child of the feature:featureType.  Children can be
                // geometry or attributes.
                var name;
                var local = node.localName || node.nodeName.split(":").pop();
                // Since an attribute can have the same name as the feature type
                // we only want to read the node as a feature if the parent
                // node can have feature nodes as children.  In this case, the
                // obj.features property is set.
                if (obj.features) {
                    if (!this.singleFeatureType &&
                        (OpenLayers.Util.indexOf(this.featureType, local) !== -1)) {
                        name = "_typeName";
                    } else if(local === this.featureType) {
                        name = "_typeName";
                    }
                } else {
                    // Assume attribute elements have one child node and that the child
                    // is a text node.  Otherwise assume it is a geometry node.
                    if(node.childNodes.length == 0 ||
                       (node.childNodes.length == 1 && node.firstChild.nodeType == 3)) {
                        if(this.extractAttributes) {
                            name = "_attribute";
                        }
                    } else {
                        name = "_geometry";
                    }
                }
                if(name) {
                    this.readers.feature[name].apply(this, [node, obj]);
                }
            },
            "_typeName": function(node, obj) {
                var container = {components: [], attributes: {}};
                this.readChildNodes(node, container);
                // look for common gml namespaced elements
                if(container.name) {
                    container.attributes.name = container.name;
                }
                var feature = new OpenLayers.Feature.Vector(
                    container.components[0], container.attributes
                );
                if (!this.singleFeatureType) {
                    feature.type = node.nodeName.split(":").pop();
                    feature.namespace = node.namespaceURI;
                }
                var fid = node.getAttribute("fid") ||
                    this.getAttributeNS(node, this.namespaces["gml"], "id");
                if(fid) {
                    feature.fid = fid;
                }
                if(this.internalProjection && this.externalProjection &&
                   feature.geometry) {
                    feature.geometry.transform(
                        this.externalProjection, this.internalProjection
                    );
                }
                if(container.bounds) {
                    feature.bounds = container.bounds;
                }
                obj.features.push(feature);
            },
            "_geometry": function(node, obj) {
                if (!this.geometryName) {
                    this.geometryName = node.nodeName.split(":").pop();
                }
                this.readChildNodes(node, obj);
            },
            "_attribute": function(node, obj) {
                var local = node.localName || node.nodeName.split(":").pop();
                var value = this.getChildValue(node);
                obj.attributes[local] = value;
            }
        },
        "wfs": {
            "FeatureCollection": function(node, obj) {
                this.readChildNodes(node, obj);
            }
        }
    },
    
    /**
     * Method: write
     *
     * Parameters:
     * features - {Array(<OpenLayers.Feature.Vector>) | OpenLayers.Feature.Vector}
     *     An array of features or a single feature.
     *
     * Returns:
     * {String} Given an array of features, a doc with a gml:featureMembers
     *     element will be returned.  Given a single feature, a doc with a
     *     gml:featureMember element will be returned.
     */
    write: function(features) {
        var name;
        if(OpenLayers.Util.isArray(features)) {
            name = "featureMembers";
        } else {
            name = "featureMember";
        }
        var root = this.writeNode("gml:" + name, features);
        this.setAttributeNS(
            root, this.namespaces["xsi"],
            "xsi:schemaLocation", this.schemaLocation
        );

        return OpenLayers.Format.XML.prototype.write.apply(this, [root]);
    },
    
    /**
     * Property: writers
     * As a compliment to the readers property, this structure contains public
     *     writing functions grouped by namespace alias and named like the
     *     node names they produce.
     */
    writers: {
        "gml": {
            "featureMember": function(feature) {
                var node = this.createElementNSPlus("gml:featureMember");
                this.writeNode("feature:_typeName", feature, node);
                return node;
            },
            "MultiPoint": function(geometry) {
                var node = this.createElementNSPlus("gml:MultiPoint");
                var components = geometry.components || [geometry];
                for(var i=0, ii=components.length; i<ii; ++i) {
                    this.writeNode("pointMember", components[i], node);
                }
                return node;
            },
            "pointMember": function(geometry) {
                var node = this.createElementNSPlus("gml:pointMember");
                this.writeNode("Point", geometry, node);
                return node;
            },
            "MultiLineString": function(geometry) {
                var node = this.createElementNSPlus("gml:MultiLineString");
                var components = geometry.components || [geometry];
                for(var i=0, ii=components.length; i<ii; ++i) {
                    this.writeNode("lineStringMember", components[i], node);
                }
                return node;
            },
            "lineStringMember": function(geometry) {
                var node = this.createElementNSPlus("gml:lineStringMember");
                this.writeNode("LineString", geometry, node);
                return node;
            },
            "MultiPolygon": function(geometry) {
                var node = this.createElementNSPlus("gml:MultiPolygon");
                var components = geometry.components || [geometry];
                for(var i=0, ii=components.length; i<ii; ++i) {
                    this.writeNode(
                        "polygonMember", components[i], node
                    );
                }
                return node;
            },
            "polygonMember": function(geometry) {
                var node = this.createElementNSPlus("gml:polygonMember");
                this.writeNode("Polygon", geometry, node);
                return node;
            },
            "GeometryCollection": function(geometry) {
                var node = this.createElementNSPlus("gml:GeometryCollection");
                for(var i=0, len=geometry.components.length; i<len; ++i) {
                    this.writeNode("geometryMember", geometry.components[i], node);
                }
                return node;
            },
            "geometryMember": function(geometry) {
                var node = this.createElementNSPlus("gml:geometryMember");
                var child = this.writeNode("feature:_geometry", geometry);
                node.appendChild(child.firstChild);
                return node;
            }
        },
        "feature": {
            "_typeName": function(feature) {
                var node = this.createElementNSPlus(this.featurePrefix + ":" + this.featureType, {
                    attributes: {fid: feature.fid}
                });
                if(feature.geometry) {
                    this.writeNode("feature:_geometry", feature.geometry, node);
                }
                for(var name in feature.attributes) {
                    var value = feature.attributes[name];
                    if(value != null) {
                        this.writeNode(
                            "feature:_attribute",
                            {name: name, value: value}, node
                        );
                    }
                }
                return node;
            },
            "_geometry": function(geometry) {
                if(this.externalProjection && this.internalProjection) {
                    geometry = geometry.clone().transform(
                        this.internalProjection, this.externalProjection
                    );
                }    
                var node = this.createElementNSPlus(
                    this.featurePrefix + ":" + this.geometryName
                );
                var type = this.geometryTypes[geometry.CLASS_NAME];
                var child = this.writeNode("gml:" + type, geometry, node);
                if(this.srsName) {
                    child.setAttribute("srsName", this.srsName);
                }
                return node;
            },
            "_attribute": function(obj) {
                return this.createElementNSPlus(this.featurePrefix + ":" + obj.name, {
                    value: obj.value
                });
            }
        },
        "wfs": {
            "FeatureCollection": function(features) {
                /**
                 * This is only here because GML2 only describes abstract
                 * feature collections.  Typically, you would not be using
                 * the GML format to write wfs elements.  This just provides
                 * some way to write out lists of features.  GML3 defines the
                 * featureMembers element, so that is used by default instead.
                 */
                var node = this.createElementNSPlus("wfs:FeatureCollection");
                for(var i=0, len=features.length; i<len; ++i) {
                    this.writeNode("gml:featureMember", features[i], node);
                }
                return node;
            }
        }
    },
    
    /**
     * Method: setGeometryTypes
     * Sets the <geometryTypes> mapping.
     */
    setGeometryTypes: function() {
        this.geometryTypes = {
            "OpenLayers.Geometry.Point": "Point",
            "OpenLayers.Geometry.MultiPoint": "MultiPoint",
            "OpenLayers.Geometry.LineString": "LineString",
            "OpenLayers.Geometry.MultiLineString": "MultiLineString",
            "OpenLayers.Geometry.Polygon": "Polygon",
            "OpenLayers.Geometry.MultiPolygon": "MultiPolygon",
            "OpenLayers.Geometry.Collection": "GeometryCollection"
        };
    },

    CLASS_NAME: "OpenLayers.Format.GML.Base" 

});
/* ======================================================================
    OpenLayers/Format/GML/v3.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Format/GML/Base.js
 */

/**
 * Class: OpenLayers.Format.GML.v3
 * Parses GML version 3.
 *
 * Inherits from:
 *  - <OpenLayers.Format.GML.Base>
 */
OpenLayers.Format.GML.v3 = OpenLayers.Class(OpenLayers.Format.GML.Base, {
    
    /**
     * Property: schemaLocation
     * {String} Schema location for a particular minor version.  The writers
     *     conform with the Simple Features Profile for GML.
     */
    schemaLocation: "http://www.opengis.net/gml http://schemas.opengis.net/gml/3.1.1/profiles/gmlsfProfile/1.0.0/gmlsf.xsd",

    /**
     * Property: curve
     * {Boolean} Write gml:Curve instead of gml:LineString elements.  This also
     *     affects the elements in multi-part geometries.  Default is false.
     *     To write gml:Curve elements instead of gml:LineString, set curve
     *     to true in the options to the contstructor (cannot be changed after
     *     instantiation).
     */
    curve: false,
    
    /**
     * Property: multiCurve
     * {Boolean} Write gml:MultiCurve instead of gml:MultiLineString.  Since
     *     the latter is deprecated in GML 3, the default is true.  To write
     *     gml:MultiLineString instead of gml:MultiCurve, set multiCurve to
     *     false in the options to the constructor (cannot be changed after
     *     instantiation).
     */
    multiCurve: true,
    
    /**
     * Property: surface
     * {Boolean} Write gml:Surface instead of gml:Polygon elements.  This also
     *     affects the elements in multi-part geometries.  Default is false.
     *     To write gml:Surface elements instead of gml:Polygon, set surface
     *     to true in the options to the contstructor (cannot be changed after
     *     instantiation).
     */
    surface: false,

    /**
     * Property: multiSurface
     * {Boolean} Write gml:multiSurface instead of gml:MultiPolygon.  Since
     *     the latter is deprecated in GML 3, the default is true.  To write
     *     gml:MultiPolygon instead of gml:multiSurface, set multiSurface to
     *     false in the options to the constructor (cannot be changed after
     *     instantiation).
     */
    multiSurface: true,

    /**
     * Constructor: OpenLayers.Format.GML.v3
     * Create a parser for GML v3.
     *
     * Parameters:
     * options - {Object} An optional object whose properties will be set on
     *     this instance.
     *
     * Valid options properties:
     * featureType - {String} Local (without prefix) feature typeName (required).
     * featureNS - {String} Feature namespace (required).
     * geometryName - {String} Geometry element name.
     */
    initialize: function(options) {
        OpenLayers.Format.GML.Base.prototype.initialize.apply(this, [options]);
    },

    /**
     * Property: readers
     * Contains public functions, grouped by namespace prefix, that will
     *     be applied when a namespaced node is found matching the function
     *     name.  The function will be applied in the scope of this parser
     *     with two arguments: the node being read and a context object passed
     *     from the parent.
     */
    readers: {
        "gml": OpenLayers.Util.applyDefaults({
            "_inherit": function(node, obj, container) {
                // SRSReferenceGroup attributes
                var dim = parseInt(node.getAttribute("srsDimension"), 10) ||
                    (container && container.srsDimension);
                if (dim) {
                    obj.srsDimension = dim;
                }
            },
            "featureMembers": function(node, obj) {
                this.readChildNodes(node, obj);
            },
            "Curve": function(node, container) {
                var obj = {points: []};
                this.readers.gml._inherit.apply(this, [node, obj, container]);
                this.readChildNodes(node, obj);
                if(!container.components) {
                    container.components = [];
                }
                container.components.push(
                    new OpenLayers.Geometry.LineString(obj.points)
                );
            },
            "segments": function(node, obj) {
                this.readChildNodes(node, obj);
            },
            "LineStringSegment": function(node, container) {
                var obj = {};
                this.readChildNodes(node, obj);
                if(obj.points) {
                    Array.prototype.push.apply(container.points, obj.points);
                }
            },
            "pos": function(node, obj) {
                var str = this.getChildValue(node).replace(
                    this.regExes.trimSpace, ""
                );
                var coords = str.split(this.regExes.splitSpace);
                var point;
                if(this.xy) {
                    point = new OpenLayers.Geometry.Point(
                        coords[0], coords[1], coords[2]
                    );
                } else {
                    point = new OpenLayers.Geometry.Point(
                        coords[1], coords[0], coords[2]
                    );
                }
                if(!!!obj.points) {
                    obj.points = [];
                }
                obj.points.push(point);
            },
            "posList": function(node, obj) {
                var str = this.getChildValue(node).replace(
                    this.regExes.trimSpace, ""
                );
                var coords = str.split(this.regExes.splitSpace);
                // The "dimension" attribute is from the GML 3.0.1 spec.
                var dim = obj.srsDimension ||
                    parseInt(node.getAttribute("srsDimension") || node.getAttribute("dimension"), 10) || 2;
                var j, x, y, z;
                var numPoints = coords.length / dim;
                var points = new Array(numPoints);
                for(var i=0, len=coords.length; i<len; i += dim) {
                    x = coords[i];
                    y = coords[i+1];
                    z = (dim == 2) ? undefined : coords[i+2];
                    if (this.xy) {
                        points[i/dim] = new OpenLayers.Geometry.Point(x, y, z);
                    } else {
                        points[i/dim] = new OpenLayers.Geometry.Point(y, x, z);
                    }
                }
                obj.points = points;
            },
            "Surface": function(node, obj) {
                this.readChildNodes(node, obj);
            },
            "patches": function(node, obj) {
                this.readChildNodes(node, obj);
            },
            "PolygonPatch": function(node, obj) {
                this.readers.gml.Polygon.apply(this, [node, obj]);
            },
            "exterior": function(node, container) {
                var obj = {};
                this.readChildNodes(node, obj);
                container.outer = obj.components[0];
            },
            "interior": function(node, container) {
                var obj = {};
                this.readChildNodes(node, obj);
                container.inner.push(obj.components[0]);
            },
            "MultiCurve": function(node, container) {
                var obj = {components: []};
                this.readers.gml._inherit.apply(this, [node, obj, container]);
                this.readChildNodes(node, obj);
                if(obj.components.length > 0) {
                    container.components = [
                        new OpenLayers.Geometry.MultiLineString(obj.components)
                    ];
                }
            },
            "curveMember": function(node, obj) {
                this.readChildNodes(node, obj);
            },
            "MultiSurface": function(node, container) {
                var obj = {components: []};
                this.readers.gml._inherit.apply(this, [node, obj, container]);
                this.readChildNodes(node, obj);
                if(obj.components.length > 0) {
                    container.components = [
                        new OpenLayers.Geometry.MultiPolygon(obj.components)
                    ];
                }
            },
            "surfaceMember": function(node, obj) {
                this.readChildNodes(node, obj);
            },
            "surfaceMembers": function(node, obj) {
                this.readChildNodes(node, obj);
            },
            "pointMembers": function(node, obj) {
                this.readChildNodes(node, obj);
            },
            "lineStringMembers": function(node, obj) {
                this.readChildNodes(node, obj);
            },
            "polygonMembers": function(node, obj) {
                this.readChildNodes(node, obj);
            },
            "geometryMembers": function(node, obj) {
                this.readChildNodes(node, obj);
            },
            "Envelope": function(node, container) {
                var obj = {points: new Array(2)};
                this.readChildNodes(node, obj);
                if(!container.components) {
                    container.components = [];
                }

                var min = obj.points[0];
                var max = obj.points[1];
                container.components.push(
                    new OpenLayers.Bounds(min.x, min.y, max.x, max.y)
                );
            },
            "lowerCorner": function(node, container) {
                var obj = {};
                this.readers.gml.pos.apply(this, [node, obj]);
                container.points[0] = obj.points[0];
            },
            "upperCorner": function(node, container) {
                var obj = {};
                this.readers.gml.pos.apply(this, [node, obj]);
                container.points[1] = obj.points[0];
            }
        }, OpenLayers.Format.GML.Base.prototype.readers["gml"]),            
        "feature": OpenLayers.Format.GML.Base.prototype.readers["feature"],
        "wfs": OpenLayers.Format.GML.Base.prototype.readers["wfs"]
    },
    
    /**
     * Method: write
     *
     * Parameters:
     * features - {Array(<OpenLayers.Feature.Vector>) | OpenLayers.Feature.Vector}
     *     An array of features or a single feature.
     *
     * Returns:
     * {String} Given an array of features, a doc with a gml:featureMembers
     *     element will be returned.  Given a single feature, a doc with a
     *     gml:featureMember element will be returned.
     */
    write: function(features) {
        var name;
        if(OpenLayers.Util.isArray(features)) {
            name = "featureMembers";
        } else {
            name = "featureMember";
        }
        var root = this.writeNode("gml:" + name, features);
        this.setAttributeNS(
            root, this.namespaces["xsi"],
            "xsi:schemaLocation", this.schemaLocation
        );

        return OpenLayers.Format.XML.prototype.write.apply(this, [root]);
    },

    /**
     * Property: writers
     * As a compliment to the readers property, this structure contains public
     *     writing functions grouped by namespace alias and named like the
     *     node names they produce.
     */
    writers: {
        "gml": OpenLayers.Util.applyDefaults({
            "featureMembers": function(features) {
                var node = this.createElementNSPlus("gml:featureMembers");
                for(var i=0, len=features.length; i<len; ++i) {
                    this.writeNode("feature:_typeName", features[i], node);
                }
                return node;
            },
            "Point": function(geometry) {
                var node = this.createElementNSPlus("gml:Point");
                this.writeNode("pos", geometry, node);
                return node;
            },
            "pos": function(point) {
                // only 2d for simple features profile
                var pos = (this.xy) ?
                    (point.x + " " + point.y) : (point.y + " " + point.x);
                return this.createElementNSPlus("gml:pos", {
                    value: pos
                });
            },
            "LineString": function(geometry) {
                var node = this.createElementNSPlus("gml:LineString");
                this.writeNode("posList", geometry.components, node);
                return node;
            },
            "Curve": function(geometry) {
                var node = this.createElementNSPlus("gml:Curve");
                this.writeNode("segments", geometry, node);
                return node;
            },
            "segments": function(geometry) {
                var node = this.createElementNSPlus("gml:segments");
                this.writeNode("LineStringSegment", geometry, node);
                return node;
            },
            "LineStringSegment": function(geometry) {
                var node = this.createElementNSPlus("gml:LineStringSegment");
                this.writeNode("posList", geometry.components, node);
                return node;
            },
            "posList": function(points) {
                // only 2d for simple features profile
                var len = points.length;
                var parts = new Array(len);
                var point;
                for(var i=0; i<len; ++i) {
                    point = points[i];
                    if(this.xy) {
                        parts[i] = point.x + " " + point.y;
                    } else {
                        parts[i] = point.y + " " + point.x;
                    }
                }
                return this.createElementNSPlus("gml:posList", {
                    value: parts.join(" ")
                }); 
            },
            "Surface": function(geometry) {
                var node = this.createElementNSPlus("gml:Surface");
                this.writeNode("patches", geometry, node);
                return node;
            },
            "patches": function(geometry) {
                var node = this.createElementNSPlus("gml:patches");
                this.writeNode("PolygonPatch", geometry, node);
                return node;
            },
            "PolygonPatch": function(geometry) {
                var node = this.createElementNSPlus("gml:PolygonPatch", {
                    attributes: {interpolation: "planar"}
                });
                this.writeNode("exterior", geometry.components[0], node);
                for(var i=1, len=geometry.components.length; i<len; ++i) {
                    this.writeNode(
                        "interior", geometry.components[i], node
                    );
                }
                return node;
            },
            "Polygon": function(geometry) {
                var node = this.createElementNSPlus("gml:Polygon");
                this.writeNode("exterior", geometry.components[0], node);
                for(var i=1, len=geometry.components.length; i<len; ++i) {
                    this.writeNode(
                        "interior", geometry.components[i], node
                    );
                }
                return node;
            },
            "exterior": function(ring) {
                var node = this.createElementNSPlus("gml:exterior");
                this.writeNode("LinearRing", ring, node);
                return node;
            },
            "interior": function(ring) {
                var node = this.createElementNSPlus("gml:interior");
                this.writeNode("LinearRing", ring, node);
                return node;
            },
            "LinearRing": function(ring) {
                var node = this.createElementNSPlus("gml:LinearRing");
                this.writeNode("posList", ring.components, node);
                return node;
            },
            "MultiCurve": function(geometry) {
                var node = this.createElementNSPlus("gml:MultiCurve");
                var components = geometry.components || [geometry];
                for(var i=0, len=components.length; i<len; ++i) {
                    this.writeNode("curveMember", components[i], node);
                }
                return node;
            },
            "curveMember": function(geometry) {
                var node = this.createElementNSPlus("gml:curveMember");
                if(this.curve) {
                    this.writeNode("Curve", geometry, node);
                } else {
                    this.writeNode("LineString", geometry, node);
                }
                return node;
            },
            "MultiSurface": function(geometry) {
                var node = this.createElementNSPlus("gml:MultiSurface");
                var components = geometry.components || [geometry];
                for(var i=0, len=components.length; i<len; ++i) {
                    this.writeNode("surfaceMember", components[i], node);
                }
                return node;
            },
            "surfaceMember": function(polygon) {
                var node = this.createElementNSPlus("gml:surfaceMember");
                if(this.surface) {
                    this.writeNode("Surface", polygon, node);
                } else {
                    this.writeNode("Polygon", polygon, node);
                }
                return node;
            },
            "Envelope": function(bounds) {
                var node = this.createElementNSPlus("gml:Envelope");
                this.writeNode("lowerCorner", bounds, node);
                this.writeNode("upperCorner", bounds, node);
                // srsName attribute is required for gml:Envelope
                if(this.srsName) {
                    node.setAttribute("srsName", this.srsName);
                }
                return node;
            },
            "lowerCorner": function(bounds) {
                // only 2d for simple features profile
                var pos = (this.xy) ?
                    (bounds.left + " " + bounds.bottom) :
                    (bounds.bottom + " " + bounds.left);
                return this.createElementNSPlus("gml:lowerCorner", {
                    value: pos
                });
            },
            "upperCorner": function(bounds) {
                // only 2d for simple features profile
                var pos = (this.xy) ?
                    (bounds.right + " " + bounds.top) :
                    (bounds.top + " " + bounds.right);
                return this.createElementNSPlus("gml:upperCorner", {
                    value: pos
                });
            }
        }, OpenLayers.Format.GML.Base.prototype.writers["gml"]),
        "feature": OpenLayers.Format.GML.Base.prototype.writers["feature"],
        "wfs": OpenLayers.Format.GML.Base.prototype.writers["wfs"]
    },

    /**
     * Method: setGeometryTypes
     * Sets the <geometryTypes> mapping.
     */
    setGeometryTypes: function() {
        this.geometryTypes = {
            "OpenLayers.Geometry.Point": "Point",
            "OpenLayers.Geometry.MultiPoint": "MultiPoint",
            "OpenLayers.Geometry.LineString": (this.curve === true) ? "Curve": "LineString",
            "OpenLayers.Geometry.MultiLineString": (this.multiCurve === false) ? "MultiLineString" : "MultiCurve",
            "OpenLayers.Geometry.Polygon": (this.surface === true) ? "Surface" : "Polygon",
            "OpenLayers.Geometry.MultiPolygon": (this.multiSurface === false) ? "MultiPolygon" : "MultiSurface",
            "OpenLayers.Geometry.Collection": "GeometryCollection"
        };
    },
    
    CLASS_NAME: "OpenLayers.Format.GML.v3" 

});
/* ======================================================================
    OpenLayers/Format/Filter/v1_1_0.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Format/Filter/v1.js
 * @requires OpenLayers/Format/GML/v3.js
 */

/**
 * Class: OpenLayers.Format.Filter.v1_1_0
 * Write ogc:Filter version 1.1.0.
 *
 * Differences from the v1.0.0 parser:
 *  - uses GML v3 instead of GML v2
 *  - reads matchCase attribute on ogc:PropertyIsEqual and
 *        ogc:PropertyIsNotEqual elements.
 *  - writes matchCase attribute from comparison filters of type EQUAL_TO,
 *        NOT_EQUAL_TO and LIKE.
 * 
 * Inherits from: 
 *  - <OpenLayers.Format.GML.v3>
 *  - <OpenLayers.Format.Filter.v1>
 */
OpenLayers.Format.Filter.v1_1_0 = OpenLayers.Class(
    OpenLayers.Format.GML.v3, OpenLayers.Format.Filter.v1, {
    
    /**
     * Constant: VERSION
     * {String} 1.1.0
     */
    VERSION: "1.1.0",
    
    /**
     * Property: schemaLocation
     * {String} http://www.opengis.net/ogc/filter/1.1.0/filter.xsd
     */
    schemaLocation: "http://www.opengis.net/ogc/filter/1.1.0/filter.xsd",

    /**
     * Constructor: OpenLayers.Format.Filter.v1_1_0
     * Instances of this class are not created directly.  Use the
     *     <OpenLayers.Format.Filter> constructor instead.
     *
     * Parameters:
     * options - {Object} An optional object whose properties will be set on
     *     this instance.
     */
    initialize: function(options) {
        OpenLayers.Format.GML.v3.prototype.initialize.apply(
            this, [options]
        );
    },

    /**
     * Property: readers
     * Contains public functions, grouped by namespace prefix, that will
     *     be applied when a namespaced node is found matching the function
     *     name.  The function will be applied in the scope of this parser
     *     with two arguments: the node being read and a context object passed
     *     from the parent.
     */
    readers: {
        "ogc": OpenLayers.Util.applyDefaults({
            "PropertyIsEqualTo": function(node, obj) {
                var matchCase = node.getAttribute("matchCase");
                var filter = new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.EQUAL_TO,
                    matchCase: !(matchCase === "false" || matchCase === "0")
                });
                this.readChildNodes(node, filter);
                obj.filters.push(filter);
            },
            "PropertyIsNotEqualTo": function(node, obj) {
                var matchCase = node.getAttribute("matchCase");
                var filter = new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.NOT_EQUAL_TO,
                    matchCase: !(matchCase === "false" || matchCase === "0")
                });
                this.readChildNodes(node, filter);
                obj.filters.push(filter);
            },
            "PropertyIsLike": function(node, obj) {
                var filter = new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.LIKE
                });
                this.readChildNodes(node, filter);
                var wildCard = node.getAttribute("wildCard");
                var singleChar = node.getAttribute("singleChar");
                var esc = node.getAttribute("escapeChar");
                filter.value2regex(wildCard, singleChar, esc);
                obj.filters.push(filter);
            }
        }, OpenLayers.Format.Filter.v1.prototype.readers["ogc"]),
        "gml": OpenLayers.Format.GML.v3.prototype.readers["gml"],
        "feature": OpenLayers.Format.GML.v3.prototype.readers["feature"]        
    },

    /**
     * Property: writers
     * As a compliment to the readers property, this structure contains public
     *     writing functions grouped by namespace alias and named like the
     *     node names they produce.
     */
    writers: {
        "ogc": OpenLayers.Util.applyDefaults({
            "PropertyIsEqualTo": function(filter) {
                var node = this.createElementNSPlus("ogc:PropertyIsEqualTo", {
                    attributes: {matchCase: filter.matchCase}
                });
                // no ogc:expression handling for PropertyName for now
                this.writeNode("PropertyName", filter, node);
                // handle Literals or Functions for now
                this.writeOgcExpression(filter.value, node);
                return node;
            },
            "PropertyIsNotEqualTo": function(filter) {
                var node = this.createElementNSPlus("ogc:PropertyIsNotEqualTo", {
                    attributes: {matchCase: filter.matchCase}
                });
                // no ogc:expression handling for PropertyName for now
                this.writeNode("PropertyName", filter, node);
                // handle Literals or Functions for now
                this.writeOgcExpression(filter.value, node);
                return node;
            },
            "PropertyIsLike": function(filter) {
                var node = this.createElementNSPlus("ogc:PropertyIsLike", {
                    attributes: {
                        matchCase: filter.matchCase,
                        wildCard: "*", singleChar: ".", escapeChar: "!"
                    }
                });
                // no ogc:expression handling for now
                this.writeNode("PropertyName", filter, node);
                // convert regex string to ogc string
                this.writeNode("Literal", filter.regex2value(), node);
                return node;
            },
            "BBOX": function(filter) {
                var node = this.createElementNSPlus("ogc:BBOX");
                // PropertyName is optional in 1.1.0
                filter.property && this.writeNode("PropertyName", filter, node);
                var box = this.writeNode("gml:Envelope", filter.value);
                if(filter.projection) {
                    box.setAttribute("srsName", filter.projection);
                }
                node.appendChild(box); 
                return node;
            },
            "SortBy": function(sortProperties) {
                var node = this.createElementNSPlus("ogc:SortBy");
                for (var i=0,l=sortProperties.length;i<l;i++) {
                    this.writeNode(
                        "ogc:SortProperty",
                        sortProperties[i],
                        node
                    );
                }
                return node;
            }, 
            "SortProperty": function(sortProperty) {
                var node = this.createElementNSPlus("ogc:SortProperty");
                this.writeNode(
                    "ogc:PropertyName",
                    sortProperty,
                    node
                );
                this.writeNode(
                    "ogc:SortOrder",
                    (sortProperty.order == 'DESC') ? 'DESC' : 'ASC',
                    node
                );
                return node;
            },
            "SortOrder": function(value) {
                var node = this.createElementNSPlus("ogc:SortOrder", {
                    value: value
                });
                return node;
            }
        }, OpenLayers.Format.Filter.v1.prototype.writers["ogc"]),
        "gml": OpenLayers.Format.GML.v3.prototype.writers["gml"],
        "feature": OpenLayers.Format.GML.v3.prototype.writers["feature"]
    },

    /**
     * Method: writeSpatial
     *
     * Read a {<OpenLayers.Filter.Spatial>} filter and converts it into XML.
     *
     * Parameters:
     * filter - {<OpenLayers.Filter.Spatial>} The filter.
     * name - {String} Name of the generated XML element.
     *
     * Returns:
     * {DOMElement} The created XML element.
     */
    writeSpatial: function(filter, name) {
        var node = this.createElementNSPlus("ogc:"+name);
        this.writeNode("PropertyName", filter, node);
        if(filter.value instanceof OpenLayers.Filter.Function) {
            this.writeNode("Function", filter.value, node);
        } else {
        var child;
        if(filter.value instanceof OpenLayers.Geometry) {
            child = this.writeNode("feature:_geometry", filter.value).firstChild;
        } else {
            child = this.writeNode("gml:Envelope", filter.value);
        }
        if(filter.projection) {
            child.setAttribute("srsName", filter.projection);
        }
        node.appendChild(child);
        }
        return node;
    },

    CLASS_NAME: "OpenLayers.Format.Filter.v1_1_0" 

});
/* ======================================================================
    OpenLayers/Format/OWSCommon/v1_0_0.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Format/OWSCommon/v1.js
 */

/**
 * Class: OpenLayers.Format.OWSCommon.v1_0_0
 * Parser for OWS Common version 1.0.0.
 *
 * Inherits from:
 *  - <OpenLayers.Format.OWSCommon.v1>
 */
OpenLayers.Format.OWSCommon.v1_0_0 = OpenLayers.Class(OpenLayers.Format.OWSCommon.v1, {
    
    /**
     * Property: namespaces
     * {Object} Mapping of namespace aliases to namespace URIs.
     */
    namespaces: {
        ows: "http://www.opengis.net/ows",
        xlink: "http://www.w3.org/1999/xlink"
    },    
    
    /**
     * Property: readers
     * Contains public functions, grouped by namespace prefix, that will
     *     be applied when a namespaced node is found matching the function
     *     name.  The function will be applied in the scope of this parser
     *     with two arguments: the node being read and a context object passed
     *     from the parent.
     */
    readers: {
        "ows": OpenLayers.Util.applyDefaults({
            "ExceptionReport": function(node, obj) {
                obj.success = false;
                obj.exceptionReport = {
                    version: node.getAttribute('version'),
                    language: node.getAttribute('language'),
                    exceptions: []
                };
                this.readChildNodes(node, obj.exceptionReport);
            } 
        }, OpenLayers.Format.OWSCommon.v1.prototype.readers.ows)
    },

    /**
     * Property: writers
     * As a compliment to the readers property, this structure contains public
     *     writing functions grouped by namespace alias and named like the
     *     node names they produce.
     */
    writers: {
        "ows": OpenLayers.Format.OWSCommon.v1.prototype.writers.ows
    },
    
    CLASS_NAME: "OpenLayers.Format.OWSCommon.v1_0_0"

});
/* ======================================================================
    OpenLayers/Format/WFST/v1_1_0.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Format/WFST/v1.js
 * @requires OpenLayers/Format/Filter/v1_1_0.js
 * @requires OpenLayers/Format/OWSCommon/v1_0_0.js
 */

/**
 * Class: OpenLayers.Format.WFST.v1_1_0
 * A format for creating WFS v1.1.0 transactions.  Create a new instance with the
 *     <OpenLayers.Format.WFST.v1_1_0> constructor.
 *
 * Inherits from:
 *  - <OpenLayers.Format.Filter.v1_1_0>
 *  - <OpenLayers.Format.WFST.v1>
 */
OpenLayers.Format.WFST.v1_1_0 = OpenLayers.Class(
    OpenLayers.Format.Filter.v1_1_0, OpenLayers.Format.WFST.v1, {
    
    /**
     * Property: version
     * {String} WFS version number.
     */
    version: "1.1.0",
    
    /**
     * Property: schemaLocations
     * {Object} Properties are namespace aliases, values are schema locations.
     */
    schemaLocations: {
        "wfs": "http://schemas.opengis.net/wfs/1.1.0/wfs.xsd"
    },
    
    /**
     * Constructor: OpenLayers.Format.WFST.v1_1_0
     * A class for parsing and generating WFS v1.1.0 transactions.
     *
     * To read additional information like hit count (numberOfFeatures) from
     * the  FeatureCollection, call the <OpenLayers.Format.WFST.v1.read> method
     * with {output: "object"} as 2nd argument. Note that it is possible to
     * just request the hit count from a WFS 1.1.0 server with the
     * resultType="hits" request parameter.
     *
     * Parameters:
     * options - {Object} Optional object whose properties will be set on the
     *     instance.
     *
     * Valid options properties:
     * featureType - {String} Local (without prefix) feature typeName (required).
     * featureNS - {String} Feature namespace (optional).
     * featurePrefix - {String} Feature namespace alias (optional - only used
     *     if featureNS is provided).  Default is 'feature'.
     * geometryName - {String} Name of geometry attribute.  Default is 'the_geom'.
     */
    initialize: function(options) {
        OpenLayers.Format.Filter.v1_1_0.prototype.initialize.apply(this, [options]);
        OpenLayers.Format.WFST.v1.prototype.initialize.apply(this, [options]);
    },
    
    /**
     * Method: readNode
     * Shorthand for applying one of the named readers given the node
     *     namespace and local name.  Readers take two args (node, obj) and
     *     generally extend or modify the second.
     *
     * Parameters:
     * node - {DOMElement} The node to be read (required).
     * obj - {Object} The object to be modified (optional).
     * first - {Boolean} Should be set to true for the first node read. This
     *     is usually the readNode call in the read method. Without this being
     *     set, auto-configured properties will stick on subsequent reads.
     *
     * Returns:
     * {Object} The input object, modified (or a new one if none was provided).
     */
    readNode: function(node, obj, first) {
        // Not the superclass, only the mixin classes inherit from
        // Format.GML.v3. We need this because we don't want to get readNode
        // from the superclass's superclass, which is OpenLayers.Format.XML.
        return OpenLayers.Format.GML.v3.prototype.readNode.apply(this, arguments);
    },
    
    /**
     * Property: readers
     * Contains public functions, grouped by namespace prefix, that will
     *     be applied when a namespaced node is found matching the function
     *     name.  The function will be applied in the scope of this parser
     *     with two arguments: the node being read and a context object passed
     *     from the parent.
     */
    readers: {
        "wfs": OpenLayers.Util.applyDefaults({
            "FeatureCollection": function(node, obj) {
                obj.numberOfFeatures = parseInt(node.getAttribute(
                    "numberOfFeatures"));
                OpenLayers.Format.WFST.v1.prototype.readers["wfs"]["FeatureCollection"].apply(
                    this, arguments);
            },
            "TransactionResponse": function(node, obj) {
                obj.insertIds = [];
                obj.success = false;
                this.readChildNodes(node, obj);
            },
            "TransactionSummary": function(node, obj) {
                // this is a limited test of success
                obj.success = true;
            },
            "InsertResults": function(node, obj) {
                this.readChildNodes(node, obj);
            },
            "Feature": function(node, container) {
                var obj = {fids: []};
                this.readChildNodes(node, obj);
                container.insertIds.push(obj.fids[0]);
            }
        }, OpenLayers.Format.WFST.v1.prototype.readers["wfs"]),
        "gml": OpenLayers.Format.GML.v3.prototype.readers["gml"],
        "feature": OpenLayers.Format.GML.v3.prototype.readers["feature"],
        "ogc": OpenLayers.Format.Filter.v1_1_0.prototype.readers["ogc"],
        "ows": OpenLayers.Format.OWSCommon.v1_0_0.prototype.readers["ows"]
    },

    /**
     * Property: writers
     * As a compliment to the readers property, this structure contains public
     *     writing functions grouped by namespace alias and named like the
     *     node names they produce.
     */
    writers: {
        "wfs": OpenLayers.Util.applyDefaults({
            "GetFeature": function(options) {
                var node = OpenLayers.Format.WFST.v1.prototype.writers["wfs"]["GetFeature"].apply(this, arguments);
                options && this.setAttributes(node, {
                    resultType: options.resultType,
                    startIndex: options.startIndex,
                    count: options.count
                });
                return node;
            },
            "Query": function(options) {
                options = OpenLayers.Util.extend({
                    featureNS: this.featureNS,
                    featurePrefix: this.featurePrefix,
                    featureType: this.featureType,
                    srsName: this.srsName
                }, options);
                var prefix = options.featurePrefix;
                var node = this.createElementNSPlus("wfs:Query", {
                    attributes: {
                        typeName: (prefix ? prefix + ":" : "") +
                            options.featureType,
                        srsName: options.srsName
                    }
                });
                if(options.featureNS) {
                    this.setAttributeNS(node, this.namespaces.xmlns,
                        "xmlns:" + prefix, options.featureNS);
                }
                if(options.propertyNames) {
                    for(var i=0,len = options.propertyNames.length; i<len; i++) {
                        this.writeNode(
                            "wfs:PropertyName", 
                            {property: options.propertyNames[i]},
                            node
                        );
                    }
                }
                if(options.filter) {
                    OpenLayers.Format.WFST.v1_1_0.prototype.setFilterProperty.call(this, options.filter);
                    this.writeNode("ogc:Filter", options.filter, node);
                }
                return node;
            },
            "PropertyName": function(obj) {
                return this.createElementNSPlus("wfs:PropertyName", {
                    value: obj.property
                });
            }            
        }, OpenLayers.Format.WFST.v1.prototype.writers["wfs"]),
        "gml": OpenLayers.Format.GML.v3.prototype.writers["gml"],
        "feature": OpenLayers.Format.GML.v3.prototype.writers["feature"],
        "ogc": OpenLayers.Format.Filter.v1_1_0.prototype.writers["ogc"]
    },

    CLASS_NAME: "OpenLayers.Format.WFST.v1_1_0" 
});
/* ======================================================================
    OpenLayers/Format/WPSCapabilities.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Format/XML/VersionedOGC.js
 */
 
/**
 * Class: OpenLayers.Format.WPSCapabilities
 * Read WPS Capabilities.
 * 
 * Inherits from:
 *  - <OpenLayers.Format.XML.VersionedOGC>
 */
OpenLayers.Format.WPSCapabilities = OpenLayers.Class(OpenLayers.Format.XML.VersionedOGC, {
    
    /**
     * APIProperty: defaultVersion
     * {String} Version number to assume if none found.  Default is "1.0.0".
     */
    defaultVersion: "1.0.0",
    
    /**
     * Constructor: OpenLayers.Format.WPSCapabilities
     * Create a new parser for WPS Capabilities.
     *
     * Parameters:
     * options - {Object} An optional object whose properties will be set on
     *     this instance.
     */

    /**
     * APIMethod: read
     * Read capabilities data from a string, and return information about
     * the service.
     * 
     * Parameters: 
     * data - {String} or {DOMElement} data to read/parse.
     *
     * Returns:
     * {Object} Info about the WPS
     */
    
    CLASS_NAME: "OpenLayers.Format.WPSCapabilities" 

});
/* ======================================================================
    OpenLayers/Format/WPSCapabilities/v1_0_0.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Format/WPSCapabilities.js
 * @requires OpenLayers/Format/OWSCommon/v1_1_0.js
 */

/**
 * Class: OpenLayers.Format.WPSCapabilities.v1_0_0
 * Read WPS Capabilities version 1.0.0.
 * 
 * Inherits from:
 *  - <OpenLayers.Format.XML>
 */
OpenLayers.Format.WPSCapabilities.v1_0_0 = OpenLayers.Class(
    OpenLayers.Format.XML, {

    /**
     * Property: namespaces
     * {Object} Mapping of namespace aliases to namespace URIs.
     */
    namespaces: {
        ows: "http://www.opengis.net/ows/1.1",
        wps: "http://www.opengis.net/wps/1.0.0",
        xlink: "http://www.w3.org/1999/xlink"
    },

    /**
     * Property: regExes
     * Compiled regular expressions for manipulating strings.
     */
    regExes: {
        trimSpace: (/^\s*|\s*$/g),
        removeSpace: (/\s*/g),
        splitSpace: (/\s+/),
        trimComma: (/\s*,\s*/g)
    },
    
    /**
     * Constructor: OpenLayers.Format.WPSCapabilities.v1_0_0
     * Create a new parser for WPS capabilities version 1.0.0. 
     *
     * Parameters:
     * options - {Object} An optional object whose properties will be set on
     *     this instance.
     */
    initialize: function(options) {
        OpenLayers.Format.XML.prototype.initialize.apply(this, [options]);
    },

    /**
     * APIMethod: read
     * Read capabilities data from a string, and return info about the WPS.
     * 
     * Parameters: 
     * data - {String} or {DOMElement} data to read/parse.
     *
     * Returns:
     * {Object} Information about the WPS service.
     */
    read: function(data) {
        if(typeof data == "string") {
            data = OpenLayers.Format.XML.prototype.read.apply(this, [data]);
        }
        if(data && data.nodeType == 9) {
            data = data.documentElement;
        }
        var capabilities = {};
        this.readNode(data, capabilities);
        return capabilities;
    },

    /**
     * Property: readers
     * Contains public functions, grouped by namespace prefix, that will
     *     be applied when a namespaced node is found matching the function
     *     name.  The function will be applied in the scope of this parser
     *     with two arguments: the node being read and a context object passed
     *     from the parent.
     */
    readers: {
        "wps": {
            "Capabilities": function(node, obj) {
                this.readChildNodes(node, obj);
            },
            "ProcessOfferings": function(node, obj) {
                obj.processOfferings = {};
                this.readChildNodes(node, obj.processOfferings);
            },
            "Process": function(node, processOfferings) {
                var processVersion = this.getAttributeNS(node, this.namespaces.wps, "processVersion");
                var process = {processVersion: processVersion};
                this.readChildNodes(node, process);
                processOfferings[process.identifier] = process;
            },
            "Languages": function(node, obj) {
                obj.languages = [];
                this.readChildNodes(node, obj.languages);
            },
            "Default": function(node, languages) {
                var language = {isDefault: true};
                this.readChildNodes(node, language);
                languages.push(language);
            },
            "Supported": function(node, languages) {
                var language = {};
                this.readChildNodes(node, language);     
                languages.push(language);
            }
        },
        "ows": OpenLayers.Format.OWSCommon.v1_1_0.prototype.readers["ows"]
    },    
    
    CLASS_NAME: "OpenLayers.Format.WPSCapabilities.v1_0_0" 

});
/* ======================================================================
    OpenLayers/Format/WCSGetCoverage.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Format/XML.js
 * @requires OpenLayers/Format/OWSCommon/v1_1_0.js
 */

/**
 * Class: OpenLayers.Format.WCSGetCoverage version 1.1.0
 *
 * Inherits from:
 *  - <OpenLayers.Format.XML>
 */
OpenLayers.Format.WCSGetCoverage = OpenLayers.Class(OpenLayers.Format.XML, {
    
    /**
     * Property: namespaces
     * {Object} Mapping of namespace aliases to namespace URIs.
     */
    namespaces: {
        ows: "http://www.opengis.net/ows/1.1",
        wcs: "http://www.opengis.net/wcs/1.1",
        xlink: "http://www.w3.org/1999/xlink",
        xsi: "http://www.w3.org/2001/XMLSchema-instance"
    },

    /**
     * Property: regExes
     * Compiled regular expressions for manipulating strings.
     */
    regExes: {
        trimSpace: (/^\s*|\s*$/g),
        removeSpace: (/\s*/g),
        splitSpace: (/\s+/),
        trimComma: (/\s*,\s*/g)
    },

    /**
     * Constant: VERSION
     * {String} 1.1.2
     */
    VERSION: "1.1.2",

    /**
     * Property: schemaLocation
     * {String} Schema location
     */
    schemaLocation: "http://www.opengis.net/wcs/1.1 http://schemas.opengis.net/wcs/1.1/wcsGetCoverage.xsd",

    /**
     * Constructor: OpenLayers.Format.WCSGetCoverage
     *
     * Parameters:
     * options - {Object} An optional object whose properties will be set on
     *     this instance.
     */

    /**
     * Method: write
     *
     * Parameters:
     * options - {Object} Optional object.
     *
     * Returns:
     * {String} A WCS GetCoverage request XML string.
     */
    write: function(options) {
        var node = this.writeNode("wcs:GetCoverage", options);
        this.setAttributeNS(
            node, this.namespaces.xsi,
            "xsi:schemaLocation", this.schemaLocation
        );
        return OpenLayers.Format.XML.prototype.write.apply(this, [node]);
    }, 

    /**
     * Property: writers
     * As a compliment to the readers property, this structure contains public
     *     writing functions grouped by namespace alias and named like the
     *     node names they produce.
     */
    writers: {
        "wcs": {
            "GetCoverage": function(options) {
                var node = this.createElementNSPlus("wcs:GetCoverage", {
                    attributes: {
                        version: options.version || this.VERSION,
                        service: 'WCS'
                    } 
                }); 
                this.writeNode("ows:Identifier", options.identifier, node);
                this.writeNode("wcs:DomainSubset", options.domainSubset, node);
                this.writeNode("wcs:Output", options.output, node);
                return node; 
            },
            "DomainSubset": function(domainSubset) {
                var node = this.createElementNSPlus("wcs:DomainSubset", {});
                this.writeNode("ows:BoundingBox", domainSubset.boundingBox, node);
                if (domainSubset.temporalSubset) {
                    this.writeNode("wcs:TemporalSubset", domainSubset.temporalSubset, node);
                }
                return node;
            },
            "TemporalSubset": function(temporalSubset) {
                var node = this.createElementNSPlus("wcs:TemporalSubset", {});
                for (var i=0, len=temporalSubset.timePeriods.length; i<len; ++i) {
                    this.writeNode("wcs:TimePeriod", temporalSubset.timePeriods[i], node);
                }
                return node;
            },
            "TimePeriod": function(timePeriod) {
                var node = this.createElementNSPlus("wcs:TimePeriod", {});
                this.writeNode("wcs:BeginPosition", timePeriod.begin, node);
                this.writeNode("wcs:EndPosition", timePeriod.end, node);
                if (timePeriod.resolution) {
                    this.writeNode("wcs:TimeResolution", timePeriod.resolution, node);
                }
                return node;
            },
            "BeginPosition": function(begin) {
                var node = this.createElementNSPlus("wcs:BeginPosition", {
                    value: begin
                });
                return node;
            },
            "EndPosition": function(end) {
                var node = this.createElementNSPlus("wcs:EndPosition", {
                    value: end
                });
                return node;
            },
            "TimeResolution": function(resolution) {
                var node = this.createElementNSPlus("wcs:TimeResolution", {
                    value: resolution
                });
                return node;
            },
            "Output": function(output) {
                var node = this.createElementNSPlus("wcs:Output", {
                    attributes: {
                        format: output.format,
                        store: output.store
                    }
                });
                if (output.gridCRS) {
                    this.writeNode("wcs:GridCRS", output.gridCRS, node);
                }
                return node;
            },
            "GridCRS": function(gridCRS) {
                var node = this.createElementNSPlus("wcs:GridCRS", {});
                this.writeNode("wcs:GridBaseCRS", gridCRS.baseCRS, node);
                if (gridCRS.type) {
                    this.writeNode("wcs:GridType", gridCRS.type, node);
                }
                if (gridCRS.origin) {
                    this.writeNode("wcs:GridOrigin", gridCRS.origin, node);
                }
                this.writeNode("wcs:GridOffsets", gridCRS.offsets, node);
                if (gridCRS.CS) {
                    this.writeNode("wcs:GridCS", gridCRS.CS, node);
                }
                return node;
            },
            "GridBaseCRS": function(baseCRS) {
                return this.createElementNSPlus("wcs:GridBaseCRS", {
                    value: baseCRS
                });
            },
            "GridOrigin": function(origin) {
                return this.createElementNSPlus("wcs:GridOrigin", {
                    value: origin
                });
            },
            "GridType": function(type) {
                return this.createElementNSPlus("wcs:GridType", {
                    value: type
                });
            },
            "GridOffsets": function(offsets) {
                return this.createElementNSPlus("wcs:GridOffsets", {
                    value: offsets
                });
            },
            "GridCS": function(CS) {
                return this.createElementNSPlus("wcs:GridCS", {
                    value: CS
                });
            }
        },
        "ows": OpenLayers.Format.OWSCommon.v1_1_0.prototype.writers.ows
    },
    
    CLASS_NAME: "OpenLayers.Format.WCSGetCoverage" 

});
/* ======================================================================
    OpenLayers/Format/WPSExecute.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Format/XML.js
 * @requires OpenLayers/Format/OWSCommon/v1_1_0.js
 * @requires OpenLayers/Format/WCSGetCoverage.js
 * @requires OpenLayers/Format/WFST/v1_1_0.js
 */

/**
 * Class: OpenLayers.Format.WPSExecute version 1.0.0
 *
 * Inherits from:
 *  - <OpenLayers.Format.XML>
 */
OpenLayers.Format.WPSExecute = OpenLayers.Class(OpenLayers.Format.XML,
                                            OpenLayers.Format.Filter.v1_1_0, {
    
    /**
     * Property: namespaces
     * {Object} Mapping of namespace aliases to namespace URIs.
     */
    namespaces: {
        ows: "http://www.opengis.net/ows/1.1",
        gml: "http://www.opengis.net/gml",
        wps: "http://www.opengis.net/wps/1.0.0",
        wfs: "http://www.opengis.net/wfs",
        ogc: "http://www.opengis.net/ogc",
        wcs: "http://www.opengis.net/wcs",
        xlink: "http://www.w3.org/1999/xlink",
        xsi: "http://www.w3.org/2001/XMLSchema-instance"
    },

    /**
     * Property: regExes
     * Compiled regular expressions for manipulating strings.
     */
    regExes: {
        trimSpace: (/^\s*|\s*$/g),
        removeSpace: (/\s*/g),
        splitSpace: (/\s+/),
        trimComma: (/\s*,\s*/g)
    },

    /**
     * Constant: VERSION
     * {String} 1.0.0
     */
    VERSION: "1.0.0",

    /**
     * Property: schemaLocation
     * {String} Schema location
     */
    schemaLocation: "http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd",

    schemaLocationAttr: function(options) {
        return undefined;
    },

    /**
     * Constructor: OpenLayers.Format.WPSExecute
     *
     * Parameters:
     * options - {Object} An optional object whose properties will be set on
     *     this instance.
     */

    /**
     * Method: write
     *
     * Parameters:
     * options - {Object} Optional object.
     *
     * Returns:
     * {String} An WPS Execute request XML string.
     */
    write: function(options) {
        var doc;
        if (window.ActiveXObject) {
            doc = new ActiveXObject("Microsoft.XMLDOM");
            this.xmldom = doc;
        } else {
            doc = document.implementation.createDocument("", "", null);
        }
        var node = this.writeNode("wps:Execute", options, doc);
        this.setAttributeNS(
            node, this.namespaces.xsi,
            "xsi:schemaLocation", this.schemaLocation
        );
        return OpenLayers.Format.XML.prototype.write.apply(this, [node]);
    }, 

    /**
     * APIMethod: read
     * Parse a WPS Execute and return an object with its information.
     * 
     * Parameters: 
     * data - {String} or {DOMElement} data to read/parse.
     *
     * Returns:
     * {Object}
     */
    read: function(data) {
        if(typeof data == "string") {
            data = OpenLayers.Format.XML.prototype.read.apply(this, [data]);
        }
        if(data && data.nodeType == 9) {
            data = data.documentElement;
        }
        var info = {};
        this.readNode(data, info);
        return info;
    },

    /**
     * Property: writers
     * As a compliment to the readers property, this structure contains public
     *     writing functions grouped by namespace alias and named like the
     *     node names they produce.
     */
    writers: {
        "wps": {
            "Execute": function(options) {
                var node = this.createElementNSPlus("wps:Execute", {
                    attributes: {
                        version: this.VERSION,
                        service: 'WPS'
                    } 
                }); 
                this.writeNode("ows:Identifier", options.identifier, node);
                this.writeNode("wps:DataInputs", options.dataInputs, node);
                this.writeNode("wps:ResponseForm", options.responseForm, node);
                return node; 
            },
            "ResponseForm": function(responseForm) {
                var node = this.createElementNSPlus("wps:ResponseForm", {});
                if (responseForm.rawDataOutput) {
                    this.writeNode("wps:RawDataOutput", responseForm.rawDataOutput, node);
                }
                if (responseForm.responseDocument) {
                    this.writeNode("wps:ResponseDocument", responseForm.responseDocument, node);
                }
                return node;
            },
            "ResponseDocument": function(responseDocument) {
                var node = this.createElementNSPlus("wps:ResponseDocument", {
                    attributes: {
                        storeExecuteResponse: responseDocument.storeExecuteResponse,
                        lineage: responseDocument.lineage,
                        status: responseDocument.status
                    }
                });
                if (responseDocument.outputs) {
                    for (var i = 0, len = responseDocument.outputs.length; i < len; i++) {
                        this.writeNode("wps:Output", responseDocument.outputs[i], node);
                    }
                }
                return node;
            },
            "Output": function(output) {
                var node = this.createElementNSPlus("wps:Output", {
                    attributes: {
                        asReference: output.asReference,
                        mimeType: output.mimeType,
                        encoding: output.encoding,
                        schema: output.schema
                    }
                });
                this.writeNode("ows:Identifier", output.identifier, node);
                this.writeNode("ows:Title", output.title, node);
                this.writeNode("ows:Abstract", output["abstract"], node);
                return node;
            },
            "RawDataOutput": function(rawDataOutput) {
                var node = this.createElementNSPlus("wps:RawDataOutput", {
                    attributes: {
                        mimeType: rawDataOutput.mimeType,
                        encoding: rawDataOutput.encoding,
                        schema: rawDataOutput.schema
                    }
                });
                this.writeNode("ows:Identifier", rawDataOutput.identifier, node);
                return node;
            },
            "DataInputs": function(dataInputs) {
                var node = this.createElementNSPlus("wps:DataInputs", {});
                for (var i=0, ii=dataInputs.length; i<ii; ++i) {
                    this.writeNode("wps:Input", dataInputs[i], node);
                }
                return node;
            },
            "Input": function(input) {
                var node = this.createElementNSPlus("wps:Input", {});
                this.writeNode("ows:Identifier", input.identifier, node);
                if (input.title) {
                    this.writeNode("ows:Title", input.title, node);
                }
                if (input.data) {
                    this.writeNode("wps:Data", input.data, node);
                }
                if (input.reference) {
                    this.writeNode("wps:Reference", input.reference, node);
                }
                if (input.boundingBoxData) {
                    this.writeNode("wps:BoundingBoxData", input.boundingBoxData, node);
                }
                return node;
            },
            "Data": function(data) {
                var node = this.createElementNSPlus("wps:Data", {});
                if (data.literalData) {
                    this.writeNode("wps:LiteralData", data.literalData, node);
                } else if (data.complexData) {
                    this.writeNode("wps:ComplexData", data.complexData, node);
                } else if (data.boundingBoxData) {
                    this.writeNode("ows:BoundingBox", data.boundingBoxData, node);
                }
                return node;
            },
            "LiteralData": function(literalData) {
                var node = this.createElementNSPlus("wps:LiteralData", {
                    attributes: {
                        uom: literalData.uom
                    },
                    value: literalData.value
                });
                return node;
            },
            "ComplexData": function(complexData) {
                var node = this.createElementNSPlus("wps:ComplexData", {
                    attributes: {
                        mimeType: complexData.mimeType,
                        encoding: complexData.encoding,
                        schema: complexData.schema
                    } 
                });
                var data = complexData.value;
                if (typeof data === "string") {
                    node.appendChild(
                        this.getXMLDoc().createCDATASection(complexData.value)
                    );
                } else {
                    node.appendChild(data);
                }
                return node;
            },
            "Reference": function(reference) {
                var node = this.createElementNSPlus("wps:Reference", {
                    attributes: {
                        mimeType: reference.mimeType,
                        "xlink:href": reference.href,
                        method: reference.method,
                        encoding: reference.encoding,
                        schema: reference.schema
                    }
                });
                if (reference.body) {
                    this.writeNode("wps:Body", reference.body, node);
                }
                return node;
            },
            "BoundingBoxData": function(node, obj) {
                this.writers['ows']['BoundingBox'].apply(this, [node, obj, "wps:BoundingBoxData"]);
            },
            "Body": function(body) {
                var node = this.createElementNSPlus("wps:Body", {});
                if (body.wcs) {
                    this.writeNode("wcs:GetCoverage", body.wcs, node);
                }
                else if (body.wfs) {
                    // OpenLayers.Format.WFST expects these to be on the 
                    // instance and not in the options
                    this.featureType = body.wfs.featureType;
                    this.version = body.wfs.version;
                    this.writeNode("wfs:GetFeature", body.wfs, node);
                } else {
                    this.writeNode("wps:Execute", body, node);
                }
                return node;                
            }
        },
        "wcs": OpenLayers.Format.WCSGetCoverage.prototype.writers.wcs,
        "wfs": OpenLayers.Format.WFST.v1_1_0.prototype.writers.wfs,
        "ogc": OpenLayers.Format.Filter.v1_1_0.prototype.writers.ogc,
        "ows": OpenLayers.Format.OWSCommon.v1_1_0.prototype.writers.ows
    },

    /**
     * Property: readers
     * Contains public functions, grouped by namespace prefix, that will
     *     be applied when a namespaced node is found matching the function
     *     name.  The function will be applied in the scope of this parser
     *     with two arguments: the node being read and a context object passed
     *     from the parent.
     */
    readers: {
        "wps": {
            "ExecuteResponse": function(node, obj) {
                obj.executeResponse = {
                    lang: node.getAttribute("lang"),
                    statusLocation: node.getAttribute("statusLocation"),
                    serviceInstance: node.getAttribute("serviceInstance"),
                    service: node.getAttribute("service")
                };
                this.readChildNodes(node, obj.executeResponse);
            },
            "Process":function(node,obj) {
                obj.process = {};
                this.readChildNodes(node, obj.process);
            },
            "Status":function(node,obj) {
                obj.status = {
                    creationTime: node.getAttribute("creationTime")
                };
                this.readChildNodes(node, obj.status);
            },
            "ProcessSucceeded": function(node,obj) {
                obj.processSucceeded = true;
            },
            "ProcessOutputs": function(node, processDescription) {
                processDescription.processOutputs = [];
                this.readChildNodes(node, processDescription.processOutputs);
            },
            "Output": function(node, processOutputs) {
                var output = {};
                this.readChildNodes(node, output);
                processOutputs.push(output);
            },
            "Reference": function(node, output) {
                output.reference = {
                    href: node.getAttribute("href"),
                    mimeType: node.getAttribute("mimeType"),
                    encoding: node.getAttribute("encoding"),
                    schema: node.getAttribute("schema")
                };
            },
            "Data": function(node, output) {
                output.data = {};
                this.readChildNodes(node, output);
            },
            "LiteralData": function(node, output) {
                output.literalData = {
                    dataType: node.getAttribute("dataType"),
                    uom: node.getAttribute("uom"),
                    value: this.getChildValue(node)
                };
            },
            "ComplexData": function(node, output) {
                output.complexData = {
                    mimeType: node.getAttribute("mimeType"),
                    schema: node.getAttribute("schema"),
                    encoding: node.getAttribute("encoding"),
                    value: ""
                };
                
                // try to get *some* value, ignore the empty text values
                if (this.isSimpleContent(node)) {
                    var child;
                    for(child=node.firstChild; child; child=child.nextSibling) {
                        switch(child.nodeType) {
                            case 3: // text node
                            case 4: // cdata section
                                output.complexData.value += child.nodeValue;
                        }
                    }
                }
                else {
                    for(child=node.firstChild; child; child=child.nextSibling) {
                        if (child.nodeType == 1) {
                            output.complexData.value = child;
                        }
                    }
                }

            },
            "BoundingBox": function(node, output) {
                output.boundingBoxData = {
                    dimensions: node.getAttribute("dimensions"),
                    crs: node.getAttribute("crs")
                };
                this.readChildNodes(node, output.boundingBoxData);
            }
        },

        // TODO: we should add Exception parsing here
        "ows": OpenLayers.Format.OWSCommon.v1_1_0.prototype.readers["ows"]
    },
    
    CLASS_NAME: "OpenLayers.Format.WPSExecute" 

});
/* ======================================================================
    OpenLayers/Format/JSON.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * Note:
 * This work draws heavily from the public domain JSON serializer/deserializer
 *     at http://www.json.org/json.js. Rewritten so that it doesn't modify
 *     basic data prototypes.
 */

/**
 * @requires OpenLayers/Format.js
 */

/**
 * Class: OpenLayers.Format.JSON
 * A parser to read/write JSON safely.  Create a new instance with the
 *     <OpenLayers.Format.JSON> constructor.
 *
 * Inherits from:
 *  - <OpenLayers.Format>
 */
OpenLayers.Format.JSON = OpenLayers.Class(OpenLayers.Format, {
    
    /**
     * APIProperty: indent
     * {String} For "pretty" printing, the indent string will be used once for
     *     each indentation level.
     */
    indent: "    ",
    
    /**
     * APIProperty: space
     * {String} For "pretty" printing, the space string will be used after
     *     the ":" separating a name/value pair.
     */
    space: " ",
    
    /**
     * APIProperty: newline
     * {String} For "pretty" printing, the newline string will be used at the
     *     end of each name/value pair or array item.
     */
    newline: "\n",
    
    /**
     * Property: level
     * {Integer} For "pretty" printing, this is incremented/decremented during
     *     serialization.
     */
    level: 0,

    /**
     * Property: pretty
     * {Boolean} Serialize with extra whitespace for structure.  This is set
     *     by the <write> method.
     */
    pretty: false,

    /**
     * Property: nativeJSON
     * {Boolean} Does the browser support native json?
     */
    nativeJSON: (function() {
        return !!(window.JSON && typeof JSON.parse == "function" && typeof JSON.stringify == "function");
    })(),

    /**
     * Constructor: OpenLayers.Format.JSON
     * Create a new parser for JSON.
     *
     * Parameters:
     * options - {Object} An optional object whose properties will be set on
     *     this instance.
     */

    /**
     * APIMethod: read
     * Deserialize a json string.
     *
     * Parameters:
     * json - {String} A JSON string
     * filter - {Function} A function which will be called for every key and
     *     value at every level of the final result. Each value will be
     *     replaced by the result of the filter function. This can be used to
     *     reform generic objects into instances of classes, or to transform
     *     date strings into Date objects.
     *     
     * Returns:
     * {Object} An object, array, string, or number .
     */
    read: function(json, filter) {
        var object;
        if (this.nativeJSON) {
            object = JSON.parse(json, filter);
        } else try {
            /**
             * Parsing happens in three stages. In the first stage, we run the
             *     text against a regular expression which looks for non-JSON
             *     characters. We are especially concerned with '()' and 'new'
             *     because they can cause invocation, and '=' because it can
             *     cause mutation. But just to be safe, we will reject all
             *     unexpected characters.
             */
            if (/^[\],:{}\s]*$/.test(json.replace(/\\["\\\/bfnrtu]/g, '@').
                                replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
                                replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

                /**
                 * In the second stage we use the eval function to compile the
                 *     text into a JavaScript structure. The '{' operator is
                 *     subject to a syntactic ambiguity in JavaScript - it can
                 *     begin a block or an object literal. We wrap the text in
                 *     parens to eliminate the ambiguity.
                 */
                object = eval('(' + json + ')');

                /**
                 * In the optional third stage, we recursively walk the new
                 *     structure, passing each name/value pair to a filter
                 *     function for possible transformation.
                 */
                if(typeof filter === 'function') {
                    function walk(k, v) {
                        if(v && typeof v === 'object') {
                            for(var i in v) {
                                if(v.hasOwnProperty(i)) {
                                    v[i] = walk(i, v[i]);
                                }
                            }
                        }
                        return filter(k, v);
                    }
                    object = walk('', object);
                }
            }
        } catch(e) {
            // Fall through if the regexp test fails.
        }

        if(this.keepData) {
            this.data = object;
        }

        return object;
    },

    /**
     * APIMethod: write
     * Serialize an object into a JSON string.
     *
     * Parameters:
     * value - {String} The object, array, string, number, boolean or date
     *     to be serialized.
     * pretty - {Boolean} Structure the output with newlines and indentation.
     *     Default is false.
     *
     * Returns:
     * {String} The JSON string representation of the input value.
     */
    write: function(value, pretty) {
        this.pretty = !!pretty;
        var json = null;
        var type = typeof value;
        if(this.serialize[type]) {
            try {
                json = (!this.pretty && this.nativeJSON) ?
                    JSON.stringify(value) :
                    this.serialize[type].apply(this, [value]);
            } catch(err) {
                OpenLayers.Console.error("Trouble serializing: " + err);
            }
        }
        return json;
    },
    
    /**
     * Method: writeIndent
     * Output an indentation string depending on the indentation level.
     *
     * Returns:
     * {String} An appropriate indentation string.
     */
    writeIndent: function() {
        var pieces = [];
        if(this.pretty) {
            for(var i=0; i<this.level; ++i) {
                pieces.push(this.indent);
            }
        }
        return pieces.join('');
    },
    
    /**
     * Method: writeNewline
     * Output a string representing a newline if in pretty printing mode.
     *
     * Returns:
     * {String} A string representing a new line.
     */
    writeNewline: function() {
        return (this.pretty) ? this.newline : '';
    },
    
    /**
     * Method: writeSpace
     * Output a string representing a space if in pretty printing mode.
     *
     * Returns:
     * {String} A space.
     */
    writeSpace: function() {
        return (this.pretty) ? this.space : '';
    },

    /**
     * Property: serialize
     * Object with properties corresponding to the serializable data types.
     *     Property values are functions that do the actual serializing.
     */
    serialize: {
        /**
         * Method: serialize.object
         * Transform an object into a JSON string.
         *
         * Parameters:
         * object - {Object} The object to be serialized.
         * 
         * Returns:
         * {String} A JSON string representing the object.
         */
        'object': function(object) {
            // three special objects that we want to treat differently
            if(object == null) {
                return "null";
            }
            if(object.constructor == Date) {
                return this.serialize.date.apply(this, [object]);
            }
            if(object.constructor == Array) {
                return this.serialize.array.apply(this, [object]);
            }
            var pieces = ['{'];
            this.level += 1;
            var key, keyJSON, valueJSON;
            
            var addComma = false;
            for(key in object) {
                if(object.hasOwnProperty(key)) {
                    // recursive calls need to allow for sub-classing
                    keyJSON = OpenLayers.Format.JSON.prototype.write.apply(this,
                                                    [key, this.pretty]);
                    valueJSON = OpenLayers.Format.JSON.prototype.write.apply(this,
                                                    [object[key], this.pretty]);
                    if(keyJSON != null && valueJSON != null) {
                        if(addComma) {
                            pieces.push(',');
                        }
                        pieces.push(this.writeNewline(), this.writeIndent(),
                                    keyJSON, ':', this.writeSpace(), valueJSON);
                        addComma = true;
                    }
                }
            }
            
            this.level -= 1;
            pieces.push(this.writeNewline(), this.writeIndent(), '}');
            return pieces.join('');
        },
        
        /**
         * Method: serialize.array
         * Transform an array into a JSON string.
         *
         * Parameters:
         * array - {Array} The array to be serialized
         * 
         * Returns:
         * {String} A JSON string representing the array.
         */
        'array': function(array) {
            var json;
            var pieces = ['['];
            this.level += 1;
    
            for(var i=0, len=array.length; i<len; ++i) {
                // recursive calls need to allow for sub-classing
                json = OpenLayers.Format.JSON.prototype.write.apply(this,
                                                    [array[i], this.pretty]);
                if(json != null) {
                    if(i > 0) {
                        pieces.push(',');
                    }
                    pieces.push(this.writeNewline(), this.writeIndent(), json);
                }
            }

            this.level -= 1;    
            pieces.push(this.writeNewline(), this.writeIndent(), ']');
            return pieces.join('');
        },
        
        /**
         * Method: serialize.string
         * Transform a string into a JSON string.
         *
         * Parameters:
         * string - {String} The string to be serialized
         * 
         * Returns:
         * {String} A JSON string representing the string.
         */
        'string': function(string) {
            // If the string contains no control characters, no quote characters, and no
            // backslash characters, then we can simply slap some quotes around it.
            // Otherwise we must also replace the offending characters with safe
            // sequences.    
            var m = {
                '\b': '\\b',
                '\t': '\\t',
                '\n': '\\n',
                '\f': '\\f',
                '\r': '\\r',
                '"' : '\\"',
                '\\': '\\\\'
            };
            if(/["\\\x00-\x1f]/.test(string)) {
                return '"' + string.replace(/([\x00-\x1f\\"])/g, function(a, b) {
                    var c = m[b];
                    if(c) {
                        return c;
                    }
                    c = b.charCodeAt();
                    return '\\u00' +
                        Math.floor(c / 16).toString(16) +
                        (c % 16).toString(16);
                }) + '"';
            }
            return '"' + string + '"';
        },

        /**
         * Method: serialize.number
         * Transform a number into a JSON string.
         *
         * Parameters:
         * number - {Number} The number to be serialized.
         *
         * Returns:
         * {String} A JSON string representing the number.
         */
        'number': function(number) {
            return isFinite(number) ? String(number) : "null";
        },
        
        /**
         * Method: serialize.boolean
         * Transform a boolean into a JSON string.
         *
         * Parameters:
         * bool - {Boolean} The boolean to be serialized.
         * 
         * Returns:
         * {String} A JSON string representing the boolean.
         */
        'boolean': function(bool) {
            return String(bool);
        },
        
        /**
         * Method: serialize.object
         * Transform a date into a JSON string.
         *
         * Parameters:
         * date - {Date} The date to be serialized.
         * 
         * Returns:
         * {String} A JSON string representing the date.
         */
        'date': function(date) {    
            function format(number) {
                // Format integers to have at least two digits.
                return (number < 10) ? '0' + number : number;
            }
            return '"' + date.getFullYear() + '-' +
                    format(date.getMonth() + 1) + '-' +
                    format(date.getDate()) + 'T' +
                    format(date.getHours()) + ':' +
                    format(date.getMinutes()) + ':' +
                    format(date.getSeconds()) + '"';
        }
    },

    CLASS_NAME: "OpenLayers.Format.JSON" 

});     
/* ======================================================================
    OpenLayers/Format/GeoJSON.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Format/JSON.js
 * @requires OpenLayers/Feature/Vector.js
 * @requires OpenLayers/Geometry/Point.js
 * @requires OpenLayers/Geometry/MultiPoint.js
 * @requires OpenLayers/Geometry/LineString.js
 * @requires OpenLayers/Geometry/MultiLineString.js
 * @requires OpenLayers/Geometry/Polygon.js
 * @requires OpenLayers/Geometry/MultiPolygon.js
 * @requires OpenLayers/Console.js
 */

/**
 * Class: OpenLayers.Format.GeoJSON
 * Read and write GeoJSON. Create a new parser with the
 *     <OpenLayers.Format.GeoJSON> constructor.
 *
 * Inherits from:
 *  - <OpenLayers.Format.JSON>
 */
OpenLayers.Format.GeoJSON = OpenLayers.Class(OpenLayers.Format.JSON, {

    /**
     * APIProperty: ignoreExtraDims
     * {Boolean} Ignore dimensions higher than 2 when reading geometry
     * coordinates.
     */ 
    ignoreExtraDims: false,
    
    /**
     * Constructor: OpenLayers.Format.GeoJSON
     * Create a new parser for GeoJSON.
     *
     * Parameters:
     * options - {Object} An optional object whose properties will be set on
     *     this instance.
     */

    /**
     * APIMethod: read
     * Deserialize a GeoJSON string.
     *
     * Parameters:
     * json - {String} A GeoJSON string
     * type - {String} Optional string that determines the structure of
     *     the output.  Supported values are "Geometry", "Feature", and
     *     "FeatureCollection".  If absent or null, a default of
     *     "FeatureCollection" is assumed.
     * filter - {Function} A function which will be called for every key and
     *     value at every level of the final result. Each value will be
     *     replaced by the result of the filter function. This can be used to
     *     reform generic objects into instances of classes, or to transform
     *     date strings into Date objects.
     *
     * Returns: 
     * {Object} The return depends on the value of the type argument. If type
     *     is "FeatureCollection" (the default), the return will be an array
     *     of <OpenLayers.Feature.Vector>. If type is "Geometry", the input json
     *     must represent a single geometry, and the return will be an
     *     <OpenLayers.Geometry>.  If type is "Feature", the input json must
     *     represent a single feature, and the return will be an
     *     <OpenLayers.Feature.Vector>.
     */
    read: function(json, type, filter) {
        type = (type) ? type : "FeatureCollection";
        var results = null;
        var obj = null;
        if (typeof json == "string") {
            obj = OpenLayers.Format.JSON.prototype.read.apply(this,
                                                              [json, filter]);
        } else { 
            obj = json;
        }    
        if(!obj) {
            OpenLayers.Console.error("Bad JSON: " + json);
        } else if(typeof(obj.type) != "string") {
            OpenLayers.Console.error("Bad GeoJSON - no type: " + json);
        } else if(this.isValidType(obj, type)) {
            switch(type) {
                case "Geometry":
                    try {
                        results = this.parseGeometry(obj);
                    } catch(err) {
                        OpenLayers.Console.error(err);
                    }
                    break;
                case "Feature":
                    try {
                        results = this.parseFeature(obj);
                        results.type = "Feature";
                    } catch(err) {
                        OpenLayers.Console.error(err);
                    }
                    break;
                case "FeatureCollection":
                    // for type FeatureCollection, we allow input to be any type
                    results = [];
                    switch(obj.type) {
                        case "Feature":
                            try {
                                results.push(this.parseFeature(obj));
                            } catch(err) {
                                results = null;
                                OpenLayers.Console.error(err);
                            }
                            break;
                        case "FeatureCollection":
                            for(var i=0, len=obj.features.length; i<len; ++i) {
                                try {
                                    results.push(this.parseFeature(obj.features[i]));
                                } catch(err) {
                                    results = null;
                                    OpenLayers.Console.error(err);
                                }
                            }
                            break;
                        default:
                            try {
                                var geom = this.parseGeometry(obj);
                                results.push(new OpenLayers.Feature.Vector(geom));
                            } catch(err) {
                                results = null;
                                OpenLayers.Console.error(err);
                            }
                    }
                break;
            }
        }
        return results;
    },
    
    /**
     * Method: isValidType
     * Check if a GeoJSON object is a valid representative of the given type.
     *
     * Returns:
     * {Boolean} The object is valid GeoJSON object of the given type.
     */
    isValidType: function(obj, type) {
        var valid = false;
        switch(type) {
            case "Geometry":
                if(OpenLayers.Util.indexOf(
                    ["Point", "MultiPoint", "LineString", "MultiLineString",
                     "Polygon", "MultiPolygon", "Box", "GeometryCollection"],
                    obj.type) == -1) {
                    // unsupported geometry type
                    OpenLayers.Console.error("Unsupported geometry type: " +
                                              obj.type);
                } else {
                    valid = true;
                }
                break;
            case "FeatureCollection":
                // allow for any type to be converted to a feature collection
                valid = true;
                break;
            default:
                // for Feature types must match
                if(obj.type == type) {
                    valid = true;
                } else {
                    OpenLayers.Console.error("Cannot convert types from " +
                                              obj.type + " to " + type);
                }
        }
        return valid;
    },
    
    /**
     * Method: parseFeature
     * Convert a feature object from GeoJSON into an
     *     <OpenLayers.Feature.Vector>.
     *
     * Parameters:
     * obj - {Object} An object created from a GeoJSON object
     *
     * Returns:
     * {<OpenLayers.Feature.Vector>} A feature.
     */
    parseFeature: function(obj) {
        var feature, geometry, attributes, bbox;
        attributes = (obj.properties) ? obj.properties : {};
        bbox = (obj.geometry && obj.geometry.bbox) || obj.bbox;
        try {
            geometry = this.parseGeometry(obj.geometry);
        } catch(err) {
            // deal with bad geometries
            throw err;
        }
        feature = new OpenLayers.Feature.Vector(geometry, attributes);
        if(bbox) {
            feature.bounds = OpenLayers.Bounds.fromArray(bbox);
        }
        if(obj.id) {
            feature.fid = obj.id;
        }
        return feature;
    },
    
    /**
     * Method: parseGeometry
     * Convert a geometry object from GeoJSON into an <OpenLayers.Geometry>.
     *
     * Parameters:
     * obj - {Object} An object created from a GeoJSON object
     *
     * Returns: 
     * {<OpenLayers.Geometry>} A geometry.
     */
    parseGeometry: function(obj) {
        if (obj == null) {
            return null;
        }
        var geometry, collection = false;
        if(obj.type == "GeometryCollection") {
            if(!(OpenLayers.Util.isArray(obj.geometries))) {
                throw "GeometryCollection must have geometries array: " + obj;
            }
            var numGeom = obj.geometries.length;
            var components = new Array(numGeom);
            for(var i=0; i<numGeom; ++i) {
                components[i] = this.parseGeometry.apply(
                    this, [obj.geometries[i]]
                );
            }
            geometry = new OpenLayers.Geometry.Collection(components);
            collection = true;
        } else {
            if(!(OpenLayers.Util.isArray(obj.coordinates))) {
                throw "Geometry must have coordinates array: " + obj;
            }
            if(!this.parseCoords[obj.type.toLowerCase()]) {
                throw "Unsupported geometry type: " + obj.type;
            }
            try {
                geometry = this.parseCoords[obj.type.toLowerCase()].apply(
                    this, [obj.coordinates]
                );
            } catch(err) {
                // deal with bad coordinates
                throw err;
            }
        }
        // We don't reproject collections because the children are reprojected
        // for us when they are created.
        if (this.internalProjection && this.externalProjection && !collection) {
            geometry.transform(this.externalProjection, 
                               this.internalProjection); 
        }                       
        return geometry;
    },
    
    /**
     * Property: parseCoords
     * Object with properties corresponding to the GeoJSON geometry types.
     *     Property values are functions that do the actual parsing.
     */
    parseCoords: {
        /**
         * Method: parseCoords.point
         * Convert a coordinate array from GeoJSON into an
         *     <OpenLayers.Geometry>.
         *
         * Parameters:
         * array - {Object} The coordinates array from the GeoJSON fragment.
         *
         * Returns:
         * {<OpenLayers.Geometry>} A geometry.
         */
        "point": function(array) {
            if (this.ignoreExtraDims == false && 
                  array.length != 2) {
                    throw "Only 2D points are supported: " + array;
            }
            return new OpenLayers.Geometry.Point(array[0], array[1]);
        },
        
        /**
         * Method: parseCoords.multipoint
         * Convert a coordinate array from GeoJSON into an
         *     <OpenLayers.Geometry>.
         *
         * Parameters:
         * array - {Object} The coordinates array from the GeoJSON fragment.
         *
         * Returns:
         * {<OpenLayers.Geometry>} A geometry.
         */
        "multipoint": function(array) {
            var points = [];
            var p = null;
            for(var i=0, len=array.length; i<len; ++i) {
                try {
                    p = this.parseCoords["point"].apply(this, [array[i]]);
                } catch(err) {
                    throw err;
                }
                points.push(p);
            }
            return new OpenLayers.Geometry.MultiPoint(points);
        },

        /**
         * Method: parseCoords.linestring
         * Convert a coordinate array from GeoJSON into an
         *     <OpenLayers.Geometry>.
         *
         * Parameters:
         * array - {Object} The coordinates array from the GeoJSON fragment.
         *
         * Returns:
         * {<OpenLayers.Geometry>} A geometry.
         */
        "linestring": function(array) {
            var points = [];
            var p = null;
            for(var i=0, len=array.length; i<len; ++i) {
                try {
                    p = this.parseCoords["point"].apply(this, [array[i]]);
                } catch(err) {
                    throw err;
                }
                points.push(p);
            }
            return new OpenLayers.Geometry.LineString(points);
        },
        
        /**
         * Method: parseCoords.multilinestring
         * Convert a coordinate array from GeoJSON into an
         *     <OpenLayers.Geometry>.
         *
         * Parameters:
         * array - {Object} The coordinates array from the GeoJSON fragment.
         *
         * Returns:
         * {<OpenLayers.Geometry>} A geometry.
         */
        "multilinestring": function(array) {
            var lines = [];
            var l = null;
            for(var i=0, len=array.length; i<len; ++i) {
                try {
                    l = this.parseCoords["linestring"].apply(this, [array[i]]);
                } catch(err) {
                    throw err;
                }
                lines.push(l);
            }
            return new OpenLayers.Geometry.MultiLineString(lines);
        },
        
        /**
         * Method: parseCoords.polygon
         * Convert a coordinate array from GeoJSON into an
         *     <OpenLayers.Geometry>.
         *
         * Returns:
         * {<OpenLayers.Geometry>} A geometry.
         */
        "polygon": function(array) {
            var rings = [];
            var r, l;
            for(var i=0, len=array.length; i<len; ++i) {
                try {
                    l = this.parseCoords["linestring"].apply(this, [array[i]]);
                } catch(err) {
                    throw err;
                }
                r = new OpenLayers.Geometry.LinearRing(l.components);
                rings.push(r);
            }
            return new OpenLayers.Geometry.Polygon(rings);
        },

        /**
         * Method: parseCoords.multipolygon
         * Convert a coordinate array from GeoJSON into an
         *     <OpenLayers.Geometry>.
         *
         * Parameters:
         * array - {Object} The coordinates array from the GeoJSON fragment.
         *
         * Returns:
         * {<OpenLayers.Geometry>} A geometry.
         */
        "multipolygon": function(array) {
            var polys = [];
            var p = null;
            for(var i=0, len=array.length; i<len; ++i) {
                try {
                    p = this.parseCoords["polygon"].apply(this, [array[i]]);
                } catch(err) {
                    throw err;
                }
                polys.push(p);
            }
            return new OpenLayers.Geometry.MultiPolygon(polys);
        },

        /**
         * Method: parseCoords.box
         * Convert a coordinate array from GeoJSON into an
         *     <OpenLayers.Geometry>.
         *
         * Parameters:
         * array - {Object} The coordinates array from the GeoJSON fragment.
         *
         * Returns:
         * {<OpenLayers.Geometry>} A geometry.
         */
        "box": function(array) {
            if(array.length != 2) {
                throw "GeoJSON box coordinates must have 2 elements";
            }
            return new OpenLayers.Geometry.Polygon([
                new OpenLayers.Geometry.LinearRing([
                    new OpenLayers.Geometry.Point(array[0][0], array[0][1]),
                    new OpenLayers.Geometry.Point(array[1][0], array[0][1]),
                    new OpenLayers.Geometry.Point(array[1][0], array[1][1]),
                    new OpenLayers.Geometry.Point(array[0][0], array[1][1]),
                    new OpenLayers.Geometry.Point(array[0][0], array[0][1])
                ])
            ]);
        }

    },

    /**
     * APIMethod: write
     * Serialize a feature, geometry, array of features into a GeoJSON string.
     *
     * Parameters:
     * obj - {Object} An <OpenLayers.Feature.Vector>, <OpenLayers.Geometry>,
     *     or an array of features.
     * pretty - {Boolean} Structure the output with newlines and indentation.
     *     Default is false.
     *
     * Returns:
     * {String} The GeoJSON string representation of the input geometry,
     *     features, or array of features.
     */
    write: function(obj, pretty) {
        var geojson = {
            "type": null
        };
        if(OpenLayers.Util.isArray(obj)) {
            geojson.type = "FeatureCollection";
            var numFeatures = obj.length;
            geojson.features = new Array(numFeatures);
            for(var i=0; i<numFeatures; ++i) {
                var element = obj[i];
                if(!element instanceof OpenLayers.Feature.Vector) {
                    var msg = "FeatureCollection only supports collections " +
                              "of features: " + element;
                    throw msg;
                }
                geojson.features[i] = this.extract.feature.apply(
                    this, [element]
                );
            }
        } else if (obj.CLASS_NAME.indexOf("OpenLayers.Geometry") == 0) {
            geojson = this.extract.geometry.apply(this, [obj]);
        } else if (obj instanceof OpenLayers.Feature.Vector) {
            geojson = this.extract.feature.apply(this, [obj]);
            if(obj.layer && obj.layer.projection) {
                geojson.crs = this.createCRSObject(obj);
            }
        }
        return OpenLayers.Format.JSON.prototype.write.apply(this,
                                                            [geojson, pretty]);
    },

    /**
     * Method: createCRSObject
     * Create the CRS object for an object.
     *
     * Parameters:
     * object - {<OpenLayers.Feature.Vector>} 
     *
     * Returns:
     * {Object} An object which can be assigned to the crs property
     * of a GeoJSON object.
     */
    createCRSObject: function(object) {
       var proj = object.layer.projection.toString();
       var crs = {};
       if (proj.match(/epsg:/i)) {
           var code = parseInt(proj.substring(proj.indexOf(":") + 1));
           if (code == 4326) {
               crs = {
                   "type": "name",
                   "properties": {
                       "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
                   }
               };
           } else {    
               crs = {
                   "type": "name",
                   "properties": {
                       "name": "EPSG:" + code
                   }
               };
           }    
       }
       return crs;
    },
    
    /**
     * Property: extract
     * Object with properties corresponding to the GeoJSON types.
     *     Property values are functions that do the actual value extraction.
     */
    extract: {
        /**
         * Method: extract.feature
         * Return a partial GeoJSON object representing a single feature.
         *
         * Parameters:
         * feature - {<OpenLayers.Feature.Vector>}
         *
         * Returns:
         * {Object} An object representing the point.
         */
        'feature': function(feature) {
            var geom = this.extract.geometry.apply(this, [feature.geometry]);
            var json = {
                "type": "Feature",
                "properties": feature.attributes,
                "geometry": geom
            };
            if (feature.fid != null) {
                json.id = feature.fid;
            }
            return json;
        },
        
        /**
         * Method: extract.geometry
         * Return a GeoJSON object representing a single geometry.
         *
         * Parameters:
         * geometry - {<OpenLayers.Geometry>}
         *
         * Returns:
         * {Object} An object representing the geometry.
         */
        'geometry': function(geometry) {
            if (geometry == null) {
                return null;
            }
            if (this.internalProjection && this.externalProjection) {
                geometry = geometry.clone();
                geometry.transform(this.internalProjection, 
                                   this.externalProjection);
            }                       
            var geometryType = geometry.CLASS_NAME.split('.')[2];
            var data = this.extract[geometryType.toLowerCase()].apply(this, [geometry]);
            var json;
            if(geometryType == "Collection") {
                json = {
                    "type": "GeometryCollection",
                    "geometries": data
                };
            } else {
                json = {
                    "type": geometryType,
                    "coordinates": data
                };
            }
            
            return json;
        },

        /**
         * Method: extract.point
         * Return an array of coordinates from a point.
         *
         * Parameters:
         * point - {<OpenLayers.Geometry.Point>}
         *
         * Returns: 
         * {Array} An array of coordinates representing the point.
         */
        'point': function(point) {
            return [point.x, point.y];
        },

        /**
         * Method: extract.multipoint
         * Return an array of point coordinates from a multipoint.
         *
         * Parameters:
         * multipoint - {<OpenLayers.Geometry.MultiPoint>}
         *
         * Returns:
         * {Array} An array of point coordinate arrays representing
         *     the multipoint.
         */
        'multipoint': function(multipoint) {
            var array = [];
            for(var i=0, len=multipoint.components.length; i<len; ++i) {
                array.push(this.extract.point.apply(this, [multipoint.components[i]]));
            }
            return array;
        },
        
        /**
         * Method: extract.linestring
         * Return an array of coordinate arrays from a linestring.
         *
         * Parameters:
         * linestring - {<OpenLayers.Geometry.LineString>}
         *
         * Returns:
         * {Array} An array of coordinate arrays representing
         *     the linestring.
         */
        'linestring': function(linestring) {
            var array = [];
            for(var i=0, len=linestring.components.length; i<len; ++i) {
                array.push(this.extract.point.apply(this, [linestring.components[i]]));
            }
            return array;
        },

        /**
         * Method: extract.multilinestring
         * Return an array of linestring arrays from a linestring.
         * 
         * Parameters:
         * multilinestring - {<OpenLayers.Geometry.MultiLineString>}
         * 
         * Returns:
         * {Array} An array of linestring arrays representing
         *     the multilinestring.
         */
        'multilinestring': function(multilinestring) {
            var array = [];
            for(var i=0, len=multilinestring.components.length; i<len; ++i) {
                array.push(this.extract.linestring.apply(this, [multilinestring.components[i]]));
            }
            return array;
        },
        
        /**
         * Method: extract.polygon
         * Return an array of linear ring arrays from a polygon.
         *
         * Parameters:
         * polygon - {<OpenLayers.Geometry.Polygon>}
         * 
         * Returns:
         * {Array} An array of linear ring arrays representing the polygon.
         */
        'polygon': function(polygon) {
            var array = [];
            for(var i=0, len=polygon.components.length; i<len; ++i) {
                array.push(this.extract.linestring.apply(this, [polygon.components[i]]));
            }
            return array;
        },

        /**
         * Method: extract.multipolygon
         * Return an array of polygon arrays from a multipolygon.
         * 
         * Parameters:
         * multipolygon - {<OpenLayers.Geometry.MultiPolygon>}
         * 
         * Returns:
         * {Array} An array of polygon arrays representing
         *     the multipolygon
         */
        'multipolygon': function(multipolygon) {
            var array = [];
            for(var i=0, len=multipolygon.components.length; i<len; ++i) {
                array.push(this.extract.polygon.apply(this, [multipolygon.components[i]]));
            }
            return array;
        },
        
        /**
         * Method: extract.collection
         * Return an array of geometries from a geometry collection.
         * 
         * Parameters:
         * collection - {<OpenLayers.Geometry.Collection>}
         * 
         * Returns:
         * {Array} An array of geometry objects representing the geometry
         *     collection.
         */
        'collection': function(collection) {
            var len = collection.components.length;
            var array = new Array(len);
            for(var i=0; i<len; ++i) {
                array[i] = this.extract.geometry.apply(
                    this, [collection.components[i]]
                );
            }
            return array;
        }
        

    },

    CLASS_NAME: "OpenLayers.Format.GeoJSON" 

});     
/* ======================================================================
    OpenLayers/Format/WKT.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Format.js
 * @requires OpenLayers/Feature/Vector.js
 * @requires OpenLayers/Geometry/Point.js
 * @requires OpenLayers/Geometry/MultiPoint.js
 * @requires OpenLayers/Geometry/LineString.js
 * @requires OpenLayers/Geometry/MultiLineString.js
 * @requires OpenLayers/Geometry/Polygon.js
 * @requires OpenLayers/Geometry/MultiPolygon.js
 */

/**
 * Class: OpenLayers.Format.WKT
 * Class for reading and writing Well-Known Text.  Create a new instance
 * with the <OpenLayers.Format.WKT> constructor.
 * 
 * Inherits from:
 *  - <OpenLayers.Format>
 */
OpenLayers.Format.WKT = OpenLayers.Class(OpenLayers.Format, {
    
    /**
     * Constructor: OpenLayers.Format.WKT
     * Create a new parser for WKT
     *
     * Parameters:
     * options - {Object} An optional object whose properties will be set on
     *           this instance
     *
     * Returns:
     * {<OpenLayers.Format.WKT>} A new WKT parser.
     */
    initialize: function(options) {
        this.regExes = {
            'typeStr': /^\s*(\w+)\s*\(\s*(.*)\s*\)\s*$/,
            'spaces': /\s+/,
            'parenComma': /\)\s*,\s*\(/,
            'doubleParenComma': /\)\s*\)\s*,\s*\(\s*\(/,  // can't use {2} here
            'trimParens': /^\s*\(?(.*?)\)?\s*$/
        };
        OpenLayers.Format.prototype.initialize.apply(this, [options]);
    },

    /**
     * APIMethod: read
     * Deserialize a WKT string and return a vector feature or an
     * array of vector features.  Supports WKT for POINT, MULTIPOINT,
     * LINESTRING, MULTILINESTRING, POLYGON, MULTIPOLYGON, and
     * GEOMETRYCOLLECTION.
     *
     * Parameters:
     * wkt - {String} A WKT string
     *
     * Returns:
     * {<OpenLayers.Feature.Vector>|Array} A feature or array of features for
     * GEOMETRYCOLLECTION WKT.
     */
    read: function(wkt) {
        var features, type, str;
        wkt = wkt.replace(/[\n\r]/g, " ");
        var matches = this.regExes.typeStr.exec(wkt);
        if(matches) {
            type = matches[1].toLowerCase();
            str = matches[2];
            if(this.parse[type]) {
                features = this.parse[type].apply(this, [str]);
            }
            if (this.internalProjection && this.externalProjection) {
                if (features && 
                    features.CLASS_NAME == "OpenLayers.Feature.Vector") {
                    features.geometry.transform(this.externalProjection,
                                                this.internalProjection);
                } else if (features &&
                           type != "geometrycollection" &&
                           typeof features == "object") {
                    for (var i=0, len=features.length; i<len; i++) {
                        var component = features[i];
                        component.geometry.transform(this.externalProjection,
                                                     this.internalProjection);
                    }
                }
            }
        }    
        return features;
    },

    /**
     * APIMethod: write
     * Serialize a feature or array of features into a WKT string.
     *
     * Parameters:
     * features - {<OpenLayers.Feature.Vector>|Array} A feature or array of
     *            features
     *
     * Returns:
     * {String} The WKT string representation of the input geometries
     */
    write: function(features) {
        var collection, geometry, isCollection;
        if (features.constructor == Array) {
            collection = features;
            isCollection = true;
        } else {
            collection = [features];
            isCollection = false;
        }
        var pieces = [];
        if (isCollection) {
            pieces.push('GEOMETRYCOLLECTION(');
        }
        for (var i=0, len=collection.length; i<len; ++i) {
            if (isCollection && i>0) {
                pieces.push(',');
            }
            geometry = collection[i].geometry;
            pieces.push(this.extractGeometry(geometry));
        }
        if (isCollection) {
            pieces.push(')');
        }
        return pieces.join('');
    },

    /**
     * Method: extractGeometry
     * Entry point to construct the WKT for a single Geometry object.
     *
     * Parameters:
     * geometry - {<OpenLayers.Geometry.Geometry>}
     *
     * Returns:
     * {String} A WKT string of representing the geometry
     */
    extractGeometry: function(geometry) {
        var type = geometry.CLASS_NAME.split('.')[2].toLowerCase();
        if (!this.extract[type]) {
            return null;
        }
        if (this.internalProjection && this.externalProjection) {
            geometry = geometry.clone();
            geometry.transform(this.internalProjection, this.externalProjection);
        }                       
        var wktType = type == 'collection' ? 'GEOMETRYCOLLECTION' : type.toUpperCase();
        var data = wktType + '(' + this.extract[type].apply(this, [geometry]) + ')';
        return data;
    },
    
    /**
     * Object with properties corresponding to the geometry types.
     * Property values are functions that do the actual data extraction.
     */
    extract: {
        /**
         * Return a space delimited string of point coordinates.
         * @param {OpenLayers.Geometry.Point} point
         * @returns {String} A string of coordinates representing the point
         */
        'point': function(point) {
            return point.x + ' ' + point.y;
        },

        /**
         * Return a comma delimited string of point coordinates from a multipoint.
         * @param {OpenLayers.Geometry.MultiPoint} multipoint
         * @returns {String} A string of point coordinate strings representing
         *                  the multipoint
         */
        'multipoint': function(multipoint) {
            var array = [];
            for(var i=0, len=multipoint.components.length; i<len; ++i) {
                array.push('(' +
                           this.extract.point.apply(this, [multipoint.components[i]]) +
                           ')');
            }
            return array.join(',');
        },
        
        /**
         * Return a comma delimited string of point coordinates from a line.
         * @param {OpenLayers.Geometry.LineString} linestring
         * @returns {String} A string of point coordinate strings representing
         *                  the linestring
         */
        'linestring': function(linestring) {
            var array = [];
            for(var i=0, len=linestring.components.length; i<len; ++i) {
                array.push(this.extract.point.apply(this, [linestring.components[i]]));
            }
            return array.join(',');
        },

        /**
         * Return a comma delimited string of linestring strings from a multilinestring.
         * @param {OpenLayers.Geometry.MultiLineString} multilinestring
         * @returns {String} A string of of linestring strings representing
         *                  the multilinestring
         */
        'multilinestring': function(multilinestring) {
            var array = [];
            for(var i=0, len=multilinestring.components.length; i<len; ++i) {
                array.push('(' +
                           this.extract.linestring.apply(this, [multilinestring.components[i]]) +
                           ')');
            }
            return array.join(',');
        },
        
        /**
         * Return a comma delimited string of linear ring arrays from a polygon.
         * @param {OpenLayers.Geometry.Polygon} polygon
         * @returns {String} An array of linear ring arrays representing the polygon
         */
        'polygon': function(polygon) {
            var array = [];
            for(var i=0, len=polygon.components.length; i<len; ++i) {
                array.push('(' +
                           this.extract.linestring.apply(this, [polygon.components[i]]) +
                           ')');
            }
            return array.join(',');
        },

        /**
         * Return an array of polygon arrays from a multipolygon.
         * @param {OpenLayers.Geometry.MultiPolygon} multipolygon
         * @returns {String} An array of polygon arrays representing
         *                  the multipolygon
         */
        'multipolygon': function(multipolygon) {
            var array = [];
            for(var i=0, len=multipolygon.components.length; i<len; ++i) {
                array.push('(' +
                           this.extract.polygon.apply(this, [multipolygon.components[i]]) +
                           ')');
            }
            return array.join(',');
        },

        /**
         * Return the WKT portion between 'GEOMETRYCOLLECTION(' and ')' for an <OpenLayers.Geometry.Collection>
         * @param {OpenLayers.Geometry.Collection} collection
         * @returns {String} internal WKT representation of the collection
         */
        'collection': function(collection) {
            var array = [];
            for(var i=0, len=collection.components.length; i<len; ++i) {
                array.push(this.extractGeometry.apply(this, [collection.components[i]]));
            }
            return array.join(',');
        }

    },

    /**
     * Object with properties corresponding to the geometry types.
     * Property values are functions that do the actual parsing.
     */
    parse: {
        /**
         * Return point feature given a point WKT fragment.
         * @param {String} str A WKT fragment representing the point
         * @returns {OpenLayers.Feature.Vector} A point feature
         * @private
         */
        'point': function(str) {
            var coords = OpenLayers.String.trim(str).split(this.regExes.spaces);
            return new OpenLayers.Feature.Vector(
                new OpenLayers.Geometry.Point(coords[0], coords[1])
            );
        },

        /**
         * Return a multipoint feature given a multipoint WKT fragment.
         * @param {String} str A WKT fragment representing the multipoint
         * @returns {OpenLayers.Feature.Vector} A multipoint feature
         * @private
         */
        'multipoint': function(str) {
            var point;
            var points = OpenLayers.String.trim(str).split(',');
            var components = [];
            for(var i=0, len=points.length; i<len; ++i) {
                point = points[i].replace(this.regExes.trimParens, '$1');
                components.push(this.parse.point.apply(this, [point]).geometry);
            }
            return new OpenLayers.Feature.Vector(
                new OpenLayers.Geometry.MultiPoint(components)
            );
        },
        
        /**
         * Return a linestring feature given a linestring WKT fragment.
         * @param {String} str A WKT fragment representing the linestring
         * @returns {OpenLayers.Feature.Vector} A linestring feature
         * @private
         */
        'linestring': function(str) {
            var points = OpenLayers.String.trim(str).split(',');
            var components = [];
            for(var i=0, len=points.length; i<len; ++i) {
                components.push(this.parse.point.apply(this, [points[i]]).geometry);
            }
            return new OpenLayers.Feature.Vector(
                new OpenLayers.Geometry.LineString(components)
            );
        },

        /**
         * Return a multilinestring feature given a multilinestring WKT fragment.
         * @param {String} str A WKT fragment representing the multilinestring
         * @returns {OpenLayers.Feature.Vector} A multilinestring feature
         * @private
         */
        'multilinestring': function(str) {
            var line;
            var lines = OpenLayers.String.trim(str).split(this.regExes.parenComma);
            var components = [];
            for(var i=0, len=lines.length; i<len; ++i) {
                line = lines[i].replace(this.regExes.trimParens, '$1');
                components.push(this.parse.linestring.apply(this, [line]).geometry);
            }
            return new OpenLayers.Feature.Vector(
                new OpenLayers.Geometry.MultiLineString(components)
            );
        },
        
        /**
         * Return a polygon feature given a polygon WKT fragment.
         * @param {String} str A WKT fragment representing the polygon
         * @returns {OpenLayers.Feature.Vector} A polygon feature
         * @private
         */
        'polygon': function(str) {
            var ring, linestring, linearring;
            var rings = OpenLayers.String.trim(str).split(this.regExes.parenComma);
            var components = [];
            for(var i=0, len=rings.length; i<len; ++i) {
                ring = rings[i].replace(this.regExes.trimParens, '$1');
                linestring = this.parse.linestring.apply(this, [ring]).geometry;
                linearring = new OpenLayers.Geometry.LinearRing(linestring.components);
                components.push(linearring);
            }
            return new OpenLayers.Feature.Vector(
                new OpenLayers.Geometry.Polygon(components)
            );
        },

        /**
         * Return a multipolygon feature given a multipolygon WKT fragment.
         * @param {String} str A WKT fragment representing the multipolygon
         * @returns {OpenLayers.Feature.Vector} A multipolygon feature
         * @private
         */
        'multipolygon': function(str) {
            var polygon;
            var polygons = OpenLayers.String.trim(str).split(this.regExes.doubleParenComma);
            var components = [];
            for(var i=0, len=polygons.length; i<len; ++i) {
                polygon = polygons[i].replace(this.regExes.trimParens, '$1');
                components.push(this.parse.polygon.apply(this, [polygon]).geometry);
            }
            return new OpenLayers.Feature.Vector(
                new OpenLayers.Geometry.MultiPolygon(components)
            );
        },

        /**
         * Return an array of features given a geometrycollection WKT fragment.
         * @param {String} str A WKT fragment representing the geometrycollection
         * @returns {Array} An array of OpenLayers.Feature.Vector
         * @private
         */
        'geometrycollection': function(str) {
            // separate components of the collection with |
            str = str.replace(/,\s*([A-Za-z])/g, '|$1');
            var wktArray = OpenLayers.String.trim(str).split('|');
            var components = [];
            for(var i=0, len=wktArray.length; i<len; ++i) {
                components.push(OpenLayers.Format.WKT.prototype.read.apply(this,[wktArray[i]]));
            }
            return components;
        }

    },

    CLASS_NAME: "OpenLayers.Format.WKT" 
});     
/* ======================================================================
    OpenLayers/Events.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


/**
 * @requires OpenLayers/Util.js
 */

/**
 * Namespace: OpenLayers.Event
 * Utility functions for event handling.
 */
OpenLayers.Event = {

    /** 
     * Property: observers 
     * {Object} A hashtable cache of the event observers. Keyed by
     * element._eventCacheID 
     */
    observers: false,

    /**
     * Constant: KEY_SPACE
     * {int}
     */
    KEY_SPACE: 32,
    
    /** 
     * Constant: KEY_BACKSPACE 
     * {int} 
     */
    KEY_BACKSPACE: 8,

    /** 
     * Constant: KEY_TAB 
     * {int} 
     */
    KEY_TAB: 9,

    /** 
     * Constant: KEY_RETURN 
     * {int} 
     */
    KEY_RETURN: 13,

    /** 
     * Constant: KEY_ESC 
     * {int} 
     */
    KEY_ESC: 27,

    /** 
     * Constant: KEY_LEFT 
     * {int} 
     */
    KEY_LEFT: 37,

    /** 
     * Constant: KEY_UP 
     * {int} 
     */
    KEY_UP: 38,

    /** 
     * Constant: KEY_RIGHT 
     * {int} 
     */
    KEY_RIGHT: 39,

    /** 
     * Constant: KEY_DOWN 
     * {int} 
     */
    KEY_DOWN: 40,

    /** 
     * Constant: KEY_DELETE 
     * {int} 
     */
    KEY_DELETE: 46,


    /**
     * Method: element
     * Cross browser event element detection.
     * 
     * Parameters:
     * event - {Event} 
     * 
     * Returns:
     * {DOMElement} The element that caused the event 
     */
    element: function(event) {
        return event.target || event.srcElement;
    },

    /**
     * Method: isSingleTouch
     * Determine whether event was caused by a single touch
     *
     * Parameters:
     * event - {Event}
     *
     * Returns:
     * {Boolean}
     */
    isSingleTouch: function(event) {
        return event.touches && event.touches.length == 1;
    },

    /**
     * Method: isMultiTouch
     * Determine whether event was caused by a multi touch
     *
     * Parameters:
     * event - {Event}
     *
     * Returns:
     * {Boolean}
     */
    isMultiTouch: function(event) {
        return event.touches && event.touches.length > 1;
    },

    /**
     * Method: isLeftClick
     * Determine whether event was caused by a left click. 
     *
     * Parameters:
     * event - {Event} 
     * 
     * Returns:
     * {Boolean}
     */
    isLeftClick: function(event) {
        return (((event.which) && (event.which == 1)) ||
                ((event.button) && (event.button == 1)));
    },

    /**
     * Method: isRightClick
     * Determine whether event was caused by a right mouse click. 
     *
     * Parameters:
     * event - {Event} 
     * 
     * Returns:
     * {Boolean}
     */
     isRightClick: function(event) {
        return (((event.which) && (event.which == 3)) ||
                ((event.button) && (event.button == 2)));
    },
     
    /**
     * Method: stop
     * Stops an event from propagating. 
     *
     * Parameters: 
     * event - {Event} 
     * allowDefault - {Boolean} If true, we stop the event chain but 
     *     still allow the default browser behaviour (text selection,
     *     radio-button clicking, etc).  Default is false.
     */
    stop: function(event, allowDefault) {
        
        if (!allowDefault) { 
            OpenLayers.Event.preventDefault(event);
        }
                
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    },

    /**
     * Method: preventDefault
     * Cancels the event if it is cancelable, without stopping further
     * propagation of the event.
     *
     * Parameters:
     * event - {Event}
     */
    preventDefault: function(event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    },

    /** 
     * Method: findElement
     * 
     * Parameters:
     * event - {Event} 
     * tagName - {String} 
     * 
     * Returns:
     * {DOMElement} The first node with the given tagName, starting from the
     * node the event was triggered on and traversing the DOM upwards
     */
    findElement: function(event, tagName) {
        var element = OpenLayers.Event.element(event);
        while (element.parentNode && (!element.tagName ||
              (element.tagName.toUpperCase() != tagName.toUpperCase()))){
            element = element.parentNode;
        }
        return element;
    },

    /** 
     * Method: observe
     * 
     * Parameters:
     * elementParam - {DOMElement || String} 
     * name - {String} 
     * observer - {function} 
     * useCapture - {Boolean} 
     */
    observe: function(elementParam, name, observer, useCapture) {
        var element = OpenLayers.Util.getElement(elementParam);
        useCapture = useCapture || false;

        if (name == 'keypress' &&
           (navigator.appVersion.match(/Konqueror|Safari|KHTML/)
           || element.attachEvent)) {
            name = 'keydown';
        }

        //if observers cache has not yet been created, create it
        if (!this.observers) {
            this.observers = {};
        }

        //if not already assigned, make a new unique cache ID
        if (!element._eventCacheID) {
            var idPrefix = "eventCacheID_";
            if (element.id) {
                idPrefix = element.id + "_" + idPrefix;
            }
            element._eventCacheID = OpenLayers.Util.createUniqueID(idPrefix);
        }

        var cacheID = element._eventCacheID;

        //if there is not yet a hash entry for this element, add one
        if (!this.observers[cacheID]) {
            this.observers[cacheID] = [];
        }

        //add a new observer to this element's list
        this.observers[cacheID].push({
            'element': element,
            'name': name,
            'observer': observer,
            'useCapture': useCapture
        });

        //add the actual browser event listener
        if (element.addEventListener) {
            element.addEventListener(name, observer, useCapture);
        } else if (element.attachEvent) {
            element.attachEvent('on' + name, observer);
        }
    },

    /** 
     * Method: stopObservingElement
     * Given the id of an element to stop observing, cycle through the 
     *   element's cached observers, calling stopObserving on each one, 
     *   skipping those entries which can no longer be removed.
     * 
     * parameters:
     * elementParam - {DOMElement || String} 
     */
    stopObservingElement: function(elementParam) {
        var element = OpenLayers.Util.getElement(elementParam);
        var cacheID = element._eventCacheID;

        this._removeElementObservers(OpenLayers.Event.observers[cacheID]);
    },

    /**
     * Method: _removeElementObservers
     *
     * Parameters:
     * elementObservers - {Array(Object)} Array of (element, name, 
     *                                         observer, usecapture) objects, 
     *                                         taken directly from hashtable
     */
    _removeElementObservers: function(elementObservers) {
        if (elementObservers) {
            for(var i = elementObservers.length-1; i >= 0; i--) {
                var entry = elementObservers[i];
                OpenLayers.Event.stopObserving.apply(this, [
                    entry.element, entry.name, entry.observer, entry.useCapture
                ]);
            }
        }
    },

    /**
     * Method: stopObserving
     * 
     * Parameters:
     * elementParam - {DOMElement || String} 
     * name - {String} 
     * observer - {function} 
     * useCapture - {Boolean} 
     *  
     * Returns:
     * {Boolean} Whether or not the event observer was removed
     */
    stopObserving: function(elementParam, name, observer, useCapture) {
        useCapture = useCapture || false;
    
        var element = OpenLayers.Util.getElement(elementParam);
        var cacheID = element._eventCacheID;

        if (name == 'keypress') {
            if ( navigator.appVersion.match(/Konqueror|Safari|KHTML/) || 
                 element.detachEvent) {
              name = 'keydown';
            }
        }

        // find element's entry in this.observers cache and remove it
        var foundEntry = false;
        var elementObservers = OpenLayers.Event.observers[cacheID];
        if (elementObservers) {
    
            // find the specific event type in the element's list
            var i=0;
            while(!foundEntry && i < elementObservers.length) {
                var cacheEntry = elementObservers[i];
    
                if ((cacheEntry.name == name) &&
                    (cacheEntry.observer == observer) &&
                    (cacheEntry.useCapture == useCapture)) {
    
                    elementObservers.splice(i, 1);
                    if (elementObservers.length == 0) {
                        delete OpenLayers.Event.observers[cacheID];
                    }
                    foundEntry = true;
                    break; 
                }
                i++;           
            }
        }
    
        //actually remove the event listener from browser
        if (foundEntry) {
            if (element.removeEventListener) {
                element.removeEventListener(name, observer, useCapture);
            } else if (element && element.detachEvent) {
                element.detachEvent('on' + name, observer);
            }
        }
        return foundEntry;
    },
    
    /** 
     * Method: unloadCache
     * Cycle through all the element entries in the events cache and call
     *   stopObservingElement on each. 
     */
    unloadCache: function() {
        // check for OpenLayers.Event before checking for observers, because
        // OpenLayers.Event may be undefined in IE if no map instance was
        // created
        if (OpenLayers.Event && OpenLayers.Event.observers) {
            for (var cacheID in OpenLayers.Event.observers) {
                var elementObservers = OpenLayers.Event.observers[cacheID];
                OpenLayers.Event._removeElementObservers.apply(this, 
                                                           [elementObservers]);
            }
            OpenLayers.Event.observers = false;
        }
    },

    CLASS_NAME: "OpenLayers.Event"
};

/* prevent memory leaks in IE */
OpenLayers.Event.observe(window, 'unload', OpenLayers.Event.unloadCache, false);

/**
 * Class: OpenLayers.Events
 */
OpenLayers.Events = OpenLayers.Class({

    /** 
     * Constant: BROWSER_EVENTS
     * {Array(String)} supported events 
     */
    BROWSER_EVENTS: [
        "mouseover", "mouseout",
        "mousedown", "mouseup", "mousemove", 
        "click", "dblclick", "rightclick", "dblrightclick",
        "resize", "focus", "blur",
        "touchstart", "touchmove", "touchend",
        "keydown"
    ],

    /** 
     * Property: listeners 
     * {Object} Hashtable of Array(Function): events listener functions  
     */
    listeners: null,

    /** 
     * Property: object 
     * {Object}  the code object issuing application events 
     */
    object: null,

    /** 
     * Property: element 
     * {DOMElement}  the DOM element receiving browser events 
     */
    element: null,

    /** 
     * Property: eventHandler 
     * {Function}  bound event handler attached to elements 
     */
    eventHandler: null,

    /** 
     * APIProperty: fallThrough 
     * {Boolean} 
     */
    fallThrough: null,

    /** 
     * APIProperty: includeXY
     * {Boolean} Should the .xy property automatically be created for browser
     *    mouse events? In general, this should be false. If it is true, then
     *    mouse events will automatically generate a '.xy' property on the 
     *    event object that is passed. (Prior to OpenLayers 2.7, this was true
     *    by default.) Otherwise, you can call the getMousePosition on the
     *    relevant events handler on the object available via the 'evt.object'
     *    property of the evt object. So, for most events, you can call:
     *    function named(evt) { 
     *        this.xy = this.object.events.getMousePosition(evt) 
     *    } 
     *
     *    This option typically defaults to false for performance reasons:
     *    when creating an events object whose primary purpose is to manage
     *    relatively positioned mouse events within a div, it may make
     *    sense to set it to true.
     *
     *    This option is also used to control whether the events object caches
     *    offsets. If this is false, it will not: the reason for this is that
     *    it is only expected to be called many times if the includeXY property
     *    is set to true. If you set this to true, you are expected to clear 
     *    the offset cache manually (using this.clearMouseCache()) if:
     *        the border of the element changes
     *        the location of the element in the page changes
    */
    includeXY: false,      
    
    /**
     * APIProperty: extensions
     * {Object} Event extensions registered with this instance. Keys are
     *     event types, values are {OpenLayers.Events.*} extension instances or
     *     {Boolean} for events that an instantiated extension provides in
     *     addition to the one it was created for.
     *
     * Extensions create an event in addition to browser events, which usually
     * fires when a sequence of browser events is completed. Extensions are
     * automatically instantiated when a listener is registered for an event
     * provided by an extension.
     *
     * Extensions are created in the <OpenLayers.Events> namespace using
     * <OpenLayers.Class>, and named after the event they provide.
     * The constructor receives the target <OpenLayers.Events> instance as
     * argument. Extensions that need to capture browser events before they
     * propagate can register their listeners events using <register>, with
     * {extension: true} as 4th argument.
     *
     * If an extension creates more than one event, an alias for each event
     * type should be created and reference the same class. The constructor
     * should set a reference in the target's extensions registry to itself.
     *
     * Below is a minimal extension that provides the "foostart" and "fooend"
     * event types, which replace the native "click" event type if clicked on
     * an element with the css class "foo":
     *
     * (code)
     *   OpenLayers.Events.foostart = OpenLayers.Class({
     *       initialize: function(target) {
     *           this.target = target;
     *           this.target.register("click", this, this.doStuff, {extension: true});
     *           // only required if extension provides more than one event type
     *           this.target.extensions["foostart"] = true;
     *           this.target.extensions["fooend"] = true;
     *       },
     *       destroy: function() {
     *           var target = this.target;
     *           target.unregister("click", this, this.doStuff);
     *           delete this.target;
     *           // only required if extension provides more than one event type
     *           delete target.extensions["foostart"];
     *           delete target.extensions["fooend"];
     *       },
     *       doStuff: function(evt) {
     *           var propagate = true;
     *           if (OpenLayers.Event.element(evt).className === "foo") {
     *               propagate = false;
     *               var target = this.target;
     *               target.triggerEvent("foostart");
     *               window.setTimeout(function() {
     *                   target.triggerEvent("fooend");
     *               }, 1000);
     *           }
     *           return propagate;
     *       }
     *   });
     *   // only required if extension provides more than one event type
     *   OpenLayers.Events.fooend = OpenLayers.Events.foostart;
     * (end)
     * 
     */
    extensions: null,
    
    /**
     * Property: extensionCount
     * {Object} Keys are event types (like in <listeners>), values are the
     *     number of extension listeners for each event type.
     */
    extensionCount: null,

    /**
     * Method: clearMouseListener
     * A version of <clearMouseCache> that is bound to this instance so that
     *     it can be used with <OpenLayers.Event.observe> and
     *     <OpenLayers.Event.stopObserving>.
     */
    clearMouseListener: null,

    /**
     * Constructor: OpenLayers.Events
     * Construct an OpenLayers.Events object.
     *
     * Parameters:
     * object - {Object} The js object to which this Events object  is being added
     * element - {DOMElement} A dom element to respond to browser events
     * eventTypes - {Array(String)} Deprecated.  Array of custom application
     *     events.  A listener may be registered for any named event, regardless
     *     of the values provided here.
     * fallThrough - {Boolean} Allow events to fall through after these have
     *                         been handled?
     * options - {Object} Options for the events object.
     */
    initialize: function (object, element, eventTypes, fallThrough, options) {
        OpenLayers.Util.extend(this, options);
        this.object     = object;
        this.fallThrough = fallThrough;
        this.listeners  = {};
        this.extensions = {};
        this.extensionCount = {};
        this._msTouches = [];
        
        // if a dom element is specified, add a listeners list 
        // for browser events on the element and register them
        if (element != null) {
            this.attachToElement(element);
        }
    },

    /**
     * APIMethod: destroy
     */
    destroy: function () {
        for (var e in this.extensions) {
            if (typeof this.extensions[e] !== "boolean") {
                this.extensions[e].destroy();
            }
        }
        this.extensions = null;
        if (this.element) {
            OpenLayers.Event.stopObservingElement(this.element);
            if(this.element.hasScrollEvent) {
                OpenLayers.Event.stopObserving(
                    window, "scroll", this.clearMouseListener
                );
            }
        }
        this.element = null;

        this.listeners = null;
        this.object = null;
        this.fallThrough = null;
        this.eventHandler = null;
    },

    /**
     * APIMethod: addEventType
     * Deprecated.  Any event can be triggered without adding it first.
     * 
     * Parameters:
     * eventName - {String}
     */
    addEventType: function(eventName) {
    },

    /**
     * Method: attachToElement
     *
     * Parameters:
     * element - {HTMLDOMElement} a DOM element to attach browser events to
     */
    attachToElement: function (element) {
        if (this.element) {
            OpenLayers.Event.stopObservingElement(this.element);
        } else {
            // keep a bound copy of handleBrowserEvent() so that we can
            // pass the same function to both Event.observe() and .stopObserving()
            this.eventHandler = OpenLayers.Function.bindAsEventListener(
                this.handleBrowserEvent, this
            );
            
            // to be used with observe and stopObserving
            this.clearMouseListener = OpenLayers.Function.bind(
                this.clearMouseCache, this
            );
        }
        this.element = element;
        var msTouch = !!window.navigator.msMaxTouchPoints;
        var type;
        for (var i = 0, len = this.BROWSER_EVENTS.length; i < len; i++) {
            type = this.BROWSER_EVENTS[i];
            // register the event cross-browser
            OpenLayers.Event.observe(element, type, this.eventHandler
            );
            if (msTouch && type.indexOf('touch') === 0) {
                this.addMsTouchListener(element, type, this.eventHandler);
            }
        }
        // disable dragstart in IE so that mousedown/move/up works normally
        OpenLayers.Event.observe(element, "dragstart", OpenLayers.Event.stop);
    },
    
    /**
     * APIMethod: on
     * Convenience method for registering listeners with a common scope.
     *     Internally, this method calls <register> as shown in the examples
     *     below.
     *
     * Example use:
     * (code)
     * // register a single listener for the "loadstart" event
     * events.on({"loadstart": loadStartListener});
     *
     * // this is equivalent to the following
     * events.register("loadstart", undefined, loadStartListener);
     *
     * // register multiple listeners to be called with the same `this` object
     * events.on({
     *     "loadstart": loadStartListener,
     *     "loadend": loadEndListener,
     *     scope: object
     * });
     *
     * // this is equivalent to the following
     * events.register("loadstart", object, loadStartListener);
     * events.register("loadend", object, loadEndListener);
     * (end)
     *
     * Parameters:
     *  object - {Object}     
     */
    on: function(object) {
        for(var type in object) {
            if(type != "scope" && object.hasOwnProperty(type)) {
                this.register(type, object.scope, object[type]);
            }
        }
    },

    /**
     * APIMethod: register
     * Register an event on the events object.
     *
     * When the event is triggered, the 'func' function will be called, in the
     * context of 'obj'. Imagine we were to register an event, specifying an 
     * OpenLayers.Bounds Object as 'obj'. When the event is triggered, the 
     * context in the callback function will be our Bounds object. This means
     * that within our callback function, we can access the properties and 
     * methods of the Bounds object through the "this" variable. So our 
     * callback could execute something like: 
     * :    leftStr = "Left: " + this.left;
     *   
     *                   or
     *  
     * :    centerStr = "Center: " + this.getCenterLonLat();
     *
     * Parameters:
     * type - {String} Name of the event to register
     * obj - {Object} The object to bind the context to for the callback#.
     *     If no object is specified, default is the Events's 'object' property.
     * func - {Function} The callback function. If no callback is 
     *     specified, this function does nothing.
     * priority - {Boolean|Object} If true, adds the new listener to the
     *     *front* of the events queue instead of to the end.
     *
     * Valid options for priority:
     * extension - {Boolean} If true, then the event will be registered as
     *     extension event. Extension events are handled before all other
     *     events.
     */
    register: function (type, obj, func, priority) {
        if (type in OpenLayers.Events && !this.extensions[type]) {
            this.extensions[type] = new OpenLayers.Events[type](this);
        }
        if (func != null) {
            if (obj == null)  {
                obj = this.object;
            }
            var listeners = this.listeners[type];
            if (!listeners) {
                listeners = [];
                this.listeners[type] = listeners;
                this.extensionCount[type] = 0;
            }
            var listener = {obj: obj, func: func};
            if (priority) {
                listeners.splice(this.extensionCount[type], 0, listener);
                if (typeof priority === "object" && priority.extension) {
                    this.extensionCount[type]++;
                }
            } else {
                listeners.push(listener);
            }
        }
    },

    /**
     * APIMethod: registerPriority
     * Same as register() but adds the new listener to the *front* of the
     *     events queue instead of to the end.
     *    
     *     TODO: get rid of this in 3.0 - Decide whether listeners should be 
     *     called in the order they were registered or in reverse order.
     *
     *
     * Parameters:
     * type - {String} Name of the event to register
     * obj - {Object} The object to bind the context to for the callback#.
     *                If no object is specified, default is the Events's 
     *                'object' property.
     * func - {Function} The callback function. If no callback is 
     *                   specified, this function does nothing.
     */
    registerPriority: function (type, obj, func) {
        this.register(type, obj, func, true);
    },
    
    /**
     * APIMethod: un
     * Convenience method for unregistering listeners with a common scope.
     *     Internally, this method calls <unregister> as shown in the examples
     *     below.
     *
     * Example use:
     * (code)
     * // unregister a single listener for the "loadstart" event
     * events.un({"loadstart": loadStartListener});
     *
     * // this is equivalent to the following
     * events.unregister("loadstart", undefined, loadStartListener);
     *
     * // unregister multiple listeners with the same `this` object
     * events.un({
     *     "loadstart": loadStartListener,
     *     "loadend": loadEndListener,
     *     scope: object
     * });
     *
     * // this is equivalent to the following
     * events.unregister("loadstart", object, loadStartListener);
     * events.unregister("loadend", object, loadEndListener);
     * (end)
     */
    un: function(object) {
        for(var type in object) {
            if(type != "scope" && object.hasOwnProperty(type)) {
                this.unregister(type, object.scope, object[type]);
            }
        }
    },

    /**
     * APIMethod: unregister
     *
     * Parameters:
     * type - {String} 
     * obj - {Object} If none specified, defaults to this.object
     * func - {Function} 
     */
    unregister: function (type, obj, func) {
        if (obj == null)  {
            obj = this.object;
        }
        var listeners = this.listeners[type];
        if (listeners != null) {
            for (var i=0, len=listeners.length; i<len; i++) {
                if (listeners[i].obj == obj && listeners[i].func == func) {
                    listeners.splice(i, 1);
                    break;
                }
            }
        }
    },

    /** 
     * Method: remove
     * Remove all listeners for a given event type. If type is not registered,
     *     does nothing.
     *
     * Parameters:
     * type - {String} 
     */
    remove: function(type) {
        if (this.listeners[type] != null) {
            this.listeners[type] = [];
        }
    },

    /**
     * APIMethod: triggerEvent
     * Trigger a specified registered event.  
     * 
     * Parameters:
     * type - {String} 
     * evt - {Event || Object} will be passed to the listeners.
     *
     * Returns:
     * {Boolean} The last listener return.  If a listener returns false, the
     *     chain of listeners will stop getting called.
     */
    triggerEvent: function (type, evt) {
        var listeners = this.listeners[type];

        // fast path
        if(!listeners || listeners.length == 0) {
            return undefined;
        }

        // prep evt object with object & div references
        if (evt == null) {
            evt = {};
        }
        evt.object = this.object;
        evt.element = this.element;
        if(!evt.type) {
            evt.type = type;
        }
    
        // execute all callbacks registered for specified type
        // get a clone of the listeners array to
        // allow for splicing during callbacks
        listeners = listeners.slice();
        var continueChain;
        for (var i=0, len=listeners.length; i<len; i++) {
            var callback = listeners[i];
            // bind the context to callback.obj
            continueChain = callback.func.apply(callback.obj, [evt]);

            if ((continueChain != undefined) && (continueChain == false)) {
                // if callback returns false, execute no more callbacks.
                break;
            }
        }
        // don't fall through to other DOM elements
        if (!this.fallThrough) {           
            OpenLayers.Event.stop(evt, true);
        }
        return continueChain;
    },

    /**
     * Method: handleBrowserEvent
     * Basically just a wrapper to the triggerEvent() function, but takes 
     *     care to set a property 'xy' on the event with the current mouse 
     *     position.
     *
     * Parameters:
     * evt - {Event} 
     */
    handleBrowserEvent: function (evt) {
        var type = evt.type, listeners = this.listeners[type];
        if(!listeners || listeners.length == 0) {
            // noone's listening, bail out
            return;
        }
        // add clientX & clientY to all events - corresponds to average x, y
        var touches = evt.touches;
        if (touches && touches[0]) {
            var x = 0;
            var y = 0;
            var num = touches.length;
            var touch;
            for (var i=0; i<num; ++i) {
                touch = this.getTouchClientXY(touches[i]);
                x += touch.clientX;
                y += touch.clientY;
            }
            evt.clientX = x / num;
            evt.clientY = y / num;
        }
        if (this.includeXY) {
            evt.xy = this.getMousePosition(evt);
        } 
        this.triggerEvent(type, evt);
    },
    
    /**
     * Method: getTouchClientXY
     * WebKit has a few bugs for clientX/clientY. This method detects them
     * and calculate the correct values.
     *
     * Parameters:
     * evt - {Touch} a Touch object from a TouchEvent
     * 
     * Returns:
     * {Object} An object with only clientX and clientY properties with the
     * calculated values.
     */
    getTouchClientXY: function (evt) {
        // olMochWin is to override window, used for testing
        var win = window.olMockWin || window,
            winPageX = win.pageXOffset,
            winPageY = win.pageYOffset,
            x = evt.clientX,
            y = evt.clientY;
        
        if (evt.pageY === 0 && Math.floor(y) > Math.floor(evt.pageY) ||
            evt.pageX === 0 && Math.floor(x) > Math.floor(evt.pageX)) {
            // iOS4 include scroll offset in clientX/Y
            x = x - winPageX;
            y = y - winPageY;
        } else if (y < (evt.pageY - winPageY) || x < (evt.pageX - winPageX) ) {
            // Some Android browsers have totally bogus values for clientX/Y
            // when scrolling/zooming a page
            x = evt.pageX - winPageX;
            y = evt.pageY - winPageY;
        }
        
        evt.olClientX = x;
        evt.olClientY = y;
        
        return {
            clientX: x,
            clientY: y
        };
    },
    
    /**
     * APIMethod: clearMouseCache
     * Clear cached data about the mouse position. This should be called any 
     *     time the element that events are registered on changes position 
     *     within the page.
     */
    clearMouseCache: function() { 
        this.element.scrolls = null;
        this.element.lefttop = null;
        this.element.offsets = null;
    },      

    /**
     * Method: getMousePosition
     * 
     * Parameters:
     * evt - {Event} 
     * 
     * Returns:
     * {<OpenLayers.Pixel>} The current xy coordinate of the mouse, adjusted
     *                      for offsets
     */
    getMousePosition: function (evt) {
        if (!this.includeXY) {
            this.clearMouseCache();
        } else if (!this.element.hasScrollEvent) {
            OpenLayers.Event.observe(window, "scroll", this.clearMouseListener);
            this.element.hasScrollEvent = true;
        }
        
        if (!this.element.scrolls) {
            var viewportElement = OpenLayers.Util.getViewportElement();
            this.element.scrolls = [
                window.pageXOffset || viewportElement.scrollLeft,
                window.pageYOffset || viewportElement.scrollTop
            ];
        }

        if (!this.element.lefttop) {
            this.element.lefttop = [
                (document.documentElement.clientLeft || 0),
                (document.documentElement.clientTop  || 0)
            ];
        }
        
        if (!this.element.offsets) {
            this.element.offsets = OpenLayers.Util.pagePosition(this.element);
        }

        return new OpenLayers.Pixel(
            (evt.clientX + this.element.scrolls[0]) - this.element.offsets[0]
                         - this.element.lefttop[0], 
            (evt.clientY + this.element.scrolls[1]) - this.element.offsets[1]
                         - this.element.lefttop[1]
        ); 
    },

    /**
     * Method: addMsTouchListener
     *
     * Parameters:
     * element - {DOMElement} The DOM element to register the listener on
     * type - {String} The event type
     * handler - {Function} the handler
     */
    addMsTouchListener: function (element, type, handler) {
        var eventHandler = this.eventHandler;
        var touches = this._msTouches;

        function msHandler(evt) {
            handler(OpenLayers.Util.applyDefaults({
                stopPropagation: function() {
                    for (var i=touches.length-1; i>=0; --i) {
                        touches[i].stopPropagation();
                    }
                },
                preventDefault: function() {
                    for (var i=touches.length-1; i>=0; --i) {
                        touches[i].preventDefault();
                    }
                },
                type: type
            }, evt));
        }

        switch (type) {
            case 'touchstart':
                return this.addMsTouchListenerStart(element, type, msHandler);
            case 'touchend':
                return this.addMsTouchListenerEnd(element, type, msHandler);
            case 'touchmove':
                return this.addMsTouchListenerMove(element, type, msHandler);
            default:
                throw 'Unknown touch event type';
        }
    },

    /**
     * Method: addMsTouchListenerStart
     *
     * Parameters:
     * element - {DOMElement} The DOM element to register the listener on
     * type - {String} The event type
     * handler - {Function} the handler
     */
    addMsTouchListenerStart: function(element, type, handler) {
        var touches = this._msTouches;

        var cb = function(e) {

            var alreadyInArray = false;
            for (var i=0, ii=touches.length; i<ii; ++i) {
                if (touches[i].pointerId == e.pointerId) {
                    alreadyInArray = true;
                    break;
                }
            }
            if (!alreadyInArray) {
                touches.push(e);
            }

            e.touches = touches.slice();
            handler(e);
        };

        OpenLayers.Event.observe(element, 'MSPointerDown', cb);
        
        // the pointerId only needs to be removed from the _msTouches array
        // when the pointer has left its element
        var internalCb = function (e) {
            var up = false;
            for (var i = 0, ii = touches.length; i < ii; ++i) {
                if (touches[i].pointerId == e.pointerId) {
                    if (this.clientWidth != 0 && this.clientHeight != 0) {
                        if ((Math.ceil(e.clientX) >= this.clientWidth || Math.ceil(e.clientY) >= this.clientHeight)) {
                            touches.splice(i, 1);
                        }
                    }
                    break;
                }
            }
        };
        OpenLayers.Event.observe(element, 'MSPointerOut', internalCb);
    },

    /**
     * Method: addMsTouchListenerMove
     *
     * Parameters:
     * element - {DOMElement} The DOM element to register the listener on
     * type - {String} The event type
     * handler - {Function} the handler
     */
    addMsTouchListenerMove: function (element, type, handler) {
        var touches = this._msTouches;
        var cb = function(e) {

            //Don't fire touch moves when mouse isn't down
            if (e.pointerType == e.MSPOINTER_TYPE_MOUSE && e.buttons == 0) {
                return;
            }

            if (touches.length == 1 && touches[0].pageX == e.pageX &&
                    touches[0].pageY == e.pageY) {
                // don't trigger event when pointer has not moved
                return;
            }
            for (var i=0, ii=touches.length; i<ii; ++i) {
                if (touches[i].pointerId == e.pointerId) {
                    touches[i] = e;
                    break;
                }
            }

            e.touches = touches.slice();
            handler(e);
        };

        OpenLayers.Event.observe(element, 'MSPointerMove', cb);
    },

    /**
     * Method: addMsTouchListenerEnd
     *
     * Parameters:
     * element - {DOMElement} The DOM element to register the listener on
     * type - {String} The event type
     * handler - {Function} the handler
     */
    addMsTouchListenerEnd: function (element, type, handler) {
        var touches = this._msTouches;

        var cb = function(e) {

            for (var i=0, ii=touches.length; i<ii; ++i) {
                if (touches[i].pointerId == e.pointerId) {
                    touches.splice(i, 1);
                    break;
                }
            }
            
            e.touches = touches.slice();
            handler(e);
        };

        OpenLayers.Event.observe(element, 'MSPointerUp', cb);
    },

    CLASS_NAME: "OpenLayers.Events"
});
/* ======================================================================
    OpenLayers/Request/XMLHttpRequest.js
   ====================================================================== */

// XMLHttpRequest.js Copyright (C) 2010 Sergey Ilinsky (http://www.ilinsky.com)
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @requires OpenLayers/Request.js
 */

(function () {

    // Save reference to earlier defined object implementation (if any)
    var oXMLHttpRequest    = window.XMLHttpRequest;

    // Define on browser type
    var bGecko    = !!window.controllers,
        bIE        = window.document.all && !window.opera,
        bIE7    = bIE && window.navigator.userAgent.match(/MSIE 7.0/);

    // Enables "XMLHttpRequest()" call next to "new XMLHttpReques()"
    function fXMLHttpRequest() {
        this._object    = oXMLHttpRequest && !bIE7 ? new oXMLHttpRequest : new window.ActiveXObject("Microsoft.XMLHTTP");
        this._listeners    = [];
    };

    // Constructor
    function cXMLHttpRequest() {
        return new fXMLHttpRequest;
    };
    cXMLHttpRequest.prototype    = fXMLHttpRequest.prototype;

    // BUGFIX: Firefox with Firebug installed would break pages if not executed
    if (bGecko && oXMLHttpRequest.wrapped)
        cXMLHttpRequest.wrapped    = oXMLHttpRequest.wrapped;

    // Constants
    cXMLHttpRequest.UNSENT                = 0;
    cXMLHttpRequest.OPENED                = 1;
    cXMLHttpRequest.HEADERS_RECEIVED    = 2;
    cXMLHttpRequest.LOADING                = 3;
    cXMLHttpRequest.DONE                = 4;

    // Public Properties
    cXMLHttpRequest.prototype.readyState    = cXMLHttpRequest.UNSENT;
    cXMLHttpRequest.prototype.responseText    = '';
    cXMLHttpRequest.prototype.responseXML    = null;
    cXMLHttpRequest.prototype.status        = 0;
    cXMLHttpRequest.prototype.statusText    = '';

    // Priority proposal
    cXMLHttpRequest.prototype.priority        = "NORMAL";

    // Instance-level Events Handlers
    cXMLHttpRequest.prototype.onreadystatechange    = null;

    // Class-level Events Handlers
    cXMLHttpRequest.onreadystatechange    = null;
    cXMLHttpRequest.onopen                = null;
    cXMLHttpRequest.onsend                = null;
    cXMLHttpRequest.onabort                = null;

    // Public Methods
    cXMLHttpRequest.prototype.open    = function(sMethod, sUrl, bAsync, sUser, sPassword) {
        // Delete headers, required when object is reused
        delete this._headers;

        // When bAsync parameter value is omitted, use true as default
        if (arguments.length < 3)
            bAsync    = true;

        // Save async parameter for fixing Gecko bug with missing readystatechange in synchronous requests
        this._async        = bAsync;

        // Set the onreadystatechange handler
        var oRequest    = this,
            nState        = this.readyState,
            fOnUnload;

        // BUGFIX: IE - memory leak on page unload (inter-page leak)
        if (bIE && bAsync) {
            fOnUnload = function() {
                if (nState != cXMLHttpRequest.DONE) {
                    fCleanTransport(oRequest);
                    // Safe to abort here since onreadystatechange handler removed
                    oRequest.abort();
                }
            };
            window.attachEvent("onunload", fOnUnload);
        }

        // Add method sniffer
        if (cXMLHttpRequest.onopen)
            cXMLHttpRequest.onopen.apply(this, arguments);

        if (arguments.length > 4)
            this._object.open(sMethod, sUrl, bAsync, sUser, sPassword);
        else
        if (arguments.length > 3)
            this._object.open(sMethod, sUrl, bAsync, sUser);
        else
            this._object.open(sMethod, sUrl, bAsync);

        this.readyState    = cXMLHttpRequest.OPENED;
        fReadyStateChange(this);

        this._object.onreadystatechange    = function() {
            if (bGecko && !bAsync)
                return;

            // Synchronize state
            oRequest.readyState        = oRequest._object.readyState;

            //
            fSynchronizeValues(oRequest);

            // BUGFIX: Firefox fires unnecessary DONE when aborting
            if (oRequest._aborted) {
                // Reset readyState to UNSENT
                oRequest.readyState    = cXMLHttpRequest.UNSENT;

                // Return now
                return;
            }

            if (oRequest.readyState == cXMLHttpRequest.DONE) {
                // Free up queue
                delete oRequest._data;
/*                if (bAsync)
                    fQueue_remove(oRequest);*/
                //
                fCleanTransport(oRequest);
// Uncomment this block if you need a fix for IE cache
/*
                // BUGFIX: IE - cache issue
                if (!oRequest._object.getResponseHeader("Date")) {
                    // Save object to cache
                    oRequest._cached    = oRequest._object;

                    // Instantiate a new transport object
                    cXMLHttpRequest.call(oRequest);

                    // Re-send request
                    if (sUser) {
                         if (sPassword)
                            oRequest._object.open(sMethod, sUrl, bAsync, sUser, sPassword);
                        else
                            oRequest._object.open(sMethod, sUrl, bAsync, sUser);
                    }
                    else
                        oRequest._object.open(sMethod, sUrl, bAsync);
                    oRequest._object.setRequestHeader("If-Modified-Since", oRequest._cached.getResponseHeader("Last-Modified") || new window.Date(0));
                    // Copy headers set
                    if (oRequest._headers)
                        for (var sHeader in oRequest._headers)
                            if (typeof oRequest._headers[sHeader] == "string")    // Some frameworks prototype objects with functions
                                oRequest._object.setRequestHeader(sHeader, oRequest._headers[sHeader]);

                    oRequest._object.onreadystatechange    = function() {
                        // Synchronize state
                        oRequest.readyState        = oRequest._object.readyState;

                        if (oRequest._aborted) {
                            //
                            oRequest.readyState    = cXMLHttpRequest.UNSENT;

                            // Return
                            return;
                        }

                        if (oRequest.readyState == cXMLHttpRequest.DONE) {
                            // Clean Object
                            fCleanTransport(oRequest);

                            // get cached request
                            if (oRequest.status == 304)
                                oRequest._object    = oRequest._cached;

                            //
                            delete oRequest._cached;

                            //
                            fSynchronizeValues(oRequest);

                            //
                            fReadyStateChange(oRequest);

                            // BUGFIX: IE - memory leak in interrupted
                            if (bIE && bAsync)
                                window.detachEvent("onunload", fOnUnload);
                        }
                    };
                    oRequest._object.send(null);

                    // Return now - wait until re-sent request is finished
                    return;
                };
*/
                // BUGFIX: IE - memory leak in interrupted
                if (bIE && bAsync)
                    window.detachEvent("onunload", fOnUnload);
            }

            // BUGFIX: Some browsers (Internet Explorer, Gecko) fire OPEN readystate twice
            if (nState != oRequest.readyState)
                fReadyStateChange(oRequest);

            nState    = oRequest.readyState;
        }
    };
    function fXMLHttpRequest_send(oRequest) {
        oRequest._object.send(oRequest._data);

        // BUGFIX: Gecko - missing readystatechange calls in synchronous requests
        if (bGecko && !oRequest._async) {
            oRequest.readyState    = cXMLHttpRequest.OPENED;

            // Synchronize state
            fSynchronizeValues(oRequest);

            // Simulate missing states
            while (oRequest.readyState < cXMLHttpRequest.DONE) {
                oRequest.readyState++;
                fReadyStateChange(oRequest);
                // Check if we are aborted
                if (oRequest._aborted)
                    return;
            }
        }
    };
    cXMLHttpRequest.prototype.send    = function(vData) {
        // Add method sniffer
        if (cXMLHttpRequest.onsend)
            cXMLHttpRequest.onsend.apply(this, arguments);

        if (!arguments.length)
            vData    = null;

        // BUGFIX: Safari - fails sending documents created/modified dynamically, so an explicit serialization required
        // BUGFIX: IE - rewrites any custom mime-type to "text/xml" in case an XMLNode is sent
        // BUGFIX: Gecko - fails sending Element (this is up to the implementation either to standard)
        if (vData && vData.nodeType) {
            vData    = window.XMLSerializer ? new window.XMLSerializer().serializeToString(vData) : vData.xml;
            if (!this._headers["Content-Type"])
                this._object.setRequestHeader("Content-Type", "application/xml");
        }

        this._data    = vData;
/*
        // Add to queue
        if (this._async)
            fQueue_add(this);
        else*/
            fXMLHttpRequest_send(this);
    };
    cXMLHttpRequest.prototype.abort    = function() {
        // Add method sniffer
        if (cXMLHttpRequest.onabort)
            cXMLHttpRequest.onabort.apply(this, arguments);

        // BUGFIX: Gecko - unnecessary DONE when aborting
        if (this.readyState > cXMLHttpRequest.UNSENT)
            this._aborted    = true;

        this._object.abort();

        // BUGFIX: IE - memory leak
        fCleanTransport(this);

        this.readyState    = cXMLHttpRequest.UNSENT;

        delete this._data;
/*        if (this._async)
            fQueue_remove(this);*/
    };
    cXMLHttpRequest.prototype.getAllResponseHeaders    = function() {
        return this._object.getAllResponseHeaders();
    };
    cXMLHttpRequest.prototype.getResponseHeader    = function(sName) {
        return this._object.getResponseHeader(sName);
    };
    cXMLHttpRequest.prototype.setRequestHeader    = function(sName, sValue) {
        // BUGFIX: IE - cache issue
        if (!this._headers)
            this._headers    = {};
        this._headers[sName]    = sValue;

        return this._object.setRequestHeader(sName, sValue);
    };

    // EventTarget interface implementation
    cXMLHttpRequest.prototype.addEventListener    = function(sName, fHandler, bUseCapture) {
        for (var nIndex = 0, oListener; oListener = this._listeners[nIndex]; nIndex++)
            if (oListener[0] == sName && oListener[1] == fHandler && oListener[2] == bUseCapture)
                return;
        // Add listener
        this._listeners.push([sName, fHandler, bUseCapture]);
    };

    cXMLHttpRequest.prototype.removeEventListener    = function(sName, fHandler, bUseCapture) {
        for (var nIndex = 0, oListener; oListener = this._listeners[nIndex]; nIndex++)
            if (oListener[0] == sName && oListener[1] == fHandler && oListener[2] == bUseCapture)
                break;
        // Remove listener
        if (oListener)
            this._listeners.splice(nIndex, 1);
    };

    cXMLHttpRequest.prototype.dispatchEvent    = function(oEvent) {
        var oEventPseudo    = {
            'type':            oEvent.type,
            'target':        this,
            'currentTarget':this,
            'eventPhase':    2,
            'bubbles':        oEvent.bubbles,
            'cancelable':    oEvent.cancelable,
            'timeStamp':    oEvent.timeStamp,
            'stopPropagation':    function() {},    // There is no flow
            'preventDefault':    function() {},    // There is no default action
            'initEvent':        function() {}    // Original event object should be initialized
        };

        // Execute onreadystatechange
        if (oEventPseudo.type == "readystatechange" && this.onreadystatechange)
            (this.onreadystatechange.handleEvent || this.onreadystatechange).apply(this, [oEventPseudo]);

        // Execute listeners
        for (var nIndex = 0, oListener; oListener = this._listeners[nIndex]; nIndex++)
            if (oListener[0] == oEventPseudo.type && !oListener[2])
                (oListener[1].handleEvent || oListener[1]).apply(this, [oEventPseudo]);
    };

    //
    cXMLHttpRequest.prototype.toString    = function() {
        return '[' + "object" + ' ' + "XMLHttpRequest" + ']';
    };

    cXMLHttpRequest.toString    = function() {
        return '[' + "XMLHttpRequest" + ']';
    };

    // Helper function
    function fReadyStateChange(oRequest) {
        // Sniffing code
        if (cXMLHttpRequest.onreadystatechange)
            cXMLHttpRequest.onreadystatechange.apply(oRequest);

        // Fake event
        oRequest.dispatchEvent({
            'type':            "readystatechange",
            'bubbles':        false,
            'cancelable':    false,
            'timeStamp':    new Date + 0
        });
    };

    function fGetDocument(oRequest) {
        var oDocument    = oRequest.responseXML,
            sResponse    = oRequest.responseText;
        // Try parsing responseText
        if (bIE && sResponse && oDocument && !oDocument.documentElement && oRequest.getResponseHeader("Content-Type").match(/[^\/]+\/[^\+]+\+xml/)) {
            oDocument    = new window.ActiveXObject("Microsoft.XMLDOM");
            oDocument.async                = false;
            oDocument.validateOnParse    = false;
            oDocument.loadXML(sResponse);
        }
        // Check if there is no error in document
        if (oDocument)
            if ((bIE && oDocument.parseError != 0) || !oDocument.documentElement || (oDocument.documentElement && oDocument.documentElement.tagName == "parsererror"))
                return null;
        return oDocument;
    };

    function fSynchronizeValues(oRequest) {
        try {    oRequest.responseText    = oRequest._object.responseText;    } catch (e) {}
        try {    oRequest.responseXML    = fGetDocument(oRequest._object);    } catch (e) {}
        try {    oRequest.status            = oRequest._object.status;            } catch (e) {}
        try {    oRequest.statusText        = oRequest._object.statusText;        } catch (e) {}
    };

    function fCleanTransport(oRequest) {
        // BUGFIX: IE - memory leak (on-page leak)
        oRequest._object.onreadystatechange    = new window.Function;
    };
/*
    // Queue manager
    var oQueuePending    = {"CRITICAL":[],"HIGH":[],"NORMAL":[],"LOW":[],"LOWEST":[]},
        aQueueRunning    = [];
    function fQueue_add(oRequest) {
        oQueuePending[oRequest.priority in oQueuePending ? oRequest.priority : "NORMAL"].push(oRequest);
        //
        setTimeout(fQueue_process);
    };

    function fQueue_remove(oRequest) {
        for (var nIndex = 0, bFound    = false; nIndex < aQueueRunning.length; nIndex++)
            if (bFound)
                aQueueRunning[nIndex - 1]    = aQueueRunning[nIndex];
            else
            if (aQueueRunning[nIndex] == oRequest)
                bFound    = true;
        if (bFound)
            aQueueRunning.length--;
        //
        setTimeout(fQueue_process);
    };

    function fQueue_process() {
        if (aQueueRunning.length < 6) {
            for (var sPriority in oQueuePending) {
                if (oQueuePending[sPriority].length) {
                    var oRequest    = oQueuePending[sPriority][0];
                    oQueuePending[sPriority]    = oQueuePending[sPriority].slice(1);
                    //
                    aQueueRunning.push(oRequest);
                    // Send request
                    fXMLHttpRequest_send(oRequest);
                    break;
                }
            }
        }
    };
*/
    // Internet Explorer 5.0 (missing apply)
    if (!window.Function.prototype.apply) {
        window.Function.prototype.apply    = function(oRequest, oArguments) {
            if (!oArguments)
                oArguments    = [];
            oRequest.__func    = this;
            oRequest.__func(oArguments[0], oArguments[1], oArguments[2], oArguments[3], oArguments[4]);
            delete oRequest.__func;
        };
    };

    // Register new object with window
    /**
     * Class: OpenLayers.Request.XMLHttpRequest
     * Standard-compliant (W3C) cross-browser implementation of the
     *     XMLHttpRequest object.  From
     *     http://code.google.com/p/xmlhttprequest/.
     */
    if (!OpenLayers.Request) {
        /**
         * This allows for OpenLayers/Request.js to be included
         * before or after this script.
         */
        OpenLayers.Request = {};
    }
    OpenLayers.Request.XMLHttpRequest = cXMLHttpRequest;
})();
/* ======================================================================
    OpenLayers/Request.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Events.js
 * @requires OpenLayers/Request/XMLHttpRequest.js
 */

/**
 * TODO: deprecate me
 * Use OpenLayers.Request.proxy instead.
 */
OpenLayers.ProxyHost = "";

/**
 * Namespace: OpenLayers.Request
 * The OpenLayers.Request namespace contains convenience methods for working
 *     with XMLHttpRequests.  These methods work with a cross-browser
 *     W3C compliant <OpenLayers.Request.XMLHttpRequest> class.
 */
if (!OpenLayers.Request) {
    /**
     * This allows for OpenLayers/Request/XMLHttpRequest.js to be included
     * before or after this script.
     */
    OpenLayers.Request = {};
}
OpenLayers.Util.extend(OpenLayers.Request, {
    
    /**
     * Constant: DEFAULT_CONFIG
     * {Object} Default configuration for all requests.
     */
    DEFAULT_CONFIG: {
        method: "GET",
        url: window.location.href,
        async: true,
        user: undefined,
        password: undefined,
        params: null,
        proxy: OpenLayers.ProxyHost,
        headers: {},
        data: null,
        callback: function() {},
        success: null,
        failure: null,
        scope: null
    },
    
    /**
     * Constant: URL_SPLIT_REGEX
     */
    URL_SPLIT_REGEX: /([^:]*:)\/\/([^:]*:?[^@]*@)?([^:\/\?]*):?([^\/\?]*)/,
    
    /**
     * APIProperty: events
     * {<OpenLayers.Events>} An events object that handles all 
     *     events on the {<OpenLayers.Request>} object.
     *
     * All event listeners will receive an event object with three properties:
     * request - {<OpenLayers.Request.XMLHttpRequest>} The request object.
     * config - {Object} The config object sent to the specific request method.
     * requestUrl - {String} The request url.
     * 
     * Supported event types:
     * complete - Triggered when we have a response from the request, if a
     *     listener returns false, no further response processing will take
     *     place.
     * success - Triggered when the HTTP response has a success code (200-299).
     * failure - Triggered when the HTTP response does not have a success code.
     */
    events: new OpenLayers.Events(this),
    
    /**
     * Method: makeSameOrigin
     * Using the specified proxy, returns a same origin url of the provided url.
     *
     * Parameters:
     * url - {String} An arbitrary url
     * proxy {String|Function} The proxy to use to make the provided url a
     *     same origin url.
     *
     * Returns
     * {String} the same origin url. If no proxy is provided, the returned url
     *     will be the same as the provided url.
     */
    makeSameOrigin: function(url, proxy) {
        var sameOrigin = url.indexOf("http") !== 0;
        var urlParts = !sameOrigin && url.match(this.URL_SPLIT_REGEX);
        if (urlParts) {
            var location = window.location;
            sameOrigin =
                urlParts[1] == location.protocol &&
                urlParts[3] == location.hostname;
            var uPort = urlParts[4], lPort = location.port;
            if (uPort != 80 && uPort != "" || lPort != "80" && lPort != "") {
                sameOrigin = sameOrigin && uPort == lPort;
            }
        }
        if (!sameOrigin) {
            if (proxy) {
                if (typeof proxy == "function") {
                    url = proxy(url);
                } else {
                    url = proxy + encodeURIComponent(url);
                }
            }
        }
        return url;
    },

    /**
     * APIMethod: issue
     * Create a new XMLHttpRequest object, open it, set any headers, bind
     *     a callback to done state, and send any data.  It is recommended that
     *     you use one <GET>, <POST>, <PUT>, <DELETE>, <OPTIONS>, or <HEAD>.
     *     This method is only documented to provide detail on the configuration
     *     options available to all request methods.
     *
     * Parameters:
     * config - {Object} Object containing properties for configuring the
     *     request.  Allowed configuration properties are described below.
     *     This object is modified and should not be reused.
     *
     * Allowed config properties:
     * method - {String} One of GET, POST, PUT, DELETE, HEAD, or
     *     OPTIONS.  Default is GET.
     * url - {String} URL for the request.
     * async - {Boolean} Open an asynchronous request.  Default is true.
     * user - {String} User for relevant authentication scheme.  Set
     *     to null to clear current user.
     * password - {String} Password for relevant authentication scheme.
     *     Set to null to clear current password.
     * proxy - {String} Optional proxy.  Defaults to
     *     <OpenLayers.ProxyHost>.
     * params - {Object} Any key:value pairs to be appended to the
     *     url as a query string.  Assumes url doesn't already include a query
     *     string or hash.  Typically, this is only appropriate for <GET>
     *     requests where the query string will be appended to the url.
     *     Parameter values that are arrays will be
     *     concatenated with a comma (note that this goes against form-encoding)
     *     as is done with <OpenLayers.Util.getParameterString>.
     * headers - {Object} Object with header:value pairs to be set on
     *     the request.
     * data - {String | Document} Optional data to send with the request.
     *     Typically, this is only used with <POST> and <PUT> requests.
     *     Make sure to provide the appropriate "Content-Type" header for your
     *     data.  For <POST> and <PUT> requests, the content type defaults to
     *     "application-xml".  If your data is a different content type, or
     *     if you are using a different HTTP method, set the "Content-Type"
     *     header to match your data type.
     * callback - {Function} Function to call when request is done.
     *     To determine if the request failed, check request.status (200
     *     indicates success).
     * success - {Function} Optional function to call if request status is in
     *     the 200s.  This will be called in addition to callback above and
     *     would typically only be used as an alternative.
     * failure - {Function} Optional function to call if request status is not
     *     in the 200s.  This will be called in addition to callback above and
     *     would typically only be used as an alternative.
     * scope - {Object} If callback is a public method on some object,
     *     set the scope to that object.
     *
     * Returns:
     * {XMLHttpRequest} Request object.  To abort the request before a response
     *     is received, call abort() on the request object.
     */
    issue: function(config) {        
        // apply default config - proxy host may have changed
        var defaultConfig = OpenLayers.Util.extend(
            this.DEFAULT_CONFIG,
            {proxy: OpenLayers.ProxyHost}
        );
        config = config || {};
        config.headers = config.headers || {};
        config = OpenLayers.Util.applyDefaults(config, defaultConfig);
        config.headers = OpenLayers.Util.applyDefaults(config.headers, defaultConfig.headers);
        // Always set the "X-Requested-With" header to signal that this request
        // was issued through the XHR-object. Since header keys are case 
        // insensitive and we want to allow overriding of the "X-Requested-With"
        // header through the user we cannot use applyDefaults, but have to 
        // check manually whether we were called with a "X-Requested-With"
        // header.
        var customRequestedWithHeader = false,
            headerKey;
        for(headerKey in config.headers) {
            if (config.headers.hasOwnProperty( headerKey )) {
                if (headerKey.toLowerCase() === 'x-requested-with') {
                    customRequestedWithHeader = true;
                }
            }
        }
        if (customRequestedWithHeader === false) {
            // we did not have a custom "X-Requested-With" header
            config.headers['X-Requested-With'] = 'XMLHttpRequest';
        }

        // create request, open, and set headers
        var request = new OpenLayers.Request.XMLHttpRequest();
        var url = OpenLayers.Util.urlAppend(config.url, 
            OpenLayers.Util.getParameterString(config.params || {}));
        url = OpenLayers.Request.makeSameOrigin(url, config.proxy);
        request.open(
            config.method, url, config.async, config.user, config.password
        );
        for(var header in config.headers) {
            request.setRequestHeader(header, config.headers[header]);
        }

        var events = this.events;

        // we want to execute runCallbacks with "this" as the
        // execution scope
        var self = this;
        
        request.onreadystatechange = function() {
            if(request.readyState == OpenLayers.Request.XMLHttpRequest.DONE) {
                var proceed = events.triggerEvent(
                    "complete",
                    {request: request, config: config, requestUrl: url}
                );
                if(proceed !== false) {
                    self.runCallbacks(
                        {request: request, config: config, requestUrl: url}
                    );
                }
            }
        };
        
        // send request (optionally with data) and return
        // call in a timeout for asynchronous requests so the return is
        // available before readyState == 4 for cached docs
        if(config.async === false) {
            request.send(config.data);
        } else {
            window.setTimeout(function(){
                if (request.readyState !== 0) { // W3C: 0-UNSENT
                    request.send(config.data);
                }
            }, 0);
        }
        return request;
    },
    
    /**
     * Method: runCallbacks
     * Calls the complete, success and failure callbacks. Application
     *    can listen to the "complete" event, have the listener 
     *    display a confirm window and always return false, and
     *    execute OpenLayers.Request.runCallbacks if the user
     *    hits "yes" in the confirm window.
     *
     * Parameters:
     * options - {Object} Hash containing request, config and requestUrl keys
     */
    runCallbacks: function(options) {
        var request = options.request;
        var config = options.config;
        
        // bind callbacks to readyState 4 (done)
        var complete = (config.scope) ?
            OpenLayers.Function.bind(config.callback, config.scope) :
            config.callback;
        
        // optional success callback
        var success;
        if(config.success) {
            success = (config.scope) ?
                OpenLayers.Function.bind(config.success, config.scope) :
                config.success;
        }

        // optional failure callback
        var failure;
        if(config.failure) {
            failure = (config.scope) ?
                OpenLayers.Function.bind(config.failure, config.scope) :
                config.failure;
        }

        if (OpenLayers.Util.createUrlObject(config.url).protocol == "file:" &&
                                                        request.responseText) {
            request.status = 200;
        }
        complete(request);

        if (!request.status || (request.status >= 200 && request.status < 300)) {
            this.events.triggerEvent("success", options);
            if(success) {
                success(request);
            }
        }
        if(request.status && (request.status < 200 || request.status >= 300)) {                    
            this.events.triggerEvent("failure", options);
            if(failure) {
                failure(request);
            }
        }
    },
    
    /**
     * APIMethod: GET
     * Send an HTTP GET request.  Additional configuration properties are
     *     documented in the <issue> method, with the method property set
     *     to GET.
     *
     * Parameters:
     * config - {Object} Object with properties for configuring the request.
     *     See the <issue> method for documentation of allowed properties.
     *     This object is modified and should not be reused.
     * 
     * Returns:
     * {XMLHttpRequest} Request object.
     */
    GET: function(config) {
        config = OpenLayers.Util.extend(config, {method: "GET"});
        return OpenLayers.Request.issue(config);
    },
    
    /**
     * APIMethod: POST
     * Send a POST request.  Additional configuration properties are
     *     documented in the <issue> method, with the method property set
     *     to POST and "Content-Type" header set to "application/xml".
     *
     * Parameters:
     * config - {Object} Object with properties for configuring the request.
     *     See the <issue> method for documentation of allowed properties.  The
     *     default "Content-Type" header will be set to "application-xml" if
     *     none is provided.  This object is modified and should not be reused.
     * 
     * Returns:
     * {XMLHttpRequest} Request object.
     */
    POST: function(config) {
        config = OpenLayers.Util.extend(config, {method: "POST"});
        // set content type to application/xml if it isn't already set
        config.headers = config.headers ? config.headers : {};
        if(!("CONTENT-TYPE" in OpenLayers.Util.upperCaseObject(config.headers))) {
            config.headers["Content-Type"] = "application/xml";
        }
        return OpenLayers.Request.issue(config);
    },
    
    /**
     * APIMethod: PUT
     * Send an HTTP PUT request.  Additional configuration properties are
     *     documented in the <issue> method, with the method property set
     *     to PUT and "Content-Type" header set to "application/xml".
     *
     * Parameters:
     * config - {Object} Object with properties for configuring the request.
     *     See the <issue> method for documentation of allowed properties.  The
     *     default "Content-Type" header will be set to "application-xml" if
     *     none is provided.  This object is modified and should not be reused.
     * 
     * Returns:
     * {XMLHttpRequest} Request object.
     */
    PUT: function(config) {
        config = OpenLayers.Util.extend(config, {method: "PUT"});
        // set content type to application/xml if it isn't already set
        config.headers = config.headers ? config.headers : {};
        if(!("CONTENT-TYPE" in OpenLayers.Util.upperCaseObject(config.headers))) {
            config.headers["Content-Type"] = "application/xml";
        }
        return OpenLayers.Request.issue(config);
    },
    
    /**
     * APIMethod: DELETE
     * Send an HTTP DELETE request.  Additional configuration properties are
     *     documented in the <issue> method, with the method property set
     *     to DELETE.
     *
     * Parameters:
     * config - {Object} Object with properties for configuring the request.
     *     See the <issue> method for documentation of allowed properties.
     *     This object is modified and should not be reused.
     * 
     * Returns:
     * {XMLHttpRequest} Request object.
     */
    DELETE: function(config) {
        config = OpenLayers.Util.extend(config, {method: "DELETE"});
        return OpenLayers.Request.issue(config);
    },
  
    /**
     * APIMethod: HEAD
     * Send an HTTP HEAD request.  Additional configuration properties are
     *     documented in the <issue> method, with the method property set
     *     to HEAD.
     *
     * Parameters:
     * config - {Object} Object with properties for configuring the request.
     *     See the <issue> method for documentation of allowed properties.
     *     This object is modified and should not be reused.
     * 
     * Returns:
     * {XMLHttpRequest} Request object.
     */
    HEAD: function(config) {
        config = OpenLayers.Util.extend(config, {method: "HEAD"});
        return OpenLayers.Request.issue(config);
    },
    
    /**
     * APIMethod: OPTIONS
     * Send an HTTP OPTIONS request.  Additional configuration properties are
     *     documented in the <issue> method, with the method property set
     *     to OPTIONS.
     *
     * Parameters:
     * config - {Object} Object with properties for configuring the request.
     *     See the <issue> method for documentation of allowed properties.
     *     This object is modified and should not be reused.
     * 
     * Returns:
     * {XMLHttpRequest} Request object.
     */
    OPTIONS: function(config) {
        config = OpenLayers.Util.extend(config, {method: "OPTIONS"});
        return OpenLayers.Request.issue(config);
    }

});
/* ======================================================================
    OpenLayers/WPSProcess.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/SingleFile.js
 */

/**
 * @requires OpenLayers/Geometry.js
 * @requires OpenLayers/Feature/Vector.js
 * @requires OpenLayers/Format/WKT.js
 * @requires OpenLayers/Format/GeoJSON.js
 * @requires OpenLayers/Format/WPSExecute.js
 * @requires OpenLayers/Request.js
 */

/**
 * Class: OpenLayers.WPSProcess
 * Representation of a WPS process. Usually instances of
 * <OpenLayers.WPSProcess> are created by calling 'getProcess' on an
 * <OpenLayers.WPSClient> instance.
 *
 * Currently <OpenLayers.WPSProcess> supports processes that have geometries
 * or features as output, using WKT or GeoJSON as output format. It also
 * supports chaining of processes by using the <output> method to create a
 * handle that is used as process input instead of a static value.
 */
OpenLayers.WPSProcess = OpenLayers.Class({
    
    /**
     * Property: client
     * {<OpenLayers.WPSClient>} The client that manages this process.
     */
    client: null,
    
    /**
     * Property: server
     * {String} Local client identifier for this process's server.
     */
    server: null,
    
    /**
     * Property: identifier
     * {String} Process identifier known to the server.
     */
    identifier: null,
    
    /**
     * Property: description
     * {Object} DescribeProcess response for this process.
     */
    description: null,
    
    /**
     * APIProperty: localWPS
     * {String} Service endpoint for locally chained WPS processes. Default is
     *     'http://geoserver/wps'.
     */
    localWPS: 'http://geoserver/wps',
    
    /**
     * Property: formats
     * {Object} OpenLayers.Format instances keyed by mimetype.
     */
    formats: null,
    
    /**
     * Property: chained
     * {Integer} Number of chained processes for pending execute requests that
     * don't have a full configuration yet.
     */
    chained: 0,
    
    /**
     * Property: executeCallbacks
     * {Array} Callbacks waiting to be executed until all chained processes
     * are configured;
     */
    executeCallbacks: null,
    
    /**
     * Constructor: OpenLayers.WPSProcess
     *
     * Parameters:
     * options - {Object} Object whose properties will be set on the instance.
     *
     * Available options:
     * client - {<OpenLayers.WPSClient>} Mandatory. Client that manages this
     *     process.
     * server - {String} Mandatory. Local client identifier of this process's
     *     server.
     * identifier - {String} Mandatory. Process identifier known to the server.
     */
    initialize: function(options) {
        OpenLayers.Util.extend(this, options);        
        this.executeCallbacks = [];
        this.formats = {
            'application/wkt': new OpenLayers.Format.WKT(),
            'application/json': new OpenLayers.Format.GeoJSON()
        };
    },
    
    /**
     * Method: describe
     * Makes the client issue a DescribeProcess request asynchronously.
     *
     * Parameters:
     * options - {Object} Configuration for the method call
     *
     * Available options:
     * callback - {Function} Callback to execute when the description is
     *     available. Will be called with the parsed description as argument.
     *     Optional.
     * scope - {Object} The scope in which the callback will be executed.
     *     Default is the global object.
     */
    describe: function(options) {
        options = options || {};
        if (!this.description) {
            this.client.describeProcess(this.server, this.identifier, function(description) {
                if (!this.description) {
                    this.parseDescription(description);
                }
                if (options.callback) {
                    options.callback.call(options.scope, this.description);
                }
            }, this);
        } else if (options.callback) {
            var description = this.description;
            window.setTimeout(function() {
                options.callback.call(options.scope, description);
            }, 0);
        }
    },
    
    /**
     * APIMethod: configure
     * Configure the process, but do not execute it. Use this for processes
     * that are chained as input of a different process by means of the
     * <output> method.
     *
     * Parameters:
     * options - {Object}
     *
     * Returns:
     * {<OpenLayers.WPSProcess>} this process.
     *
     * Available options:
     * inputs - {Object} The inputs for the process, keyed by input identifier.
     *     For spatial data inputs, the value of an input is usually an
     *     <OpenLayers.Geometry>, an <OpenLayers.Feature.Vector> or an array of
     *     geometries or features.
     * callback - {Function} Callback to call when the configuration is
     *     complete. Optional.
     * scope - {Object} Optional scope for the callback.
     */
    configure: function(options) {
        this.describe({
            callback: function() {
                var description = this.description,
                    inputs = options.inputs,
                    input, i, ii;
                for (i=0, ii=description.dataInputs.length; i<ii; ++i) {
                    input = description.dataInputs[i];
                    this.setInputData(input, inputs[input.identifier]);
                }
                if (options.callback) {
                    options.callback.call(options.scope);
                }
            },
            scope: this
        });
        return this;
    },
    
    /**
     * APIMethod: execute
     * Configures and executes the process
     *
     * Parameters:
     * options - {Object}
     *
     * Available options:
     * inputs - {Object} The inputs for the process, keyed by input identifier.
     *     For spatial data inputs, the value of an input is usually an
     *     <OpenLayers.Geometry>, an <OpenLayers.Feature.Vector> or an array of
     *     geometries or features.
     * output - {String} The identifier of the output to request and parse.
     *     Optional. If not provided, the first output will be requested.
     * success - {Function} Callback to call when the process is complete.
     *     This function is called with an outputs object as argument, which
     *     will have a property with the identifier of the requested output
     *     (or 'result' if output was not configured). For processes that
     *     generate spatial output, the value will be an array of
     *     <OpenLayers.Feature.Vector> instances.
     * scope - {Object} Optional scope for the success callback.
     */
    execute: function(options) {
        this.configure({
            inputs: options.inputs,
            callback: function() {
                var me = this;
                //TODO For now we only deal with a single output
                var outputIndex = this.getOutputIndex(
                    me.description.processOutputs, options.output
                );
                me.setResponseForm({outputIndex: outputIndex});
                (function callback() {
                    OpenLayers.Util.removeItem(me.executeCallbacks, callback);
                    if (me.chained !== 0) {
                        // need to wait until chained processes have a
                        // description and configuration - see chainProcess
                        me.executeCallbacks.push(callback);
                        return;
                    }
                    // all chained processes are added as references now, so
                    // let's proceed.
                    OpenLayers.Request.POST({
                        url: me.client.servers[me.server].url,
                        data: new OpenLayers.Format.WPSExecute().write(me.description),
                        success: function(response) {
                            var output = me.description.processOutputs[outputIndex];
                            var result;
                            if (output.literalOutput && output.literalOutput.dataType === "boolean") {
                                 result = (OpenLayers.String.trim(response.responseText) === 'true');
                            } else if (output.complexOutput) {
                                var mimeType = me.findMimeType(
                                    output.complexOutput.supported.formats
                                );
                                //TODO For now we assume a spatial output
                                result = me.formats[mimeType].read(response.responseText);
                                if (result instanceof OpenLayers.Feature.Vector) {
                                    result = [result];
                                }
                            }
                            if (options.success) {
                                var outputs = {};
                                outputs[options.output || 'result'] = result;
                                options.success.call(options.scope, outputs);
                            }
                        },
                        scope: me
                    });
                })();
            },
            scope: this
        });
    },
    
    /**
     * APIMethod: output
     * Chain an output of a configured process (see <configure>) as input to
     * another process.
     *
     * (code)
     * intersect = client.getProcess('opengeo', 'JTS:intersection');    
     * intersect.configure({
     *     // ...
     * });
     * buffer = client.getProcess('opengeo', 'JTS:buffer');
     * buffer.execute({
     *     inputs: {
     *         geom: intersect.output('result'), // <-- here we're chaining
     *         distance: 1
     *     },
     *     // ...
     * });
     * (end)
     *
     * Parameters:
     * identifier - {String} Identifier of the output that we're chaining. If
     *     not provided, the first output will be used.
     */
    output: function(identifier) {
        return new OpenLayers.WPSProcess.ChainLink({
            process: this,
            output: identifier
        });
    },
    
    /**
     * Method: parseDescription
     * Parses the DescribeProcess response
     *
     * Parameters:
     * description - {Object}
     */
    parseDescription: function(description) {
        var server = this.client.servers[this.server];
        this.description = new OpenLayers.Format.WPSDescribeProcess()
            .read(server.processDescription[this.identifier])
            .processDescriptions[this.identifier];
    },
    
    /**
     * Method: setInputData
     * Sets the data for a single input
     *
     * Parameters:
     * input - {Object}  An entry from the dataInputs array of the process
     *     description.
     * data - {Mixed} For spatial data inputs, this is usually an
     *     <OpenLayers.Geometry>, an <OpenLayers.Feature.Vector> or an array of
     *     geometries or features.
     */
    setInputData: function(input, data) {
        // clear any previous data
        delete input.data;
        delete input.reference;
        if (data instanceof OpenLayers.WPSProcess.ChainLink) {
            ++this.chained;
            input.reference = {
                method: 'POST',
                href: data.process.server === this.server ?
                    this.localWPS : this.client.servers[data.process.server].url
            };
            data.process.describe({
                callback: function() {
                    --this.chained;
                    this.chainProcess(input, data);
                },
                scope: this
            });
        } else {
            input.data = {};
            var complexData = input.complexData;
            if (complexData) {
                var format = this.findMimeType(complexData.supported.formats);
                input.data.complexData = {
                    mimeType: format,
                    value: this.formats[format].write(this.toFeatures(data))
                };
            } else {
                input.data.literalData = {
                    value: data
                };
            }
        }
    },
    
    /**
     * Method: setResponseForm
     * Sets the responseForm property of the <execute> payload.
     *
     * Parameters:
     * options - {Object} See below.
     *
     * Available options:
     * outputIndex - {Integer} The index of the output to use. Optional.
     * supportedFormats - {Object} Object with supported mime types as key,
     *     and true as value for supported types. Optional.
     */
    setResponseForm: function(options) {
        options = options || {};
        var output = this.description.processOutputs[options.outputIndex || 0];
        var mimeType;
        if (output.complexOutput) {
            mimeType = this.findMimeType(output.complexOutput.supported.formats, options.supportedFormats);
        }
        this.description.responseForm = {
            rawDataOutput: {
                identifier: output.identifier,
                mimeType: mimeType
            }
        };
    },
    
    /**
     * Method: getOutputIndex
     * Gets the index of a processOutput by its identifier
     *
     * Parameters:
     * outputs - {Array} The processOutputs array to look at
     * identifier - {String} The identifier of the output
     *
     * Returns
     * {Integer} The index of the processOutput with the provided identifier
     *     in the outputs array.
     */
    getOutputIndex: function(outputs, identifier) {
        var output;
        if (identifier) {
            for (var i=outputs.length-1; i>=0; --i) {
                if (outputs[i].identifier === identifier) {
                    output = i;
                    break;
                }
            }
        } else {
            output = 0;
        }
        return output;
    },
    
    /**
     * Method: chainProcess
     * Sets a fully configured chained process as input for this process.
     *
     * Parameters:
     * input - {Object} The dataInput that the chained process provides.
     * chainLink - {<OpenLayers.WPSProcess.ChainLink>} The process to chain.
     */
    chainProcess: function(input, chainLink) {
        var output = this.getOutputIndex(
            chainLink.process.description.processOutputs, chainLink.output
        );
        input.reference.mimeType = this.findMimeType(
            input.complexData.supported.formats,
            chainLink.process.description.processOutputs[output].complexOutput.supported.formats
        );
        var formats = {};
        formats[input.reference.mimeType] = true;
        chainLink.process.setResponseForm({
            outputIndex: output,
            supportedFormats: formats
        });
        input.reference.body = chainLink.process.description;
        while (this.executeCallbacks.length > 0) {
            this.executeCallbacks[0]();
        }
    },
    
    /**
     * Method: toFeatures
     * Converts spatial input into features so it can be processed by
     * <OpenLayers.Format> instances.
     *
     * Parameters:
     * source - {Mixed} An <OpenLayers.Geometry>, an
     *     <OpenLayers.Feature.Vector>, or an array of geometries or features
     *
     * Returns:
     * {Array(<OpenLayers.Feature.Vector>)}
     */
    toFeatures: function(source) {
        var isArray = OpenLayers.Util.isArray(source);
        if (!isArray) {
            source = [source];
        }
        var target = new Array(source.length),
            current;
        for (var i=0, ii=source.length; i<ii; ++i) {
            current = source[i];
            target[i] = current instanceof OpenLayers.Feature.Vector ?
                current : new OpenLayers.Feature.Vector(current);
        }
        return isArray ? target : target[0];
    },
    
    /**
     * Method: findMimeType
     * Finds a supported mime type.
     *
     * Parameters:
     * sourceFormats - {Object} An object literal with mime types as key and
     *     true as value for supported formats.
     * targetFormats - {Object} Like <sourceFormats>, but optional to check for
     *     supported mime types on a different target than this process.
     *     Default is to check against this process's supported formats.
     *
     * Returns:
     * {String} A supported mime type.
     */
    findMimeType: function(sourceFormats, targetFormats) {
        targetFormats = targetFormats || this.formats;
        for (var f in sourceFormats) {
            if (f in targetFormats) {
                return f;
            }
        }
    },
    
    CLASS_NAME: "OpenLayers.WPSProcess"
    
});

/**
 * Class: OpenLayers.WPSProcess.ChainLink
 * Type for chaining processes.
 */
OpenLayers.WPSProcess.ChainLink = OpenLayers.Class({
    
    /**
     * Property: process
     * {<OpenLayers.WPSProcess>} The process to chain
     */
    process: null,
    
    /**
     * Property: output
     * {String} The output identifier of the output we are going to use as
     *     input for another process.
     */
    output: null,
    
    /**
     * Constructor: OpenLayers.WPSProcess.ChainLink
     *
     * Parameters:
     * options - {Object} Properties to set on the instance.
     */
    initialize: function(options) {
        OpenLayers.Util.extend(this, options);
    },
    
    CLASS_NAME: "OpenLayers.WPSProcess.ChainLink"
    
});
/* ======================================================================
    OpenLayers/WPSClient.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/SingleFile.js
 */

/**
 * @requires OpenLayers/Events.js
 * @requires OpenLayers/WPSProcess.js
 * @requires OpenLayers/Format/WPSDescribeProcess.js
 * @requires OpenLayers/Request.js
 */

/**
 * Class: OpenLayers.WPSClient
 * High level API for interaction with Web Processing Services (WPS).
 * An <OpenLayers.WPSClient> instance is used to create <OpenLayers.WPSProcess>
 * instances for servers known to the WPSClient. The WPSClient also caches
 * DescribeProcess responses to reduce the number of requests sent to servers
 * when processes are created.
 */
OpenLayers.WPSClient = OpenLayers.Class({
    
    /**
     * Property: servers
     * {Object} Service metadata, keyed by a local identifier.
     *
     * Properties:
     * url - {String} the url of the server
     * version - {String} WPS version of the server
     * processDescription - {Object} Cache of raw DescribeProcess
     *     responses, keyed by process identifier.
     */
    servers: null,
    
    /**
     * Property: version
     * {String} The default WPS version to use if none is configured. Default
     *     is '1.0.0'.
     */
    version: '1.0.0',
    
    /**
     * Property: lazy
     * {Boolean} Should the DescribeProcess be deferred until a process is
     *     fully configured? Default is false.
     */
    lazy: false,
    
    /**
     * Property: events
     * {<OpenLayers.Events>}
     *
     * Supported event types:
     * describeprocess - Fires when the process description is available.
     *     Listeners receive an object with a 'raw' property holding the raw
     *     DescribeProcess response, and an 'identifier' property holding the
     *     process identifier of the described process.
     */
    events: null,
    
    /**
     * Constructor: OpenLayers.WPSClient
     *
     * Parameters:
     * options - {Object} Object whose properties will be set on the instance.
     *
     * Available options:
     * servers - {Object} Mandatory. Service metadata, keyed by a local
     *     identifier. Can either be a string with the service url or an
     *     object literal with additional metadata:
     *
     *     (code)
     *     servers: {
     *         local: '/geoserver/wps'
     *     }, {
     *         opengeo: {
     *             url: 'http://demo.opengeo.org/geoserver/wps',
     *             version: '1.0.0'
     *         }
     *     }
     *     (end)
     *
     * lazy - {Boolean} Optional. Set to true if DescribeProcess should not be
     *     requested until a process is fully configured. Default is false.
     */
    initialize: function(options) {
        OpenLayers.Util.extend(this, options);
        this.events = new OpenLayers.Events(this);
        this.servers = {};
        for (var s in options.servers) {
            this.servers[s] = typeof options.servers[s] == 'string' ? {
                url: options.servers[s],
                version: this.version,
                processDescription: {}
            } : options.servers[s];
        }
    },
    
    /**
     * APIMethod: execute
     * Shortcut to execute a process with a single function call. This is
     * equivalent to using <getProcess> and then calling execute on the
     * process.
     *
     * Parameters:
     * options - {Object} Options for the execute operation.
     *
     * Available options:
     * server - {String} Mandatory. One of the local identifiers of the
     *     configured servers.
     * process - {String} Mandatory. A process identifier known to the
     *     server.
     * inputs - {Object} The inputs for the process, keyed by input identifier.
     *     For spatial data inputs, the value of an input is usually an
     *     <OpenLayers.Geometry>, an <OpenLayers.Feature.Vector> or an array of
     *     geometries or features.
     * output - {String} The identifier of an output to parse. Optional. If not
     *     provided, the first output will be parsed.
     * success - {Function} Callback to call when the process is complete.
     *     This function is called with an outputs object as argument, which
     *     will have a property with the identifier of the requested output
     *     (e.g. 'result'). For processes that generate spatial output, the
     *     value will either be a single <OpenLayers.Feature.Vector> or an
     *     array of features.
     * scope - {Object} Optional scope for the success callback.
     */
    execute: function(options) {
        var process = this.getProcess(options.server, options.process);
        process.execute({
            inputs: options.inputs,
            success: options.success,
            scope: options.scope
        });
    },
    
    /**
     * APIMethod: getProcess
     * Creates an <OpenLayers.WPSProcess>.
     *
     * Parameters:
     * serverID - {String} Local identifier from the servers that this instance
     *     was constructed with.
     * processID - {String} Process identifier known to the server.
     * options - {Object} Options for the getProcess operation.
     *
     * Available options:
     * callback - {Function} Callback to call when the operation is complete.
     *     This function is called with the parsed process description.
     * scope - {Object} Optional scope for the callback.
     *
     * Returns:
     * {<OpenLayers.WPSProcess>}
     */
    getProcess: function(serverID, processID, options) {
        var process = new OpenLayers.WPSProcess({
            client: this,
            server: serverID,
            identifier: processID
        });
        if (!this.lazy) {
            process.describe(options);
        }
        return process;
    },
    
    /**
     * Method: describeProcess
     *
     * Parameters:
     * serverID - {String} Identifier of the server
     * processID - {String} Identifier of the requested process
     * callback - {Function} Callback to call when the description is available
     * scope - {Object} Optional execution scope for the callback function
     */
    describeProcess: function(serverID, processID, callback, scope) {
        var server = this.servers[serverID];
        if (!server.processDescription[processID]) {
            if (!(processID in server.processDescription)) {
                // set to null so we know a describeFeature request is pending
                server.processDescription[processID] = null;
                OpenLayers.Request.GET({
                    url: server.url,
                    params: {
                        SERVICE: 'WPS',
                        VERSION: server.version,
                        REQUEST: 'DescribeProcess',
                        IDENTIFIER: processID
                    },
                    success: function(response) {
                        server.processDescription[processID] = response.responseText;
                        this.events.triggerEvent('describeprocess', {
                            identifier: processID,
                            raw: response.responseText
                        });
                        callback.call(scope, response.responseText);
                    },
                    scope: this
                });
            } else {
                // pending request
                this.events.register('describeprocess', this, function describe(evt) {
                    if (evt.identifier === processID) {
                        this.events.unregister('describeprocess', this, describe);
                        callback.call(scope, evt.raw);
                    }
                });
            }
        } else {
            window.setTimeout(function() {
                callback.call(scope, server.processDescription[processID]);
            }, 0);
        }
    },
    
    /**
     * Method: destroy
     */
    destroy: function() {
        this.events.destroy();
        this.events = null;
        this.servers = null;
    },
    
    CLASS_NAME: 'OpenLayers.WPSClient'
    
});
