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

  if (global.ENV === 'test') global.PF = parseFormat;

  String.prototype.format = function (/* args... */) {
    var string = this.toString(),
      args = arguments,
      parts = parseFormat(string), lastIndex = 0;
    for (var i = 0; i < parts.length; i++) {
      var part = parts[i],
        head = string.substring(0,lastIndex + part.o),
        tail = string.substring(lastIndex + part.o + part.m.length),
        replacement = '',
        val = args[part.i],
        major = part.h && parseInt(part.h[0],10), minor = part.h && parseInt(part.h[1],10);
      switch (part.type) {
        case '%': replacement = '%'; break;
        case 's':
          replacement = major ?
                 minor ?
                 val.substr(major,minor) :
                 val.substring(0,major) :
                 val;
          break;
        case 'f':
          if (minor >= 0) val = val.toFixed(minor);
          replacement = val.toString();
          if (major !== 0 && val < 1 && val > -1) replacement = replacement.replace(/0\./,'.');
          break;
        case 'd':
        case 'i':
          replacement = val.toFixed(0);
          break;
      }
      lastIndex += part.o + replacement.length;
      string = head + replacement + tail;
    }
    return string;
  };
})(this);
