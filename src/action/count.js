export const addCount = (state, event) => {
    return {
        ...state,
        count: state.count + 1,
    }
}