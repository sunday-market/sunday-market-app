import React, { useEffect, useState, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  FormGroup,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

import ProductCard from "../../components/Products/ProductCard";
import DataContext from "../../context/DataContext";
import { scrollToTop } from "../../utils/ux";

const Results = () => {
  const [products, setProducts] = useState([]);

  const { setError, setLoading, categories } = useContext(DataContext);

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

  // handleCheckChange - purpose is to filter results
  const handleCheckChange = (e) => {
    console.log("checkbox change");
    console.log(e.target.value); // returns category id
    console.log(e.target.checked); // false when unchecked checked by default
  };

  return (
    <>
      <Grid
        container
        spacing={0}
        backgroundColor="white"
        border="solid 1px #c3c3c3"
      >
        <Grid
          item
          container
          sm={12}
          ml={2}
          pt={1}
          justifyContent="start"
          alignContent={"center"}
        >
          <Typography fontStyle={"italic"} color={"gray"}>
            Filter Search Results
          </Typography>
        </Grid>
        {categories?.map((category, index) => (
          <Box
            item
            container
            p={1}
            pt={0}
            justifyContent="center"
            alignContent={"center"}
            spacing={0}
            key={index}
            flexGrow={1}
            display={"flex"}
          >
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox defaultChecked onChange={handleCheckChange} />
                }
                label={category.category_name}
                value={category._id}
              />
              {/* <FormControlLabel
                disabled
                control={<Checkbox />}
                label="Disabled"
              /> */}
            </FormGroup>
          </Box>
        ))}
      </Grid>
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
    </>
  );
};

export default Results;
