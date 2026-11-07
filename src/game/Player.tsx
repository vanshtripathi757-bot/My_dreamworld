import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { CapsuleCollider, RigidBody, type RapierRigidBody } from '@react-three/rapier'
import * as THREE from 'three'

export type MoveInput = { x: number; y: number; run: boolean; jump: number }

type Props = { input: React.MutableRefObject<MoveInput>; cameraYaw: React.MutableRefObject<number>; cameraPitch: React.MutableRefObject<number>; spawn?: [number,number,number]; onPosition?: (x:number,z:number)=>void }

function StudentModel({ motion }: { motion: React.MutableRefObject<{ moving: boolean; running: boolean }> }) {
  const leftLeg = useRef<THREE.Group>(null)
  const rightLeg = useRef<THREE.Group>(null)
  const leftArm = useRef<THREE.Group>(null)
  const rightArm = useRef<THREE.Group>(null)
  const body = useRef<THREE.Group>(null)
  useFrame(({ clock }, delta) => {
    const { moving, running } = motion.current
    const t = clock.elapsedTime * (running ? 12 : 8)
    const amount = moving ? 1 : 0
    const swing = Math.sin(t) * amount * (running ? .72 : .42)
    if (leftLeg.current) leftLeg.current.rotation.x = THREE.MathUtils.damp(leftLeg.current.rotation.x, swing, 12, delta)
    if (rightLeg.current) rightLeg.current.rotation.x = THREE.MathUtils.damp(rightLeg.current.rotation.x, -swing, 12, delta)
    if (leftArm.current) leftArm.current.rotation.x = THREE.MathUtils.damp(leftArm.current.rotation.x, -swing * .65, 12, delta)
    if (rightArm.current) rightArm.current.rotation.x = THREE.MathUtils.damp(rightArm.current.rotation.x, swing * .65, 12, delta)
    if (body.current) body.current.position.y = THREE.MathUtils.damp(body.current.position.y, moving ? Math.abs(Math.sin(t * 2)) * .035 : 0, 8, delta)
  })
  return <group>
    <group ref={body}>
      {/* legs and polished academy shoes */}
      <group ref={leftLeg} position={[-.14,.76,0]}>
        <mesh position={[0,-.2,0]} castShadow><capsuleGeometry args={[.095,.34,4,8]} /><meshStandardMaterial color="#263548" roughness={.82}/></mesh>
        <mesh position={[0,-.43,.055]} castShadow><boxGeometry args={[.2,.12,.34]}/><meshStandardMaterial color="#202a34" roughness={.55}/></mesh>
      </group>
      <group ref={rightLeg} position={[.14,.76,0]}>
        <mesh position={[0,-.2,0]} castShadow><capsuleGeometry args={[.095,.34,4,8]} /><meshStandardMaterial color="#263548" roughness={.82}/></mesh>
        <mesh position={[0,-.43,.055]} castShadow><boxGeometry args={[.2,.12,.34]}/><meshStandardMaterial color="#202a34" roughness={.55}/></mesh>
      </group>
      {/* blazer torso */}
      <mesh position={[0,1.22,0]} castShadow><capsuleGeometry args={[.27,.42,6,12]}/><meshStandardMaterial color="#30465c" roughness={.78}/></mesh>
      <mesh position={[0,1.42,.215]}><coneGeometry args={[.105,.32,4]}/><meshStandardMaterial color="#eee7d8"/></mesh>
      <mesh position={[0,1.16,.267]}><boxGeometry args={[.055,.35,.018]}/><meshStandardMaterial color="#d3b77e"/></mesh>
      <mesh position={[0,1.02,.265]}><sphereGeometry args={[.035,10,8]}/><meshStandardMaterial color="#d3b77e" metalness={.5}/></mesh>
      {/* arms */}
      <group ref={leftArm} position={[-.31,1.43,0]}><mesh position={[0,-.22,0]} rotation={[0,0,-.12]} castShadow><capsuleGeometry args={[.085,.32,4,8]}/><meshStandardMaterial color="#30465c"/></mesh><mesh position={[-.015,-.43,.015]}><sphereGeometry args={[.085,12,10]}/><meshStandardMaterial color="#e7b99d"/></mesh></group>
      <group ref={rightArm} position={[.31,1.43,0]}><mesh position={[0,-.22,0]} rotation={[0,0,.12]} castShadow><capsuleGeometry args={[.085,.32,4,8]}/><meshStandardMaterial color="#30465c"/></mesh><mesh position={[.015,-.43,.015]}><sphereGeometry args={[.085,12,10]}/><meshStandardMaterial color="#e7b99d"/></mesh></group>
      {/* neck and anime face */}
      <mesh position={[0,1.62,0]}><cylinderGeometry args={[.09,.1,.17,12]}/><meshStandardMaterial color="#e7b99d"/></mesh>
      <mesh position={[0,1.91,.015]} castShadow><sphereGeometry args={[.255,24,20]}/><meshStandardMaterial color="#f0c8aa" roughness={.8}/></mesh>
      {/* eyes */}
      {[-.095,.095].map((x,i)=><group key={i} position={[x,1.92,.238]}><mesh><sphereGeometry args={[.044,16,12]}/><meshStandardMaterial color="#f8f5ec"/></mesh><mesh position={[0,-.005,.031]}><sphereGeometry args={[.027,12,10]}/><meshStandardMaterial color="#526e7b"/></mesh><mesh position={[0,-.005,.052]}><sphereGeometry args={[.012,10,8]}/><meshStandardMaterial color="#172b3c"/></mesh></group>)}
      {/* stylised layered hair */}
      <mesh position={[0,2.08,-.015]} castShadow><sphereGeometry args={[.265,20,16,0,Math.PI*2,0,Math.PI*.62]}/><meshStandardMaterial color="#27313c" roughness={.9}/></mesh>
      {[-.18,-.08,.03,.14].map((x,i)=><mesh key={i} position={[x,2.02,.18]} rotation={[0,0,(i-1.5)*-.24]} castShadow><coneGeometry args={[.105,.31,7]}/><meshStandardMaterial color={i%2?'#303d4a':'#202a35'} roughness={.85}/></mesh>)}
      <mesh position={[0,1.78,.21]}><boxGeometry args={[.15,.018,.015]}/><meshStandardMaterial color="#bd8c7c"/></mesh>
    </group>
  </group>
}

