'use client';

import {asset} from './asset-map';

import {useEffect, useRef, useState} from 'react';
import './assets/css/styles.css';
import './desktop-frame.css';

const ROOT = '/invitations/doors-of-mehr';
const days = [
    {
        name: 'Mayun',
        date: 'November 25, 2027',
        short: '25 NOV',
        day: 'Thursday',
        time: '05:00 PM',
        venue: 'The Family Home',
        icon: 'icon-mayun.webp',
        program: [['05:00 PM', 'Mayun begins', 'At The Family Home'], ['07:00 PM', 'Family dinner', 'A gathering at home']]
    },
    {
        name: 'Mehndi',
        date: 'November 27, 2027',
        short: '27 NOV',
        day: 'Saturday',
        time: '05:00 PM',
        venue: 'The Garden Venue',
        icon: 'icon-mehndi.webp',
        program: [['05:00 PM', 'Mehndi welcome', 'At The Garden Venue'], ['07:30 PM', 'Music & dinner', 'An evening in the garden']]
    },
    {
        name: 'Nikkah',
        date: 'November 28, 2027',
        short: '28 NOV',
        day: 'Sunday',
        time: '05:00 PM',
        venue: 'Departure from the Family Home',
        icon: 'icon-nikkah.webp',
        program: [['05:00 PM', 'Nikkah ceremony', 'Two guests only'], ['06:00 PM', 'Duas & blessings', 'With the family']]
    },
    {
        name: 'Barat',
        date: 'November 29, 2027',
        short: '29 NOV',
        day: 'Monday',
        time: '05:00 PM',
        venue: 'The Family Home',
        icon: 'icon-barat.webp',
        program: [['05:00 PM', 'Sehra Bandi', 'At The Family Home'], ['05:30 PM', 'Barat Departure', 'From The Family Home']]
    },
    {
        name: 'Walima',
        date: 'November 30, 2027',
        short: '30 NOV',
        day: 'Tuesday',
        time: '06:00 PM',
        venue: 'The Marquee',
        icon: 'icon-walima.webp',
        program: [['06:00 PM', 'Guest reception', 'At The Marquee'], ['08:00 PM', 'Dinner', 'An evening with family']]
    },
];

function ScratchDate() {
    const canvas = useRef(null), drawing = useRef(false), moves = useRef(0);
    const [done, setDone] = useState(false);
    useEffect(() => {
        const el = canvas.current;
        if (!el) return;
        const paint = () => {
            const r = el.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
            el.width = Math.max(1, Math.round(r.width * dpr));
            el.height = Math.max(1, Math.round(r.height * dpr));
            const ctx = el.getContext('2d');
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            const g = ctx.createLinearGradient(0, 0, r.width, r.height);
            g.addColorStop(0, '#b99a68');
            g.addColorStop(.48, '#eadab8');
            g.addColorStop(1, '#a98453');
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, r.width, r.height);
            ctx.fillStyle = 'rgba(255,250,235,.5)';
            ctx.font = '600 12px serif';
            ctx.textAlign = 'center';
            ctx.fillText('✧  SCRATCH TO REVEAL  ✧', r.width / 2, r.height / 2);
            ctx.globalCompositeOperation = 'destination-out';
            moves.current = 0
        };
        paint();
        const resize = new ResizeObserver(paint);
        resize.observe(el);
        return () => resize.disconnect()
    }, []);
    const reveal = () => {
        if (!done) setDone(true)
    };
    const check = () => {
        const el = canvas.current;
        if (!el || done) return;
        const pixels = el.getContext('2d').getImageData(0, 0, el.width, el.height).data;
        let clear = 0;
        for (let i = 3; i < pixels.length; i += 4) if (pixels[i] < 16) clear++;
        if (clear / (pixels.length / 4) > .2) reveal()
    };
    const scratch = e => {
        if (!drawing.current || done) return;
        const r = canvas.current.getBoundingClientRect(), ctx = canvas.current.getContext('2d');
        ctx.beginPath();
        ctx.arc(e.clientX - r.left, e.clientY - r.top, 34, 0, Math.PI * 2);
        ctx.fill();
        if (++moves.current % 4 === 0) check()
    };
    return <div className={`scratch-wrap ${done ? 'is-revealed' : ''}`}>
        <div className="date-reveal"><span className="date-kicker">You are invited</span><strong className="date-main">November
            25, 2027</strong>
            <div className="date-day"><span>Thursday</span><span>⬩</span><span>05:00 PM</span></div>
        </div>
        {!done && <canvas ref={canvas} className="scratch-canvas" role="button" tabIndex={0}
                          aria-label="Scratch to reveal the wedding date. Press Enter to reveal." onPointerDown={e => {
            drawing.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            scratch(e)
        }} onPointerMove={scratch} onPointerUp={() => {
            drawing.current = false;
            check()
        }} onPointerCancel={() => {
            drawing.current = false;
            check()
        }} onKeyDown={e => e.key === 'Enter' && reveal()}/>}</div>;
}

