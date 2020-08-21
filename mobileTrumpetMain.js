
import * as banner from './banner.js';
import * as event from './event.js';
import * as mobileMenu from './mobileMenu.js';
import * as mobileTrumpetKeyboard from './mobileTrumpetKeyboard.js';
import * as musicMobileMainHtml from './musicMobileMainHtml.js';
import * as sound from './sound.js';
import * as state from './state.js';
import * as trumpet from './trumpet.js';
import * as signIn from './signIn.js';


export class MobileTrumpet extends HTMLElement {
  connectedCallback() {
    // For debugging purposes
    window.musicMobileCanvas = this;

    // 0. Setup html
    // Disabling shadow root because certain elements are inaccessible to abcjs.
    // const shadowRoot = this.attachShadow({ mode: 'open' });
    const shadowRoot = this;
    shadowRoot.innerHTML = musicMobileMainHtml.trumpetHtml;

    const eBanner = new banner.EphemeralBanner();
    document.body.appendChild(eBanner);


    const [notedownPub, notedownSub] = event.pubsub();
    const [noteupPub, noteupSub] = event.pubsub();
    const [valveDownPub, valveDownSub] = event.pubsub();
    const [valveUpPub, valveUpSub] = event.pubsub();
    const [execPub, _] = event.pubsub();

    const stateMgr = new state.StateMgr(eBanner, null, shadowRoot, execPub);

    const valvesDiv = shadowRoot.querySelector("#note-div");
    const ctrsDiv = shadowRoot.querySelector("#beat-div");
    trumpet.setup(valveDownSub, valveUpSub, notedownPub, noteupPub, valvesDiv);
    new mobileTrumpetKeyboard.NoteDownFilter(valvesDiv, ctrsDiv, valveDownPub, valveUpPub);

    notedownSub((noteNums, time) => {
      stateMgr.upsertWithoutDur([noteNums], time);
    });

    mobileMenu.setupMobileTrumpet(shadowRoot, stateMgr);
    signIn.setupHomeButton(shadowRoot);

    const pedalDelayMillis = 120;
    window.onload = _ => {
      sound.setup(eBanner, notedownSub, noteupSub, pedalDelayMillis);
    }
  }
}

customElements.define('mobile-trumpet', MobileTrumpet);
