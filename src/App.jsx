import React, { useState, useEffect, useRef } from "react";
import logoImg from "./assets/LogoPacte2.png";

/* ============================================================
   PACTE — Prototype d'interface de suivi de santé
   Direction : sobre, calme, institutionnelle mais humaine.
   Palette : vert profond #35462D · or sable #D9BB84 · ivoire #F9F9F7
   Vocabulaire : observer, signaler, préparer, ajuster, réévaluer.
   ============================================================ */

const CSS = `

.pacte-root{
  --ivory:#F9F9F7; --paper:#FFFFFF;
  --green:#35462D; --green-700:#2B3A22; --green-soft:#EBEEE8;
  --gold:#D9BB84; --gold-soft:#F3EAD6;
  --ink:#262626; --slate:#586663; --muted:#8E918A;
  --line:#E8E7E1; --line-strong:#D6D5CC;
  --serif:'Newsreader',Georgia,'Times New Roman',serif;
  --sans:'Hanken Grotesk',-apple-system,system-ui,sans-serif;
  height:100vh; height:100dvh; overflow:hidden;
  width:100%; display:flex; flex-direction:column;
  background:
    radial-gradient(120% 80% at 50% 0%, #F1EFE8 0%, #E7E4DB 60%, #E2DFD4 100%);
  font-family:var(--sans);
  -webkit-font-smoothing:antialiased;
  box-sizing:border-box;
}
.pacte-root *{ box-sizing:border-box; }

.app-container{
  flex:1; display:flex; flex-direction:column;
  width:100%; max-width:600px;
  margin:0 auto;
  background:var(--ivory);
  box-shadow:0 0 40px rgba(0,0,0,.06);
  position:relative;
  overflow:hidden;
}

/* ---------- scrollable body ---------- */
.body{
  flex:1 1 auto; overflow-y:auto; overflow-x:hidden;
  scrollbar-width:none;
}
.body::-webkit-scrollbar{ display:none; }

.screen{
  padding:0 22px 40px;
  animation:screenIn .42s cubic-bezier(.22,.61,.36,1) both;
}
@keyframes screenIn{
  from{ opacity:0; transform:translateY(10px); }
  to{ opacity:1; transform:translateY(0); }
}

/* ---------- app bar / wordmark ---------- */
.appbar{
  position:sticky; top:0; z-index:20;
  background:rgba(249,249,247,.92); backdrop-filter:blur(12px);
  display:flex; align-items:center; justify-content:space-between;
  margin:0 -22px 16px;
  padding:calc(16px + env(safe-area-inset-top, 0px)) 22px 12px;
}
.logo{
  height:36px; object-fit:contain;
  mix-blend-mode:multiply; border-radius:4px;
}
.appbar .ghost{ width:36px; height:36px; }

/* ---------- inputs ---------- */
.date-input, .text-input {
  width: 100%; font-family: var(--sans); font-size: 16px;
  color: var(--ink); background: var(--ivory);
  border: 1px solid var(--line-strong); border-radius: 12px;
  padding: 14px 16px; box-sizing: border-box;
  -webkit-appearance: none; appearance: none;
  transition: border-color .2s ease, box-shadow .2s ease;
}
.date-input:focus, .text-input:focus {
  outline: none; border-color: var(--green);
  box-shadow: 0 0 0 3px var(--green-soft);
}

/* ---------- headings ---------- */
.kicker{
  font-size:11.5px; font-weight:600; letter-spacing:1.6px;
  text-transform:uppercase; color:var(--muted);
}
.title{
  font-family:var(--serif); font-weight:500;
  font-size:30px; line-height:1.16; color:var(--ink);
  letter-spacing:.1px; margin:5px 0 0;
}
.subtitle{
  font-size:14px; color:var(--slate); line-height:1.5;
  margin-top:8px; max-width:30ch;
}

/* ---------- cards ---------- */
.card{
  background:var(--paper);
  border:1px solid var(--line);
  border-radius:18px;
  box-shadow:0 1px 2px rgba(38,38,38,.03);
}
.reveal{ opacity:0; animation:screenIn .55s cubic-bezier(.22,.61,.36,1) both; }

/* ---------- RDV card ---------- */
.rdv{ padding:17px 18px; }
.rdv-top{ display:flex; align-items:flex-start; justify-content:space-between; gap:12px; }
.rdv-label{
  font-size:11.5px; font-weight:600; letter-spacing:.8px;
  text-transform:uppercase; color:var(--muted);
  display:flex; align-items:center; gap:7px;
}
.rdv-date{
  font-family:var(--serif); font-size:22px; font-weight:500;
  color:var(--ink); margin-top:4px;
}
.pill{
  flex:0 0 auto;
  display:flex; align-items:baseline; gap:3px;
  background:var(--gold-soft);
  border:1px solid #E7D5AE;
  color:#7A5E22;
  font-weight:700; font-size:15px;
  padding:7px 12px; border-radius:11px;
}
.pill small{ font-size:10.5px; font-weight:600; letter-spacing:.4px; }
.rdv-div{ height:1px; background:var(--line); margin:14px 0 11px; }
.rdv-cycle{
  font-size:13px; color:var(--slate);
  display:flex; align-items:center; gap:8px;
}
.dot-green{ width:6px; height:6px; border-radius:50%; background:var(--green); flex:0 0 auto; }

/* ---------- progress ring ---------- */
.ring-wrap{
  display:flex; flex-direction:column; align-items:center;
  margin:22px 0 6px;
}
.ring-stage{
  position:relative; width:236px; height:236px;
  cursor:pointer;
}
.ring-stage.pulse{ animation:ringPulse .6s ease; }
@keyframes ringPulse{
  0%{ transform:scale(1); } 35%{ transform:scale(1.025); } 100%{ transform:scale(1); }
}
.ring-svg{ width:100%; height:100%; display:block; }
.ring-track{ fill:none; stroke:var(--line-strong); stroke-width:13; }
.ring-prog{
  fill:none; stroke:var(--green); stroke-width:13; stroke-linecap:round;
  transition:stroke-dashoffset 1.5s cubic-bezier(.25,.7,.25,1);
}
.ring-dotgroup{
  transition:transform 1.5s cubic-bezier(.25,.7,.25,1);
  transform-origin:118px 118px;
}
.ring-center{
  position:absolute; inset:0;
  display:flex; flex-direction:column;
  align-items:center; justify-content:center;
  text-align:center; padding:0 40px;
}
.ring-num{
  font-family:var(--serif); font-size:58px; font-weight:500;
  color:var(--green); line-height:1; letter-spacing:.5px;
}
.ring-unit{
  font-size:12.5px; font-weight:600; letter-spacing:1.4px;
  text-transform:uppercase; color:var(--muted); margin-top:7px;
}
.ring-note{
  font-size:13px; color:var(--slate); line-height:1.5;
  text-align:center; max-width:27ch; margin:14px auto 0;
}

/* ---------- buttons ---------- */
.btn{
  width:100%; border:none; cursor:pointer;
  font-family:var(--sans); font-size:15px; font-weight:600;
  border-radius:14px; padding:15px 18px;
  display:flex; align-items:center; justify-content:center; gap:9px;
  transition:transform .12s ease, background .2s ease, box-shadow .2s ease;
}
.btn:active{ transform:scale(.985); }
.btn-primary{
  background:var(--green); color:#F4F2EC;
  box-shadow:0 6px 16px -6px rgba(53,70,45,.55);
}
.btn-primary:active{ background:var(--green-700); }
.btn-ghost{
  background:transparent; color:var(--green);
  border:1px solid var(--line-strong);
}
.btn-ghost:active{ background:var(--green-soft); }
.btn-text{
  background:transparent; color:var(--slate);
  font-weight:600; padding:13px;
}
.btn-row{ display:flex; flex-direction:column; gap:10px; margin-top:22px; }

.history-link{
  display:flex; align-items:center; justify-content:center; gap:7px;
  margin-top:18px; background:none; border:none; cursor:pointer;
  font-family:var(--sans); font-size:13px; font-weight:600;
  color:var(--muted); transition:color .2s;
}
.history-link:active{ color:var(--green); }

/* ---------- indicator list ---------- */
.section-intro{ font-size:14px; color:var(--slate); line-height:1.55; margin:12px 0 18px; }
.ind-card{
  display:flex; align-items:center; gap:14px;
  padding:15px 16px; margin-bottom:10px;
  cursor:pointer;
  transition:transform .12s ease, border-color .2s ease;
}
.ind-card:active{ transform:scale(.99); border-color:var(--line-strong); }
.ind-main{ flex:1 1 auto; min-width:0; }
.ind-name{ font-size:15.5px; font-weight:600; color:var(--ink); }
.ind-trend{ font-size:12.5px; color:var(--muted); margin-top:2px; }
.ind-val{
  font-family:var(--serif); font-size:19px; font-weight:500; color:var(--green);
  flex:0 0 auto;
}
.ind-val small{ font-size:12px; color:var(--muted); font-family:var(--sans); }
.spark{ flex:0 0 auto; }

/* ---------- chips ---------- */
.chips{ display:flex; flex-wrap:wrap; gap:8px; margin:14px 0 4px; }
.chip{
  border:1px solid var(--line-strong); background:var(--paper);
  color:var(--slate); cursor:pointer;
  font-family:var(--sans); font-size:13px; font-weight:600;
  padding:8px 14px; border-radius:11px;
  transition:all .18s ease;
}
.chip:active{ transform:scale(.97); }
.chip.on{
  background:var(--green); color:#F4F2EC; border-color:var(--green);
}

/* ---------- observation ---------- */
.obs-date{ font-size:13px; color:var(--muted); font-weight:600; margin-top:4px; }
.obs-question{
  font-family:var(--serif); font-size:21px; font-weight:500;
  line-height:1.32; color:var(--ink); margin:20px 0 4px;
}
.gauge{
  text-align:center; margin:22px 0 4px;
}
.gauge-num{
  font-family:var(--serif); font-size:52px; font-weight:500;
  color:var(--green); line-height:1;
}
.gauge-word{
  font-size:13px; font-weight:600; letter-spacing:.6px;
  color:var(--slate); margin-top:6px;
}
.slider-wrap{ padding:6px 4px 2px; }
.slider{
  -webkit-appearance:none; appearance:none;
  width:100%; height:34px; background:transparent; cursor:pointer;
}
.slider::-webkit-slider-runnable-track{
  height:4px; border-radius:3px;
  background:linear-gradient(to right,
    var(--green) 0 var(--pct,50%), var(--line-strong) var(--pct,50%) 100%);
}
.slider::-webkit-slider-thumb{
  -webkit-appearance:none; appearance:none;
  height:26px; width:26px; border-radius:50%;
  background:var(--green); margin-top:-11px;
  border:4px solid var(--ivory);
  box-shadow:0 2px 9px rgba(53,70,45,.4);
  transition:transform .15s ease;
}
.slider:active::-webkit-slider-thumb{ transform:scale(1.14); }
.slider::-moz-range-track{ height:4px; border-radius:3px; background:var(--line-strong); }
.slider::-moz-range-progress{ height:4px; border-radius:3px; background:var(--green); }
.slider::-moz-range-thumb{
  height:22px; width:22px; border-radius:50%;
  background:var(--green); border:4px solid var(--ivory);
  box-shadow:0 2px 9px rgba(53,70,45,.4);
}
.slider-ends{
  display:flex; justify-content:space-between;
  font-size:11.5px; color:var(--muted); font-weight:600;
  padding:2px 2px 0; letter-spacing:.2px;
}
.field-label{
  font-size:12px; font-weight:600; letter-spacing:.7px;
  text-transform:uppercase; color:var(--muted); margin:24px 0 9px;
}
.notes{
  width:100%; min-height:104px; resize:none;
  font-family:var(--sans); font-size:14px; color:var(--ink);
  line-height:1.55;
  background:var(--paper); border:1px solid var(--line);
  border-radius:14px; padding:14px 15px;
  transition:border-color .2s ease;
}
.notes::placeholder{ color:#AEB0A8; }
.notes:focus{ outline:none; border-color:var(--green); }

/* ---------- save confirmation ---------- */
.confirm{
  margin-top:22px; padding:20px 18px; text-align:center;
  background:var(--green-soft); border:1px solid #D7DFD2;
  border-radius:16px;
  animation:screenIn .4s cubic-bezier(.22,.61,.36,1) both;
}
.confirm-icon{
  width:46px; height:46px; border-radius:50%;
  background:var(--green); color:#F4F2EC;
  display:flex; align-items:center; justify-content:center;
  margin:0 auto 12px;
}
.confirm h4{
  font-family:var(--serif); font-weight:500; font-size:18px;
  color:var(--ink); margin:0 0 5px;
}
.confirm p{ font-size:13px; color:var(--slate); margin:0; line-height:1.5; }

/* ---------- synthèse ---------- */
.chart-card{ padding:16px 16px 12px; }
.chart-head{
  display:flex; align-items:baseline; justify-content:space-between;
  margin-bottom:6px;
}
.chart-title{ font-size:13.5px; font-weight:600; color:var(--ink); }
.chart-meta{ font-size:11.5px; color:var(--muted); }
.chart-line{
  fill:none; stroke:var(--green); stroke-width:2;
  stroke-linecap:round; stroke-linejoin:round;
  stroke-dasharray:1000; stroke-dashoffset:1000;
  animation:draw 1.6s .25s cubic-bezier(.4,.5,.3,1) forwards;
}
@keyframes draw{ to{ stroke-dashoffset:0; } }
.chart-area{ fill:var(--green-soft); opacity:0; animation:fadeArea .8s 1.1s forwards; }
@keyframes fadeArea{ to{ opacity:.6; } }
.chart-dot{ fill:var(--paper); stroke:var(--green); stroke-width:2; }

.obs-item{ padding:14px 16px; margin-bottom:9px; }
.obs-item-top{
  display:flex; align-items:center; justify-content:space-between;
  margin-bottom:5px;
}
.obs-when{ font-size:12px; font-weight:600; color:var(--muted); }
.obs-tag{
  font-size:12px; font-weight:600; color:var(--green);
  background:var(--green-soft); padding:3px 9px; border-radius:8px;
}
.obs-quote{ font-size:13.5px; color:var(--slate); line-height:1.5; font-style:italic; }

.synth-block{ padding:16px 17px; margin-bottom:11px; }
.synth-head{
  display:flex; align-items:center; gap:9px; margin-bottom:11px;
}
.synth-badge{
  width:24px; height:24px; border-radius:8px;
  background:var(--green-soft); color:var(--green);
  display:flex; align-items:center; justify-content:center;
  font-family:var(--serif); font-weight:600; font-size:14px;
  flex:0 0 auto;
}
.synth-block h4{
  font-size:14px; font-weight:600; color:var(--ink); margin:0;
}
.synth-li{
  display:flex; gap:10px; padding:7px 0;
  font-size:13.5px; color:var(--slate); line-height:1.45;
  border-top:1px solid var(--line);
}
.synth-li:first-of-type{ border-top:none; }
.synth-li .mk{
  color:var(--gold); flex:0 0 auto; margin-top:6px;
  width:5px; height:5px; border-radius:50%; background:var(--gold);
}
.disclaimer{
  font-size:12px; font-style:italic; color:var(--muted);
  line-height:1.5; text-align:center; margin:16px 6px 4px;
}

/* ---------- ressources ---------- */
.etp-card{
  padding:18px 18px;
  background:linear-gradient(135deg,var(--green) 0%,var(--green-700) 100%);
  border:none; color:#EDEAE0;
}
.etp-card .etp-k{
  font-size:11px; font-weight:600; letter-spacing:1.4px;
  text-transform:uppercase; color:var(--gold);
}
.etp-card h3{
  font-family:var(--serif); font-weight:500; font-size:21px;
  margin:6px 0 7px; color:#F4F2EC;
}
.etp-card p{ font-size:13px; line-height:1.55; color:#CFD3C8; margin:0; }

.res-group{ margin-top:18px; }
.res-group > .res-gt{
  font-size:12px; font-weight:600; letter-spacing:.7px;
  text-transform:uppercase; color:var(--muted); margin:0 4px 9px;
}
.res-row{
  display:flex; align-items:center; gap:13px;
  padding:14px 15px; margin-bottom:9px; cursor:pointer;
  transition:transform .12s ease, border-color .2s ease;
}
.res-row:active{ transform:scale(.99); border-color:var(--line-strong); }
.res-ic{
  width:38px; height:38px; border-radius:11px; flex:0 0 auto;
  background:var(--green-soft); color:var(--green);
  display:flex; align-items:center; justify-content:center;
}
.res-tx{ flex:1 1 auto; min-width:0; }
.res-tx .rt{ font-size:14.5px; font-weight:600; color:var(--ink); }
.res-tx .rs{ font-size:12px; color:var(--muted); margin-top:1px; }

/* ---------- bottom nav ---------- */
.nav{
  flex:0 0 auto;
  position:relative; z-index:20;
  display:flex; align-items:stretch;
  padding:9px 12px calc(9px + env(safe-area-inset-bottom,8px));
  background:rgba(249,249,247,.92);
  backdrop-filter:blur(12px);
  border-top:1px solid var(--line);
}
.nav-item{
  flex:1; background:none; border:none; cursor:pointer;
  display:flex; flex-direction:column; align-items:center; gap:4px;
  padding:7px 4px 5px; color:var(--muted);
  font-family:var(--sans); font-size:10.5px; font-weight:600;
  letter-spacing:.2px;
  transition:color .22s ease;
}
.nav-item.on{ color:var(--green); }
.nav-ic{ position:relative; transition:transform .22s cubic-bezier(.34,1.4,.5,1); }
.nav-item.on .nav-ic{ transform:translateY(-1px); }
.nav-pip{
  position:absolute; bottom:-6px; left:50%;
  width:4px; height:4px; border-radius:50%;
  background:var(--green); transform:translateX(-50%) scale(0);
  transition:transform .25s cubic-bezier(.34,1.5,.5,1);
}
.nav-item.on .nav-pip{ transform:translateX(-50%) scale(1); }

.back-btn{
  width:38px; height:38px; border-radius:11px;
  background:var(--paper); border:1px solid var(--line);
  display:flex; align-items:center; justify-content:center;
  cursor:pointer; color:var(--ink);
  transition:transform .12s ease;
}
.back-btn:active{ transform:scale(.94); }
`;

