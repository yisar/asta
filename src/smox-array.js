const arrayThunk = ({ dispatch, getState }) => next => action => {
  if (Array.isArray(action)) {
    action.forEach(v => next(v))
  }
  return next(action)
}

export default thunk
