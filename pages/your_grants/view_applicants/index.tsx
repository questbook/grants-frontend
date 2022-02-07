import { Container } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import Breadcrumbs from '../../../src/components/ui/breadcrumbs';
import Heading from '../../../src/components/ui/heading';
import Table from '../../../src/components/your_grants/view_applicants/table';
import NavbarLayout from '../../../src/layout/navbarLayout';

const data = [
  {
    applicant_address: '0xb79edeeefvb...',
    sent_on: '14 Jan 2022',
    applicant_name: 'Ankit Nair',
    funding_asked: {
      amount: 10,
      symbol: 'ETH',
      icon: '/images/dummy/Ethereum icon.svg',
    },
    status: 0,
  },
  {
    applicant_address: '0xb79edeeefvb...',
    sent_on: '14 Jan 2022',
    applicant_name: 'Ankit Nair',
    funding_asked: {
      amount: 10,
      symbol: 'ETH',
      icon: '/images/dummy/Ethereum icon.svg',
    },
    status: 1,
  },
  {
    applicant_address: '0xb79edeeefvb...',
    sent_on: '14 Jan 2022',
    applicant_name: 'Ankit Nair',
    funding_asked: {
      amount: 10,
      symbol: 'ETH',
      icon: '/images/dummy/Ethereum icon.svg',
    },
    status: 2,
  },
  {
    applicant_address: '0xb79edeeefvb...',
    sent_on: '14 Jan 2022',
    applicant_name: 'Ankit Nair',
    funding_asked: {
      amount: 10,
      symbol: 'ETH',
      icon: '/images/dummy/Ethereum icon.svg',
    },
    status: 3,
  },
  {
    applicant_address: '0xb79edeeefvb...',
    sent_on: '14 Jan 2022',
    applicant_name: 'Ankit Nair',
    funding_asked: {
      amount: 10,
      symbol: 'ETH',
      icon: '/images/dummy/Ethereum icon.svg',
    },
    status: 3,
  },
  {
    applicant_address: '0xb79edeeefvb...',
    sent_on: '14 Jan 2022',
    applicant_name: 'Ankit Nair',
    funding_asked: {
      amount: 10,
      symbol: 'ETH',
      icon: '/images/dummy/Ethereum icon.svg',
    },
    status: 1,
  },
  {
    applicant_address: '0xb79edeeefvb...',
    sent_on: '14 Jan 2022',
    applicant_name: 'Ankit Nair',
    funding_asked: {
      amount: 10,
      symbol: 'ETH',
      icon: '/images/dummy/Ethereum icon.svg',
    },
    status: 0,
  },
  {
    applicant_address: '0xb79edeeefvb...',
    sent_on: '14 Jan 2022',
    applicant_name: 'Ankit Nair',
    funding_asked: {
      amount: 10,
      symbol: 'ETH',
      icon: '/images/dummy/Ethereum icon.svg',
    },
    status: 2,
  },
  {
    applicant_address: '0xb79edeeefvb...',
    sent_on: '14 Jan 2022',
    applicant_name: 'Ankit Nair',
    funding_asked: {
      amount: 10,
      symbol: 'ETH',
      icon: '/images/dummy/Ethereum icon.svg',
    },
    status: 0,
  },
  {
    applicant_address: '0xb79edeeefvb...',
    sent_on: '14 Jan 2022',
    applicant_name: 'Ankit Nair',
    funding_asked: {
      amount: 10,
      symbol: 'ETH',
      icon: '/images/dummy/Ethereum icon.svg',
    },
    status: 0,
  },
  {
    applicant_address: '0xb79edeeefvb...',
    sent_on: '14 Jan 2022',
    applicant_name: 'Ankit Nair',
    funding_asked: {
      amount: 10,
      symbol: 'ETH',
      icon: '/images/dummy/Ethereum icon.svg',
    },
    status: 1,
  },
  {
    applicant_address: '0xb79edeeefvb...',
    sent_on: '14 Jan 2022',
    applicant_name: 'Ankit Nair',
    funding_asked: {
      amount: 10,
      symbol: 'ETH',
      icon: '/images/dummy/Ethereum icon.svg',
    },
    status: 1,
  },
  {
    applicant_address: '0xb79edeeefvb...',
    sent_on: '14 Jan 2022',
    applicant_name: 'Ankit Nair',
    funding_asked: {
      amount: 10,
      symbol: 'ETH',
      icon: '/images/dummy/Ethereum icon.svg',
    },
    status: 1,
  },
  {
    applicant_address: '0xb79edeeefvb...',
    sent_on: '14 Jan 2022',
    applicant_name: 'Ankit Nair',
    funding_asked: {
      amount: 10,
      symbol: 'ETH',
      icon: '/images/dummy/Ethereum icon.svg',
    },
    status: 0,
  },
  {
    applicant_address: '0xb79edeeefvb...',
    sent_on: '14 Jan 2022',
    applicant_name: 'Ankit Nair',
    funding_asked: {
      amount: 10,
      symbol: 'ETH',
      icon: '/images/dummy/Ethereum icon.svg',
    },
    status: 0,
  },
  {
    applicant_address: '0xb79edeeefvb...',
    sent_on: '14 Jan 2022',
    applicant_name: 'Ankit Nair',
    funding_asked: {
      amount: 10,
      symbol: 'ETH',
      icon: '/images/dummy/Ethereum icon.svg',
    },
    status: 2,
  },
];

function ViewApplicants() {
  const router = useRouter();
  return (
    <Container maxW="100%" display="flex" px="70px">
      <Container
        flex={1}
        display="flex"
        flexDirection="column"
        maxW="1116px"
        alignItems="stretch"
        pb={8}
        px={10}
      >
        <Breadcrumbs path={['My Grants', 'View Applicants']} />
        <Heading
          title="Storage Provider (SP) Tooling Ideas"
          dontRenderDivider
        />
        <Table
          data={data}
          onViewApplicantFormClick={(commentData: any) => router.push({
            pathname: '/your_grants/view_applicants/applicant_form/',
            query: {
              commentData,
            },
          })}
          onAcceptApplicationClick={() => router.push({
            pathname: '/your_grants/view_applicants/applicant_form/',
            query: {
              flow: 'accepted',
            },
          })}
          onRejectApplicationClick={() => router.push({
            pathname: '/your_grants/view_applicants/applicant_form/',
            query: {
              flow: 'rejected',
            },
          })}
          onManageApplicationClick={() => router.push({
            pathname: '/your_grants/view_applicants/manage/',
          })}
        />
      </Container>
    </Container>
  );
}

ViewApplicants.getLayout = function getLayout(page: ReactElement) {
  return <NavbarLayout>{page}</NavbarLayout>;
};

export default ViewApplicants;
