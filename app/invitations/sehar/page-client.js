'use client';

import { useEffect, useRef, useState } from 'react';
import prologue from './assets/images/prologue.webp';
import banner from './assets/images/banner.webp';
import galleryOne from './assets/images/gallery-1.webp';
import galleryTwo from './assets/images/gallery-2.webp';
import galleryThree from './assets/images/gallery-3.webp';
import music from './assets/audio/music.mp3';
import { InvitationFamilies, InvitationScratchCard } from './section-components';
import './sections.css';
import familyDivider from './assets/images/divider.webp';
import familyFlower from './assets/images/flower.webp';
import familySprig from './assets/images/sprig.webp';

const media = (asset) => typeof asset === 'string' ? asset : asset.src;
const events = [
  { time: '6:30', name: 'Guests Arrive' },
  { time: '7:00', name: 'The Nikkah' },
  { time: '8:00', name: 'Duas & Blessings' },
  { time: '8:30', name: 'Dinner' },
];
const chapters = [
  { image: galleryOne, name: 'The Beginning', tilt: '-4.5deg' },
  { image: galleryTwo, name: 'Always', tilt: '4.5deg' },
  { image: galleryThree, name: 'Together', tilt: '-3deg' },
];

function Reveal({ children, className = '', ...props }) {
  return <div data-m="" className={className} style={{ '--m-from': 'translateY(38px)', '--m-to': 'none', '--m-o0': '0', '--m-d': '1s', '--m-dl': '0s', '--m-ease': 'cubic-bezier(.22,1,.36,1)' }} {...props}>{children}</div>;
}

function Seal({ initials = 'A', other = 'H' }) {
  return <span className="inline-flex items-center gap-[0.34em] font-sans font-medium uppercase leading-none tracking-[0.06em] relative text-[15px] text-white drop-shadow-[0_1px_2px_rgba(80,58,24,0.3)]" aria-label={`${initials} & ${other}`}><span aria-hidden="true">{initials}</span><span className="t050-monogram-rule" aria-hidden="true" /><span aria-hidden="true">{other}</span></span>;
}

