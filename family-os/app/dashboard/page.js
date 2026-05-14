'use client'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

const FONT = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Instrument+Sans:wght@300;400;500&display=swap');`

const css = `
${FONT}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --parchment: #F2EDE4; --paper: #FAF7F2; --linen: #EDE7DB; --linen2: #E2D9CC;
  --stone: #B8AFA3; --stone2: #9A9189; --charcoal: #2C2925; --charcoal2: #4A453F;
  --charcoal3: #6B6460; --ink: #1A1715; --moss: #6B7A5E; --rust: #8B5E3C;
  --sand: #9E8A6A; --sand-light: #E2D8C8;
}
html,body{height:100%;}
body{font-family:'Instrument Sans',sans-serif;background:var(--parchment);color:var(--charcoal);font-weight:300;-webkit-font-smoothing:antialiased;}
.app{display:grid;grid-template-columns:220px 1fr;min-height:100vh;}
.sidebar{background:var(--ink);display:flex;flex-direction:column;padding:40px 0 32px;position:fixed;top:0;left:0;width:220px;height:100vh;z-index:100;}
.sidebar-brand{padding:0 28px 36px;border-bottom:1px solid rgba(255,255,255,0.06);margin-bottom:24px;}
.brand-title{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:300;color:var(--paper);letter-spacing:0.5px;line-height:1;}
.brand-sub{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.25);margin-top:5px;}
.nav-section{padding:0 16px;flex:1;}
.nav-label{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.18);padding:0 12px;margin-bottom:8px;}
.nav-item{display:flex;align-items:center;gap:12px;padding:11px 12px;border-radius:8px;cursor:pointer;transition:all 0.2s;margin-bottom:2px;border:1px solid transparent;background:none;width:100%;text-align:left;color:rgba(255,255,255,0.38);font-family:'Instrument Sans',sans-serif;font-size:13px;font-weight:300;}
.nav-item:hover{color:rgba(255,255,255,0.75);background:rgba(255,255,255,0.04);}
.nav-item.active{color:var(--paper);background:rgba(255,255,255,0.07);border-color:rgba(255,255,255,0.07);}
.nav-icon{font-size:14px;width:18px;text-align:center;opacity:0.65;}
.nav-item.active .nav-icon{opacity:1;}
.sidebar-footer{padding:24px 28px 0;border-top:1px solid rgba(255,255,255,0.06);}
.signout-btn{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.22);background:none;border:none;cursor:pointer;font-family:'Instrument Sans',sans-serif;transition:color 0.2s;padding:0;}
.signout-btn:hover{color:rgba(255,255,255,0.5);}
.main{margin-left:220px;min-height:100vh;display:flex;flex-direction:column;}
.topbar{padding:32px 48px 0;display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:32px;}
.page-eyebrow{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:var(--stone2);margin-bottom:7px;}
.page-title{font-family:'Cormorant Garamond',serif;font-size:46px;font-weight:300;color:var(--ink);line-height:1;letter-spacing:-0.5px;}
.page-title em{font-style:italic;color:var(--charcoal3);}
.date-badge{font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:var(--stone2);background:var(--linen);border:1px solid var(--linen2);padding:7px 16px;border-radius:40px;margin-top:6px;white-space:nowrap;}
.command-wrap{padding:0 48px;margin-bottom:28px;}
.command-bar{background:var(--ink);border-radius:12px;padding:0 6px 0 20px;display:flex;align-items:center;gap:12px;height:52px;transition:box-shadow 0.3s;}
.command-bar:focus-within{box-shadow:0 0 0 1.5px var(--sand);}
.command-glyph{font-family:'Cormorant Garamond',serif;font-size:20px;color:rgba(255,255,255,0.25);flex-shrink:0;font-style:italic;}
.command-input{flex:1;background:transparent;border:none;outline:none;color:rgba(255,255,255,0.8);font-family:'Instrument Sans',sans-serif;font-size:13px;font-weight:300;}
.command-input::placeholder{color:rgba(255,255,255,0.22);}
.command-btn{background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.09);border-radius:8px;height:38px;padding:0 18px;color:rgba(255,255,255,0.55);font-family:'Instrument Sans',sans-serif;font-size:10px;letter-spacing:2px;text-transform:uppercase;cursor:pointer;transition:all 0.2s;flex-shrink:0;}
.command-btn:hover{background:rgba(255,255,255,0.12);color:rgba(255,255,255,0.9);}
.command-btn:disabled{opacity:0.4;cursor:not-allowed;}
.ai-toast{margin:-16px 48px 20px;background:var(--sand-light);border:1px solid var(--linen2);border-radius:10px;padding:12px 16px;font-size:13px;display:flex;align-items:center;gap:10px;animation:slideDown 0.25s ease;}
@keyframes slideDown{from{opacity:0;transform:translateY(-6px);}to{opacity:1;transform:translateY(0);}}
.ai-glyph{font-family:'Cormorant Garamond',serif;font-size:16px;font-style:italic;color:var(--rust);flex-shrink:0;}
.toast-close{margin-left:auto;background:none;border:none;cursor:pointer;color:var(--stone);font-size:13px;padding:0;flex-shrink:0;}
.content{padding:0 48px 64px;flex:1;}
.week-strip{display:grid;grid-template-columns:repeat(7,1fr);gap:8px;margin-bottom:28px;}
.week-cell{background:var(--paper);border:1px solid var(--linen2);border-radius:10px;padding:14px 10px 12px;text-align:center;cursor:pointer;transition:all 0.2s;}
.week-cell:hover{border-color:var(--stone);}
.week-cell.today{background:var(--ink);border-color:var(--ink);}
.wc-name{font-size:9px;letter-spacing:2.5px;text-transform:uppercase;color:var(--stone2);margin-bottom:6px;}
.week-cell.today .wc-name{color:rgba(255,255,255,0.35);}
.wc-num{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:300;color:var(--charcoal);line-height:1;}
.week-cell.today .wc-num{color:var(--paper);}
.wc-dots{display:flex;justify-content:center;gap:3px;margin-top:8px;min-height:5px;}
.wc-dot{width:4px;height:4px;border-radius:50%;}
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
.span-2{grid-column:span 2;}
.gap-b{margin-bottom:16px;}
.card{background:var(--paper);border:1px solid var(--linen2);border-radius:14px;padding:22px 24px;}
.card-dark{background:var(--ink);border-radius:14px;padding:24px 26px;}
.card-eyebrow{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:var(--stone2);margin-bottom:16px;}
.card-dark .card-eyebrow{color:rgba(255,255,255,0.22);}
.event-row-dark{display:flex;align-items:center;gap:12px;padding:11px 14px;border-radius:9px;background:rgba(255,255,255,0.04);margin-bottom:6px;border:1px solid rgba(255,255,255,0.04);}
.event-row-dark:last-child{margin-bottom:0;}
.erd-time{font-size:11px;color:rgba(255,255,255,0.28);width:44px;flex-shrink:0;}
.erd-name{font-size:13px;color:rgba(255,255,255,0.78);flex:1;font-weight:300;}
.erd-tag{font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.22);border:1px solid rgba(255,255,255,0.09);padding:3px 9px;border-radius:20px;}
.event-row-light{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--linen);}
.event-row-light:last-child{border-bottom:none;}
.erl-time{font-size:11px;color:var(--stone2);width:36px;flex-shrink:0;}
.erl-name{font-size:13px;color:var(--charcoal2);flex:1;}
.dinner-chip{display:flex;align-items:center;gap:10px;padding:10px 14px;background:rgba(255,255,255,0.04);border-radius:9px;margin-bottom:14px;border:1px solid rgba(255,255,255,0.04);}
.dinner-label{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.22);}
.dinner-name{font-size:15px;color:rgba(255,255,255,0.72);font-family:'Cormorant Garamond',serif;font-style:italic;flex:1;}
.meal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:8px;margin-bottom:20px;}
.meal-day{background:var(--paper);border:1px solid var(--linen2);border-radius:10px;padding:14px 12px;}
.meal-day.is-today{background:var(--linen);border-color:var(--stone);}
.meal-day-name{font-size:9px;letter-spacing:2.5px;text-transform:uppercase;color:var(--stone2);margin-bottom:10px;}
.meal-slot{font-size:11px;padding:7px 9px;background:var(--linen);border-radius:6px;margin-bottom:5px;color:var(--charcoal2);cursor:pointer;transition:background 0.15s;min-height:30px;display:flex;align-items:center;line-height:1.3;font-style:italic;}
.meal-slot:hover{background:var(--linen2);}
.meal-slot.empty{color:var(--stone);}
.meal-day.is-today .meal-slot{background:var(--linen2);}
.shop-cat{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:var(--stone2);margin-bottom:10px;}
.shop-item{display:flex;align-items:center;gap:12px;padding:9px 0;border-bottom:1px solid var(--linen);cursor:pointer;transition:opacity 0.15s;}
.shop-item:last-child{border-bottom:none;}
.shop-item.done{opacity:0.42;}
.shop-check{width:17px;height:17px;border-radius:4px;border:1px solid var(--stone);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:10px;color:transparent;transition:all 0.15s;}
.shop-item.done .shop-check{background:var(--moss);border-color:var(--moss);color:white;}
.shop-item.done .shop-name{text-decoration:line-through;color:var(--stone);}
.shop-name{font-size:13px;color:var(--charcoal2);flex:1;}
.shop-qty{font-size:11px;color:var(--stone2);}
.progress-bar{height:2px;background:var(--linen2);border-radius:2px;margin-bottom:24px;overflow:hidden;}
.progress-fill{height:100%;background:var(--moss);border-radius:2px;transition:width 0.4s ease;}
.school-item{display:flex;align-items:flex-start;gap:14px;padding:14px 0;border-bottom:1px solid var(--linen);}
.school-item:last-child{border-bottom:none;}
.school-icon{width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;background:var(--linen);}
.school-name{font-size:13px;color:var(--charcoal);margin-bottom:2px;font-weight:400;}
.school-detail{font-size:11px;color:var(--stone2);}
.btn-primary{background:var(--ink);color:var(--paper);border:none;border-radius:8px;padding:10px 20px;font-family:'Instrument Sans',sans-serif;font-size:10px;letter-spacing:2px;text-transform:uppercase;cursor:pointer;transition:opacity 0.2s;}
.btn-primary:hover{opacity:0.78;}
.btn-ghost{background:transparent;color:var(--charcoal3);border:1px solid var(--linen2);border-radius:8px;padding:10px 18px;font-family:'Instrument Sans',sans-serif;font-size:10px;letter-spacing:2px;text-transform:uppercase;cursor:pointer;transition:all 0.2s;}
.btn-ghost:hover{border-color:var(--stone);color:var(--charcoal);}
.modal-bg{position:fixed;inset:0;background:rgba(26,23,21,0.65);backdrop-filter:blur(6px);z-index:300;display:flex;align-items:center;justify-content:center;padding:24px;animation:fadeIn 0.2s ease;}
@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
.modal{background:var(--paper);border-radius:18px;padding:32px;width:100%;max-width:400px;max-height:90vh;overflow-y:auto;border:1px solid var(--linen2);}
.modal-title{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:300;color:var(--ink);margin-bottom:24px;}
.field{margin-bottom:16px;}
.field-label{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:var(--stone2);display:block;margin-bottom:7px;}
.field-input{width:100%;padding:10px 14px;border-radius:8px;border:1px solid var(--linen2);background:white;font-family:'Instrument Sans',sans-serif;font-size:13px;color:var(--charcoal);outline:none;transition:border-color 0.2s;font-weight:300;}
.field-input:focus{border-color:var(--stone);}
.field-row{display:flex;gap:10px;}
.field-row .field{flex:1;}
.color-row{display:flex;gap:8px;}
.color-swatch{width:26px;height:26px;border-radius:50%;cursor:pointer;border:2px solid transparent;transition:transform 0.15s,border-color 0.15s;}
.color-swatch:hover{transform:scale(1.1);}
.color-swatch.selected{border-color:var(--ink);}
.btn-row{display:flex;gap:10px;margin-top:24px;}
.mobile-nav{display:none;position:fixed;bottom:0;left:0;right:0;background:var(--ink);padding:12px 0 22px;z-index:100;border-top:1px solid rgba(255,255,255,0.05);}
.mobile-nav-inner{display:flex;justify-content:space-around;}
.mob-btn{display:flex;flex-direction:column;align-items:center;gap:4px;background:none;border:none;cursor:pointer;color:rgba(255,255,255,0.28);padding:4px 14px;font-family:'Instrument Sans',sans-serif;}
.mob-btn.active{color:rgba(255,255,255,0.85);}
.mob-icon{font-size:18px;}
.mob-label{font-size:9px;letter-spacing:1.5px;text-transform:uppercase;}
.empty{font-size:13px;color:var(--stone);font-style:italic;padding:8px 0;}
@media(max-width:900px){
  .app{grid-template-columns:1fr;}
  .sidebar{display:none;}
  .main{margin-left:0;}
  .topbar,.command-wrap,.content{padding-left:20px;padding-right:20px;}
  .ai-toast{margin-left:20px;margin-right:20px;}
  .grid-2{grid-template-columns:1fr;}
  .span-2{grid-column:span 1;}
  .mobile-nav{display:block;}
  .main{padding-bottom:80px;}
  .meal-grid{grid-template-columns:repeat(4,1fr);}
  .page-title{font-size:36px;}
}
@media(max-width:520px){
  .meal-grid{grid-template-columns:repeat(3,1fr);}
  .week-strip{gap:5px;}
  .wc-num{font-size:18px;}
}
`

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
const today = new Date()
const dow = today.getDay()
const moOff = dow === 0 ? -6 : 1 - dow
const weekDates = DAYS.map((_, i) => { const d = new Date(today); d.setDate(today.getDate() + moOff + i); return d.getDate() })
const todayIdx = (dow + 6) % 7
const COLORS = { kids: '#6B9AB8', health: '#9E8A6A', home: '#8B5E3C', work: '#6B7A5E', social: '#7A6E8A' }

