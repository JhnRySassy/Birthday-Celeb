import React, { useState, useEffect, useRef } from "react";

// ---------------------------------------------------------------
// Cherry Dawang — Birthday Celebration RSVP
// Edit EVENT below for date, time, venue, dress code.
// Edit GOOGLE_SCRIPT_URL below after you deploy your Apps Script
// (see README.md for the step-by-step).
// Photos live in /public/photos — add or remove filenames in PHOTOS below.
// ---------------------------------------------------------------

const EVENT = {
  name: "Cherry Lyn Dawang",
  headline: "is turning a year more wonderful",
  date: "September 18, 2026",
  time: "6:00 PM", // ← placeholder, update to the real time
  venue: "Mang Rudy's Tuna Grill & Papaitan", // ← placeholder
  address: "7483 Bagtikan Street, Makati, 1203 Kalakhang Maynila",
  mapEmbedUrl: "https://maps.google.com/maps?q=14.562988,121.012796&z=17&hl=en&output=embed",
  mapDirectionsUrl: "https://www.google.com/maps/search/?api=1&query=14.562988,121.012796",
  dressCode: "Wear something you feel good in", // ← placeholder
  rsvpBy: "September 14, 2026",
};

// PASTE your deployed Google Apps Script Web App URL here (see README.md)
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzz5ah7rzGTy4TUc-kGNi4GOK6tawlcr1RsCohMTUlmZvD6VmG7iGqp0YTSeRBqgGK5_Q/exec";

const PHOTOS = [
  "/photos/cherry-1.jpg",
  "/photos/cherry-2.jpg",
  "/photos/cherry-3.jpg",
  "/photos/cherry-4.jpg",
  "/photos/cherry-5.jpg",
];

const FONT_IMPORT_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,500;0,600;1,500&family=Work+Sans:wght@400;500;600&display=swap');
`;

function CherryMark({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M28 6 C 30 16, 34 20, 30 30" stroke="#5C7A4B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M28 6 C 26 16, 20 20, 22 30" stroke="#5C7A4B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="22" cy="42" r="13" fill="#B0203D" />
      <circle cx="42" cy="46" r="13" fill="#8C1830" />
      <ellipse cx="18" cy="37" rx="3" ry="1.8" fill="#E98CA0" opacity="0.7" />
    </svg>
  );
}

function Carousel({ photos }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(null);

  useEffect(() => {
    if (paused || photos.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % photos.length);
    }, 4200);
    return () => clearInterval(id);
  }, [paused, photos.length]);

  function goTo(i) {
    setIndex(((i % photos.length) + photos.length) % photos.length);
  }

  function onTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }

  function onTouchEnd(e) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > 40) goTo(index - 1);
    else if (delta < -40) goTo(index + 1);
    touchStartX.current = null;
  }

  return (
    <div
      className="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="carousel-track" style={{ transform: `translateX(-${index * 100}%)` }}>
        {photos.map((src, i) => (
          <div className="carousel-slide" key={src}>
            <img src={src} alt={`${EVENT.name} — photo ${i + 1}`} draggable="false" />
          </div>
        ))}
      </div>

      <button
        type="button"
        className="carousel-arrow carousel-arrow-left"
        onClick={() => goTo(index - 1)}
        aria-label="Previous photo"
      >
        ‹
      </button>
      <button
        type="button"
        className="carousel-arrow carousel-arrow-right"
        onClick={() => goTo(index + 1)}
        aria-label="Next photo"
      >
        ›
      </button>

      <div className="carousel-dots" role="tablist" aria-label="Photo selector">
        {photos.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === index}
            aria-label={`Go to photo ${i + 1}`}
            className={`carousel-dot ${i === index ? "carousel-dot-active" : ""}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
}

function TicketStub({ guestName, guestCount, code }) {
  return (
    <div className="ticket">
      <div className="ticket-main">
        <p className="ticket-eyebrow">Boarding confirmed</p>
        <h3 className="ticket-name">{guestName}</h3>
        <div className="ticket-row">
          <div>
            <span className="ticket-label">Party size</span>
            <span className="ticket-value">{guestCount}</span>
          </div>
          <div>
            <span className="ticket-label">Date</span>
            <span className="ticket-value">{EVENT.date}</span>
          </div>
          <div>
            <span className="ticket-label">Time</span>
            <span className="ticket-value">{EVENT.time}</span>
          </div>
        </div>
      </div>
      <div className="ticket-stub">
        <CherryMark size={28} />
        <span className="ticket-code">{code}</span>
      </div>
    </div>
  );
}

