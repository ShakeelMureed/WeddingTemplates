'use client';

import { useEffect, useRef, useState } from 'react';
import './assets/css/styles.css';
import { InvitationFamilies, InvitationScratchCard } from './section-components';
import './sections.css';
import familyDivider from './assets/images/divider.webp';
import familyFlower from './assets/images/flower.webp';
import familySprig from './assets/images/sprig.webp';
import floralDivider from './assets/images/floral-divider.webp';
import galleryImage from './media/gallery/03.webp';
import introVideo from './media/intro.mp4';
import backgroundMusic from './media/music.mp3';

const img = (asset) => typeof asset === 'string' ? asset : asset.src;
const nikkahTimeline = [
  ['6:30 PM', 'Guest Arrival', 'Welcome & refreshments'],
  ['07:00 PM', 'Nikkah Ceremony', 'Solemnisation & Qubool Hai'],
  ['08:00 PM', 'Blessings & Photos', 'Family greetings & photographs'],
  ['08:30 PM', 'Dinner', 'A feast shared with love'],
];
const festivities = [
  { name: 'Mehndi', when: 'October 15 · 5:00 PM — 8:00 PM', place: "Water's Edge", map: 'https://share.google/N2DXIhDjIMAk74g7N' },
  { name: 'Nikkah', when: 'October 16 · 7:00 PM — 10:00 PM', place: 'Dera Dari', map: 'https://maps.app.goo.gl/T4mQ72ddDWQ7UBqg9' },
  { name: 'Barat', when: 'October 17 · 7:00 PM — 10:00 PM', place: 'Aura Grande Enclave', map: 'https://share.google/Sj22CUrwQmhdkXYto' },
  { name: 'Valima', when: 'October 18 · 7:00 PM — 10:00 PM', place: 'The Royals Event Complex', map: 'https://share.google/2BCM2QJ9oeyllqJIT' },
];
const palette = ['#6B1020', '#2D5016', '#B88A45', '#3B2058', '#1A3A5C'];

function Ornament({ light = false }) { return <span className={`ornament ${light ? 'light' : ''}`} aria-hidden="true"><i /></span>; }

