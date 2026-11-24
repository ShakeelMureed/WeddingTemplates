'use client';

import { useEffect, useRef, useState } from 'react';
import './assets/css/fonts.css';
import './assets/css/tailwind.css';
import './assets/css/swan.css';
import heroImage from './assets/images/hero.webp';
import posterImage from './assets/images/poster.webp';
import ornamentImage from './assets/images/ornament.webp';
import featherImage from './assets/images/feather.webp';
import featherWaterImage from './assets/images/feather-water.webp';
import swanImage from './assets/images/swan.webp';
import locationImage from './assets/images/location-bg.webp';
import mehndiImage from './assets/images/mehndi.webp';
import ringImage from './assets/images/ring.webp';
import brideImage from './assets/images/bride.webp';
import dressMehndiImage from './assets/images/dress-mehndi.webp';
import dressNikkahImage from './assets/images/dress-nikkah.webp';
import dressBaratImage from './assets/images/dress-barat.webp';
import dressValimaImage from './assets/images/dress-valima.webp';
import closingImage from './assets/images/closing.webp';
import closingLargeImage from './assets/images/closing-large.webp';
import pearlImage from './assets/images/pearl.webp';
import heroVideo from './assets/video/hero.webm';
import coverVideo from './assets/video/cover.webm';
import swanLakeAudio from './assets/audio/swan-lake.mp3';
import { InvitationFamilies, InvitationScratchCard } from './section-components';
import './sections.css';
import familyDivider from './assets/images/divider.webp';
import familyFlower from './assets/images/flower.webp';
import familySprig from './assets/images/sprig.webp';

const asset = (file) => typeof file === 'string' ? file : file.src;
const events = [
  { name: 'Mehndi', time: '5:00 PM', venue: "Water's Edge", date: 'October 15', map: 'https://share.google/N2DXIhDjIMAk74g7N', image: mehndiImage },
  { name: 'Nikkah', time: '7:00 PM', venue: 'Dera Dari', date: 'October 16', map: 'https://maps.app.goo.gl/T4mQ72ddDWQ7UBqg9', image: ringImage },
  { name: 'Barat', time: '7:00 PM', venue: 'Aura Grande Enclave', date: 'October 17', map: 'https://share.google/Sj22CUrwQmhdkXYto', image: featherWaterImage },
  { name: 'Valima', time: '7:00 PM', venue: 'The Royals Event Complex', date: 'October 18', map: 'https://share.google/2BCM2QJ9oeyllqJIT', image: brideImage },
];
const dress = [
  { name: 'Mehndi', description: 'Bring the colour! Bright, joyful festive shades — marigold yellows, greens, pinks and corals.', image: dressMehndiImage, colors: [['#F2C14E', 'Marigold\nYellow'], ['#8FA35A', 'Mehndi\nGreen'], ['#E9A3B0', 'Blush\nPink'], ['#F08A6B', 'Warm\nCoral'], ['#3F8F8B', 'Deep\nTeal']] },
  { name: 'Nikkah', description: 'We kindly ask for soft whites, ivories and champagne tones for the Nikkah.', image: dressNikkahImage, colors: [['#F7F3EA', 'Pearl\nWhite'], ['#EFE6D2', 'Soft\nIvory'], ['#F1E4C8', 'Warm\nCream'], ['#E3D0AE', 'Champagne'], ['#CDB27A', 'Pale\nGold']] },
  { name: 'Barat', description: 'Sherwanis for the gentlemen, and rich reds, maroons and gold for the ladies.', image: dressBaratImage, colors: [['#9B0F22', 'Blood\nRed'], ['#5E1522', 'Deep\nMaroon'], ['#B08D57', 'Antique\nGold'], ['#EADBC0', 'Ivory\nGold'], ['#2B2726', 'Charcoal\nBlack']] },
  { name: 'Valima', description: 'Soft, elegant evening attire — sherwanis, prince coats, sarees and formal jora in pearl, champagne, mist blue and navy.', image: dressValimaImage, colors: [['#F4F1EA', 'Pearl\nWhite'], ['#C6D8EA', 'Mist\nBlue'], ['#9FB8D0', 'Silver\nBlue'], ['#B9C2C9', 'Soft\nGrey'], ['#3A5878', 'Deep\nNavy']] },
];

