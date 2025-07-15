import React, { useEffect, useState } from "react";
import { PawPrint, ShoppingBag } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import bdogImg from "./assets/bdog.jpg";
import catImg from "./assets/cat.jpg";
import rabbitImg from "./assets/rabbit.jpg";

export default function LandingPage() {
  const [bannerImage, setBannerImage] = useState("");
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Define an async function inside useEffect
    const fetchData = async () => {
      try {
        // Fetch banner image and products in parallel
        const [bannerResponse, productsResponse] = await Promise.all([
          axios.get("http://localhost:8000/api/images/banner"),
          axios.get("http://localhost:8000/api/product"),
        ]);

        // Set states from API response
        setBannerImage(bannerResponse.data.image_url);
        setProducts(productsResponse.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const petItems = [
    {
      id: 1,
      label: "SHOP ",
      image: bdogImg,
      link: "/shop/dog",
    },
    {
      id: 2,
      label: "SHOP ",
      image: catImg ,
      link: "/shop/cat",
    },
    {
      id: 3,
      label: "SHOP ",
      image: rabbitImg,
      link: "/shop/rabbit",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-100 to-pink-100 p-6">
      <header className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold text-orange-600 flex items-center gap-2">
          <PawPrint className="w-8 h-8" /> PetNest
        </h1>
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-semibold shadow">
          Shop Now
        </button>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-5xl font-extrabold text-gray-800 leading-tight mb-6">
            Everything Your Pet Needs in One Place
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Discover premium pet food, toys, accessories, and grooming essentials. Because your furry friend deserves the best.
          </p>
          <button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" /> Explore Now
          </button>
        </div>
        <div className="flex justify-center">
          {bannerImage ? (
            <img
              src={bannerImage}
              alt="Happy pet with toy"
              className="rounded-3xl shadow-xl max-h-[400px] object-cover"
            />
          ) : (
            <div className="w-full h-[400px] bg-gray-200 animate-pulse rounded-3xl" />
          )}
        </div>
      </main>

      <section className="mt-20">
        <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Choose by Pet Type 🐾
        </h3>
        <div className="flex flex-col md:flex-row justify-center gap-8">
          {petItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center gap-4 cursor-pointer"
              onClick={() => navigate(item.link)}
            >
              <img
                src={item.image}
                alt={item.label}
                className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-md hover:scale-105 transition-transform"
              />
              <button className="bg-green-700 text-white px-4 py-2 rounded-full text-sm font-medium">
                {item.label}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <p className="text-green-700 text-center font-medium">Special Product</p>
        <h3 className="text-3xl font-bold mb-8 text-center text-gray-800">New Arrivals Product</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.slice(0, 5).map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
                className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition cursor-pointer relative"
              >
                {product.discount && (
                  <div className="absolute top-2 left-2 bg-yellow-300 text-yellow-900 text-xs font-bold px-2 py-1 rounded">
                    -{product.discount}%
                  </div>
                )}
                <div className="w-full h-48 bg-gray-100 rounded-xl mb-4 flex items-center justify-center text-gray-400 text-sm">
                  No image
                </div>
                <h4 className="font-bold text-lg text-gray-800 text-center">{product.name}</h4>
                <div className="text-center">
                  {product.discount ? (
                    <>
                      <p className="text-orange-600 font-bold">${product.price}</p>
                      <p className="line-through text-gray-400 text-sm">${product.original_price}</p>
                    </>
                  ) : (
                    <p className="mt-2 font-semibold text-orange-600">${product.price}</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 col-span-full">No products found.</p>
          )}
        </div>
      </section>

      <section className="mt-20">
        <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Why Pet Lovers Choose Us 🐶
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Trusted Products", desc: "Only the best brands for your pets." },
            { title: "Fast Delivery", desc: "We deliver straight to your doorstep." },
            { title: "Affordable Prices", desc: "Great value without compromising quality." },
          ].map((feature, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-md">
              <h4 className="font-bold text-lg text-orange-600 mb-2">{feature.title}</h4>
              <p className="text-gray-700">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
