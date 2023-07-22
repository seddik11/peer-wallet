import BiconomyLoginButton from "./BiconomyLoginButton";

const Navbar = () => {
  return (
    <div className="navbar px-4">
      <div className="navbar-start">
        <a className="btn btn-ghost normal-case text-xl">PEERwallet</a>
      </div>
      <div className="navbar-center hidden lg:flex" />
      <div className="navbar-end">
        <BiconomyLoginButton />
      </div>
    </div>
  );
};

export default Navbar;
