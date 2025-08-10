import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PackagingDetailInfoCard from "./PackagingDetailInfoCard";
import PackagingDetailComponentsTable from "./PackagingDetailComponentsTable";

const PackagingDetailTabs = ({ currentItem, activeTab, setActiveTab, t }: any) => (
  <Tabs value={activeTab} onValueChange={setActiveTab}>
    <TabsList>
      <TabsTrigger value="informationen">{t("tabs.information")}</TabsTrigger>
      <TabsTrigger value="bestandteile">{t("tabs.components")}</TabsTrigger>
      <TabsTrigger value="dokumente">{t("tabs.documents")}</TabsTrigger>
    </TabsList>
    <TabsContent value="informationen" className="space-y-6">
      <PackagingDetailInfoCard currentItem={currentItem} t={t} />
    </TabsContent>
    <TabsContent value="bestandteile" className="space-y-6">
      <PackagingDetailComponentsTable components={currentItem.components} t={t} />
    </TabsContent>
    <TabsContent value="dokumente" className="space-y-6">
      <div>{t("documents.comingSoon")}</div>
    </TabsContent>
  </Tabs>
);

export default PackagingDetailTabs; 