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
  rightIcon?: React.ReactNode;
  topIcon?: React.ReactNode;
  closeOnOverlayClick?: boolean;
}

function Modal({
  isOpen,
  onClose,
  title,
  children,
  rightIcon,
  topIcon,
  alignTitle,
  closeOnOverlayClick,
}: Props) {
  return (
    <ModalComponent
      isCentered
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={closeOnOverlayClick}
    >
      <ModalOverlay maxH="100vh" />
      <ModalContent minW={480} maxH="90vh" overflow="scroll">
        <Container px={6} py={4}>
          {typeof topIcon !== 'undefined' && (
            <Flex direction="column" align="center">
              {topIcon}
              <Box mb={5} />
            </Flex>
          )}
          {typeof rightIcon !== 'undefined' ? (
            <Flex direction="row" w="100%" justify="space-between">
              <Heading textAlign={alignTitle} variant="modal">
                {title}
              </Heading>
              {rightIcon}
            </Flex>
          ) : (
            <Heading textAlign={alignTitle} variant="modal">
              {title}
            </Heading>
          )}
        </Container>
        {children}
      </ModalContent>
    </ModalComponent>
  );
}

Modal.defaultProps = {
  rightIcon: undefined,
  topIcon: undefined,
  alignTitle: 'left',
  closeOnOverlayClick: false,
};

export default Modal;
