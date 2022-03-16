import { useEffect, useState } from "react";
import { useUser } from "../../hooks/useUser";

export default function MyStallsPage() {
  const userData = useUser();

  const [userToken, setUserToken] = useState(null);
  useEffect(() => {
    function handleLoggedInStatus() {
      setUserToken(localStorage.getItem("authToken"));
    }
    handleLoggedInStatus();
  });
  return (
    <>
      <div>MyStallsPage</div>
    </>
  );
}
