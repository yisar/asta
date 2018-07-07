import { resolveSource, normalizeMap, splitType } from '../src/utils'

test('test resolveSource', () => {
  expect(resolveSource(action, add)).toBe(action[add])
})

function add() {
  console.log('add')
}

test('test normalizeMap', () => {
  expect(normalizeMap(['add', 'cut'])).toBe([{ k: 'add', v: 'add' }, { k: 'cut', v: 'cut' }])
  expect(normalizeMap([add])).toBe([{ k: 'add', v: add }])
})

test('test splitType', () => {
  expect(splitType('add')).toBe('add')
  expect(splitType(add)).toBe(add)
  expect(splitType('count/add')).toBe(['count', 'add'])
})
