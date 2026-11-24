'use client';

import { asset } from './asset-map';

import { useEffect, useRef, useState } from 'react';
import './assets/css/banafsha.css';

const A = '/invitations/wisteria-engagement/assets';
const dateAt = new Date('2027-11-06T12:00:00+05:00').getTime();

function ScratchDate(){
  const canvas=useRef(null),drawing=useRef(false),moves=useRef(0);const[done,setDone]=useState(false);
  useEffect(()=>{const el=canvas.current;if(!el)return;const paint=()=>{const r=el.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2);el.width=Math.max(1,Math.round(r.width*dpr));el.height=Math.max(1,Math.round(r.height*dpr));const ctx=el.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);const g=ctx.createLinearGradient(0,0,r.width,r.height);g.addColorStop(0,'#82709a');g.addColorStop(.5,'#c8b5d3');g.addColorStop(1,'#756286');ctx.globalCompositeOperation='source-over';ctx.fillStyle=g;ctx.fillRect(0,0,r.width,r.height);ctx.fillStyle='rgba(255,255,255,.58)';ctx.font='600 12px serif';ctx.textAlign='center';ctx.fillText('✧  SCRATCH TO REVEAL  ✧',r.width/2,r.height/2);ctx.globalCompositeOperation='destination-out';moves.current=0};paint();const resize=new ResizeObserver(paint);resize.observe(el);return()=>resize.disconnect()},[]);
  const reveal=()=>setDone(true);const check=()=>{const el=canvas.current;if(!el||done)return;const pixels=el.getContext('2d').getImageData(0,0,el.width,el.height).data;let clear=0;for(let i=3;i<pixels.length;i+=4)if(pixels[i]<16)clear++;if(clear/(pixels.length/4)>.2)reveal()};const scratch=e=>{if(!drawing.current||done)return;const r=canvas.current.getBoundingClientRect(),ctx=canvas.current.getContext('2d');ctx.beginPath();ctx.arc(e.clientX-r.left,e.clientY-r.top,34,0,Math.PI*2);ctx.fill();if(++moves.current%4===0)check()};
  return <div className={`wisteria-scratch-card ${done?'is-revealed':''}`}><div className="wisteria-scratch-copy"><span>The Baat Pakki of Zara &amp; Hamza</span><strong>6 November 2027</strong><small>Saturday · 12 PM · The Courtyard</small></div>{!done&&<canvas ref={canvas} role="button" tabIndex={0} aria-label="Scratch to reveal the celebration date. Press Enter to reveal." onPointerDown={e=>{drawing.current=true;e.currentTarget.setPointerCapture(e.pointerId);scratch(e)}} onPointerMove={scratch} onPointerUp={()=>{drawing.current=false;check()}} onPointerCancel={()=>{drawing.current=false;check()}} onKeyDown={e=>e.key==='Enter'&&reveal()}/>} {!done&&<button type="button" onClick={reveal}>Tap to reveal the date</button>}</div>;
}

