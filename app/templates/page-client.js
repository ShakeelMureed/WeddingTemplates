'use client';

import bloomCover from './assets/bloom-cover.jpg';
import seharCover from './assets/sehar-cover.webp';
import rubyCover from '../invitations/ruby/assets/images/scratch-frame.webp';
import swanCover from '../invitations/swan/assets/images/hero.webp';
import bahaarCover from '../invitations/bahaar/assets/video/intro-poster.webp';
import zareenCover from '../invitations/zareen/assets/images/cover-poster.webp';
import mithrilCover from '../invitations/mithril/assets/images/poster.webp';
import wisteriaCover from '../invitations/wisteria-engagement/assets/img/veil.webp';
import blackVelvetCover from '../invitations/black-velvet-mehndi/media/intro-poster.webp';
import doorsMehrCover from '../invitations/doors-of-mehr/media/intro-poster.webp';
import mughalCover from '../invitations/mughal-mehndi-barat/media/gallery/ruby-couple.webp';
import './templates.css';

const templates = [
  { name: 'Bloom', style: 'Romantic garden', href: '/invitations/bloom', image: bloomCover },
  { name: 'Sehar', style: 'Ivory and gold', href: '/invitations/sehar', image: seharCover },
  { name: 'Ruby', style: 'Burgundy and roses', href: '/invitations/ruby', image: rubyCover },
  { name: 'Swan', style: 'Watercolour and sapphire', href: '/invitations/swan', image: swanCover },
  { name: 'Bahaar', style: 'Garden florals and rose', href: '/invitations/bahaar', image: bahaarCover },
  { name: 'Zareen', style: 'Champagne and blue', href: '/invitations/zareen', image: zareenCover },
  { name: 'Mithril', style: 'Ivory and crystal', href: '/invitations/mithril', image: mithrilCover },
  { name: 'Wisteria Engagement', style: 'Moonlit lavender garden', href: '/invitations/wisteria-engagement', image: wisteriaCover },
  { name: 'Black Velvet Mehndi', style: 'Candlelight and deep rose', href: '/invitations/black-velvet-mehndi', image: blackVelvetCover },
  { name: 'Doors of Mehr', style: 'Ivory doors and five festivities', href: '/invitations/doors-of-mehr', image: doorsMehrCover },
  { name: 'Mughal Mehndi Barat', style: 'Painted Mughal procession', href: '/invitations/mughal-mehndi-barat', image: mughalCover },
  { name: 'Aangan', style: 'Garden courtyard · sage & ivory', href: '/invitations/aangan', image: 'https://images.unsplash.com/photo-1670529776180-60e4132ab90c?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Neelam', style: 'After-dark garden · midnight blue', href: '/invitations/neelam', image: 'https://images.unsplash.com/photo-1762926628297-bbb137ed9968?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Sunehri', style: 'Candlelit hall · antique gold', href: '/invitations/sunehri', image: 'https://images.unsplash.com/photo-1582181524507-4ec8300ffbfc?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Jhoomar', style: 'Velvet hall · crystal and aubergine', href: '/invitations/jhoomar', image: 'https://images.unsplash.com/photo-1582181524507-4ec8300ffbfc?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Roshni', style: 'Garden evening · fairy lights', href: '/invitations/roshni', image: 'https://images.unsplash.com/photo-1762926628297-bbb137ed9968?auto=format&fit=crop&w=1200&q=80' },
];

export default function TemplateGallery() {
  return <main className="template-gallery">
    <header className="template-nav"><a className="template-brand" href="/templates">Weds<span>Templates</span></a><span>WEDDING INVITATIONS</span></header>
    <section className="template-intro"><p>MADE FOR YOUR MOMENT</p><h1>Find your invitation</h1><span>Choose a design to preview the complete wedding experience.</span></section>
    <section className="template-grid" aria-label="Wedding invitation templates">
      {templates.map((item) => <a className="template-card" href={item.href} target="_blank" rel="noreferrer" key={item.name}>
        <div className="template-card-image"><img src={typeof item.image === 'string' ? item.image : item.image.src} alt={`${item.name} wedding invitation preview`} /><span>PREVIEW INVITATION ↗</span></div>
        <div className="template-card-title"><div><small>{item.style}</small><h2>{item.name}</h2></div><b aria-hidden="true">↗</b></div>
      </a>)}
    </section>
    <footer className="template-footer">WedsTemplates <span>Thoughtfully made for the people you love</span></footer>
  </main>;
}
