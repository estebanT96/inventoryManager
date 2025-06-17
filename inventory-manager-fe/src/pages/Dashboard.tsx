import React from "react";
import { PageContainer } from "@toolpad/core/PageContainer";
import Table from "../components/Table";
import InventoryMetrics from "../components/InventoryMetrics";
const Dashboard: React.FC = () => {
  return (
    <PageContainer>
      <h1>Inventory Manager</h1>
      <Table />
      <InventoryMetrics />
    </PageContainer>
  );
};

export default Dashboard;
