"use client";

import React from "react";
import Link from "next/link";
import { AiOutlineShopping } from "react-icons/ai";
import Cart from '../components/cart'
import { useStateContext } from "../context/statecontext";

const NavBar = () => {
  // @ts-ignore
  const {showCart,setShowCart,totalQuantities} = useStateContext();
  return (
    <div className="navbar-container">
      <p className="logo">
        <Link href="/"> Es Jay Store</Link>
      </p>
      <button type="button" className="cart-icon" onClick={()=> setShowCart(true)}>
        <AiOutlineShopping />
        <span className="cart-item-qty">{totalQuantities}</span>
      </button>
      { showCart && <Cart/> }
    </div>
  );
};

export default NavBar;
