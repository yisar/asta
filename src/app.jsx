const state = { count: 0 }

const view = ({list}) => <div>{list.map(i=><i>{i}</i>)}</div>
export { view, state }
