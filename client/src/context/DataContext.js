import { useState, useEffect, createContext, useCallback } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";

const DataContext = createContext({});

export const DataProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [categories, setCategories] = useState();
  const [loggedInUser, setLoggedInUser] = useState(undefined);
  const [refreshLoggedInUser, setRefreshLoggedInUser] = useState(false);
  const [shoppingCart, setShoppingCart] = useState();
  const [updateCart, setUpdateCart] = useState(false); // Note for future implementation. Name should be "refreshCart"

  const [shoppingCartPriceTotal, setShoppingCartPriceTotal] = useState();
  const [shoppingCartId, setShoppingCartId] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [createCart, setCreateCart] = useState(false);
  const [cartLoaded, setCartLoaded] = useState(false);
  const [futureDate, setFutureDate] = useState(
    new Date().getTime() + 30 * 60000
  );

  // // Clear Error Messages
  useEffect(() => {
    setTimeout(() => {
      setError("");
    }, 5000);
  }, [error]);

  // // Clear Success Messages
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
          signal: controller.signal,
        };

        await axios
          .get(`/api/user/${decodedJWT.id}`, config)
          .then((user) => {
            setLoggedInUser(user.data.data);
          })
          .catch((error) => {
            if (axios.isCancel(error)) return;
            setError([error]);
          });
      })();
      setRefreshLoggedInUser(false);
    }

    return () => {
      controller.abort();
    };
  }, [refreshLoggedInUser]);

  // Get the users shopping cart
  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      setLoading(true);

      if (localStorage.getItem("shoppingCartId")) {
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
          })
          .catch((error) => {
            if (axios.isCancel(error)) return;
            setError([error]);
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

    (async () => {
      await axios
        .get("/api/category", config)
        .then((result) => {
          setCategories(result.data);
        })
        .catch((error) => {
          if (axios.isCancel(error)) return;
          setError([error]);

          controller.abort();
        });
    })();

    return () => {
      controller.abort();
    };
  }, []);

  // Deletes cart
  const deleteCart = useCallback(async () => {
    let cartid = localStorage.getItem("shoppingCartId");
    try {
      await axios.put("/api/cart/clearcart/" + cartid);
      await axios.delete(`/api/cart/${cartid}`);
      setShoppingCartId("");
      setCartLoaded(false);
      setShoppingCart(null);
      setShoppingCartPriceTotal(null);
      setSelectedItems([]);
      localStorage.removeItem("shoppingCartId");
      setCreateCart(true);
    } catch (error) {
      if (axios.isCancel(error)) return;
      setError([error]);
    }
  }, []);

  // creates new shopping cart
  const createNewCart = useCallback(async () => {
    const controller = new AbortController();
    const signal = controller.signal;
    let minutesToAdd = 30;
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      signal,
    };
    try {
      const newCartId = await (
        await axios.post("/api/cart/", config)
      ).data.data._id;
      const cart = await (
        await axios.get(`/api/cart/${newCartId}`, config)
      ).data[0];
      // set current date to time the cart was last updated
      const currentDate = new Date(cart.updatedAt);
      // set countdown date
      setFutureDate(new Date(currentDate.getTime() + minutesToAdd * 60000));
      // set shopping cart and load time
      setShoppingCart(cart);
      setCartLoaded(true);
      setShoppingCartId(newCartId);
      localStorage.setItem("shoppingCartId", newCartId);
      setCreateCart(false);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (axios.isCancel(error)) return;
      setError([error]);
    }
    controller.abort();
  }, []);

  // recreates the shopping cart if no local storage and the setCreateCart has been set to true
  useEffect(() => {
    const recreateCart = async () => {
      if (!localStorage.getItem("shoppingCartId") && createCart) {
        createNewCart();
      }
    };
    recreateCart();
  }, [createCart, createNewCart]);

  useEffect(() => {
    setLoading(true);
    const controller = new AbortController();
    const signal = controller.signal;
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      signal,
    };
    const setProductInfo = async (productID) => {
      try {
        const res = await axios.get("/api/product/" + productID, config);
        setSelectedItems((prev) => [...prev, res.data[0]]);
      } catch (error) {
        setLoading(false);
        if (axios.isCancel(error)) {
          return;
        }
        return setError([error]);
      }
    };
    const loopThroughCart = () => {
      shoppingCart.products_selected.forEach((product) => {
        setProductInfo(product.product_id);
      });
    };
    if (shoppingCart?.products_selected?.length > 0) {
      loopThroughCart();
      setLoading(false);
    }

    return () => {
      controller.abort();
    };
  }, [setError, setSelectedItems, shoppingCart]);

  // IMPORTANT USE EFFECT THIS IS WHERE THE CART IS DELETED UPDATEd AND CHECKED ON RENDERS
  useEffect(() => {
    let minutesToAdd = 30;
    const controller = new AbortController();
    const signal = controller.signal;
    const getShoppingCart = async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        signal,
      };
      
      // if exists try and get cart, or create new one if cart no longer exists
      if (localStorage.getItem("shoppingCartId") && !cartLoaded) {
        try {
          const cartId = localStorage.getItem("shoppingCartId");
          const cart = await (
            await axios.get(`/api/cart/${cartId}`, config)
          )?.data[0];
          if (cart === undefined || cart === null) {
            localStorage.removeItem("shoppingCartId");
            return createNewCart();
          }

          // if cart is length 0 then the cart either doesn't exist anymore or is empty either way safe to recreate
          if (cart?.products_selected.length === 0 || !cart) {
            await axios.delete(`/api/cart/${cartId}`);
            return createNewCart();
          }
          // Cart has items still that haven't been erased in timeout so set the cart equal to this
          else {
            setShoppingCart(cart);
            setCartLoaded(true);
            const currentDate =
              new Date(cart.updatedAt).getTime() +
              minutesToAdd * 60000 -
              new Date().getTime();
            if (currentDate <= 0) {
              deleteCart();
            } else {
              setFutureDate(
                new Date(cart.updatedAt).getTime() + minutesToAdd * 60000
              );
            }
          }
        } catch (error) {
          return setError([error]);
        }
      }
    };
    getShoppingCart();
    return () => {
      controller.abort();
    };
  }, [
    cartLoaded,
    createNewCart,
    deleteCart,
    setCartLoaded,
    setError,
    setFutureDate,
    setShoppingCart,
  ]);

  const handleRefresh = async () => {
    let minutesToAdd = 30;
    try {
      const cartId = localStorage.getItem("shoppingCartId");
      const cart = (await axios.get(`/api/cart/${cartId}`)).data[0];
      const res = await axios.put(`/api/cart/${cartId}`, cart);
      const currentDate = new Date(res.data.data[0].updatedAt);
      setFutureDate(new Date(currentDate.getTime() + minutesToAdd * 60000));
    } catch (error) {
      return setError([error]);
    }
  };

  // Set shopping cart price totals
  useEffect(() => {
    if (shoppingCart) {
      let total = 0;
      shoppingCart.products_selected.forEach((product) => {
        total += product.product_price * product.quantity;
      });
      setShoppingCartPriceTotal(total.toFixed(2));
    }
  }, [setShoppingCartPriceTotal, shoppingCart]);

  // Handle cart clear
  const handleCartClear = async () => {
    try {
      await axios.put("/api/cart/clearcart/" + shoppingCart._id);
      setCartLoaded(false);
      setShoppingCart();
      setShoppingCartPriceTotal();
      setSelectedItems([]);
      let minutesToAdd = 30;
      const currentDate = new Date();
      setFutureDate(new Date(currentDate.getTime() + minutesToAdd * 60000));
    } catch (error) {
      return setError([error]);
    }
  };

  // is user logged in and has a shopping cart
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    if (loggedInUser && cartLoaded) {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        signal,
      };
      const loadUserIdToCart = async () => {
        try {
          // if shopping cart === undefined then no user has been added to this shopping cart - if res is true procceed else if res is false delete token
          if (
            (shoppingCart?.user === undefined || shoppingCart?.user === null) &&
            loggedInUser._id &&
            shoppingCartId
          ) {
            // put user in data
            const newCartData = {
              user: loggedInUser._id,
              shoppingCart,
            };
            await axios.put(`/api/cart/${shoppingCartId}`, newCartData, config);
          }
        } catch (error) {
          if (axios.isCancel(error)) {
            return;
          }
          return setError([error]);
        }
      };
      loadUserIdToCart();
    }
    return () => {
      controller.abort();
    };
  }, [cartLoaded, loggedInUser, shoppingCart, shoppingCartId]);

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
        refreshLoggedInUser,
        setRefreshLoggedInUser,
        shoppingCart,
        setShoppingCart,
        updateCart,
        setUpdateCart,
        shoppingCartPriceTotal,
        setShoppingCartPriceTotal,
        shoppingCartId,
        setShoppingCartId,
        selectedItems,
        setSelectedItems,
        createCart,
        setCreateCart,
        cartLoaded,
        setCartLoaded,
        futureDate,
        setFutureDate,
        deleteCart,
        createNewCart,
        handleRefresh,
        handleCartClear,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
