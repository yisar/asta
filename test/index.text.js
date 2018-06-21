import { resolveSource } from '../src/utils'

test('test resolveSource', () => {
  expect(resolveSource(action, add)).toBe(action[add])
})
