//
// Imports
//

import { IncomingMessage } from "node:http";

import { Formidable } from "formidable";
import { Middleware } from "koa";

import { Body } from "./Body.js";

//
// Middleware
//

/** A class for creating body parser middlewares. */
export class BodyParserMiddleware
{
	/**
	 * Gets a request body from an IncomingMessage.
	 *
	 * @author Loren Goodwin
	 */
	static async getBody(incomingMessage : IncomingMessage) : Promise<string>
	{
		return new Promise((resolve, reject) =>
		{
			let body = "";

			incomingMessage.on("data", (chunk) =>
			{
				body += chunk;
			});

			incomingMessage.on("error", () =>
			{
				reject(new Error("[BodyParser] Failed to get IncomingMessage body."));
			});

			incomingMessage.on("end", () =>
			{
				resolve(body);
			});
		});
	}

	/**
	 * Parses a form data request body.
	 *
	 * @author Loren Goodwin
	 */
	static async parseFormBody(incomingMessage : IncomingMessage) : Promise<Body>
	{
		return new Promise((resolve, reject) =>
		{
			const formidable = new Formidable();

			formidable.parse(incomingMessage, (error, fields, files) =>
			{
				if (error != null)
				{
					reject(error);
				}

				const body = new Body();

				for (const [ name, value ] of Object.entries(fields))
				{
					if (Array.isArray(value))
					{
						body.fields[name] = value[0];
						body.fieldArrays[name] = value;
					}
					else
					{
						body.fields[name] = value;
						body.fieldArrays[name] = [ value ];
					}
				}

				for (const [ name, value ] of Object.entries(files))
				{
					if (Array.isArray(value))
					{
						body.files[name] = value[0];
						body.fileArrays[name] = value;
					}
					else
					{
						body.files[name] = value;
						body.fileArrays[name] = [value];
					}
				}

				resolve(body);
			});
		});
	}

	/**
	 * Parses a JSON request body.
	 *
	 * @author Loren Goodwin
	 */
	static async parseJsonBody(incomingMessage : IncomingMessage) : Promise<Body>
	{
		const rawBody = await BodyParserMiddleware.getBody(incomingMessage);

		const object = JSON.parse(rawBody);

		const body = new Body();

		for (const [ name, value ] of Object.entries(object))
		{
			body.fields[name] = value as string;
			body.fieldArrays[name] = [ value as string ];
		}

		body.raw = rawBody;

		return body;
	}

	/** The middleware function. */
	execute : Middleware;

	/**
	 * Constructs a new BodyParserMiddleware.
	 *
	 * @author Loren Goodwin
	 */
	constructor()
	{
		this.execute = async (context, next) =>
		{
			//
			// Get Content Type
			//

			const contentType = context.request.type;

			//
			// Parse Body
			//

			let parsedBody;

			switch (contentType)
			{
				case "application/x-www-form-urlencoded":
				case "multipart/form-data":
					parsedBody = await BodyParserMiddleware.parseFormBody(context.req);

					break;

				case "application/json":
					parsedBody = await BodyParserMiddleware.parseJsonBody(context.req);

					break;

				case "":
					parsedBody = new Body();

					break;

				default:
					throw new Error(`[BodyParserMiddleware] Unsupported Content-Type: ${ contentType }`);
			}

			//
			// Add Parsed Body to Context
			//

			context.parsedBody = parsedBody;

			//
			// Execute Next Middleware
			//

			await next();
		};
	}
}