export default function Home() {
  const [form, setForm] = useState({ name: "", guests: "1", contact: "", message: "" });
  const [submitted, setSubmitted] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.contact.trim()) {
      setError("Please fill in your name and contact number.");
      return;
    }
    setError("");
    const code = "CD-" + Math.random().toString(36).slice(2, 7).toUpperCase();

    setSaving(true);
    try {
      if (GOOGLE_SCRIPT_URL && !GOOGLE_SCRIPT_URL.startsWith("PASTE_")) {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors", // Apps Script web apps don't return CORS headers; this still delivers the request
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, code, timestamp: new Date().toISOString() }),
        });
      }
    } catch (err) {
      // Even if the network call fails we still confirm locally so the guest
      // isn't blocked — but you won't have their row in the sheet, so check
      // GOOGLE_SCRIPT_URL if entries stop appearing.
      console.error("Could not save to Google Sheet:", err);
    } finally {
      setSaving(false);
    }

    setSubmitted({ ...form, code });
  }

  function resetForm() {
    setSubmitted(null);
    setForm({ name: "", guests: "1", contact: "", message: "" });
  }

  return (
    <div className="page">
      <style>{`
        ${FONT_IMPORT_CSS}

        :root {
          --cream: #FBF3ED;
          --wine: #3A0D18;
          --cherry: #B0203D;
          --cherry-deep: #8C1830;
          --blush: #F3B6C4;
          --gold: #C79A4B;
          --ink-soft: #6B5A57;
        }

        * { box-sizing: border-box; }

        body { margin: 0; }

        .page {
          font-family: 'Work Sans', sans-serif;
          background: var(--cream);
          color: var(--wine);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .hero {
          width: 100%;
          background: radial-gradient(120% 140% at 50% -10%, #4B1522 0%, var(--wine) 55%, #2A0910 100%);
          color: var(--cream);
          padding: 72px 24px 88px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .hero-eyebrow {
          font-size: 14px;
          letter-spacing: 0.02em;
          color: var(--blush);
          margin: 18px 0 6px;
        }

        .hero-name {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: clamp(40px, 8vw, 68px);
          line-height: 1.05;
          margin: 0;
        }

        .hero-sub {
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-weight: 500;
          font-size: clamp(18px, 3vw, 24px);
          color: var(--blush);
          margin: 10px 0 28px;
        }

        .hero-date-pill {
          border: 1px solid rgba(243, 182, 196, 0.5);
          border-radius: 999px;
          padding: 10px 24px;
          font-size: 15px;
          letter-spacing: 0.01em;
        }

        .content {
          width: 100%;
          max-width: 620px;
          padding: 0 24px;
          margin-top: -48px;
        }

        .card {
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 24px 60px -30px rgba(58, 13, 24, 0.35);
          padding: 36px 32px;
          margin-bottom: 28px;
        }

        .gallery-card {
          padding: 14px;
        }

        .gallery-heading {
          font-family: 'Fraunces', serif;
          font-size: 20px;
          font-weight: 600;
          margin: 10px 6px 14px;
        }

        .carousel {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 5;
          max-height: 560px;
          border-radius: 14px;
          overflow: hidden;
          background: var(--wine);
        }

        .carousel-track {
          display: flex;
          height: 100%;
          transition: transform 0.5s cubic-bezier(0.65, 0, 0.35, 1);
        }

        .carousel-slide {
          flex: 0 0 100%;
          height: 100%;
        }

        .carousel-slide img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .carousel-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: none;
          background: rgba(58, 13, 24, 0.55);
          color: #fff;
          font-size: 22px;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(2px);
        }

        .carousel-arrow:hover { background: rgba(58, 13, 24, 0.8); }
        .carousel-arrow:focus-visible { outline: 2px solid var(--gold); outline-offset: 2px; }
        .carousel-arrow-left { left: 12px; }
        .carousel-arrow-right { right: 12px; }

        .carousel-dots {
          position: absolute;
          bottom: 14px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          gap: 8px;
        }

        .carousel-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: none;
          background: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          padding: 0;
        }

        .carousel-dot-active {
          background: var(--blush);
          width: 20px;
          border-radius: 4px;
        }

        .section-title {
          font-family: 'Fraunces', serif;
          font-size: 22px;
          font-weight: 600;
          margin: 0 0 6px;
        }

        .section-desc {
          color: var(--ink-soft);
          font-size: 14.5px;
          margin: 0 0 22px;
          line-height: 1.5;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px 16px;
        }

        .detail-item { border-left: 2px solid var(--blush); padding-left: 14px; }

        .detail-label {
          display: block;
          font-size: 12.5px;
          color: var(--ink-soft);
          margin-bottom: 3px;
        }

        .detail-value {
          font-size: 15.5px;
          font-weight: 500;
          color: var(--wine);
        }

        .rsvp-note {
          margin-top: 22px;
          padding-top: 18px;
          border-top: 1px solid #F0E4DE;
          font-size: 13.5px;
          color: var(--ink-soft);
        }

        .map-wrap {
          position: relative;
          margin-top: 20px;
          border-radius: 12px;
          overflow: hidden;
          border: 1.4px solid #F0E4DE;
        }

        .map-cta {
          position: absolute;
          top: 12px;
          left: 12px;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: var(--cherry);
          color: #fff;
          font-size: 13px;
          font-weight: 600;
          padding: 9px 14px;
          border-radius: 999px;
          text-decoration: none;
          box-shadow: 0 6px 16px -6px rgba(58, 13, 24, 0.5);
        }

        .map-cta:hover { background: var(--cherry-deep); }
        .map-cta-icon { font-size: 14px; }

        .map-frame {
          width: 100%;
          height: 220px;
          border: none;
          display: block;
        }

        .map-link {
          display: inline-block;
          margin-top: 10px;
          font-size: 13.5px;
          font-weight: 600;
          color: var(--cherry);
          text-decoration: none;
        }

        .map-link:hover { text-decoration: underline; }

        .field {
          margin-bottom: 18px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .field label {
          font-size: 13.5px;
          font-weight: 500;
          color: var(--wine);
        }

        .field input,
        .field select,
        .field textarea {
          font-family: 'Work Sans', sans-serif;
          font-size: 15px;
          padding: 11px 13px;
          border-radius: 10px;
          border: 1.4px solid #E7D9D2;
          background: #FEFBF9;
          color: var(--wine);
          outline: none;
        }

        .field input:focus,
        .field select:focus,
        .field textarea:focus {
          border-color: var(--cherry);
          box-shadow: 0 0 0 3px rgba(176, 32, 61, 0.12);
        }

        .field textarea { resize: vertical; min-height: 70px; }

        .error-text {
          color: var(--cherry);
          font-size: 13.5px;
          margin: -6px 0 14px;
        }

        .submit-btn {
          width: 100%;
          background: var(--cherry);
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 13px 18px;
          font-size: 15.5px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .submit-btn:hover { background: var(--cherry-deep); }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .submit-btn:focus-visible { outline: 3px solid var(--gold); outline-offset: 2px; }

        .confirm-wrap { text-align: center; }

        .confirm-check {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: var(--blush);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          font-size: 24px;
          color: var(--wine);
        }

        .ticket {
          display: flex;
          border-radius: 14px;
          overflow: hidden;
          border: 1.4px dashed var(--gold);
          margin-top: 22px;
          text-align: left;
        }

        .ticket-main {
          flex: 1;
          background: #FEFBF9;
          padding: 22px 22px;
        }

        .ticket-eyebrow {
          font-size: 12px;
          color: var(--ink-soft);
          margin: 0 0 4px;
        }

        .ticket-name {
          font-family: 'Fraunces', serif;
          font-size: 20px;
          margin: 0 0 14px;
        }

        .ticket-row { display: flex; gap: 22px; }
        .ticket-row > div { display: flex; flex-direction: column; }

        .ticket-label { font-size: 11.5px; color: var(--ink-soft); }
        .ticket-value { font-size: 14px; font-weight: 600; }

        .ticket-stub {
          width: 96px;
          background: var(--wine);
          color: var(--cream);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
        }

        .ticket-code { font-size: 11px; letter-spacing: 0.03em; }

        .again-btn {
          margin-top: 20px;
          background: none;
          border: 1.4px solid var(--wine);
          color: var(--wine);
          border-radius: 10px;
          padding: 10px 18px;
          font-size: 14px;
          cursor: pointer;
        }

        .footer {
          padding: 32px 24px 48px;
          text-align: center;
          color: var(--ink-soft);
          font-size: 13px;
        }

        @media (max-width: 480px) {
          .detail-grid { grid-template-columns: 1fr; }
          .card { padding: 28px 20px; }
          .carousel { aspect-ratio: 3 / 4; }
        }
      `}</style>

      <header className="hero">
        <CherryMark size={44} />
        <p className="hero-eyebrow">You're invited to celebrate</p>
        <h1 className="hero-name">{EVENT.name}</h1>
        <p className="hero-sub">{EVENT.headline}</p>
        <div className="hero-date-pill">{EVENT.date}</div>
      </header>

      <main className="content">
        <section className="card gallery-card" aria-label="Photo gallery">
          <h2 className="gallery-heading">Moments with Cherry</h2>
          <Carousel photos={PHOTOS} />
        </section>

        <section className="card" aria-labelledby="details-heading">
          <h2 id="details-heading" className="section-title">Event details</h2>
          <p className="section-desc">Everything you need to know for the day.</p>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Date</span>
              <span className="detail-value">{EVENT.date}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Time</span>
              <span className="detail-value">{EVENT.time}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Venue</span>
              <span className="detail-value">{EVENT.venue}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Dress code</span>
              <span className="detail-value">{EVENT.dressCode}</span>
            </div>
          </div>
          <div className="rsvp-note">
            {EVENT.address} — kindly RSVP on or before <strong>{EVENT.rsvpBy}</strong>.
          </div>

          <div className="map-wrap">
            
              className="map-cta"
              href={EVENT.mapDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="map-cta-icon">⤢</span> View bigger map
            </a>
            <iframe
              className="map-frame"
              src={EVENT.mapEmbedUrl}
              title="Event location map"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <a className="map-link" href={EVENT.mapDirectionsUrl} target="_blank" rel="noopener noreferrer">
            Directions in the Maps app ↗
          </a>
        </section>

        <section className="card" aria-labelledby="rsvp-heading">
          {!submitted ? (
            <>
              <h2 id="rsvp-heading" className="section-title">Confirm your attendance</h2>
              <p className="section-desc">Fill this out and we'll save your spot.</p>
              <form onSubmit={handleSubmit} noValidate>
                <div className="field">
                  <label htmlFor="name">Full name</label>
                  <input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Juan Dela Cruz" />
                </div>
                <div className="field">
                  <label htmlFor="guests">Number attending (including you)</label>
                  <select id="guests" name="guests" value={form.guests} onChange={handleChange}>
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="contact">Contact number</label>
                  <input id="contact" name="contact" value={form.contact} onChange={handleChange} placeholder="09XX XXX XXXX" />
                </div>
                <div className="field">
                  <label htmlFor="message">Message for Cherry (optional)</label>
                  <textarea id="message" name="message" value={form.message} onChange={handleChange} placeholder="Excited to celebrate with you!" />
                </div>
                {error && <p className="error-text">{error}</p>}
                <button type="submit" className="submit-btn" disabled={saving}>
                  {saving ? "Saving…" : "Confirm attendance"}
                </button>
              </form>
            </>
          ) : (
            <div className="confirm-wrap">
              <div className="confirm-check">✓</div>
              <h2 className="section-title">You're on the list, {submitted.name.split(" ")[0]}!</h2>
              <p className="section-desc">Keep this pass — show it at the door on the day.</p>
              <TicketStub guestName={submitted.name} guestCount={submitted.guests} code={submitted.code} />
              <button className="again-btn" onClick={resetForm}>Submit another RSVP</button>
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        Can't wait to celebrate with you, {EVENT.name.split(" ")[0]}! 🍒
      </footer>
    </div>
  );
}
