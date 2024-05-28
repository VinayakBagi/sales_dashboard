import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import LineChart from "../components/LineChart";
import BarChart from "../components/BarChart";
import PieChart from "../components/PieChart";
import KeyMetricCard from "../components/KeyMetricCard";
import DateRangeFilter from "../components/DateRangeFilter";
import { CHART_TYPE, SERVER_URL } from "../constants";
import { calculateMetrics, aggregateDataByMonth } from "../utils";
import Insights from "../components/Insights";
import Forecast from "../components/Forecast";
import Query from "../components/Query";

const SalesDashboard = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [drillDownData, setDrillDownData] = useState(null);
  const [drillDownTitle, setDrillDownTitle] = useState("");
  const [drillDownChartType, setDrillDownChartType] = useState("");
  const drillDownRef = useRef(null);

  useEffect(() => {
    setMonthlyData(aggregateDataByMonth(filteredData));
    handleDrillDownReset();
  }, [filteredData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}api/sales`);
        setSalesData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error("Error fetching insights:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (drillDownRef.current) {
      drillDownRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [drillDownData]);

  const handleDateRangeChange = (startDate, endDate) => {
    if (startDate && endDate) {
      const filtered = salesData.filter(
        (data) =>
          new Date(data.date) >= startDate && new Date(data.date) <= endDate
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(salesData);
    }
  };

  const handleDrillDown = (labelField, valueField, value, chartType) => {
    const data = filteredData.filter((d) => d[labelField] === value);
    setDrillDownData(data);
    setDrillDownTitle(`Drill-down for ${value}`);
    setDrillDownChartType(chartType);
  };

  const handleDrillDownReset = () => {
    setDrillDownData(null);
    setDrillDownTitle("");
    setDrillDownChartType("");
  };

  const handleLineChartDrillDown = (month) => {
    const data = filteredData.filter(
      (d) => new Date(d.date).toISOString().slice(0, 7) === month
    );
    setDrillDownData(data);
    setDrillDownTitle(
      `Drill-down for ${new Date(month).toLocaleString("default", {
        month: "long",
        year: "numeric",
      })}`
    );
    setDrillDownChartType(CHART_TYPE.LINE);
  };

  const metrics = useMemo(() => calculateMetrics(filteredData), [filteredData]);

  const renderDrillDown = drillDownData && (
    <div className="drill-down" ref={drillDownRef}>
      <h2>{drillDownTitle}</h2>
      <button style={{ marginBottom: "20px" }} onClick={handleDrillDownReset}>
        Close
      </button>
      {drillDownChartType === CHART_TYPE.BAR && (
        <BarChart
          data={drillDownData}
          labelField="region"
          valueField="revenue"
        />
      )}
      {drillDownChartType === CHART_TYPE.PIE && (
        <PieChart
          data={drillDownData}
          labelField="category"
          valueField="revenue"
        />
      )}
      {drillDownChartType === CHART_TYPE.LINE && (
        <LineChart
          data={drillDownData}
          labelField="date"
          valueField="revenue"
        />
      )}
    </div>
  );

  return (
    <div className="dashboard">
      <h1>Sales Dashboard</h1>
      <DateRangeFilter onDateRangeChange={handleDateRangeChange} />
      <section className="metrics">
        <KeyMetricCard
          title="Total Revenue"
          value={`$${metrics.totalRevenue}`}
        />
        <KeyMetricCard title="Total Orders" value={metrics.totalOrders} />
        <KeyMetricCard title="New Customers" value={metrics.newCustomers} />
        <KeyMetricCard
          title="Average Order Value"
          value={`$${metrics.avgOrderValue}`}
        />
        <KeyMetricCard title="Top Category" value={metrics.topCategoryName} />
      </section>
      <section className="charts-container">
        <div className="charts">
          <BarChart
            data={filteredData}
            labelField="category"
            valueField="revenue"
            onDrillDown={handleDrillDown}
          />
          <PieChart
            data={filteredData}
            labelField="region"
            valueField="revenue"
            onDrillDown={handleDrillDown}
          />
          <LineChart
            data={monthlyData}
            labelField="date"
            valueField="revenue"
            handleLineChartDrillDown={handleLineChartDrillDown}
          />
        </div>
        {renderDrillDown}
      </section>
      <section>
        <Insights />
      </section>
      <section>
        <Forecast />
      </section>
      <section>
        <Query />
      </section>
    </div>
  );
};

export default SalesDashboard;
