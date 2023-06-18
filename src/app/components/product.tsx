import React from 'react';
import Link from 'next/link';
import { urlFor } from '../lib/sanityClient';
import Image from 'next/image'

const Product = ({product}) => {
  return (
    <div>
      <Link href={`/product/${product.slug.current}`}>
      <div className="product-card">
      <Image 
      src={urlFor(product.image && product.image[0]).url()}
      alt={product.name}
      width={250}
      height={250}
      className="product-image"
      />
      <p className="product-name">{product.name}</p>
      <p className="product-price">${product.price}</p>
      </div>
      </Link>
    </div>
  )
}

export default Product