const initEvents = [
  { id: 1, name: 'School drop-off', time: '8:30', day: 0, tag: 'kids', color: COLORS.kids },
  { id: 2, name: 'Swimming lessons', time: '4:30', day: 0, tag: 'kids', color: COLORS.kids },
  { id: 3, name: 'Dr appointment', time: '6:00', day: 0, tag: 'health', color: COLORS.health },
  { id: 4, name: 'Grocery delivery', time: '10:00', day: 1, tag: 'home', color: COLORS.home },
  { id: 5, name: 'Soccer', time: '9:00', day: 5, tag: 'kids', color: COLORS.kids },
]

const initMeals = {
  0: { dinner: 'Chicken tacos', lunch: 'Leftovers' },
  1: { dinner: 'Pasta bake', lunch: 'Sandwiches' },
  2: { dinner: 'Stir fry', lunch: '' },
  3: { dinner: 'Fish & veg', lunch: 'Salad' },
  4: { dinner: 'Pizza night', lunch: '' },
  5: { dinner: 'BBQ', lunch: 'Snacks' },
  6: { dinner: 'Freezer meal', lunch: 'Leftovers' },
}

const initShopping = {
  Produce: [{ id:1,name:'Lettuce',qty:'1 head',checked:false},{id:2,name:'Tomatoes',qty:'4',checked:false},{id:3,name:'Avocados',qty:'3',checked:true}],
  Meat: [{ id:4,name:'Chicken mince',qty:'500g',checked:false},{id:5,name:'Salmon fillets',qty:'4',checked:false}],
  Dairy: [{ id:6,name:'Full cream milk',qty:'2L',checked:true},{id:7,name:'Greek yoghurt',qty:'500g',checked:false}],
  Pantry: [{ id:8,name:'Tortillas',qty:'8 pack',checked:false},{id:9,name:'Pasta',qty:'500g',checked:false},{id:10,name:'Tinned tomatoes',qty:'2 cans',checked:false}],
}

