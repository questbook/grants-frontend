import {
  Flex,
  Menu,
  MenuButton,
  Button,
  Container,
  MenuList,
  MenuItem,
  Image,
  Text,
  Box,
  MenuDivider,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';

interface DropdownProps {
  listItems: { icon?: string; label: string, id?: string }[];
  listItemsMinWidth?: string;
  label?: string;
  value?: string;
  onChange?: Function;
  defaultIndex?: number;
  addERC?: boolean;
}

const defaultProps = {
  listItemsMinWidth: '0',
  label: '',
  value: '',
  onChange: null,
  defaultIndex: 0,
  addERC: false,
};

function Dropdown({
  listItems,
  listItemsMinWidth,
  label,
  onChange,
  defaultIndex,
  value,
  addERC,
}: DropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const defaultSelected = listItems[defaultIndex ?? 0];
  const [selected, setSelected] = React.useState(defaultSelected);
  useEffect(() => {
    setSelected(defaultSelected);
  }, [defaultSelected]);
  return (
    <Flex flexDirection="column" alignItems="stretch" position="relative">
      {label && label.length && (
        <>
          <Text lineHeight="20px" fontWeight="bold">
            {label}
          </Text>
          <Box mt={1} />
        </>
      )}
      <Menu onClose={() => setIsOpen(false)} isOpen={isOpen} variant="form">
        <MenuButton
          maxW="100%"
          h={12}
          mt={1}
          as={Button}
          rightIcon={onChange ? <Image src="/ui_icons/form_dropdown.svg" /> : null}
          textAlign="left"
          flex={1}
          p={0}
          pr={5}
          onClick={() => {
            if (!onChange) return;
            setIsOpen(!isOpen);
          }}
        >
          <Container
            alignItems="center"
            display="flex"
            w="full"
            px={4}
            py={3}
            h={12}
            justifyContent="flex-start"
          >
            {value ? (
              <>
                {listItems?.find(({ label: text }) => text === value)?.icon ? (
                  <Image
                    mr={3}
                    h="24px"
                    w="24px"
                    src={listItems.find(({ label: text }) => text === value)?.icon}
                  />
                ) : null}
                <Text fontWeight="400" fontSize="14px" color="#414E50">
                  {value}
                </Text>
              </>
            ) : (
              <>
                {selected.icon && selected.icon.length ? (
                  <Image mr={3} h="24px" w="24px" src={selected.icon} />
                ) : null}
                <Text fontWeight="400" fontSize="14px" color="#414E50">
                  {selected.label}
                </Text>
              </>
            )}
          </Container>
        </MenuButton>
        <MenuList minW={0} py={0}>
          {listItems.map(({ icon, label: text, id }) => (
            <MenuItem
              key={`menu-item-${text}`}
              onClick={() => {
                if (!onChange) return;
                setSelected({ icon, label: text });
                if (id) {
                  onChange({ id, label: text });
                } else {
                  onChange(text);
                }
              }}
              minW={listItemsMinWidth}
              p={0}
            // variant="form"
            >
              <Flex
                alignItems="center"
                w="full"
                px={4}
                py={3}
                h={12}
                justifyContent="flex-start"
              >
                {icon && icon.length ? (
                  <Image mr={3} h="24px" w="24px" src={icon} />
                ) : null}
                <Text fontWeight="400" fontSize="14px" color="#414E50">
                  {text}
                </Text>
              </Flex>
            </MenuItem>
          ))}
          {addERC ? (
            <div>
              <MenuDivider />
              <MenuItem minW={listItemsMinWidth} p={0} onClick={() => { if (!onChange) return; onChange('addERCToken'); }}>
                <Flex
                  alignItems="center"
                  w="full"
                  px={4}
                  py={3}
                  h={12}
                  justifyContent="flex-start"
                >
                  <Image mr={3} h="18px" w="18px" src="/ui_icons/addERCToken.svg" />
                  <Text fontWeight="400" fontSize="14px" color="#414E50">Add your ERC 20 Token</Text>
                </Flex>
              </MenuItem>
            </div>
          ) : null}
        </MenuList>
      </Menu>
    </Flex>
  );
}

Dropdown.defaultProps = defaultProps;
export default Dropdown;
