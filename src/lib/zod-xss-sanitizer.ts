import { RefinementCtx, z, ZodFirstPartyTypeKind } from 'zod';
import sanitizeHtml from 'sanitize-html';
export enum ACTION_LEVELS {
  SANITIZE = 'SANITIZE', // return sanitized string
  VALIDATE = 'VALIDATE', // throw error if string contains unsafe content
}

interface IZodXssSanitizerOptions {
  actionLevel?: ACTION_LEVELS;
  sanitizerOptions?: sanitizeHtml.IOptions;
}

class ZodXssSanitizer extends z.ZodString {
  constructor() {
    super({ typeName: ZodFirstPartyTypeKind.ZodString, checks: [], coerce: false });
  }
  sanitizer(options?: IZodXssSanitizerOptions) {
    return this.superRefine((value, ctx: RefinementCtx) => {
      const actionLevel = options?.actionLevel || ACTION_LEVELS.VALIDATE;
      const sanitizedContent = sanitizeHtml(value, options?.sanitizerOptions);

      if (actionLevel === ACTION_LEVELS.VALIDATE && value !== sanitizedContent) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'unsafe content',
        });
      }
    }).transform((value) => {
      return sanitizeHtml(value, options?.sanitizerOptions);
    });
  }
}

export default new ZodXssSanitizer();
