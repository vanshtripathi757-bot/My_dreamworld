import { Sparkles, Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Physics, RigidBody } from '@react-three/rapier'
import { Player, type MoveInput } from './Player'

function Tree({position,scale=1}:{position:[number,number,number];scale?:number}){return <group position={position} scale={scale}><mesh position={[0,.8,0]} castShadow><cylinderGeometry args={[.13,.19,1.6,8]}/><meshStandardMaterial color="#65503e"/></mesh><mesh position={[0,1.9,0]} castShadow><icosahedronGeometry args={[.9,1]}/><meshStandardMaterial color="#456d5a" roughness={1}/></mesh><mesh position={[.35,2.15,.1]}><icosahedronGeometry args={[.48,1]}/><meshStandardMaterial color="#66866c"/></mesh></group>}
function Building({title,position,size=[10,4,7],color='#d9d4c8',open=false}:{title:string;position:[number,number,number];size?:[number,number,number];color?:string;open?:boolean}){
 const [w,h,d]=size
 return <group position={position}>
  <mesh position={[0,h/2,0]} castShadow receiveShadow><boxGeometry args={[w,h,d]}/><meshStandardMaterial color={color}/></mesh>
  <mesh position={[0,h+.12,0]}><boxGeometry args={[w+.35,.24,d+.35]}/><meshStandardMaterial color="#293b50"/></mesh>
  <mesh position={[0,h+.38,0]}><boxGeometry args={[w*.72,.28,d*.72]}/><meshStandardMaterial color="#b68b55"/></mesh>
  {Array.from({length:Math.max(2,Math.floor(w/1.8))},(_,i)=><group key={i} position={[-w/2+1+i*(w-2)/(Math.max(1,Math.floor(w/1.8)-1)),h*.62,d/2+.012]}><mesh><boxGeometry args={[.78,1.12,.06]}/><meshStandardMaterial color="#24384b"/></mesh><mesh position={[0,0,.04]}><boxGeometry args={[.65,.98,.025]}/><meshStandardMaterial color="#8cb7c2" emissive="#345b70" emissiveIntensity={.2}/></mesh></group>)}
  <mesh position={[0,.85,d/2+.04]}><boxGeometry args={[1.25,1.7,.14]}/><meshStandardMaterial color="#26394b"/></mesh>
  <Text position={[0,h-.48,d/2+.08]} fontSize={.38} color="#26394b" anchorX="center" outlineWidth={.012} outlineColor="#eee6d7">{title.toUpperCase()}</Text>
  {open && <group position={[0,.04,d/2+.8]}><mesh position={[0,.02,0]}><boxGeometry args={[w*.55,.08,1.8]}/><meshStandardMaterial color="#b7a58b"/></mesh></group>}
 </group>
}
function Room({position,title,color}:{position:[number,number,number];title:string;color:string}){return <group position={position}>
 <mesh position={[0,1.65,0]}><boxGeometry args={[7,3.3,6]}/><meshStandardMaterial color="#e6dfd0"/></mesh>
 <mesh position={[0,3.35,0]}><boxGeometry args={[7.2,.16,6.2]}/><meshStandardMaterial color="#34465a"/></mesh>
 <mesh position={[0,1.45,2.98]}><boxGeometry args={[2.1,2.8,.08]}/><meshStandardMaterial color="#e9e2d4"/></mesh>
 <mesh position={[0,2.15,2.92]}><boxGeometry args={[2.8,.85,.12]}/><meshStandardMaterial color={color}/></mesh>
 <Text position={[0,2.17,2.99]} fontSize={.28} color="#fff" anchorX="center">{title.toUpperCase()}</Text>
 {[-1.8,0,1.8].map((x,i)=><group key={i} position={[x,.8,-.2]}><mesh position={[0,.55,0]}><boxGeometry args={[1.1,.12,.75]}/><meshStandardMaterial color="#a77e56"/></mesh><mesh position={[0,.27,-.26]}><boxGeometry args={[.1,.55,.1]}/><meshStandardMaterial color="#5a5147"/></mesh><mesh position={[0,.27,.26]}><boxGeometry args={[.1,.55,.1]}/><meshStandardMaterial color="#5a5147"/></mesh></group>)}
 </group>}
function Bench({position}:{position:[number,number,number]}){return <group position={position}><mesh position={[0,.48,0]}><boxGeometry args={[2,.13,.55]}/><meshStandardMaterial color="#9a7652"/></mesh>{[-.7,.7].map(x=><mesh key={x} position={[x,.23,0]}><boxGeometry args={[.12,.48,.45]}/><meshStandardMaterial color="#3d4d4e"/></mesh>)}</group>}
function FlowerPatch({position,scale=1}:{position:[number,number,number];scale?:number}){return <group position={position} scale={scale}>{Array.from({length:7},(_,i)=>{const a=i*2.399,r=.25+(i%3)*.16;return <group key={i} position={[Math.cos(a)*r,.08,Math.sin(a)*r]}><mesh position={[0,.12,0]} rotation={[.2,0,.2]}><boxGeometry args={[.08,.28,.07]}/><meshStandardMaterial color="#47734c"/></mesh><mesh position={[0,.28,0]}><sphereGeometry args={[.12,8,6]}/><meshStandardMaterial color={['#f4d58a','#f0a7a8','#f5eee0','#d9a7dc'][i%4]}/></mesh></group>})}</group>}
function LampPost({position}:{position:[number,number,number]}){return <group position={position}><mesh position={[0,1.6,0]}><cylinderGeometry args={[.07,.11,3.2,8]}/><meshStandardMaterial color="#45545a" metalness={.45}/></mesh><mesh position={[0,3.25,0]}><boxGeometry args={[.42,.38,.42]}/><meshStandardMaterial color="#f4d99a" emissive="#f4c76e" emissiveIntensity={.55}/></mesh><mesh position={[0,3.48,0]}><coneGeometry args={[.34,.18,8]}/><meshStandardMaterial color="#394b4c"/></mesh></group>}
function FenceLine({start,end,steps=12}:{start:[number,number,number];end:[number,number,number];steps?:number}){return <group>{Array.from({length:steps+1},(_,i)=>{const t=i/steps,x=start[0]+(end[0]-start[0])*t,z=start[2]+(end[2]-start[2])*t;return <group key={i} position={[x,0,z]}><mesh position={[0,.55,0]}><boxGeometry args={[.13,1.1,.13]}/><meshStandardMaterial color="#f0e6d0"/></mesh><mesh position={[0,.28,0]}><coneGeometry args={[.12,.22,4]}/><meshStandardMaterial color="#f0e6d0"/></mesh></group>})}<mesh position={[(start[0]+end[0])/2,.72,(start[2]+end[2])/2]}><boxGeometry args={[Math.hypot(end[0]-start[0],end[2]-start[2]),.12,.1]}/><meshStandardMaterial color="#f0e6d0"/></mesh></group>}
function GardenTree({position,sakura=false,scale=1}:{position:[number,number,number];sakura?:boolean;scale?:number}){const leaf=sakura?'#e9a9bd':'#477c50';return <group position={position} scale={scale}><mesh position={[0,1.6,0]} castShadow><cylinderGeometry args={[.2,.32,3.2,9]}/><meshStandardMaterial color="#76513a"/></mesh>{[[0,3,0],[-.7,2.8,.1],[.65,2.9,-.1],[.1,3.55,.2],[-.3,3.3,-.45]].map((v,i)=><mesh key={i} position={v as [number,number,number]} castShadow><icosahedronGeometry args={[sakura?1.05:.95,2]}/><meshStandardMaterial color={i%2===0?leaf:sakura?'#f3c4d0':'#63935d'} roughness={1}/></mesh>)}{sakura&&Array.from({length:12},(_,i)=><mesh key={i} position={[Math.sin(i*2.4)*1.25,2.5+(i%4)*.3,Math.cos(i*2.4)*1.15]}><sphereGeometry args={[.055,6,5]}/><meshStandardMaterial color="#ffe0e7"/></mesh>)}</group>}
function CampusShop({position}:{position:[number,number,number]}){return <group position={position}><mesh position={[0,1.45,0]} castShadow><boxGeometry args={[5,2.9,3.5]}/><meshStandardMaterial color="#e9d5ad"/></mesh><mesh position={[0,3.05,0]}><boxGeometry args={[5.5,.22,4]}/><meshStandardMaterial color="#6c8c69"/></mesh><mesh position={[0,2.35,1.79]}><boxGeometry args={[2.4,.85,.08]}/><meshStandardMaterial color="#8db6b0"/></mesh><mesh position={[0,3.15,1.8]}><boxGeometry args={[3.2,.42,.12]}/><meshStandardMaterial color="#416b59"/></mesh><Text position={[0,3.1,1.89]} fontSize={.28} color="#fff1cf" anchorX="center">CAMPUS SHOP</Text><mesh position={[-1.55,.65,1.85]}><boxGeometry args={[.9,1.25,.18]}/><meshStandardMaterial color="#8c6244"/></mesh><mesh position={[1.55,.65,1.85]}><boxGeometry args={[.9,1.25,.18]}/><meshStandardMaterial color="#8c6244"/></mesh></group>}
export function GameWorld({input,cameraYaw,cameraPitch,onPrompt,onDialogue}:{input:React.MutableRefObject<MoveInput>;cameraYaw:React.MutableRefObject<number>;cameraPitch:React.MutableRefObject<number>;onPrompt?:(label:string|null)=>void;onDialogue?:(npc:string|null)=>void}){
 const [activeRoom,setActiveRoom]=useState<string|null>(null)
 const [nearby,setNearby]=useState<string|null>(null)
 const [nearbyNpc,setNearbyNpc]=useState<string|null>(null)
 const npcs=useMemo(()=>[{name:'Mika',role:'Class Representative',x:-4,z:3,color:'#b76e62',line:'You must be new here. Welcome to Aster Academy!'},{name:'Ren',role:'Science Club Member',x:5,z:9,color:'#557c9b',line:'The science lab is quieter after lunch. Come by sometime.'},{name:'Aoi',role:'Library Assistant',x:-9,z:-9,color:'#8a739e',line:'Looking for a book? The library has just been reorganised.'}],[])
 const portals=useMemo(()=>[{name:'Main Academy',x:0,z:-5},{name:'Library',x:-13,z:0},{name:'Science Lab',x:13,z:0},{name:'Cafeteria',x:-13,z:16},{name:'Student Clubs',x:13,z:16},{name:'Residence',x:0,z:29}],[])
 const reportPosition=useCallback((x:number,z:number)=>{const npc=activeRoom?null:npcs.find(n=>Math.hypot(x-n.x,z-n.z)<2.7)?.name??null;setNearbyNpc(old=>old===npc?old:npc);const candidate=activeRoom ? (Math.hypot(x,z-4)<5?'EXIT':null) : portals.find(p=>Math.hypot(x-p.x,z-p.z)<(p.name==='Main Academy'?12:3.8))?.name ?? null;setNearby(old=>old===candidate?old:candidate)},[activeRoom,portals,npcs])
 useEffect(()=>{onPrompt?.(nearbyNpc?`E / TALK  ·  ${nearbyNpc.toUpperCase()}`:nearby ? (nearby==='EXIT'?'E / INTERACT  ·  EXIT BUILDING':`E / INTERACT  ·  ENTER ${nearby.toUpperCase()}`):null)},[nearby,nearbyNpc,onPrompt])
 useEffect(()=>{const enter=(e:KeyboardEvent)=>{if(e.key.toLowerCase()!=='e')return;if(nearbyNpc){onDialogue?.(nearbyNpc);return}if(!nearby)return;if(activeRoom){setActiveRoom(null);setNearby(null)}else{setActiveRoom(nearby);setNearby(null)}};window.addEventListener('keydown',enter);return()=>window.removeEventListener('keydown',enter)},[nearby,nearbyNpc,activeRoom,onDialogue])
 const roomColors:Record<string,string>={'Main Academy':'#536d78','Library':'#7b674d','Science Lab':'#547d83','Cafeteria':'#9b754e','Student Clubs':'#75658b','Residence':'#657b70'}
 const trees:[number,number,number][]=[[-17,0,-12],[-18,0,0],[-18,0,15],[18,0,-14],[18,0,0],[18,0,15],[-10,0,23],[10,0,23],[-25,0,7],[25,0,7]]
 return <>
  <color attach="background" args={['#a9c3d0']}/><fog attach="fog" args={['#a9c3d0',32,90]}/>
  <ambientLight intensity={1.05}/><directionalLight position={[-12,18,9]} intensity={2.1} castShadow shadow-mapSize={[2048,2048]}/>
  <Physics gravity={[0,-9.81,0]}>
   {activeRoom ? <RoomInterior title={activeRoom} color={roomColors[activeRoom]??'#536d78'}/> : <>
   <RigidBody type="fixed" colliders="cuboid"><mesh position={[0,-.15,0]} receiveShadow><boxGeometry args={[150,.3,150]}/><meshStandardMaterial color="#8eaa78"/></mesh></RigidBody>
   <mesh position={[0,-.005,1]}><boxGeometry args={[15,.07,28]}/><meshStandardMaterial color="#d9c9a8"/></mesh>
   <mesh position={[0,.005,-17]}><boxGeometry args={[42,.1,6]}/><meshStandardMaterial color="#9a9b8a"/></mesh>
   <mesh position={[0,.012,37]}><boxGeometry args={[70,.12,7]}/><meshStandardMaterial color="#9a9b8a"/></mesh>
   <mesh position={[-34,.01,12]}><boxGeometry args={[7,.1,55]}/><meshStandardMaterial color="#9a9b8a"/></mesh>
   <mesh position={[34,.01,12]}><boxGeometry args={[7,.1,55]}/><meshStandardMaterial color="#9a9b8a"/></mesh>
   <mesh position={[0,.025,2]}><boxGeometry args={[11,.08,24]}/><meshStandardMaterial color="#e8d8b9"/></mesh>
   <Building title="Aster Academy" position={[0,0,-8]} size={[15,5,3]} open/>
   <Building title="Library" position={[-13,0,-4]} size={[8,3.8,7]} color="#d4d0c4"/>
   <Building title="Science & Computer Labs" position={[13,0,-4]} size={[9,4,7]} color="#d7d2c5"/>
   <Building title="Cafeteria" position={[-13,0,12]} size={[9,3.8,7]} color="#e1d6c3"/>
   <Building title="Arts & Clubs" position={[13,0,12]} size={[9,3.8,7]} color="#d9d1c7"/>
   <Building title="Student Residence" position={[0,0,25]} size={[13,4.5,7]} color="#d2d4ca"/>
   <Room position={[-13,0,-4]} title="Library reading room" color="#536d78"/>
   <Room position={[13,0,-4]} title="Science laboratory" color="#547d83"/>
   <Room position={[-13,0,12]} title="Campus cafeteria" color="#9b754e"/>
   <Room position={[13,0,12]} title="Student clubs" color="#75658b"/>
   {trees.map((p,i)=><Tree key={i} position={p} scale={i%3===0?1.15:.9}/>)}
   <group position={[0,0,5]}><mesh position={[0,.15,0]}><cylinderGeometry args={[2.1,2.1,.25,48]}/><meshStandardMaterial color="#b9a78d"/></mesh><mesh position={[0,.34,0]}><cylinderGeometry args={[1.8,1.8,.1,48]}/><meshStandardMaterial color="#73928a"/></mesh><mesh position={[0,.8,0]}><cylinderGeometry args={[.08,.08,.9,12]}/><meshStandardMaterial color="#e5e0d3"/></mesh><mesh position={[0,1.3,0]}><sphereGeometry args={[.32,20,16]}/><meshStandardMaterial color="#d8e5df" metalness={.3}/></mesh></group>
   <group position={[0,0,19]}><mesh rotation={[-Math.PI/2,0,0]} position={[0,.025,0]}><planeGeometry args={[22,12]}/><meshStandardMaterial color="#638b70"/></mesh><mesh position={[0,.04,0]}><boxGeometry args={[22,.06,12]}/><meshStandardMaterial color="#638b70"/></mesh>{[-9,-4,1,6,9].map(x=><mesh key={x} position={[x,.09,0]}><boxGeometry args={[.08,.03,11]}/><meshStandardMaterial color="#e9e3ce"/></mesh>)}</group>
   {[-7,-3,1,5].map((x,i)=><group key={i} position={[x,0,-24]}><mesh position={[0,.08,0]}><boxGeometry args={[2.4,.12,5]}/><meshStandardMaterial color="#6d7476"/></mesh><mesh position={[0,.25,-1.8]}><boxGeometry args={[.12,.25,.12]}/><meshStandardMaterial color="#e7e2d4"/></mesh></group>)}
   <Bench position={[-5,0,5]}/><Bench position={[5,0,5]}/><Bench position={[-18,0,8]}/><Bench position={[18,0,8]}/>
   <GardenTree position={[-25,0,-18]} sakura scale={1.35}/><GardenTree position={[25,0,-19]} scale={1.2}/><GardenTree position={[-27,0,28]} sakura scale={1.1}/><GardenTree position={[27,0,27]} scale={1.25}/><GardenTree position={[0,0,43]} scale={1.45}/>
   <FlowerPatch position={[-8,0,8]} scale={1.5}/><FlowerPatch position={[8,0,8]} scale={1.5}/><FlowerPatch position={[-20,0,18]} scale={1.8}/><FlowerPatch position={[20,0,18]} scale={1.8}/><FlowerPatch position={[-8,0,31]} scale={1.4}/><FlowerPatch position={[8,0,31]} scale={1.4}/>
   <LampPost position={[-8,0,-1]}/><LampPost position={[8,0,-1]}/><LampPost position={[-8,0,14]}/><LampPost position={[8,0,14]}/><LampPost position={[-4,0,36]}/><LampPost position={[4,0,36]}/>
   <FenceLine start={[-25,0,-27]} end={[-25,0,34]} steps={18}/><FenceLine start={[25,0,-27]} end={[25,0,34]} steps={18}/><FenceLine start={[-25,0,34]} end={[25,0,34]} steps={18}/>
   <CampusShop position={[19,0,29]}/>
   {npcs.map(n=><StudentNPC key={n.name} {...n} active={nearbyNpc===n.name}/>)}
   <Player key="campus-player" input={input} cameraYaw={cameraYaw} cameraPitch={cameraPitch} onPosition={reportPosition}/>
   </>}
   {activeRoom && <Player key={activeRoom} input={input} cameraYaw={cameraYaw} cameraPitch={cameraPitch} spawn={[0,1,1]} onPosition={reportPosition}/>}
  </Physics>
  <Sparkles count={38} scale={[50,8,50]} size={1.5} speed={.12} opacity={.25} color="#fff4d8"/>
 </>
}

function RoomInterior({title,color}:{title:string;color:string}){return <group>
 <RigidBody type="fixed" colliders="cuboid"><mesh position={[0,-.15,0]} receiveShadow><boxGeometry args={[18,.3,18]}/><meshStandardMaterial color="#b8b2a4"/></mesh></RigidBody>
 {([[0,2,-9],[0,2,9],[-9,2,0],[9,2,0]] as [number,number,number][]).map((p,i)=><RigidBody key={i} type="fixed" colliders="cuboid"><mesh position={p}><boxGeometry args={i<2?[18,4,.3]:[.3,4,18]}/><meshStandardMaterial color="#e4ded1"/></mesh></RigidBody>)}
 <mesh position={[0,3.9,0]}><boxGeometry args={[18,.2,18]}/><meshStandardMaterial color="#35475a"/></mesh>
 <Text position={[0,3.25,-8.78]} fontSize={.65} color={color} anchorX="center">{title.toUpperCase()}</Text>
 {[-5,-2,2,5].map((x,i)=><group key={i} position={[x,0,-2]}><mesh position={[0,.78,0]}><boxGeometry args={[2,.14,1.2]}/><meshStandardMaterial color="#a77e56"/></mesh><mesh position={[0,.38,-.45]}><boxGeometry args={[.12,.75,.12]}/><meshStandardMaterial color="#5a5147"/></mesh><mesh position={[0,.38,.45]}><boxGeometry args={[.12,.75,.12]}/><meshStandardMaterial color="#5a5147"/></mesh></group>)}
 <mesh position={[-7,1.5,0]}><boxGeometry args={[.6,2.7,5]}/><meshStandardMaterial color={color}/></mesh>
 <Text position={[0,2.7,7.5]} fontSize={.28} color="#fff" anchorX="center">EXIT · WALK TO THE DOOR</Text>
 </group>}

function StudentNPC({name,role,x,z,color,active}:{name:string;role:string;x:number;z:number;color:string;active:boolean}){
 const ref=useRef<THREE.Group>(null)
 useFrame(({clock},delta)=>{if(ref.current){ref.current.position.y=THREE.MathUtils.damp(ref.current.position.y,Math.sin(clock.elapsedTime*1.8+x)*.045,5,delta);ref.current.rotation.y=THREE.MathUtils.damp(ref.current.rotation.y,active?Math.PI:Math.sin(clock.elapsedTime*.4+x)*.12,3,delta)}})
 return <group ref={ref} position={[x,0,z]}>
  <mesh position={[0,1.15,0]} castShadow><capsuleGeometry args={[.27,.55,5,10]}/><meshStandardMaterial color={color}/></mesh>
  <mesh position={[0,1.92,0]} castShadow><sphereGeometry args={[.24,20,16]}/><meshStandardMaterial color="#edc4a6"/></mesh>
  <mesh position={[0,2.08,-.025]}><sphereGeometry args={[.25,18,12,0,Math.PI*2,0,Math.PI*.62]}/><meshStandardMaterial color="#303b4a"/></mesh>
  {[-.085,.085].map((a,i)=><mesh key={i} position={[a,1.94,.214]}><sphereGeometry args={[.027,10,8]}/><meshStandardMaterial color="#283849"/></mesh>)}
  <Text position={[0,2.45,0]} fontSize={.2} color={active?'#f4d49c':'#fff'} anchorX="center" outlineWidth={.015} outlineColor="#24313b">{name}</Text>
  <Text position={[0,2.2,0]} fontSize={.09} color="#d8e1e1" anchorX="center">{role}</Text>
 </group>
}
