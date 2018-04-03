// 基础api

export function createStore(reducer, enhanser) {
  if (enhanser) {
    return enhanser(createStore)(reducer)
  }
  let currentState = {}
  let currentListeners = []

  function getState() {
    return currentState
  }

  function subscribe(listener) {
    return currentListeners.push(listener)
  }

  function dispatch(action) {
    currentState = reducer(currentState, action)
    currentListeners.forEach(v => v())
    return action
  }

  dispatch({ type: '@132yse/SMox' })
  return { getState, subscribe, dispatch }
}

// 多个中间件机制
export function applyMiddleware(...middlewares) {
  return createStore => (...args) => {
    const store = createStore(...args)
    let dispatch = store.dispatch

    const midApi = {
      getState: store.getState,
      dispatch: args => dispatch(args)
    }
    const middwareChain = middlewares.map(middware => middware(midApi))
    dispatch = compose(...middwareChain)(store.dispatch)
    return {
      ...store,
      dispatch
    }
  }
}

export function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }
  if (funcs.length === 1) {
    return funcs[0]
  }
  return funcs.reduce((res, item) => (...args) => res(item(...args)))
}

// 将action变成dispatch(action)
export function bindActionCreators(creators, dispatch) {
  return Object.keys(creators).reduce((ret, item) => {
    ret[item] = _bind(creators[item], dispatch)
    return ret
  }, {})
}

function _bind(creator, dispatch) {
  return (...args) => dispatch(creator(...args))
}
