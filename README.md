# Zod XSS Sanitizer

A powerful and flexible input sanitizer for [Zod](https://github.com/colinhacks/zod) schemas, designed to prevent XSS (Cross-Site Scripting) attacks. Easily sanitize or validate user input in your Zod schemas with customizable options.


[![Latest Stable Version](https://img.shields.io/npm/v/zod-xss-sanitizer.svg?style=for-the-badge)](https://www.npmjs.com/package/zod-xss-sanitizer)
[![License](https://img.shields.io/npm/l/zod-xss-sanitizer.svg?style=for-the-badge)](https://www.npmjs.com/package/zod-xss-sanitizer)
[![NPM Downloads](https://img.shields.io/npm/dt/zod-xss-sanitizer.svg?style=for-the-badge)](https://www.npmjs.com/package/zod-xss-sanitizer)
[![NPM Downloads](https://img.shields.io/npm/dm/zod-xss-sanitizer.svg?style=for-the-badge)](https://www.npmjs.com/package/zod-xss-sanitizer)

## 🚀 Features

- 🛡️ **XSS Protection**: Sanitizes user inputs to prevent cross-site scripting (XSS) attacks.
- ✅ **Flexible Validation**: Supports validation and sanitization at different action levels (`VALIDATE` or `SANITIZE`).
- 🔧 **Customizable**: Configure allowed tags, attributes, and other options via [sanitize-html](https://www.npmjs.com/package/sanitize-html).
- 🧩 **Seamless Integration**: Extends Zod's functionality with minimal boilerplate.

---

## 📦 Installation

Install the package using npm or yarn:

```bash
npm install zod-xss-sanitizer
```

## 📖 Usage

### Basic Example

```javascript
import { ZodXssSanitizer, ACTION_LEVELS } from 'zod-xss-sanitizer';

// or

const {ZodXssSanitizer, ACTION_LEVELS} = require('zod-xss-sanitizer');

const input = '<p onclick="return;">Test</p>';

const schema = ZodXssSanitizer.sanitizer({
  actionLevel: ACTION_LEVELS.VALIDATE,
  sanitizerOptions: {
    allowedAttributes: { h1: ['onclick'] },
    allowedTags: ['b', 'i'], // Allow specific HTML tags
  },
});
const result = schema.safeParse(input);
console.log(result)
```

### Advanced Example: Nested Objects

```javascript
import { ZodXssSanitizer, ACTION_LEVELS } from 'zod-xss-sanitizer';
import { z } from 'zod';
// or

const {ZodXssSanitizer, ACTION_LEVELS} = require('zod-xss-sanitizer');

const schema = z.object({
  username: ZodXssSanitizer.sanitizer({
    actionLevel: ACTION_LEVELS.SANITIZE,
  }),
  profile: z.object({
    bio: ZodXssSanitizer.sanitizer({
      actionLevel: ACTION_LEVELS.SANITIZE,
      sanitizerOptions: {
        allowedTags: ['b', 'i', 'u'],
      },
    }),
  }),
});

const input = {
  username: '<script>malicious()</script>',
  profile: {
    bio: '<b>Welcome!</b> <img src="x" />',
  },
};

const result = schema.safeParse(input);
console.log(result)
```
## 🔧 API Reference
`sanitizer(options)`

* *Description:* Adds XSS sanitization and validation to your Zod schema.
* *Parameters:*
  * `options` (Object):
    * `actionLevel` (String):
      * `SANITIZE` - Returns sanitized content.
      * `VALIDATE` - Throws an error for unsafe content.
    * `sanitizerOptions` (Object): Configuration options for [sanitize-html](https://www.npmjs.com/package/sanitize-html).
## 💡 Best Practices
1. Always validate and sanitize user inputs on the server side.
2. Use custom sanitizerOptions to allow only the required HTML tags and attributes.
3. Pair this library with a Content Security Policy (CSP) for enhanced XSS protection.

## Tests

To run the test suite, first install the dependencies then run `npm test`:

```bash
$ npm install
$ npm test
```

## 📬 Feedback and Support

Have questions or feedback? Open an issue on [GitHub](https://github.com/AhmedAdelFahim/zod-xss-sanitizer) or reach out via email.