export default function DoorsOfMehr() {
    const [opened, setOpened] = useState(false), [guest, setGuest] = useState('Dear family and friends'), [selected, setSelected] = useState(3), [playing, setPlaying] = useState(false), [count, setCount] = useState([0, 0, 0, 0]), [rsvp, setRsvp] = useState(false);
    const audio = useRef(null);
    const active = days[selected];
    useEffect(() => {
        const q = new URLSearchParams(location.search);
        setGuest(q.get('guest')?.trim() || 'Dear family and friends');
        const tick = () => {
            const left = Math.max(0, new Date('2027-11-25T17:00:00+05:00').getTime() - Date.now());
            setCount([Math.floor(left / 86400000), Math.floor(left / 3600000) % 24, Math.floor(left / 60000) % 60, Math.floor(left / 1000) % 60])
        };
        tick();
        const timer = setInterval(tick, 1000);
        const observer = new IntersectionObserver((es) => es.forEach((e) => {
            if (e.isIntersecting) {
                e.target.classList.add('is-visible');
                observer.unobserve(e.target)
            }
        }), {threshold: .1});
        document.querySelectorAll('#invitation .reveal').forEach((e) => observer.observe(e));
        document.body.classList.add('doorsmehr-locked');
        return () => {
            clearInterval(timer);
            observer.disconnect();
            document.body.classList.remove('doorsmehr-locked')
        }
    }, []);
    const open = () => {
        setOpened(true);
        document.body.classList.remove('doorsmehr-locked');
        audio.current?.play().then(() => setPlaying(true)).catch(() => {
        })
    };
    const toggleMusic = () => {
        if (!audio.current) return;
        if (audio.current.paused) audio.current.play().then(() => setPlaying(true)).catch(() => {
        }); else {
            audio.current.pause();
            setPlaying(false)
        }
    };
    const submitRsvp = (e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const data = {
            name: form.get('name'),
            attendance: form.get('attendance'),
            guests: form.get('guests'),
            events: form.getAll('events'),
            message: form.get('message')
        };
        try {
            localStorage.setItem('doors-of-mehr-rsvp', JSON.stringify(data))
        } catch {
        }
        setRsvp(true)
    };
    const addCalendar = (event) => {
        const date = event.date === 'November 25, 2027' ? '20271125' : event.date === 'November 27, 2027' ? '20271127' : event.date === 'November 28, 2027' ? '20271128' : event.date === 'November 29, 2027' ? '20271129' : '20271130';
        const ics = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nBEGIN:VEVENT\r\nDTSTART;TZID=Asia/Karachi:${date}T170000\r\nSUMMARY:${event.name} — Faraz & Sana\r\nLOCATION:${event.venue}, Lahore\r\nEND:VEVENT\r\nEND:VCALENDAR`;
        const url = URL.createObjectURL(new Blob([ics], {type: 'text/calendar'}));
        const a = document.createElement('a');
        a.href = url;
        a.download = `faraz-sana-${event.name.toLowerCase()}.ics`;
        a.click();
        URL.revokeObjectURL(url)
    };
    return <div className="invitation-preview-shell">
        <main id="invitation" className="doors-mehr" style={{
            '--plum': '#34291f',
            '--ivory': '#f5eddd',
            '--champagne': '#b89966',
            '--mauve': '#856749',
            '--lilac': '#e5d5b9',
            '--mehr-visible-height': '100svh'
        }}>
            <audio ref={audio} src={asset(`${ROOT}/media/music.mp3`)} loop preload="none"
                   onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}/>
            <button id="musicToggle" className={`music-toggle ${playing ? 'is-playing' : ''}`} type="button"
                    onClick={toggleMusic} aria-label={playing ? 'Pause background music' : 'Play background music'}>
                <span className="music-bars"><i/><i/><i/></span><span>{playing ? 'PAUSE' : 'MUSIC'}</span></button>
            <section id="hero" className={`hero ${opened ? 'is-open' : 'is-closed'}`} role="button" tabIndex={0}
                     aria-label={opened ? 'Wedding invitation cover' : 'Tap to open the wedding invitation'}
                     onClick={() => !opened && open()} onKeyDown={(e) => !opened && e.key === 'Enter' && open()}>
                <video suppressHydrationWarning className="hero-video" src={asset(`${ROOT}/media/intro.mp4`)}
                       poster={asset(`${ROOT}/media/intro-poster.webp`)} muted playsInline autoPlay loop/>
                <div className="hero-veil"/>
                <div id="openingMark" className="opening-mark"><span className="opening-label"
                                                                     style={{display: 'block'}}>{opened ? 'Welcome' : 'Tap to open'}</span><span
                    className="opening-ripple"/></div>
                <div className="hero-content"><p className="bismillah" lang="ar">بِسْمِ اللَّهِ الرَّحْمَٰنِ
                    الرَّحِيمِ</p>
                    <div className="hero-divider"><span>✦</span></div>
                    <p className="hero-welcome">Together with their families</p>
                    <div className="couple-names">
                        <div><h1>Faraz</h1><p>The Groom</p><small>Syed Faraz Ali</small></div>
                        <span className="name-ampersand">&amp;</span>
                        <div><h1>Sana</h1><p>The Bride</p><small>Syeda Sana Fatima</small></div>
                    </div>
                    <p className="hero-invitation">invite you to celebrate the wedding of</p><p
                        className="hero-closing">{guest}</p><a className="scroll-cue" href="#welcome"
                                                               onClick={(e) => e.stopPropagation()}><span>Scroll</span><i/></a>
                </div>
            </section>
            <div className="floral-divider"><img src={asset(`${ROOT}/assets/images/floral-divider.webp`)} alt=""/></div>
            <section id="welcome" className="welcome-section section-pad">
                <div className="section-shell welcome-shell">
                    <div className="welcome-copy reveal"><h2>RASOOL ALLAH (SAWW) SAID:</h2><p className="hadith-ar"
                                                                                              lang="ar">يَا عَلِيُّؑ
                        إِنَّ اللَّهَ عَزَّ وَجَلَّ زَوَّجَكَ فَاطِمَةَؐ</p><p className="hadith-en">“O Ali (AS), Allah
                        (JJ) has recited your Nikkah with Fatima (SA)”</p>
                        <div className="signature">Faraz &amp; Sana</div>
                    </div>
                </div>
            </section>
            <section className="families-section section-pad">
                <div className="section-shell">
                    <header className="section-heading reveal"><span
                        className="eyebrow">A gathering of two families</span><h2>One celebration, shared with love</h2>
                        <span className="ornament"><i/></span></header>
                    <div className="family-pair reveal">
                        <article><span>With love from</span><strong>Sana’s family</strong></article>
                        <i aria-hidden="true">✦</i>
                        <article><span>With love from</span><strong>Faraz’s family</strong></article>
                    </div>
                    <p className="family-note reveal">We look forward to welcoming you through every door of
                        celebration.</p></div>
            </section>
            <div className="floral-divider"><img src={asset(`${ROOT}/assets/images/floral-divider.webp`)} alt=""/></div>
            <section id="date" className="scratch-section save-date-section section-pad">
                <div className="section-shell">
                    <header className="section-heading reveal"><span className="eyebrow">A date to hold close</span>
                        <h2>Save the Date</h2><span className="ornament"><i/></span></header>
                    <div className="scratch-frame-shell reveal"><img
                        src={asset(`${ROOT}/assets/images/scratch-frame.webp`)} alt=""
                        className="scratch-frame-overlay"/><ScratchDate/></div>
                    <p className="scratch-note reveal">Use your finger or cursor to uncover the date.</p>
                    <div className="cta-row">
                        <button className="calendar-cta" type="button" data-cal-icon
                                onClick={() => addCalendar(days[0])}>Add to Calendar
                        </button>
                    </div>
                </div>
            </section>
            <div className="floral-divider"><img src={asset(`${ROOT}/assets/images/floral-divider.webp`)} alt=""/></div>
            <section className="countdown-section section-pad">
                <div className="section-shell countdown-shell">
                    <header className="section-heading reveal"><span className="eyebrow">Until we say Qubool Hai</span>
                        <h2>Counting every heartbeat</h2><span className="ornament"><i/></span></header>
                    <div className="countdown reveal" aria-label="Wedding countdown">{count.map((n, i) => <div key={i}>
                        <strong>{String(n).padStart(i ? 2 : 1, '0')}</strong><span>{['days', 'hours', 'minutes', 'seconds'][i]}</span>
                    </div>)}</div>
                </div>
            </section>
            <div className="floral-divider"><img src={asset(`${ROOT}/assets/images/floral-divider.webp`)} alt=""/></div>
            <section className="events-section section-pad">
                <div className="section-shell">
                    <header className="section-heading reveal"><span className="eyebrow">Five days of celebration</span>
                        <h2>The Festivities</h2><span className="ornament"><i/></span></header>
                    <div id="preWeddingEvents" className="event-list reveal">{days.map((d, i) => <article
                        className={`event-band ${i === selected ? 'selected' : ''}`} key={d.name}
                        onClick={() => setSelected(i)}><img className="event-icon"
                                                            src={asset(`${ROOT}/assets/images/${d.icon}`)} alt=""/>
                        <div><h3>{d.name}</h3>
                            <p>{d.day}, {d.date.replace('November ', '').replace(', 2027', '')} · {d.time}</p>
                            <small>{d.venue}, Lahore</small></div>
                        <div className="event-actions">
                            <button className="event-btn" type="button" onClick={(e) => {
                                e.stopPropagation();
                                addCalendar(d)
                            }}>Add to calendar
                            </button>
                            <a className="event-btn" href="https://maps.google.com/?q=Lahore" target="_blank"
                               rel="noreferrer" onClick={(e) => e.stopPropagation()}>View map</a></div>
                    </article>)}</div>
                </div>
            </section>
            <div className="floral-divider"><img src={asset(`${ROOT}/assets/images/floral-divider.webp`)} alt=""/></div>
            <section className="program-section section-pad">
                <div className="section-shell program-shell">
                    <header className="section-heading reveal"><span
                        className="eyebrow">{active.day}, {active.short.replace(' ', ' ')}</span>
                        <h2>The {active.name} Day</h2><span className="ornament"><i/></span></header>
                    <div id="programTimeline"
                         className="timeline reveal">{active.program.map(([time, title, detail], i) => <article
                        key={title}><span className="timeline-index">0{i + 1}</span>
                        <time>{time}</time>
                        <h3>{title}</h3><p>{detail}</p></article>)}</div>
                    <div className="venue-card reveal"><span className="eyebrow">This celebration</span>
                        <h2>{active.venue}</h2><p>Lahore, Pakistan</p><a className="venue-map-button"
                                                                         href={`https://maps.google.com/?q=${encodeURIComponent(active.venue + ' Lahore')}`}
                                                                         target="_blank" rel="noreferrer">View on
                            map</a></div>
                </div>
            </section>
            <div className="floral-divider"><img src={asset(`${ROOT}/assets/images/floral-divider.webp`)} alt=""/></div>
            <section className="rsvp-section section-pad">
                <div className="section-shell rsvp-shell">
                    <header className="section-heading reveal"><span className="eyebrow">Choose the celebrations</span>
                        <h2>Kindly RSVP</h2><span className="ornament"><i/></span></header>
                    {rsvp ?
                        <div className="rsvp-success"><span className="eyebrow">Thank you</span><h3>Your reply has been
                            noted</h3><p>We look forward to celebrating with you.</p></div> :
                        <form className="rsvp-form reveal" onSubmit={submitRsvp}>
                            <fieldset className="form-wide rsvp-event-list">
                                <legend>Select the events you plan to attend</legend>
                                {days.map(d => <label className="rsvp-event-option" key={d.name}><input type="checkbox"
                                                                                                        name="events"
                                                                                                        value={d.name}/><span>{d.name}</span><small>{d.short}</small></label>)}
                            </fieldset>
                            <label><span>Your name</span><input name="name" autoComplete="name"
                                                                required/></label><label><span>Attendance</span><select
                            name="attendance" defaultValue="" required>
                            <option value="" disabled>Select your response</option>
                            <option>Joyfully accepts</option>
                            <option>Regretfully declines</option>
                        </select></label><label><span>Number of guests</span><select name="guests"
                                                                                     defaultValue="1">{['1', '2', '3', '4', '5+'].map(x =>
                            <option key={x}>{x}</option>)}</select></label><label className="form-wide"><span>A note for the family</span><textarea
                            name="message" rows="3"/></label>
                            <div className="form-footer form-wide"><p>Your reply is saved in this invitation
                                preview.</p>
                                <button type="submit" className="primary-button">Send RSVP</button>
                            </div>
                        </form>}</div>
            </section>
            <section className="contacts-section section-pad">
                <div className="section-shell contacts-shell">
                    <header className="section-heading reveal"><span className="eyebrow">With love</span><h2>For Further
                        Details</h2><span className="ornament"><i/></span></header>
                    <ul className="contact-list reveal">
                        <li><span className="contact-name">The family</span><a className="contact-tel"
                                                                               href="tel:+923000000000">0300-0000000</a>
                        </li>
                    </ul>
                </div>
            </section>
            <footer className="closing-section">
                <div className="closing-arch reveal"><span className="ornament light"><i/></span><p
                    className="bismillah" lang="ar">بَارَكَ اللّٰهُ لَكُمَا</p><p className="dua-translation">May Allah
                    bless you, shower His blessings upon you, and join you both together in goodness.</p><h2>We can't
                    wait to celebrate with you.</h2>
                    <div className="closing-names">Faraz <span>&amp;</span> Sana</div>
                    <small>November 25 – 30, 2027 · Lahore</small></div>
            </footer>
        </main>
    </div>;
}
