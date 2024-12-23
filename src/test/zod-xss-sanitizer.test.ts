import assert from 'assert';
import { ZodXssSanitizer, ACTION_LEVELS } from '..';
import { z } from 'zod';

describe('Zod XSS Sanitizer Tests', function () {
  const createSchema = (options = {}) => ZodXssSanitizer.sanitizer(options);

  describe('Validation Mode', function () {
    it('should allow safe content', function () {
      const input = '<p>Safe</p>';
      const schema = createSchema({ actionLevel: ACTION_LEVELS.VALIDATE });
      const result = schema.safeParse(input);
      assert.deepStrictEqual(result, { data: input, success: true });
    });

    it('should reject unsafe content with default options', function () {
      const input = '<script>Unsafe</script>';
      const schema = createSchema({ actionLevel: ACTION_LEVELS.VALIDATE });
      const { success, error } = schema.safeParse(input);
      assert.strictEqual(success, false);
      assert.deepStrictEqual(error?.errors, [{ code: 'custom', message: 'unsafe content', path: [] }]);
    });

    it('should respect custom allowed tags', function () {
      const input = '<script>Allowed</script>';
      const schema = createSchema({
        actionLevel: ACTION_LEVELS.VALIDATE,
        sanitizerOptions: { allowedTags: ['script'] },
      });
      const result = schema.safeParse(input);
      assert.deepStrictEqual(result, { data: input, success: true });
    });

    it('should respect custom allowed attributes', function () {
      const input = '<p onclick="return;">Test</p>';
      const schema = createSchema({
        actionLevel: ACTION_LEVELS.VALIDATE,
        sanitizerOptions: { allowedAttributes: { p: ['onclick'] } },
      });
      const result = schema.safeParse(input);
      assert.deepStrictEqual(result, { data: input, success: true });
    });
  });

  describe('Sanitization Mode', function () {
    it('should remove unsafe content by default', function () {
      const input = '<script>Unsafe</script>';
      const schema = createSchema({ actionLevel: ACTION_LEVELS.SANITIZE });
      const result = schema.safeParse(input);
      assert.deepStrictEqual(result, { data: '', success: true });
    });

    it('should retain allowed tags during sanitization', function () {
      const input = '<script>Allowed</script>';
      const schema = createSchema({
        actionLevel: ACTION_LEVELS.SANITIZE,
        sanitizerOptions: { allowedTags: ['script'] },
      });
      const result = schema.safeParse(input);
      assert.deepStrictEqual(result, { data: input, success: true });
    });

    it('should sanitize mixed content', function () {
      const input = '<p>Safe</p><script>Unsafe</script>';
      const schema = createSchema({ actionLevel: ACTION_LEVELS.SANITIZE });
      const result = schema.safeParse(input);
      assert.deepStrictEqual(result, { data: '<p>Safe</p>', success: true });
    });
  });

  describe('Complex Object Validation', function () {
    const schema = z.object({
      a: createSchema({
        actionLevel: ACTION_LEVELS.VALIDATE,
        sanitizerOptions: { allowedTags: ['script'] },
      }),
      b: createSchema({
        actionLevel: ACTION_LEVELS.VALIDATE,
        sanitizerOptions: { allowedAttributes: { p: ['onclick'] } },
      }),
      c: createSchema({ actionLevel: ACTION_LEVELS.SANITIZE }),
    });

    it('should handle multiple field configurations', function () {
      const input = {
        a: '<script>Allowed</script>',
        b: '<p onclick="alert()">Test</p>',
        c: '<img src="/" />',
      };
      const result = schema.safeParse(input);
      assert.deepStrictEqual(result, {
        data: {
          a: '<script>Allowed</script>',
          b: '<p onclick="alert()">Test</p>',
          c: '',
        },
        success: true,
      });
    });
  });
});
