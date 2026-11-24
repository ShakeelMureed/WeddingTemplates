import introMovie from './media/intro.mp4';
import music from './media/music.mp3';
import couple from './media/gallery/ruby-couple.webp';
import mehndi from './media/gallery/ruby-mehndi.webp';
import barat from './media/gallery/ruby-barat.webp';
import divider from './assets/images/floral-divider.webp';
import scratchFrame from './assets/images/scratch-frame.webp';

const files = { 'intro.mp4': introMovie, 'music.mp3': music, 'ruby-couple.webp': couple, 'ruby-mehndi.webp': mehndi, 'ruby-barat.webp': barat, 'floral-divider.webp': divider, 'scratch-frame.webp': scratchFrame };
export function asset(path) { const file = files[path.split('/').pop()]; return file?.src || path; }
