import React from 'react'
import {Product,FooterBanner,HeroBanner} from './components/allcomponents';
import {client} from "./lib/sanityClient"


export default async function Home () {
  const dataProduct = await getProductData()
  const dataBanner = await getBannerData()
  

  return (
    <>
    <HeroBanner heroBanner={dataBanner.length && dataBanner[0]}/>
     <div className="products-heading">
      <h2>Best Selling Products</h2>
      <p>Speakers of many variations</p>
    </div>
    <div className="products-container">
    {dataProduct?.map((product)=><Product key={product._id} product={product}/>)}  
    </div>     
    <FooterBanner footerBanner={dataBanner && dataBanner[0]}/> 
    </>
    
  )
}

export const getProductData = async () =>{

  const query =`*[_type == "product"]`;
  const products = await client.fetch(query);
  return products;
  }

export const getBannerData = async () =>{
const bannerQuery ='*[_type == "banner"]';
const bannerData = await client.fetch(bannerQuery);
return bannerData;
    }
  
  



