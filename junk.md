
## Design

### Modular Editor API
* editor.upsertNoteGp(noteGp : NoteGp, voiceIdx : Number)
  - Remove any overlapping notes and fill in any void with rest.
* editor.upsertChord(chord : Chord)
  - Remove any chord at the same start.
* editor.removeChord(start : Frac)
* editor.shortenNoteGp(end : Frac, newEnd : Frac)
* editor.removeNoteGp(end : Frac)
* editor.setPickUp(duration : Frac)
* noteGp.fromNoteNums(start : Frac, endTime : Frac, noteNums : Array<Number>)
* noteGp.fromSpellings(start : Frac, endTime : Frac, spellings : Array<Spelling>)
* chord.build(start : Frac, chordString : string)


## Future

* Need keyup evts to distinguish grace notes from multiple notes.
  - This will also help with staccato, if needed.
* AAB sequencing. [Autumn leaves](http://www.jazclass.aust.com/articles/aut.htm#03).


* Grace note should be part of the following note for remove and navigate.
  - What if I want to lengthen the grace note?
* Design upsert pipeline

## Design Upsert pipeline

* Storage/serialization must be simple
  - Use an Array of notes
* Doubly linked list satisfies the edit requirements
  - given an index, add or remove a note in O(1) time at that index.
  - access the notes to the left and right of the selected index.
* Slow access okay for clicking
  - This requires searching for notes at a particular location (line, measure and beat).
  - This can be improved by computing a map of location to note index periodically and on-demand in a web worker.

## Done
* Design tieless
  - How to split a noteGp within a measure.
* Display cloneId
* Add menu.
  - Make it easy to add bass comping.
* shiftIn
* changing key sig
* Delete song.
* Tranpose for a given signature.
  - expose it via a url searchParam as well.
* Owners page.
* Paginate
* impl doc.append.
* Use chord to decide correct spelling of a note.
* chord mode.
* noteNumShift.
* impl shortenPrevNoteGp.