/* ---------------- ICONS ---------------- */
function Icon({ name, size = 22, stroke = 1.6, color = "currentColor", style }) {
  const p = {
    fill: "none", stroke: color, strokeWidth: stroke,
    strokeLinecap: "round", strokeLinejoin: "round",
  };
  const shapes = {
    ring: <circle cx="12" cy="12" r="9" {...p} />,
    bars: (
      <g {...p}>
        <line x1="6.5" y1="20" x2="6.5" y2="13" />
        <line x1="12" y1="20" x2="12" y2="7" />
        <line x1="17.5" y1="20" x2="17.5" y2="15.5" />
      </g>
    ),
    doc: (
      <g {...p}>
        <path d="M7 3.4h6.6l4.9 4.9V19.6a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.4a1 1 0 0 1 1-1z" />
        <path d="M13.4 3.6V8.6h4.9" />
        <line x1="9" y1="13" x2="15" y2="13" />
        <line x1="9" y1="16.4" x2="13" y2="16.4" />
      </g>
    ),
    book: (
      <g {...p}>
        <path d="M12 6.6S10 4.9 6.6 4.9 3.4 5.5 3.4 5.5v13s1.1-.6 3-.6c3.4 0 5.6 1.7 5.6 1.7s2.2-1.7 5.6-1.7c1.9 0 3 .6 3 .6v-13s-1.1-.6-3-.6C14 4.9 12 6.6 12 6.6z" />
        <line x1="12" y1="6.6" x2="12" y2="19.6" />
      </g>
    ),
    back: (
      <g {...p}>
        <line x1="19" y1="12" x2="6" y2="12" />
        <polyline points="11,6 5,12 11,18" />
      </g>
    ),
    arrow: (
      <g {...p}>
        <line x1="5" y1="12" x2="18" y2="12" />
        <polyline points="13,7 18.5,12 13,17" />
      </g>
    ),
    plus: (
      <g {...p}>
        <line x1="12" y1="6" x2="12" y2="18" />
        <line x1="6" y1="12" x2="18" y2="12" />
      </g>
    ),
    chevron: <polyline points="9,5 16,12 9,19" {...p} />,
    check: <polyline points="5,12.5 10,17.5 19,7" {...p} />,
    calendar: (
      <g {...p}>
        <rect x="4" y="5" width="16" height="15" rx="2.6" />
        <line x1="4" y1="9.6" x2="20" y2="9.6" />
        <line x1="9" y1="3" x2="9" y2="6.5" />
        <line x1="15" y1="3" x2="15" y2="6.5" />
      </g>
    ),
    download: (
      <g {...p}>
        <path d="M12 4v10.5" />
        <polyline points="7.5,10.5 12,15 16.5,10.5" />
        <line x1="5.5" y1="19.5" x2="18.5" y2="19.5" />
      </g>
    ),
    spark: (
      <g {...p}>
        <polyline points="4,16 9,11 13,14 20,5.5" />
      </g>
    ),
    people: (
      <g {...p}>
        <circle cx="9" cy="8.5" r="3" />
        <circle cx="16.5" cy="10" r="2.4" />
        <path d="M3.5 19c.4-3 2.7-4.5 5.5-4.5s5.1 1.5 5.5 4.5" />
        <path d="M15 14.6c2 .2 3.7 1.5 4 4" />
      </g>
    ),
    leaf: (
      <g {...p}>
        <path d="M5 19C5 10 11 5 19 5c0 8-5 14-14 14z" />
        <path d="M5 19c2-5 6-9 11-11" />
      </g>
    ),
    heart: (
      <path d="M12 20S4 14.8 4 9.4A4.4 4.4 0 0 1 12 6.8 4.4 4.4 0 0 1 20 9.4C20 14.8 12 20 12 20z" {...p} />
    ),
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      {shapes[name]}
    </svg>
  );
}

