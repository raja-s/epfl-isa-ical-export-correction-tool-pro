'use strict';

/*
    Constants
*/

// Number of given argument
const ARGUMENT_COUNT = process.argv.length - 2;

// Valid correction languages
const LANGUAGES = {
    ENGLISH : 'en',
    FRENCH  : 'fr'
};

// Default correction language
const DEFAULT_LANGUAGE = LANGUAGES.FRENCH;

// Event categories
const CATEGORIES = {
    LECTURE  : 'Cours',
    EXERCISE : 'Exercices',
    PROJECT  : 'Projet',
    LAB      : 'Labo' // TODO: Check
};

// Strings to look for during the traversal
const MATCHES = {
    BEGIN_EVENT : 'BEGIN:VEVENT',
    END_EVENT   : 'END:VEVENT',
    SUMMARY     : 'SUMMARY:',
    CATEGORIES  : 'CATEGORIES:'
};

// Event category-title mappings for each language
const LANGUAGE_MAPPINGS = {};

LANGUAGE_MAPPINGS[LANGUAGES.FRENCH] = {};

LANGUAGE_MAPPINGS[LANGUAGES.FRENCH][CATEGORIES.LECTURE]  = CATEGORIES.LECTURE;
LANGUAGE_MAPPINGS[LANGUAGES.FRENCH][CATEGORIES.EXERCISE] = CATEGORIES.EXERCISE;
LANGUAGE_MAPPINGS[LANGUAGES.FRENCH][CATEGORIES.PROJECT]  = CATEGORIES.PROJECT;
LANGUAGE_MAPPINGS[LANGUAGES.FRENCH][CATEGORIES.LAB]      = CATEGORIES.LAB;

LANGUAGE_MAPPINGS[LANGUAGES.ENGLISH] = {};

LANGUAGE_MAPPINGS[LANGUAGES.ENGLISH][CATEGORIES.LECTURE]  = 'Lecture';
LANGUAGE_MAPPINGS[LANGUAGES.ENGLISH][CATEGORIES.EXERCISE] = 'Exercise';
LANGUAGE_MAPPINGS[LANGUAGES.ENGLISH][CATEGORIES.PROJECT]  = 'Project';
LANGUAGE_MAPPINGS[LANGUAGES.ENGLISH][CATEGORIES.LAB]      = 'Lab';

// Traversal states
const STATES = {
    
    // Seeking the 'BEGIN' tag of the next event (initial state)
    SEEKING_NEXT_EVENT     : 0,
    
    // Event found, seeking the event's 'CATEGORIES' tag
    // whose value is one of the known categories
    SEEKING_EVENT_CATEGORY : 1,
    
    // Event category identified, seeking the event's 'SUMMARY'
    // tag in order to insert the category string in its value
    SEEKING_EVENT_SUMMARY  : 2
    
};

// Error exit codes
const ERRORS = {
    INCORRECT_NUMBER_OF_ARGUMENTS : 1,
    UNRECOGNIZED_LANGUAGE         : 2,
    READ_FILE                     : 3,
    WRITE_FILE                    : 4
};

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
