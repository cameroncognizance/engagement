import { useState, useEffect, useRef } from "react";

const COUPLE_NAMES = { person1: "Cameron", person2: "Jade" };
const EVENT_DETAILS = {
  date: "Saturday, 15th March 2026",
  time: "From 4:00 PM",
  venue: "The Lighthouse Terrace",
  address: "12 Ocean Drive, Camps Bay",
  dressCode: "Smart Casual — Coastal Chic",
  rsvpBy: "1st March 2026",
};

// Ocean SVG line drawings
const WaveLines = ({ className = "", style = {} }) => (
  <svg viewBox="0 0 600 80" fill="none" className={className} style={{ width: "100%", ...style }}>
    <path d="M-10 40 C50 10, 100 70, 160 40 S270 10, 330 40 S440 70, 500 40 S570 10, 620 40" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
    <path d="M-10 55 C50 25, 100 85, 160 55 S270 25, 330 55 S440 85, 500 55 S570 25, 620 55" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
    <path d="M-10 25 C50 -5, 100 55, 160 25 S270 -5, 330 25 S440 55, 500 25 S570 -5, 620 25" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.2" />
  </svg>
);

const SeashellDrawing = ({ size = 60, style = {} }) => (
  <svg viewBox="0 0 80 80" fill="none" width={size} height={size} style={style}>
    <path d="M40 8 C20 8, 8 28, 8 45 C8 62, 20 72, 40 72 C60 72, 72 62, 72 45 C72 28, 60 8, 40 8Z" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />
    <path d="M40 8 C38 25, 20 40, 8 45" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
    <path d="M40 8 C42 28, 35 45, 15 58" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
    <path d="M40 8 C44 30, 42 50, 28 65" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
    <path d="M40 8 C46 30, 50 50, 40 68" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
    <path d="M40 8 C48 28, 55 48, 52 62" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
    <path d="M40 8 C50 25, 60 42, 62 55" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
    <path d="M40 8 C52 22, 65 35, 70 48" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
  </svg>
);

const StarfishDrawing = ({ size = 50, style = {} }) => (
  <svg viewBox="0 0 80 80" fill="none" width={size} height={size} style={style}>
    <path d="M40 6 L45 28 L68 18 L52 36 L74 42 L52 48 L68 66 L45 54 L40 76 L35 54 L12 66 L28 48 L6 42 L28 36 L12 18 L35 28 Z" stroke="currentColor" strokeWidth="1" opacity="0.35" strokeLinejoin="round" />
    <circle cx="40" cy="42" r="5" stroke="currentColor" strokeWidth="0.8" opacity="0.25" />
  </svg>
);

const CoralDrawing = ({ size = 70, style = {} }) => (
  <svg viewBox="0 0 90 100" fill="none" width={size} height={(size / 90) * 100} style={style}>
    <path d="M45 95 L45 60 C45 50, 35 40, 25 30 C20 24, 18 15, 22 8" stroke="currentColor" strokeWidth="1.1" opacity="0.35" strokeLinecap="round" />
    <path d="M45 70 C50 58, 60 48, 65 35 C68 26, 66 18, 60 12" stroke="currentColor" strokeWidth="1.1" opacity="0.35" strokeLinecap="round" />
    <path d="M45 75 C40 65, 38 55, 42 42" stroke="currentColor" strokeWidth="0.9" opacity="0.25" strokeLinecap="round" />
    <path d="M25 30 C30 25, 35 22, 32 14" stroke="currentColor" strokeWidth="0.8" opacity="0.25" strokeLinecap="round" />
    <path d="M65 35 C70 30, 73 24, 75 16" stroke="currentColor" strokeWidth="0.8" opacity="0.25" strokeLinecap="round" />
  </svg>
);

const WaveDivider = ({ style = {} }) => (
  <svg viewBox="0 0 300 20" fill="none" style={{ width: "60%", margin: "0 auto", display: "block", ...style }}>
    <path d="M0 10 Q25 0, 50 10 T100 10 T150 10 T200 10 T250 10 T300 10" stroke="currentColor" strokeWidth="0.8" opacity="0.35" />
  </svg>
);

