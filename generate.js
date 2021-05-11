import {isComponent} from './parse.js'

let getElement = function (element) {
	return 'm' + element
}

let setElement = function (element, code) {
	return getElement(element) + '=' + code
}

let createElement = function (type) {
	return 'm.ce("' + type + '");'
}

let createTextNode = function (content) {
	return 'm.ctn(' + content + ');'
}

let createComment = function () {
	return 'm.cc();'
}

let attributeValue = function (attribute) {
	return attribute.expression ? attribute.value : '"' + attribute.value + '"'
}

let setAttribute = function (element, attribute) {
	return 'm.sa(' + getElement(element) + ',"' + attribute.key + '",' + attributeValue(attribute) + ');'
}

let addEventListener = function (element, type, handler) {
	return 'm.ael(' + getElement(element) + ',"' + type + '",' + handler + ');'
}

let setTextContent = function (element, content) {
	return 'm.stc(' + getElement(element) + ',' + content + ');'
}

let appendChild = function (element, parent) {
	return 'm.ac(' + getElement(element) + ',' + getElement(parent) + ');'
}

let removeChild = function (element, parent) {
	return 'm.rc(' + getElement(element) + ',' + getElement(parent) + ');'
}

let insertBefore = function (element, reference, parent) {
	return 'm.ib(' + getElement(element) + ',' + getElement(reference) + ',' + getElement(parent) + ');'
}

let directiveIf = function (ifState, ifConditions, ifPortions, ifParent) {
	return 'm.di(' + getElement(ifState) + ',' + getElement(ifConditions) + ',' + getElement(ifPortions) + ',' + getElement(ifParent) + ');'
}

let directiveFor = function (forIdentifiers, forLocals, forValue, forPortion, forPortions, forParent) {
	return (
		'm.df(' +
		forIdentifiers +
		',' +
		getElement(forLocals) +
		',' +
		forValue +
		',' +
		getElement(forPortion) +
		',' +
		getElement(forPortions) +
		',' +
		getElement(forParent) +
		');'
	)
}

let generateMount = function (element, parent, reference) {
	return reference === null ? appendChild(element, parent) : insertBefore(element, reference, parent)
}

