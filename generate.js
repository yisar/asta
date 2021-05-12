import { isComponent } from './parse.js'

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

let attributeValue = function (attribute) {
	return attribute.expression ? attribute.value : '"' + attribute.value + '"'
}

let setAttribute = function (element, attribute) {
	return 'm.sa(' + getElement(element) + ',"' + attribute.name + '",' + attributeValue(attribute) + ');'
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

let generateMount = function (element, parent, reference) {
	return reference == null ? appendChild(element, parent) : insertBefore(element, reference, parent)
}

let generateAll = function (element, parent, root, reference) {
	switch (element.type) {
		case 'text': {
			let textAttribute = element.attributes[0]
			let textElement = root.next++

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
				element.component = root.next++
				return generateComponent(element)
			} else {
				element.element = root.next++

				let createCode = setElement(element.element, createElement(element.type))
				let updateCode = ''

				for (let k = 0; k < attributes.length; k++) {
					let attribute = attributes[k]
					let attributeCode = void 0

					if (attribute.name[0] === '@') {
						let eventType = void 0,
							eventHandler = void 0

						if (attribute.name === '@bind') {
							let bindletiable = attributeValue(attribute)
							attributeCode = getElement(element.element) + '.value=' + bindletiable + ';'
							eventType = 'input'
							eventHandler = bindletiable + '=$event.target.value;instance.update();'
						} else {
							attributeCode = ''
							eventType = attribute.name.substring(1)
							eventHandler = 'locals.$event=$event;' + attributeValue(attribute) + ';'
						}

						createCode += addEventListener(element.element, eventType, 'function($event){' + eventHandler + '}')
					} else {
						attributeCode = setAttribute(element.element, attribute)
					}

					if (attribute.dynamic) {
						updateCode += attributeCode
					} else {
						createCode += attributeCode
					}
				}

				for (let l = 0; l < children.length; l++) {
					let childCode = generateAll(children[l], element, root, null)
					createCode += childCode[0]
					updateCode += childCode[1]
				}

				return [
					createCode + generateMount(element.element, parent.element, reference),
					updateCode,
					removeChild(element.element, parent.element),
				]
			}
		}
	}
}

let generateComponent = (element) => {
	let createCode = setElement(element.component, 'new m.c.' + element.type + '();')
	let updateCode = ''
	let dynamic = false

	for (let i = 0; i < attributes.length; i++) {
		let attribute = attributes[i]

		if (attribute.key[0] === '@') {
			createCode +=
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
				updateCode += attributeCode
			} else {
				createCode += attributeCode
			}
		}
	}

	createCode += getElement(element.component) + '.create(' + getElement(parent.element) + ');'

	if (dynamic) {
		updateCode += getElement(element.component) + '.update();'
	} else {
		createCode += getElement(element.component) + '.update();'
	}

	return [createCode, updateCode, getElement(element.component) + '.destroy();']
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
	for (let i$1 = root.element + 1; i$1 < root.next; i$1++) {
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
