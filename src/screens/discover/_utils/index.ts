
/**
 *   @description Extracts the builder info from the URL
 *  @param {string} url - The URL to extract the builder info from
 */
export const extractBuilderInfo = (url?: string): boolean => {
	let params: URLSearchParams
	if(url) {
		params = new URL(url).searchParams
	} else {
		params = new URLSearchParams(window.location.search)
	}

	const builderIdStr = params.get('isBuilder')
	if(typeof builderIdStr === 'string') {
		return true
	}

	return false
}