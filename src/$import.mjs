export function $import(url, e) {
	if (typeof window === 'undefined') {
		return url
	} else {
    console.log(url)
		const [path, mod] = url.split('#')
    console.log(path)
		import(path).then(async (mods) => {
			const newState = await mods[mod](window.__state, e)
			window.dispatch(newState)
		})
	}
}
