import React from "react";
import { useSearch } from "../../context/search";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const SearchInput = () => {
  const [values, setValues] = useSearch();//custom hook from context
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // e.target.value="";
    try {
      const { data } = await axios.get(
        `/api/v1/product/search/${values.keyword}`
      );
      setValues({ ...values, results: data });
      // setValues({ ...values, keyword: "" });
      navigate("/search");//new page
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <form className="d-flex p-2" role="search" onSubmit={handleSubmit}>
        <input
          className="form-control me-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
          value={values.keyword}
          onChange={(e) => setValues({ ...values, keyword: e.target.value })}
        />
        <button className="btn btn-outline-success" type="submit">
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchInput;