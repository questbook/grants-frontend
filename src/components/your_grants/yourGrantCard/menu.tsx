import {
  Menu as MenuComponent,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
  Text,
  Image,
} from '@chakra-ui/react';
import React from 'react';

function Menu({
  onEditClick,
}: {
  onEditClick: () => void;
}) {
  const [copied, setCopied] = React.useState(false);
  return (
    <MenuComponent
      onClose={() => setCopied(false)}
      closeOnSelect={false}
      placement="left"
    >
      <MenuButton
        as={IconButton}
        aria-label="View More Options"
        icon={<Image h={4} w={4} src="/ui_icons/more.svg" />}
        variant="link"
        mx={0}
        minW={0}
      />
      <MenuList minW="164px" p={0}>
        <MenuItem onClick={() => setCopied(true)} py="12px" px="16px">
          <Text
            fontSize="14px"
            fontWeight="400"
            lineHeight="20px"
            color="#122224"
            display="flex"
            alignItems="center"
          >
            <Image
              mr={18}
              display="inline-block"
              h={4}
              w={4}
              src="/ui_icons/share_brand.svg"
            />
            {copied ? 'Link Copied!' : 'Share'}
          </Text>
        </MenuItem>
        <MenuItem onClick={() => onEditClick()} py="12px" px="16px">
          <Text
            fontSize="14px"
            fontWeight="400"
            lineHeight="20px"
            color="#122224"
            display="flex"
            alignItems="center"
          >
            <Image
              mr={18}
              display="inline-block"
              h={4}
              w={4}
              src="/ui_icons/edit_icon.svg"
            />
            Edit
          </Text>
        </MenuItem>
      </MenuList>
    </MenuComponent>
  );
}

export default Menu;
