import React, { useEffect, useState, lazy, Suspense } from "react";
import Layout from "../../components/Layout/Layout";
import { toast } from "react-toastify";
import axios from "axios";
import CategoryForm from "../../components/Form/CategoryForm";
import { Modal } from "antd";

const AdminMenu = lazy(() => import("../../components/Layout/AdminMenu"));

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [loading, setLoading] = useState(false);

  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // Fetch all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/v1/category/get-category`);
      if (data?.success) setCategories(data.category);
    } catch (err) {
      toast.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  // Create new category
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return toast.error("Please enter a category name");
    try {
      const { data } = await axios.post(`${BASE_URL}/api/v1/category/create-category`, { name });
      if (data?.success) {
        toast.success(`${name} created successfully`);
        setName("");
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Something went wrong while creating category");
    }
  };

  // Update category
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.put(
        `${BASE_URL}/api/v1/category/update-category/${selected._id}`,
        { name: updatedName }
      );
      if (data.success) {
        toast.success(`${updatedName} updated successfully`);
        setVisible(false);
        setUpdatedName("");
        setSelected(null);
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  // Delete category
  const handleDelete = async (id, name) => {
    try {
      const { data } = await axios.delete(`${BASE_URL}/api/v1/category/delete-category/${id}`);
      if (data.success) {
        toast.success(`${name} deleted successfully`);
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to delete category");
    }
  };

  return (
    <Layout title="Admin - Manage Categories">
      <div className="container mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <Suspense fallback={<div className="text-center text-gray-500">Loading menu...</div>}>
              <AdminMenu />
            </Suspense>
          </div>

          {/* Main content */}
          <div className="lg:w-3/4">
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
                Manage Categories
              </h2>

              {/* Create form */}
              <div className="max-w-md mx-auto mb-6">
                <CategoryForm handleSubmit={handleSubmit} value={name} setValue={setName} />
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-indigo-600 text-white">
                    <tr>
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.length > 0 ? (
                      categories.map((c) => (
                        <tr key={c._id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-2">{c.name}</td>
                          <td className="px-4 py-2">
                            <button
                              className="px-3 py-1 mr-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
                              onClick={() => {
                                setVisible(true);
                                setUpdatedName(c.name);
                                setSelected(c);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                              onClick={() => handleDelete(c._id, c.name)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2" className="px-4 py-6 text-center text-gray-500">
                          No categories found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for editing */}
      <Modal
        onCancel={() => {
          setVisible(false);
          setUpdatedName("");
        }}
        footer={null}
        open={visible}
      >
        <CategoryForm
          value={updatedName}
          setValue={setUpdatedName}
          handleSubmit={handleUpdate}
          disabled={loading}
        />
      </Modal>
    </Layout>
  );
};

export default CreateCategory;
