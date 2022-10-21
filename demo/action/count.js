export const addCount = async (state, event) => {
    await new Promise(r => setTimeout(() => r(), 1000))
    return {
        ...state,
        count: state.count + 1,
    }
}