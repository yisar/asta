export const AddTodo = (state) => ({
    ...state,
    value: "",
    todos: state.todos.concat(state.value),
})

export const AddCount = (state, event) => {
    return {
        ...state,
        count: state.count+1,
    }
}