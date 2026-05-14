'use client'
import { useState, useEffect, useRef } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

// ── STYLES ────────────────────────────────────────────────────────────────────
const FONT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300&family=DM+Sans:wght@300;400;500&display=swap');`

const css = `
${FONT}
* { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --cream: #F5F0E8; --warm: #EDE7D9; --stone: #C8BCA8; --ink: #1C1A17;
  --ink2: #4A4540; --ink3: #8A8178; --sage: #7A9E8A; --sage-light: #B8D4C0;
  --terra: #C17A52; --terra-light: #E8C4A8; --sky: #6B9AB8; --sky-light: #B8D4E8;
  --blush: #C4849C; --blush-light: #E8C4D4; --gold: #C4A052; --gold-light: #E8D4A0;
  --radius: 18px; --radius-sm: 10px;
}
body { font-family: 'DM Sans', sans-serif; background: var(--cream); color: var(--ink); }
.app { display: flex; min-height: 100vh; }
.sidebar { width: 72px; background: var(--ink); display: flex; flex-direction: column; align-items: center; padding: 24px 0; gap: 8px; position: fixed; top: 0; left: 0; height: 100vh; z-index: 100; }
.sidebar-logo { font-family: 'Fraunces', serif; font-size: 22px; color: var(--cream); margin-bottom: 16px; }
.nav-btn { width: 44px; height: 44px; border-radius: 12px; border: none; background: transparent; color: var(--stone); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 20px; transition: all 0.2s; }
.nav-btn:hover { background: rgba(255,255,255,0.08); color: var(--cream); }
.nav-btn.active { background: var(--cream); color: var(--ink); }
.nav-btn.signout { margin-top: auto; color: var(--stone); font-size: 16px; }
.main { margin-left: 72px; flex: 1; padding: 32px 28px; }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; }
.page-title { font-family: 'Fraunces', serif; font-size: 32px; font-weight: 400; line-height: 1.1; }
.page-date { font-size: 13px; color: var(--ink3); margin-top: 4px; }
.command-bar { background: var(--ink); border-radius: var(--radius); padding: 14px 18px; display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
.command-bar:focus-within { box-shadow: 0 0 0 2px var(--gold); }
.command-input { flex: 1; background: transparent; border: none; outline: none; color: var(--cream); font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 300; }
.command-input::placeholder { color: var(--stone); }
.command-send { background: var(--gold); border: none; border-radius: 8px; padding: 7px 14px; color: var(--ink); font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; flex-shrink: 0; }
.ai-response { background: var(--gold-light); border-radius: var(--radius-sm); padding: 12px 16px; font-size: 13px; color: var(--ink2); margin-bottom: 20px; line-height: 1.5; border-left: 3px solid var(--gold); animation: fadeIn 0.3s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.card { background: white; border-radius: var(--radius); padding: 20px; border: 1px solid rgba(0,0,0,0.06); margin-bottom: 0; }
.card-title { font-family: 'Fraunces', serif; font-size: 13px; font-weight: 500; color: var(--ink3); letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 14px; display: flex; align-items: center; justify-content: space-between; }
.today-card { background: var(--ink); color: var(--cream); border-radius: var(--radius); padding: 24px; grid-column: span 2; }
.event-row { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: var(--radius-sm); background: rgba(255,255,255,0.06); cursor: pointer; transition: background 0.15s; margin-bottom: 8px; }
.event-row:hover { background: rgba(255,255,255,0.1); }
.event-time { font-size: 12px; color: var(--stone); width: 48px; flex-shrink: 0; }
.event-name { font-size: 14px; color: var(--cream); flex: 1; }
.event-tag { font-size: 11px; padding: 3px 8px; border-radius: 20px; background: rgba(255,255,255,0.1); color: var(--stone); }
.week-strip { display: flex; gap: 8px; margin-bottom: 20px; }
.week-day { flex: 1; background: white; border-radius: var(--radius-sm); padding: 12px 8px; text-align: center; cursor: pointer; border: 1px solid transparent; transition: all 0.15s; }
.week-day:hover { border-color: var(--stone); }
.week-day.active { background: var(--ink); }
.week-day-name { font-size: 11px; color: var(--ink3); text-transform: uppercase; letter-spacing: 0.5px; }
.week-day.active .week-day-name { color: var(--stone); }
.week-day-num { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 400; color: var(--ink); line-height: 1.2; }
.week-day.active .week-day-num { color: var(--cream); }
.week-dot-row { display: flex; justify-content: center; gap: 3px; margin-top: 4px; min-height: 6px; }
.week-dot { width: 5px; height: 5px; border-radius: 50%; }
.event-item { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid var(--warm); cursor: pointer; }
.event-item:last-child { border-bottom: none; }
.event-item-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.event-item-time { font-size: 12px; color: var(--ink3); width: 40px; flex-shrink: 0; }
.event-item-name { font-size: 14px; color: var(--ink); flex: 1; }
.meal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; margin-bottom: 20px; }
.meal-day { background: white; border-radius: var(--radius-sm); padding: 12px 10px; border: 1px solid rgba(0,0,0,0.05); }
.meal-day-name { font-size: 11px; color: var(--ink3); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
.meal-day.today-meal { background: var(--sage-light); border-color: var(--sage); }
.meal-slot { font-size: 12px; padding: 6px 8px; background: var(--warm); border-radius: 6px; margin-bottom: 4px; color: var(--ink2); line-height: 1.3; cursor: pointer; min-height: 32px; display: flex; align-items: center; transition: background 0.15s; }
.meal-slot:hover { background: var(--stone); }
.meal-slot.empty { color: var(--stone); font-style: italic; }
.shopping-section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; color: var(--ink3); margin-bottom: 8px; }
.shopping-item { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid var(--warm); cursor: pointer; }
.shopping-item:last-child { border-bottom: none; }
.shopping-check { width: 18px; height: 18px; border-radius: 5px; border: 1.5px solid var(--stone); flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 11px; color: transparent; transition: all 0.15s; }
.shopping-item.checked .shopping-check { background: var(--sage); border-color: var(--sage); color: white; }
.shopping-item.checked .shopping-name { text-decoration: line-through; color: var(--stone); }
.shopping-name { font-size: 14px; color: var(--ink); flex: 1; }
.shopping-qty { font-size: 12px; color: var(--ink3); }
.modal-overlay { position: fixed; inset: 0; background: rgba(28,26,23,0.5); backdrop-filter: blur(4px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn 0.2s ease; }
.modal { background: var(--cream); border-radius: 24px; padding: 28px; width: 100%; max-width: 420px; max-height: 85vh; overflow-y: auto; }
.modal-title { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 400; margin-bottom: 20px; }
.form-field { margin-bottom: 14px; }
.form-label { font-size: 12px; color: var(--ink3); text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 6px; display: block; }
.form-input { width: 100%; padding: 11px 14px; border-radius: var(--radius-sm); border: 1.5px solid var(--warm); background: white; font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--ink); outline: none; transition: border-color 0.2s; }
.form-input:focus { border-color: var(--stone); }
.form-row { display: flex; gap: 10px; }
.form-row .form-field { flex: 1; }
.color-picker { display: flex; gap: 8px; flex-wrap: wrap; }
.color-opt { width: 28px; height: 28px; border-radius: 50%; cursor: pointer; border: 2px solid transparent; transition: transform 0.15s; }
.color-opt:hover { transform: scale(1.1); }
.color-opt.selected { border-color: var(--ink); }
.btn-row { display: flex; gap: 10px; margin-top: 20px; }
.btn-primary { flex: 1; background: var(--ink); color: var(--cream); border: none; border-radius: var(--radius-sm); padding: 12px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; transition: opacity 0.2s; }
.btn-primary:hover { opacity: 0.85; }
.btn-secondary { padding: 12px 20px; background: var(--warm); color: var(--ink2); border: none; border-radius: var(--radius-sm); font-family: 'DM Sans', sans-serif; font-size: 14px; cursor: pointer; }
.mobile-nav { display: none; position: fixed; bottom: 0; left: 0; right: 0; background: var(--ink); padding: 12px 0 20px; z-index: 100; justify-content: space-around; align-items: center; }
.mob-nav-btn { display: flex; flex-direction: column; align-items: center; gap: 4px; background: none; border: none; cursor: pointer; color: var(--stone); padding: 4px 12px; }
.mob-nav-btn.active { color: var(--cream); }
.mob-nav-icon { font-size: 22px; }
.mob-nav-label { font-size: 10px; letter-spacing: 0.4px; font-family: 'DM Sans', sans-serif; }
.section-spacer { margin-bottom: 16px; }
@media (max-width: 768px) {
  .sidebar { display: none; }
  .main { margin-left: 0; padding: 20px 16px; padding-bottom: 90px; }
  .grid-2 { grid-template-columns: 1fr; }
  .today-card { grid-column: span 1; }
  .meal-grid { grid-template-columns: repeat(4, 1fr); }
  .mobile-nav { display: flex; }
  .page-title { font-size: 26px; }
  .week-strip { gap: 5px; }
  .week-day { padding: 10px 4px; }
  .week-day-num { font-size: 17px; }
}
@media (max-width: 480px) {
  .meal-grid { grid-template-columns: repeat(3, 1fr); }
}
`