export function Player({ input, cameraYaw, cameraPitch, spawn=[0,1,5], onPosition }: Props) {
  const body = useRef<RapierRigidBody>(null)
  const model = useRef<THREE.Group>(null)
  const wasGrounded = useRef(true)
  const jumpHandled = useRef(0)
  const motion = useRef({ moving: false, running: false })
  const lastReported = useRef(0)
  const lastSpawn = useRef(spawn.join(','))
  useFrame(({ camera }, delta) => {
    const rb = body.current
    if (!rb) return
    const spawnKey = spawn.join(',')
    if (lastSpawn.current !== spawnKey) { rb.setTranslation({x:spawn[0],y:spawn[1],z:spawn[2]}, true); rb.setLinvel({x:0,y:0,z:0}, true); lastSpawn.current=spawnKey }
    const state = input.current
    const dir = new THREE.Vector3(state.x, 0, state.y)
    if (dir.lengthSq() > 1) dir.normalize()
    const yaw = cameraYaw.current
    const forward = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw))
    const right = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw))
    const desired = forward.multiplyScalar(-dir.y).add(right.multiplyScalar(dir.x))
    const active = desired.lengthSq() > .001
    if (active) desired.normalize()
    const speed = state.run ? 6.4 : 3.25
    const current = rb.linvel()
    rb.setLinvel({ x: desired.x * speed, y: current.y, z: desired.z * speed }, true)
    motion.current.moving = active
    motion.current.running = state.run && active
    if (active && model.current) {
      const target = Math.atan2(desired.x, desired.z)
      model.current.rotation.y = THREE.MathUtils.damp(model.current.rotation.y, target, 12, delta)
    }
    const p = rb.translation()
    if (onPosition && performance.now()-lastReported.current>180) { onPosition(p.x,p.z); lastReported.current=performance.now() }
    const grounded = Math.abs(current.y) < .12 && p.y < 1.16
    if (state.jump !== jumpHandled.current && grounded && wasGrounded.current) {
      rb.applyImpulse({ x: 0, y: 5.4, z: 0 }, true)
      jumpHandled.current = state.jump
    }
    wasGrounded.current = grounded
    const pitch = cameraPitch.current
    const distance = 5.8
    const target = new THREE.Vector3(p.x, p.y + 1.45, p.z)
    const desiredCam = new THREE.Vector3(
      p.x + Math.sin(yaw) * Math.cos(pitch) * distance,
      p.y + 1.45 + Math.sin(pitch) * distance + 1.0,
      p.z + Math.cos(yaw) * Math.cos(pitch) * distance,
    )
    camera.position.lerp(desiredCam, 1 - Math.exp(-5 * delta))
    camera.lookAt(target)
  })
  return <RigidBody ref={body} colliders={false} mass={1} position={spawn} enabledRotations={[false,false,false]} linearDamping={.5} friction={1}>
    <CapsuleCollider args={[.68,.28]} friction={1}/>
    <group ref={model} position={[0,-1.23,0]}><StudentModel motion={motion}/></group>
  </RigidBody>
}
