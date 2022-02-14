import React from 'react';
import {
  Modal as ModalComponent,
  ModalOverlay,
  ModalContent,
  Heading,
  Container,
  Flex,
  Box,
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
  closeOnOverlayClick?: boolean;
  width?: string | number;
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
  closeOnOverlayClick, width,
}: Props) {
  return (
    <ModalComponent
      isCentered
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={closeOnOverlayClick}
    >
      <ModalOverlay maxH="100vh" />
      <ModalContent minW={width} maxH="90vh" overflow="scroll">
        <Container px={8} py={9}>
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
            {typeof rightIcon !== 'undefined' && <Box mx="auto" />}
            {typeof rightIcon !== 'undefined' && rightIcon}
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
  closeOnOverlayClick: false,
  width: 480,
};

export default Modal;
