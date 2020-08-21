
import * as action from './action.js';
import * as banner from './banner.js';
import * as beat from './beat.js';
import * as event from './event.js';
import * as musicKeyboard from './musicKeyboard.js';
import * as musicMobileKeyboard from './musicMobileKeyboard.js';
import * as mobileMenu from './mobileMenu.js';
import * as musicMobileMainHtml from './musicMobileMainHtml.js';
import * as sound from './sound.js';
import * as state from './state.js';
import * as mobile from './mobile.js';
import * as melodicSnapshot from './melodicSnapshot.js';
import * as signIn from './signIn.js';


export class MusicMobileCanvas extends HTMLElement {
  connectedCallback() {
    // For debugging purposes
    window.musicMobileCanvas = this;

    // 0. Setup html
    // Disabling shadow root because certain elements are inaccessible to abcjs.
    // const shadowRoot = this.attachShadow({ mode: 'open' });
    const shadowRoot = this;
    shadowRoot.innerHTML = musicMobileMainHtml.shadowRootHtml;

    const eBanner = new banner.EphemeralBanner();
    document.body.appendChild(eBanner);

    const [possBeatPub, possBeatSub] = event.pubsub();
    const [beatPub, beatSub] = event.pubsub();
    const [notedownPub, notedownSub] = event.pubsub();
    const [noteupPub, noteupSub] = event.pubsub();
    const [beatModePub, beatModeSub] = event.pubsub();
    const [aggrStoppedPub, aggrStoppedSub] = event.pubsub();
    const [aggrPub, aggrSub] = event.pubsub();
    const [appendPub, appendSub] = event.pubsub();
    const [roundedNotesPub, roundedNotesSub] = event.pubsub();
    const [renderPub, renderSub] = event.pubsub();
    const [execPub, execSub] = event.pubsub();
    const [disablePub, disableSub] = event.pubsub();

    const url = new URL(document.URL);
    let urlId = url.searchParams.get('id');
    if (!urlId) {
      urlId = (new Date).toISOString().replace(/:/g,'_');
      const newUrl = new URL(document.URL);
      newUrl.searchParams.set('id', urlId);
      window.location.href = newUrl.href;
    }

    // TODO:Replace this section via event-driven components
    const stateMgr = new state.StateMgr(eBanner, urlId, shadowRoot, execPub);
    // For debugging purposes
    this.stateMgr = stateMgr;

    function renderFunc() {
      const abc = stateMgr.getAbc();
      const params = {};
      const moreParams = mobile.isMobile() ? { responsive: 'resize' } : {};
      const canvasDiv = shadowRoot.querySelector("#canvas-div")
      ABCJS.renderAbc(canvasDiv, abc, params, moreParams);
    }
    // Disabling render because it causes issues with notedown detection
    // renderSub(_ => {
    //   renderFunc();
    // });
    const actionMgr = new action.ActionMgr(
      eBanner, stateMgr, renderPub, execPub, execSub, shadowRoot);

    const noteGpsMgr = new melodicSnapshot.NoteGpsMgr(
      beatModeSub, stateMgr, aggrStoppedSub);

    const noteDiv = shadowRoot.querySelector("#note-div")
    const beatDiv = shadowRoot.querySelector("#beat-div")
    new musicMobileKeyboard.NoteDownFilter(noteDiv, notedownPub, noteupPub, noteGpsMgr);
    new musicMobileKeyboard.PossBeatFilter(beatDiv, possBeatPub);
    new musicKeyboard.BeatFilter(disablePub, disableSub, possBeatSub, beatPub, beatModePub, eBanner, renderPub);

    new beat.Aggregator(beatSub, notedownSub, beatModeSub, aggrPub, appendPub, aggrStoppedPub, stateMgr);
    new beat.Rounder(aggrSub, roundedNotesPub);
    const resourceContentionDelayMillis = 100;
    new beat.Upserter(
      roundedNotesSub, appendSub, stateMgr, actionMgr, resourceContentionDelayMillis);

    mobileMenu.setup(shadowRoot, actionMgr, stateMgr, disablePub);
    signIn.setupHomeButton(shadowRoot);

    // Needed to not break abcjs's midi when in view mode.
    sound.insertScriptsDynamically(shadowRoot);
    const pedalDelayMillis = 200;
    window.onload = _ => {
      sound.setup(eBanner, notedownSub, noteupSub, pedalDelayMillis);
    }
  }
}

customElements.define('music-mobile-canvas', MusicMobileCanvas);
