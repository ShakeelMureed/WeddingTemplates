'use client';
import { useEffect, useRef, useState } from 'react';
import './sections.css';

export function InvitationScratchCard({ couple, date, day, time, venue, onReveal }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const moves = useRef(0);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const paint = () => {
      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const ctx = canvas.getContext('2d');
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = bounds.width * dpr;
      canvas.height = bounds.height * dpr;
      ctx.scale(dpr, dpr);
      const gradient = ctx.createLinearGradient(0, 0, bounds.width, bounds.height);
      gradient.addColorStop(0, '#d8c7a6');
      gradient.addColorStop(.5, '#eee2c9');
      gradient.addColorStop(1, '#c8b18b');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, bounds.width, bounds.height);
      ctx.fillStyle = 'rgba(255,255,255,.38)';
      ctx.font = '600 12px BloomSectionSerif, Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText('✧  SCRATCH TO REVEAL  ✧', bounds.width / 2, bounds.height / 2);
    };
    paint();
    const observer = new ResizeObserver(paint);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);
  const revealIfCleared = () => {
    const canvas = canvasRef.current;
    if (!canvas || revealed) return;
    const pixels = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
    let clear = 0;
    for (let i = 3; i < pixels.length; i += 4) if (pixels[i] < 16) clear++;
    if (clear / (pixels.length / 4) > .18) { setRevealed(true); onReveal?.(); }
  };
  const scratch = (event) => {
    if (!drawing.current || revealed) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(event.clientX - rect.left, event.clientY - rect.top, 32, 0, Math.PI * 2);
    ctx.fill();
    moves.current++;
    if (moves.current % 3 === 0) revealIfCleared();
  };
  return <div className={`bli-scratch ${revealed ? 'is-revealed' : ''}`}>
    <span className="bli-scratch-kicker">THE CELEBRATION OF {couple}</span>
    <strong className="bli-scratch-date">{date}</strong>
    <span className="bli-scratch-day">{day}</span>
    <span className="bli-scratch-time">{time} · {venue}</span>
    {!revealed && <canvas ref={canvasRef} aria-label="Scratch to reveal the wedding date" onPointerDown={event => { drawing.current = true; event.currentTarget.setPointerCapture(event.pointerId); scratch(event); }} onPointerMove={scratch} onPointerUp={() => { drawing.current = false; revealIfCleared(); }} onPointerCancel={() => { drawing.current = false; revealIfCleared(); }} />}
    {!revealed && <button type="button" className="bli-scratch-button" onClick={() => { setRevealed(true); onReveal?.(); }}>Tap to reveal date</button>}
  </div>;
}

export function InvitationFamilies({ divider, flower, sprig, groom = 'Ali Khan', bride = 'Fatima Khan' }) {
  const family = [
    { side: "Groom's family", name: groom, parents: 'Mr. & Mrs. Tariq Khan' },
    { side: "Bride's family", name: bride, parents: 'Mr. & Mrs. Ahmed Khan' },
  ];
  return <section className="bli-family" aria-labelledby="bli-family-title">
    <p className="bli-family-eyebrow">WITH THE BLESSINGS OF</p>
    <h2 id="bli-family-title" className="bli-family-title">Our Families</h2>
    <img className="bli-family-divider" src={divider} alt="" />
    <p className="bli-family-intro">Two families, one joyful celebration</p>
    <div className="bli-family-grid">{family.map(item => <article className="bli-family-card" key={item.side}>
      <img className="bli-family-flower" src={flower} alt="" />
      <p className="bli-family-side">{item.side}</p>
      <h3>{item.name}</h3>
      <img className="bli-family-divider" src={divider} alt="" />
      <p className="bli-family-parents">{item.parents}</p>
      <img className="bli-family-sprig" src={sprig} alt="" />
    </article>)}</div>
  </section>;
}
