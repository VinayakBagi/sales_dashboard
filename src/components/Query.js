import React, { useState } from "react";
import axios from "axios";
import { SERVER_URL } from "../constants";
import { processReponseData } from "../utils";
import { PacmanLoader } from "react-spinners";

const Query = () => {
  const [query, setQuery] = useState(
    "Which region had the highest sales growth in the last month?"
  );
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleQuery = async () => {
    setLoading(true);
    setError("");
    setAnswer("");
    try {
      const response = await axios.post(`${SERVER_URL}api/sales/query`, {
        query,
      });
      const processedData = processReponseData(response.data.answer);

      setAnswer(processedData);
    } catch (error) {
      setError("Error processing query");
      console.error("Error processing query:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Ask a Question</h2>
      <section className="llm-query">
        <input
          style={{ width: "80%" }}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your question here"
        />
        <button onClick={handleQuery}>Submit</button>
      </section>
      {loading ? (
        <PacmanLoader color="#36d7b7" loading={loading} />
      ) : error ? (
        <p>{error}</p>
      ) : (
        <p>{answer}</p>
      )}
    </div>
  );
};

export default Query;