function AddEventModal({ onClose, onAdd }) {
  const [name,setName]=useState(''); const [time,setTime]=useState(''); const [day,setDay]=useState(0); const [tag,setTag]=useState('kids')
  return (
    <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div className="modal-title">Add event</div>
        <div className="field"><label className="field-label">Event</label><input className="field-input" value={name} onChange={e=>setName(e.target.value)} placeholder="Swimming lessons"/></div>
        <div className="field-row">
          <div className="field"><label className="field-label">Time</label><input className="field-input" value={time} onChange={e=>setTime(e.target.value)} placeholder="4:30pm"/></div>
          <div className="field"><label className="field-label">Day</label><select className="field-input" value={day} onChange={e=>setDay(Number(e.target.value))}>{DAYS.map((d,i)=><option key={d} value={i}>{d}</option>)}</select></div>
        </div>
        <div className="field"><label className="field-label">Category</label><div className="color-row">{Object.entries(COLORS).map(([k,v])=><div key={k} className={`color-swatch${tag===k?' selected':''}`} style={{background:v}} title={k} onClick={()=>setTag(k)}/>)}</div></div>
        <div className="btn-row"><button className="btn-ghost" onClick={onClose}>Cancel</button><button className="btn-primary" onClick={()=>{if(name){onAdd({name,time,day,tag,color:COLORS[tag]});onClose()}}}>Add event</button></div>
      </div>
    </div>
  )
}

