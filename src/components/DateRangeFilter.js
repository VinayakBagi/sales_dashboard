import React, { useState } from "react";

function DateRangeFilter({ onDateRangeChange }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (startDate && endDate) {
      onDateRangeChange(new Date(startDate), new Date(endDate));
    }
  };

  return (
    <form className="date-range-filter" onSubmit={handleSubmit}>
      <label>
        <span>Start Date : </span>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </label>
      <label>
        <span>End Date : </span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </label>
      <button type="submit">Filter</button>
      <button
        type="button"
        onClick={() => {
          setStartDate("");
          setEndDate("");
          onDateRangeChange("", "");
        }}
      >
        Reset
      </button>
    </form>
  );
}

export default DateRangeFilter;