/* ---------------- PROGRESS RING ---------------- */
function ProgressRing({ progressPercent = 66, days = 32 }) {
  const R = 92, CX = 118, CY = 118;
  const C = 2 * Math.PI * R;
  const [filled, setFilled] = useState(false);
  const [num, setNum] = useState(0);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setFilled(true), 160);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let raf, start;
    const dur = 1400;
    const tick = (ts) => {
      if (!start) start = ts;
      const k = Math.min((ts - start) / dur, 1);
      const eased = 1 - Math.pow(1 - k, 3);
      setNum(Math.round(eased * days));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    const t = setTimeout(() => { raf = requestAnimationFrame(tick); }, 160);
    return () => { clearTimeout(t); cancelAnimationFrame(raf); };
  }, [days]);

  // Handle NaN by defaulting to 0 or keeping it empty (0)
  const validProgressPercent = isNaN(progressPercent) ? 0 : progressPercent;
  const visualProgress = validProgressPercent / 100;
  
  const offset = filled ? C * (1 - visualProgress) : C;
  const dotAngle = filled ? visualProgress * 360 : 0;

  return (
    <div
      className={"ring-stage" + (pulse ? " pulse" : "")}
      onClick={() => { setPulse(true); setTimeout(() => setPulse(false), 620); }}
    >
      <svg className="ring-svg" viewBox="0 0 236 236">
        <circle className="ring-track" cx={CX} cy={CY} r={R} />
        <g transform={"rotate(-90 " + CX + " " + CY + ")"}>
          <circle
            className="ring-prog"
            cx={CX} cy={CY} r={R}
            strokeDasharray={C}
            strokeDashoffset={offset}
          />
        </g>
        <g className="ring-dotgroup" style={{ transform: "rotate(" + dotAngle + "deg)" }}>
          <circle cx={CX} cy={CY - R} r="8" fill="#D9BB84" />
          <circle cx={CX} cy={CY - R} r="3.4" fill="#35462D" />
        </g>
      </svg>
      <div className="ring-center">
        <div className="ring-num">{num}</div>
        <div className="ring-unit">jours restants</div>
      </div>
    </div>
  );
}

