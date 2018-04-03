const arrayThunk = ({ dispatch, getState }) => next => action => {
  if (Array.isArray(action)) {
    return action.forEach(v => dispatch(v))
  }
  return next(action)
}

export default arrayThunk
