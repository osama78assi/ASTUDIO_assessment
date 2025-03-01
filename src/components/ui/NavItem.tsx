import { ReactNode } from "react";
import { NavLink } from "react-router-dom";

type NavItemProps = {
  children: ReactNode;
  to: string;
};

function NavItem({ children, to }: NavItemProps): JSX.Element {
  return (
    <li className="p-2rounded-lg">
      <NavLink to={to} className="relative w-fit before:bg-[var(--primary-yellow)] before:h-[50%] before:absolute before:left-0 before:bottom-0 before:content-[''] before:-rotate-3 before:z-[-1] before:w-0 before:transition-[width] hover:before:w-[100%]">{children}</NavLink>
    </li>
  );
}

export default NavItem;
