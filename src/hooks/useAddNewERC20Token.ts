import { ToastId, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import SuccessToast from 'src/components/ui/toasts/successToast';
import NewERC20Modal from 'src/components/ui/newERC20TokenModal';

export default function useAddNewERC20Token() {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const toastRef = React.useRef<ToastId>();
  const toast = useToast();
}
