import React from 'react';
import MainLayout from '../../modules/admin/layouts/MainLayout';
import AdminActions from '../../modules/admin/components/audit/AdminActions';

const AdminActionsPage = () => {
  return (
    <MainLayout>
      <div className="p-6">
        <AdminActions />
      </div>
    </MainLayout>
  );
};

export default AdminActionsPage;
