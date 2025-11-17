import React from 'react';
import MainLayout from '../../modules/admin/layouts/MainLayout';
import AdminList from '../../modules/admin/components/audit/AdminList';

const AuditActionsPage = () => {
  return (
    <MainLayout>
      <div className="p-6">
        <AdminList />
      </div>
    </MainLayout>
  );
};

export default AuditActionsPage;
