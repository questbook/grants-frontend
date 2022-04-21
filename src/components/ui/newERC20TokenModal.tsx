import {
  Flex, ModalBody, UnorderedList, ListItem, Box, Button,
} from '@chakra-ui/react';
import React, { useState, useRef } from 'react';
import { isValidAddress } from 'src/utils/validationUtils';
import config from 'src/constants/config';
import { getUrlForIPFSHash, uploadToIPFS } from 'src/utils/ipfsUtils';
import Loader from './loader';
import Modal from './modal';
import SingleLineInput from './forms/singleLineInput';
import ImageUpload from './forms/imageUpload';

interface ModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
}

function NewERC20Modal({
  isModalOpen,
  setIsModalOpen,
}: ModalProps) {
  const [tokenAddress, setTokenAddress] = useState<string>('');
  const [tokenName, setTokenName] = useState<string>('');
  const [tokenAddressError, setTokenAddressError] = useState<boolean>(false);
  const [image, setImage] = React.useState<string>(config.defaultDAOImagePath);
  const [imageFile, setImageFile] = React.useState<File | null>(null);

  const imgRef = useRef();

  const validateTokenAddress = () => {
    if (!tokenAddress || !isValidAddress(tokenAddress)) {
      setTokenAddressError(true);
    }
  };

  const uploadLogo = async () => {
    let imageHash;
    let imageIPFSURL;
    if (imageFile) {
      imageHash = (await uploadToIPFS(imageFile)).hash;
      imageIPFSURL = getUrlForIPFSHash(imageHash);
    }

    console.log('Image hash', imageIPFSURL);
    return imageIPFSURL;
  };

  const validateLogoSize = () => {

  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const img = event.target.files[0];
      setImageFile(img);
      setImage(URL.createObjectURL(img));

      const logoImage = new Image();
      logoImage.src = URL.createObjectURL(img);
      logoImage.onload = () => {
        if (logoImage.height > 100 || logoImage.width > 100) {
          alert('Upload image of dimesion 100*100px');
        }
      };
    }
  };

  const handleSubmit = async () => {
    validateTokenAddress();
    if (!tokenAddressError) {
      uploadLogo();
    }
  };

  return (
    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add token" modalWidth={566}>
      <ModalBody px={10}>
        <Flex direction="column">
          <Box my={4} />
          <SingleLineInput
            label="Contract Address *"
            placeholder="0xb794f5e74279579268"
            subtext=""
            value={tokenAddress}
            onChange={(e) => {
              if (tokenAddressError) {
                setTokenAddressError(false);
              }
              setTokenAddress(e.target.value);
            }}
            isError={tokenAddressError}
            errorText="Address required with proper format"
          />
          <Box my={4} />
          <SingleLineInput
            label="Token Name *"
            placeholder="e.g. Ethereum"
            subtext=""
            value={tokenName}
            onChange={(e) => {
              setTokenName(e.target.value);
            }}
          />
          <Box my={4} />
          <Flex direction="row" my={4}>
            <ImageUpload image={image} isError={false} onChange={handleImageChange} label="Add a logo" />
            <Box bg="#EBF9FC" borderWidth="1px" borderRadius="lg" borderColor="#98C6CD" ml={8} p={8} alignItems="center">
              <UnorderedList>
                <ListItem>Upload atleast 100 X 100 px size</ListItem>
                <ListItem>.jpeg, .png and .svg formats allowed</ListItem>
              </UnorderedList>
            </Box>
          </Flex>
          <Box my={4} />
          <Button variant="primary" onClick={handleSubmit}>Add Token</Button>

        </Flex>
      </ModalBody>
    </Modal>
  );
}

export default NewERC20Modal;
