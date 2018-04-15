'use strict';

/*
    Constants
*/

// Number of given argument
const ARGUMENT_COUNT = process.argv.length - 2;

// Valid correction languages
const LANGUAGES = Object.freeze({
    ENGLISH : 'en',
    FRENCH  : 'fr'
});

// Default correction language
const DEFAULT_LANGUAGE = LANGUAGES.FRENCH;

// Error exit codes
const ERRORS = Object.freeze({
    INCORRECT_NUMBER_OF_ARGUMENTS : 1,
    UNRECOGNIZED_LANGUAGE         : 2,
    READ_FILE                     : 3,
    WRITE_FILE                    : 4
});

// CLI usage text
const USAGE =
`Usage: node please-correct.js filename [language]

Parameters:
	filename - The name of the iCal file to be corrected.
	language - Optional language to be used for the corrected iCal file.
	           Possible values are "fr" for French (default) and "en" for English.

Public repository: https://github.com/raja-s/epfl-isa-ical-export-correction-tool-pro`;

/*
    Variables
*/

// CLI arguments
let filename, language;

/*
    Functions
*/

/**
 * Prints the given error message with an "ERROR"
 * label and exits with the given exit code.
 */
function error(message, exitCode) {
    console.log(`ERROR: ${message}.`);
    process.exit(exitCode);
}

/*
    Execution
*/

// If the given number of arguments is incorrect, then print
// the usage text and exit with the corresponding error code
if ((ARGUMENT_COUNT === 0) || (ARGUMENT_COUNT > 2)) {
    console.log(USAGE);
    process.exit(ERRORS.INCORRECT_NUMBER_OF_ARGUMENTS);
}

filename = process.argv[2];
language = process.argv[3] || DEFAULT_LANGUAGE;

// If the given language is not present in the `LANGUAGES`
// object, then print an error message and exit with the
// corresponding error code
if (!Object.values(LANGUAGES).includes(language)) {
    error(`Unrecognized language '${language}'`, ERRORS.UNRECOGNIZED_LANGUAGE);
}
