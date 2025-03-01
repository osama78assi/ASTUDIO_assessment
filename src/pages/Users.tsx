import { useDispatch, useSelector } from "react-redux";
import Err from "../components/ui/Err";
import UsersControls from "../components/users/UsersControls";
import UsersPagination from "../components/users/UsersPagination";
import UsersTable from "../components/users/UsersTable";
import { clearError } from "../stateSlices/users";
import { AppDispatch, RootState } from "../store";

function Users() {
  const error = useSelector((state: RootState) => state.users.error);
  const dispatch = useDispatch<AppDispatch>();

  if (error !== null) {
    console.log(error.message);
  }

  function refetch() {
    // By reseting the error this component will re-render meaning
    // The chilren will get a newly render so it will fetch the data correctly

    dispatch(clearError());
  }

  return (
    <div className="my-8">
      {error === null ? (
        <>
          <UsersControls />

          <UsersTable />

          <UsersPagination />
        </>
      ) : (
        <Err
          errorMessage="Something went wrong while fetching the users. Please try again"
          refetch={refetch}
        />
      )}
    </div>
  );
}

export default Users;
