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
  const [updateCart, setUpdateCart] = useState(false);

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
    const controller = new AbortController();

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
            if (axios.isCancel(error)) return;
            setError(error);
          });
      })();
    }

    return () => {
      controller.abort();
    };
  }, []);

  // Get the users shopping cart
  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      setLoading(true);

      if (localStorage.getItem("shoppingCartId")) {
        console.log(
          "DataContext: Shopping Cart Id:",
          localStorage.getItem("shoppingCartId")
        );
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
          })
          .catch((error) => {
            if (axios.isCancel(error)) return;
            setError(error.response.data.error);
            setUpdateCart(false);
          });
      }
    })();

    setUpdateCart(false);
    setLoading(false);

    return () => {
      controller.abort();
    };
  }, [updateCart]);

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
            if (axios.isCancel(error)) return;
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
        updateCart,
        setUpdateCart,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
