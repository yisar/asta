export const logger = (store) => (next) => (mutation,payload) =>{
  console.group('commit mutation before',store.state)
  next(mutation,payload)
  console.log('commit mutation after', store.state)
console.groupEnd()
}