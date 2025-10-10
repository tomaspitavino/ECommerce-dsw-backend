import { NextFunction, Request, Response } from 'express';

interface ZodSchema<T> {
	safeParse(
		data: unknown
	): { success: true; data: T } | { success: false; error: any };
}

export function validate(schema: ZodSchema<any>) {
	return (req: Request, res: Response, next: NextFunction) => {
		const result = schema.safeParse(req.body);
		if (!result.success) {
			return res
				.status(400)
				.json({ message: 'Invalid input', errors: result.error });
		}
		req.body.validated = result.data;
		next();
	};
}
