
// O(n) time & O(n) space
// from: https://wsvincent.com/javascript-merge-two-sorted-arrays/#:~:text=const%20flatten%20%3D%20arr%20%3D%3E%20%5B%5D,in%20our%20existing%20mergeTwo%20function.
export function mergeSortedArrays<T>(
	arr1: T[],
	arr2: T[],
	lessThan: (a: T, b: T) => boolean
) {
	const merged = []
	let index1 = 0
	let index2 = 0
	let current = 0

	while(current < (arr1.length + arr2.length)) {

		const isArr1Depleted = index1 >= arr1.length
		const isArr2Depleted = index2 >= arr2.length

		if(!isArr1Depleted && (isArr2Depleted || (lessThan(arr1[index1], arr2[index2])))) {
			merged[current] = arr1[index1]
			index1++
		} else {
			merged[current] = arr2[index2]
			index2++
		}

		current++
	}

	return merged
}