function saveCalendar() {
  const records = festivities.map((event, index) => {
    const day = String(15 + index).padStart(2, '0'); const start = index === 0 ? '170000' : '190000'; const end = index === 0 ? '200000' : '220000';
    return `BEGIN:VEVENT\nUID:ruby-${index}@wedpk.local\nDTSTAMP:20260101T000000Z\nDTSTART:202610${day}T${start}\nDTEND:202610${day}T${end}\nSUMMARY:${event.name} — Ali & Fatima\nLOCATION:${event.place}\nEND:VEVENT`;
  }).join('\n');
  const blob = new Blob([`BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//WEDPK//Ruby Invitation//EN\n${records}\nEND:VCALENDAR`], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'ali-fatima-wedding.ics'; link.click(); URL.revokeObjectURL(url);
}

export default function RubyInvitation() {
  const [opened, setOpened] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [count, setCount] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const heroVideoRef = useRef(null);
  const musicRef = useRef(null);
  
  useEffect(() => {
    const root = document.querySelector('.ruby-root');
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: 0.12 });
    root?.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    const update = () => {
      const remaining = new Date('2026-10-16T19:00:00+05:00').getTime() - Date.now();
      if (remaining <= 0) { setCount({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      setCount({ days: Math.floor(remaining / 86400000), hours: Math.floor(remaining % 86400000 / 3600000), minutes: Math.floor(remaining % 3600000 / 60000), seconds: Math.floor(remaining % 60000 / 1000) });
    };
    update(); const ticker = window.setInterval(update, 1000);
    return () => { observer.disconnect(); window.clearInterval(ticker); };
  }, []);

  const openInvitation = async () => {
    if (opened) return;
    setOpened(true);
    heroVideoRef.current?.play().catch(() => {});
    try { if (musicRef.current) { await musicRef.current.play(); setMusicOn(true); } } catch {}
  };
  const toggleMusic = async () => {
    if (!musicRef.current) return;
    if (musicOn) { musicRef.current.pause(); setMusicOn(false); } else { try { await musicRef.current.play(); setMusicOn(true); } catch {} }
  };
  const revealDate = () => setRevealed(true);
  const submitRsvp = (event) => { event.preventDefault(); if (event.currentTarget.reportValidity()) setSubmitted(true); };

  return <div className={`ruby-root ${opened ? 'is-open' : 'intro-locked'}`} style={{ '--ivory': '#F1E3CE', '--plum': '#3A070C', '--lavender': '#6F0B17', '--mauve': '#A51520', '--lilac': '#D0B294', '--champagne': '#C9A35F', '--scratchFoil': '#5C0F16,#8C1620,#C9A35F,#8C1620,#4A0B10', '--petalColors': 'linear-gradient(135deg, #C9414F, #8C1620),linear-gradient(135deg, #E8B4B4, #A51520),linear-gradient(135deg, #E3C08A, #C9A35F),linear-gradient(135deg, #6F0B17, #3A070C),linear-gradient(135deg, #D9B36A, #C9A35F)' }}>
    <main id="invitation">
      <audio ref={musicRef} loop preload="none" src={img(backgroundMusic)} />
      <button className="music-toggle" type="button" onClick={toggleMusic} aria-label={musicOn ? 'Pause background music' : 'Play background music'}><span className={`music-bars ${musicOn ? 'is-playing' : ''}`} aria-hidden="true"><i /><i /><i /></span><span>{musicOn ? 'Playing' : 'Music'}</span></button>

      <section id="hero" className={`hero ${opened ? 'is-open' : 'is-closed'}`} role="button" tabIndex={0} aria-label="Tap to open the wedding invitation" onClick={!opened ? openInvitation : undefined} onKeyDown={(event) => { if (!opened && (event.key === 'Enter' || event.key === ' ')) openInvitation(); }}>
        <video ref={heroVideoRef} className="hero-video" muted playsInline preload="auto" poster={img(galleryImage)}><source src={img(introVideo)} type="video/mp4" /></video>
        <div className="hero-veil" />
        {!opened && <div id="openingMark" className="opening-mark"><span className="opening-label">Open Invitation</span><span className="opening-ripple" /></div>}
        <div className="hero-content">
          <p className="bismillah" lang="ar">﷽</p><p className="translation" lang="en">In the name of Allah, the Most Gracious, the Most Merciful</p>
          <div className="hero-divider"><span>✦</span></div><p className="hero-welcome">Together with their families<br />request the honour of your presence</p>
          <div className="couple-names"><div><h1 id="brideName">Fatima <span>Khan</span></h1><p>Daughter of</p><small>Mr. &amp; Mrs. Ahmed Khan</small></div><span className="name-ampersand">&amp;</span><div><h1 id="groomName">Ali <span>Khan</span></h1><p>Son of</p><small>Mr. &amp; Mrs. Tariq Khan</small></div></div>
          <p className="hero-invitation">invite you to share in their joy</p><p className="hero-closing">as they begin their forever in<br />faith and love.</p><a className="scroll-cue" href="#welcome" onClick={(event) => event.stopPropagation()}><span>Scroll</span><i aria-hidden="true" /></a>
        </div>
      </section>

      <FloralDivider />
      <section id="welcome" className="welcome-section section-pad"><div className="section-shell welcome-shell"><div className="welcome-copy reveal"><h2>A Blessed Beginning</h2><p>With hearts full of gratitude, we warmly invite you to join us as we celebrate this beautiful union with the love, prayers, and blessings of our families. Your presence will make our joy complete.</p><div id="welcomeSignature" className="signature">Fatima <span>&amp;</span> Ali</div></div></div></section>
      <FloralDivider />

      <InvitationFamilies divider={img(familyDivider)} flower={img(familyFlower)} sprig={img(familySprig)} groom="Ali Khan" bride="Fatima Khan" />
      <FloralDivider />

      <section id="date" className="scratch-section section-pad"><div className="section-shell"><header className="section-heading reveal"><span className="eyebrow">A date to hold close</span><h2 id="scratchHeading">Scratch to Reveal</h2><Ornament /></header><div className="bli-scratch-wrap reveal"><InvitationScratchCard couple="Ali & Fatima" date="October 16, 2026" day="Friday" time="7:00 PM" venue="Dera Dari" onReveal={revealDate} /></div><p id="scratchNote" className="scratch-note reveal">Use your finger or cursor to uncover the moment.</p><div className="cta-row"><button className="calendar-cta" type="button" onClick={saveCalendar} hidden={!revealed}>Add to Calendar</button></div></div></section>
      <FloralDivider />

      <section className="gallery-section section-pad" aria-label="Gallery"><div className="section-shell"><header className="section-heading reveal"><span className="eyebrow">Our story</span><h2>Moments, softly held</h2><Ornament /></header><div id="galleryFrame" className="gallery-frame reveal"><div id="gallerySlides"><figure className="gallery-slide is-active"><img src={img(galleryImage)} alt="A quiet moment, hand in hand" loading="eager" /><figcaption /></figure></div><span className="gallery-corner gallery-corner-a" aria-hidden="true" /><span className="gallery-corner gallery-corner-b" aria-hidden="true" /></div><div id="galleryDots" className="gallery-dots reveal" aria-label="Choose gallery image"><button type="button" aria-label="Gallery image 1" className="is-active" /></div></div></section>
      <FloralDivider />

      <section className="countdown-section section-pad"><div className="section-shell countdown-shell"><header className="section-heading reveal"><span className="eyebrow">Until we say Qubool Hai</span><h2>Counting every heartbeat</h2><Ornament /></header><div className="countdown reveal" aria-label="Wedding countdown">{Object.entries(count).map(([unit, value]) => <div key={unit}><strong>{String(value).padStart(2, '0')}</strong><span>{unit}</span></div>)}</div></div></section>
      <FloralDivider />

      <section className="program-section section-pad"><div className="section-shell program-shell"><header className="section-heading reveal"><span className="eyebrow">The celebration</span><h2>Our Nikkah Day</h2><Ornament /></header><div id="programTimeline" className="timeline reveal">{nikkahTimeline.map(([time, title, detail]) => <article key={time}><time>{time}</time><div><h3>{title}</h3><p>{detail}</p></div></article>)}</div></div></section>
      <FloralDivider />

      <section className="venue-section section-pad"><div className="section-shell"><div className="venue-card reveal"><span className="eyebrow">The venue</span><div className="venue-divider" aria-hidden="true"><span>✦</span></div><h2>Dera Dari</h2><p>Nikkah Ceremony Venue</p><a className="venue-map-button" href="https://maps.app.goo.gl/T4mQ72ddDWQ7UBqg9" target="_blank" rel="noreferrer">View on Google Maps</a></div></div></section>
      <FloralDivider />

      <section className="dress-section section-pad"><div className="section-shell dress-shell"><div className="dress-copy reveal"><span className="eyebrow">Dress code</span><h2>Festive Formal</h2><p>Traditional or formal attire is encouraged. Shalwar Kameez, Sherwani, Kurta, Lehnga, Saree, Anarkali, and formal suits are all welcome. We kindly ask guests to dress elegantly for the occasion.</p></div><div id="dressPalette" className="palette reveal" aria-label="Suggested colour palette">{palette.map((color) => <i key={color} aria-label={color} style={{ backgroundColor: color }} />)}</div></div></section>
      <FloralDivider />

      <section className="events-section section-pad"><div className="section-shell"><header className="section-heading reveal"><span className="eyebrow">The Festivities</span><h2>Days filled with joy</h2><Ornament /></header><div id="preWeddingEvents" className="event-list reveal">{festivities.map((event, index) => <article key={event.name} style={{ background: 'linear-gradient(145deg, #F6ECDD, #F1E1CB, #EAD3B4)', color: '#3A070C', '--event-border': '#C9A35F', '--event-accent': '#3A070C', '--event-on-accent': '#F1E3CE', '--event-icon': '#C9A35F', '--event-btn': '#3A070C', '--event-meta': '#A51520' }}><span className="event-icon" aria-hidden="true">{['✿', '☾', '❖', '✦'][index]}</span><h3>{event.name}</h3><button type="button" className="event-date" aria-label={`${event.name}, ${event.when}. Add to calendar`} onClick={saveCalendar}><span>{event.when}</span></button><small>{event.place}</small><div className="event-actions"><a className="event-btn" href={event.map} target="_blank" rel="noreferrer">View on Map</a><button type="button" className="event-btn" onClick={saveCalendar}>Add to Calendar</button></div></article>)}</div><div className="cta-row reveal"><button id="addAllCal" className="calendar-cta" type="button" onClick={saveCalendar}>Add all four days to calendar</button></div></div></section>
      <FloralDivider />

      <section className="gifts-section section-pad"><div className="gift-bloom" aria-hidden="true"><i /><i /><i /></div><div className="gift-copy reveal"><span className="eyebrow">With all our hearts</span><h2>Your presence is our present</h2><p>Your love, blessings, and prayers are the greatest gifts we could ever ask for. Your presence alone is a treasure.</p></div></section>
      <FloralDivider />

      <section className="rsvp-section section-pad"><div className="section-shell rsvp-shell"><header className="section-heading reveal"><span className="eyebrow">Your response</span><h2>Kindly RSVP</h2><Ornament /></header>{submitted ? <div className="rsvp-success reveal is-visible"><span className="eyebrow">Thank you!</span><h3>Your response has been received</h3><p>We look forward to celebrating with you. JazakAllah Khair!</p><button className="text-button" type="button" onClick={() => setSubmitted(false)}>Edit your response</button></div> : <form id="rsvpForm" className="rsvp-form reveal" onSubmit={submitRsvp} noValidate><label><span>Name</span><input id="rsvpName" type="text" required autoComplete="name" placeholder="Your full name" /></label><label><span>Email</span><input id="rsvpEmail" type="email" autoComplete="email" placeholder="Email address" /></label><label><span>Attendance</span><select id="rsvpAttendance" required defaultValue=""><option value="" disabled>Select your response</option><option>Joyfully accepts</option><option>Regretfully declines</option></select></label><label><span>Number of guests</span><select id="rsvpGuests" defaultValue="1 guest">{['1 guest', '2 guests', '3 guests', '4 guests', '5+ guests'].map((n) => <option key={n}>{n}</option>)}</select></label><label className="form-wide"><span>Message</span><textarea id="rsvpNote" rows="3" placeholder="Dietary notes or a message for the couple" /></label><div className="form-footer form-wide"><div><p>Kindly respond by October 1, 2026</p><small>For assistance, call +92 300 0000000</small></div><button type="submit" className="primary-button">Send RSVP</button></div></form>}</div></section>
      <FloralDivider />

      <section className="closing-section"><div className="closing-arch reveal"><Ornament light /><p className="bismillah" lang="ar">بَارَكَ اللّٰهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ</p><p className="dua-translation">May Allah bless you, shower His blessings upon you, and join you both together in goodness.</p><h2>We can't wait to celebrate with you.</h2><div id="closingNames" className="closing-names">Fatima <span>&amp;</span> Ali</div><small id="closingDetails">October 16, 2026 · Friday · 07:00 PM</small></div></section>
    </main>
    <div className="qq-note" role="status"><span aria-hidden="true">♫</span><span>Music paused in reverence of the Quranic verse</span></div>

  </div>;
}

function FloralDivider() { return <div className="floral-divider" aria-hidden="true"><img src={img(floralDivider)} alt="" /></div>; }
