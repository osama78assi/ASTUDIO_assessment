import NavItem from "./NavItem";

function NavBar(): JSX.Element {
  return (
    <div className="navbar">
      <ul className="flex justify-between w-fit gap-3">
        <NavItem to="/users">Users</NavItem>
        <span className="font-semibold">/</span>
        <NavItem to="/products">Products</NavItem>
      </ul>
    </div>
  );
}

export default NavBar;
