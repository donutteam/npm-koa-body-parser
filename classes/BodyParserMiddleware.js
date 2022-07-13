//
// Imports
//

import { Formidable } from "formidable";

import { Body } from "./Body.js";

//
// Middleware
//

/**
 * A class for creating body parser middlewares.
 */
export class BodyParserMiddleware
{
	/**
	 * Gets a request body from an IncomingMessage.
	 *
	 * @param {import("node:http").IncomingMessage} incomingMessage An incoming message.
	 * @author Loren Goodwin
	 */
	static getBody(incomingMessage)
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
	 * @param {import("http").IncomingMessage} incomingMessage An incoming message.
	 * @returns {Object} An object containing the fields from the form data.
	 */
	static parseFormBody(incomingMessage)
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

				for (const [ fieldName, fieldArray ] of Object.entries(fields))
				{
					body.fields[ fieldName ] = fieldArray[ 0 ];
					body.fieldArrays[ fieldName ] = fieldArray;
				}

				body.files = files;

				resolve(body);
			});
		});
	}

	/**
	 * Parses a JSON request body.
	 *
	 * @param {import("http").IncomingMessage} incomingMessage An incoming message.
	 * @returns {Object} An object containing the fields from the JSON.
	 */
	static async parseJsonBody(incomingMessage)
	{
		const rawBody = await BodyParserMiddleware.getBody(incomingMessage);

		const object = JSON.parse(rawBody);

		const body = new Body();

		for (const [ key, value ] of Object.entries(object))
		{
			body.fields[ key ] = value;
			body.fieldArrays[ key ] = [ value ];
		}

		return body;
	}

	/**
	 * Constructs a new BodyParserMiddleware.
	 *
	 * @author Loren Goodwin
	 */
	constructor()
	{
		/**
		 * A middleware for parsing JSON and form data request bodies.
		 *
		 * @param {import("koa").Context} context A Koa context.
		 * @param {Function} next A function that executes the next middleware.
		 */
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
					throw new Error(`[BodyParser] Unsupported Content-Type: ${ contentType }`);
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