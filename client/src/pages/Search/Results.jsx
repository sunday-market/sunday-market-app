import React, { useEffect, useState, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

import { Box, Typography, Grid, CircularProgress, Alert } from "@mui/material";

import ProductCard from "../../components/Products/ProductCard";
import DataContext from "../../context/DataContext";
import { scrollToTop } from "../../utils/ux";

const Results = () => {
  const [products, setProducts] = useState([]);

  const { setError, setLoading } = useContext(DataContext);

  const [query] = useSearchParams();

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    (async () => {
      axios
        .get(`/api/search/?q=${query.get("q")}`)
        .then((result) => {
          setProducts(result.data);
        })
        .catch((error) => {
          setLoading(false);
          if (axios.isCancel(error)) return;
          setError([error]);
          scrollToTop();
        });

      controller.abort();
    })();

    setLoading(false);

    return () => {
      controller.abort();
    };
  }, [query, setError, setLoading]);

  return (
    <Box px={{ xs: 2, sm: 4, md: 8, lg: 20 }} py={2}>
      <Typography variant="h4">
        Showing <strong>{products.length}</strong> results for{" "}
        <strong>{query.get("q")}</strong>
      </Typography>

      <Grid container>
        {products.map((product) => (
          <Grid
            item
            key={product._id}
            xs={12}
            sm={4}
            md={3}
            p={{ xs: 2, sm: 1, md: 2 }}
          >
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Results;