function AddItemModal({ onClose, onAdd }) {
  const [name,setName]=useState(''); const [qty,setQty]=useState(''); const [cat,setCat]=useState('Pantry')
  return (
    <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div className="modal-title">Add item</div>
        <div className="field"><label className="field-label">Item</label><input className="field-input" value={name} onChange={e=>setName(e.target.value)} placeholder="Milk"/></div>
        <div className="field-row">
          <div className="field"><label className="field-label">Qty</label><input className="field-input" value={qty} onChange={e=>setQty(e.target.value)} placeholder="2L"/></div>
          <div className="field"><label className="field-label">Category</label><select className="field-input" value={cat} onChange={e=>setCat(e.target.value)}>{['Produce','Meat','Dairy','Pantry'].map(c=><option key={c}>{c}</option>)}</select></div>
        </div>
        <div className="btn-row"><button className="btn-ghost" onClick={onClose}>Cancel</button><button className="btn-primary" onClick={()=>{if(name){onAdd({name,qty,cat});onClose()}}}>Add item</button></div>
      </div>
    </div>
  )
}

function HomeView({ events, meals }) {
  const todayEvts=events.filter(e=>e.day===0); const tomorrowEvts=events.filter(e=>e.day===1)
  return (
    <>
      <div className="week-strip">
        {DAYS.map((d,i)=>{
          const evts=events.filter(e=>e.day===i); const isT=i===todayIdx
          return (<div key={d} className={`week-cell${isT?' today':''}`}><div className="wc-name">{d}</div><div className="wc-num">{weekDates[i]}</div><div className="wc-dots">{evts.slice(0,3).map(e=><div key={e.id} className="wc-dot" style={{background:isT?'rgba(255,255,255,0.28)':e.color}}/>)}</div></div>)
        })}
      </div>
      <div className="grid-2 gap-b">
        <div className="card-dark span-2">
          <div className="card-eyebrow">today · {today.toLocaleDateString('en-AU',{weekday:'long',day:'numeric',month:'long'})}</div>
          {meals[0]?.dinner&&<div className="dinner-chip"><span className="dinner-label">Dinner</span><span className="dinner-name">{meals[0].dinner}</span></div>}
          {todayEvts.length?todayEvts.map(e=>(<div key={e.id} className="event-row-dark"><div style={{width:3,height:28,borderRadius:2,background:e.color,flexShrink:0}}/><span className="erd-time">{e.time}</span><span className="erd-name">{e.name}</span><span className="erd-tag">{e.tag}</span></div>)):<div style={{color:'rgba(255,255,255,0.18)',fontSize:13,fontStyle:'italic',padding:'8px 0'}}>Nothing scheduled today</div>}
        </div>
        <div className="card">
          <div className="card-eyebrow">tomorrow</div>
          {tomorrowEvts.length?tomorrowEvts.map(e=>(<div key={e.id} className="event-row-light"><div style={{width:3,height:22,borderRadius:2,background:e.color,flexShrink:0}}/><span className="erl-time">{e.time}</span><span className="erl-name">{e.name}</span></div>)):<div className="empty">Free day</div>}
        </div>
        <div className="card">
          <div className="card-eyebrow">this week's meals</div>
          {[0,1,2,3,4].map(i=>meals[i]?.dinner?(<div key={i} className="event-row-light"><div style={{width:3,height:22,borderRadius:2,background:'var(--moss)',flexShrink:0}}/><span className="erl-time">{DAYS[i]}</span><span className="erl-name" style={{fontStyle:'italic'}}>{meals[i].dinner}</span></div>):null)}
        </div>
      </div>
    </>
  )
}

