
import axios, { AxiosResponse, AxiosResponseHeaders } from 'axios';
import { useEffect, useRef, useState } from 'react'

const DEFAULT_ERROR_MESSAGE = `Could not fetch safe's data. Please try again.`

interface Props {
  urls: string[],
  payload?: any,
  method: string,
}

function useAxiosMulti({ urls, payload, method }: Props) {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const [loaded, setLoaded] = useState<boolean>(false);
  const controllerRef = useRef(new AbortController());
  const cancel = () => {
    controllerRef.current.abort();
  }

  useEffect(() => {
    (async () => {
      try {
        const axiosRequests = urls.map(url => axios.request({
          data: payload,
          // signal: controllerRef.current.signal,
          method,
          url
        }))
        let newData = await Promise.allSettled(axiosRequests)
        const finalData = newData.map(element => {
          try{
            if (element.status === 'fulfilled') {
              return element.value.data
            }
            return []
          }
          catch(error){
            return []
          }
        })
        setData(finalData)
      } catch (error: any) {
        if (typeof error === 'string')
          setError(error)
        if (typeof error?.message === 'string')
          setError(error.message)
        else
          setError(DEFAULT_ERROR_MESSAGE)
      } finally {
        setLoaded(true);
      }
    })();
  }, [urls, payload, method]);
  return { cancel, data, error, loaded };
}

export default useAxiosMulti
