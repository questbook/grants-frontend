import {
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Image,
  Text,
} from '@chakra-ui/react';
import React from 'react';

function Actions({
  status,
  onViewApplicationFormClick,
  // onAcceptApplicationClick,
  // onRejectApplicationClick,
}: {
  status: number;
  onViewApplicationFormClick?: () => void;
  // onAcceptApplicationClick?: () => void;
  // onRejectApplicationClick?: () => void;
}) {
  if (status === 3) {
    return (
      <Menu placement="bottom">
        <MenuButton
          as={Button}
          aria-label="View More Options"
          variant="outline"
          color="brand.500"
          fontWeight="500"
          fontSize="14px"
          lineHeight="14px"
          textAlign="center"
          borderRadius={8}
          borderColor="brand.500"
          _focus={{}}
          p={0}
          minW={0}
          w="88px"
          h="32px"
          justifyContent="center"
          alignItems="center"
          display="flex"
        >
          View
          <Image
            display="inline-block"
            h="5px"
            w="10px"
            ml="4px"
            mb="2px"
            src="/ui_icons/dropdown_arrow.svg"
          />
        </MenuButton>
        <MenuList
          boxShadow="0px 0px 4px rgba(0, 0, 0, 0.16), 0px 13px 16px rgba(0, 0, 0, 0.2)"
          minW="88px"
          p={0}
        >
          <MenuItem
            onClick={() => {
              if (onViewApplicationFormClick) {
                onViewApplicationFormClick();
              }
            }}
            icon={<Image src="/ui_icons/see.svg" />}
          >
            <Text
              fontSize="14px"
              fontWeight="400"
              lineHeight="20px"
              color="#122224"
            >
              View Application
            </Text>
          </MenuItem>
          {/* <MenuItem
            onClick={() => {
              if (onAcceptApplicationClick) {
                onAcceptApplicationClick();
              }
            }}
            icon={<CheckIcon color="#31373D" />}
          >
            <Text
              fontSize="14px"
              fontWeight="400"
              lineHeight="20px"
              color="#122224"
            >
              Approve
            </Text>
          </MenuItem>
          <MenuItem
            onClick={() => {
              if (onRejectApplicationClick) {
                onRejectApplicationClick();
              }
            }}
            icon={<CloseIcon color="#31373D" />}
          >
            <Text
              fontSize="14px"
              fontWeight="400"
              lineHeight="20px"
              color="#122224"
            >
              Reject
            </Text>
          </MenuItem> */}
        </MenuList>
      </Menu>
    );
  }

  return (
    <Menu placement="bottom">
      <MenuButton
        as={Button}
        aria-label="View More Options"
        variant="outline"
        color="brand.500"
        fontWeight="500"
        fontSize="14px"
        lineHeight="14px"
        textAlign="center"
        borderRadius={8}
        borderColor="brand.500"
        _focus={{}}
        p={0}
        minW={0}
        w="88px"
        h="32px"
        justifyContent="center"
        alignItems="center"
        display="flex"
      >
        View
        <Image
          display="inline-block"
          h="5px"
          w="10px"
          ml="4px"
          mb="2px"
          src="/ui_icons/dropdown_arrow.svg"
        />
      </MenuButton>
      <MenuList
        boxShadow="0px 0px 4px rgba(0, 0, 0, 0.16), 0px 13px 16px rgba(0, 0, 0, 0.2)"
        minW="88px"
        p={0}
      >
        <MenuItem
          onClick={() => {
            if (onViewApplicationFormClick) {
              onViewApplicationFormClick();
            }
          }}
          icon={<Image src="ui_icons/see.svg" />}
        >
          <Text
            fontSize="14px"
            fontWeight="400"
            lineHeight="20px"
            color="#122224"
          >
            View Application
          </Text>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

Actions.defaultProps = {
  onViewApplicationFormClick: () => {},
  // onAcceptApplicationClick: () => {},
  // onRejectApplicationClick: () => {},
};
export default Actions;
