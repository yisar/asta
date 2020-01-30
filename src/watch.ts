const keyReaction = new WeakMap()
const ITERATION_KEY = Symbol('iteration key')
const IS_REACTION = Symbol('is reaction')
const reactionStack = []

function watch(fn: Function): Reaction {
  const reaction = fn[IS_REACTION]
    ? fn
    : function reaction() {
        return run(reaction, fn, this, arguments)
      }
  reaction[IS_REACTION] = true
  reaction()
  return reaction
}

function run(reaction, fn, ctx, args) {
  if (reaction.unwatch) {
    return Reflect.apply(fn, ctx, args)
  }
  if (reactionStack.indexOf(reaction) === -1) {
    try {
      reactionStack.push(reaction)
      return Reflect.apply(fn, ctx, args)
    } finally {
      reactionStack.pop()
    }
  }
}

function unwatch(reaction: Reaction): void {
  if (!reaction.unwatched) {
    reaction.unwatched = true
    releaseReaction(reaction)
  }
}

function releaseReaction(reaction: Reaction): void {
  if (reaction.cleanup) {
    reaction.cleanup.forEach((reactionsForKey: ReactionForKey) => reactionsForKey.delete(reaction))
  }
  reaction.cleanup = []
}

type Reaction = Function & {
  IS_REACTION?: boolean
  unwatched?: boolean
  cleanup?: ReactionForKey[]
}

type ReactionForKey = Set<Reaction>


