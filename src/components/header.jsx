import React from "react";
import { Link } from "react-router-dom";


function Header() {

  return (
    <div className=" text-2xl top-0 left-0 fixed p-4 gap-2 bg-white shadow w-full flex justify-start">
        <Link to="/Home" className="bg-blue-500 text-2xl text-white  rounded">
            Home
        </Link>
        <Link to="/Estoque" className="bg-blue-500 text-2xl text-white  rounded">
            Estoque
        </Link>
        <Link to="/Produtos" className="bg-blue-500 text-2xl text-white  rounded">
            Produtos
        </Link>
    </div>
  );
}

export default Header;
