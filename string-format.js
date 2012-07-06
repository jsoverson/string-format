///*jshint curly:false*/

(function(global,undefined) {
  "use strict";

  var cache = {};

  function parseFormat(string) {
    if (cache[string]) return cache[string];
    var parts = [],
        regex = /(%%)|(^%|(?=.)%)(?:(\d+)?(\.)?(\d+)?)?([a-zA-Z])/,
        position = 0,
        part, match;

    if (!(string.length > 0)) return parts;

    while (match = regex.exec(string)) {
      part = {
        m : match[0],
        o : match.index
      };
      if (match[0] === "%%") {
        part.type = '%';
      } else {
        part.i = position++;
        part.type = match[6];
        part.h = [
          (match[3] >= 0) ? parseInt(match[3],10) : undefined,
          (match[5] >= 0) ? parseInt(match[5],10) : undefined
        ];
      }
      parts.push(part);

      string = string.substr(match.index + match[0].length);
    }

    return cache[string] = parts;
  }

  function parseString(string, precision) {
    var a = precision[0], b = precision[1];
    return a ?
            b ?
              string.substr(a,b) :
              string.substring(0,a) :
            string;
  }

  function parseNum(num, precision) {
    return num.toFixed(0);
  }

  function parseFloat(num, precision) {
    var a = parseInt(precision[0],10), b = parseInt(precision[1],10);
    if (b >= 0) {
      num = num.toFixed(b);
    }
    var rv = num.toString();
    if (a !== 0 && num < 1 && num > -1) {
      rv = rv.replace(/0\./,'.');
    }
    return rv;
  }

  if (global.ENV === 'test') global.PF = parseFormat;

  String.prototype.format = function (/* args... */) {
    var string = this.toString(),
      args = arguments,
      parts = parseFormat(string), lastIndex = 0;
    for (var i = 0; i < parts.length; i++) {
      var part = parts[i],
        head = string.substring(0,lastIndex + part.o),
        tail = string.substring(lastIndex + part.o + part.m.length),
        replacement = '';
      switch (part.type) {
        case '%': replacement = '%'; break;
        case 's': replacement = parseString(args[part.i], part.h); break;
        case 'f': replacement = parseFloat(args[part.i], part.h); break;
        case 'd':
        case 'i': replacement = parseNum(args[part.i], part.h); break;
      }
      lastIndex += part.o + replacement.length;
      string = head + replacement + tail;
    }
    return string;
  };
})(this);