function CalendarView({ events, onAdd }) {
  return (
    <>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
        <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:18,fontStyle:'italic',color:'var(--charcoal3)'}}>{today.toLocaleDateString('en-AU',{month:'long',year:'numeric'})}</div>
        <button className="btn-primary" onClick={onAdd}>+ Add event</button>
      </div>
      {DAYS.map((d,i)=>{
        const dayEvts=events.filter(e=>e.day===i); const isT=i===todayIdx
        return (<div key={d} style={{marginBottom:16}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
            <span style={{fontSize:9,letterSpacing:'2.5px',textTransform:'uppercase',color:'var(--stone2)'}}>{d} {weekDates[i]}</span>
            {isT&&<span style={{fontSize:9,letterSpacing:'1.5px',textTransform:'uppercase',background:'var(--ink)',color:'var(--paper)',padding:'3px 10px',borderRadius:20}}>Today</span>}
          </div>
          <div style={{opacity:dayEvts.length===0?0.38:1}}>
            {dayEvts.length?dayEvts.map(e=>(<div key={e.id} style={{background:'var(--paper)',border:'1px solid var(--linen2)',borderLeft:`3px solid ${e.color}`,borderRadius:9,padding:'11px 16px',display:'flex',alignItems:'center',gap:12,marginBottom:6}}><span style={{fontSize:12,color:'var(--stone2)',width:44,flexShrink:0}}>{e.time}</span><span style={{fontSize:13,color:'var(--charcoal2)',flex:1}}>{e.name}</span><span style={{fontSize:9,letterSpacing:'1.5px',textTransform:'uppercase',color:'var(--stone2)',border:'1px solid var(--linen2)',padding:'3px 9px',borderRadius:20}}>{e.tag}</span></div>))
            :<div style={{background:'var(--paper)',border:'1px solid var(--linen)',borderRadius:9,padding:'10px 16px',fontSize:12,color:'var(--stone)',fontStyle:'italic'}}>Free</div>}
          </div>
        </div>)
      })}
    </>
  )
}

