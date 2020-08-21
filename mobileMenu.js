
export function setupMobileTrumpet(shadowRoot, stateMgr) {
  shadowRoot.querySelector('#home-control').onclick = _ => {
    window.location.href = 'index.html';
  }
  shadowRoot.querySelector('#delete-control').onclick = _ => {
    // Silent note; This is needed because on mobile, the first
    // non-functional midi sound must be initialize by a click.
    MIDI.noteOn(0, 60, 0);
    MIDI.noteOff(0, 60, 0);

    while (!stateMgr.atHead()) {
      stateMgr.shortenPrevNoteGp();
    }
  }
  shadowRoot.querySelector('#save-control').onclick = _ => {
    const urlId = (new Date).toISOString().replace(/:/g,'_');
    stateMgr.setUrlId(urlId);
    stateMgr.quantize();
    stateMgr.save(false, _ => {
      const url = new URL(document.URL);
      const songUrl = new URL('/fire/musicMobile.html', url.origin);
      songUrl.searchParams.set('id', urlId);
      window.location.href = songUrl.href;
    });

  }
}

export function setup(shadowRoot, actionMgr, stateMgr, disablePub) {
  shadowRoot.querySelector('#home-control').onclick = _ => {
    window.location.href = 'index.html';
  }
  shadowRoot.querySelector('#delete-control').onclick = _ => {
    // Silent note
    MIDI.noteOn(0, 60, 0);
    MIDI.noteOff(0, 60, 0);

    disablePub();
    actionMgr.exec(_ => {
      stateMgr.shortenPrevNoteGp();
    });
  }

  shadowRoot.querySelector('#save-control').onclick = _ => {
    disablePub();
    stateMgr.save(false, _ => {
      const url = new URL(document.URL);
      const songUrl = new URL('/fire/music.html', url.origin);
      songUrl.searchParams.set('id', stateMgr.urlId);
      songUrl.searchParams.set('view', '1');
      window.location.href = songUrl.href;
    });
  }
}


  // shadowRoot.querySelector('#space-control').onclick = _ => {
  //   disablePub();
  //   actionMgr.exec(_ => {
  //     if (stateMgr.atTail()) {
  //       stateMgr.upsertWithoutDur([]);
  //     } else {
  //       stateMgr.navRight();
  //     }
  //   });
  // }
  // shadowRoot.querySelector('#left-control').onclick = _ => {
  //   disablePub();
  //   actionMgr.exec(_ => {
  //     stateMgr.navLeft();
  //   });
  // }