// ── CONSTANTS ─────────────────────────────────────────────────────────────────
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
const today = new Date()
const dayOfWeek = today.getDay()
const mondayOffset = (dayOfWeek === 0 ? -6 : 1 - dayOfWeek)
const weekDates = DAYS.map((_, i) => { const d = new Date(today); d.setDate(today.getDate() + mondayOffset + i); return d.getDate() })
const COLORS = { kids: '#6B9AB8', health: '#C4849C', home: '#C17A52', work: '#C4A052', social: '#7A9E8A' }

const initMeals = {
  0: { dinner: 'Chicken tacos', lunch: 'Leftovers' },
  1: { dinner: 'Pasta bake', lunch: 'Sandwiches' },
  2: { dinner: 'Stir fry', lunch: '' },
  3: { dinner: 'Fish & veg', lunch: 'Salad' },
  4: { dinner: 'Pizza night 🍕', lunch: '' },
  5: { dinner: 'BBQ', lunch: 'Snacks' },
  6: { dinner: 'Freezer meal', lunch: 'Leftovers' },
}

const initShopping = {
  Produce: [
    { id: 1, name: 'Lettuce', qty: '1 head', checked: false },
    { id: 2, name: 'Tomatoes', qty: '4', checked: false },
    { id: 3, name: 'Avocados', qty: '3', checked: false },
  ],
  Meat: [
    { id: 4, name: 'Chicken mince', qty: '500g', checked: false },
    { id: 5, name: 'Salmon fillets', qty: '4', checked: false },
  ],
  Dairy: [
    { id: 6, name: 'Full cream milk', qty: '2L', checked: false },
    { id: 7, name: 'Greek yoghurt', qty: '500g', checked: false },
  ],
  Pantry: [
    { id: 8, name: 'Tortillas', qty: '8 pack', checked: false },
    { id: 9, name: 'Pasta', qty: '500g', checked: false },
    { id: 10, name: 'Tinned tomatoes', qty: '2 cans', checked: false },
  ],
}

