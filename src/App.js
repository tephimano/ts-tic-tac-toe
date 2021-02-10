import "./App.css";
import LoginPage from "./components/LoginPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query-devtools";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import GamePage from "./components/GamePage";
import ProtectedPage from "./components/ProtectedPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // query options
      refetchOnWindowFocus: false,
      staleTime: 0,
      retry: false,
    },
    mutations: {
      // mutation options
    },
  },
});
function App() {
  return (
    <div className="app-content">
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <BrowserRouter forceRefresh={true}>
          <Switch>
            <Route path="/" component={LoginPage} exact />
            <ProtectedPage path="/game-page" component={GamePage} exact />
            <Route
              path="/logout"
              render={(props) => {
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("email");
                return <Redirect to="/" />;
              }}
              exact
            />
          </Switch>
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  );
}

export default App;
