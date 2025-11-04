import React, { useState, useEffect, lazy, Suspense } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { Select } from "antd";

const { Option } = Select;

// Lazy load components
const Layout = lazy(() => import("../../components/Layout/Layout"));
const AdminMenu = lazy(() => import("../../components/Layout/AdminMenu"));

const UpdateProduct = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("0");
  const [photo, setPhoto] = useState(null);
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Base URL from environment
  const BASE_URL = process.env.REACT_APP_API_URL;

  // Fetch product
  const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/v1/product/get-product/${params.slug}`);
      const p = data.product;
      setName(p.name);
      setId(p._id);
      setDescription(p.description);
      setPrice(p.price);
      setQuantity(p.quantity);
      setShipping(p.shipping ? "1" : "0");
      setCategory(p.category._id);
    } catch {
      toast.error("Failed to load product");
    }
  };

  // Fetch categories
  const getAllCategories = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/v1/category/get-category`);
      if (data?.success) setCategories(data.category);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    getSingleProduct();
    getAllCategories();
  }, [params.slug]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      productData.append("category", category);
      productData.append("shipping", shipping);
      if (photo) productData.append("photo", photo);

      const { data } = await axios.put(`${BASE_URL}/api/v1/product/update-product/${id}`, productData);

      if (data?.success) {
        toast.success("Product Updated Successfully");
        navigate("/dashboard/admin/products");
      } else {
        toast.error(data?.message);
      }
    } catch {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setLoading(true);
    try {
      const { data } = await axios.delete(`${BASE_URL}/api/v1/product/delete-product/${id}`);
      if (data?.success) {
        toast.success("Product Deleted Successfully");
        navigate("/dashboard/admin/products");
      } else toast.error(data?.message || "Delete failed");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Suspense fallback={<div className="text-center py-10 text-gray-500">Loading...</div>}>
      <Layout title="Dashboard - Update Product">
        <div className="flex flex-col lg:flex-row gap-6 mx-4 my-6">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <AdminMenu />
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4 bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Update Product</h1>

            {/* Category */}
            <Select
              bordered={false}
              placeholder="Select a category"
              size="large"
              showSearch
              className="w-full mb-4"
              value={category}
              onChange={setCategory}
            >
              {categories?.map((c) => (
                <Option key={c._id} value={c._id}>{c.name}</Option>
              ))}
            </Select>

            {/* Photo */}
            <div className="mb-4">
              <label className="cursor-pointer bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded w-full text-center block">
                {photo ? photo.name : "Upload Photo"}
                <input type="file" accept="image/*" hidden onChange={(e) => setPhoto(e.target.files[0])} />
              </label>
              <div className="mt-4 text-center">
                <img
                  src={photo ? URL.createObjectURL(photo) : `${BASE_URL}/api/v1/product/product-photo/${id}`}
                  alt={name || "product_photo"}
                  className="mx-auto rounded shadow h-48 object-cover"
                  onError={(e) => (e.target.src = "https://via.placeholder.com/200")}
                />
              </div>
            </div>

            {/* Product Details */}
            <input
              type="text"
              value={name}
              placeholder="Product Name"
              className="w-full mb-4 p-2 border rounded"
              onChange={(e) => setName(e.target.value)}
            />
            <textarea
              value={description}
              placeholder="Description"
              className="w-full mb-4 p-2 border rounded"
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="number"
              value={price}
              placeholder="Price"
              className="w-full mb-4 p-2 border rounded"
              onChange={(e) => setPrice(e.target.value)}
            />
            <input
              type="number"
              value={quantity}
              placeholder="Quantity"
              className="w-full mb-4 p-2 border rounded"
              onChange={(e) => setQuantity(e.target.value)}
            />

            {/* Shipping */}
            <Select
              bordered={false}
              placeholder="Select Shipping"
              size="large"
              className="w-full mb-6"
              value={shipping}
              onChange={setShipping}
            >
              <Option value="0">No</Option>
              <Option value="1">Yes</Option>
            </Select>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                className="flex-1 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
                onClick={handleUpdate}
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Product"}
              </button>
              <button
                className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete Product"}
              </button>
            </div>
          </div>
        </div>
      </Layout>
    </Suspense>
  );
};

export default UpdateProduct;
