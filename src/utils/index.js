import parse from "html-react-parser";

export const calculateMetrics = (data) => {
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = data.length;
  const newCustomers = data.reduce((sum, item) => sum + item.newCustomers, 0);
  const avgOrderValue = totalOrders
    ? (totalRevenue / totalOrders).toFixed(2)
    : 0;
  const topCategory = data.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = 0;
    }
    acc[item.category] += item.revenue;
    return acc;
  }, {});
  const topCategoryName = Object.keys(topCategory).reduce(
    (a, b) => (topCategory[a] > topCategory[b] ? a : b),
    ""
  );

  return {
    totalRevenue,
    totalOrders,
    newCustomers,
    avgOrderValue,
    topCategoryName,
  };
};

export const aggregateDataByMonth = (data) => {
  const result = {};
  data.forEach((item) => {
    const month = new Date(item.date).toISOString().slice(0, 7);
    if (!result[month]) {
      result[month] = { date: month, revenue: 0 };
    }
    result[month].revenue += item.revenue;
  });
  return Object.values(result);
};

export const processReponseData = (data) => {
  return parse(
    (data || "")
      .replaceAll("}\n", "")
      .replaceAll("**:", "</b>")
      .replaceAll("**", "<b>")
      .replaceAll(/\s(\d+)\.\s/g, "<br/>")
  );
};
