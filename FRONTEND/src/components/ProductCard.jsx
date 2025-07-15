import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariantId, setSelectedVariantId] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/product/${id}/`)
      .then((res) => {
        setProduct(res.data);
        if (res.data.variants.length > 0) {
          setSelectedVariantId(res.data.variants[0].id);
        }
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!product)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-600 animate-pulse">Loading product...</p>
      </div>
    );

  const selectedVariant = product.variants.find(v => v.id === selectedVariantId);

  const handleAddToCart = () => {
    alert(
      selectedVariant
        ? `Added variant "${selectedVariant.label}" to cart!`
        : 'Added product to cart!'
    );
  };

  const handleOrderNow = () => {
    alert(
      selectedVariant
        ? `Ordering variant "${selectedVariant.label}" now!`
        : 'Ordering product now!'
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Left: Main Image */}
        <div className="md:w-1/2">
          {product.main_image ? (
            <img
              src={product.main_image}
              alt={product.name}
              className="w-full rounded-lg object-cover shadow-md"
              style={{ maxHeight: '500px', width: '100%' }}
            />
          ) : (
            <div className="w-full h-80 bg-gray-200 flex items-center justify-center rounded-lg text-gray-400">
              No Image Available
            </div>
          )}

          {/* Additional images carousel */}
          {product.images.length > 0 && (
            <div className="mt-4 flex space-x-3 overflow-x-auto">
              {product.images.map((img) => (
                <img
                  key={img.id}
                  src={img.image_url}
                  alt={img.alt_text || product.name}
                  className="w-20 h-20 object-cover rounded cursor-pointer hover:ring-2 hover:ring-blue-500"
                />
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details + Actions */}
        <div className="md:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-3">{product.name}</h1>
            <p className="text-gray-700 mb-5 whitespace-pre-line">{product.description}</p>

            <div className="mb-6">
              <span className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full font-semibold">
                Brand: {product.brand?.name || 'Unknown'}
              </span>
            </div>

            {/* Variants Selector */}
            {product.variants.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Variants</h3>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant) => {
                    const isSelected = variant.id === selectedVariantId;
                    return (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariantId(variant.id)}
                        className={`px-4 py-2 rounded-lg border font-semibold transition-colors
                          ${
                            isSelected
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-indigo-50'
                          }`}
                      >
                        {variant.label} - ${variant.price.toFixed(2)}
                      </button>
                    );
                  })}
                </div>
                {selectedVariant && (
                  <p className="mt-2 text-gray-600">
                    Stock: {selectedVariant.stock_quantity} {selectedVariant.stock_quantity > 0 ? '' : '(Out of stock)'}
                  </p>
                )}
              </div>
            )}

            {/* Attributes */}
            {product.attributes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Attributes</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {product.attributes.map((attr) => (
                    <li key={attr.id}>
                      <strong>{attr.name}:</strong> {attr.value}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button
              onClick={handleAddToCart}
              disabled={selectedVariant && selectedVariant.stock_quantity === 0}
              className={`flex-1 bg-blue-600 text-white font-bold py-3 rounded-lg shadow-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Add to Cart
            </button>
            <button
              onClick={handleOrderNow}
              disabled={selectedVariant && selectedVariant.stock_quantity === 0}
              className={`flex-1 bg-green-600 text-white font-bold py-3 rounded-lg shadow-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Order Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
