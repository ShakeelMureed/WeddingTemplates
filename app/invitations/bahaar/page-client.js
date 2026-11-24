'use client';

import { useEffect, useRef, useState } from 'react';
import './src/styles.css';
import introVideo from './assets/video/intro.mp4';
import introPoster from './assets/video/intro-poster.webp';
import musicFile from './assets/audio/music.mp3';
import gallery1 from './assets/gallery/gallery-01.webp';
import gallery2 from './assets/gallery/gallery-02.webp';
import gallery3 from './assets/gallery/gallery-03.webp';
import gallery4 from './assets/gallery/gallery-04.webp';
import gallery5 from './assets/gallery/gallery-05.webp';
import { InvitationFamilies, InvitationScratchCard } from './section-components';
import flower from './assets/images/flower.webp';
import sprig from './assets/images/sprig.webp';
import divider from './assets/images/divider.webp';

const media = (x) => typeof x === 'string' ? x : x.src;
const gallery = [gallery1, gallery2, gallery3, gallery4, gallery5];
const events = [
  { name: 'Mehndi', date: 'October 15, 2026', time: '5:00 PM — 8:00 PM', venue: "Water's Edge", detail: 'An evening of henna, music and colour with family and friends.', map: 'https://share.google/N2DXIhDjIMAk74g7N' },
  { name: 'Nikkah', date: 'October 16, 2026', time: '7:00 PM — 10:00 PM', venue: 'Dera Dari', detail: 'The solemnisation and the blessings of our families, followed by dinner.', map: 'https://maps.app.goo.gl/T4mQ72ddDWQ7UBqg9' },
  { name: 'Barat', date: 'October 17, 2026', time: '7:00 PM — 10:00 PM', venue: 'Aura Grande Enclave', detail: "The groom's procession and the bride's grand welcome.", map: 'https://share.google/Sj22CUrwQmhdkXYto' },
  { name: 'Valima', date: 'October 18, 2026', time: '7:00 PM — 10:00 PM', venue: 'The Royals Event Complex', detail: 'A celebratory dinner to conclude the festivities.', map: 'https://share.google/2BCM2QJ9oeyllqJIT' },
];

function downloadCalendar(items = events) {
  const lines = items.map((e, i) => {
    const day = String(15 + events.indexOf(e)).padStart(2, '0');
    const start = i === 0 && e.name === 'Mehndi' ? '170000' : '190000';
    const end = i === 0 && e.name === 'Mehndi' ? '200000' : '220000';
    return `BEGIN:VEVENT\nUID:bahaar-${i}@wedpk.local\nDTSTAMP:20260101T000000Z\nDTSTART:202610${day}T${start}\nDTEND:202610${day}T${end}\nSUMMARY:${e.name} — Ali & Fatima\nLOCATION:${e.venue}\nEND:VEVENT`;
  }).join('\n');
  const url = URL.createObjectURL(new Blob([`BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//WEDPK//Bahaar Invitation//EN\n${lines}\nEND:VCALENDAR`], { type: 'text/calendar' }));
  const link = document.createElement('a'); link.href = url; link.download = 'hamza-ayesha-wedding.ics'; link.click(); URL.revokeObjectURL(url);
}

