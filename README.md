
# EPFL ISA iCal Export Correction Tool Pro

Have you recently started your semester at EPFL, and registered for all your courses through ISA, then exported your calendar to an iCal file using ISA's "Export iCalendar" feature, then imported that calendar into your calendar app, then realized that the name of an event in that calendar doesn't say whether it's a lecture or an exercise session or other, and finally flipped a table out of frustration?

Not accounting for the last part, we're pretty much in the same situation here. The solution is obviously the EPFL ISA iCal Export Correction Tool Pro! It's a small JavaScript script that reads an iCal file, just like the one you download from ISA, and adds labels to the event names such as "Cours - " or "Exercices - ". Labels can be added in French or in English.

Notice that this is the Pro version.

# Instructions

In order to run the script, you need [node.js](https://nodejs.org/en/) (version 7.5.0 or higher).

```
Usage: node please-correct.js input_file [language]

Parameters:
	input_file - The name of the iCal file to be corrected.
	language   - Optional language to be used for the corrected iCal file.
	             Possible values are 'fr' for French (default) and 'en' for English.
```

The script dumps the corrected calendar to standard output, so a common usage would be for example:

```
node please-correct.js horaire.ics > corrected.ics
```