/* ---------------- MINI SPARKLINE ---------------- */
const IND_COLORS = {
  "fatigue": "#35462D",
  "douleur": "#4F7C72",
  "sommeil": "#7C9A92",
  "humeur": "#D9BB84",
  "mobilite": "#9BAF88",
  "effets": "#B88A5A"
};
const FALLBACK_COLORS = ["#35462D", "#4F7C72", "#7C9A92", "#D9BB84", "#9BAF88", "#B88A5A"];
const getIndColor = (key, idx) => IND_COLORS[key] || FALLBACK_COLORS[idx % FALLBACK_COLORS.length];

function IndicatorChart({ observations, color = "#35462D", showLabels = true }) {
  if (observations.length === 0) {
    return <div style={{ fontSize: 13, color: "var(--muted)", fontStyle: "italic", padding: "10px 0" }}>Aucune saisie pour le moment.</div>;
  }

  const w = 280, h = 90, padH = 24, padV = 16, bottomPad = 20;
  const graphW = w - padH * 2;
  const graphH = h - bottomPad - padV;
  
  const getX = (i) => {
    if (observations.length === 1) return w / 2;
    return padH + (i / (observations.length - 1)) * graphW;
  };

  const getY = (val) => {
    return padV + (1 - val / 10) * graphH;
  };

  const pts = observations.map((obs, i) => {
    const x = getX(i);
    const y = getY(obs.value);
    return [x, y, obs];
  });

  const chartViewBox = "0 0 " + w + " " + h;

  return (
    <svg width="100%" height={h} viewBox={chartViewBox} preserveAspectRatio="none" style={{ overflow: "visible", marginTop: 8 }}>
      {[1, 5, 10].map(val => (
        <g key={"grid-" + val}>
          <line x1={padH} y1={getY(val)} x2={w - padH} y2={getY(val)} stroke="#E8E7E1" strokeWidth="1" strokeDasharray="2 2" />
          <text x={padH - 6} y={getY(val) + 3} fontSize="9" fill="var(--muted)" textAnchor="end">{val}</text>
        </g>
      ))}

      {pts.length > 1 && (
        <polyline
          points={pts.map(p => p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ")}
          fill="none" stroke={color} strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round"
        />
      )}
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p[0]} cy={p[1]} r="4" fill={color} />
          {showLabels && (
            <>
              <text x={p[0]} y={p[1] - 8} fontSize="10" fill="var(--ink)" textAnchor="middle" fontWeight="600">{p[2].value}</text>
              {(i === 0 || i === pts.length - 1 || (observations.length > 3 && i % Math.ceil(observations.length / 3) === 0)) && (
                <text x={p[0]} y={h - 2} fontSize="9" fill="var(--muted)" textAnchor="middle">
                  {new Date(p[2].date).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" })}
                </text>
              )}
            </>
          )}
        </g>
      ))}
    </svg>
  );
}

/* ---------------- ONBOARDING ---------------- */
function ScreenOnboarding({ onComplete }) {
  const [startDate, setStartDate] = useState(() => new Date().toISOString().substring(0, 10));
  const [rdvDate, setRdvDate] = useState("");
  const [selectedInds, setSelectedInds] = useState(new Set(["fatigue", "douleur"]));
  const [customIndName, setCustomIndName] = useState("");
  const [customInds, setCustomInds] = useState([]);

  const defaultInds = [
    { key: "fatigue", name: "Fatigue" },
    { key: "douleur", name: "Douleur" },
    { key: "sommeil", name: "Sommeil" },
    { key: "humeur", name: "Humeur" },
    { key: "mobilite", name: "Mobilité" },
    { key: "effets", name: "Effets secondaires" }
  ];

  const allInds = [...defaultInds, ...customInds];

  const toggleInd = (key) => {
    const next = new Set(selectedInds);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setSelectedInds(next);
  };

  const handleAddCustom = (e) => {
    e.preventDefault();
    if (!customIndName.trim()) return;
    const key = "custom_" + Date.now();
    setCustomInds([...customInds, { key, name: customIndName.trim() }]);
    setCustomIndName("");
    const next = new Set(selectedInds);
    next.add(key);
    setSelectedInds(next);
  };

  const handleSubmit = () => {
    if (!startDate) return alert("Veuillez indiquer la date de début du suivi.");
    if (!rdvDate) return alert("Veuillez indiquer la date de votre prochain rendez-vous.");
    if (new Date(rdvDate) <= new Date(startDate)) return alert("La date du prochain rendez-vous doit être ultérieure à la date de début.");
    if (selectedInds.size === 0) return alert("Veuillez sélectionner au moins un indicateur.");
    const chosen = allInds.filter(i => selectedInds.has(i.key));
    onComplete({
      rdvDate,
      startDate: new Date(startDate).toISOString(),
      indicators: chosen.map(c => ({
        ...c,
        last: 0,
        trend: "Nouveau",
        spark: [0, 0, 0, 0, 0, 0]
      }))
    });
  };

  return (
    <div className="screen" style={{ paddingBottom: 60 }}>
      <div className="appbar" style={{ justifyContent: 'center', marginBottom: 24 }}>
        <img src={logoImg} alt="Pacte Logo" className="logo" style={{height: 48, objectFit: 'contain'}} />
      </div>
      <h1 className="title" style={{textAlign: 'center', fontSize: 34, marginBottom: 10}}>Bienvenue</h1>
      <p className="subtitle" style={{textAlign: 'center', margin: '0 auto 40px', fontSize: 15, maxWidth: 300, lineHeight: 1.5}}>
        Configurons ensemble votre suivi pour préparer votre prochain échange médical.
      </p>

      <div style={{ marginBottom: 36 }}>
        <div style={{ marginBottom: 16 }}>
          <label className="field-label" style={{ marginTop: 0, color: 'var(--ink)' }}>Date de début du suivi</label>
          <input 
            type="date" 
            className="date-input"
            value={startDate} 
            onChange={e => setStartDate(e.target.value)}
          />
        </div>

        <div>
          <label className="field-label" style={{ marginTop: 0, color: 'var(--ink)' }}>Prochain rendez-vous</label>
          <input 
            type="date" 
            className="date-input"
            value={rdvDate} 
            onChange={e => setRdvDate(e.target.value)}
          />
        </div>
      </div>

      <div style={{ marginBottom: 36 }}>
        <label className="field-label" style={{ marginTop: 0, color: 'var(--ink)' }}>Indicateurs à suivre</label>
        <p className="section-intro" style={{marginTop: 0, marginBottom: 16, fontSize: 14}}>
          Sélectionnez ce que vous souhaitez observer.
        </p>
        <div className="chips">
          {allInds.map(ind => (
            <button 
              key={ind.key}
              className={"chip" + (selectedInds.has(ind.key) ? " on" : "")}
              onClick={() => toggleInd(ind.key)}
            >
              {ind.name}
            </button>
          ))}
        </div>
        <form onSubmit={handleAddCustom} style={{display: 'flex', gap: 10, marginTop: 18}}>
          <input 
            type="text" 
            placeholder="Autre indicateur..."
            value={customIndName}
            onChange={e => setCustomIndName(e.target.value)}
            className="text-input"
            style={{ flex: 1, minWidth: 0 }}
          />
          <button type="submit" className="btn btn-ghost" style={{flex: '0 0 auto', padding: '0 18px', width: 'auto'}}>
            Ajouter
          </button>
        </form>
      </div>

      <div style={{ marginTop: 50 }}>
        <button className="btn btn-primary" onClick={handleSubmit} style={{ padding: 18, fontSize: 16 }}>
          Démarrer mon suivi
        </button>
      </div>
    </div>
  );
}

/* ---------------- DATA ---------------- */
const VALUE_WORD = (v) => {
  if (v === 0) return "Aucune";
  if (v <= 3) return "Légère";
  if (v <= 6) return "Modérée";
  if (v <= 8) return "Importante";
  return "Très importante";
};

