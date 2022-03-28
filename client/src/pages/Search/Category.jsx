import React from "react";
import { useParams } from "react-router";

const Category = () => {
  const { categoryId } = useParams();

  return (
    <>
      Showing Results for category {categoryId}
      <p>This is the category</p>
    </>
  );
};

export default Category;
