import { createContext, useEffect, useState } from 'react'
import { init, track } from '@amplitude/analytics-browser'

const AMPLITUDE_API_KEY = process.env.AMPLITUDE_API_KEY!

const AmplitudeContext = createContext<{
  trackAmplitudeEvent: (eventName: string, eventProperties: object) => void
  	}>({
  		trackAmplitudeEvent: () => {},
  	})

const AmplitudeProvider = ({ children }: { children: React.ReactNode }) => {
	const [initialized, setInitialized] = useState(false)

	useEffect(() => {
		if(!initialized) {
			init(AMPLITUDE_API_KEY, undefined, {
				defaultTracking: {
					sessions: true,
					attribution: true,
					pageViews: true,
					formInteractions: true,
				},
			})
			setInitialized(true)
		}
	}, [initialized])

	const trackAmplitudeEvent = (eventName: string, eventProperties: object) => {
		track(eventName, eventProperties)
	}

	return (
		<AmplitudeContext.Provider value={{ trackAmplitudeEvent }}>
			{children}
		</AmplitudeContext.Provider>
	)
}

export {
	AmplitudeProvider,
	AmplitudeContext,
}