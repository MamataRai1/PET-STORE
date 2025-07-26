import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  // Form state
  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    description: "",
    price: "",
    brand: "",
    categories: [],   // array of category IDs for M2M
    stock: 0,
    is_active: true,
    image: null,
  });

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  // For image preview
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch brands and categories on mount
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/brand/")
      .then((res) => res.json())
      .then(setBrands)
      .catch(() => setBrands([]));

    const token = localStorage.getItem("access");
    fetch("http://127.0.0.1:8000/api/category/", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => res.json())
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  // Fetch product data if editing
  useEffect(() => {
    if (isEditMode) {
      fetch(`http://127.0.0.1:8000/api/product/${id}/`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch product");
          return res.json();
        })
        .then((data) => {
          setFormData({
            sku: data.sku,
            name: data.name,
            description: data.description,
            price: data.price,
            brand: data.brand,
            categories: data.categories || [],
            stock: data.stock,
            is_active: data.is_active,
            image: null, // clear file input
          });
          if (data.main_image) {
            setImagePreview(`http://127.0.0.1:8000${data.main_image}`);
          } else {
            setImagePreview(null);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;

    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    } else if (type === "checkbox" && name === "categories") {
      const categoryId = parseInt(value, 10);
      setFormData((prev) => {
        let updatedCategories = [...prev.categories];
        if (checked) {
          if (!updatedCategories.includes(categoryId)) updatedCategories.push(categoryId);
        } else {
          updatedCategories = updatedCategories.filter((id) => id !== categoryId);
        }
        return { ...prev, categories: updatedCategories };
      });
    } else if (type === "checkbox" && name === "is_active") {
      setFormData((prev) => ({ ...prev, is_active: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("sku", formData.sku);
    form.append("name", formData.name);
    form.append("description", formData.description);
    form.append("price", formData.price);
    form.append("brand", Number(formData.brand));
    form.append("stock", formData.stock);
    form.append("is_active", formData.is_active);

    formData.categories.forEach((catId) => {
      form.append("categories", Number(catId));
    });

    if (formData.image) {
      form.append("main_image", formData.image);
    }

    const url = isEditMode
      ? `http://127.0.0.1:8000/api/product/${id}/`
      : "http://127.0.0.1:8000/api/product/";

    const method = isEditMode ? "PATCH" : "POST";
    const token = localStorage.getItem("access");

    try {
      const response = await fetch(url, {
        method,
        body: form,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (response.ok) {
        alert(`Product ${isEditMode ? "updated" : "created"} successfully!`);
        navigate("/admin/products");
      } else {
        const errorText = await response.text();
        alert("Error: " + errorText);
      }
    } catch (err) {
      alert("Error submitting form");
      console.error(err);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded shadow mt-8">
      <h2 className="text-xl font-bold mb-4">
        {isEditMode ? "Edit Product" : "Add New Product"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* SKU */}
        <div>
          <label className="block mb-1 font-medium">SKU</label>
          <input
            name="sku"
            type="text"
            value={formData.sku}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Name */}
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block mb-1 font-medium">Price</label>
          <input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Brand */}
        <div>
          <label className="block mb-1 font-medium">Brand</label>
          <select
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Brand</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Categories */}
        <div>
          <label className="block mb-1 font-medium">Categories</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <label key={cat.id} className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="categories"
                  value={cat.id}
                  checked={formData.categories.includes(cat.id)}
                  onChange={handleChange}
                />
                <span>{cat.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Stock */}
        <div>
          <label className="block mb-1 font-medium">Stock</label>
          <input
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleChange}
            min="0"
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Active */}
        <div>
          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
            />
            <span>Active</span>
          </label>
        </div>

        {/* Main Image */}
        <div>
          <label className="block mb-1 font-medium">Main Image</label>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            accept="image/*"
            className="w-full border px-3 py-2 rounded"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-2 h-24 rounded object-cover"
            />
          )}
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {isEditMode ? "Update Product" : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
