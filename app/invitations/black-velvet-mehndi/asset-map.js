import introPoster from './media/intro-poster.webp';
import introMovie from './media/intro.mp4';
import music from './media/music.mp3';
import mehndi from './media/gallery/mehndi.webp';
import mehfil from './media/gallery/mehfil.webp';
import tabla from './media/gallery/tabla.webp';
import divider from './assets/images/floral-divider.webp';
import scratchFrame from './assets/images/scratch-frame.webp';
import henna from './assets/images/henna.webp';

const files = { 'intro-poster.webp': introPoster, 'intro.mp4': introMovie, 'music.mp3': music, 'mehndi.webp': mehndi, 'mehfil.webp': mehfil, 'tabla.webp': tabla, 'floral-divider.webp': divider, 'scratch-frame.webp': scratchFrame, 'henna.webp': henna };
export function asset(path) { const file = files[path.split('/').pop()]; return file?.src || path; }
