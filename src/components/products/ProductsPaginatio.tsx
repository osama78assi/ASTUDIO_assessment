import { useDispatch, useSelector } from "react-redux";
import { setCurrentPage, setProducts, setProductsCategory } from "../../stateSlices/products";
import { AppDispatch, RootState } from "../../store";
import Pagination from "../ui/Pagination";

function ProductsPagination() {
  const { currentPage, recordsPerPage, totalProducts, isLoading, category } = useSelector(
    (state: RootState) => state.products
  );
  const dispatch = useDispatch<AppDispatch>();

  function goToPage(page: number) {
    // Prevent navigating when there is data is loading
    if (isLoading) return;

    dispatch(setCurrentPage(page));

    // If there is a category fetch by it
    if(category === "") {
      dispatch(setProducts());
    } else {
      dispatch(setProductsCategory());
    }
  }

  return (
    <Pagination
      changePage={goToPage}
      currentPage={currentPage}
      recordsCount={totalProducts}
      recordsPerPage={recordsPerPage}
      isLoading={isLoading}
    />
  );
}

export default ProductsPagination;
