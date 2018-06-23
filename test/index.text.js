import { resolveSource, normalizeMap } from '../src/utils'

test('test resolveSource', () => {
  expect(resolveSource(action, add)).toBe(action[add])
})

test('test normalizeMap', () => {
  expect(normalizeMap(['add', 'cut'])).toBe([{ k: 'add', v: 'add' }, { k: 'cut', v: 'cut' }])
})