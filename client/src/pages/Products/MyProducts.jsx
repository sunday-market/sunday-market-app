import React from "react";

import ProductCard from "../../components/ProductCard";

const products = [
  {
    id: 1,
    name: "Strawberries 500g Punnet",
    image:
      "https://images.unsplash.com/photo-1623227866882-c005c26dfe41?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=765&q=80",
    description:
      "This is a test product.  This is dummy data to see what the contents of the title will contain",
    category: "Product Category Field",
    qty: 3,
    price: "$2.99",
  },
];
const MyProducts = () => {
  return (
    <>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          qty={product.qty}
        />
      ))}
    </>
  );
};

export default MyProducts;
