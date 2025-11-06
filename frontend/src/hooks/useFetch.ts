import { useState, useEffect } from 'react';
import axios, { AxiosRequestConfig } from 'axios';

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Custom hook for fetching data from API endpoints
 * @param url - The API endpoint URL
 * @param options - Axios request configuration options
 * @returns Object containing data, loading state, error, and refetch function
 */
export function useFetch<T = any>(
  url: string,
  options?: AxiosRequestConfig
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [refetchIndex, setRefetchIndex] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // TODO: Replace with actual API call when backend is ready
        const response = await axios.get<T>(url, options);
        setData(response.data);
      } catch (err) {
        setError(err as Error);
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, refetchIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  const refetch = () => {
    setRefetchIndex((prev) => prev + 1);
  };

  return { data, loading, error, refetch };
}

export default useFetch;
