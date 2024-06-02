import { Authenticator, withAuthenticator } from "@aws-amplify/ui-react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import { LOGIN_FORM_FIELDS } from "./constants";
import "@aws-amplify/ui-react/styles.css";

function App() {
  // const { user } = useAuthenticator((context) => [context.user]);
  // const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  // const { route } = useAuthenticator((context) => [context.route]);
  // console.log('Test outside useEffect', authStatus, user, route);

  // useEffect(() => {
  //   console.log('Test inside useEffect', authStatus, user, route);
  // }, [authStatus, user, route]);
  const { authUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={authUser ? <Navigate to="home" replace /> : <Authenticator />}
      />
      <Route
        path="home"
        element={authUser ? <Home /> : <Navigate to="/" replace />}
      />
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

const AppWithAuthenticator = withAuthenticator(
  (props) => (
    <AuthProvider>
      <App {...props} />
    </AuthProvider>
  ),
  { LOGIN_FORM_FIELDS }
);

export default AppWithAuthenticator;
