export const checkAttr = (el: Element, name: string): string | null => {
  const val = el.getAttribute(name)
  if (val != null) el.removeAttribute(name)
  return val
}

export const listen = (
  el: Element,
  event: string,
  handler: any,
  options?: any
) => {
  el.addEventListener(event, handler, options)
}

export const isObj = (x: any): x is object => typeof x === "object";
export const isFn = (x: any): x is Function => typeof x === "function";
export const isArr = Array.isArray;