export default function WisteriaEngagement() {
  const [open, setOpen] = useState(false);
  const [guest, setGuest] = useState('Dear family and friends');
  const [count, setCount] = useState([0, 0, 0, 0]);
  const [ring, setRing] = useState(false);
  const [stars, setStars] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [dua, setDua] = useState('');
  const [duaSent, setDuaSent] = useState(false);
  const [rsvpSent, setRsvpSent] = useState(false);
  const audio = useRef(null);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    setGuest(query.get('guest')?.trim() || 'Dear family and friends');
    const tick = () => {
      const left = Math.max(0, dateAt - Date.now());
      setCount([Math.floor(left / 86400000), Math.floor(left / 3600000) % 24, Math.floor(left / 60000) % 60, Math.floor(left / 1000) % 60]);
    };
    tick(); const interval = window.setInterval(tick, 1000);
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('in'); observer.unobserve(entry.target); } }), { threshold: .12 });
    document.querySelectorAll('.wisteria-root .rv').forEach((el) => observer.observe(el));
    return () => { window.clearInterval(interval); observer.disconnect(); };
  }, []);

  const enter = () => {
    setOpen(true);
    audio.current?.play().then(() => setPlaying(true)).catch(() => {});
    setTimeout(() => document.querySelector('#hero')?.classList.add('is-awake'), 250);
  };
  const toggleMusic = () => {
    if (!audio.current) return;
    if (audio.current.paused) audio.current.play().then(() => setPlaying(true)).catch(() => {});
    else { audio.current.pause(); setPlaying(false); }
  };
  const calendar = () => {
    const blob = new Blob(['BEGIN:VCALENDAR\r\nVERSION:2.0\r\nBEGIN:VEVENT\r\nDTSTART;TZID=Asia/Karachi:20271106T120000\r\nDTEND;TZID=Asia/Karachi:20271106T160000\r\nSUMMARY:Zara & Hamza Engagement\r\nLOCATION:The Courtyard\r\nEND:VEVENT\r\nEND:VCALENDAR'], { type: 'text/calendar' });
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'zara-hamza-engagement.ics'; link.click(); URL.revokeObjectURL(link.href);
  };
  const submitDua = (e) => { e.preventDefault(); setDuaSent(true); };
  const submitRsvp = (e) => { e.preventDefault(); const data = Object.fromEntries(new FormData(e.currentTarget)); try { localStorage.setItem('wisteria-engagement-rsvp', JSON.stringify(data)); } catch {} setRsvpSent(true); };

  return <div className="wisteria-root">
    <audio ref={audio} src={asset(`${A}/audio/music.mp3`)} loop preload="none" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
    {!open && <div id="gate"><div className="stage" style={{ background: `#302247 url(${asset(`${A}/img/veil.webp`)}) center/cover` }}>
      <img className="poster" src={asset(`${A}/img/veil.webp`)} alt="Moonlit wisteria courtyard" />
      <video id="openVideo" src={asset(`${A}/video/opener.mp4`)} poster={asset(`${A}/img/veil.webp`)} muted playsInline preload="metadata" />
      <div className="gate-ui"><div><p className="gate-dear">{guest}</p><p className="gate-eyebrow">You are invited</p><h1 className="gate-names">Zara <span>&amp;</span> Hamza</h1></div><div><button className="hold" aria-label="Open the invitation" onClick={enter}><svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="48" pathLength="1" strokeDasharray="1" strokeDashoffset="0" /></svg><span className="core" /></button><p className="hold-label">Hold for a moment</p><p className="hold-sub">and make a dua</p></div></div>
      <button type="button" className="skip on" onClick={enter}>Skip ›</button>
    </div></div>}
    <main className="page" id="app">
      <button className={`music on ${playing ? 'is-playing' : ''}`} type="button" onClick={toggleMusic} aria-label={playing ? 'Pause music' : 'Play music'} />
      <section id="hero" className="has-bg">
        <div className="bg" /><div className="moonglow" /><div className="mist m1" /><div className="mist m2" />
        <div className="hero-text"><p className="hero-dear">{guest}</p><p className="eyebrow">You are invited to the Baat Pakki of</p><h1 className="hero-names"><span className="ink i1">Zara</span> <span className="amp">&amp;</span> <span className="ink i2">Hamza</span></h1><p className="reflect">Zara &amp; Hamza</p><p className="eyebrow">Saturday · 6 November 2027 · The Courtyard</p></div>
      </section>
      <section className="sec rv"><p className="eyebrow">With the blessings of our families</p><h2 className="h2">A promise beneath the wisteria</h2><p className="lede">With grateful hearts, Zara Ahmed and Hamza Malik invite you to celebrate their Baat Pakki, surrounded by the people they love.</p><img className="divider" src={asset(`${A}/img/petal-1.webp`)} alt="" /></section>
      <section className="sec family-chapter rv"><p className="eyebrow">A gathering of two families</p><h2 className="h2">One promise, held by many</h2><div className="family-pair"><article><span>With love from</span><strong>Zara’s family</strong></article><i aria-hidden="true">✦</i><article><span>With love from</span><strong>Hamza’s family</strong></article></div><p className="family-note">Together, we look forward to welcoming you beneath the wisteria.</p></section>
      <section className="sec date-chapter rv"><p className="eyebrow">A little date to keep</p><h2 className="h2">Scratch to reveal</h2><ScratchDate/></section>
      <section className="sec promise rv"><p className="eyebrow">A little promise</p><h2 className="h2">Place the ring on her hand</h2><div className={`hand ${ring ? 'is-ringed' : ''}`} onClick={() => setRing(true)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setRing(true)}><img className="bare" src={asset(`${A}/img/hand-bare.webp`)} alt="A hand awaiting a ring" /><img className="ringed" src={asset(`${A}/img/hand-ring.webp`)} alt="A hand wearing a ring" /><button type="button" className={`float-ring ${ring ? 'is-going' : ''}`} aria-label="Place the ring" onClick={(e) => { e.stopPropagation(); setRing(true); }}><img src={asset(`${A}/img/ring.webp`)} alt="" /></button></div><p className="hint-ring">Tap the ring to place it</p>{ring && <p className="promise-done">A promise, held close</p>}</section>
      <section className="sec moon-sec rv"><p className="eyebrow">Until we celebrate together</p><h2 className="h2">Counting every heartbeat</h2><div className="count">{count.map((n, i) => <div key={i}><b>{String(n).padStart(i ? 2 : 1, '0')}</b><span>{['Days','Hours','Minutes','Seconds'][i]}</span></div>)}</div><div className="moonwrap" aria-hidden="true"><svg viewBox="0 0 100 100"><circle className="track" cx="50" cy="50" r="46" /><circle className="prog" cx="50" cy="50" r="46" strokeDasharray="289" strokeDashoffset="120" /></svg><img style={{ position: 'absolute', inset: '14%', width: '72%', height: '72%', objectFit: 'contain', borderRadius: '50%' }} src={asset(`${A}/img/moon.webp`)} alt="" /></div><p className="moon-note">Saturday, 6 November 2027 · 12 PM onwards</p><button type="button" className="pill" onClick={calendar}>Add to calendar</button></section>
      <section className="sec moments rv"><p className="eyebrow">Our story</p><h2 className="h2">Little moments, softly held</h2><div className="duo"><button className="frame a" type="button"><img src={asset(`${A}/img/bangles.webp`)} alt="Bangles chosen for the celebration" /></button><button className="frame b" type="button"><img src={asset(`${A}/img/alcove.webp`)} alt="A quiet courtyard alcove" /></button><img className="bangles" src={asset(`${A}/img/bangles.webp`)} alt="" /></div><p className="quote">A new chapter, beneath a familiar sky.</p></section>
      <section className="sec venue rv"><p className="eyebrow">A moonlit gathering</p><h2 className="venue-name">The Courtyard</h2><p className="venue-when">Saturday · 6 November · 12 PM onwards</p><div className="venue-art"><img src={asset(`${A}/img/venue.webp`)} alt="The courtyard dressed for an evening celebration" /></div><p className="venue-addr">A quiet garden, made warm by family and friends.</p><a className="pill solid" href="https://maps.google.com/?q=The+Courtyard" target="_blank" rel="noreferrer">View the venue</a></section>
      <section className="sec constel rv"><p className="eyebrow">A wish for the couple</p><h2 className="h2">Make a little constellation</h2><p className="lede">Touch the stars to connect a blessing.</p><div className={`heart-sky ${stars.length >= 5 ? 'is-done' : ''}`}><svg viewBox="0 0 100 92" aria-hidden="true"><path className="heart-path" d="M50 82 C40 70 10 48 10 28 C10 7 38 2 50 25 C62 2 90 7 90 28 C90 48 60 70 50 82Z" /></svg>{[[20,31],[38,17],[62,17],[80,31],[69,52],[50,70],[31,52]].map(([x,y],i)=><button key={i} className={`c-star ${stars.includes(i)?'on':''}`} style={{ left:`${x}%`, top:`${y}%` }} aria-label={`Connect star ${i+1}`} onClick={() => setStars((s) => s.includes(i) ? s : [...s,i])} />)}</div><p className="heart-msg">{stars.length >= 5 ? <span className="script">May love always find its way home</span> : `${stars.length} stars connected`}</p></section>
      <section className="sec wall rv"><p className="eyebrow">A light for the couple</p><h2 className="h2">Leave a dua by lantern light</h2><div className="sky">{['14%','36%','60%','83%'].map((left,i)=><button key={left} className={`lan ${stars.includes(i+7)?'mine':''}`} style={{left,top:`${18+i%2*26}%`}} onClick={(e)=>{e.currentTarget.classList.toggle('mine')}}><img src={asset(`${A}/img/lantern.webp`)} alt="Light a lantern" /></button>)}</div><form className="dua-form" onSubmit={submitDua}><p className="dua-count">A quiet wish for Zara &amp; Hamza</p><div className="chips">{['Love','Barakah','Joy'].map((x)=><button type="button" key={x} className="chip" onClick={()=>setDua(x)}>{x}</button>)}</div><input className="field" value={dua} maxLength={80} onChange={(e)=>setDua(e.target.value)} placeholder="Write a short dua" /><button className="pill" type="submit">Send your dua</button><p className="dua-msg">{duaSent ? 'Your kind wish is glowing with them.' : ''}</p></form></section>
      <section className="sec rsvp rv"><div className="card"><p className="eyebrow">Kindly reply</p><h2 className="h2">Join us in the garden</h2>{rsvpSent ? <p className="rsvp-done"><span className="check">✓</span>Thank you for your reply</p> : <form onSubmit={submitRsvp}><label className="l" htmlFor="guestName">Your name</label><input id="guestName" name="name" type="text" required placeholder="Name"/><label className="l" htmlFor="guestReply">Your response</label><select id="guestReply" name="attendance" required defaultValue=""><option value="" disabled>Select a response</option><option>Joyfully accepts</option><option>Regretfully declines</option></select><label className="l" htmlFor="guestNote">A note for the family</label><textarea id="guestNote" name="message" placeholder="Optional message"/><button className="pill solid" type="submit">Send RSVP</button></form>}<div className="contacts"><p className="contact"><b>The family</b><span>For any questions about the day</span></p></div></div></section>
      <section className="night near"><div className="stick"><div className="layer back" /><div className="layer mid"><img src={asset(`${A}/img/night-mid.webp`)} alt="" /></div><div className="layer front"><img src={asset(`${A}/img/night-front.webp`)} alt="" /></div><div className="fade" /><div className="close-text"><p className="eyebrow">بَارَكَ اللّٰهُ لَكُمَا</p><button type="button" className="close-names" onClick={(e)=>e.currentTarget.classList.toggle('on')}>Zara &amp; Hamza</button><p className="close-en">May Allah bless you both and join you together in goodness.</p><p className="close-guest">We look forward to celebrating with you.</p><p className="tap-hint">Ameen</p></div></div></section>
    </main>
  </div>;
}