function Heading({ children }) {
  return <div className="flex flex-col items-center justify-center gap-3 sm:gap-4"><h2 className="font-free-serif tracking-[0.32em] text-center text-[0.95rem] uppercase sm:text-lg" style={{ color: '#33517A' }}>{children}</h2><img src={asset(ornamentImage)} alt="" aria-hidden="true" className="w-20 select-none opacity-80 sm:w-28" /></div>;
}

function CalendarButton({ label = 'Add all dates to the Calendar' }) {
  const createCalendar = () => {
    const calendarEvents = events.map((event, index) => {
      const day = String(15 + index).padStart(2, '0');
      const startHour = index === 0 ? '17' : '19';
      const endHour = index === 0 ? '20' : '22';
      return `BEGIN:VEVENT\nUID:swan-${index}@wedpk.local\nDTSTAMP:20260101T000000Z\nDTSTART:202610${day}T${startHour}0000\nDTEND:202610${day}T${endHour}0000\nSUMMARY:${event.name} — Ali & Fatima\nLOCATION:${event.venue}\nEND:VEVENT`;
    }).join('\n');
    const blob = new Blob([`BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//WEDPK//Swan Invitation//EN\n${calendarEvents}\nEND:VCALENDAR`], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url; link.download = 'ali-fatima-wedding.ics'; link.click(); URL.revokeObjectURL(url);
  };
  return <button type="button" onClick={createCalendar} className="inline-flex items-center justify-center gap-3 rounded-full border px-10 py-4 text-[0.62rem] uppercase tracking-[0.28em] transition-colors hover:bg-white/70" style={{ borderColor: 'rgba(122, 152, 186, 0.38)', color: '#33517A' }}><span aria-hidden="true">▦</span>{label}</button>;
}

export default function SwanInvitation() {
  const [opened, setOpened] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [response, setResponse] = useState('');
  const [sent, setSent] = useState(false);
  const [countdown, setCountdown] = useState({ days: '00', hours: '00', minutes: '00', seconds: '00' });
  const musicRef = useRef(null);
  const coverRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const update = () => {
      const remaining = new Date('2026-10-16T19:00:00+05:00').getTime() - Date.now();
      if (remaining <= 0) return setCountdown({ days: '00', hours: '00', minutes: '00', seconds: '00' });
      const d = Math.floor(remaining / 86400000), h = Math.floor(remaining % 86400000 / 3600000), m = Math.floor(remaining % 3600000 / 60000), s = Math.floor(remaining % 60000 / 1000);
      setCountdown({ days: String(d).padStart(2, '0'), hours: String(h).padStart(2, '0'), minutes: String(m).padStart(2, '0'), seconds: String(s).padStart(2, '0') });
    };
    update(); const clock = window.setInterval(update, 1000);
    const observer = new IntersectionObserver((items) => items.forEach((item) => { if (item.isIntersecting) { item.target.classList.add('in'); observer.unobserve(item.target); } }), { threshold: 0.12 });
    document.querySelectorAll('.swan-root .rv, .swan-root .feather-tilt').forEach((el) => observer.observe(el));
    if (coverRef.current) coverRef.current.play().catch(() => {});
    return () => { window.clearInterval(clock); observer.disconnect(); };
  }, []);

  const openInvitation = async () => {
    if (opened) return;
    setOpened(true);
    if (musicRef.current) { try { await musicRef.current.play(); setMusicOn(true); } catch {} }
    if (heroRef.current) heroRef.current.play().catch(() => {});
  };
  const toggleMusic = async () => {
    if (!musicRef.current) return;
    if (musicOn) { musicRef.current.pause(); setMusicOn(false); }
    else { try { await musicRef.current.play(); setMusicOn(true); } catch {} }
  };
  const submitRsvp = (event) => { event.preventDefault(); const form = new FormData(event.currentTarget); if (!String(form.get('name') || '').trim() || !response) return; setSent(true); };

  return <div className="swan-root font-free-serif relative w-full overflow-x-hidden" style={{ backgroundColor: '#F7FAFD' }}>
    <main>
      <section className="relative h-[100svh] w-full overflow-hidden">
        <video ref={heroRef} className="absolute inset-0 h-full w-full object-cover" poster={asset(heroImage)} muted loop playsInline preload="auto" aria-hidden="true"><source src={asset(heroVideo)} type="video/webm" /></video>
        <div className="relative z-20 flex h-full flex-col items-center px-6 pt-[10vh] text-center">
          <h1 className="font-citadel text-[2.9rem] leading-[1.1] sm:text-6xl lg:text-7xl hero-in hero-names" style={{ color: '#33517A' }}>Ali &amp; Fatima</h1>
          <p className="mt-2 text-lg uppercase tracking-[0.34em] hero-in hero-date" style={{ color: '#33517A' }}>16 · 10 · 2026</p>
          <div className="flex w-full justify-center hero-in hero-ornament"><img src={asset(ornamentImage)} alt="" aria-hidden="true" className="my-6 w-28 select-none sm:my-7" /></div>
          <div className="mt-auto pb-10 hero-in hero-caret"><svg viewBox="0 0 256 256" fill="currentColor" style={{ color: 'rgba(51, 81, 122, 0.45)' }} className="mx-auto h-7 w-7 animate-bounce" aria-hidden="true"><path d="M210.83,125.17a4,4,0,0,1,0,5.66l-80,80a4,4,0,0,1-5.66,0l-80-80a4,4,0,1,1,5.66-5.66L128,202.34l77.17-77.17A4,4,0,0,1,210.83,125.17Zm-85.66,5.66a4,4,0,0,0,5.66,0l80-80a4,4,0,1,0-5.66-5.66L128,122.34,50.83,45.17a4,4,0,0,0-5.66,5.66Z" /></svg></div>
        </div>
      </section>
      <div className="pointer-events-none relative z-10 -mt-40 h-40 w-full" style={{ background: 'linear-gradient(180deg, rgba(247,250,253,0) 0%, rgba(247,250,253,1) 100%)' }} />

      <section className="relative w-full overflow-hidden px-6 py-10 sm:py-24">
        <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(198, 216, 234, 0.28)' }} aria-hidden="true" />
        <div className="relative mx-auto max-w-xl text-center rv">
          <div className="flex items-center justify-center"><span className="flex w-32 flex-none items-center justify-center sm:w-40"><div className="mx-auto w-fit feather-tilt"><img src={asset(featherImage)} alt="" aria-hidden="true" className="h-auto w-20 select-none sm:w-24 feather-bob" /></div></span></div>
          <p className="mx-auto mt-10 max-w-sm whitespace-pre-line text-[0.8rem] uppercase leading-[2.2] tracking-[0.22em] sm:mt-12 sm:text-[0.9rem]" style={{ color: '#33517A' }}>With joyful hearts,{'\n'}we invite you to celebrate{'\n'}the beginning of our forever.</p>
          <p className="mx-auto mt-8 max-w-xs text-[1.05rem] leading-[1.85] sm:text-lg" style={{ color: 'rgba(51, 81, 122, 0.72)' }}>Together with our families, please join us as we celebrate our Nikkah and begin this beautiful new chapter surrounded by the people we love most.</p>
          <p className="font-citadel mt-10 text-3xl leading-none sm:text-4xl" style={{ color: '#33517A' }}>Ali &amp; Fatima</p>
          <div className="mt-8 flex justify-center"><img src={asset(ornamentImage)} alt="" aria-hidden="true" className="w-16 select-none opacity-80 sm:w-20" /></div>
        </div>
      </section>

      <InvitationFamilies divider={asset(familyDivider)} flower={asset(familyFlower)} sprig={asset(familySprig)} groom="Ali Khan" bride="Fatima Khan" />
      <section className="relative w-full overflow-hidden px-6 py-16 text-center sm:py-20">
        <div className="mx-auto max-w-xl"><Heading>Save the Date</Heading><p className="mt-4 text-xs uppercase tracking-[0.24em]" style={{ color: '#33517A' }}>Scratch the card to reveal the wedding date</p><div className="bli-scratch-wrap"><InvitationScratchCard couple="Ali & Fatima" date="October 16, 2026" day="Friday" time="7:00 PM" venue="Dera Dari" /></div><div className="mt-6"><CalendarButton label="Add date to your calendar" /></div></div>
      </section>

      <section className="relative w-full overflow-hidden px-4 py-16 sm:px-6 sm:py-20">
        <img src={asset(swanImage)} alt="" aria-hidden="true" className="pointer-events-none absolute -right-2 -top-4 z-30 w-36 select-none mix-blend-multiply sm:-right-6 sm:w-56" />
        <img src={asset(locationImage)} alt="" aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/2 h-full w-full max-w-3xl -translate-x-1/2 select-none object-cover opacity-70" />
        <div className="relative z-40 mx-auto max-w-2xl rv"><Heading>The Festivities</Heading>
          <div className="relative mb-16 mt-16 sm:mb-20 sm:mt-20" id="lane">
            <div className="pointer-events-none absolute inset-y-0 left-1/2 z-50 w-fit -translate-x-1/2" aria-hidden="true"><svg viewBox="-8 0 64 1280" fill="none" className="h-full w-auto select-none overflow-visible"><g><image href={asset(pearlImage)} x="12" y="0" width="24" height="24" /></g></svg></div>
            <div className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2"><div className="relative h-full w-fit"><svg viewBox="0 0 48 1280" fill="none" aria-hidden="true" className="h-full w-auto select-none"><defs><linearGradient id="swan-spine-grad" x1="0" y1="0" x2="0" y2="1280" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#33517A" stopOpacity="0" /><stop offset=".03125" stopColor="#33517A" stopOpacity=".42" /><stop offset=".96875" stopColor="#33517A" stopOpacity=".42" /><stop offset="1" stopColor="#33517A" stopOpacity="0" /></linearGradient></defs><path d="M 24 0 C 44 60 44 100 24 160 C 4 220 4 260 24 320 C 44 380 44 420 24 480 C 4 540 4 580 24 640 C 44 700 44 740 24 800 C 4 860 4 900 24 960 C 44 1020 44 1060 24 1120 C 4 1180 4 1220 24 1280" stroke="url(#swan-spine-grad)" strokeWidth="1.3" strokeLinecap="round" /></svg></div></div>
            {events.map((event, index) => <div className="relative grid h-52 grid-cols-[1fr_auto_1fr] items-center gap-1 sm:h-60 sm:gap-3" key={event.name}>
              {index % 2 === 0 ? <div className="flex justify-center"><img src={asset(event.image)} alt="" aria-hidden="true" className="w-full max-w-[8rem] select-none sm:max-w-[13rem]" /></div> : <div className="text-center"><p className="text-sm tracking-[0.18em] sm:text-lg sm:tracking-[0.22em]" style={{ color: '#33517A' }}>{event.time}</p><img src={asset(ornamentImage)} alt="" aria-hidden="true" className="mx-auto my-1.5 w-16 select-none opacity-80 sm:my-2 sm:w-20" /><h3 className="font-free-serif text-xs uppercase leading-tight tracking-[0.32em] sm:text-2xl" style={{ color: '#33517A' }}>{event.name}</h3><div className="mt-2 sm:mt-3"><p className="text-[0.8rem] uppercase leading-[1.7] tracking-[0.14em] sm:text-xs sm:tracking-[0.18em]" style={{ color: 'rgba(51, 81, 122, 0.72)' }}>{event.venue}</p></div><p className="mt-1 text-[0.55rem] uppercase tracking-[0.12em] sm:text-[0.65rem]" style={{ color: 'rgba(51, 81, 122, 0.45)' }}>{event.date}</p><a href={event.map} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[0.55rem] uppercase tracking-[0.16em] transition-colors hover:bg-white/60 sm:mt-5 sm:px-5 sm:py-2 sm:text-[0.62rem] sm:tracking-[0.2em]" style={{ borderColor: 'rgba(122, 152, 186, 0.38)', color: '#33517A' }}>View on map</a></div>}
              <div className="w-9 sm:w-12" aria-hidden="true" />
              {index % 2 === 1 ? <div className="flex justify-center"><img src={asset(event.image)} alt="" aria-hidden="true" className="w-full max-w-[8rem] select-none sm:max-w-[13rem]" /></div> : <div className="text-center"><p className="text-sm tracking-[0.18em] sm:text-lg sm:tracking-[0.22em]" style={{ color: '#33517A' }}>{event.time}</p><img src={asset(ornamentImage)} alt="" aria-hidden="true" className="mx-auto my-1.5 w-16 select-none opacity-80 sm:my-2 sm:w-20" /><h3 className="font-free-serif text-xs uppercase leading-tight tracking-[0.32em] sm:text-2xl" style={{ color: '#33517A' }}>{event.name}</h3><div className="mt-2 sm:mt-3"><p className="text-[0.8rem] uppercase leading-[1.7] tracking-[0.14em] sm:text-xs sm:tracking-[0.18em]" style={{ color: 'rgba(51, 81, 122, 0.72)' }}>{event.venue}</p></div><p className="mt-1 text-[0.55rem] uppercase tracking-[0.12em] sm:text-[0.65rem]" style={{ color: 'rgba(51, 81, 122, 0.45)' }}>{event.date}</p><a href={event.map} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[0.55rem] uppercase tracking-[0.16em] transition-colors hover:bg-white/60 sm:mt-5 sm:px-5 sm:py-2 sm:text-[0.62rem] sm:tracking-[0.2em]" style={{ borderColor: 'rgba(122, 152, 186, 0.38)', color: '#33517A' }}>View on map</a></div>}
            </div>)}
          </div>
        </div>
      </section>

      <section className="relative w-full overflow-hidden px-6 pb-24"><img src={asset(featherWaterImage)} alt="" aria-hidden="true" className="pointer-events-none absolute inset-x-0 -bottom-4 mx-auto h-auto w-[15rem] max-w-md select-none object-cover opacity-70 sm:h-28 sm:max-w-lg" /><div className="relative mx-auto max-w-2xl rv"><Heading>Counting Down to Forever</Heading><div className="mt-8"><div className="text-center"><div className="flex items-start justify-center gap-3 divide-x divide-[#7A98BA61]" id="countdown">{Object.entries(countdown).map(([unit, value]) => <div key={unit} className="flex min-w-[3.5rem] flex-col items-center justify-center gap-4 px-3 sm:min-w-[4.5rem] sm:px-6"><span className="font-cormorant text-[2.35rem] leading-none text-[#33517A] sm:text-5xl">{value}</span><span className="font-free-serif whitespace-nowrap text-[0.6rem] uppercase tracking-[0.22em] text-[#33517A73] sm:text-xs">{unit}</span></div>)}</div></div></div></div></section>

      <section className="relative w-full px-6 py-16 sm:py-20"><div className="mx-auto max-w-4xl rv"><Heading>Dress Code</Heading><p className="mx-auto mt-6 max-w-[17rem] text-center text-lg leading-[1.9]" style={{ color: 'rgba(51, 81, 122, 0.72)' }}>Traditional or formal attire is encouraged. Here is what we would love to see on each day.</p></div>
        {dress.map((look) => <div className="mx-auto mt-16 max-w-4xl rv" key={look.name}><h3 className="font-free-serif text-center text-[0.95rem] uppercase tracking-[0.32em] sm:text-lg" style={{ color: '#33517A' }}>{look.name}</h3><img src={asset(ornamentImage)} alt="" aria-hidden="true" className="mx-auto mt-3 w-16 select-none opacity-80 sm:w-20" /><p className="mx-auto mt-5 max-w-[17rem] text-center text-lg leading-[1.9]" style={{ color: 'rgba(51, 81, 122, 0.72)' }}>{look.description}</p><div className="mt-10 flex flex-col items-center gap-10 sm:flex-row sm:justify-center sm:gap-4"><img src={asset(look.image)} alt="" aria-hidden="true" className="w-[20rem] shrink-0 select-none" loading="lazy" /><div className="flex flex-col items-center"><p className="text-center text-[0.72rem] uppercase tracking-[0.3em] sm:text-[0.8rem]" style={{ color: 'rgba(51, 81, 122, 0.72)' }}>Colour Palette</p><div className="mt-6 flex items-start justify-center gap-3 sm:gap-5">{look.colors.map(([color, label]) => <div className="flex w-14 flex-col items-center sm:w-16" key={color}><span className="block h-10 w-10 rounded-full shadow-[0_2px_10px_rgba(51,81,122,0.16)] sm:h-12 sm:w-12" style={{ backgroundColor: color }} /><span className="mt-3 whitespace-pre-line text-center text-[0.5rem] uppercase leading-[1.6] tracking-[0.14em] sm:text-[0.56rem]" style={{ color: 'rgba(51, 81, 122, 0.45)' }}>{label}</span></div>)}</div></div></div></div>)}
      </section>

      <section className="relative w-full overflow-hidden px-6 py-16 sm:py-20"><div className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-[50%] blur-2xl" style={{ backgroundColor: 'rgba(198, 216, 234, 0.28)' }} aria-hidden="true" /><div className="relative mx-auto max-w-lg rv"><Heading>Will you join us?</Heading><p className="mt-4 text-center text-[0.65rem] uppercase tracking-[0.26em] sm:text-xs" style={{ color: 'rgba(51, 81, 122, 0.72)' }}>Kindly respond by October 1, 2026.</p>
        {sent ? <div className="mt-10 text-center" role="status"><p className="font-citadel text-4xl" style={{ color: '#33517A' }}>Thank you</p><p className="mt-3">Your response has been received.</p><button className="mt-5 underline" onClick={() => setSent(false)}>Edit your response</button></div> : <form className="mt-10 space-y-8" onSubmit={submitRsvp}>
          <div className="relative z-0"><input id="swan-rsvp-name" name="name" type="text" placeholder=" " autoComplete="name" required className="peer block w-full appearance-none rounded-none border-0 border-b border-[#7A98BA]/40 bg-transparent px-1 py-3 text-base text-[#33517A] transition-colors focus:border-[#33517A] focus:outline-none focus:ring-0" /><label htmlFor="swan-rsvp-name" className="absolute top-3 -z-10 origin-[0] -translate-y-7 scale-75 transform text-xs uppercase tracking-[0.24em] text-[#33517A]/80 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-[#33517A]">Full name(s)</label></div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">{[['yes', 'Joyfully accepts'], ['no', 'Regretfully declines']].map(([value, label]) => <label key={value} className="relative flex-1"><input className="peer sr-only" type="radio" name="response" value={value} checked={response === value} onChange={() => setResponse(value)} /><span className="block w-full cursor-pointer rounded-full border border-[#7A98BA]/45 px-5 py-3 text-center text-[0.7rem] uppercase tracking-[0.2em] text-[#33517A]/80 transition-colors hover:border-[#33517A]/60 peer-checked:border-[#33517A] peer-checked:bg-[#33517A] peer-checked:text-white">{label}</span></label>)}</div>
          {response === 'yes' && <div className="relative z-0"><input id="swan-rsvp-guests" name="guests" type="number" min="1" max="20" placeholder=" " className="peer block w-full appearance-none rounded-none border-0 border-b border-[#7A98BA]/40 bg-transparent px-1 py-3 text-base text-[#33517A] focus:border-[#33517A] focus:outline-none" /><label htmlFor="swan-rsvp-guests" className="absolute top-3 -z-10 -translate-y-7 scale-75 text-xs uppercase tracking-[0.24em] text-[#33517A]/80">Number of guests</label></div>}
          <div className="flex justify-center pt-2"><button type="submit" className="w-full rounded-full bg-[#7A98BA] px-12 py-4 text-[0.7rem] uppercase tracking-[0.28em] text-white shadow-[0_10px_30px_-10px_rgba(51,81,122,0.6)] transition-colors hover:bg-[#33517A] sm:w-auto">Send</button></div>
        </form>}
      </div></section>



      <section className="relative h-[25rem] w-full overflow-hidden lg:h-[100svh]"><picture><source media="(min-width: 1024px)" srcSet={asset(closingLargeImage)} type="image/webp" /><img src={asset(closingImage)} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full select-none object-cover object-[100%_80%]" loading="lazy" /></picture><div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-32" style={{ background: 'linear-gradient(180deg, rgba(247,250,253,0) 0%, rgba(247,250,253,0.75) 45%, rgba(247,250,253,0.95) 100%)' }} /><div className="relative z-10 flex h-full flex-col justify-end py-8"><div className="px-6 text-center rv"><p className="text-[0.9rem] uppercase tracking-[0.32em] sm:text-xs" style={{ color: 'rgba(51, 81, 122, 0.72)' }}>With love, we await you</p><p className="font-citadel mt-3 text-4xl sm:text-5xl" style={{ color: '#33517A' }}>Ali &amp; Fatima</p><p className="mt-4 text-md italic" style={{ color: 'rgba(51, 81, 122, 0.45)' }}>Our forever begins here.</p></div></div></section>
      <div aria-hidden="true" className="mx-auto mt-12 h-px w-4/5 max-w-sm sm:mt-16" style={{ background: 'linear-gradient(90deg, rgba(122,152,186,0) 0%, rgba(122,152,186,0.7) 50%, rgba(122,152,186,0) 100%)' }} /><div className="py-8" />
    </main>
    <button type="button" onClick={toggleMusic} className="fixed right-5 top-5 z-[900] flex h-11 w-11 items-center justify-center rounded-full backdrop-blur transition-colors" style={{ backgroundColor: 'rgba(247,250,253,0.7)', border: '1px solid rgba(122, 152, 186, 0.38)', color: '#33517A' }} aria-label={musicOn ? 'Pause music' : 'Play music'}>{musicOn ? '♫' : '♪'}</button>
    <audio ref={musicRef} src={asset(swanLakeAudio)} loop preload="none" />
    <div className={`fixed inset-x-0 top-0 z-[1000] h-[100svh] overflow-hidden transition-opacity duration-[1400ms] ${opened ? 'pointer-events-none opacity-0' : 'opacity-100'}`} style={{ backgroundColor: '#F7FAFD', touchAction: 'none', overscrollBehavior: 'none' }} aria-hidden={opened}>
      <video ref={coverRef} className="absolute inset-0 h-full w-full object-cover" poster={asset(posterImage)} muted playsInline loop preload="auto"><source src={asset(coverVideo)} type="video/webm" /></video>
      <button type="button" onClick={openInvitation} aria-label="Open the invitation" className="absolute inset-0 flex w-full cursor-pointer flex-col items-center justify-between px-6 pb-[10vh] pt-[7vh]" style={{ transition: 'opacity .8s ease', color: '#33517A' }}>
        <div className="flex flex-col items-center gap-6"><span className="text-xs uppercase tracking-[0.48em]" style={{ color: 'rgba(51, 81, 122, 0.72)' }}>Wedding Invitation</span><span className="flex items-center gap-4 sm:gap-5"><span className="font-playfair text-4xl leading-none tracking-[0.12em] opacity-80 sm:text-6xl">A</span><span className="font-citadel text-4xl leading-none opacity-80 sm:text-6xl">&amp;</span><span className="font-playfair text-4xl leading-none tracking-[0.12em] opacity-80 sm:text-6xl">F</span></span></div>
        <span className="cover-hint whitespace-pre-line text-xs uppercase tracking-[0.34em] sm:text-sm" style={{ color: 'rgba(51, 81, 122, 0.72)' }}>Touch the feather{'\n'}to open</span>
      </button>
    </div>

  </div>;
}
