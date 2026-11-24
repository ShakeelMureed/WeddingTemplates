import introPoster from './media/intro-poster.webp';
import introMovie from './media/intro.mp4';
import music from './media/music.mp3';
import divider from './assets/images/floral-divider.webp';
import scratchFrame from './assets/images/scratch-frame.webp';
import mayun from './assets/images/icon-mayun.webp';
import mehndi from './assets/images/icon-mehndi.webp';
import nikkah from './assets/images/icon-nikkah.webp';
import barat from './assets/images/icon-barat.webp';
import walima from './assets/images/icon-walima.webp';
import garden from './assets/images/venue-garden.webp';
import marquee from './assets/images/venue-marquee.webp';

const files = { 'intro-poster.webp': introPoster, 'intro.mp4': introMovie, 'music.mp3': music, 'floral-divider.webp': divider, 'scratch-frame.webp': scratchFrame, 'icon-mayun.webp': mayun, 'icon-mehndi.webp': mehndi, 'icon-nikkah.webp': nikkah, 'icon-barat.webp': barat, 'icon-walima.webp': walima, 'venue-garden.webp': garden, 'venue-marquee.webp': marquee };
export function asset(path) { const file = files[path.split('/').pop()]; return file?.src || path; }