/* ---------------- SCREEN : SUIVI ---------------- */
function ScreenSuivi({ go, appState, updateCycle, resetCycle }) {
  const { rdvDate, startDate } = appState;
  
  const [isEditing, setIsEditing] = useState(false);
  const [editStart, setEditStart] = useState(startDate);
  const [editRdv, setEditRdv] = useState(rdvDate);
  const [editError, setEditError] = useState("");

  const handleSaveCycle = () => {
    if (!editStart || !editRdv) {
      setEditError("Veuillez remplir les deux dates.");
      return;
    }
    const dStart = new Date(editStart);
    const dRdv = new Date(editRdv);
    if (dRdv <= dStart) {
      setEditError("La date de consultation doit être ultérieure à la date de début.");
      return;
    }
    setEditError("");
    updateCycle(editStart, editRdv);
    setIsEditing(false);
  };

  const today = new Date();
  const rdv = new Date(rdvDate);
  const start = new Date(startDate);
  
  today.setHours(0, 0, 0, 0);
  rdv.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);

  const totalCycleMs = rdv.getTime() - start.getTime();
  const totalCycleDays = Math.max(1, Math.round(totalCycleMs / (1000 * 60 * 60 * 24)));
  
  const remainingMs = rdv.getTime() - today.getTime();
  const remainingDays = Math.max(0, Math.round(remainingMs / (1000 * 60 * 60 * 24)));
  
  let progressPercent = NaN;
  const isRdvValid = rdvDate && !isNaN(rdv.getTime());
  const isStartValid = startDate && !isNaN(start.getTime());

  if (isRdvValid && isStartValid) {
    const elapsedMs = today.getTime() - start.getTime();
    let progress = 0;
    
    if (totalCycleMs > 0) {
      progress = elapsedMs / totalCycleMs;
    }

    progressPercent = progress * 100;

    if (elapsedMs < 0) {
      progressPercent = 0;
    } else if (elapsedMs >= totalCycleMs && totalCycleMs > 0) {
      progressPercent = 100;
    } else if (totalCycleMs === 0) {
      progressPercent = 0;
    }

    progressPercent = Math.max(0, Math.min(100, progressPercent));
  }

  const rdvStr = rdv.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="screen">
      <div className="appbar">
        <img src={logoImg} alt="Pacte Logo" className="logo" />
        <span className="ghost" />
      </div>

      <div style={{ marginTop: 6 }}>
        <div className="kicker">Mon suivi</div>
        <h1 className="title">Mon cycle<br />de suivi en cours</h1>
      </div>

      <div className="card rdv reveal" style={{ marginTop: 20, animationDelay: ".05s" }}>
        <div className="rdv-top">
          <div>
            <div className="rdv-label">
              <Icon name="calendar" size={14} stroke={1.8} color="#8E918A" />
              Prochain rendez-vous
            </div>
            <div className="rdv-date">{rdvStr}</div>
          </div>
          <div className="pill">J&#8209;{remainingDays}</div>
        </div>
        <div className="rdv-div" />
        <div className="rdv-cycle">
          <span className="dot-green" />
          Suivi en cours · réévaluation prévue dans {remainingDays} jours
        </div>
      </div>

      <div className="ring-wrap reveal" style={{ animationDelay: ".12s" }}>
        <ProgressRing progressPercent={progressPercent} days={remainingDays} />
        <p className="ring-note">
          Chaque observation vous aide à préparer le prochain échange avec votre médecin.
        </p>
      </div>

      <div className="btn-row reveal" style={{ animationDelay: ".2s" }}>
        <button className="btn btn-primary" onClick={() => go("observation")}>
          <Icon name="plus" size={18} stroke={2} color="#F4F2EC" />
          + Suivi
        </button>
        <button className="btn btn-ghost" onClick={() => go("synthese")}>
          Voir ma synthèse
        </button>
      </div>

      <div style={{ textAlign: "center", marginTop: 24 }} className="reveal">
        <button className="btn btn-ghost" onClick={() => setIsEditing(true)} style={{ fontSize: 13, color: "var(--muted)", textDecoration: "underline" }}>
          Paramètres du cycle
        </button>
      </div>

      <button className="history-link reveal" onClick={() => go("synthese")} style={{ marginTop: 12 }}>
        Dernière observation · 11 mai
        <Icon name="arrow" size={15} stroke={1.8} color="#8E918A" />
      </button>

      {isEditing && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0, 
          background: "rgba(0,0,0,0.5)", zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "center", padding: 20
        }}>
          <div className="card" style={{ padding: 24, width: "100%", maxWidth: 360, background: "var(--paper)" }}>
            <h2 style={{ fontSize: 18, marginBottom: 16, fontFamily: "var(--serif)", color: "var(--ink)" }}>Paramètres du cycle</h2>
            
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, marginBottom: 6, color: "var(--slate)", fontWeight: 600 }}>Date de début du suivi</label>
              <input 
                type="date" 
                value={editStart} 
                onChange={(e) => setEditStart(e.target.value)} 
                style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid var(--line)" }} 
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, marginBottom: 6, color: "var(--slate)", fontWeight: 600 }}>Prochaine consultation</label>
              <input 
                type="date" 
                value={editRdv} 
                onChange={(e) => setEditRdv(e.target.value)} 
                style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid var(--line)" }} 
              />
            </div>

            {editError && <div style={{ color: "#d9534f", fontSize: 13, marginBottom: 16 }}>{editError}</div>}

            <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSaveCycle}>Enregistrer</button>
              <button className="btn btn-ghost" style={{ flex: 1, border: "1px solid var(--line)" }} onClick={() => setIsEditing(false)}>Annuler</button>
            </div>

            <div style={{ textAlign: "center", borderTop: "1px solid var(--line)", paddingTop: 16 }}>
              <button onClick={resetCycle} style={{ background: "none", border: "none", color: "#d9534f", fontSize: 13, textDecoration: "underline", cursor: "pointer" }}>
                Réinitialiser le suivi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- SCREEN : INDICATEURS ---------------- */
