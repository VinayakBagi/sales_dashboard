import axios from "axios";
import React, { useEffect, useState } from "react";
import { SERVER_URL } from "../constants";
import { processReponseData } from "../utils";
import { PacmanLoader } from "react-spinners";

const Insights = () => {
  const [insights, setInsights] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${SERVER_URL}api/sales/insights`);
        const processedData = processReponseData(response.data.insights);
        setInsights(processedData);
      } catch (error) {
        setError("Error fetching insights");
        console.error("Error fetching insights:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  return (
    <div>
      <h2>Sales Insights</h2>
      {loading ? (
        <PacmanLoader color="#36d7b7" loading={loading} />
      ) : error ? (
        <p>{error}</p>
      ) : (
        <p>{insights}</p>
      )}
    </div>
  );
};

export default Insights;
