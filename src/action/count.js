export const addCount = (state, event) => {
    console.log(123)
    return {
        ...state,
        count: state.count + 1,
    }
}