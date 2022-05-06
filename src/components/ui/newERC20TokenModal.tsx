import {
  Flex, ModalBody, UnorderedList, ListItem, Box, Button, ToastId, useToast,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { isValidAddress } from 'src/utils/validationUtils';
import config from 'src/constants/config';
import { getUrlForIPFSHash, uploadToIPFS } from 'src/utils/ipfsUtils';
import useUpdateWorkspace from 'src/hooks/useUpdateWorkspace';
import { WorkspaceUpdateRequest } from '@questbook/service-validator-client';
import Loader from './loader';
import Modal from './modal';
import SingleLineInput from './forms/singleLineInput';
import ImageUpload from './forms/imageUpload';
import InfoToast from './infoToast';
import ErrorToast from './toasts/errorToast';

interface ModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  setRewardCurrency: (rewardCurrency: string) => void;
  setRewardCurrencyAddress: (rewardCurrencyAddress: string) => void;
  setSupportedCurrenciesList: (supportedCurrencyList: Array<any>) => void;
  supportedCurrenciesList: Token[];
}

type Token = {
  address: string
  decimals: number
  icon: string
  id: string
  label: string
};

function NewERC20Modal({
  isModalOpen,
  setIsModalOpen,
  setRewardCurrency,
  setRewardCurrencyAddress,
  supportedCurrenciesList,
  setSupportedCurrenciesList,
}: ModalProps) {
  const [tokenAddress, setTokenAddress] = useState<string>('');
  // const [tokenName, setTokenName] = useState<string>('');
  const [tokenSymbol, setTokenSymbol] = useState<string>('');
  const [tokenDecimal, setTokenDecimal] = useState<string>('');
  const [tokenIconIPFSURI, setTokenIconIPFSURI] = useState<string | undefined>('');
  const [tokenIconHash, setTokenIconHash] = useState<string | undefined>('');
  // const [newCurrency, setNewCurrency] = useState<Token>();
  const [tokenAddressError, setTokenAddressError] = useState<boolean>(false);
  const [tokenIconError, setTokenIconError] = useState<boolean>(true);
  const [image, setImage] = useState<string>(config.defaultDAOImagePath);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [tokenData, setTokenData] = useState<WorkspaceUpdateRequest>({
    tokens: [{
      label: '', address: '', decimal: 18, iconHash: '',
    }],
  });
  const [txnData, txnLink, loading] = useUpdateWorkspace(tokenData);

  const toast = useToast();
  const toastRef = React.useRef<ToastId>();

  const validateTokenAddress = () => {
    if (!tokenAddress || !isValidAddress(tokenAddress)) {
      setTokenAddressError(true);
    }
  };

  // eslint-disable-next-line consistent-return
  const uploadLogo = async () => {
    let imageHash;
    let imageIPFSURL: string;
    console.log('Uploading...');
    if (imageFile) {
      imageHash = (await uploadToIPFS(imageFile)).hash;
      imageIPFSURL = getUrlForIPFSHash(imageHash);
      setTokenIconIPFSURI(imageIPFSURL);
      setTokenIconHash(imageHash);
      setTokenIconError(false);
      console.log('Image hash', imageIPFSURL);
      return imageIPFSURL;
    }
    toastRef.current = toast({
      position: 'top',
      render: () => ErrorToast({
        content: 'Please upload token icon',
        close: () => {
          if (toastRef.current) {
            toast.close(toastRef.current);
          }
        },
      }),
    });
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
          toastRef.current = toast({
            position: 'top',
            render: () => ErrorToast({
              content: 'Please upload image of size 100 X 100 px',
              close: () => {
                if (toastRef.current) {
                  toast.close(toastRef.current);
                }
              },
            }),
          });
        } else {
          setTokenIconError(false);
        }
      };
    }
  };

  const handleSubmit = async () => {
    validateTokenAddress();
    if (!tokenAddressError) {
      uploadLogo().then((imgURI) => setTokenIconIPFSURI(imgURI));
    }
    if (!tokenAddressError && !tokenIconError && tokenIconIPFSURI && tokenAddress && tokenSymbol) {
      setRewardCurrency(tokenSymbol);
      setRewardCurrencyAddress(tokenAddress);
      const newToken = {
        address: tokenAddress,
        decimals: tokenDecimal,
        iconHash: tokenIconHash,
        id: tokenAddress,
        label: tokenSymbol,
      };
      console.log('Supported Currencies list', supportedCurrenciesList);
      setTokenData(newToken);
      setSupportedCurrenciesList([...supportedCurrenciesList, newToken]);
      console.log('New list of supported currencies', [...supportedCurrenciesList, newToken]);
    }
  };
  useEffect(() => {
    if (txnData) {
      toastRef.current = toast({
        position: 'top',
        render: () => (
          <InfoToast
            link={txnLink}
            close={() => {
              if (toastRef.current) {
                toast.close(toastRef.current);
              }
            }}
          />
        ),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast, txnData]);
  return (
    <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setImage(config.defaultDAOImagePath); }} title="Add token" modalWidth={566}>
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
            label="Token Symbol *"
            placeholder="e.g. ETH"
            subtext=""
            value={tokenSymbol}
            onChange={(e) => {
              setTokenSymbol(e.target.value);
            }}
          />
          <Box my={4} />
          <SingleLineInput
            label="Decimal *"
            placeholder="e.g. 18"
            subtext=""
            value={tokenDecimal}
            onChange={(e) => {
              setTokenDecimal(e.target.value);
            }}
          />
          <Box my={4} />
          <Flex direction="row" my={4}>
            <ImageUpload image={image} isError={false} onChange={handleImageChange} label="Add a logo" />
            <Box bg="#EBF9FC" borderWidth="1px" borderRadius="lg" borderColor="#98C6CD" ml={8} p={8} alignItems="center">
              <UnorderedList>
                <ListItem>Upload logo of atleast 100 X 100 px size</ListItem>
                <ListItem>.jpeg, .png and .svg formats allowed</ListItem>
              </UnorderedList>
            </Box>
          </Flex>
          <Box my={4} />
          <Button variant="primary" onClick={handleSubmit}>
            {loading ? <Loader /> : 'Add token'}
          </Button>

        </Flex>
      </ModalBody>
    </Modal>
  );
}

export default NewERC20Modal;
