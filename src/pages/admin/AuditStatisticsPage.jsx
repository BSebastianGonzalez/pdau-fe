import React from "react";
import MainLayout from "../../modules/admin/layouts/MainLayout";
import AuditStatistics from "../../modules/admin/components/audit/AuditStatistics";

const AuditStatisticsPage = () => {
  return (
    <MainLayout>
      <div className="p-6">
        <AuditStatistics />
      </div>
    </MainLayout>
  );
};

export default AuditStatisticsPage;
