/**
 * License : MIT or new BSD license.
 * Copyright Jarrod Overson.
 *
 */

// Code deliberately terse for size reasons. I apologize (a little).

(function(global,undefined) {
  "use strict";

  var cache = {};

  function parseFormat(string) {
    if (cache[string]) return cache[string];
    var parts = [],
        regex = /(%%)|(^%|(?=.)%)(?:(\d+)?(?:\.)?(\d+)?)?([a-zA-Z])/,
        position = 0,
        part, match;

    if (!string.length) return parts;

    while (match = regex.exec(string)) {
      part = {
        match : match[0],
        idx : match.index
      };
      if (match[0] === "%%") {
        part.type = '%';
      } else {
        part.arg = position++;
        part.type = match[5];
        part.h = [
          (!match[3] && match[3] !== 0) ? undefined : parseInt(match[3],10),
          (!match[4] && match[4] !== 0) ? undefined : parseInt(match[4],10)
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
      parts = parseFormat(string),
      lastIndex = 0;
    for (var i = 0; i < parts.length; i++) {
      var part = parts[i],
        head = string.substring(0,lastIndex + part.idx),
        tail = string.substring(lastIndex + part.idx + part.match.length),
        replacement = '',
        val = args[part.arg],
        major = part.h && parseInt(part.h[0],10), minor = part.h && parseInt(part.h[1],10);
      switch (part.type) {
        case '%':
          replacement = '%';
          break;
        case 's':
          val = val || '';
          replacement = major ?
                         minor ?
                           val.substr(major,minor) :
                           val.substring(0,major) :
                         val;
          break;
        case 'f':
          val = val || 0;
          if (minor >= 0) val = val.toFixed(minor);
          replacement = val.toString();

          // Remove the 0 prefix if we didn't ask for it
          if (major !== 0 && val < 1 && val > -1) replacement = replacement.replace(/0\./,'.');
          break;
        case 'd':
        case 'i':
          replacement = val ? val.toFixed(0) : 0;
      }
      lastIndex += part.idx + replacement.toString().length;
      string = head + replacement + tail;
    }
    return string;
  };
})(this);
