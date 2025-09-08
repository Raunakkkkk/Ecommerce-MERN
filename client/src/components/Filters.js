import React from "react";
import { Checkbox, Radio } from "antd";
import { Prices } from "./Prices";

const Filters = ({
  categories = [],
  onCategoryToggle,
  onPriceChange,
  onClear,
}) => {
  return (
    <div className="filters">
      <h4 className="text-center">Filter by Category</h4>
      <div className="d-flex flex-column">
        {categories?.map((category) => (
          <Checkbox
            key={category._id}
            onChange={(e) => onCategoryToggle(e.target.checked, category._id)}
          >
            {category.name}
          </Checkbox>
        ))}
      </div>

      <h4 className="text-center mt-4">Filter by Price</h4>
      <div className="d-flex flex-column">
        <Radio.Group onChange={(e) => onPriceChange(e.target.value)}>
          {Prices?.map((priceOption) => (
            <div key={priceOption._id}>
              <Radio value={priceOption.array}>{priceOption.name}</Radio>
            </div>
          ))}
        </Radio.Group>
      </div>

      <div className="d-flex flex-column mt-3">
        <button className="btn btn-danger" onClick={onClear}>
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default Filters;
