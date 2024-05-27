import React, { useEffect, useState } from "react";
import axios from "axios";
import { SERVER_URL } from "../constants";
import { processReponseData } from "../utils";
import { PacmanLoader } from "react-spinners";

const Forecast = () => {
  const [forecast, setForecast] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchForecast = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${SERVER_URL}api/sales/forecast`);
        const processedData = processReponseData(response.data.forecast);
        setForecast(processedData);
      } catch (error) {
        setError("Error fetching forecast");
        console.error("Error fetching forecast:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, []);

  return (
    <div>
      <h2>Sales Forecast</h2>
      {loading ? (
        <PacmanLoader color="#36d7b7" loading={loading} />
      ) : error ? (
        <p>{error}</p>
      ) : (
        <p>{forecast}</p>
      )}
    </div>
  );
};

export default Forecast;
