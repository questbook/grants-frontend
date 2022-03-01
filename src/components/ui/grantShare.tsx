import { Image, Button } from '@chakra-ui/react';
import copy from 'copy-to-clipboard';
import React from 'react';

interface Props {
  grantID: string;
}

function GrantShare({ grantID } : Props) {
  const [copied, setCopied] = React.useState(false);

  const copyGrantLink = () => {
    const href = window.location.href.split('/');
    const protocol = href[0];
    const domain = href[2];
    console.log(domain);
    copy(`${protocol}//${domain}/explore_grants/about_grant/?grantID=${grantID}`);
    setCopied(true);
  };

  return (
    <Button
      aria-label="share"
      leftIcon={<Image src="/ui_icons/share_brand.svg" />}
      variant="ghost"
      _hover={{}}
      _active={{}}
      onClick={copyGrantLink}
      fontSize="14px"
      lineHeight="20px"
      fontWeight="400"
      color="brand.500"
      letterSpacing={0.5}
    >
      {copied ? 'Link copied!' : 'Share Link'}
    </Button>
  );
}

export default GrantShare;
