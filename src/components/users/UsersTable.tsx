import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentPage, setFilter, setUsers } from "../../stateSlices/users";
import { AppDispatch, RootState } from "../../store";
import { User } from "../../types/APIsResponseTypes";
import searchInObject from "../../util/searchInObject";
import Table from "../ui/Table";

function UsersTable() {
  const { users, isLoading, searchValue } = useSelector(
    (state: RootState) => state.users
  );
  // Derived state
  const filteredUsers = users?.filter((user) =>
    searchInObject(searchValue, user)
  );
  const dispatch = useDispatch<AppDispatch>();
  // Only in the initial render call and refresh everything
  // (If it's a real dashboard for many employers RTK Query or TanStack/ReactQuery will be a greate option for managing remote state)

  useEffect(() => {
    dispatch(setCurrentPage(1));
    // This will prepare the users count. Because of API endpoints where there is no getUsersCount or something similar
    dispatch(setUsers());

    return () => {
      // Clear the filter if exists when user change the page
      dispatch(setFilter({ filterField: "", filterValue: "" }));
    };
  }, []);

  return (
    <Table
      columns={12}
      matchMaxMediaAt={1290}
      fixAt={1400}
      isLoading={isLoading}
    >
      <Table.Header>
        <Table.Tr>
          <Table.Th>first name</Table.Th>
          <Table.Th>last name</Table.Th>
          <Table.Th>maiden name</Table.Th>
          <Table.Th>gender</Table.Th>
          <Table.Th>eye color</Table.Th>
          <Table.Th>blood group</Table.Th>
          <Table.Th>birth date</Table.Th>
          <Table.Th>phone</Table.Th>
          <Table.Th>university</Table.Th>
          <Table.Th>email</Table.Th>
          <Table.Th>username</Table.Th>
          <Table.Th>role</Table.Th>
        </Table.Tr>
      </Table.Header>
      <Table.Body
        data={filteredUsers as User[]}
        render={(value) => (
          <Table.Tr key={value?.id}>
            <Table.Td>{value?.firstName}</Table.Td>
            <Table.Td>{value?.lastName}</Table.Td>
            <Table.Td>{value?.maidenName}</Table.Td>
            <Table.Td>{value?.gender}</Table.Td>
            <Table.Td>{value?.eyeColor}</Table.Td>
            <Table.Td>{value?.bloodGroup}</Table.Td>
            <Table.Td>{value?.birthDate}</Table.Td>
            <Table.Td>{value?.phone}</Table.Td>
            <Table.Td>{value?.university}</Table.Td>
            <Table.Td>{value?.email}</Table.Td>
            <Table.Td>{value?.username}</Table.Td>
            <Table.Td>{value?.role}</Table.Td>
          </Table.Tr>
        )}
      />
    </Table>
  );
}

export default UsersTable;
