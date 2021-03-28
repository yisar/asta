const tagOrCommentStartRE = /<\/?(?:[A-Za-z]+\w*)|<!--/
export function lex(input) {
  input = input.replace(/[\r\n]/g, '')
  let state = {
    input,
    current: 0,
    tokens: []
  }
  lexstate(state)
  return state.tokens
}

function lexstate(state) {
  let input = state.input
  let len = input.length
  while (state.current < len) {
    if (input.charAt(state.current) !== '<') {
      lexText(state)
      continue
    }
    if (input.substr(state.current, 4) === '<!--') {
      lexComment(state)
      continue
    }
    lexTag(state)
  }
}

function lexText(state) {
  let current = state.current
  let input = state.input
  let len = input.length
  let endOfText = input.substring(current).search(tagOrCommentStartRE)
  if (endOfText === -1) {
    state.tokens.push({
      type: 'text',
      value: input.slice(current)
    })
    state.current = len
    return
  } else if (endOfText !== 0) {
    endOfText += current
    let value = input.slice(current, endOfText).trim()
    if (value.length > 0) {
      state.tokens.push({
        type: 'text',
        value
      })
    }
    state.current = endOfText
  }
}

function lexComment(state) {
  let current = state.current
  let input = state.input
  let len = input.length
  current += 4
  let endOfComment = input.indexOf('-->', current)
  if (endOfComment === -1) {
    state.tokens.push({
      type: 'comment',
      value: input.slice(current)
    })
    state.current = len
  } else {
    state.tokens.push({
      type: 'comment',
      value: input.slice(current, endOfComment)
    })
    state.current = endOfComment + 3
  }
}

function lexTag(state) {
  let input = state.input
  let isCloseStart = input.charAt(state.current + 1) === '/'
  state.current += isCloseStart ? 2 : 1
  let tagToken = lexType(state)
  lexAttributes(tagToken, state)
  let isCloseEnd = input.charAt(state.current) === '/'
  state.current += isCloseEnd ? 2 : 1

  if (isCloseEnd) {
    tagToken.closeEnd = true
  }

  if (isCloseStart) {
    tagToken.closeStart = true
  }
}

function lexType(state) {
  let input = state.input
  let current = state.current
  let len = input.length
  let type = ''

  while (current < len) {
    let char = input.charAt(current)
    if (char === '/' || char === '>' || char === ' ') {
      break
    } else {
      type += char
    }
    current++
  }
  let token = {
    type: 'tag',
    value: type
  }
  state.tokens.push(token)
  state.current = current
  return token as any
}

function lexAttributes(token, state) {
  let input = state.input
  let current = state.current
  let len = input.length
  let char = input.charAt(current)
  let nextChar = input.charAt(current + 1)

  function next() {
    current++
    char = input.charAt(current)
    nextChar = input.charAt(current + 1)
  }

  let attributes = {}

  while (current < len) {
    if (char === '>' || (char === '/' && nextChar === '>')) {
      break
    }
    if (char === ' ') {
      next()
      continue
    }
    let name = ''
    let noValue = false
    while (current < len && char !== '=') {
      if (char === ' ' || char === '>' || (char === '/' && nextChar === '>')) {
        noValue = true
        break
      } else {
        name += char
      }
      next()
    }

    let value = ''
    if (noValue) {
      attributes[name] = value
      continue
    }
    next()
    let quoteType = ' '
    if (char === "'" || char === "\"") {
      quoteType = char
      next()
    }
    while (current < len && char !== quoteType) {
      value += char
      next()
    }
    next()
    attributes[name] = value
  }
  state.current = current
  token.attributes = attributes
}