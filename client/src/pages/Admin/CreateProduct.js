import React, { useState, useEffect, lazy, Suspense } from "react";
import Layout from "../../components/Layout/Layout";
import { toast } from "react-toastify";
import axios from "axios";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

// Lazy load AdminMenu
const AdminMenu = lazy(() => import("../../components/Layout/AdminMenu"));

const CreateProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const BASE_URL = process.env.REACT_APP_API_URL;

  // Fetch categories
  const getAllCategories = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/v1/category/get-category`);
      if (data?.success) setCategories(data.category);
    } catch {
      toast.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  // Handle product creation
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name || !description || !price || !quantity || !category) {
      return toast.error("Please fill all required fields");
    }
    if (!photo) {
      return toast.error("Please upload a product image");
    }

    setLoading(true);
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      productData.append("shipping", shipping);
      productData.append("photo", photo);
      productData.append("category", category);

      const { data } = await axios.post(`${BASE_URL}/api/v1/product/create-product`, productData);

      if (data.success) {
        toast.success("Product created successfully");
        navigate("/dashboard/admin/products");
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Dashboard - Create Product">
      <div className="container mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <Suspense fallback={<div className="text-center text-gray-500">Loading menu...</div>}>
              <AdminMenu />
            </Suspense>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white shadow-md rounded-lg p-6">
              <h1 className="text-2xl font-bold text-center mb-6">Create Product</h1>

              <form onSubmit={handleCreate} className="space-y-4">
                {/* Category */}
                <Select
                  placeholder="Select a category"
                  size="large"
                  className="w-full"
                  value={category}
                  onChange={setCategory}
                >
                  {categories?.map((c) => (
                    <Option key={c._id} value={c._id}>
                      {c.name}
                    </Option>
                  ))}
                </Select>

                {/* Photo Upload */}
                <div>
                  <label className="block w-full cursor-pointer px-4 py-2 border border-gray-300 rounded-lg text-center bg-gray-50 hover:bg-gray-100 transition">
                    {photo ? photo.name : "Upload Photo"}
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => setPhoto(e.target.files[0])}
                    />
                  </label>
                </div>

                {photo && (
                  <div className="text-center">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="product"
                      className="h-40 mx-auto rounded-lg shadow-md"
                    />
                  </div>
                )}

                {/* Product Details */}
                <input
                  type="text"
                  placeholder="Product Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <textarea
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  rows="4"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />

                {/* Shipping Option */}
                <Select
                  placeholder="Shipping"
                  size="large"
                  className="w-full"
                  value={shipping}
                  onChange={setShipping}
                >
                  <Option value="Yes">Yes</Option>
                  <Option value="No">No</Option>
                </Select>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Product"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProduct;