export default function BahaarInvitation() {
  const [opened, setOpened] = useState(false); const [musicOn, setMusicOn] = useState(false); const [imageIndex, setImageIndex] = useState(0); const [revealed, setRevealed] = useState(false);
  const [clock, setClock] = useState({ days: '00', hours: '00', minutes: '00', seconds: '00' });
  const audio = useRef(null); const video = useRef(null); const canvas = useRef(null); const scratchCount = useRef(0); const drawing = useRef(false);
  useEffect(() => {
    const tick = () => { const diff = new Date('2026-10-16T19:00:00+05:00').getTime() - Date.now(); if (diff <= 0) return setClock({ days: '00', hours: '00', minutes: '00', seconds: '00' }); const d = Math.floor(diff / 86400000), h = Math.floor(diff % 86400000 / 3600000), m = Math.floor(diff % 3600000 / 60000), s = Math.floor(diff % 60000 / 1000); setClock({ days: `${d}`.padStart(2, '0'), hours: `${h}`.padStart(2, '0'), minutes: `${m}`.padStart(2, '0'), seconds: `${s}`.padStart(2, '0') }); };
    tick(); const timer = setInterval(tick, 1000);
    const obs = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); } }), { threshold: .15 });
    document.querySelectorAll('.bahaar-root .reveal-on-scroll').forEach((el) => obs.observe(el));
    const c = canvas.current; if (c) { const r = c.getBoundingClientRect(), dpr = window.devicePixelRatio || 1; c.width = Math.round(r.width * dpr); c.height = Math.round(r.height * dpr); const x = c.getContext('2d'); x.scale(dpr, dpr); const g = x.createLinearGradient(0, 0, r.width, r.height); g.addColorStop(0, '#d7aaa7'); g.addColorStop(.3, '#b7777f'); g.addColorStop(.55, '#e3c5a5'); g.addColorStop(.8, '#b7777f'); g.addColorStop(1, '#d7aaa7'); x.fillStyle = g; x.fillRect(0, 0, r.width, r.height); x.fillStyle = 'rgba(255,255,255,.86)'; x.font = '600 11px Manrope,sans-serif'; x.textAlign = 'center'; x.fillText('SCRATCH TO REVEAL', r.width / 2, r.height / 2); }
    return () => { clearInterval(timer); obs.disconnect(); };
  }, []);
  const open = async () => { if (opened) return; setOpened(true); video.current?.play().catch(() => {}); try { await audio.current?.play(); setMusicOn(true); } catch {} };
  const toggleMusic = async () => { if (musicOn) { audio.current?.pause(); setMusicOn(false); } else { try { await audio.current?.play(); setMusicOn(true); } catch {} } };
  const reveal = () => { setRevealed(true); const ctx = canvas.current?.getContext('2d'); if (ctx) ctx.clearRect(0, 0, canvas.current.width, canvas.current.height); };
  const scratch = (e) => { if (!drawing.current || revealed) return; const c = canvas.current, ctx = c?.getContext('2d'); if (!c || !ctx) return; const b = c.getBoundingClientRect(), scale = c.width / b.width; ctx.globalCompositeOperation = 'destination-out'; ctx.beginPath(); ctx.arc((e.clientX - b.left) * scale, (e.clientY - b.top) * scale, 18 * scale, 0, Math.PI * 2); ctx.fill(); if (++scratchCount.current > 30) reveal(); };
  return <div className={`bahaar-root ${opened ? '' : 'scroll-locked'}`}>
    <section id="top" className="hero">
      <video ref={video} className="hero__video" poster={media(introPoster)} muted playsInline loop preload="auto"><source src={media(introVideo)} type="video/mp4" /></video>
      {!opened && <img className="hero__poster-frame" src={media(introPoster)} alt="" aria-hidden="true" />}
      <button id="music-control" type="button" className={`music-control ${musicOn ? '' : 'is-muted'}`} onClick={toggleMusic} aria-label={musicOn ? 'Turn music off' : 'Turn music on'}><span className="music-control__icon">♫</span><span className="music-control__label">{musicOn ? 'Sound on' : 'Sound ready'}</span></button>
      {!opened && <button id="opening-gate" type="button" className="opening-gate" aria-label="Open wedding invitation" onClick={open} />}
      <div className={`hero__content ${opened ? 'is-visible' : ''}`}>
        <p className="hero__kicker">A wedding celebration</p><p className="hero__intro">Together with their families</p>
        <div className="hero__names"><div className="hero__person"><h1 className="hero__name">Ali Khan</h1><p className="hero__parents">Son of Mr. &amp; Mrs. Tariq Khan</p></div><span className="hero__ampersand">&amp;</span><div className="hero__person"><h1 className="hero__name">Fatima Khan</h1><p className="hero__parents">Daughter of Mr. &amp; Mrs. Ahmed Khan</p></div></div>
        <p className="hero__intro hero__intro--after">request the honour of your presence</p><p className="hero__closing-line">as they begin their forever in faith and love.</p>
        <a id="scroll-cue" className={`scroll-cue ${opened ? 'is-visible' : ''}`} href="#welcome"><span>Scroll down</span><i /></a>
      </div>
    </section>
    <audio ref={audio} id="background-music" src={media(musicFile)} loop preload="none" />

    <main>
      <section id="welcome" className="section verse-section reveal-on-scroll"><div className="section__inner section__inner--narrow welcome"><p className="verse__bismillah" lang="ar">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</p><p className="verse__text">“And of His signs is that He created for you from yourselves mates that you may find tranquility in them; and He placed between you affection and mercy. Indeed in that are signs for a people who give thought.”</p><p className="verse__ref">— Surah Ar-Rum (30:21)</p></div></section>
      <InvitationFamilies divider={media(divider)} flower={media(flower)} sprig={media(sprig)} />
      <section id="date-reveal" className="section date-reveal reveal-on-scroll"><div className="section__inner"><p className="section-kicker">A beautiful day is waiting</p><h2>Save the Date</h2><p className="gesture-hint">Scratch the card to reveal the date</p><div className="bli-scratch-wrap"><InvitationScratchCard couple="Ali & Fatima" date="October 16, 2026" day="Friday" time="7:00 PM" venue="Dera Dari" onReveal={() => {}} /></div><button className="event-card__cal" onClick={() => downloadCalendar([events[1]])}>Add to Calendar</button></div></section>
      <section id="gallery" className="section gallery-section reveal-on-scroll"><div className="section__inner"><p className="section-kicker">Collected moments</p><h2>A glimpse of our journey</h2><div className="gallery"><div className="gallery__track">{gallery.map((pic, i) => <figure className={`gallery__slide ${i === imageIndex ? 'is-active' : ''}`} key={i}><img src={media(pic)} alt={i === 0 ? 'A soft botanical wedding moment' : `Wedding memory ${i + 1}`} /></figure>)}</div><div className="gallery__dots" role="group" aria-label="Choose gallery image">{gallery.map((_, i) => <button type="button" key={i} aria-label={`View image ${i + 1}`} className={i === imageIndex ? 'is-active' : ''} onClick={() => setImageIndex(i)} />)}</div></div></div></section>
      <section id="countdown" className="section countdown-section reveal-on-scroll"><div className="section__inner"><p className="section-kicker">Until we say Qubool Hai</p><h2>Today is the day</h2><div className="countdown">{Object.entries(clock).map(([label, number]) => <div className="countdown__unit" key={label}><strong>{number}</strong><span>{label}</span></div>)}</div></div></section>
      <section id="timeline" className="section timeline-section reveal-on-scroll"><div className="section__inner"><p className="section-kicker">The Nikkah day</p><h2>A celebration in bloom</h2><div className="timeline">{[['6:30 PM','Guest arrival','Welcome & refreshments'],['7:00 PM','Nikkah ceremony','Solemnisation & Qubool Hai'],['8:00 PM','Blessings & photographs','Family greetings & portraits'],['8:30 PM','Dinner','A feast shared with love']].map(([time,title,desc],i)=><article className="timeline__item" key={time}><div className="timeline__marker"><span>{i+1}</span></div><div><time>{time}</time><h3>{title}</h3><p>{desc}</p></div></article>)}</div></div></section>
      <section id="venue" className="section venue-section reveal-on-scroll"><div className="section__inner"><p className="section-kicker">Join us for the Nikkah</p><h2>Where we will celebrate</h2><h3>Dera Dari</h3><p>Nikkah Ceremony Venue</p><p>Please arrive by 6:30 PM so everyone is seated before the Nikkah begins.</p><a href="https://maps.app.goo.gl/T4mQ72ddDWQ7UBqg9" target="_blank" rel="noreferrer">View on Google Maps ↗</a></div></section>
      <section id="dress-code" className="section dress-section reveal-on-scroll"><div className="section__inner"><p className="section-kicker">Dressed for the occasion</p><h2>The dress code</h2><h3>Festive Formal</h3><p>Traditional or formal attire is encouraged. Shalwar Kameez, Sherwani, Kurta, Lehnga, Saree, Anarkali, and formal suits are all welcome. We kindly ask guests to dress elegantly for the occasion.</p><div className="palette" aria-label="Suggested colour palette">{['#7d927a','#d7aaa7','#f2dfd0','#c9b17e','#657062'].map((color)=><span key={color} style={{backgroundColor:color}} />)}</div></div></section>
      <section id="events" className="section events-section reveal-on-scroll"><div className="section__inner"><p className="section-kicker">The festivities</p><h2>Days filled with joy</h2><div className="event-grid">{events.map((e)=><article className="event-card" key={e.name}><span className="event-card__icon">❀</span><h3>{e.name}</h3><p className="event-card__date">{e.date}</p><p>{e.time} · {e.venue}</p><p>{e.detail}</p><div className="event-card__actions"><button className="event-card__cal" onClick={()=>downloadCalendar([e])}>Add to calendar</button><a className="event-card__map" href={e.map} target="_blank" rel="noreferrer">View on Google Maps ↗</a></div></article>)}</div></div></section>
      <section id="gifts" className="section gifts-section reveal-on-scroll"><div className="section__inner"><span className="gift-icon">♡</span><h2>Your presence is our present</h2><p>Your love, blessings, and prayers are the greatest gifts we could ever ask for. Your presence alone is a treasure.</p></div></section>
      <section id="closing" className="closing"><div className="section__inner"><p className="section-kicker">And so the journey begins</p><h2>We can't wait to celebrate with you</h2><p>Thank you for being part of our story. We look forward to a day filled with happy tears, warm embraces, and memories we will treasure forever.</p><p className="closing__names">Ali Khan <span>&amp;</span> Fatima Khan</p><time>October 16, 2026</time><a href="#top">Back to the beginning ↑</a></div></section>
    </main>
    
  </div>;
}
