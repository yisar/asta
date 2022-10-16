export const AddTodo = (state) => ({
    ...state,
    value: "",
    todos: state.todos.concat(state.value),
})

export const addCount = (state, event) => {
    return {
        ...state,
        count: state.count+1,
    }
}