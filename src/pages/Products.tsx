import { useDispatch, useSelector } from "react-redux";
import ProductsControls from "../components/products/ProductsControls";
import ProductsPagination from "../components/products/ProductsPaginatio";
import ProductsTable from "../components/products/ProductsTable";
import Err from "../components/ui/Err";
import { clearError } from "../stateSlices/products";
import { AppDispatch, RootState } from "../store";

function Products(): JSX.Element {
  const error= useSelector((state: RootState) => state.products.error);
  const dispatch = useDispatch<AppDispatch>();

  if (error !== null) {
    console.log(error.message);
  }

  function refetch() {
    dispatch(clearError());
  }

  return (
    <div className="my-8">
      {error === null ? (
        <>
          <ProductsControls />

          <ProductsTable />

          <ProductsPagination />
        </>
      ) : (
        <Err
          errorMessage="Something went wrong while fetching the prodcts. Please try again"
          refetch={refetch}
        />
      )}
    </div>
  );
}

export default Products;
