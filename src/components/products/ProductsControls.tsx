import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentPage,
  setProducts,
  setProductsCategory,
  setRecordsPerPage,
  setSearchValue,
} from "../../stateSlices/products";
import { AppDispatch, RootState } from "../../store";
import Controls from "../ui/Controls";
import CategorySelect from "./CategorySelect";

function ProductsControls() {
  const category = useSelector((state: RootState) => state.products.category);
  const dispatch = useDispatch<AppDispatch>();

  function handleChangePageSize(_, value: number) {
    dispatch(setRecordsPerPage(value));
    dispatch(setCurrentPage(1));

    // When there is category refetch by it
    if (category !== "") {
      dispatch(setProductsCategory());
    } else {
      dispatch(setProducts());
    }
  }

  // Search in the client side
  function searchFor(value: string) {
    dispatch(setSearchValue(value));
  }

  return (
    <Controls matchMaxMediaAt={700}>
      <Controls.PaginationControler handleChange={handleChangePageSize} />

      <Controls.SearchInput
        handleSearch={searchFor}
        placeholder="Search for records"
      />

      <Controls.FilterContainer>
        <CategorySelect />
      </Controls.FilterContainer>
    </Controls>
  );
}

export default ProductsControls;
