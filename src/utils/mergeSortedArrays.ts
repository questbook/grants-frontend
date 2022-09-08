
// O(n) time & O(n) space
// from: https://www.tutorialspoint.com/merging-two-sorted-arrays-into-one-sorted-array-using-javascript
// very lazy to write my own merged-array sorting code, so pulled from the internet
export function mergeSortedArrays<T>(
	arr1: T[],
	arr2: T[],
	lessThan: (a: T, b: T) => boolean
) {
	const res = []
	let i = 0
	let j = 0
	while(i < arr1.length && j < arr2.length) {
	   if(lessThan(arr1[i], arr2[j])) {
		  res.push(arr1[i])
		  i++
	   } else {
		  res.push(arr2[j])
		  j++
	   }
	}

	;
	while(i < arr1.length) {
	   res.push(arr1[i])
	   i++
	}

	;
	while(j < arr2.length) {
	   res.push(arr2[j])
	   j++
	}

	;
	return res
}
