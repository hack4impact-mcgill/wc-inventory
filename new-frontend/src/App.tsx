import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./contexts/auth-context";
import { ReactQueryProvider } from "./providers/react-query-provider";
import router from "./providers/router-provider";
import LoadingScreen from './components/loading';

function App() {
  return (
    <ReactQueryProvider>
      <AuthProvider>
        <RouterProvider router={router} fallbackElement={<LoadingScreen />} />
      </AuthProvider>
    </ReactQueryProvider>
  );
}

export default App;
