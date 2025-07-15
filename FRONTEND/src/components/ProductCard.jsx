import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/product/${id}/`)  // make sure URL is plural "products"
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!product) return <p>Loading product...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

      {product.main_image && (
        <img
          src={product.main_image}
          alt={product.name}
          className="w-full max-w-md rounded-lg mb-6"
        />
      )}

      <p className="mb-4">{product.description}</p>

      <h2 className="text-xl font-semibold">Brand:</h2>
      <p className="mb-4">{product.brand?.name || "No Brand"}</p>

      <h2 className="text-xl font-semibold">Images:</h2>
      <div className="flex gap-4 mb-6">
        {product.images.length > 0 ? (
          product.images.map((img) => (
            <img
              key={img.id}
              src={img.image_url}
              alt={img.alt_text || product.name}
              className="w-32 h-32 object-cover rounded"
            />
          ))
        ) : (
          <p>No additional images.</p>
        )}
      </div>

      <h2 className="text-xl font-semibold">Attributes:</h2>
      {product.attributes.length > 0 ? (
        <ul className="mb-6 list-disc list-inside">
          {product.attributes.map((attr) => (
            <li key={attr.id}>
              {attr.name}: {attr.value}
            </li>
          ))}
        </ul>
      ) : (
        <p>No attributes.</p>
      )}

      <h2 className="text-xl font-semibold">Variants:</h2>
      {product.variants.length > 0 ? (
        <ul className="mb-6 list-disc list-inside">
          {product.variants.map((variant) => (
            <li key={variant.id}>
              {variant.label} - ${variant.price} ({variant.stock_quantity} in stock)
            </li>
          ))}
        </ul>
      ) : (
        <p>No variants available.</p>
      )}

      <p className="text-sm text-gray-500">
        Created at: {new Date(product.created_at).toLocaleString()}
      </p>
      <p className="text-sm text-gray-500">
        Updated at: {new Date(product.updated_at).toLocaleString()}
      </p>
    </div>
  );
}
