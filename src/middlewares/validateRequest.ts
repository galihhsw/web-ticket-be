import type { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";

export const validateRequest =
	(schema: z.ZodTypeAny) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await schema.parseAsync(req.body);
			next();
		} catch (error) {
			if (error instanceof ZodError) {
				const errorMessages = error.issues.map((err) => err.message);

				console.log(error);

				return res.status(400).json({
					error: "Invalid request",
					details: errorMessages,
				});
			}

			return res.status(500).json({ error: "Internal server error" });
		}
	};
