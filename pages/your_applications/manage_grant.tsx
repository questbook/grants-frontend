import {
  Container, Flex, Image, Box, Text, Button,
} from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import { gql } from '@apollo/client';
import moment from 'moment';
import Sidebar from '../../src/components/your_applications/manage_grant/sidebar';
import Breadcrumbs from '../../src/components/ui/breadcrumbs';
import Heading from '../../src/components/ui/heading';
import MilestoneTable from '../../src/components/your_applications/manage_grant/milestoneTable';
import FundingRequestedTable from '../../src/components/your_applications/manage_grant/fundingRequestedTable';
import NavbarLayout from '../../src/layout/navbarLayout';
import { ApiClientsContext } from '../_app';
import { getApplicationDetails } from '../../src/graphql/daoQueries';
import { getAssetInfo } from '../../src/utils/tokenUtils';
import { useApplicationMilestones } from '../../src/graphql/queries';

function ManageGrant() {
  const [applicationData, setApplicationData] = useState<any>({
    grantTitle: '',
    applicantAddress: '',
    applicantEmail: '',
    applicationDate: '',
    grant: null,
    id: '',
  });

  const [applicationID, setApplicationID] = useState<any>('');
  const router = useRouter();
  const subgraphClient = useContext(ApiClientsContext)?.subgraphClient;
  const [{ data: accountData }] = useAccount({
    fetchEns: false,
  });

  const { data: { milestones, rewardAsset }, refetch } = useApplicationMilestones(applicationID);
  const fundingIcon = getAssetInfo(rewardAsset)?.icon;
  const assetInfo = getAssetInfo(rewardAsset);

  const tabs = [
    {
      title: milestones.length.toString(),
      subtitle: milestones.length === 1 ? 'Milestone' : 'Milestones',
    },
    {
      icon: fundingIcon,
      title: '0',
      subtitle: 'Funding Requested',
    },
    {
      icon: fundingIcon,
      title: '20',
      subtitle: 'Funding Received',
    },
  ];

  const getGrantData = async () => {
    if (!subgraphClient || !accountData?.address) return;
    try {
      const { data } = (await subgraphClient.client.query({
        query: gql(getApplicationDetails),
        variables: {
          applicationID,
        },
      })) as any;
      if (data && data.grantApplication) {
        const application = data.grantApplication;
        // console.log(application);
        setApplicationData({
          title: application.grant.title,
          applicantAddress: application.applicantId,
          applicantEmail: application.fields.find((field: any) => field.id.includes('applicantEmail'))?.value[0],
          applicationDate: moment.unix(application.createdAtS).format('D MMMM YYYY'),
          grant: application.grant,
          id: application.id,
        });
      }
    } catch (e: any) {
      // console.log(e);
    }
  };

  useEffect(() => {
    setApplicationID(router?.query?.applicationID ?? '');
  }, [router, accountData]);

  useEffect(() => {
    if (!subgraphClient || !accountData?.address) return;
    if (!applicationID || applicationID.length < 1) return;
    getGrantData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationID, accountData?.address]);

  const [selected, setSelected] = React.useState(0);
  return (
    <Container maxW="100%" display="flex" px="70px">
      <Container
        flex={1}
        display="flex"
        flexDirection="column"
        maxW="834px"
        alignItems="stretch"
        pb={8}
        px={10}
      >
        <Breadcrumbs path={['Your Applications', 'Manage Grant']} />
        <Heading mt="18px" title={applicationData.title} />
        <Box mt={5} />

        <Flex direction="row" w="full" align="center">
          {tabs.map((tab, index) => (
            <Button
              variant="ghost"
              h="110px"
              w="full"
              _hover={{
                background: '#F5F5F5',
              }}
              background={index !== selected ? 'linear-gradient(180deg, #FFFFFF 0%, #F3F4F4 100%)' : 'white'}
              _focus={{}}
              borderRadius={index !== selected ? 0 : '8px 8px 0px 0px'}
              borderRightWidth={((index !== (tabs.length - 1) && index + 1 !== selected) || index === selected) ? '2px' : '0px'}
              borderLeftWidth={index !== selected ? 0 : '2px'}
              borderTopWidth={index !== selected ? 0 : '2px'}
              borderBottomWidth={index !== selected ? '2px' : 0}
              borderBottomRightRadius="-2px"
              onClick={() => (index !== tabs.length - 1 ? setSelected(index) : null)}
            >
              <Flex direction="column" justify="center" align="center" w="100%">
                <Flex direction="row" justify="center" align="center">
                  {tab.icon && <Image h="26px" w="26px" src={tab.icon} alt={tab.icon} />}
                  <Box mx={1} />
                  <Text fontWeight="700" fontSize="26px" lineHeight="40px">
                    {tab.title}
                  </Text>
                </Flex>
                <Text variant="applicationText" color="#717A7C">{tab.subtitle}</Text>
              </Flex>
            </Button>
          ))}
        </Flex>

        {
          selected === 0
            ? (
              <MilestoneTable
                refetch={refetch}
                milestones={milestones}
                rewardAssetId={rewardAsset}
              />
            )
            : <FundingRequestedTable />
        }
      </Container>

      <Sidebar applicationData={applicationData} assetInfo={assetInfo} />
    </Container>
  );
}

ManageGrant.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <NavbarLayout>
      {page}
    </NavbarLayout>
  );
};
export default ManageGrant;
