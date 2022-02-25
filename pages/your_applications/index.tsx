import {
  Container, Flex,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, {
  ReactElement, useCallback, useContext, useEffect, useRef,
} from 'react';
import BN from 'bn.js';
import { useAccount } from 'wagmi';
import Empty from 'src/components/ui/empty';
import { useGetMyApplicationsLazyQuery } from 'src/generated/graphql';
import Heading from '../../src/components/ui/heading';
import YourApplicationCard from '../../src/components/your_applications/yourApplicationCard';
import NavbarLayout from '../../src/layout/navbarLayout';
import { getUrlForIPFSHash } from '../../src/utils/ipfsUtils';
import { getFormattedDateFromUnixTimestamp } from '../../src/utils/formattingUtils';
import { ApiClientsContext } from '../_app';

const PAGE_SIZE = 20;

function YourApplications() {
  const router = useRouter();
  // const [applicantID, setApplicantId] = React.useState<any>('');
  const subgraphClient = useContext(ApiClientsContext)?.subgraphClient;
  const [myApplications, setMyApplications] = React.useState<any>([]);

  const containerRef = useRef(null);
  const [{ data: accountData }] = useAccount();
  const [currentPage, setCurrentPage] = React.useState(0);

  const [getMyApplications] = useGetMyApplicationsLazyQuery({
    client: subgraphClient?.client,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getMyApplicationsData = async () => {
    try {
      const { data } = await getMyApplications({
        variables: {
          first: PAGE_SIZE,
          skip: currentPage * PAGE_SIZE,
          applicantID: accountData?.address || '',
        },
      });
      if (data) {
        setCurrentPage(currentPage + 1);
        setMyApplications([...myApplications, ...data.grantApplications]);
      }
    } catch (e) {
      // console.log('error in fetching my applications ', e);
    }
  };

  const handleScroll = useCallback(() => {
    const { current } = containerRef;
    if (!current) return;
    const parentElement = (current as HTMLElement)?.parentNode as HTMLElement;
    const reachedBottom = Math.abs(
      parentElement.scrollTop
          - (parentElement.scrollHeight - parentElement.clientHeight),
    ) < 10;
    if (reachedBottom) {
      getMyApplicationsData();
    }
  }, [containerRef, getMyApplicationsData]);

  useEffect(() => {
    if (!accountData) return;
    getMyApplicationsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountData?.address]);

  useEffect(() => {
    const { current } = containerRef;
    if (!current) return;
    const parentElement = (current as HTMLElement)?.parentNode as HTMLElement;
    parentElement.addEventListener('scroll', handleScroll);

    // eslint-disable-next-line consistent-return
    return () => parentElement.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <Container ref={containerRef} maxW="100%" display="flex" px="70px">
      <Container
        flex={1}
        display="flex"
        flexDirection="column"
        maxW="834px"
        alignItems="stretch"
        pb={8}
        px={10}
      >
        <Heading title="Your Applications" />

        { myApplications.length > 0
          && myApplications.map((application: any) => (
            (
              <YourApplicationCard
                key={application.id}
                grantTitle={application.grant.title}
                daoName={application.grant.workspace.title}
                daoIcon={getUrlForIPFSHash(application.grant.workspace.logoIpfsHash)}
                isGrantVerified={(new BN(application.grant.funding)).gt(new BN(0))}
                isDaoVerified={false}
                status={application.state}
                sentDate={getFormattedDateFromUnixTimestamp(application?.createdAtS)}
                updatedDate={getFormattedDateFromUnixTimestamp(application?.updatedAtS)}
                onViewGrantClick={() => router.push({
                  pathname: '/explore_grants/about_grant',
                  query: {
                    grantID: application.grant.id,
                  },
                })}
                onViewApplicationClick={() => router.push({
                  pathname: '/your_applications/grant_application',
                  query: {
                    applicationID: application.id,
                  },
                })}
                onManageGrantClick={() => router.push({
                  pathname: '/your_applications/manage_grant',
                  query: {
                    applicationID: application.id,
                  },
                })}
              />
            )
          ))}

        {myApplications.length === 0 && (
        <Flex direction="column" mt={14} align="center">
          <Empty
            src="/illustrations/empty_states/no_applications.svg"
            imgHeight="134px"
            imgWidth="147px"
            title="No applications"
            subtitle="All your grant applications are shown here. Discover grants on our home page."
          />
        </Flex>
        )}

      </Container>
    </Container>
  );
}

YourApplications.getLayout = function getLayout(page: ReactElement) {
  return <NavbarLayout>{page}</NavbarLayout>;
};

export default YourApplications;
