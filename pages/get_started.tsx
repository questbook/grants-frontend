import React, { ReactElement, useState } from 'react'
import { useRouter } from 'next/router'
import Dao from '../src/components/get_started/dao'
import GetStartedComponent from '../src/components/get_started/get_started'
import Talent from '../src/components/get_started/talent'
import NavbarLayout from '../src/layout/navbarLayout'

function GetStarted() {
	// @TODO: scroll up on step change
	// @TODO: cta hidden in steps 1 and 2
	const router = useRouter()
	const [step, setStep] = useState(0)
	if(step === 0) {
		return (
			<GetStartedComponent
				onDaoClick={() => setStep(1)}
				onTalentClick={() => setStep(2)}
			/>
		)
	}

	if(step === 1) {
		return (
			<Dao
				onClick={
					() => router.push({
						pathname: '/connect_wallet',
						query: { flow: 'getting_started/dao' },
					})
				}
			/>
		)
	}

	if(step === 2) {
		return (
			<Talent
				onClick={
					() => router.push({
						pathname: '/connect_wallet',
						query: { flow: 'getting_started/developer' },
					})
				}
			/>
		)
	}
}

GetStarted.getLayout = function(page: ReactElement) {
	return (
		<NavbarLayout>
			{page}
		</NavbarLayout>
	)
}

export default GetStarted