function processCommand(cmd) {
  const l = cmd.toLowerCase()
  if (l.includes('taco') || l.includes('dinner')) return '✅ Added tacos to Tuesday dinner and updated shopping list with tortillas, mince, lettuce & tomatoes.'
  if (l.includes('reminder') || l.includes('immunis') || l.includes('appointment')) return '✅ Reminder added: immunisation — Thursday at 10am. Tagged as Health.'
  if (l.includes('soccer') || l.includes('saturday')) return '✅ Soccer added every Saturday at 9am as a recurring event.'
  if (l.includes('away') || l.includes('weekend')) return '✅ Weekend blocked as Away — meals and tasks cleared for Sat & Sun.'
  if (l.includes('easy dinner') || l.includes('quick')) return '✅ Updated this week with 3 easy dinners: pasta, stir fry, and freezer meals.'
  if (l.includes('school') || l.includes('hat') || l.includes('excursion')) return '✅ Saved to School Hub: Hat day Friday, gold coin donation required, early pickup 1pm.'
  return '✅ Got it! I\'ve noted that for your family dashboard.'
}

// ── SUB COMPONENTS ────────────────────────────────────────────────────────────
function Dot({ color, size = 8 }) {
  return <span style={{ width: size, height: size, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
}

function AddEventModal({ onClose, onAdd }) {
  const [name, setName] = useState('')
  const [time, setTime] = useState('')
  const [dayIdx, setDayIdx] = useState(0)
  const [tag, setTag] = useState('kids')
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">Add Event</div>
        <div className="form-field">
          <label className="form-label">Event name</label>
          <input className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Swimming lessons" />
        </div>
        <div className="form-row">
          <div className="form-field">
            <label className="form-label">Time</label>
            <input className="form-input" value={time} onChange={e => setTime(e.target.value)} placeholder="4:30pm" />
          </div>
          <div className="form-field">
            <label className="form-label">Day</label>
            <select className="form-input" value={dayIdx} onChange={e => setDayIdx(Number(e.target.value))}>
              {DAYS.map((d, i) => <option key={d} value={i}>{d}</option>)}
            </select>
          </div>
        </div>
        <div className="form-field">
          <label className="form-label">Category</label>
          <div className="color-picker">
            {Object.entries(COLORS).map(([k, v]) => (
              <div key={k} className={`color-opt${tag === k ? ' selected' : ''}`} style={{ background: v }} title={k} onClick={() => setTag(k)} />
            ))}
          </div>
        </div>
        <div className="btn-row">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={() => { if (name) { onAdd({ name, time, dayIdx, tag, color: COLORS[tag] }); onClose() } }}>Add Event</button>
        </div>
      </div>
    </div>
  )
}

function AddShoppingModal({ onClose, onAdd }) {
  const [name, setName] = useState('')
  const [qty, setQty] = useState('')
  const [cat, setCat] = useState('Pantry')
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">Add Item</div>
        <div className="form-field">
          <label className="form-label">Item</label>
          <input className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Milk" />
        </div>
        <div className="form-row">
          <div className="form-field">
            <label className="form-label">Quantity</label>
            <input className="form-input" value={qty} onChange={e => setQty(e.target.value)} placeholder="2L" />
          </div>
          <div className="form-field">
            <label className="form-label">Category</label>
            <select className="form-input" value={cat} onChange={e => setCat(e.target.value)}>
              {['Produce','Meat','Dairy','Pantry'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="btn-row">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={() => { if (name) { onAdd({ name, qty, cat }); onClose() } }}>Add Item</button>
        </div>
      </div>
    </div>
  )
}

// ── VIEWS ─────────────────────────────────────────────────────────────────────
function HomeView({ events, meals }) {
  const todayEvents = events.filter(e => e.day === 0)
  const tomorrowEvents = events.filter(e => e.day === 1)
  const todayMeal = meals[0]
  const todayIdx = (dayOfWeek + 6) % 7
  return (
    <>
      <div className="week-strip">
        {DAYS.map((d, i) => {
          const evts = events.filter(e => e.day === i)
          const isToday = i === todayIdx
          return (
            <div key={d} className={`week-day${isToday ? ' active' : ''}`}>
              <div className="week-day-name">{d}</div>
              <div className="week-day-num">{weekDates[i]}</div>
              <div className="week-dot-row">
                {evts.slice(0,3).map(e => <div key={e.id} className="week-dot" style={{ background: isToday ? 'rgba(255,255,255,0.5)' : e.color }} />)}
              </div>
            </div>
          )
        })}
      </div>
      <div className="grid-2 section-spacer" style={{ gap: 16 }}>
        <div className="today-card">
          <div className="card-title" style={{ color: 'var(--stone)', marginBottom: 16 }}>
            Today · {today.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
          {todayMeal?.dinner && (
            <div style={{ marginBottom: 14, padding: '8px 12px', background: 'rgba(255,255,255,0.06)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>🍽</span>
              <span style={{ fontSize: 13, color: 'var(--stone)' }}>Dinner</span>
              <span style={{ fontSize: 14, color: 'var(--cream)', marginLeft: 4 }}>{todayMeal.dinner}</span>
            </div>
          )}
          {todayEvents.length ? todayEvents.map(e => (
            <div className="event-row" key={e.id}>
              <Dot color={e.color} />
              <span className="event-time">{e.time}</span>
              <span className="event-name">{e.name}</span>
              <span className="event-tag">{e.tag}</span>
            </div>
          )) : <div style={{ color: 'var(--stone)', fontSize: 14, padding: '12px 0' }}>Nothing scheduled — enjoy the day 🌿</div>}
        </div>
        <div className="card">
          <div className="card-title">Tomorrow</div>
          {tomorrowEvents.length ? tomorrowEvents.map(e => (
            <div className="event-item" key={e.id}>
              <div className="event-item-dot" style={{ background: e.color }} />
              <span className="event-item-time">{e.time}</span>
              <span className="event-item-name">{e.name}</span>
            </div>
          )) : <div style={{ color: 'var(--ink3)', fontSize: 14 }}>Nothing yet</div>}
        </div>
        <div className="card">
          <div className="card-title">This Week's Meals</div>
          {[0,1,2,3,4].map(i => meals[i]?.dinner ? (
            <div className="event-item" key={i}>
              <div className="event-item-dot" style={{ background: 'var(--sage)' }} />
              <span className="event-item-time">{DAYS[i]}</span>
              <span className="event-item-name">{meals[i].dinner}</span>
            </div>
          ) : null)}
        </div>
      </div>
    </>
  )
}

function CalendarView({ events, onAddEvent }) {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 18 }}>{today.toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })}</div>
        <button className="btn-primary" style={{ padding: '9px 18px', fontSize: 13 }} onClick={onAddEvent}>+ Add Event</button>
      </div>
      {DAYS.map((d, i) => {
        const dayEvts = events.filter(e => e.day === i)
        const isToday = i === (dayOfWeek + 6) % 7
        return (
          <div key={d} style={{ marginBottom: 12, opacity: dayEvts.length === 0 ? 0.5 : 1 }}>
            <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--ink3)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>{d} {weekDates[i]}</span>
              {isToday && <span style={{ background: 'var(--ink)', color: 'var(--cream)', fontSize: 10, padding: '2px 7px', borderRadius: 20 }}>Today</span>}
            </div>
            {dayEvts.length ? dayEvts.map(e => (
              <div key={e.id} style={{ background: 'white', borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, borderLeft: `3px solid ${e.color}`, marginBottom: 6 }}>
                <Dot color={e.color} />
                <span style={{ fontSize: 13, color: 'var(--ink3)', width: 52 }}>{e.time}</span>
                <span style={{ fontSize: 14, color: 'var(--ink)', flex: 1 }}>{e.name}</span>
                <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 20, background: 'var(--warm)', color: 'var(--ink3)' }}>{e.tag}</span>
              </div>
            )) : (
              <div style={{ background: 'white', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: 'var(--stone)', fontStyle: 'italic' }}>Free day</div>
            )}
          </div>
        )
      })}
    </>
  )
}

