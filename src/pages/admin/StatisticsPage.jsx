import React from "react";
import MainLayout from "../../modules/admin/layouts/MainLayout";
import Graph from "../../modules/admin/components/statistics/Graph";

const StatisticsPage = () => {
  return (
    <MainLayout>
      <div className="p-6">
        <Graph />
      </div>
    </MainLayout>
  );
};

export default StatisticsPage;
