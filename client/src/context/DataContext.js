import { useState, useEffect, createContext } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";

const DataContext = createContext({});

export const DataProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [categories, setCategories] = useState();
  const [loggedInUser, setLoggedInUser] = useState({});
  const [shoppingCart, setShoppingCart] = useState();

  // Clear Error Messages
  useEffect(() => {
    setTimeout(() => {
      setError("");
    }, 5000);
  }, [error]);

  // Clear Success Messages
  useEffect(() => {
    setTimeout(() => {
      setSuccess("");
    }, 5000);
  }, [success]);

  // Get logged in user
  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      (async () => {
        const decodedJWT = jwtDecode(localStorage.getItem("authToken"));

        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        };

        await axios
          .get(`/api/user/${decodedJWT.id}`, config)
          .then((user) => {
            setLoggedInUser(user.data.data);
          })
          .catch((error) => {
            setError(error.response.data.error);
          });
      })();
    }
  }, []);

  // Get the users shopping cart
  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      setLoading(true);

      if (localStorage.getItem("shoppingCartId")) {
        console.log(localStorage.getItem("shoppingCartId"));
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
          signal: controller.signal,
        };

        await axios
          .get(`/api/cart/${localStorage.getItem("shoppingCartId")}`, config)
          .then((result) => {
            setShoppingCart(result.data[0]);
            console.log("DataContext: Shopping Cart", result.data[0]);
            controller.abort();
          })
          .catch((error) => {
            setError(error.response.data);
          });
      }
    })();

    setLoading(false);

    return () => {
      controller.abort();
    };
  }, []);

  // Get Product Categories
  useEffect(() => {
    const controller = new AbortController();

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    };

    if (!categories) {
      (async () => {
        await axios
          .get("/api/category", config)
          .then((result) => {
            setCategories(result.data);
          })
          .catch((error) => {
            setError(error.response.data.error);
            controller.abort();
          });
      })();
    }

    return () => {
      controller.abort();
    };
  }, [categories]);

  return (
    <DataContext.Provider
      value={{
        error,
        setError,
        loading,
        setLoading,
        success,
        setSuccess,
        categories,
        setCategories,
        loggedInUser,
        setLoggedInUser,
        shoppingCart,
        setShoppingCart,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
