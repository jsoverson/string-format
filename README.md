# [String.format()]()
## JavaScript sprintf/console.log()/String.Format() inspired formatting library
## 938 bytes minified, 556 bytes gzipped.

String-format is a micro library that provides a very simple but very useful format() function to your string literals
allowing you to access sprintf like formatting on the fly, e.g.

`'This is a string %s'.Format('literal') // 'This is a string literal'`

This product is the evolution of a tool that I've copied from project to project in one form or another over several years. In
true coder form, it's updated, unit tested, and documented on github right now because I'm procrastinating another project.

## Syntax

- `%s` : substitute a string
  - `%Ds` : limit the substituted string to 2 characters
  - `%D.Xs` : substr starting at index D and X characters long
- `%f` : substitute a floating point number, no leading zero
  - `%0f` : floating point with leading zero
  - `%.Df` : fixed to D decimal places
  - `%0.Df` : fixed to D decimal places with leading zero
- `%d` or `%i` : substitute an integer (zero decimal places)
- `%%` : literal % sign

## Examples

```
'Github is %s'.format('awesome');                  // "Github is awesome"
'One answer may be %i'.format(42);                 // "One answer may be 42"
'Another answer may be %.5f'.format(Math.PI);      // "Another answer may be 3.14159"
'%.5f is not equal to %.5f'.format(22/7, Math.PI); // "3.14286 is not equal to 3.14159"
'PI minus 3 is %0.5f'.format(Math.PI - 3);         // "PI minus 3 is 0.14159"
```

The format() method is on every string, not just literal strings.

```
var header = 'Welcome, %s';
header.format("Bob")          // "Welcome, Bob"
```

## License

MIT/BSD License
