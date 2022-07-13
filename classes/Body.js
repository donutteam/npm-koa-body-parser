//
// Exports
//

/**
 * A class used to standardise parsed bodies.
 */
export class Body
{
	/**
	 * An object containing keys for each field in the body and the FIRST value with that name.
	 */
	fields = {};

	/**
	 * An object containing keys for each field in the body and an array of ALL values with that name.
	 */
	fieldArrays = {};

	/**
	 * An object containing files that were in the body.
	 */
	files = {};

	/**
	 * An object containg arrays of files that were in the body.
	 */
	fileArrays = {};
}