export default function SeharInvitation() {
  const [gateVisible, setGateVisible] = useState(true);
  const [opening, setOpening] = useState(false);
  const [guest, setGuest] = useState('Dear guests');
  const [names, setNames] = useState({ bride: 'Fatima', groom: 'Ali' });
  const [countdown, setCountdown] = useState([0, 0, 0, 0]);
  const [playing, setPlaying] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [response, setResponse] = useState('yes');
  const [musicNotice, setMusicNotice] = useState('');
  const audioRef = useRef(null);
  const pathRef = useRef(null);
  const pathContainerRef = useRef(null);
  const travellerRef = useRef(null);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    setGuest(query.get('guest')?.trim() || 'Dear guests');
    setNames({ bride: query.get('bride') || 'Fatima', groom: query.get('groom') || 'Ali' });
    const target = new Date('2026-10-16T19:00:00+05:00').getTime();
    const tick = () => {
      const ms = Math.max(0, target - Date.now());
      setCountdown([Math.floor(ms / 86400000), Math.floor(ms / 3600000) % 24, Math.floor(ms / 60000) % 60, Math.floor(ms / 1000) % 60]);
    };
    tick(); const timer = window.setInterval(tick, 1000);
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('in'); observer.unobserve(entry.target); } }), { threshold: .1 });
    document.querySelectorAll('.sehar [data-m], .sehar .rv-chapter').forEach((node) => observer.observe(node));
    const moveTraveller = () => {
      const path = pathRef.current;
      const container = pathContainerRef.current;
      const traveller = travellerRef.current;
      if (!path || !container || !traveller) return;
      const rect = container.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (window.innerHeight * .52 - rect.top) / rect.height));
      const point = path.getPointAtLength(path.getTotalLength() * progress);
      traveller.style.transform = `translate(${point.x * rect.width / 672}px, ${point.y * rect.height / 896}px)`;
    };
    window.addEventListener('scroll', moveTraveller, { passive: true });
    window.addEventListener('resize', moveTraveller);
    moveTraveller();
    const verseObserver = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        audioRef.current?.pause(); setMusicNotice('Music paused in reverence of the Quranic verse');
      } else setMusicNotice('');
    }, { threshold: .55 });
    document.querySelectorAll('.sehar-quran').forEach((node) => verseObserver.observe(node));
    return () => { window.clearInterval(timer); observer.disconnect(); verseObserver.disconnect(); window.removeEventListener('scroll', moveTraveller); window.removeEventListener('resize', moveTraveller); };
  }, []);

  function openInvitation() {
    if (opening || !gateVisible) return;
    setOpening(true);
    const audio = audioRef.current;
    audio?.play().then(() => setPlaying(true)).catch(() => {});
    window.setTimeout(() => setGateVisible(false), 1800);
  }

  function addCalendar() {
    const event = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//WedsPK//Sehar Invitation//EN', 'BEGIN:VEVENT', 'UID:sehar-nikkah-20261016@wedpk', `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`, 'DTSTART;TZID=Asia/Karachi:20261016T190000', 'DTEND;TZID=Asia/Karachi:20261016T230000', `SUMMARY:The Nikkah — ${names.bride} & ${names.groom}`, 'LOCATION:Dera Dari', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const url = URL.createObjectURL(new Blob([event], { type: 'text/calendar;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'sehar-nikkah.ics'; link.click(); URL.revokeObjectURL(url);
  }

  function submit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    try { localStorage.setItem('wedpk-sehar-rsvp', JSON.stringify({ ...data, guest, names })); setError(''); setSent(true); }
    catch { setError('Your reply could not be sent. Please try again.'); }
  }

  const section = 'relative overflow-hidden px-5 py-24 font-cormorant sm:px-6 sm:py-28';
  const eyebrow = 'mb-4 pl-[0.5em] text-[11px] uppercase tracking-[0.5em] text-[color:var(--gold-deep)]';

  return <div className="sehar t050 relative min-h-screen font-cormorant text-[color:var(--ink)]" style={{ overflowX: 'clip' }}>
    <div className="t050-grain" aria-hidden="true" />
    <audio ref={audioRef} src={media(music)} loop preload="none" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
    <button type="button" className={`rv-pop ${playing ? 'is-playing' : ''} fixed right-4 top-4 z-[150] flex items-center gap-2.5 rounded-full border border-[color:var(--line)] bg-white/70 px-4 py-2.5 text-[color:var(--ink)] shadow-[0_10px_28px_rgba(32,29,24,0.10)] backdrop-blur-md sm:right-6 sm:top-6`} aria-label={playing ? 'Pause music' : 'Play music'} onClick={() => { const audio=audioRef.current; if (!audio) return; if (audio.paused) audio.play().catch(()=>{}); else audio.pause(); }}><span className="flex h-3.5 items-end gap-[3px]" aria-hidden="true"><i className="bar w-[2.5px] rounded-full bg-[color:var(--gold)]"/><i className="bar w-[2.5px] rounded-full bg-[color:var(--gold)]"/><i className="bar w-[2.5px] rounded-full bg-[color:var(--gold)]"/></span><span aria-hidden="true">{playing ? 'Ⅱ' : '♪'}</span></button>

    {gateVisible && <div className={`t050-doors t050-gate fixed inset-x-0 top-0 z-[200] select-none overscroll-contain ${opening ? 'rv-open' : ''}`}>
      <div className="rv-door t050-door t050-door-left absolute bottom-0 left-0 top-0 z-10 w-1/2 will-change-transform" style={{ backfaceVisibility: 'hidden' }}><div className="absolute inset-0"><div className="absolute inset-4 border border-[color:var(--line)] sm:inset-6 border-r-0"/><div className="absolute inset-6 border border-[rgba(32,29,24,0.06)] sm:inset-9 border-r-0"/><div className="absolute top-1/2 -translate-y-1/2 left-[clamp(1rem,4.5vw,3.5rem)]"><span className="rv-door-name block font-cinzel text-[clamp(0.95rem,min(4.6vw,7.5vh),3rem)] uppercase leading-none tracking-[0.16em] text-[color:var(--ink)] [text-orientation:mixed] [writing-mode:vertical-rl] sm:tracking-[0.3em]" style={{ animationDelay: '.5s' }}>{names.bride}</span></div><span className="absolute top-1/2 h-[clamp(1.75rem,5vh,2.5rem)] w-1.5 -translate-y-1/2 rounded-full bg-[rgba(176,141,87,0.4)] right-3"/></div><div className="rv-door-shade pointer-events-none absolute inset-0 bg-gradient-to-l from-[color:var(--ink)] to-transparent" aria-hidden="true"/></div>
      <div className="rv-door t050-door t050-door-right absolute bottom-0 right-0 top-0 z-10 w-1/2 will-change-transform" style={{ backfaceVisibility: 'hidden' }}><div className="absolute inset-0"><div className="absolute inset-4 border border-[color:var(--line)] sm:inset-6 border-l-0"/><div className="absolute inset-6 border border-[rgba(32,29,24,0.06)] sm:inset-9 border-l-0"/><div className="absolute top-1/2 -translate-y-1/2 right-[clamp(1rem,4.5vw,3.5rem)]"><span className="rv-door-name block font-cinzel text-[clamp(0.95rem,min(4.6vw,7.5vh),3rem)] uppercase leading-none tracking-[0.16em] text-[color:var(--ink)] [text-orientation:mixed] [writing-mode:vertical-rl] sm:tracking-[0.3em]" style={{ animationDelay: '.7s' }}>{names.groom}</span></div><span className="absolute top-1/2 h-[clamp(1.75rem,5vh,2.5rem)] w-1.5 -translate-y-1/2 rounded-full bg-[rgba(176,141,87,0.4)] left-3"/></div><div className="rv-door-shade pointer-events-none absolute inset-0 bg-gradient-to-r from-[color:var(--ink)] to-transparent" aria-hidden="true"/></div>
      <div id="gateInner" className="t050-gate-inner pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center text-center font-cormorant"><div className="mx-auto flex max-w-[min(13.5rem,58vw)] flex-col items-center gap-[clamp(1.1rem,4.2vh,2.25rem)] sm:max-w-sm"><p className="rv-gate-eyebrow pl-[0.4em] text-[clamp(9px,2.6vw,11px)] uppercase text-[color:var(--gold-deep)]">Together with their families</p><div className="pointer-events-auto relative"><span className="t050-bloom absolute -inset-5 rounded-full bg-[rgba(176,141,87,0.28)] opacity-0 blur-2xl" style={{ animationDelay: '1.7s' }} aria-hidden="true"/><span className="rv-pulse absolute -inset-2 rounded-full border border-[rgba(176,141,87,0.5)]" aria-hidden="true"/><button type="button" aria-label="Open the Invitation" className="rv-seal-in t050-seal relative flex h-[clamp(5rem,min(24vw,20vh),8rem)] w-[clamp(5rem,min(24vw,20vh),8rem)] cursor-pointer items-center justify-center overflow-hidden rounded-full" onClick={openInvitation}><Seal initials={names.bride[0]} other={names.groom[0]}/></button></div><p className="rv-gate-date pl-[0.32em] text-[clamp(9px,2.9vw,14px)] uppercase leading-[2.2] tracking-[0.32em] text-[color:var(--ink)] sm:pl-[0.42em] sm:tracking-[0.42em]">October 16, 2026</p><p className="rv-gate-hint pointer-events-none pl-[0.4em] text-[clamp(8px,2.4vw,10px)] uppercase tracking-[0.4em] text-[color:var(--gold-deep)]">Tap to open</p></div></div>
    </div>}

    <main id="main" className={`rv-rise relative mx-auto w-full overflow-x-clip transition-transform duration-[1400ms] ${opening ? 'in' : ''}`}>
      <section className="relative overflow-hidden px-6 py-12 sm:py-32"><div className="relative z-10 mx-auto flex max-w-md flex-col items-center"><div className="rv-names mb-2 text-center"><p className="rv-names-eyebrow pl-[0.5em] text-[10px] uppercase tracking-[0.5em] text-[color:var(--gold-deep)]">The Nikkah of</p><h1 className="rv-names-title m-0 mt-3 font-imperial text-[clamp(2.6rem,11vw,4.2rem)] leading-[1.15] tracking-wider text-[color:var(--ink)]">{names.bride} <span className="rv-amp">&amp;</span> {names.groom}</h1><p className="rv-names-date mt-3 pl-[0.4em] text-[11px] uppercase tracking-[0.4em] text-[color:var(--ink-soft)]">October 16, 2026</p></div><div className="relative w-[calc(72vw+3rem)] max-w-[408px] overflow-hidden px-6 pt-8"><div id="prologuePhoto" className="rv-rise in relative aspect-[3/4.2] w-full will-change-transform"><div className="t050-arch t050-float pointer-events-none absolute -inset-3 border border-[rgba(32,29,24,0.15)] sm:-inset-4" aria-hidden="true"/><div className="t050-arch relative h-full w-full overflow-hidden"><img src={media(prologue)} alt={`${names.bride} & ${names.groom}`} className="t050-slow-zoom absolute inset-0 h-full w-full object-cover"/></div></div></div><Reveal className="relative z-20 -mt-10 w-full max-w-md px-1 sm:-mt-12"><div className="rounded-[26px] border border-[color:var(--line)] bg-[rgba(251,250,247,0.985)] px-8 py-12 text-center font-cormorant shadow-[0_30px_70px_rgba(32,29,24,0.12)] backdrop-blur-sm sm:px-12"><p className="mb-6 pl-[0.5em] text-[10px] uppercase tracking-[0.5em] text-[color:var(--gold-deep)]">{guest}</p><h2 className="mb-7 font-cormorant text-[clamp(1.5rem,5.5vw,2.3rem)] leading-[1.3] text-[color:var(--ink)]">With love, we invite you to our Nikkah</h2><div className="t050-rule mx-auto mb-7 w-24"/><p className="text-[15px] leading-[1.95] text-[color:var(--ink-soft)] sm:text-[17px]">With the blessings of Allah and the prayers of our families, we begin the story we have prayed for. It would mean the world to have you beside us as we say Qubool Hai — for the duas, the smiles, and the first day of forever.</p></div></Reveal></div></section>

      <section className={section}><span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(176,141,87,0.15),transparent_66%)] blur-2xl"/><div className="relative mx-auto w-full max-w-md"><Reveal className="t050-plate-frame rounded-[30px] p-px"><div className="t050-plate relative overflow-hidden rounded-[29px] px-6 py-12 text-center sm:px-10 sm:py-14"><div className="mb-9 flex items-center justify-center gap-3 sm:gap-4"><span className="t050-rule w-8 flex-none sm:w-12"/><span className="pl-[0.4em] text-[clamp(9px,2.6vw,11px)] uppercase tracking-[0.4em] text-[color:var(--gold-deep)]">Save the Date</span><span className="t050-rule w-8 flex-none sm:w-12"/></div><div className="bli-scratch-wrap"><InvitationScratchCard couple="Ali & Fatima" date="October 16, 2026" day="Friday" time="7:00 PM" venue="Dera Dari" /></div><p className="mt-8 flex items-center justify-center gap-2 pl-[0.3em] text-[clamp(9px,2.5vw,11px)] uppercase tracking-[0.3em] text-[color:var(--ink-soft)]">⌖ Dera Dari</p><div className="mt-10"><span className="t050-rule mx-auto mb-8 block w-20"/><p lang="ar" dir="rtl" className="sehar-quran rv-arabic text-[1.25rem] leading-[2] text-[color:var(--ink)] sm:text-[1.4rem]">وَمِنْ اٰیٰتِهِۤ اَنْ خَلَقَ لَكُمْ مِّنْ اَنْفُسِكُمْ اَزْوَاجًا لِّتَسْكُنُوْۤا اِلَیْهَا وَجَعَلَ بَیْنَكُمْ مَّوَدَّةً وَّرَحْمَةً ؕ اِنَّ فِیْ ذٰلِكَ لَاٰيَاتٍ لِّقَوْمٍ يَّتَفَكَّرُوْنَ</p><p className="sehar-quran mt-5 text-[15px] italic leading-[1.95] text-[color:var(--ink-soft)] sm:text-[17px]">“And of His signs is that He created for you from yourselves mates that you may find tranquility in them; and He placed between you affection and mercy.”</p><p className="mt-5 pl-[0.35em] text-[10px] uppercase tracking-[0.35em] text-[color:var(--gold-deep)]">Surah Ar-Rum 30:21</p></div></div></Reveal></div></section>

      <section className="relative px-5 py-12 font-cormorant"><div className="relative z-10 mx-auto max-w-2xl text-center"><p className={eyebrow}>Countdown</p><h2 className="mb-14 font-cormorant text-[clamp(1.5rem,5.5vw,2.2rem)] text-[color:var(--ink)]">Until we say Qubool Hai</h2><div className="flex items-start justify-center gap-3 sm:gap-8">{countdown.map((value,i)=>{const max=[365,24,60,60][i], circumference=219.911, offset=circumference*(1-value/max);return <div className="flex flex-col items-center" key={i}><div className="relative h-[76px] w-[76px] sm:h-[104px] sm:w-[104px]"><svg viewBox="0 0 84 84" className="h-full w-full -rotate-90"><circle cx="42" cy="42" r="35" fill="none" stroke="rgba(32,29,24,0.10)" strokeWidth="1"/><circle cx="42" cy="42" r="35" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} style={{transition:'stroke-dashoffset 1.2s cubic-bezier(.22,1,.36,1)'}}/></svg><span className="absolute inset-0 flex items-center justify-center font-cormorant text-[1.55rem] tabular-nums text-[color:var(--ink)] sm:text-[2.1rem]">{String(value).padStart(2,'0')}</span></div><span className="mt-3 pl-[0.32em] text-[11px] uppercase tracking-[0.32em] text-[color:var(--ink-soft)] sm:text-[9px]">{['Days','Hours','Minutes','Seconds'][i]}</span></div>})}</div><p className="mt-12 pl-[0.32em] text-[16px] uppercase tracking-[0.32em] text-[color:var(--ink-soft)]">October 16, 2026</p><div className="mt-8 flex justify-center"><button type="button" onClick={addCalendar} className="relative inline-flex items-center gap-2 rounded-full border border-[rgba(176,141,87,0.45)] px-6 py-3 text-[10px] uppercase tracking-[0.28em] text-[color:var(--ink)] backdrop-blur-sm transition-all duration-500 hover:-translate-y-0.5 hover:bg-[color:var(--gold)] hover:text-white">Add to calendar</button></div></div></section>

      <section className="relative my-6 h-[62svh] min-h-[22rem] w-full overflow-hidden sm:h-[80svh]"><img src={media(banner)} alt="" aria-hidden="true" loading="lazy" className="t050-slow-zoom absolute inset-0 h-full w-full object-cover object-[30%_50%]"/><div className="absolute inset-0 bg-gradient-to-t from-[rgba(20,17,12,0.55)] via-[rgba(20,17,12,0.08)] to-transparent"/><div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-6 pb-12 text-center sm:pb-16"><p className="font-imperial text-[clamp(2.4rem,9vw,4.2rem)] leading-tight tracking-wide text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.45)]">Qubool Hai, forever</p><div className="mt-4 h-px w-24 bg-gradient-to-r from-transparent via-white/70 to-transparent"/></div></section>

      <section className="relative overflow-hidden px-6 py-12 font-cormorant sm:py-28"><div className="relative z-10 mx-auto max-w-2xl"><div className="mb-14 text-center"><p className={eyebrow}>The Programme</p><h2 className="font-cormorant text-[clamp(1.6rem,6vw,2.4rem)] text-[color:var(--ink)]">The Evening</h2></div><div id="path" ref={pathContainerRef} className="relative"><svg className="pointer-events-none absolute inset-0 h-full w-full" fill="none" preserveAspectRatio="none" aria-hidden="true" viewBox="0 0 672 896"><path ref={pathRef} stroke="rgba(176,141,87,0.55)" strokeWidth="2" strokeLinecap="round" strokeDasharray="0.5 11" d="M 336.0 0.0 C 317.0 18.7, 202.7 56.0, 221.8 112.0 C 240.8 168.0, 450.2 261.3, 450.2 336.0 C 450.2 410.7, 221.8 485.3, 221.8 560.0 C 221.8 634.7, 431.2 728.0, 450.2 784.0 C 469.3 840.0, 355.0 877.3, 336.0 896.0"/></svg><div ref={travellerRef} className="pointer-events-none absolute left-0 top-0 z-20 will-change-transform"><div className="relative -ml-[22px] -mt-[22px] flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(176,141,87,0.5)] bg-[rgba(251,250,247,0.75)] shadow-[0_5px_10px_rgba(154,123,69,0.4)]"><span className="t050-ring-halo absolute -inset-2 rounded-full bg-[rgba(176,141,87,0.35)] blur-md" aria-hidden="true"/><svg viewBox="0 0 48 48" fill="none" className="relative h-6 w-6" aria-hidden="true"><circle cx="18.5" cy="30.5" r="9.3" stroke="url(#sehar-ring)" strokeWidth="2.4"/><circle cx="30" cy="30.5" r="9.3" stroke="url(#sehar-ring)" strokeWidth="2.4"/><path d="M30 7.5l3.2 3.6-3.2 4.2-3.2-4.2z" fill="url(#sehar-ring)"/><defs><linearGradient id="sehar-ring" x1="6" y1="6" x2="42" y2="42"><stop stopColor="#F0D9A8"/><stop offset=".5" stopColor="#C2A36B"/><stop offset="1" stopColor="#9A7B45"/></linearGradient></defs></svg></div></div>{events.map((event,i)=><div className="relative flex min-h-[13rem] items-center sm:min-h-[14rem]" key={event.name}><div className={`${i%2?'mr-auto w-[52%] pr-6 text-right sm:pr-8':'ml-auto w-[52%] pl-6 text-left sm:pl-8'}`}><p className="select-none font-cormorant"><span className="text-[clamp(2.3rem,8.5vw,4.2rem)] text-[rgba(32,29,24,0.13)]">{event.time}</span><span className="ml-2 text-[10px] uppercase tracking-[0.3em] text-[color:var(--gold-deep)]">PM</span></p><article className="group relative mt-[-0.35em] overflow-hidden rounded-2xl bg-transparent px-4 py-5 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 sm:px-7 sm:py-6"><span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[rgba(176,141,87,0.08)] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"/><h3 className="relative font-cormorant text-[clamp(1.5rem,4.5vw,1.7rem)] leading-snug text-[color:var(--ink)]">{event.name}</h3><p className="relative mt-1 text-[17px] leading-relaxed text-[color:var(--ink-soft)]">Dera Dari</p></article></div></div>)}</div><div className="mt-10 flex flex-col items-center text-center"><p className="text-[17px] text-[color:var(--ink-soft)]">Dera Dari</p><a href="https://maps.app.goo.gl/T4mQ72ddDWQ7UBqg9" target="_blank" rel="noreferrer" className="relative mt-4 inline-flex items-center gap-2 rounded-full border border-[rgba(176,141,87,0.45)] px-6 py-3 text-[10px] uppercase tracking-[0.28em] text-[color:var(--ink)] backdrop-blur-sm transition-all duration-500 hover:-translate-y-0.5 hover:bg-[color:var(--gold)] hover:text-white">View map</a></div></div></section>

      <section className={section}><div className="relative z-10 mx-auto max-w-3xl"><div className="mb-14 text-center sm:mb-16"><p className={eyebrow}>Moments</p><h2 className="font-cormorant text-[clamp(1.8rem,6vw,2.6rem)] text-[color:var(--ink)]">Our Chapters</h2></div><div className="t050-stage mx-auto grid max-w-[26rem] grid-cols-1 gap-12 px-2 sm:max-w-none sm:grid-cols-2 sm:gap-8 sm:px-6">{chapters.map((chapter,i)=><figure key={chapter.name} className={`rv-chapter t050-chapter group relative m-0 aspect-[4/5] w-full will-change-transform ${i===1?'sm:mt-14':''} ${i===2?'sm:col-span-2 sm:mx-auto sm:w-1/2':''}`} style={{'--tilt':chapter.tilt,'--dl':`${i*.18}s`}}><div className="relative h-full w-full overflow-hidden rounded-[26px] shadow-[0_34px_70px_-34px_rgba(32,29,24,0.6)] ring-1 ring-[rgba(32,29,24,0.08)]"><img src={media(chapter.image)} alt={chapter.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.07]"/><div className="absolute inset-0 bg-gradient-to-t from-[rgba(20,17,12,0.62)] via-transparent to-transparent"/><div className="pointer-events-none absolute inset-0 rounded-[26px] ring-1 ring-inset ring-white/15"/><figcaption className="absolute inset-x-0 bottom-0 flex items-center gap-3 p-4 sm:p-5"><span className="font-cormorant text-[13px] tracking-[0.18em] text-[color:var(--gold-soft)]">0{i+1}</span><span className="h-px w-6 bg-[rgba(255,255,255,0.4)] transition-all duration-500 group-hover:w-10"/><span className="text-[10px] uppercase tracking-[0.35em] text-white/90">{chapter.name}</span></figcaption></div></figure>)}</div></div></section>

      <InvitationFamilies divider={media(familyDivider)} flower={media(familyFlower)} sprig={media(familySprig)} groom="Ali Khan" bride="Fatima Khan" />

      <section className={section}><div className="relative z-10 mx-auto max-w-md"><div className="relative overflow-hidden rounded-[28px] border border-white/60 bg-white/55 px-6 py-12 shadow-[0_40px_90px_-40px_rgba(32,29,24,0.45)] backdrop-blur-xl sm:px-10 sm:py-14"><span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--gold)] to-transparent"/><div className="mb-10 flex flex-col items-center text-center"><h2 className="font-cormorant text-[clamp(1.3rem,5vw,1.75rem)] leading-snug text-[color:var(--ink)]">Please confirm your presence</h2><span className="t050-rule mt-5 w-16"/></div>{sent?<p className="text-center text-[17px] text-[color:var(--gold-deep)]">Thank you — we look forward to seeing you.</p>:<form className="space-y-9" onSubmit={submit}><div className="group relative"><input id="rv-name" name="name" required autoComplete="name" placeholder=" " className="peer block w-full appearance-none border-0 border-b border-[color:var(--line)] bg-transparent px-0 py-3 text-[16px] text-[color:var(--ink)] focus:outline-none focus:ring-0"/><label htmlFor="rv-name" className="pointer-events-none absolute left-0 top-3 origin-left text-[15px] text-[color:var(--ink-soft)] transition-all duration-300 peer-focus:-translate-y-6 peer-focus:scale-90 peer-focus:text-[color:var(--gold-deep)] peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-90">First Name, Last Name</label><span className="pointer-events-none absolute inset-x-0 bottom-0 h-[1.5px] origin-left scale-x-0 bg-gradient-to-r from-[color:var(--gold-soft)] to-[color:var(--gold-deep)] transition-transform duration-500 peer-focus:scale-x-100"/></div><div className="group relative"><input id="rv-guests" name="guests" type="number" min="1" placeholder=" " className="peer block w-full appearance-none border-0 border-b border-[color:var(--line)] bg-transparent px-0 py-3 text-[16px] text-[color:var(--ink)] focus:outline-none focus:ring-0"/><label htmlFor="rv-guests" className="pointer-events-none absolute left-0 top-3 origin-left text-[15px] text-[color:var(--ink-soft)] transition-all duration-300 peer-focus:-translate-y-6 peer-focus:scale-90 peer-focus:text-[color:var(--gold-deep)] peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-90">Number of guests</label></div><fieldset className="m-0 space-y-3 border-0 p-0 pt-2"><legend className="sr-only">Please confirm your attendance</legend>{[['yes',"InshaAllah, I'll be there with joy."],['no',"Unfortunately, I won't be able to attend."]].map(([value,label])=><label className="group relative block cursor-pointer" key={value}><input type="radio" name="response" value={value} checked={response===value} onChange={()=>setResponse(value)} className="peer sr-only"/><span className="flex items-center gap-3.5 rounded-2xl border border-[color:var(--line)] bg-white/40 px-5 py-4 backdrop-blur-sm transition-all duration-300 hover:border-[rgba(176,141,87,0.4)] peer-checked:border-[rgba(176,141,87,0.7)] peer-checked:bg-[rgba(176,141,87,0.1)] peer-checked:shadow-[0_12px_30px_-14px_rgba(154,123,69,0.55)]"><i className="h-5 w-5 shrink-0 rounded-full border border-[rgba(176,141,87,0.6)] peer-checked:bg-[color:var(--gold)]"/><span className="text-[15px] leading-snug text-[color:var(--ink)]">{label}</span></span></label>)}</fieldset>{error&&<p className="text-center text-[15px] text-[#a3564b]">{error}</p>}<button type="submit" className="group relative w-full overflow-hidden rounded-full bg-gradient-to-r from-[color:var(--gold-soft)] via-[color:var(--gold)] to-[color:var(--gold-deep)] px-8 py-4 text-[11px] uppercase tracking-[0.35em] text-white shadow-[0_18px_44px_-14px_rgba(154,123,69,0.65)] transition-all duration-500 hover:-translate-y-0.5"><span className="t050-sheen-bar" aria-hidden="true"/><span className="relative">Confirm</span></button></form>}</div></div></section>

      <section className="relative px-8 pb-20 pt-24 text-center font-cormorant"><div className="relative z-10 mx-auto max-w-md"><div className="t050-seal relative mx-auto mb-10 flex h-20 w-20 items-center justify-center rounded-full"><span className="absolute -inset-2.5 rounded-full border border-[rgba(176,141,87,0.4)]"/><Seal initials={names.bride[0]} other={names.groom[0]}/></div><p className="mb-11 text-[16px] italic leading-[1.95] text-[color:var(--ink-soft)] sm:text-lg">With all our love and duas, we await you at our Nikkah.</p><div className="mb-6 font-imperial text-[clamp(2.8rem,11vw,4.4rem)] leading-tight tracking-widest text-[color:var(--ink)]">{names.bride} &amp; {names.groom}</div><div className="t050-rule mx-auto mb-6 w-28"/><p className="pl-[0.5em] text-[11px] uppercase tracking-[0.5em] text-[color:var(--gold-deep)]">10 · 16 · 2026</p></div></section>
    </main>
    {musicNotice && <div className="fixed bottom-6 left-1/2 z-[160] -translate-x-1/2 rounded-full border border-[color:var(--line)] bg-[rgba(251,250,247,0.94)] px-5 py-3 text-center text-[13px] text-[color:var(--ink-soft)] shadow-lg backdrop-blur">{musicNotice}</div>}
  </div>;
}
