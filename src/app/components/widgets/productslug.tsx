"use client";
import { loadStripe } from "@stripe/stripe-js";
import React, {useState} from "react";
import { urlFor } from "../../lib/sanityClient";
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiFillStar,
  AiOutlineStar,
} from "react-icons/ai";
import Product from "../../components/product";
import {useStateContext} from "../../context/statecontext"
import toast from "react-hot-toast";
import Image from 'next/image'

const ProductSlug = ({productData,productsData}) => {
  const [loading, setLoading] = useState(false);
    // const [index, setIndex] = useState(0);
    const {image,name,details,price}=productData;
  // @ts-ignore
    const {decQty,incQty,qty,onAdd,indexImg, setIndexImg,} = useStateContext();
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string;
    const stripePromise = loadStripe(publishableKey);
    const img = urlFor(image[indexImg]).url();
    
    
    const item = {
      name: name,
      description: details,
      image: img,         
      quantity: qty,
      price: price,
    };
  


    
    const createCheckOutSession = async () => {
      setLoading(true);
      const stripe = await stripePromise;
  
      const checkoutSession = await fetch("/api/direct-buy",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            item: item,
          }),
        }
      );
  

      const sessionID= await checkoutSession.json();
      toast.loading("Redirecting...");
      const result = await stripe?.redirectToCheckout({
        sessionId: sessionID,
      });
      if (result?.error) {
        alert(result.error.message);
      }
      setLoading(false);
    };




  return (
    <div>
     <div className="product-detail-container">
        <div>
          <div className="image-container">
            <Image src={urlFor(image && image[indexImg]).url()} className="product-detail-image" width={500} height={500}
            alt={productData.name} />
          </div>
          <div className="small-images-container">
          {image?.map((item,i)=> (
          <Image 
          width={500} height={500}
          alt={productData.name}
          key={i}
          src={urlFor(item).url()} 
          className={i === indexImg ? 'small-image selected-image' : 'small-image'}
          onMouseEnter={()=> setIndexImg(i)
          }
          />
          ))}
          </div>
        </div>
        <div className="product-detail-desc">
          <h1>{name}</h1>
          <div className="reviews">
            <div>
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiOutlineStar />
            </div>
            <p>(20)</p>
          </div>
          <h4>Details:</h4>
          <p>{details}</p>
          <p className="price">${price}</p>
          <div className="quantity"> 
            <h3>Quantity:</h3>
            <p className="quantity-desc">
              <span className="minus" onClick={decQty}>
                <AiOutlineMinus />
              </span>
              <span className="num">{qty}</span>
              <span className="plus" onClick={incQty}>
                <AiOutlinePlus />
              </span>
            </p>
            </div>
            <div className="buttons">
            <button type="button" className="add-to-cart" onClick={()=> onAdd(productData, qty)} >
              Add to cart
            </button>
            <button type="button" className="buy-now" onClick={createCheckOutSession}>
            {loading ? 'Processing...' : 'Buy Now'}
            </button>
          </div>
        </div>
      </div>
      <div className="maylike-products-wrapper">
        <h2>You may also like</h2>
        <div className="marquee">
          <div className="maylike-products-container track">
            {productsData.map((item) => (
              <Product key={item._id} product={item} />
            ))}
          </div>
        </div>
      </div>


    </div>
  )
}

export default ProductSlug