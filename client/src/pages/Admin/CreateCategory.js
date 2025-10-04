import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import { toast } from "react-toastify";
import axios from "axios";
import 'antd/dist/reset.css';
import CategoryForm from "../../components/Form/CategoryForm";
import { Modal } from "antd";

const CreateCategory = () => {

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [loading, setLoading] = useState(false);  // Added loading state

  // Handle category creation form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/v1/category/create-category', { name });
      if (data?.success) {
        toast.success(`${name} is created`);
        setName("");  // Clear the input field
        getAllCategory();  // Refresh category list
      } else {
        toast.error(data.message);
        setName("");  // Clear the input field
      }
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong in input form');
    }
  };

  // Get all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get('/api/v1/category/get-category');
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong in getting category');
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  // Handle category update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);  // Start loading
    try {
      const { data } = await axios.put(`/api/v1/category/update-category/${selected._id}`, { name: updatedName });
      if (data.success) {
        toast.success(`${updatedName} is updated`);
        setSelected(null);
        setUpdatedName("");
        setVisible(false);
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Something went wrong in Update Category');
    } finally {
      setLoading(false);  // Stop loading
    }
  };

  // Handle category deletion
  const handleDelete = async (pid, name) => {
    try {
      const { data } = await axios.delete(`/api/v1/category/delete-category/${pid}`);
      if (data.success) {
        toast.success(`${name} is deleted`);
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Something went wrong in Delete Category');
    }
  };

  return (
    <Layout title={"Dashboard - Create Category"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9 ">
            <h1 className="text-center">Manage Category</h1>
            <div className="w-100 d-flex justify-content-center">
              <CategoryForm handleSubmit={handleSubmit} value={name} setValue={setName} />
            </div>
            <div className="w-50 mx-auto">
              <table className="table  ">
                <thead >
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories?.length > 0 ? (
                    categories.map(c => (
                      <tr key={c._id}>
                        <td>{c.name}</td>
                        <td>
                          <button
                            className="btn btn-primary ms-2"
                            onClick={() => {
                              setVisible(true);
                              setUpdatedName(c.name);
                              setSelected(c);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger ms-2"
                            onClick={() => handleDelete(c._id, c.name)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2">No categories found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <Modal
            onCancel={() => {
              setVisible(false);
              setUpdatedName(""); // Reset updated name when modal closes
            }}
            footer={null}
            visible={visible}
          >
            <CategoryForm value={updatedName} setValue={setUpdatedName} handleSubmit={handleUpdate} disabled={loading} />
          </Modal>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;
