import { ShoppingCart } from "lucide-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { logoutUser } from "@/services/authService";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/userSlic";
const Navbar = () => {
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  const logoutHandler = async () => {
    try {
      const data = await logoutUser(accessToken);
      dispatch(setUser(null));
      toast.success(data.message);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <header className="bg-pink-50 fixed w-full z-20 border-b border-pink-200">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div>
          <img src="/cart.png" alt="" className="w-[100px]" />
        </div>
        <nav className="flex gap-10 justify-between items-center">
          <ul className="flex gap-7 items-center text-xl font-semibold">
            <Link to={"/"}>
              <li>Home</li>
            </Link>
            <Link to={"/products"}>
              <li>Products</li>
            </Link>
            {user && (
              <Link to={"/profile"}>
                <li>Hello {user.firstName}</li>
              </Link>
            )}
            <Link to={"/cart"} className="relative">
              <ShoppingCart />
              <span className="bg-pink-500 rounded-full absolute text-white -top-3 -right-5 px-2">
                0
              </span>
            </Link>
            {user ? (
              <Button
                onClick={logoutHandler}
                className="bg-pink-600 text-white cursor-pointer"
              >
                Logout
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/login")}
                className="bg-gradient-to-tl from-blue-600 to-purple-600 text-white cursor-pointer"
              >
                Login
              </Button>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};
export default Navbar;
