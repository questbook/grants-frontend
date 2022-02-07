import {
  Box,
  Container,
  Image,
  Flex,
  Divider,
} from '@chakra-ui/react';
import React, { ReactElement } from 'react';
import GrantDetails from '../../src/components/explore_grants/about_grant/grantDetails';
import GrantRewards from '../../src/components/explore_grants/about_grant/grantRewards';
import Sidebar from '../../src/components/explore_grants/about_grant/sidebar';
import Breadcrumbs from '../../src/components/ui/breadcrumbs';
import Heading from '../../src/components/ui/heading';
import NavbarLayout from '../../src/layout/navbarLayout';

function AboutGrant() {
  const grantTitle = 'Storage Provider (SP) Tooling Ideas';
  const deadline = 'May 15, 2020';
  const grantStatus = 'Open';

  const daoName = 'Polygon DAO';
  const daoLogo = '/images/dummy/Polygon Icon.svg';
  const isDaoVerified = false;

  const rewardAmount = '60';
  const rewardCurrency = 'ETH';
  const rewardCurrencyCoin = '/network_icons/eth_mainnet.svg';
  const payoutDescription = 'Single Payout - Instant Payout once the grant recepient is selected.';

  const grantSummary = 'A tool, script or tutorial to set up monitoring for miner GPU, CPU, memory and other resource and performance metrics, ideally using Prometheus and Grafana or other common open source tools.';
  const grantDetails = `
<p>
  About
  <br />
  Filecoin Next Step Microgrants are available to support taking the Next Step after building an initial prototype with Filecoin. They are offered with the 
  <br />
  <br />
  <ol>
    <li>Understanding that decentralized technologies are a rapidly developing field with many unknowns. </li>
    <li>Next Step Microgrants seek to match the pace, breadth, and experimental nature of this work.</li>
  </ol>

  <br />
  Intended Audience

  <br />
  <a href="www.github.com/a1029">
    www.github.com/a1029
  </a>
  <br />
  <a href="www.github.com/a1029">
    www.github.com/a1029
  </a>

  <br />
  <br />
  <img src="https://i.pcmag.com/imagery/articles/007cgCeF2SOUL9OBpHBmdPi-51.fit_lim.size_1050x.png" />
  <br />
  <br />

  These grants are intended for:
  <br />
  <ul>
    <li>Independent developers</li>
    <li>Small studios</li>
    <li>Non-profits</li>
    <li>Activists, Researchers... and you!</li>
  </ul>

  <br />
  <br />
  Program Qualifications
  <br />
  <br />
  Next Step Microgrants are intended to be easy to apply for, evaluate, and administer. Projects must meet these 5 criteria:
  <br />
  <br />
  <p>
    You've already built something with Filecoin (or closely related technologies such as IPLD, libp2p, or frameworks or services such as NFT.storage, Textile Powergate, etc.), independently or as part of a course or hackathon.
    You can provide a clear and straightforward description of the Next Step you plan to take with grant support.
    You can complete this work within 3 months.
    You agree to open-source this work, via MIT license for code or CC-BY-SA 3.0 license for content.
    You agree to complete weekly updates and a grant report upon conclusion, with the results of your microgrant-funded work as well as a description of your experience building on IPFS, including any challenges or shortcomings encountered.
    We may also contact you about promoting the resulting work, including coverage on the Filecoin Blog or social media.
  </p>
</p>
`;

  const grantRequiredFields = [
    { detail: 'Applicant Name' },
    { detail: 'Applicant Email' },
    { detail: 'About Team' },
    { detail: 'Project Name' },
    { detail: 'Project Details' },
    { detail: 'Project Goals' },
    { detail: 'Milestones', tooltip: 'Milestones' },
    { detail: 'Funding Breakdown', tooltip: 'Funding Breakdown' },
  ];

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
        <Breadcrumbs path={['Explore Grants', 'About Grant']} />
        <Heading mt="18px" dontRenderDivider title={grantTitle} />
        <Flex fontWeight="400" alignItems="center">
          <Image mr={3} mt="-3px" boxSize={3} src="/ui_icons/calendar.svg" />
          {`Ends on ${deadline}`}
          <Image mx={2} src="/ui_icons/green_dot.svg" />
          <Box
            as="span"
            display="inline-block"
            color="#122224"
            fontWeight="bold"
          >
            {grantStatus}
          </Box>
        </Flex>

        <Divider mt={3} />

        <GrantRewards
          daoName={daoName}
          daoLogo={daoLogo}
          isDaoVerified={isDaoVerified}
          rewardAmount={rewardAmount}
          rewardCurrency={rewardCurrency}
          rewardCurrencyCoin={rewardCurrencyCoin}
          payoutDescription={payoutDescription}
        />

        <Divider mt={7} />

        <GrantDetails
          grantSummary={grantSummary}
          grantDetails={grantDetails}
        />
      </Container>

      <Sidebar
        grantRequiredFields={grantRequiredFields}
      />
    </Container>
  );
}

AboutGrant.getLayout = function getLayout(page: ReactElement) {
  return <NavbarLayout>{page}</NavbarLayout>;
};
export default AboutGrant;
