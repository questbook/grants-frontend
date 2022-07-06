import { Flex } from "@chakra-ui/react";
import { ReactElement } from "react";
import NavbarLayout from "src/layout/navbarLayout";

function Dashboard() {
    return <Flex />
}

Dashboard.getLayout = function(page: ReactElement) {
	return (
		<NavbarLayout>
			{page}
		</NavbarLayout>
	)
}

export default Dashboard;