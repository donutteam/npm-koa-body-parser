//
// Imports
//

import { File } from "formidable";

//
// Exports
//

/** A class used to standardise parsed bodies. */
export class Body
{
	/** An object containing keys for each field in the body and the FIRST value with that name. */
	fields : { [key : string] : string }= {};

	/** An object containing keys for each field in the body and an array of ALL values with that name. */
	fieldArrays : { [key : string] : string[] } = {};

	/** An object containing files that were in the body. */
	files : { [key : string] : File } = {};

	/** An object containg arrays of files that were in the body. */
	fileArrays : { [key : string] : File[] } = {};

	/** The raw body of the request. */
	raw;
}