import React from "react";
import { useSearch } from "../../context/search";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { HiSearch } from "react-icons/hi";

const Search = () => {
  const [values, setValues] = useSearch(); // Destructure values and setValues from the context
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(`/api/v1/product/search/${values.keyword}`);
      setValues({ ...values, result: data });
      navigate("/search");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      className="flex items-center border border-gray-300 rounded-md overflow-hidden"
      onSubmit={handleSubmit}
    >
      <input
        type="search"
        placeholder="Search products..."
        value={values.keyword}
        onChange={(e) => setValues({ ...values, keyword: e.target.value })}
        className="flex-1 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-700"
      />
      <button
        type="submit"
        className="bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-500 transition flex items-center"
      >
        <HiSearch className="mr-1" />
        Search
      </button>
    </form>
  );
};

export default Search;
