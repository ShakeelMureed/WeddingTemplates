'use client';
import {useEffect, useState} from 'react';
import './style.css';

const photo = 'https://images.unsplash.com/photo-1582181524507-4ec8300ffbfc?auto=format&fit=crop&w=2200&q=85';
const events = [['Mehndi', 'Wednesday · 24 March 2027', '5:00 PM · The Courtyard'], ['Nikkah', 'Thursday · 25 March 2027', '6:00 PM · The Grand Hall'], ['Walima', 'Friday · 26 March 2027', '7:30 PM · The Grand Hall']];
export default function JhoomarInvitation() {
    const [open, setOpen] = useState(false), [opening, setOpening] = useState(false), [names, setNames] = useState({
        guest: 'Dear family and friends',
        bride: 'Fatima',
        groom: 'Ali'
    }), [time, setTime] = useState([0, 0, 0, 0]), [active, setActive] = useState(0), [sent, setSent] = useState(false);
    useEffect(() => {
        const q = new URLSearchParams(location.search);
        setNames({
            guest: q.get('guest')?.trim() || 'Dear family and friends',
            bride: q.get('bride')?.trim() || 'Fatima',
            groom: q.get('groom')?.trim() || 'Ali'
        });
        const tick = () => {
            const d = Math.max(0, new Date('2027-03-25T18:00:00+05:00').getTime() - Date.now());
            setTime([Math.floor(d / 86400000), Math.floor(d / 3600000) % 24, Math.floor(d / 60000) % 60, Math.floor(d / 1000) % 60])
        };
        tick();
        const t = setInterval(tick, 1000);
        return () => clearInterval(t)
    }, []);
    useEffect(() => {
        const items = document.querySelectorAll('.jhoomar .reveal-on-scroll');
        if (!('IntersectionObserver' in window)) {
            items.forEach(el => el.classList.add('is-visible'));
            return
        }
        const observer = new IntersectionObserver(entries => entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target)
            }
        }), {threshold: .12});
        items.forEach(el => observer.observe(el));
        return () => observer.disconnect()
    }, []);
    const submit = e => {
        e.preventDefault();
        const f = new FormData(e.currentTarget), d = Object.fromEntries(f);
        d.events = f.getAll('events');
        try {
            localStorage.setItem('jhoomar-rsvp', JSON.stringify(d))
        } catch {
        }
        setSent(true)
    };
    return <main className="jhoomar">
        {!open && <button className={`jhoomar-cover ${opening ? 'is-opening' : ''}`} onClick={() => {
            if (opening) return;
            setOpening(true);
            setTimeout(() => setOpen(true), 1450)
        }} aria-label="Open the invitation"><span className="jhoomar-cover-photo"
                                                  style={{backgroundImage: `linear-gradient(180deg,rgba(22,12,25,.2),rgba(22,12,25,.85)),url(${photo})`}}/>
            <video suppressHydrationWarning className="jhoomar-cover-video"
                   src="https://videos.pexels.com/video-files/32725210/32725210-hd_1920_1080_25fps.mp4" autoPlay muted
                   loop playsInline preload="metadata" aria-hidden="true"/>
            <span className="jhoomar-cover-rule"/><small>A CELEBRATION OF
                LOVE</small><strong>{names.groom}<i>&amp;</i>{names.bride}</strong><em>{names.guest}</em><b>ENTER THE
                EVENING <span>✧</span></b><span className="jhoomar-cover-gem">✦</span></button>}
        <header className="jhoomar-hero"
                style={{backgroundImage: `linear-gradient(90deg,rgba(25,13,28,.86),rgba(25,13,28,.32)),url(${photo})`}}>
            <video suppressHydrationWarning className="jhoomar-hero-video"
                   src="https://videos.pexels.com/video-files/32725210/32725210-hd_1920_1080_25fps.mp4" autoPlay muted
                   loop playsInline preload="metadata" aria-hidden="true"/>
            <nav><span>J <i>✦</i> F</span><a href="#jhoomar-rsvp">KINDLY REPLY ↗</a></nav>
            <div className="jhoomar-title"><small>AN EVENING AMONG THE CRYSTALS</small><p>{names.guest}</p>
                <h1>{names.groom}<i>&amp;</i>{names.bride}</h1><em>with their families</em>
                <div className="jhoomar-date"><span>25</span><i>✧</i><span>03 · 2027</span><b>LAHORE</b></div>
                <a href="#jhoomar-letter">A NOTE FOR YOU ↓</a></div>
            <div className="jhoomar-crystal crystal-one">◇</div>
            <div className="jhoomar-crystal crystal-two">◇</div>
        </header>
        <section className="jhoomar-letter reveal-on-scroll" id="jhoomar-letter">
            <div className="jhoomar-jewel">✧</div>
            <small>IN THE NAME OF ALLAH, THE MOST MERCIFUL</small><h2>A note from our<br/>families</h2><p>With grateful
            hearts, our families invite you to join {names.groom} and {names.bride} as they begin a life together. Your
            prayers and presence will make this gathering complete.</p>
            <div className="jhoomar-families">
                <span>{names.groom}’s family</span><i>✦</i><span>{names.bride}’s family</span></div>
            <small>WITH LOVE · AND EVERY BLESSING</small></section>
        <section className="jhoomar-hall reveal-on-scroll">
            <div className="jhoomar-hall-photo" style={{backgroundImage: `url(${photo})`}}/>
            <div className="jhoomar-hall-copy"><small>THE GRAND HALL · LAHORE</small><h2>Where the evening<br/>catches
                the light</h2><p>A room dressed for celebration, with familiar faces gathered beneath a glow of crystal
                and candlelight.</p><a href="https://maps.google.com/?q=Grand+Hall+Lahore" target="_blank"
                                       rel="noreferrer">FIND THE HALL <b>↗</b></a><span
                className="jhoomar-hall-mark">❧</span></div>
        </section>
        <section className="jhoomar-count reveal-on-scroll"><small>UNTIL WE GATHER</small><h2>The day is drawing
            near</h2>
            <div>{time.map((n, i) => <article key={i}>
                <b>{String(n).padStart(i ? 2 : 1, '0')}</b><span>{['DAYS', 'HOURS', 'MINUTES', 'SECONDS'][i]}</span>
            </article>)}</div>
            <p>THURSDAY · 25 MARCH 2027 · 6:00 PM</p></section>
        <section className="jhoomar-events reveal-on-scroll">
            <header><small>THREE OCCASIONS, ONE CELEBRATION</small><h2>Join us for the moments</h2><p>Select an event to
                see the details.</p></header>
            <div className="jhoomar-event-tabs">{events.map((e, i) => <button key={e[0]}
                                                                              className={active === i ? 'active' : ''}
                                                                              onClick={() => setActive(i)}>
                <i>{['✥', '◇', '✧'][i]}</i><span>{e[0]}</span></button>)}</div>
            <article className="jhoomar-event-card"><span>0{active + 1}</span>
                <div><small>{events[active][1]}</small><h3>{events[active][0]}</h3><p>{events[active][2]}</p></div>
                <a href={`https://maps.google.com/?q=${encodeURIComponent(events[active][2] + ' Lahore')}`}
                   target="_blank" rel="noreferrer">DIRECTIONS ↗</a></article>
        </section>
        <section className="jhoomar-rsvp reveal-on-scroll" id="jhoomar-rsvp">
            <div><small>WE HOPE YOU CAN JOIN US</small><h2>Save your<br/>place at the table</h2><p>Your reply helps our
                families prepare a warm welcome.</p></div>
            {sent ? <div className="jhoomar-thanks"><i>✦</i><h3>Thank you</h3><p>Your reply has been saved in this
                    preview.</p></div> :
                <form onSubmit={submit}><label>Your name<input name="name" required placeholder="Name"/></label><label>Your
                    response<select name="attendance" required defaultValue="">
                        <option value="" disabled>Choose one</option>
                        <option>Joyfully accepts</option>
                        <option>Regretfully declines</option>
                    </select></label>
                    <fieldset>
                        <legend>Which occasions?</legend>
                        {events.map(e => <label key={e[0]}><input type="checkbox" name="events"
                                                                  value={e[0]}/><span>{e[0]}</span><i>◇</i></label>)}
                    </fieldset>
                    <label>A note for the couple<textarea name="message" rows="2" placeholder="Optional"/></label>
                    <button type="submit">SEND YOUR REPLY <b>↗</b></button>
                    <small className="jhoomar-note">Preview only · Reply stays in this browser</small></form>}</section>
        <footer className="jhoomar-footer"><span>UNTIL THE LAST CANDLE GLOWS</span><strong>{names.groom}
            <i>&amp;</i> {names.bride}</strong><small>25 MARCH 2027 · LAHORE</small></footer>
    </main>;
}
