import React, { useContext } from "react";
import "./css/HeaderStyle.css";
import { IoMenu } from "react-icons/io5";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  return (
    <header className="header_Container">
      <article className="Header_Wrapper">
        <h3>
          Eflex <span>Bank App</span>
        </h3>

        <div className="Header_Wrapper_Right">
          <div className="header_Profile_Holder">
            <div className="Header_Profile">
              {user?.fullName?.charAt(0) || "U"}
            </div>

            <h5>{user?.fullName || "Guest"}</h5>
          </div>

          <button
            className="Btn Header_Btn"
            onClick={() => navigate("/")}
          >
            {user?.fullName ? "Log out" : "Login"}
          </button>

          <div className="Header_Mobile_Toggle">
            <IoMenu className="Icon" />
          </div>
        </div>
      </article>
    </header>
  );
};

export default Header;