function ScreenIndicateurs({ go, openObs, appState, indicators, addIndicator }) {
  const [showModal, setShowModal] = useState(false);
  const [newInd, setNewInd] = useState("");
  
  const suggestions = ["Sommeil", "Humeur", "Mobilité", "Effets secondaires", "Appétit", "Stress"];

  const handleAdd = () => {
    if (newInd.trim()) {
      addIndicator(newInd.trim());
      setShowModal(false);
      setNewInd("");
    }
  };

  return (
    <div className="screen">
      <div className="appbar">
        <img src={logoImg} alt="Pacte Logo" className="logo" style={{height: 24}} />
        <span className="ghost" />
      </div>
      <div className="kicker">Mes indicateurs</div>
      <h1 className="title">Suivre l’évolution<br />de mes symptômes</h1>
      <p className="section-intro">
        Cette section vous permet de suivre les indicateurs définis avec votre médecin lors de la dernière consultation.
      </p>

      {indicators.map((ind, i) => {
        const obs = (appState.observations || []).filter(o => o.indicatorKey === ind.key).sort((a,b) => new Date(a.date) - new Date(b.date));
        
        return (
          <div
            key={ind.key}
            className="card reveal"
            style={{ animationDelay: (0.05 + i * 0.06) + "s", padding: "15px 16px", marginBottom: "12px", cursor: "pointer", transition: "transform .12s ease" }}
            onClick={() => openObs(ind.key)}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div className="ind-main">
                <div className="ind-name">{ind.name}</div>
                <div className="ind-trend">{obs.length > 0 ? "Dernière saisie le " + new Date(obs[obs.length-1].date).toLocaleDateString() : "Aucune saisie"}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {obs.length > 0 && <div className="ind-val">{obs[obs.length-1].value}<small>&#8201;/&#8201;10</small></div>}
                <Icon name="chevron" size={16} stroke={1.8} color="#C8C8C8" />
              </div>
            </div>
            
            <IndicatorChart observations={obs} color={getIndColor(ind.key, i)} />
          </div>
        );
      })}

      <div className="btn-row" style={{ marginTop: 16 }}>
        <button className="btn btn-primary" onClick={() => openObs(indicators[0]?.key || "fatigue")}>
          <Icon name="plus" size={18} stroke={2} color="#F4F2EC" />
          Noter mon ressenti
        </button>
        <button className="btn btn-ghost" onClick={() => setShowModal(true)}>
          Ajouter un indicateur
        </button>
      </div>

      {showModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div className="card" style={{ padding: 24, width: "100%", maxWidth: 360, background: "var(--paper)" }}>
            <h2 style={{ fontSize: 18, marginBottom: 16, fontFamily: "var(--serif)", color: "var(--ink)" }}>Ajouter un indicateur à suivre</h2>
            <div className="chips" style={{ marginBottom: 16 }}>
              {suggestions.map(s => (
                <button key={s} className={"chip" + (newInd === s ? " on" : "")} onClick={() => setNewInd(s)}>{s}</button>
              ))}
            </div>
            <input type="text" className="text-input" placeholder="Ou écrire un autre indicateur" value={newInd} onChange={e => setNewInd(e.target.value)} style={{ marginBottom: 24 }} />
            <div style={{ display: "flex", gap: 12 }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleAdd}>Ajouter</button>
              <button className="btn btn-ghost" style={{ flex: 1, border: "1px solid var(--line)" }} onClick={() => setShowModal(false)}>Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- SCREEN : OBSERVATION ---------------- */
function ScreenObservation({ back, startKey, indicators, onSave }) {
  const [indKey, setIndKey] = useState(startKey || (indicators[0]?.key));
  const [value, setValue] = useState(5);
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);
  
  const todayLabel = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  
  const current = indicators.find((x) => x.key === indKey) || indicators[0];
  const pct = (value / 10) * 100;

  const reset = (nextKey) => {
    setIndKey(nextKey || indKey);
    setValue(5);
    setNotes("");
    setSaved(false);
  };
  const nextIndicator = () => {
    const idx = indicators.findIndex((x) => x.key === indKey);
    reset(indicators[(idx + 1) % indicators.length].key);
  };

  if (!current) return null;

  const handleSave = () => {
    if (onSave) {
      onSave({
        id: Date.now(),
        indicatorKey: indKey,
        indicatorName: current.name,
        value: value,
        notes: notes,
        date: new Date().toISOString()
      });
    }
    setSaved(true);
  };

  return (
    <div className="screen">
      <div className="appbar">
        <button className="back-btn" onClick={back}>
          <Icon name="back" size={19} stroke={1.8} />
        </button>
        <span className="ghost" />
      </div>

      <div className="kicker">Observation</div>
      <h1 className="title">Noter ce que<br />je ressens</h1>
      <div className="obs-date">Aujourd&#8217;hui · {todayLabel}</div>

      <div className="chips">
        {indicators.map((ind) => (
          <button
            key={ind.key}
            className={"chip" + (ind.key === indKey ? " on" : "")}
            onClick={() => { setIndKey(ind.key); setSaved(false); }}
          >
            {ind.name}
          </button>
        ))}
      </div>

      <p className="obs-question">
        Comment évaluez-vous votre {current.name.toLowerCase()} aujourd&#8217;hui ?
      </p>

      <div className="gauge">
        <div className="gauge-num">{value}</div>
        <div className="gauge-word">{VALUE_WORD(value)}</div>
      </div>

      <div className="slider-wrap">
        <input
          className="slider"
          type="range" min="0" max="10" step="1"
          value={value}
          style={{ "--pct": pct + "%" }}
          onChange={(e) => setValue(Number(e.target.value))}
        />
        <div className="slider-ends">
          <span>0 · Aucune</span>
          <span>Très importante · 10</span>
        </div>
      </div>

      <div className="field-label">Notes libres</div>
      <textarea
        className="notes"
        placeholder="Décrivez ce qui a changé, ce qui vous a marqué ou ce que vous souhaitez signaler."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      {!saved ? (
        <div className="btn-row" style={{ marginTop: 18 }}>
          <button className="btn btn-primary" onClick={handleSave}>
            Enregistrer l&#8217;observation
          </button>
        </div>
      ) : (
        <div className="confirm">
          <div className="confirm-icon">
            <Icon name="check" size={22} stroke={2.2} color="#F4F2EC" />
          </div>
          <h4>Observation enregistrée</h4>
          <p>Elle apparaîtra dans votre synthèse, pour préparer le prochain échange.</p>
          <div className="btn-row" style={{ marginTop: 16 }}>
            <button className="btn btn-primary" onClick={back}>
              Revenir au suivi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- SCREEN : SYNTHÈSE ---------------- */
function ScreenSynthese({ appState, updateNotes }) {
  const W = 308, H = 140, pad = 10;
  
  const colors = {
    "fatigue": "#35462D",
    "douleur": "#4F7C72",
    "sommeil": "#7C9A92",
    "humeur": "#D9BB84",
    "mobilite": "#9BAF88",
    "effets": "#B88A5A"
  };
  const fallbackColors = ["#35462D", "#4F7C72", "#7C9A92", "#D9BB84", "#9BAF88", "#B88A5A"];
  const getColor = (key, idx) => colors[key] || fallbackColors[idx % fallbackColors.length];

  const indicatorsWithData = (appState?.indicators || []).filter(ind => 
    (appState.observations || []).some(o => o.indicatorKey === ind.key)
  );

  const allObs = [...(appState?.observations || [])].sort((a,b) => new Date(a.date) - new Date(b.date));

  const getPoints = (obsList) => {
    return obsList.map(obs => {
      const idx = allObs.findIndex(o => o.id === obs.id);
      const x = pad + 15 + (allObs.length > 1 ? (idx / (allObs.length - 1)) * (W - pad * 2 - 15) : (W - pad * 2 - 15) / 2);
      const y = pad + (1 - obs.value / 10) * (H - pad * 2);
      return [x, y];
    });
  };

  const getLinePath = (pts) => pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");

  const { evolutions, points, questions } = appState?.preConsultationNotes || { evolutions: "", points: "", questions: "" };

  const handleNoteChange = (field, val) => {
    updateNotes({ [field]: val });
  };
  
  const printSynthesis = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return alert("Veuillez autoriser les pop-ups pour générer la synthèse.");
    
    const obsHTML = indicatorsWithData.map(ind => {
      const obs = allObs.filter(o => o.indicatorKey === ind.key);
      const avg = (obs.reduce((sum, o) => sum + o.value, 0) / obs.length).toFixed(1);
      const notesHTML = obs.filter(o => o.notes).map(o => `<li style="margin-bottom:8px"><strong>${new Date(o.date).toLocaleDateString()} :</strong> ${o.notes}</li>`).join('');
      
      return `
        <div style="margin-bottom: 20px;">
          <h3>${ind.name} (Moyenne : ${avg}/10, Dernière : ${obs[obs.length-1].value}/10, Saisies : ${obs.length})</h3>
          ${notesHTML ? `<ul style="padding-left:20px">${notesHTML}</ul>` : '<p style="color:#666"><i>Aucune note renseignée pour cet indicateur.</i></p>'}
        </div>
      `;
    }).join('');

    const tableRows = allObs.map(o => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${new Date(o.date).toLocaleDateString()}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${o.indicatorName}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${o.value} / 10</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${o.notes || ''}</td>
      </tr>
    `).join('');

    const html = `
      <html>
        <head>
          <title>Synthèse de suivi - Pacte</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #333; line-height: 1.5; padding: 20px; max-width: 800px; margin: 0 auto; }
            h1 { color: #35462D; border-bottom: 2px solid #E8E7E1; padding-bottom: 10px; display: flex; align-items: center; gap: 15px; }
            h2 { color: #4F7C72; margin-top: 35px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
            h3 { color: #555; margin-bottom: 10px; font-size: 16px; }
            .header { margin-bottom: 40px; }
            .notes-section { background: #f9f9f9; padding: 15px; border-left: 4px solid #7C9A92; margin-bottom: 20px; border-radius: 0 8px 8px 0; }
            .disclaimer { font-size: 12px; color: #888; margin-top: 50px; text-align: center; border-top: 1px solid #eee; padding-top: 15px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px; }
            th { text-align: left; padding: 8px; background: #f9f9f7; border-bottom: 2px solid #E8E7E1; color: #555; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1><img src="\${window.location.origin}/src/assets/LogoPacte2.png" alt="Logo" style="height: 40px;" /> Synthèse de suivi</h1>
            <p><strong>Date de début du suivi :</strong> ${new Date(appState.startDate).toLocaleDateString()}</p>
            <p><strong>Prochaine consultation :</strong> ${appState.rdvDate ? new Date(appState.rdvDate).toLocaleDateString() : 'Non définie'}</p>
          </div>
          
          <h2>Indicateurs suivis</h2>
          \${obsHTML || '<p>Aucune donnée saisie.</p>'}

          <h2>Récapitulatif des observations</h2>
          \${allObs.length > 0 ? \`
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Indicateur</th>
                <th>Valeur</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              \${tableRows}
            </tbody>
          </table>
          \` : '<p>Aucune observation.</p>'}

          <h2>Notes de préparation pour le rendez-vous</h2>
          <div class="notes-section">
            <h3 style="margin-top:0">Évolutions notables</h3>
            <p style="margin-bottom:0; white-space: pre-wrap;">\${evolutions || '<i>Non renseigné</i>'}</p>
          </div>
          <div class="notes-section">
            <h3 style="margin-top:0">Points à signaler</h3>
            <p style="margin-bottom:0; white-space: pre-wrap;">\${points || '<i>Non renseigné</i>'}</p>
          </div>
          <div class="notes-section">
            <h3 style="margin-top:0">Questions à poser</h3>
            <p style="margin-bottom:0; white-space: pre-wrap;">\${questions || '<i>Non renseigné</i>'}</p>
          </div>

          <p class="disclaimer">Cette synthèse prépare l'échange médical. Elle ne remplace pas l'avis d'un professionnel de santé.</p>
        </body>
      </html>
    \`;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const chartViewBox = "0 0 " + W + " " + H;

  return (
    <div className="screen">
      <div className="appbar">
        <img src={logoImg} alt="Pacte Logo" className="logo" style={{height: 24}} />
        <span className="ghost" />
      </div>
      <div className="kicker">Synthèse</div>
      <h1 className="title">Préparer le<br />prochain échange</h1>
      <p className="section-intro">Aperçu de vos observations pour ce cycle.</p>

      <div className="card chart-card reveal" style={{ animationDelay: ".05s", paddingBottom: 15 }}>
        <div className="chart-head" style={{ marginBottom: 10 }}>
          <span className="chart-title">Évolution globale</span>
        </div>
        {allObs.length > 0 ? (
          <>
            <svg width="100%" viewBox={chartViewBox} style={{ overflow: "visible" }}>
              {[1, 5, 10].map(val => {
                const y = pad + (1 - val / 10) * (H - pad * 2);
                return (
                  <g key={"s-grid-" + val}>
                    <line x1={pad + 15} y1={y} x2={W - pad} y2={y} stroke="#E8E7E1" strokeWidth="1" strokeDasharray="2 2" />
                    <text x={pad + 10} y={y + 3} fontSize="9" fill="var(--muted)" textAnchor="end">{val}</text>
                  </g>
                );
              })}
              {indicatorsWithData.map((ind, i) => {
                const obs = allObs.filter(o => o.indicatorKey === ind.key);
                const pts = getPoints(obs);
                const color = getColor(ind.key, i);
                
                if (pts.length === 1) {
                  return <circle key={ind.key} cx={pts[0][0]} cy={pts[0][1]} r="4" fill={color} />;
                }

                return (
                  <g key={ind.key}>
                    <path d={getLinePath(pts)} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    {pts.map((p, j) => <circle key={j} cx={p[0]} cy={p[1]} r="3" fill={color} />)}
                  </g>
                );
              })}
            </svg>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 16, fontSize: 13 }}>
              {indicatorsWithData.map((ind, i) => (
                <div key={ind.key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: getColor(ind.key, i) }} />
                  <span style={{ color: "var(--ink)" }}>{ind.name}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p style={{ fontSize: 13, color: "var(--muted)" }}>Aucune observation enregistrée pour tracer un graphique.</p>
        )}
      </div>

      <div className="field-label" style={{ marginTop: 26, marginBottom: 12 }}>Observations récentes</div>
      {indicatorsWithData.length > 0 ? indicatorsWithData.map((ind, i) => {
        const obs = allObs.filter(o => o.indicatorKey === ind.key);
        const avg = (obs.reduce((sum, o) => sum + o.value, 0) / obs.length).toFixed(1);
        const withNotes = obs.filter(o => o.notes);
        
        return (
          <div key={ind.key} className="card obs-item reveal" style={{ animationDelay: (0.1 + i * 0.05) + "s", padding: "16px", marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontWeight: 600, color: "var(--ink)", fontSize: 15 }}>{ind.name}</span>
              <span style={{ color: "var(--slate)", fontSize: 13 }}>Moyenne : <strong style={{ color: "var(--green)" }}>{avg}</strong> / 10</span>
            </div>
            {withNotes.length > 0 ? (
              <ul style={{ paddingLeft: 20, margin: 0, fontSize: 14, color: "var(--slate)", lineHeight: 1.5 }}>
                {withNotes.map(o => (
                  <li key={o.id} style={{ marginBottom: 8 }}>
                    <strong style={{ color: "var(--ink)" }}>{new Date(o.date).toLocaleDateString()} :</strong> {o.notes}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ fontSize: 13, color: "var(--muted)", margin: 0, fontStyle: "italic" }}>Aucune note renseignée pour cet indicateur.</p>
            )}
          </div>
        );
      }) : (
        <div className="card obs-item reveal" style={{ padding: "16px", marginBottom: 12 }}>
          <div className="obs-item-top">
            <span className="obs-when">Exemple</span>
            <span className="obs-tag">Fatigue</span>
          </div>
          <div className="obs-quote">« C'est ici que vos observations apparaîtront une fois saisies. »</div>
        </div>
      )}

      <div className="field-label" style={{ marginTop: 26, marginBottom: 12 }}>Pour le rendez-vous</div>
      
      <div className="card synth-block reveal" style={{ animationDelay: "0.15s", padding: "16px 16px 8px", marginBottom: 12 }}>
        <h4 style={{ margin: "0 0 10px 0", color: "var(--ink)", fontSize: 15 }}>Évolutions notables</h4>
        <textarea className="notes" style={{ minHeight: 80, border: "none", background: "var(--bg)", padding: 12, borderRadius: 8, fontSize: 14 }} placeholder="Notez les changements que vous avez observés depuis le début du cycle." value={evolutions} onChange={e => handleNoteChange('evolutions', e.target.value)} />
      </div>

      <div className="card synth-block reveal" style={{ animationDelay: "0.20s", padding: "16px 16px 8px", marginBottom: 12 }}>
        <h4 style={{ margin: "0 0 10px 0", color: "var(--ink)", fontSize: 15 }}>Points à signaler</h4>
        <textarea className="notes" style={{ minHeight: 80, border: "none", background: "var(--bg)", padding: 12, borderRadius: 8, fontSize: 14 }} placeholder="Notez les symptômes, effets secondaires ou difficultés que vous souhaitez signaler." value={points} onChange={e => handleNoteChange('points', e.target.value)} />
      </div>

      <div className="card synth-block reveal" style={{ animationDelay: "0.25s", padding: "16px 16px 8px", marginBottom: 12 }}>
        <h4 style={{ margin: "0 0 10px 0", color: "var(--ink)", fontSize: 15 }}>Questions à poser</h4>
        <textarea className="notes" style={{ minHeight: 80, border: "none", background: "var(--bg)", padding: 12, borderRadius: 8, fontSize: 14 }} placeholder="Préparez ici les questions que vous voulez poser lors de la consultation." value={questions} onChange={e => handleNoteChange('questions', e.target.value)} />
      </div>

      <p className="disclaimer" style={{ marginTop: 24 }}>
        Cette synthèse prépare l&#8217;échange. Elle ne remplace pas l&#8217;avis médical.
      </p>

      <div className="btn-row" style={{ marginTop: 10, marginBottom: 24 }}>
        <button className="btn btn-ghost" onClick={printSynthesis}>
          <Icon name="download" size={17} stroke={1.8} color="#35462D" />
          Télécharger le résumé
        </button>
      </div>
    </div>
  );
}

/* ---------------- SCREEN : RESSOURCES ---------------- */
function ScreenRessources() {
  const groups = [
    {
      title: "Ateliers près de chez vous",
      rows: [
        { ic: "leaf", rt: "Comprendre mon traitement", rs: "Atelier · 1h30" },
        { ic: "leaf", rt: "Alimentation et fatigue", rs: "Atelier · 2h" },
        { ic: "leaf", rt: "Activité physique adaptée", rs: "Séance d’essai" },
      ],
    },
    {
      title: "Témoignages & échanges",
      rows: [
        { ic: "people", rt: "Récits d’autres patients", rs: "Vidéos et textes" },
        { ic: "heart", rt: "Échanger avec un patient partenaire", rs: "Sur rendez-vous" },
      ],
    },
    {
      title: "Associations partenaires",
      rows: [
        { ic: "book", rt: "France Assos Santé", rs: "Information et droits" },
        { ic: "book", rt: "Associations locales de patients", rs: "Près de chez vous" },
      ],
    },
  ];

  return (
    <div className="screen">
      <div className="appbar">
        <img src={logoImg} alt="Pacte Logo" className="logo" style={{height: 24}} />
        <span className="ghost" />
      </div>
      <div className="kicker">Ressources &amp; ETP</div>
      <h1 className="title">S&#8217;informer,<br />échanger, apprendre</h1>

      <div className="card etp-card reveal" style={{ marginTop: 20, animationDelay: ".05s" }}>
        <div className="etp-k">Éducation thérapeutique</div>
        <h3>Mieux vivre avec ma maladie</h3>
        <p>
          Des ateliers pour comprendre votre traitement et avancer à votre rythme,
          animés près de chez vous.
        </p>
      </div>

      {groups.map((g, gi) => (
        <div key={gi} className="res-group">
          <div className="res-gt">{g.title}</div>
          {g.rows.map((r, ri) => (
            <div
              key={ri}
              className="card res-row reveal"
              style={{ animationDelay: (0.1 + (gi * 3 + ri) * 0.05) + "s" }}
            >
              <div className="res-ic">
                <Icon name={r.ic} size={20} stroke={1.6} color="#35462D" />
              </div>
              <div className="res-tx">
                <div className="rt">{r.rt}</div>
                <div className="rs">{r.rs}</div>
              </div>
              <Icon name="chevron" size={16} stroke={1.8} color="#C8C8C8" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ---------------- BOTTOM NAV ---------------- */
function BottomNav({ screen, go }) {
  const items = [
    { key: "suivi", label: "Suivi", icon: "ring" },
    { key: "indicateurs", label: "Indicateurs", icon: "bars" },
    { key: "synthese", label: "Synthèse", icon: "doc" },
    { key: "ressources", label: "Ressources", icon: "book" },
  ];
  const active = screen === "observation" ? null : screen;
  return (
    <nav className="nav">
      {items.map((it) => (
        <button
          key={it.key}
          className={"nav-item" + (active === it.key ? " on" : "")}
          onClick={() => go(it.key)}
        >
          <span className="nav-ic">
            <Icon name={it.icon} size={22} stroke={active === it.key ? 1.9 : 1.6} />
            <span className="nav-pip" />
          </span>
          {it.label}
        </button>
      ))}
    </nav>
  );
}

/* ---------------- ROOT ---------------- */
export default function PacteApp() {
  const [appState, setAppState] = useState(() => {
    try {
      const saved = localStorage.getItem("pacteCycleSettings");
      if (saved) {
        return {
          hasOnboarded: true,
          ...JSON.parse(saved)
        };
      }
    } catch (e) {
      console.error("Failed to parse local settings", e);
    }
    return {
      hasOnboarded: false,
      rdvDate: "",
      startDate: "",
      indicators: [],
      observations: [],
      preConsultationNotes: { evolutions: "", points: "", questions: "" }
    };
  });
  const [screen, setScreen] = useState("suivi");
  const [from, setFrom] = useState("suivi");
  const [obsKey, setObsKey] = useState("fatigue");

  const go = (s) => {
    if (s !== "observation") setFrom(s);
    setScreen(s);
  };
  const openObs = (key) => {
    setObsKey(key);
    setFrom(screen);
    setScreen("observation");
  };
  const back = () => setScreen(from === "observation" ? "suivi" : from);

  const handleOnboarding = (data) => {
    const newState = {
      hasOnboarded: true,
      observations: [],
      preConsultationNotes: { evolutions: "", points: "", questions: "" },
      ...data
    };
    setAppState(newState);
    localStorage.setItem("pacteCycleSettings", JSON.stringify(data));
    
    if (data.indicators.length > 0) {
      setObsKey(data.indicators[0].key);
    }
  };

  const saveObservation = (obs) => {
    setAppState((prev) => {
      const newObservations = [...(prev.observations || []), obs];
      const newIndicators = prev.indicators.map(ind => {
        if (ind.key === obs.indicatorKey) {
          const newSpark = [...ind.spark.slice(1), obs.value];
          return {
            ...ind,
            last: obs.value,
            trend: "Saisie enregistrée",
            spark: newSpark
          };
        }
        return ind;
      });

      const newState = {
        ...prev,
        observations: newObservations,
        indicators: newIndicators
      };

      const { hasOnboarded, ...dataToSave } = newState;
      localStorage.setItem("pacteCycleSettings", JSON.stringify(dataToSave));
      return newState;
    });
  };

  const updatePreConsultationNotes = (notes) => {
    setAppState((prev) => {
      const newState = {
        ...prev,
        preConsultationNotes: { ...(prev.preConsultationNotes || {}), ...notes }
      };
      const { hasOnboarded, ...dataToSave } = newState;
      localStorage.setItem("pacteCycleSettings", JSON.stringify(dataToSave));
      return newState;
    });
  };

  const updateCycleSettings = (startDate, rdvDate) => {
    const newData = { ...appState, startDate, rdvDate };
    setAppState(newData);
    
    const { hasOnboarded, ...dataToSave } = newData;
    localStorage.setItem("pacteCycleSettings", JSON.stringify(dataToSave));
  };

  const addIndicator = (name) => {
    setAppState((prev) => {
      const existing = prev.indicators.find(ind => ind.name.toLowerCase() === name.toLowerCase());
      if (existing) return prev;
      
      const key = "custom_" + Date.now();
      const newIndicator = {
        key,
        name,
        last: 0,
        trend: "Nouveau",
        spark: [0, 0, 0, 0, 0, 0]
      };
      const newState = {
        ...prev,
        indicators: [...prev.indicators, newIndicator]
      };
      
      const { hasOnboarded, ...dataToSave } = newState;
      localStorage.setItem("pacteCycleSettings", JSON.stringify(dataToSave));
      return newState;
    });
  };

  const resetCycle = () => {
    localStorage.removeItem("pacteCycleSettings");
    setAppState({
      hasOnboarded: false,
      rdvDate: "",
      startDate: "",
      indicators: []
    });
    setScreen("suivi");
  };

  if (!appState.hasOnboarded) {
    return (
      <div className="pacte-root">
        <style>{CSS}</style>
        <div className="app-container">
          <div className="body">
            <ScreenOnboarding onComplete={handleOnboarding} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pacte-root">
      <style>{CSS}</style>
      <div className="app-container">
        <div className="body">
          {screen === "suivi" && <ScreenSuivi key="suivi" go={go} appState={appState} updateCycle={updateCycleSettings} resetCycle={resetCycle} />}
          {screen === "indicateurs" && (
            <ScreenIndicateurs key="indicateurs" go={go} openObs={openObs} appState={appState} indicators={appState.indicators} addIndicator={addIndicator} />
          )}
          {screen === "observation" && (
            <ScreenObservation key="observation" back={back} startKey={obsKey} indicators={appState.indicators} onSave={saveObservation} />
          )}
          {screen === "synthese" && <ScreenSynthese key="synthese" appState={appState} updateNotes={updatePreConsultationNotes} />}
          {screen === "ressources" && <ScreenRessources key="ressources" />}
        </div>
        <BottomNav screen={screen} go={go} />
      </div>
    </div>
  );
}
