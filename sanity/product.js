export default {
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    // Image of the Product
    {
      name: "image",
      title: "Image",
      type: "array",
      of: [{ type: "image" }],
      options: {
        hotspot: true,
      },
    },
    // Product Name
    {
      name: "name",
      title: "Name",
      type: "string",
    },

    // Slug of the product

    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 90,
      },
    },
    // Price of the product
    {
      name: "price",
      title: "Price",
      type: "number",
    },
    // Details of the product
    {
        name:'details',
        title:'Details',
        type:'string',
    }

  ],
};
