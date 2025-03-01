import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentPage,
  setFilteredUsers,
  setUsers,
} from "../../stateSlices/users";
import { AppDispatch, RootState } from "../../store";
import Pagination from "../ui/Pagination";

function UsersPagination() {
  const { currentPage, recordsPerPage, totalUsers, isLoading, filterField } =
    useSelector((state: RootState) => state.users);
  const dispatch = useDispatch<AppDispatch>();

  function goToPage(page: number) {
    // Prevent navigating when there is data is loading
    if (isLoading) return;
    dispatch(setCurrentPage(page));

    // When there is a filter search with it or leave it
    if (filterField !== "") {
      dispatch(setFilteredUsers());
    } else {
      dispatch(setUsers());
    }
  }

  return (
    <Pagination
      changePage={goToPage}
      currentPage={currentPage}
      recordsCount={totalUsers}
      recordsPerPage={recordsPerPage}
      isLoading={isLoading}
    />
  );
}

export default UsersPagination;
