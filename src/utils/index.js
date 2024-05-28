import parse from "html-react-parser";

export const calculateMetrics = (data) => {
  let totalRevenue = 0;
  let totalOrders = data.length;
  let newCustomers = 0;
  let categoryRevenue = {};

  data.forEach((item) => {
    totalRevenue += item.revenue;
    newCustomers += item.newCustomers;

    if (!categoryRevenue[item.category]) {
      categoryRevenue[item.category] = 0;
    }
    categoryRevenue[item.category] += item.revenue;
  });

  const avgOrderValue = totalOrders
    ? +(totalRevenue / totalOrders).toFixed(2)
    : 0;
  const topCategoryName = Object.keys(categoryRevenue).reduce(
    (a, b) => (categoryRevenue[a] > categoryRevenue[b] ? a : b),
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
