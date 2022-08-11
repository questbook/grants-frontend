export const formatMinutes = (s: number) => {
	let n = s
	const inAMonth = [43200, 1440, 60, 1]
	const suffix = ['mo', 'd', 'hr', 'min']
	const res = [0, 0, 0, 0]

	for(let i = 0; i < 4; i++) {
		res[i] = Math.floor(n / inAMonth[i])
		n = n % inAMonth[i]
	}

	// console.log('format min')
	// console.log(res)

	let ans = ''
	let i = 0

	for(; i < 4; i++) {
		if(res[i] > 0) {
			ans = `${res[i]}${suffix[i]}`
			break
		}
	}

	if(i < 3 && res[i + 1] > 0) {
		ans = `${ans} ${res[i + 1]}${suffix[i + 1]}`
	}

	// console.log(ans)
	return ans
}