export default function EngagementInvite() {
  const [phase, setPhase] = useState("sealed"); // sealed, opening, sliding, revealed
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [rsvpData, setRsvpData] = useState({ name: "", guests: "1", attending: null, message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [allRsvps, setAllRsvps] = useState([]);
  const letterRef = useRef(null);

  useEffect(() => {
    // Load existing RSVPs
    const loadRsvps = async () => {
      try {
        const result = await window.storage.get("engagement-rsvps");
        if (result) setAllRsvps(JSON.parse(result.value));
      } catch (e) {}
    };
    loadRsvps();
  }, []);

  const handleOpen = () => {
    if (phase !== "sealed") return;
    setPhase("opening");
    setTimeout(() => setPhase("sliding"), 700);
    setTimeout(() => setPhase("revealed"), 1600);
  };

  const handleRsvpSubmit = async () => {
    if (!rsvpData.name || rsvpData.attending === null) return;
    const entry = { ...rsvpData, timestamp: new Date().toISOString(), id: Date.now().toString() };
    const updated = [...allRsvps, entry];
    setAllRsvps(updated);
    try {
      await window.storage.set("engagement-rsvps", JSON.stringify(updated));
    } catch (e) {}
    setSubmitted(true);
  };

  const attending = allRsvps.filter((r) => r.attending === true);
  const declined = allRsvps.filter((r) => r.attending === false);
  const totalGuests = attending.reduce((sum, r) => sum + parseInt(r.guests || 1), 0);

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        @keyframes floatIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        @keyframes gentleBob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes waveFlow {
          0% { transform: translateX(0); }
          100% { transform: translateX(-160px); }
        }
        @keyframes sealPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(168, 131, 95, 0.3); }
          50% { box-shadow: 0 0 20px 6px rgba(168, 131, 95, 0.15); }
        }
        @keyframes letterRevealContent {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .envelope-wrapper {
          perspective: 1200px;
          cursor: pointer;
          animation: gentleBob 3s ease-in-out infinite;
        }
        .envelope-wrapper.opened {
          animation: none;
        }
        
        .envelope-body {
          position: relative;
          width: min(340px, 85vw);
          height: min(220px, 55vw);
          background: linear-gradient(165deg, #f5efe6 0%, #ebe4d6 50%, #e2d9c8 100%);
          border-radius: 4px;
          box-shadow: 0 8px 40px rgba(60, 40, 20, 0.18), 0 2px 8px rgba(60, 40, 20, 0.1);
          overflow: visible;
          z-index: 2;
        }
        
        .envelope-texture {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            90deg,
            transparent,
            transparent 2px,
            rgba(180, 160, 130, 0.04) 2px,
            rgba(180, 160, 130, 0.04) 4px
          );
          border-radius: 4px;
          pointer-events: none;
        }
        
        .envelope-inner-shadow {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 50%;
          background: linear-gradient(to top, rgba(180, 155, 120, 0.12), transparent);
          border-radius: 0 0 4px 4px;
          pointer-events: none;
        }
        
        .envelope-flap {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 55%;
          background: linear-gradient(175deg, #f0e9dc 0%, #e8dfce 100%);
          clip-path: polygon(0 0, 50% 100%, 100% 0);
          transform-origin: top center;
          transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 5;
          box-shadow: 0 2px 6px rgba(0,0,0,0.06);
        }
        .envelope-flap::after {
          content: '';
          position: absolute;
          inset: 0;
          clip-path: polygon(0 0, 50% 100%, 100% 0);
          border-bottom: 1px solid rgba(180, 155, 120, 0.25);
        }
        .flap-open {
          transform: rotateX(180deg);
          z-index: 1;
        }
        
        .wax-seal {
          position: absolute;
          top: 46%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 48px;
          height: 48px;
          background: radial-gradient(circle at 35% 35%, #c9956a, #a8835f 50%, #8b6b4a 100%);
          border-radius: 50%;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 3px 12px rgba(120, 80, 40, 0.35), inset 0 1px 2px rgba(255,255,255,0.2);
          animation: sealPulse 2.5s ease-in-out infinite;
          transition: opacity 0.3s;
        }
        .seal-hidden { opacity: 0; pointer-events: none; animation: none; }
        .wax-seal span {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 600;
          font-size: 16px;
          color: #f5efe6;
          letter-spacing: 1px;
        }
        
        .tap-hint {
          position: absolute;
          bottom: -44px;
          left: 50%;
          transform: translateX(-50%);
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          font-size: 12px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: rgba(168, 146, 116, 0.7);
          white-space: nowrap;
          animation: shimmer 2.5s ease-in-out infinite;
        }
        
        .letter-container {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          bottom: 8px;
          width: calc(100% - 24px);
          z-index: 3;
          transition: all 0.9s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .letter-sliding {
          transform: translateX(-50%) translateY(-80%);
        }
        .letter-revealed {
          position: fixed;
          inset: 0;
          width: 100%;
          max-width: 100%;
          height: 100%;
          transform: none;
          left: 0;
          bottom: 0;
          z-index: 100;
          transition: all 0.9s cubic-bezier(0.22, 1, 0.36, 1);
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }
        
        .letter-paper {
          background: linear-gradient(180deg, #fdfbf7 0%, #faf7f0 100%);
          border-radius: 3px;
          min-height: 140px;
          padding: 20px 16px;
          position: relative;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
        }
        .letter-revealed .letter-paper {
          border-radius: 0;
          min-height: 100vh;
          padding: 0;
          box-shadow: none;
        }
        
        .letter-content {
          opacity: 0;
          transition: opacity 0.6s ease 0.3s;
          padding: 48px 28px 60px;
          max-width: 480px;
          margin: 0 auto;
        }
        .content-visible {
          opacity: 1;
        }
        
        .letter-border {
          position: absolute;
          inset: 10px;
          border: 1px solid rgba(168, 146, 116, 0.15);
          pointer-events: none;
          border-radius: 2px;
        }
        .letter-revealed .letter-border {
          inset: 16px;
        }
        
        .corner-ornament {
          position: absolute;
          width: 30px;
          height: 30px;
          opacity: 0.25;
        }
        .corner-tl { top: 16px; left: 16px; }
        .corner-tr { top: 16px; right: 16px; transform: scaleX(-1); }
        .corner-bl { bottom: 16px; left: 16px; transform: scaleY(-1); }
        .corner-br { bottom: 16px; right: 16px; transform: scale(-1); }
        
        .invite-header {
          text-align: center;
          margin-bottom: 32px;
        }
        .invite-pretext {
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          font-size: 11px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #a89274;
          margin-bottom: 20px;
        }
        .invite-names {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: clamp(32px, 8vw, 46px);
          color: #3d3428;
          line-height: 1.15;
          margin-bottom: 6px;
        }
        .invite-ampersand {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-style: italic;
          font-size: clamp(22px, 5vw, 30px);
          color: #a89274;
          display: block;
          margin: 4px 0;
        }
        .invite-subtitle {
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          font-size: 12px;
          letter-spacing: 5px;
          text-transform: uppercase;
          color: #a89274;
          margin-top: 18px;
        }
        
        .invite-details {
          text-align: center;
          margin: 28px 0;
          color: #5a4d3c;
        }
        .detail-row {
          margin: 14px 0;
        }
        .detail-label {
          font-family: 'Jost', sans-serif;
          font-weight: 400;
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #a89274;
          margin-bottom: 4px;
        }
        .detail-value {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 400;
          font-size: 18px;
          color: #3d3428;
          line-height: 1.4;
        }
        .detail-value-small {
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          font-size: 13px;
          color: #7a6d5c;
          margin-top: 2px;
        }
        
        .invite-message {
          text-align: center;
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 16px;
          color: #7a6d5c;
          line-height: 1.7;
          margin: 28px 0;
          padding: 0 8px;
        }
        
        .rsvp-section {
          margin-top: 36px;
          text-align: center;
        }
        .rsvp-btn {
          font-family: 'Jost', sans-serif;
          font-weight: 400;
          font-size: 12px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #fdfbf7;
          background: linear-gradient(135deg, #8b7a5e 0%, #a89274 100%);
          border: none;
          padding: 14px 40px;
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 12px rgba(139, 122, 94, 0.25);
        }
        .rsvp-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 20px rgba(139, 122, 94, 0.35);
        }
        .rsvp-btn:active {
          transform: translateY(0);
        }
        
        .rsvp-form {
          margin-top: 24px;
          text-align: left;
          animation: floatIn 0.5s ease;
        }
        .form-group {
          margin-bottom: 18px;
        }
        .form-label {
          font-family: 'Jost', sans-serif;
          font-weight: 400;
          font-size: 10px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: #a89274;
          margin-bottom: 6px;
          display: block;
        }
        .form-input {
          width: 100%;
          font-family: 'Cormorant Garamond', serif;
          font-size: 16px;
          color: #3d3428;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(168, 146, 116, 0.3);
          padding: 8px 0;
          outline: none;
          transition: border-color 0.3s;
        }
        .form-input:focus {
          border-bottom-color: #a89274;
        }
        .form-input::placeholder {
          color: rgba(122, 109, 92, 0.4);
        }
        .form-textarea {
          width: 100%;
          font-family: 'Cormorant Garamond', serif;
          font-size: 16px;
          color: #3d3428;
          background: rgba(168, 146, 116, 0.04);
          border: 1px solid rgba(168, 146, 116, 0.2);
          border-radius: 2px;
          padding: 10px 12px;
          outline: none;
          resize: vertical;
          min-height: 70px;
          transition: border-color 0.3s;
        }
        .form-textarea:focus {
          border-color: #a89274;
        }
        
        .attendance-btns {
          display: flex;
          gap: 12px;
        }
        .att-btn {
          flex: 1;
          font-family: 'Jost', sans-serif;
          font-weight: 400;
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 12px 16px;
          border: 1px solid rgba(168, 146, 116, 0.3);
          background: transparent;
          color: #7a6d5c;
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.3s;
        }
        .att-btn.selected-yes {
          background: linear-gradient(135deg, #8b7a5e, #a89274);
          color: #fdfbf7;
          border-color: transparent;
        }
        .att-btn.selected-no {
          background: rgba(168, 146, 116, 0.1);
          color: #8b7a5e;
          border-color: #a89274;
        }
        
        .guest-select {
          font-family: 'Cormorant Garamond', serif;
          font-size: 16px;
          color: #3d3428;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(168, 146, 116, 0.3);
          padding: 8px 0;
          outline: none;
          width: 100%;
          cursor: pointer;
        }
        
        .submit-btn {
          font-family: 'Jost', sans-serif;
          font-weight: 400;
          font-size: 12px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #fdfbf7;
          background: linear-gradient(135deg, #8b7a5e 0%, #a89274 100%);
          border: none;
          padding: 14px 40px;
          border-radius: 2px;
          cursor: pointer;
          width: 100%;
          margin-top: 8px;
          transition: all 0.3s;
          box-shadow: 0 2px 12px rgba(139, 122, 94, 0.25);
        }
        .submit-btn:hover {
          box-shadow: 0 4px 20px rgba(139, 122, 94, 0.35);
        }
        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .thank-you {
          text-align: center;
          animation: floatIn 0.6s ease;
          padding: 20px 0;
        }
        .thank-you h3 {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 400;
          font-size: 26px;
          color: #3d3428;
          margin-bottom: 10px;
        }
        .thank-you p {
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          font-size: 14px;
          color: #7a6d5c;
          line-height: 1.6;
        }
        
        .rsvp-by-note {
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          font-size: 11px;
          letter-spacing: 1.5px;
          color: rgba(168, 146, 116, 0.6);
          text-align: center;
          margin-top: 16px;
        }

        .ocean-scene-top {
          position: relative;
          overflow: hidden;
          height: 30px;
          margin-bottom: 8px;
          color: #a89274;
        }
        .ocean-scene-bottom {
          position: relative;
          overflow: hidden;
          height: 30px;
          margin-top: 8px;
          color: #a89274;
        }
        
        .floating-elements {
          color: #a89274;
        }
        
        .page-bg-waves {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 120px;
          color: rgba(168, 146, 116, 0.08);
          pointer-events: none;
          z-index: 0;
        }

        .ocean-illustration {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
          margin: 8px 0;
          color: #a89274;
        }
        
        .stagger-1 { animation: floatIn 0.6s ease both; animation-delay: 0.1s; }
        .stagger-2 { animation: floatIn 0.6s ease both; animation-delay: 0.25s; }
        .stagger-3 { animation: floatIn 0.6s ease both; animation-delay: 0.4s; }
        .stagger-4 { animation: floatIn 0.6s ease both; animation-delay: 0.55s; }
        .stagger-5 { animation: floatIn 0.6s ease both; animation-delay: 0.7s; }
        .stagger-6 { animation: floatIn 0.6s ease both; animation-delay: 0.85s; }
        .stagger-7 { animation: floatIn 0.6s ease both; animation-delay: 1.0s; }
      `}</style>

      {/* Background waves */}
      <div className="page-bg-waves">
        <WaveLines style={{ position: "absolute", bottom: 40 }} />
        <WaveLines style={{ position: "absolute", bottom: 10 }} />
      </div>

      {/* Envelope Phase */}
      {phase !== "revealed" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "20px",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div
            className={`envelope-wrapper ${phase !== "sealed" ? "opened" : ""}`}
            onClick={handleOpen}
          >
            <div className="envelope-body">
              <div className="envelope-texture" />
              <div className="envelope-inner-shadow" />

              {/* Letter inside envelope */}
              <div
                className={`letter-container ${phase === "sliding" ? "letter-sliding" : ""}`}
              >
                <div className="letter-paper" style={{ height: "90%" }}>
                  <div style={{ textAlign: "center", padding: "14px 10px" }}>
                    <span
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "14px",
                        color: "#3d3428",
                        fontWeight: 300,
                      }}
                    >
                      You're Invited
                    </span>
                  </div>
                </div>
              </div>

              {/* Flap */}
              <div className={`envelope-flap ${phase !== "sealed" ? "flap-open" : ""}`} />

              {/* Wax seal */}
              <div className={`wax-seal ${phase !== "sealed" ? "seal-hidden" : ""}`}>
                <span>C&J</span>
              </div>

              {phase === "sealed" && <div className="tap-hint">Tap to open</div>}
            </div>
          </div>
        </div>
      )}

      {/* Full Letter Phase */}
      {phase === "revealed" && (
        <div className="letter-revealed">
          <div
            className="letter-paper"
            ref={letterRef}
            style={{ overflowY: "auto", minHeight: "100vh" }}
          >
            <div className="letter-border" />

            {/* Corner ornaments */}
            {["tl", "tr", "bl", "br"].map((pos) => (
              <svg
                key={pos}
                className={`corner-ornament corner-${pos}`}
                viewBox="0 0 30 30"
                fill="none"
              >
                <path d="M0 30 C0 15, 2 8, 8 2 C14 -2, 20 0, 30 0" stroke="currentColor" strokeWidth="1" color="#a89274" />
                <path d="M0 22 C2 12, 6 6, 14 2" stroke="currentColor" strokeWidth="0.7" color="#a89274" opacity="0.5" />
              </svg>
            ))}

            <div className={`letter-content content-visible`}>
              {/* Top wave decoration */}
              <div className="ocean-scene-top stagger-1">
                <WaveLines />
              </div>

              {/* Header */}
              <div className="invite-header stagger-2">
                <p className="invite-pretext">Together with their families</p>
                <h1 className="invite-names">
                  {COUPLE_NAMES.person1}
                  <span className="invite-ampersand">&</span>
                  {COUPLE_NAMES.person2}
                </h1>
                <p className="invite-subtitle">Engagement Celebration</p>
              </div>

              {/* Ocean illustrations */}
              <div className="ocean-illustration stagger-3">
                <CoralDrawing size={40} />
                <SeashellDrawing size={36} />
                <StarfishDrawing size={30} />
                <SeashellDrawing size={36} style={{ transform: "scaleX(-1)" }} />
                <CoralDrawing size={40} style={{ transform: "scaleX(-1)" }} />
              </div>

              <div className="stagger-3" style={{ color: "#a89274" }}>
                <WaveDivider style={{ margin: "20px auto" }} />
              </div>

              {/* Invitation text */}
              <p className="invite-message stagger-4">
                Request the pleasure of your company<br />
                as they celebrate their engagement
              </p>

              {/* Details */}
              <div className="invite-details stagger-5">
                <div className="detail-row">
                  <p className="detail-label">Date</p>
                  <p className="detail-value">{EVENT_DETAILS.date}</p>
                </div>
                <div className="detail-row">
                  <p className="detail-label">Time</p>
                  <p className="detail-value">{EVENT_DETAILS.time}</p>
                </div>
                <div className="detail-row">
                  <p className="detail-label">Venue</p>
                  <p className="detail-value">{EVENT_DETAILS.venue}</p>
                  <p className="detail-value-small">{EVENT_DETAILS.address}</p>
                </div>
                <div className="detail-row">
                  <p className="detail-label">Attire</p>
                  <p className="detail-value">{EVENT_DETAILS.dressCode}</p>
                </div>
              </div>

              <div className="stagger-5" style={{ color: "#a89274" }}>
                <WaveDivider style={{ margin: "24px auto" }} />
              </div>

              {/* RSVP */}
              <div className="rsvp-section stagger-6">
                {!submitted && !rsvpOpen && (
                  <>
                    <button className="rsvp-btn" onClick={() => setRsvpOpen(true)}>
                      Kindly Respond
                    </button>
                    <p className="rsvp-by-note">RSVP by {EVENT_DETAILS.rsvpBy}</p>
                  </>
                )}

                {!submitted && rsvpOpen && (
                  <div className="rsvp-form">
                    <div className="form-group">
                      <label className="form-label">Your Name</label>
                      <input
                        className="form-input"
                        type="text"
                        placeholder="Full name"
                        value={rsvpData.name}
                        onChange={(e) => setRsvpData({ ...rsvpData, name: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Will you attend?</label>
                      <div className="attendance-btns">
                        <button
                          className={`att-btn ${rsvpData.attending === true ? "selected-yes" : ""}`}
                          onClick={() => setRsvpData({ ...rsvpData, attending: true })}
                        >
                          Joyfully Accept
                        </button>
                        <button
                          className={`att-btn ${rsvpData.attending === false ? "selected-no" : ""}`}
                          onClick={() => setRsvpData({ ...rsvpData, attending: false })}
                        >
                          Regretfully Decline
                        </button>
                      </div>
                    </div>

                    {rsvpData.attending === true && (
                      <div className="form-group" style={{ animation: "floatIn 0.3s ease" }}>
                        <label className="form-label">Number of Guests</label>
                        <select
                          className="guest-select"
                          value={rsvpData.guests}
                          onChange={(e) => setRsvpData({ ...rsvpData, guests: e.target.value })}
                        >
                          {[1, 2, 3, 4].map((n) => (
                            <option key={n} value={n}>
                              {n} {n === 1 ? "Guest" : "Guests"}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="form-group">
                      <label className="form-label">Message for the couple (optional)</label>
                      <textarea
                        className="form-textarea"
                        placeholder="Share your wishes..."
                        value={rsvpData.message}
                        onChange={(e) => setRsvpData({ ...rsvpData, message: e.target.value })}
                      />
                    </div>

                    <button
                      className="submit-btn"
                      onClick={handleRsvpSubmit}
                      disabled={!rsvpData.name || rsvpData.attending === null}
                    >
                      Send RSVP
                    </button>
                    <p className="rsvp-by-note">RSVP by {EVENT_DETAILS.rsvpBy}</p>
                  </div>
                )}

                {submitted && (
                  <div className="thank-you">
                    <SeashellDrawing size={50} style={{ margin: "0 auto 16px", display: "block", color: "#a89274" }} />
                    <h3>
                      {rsvpData.attending ? "We can't wait to celebrate with you!" : "You'll be missed!"}
                    </h3>
                    <p>
                      {rsvpData.attending
                        ? `Thank you, ${rsvpData.name}. See you on ${EVENT_DETAILS.date.split(",")[1].trim()}.`
                        : `Thank you for letting us know, ${rsvpData.name}. We'll be thinking of you.`}
                    </p>
                  </div>
                )}
              </div>

              {/* Bottom wave decoration */}
              <div className="ocean-scene-bottom stagger-7">
                <WaveLines />
              </div>

              {/* Bottom ocean illustrations */}
              <div className="ocean-illustration stagger-7" style={{ marginTop: 16, marginBottom: 20 }}>
                <StarfishDrawing size={24} />
                <SeashellDrawing size={28} />
                <StarfishDrawing size={24} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #f0ebe2 0%, #e8e1d5 40%, #dfd7c9 100%)",
    fontFamily: "'Jost', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
};
