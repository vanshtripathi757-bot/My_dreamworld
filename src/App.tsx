import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Float, OrbitControls, Sparkles, Text, useProgress } from '@react-three/drei'
import { Physics, RigidBody } from '@react-three/rapier'
import './App.css'
import { useSettings, type Settings } from './store/settings'
import { GameWorld } from './game/GameWorld'
import { TouchControls } from './game/TouchControls'
import type { MoveInput } from './game/Player'


function AcademyBuilding() {
  return <group position={[0, 0, -5]}>
    <mesh position={[0, 2.1, 0]} castShadow receiveShadow><boxGeometry args={[12, 4.2, 2.2]} /><meshStandardMaterial color="#d9d4c8" /></mesh>
    <mesh position={[0, 4.35, 0]}><boxGeometry args={[12.5, .28, 2.5]} /><meshStandardMaterial color="#27364a" /></mesh>
    {Array.from({ length: 7 }, (_, i) => <group key={i} position={[-5 + i * 1.65, 2.35, 1.13]}>
      <mesh><boxGeometry args={[.82, 1.35, .08]} /><meshStandardMaterial color="#24384b" /></mesh>
      <mesh position={[0, 0, .05]}><boxGeometry args={[.68, 1.2, .035]} /><meshStandardMaterial color="#8cb7c2" emissive="#345b70" emissiveIntensity={.25} /></mesh>
    </group>)}
    <mesh position={[0, .82, 1.16]}><boxGeometry args={[1.35, 1.65, .18]} /><meshStandardMaterial color="#293849" /></mesh>
    <mesh position={[0, 1.9, 1.2]}><boxGeometry args={[3.1, .12, .2]} /><meshStandardMaterial color="#b68b55" /></mesh>
    <Text position={[0, 3.75, 1.16]} fontSize={.42} color="#27364a" anchorX="center" outlineWidth={0.012} outlineColor="#f3ead9">ASTER ACADEMY</Text>
    <mesh position={[0, .12, 1.6]}><boxGeometry args={[2.4, .12, 1.4]} /><meshStandardMaterial color="#b7a58b" /></mesh>
  </group>
}
function Tree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return <group position={position} scale={scale}>
    <mesh position={[0, .8, 0]} castShadow><cylinderGeometry args={[.12, .18, 1.6, 8]} /><meshStandardMaterial color="#65503e" /></mesh>
    <mesh position={[0, 1.9, 0]} castShadow><icosahedronGeometry args={[.9, 1]} /><meshStandardMaterial color="#456d5a" roughness={1} /></mesh>
    <mesh position={[.35, 2.1, .1]}><icosahedronGeometry args={[.48, 1]} /><meshStandardMaterial color="#63856b" roughness={1} /></mesh>
  </group>
}
function Scene({ sensitivity }: { sensitivity: number }) {
  const trees = useMemo(() => [[-8,0,-2],[-7,0,4],[8,0,-1],[7,0,5],[-11,0,8],[11,0,9]] as [number,number,number][], [])
  return <>
    <color attach="background" args={['#a9c3d0']} />
    <fog attach="fog" args={['#a9c3d0', 18, 42]} />
    <ambientLight intensity={1.15} />
    <directionalLight position={[-7, 12, 7]} intensity={2.2} castShadow shadow-mapSize={[1024,1024]} />
    <Environment preset="city" />
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.08,0]} receiveShadow><planeGeometry args={[100,100]} /><meshStandardMaterial color="#8b9c83" /></mesh>
    <mesh position={[0,.01,2]}><boxGeometry args={[10,.08,12]} /><meshStandardMaterial color="#b9b4a8" /></mesh>
    <AcademyBuilding />
    {trees.map((p,i)=><Tree key={i} position={p} scale={i%2 ? .9 : 1.12} />)}
    <group position={[0,0,5]}>
      <mesh position={[0,.18,0]}><cylinderGeometry args={[1.5,1.5,.24,48]} /><meshStandardMaterial color="#b9a78d" /></mesh>
      <mesh position={[0,.34,0]}><cylinderGeometry args={[1.25,1.25,.08,48]} /><meshStandardMaterial color="#73928a" /></mesh>
      <mesh position={[0,.78,0]}><cylinderGeometry args={[.06,.06,.85,12]} /><meshStandardMaterial color="#e5e0d3" /></mesh>
      <mesh position={[0,1.22,0]}><sphereGeometry args={[.28,20,16]} /><meshStandardMaterial color="#d8e5df" metalness={.3} roughness={.2} /></mesh>
    </group>
    <Float speed={.5} rotationIntensity={.05} floatIntensity={.1}><Sparkles count={32} scale={[24,8,24]} size={2} speed={.2} opacity={.35} color="#fff4d8" /></Float>
    <OrbitControls makeDefault target={[0,1.7,-1]} enablePan={false} minDistance={9} maxDistance={24} minPolarAngle={Math.PI/3.5} maxPolarAngle={Math.PI/2.05} rotateSpeed={sensitivity * .5} />
  </>
}
function LoadingScreen() { const { progress } = useProgress(); return <div className="loading"><div className="loading-mark">SC</div><p>PREPARING YOUR WORLD</p><div className="load-track"><i style={{ width: `${progress}%` }} /></div><small>{Math.round(progress)}%</small></div> }
export default function App() {
  const [screen, setScreen] = useState<'menu'|'game'>('menu')
  const input = useRef<MoveInput>({x:0,y:0,run:false,jump:0})
  const cameraYaw = useRef(0)
  const cameraPitch = useRef(.28)
  const mouseDrag = useRef(false)
  const lastMouse = useRef({x:0,y:0})
  const handleCameraDelta = (dx:number,dy:number) => { cameraYaw.current -= dx*.006*settings.cameraSensitivity; cameraPitch.current = Math.max(.08,Math.min(.72,cameraPitch.current+dy*.004*settings.cameraSensitivity)) }
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [interactionPrompt,setInteractionPrompt]=useState<string|null>(null)
  const [activeDialogue,setActiveDialogue]=useState<string|null>(null)
  const [relationship,setRelationship]=useState<Record<string,number>>({})
  const handlePrompt=useCallback((label:string|null)=>setInteractionPrompt(label),[])
  const handleDialogue=useCallback((npc:string|null)=>setActiveDialogue(npc),[])
  const settings = useSettings()
  const updateSetting = settings.update
  const [loading, setLoading] = useState(true)
  useEffect(() => { const id = window.setTimeout(() => setLoading(false), 950); return () => window.clearTimeout(id) }, [])
  useEffect(() => {
    const down = (e:KeyboardEvent) => { const k=e.key.toLowerCase(); if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright',' '].includes(k)) e.preventDefault(); if(k==='w'||k==='arrowup')input.current.y=-1; if(k==='s'||k==='arrowdown')input.current.y=1; if(k==='a'||k==='arrowleft')input.current.x=-1; if(k==='d'||k==='arrowright')input.current.x=1; if(k==='shift')input.current.run=true; if(k===' ')input.current.jump++ }
    const up = (e:KeyboardEvent) => { const k=e.key.toLowerCase(); if(k==='w'||k==='s'||k==='arrowup'||k==='arrowdown')input.current.y=0; if(k==='a'||k==='d'||k==='arrowleft'||k==='arrowright')input.current.x=0; if(k==='shift')input.current.run=false }
    window.addEventListener('keydown',down);window.addEventListener('keyup',up);return()=>{window.removeEventListener('keydown',down);window.removeEventListener('keyup',up)}
  }, [])
  return <main className="game-shell">
    <div className="world" onPointerDown={e=>{if(screen==='game'&&e.pointerType==='mouse'&&e.button===0){mouseDrag.current=true;lastMouse.current={x:e.clientX,y:e.clientY}}}} onPointerMove={e=>{if(mouseDrag.current){handleCameraDelta(e.clientX-lastMouse.current.x,e.clientY-lastMouse.current.y);lastMouse.current={x:e.clientX,y:e.clientY}}}} onPointerUp={()=>{mouseDrag.current=false}} onPointerLeave={()=>{mouseDrag.current=false}}><Canvas shadows dpr={settings.quality === 'Performance' ? 1 : [1,1.5]} camera={{ position: [13,8,15], fov: 42 }}>{screen==='game' ? <GameWorld input={input} cameraYaw={cameraYaw} cameraPitch={cameraPitch} onPrompt={handlePrompt} onDialogue={handleDialogue}/> : <Physics gravity={[0,-9.81,0]}><RigidBody type="fixed" colliders={false}><Scene sensitivity={settings.cameraSensitivity} /></RigidBody></Physics>}</Canvas></div>
    <div className="vignette" />
    <header className="topbar"><div className="brand"><span className="brand-mark">SC</span><span>THE SCHOOL<br/><b>CHRONICLES</b></span></div><div className="top-meta"><span>AN ORIGINAL SCHOOL-LIFE SIMULATION</span><button className="icon-btn" onClick={()=>setSettingsOpen(true)} aria-label="Open settings">⚙</button></div></header>
    {screen === 'menu' ? <section className="hero-menu"><div className="eyebrow"><span/> A NEW SEMESTER BEGINS</div><h1>Every day holds<br/><em>a story.</em></h1><p className="intro">A place to find your people, discover hidden corners, and write a school life that is entirely your own.</p><div className="menu-actions"><button className="primary-btn" onClick={()=>{input.current={x:0,y:0,run:false,jump:0};cameraYaw.current=0;cameraPitch.current=.28;setScreen('game')}}> <span>NEW GAME</span><b>→</b></button><button className="secondary-btn" onClick={()=>setSettingsOpen(true)}>SETTINGS</button></div><div className="chapter-note"><span>01</span><div><b>THE BEGINNING</b><small>ASTER ACADEMY · FIRST DAY</small></div></div></section> : <section className="arrival-panel"><div className="eyebrow"><span/> CHAPTER 01 · THE BEGINNING</div><h2>Welcome to<br/><em>Aster Academy.</em></h2><p>Your story starts here. Explore the courtyard with WASD or the mobile joystick. Drag to look around, run and jump to find your way.</p><div className="menu-actions"><button className="primary-btn" onClick={()=>setScreen('menu')}><span>BACK TO MENU</span><b>↗</b></button></div><div className="phase-tag">PHASE 5 BUILD · NPC & DIALOGUE</div></section>}
    {screen==='game' && <><div className="game-hud"><div className="hud-brand"><span className="hud-emblem">✦</span><div><b>ASTER ACADEMY</b><small>OPEN CAMPUS · DAY 01</small></div></div><div className="hud-vitals"><span>08:00 <small>AM</small></span><i/><span>MONDAY</span></div><div className="hud-objective"><small>CURRENT OBJECTIVE</small><b>Explore the academy</b><span>Visit the courtyard and meet your classmates</span></div></div><div className="game-map"><div className="map-head"><b>ASTER CAMPUS</b><span>MAP</span></div><div className="map-art"><i className="map-road road-a"/><i className="map-road road-b"/><i className="map-building map-school"/><i className="map-building map-library"/><i className="map-building map-lab"/><i className="map-park"/><i className="map-player">▲</i></div><div className="map-foot"><span>● YOU ARE HERE</span><span>01 / 06 AREAS</span></div></div>{interactionPrompt && !activeDialogue && <button className="interact-prompt" onClick={()=>window.dispatchEvent(new KeyboardEvent('keydown',{key:'e'}))}>{interactionPrompt} <b>↵</b></button>}<TouchControls input={input} onCameraDelta={handleCameraDelta}/>{activeDialogue && <div className="dialogue-backdrop"><section className="dialogue-card"><div className="dialogue-kicker">ASTER ACADEMY · CONVERSATION</div><div className="dialogue-person">{activeDialogue}</div><div className="dialogue-role">{({Mika:'CLASS REPRESENTATIVE',Ren:'SCIENCE CLUB MEMBER',Aoi:'LIBRARY ASSISTANT'} as Record<string,string>)[activeDialogue]}</div><p className="dialogue-line">{({Mika:'You must be new here. Welcome to Aster Academy!',Ren:'The science lab is quieter after lunch. Come by sometime.',Aoi:'Looking for a book? The library has just been reorganised.'} as Record<string,string>)[activeDialogue]}</p><div className="dialogue-choices"><button onClick={()=>setRelationship(v=>({...v,[activeDialogue]:Math.min(100,(v[activeDialogue]??0)+2)}))}>Nice to meet you. (+2)</button><button onClick={()=>setRelationship(v=>({...v,[activeDialogue]:Math.min(100,(v[activeDialogue]??0)+1)}))}>Tell me about this school. (+1)</button><button onClick={()=>setActiveDialogue(null)}>I should get going.</button></div><div className="relationship-meter">RELATIONSHIP <b>{relationship[activeDialogue]??0} / 100</b></div></section></div>}</>}
    <footer className="footer"><span>© 2026 THE SCHOOL CHRONICLES</span><span>FOUNDATION BUILD <i>•</i> v0.1.0</span></footer>
    {settingsOpen && <div className="modal-backdrop" onClick={()=>setSettingsOpen(false)}><section className="settings-modal" onClick={e=>e.stopPropagation()}><div className="modal-head"><div><small>CONFIGURATION</small><h2>Settings</h2></div><button className="icon-btn" onClick={()=>setSettingsOpen(false)}>×</button></div><label>GRAPHICS QUALITY<select value={settings.quality} onChange={e=>updateSetting('quality',e.target.value as Settings['quality'])}><option>High</option><option>Balanced</option><option>Performance</option></select></label><label className="range-label">CAMERA SENSITIVITY <b>{settings.cameraSensitivity.toFixed(1)}</b><input type="range" min="0.2" max="1.5" step="0.1" value={settings.cameraSensitivity} onChange={e=>updateSetting('cameraSensitivity',Number(e.target.value))}/></label><label className="toggle-row">SOUND EFFECTS <input type="checkbox" checked={settings.sound} onChange={e=>updateSetting('sound',e.target.checked)}/></label><p className="save-note">Settings are saved automatically on this device.</p><button className="primary-btn full" onClick={()=>setSettingsOpen(false)}><span>DONE</span><b>✓</b></button></section></div>}
    {loading && <LoadingScreen />}
  </main>
}
