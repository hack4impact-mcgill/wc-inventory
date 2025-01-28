import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false, // default: 3
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

  
  interface ReactQueryProviderProps {
    children: React.ReactNode;
  }
  
  export const ReactQueryProvider: React.FC<ReactQueryProviderProps> = ({
    children,
  }) => {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };
  