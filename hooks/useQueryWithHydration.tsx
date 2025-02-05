import { getQueryClient } from "@/providers/wallet";
import { QueryKey } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const useQueryWithHydration = <TData,>({
  initialData,
  queryKey,
  queryFct,
}: {
  queryKey: QueryKey;
  initialData: TData;
  queryFct: () => Promise<TData>;
}) => {
  // with initialData, which we use as we hydrate the page with data from the server,
  // useQuery defaults to the initialData while waiting for new data. This causes
  // flashing of initial data which isLoading=true. This hook prevents that while still
  // making use of client-side caching.
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const queryClient = getQueryClient();

  useEffect(() => {
    const getter = async () => {
      await queryFct().then((res) => {
        queryClient.setQueryData(queryKey, res);
        setData(res);
      });
    };

    if (!mounted) {
      queryClient.setQueryData(queryKey, initialData);
      setMounted(true);
    } else {
      setLoading(true);
      const existingData = queryClient.getQueryData<TData>(queryKey);
      if (existingData) {
        setData(existingData);
      } else {
        getter();
      }
      setLoading(false);
    }
  }, [queryKey]);

  return { data, loading };
};
