export class NoteDownFilter {
  constructor(noteDiv, notedownEvtPub, noteupPub, noteGpsMgr) {
    noteDiv.addEventListener('touchstart', evt => {
      const now = Date.now();
      const noteNums = noteGpsMgr.getCurrNoteNums();
      notedownEvtPub(noteNums, now);
    });
    noteDiv.addEventListener('touchend', evt => {
      const now = Date.now();
      const noteNums = noteGpsMgr.getCurrNoteNumsAndIncr();
      noteupPub(noteNums, now);
    });
  }
}

// Publish possible beats as beat event.
export class PossBeatFilter {
  constructor(beatDiv, possBeatPub) {
    beatDiv.addEventListener('touchstart', evt => {
      const now = Date.now();
      possBeatPub(now);
    });
  }
}
