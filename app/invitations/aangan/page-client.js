'use client';

import { useEffect, useState } from 'react';
import './style.css';

const events = [
  { name: 'Mehndi', day: 'Friday', date: '12 March 2027', time: '7:00 in the evening', place: 'The Garden Courtyard' },
  { name: 'Nikkah', day: 'Saturday', date: '13 March 2027', time: '5:30 in the afternoon', place: 'The Garden Courtyard' },
  { name: 'Walima', day: 'Sunday', date: '14 March 2027', time: '7:30 in the evening', place: 'The Garden Pavilion' },
];
const photo = 'https://images.unsplash.com/photo-1670529776180-60e4132ab90c?auto=format&fit=crop&w=2200&q=85';

export default function AanganInvitation() {
  const [open, setOpen] = useState(false);
  const [names, setNames] = useState({ guest: 'Dear family and friends', bride: 'Fatima', groom: 'Ali' });
  const [clock, setClock] = useState([0, 0, 0, 0]);
  const [sent, setSent] = useState(false);
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    setNames({ guest: q.get('guest')?.trim() || 'Dear family and friends', bride: q.get('bride')?.trim() || 'Fatima', groom: q.get('groom')?.trim() || 'Ali' });
    const tick = () => { const ms = Math.max(0, new Date('2027-03-13T17:30:00+05:00').getTime() - Date.now()); setClock([Math.floor(ms / 86400000), Math.floor(ms / 3600000) % 24, Math.floor(ms / 60000) % 60, Math.floor(ms / 1000) % 60]); };
    tick(); const timer = setInterval(tick, 1000); return () => clearInterval(timer);
  }, []);
  const submit = (e) => { e.preventDefault(); const data = new FormData(e.currentTarget); const r = Object.fromEntries(data); r.events = data.getAll('events'); try { localStorage.setItem('aangan-rsvp', JSON.stringify(r)); } catch {} setSent(true); };

  return <main className="aangan">
    {!open && <button className="aangan-gate" onClick={() => setOpen(true)} aria-label="Open the garden invitation">
      <span className="aangan-gate-photo" style={{ backgroundImage: `linear-gradient(180deg,rgba(21,31,23,.1),rgba(21,31,23,.72)),url(${photo})` }} />
      <span className="aangan-gate-top">A GARDEN CELEBRATION</span><span className="aangan-gate-copy"><small>YOU ARE DEARLY INVITED</small><strong>{names.groom}<i>&amp;</i>{names.bride}</strong><em>{names.guest}</em><b>OPEN THE GARDEN <span>↓</span></b></span>
      <span className="aangan-gate-seal" aria-hidden="true">✿</span>
    </button>}
    <header className="aangan-hero" style={{ backgroundImage: `linear-gradient(180deg,rgba(19,36,27,.18),rgba(19,36,27,.68)),url(${photo})` }}>
      <div className="aangan-nav"><span>F &amp; A</span><a href="#aangan-rsvp">RSVP <b>↗</b></a></div>
      <div className="aangan-hero-copy"><span className="aangan-kicker">IN THE GARDEN, WITH OUR FAMILIES</span><p>{names.guest}</p><h1>{names.groom}<i>&amp;</i>{names.bride}</h1><span className="aangan-script">invite you to celebrate</span><div className="aangan-date-line"><span>13</span><i/><span>MARCH 2027</span><i/><span>ISLAMABAD</span></div><a className="aangan-scroll" href="#aangan-letter">DISCOVER THE INVITATION ↓</a></div>
      <div className="aangan-hero-stamp">A<br/>+<br/>F</div>
    </header>
    <section className="aangan-letter" id="aangan-letter"><div className="aangan-leaf left">❧</div><div className="aangan-letter-inner"><span className="aangan-kicker">WITH JOYFUL HEARTS</span><h2>A note from our families</h2><p>Among familiar faces and flowers in bloom, we begin a beautiful new chapter. {names.groom} and {names.bride}, together with their families, would be honoured by your presence and prayers.</p><div className="aangan-signatures"><span>{names.groom}’s family</span><i>✿</i><span>{names.bride}’s family</span></div><small>YOUR PRESENCE WILL MAKE THE DAY COMPLETE</small></div><div className="aangan-leaf right">❧</div></section>
    <section className="aangan-scene"><div className="aangan-scene-image" style={{ backgroundImage: `url(${photo})` }} /><div className="aangan-scene-card"><span className="aangan-kicker">A PLACE TO GATHER</span><h2>Where the garden<br/>meets the evening</h2><p>Soft lights, an open sky, and the people we love. We can’t wait to welcome you.</p><a href="https://maps.google.com/?q=Islamabad+garden+wedding+venue" target="_blank" rel="noreferrer">FIND THE COURTYARD ↗</a></div></section>
    <section className="aangan-count"><span className="aangan-kicker">UNTIL WE CELEBRATE TOGETHER</span><h2>Counting down to our day</h2><div>{clock.map((n,i)=><article key={i}><b>{String(n).padStart(i?2:1,'0')}</b><span>{['DAYS','HOURS','MINUTES','SECONDS'][i]}</span></article>)}</div><small>13 · 03 · 2027</small></section>
    <section className="aangan-events"><div className="aangan-events-head"><span className="aangan-kicker">THREE GATHERINGS, ONE JOY</span><h2>Save a place<br/>for every celebration</h2><p>We would love to share each moment with you.</p></div><div className="aangan-event-grid">{events.map((ev,i)=><article key={ev.name}><span className="aangan-event-number">0{i+1}</span><div className="aangan-event-flower">✿</div><h3>{ev.name}</h3><p>{ev.day} · {ev.date}</p><small>{ev.time}</small><a href={`https://maps.google.com/?q=${encodeURIComponent(ev.place+' Islamabad')}`} target="_blank" rel="noreferrer">DIRECTIONS ↗</a></article>)}</div></section>
    <section className="aangan-rsvp" id="aangan-rsvp"><div className="aangan-rsvp-shell"><div><span className="aangan-kicker">KINDLY REPLY</span><h2>Will you join<br/>us in the garden?</h2><p>Let us know which gatherings we can save a seat for.</p><div className="aangan-rsvp-flower">❀</div></div>{sent ? <div className="aangan-thanks"><span>✿</span><h3>Thank you</h3><p>Your reply is saved in this preview. We look forward to seeing you.</p></div> : <form onSubmit={submit}><label>Your name<input name="name" autoComplete="name" required placeholder="Name"/></label><label>Your reply<select name="attendance" required defaultValue=""><option value="" disabled>Select your response</option><option>Joyfully accepts</option><option>Regretfully declines</option></select></label><fieldset><legend>Select the celebrations</legend>{events.map(e=><label className="aangan-check" key={e.name}><input type="checkbox" name="events" value={e.name}/><span>{e.name}</span><small>{e.date.split(' ')[0]} MAR</small></label>)}</fieldset><label>A note for the families<textarea name="message" rows="3" placeholder="Optional message"/></label><button type="submit">SEND YOUR REPLY <span>↗</span></button><small className="aangan-local-note">Preview only · Your reply stays in this browser</small></form>}</div></section>
    <footer className="aangan-footer"><span>IN THE GARDEN, WITH LOVE</span><strong>{names.groom} <i>&amp;</i> {names.bride}</strong><small>13 MARCH 2027 · ISLAMABAD</small><a className="photo-credit" href="https://unsplash.com/photos/a-courtyard-with-white-flowers-aRQrz0fclB8" target="_blank" rel="noreferrer">COURTYARD PHOTOGRAPH · SOULSEEKER / UNSPLASH</a></footer>
  </main>;
}
