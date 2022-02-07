import {
  Container,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import Form from '../../src/components/explore_grants/apply_grant/form';
import Sidebar from '../../src/components/explore_grants/apply_grant/sidebar';
import NavbarLayout from '../../src/layout/navbarLayout';

function ApplyGrant() {
  const router = useRouter();

  const rewardAmount = '60';
  const rewardCurrency = 'ETH';
  const rewardCurrencyCoin = '/network_icons/eth_mainnet.svg';
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

  return (
    <Container maxW="100%" display="flex" px="0px">
      <Container
        flex={3}
        display="flex"
        flexDirection="column"
        maxW="834px"
        alignItems="stretch"
        pb={8}
        px={10}
      >
        <Form
          onSubmit={(data) => {
            console.log(data);
            router.push({
              pathname: '/your_applications',
              query: {
                account: true,
              },
            });
          }}
          rewardAmount={rewardAmount}
          rewardCurrency={rewardCurrency}
          rewardCurrencyCoin={rewardCurrencyCoin}
        />
      </Container>

      <Sidebar
        grantSummary={grantSummary}
        grantDetails={grantDetails}
      />
    </Container>
  );
}

ApplyGrant.getLayout = function getLayout(page: ReactElement) {
  return (
    <NavbarLayout>
      {page}
    </NavbarLayout>
  );
};

export default ApplyGrant;
