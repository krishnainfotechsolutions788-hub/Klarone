import { ReceiptText, Store, Download, Truck } from "lucide-react";
import StatCard from "./components/StatCard";
import { ChannelPerformance, AverageSales, TopProducts, TotalVisitor } from "./components/DashboardCharts";
import RecentActivity from "./components/RecentActivity";
import { mockCategories, mockProducts, mockVariants, mockUnits, mockInventoryStock } from "@/lib/mock-data";

export default function AdminDashboard() {
  const totalCategories = mockCategories.length;
  const totalProducts = mockProducts.length;
  const totalVariants = mockVariants.length;

  const serializedItemsCount = mockUnits.length;
  const nonSerializedItemsCount = mockInventoryStock.reduce((acc, stock) => acc + stock.quantity, 0);
  const totalInventoryItems = serializedItemsCount + nonSerializedItemsCount;

  const inventoryValueSerialized = mockUnits.reduce((acc, unit) => acc + (unit.purchase_price || 0), 0);
  const inventoryValueNonSerialized = mockInventoryStock.reduce((acc, stock) => acc + ((stock.purchase_price || 0) * stock.quantity), 0);
  const totalInventoryValue = inventoryValueSerialized + inventoryValueNonSerialized;

  const activeRentals = mockUnits.filter(u => u.status === 'rented').length;

  return (
    <div className="flex flex-col gap-4 max-w-[1600px] mx-auto">
      
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Orders Provided"
          icon={ReceiptText}
          primaryValue="210"
          primaryLabel="Processing"
          secondaryValue="109"
          secondaryLabel="Processed"
        />
        <StatCard
          title="Store Product"
          icon={Store}
          primaryValue="3.4k"
          primaryLabel="Total"
          secondaryValue="352"
          secondaryLabel="Sold out"
        />
        <StatCard
          title="Orders Imported"
          icon={Download}
          primaryValue="176"
          primaryLabel="New"
          secondaryValue="315"
          secondaryLabel="Total"
        />
        <StatCard
          title="Orders Dispatched"
          icon={Truck}
          primaryValue="256"
          primaryLabel="Total"
          secondaryValue="49"
          secondaryLabel="Return"
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-[400px]">
        <div className="lg:col-span-1">
          <ChannelPerformance />
        </div>
        <div className="lg:col-span-2">
          <AverageSales />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-[400px]">
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
        <div className="lg:col-span-1">
          <TopProducts />
        </div>
        <div className="lg:col-span-1">
          <TotalVisitor />
        </div>
      </div>

    </div>
  );
}
