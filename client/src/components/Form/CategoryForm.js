import React from "react";

const CategoryForm = ({ handleSubmit, value, setValue }) => {
  
  return (
    <>
<form>
  <div class="mb-3 d-flex">
    <input
      type="text"
      class="form-control me-2"
      placeholder="Enter new category"
    />
    <button type="submit" class="btn btn-primary">
      Submit
    </button>
  </div>
</form>

    </>
  );
};

export default CategoryForm;