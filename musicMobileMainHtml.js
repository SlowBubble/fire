
const styleImport = `
<link rel="stylesheet" href="mobile-canvas.css">
<link rel="stylesheet" type="text/css" href="lib/abcjs-midi.css">
`;

const controlDiv = `
<div id='control-div'>
  <button id='save-control'>Save</button>
  <button id='home-control'>Home</button>
  <button id='delete-control'>Delete</button>
</div>
`;

// TODO refactor unselectable logic into a function:
// div.onselectstart = _ => { return false; }
// div.style['-moz-user-select'] = 'none';
// ...

const beatDiv = `
<div onselectstart="return false" id='beat-div'>
  <div onselectstart="return false">Create beats by tapping this panel!</div>
</div>
`;

const canvasDiv = `
<div id='canvas-div' onselectstart="return false">
  Create notes by tapping this panel!
</div>
`;

const noteDiv = `
<div onselectstart="return false" id='note-div'>
  ${canvasDiv}
</div>
`;

export const shadowRootHtml = `
${styleImport}
<div id='app'>
  ${controlDiv}
  ${noteDiv}
  ${beatDiv}
</div>
`;

const ctrlValvesDiv = `
<div onselectstart="return false" id='beat-div'>
  <div onselectstart="return false">Control the octave of the trumpet using your left 3 fingers</div>
</div>
`;

const valvesDiv = `
<div onselectstart="return false" id='note-div'>
</div>
`;

export const trumpetHtml = `
${styleImport}
<div id='app'>
  ${controlDiv}
  ${valvesDiv}
  ${ctrlValvesDiv}
</div>
`;