import test from 'node:test'
import assert from 'node:assert/strict'
import { useGame } from '../src/store/game.ts'
import { hasSave, loadGame, saveGame } from '../src/store/persistence.ts'

const reset = () => useGame.getState().reset()
test('school clock advances and rolls to the next day at 22:00', () => {
  reset(); useGame.setState({ minutes: 21 * 60 + 59, day: 2 }); useGame.getState().tick()
  assert.equal(useGame.getState().minutes, 7 * 60)
  assert.equal(useGame.getState().day, 3)
})
test('attendance is awarded only once per subject per day', () => {
  reset(); useGame.getState().attend('Mathematics'); useGame.getState().attend('Mathematics')
  assert.equal(useGame.getState().attendance, 1)
  assert.equal(useGame.getState().points, 10)
})
test('exam keeps the best score and counts attempts', () => {
  reset(); useGame.getState().exam('Science', 72); useGame.getState().exam('Science', 61)
  assert.deepEqual(useGame.getState().grades[0], { subject: 'Science', score: 72, attempts: 2 })
})
test('relationships and reputation stay within their limits', () => {
  reset(); useGame.getState().relationship('Mika', 120); useGame.getState().addPoints(500)
  assert.equal(useGame.getState().relationships.Mika, 100)
  assert.equal(useGame.getState().reputation, 100)
})
test('mission rewards cannot be claimed twice', () => {
  reset(); useGame.getState().complete('mission:visit', 15); useGame.getState().complete('mission:visit', 15)
  assert.equal(useGame.getState().points, 15)
})
test('local save round-trips and validates saved state', () => {
  let storage = new Map()
  globalThis.localStorage = { setItem:(k,v)=>storage.set(k,v), getItem:k=>storage.get(k)??null, removeItem:k=>storage.delete(k) }
  reset(); useGame.setState({ day:4, minutes:615, points:35, selectedClub:'Science Club' })
  assert.equal(saveGame(), true); assert.equal(hasSave(), true)
  reset(); assert.equal(loadGame(), true)
  assert.equal(useGame.getState().day, 4); assert.equal(useGame.getState().minutes, 615)
  assert.equal(useGame.getState().points, 35); assert.equal(useGame.getState().selectedClub, 'Science Club')
  storage.set('school-chronicles-save-v1', '{broken'); assert.equal(loadGame(), false)
})
