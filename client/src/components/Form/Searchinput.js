import React from "react";
import { useSearch } from "../../context/search";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const SearchInput = () => {
  const [values, setValues] = useSearch(); //custom hook from context
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // e.target.value="";
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_ENDPOINT}/api/v1/product/search/${values.keyword}`
      );
      setValues({ ...values, results: data });
      // setValues({ ...values, keyword: "" });
      navigate("/search"); //new page
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <form
        className="d-flex justify-content-center align-items-center w-100 flex-nowrap"
        role="search"
        onSubmit={handleSubmit}
      >
        <input
          className="form-control me-2 border-0 shadow-sm"
          type="search"
          placeholder="Search..."
          aria-label="Search"
          value={values.keyword}
          onChange={(e) => setValues({ ...values, keyword: e.target.value })}
          style={{
            borderRadius: "20px",
            padding: "6px 12px",
            backgroundColor: "#f8f9fa",
            border: "1px solid #e9ecef",
            width: "100%",
            fontSize: "13px",
          }}
        />
        <button
          className="btn btn-outline-secondary border-0 flex-shrink-0"
          type="submit"
          style={{
            borderRadius: "20px",
            padding: "6px 12px",
            backgroundColor: "#6c757d",
            color: "white",
            fontWeight: "500",
            fontSize: "13px",
          }}
        >
          <i className="fas fa-search me-1"></i>
          <span className="d-none d-sm-inline">Search</span>
        </button>
      </form>
    </div>
  );
};

export default SearchInput;
