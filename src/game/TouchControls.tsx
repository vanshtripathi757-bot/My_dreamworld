import { useRef } from 'react'
import type { MoveInput } from './Player'

type Props = { input: React.MutableRefObject<MoveInput>; onCameraDelta: (dx:number,dy:number)=>void }
export function TouchControls({ input, onCameraDelta }: Props) {
  const stick = useRef<HTMLDivElement>(null)
  const pointer = useRef<number|null>(null)
  const origin = useRef({x:0,y:0})
  const cameraPointer = useRef<number|null>(null)
  const last = useRef({x:0,y:0})
  const setStick = (e: React.PointerEvent) => {
    if (pointer.current !== e.pointerId) return
    const dx = e.clientX-origin.current.x, dy=e.clientY-origin.current.y
    const len=Math.max(1,Math.hypot(dx,dy)), scale=Math.min(1,54/len)
    input.current.x=(dx*scale)/54
    input.current.y=(dy*scale)/54
    if(stick.current){const knob=stick.current.querySelector('.stick-knob') as HTMLDivElement|null;if(knob)knob.style.transform=`translate(${dx*scale}px, ${dy*scale}px)`}
  }
  const endStick = (e: React.PointerEvent) => { if(pointer.current!==e.pointerId)return;pointer.current=null;input.current.x=0;input.current.y=0;if(stick.current){const knob=stick.current.querySelector('.stick-knob') as HTMLDivElement|null;if(knob)knob.style.transform='translate(0,0)'} }
  return <div className="touch-layer">
    <div className="camera-swipe" onPointerDown={e=>{cameraPointer.current=e.pointerId;last.current={x:e.clientX,y:e.clientY};(e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId)}} onPointerMove={e=>{if(cameraPointer.current!==e.pointerId)return;const dx=e.clientX-last.current.x,dy=e.clientY-last.current.y;last.current={x:e.clientX,y:e.clientY};onCameraDelta(dx,dy)}} onPointerUp={()=>{cameraPointer.current=null}} onPointerCancel={()=>{cameraPointer.current=null}} />
    <div className="joystick" ref={stick} onPointerDown={e=>{pointer.current=e.pointerId;origin.current={x:e.clientX,y:e.clientY};(e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId)}} onPointerMove={setStick} onPointerUp={endStick} onPointerCancel={endStick}><div className="stick-knob"/></div>
    <div className="action-controls"><button className="touch-run" onPointerDown={e=>{e.preventDefault();input.current.run=true}} onPointerUp={()=>input.current.run=false} onPointerCancel={()=>input.current.run=false}>RUN</button><button className="touch-jump" onPointerDown={e=>{e.preventDefault();input.current.jump++}}>↑</button></div>
  </div>
}