function MealsView({ meals, setMeals }) {
  const [editing, setEditing] = useState(null)
  const [val, setVal] = useState('')
  return (
    <>
      <div className="meal-grid">
        {DAYS.map((d, i) => (
          <div key={d} className={`meal-day${i === 0 ? ' today-meal' : ''}`}>
            <div className="meal-day-name">{d}</div>
            {['dinner','lunch'].map(type => (
              editing?.day === i && editing?.type === type ? (
                <input key={type} autoFocus className="form-input" style={{ fontSize: 12, padding: '4px 6px', marginBottom: 4 }}
                  value={val}
                  onChange={e => setVal(e.target.value)}
                  onBlur={() => { setMeals(m => ({ ...m, [i]: { ...m[i], [type]: val } })); setEditing(null) }}
                  onKeyDown={e => { if (e.key === 'Enter') { setMeals(m => ({ ...m, [i]: { ...m[i], [type]: val } })); setEditing(null) } }}
                />
              ) : (
                <div key={type} className={`meal-slot${!meals[i]?.[type] ? ' empty' : ''}`}
                  onClick={() => { setEditing({ day: i, type }); setVal(meals[i]?.[type] || '') }}>
                  {meals[i]?.[type] || (type === 'dinner' ? 'Add dinner' : 'Lunch?')}
                </div>
              )
            ))}
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-title">Meal Ideas</div>
        {['Chicken stir fry 🥢','Homemade pizza 🍕','Slow cooker lamb 🍖','Fish tacos 🌮','Pasta bake 🍝','Toddler-friendly fritters','Freezer lasagne'].map(m => (
          <div key={m} className="event-item">
            <div className="event-item-dot" style={{ background: 'var(--sage)' }} />
            <span className="event-item-name">{m}</span>
          </div>
        ))}
      </div>
    </>
  )
}

function ShoppingView({ shopping, setShopping, onAddItem }) {
  const toggle = (cat, id) => {
    setShopping(s => ({ ...s, [cat]: s[cat].map(item => item.id === id ? { ...item, checked: !item.checked } : item) }))
  }
  const total = Object.values(shopping).flat().length
  const done = Object.values(shopping).flat().filter(i => i.checked).length
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: 'var(--ink3)' }}>{done}/{total} items checked</div>
        <button className="btn-primary" style={{ padding: '9px 18px', fontSize: 13 }} onClick={onAddItem}>+ Add Item</button>
      </div>
      <div style={{ background: 'var(--warm)', borderRadius: 8, height: 6, marginBottom: 20, overflow: 'hidden' }}>
        <div style={{ background: 'var(--sage)', height: '100%', width: `${(done/total)*100}%`, borderRadius: 8, transition: 'width 0.3s' }} />
      </div>
      {Object.entries(shopping).map(([cat, items]) => (
        <div className="card section-spacer" key={cat}>
          <div className="shopping-section-title">{cat}</div>
          {items.map(item => (
            <div key={item.id} className={`shopping-item${item.checked ? ' checked' : ''}`} onClick={() => toggle(cat, item.id)}>
              <div className="shopping-check">{item.checked ? '✓' : ''}</div>
              <span className="shopping-name">{item.name}</span>
              <span className="shopping-qty">{item.qty}</span>
            </div>
          ))}
        </div>
      ))}
    </>
  )
}