let generateAll = function (element, parent, root, reference) {
	switch (element.type) {
		case 'If': {
			let ifState = root.nextElement++
			let ifReference = root.nextElement++
			let ifConditions = root.nextElement++
			let ifPortions = root.nextElement++
			let ifConditionsCode = '['
			let ifPortionsCode = '['
			let separator = ''

			let siblings = parent.children
			for (let i = siblings.indexOf(element); i < siblings.length; i++) {
				let sibling = siblings[i]
				if (sibling.type === 'If' || sibling.type === 'ElseIf' || sibling.type === 'Else') {
					ifConditionsCode += separator + (sibling.type === 'Else' ? 'true' : attributeValue(sibling.attributes[0]))

					ifPortionsCode +=
						separator +
						'function(locals){' +
						generate(
							{
								element: root.nextElement,
								nextElement: root.nextElement + 1,
								type: 'Root',
								attributes: [],
								children: sibling.children,
							},
							ifReference
						) +
						'}({})'

					separator = ','
				} else {
					break
				}
			}

			return [
				setElement(ifReference, createComment()) +
					generateMount(ifReference, parent.element, reference) +
					setElement(ifPortions, ifPortionsCode + '];'),

				setElement(ifConditions, ifConditionsCode + '];') +
					setElement(ifState, directiveIf(ifState, ifConditions, ifPortions, parent.element)),

				getElement(ifState) + '[2]();',
			]
		}
		case 'ElseIf':
		case 'Else': {
			return ['', '', '']
		}
		case 'For': {
			let forAttribute = attributeValue(element.attributes[0])
			let forIdentifiers = '['
			let forValue = ''

			let forReference = root.nextElement++
			let forPortion = root.nextElement++
			let forPortions = root.nextElement++
			let forLocals = root.nextElement++

			let forIdentifier = '',
				separator$1 = ''

			for (let i$1 = 0; i$1 < forAttribute.length; i$1++) {
				let char = forAttribute[i$1]

				if (
					char === ',' ||
					(char === ' ' && forAttribute[i$1 + 1] === 'i' && forAttribute[i$1 + 2] === 'n' && forAttribute[i$1 + 3] === ' ' && (i$1 += 3))
				) {
					forIdentifiers += separator$1 + '"' + forIdentifier.substring(7) + '"'
					forIdentifier = ''
					separator$1 = ','
				} else {
					forIdentifier += char
				}
			}

			forIdentifiers += ']'
			forValue += forIdentifier

			return [
				setElement(forReference, createComment()) +
					generateMount(forReference, parent.element, reference) +
					setElement(
						forPortion,
						'function(locals){' +
							generate(
								{
									element: root.nextElement,
									nextElement: root.nextElement + 1,
									type: 'Root',
									attributes: [],
									children: element.children,
								},
								forReference
							) +
							'};'
					) +
					setElement(forPortions, '[];') +
					setElement(forLocals, '[];'),

				directiveFor(forIdentifiers, forLocals, forValue, forPortion, forPortions, parent.element),

				directiveFor(forIdentifiers, forLocals, '[]', forPortion, forPortions, parent.element),
			]
		}
		case 'Text': {
			let textAttribute = element.attributes[0]
			let textElement = root.nextElement++

			let textCode = setTextContent(textElement, attributeValue(textAttribute))
			let createCode = setElement(textElement, createTextNode('""'))
			let updateCode = ''

			if (textAttribute.dynamic) {
				updateCode += textCode
			} else {
				createCode += textCode
			}

			return [createCode + generateMount(textElement, parent.element, reference), updateCode, removeChild(textElement, parent.element)]
		}
		default: {
			let attributes = element.attributes
			let children = element.children

			if (isComponent(element.type)) {
				element.component = root.nextElement++

				let createCode$1 = setElement(element.component, 'new m.c.' + element.type + '();')
				let updateCode$1 = ''
				let dynamic = false

				for (let i$2 = 0; i$2 < attributes.length; i$2++) {
					let attribute = attributes[i$2]

					if (attribute.key[0] === '@') {
						createCode$1 +=
							getElement(element.component) +
							'.on("' +
							attribute.key.substring(1) +
							'",function($event){locals.$event=$event;' +
							attributeValue(attribute) +
							';});'
					} else {
						let attributeCode = getElement(element.component) + '.' + attribute.key + '=' + attributeValue(attribute) + ';'

						if (attribute.dynamic) {
							dynamic = true
							updateCode$1 += attributeCode
						} else {
							createCode$1 += attributeCode
						}
					}
				}

				createCode$1 += getElement(element.component) + '.create(' + getElement(parent.element) + ');'

				if (dynamic) {
					updateCode$1 += getElement(element.component) + '.update();'
				} else {
					createCode$1 += getElement(element.component) + '.update();'
				}

				return [createCode$1, updateCode$1, getElement(element.component) + '.destroy();']
			} else {
				element.element = root.nextElement++

				let createCode$2 = setElement(element.element, createElement(element.type))
				let updateCode$2 = ''

				for (let i$3 = 0; i$3 < attributes.length; i$3++) {
					let attribute$1 = attributes[i$3]
					let attributeCode$1 = void 0

					if (attribute$1.key[0] === '@') {
						let eventType = void 0,
							eventHandler = void 0

						if (attribute$1.key === '@bind') {
							let bindletiable = attributeValue(attribute$1)
							attributeCode$1 = getElement(element.element) + '.value=' + bindletiable + ';'
							eventType = 'input'
							eventHandler = bindletiable + '=$event.target.value;instance.update();'
						} else {
							attributeCode$1 = ''
							eventType = attribute$1.key.substring(1)
							eventHandler = 'locals.$event=$event;' + attributeValue(attribute$1) + ';'
						}

						createCode$2 += addEventListener(element.element, eventType, 'function($event){' + eventHandler + '}')
					} else {
						attributeCode$1 = setAttribute(element.element, attribute$1)
					}

					if (attribute$1.dynamic) {
						updateCode$2 += attributeCode$1
					} else {
						createCode$2 += attributeCode$1
					}
				}

				for (let i$4 = 0; i$4 < children.length; i$4++) {
					let childCode = generateAll(children[i$4], element, root, null)
					createCode$2 += childCode[0]
					updateCode$2 += childCode[1]
				}

				return [
					createCode$2 + generateMount(element.element, parent.element, reference),
					updateCode$2,
					removeChild(element.element, parent.element),
				]
			}
		}
	}
}

export let generate = function (root, reference) {
	let children = root.children
	let create = ''
	let update = ''
	let destroy = ''
	for (let i = 0; i < children.length; i++) {
		let generated = generateAll(children[i], root, root, reference)

		create += generated[0]
		update += generated[1]
		destroy += generated[2]
	}

	let prelude = 'let ' + getElement(root.element)
	for (let i$1 = root.element + 1; i$1 < root.nextElement; i$1++) {
		prelude += ',' + getElement(i$1)
	}

	return (
		prelude +
		';return [function(_0){' +
		setElement(root.element, '_0;') +
		create +
		'},function(){' +
		update +
		'},function(){' +
		destroy +
		'}];'
	)
}
