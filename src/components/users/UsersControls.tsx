import { SyntheticEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentPage,
  setFilter,
  setFilteredUsers,
  setRecordsPerPage,
  setSearchValue,
  setUsers,
} from "../../stateSlices/users";
import { AppDispatch, RootState } from "../../store";
import Controls from "../ui/Controls";

function UsersControls() {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, filterField } = useSelector(
    (state: RootState) => state.users
  );

  // Filters
  function handleFilter(
    e: SyntheticEvent,
    filterField: string,
    searchQuery: string
  ) {
    e.preventDefault();
    dispatch(setCurrentPage(1)); // after filter page counts will change
    dispatch(setFilter({ filterField, filterValue: searchQuery })); // set the filter
    dispatch(setFilteredUsers()); // Fetch the filtered users
  }

  // To set records per page
  function handleChangePageSize(_, value: number) {
    dispatch(setRecordsPerPage(value));
    // After change the records per page we should restart the current page
    dispatch(setCurrentPage(1));

    // When there is no filter refetch without it or refetch with the filter
    if (filterField === "") {
      dispatch(setUsers());
    } else {
      dispatch(setFilteredUsers());
    }
  }

  // Search in the client side
  function searchFor(value: string) {
    dispatch(setSearchValue(value));
  }

  // Remove the selected filter
  function handleRemoveFilter() {
    dispatch(setCurrentPage(1)); // After removing the filter

    // If there is a filter (to reudce API calls and better than compare filtered users and users)
    if (filterField !== "") {
      dispatch(setFilter({ filterField: "", filterValue: "" })); // set the filter
      dispatch(setUsers()); // Just call get users without filters
    }
  }

  return (
    <Controls matchMaxMediaAt={700}>
      <Controls.PaginationControler handleChange={handleChangePageSize} />

      <Controls.SearchInput
        handleSearch={searchFor}
        placeholder="Search for records"
      />

      <Controls.FilterContainer>
        <Controls.FilterBtn
          id="name"
          disabled={isLoading}
          type={"text"}
          placeholder="Filter results by first name"
          handleSubmit={(e, search) => handleFilter(e, "firstName", search)}
        >
          Name
        </Controls.FilterBtn>
        <Controls.FilterBtn
          id="email"
          disabled={isLoading}
          type={"text"}
          placeholder="Filter results by email"
          handleSubmit={(e, search) => handleFilter(e, "email", search)}
        >
          Email
        </Controls.FilterBtn>
        <Controls.FilterBtn
          id="date"
          disabled={isLoading}
          type={"text"}
          placeholder="Filter results by birth date"
          handleSubmit={(e, search) => handleFilter(e, "birthDate", search)}
        >
          Birth Date
        </Controls.FilterBtn>
        <Controls.FilterBtn
          id="gender"
          disabled={isLoading}
          type={"text"}
          placeholder="Filter results by gender"
          handleSubmit={(e, search) => handleFilter(e, "gender", search)}
        >
          Gender
        </Controls.FilterBtn>
        {filterField !== "" && (
          <Controls.RestartFiltersBtn restartHandler={handleRemoveFilter}>
            Remove filter
          </Controls.RestartFiltersBtn>
        )}
      </Controls.FilterContainer>
    </Controls>
  );
}

export default UsersControls;
