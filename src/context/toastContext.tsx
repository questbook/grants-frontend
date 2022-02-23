import { ToastId, useToast } from '@chakra-ui/react';
import React, {
  ReactNode, useCallback, useContext, useMemo,
} from 'react';
import InfoToast from 'src/components/ui/infoToast';
import ErrorToast from 'src/components/ui/toasts/errorToast';

type Props = {
  children: ReactNode;
};
type ToastContextType = {
  showErrorToast: (message:string | undefined) => void;
  showInfoToast: (message:string | undefined) => void;
};
const toastContextDefaultValues: ToastContextType = {
  showErrorToast: () => {},
  showInfoToast: () => {},
};

export const ToastContext = React.createContext<ToastContextType>(toastContextDefaultValues);

export function ToastProvider({ children }: Props) {
  const errorToastRef = React.useRef<ToastId>();
  const infoToastRef = React.useRef<ToastId>();
  const toast = useToast();

  const closeInfoToast = useCallback(() => {
    if (infoToastRef.current) {
      toast.close(infoToastRef.current);
    }
  }, [toast]);

  const showInfoToast = useCallback((message:string | undefined) => {
    infoToastRef.current = toast({
      position: 'top',
      render: () => <InfoToast link={message} close={closeInfoToast} />,
    });
  }, [closeInfoToast, toast]);

  const closeErrorToast = useCallback(() => {
    if (errorToastRef.current) {
      toast.close(errorToastRef.current);
    }
  }, [toast]);

  const showErrorToast = useCallback((message:string | undefined) => {
    errorToastRef.current = toast({
      position: 'top',
      render: () => <ErrorToast content={message} close={closeErrorToast} />,
    });
  }, [closeErrorToast, toast]);

  const value = useMemo(() => ({
    showErrorToast, showInfoToast,
  }), [showErrorToast, showInfoToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
}
export function useToastContext() {
  return useContext(ToastContext);
}
