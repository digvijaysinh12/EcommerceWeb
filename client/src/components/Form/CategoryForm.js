import React from "react";

const CategoryForm = ({ handleSubmit, value, setValue, disabled }) => {
  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter category name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
        <button
          type="submit"
          disabled={disabled}
          className={`${
            disabled ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
          } text-white px-4 py-2 rounded transition`}
        >
          {disabled ? "Saving..." : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;
