import { Authenticator, withAuthenticator } from "@aws-amplify/ui-react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Navigate, Route, Routes } from "react-router-dom";
import { LOGIN_FORM_FIELDS } from "./constants";
import "@aws-amplify/ui-react/styles.css";
import BeatSheets from "./components/BeatSheets";
import Layout from "./components/Layout";
import ViewBeatSheet from "./components/ViewBeatSheet";

function App() {
  const { authUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Routes>
        {authUser ? (
          <>
            <Route path="/beatsheets" element={<Layout><BeatSheets /></Layout>} />
            <Route path="/beatsheets/:id" element={<Layout><ViewBeatSheet /></Layout>} />
            <Route path="*" element={<Navigate to="/beatsheets" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Authenticator />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </>
  );
}

const AppWithAuthenticator = withAuthenticator(
  (props) => (
    <AuthProvider>
      <App {...props} />
    </AuthProvider>
  ),
  { formFields: LOGIN_FORM_FIELDS }
);

export default AppWithAuthenticator;
