import veil from './assets/img/veil.webp';
import opener from './assets/video/opener.mp4';
import music from './assets/audio/music.mp3';
import petal from './assets/img/petal-1.webp';
import bareHand from './assets/img/hand-bare.webp';
import ringHand from './assets/img/hand-ring.webp';
import ring from './assets/img/ring.webp';
import moon from './assets/img/moon.webp';
import bangles from './assets/img/bangles.webp';
import alcove from './assets/img/alcove.webp';
import venue from './assets/img/venue.webp';
import lantern from './assets/img/lantern.webp';
import nightMid from './assets/img/night-mid.webp';
import nightFront from './assets/img/night-front.webp';

const files = { 'veil.webp': veil, 'opener.mp4': opener, 'music.mp3': music, 'petal-1.webp': petal, 'hand-bare.webp': bareHand, 'hand-ring.webp': ringHand, 'ring.webp': ring, 'moon.webp': moon, 'bangles.webp': bangles, 'alcove.webp': alcove, 'venue.webp': venue, 'lantern.webp': lantern, 'night-mid.webp': nightMid, 'night-front.webp': nightFront };
export function asset(path) { const file = files[path.split('/').pop()]; return file?.src || path; }
