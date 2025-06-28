import * as frac from './frac.js';
import * as math from './math.js';
import * as spell from './spell.js';


class Info {
  constructor(timeMs, noteNum) {
    this.timeMs = timeMs;
    // null means it's a beat, not a note.
    this.noteNum = noteNum || null;
  }
  toString(defaultStr) {
    if (!this.noteNum) {
      return defaultStr;
    }
    return spell.fromNoteNum(this.noteNum)
  }
}

export class Aggregator {
  constructor(
      beatSub, notedownSub, beatModeSub, eBanner, stateMgr) {
    const beatsPerMeasure = stateMgr.doc.timeSigNumer;
    const thresholdForBeatBeforeNote = 50;

    let infoBuffer = [];
    beatModeSub((bm, time) => {
      if (bm) {
        return;
      }
      process(infoBuffer, stateMgr);
      infoBuffer = [];
    });

    beatSub(time => {
      infoBuffer.push(new Info(time));
      // TODO add startingBeat
      eBanner.display(infoBufferToString(infoBuffer, beatsPerMeasure));
    });

    notedownSub((noteNums, start) => {
      window.setTimeout(_ => {
        infoBuffer.push(new Info(start, noteNums[0]));
        eBanner.display(infoBufferToString(infoBuffer, beatsPerMeasure));
      }, thresholdForBeatBeforeNote);
    });
  }
  // Compute subdivsion (use per beat and per 2 beats for potential candidates)
  process(infoBuffer, stateMgr) {

  }
}

function infoBufferToString(infoBuffer, beatsPerMeasure, startingBeat) {
  startingBeat = 0;
  let numBars = 0;
  const strs = infoBuffer.map(item => {
    const isStartOfMeas = numBars % beatsPerMeasure === startingBeat % beatsPerMeasure;
    const str = item.toString(isStartOfMeas ? '|' : ';');
    if (!item.noteNum) {
      numBars++;
    }
    return str;
  });
  return strs.slice(Math.max(0, strs.length - 10)).join(' ');
}

