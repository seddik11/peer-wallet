import { useRouter } from "next/router";
import BiconomyLoginButton from "./BiconomyLoginButton";

const Navbar = () => {
  const router = useRouter();

  return (
    <div className="navbar px-4">
      <div className="navbar-start">
        <a
          className="btn btn-ghost normal-case text-xl"
          onClick={() => router.push("/")}
        >
          PEERwallet
        </a>
      </div>
      <div className="navbar-center hidden lg:flex" />
      <div className="navbar-end">
        <BiconomyLoginButton />
      </div>
    </div>
  );
};

export default Navbar;
