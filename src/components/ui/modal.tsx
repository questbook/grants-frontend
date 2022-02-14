import React from 'react';
import {
  Modal as ModalComponent,
  ModalOverlay,
  ModalContent,
  Heading,
  Container,
  Flex,
  Box,
  IconButton, Image,
} from '@chakra-ui/react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  alignTitle?: 'left' | 'center' | 'right';
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  topIcon?: React.ReactNode;
  modalWidth?: string | number;
  closeButtonMargin?: string | number;
}

function Modal({
  isOpen,
  onClose,
  title,
  children,
  leftIcon,
  rightIcon,
  topIcon,
  alignTitle,
  modalWidth,
  closeButtonMargin,
}: Props) {
  return (
    <ModalComponent
      isCentered
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay maxH="100vh" />
      <ModalContent minW={modalWidth} maxH="90vh" overflow="scroll">
        <Container px={8} pt={9}>
          {typeof topIcon !== 'undefined' && (
            <Flex direction="column" align="center">
              {topIcon}
              <Box mb={5} />
            </Flex>
          )}
          <Flex direction="row" w="100%" align="center">
            {typeof leftIcon !== 'undefined' && leftIcon}
            <Heading textAlign={alignTitle} variant="modal">
              {title}
            </Heading>
            <Box mx="auto" />
            {typeof rightIcon !== 'undefined' && rightIcon}
            <IconButton
              m={closeButtonMargin}
              aria-label="close-button"
              size="14px"
              icon={<Image boxSize="14px" src="/ui_icons/close.svg" />}
              _hover={{}}
              _active={{}}
              variant="ghost"
              onClick={onClose}
            />
          </Flex>
        </Container>
        {children}
      </ModalContent>
    </ModalComponent>
  );
}

Modal.defaultProps = {
  leftIcon: undefined,
  rightIcon: undefined,
  topIcon: undefined,
  alignTitle: 'left',
  modalWidth: 480,
  closeButtonMargin: '0px 0px 0px 20px',
};

export default Modal;
