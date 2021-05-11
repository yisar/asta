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
		case 'Text': {
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
				element.element = root.next++

				let createCode$2 = setElement(element.element, createElement(element.type))
				let updateCode$2 = ''

				for (let k = 0; k < attributes.length; k++) {
					let attribute$1 = attributes[k]
					let attributeCode$1 = void 0

					if (attribute$1.name[0] === '@') {
						let eventType = void 0,
							eventHandler = void 0

						if (attribute$1.name === '@bind') {
							let bindletiable = attributeValue(attribute$1)
							attributeCode$1 = getElement(element.element) + '.value=' + bindletiable + ';'
							eventType = 'input'
							eventHandler = bindletiable + '=$event.target.value;instance.update();'
						} else {
							attributeCode$1 = ''
							eventType = attribute$1.name.substring(1)
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
