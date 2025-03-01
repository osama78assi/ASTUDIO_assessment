// NOTE that the select category should get all categories from API but since you just need All and Laptops

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCategory,
  setCurrentPage,
  setProducts,
  setProductsCategory,
} from "../../stateSlices/products";
import { AppDispatch, RootState } from "../../store";

function CategorySelect(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, category } = useSelector(
    (state: RootState) => state.products
  );
  const [value, setValue] = useState<string>("All");

  function handleChange(value: string) {
    if (isLoading) return;

    // If there is a search or filter applyed and user clicked all
    if (value === "" && category !== "") {
      dispatch(setCurrentPage(1));
      dispatch(setCategory(""));
      dispatch(setProducts());
    } else {
      dispatch(setCategory(value));
      dispatch(setCurrentPage(1));
      // Fetch by category
      dispatch(setProductsCategory());
    }

    setValue(value);
  }

  return (
    <select
      onChange={(e) => handleChange(e.target.value)}
      className={`${isLoading ? "cursor-not-allowed" : ""}`}
      disabled={isLoading}
      value={value}
    >
      <option value="">All</option>
      <option value="Laptops">Laptops</option>
    </select>
  );
}

export default CategorySelect;
