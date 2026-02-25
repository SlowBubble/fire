
export function insertScriptsDynamically(shadowRoot) {
  const srcs = [
    "lib/midi.js/inc/shim/Base64.js",
    "lib/midi.js/inc/shim/Base64binary.js",
    "lib/midi.js/inc/shim/WebAudioAPI.js",
    "lib/midi.js/js/midi/audioDetect.js",
    "lib/midi.js/js/midi/gm.js",
    "lib/midi.js/js/midi/loader.js",
    "lib/midi.js/js/midi/plugin.audiotag.js",
    "lib/midi.js/js/midi/plugin.webaudio.js",
    "lib/midi.js/js/midi/plugin.webmidi.js",
    "lib/midi.js/js/util/dom_request_xhr.js",
    "lib/midi.js/js/util/dom_request_script.js",
  ];
  srcs.forEach(src => {
    const script = document.createElement('script');
    script.src = src;
    script.type = "text/javascript";
    shadowRoot.appendChild(script);
  });
}

export function setup(ebanner, noteOnSubs, noteOffSubs, pedalDelayMillis) {
  const volume = 120;
  const pedalDelay = (pedalDelayMillis || 0) / 1000;

  const onSubs = Array.isArray(noteOnSubs) ? noteOnSubs : [noteOnSubs];
  const offSubs = Array.isArray(noteOffSubs) ? noteOffSubs : [noteOffSubs];

  MIDI.loadPlugin({
    soundfontUrl: "./lib/midi.js/soundfont/",
    instrument: "acoustic_grand_piano",
    onprogress: function (state, progress) {
      // console.log(state, progress);
    },
    onsuccess: function () {
      ebanner.display('Sound enabled.');
      // play the note
      MIDI.setVolume(0, volume);
      onSubs.forEach(onSub => {
        if (onSub) {
          onSub((noteNumOrNums, time) => {
            const nums = Array.isArray(noteNumOrNums) ? noteNumOrNums : [noteNumOrNums];
            nums.forEach(n => {
              if (n != null) MIDI.noteOn(0, n, volume);
            });
          });
        }
      });
      offSubs.forEach(offSub => {
        if (offSub) {
          offSub((noteNumOrNums, time) => {
            const nums = Array.isArray(noteNumOrNums) ? noteNumOrNums : [noteNumOrNums];
            nums.forEach(n => {
              if (n != null) MIDI.noteOff(0, n, pedalDelay);
            });
          });
        }
      });
    }
  });

}