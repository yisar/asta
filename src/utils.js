import {dispatch} from './index'
export function resolveSource(source, type) {
  return typeof type === 'function' ? type : source[type]
}

export function bindActionCreators(creators, dispatch) {
  return Object.keys(creators).reduce((ret, item) => {
    ret[item] = _bind(creators[item], dispatch)
    return ret
  }, {})
}

function _bind(creator, dispatch) {
  return () => dispatch(creator)
}