function SchoolView() {
  const notes = [
    { icon: '🎩', title: 'Hat Day', detail: 'Friday — gold coin donation', color: COLORS.kids },
    { icon: '🏊', title: 'Swimming Weeks', detail: 'Nov 18–22 · Bring towel & cap', color: COLORS.health },
    { icon: '🚌', title: 'Farm Excursion', detail: 'Nov 29 · Permission form due Fri', color: COLORS.social },
    { icon: '📅', title: 'Last Day Term 4', detail: 'Dec 13 · 12pm finish', color: COLORS.work },
    { icon: '💉', title: 'Max Immunisation', detail: 'Thursday 10am · Dr Chen', color: COLORS.health },
  ]
  return (
    <>
      <div className="card section-spacer">
        <div className="card-title">Upcoming School Events</div>
        {notes.map((n, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < notes.length-1 ? '1px solid var(--warm)' : 'none' }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: n.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{n.icon}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{n.title}</div>
              <div style={{ fontSize: 12, color: 'var(--ink3)', marginTop: 2 }}>{n.detail}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-title">Paste School Email</div>
        <textarea className="form-input" rows={4} placeholder="Paste a school email here and AI will extract the key info…" style={{ resize: 'vertical' }} />
        <button className="btn-primary" style={{ marginTop: 10, width: '100%' }}>Extract with AI ✨</button>
      </div>
    </>
  )
}

// ── MAIN DASHBOARD ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [view, setView] = useState('home')
  const [events, setEvents] = useState([
    { id: 1, name: 'School drop-off', time: '8:30am', day: 0, tag: 'kids', color: COLORS.kids },
    { id: 2, name: 'Swimming lessons', time: '4:30pm', day: 0, tag: 'kids', color: COLORS.kids },
    { id: 3, name: 'Dr appointment', time: '6:00pm', day: 0, tag: 'health', color: COLORS.health },
    { id: 4, name: 'Grocery delivery', time: '10:00am', day: 1, tag: 'home', color: COLORS.home },
    { id: 5, name: 'Soccer', time: '9:00am', day: 5, tag: 'kids', color: COLORS.kids },
  ])
  const [meals, setMeals] = useState(initMeals)
  const [shopping, setShopping] = useState(initShopping)
  const [cmd, setCmd] = useState('')
  const [aiResp, setAiResp] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [showAddItem, setShowAddItem] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/login')
      else setUser(session.user)
    })
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const sendCommand = async () => {
    if (!cmd.trim()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    setAiResp(processCommand(cmd))
    setCmd('')
    setLoading(false)
  }

  const addEvent = ({ name, time, dayIdx, tag, color }) => {
    setEvents(ev => [...ev, { id: Date.now(), name, time, day: dayIdx, tag, color }])
  }

  const addItem = ({ name, qty, cat }) => {
    setShopping(s => ({ ...s, [cat]: [...(s[cat] || []), { id: Date.now(), name, qty, checked: false }] }))
  }

  const navItems = [
    { id: 'home', icon: '⌂', label: 'Home' },
    { id: 'calendar', icon: '◫', label: 'Calendar' },
    { id: 'meals', icon: '◉', label: 'Meals' },
    { id: 'shopping', icon: '◈', label: 'Shop' },
    { id: 'school', icon: '◧', label: 'School' },
  ]

  const titles = { home: 'Good morning 🌿', calendar: 'Calendar', meals: 'Meal Planner', shopping: 'Shopping', school: 'School Hub' }

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <nav className="sidebar">
          <div className="sidebar-logo">fo</div>
          {navItems.map(n => (
            <button key={n.id} className={`nav-btn${view === n.id ? ' active' : ''}`} onClick={() => setView(n.id)} title={n.label}>
              {n.icon}
            </button>
          ))}
          <button className="nav-btn signout" onClick={signOut} title="Sign out" style={{ marginTop: 'auto', marginBottom: 8 }}>↪</button>
        </nav>

        <main className="main">
          <div className="page-header">
            <div>
              <div className="page-title">{titles[view]}</div>
              <div className="page-date">{today.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
            </div>
            {user && <div style={{ fontSize: 12, color: 'var(--ink3)', background: 'white', padding: '6px 12px', borderRadius: 20 }}>{user.email}</div>}
          </div>

          <div className="command-bar">
            <span style={{ fontSize: 16, flexShrink: 0 }}>✦</span>
            <input className="command-input" value={cmd} onChange={e => setCmd(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendCommand()} placeholder={loading ? 'Thinking…' : 'Tell the family OS anything — events, meals, reminders…'} />
            <button className="command-send" onClick={sendCommand}>{loading ? '…' : 'Send'}</button>
          </div>

          {aiResp && (
            <div className="ai-response">
              ✦ {aiResp}
              <span style={{ float: 'right', cursor: 'pointer', color: 'var(--stone)' }} onClick={() => setAiResp(null)}>✕</span>
            </div>
          )}

          {view === 'home' && <HomeView events={events} meals={meals} />}
          {view === 'calendar' && <CalendarView events={events} onAddEvent={() => setShowAddEvent(true)} />}
          {view === 'meals' && <MealsView meals={meals} setMeals={setMeals} />}
          {view === 'shopping' && <ShoppingView shopping={shopping} setShopping={setShopping} onAddItem={() => setShowAddItem(true)} />}
          {view === 'school' && <SchoolView />}
        </main>

        <nav className="mobile-nav">
          {navItems.map(n => (
            <button key={n.id} className={`mob-nav-btn${view === n.id ? ' active' : ''}`} onClick={() => setView(n.id)}>
              <span className="mob-nav-icon">{n.icon}</span>
              <span className="mob-nav-label">{n.label}</span>
            </button>
          ))}
        </nav>

        {showAddEvent && <AddEventModal onClose={() => setShowAddEvent(false)} onAdd={addEvent} />}
        {showAddItem && <AddShoppingModal onClose={() => setShowAddItem(false)} onAdd={addItem} />}
      </div>
    </>
  )
}
