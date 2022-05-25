import { useEffect, useState } from 'react'

const useIntersection = (element: any, rootMargin: string) => {
	const [isVisible, setState] = useState(false)

	useEffect(() => {
		const observer = new IntersectionObserver(([entry]) => {
			setState(entry.isIntersecting)
		}, { rootMargin })

		// if (!(element.current && observer.observe(element.current))) return () => {};
		if(element.current) {
			observer.observe(element.current)
		}

		const refCopy = element.current
		return () => observer.unobserve(refCopy)

	}, [])

	return isVisible
}

export default useIntersection
