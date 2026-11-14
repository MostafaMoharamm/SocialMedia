import { useContext, useState } from "react";
import { FaBars } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

const desktopLink = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-lg font-medium transition ${
    isActive
      ? "text-indigo-600 bg-indigo-50"
      : "text-slate-600 hover:text-indigo-600 hover:bg-slate-100"
  }`;

const mobileLink = ({ isActive }: { isActive: boolean }) =>
  `block px-3 py-2 rounded-lg text-base font-medium transition ${
    isActive
      ? "text-indigo-600 bg-indigo-50"
      : "text-slate-700 hover:text-indigo-600 hover:bg-slate-100"
  }`;

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { userLogin, setuserLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  function Logout() {
    localStorage.removeItem("userToken");
    setuserLogin(null);
    setIsOpen(false);
    navigate("/Login");
  }

  return (
    <nav className="bg-white/90 backdrop-blur border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div className="flex justify-between items-center h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          onClick={() => setIsOpen(false)}
          className="text-2xl font-extrabold text-indigo-600 tracking-tight"
        >
          Logo
        </Link>

        <div className="hidden md:flex items-center gap-2">
          {userLogin ? (
            <>
              <NavLink to="/" end className={desktopLink}>
                Home
              </NavLink>
              <NavLink to="/profile" className={desktopLink}>
                Profile
              </NavLink>
              <button
                onClick={Logout}
                className="ms-2 px-4 py-2 rounded-lg font-medium text-red-500 hover:bg-red-50 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/register" className={desktopLink}>
                Register
              </NavLink>
              <Link
                to="/Login"
                className="ms-2 bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition font-medium"
              >
                Login
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-slate-700 hover:text-indigo-600 hover:bg-slate-100 focus:outline-none"
          aria-expanded={isOpen}
          aria-label="Toggle menu"
          onClick={() => setIsOpen(!isOpen)}
        >
          {!isOpen ? <FaBars size={22} /> : <IoMdClose size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {userLogin ? (
            <>
              <NavLink to="/" end onClick={() => setIsOpen(false)} className={mobileLink}>
                Home
              </NavLink>
              <NavLink to="/profile" onClick={() => setIsOpen(false)} className={mobileLink}>
                Profile
              </NavLink>
              <button
                onClick={Logout}
                className="w-full text-start px-3 py-2 rounded-lg text-base font-medium text-red-500 hover:bg-red-50 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/register" onClick={() => setIsOpen(false)} className={mobileLink}>
                Register
              </NavLink>
              <Link
                to="/Login"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium bg-indigo-600 text-white text-center hover:bg-indigo-700 transition"
              >
                Login
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}