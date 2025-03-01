import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentPage, setProducts } from "../../stateSlices/products";
import { AppDispatch, RootState } from "../../store";
import { Product } from "../../types/APIsResponseTypes";
import searchInObject from "../../util/searchInObject";
import Table from "../ui/Table";

function ProductsTable(): JSX.Element {
  const { products, isLoading, searchValue } = useSelector(
    (state: RootState) => state.products
  );
  const dispatch = useDispatch<AppDispatch>();

  const filteredProducts = products?.filter((value) =>
    searchInObject(searchValue, value)
  );

  useEffect(() => {
    dispatch(setCurrentPage(1));
    dispatch(setProducts());
  }, []);

  return (
    <Table
      columns={3}
      matchMaxMediaAt={720}
      fixAt={800}
      isLoading={isLoading}
    >
      <Table.Header>
        <Table.Tr>
          <Table.Th>title</Table.Th>
          <Table.Th>brand</Table.Th>
          <Table.Th>category</Table.Th>
        </Table.Tr>
      </Table.Header>
      <Table.Body
        data={filteredProducts as Product[]}
        render={(value) => (
          <Table.Tr key={value?.id}>
            <Table.Td>{value?.title}</Table.Td>
            <Table.Td>{value?.brand}</Table.Td>
            <Table.Td>{value?.category}</Table.Td>
          </Table.Tr>
        )}
      />
    </Table>
  );
}

export default ProductsTable;