function MealsView({ meals, setMeals }) {
  const [editing,setEditing]=useState(null); const [val,setVal]=useState('')
  return (
    <>
      <div className="meal-grid">
        {DAYS.map((d,i)=>(
          <div key={d} className={`meal-day${i===todayIdx?' is-today':''}`}>
            <div className="meal-day-name">{d}</div>
            {['dinner','lunch'].map(type=>(
              editing?.day===i&&editing?.type===type
                ?<input key={type} autoFocus className="field-input" style={{fontSize:11,padding:'5px 8px',marginBottom:5,fontStyle:'italic'}} value={val} onChange={e=>setVal(e.target.value)} onBlur={()=>{setMeals(m=>({...m,[i]:{...m[i],[type]:val}}));setEditing(null)}} onKeyDown={e=>{if(e.key==='Enter'){setMeals(m=>({...m,[i]:{...m[i],[type]:val}}));setEditing(null)}}}/>
                :<div key={type} className={`meal-slot${!meals[i]?.[type]?' empty':''}`} onClick={()=>{setEditing({day:i,type});setVal(meals[i]?.[type]||'')}}>{meals[i]?.[type]||(type==='dinner'?'dinner?':'lunch?')}</div>
            ))}
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-eyebrow">meal ideas</div>
        {['Chicken stir fry','Homemade pizza','Slow cooker lamb','Fish tacos','Pasta bake','Toddler fritters','Freezer lasagne'].map(m=>(
          <div key={m} className="event-row-light"><div style={{width:3,height:20,borderRadius:2,background:'var(--moss)',flexShrink:0}}/><span className="erl-name" style={{fontStyle:'italic'}}>{m}</span></div>
        ))}
      </div>
    </>
  )
}

function ShoppingView({ shopping, setShopping, onAdd }) {
  const toggle=(cat,id)=>setShopping(s=>({...s,[cat]:s[cat].map(i=>i.id===id?{...i,checked:!i.checked}:i)}))
  const total=Object.values(shopping).flat().length; const done=Object.values(shopping).flat().filter(i=>i.checked).length
  return (
    <>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
        <span style={{fontSize:11,color:'var(--stone2)'}}>{done} of {total} items</span>
        <button className="btn-primary" onClick={onAdd}>+ Add item</button>
      </div>
      <div className="progress-bar"><div className="progress-fill" style={{width:`${(done/total)*100}%`}}/></div>
      {Object.entries(shopping).map(([cat,items])=>(
        <div className="card gap-b" key={cat}>
          <div className="shop-cat">{cat}</div>
          {items.map(item=>(
            <div key={item.id} className={`shop-item${item.checked?' done':''}`} onClick={()=>toggle(cat,item.id)}>
              <div className="shop-check">{item.checked?'✓':''}</div>
              <span className="shop-name">{item.name}</span>
              <span className="shop-qty">{item.qty}</span>
            </div>
          ))}
        </div>
      ))}
    </>
  )
}

function SchoolView() {
  const notes=[{icon:'🎩',title:'Hat Day',detail:'Friday — gold coin donation'},{icon:'🏊',title:'Swimming Weeks',detail:'Nov 18–22 · Bring towel & cap'},{icon:'🚌',title:'Farm Excursion',detail:'Nov 29 · Permission form due Fri'},{icon:'📅',title:'Last Day Term 4',detail:'Dec 13 · 12pm finish'},{icon:'💉',title:'Max Immunisation',detail:'Thursday 10am · Dr Chen'}]
  return (
    <>
      <div className="card gap-b">
        <div className="card-eyebrow">upcoming notices</div>
        {notes.map((n,i)=>(<div key={i} className="school-item"><div className="school-icon">{n.icon}</div><div><div className="school-name">{n.title}</div><div className="school-detail">{n.detail}</div></div></div>))}
      </div>
      <div className="card">
        <div className="card-eyebrow">paste school email</div>
        <textarea className="field-input" rows={4} placeholder="Paste a school newsletter or notice here…" style={{resize:'vertical',marginBottom:12}}/>
        <button className="btn-primary">Extract with AI</button>
      </div>
    </>
  )
}

const NAV=[{id:'home',icon:'◈',label:'Home'},{id:'calendar',icon:'◫',label:'Calendar'},{id:'meals',icon:'◉',label:'Meals'},{id:'shopping',icon:'◧',label:'Shopping'},{id:'school',icon:'◦',label:'School'}]
const TITLES={home:['Good','morning'],calendar:['This','week'],meals:['Meal','planner'],shopping:['Shopping','list'],school:['School','hub']}

export default function Dashboard() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [user,setUser]=useState(null)
  const [view,setView]=useState('home')
  const [events,setEvents]=useState(initEvents)
  const [meals,setMeals]=useState(initMeals)
  const [shopping,setShopping]=useState(initShopping)
  const [cmd,setCmd]=useState('')
  const [aiResp,setAiResp]=useState(null)
  const [loading,setLoading]=useState(false)
  const [modal,setModal]=useState(null)

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
      if(!session) router.push('/login')
      else setUser(session.user)
    })
  },[])

  const signOut=async()=>{ await supabase.auth.signOut(); router.push('/login') }

  const send=async()=>{
    if(!cmd.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmd, meals, events, shopping })
      })
      const data = await res.json()
      if (data.message) setAiResp(data.message)
      if (data.updates?.meals) setMeals(m=>({...m,...data.updates.meals}))
      if (data.updates?.events) setEvents(ev=>[...ev,...data.updates.events.map(e=>({...e,id:Date.now()+Math.random()}))])
      if (data.updates?.shopping) {
        setShopping(s=>{
          const updated={...s}
          data.updates.shopping.forEach(item=>{
            const cat=item.category||'Pantry'
            if(!updated[cat]) updated[cat]=[]
            updated[cat]=[...updated[cat],{id:Date.now()+Math.random(),name:item.name,qty:item.qty||'',checked:false}]
          })
          return updated
        })
      }
    } catch(e) {
      setAiResp('Something went wrong — please try again.')
    }
    setCmd('')
    setLoading(false)
  }

  const [t1,t2]=TITLES[view]

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <nav className="sidebar">
          <div className="sidebar-brand"><div className="brand-title">family os</div><div className="brand-sub">home dashboard</div></div>
          <div className="nav-section">
            <div className="nav-label" style={{marginBottom:10}}>Navigate</div>
            {NAV.map(n=>(<button key={n.id} className={`nav-item${view===n.id?' active':''}`} onClick={()=>setView(n.id)}><span className="nav-icon">{n.icon}</span>{n.label}</button>))}
          </div>
          <div className="sidebar-footer"><button className="signout-btn" onClick={signOut}>Sign out →</button></div>
        </nav>

        <div className="main">
          <div className="topbar">
            <div><div className="page-eyebrow">family os</div><div className="page-title">{t1} <em>{t2}</em></div></div>
            <div className="date-badge">{today.toLocaleDateString('en-AU',{weekday:'short',day:'numeric',month:'short'})}</div>
          </div>

          <div className="command-wrap">
            <div className="command-bar">
              <span className="command-glyph">∿</span>
              <input className="command-input" value={cmd} onChange={e=>setCmd(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder={loading?'thinking…':'add an event, update meals, set a reminder…'}/>
              <button className="command-btn" onClick={send} disabled={loading}>{loading?'…':'Send'}</button>
            </div>
          </div>

          {aiResp&&(<div className="ai-toast"><span className="ai-glyph">∿</span><span style={{fontSize:13,color:'var(--charcoal2)',flex:1}}>{aiResp}</span><button className="toast-close" onClick={()=>setAiResp(null)}>✕</button></div>)}

          <div className="content">
            {view==='home'&&<HomeView events={events} meals={meals}/>}
            {view==='calendar'&&<CalendarView events={events} onAdd={()=>setModal('event')}/>}
            {view==='meals'&&<MealsView meals={meals} setMeals={setMeals}/>}
            {view==='shopping'&&<ShoppingView shopping={shopping} setShopping={setShopping} onAdd={()=>setModal('item')}/>}
            {view==='school'&&<SchoolView/>}
          </div>
        </div>

        <nav className="mobile-nav">
          <div className="mobile-nav-inner">
            {NAV.map(n=>(<button key={n.id} className={`mob-btn${view===n.id?' active':''}`} onClick={()=>setView(n.id)}><span className="mob-icon">{n.icon}</span><span className="mob-label">{n.label}</span></button>))}
          </div>
        </nav>

        {modal==='event'&&<AddEventModal onClose={()=>setModal(null)} onAdd={e=>setEvents(ev=>[...ev,{...e,id:Date.now()}])}/>}
        {modal==='item'&&<AddItemModal onClose={()=>setModal(null)} onAdd={({name,qty,cat})=>setShopping(s=>({...s,[cat]:[...(s[cat]||[]),{id:Date.now(),name,qty,checked:false}]}))}/>}
      </div>
    </>
  )
}
