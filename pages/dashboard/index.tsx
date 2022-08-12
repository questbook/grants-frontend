import React, { ReactElement } from 'react'
import NavbarLayout from 'src/layout/navbarLayout'
import AdminDashboard from '../../src/v2/components/Dashboard/AdminDashboard'

function Dashboard() {
	return <AdminDashboard />
}

Dashboard.getLayout = function(page: ReactElement) {
	return (
		<NavbarLayout>
			{page}
		</NavbarLayout>
	)
}

export default Dashboard
