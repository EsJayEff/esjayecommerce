"use client";

import React, { useRef, useState } from "react";
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineLeft,
  AiOutlineShopping,
} from "react-icons/ai";
import { TiDeleteOutline } from "react-icons/ti";
import { useStateContext } from "../context/statecontext";
import { urlFor } from "../lib/sanityClient";
import Link from "next/link";
import getStripe from "../lib/getStripe";
import toast from "react-hot-toast";
import Image from 'next/image'

const Cart = () => {
  const cartRef = useRef();
  // @ts-ignore
  const {totalPrice,totalQuantities,cartItems,setShowCart,toggleCartItemQuantity,onRemove,indexImg, setIndexImg,} = useStateContext();

  const handleCheckout = async () => {
    let lineItems = [];
    cartItems.forEach((cartItem) =>
      lineItems.push({
      name: cartItem.name,
      description: cartItem.details,
      images: urlFor(cartItem.image[indexImg]).url(),
      price: cartItem.price,
      quantity: cartItem.quantity,        
          
      }));

   

    const stripe = await getStripe();

    const checkoutSession = await fetch("/api/stripe-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({lineItems}),
    });

    const sessionID= await checkoutSession.json();
    toast.loading("Redirecting...");
    const result = await stripe?.redirectToCheckout({
      sessionId: sessionID,
    });
    if (result?.error) {
      alert(result.error.message);
    }
  
  };

  return (
    <div className="cart-wrapper" ref={cartRef}>
      <div className="cart-container">
        <button
          type="button"
          className="cart-heading"
          onClick={() => setShowCart(false)}
        >
          <AiOutlineLeft />
          <span className="heading">Your Cart</span>
          <span className="cart-num-items">({totalQuantities} items)</span>
        </button>
        {cartItems.length < 1 && (
          <div className="empty-cart">
            <AiOutlineShopping size={150} />
            <h3> Your shopping bag is empty</h3>
            <Link href="/">
              <button
                type="button"
                onClick={() => setShowCart(false)}
                className="btn"
              >
                Continue Shopping
              </button>
            </Link>
          </div>
        )}
        <div className="product-container">
          {cartItems.length >= 1 &&
            cartItems.map((item) => (
              <div className="product" key={item._id}>
              <Image
                  src={urlFor(item?.image[indexImg]).url()}
                  className="cart-product-image"
                  width={500} height={500}
                  alt={item.name}
                />
                <div className="item-desc">
                  <div className="flex top">
                    <h5>{item.name}</h5>
                    <h4>${item.price}</h4>
                  </div>

                  <div className="flex bottom">
                    <div>
                      <p className="quantity-desc">
                        <span
                          className="minus"
                          onClick={() =>
                            toggleCartItemQuantity(item._id, "dec")
                          }
                        >
                          <AiOutlineMinus />
                        </span>
                        <span className="num">{item.quantity}</span>
                        <span
                          className="plus"
                          onClick={() =>
                            toggleCartItemQuantity(item._id, "inc")
                          }
                        >
                          <AiOutlinePlus />
                        </span>
                      </p>
                    </div>
                    <button
                      type="button"
                      className="remove-item"
                      onClick={() => onRemove(item)}
                    >
                      <TiDeleteOutline />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
        {cartItems.length >= 1 && (
          <div className="cart-bottom">
            <div className="total">
              <h3>Subtotal:</h3>
              <h3>${totalPrice}</h3>
            </div>
            <div className="btn-container">
              <button type="button" className="btn" onClick={handleCheckout}>
                Pay with Stripe
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
