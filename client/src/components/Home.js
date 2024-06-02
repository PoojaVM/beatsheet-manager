import React from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useNavigate } from "react-router-dom";
function Home() {
  const navigate = useNavigate();
  const { signOut } = useAuthenticator();

  const logOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Test Error signing out: ', error);
    }
  }
  

  return (
    <div>
      <h1>Home</h1>
      <button onClick={logOut}>Sign Out</button>
    </div>
  )
}

export default Home;