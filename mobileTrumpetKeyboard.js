import * as trumpet from './trumpet.js';

export class NoteDownFilter {
  constructor(valvesDiv, ctrsDiv, valveDownPub, valveUpPub) {
    const valveXPositions = [
      window.innerWidth * 5 / 6,
      window.innerWidth * 3 / 6,
      window.innerWidth * 1 / 6,
    ];
    valvesDiv.addEventListener('touchstart', evt => {
      getValves(evt, valveXPositions, trumpet.valves).forEach(valve => {
        valveDownPub(valve);
      });
    });
    valvesDiv.addEventListener('touchend', evt => {
      getValves(evt, valveXPositions, trumpet.valves).forEach(valve => {
        valveUpPub(valve);
      });
    });
    ctrsDiv.addEventListener('touchstart', evt => {
      getValves(evt, valveXPositions, trumpet.ctrValves).forEach(valve => {
        valveDownPub(valve);
      });
    });
    ctrsDiv.addEventListener('touchend', evt => {
      getValves(evt, valveXPositions, trumpet.ctrValves).forEach(valve => {
        valveUpPub(valve);
      });
    });
  }
}

function getValves(evt, valveXPositions, valveValues) {
  const res = [];
  for (let i = 0; i < evt.changedTouches.length; i++) {
    res.push(pickValveAndUpdate(evt.changedTouches[i].clientX, valveXPositions, valveValues));
  }
  return res;
}

function pickValveAndUpdate(xPos, valveXPositions, valves) {
  let minDiff = Infinity;
  let minIdx = 0;
  valveXPositions.forEach((valveXPos, idx) => {
    const diff = Math.abs(valveXPos - xPos);
    if (diff < minDiff) {
      minDiff = diff;
      minIdx = idx;
    }
  });
  valveXPositions[minIdx] = xPos;
  return valves[minIdx];
}