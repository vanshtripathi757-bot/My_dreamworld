import { create } from 'zustand'

type Grade = { subject: string; score: number; attempts: number }
type GameState = {
  day: number
  minutes: number
  points: number
  reputation: number
  attendance: number
  relationships: Record<string, number>
  grades: Grade[]
  completed: string[]
  selectedClub: string | null
  lastSaved: number
  tick: () => void
  advance: (minutes: number) => void
  addPoints: (amount: number) => void
  attend: (subject: string) => void
  exam: (subject: string, score: number) => void
  joinClub: (club: string) => void
  complete: (mission: string, reward: number) => void
  relationship: (npc: string, amount: number) => void
  reset: () => void
}
const initial = { day: 1, minutes: 8 * 60, points: 0, reputation: 0, attendance: 0, relationships: {} as Record<string,number>, grades: [] as Grade[], completed: [] as string[], selectedClub: null as string | null, lastSaved: Date.now() }
export const useGame = create<GameState>((set,get) => ({
  ...initial,
  tick: () => set(s => { let minutes=s.minutes+1, day=s.day; if(minutes>=22*60){minutes=7*60;day+=1} return {...s,minutes,day,lastSaved:Date.now()} }),
  advance: (amount) => set(s => { let minutes=s.minutes+Math.max(0,amount), day=s.day; while(minutes>=22*60){minutes=7*60+(minutes-22*60);day+=1} return {...s,day,minutes,lastSaved:Date.now()} }),
  addPoints: amount => set(s=>({...s,points:Math.max(0,s.points+amount),reputation:Math.min(100,s.reputation+Math.max(0,Math.floor(amount/5))),lastSaved:Date.now()})),
  attend: subject => { const key=`attend:${get().day}:${subject}`; if(get().completed.includes(key))return; set(s=>({...s,attendance:s.attendance+1,points:s.points+10,completed:[...s.completed,key],lastSaved:Date.now()})) },
  exam: (subject,score) => set(s=>{const normalized=Math.max(0,Math.min(100,Math.round(score)));const old=s.grades.find(g=>g.subject===subject);const grades=old?s.grades.map(g=>g.subject===subject?{...g,score:Math.max(g.score,normalized),attempts:g.attempts+1}:g):[...s.grades,{subject,score:normalized,attempts:1}];return {...s,grades,points:s.points+Math.round(normalized/10),lastSaved:Date.now()}}),
  joinClub: club => set(s=>s.selectedClub===club?s:{...s,selectedClub:club,points:s.points+(s.completed.includes(`club:${club}`)?0:5),completed:s.completed.includes(`club:${club}`)?s.completed:[...s.completed,`club:${club}`],lastSaved:Date.now()}),
  complete: (mission,reward) => set(s=>s.completed.includes(mission)?s:{...s,completed:[...s.completed,mission],points:s.points+reward,reputation:Math.min(100,s.reputation+2),lastSaved:Date.now()}),
  relationship: (npc,amount) => set(s=>({...s,relationships:{...s.relationships,[npc]:Math.min(100,(s.relationships[npc]??0)+amount)},lastSaved:Date.now()})),
  reset: () => set({...initial,lastSaved:Date.now()}),
}))
