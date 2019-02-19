# PrettySharp: Automatic C# Code Formatting for VS Code

Integrate [the PrettySharp code formatter](https://github.com/DeCarabas/PrettySharp) with VS Code.

PrettySharp is an automatic code-formatter, which (mostly) ignores your whitespace and instead normalizes all the whitespace in your code to a standard, including breaking lines at a mazimum line length.
(For more information see [the PrettySharp repository.](https://github.com/DeCarabas/PrettySharp))

## Features

Presumably you want to keep your C# looking pretty, and so what you really want to do is to enable set the `editor.formatOnSave` setting to `true`.
Then every time you save a well-formatted C# document, it will be automatically formatted so that it looks pretty.

If you want to format your document by hand, you may also run the "Format Document" command.
But why wouldn't you want to format on save?
Don't you want your code to look pretty?
What are you, some kind of animal?
We're trying to have a civilized programming language here, people!

## Requirements

You need to have prettysharp installed somewhere.
(Get it from [the PrettySharp respository.](https://github.com/DeCarabas/PrettySharp))

## Extension Settings

This extension contributes the following settings:

- `prettysharp.executable`: The full path to the prettysharp binary.

## Known Issues

This extension has some limitations we know about already:

- This does not currently support the "Format Selection" command.

If your document isn't formatting at all, try formatting it manually with the "Format Document" command.
PrettySharp won't format anything it can't parse, so if your C# is syntactically incorrect in some way it probably won't get pretty-printed either.
Try fixing the file so that it builds, and then format it.

If you have concerns about the tool incorrectly formatting your code (or failing to format it at all), check in with [the PrettySharp tool itself.](https://github.com/DeCarabas/PrettySharp)

## Release Notes

### 1.0.0

Initial release.
