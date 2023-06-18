import React, {useState} from "react";
import { client } from "../../lib/sanityClient";
import ProductSlug from "../../components/widgets/productslug"


export const getProductData = async (slug) => {
  const query = `*[_type == "product" && slug.current == '${slug}'][0]`;
  const product = await client.fetch(query);
   return product;
};
export const getProductsData = async () => {
  const productsQuery = '*[_type == "product"]';
  const products = await client.fetch(productsQuery);
  return products;
};



export default async function ProductDetails({params:{slug}}) {
   
  const productData = await getProductData(slug);
  const productsData = await getProductsData();
 
  return (
    <div>
      <ProductSlug productData={productData} productsData={productsData}/>
    </div>
  );
}
