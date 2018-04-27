'use strict';

/*
    Imports
*/

const fs = require('fs');

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

// Event categories
const CATEGORIES = Object.freeze({
    LECTURE  : 'Cours',
    EXERCISE : 'Exercices',
    PROJECT  : 'Projet',
    LAB      : 'Labo' // TODO: Check
});

// Strings to look for during the traversal
const MATCHES = Object.freeze({
    BEGIN_EVENT : 'BEGIN:VEVENT',
    END_EVENT   : 'END:VEVENT',
    SUMMARY     : 'SUMMARY:',
    CATEGORIES  : 'CATEGORIES:'
});

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

Object.freeze(LANGUAGE_MAPPINGS[LANGUAGES.FRENCH]);
Object.freeze(LANGUAGE_MAPPINGS[LANGUAGES.ENGLISH]);
Object.freeze(LANGUAGE_MAPPINGS);

// Error exit codes
const ERRORS = Object.freeze({
    INCORRECT_NUMBER_OF_ARGUMENTS : 1,
    UNRECOGNIZED_LANGUAGE         : 2,
    READ_FILE                     : 3
});

// CLI usage text
const USAGE =
`Usage: node please-correct.js input_file [language]

Parameters:
	input_file - The name of the iCal file to be corrected.
	language   - Optional language to be used for the corrected iCal file.
	             Possible values are "fr" for French (default) and "en" for English.

Public repository: https://github.com/raja-s/epfl-isa-ical-export-correction-tool-pro`;

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

// CLI arguments
let filename = process.argv[2];
let language = process.argv[3] || DEFAULT_LANGUAGE;

// If the given language is not present in the `LANGUAGES`
// object, then print an error message and exit with the
// corresponding error code
if (!Object.values(LANGUAGES).includes(language)) {
    error(`Unrecognized language '${language}'`, ERRORS.UNRECOGNIZED_LANGUAGE);
}

// File contents split by line
let lines;

// Try to read the file with the given name
try {
    lines = fs.readFileSync(filename, { encoding : 'utf8' }).split('\n');
} catch (readError) {
    error(`Unable to read file '${filename}'`, ERRORS.READ_FILE);
}

// Traversal index
let index = 0;

// Loop through the lines of the input file
while (index < lines.length) {
    
    let line = lines[index];
    
    // If it is not the beginning of an event, continue
    if (line !== MATCHES.BEGIN_EVENT) {
        index++;
        continue;
    }
    
    let eventCategory = null;
    let summaryIndex  = -1;
    
    // Loop through the lines of the event
    while ((line !== MATCHES.END_EVENT) && (index < lines.length)) {
        
        // If it is a 'CATEGORIES' line...
        if (line.startsWith(MATCHES.CATEGORIES)) {
            
            let category = line.split(MATCHES.CATEGORIES)[1];
            
            // ...and the category is one of the known categories,
            // then save the category for later
            if (Object.values(CATEGORIES).includes(category)) {
                eventCategory = category;
            }
            
        }
        
        // If it is a 'SUMMARY' line, then save the line index for later
        else if (line.startsWith(MATCHES.SUMMARY)) {
            summaryIndex = index;
        }
        
        index++;
        line = lines[index];
        
    }
    
    // If we have a valid event category and summary line index,
    // then insert the event category into the beginning of the summary
    if ((eventCategory !== null) && (summaryIndex !== -1)) {
        
        let summary = lines[summaryIndex].split(MATCHES.SUMMARY)[1];
        
        lines[summaryIndex] =
            `${MATCHES.SUMMARY}${LANGUAGE_MAPPINGS[language][eventCategory]} - ${summary}`;
        
    }
    
}

// Print the corrected calendar to standard output
process.stdout.write(lines.join('\n'));
