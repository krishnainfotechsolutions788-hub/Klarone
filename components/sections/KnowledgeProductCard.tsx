import { Laptop, Cpu, Battery, Weight, ShoppingCart, Calendar, Bell } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface KnowledgeLaptopProps {
  laptop: {
    id: string;
    brand_name: string;
    model: string;
    series?: string;
    cpu: string;
    ram: string;
    storage: string;
    battery: string;
    weight: number;
    inventory_model_id: string | null;
  };
}

export default function KnowledgeProductCard({ laptop }: KnowledgeLaptopProps) {
  const isAvailable = !!laptop.inventory_model_id;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-lg shadow-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      <div className="mb-4">
        <p className="text-[#00A7B5] font-semibold text-sm mb-1">{laptop.brand_name}</p>
        <h3 className="text-xl font-bold font-sora text-gray-900 leading-tight">
          {laptop.model}
        </h3>
        {laptop.series && <p className="text-gray-500 text-sm mt-0.5">{laptop.series}</p>}
      </div>

      <div className="space-y-3 mb-8 flex-1">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Cpu className="w-4 h-4 text-gray-400" />
          <span className="truncate">{laptop.cpu}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Laptop className="w-4 h-4 text-gray-400" />
          <span>{laptop.ram} • {laptop.storage}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Battery className="w-4 h-4 text-gray-400" />
          <span>{laptop.battery}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Weight className="w-4 h-4 text-gray-400" />
          <span>{laptop.weight} kg</span>
        </div>
      </div>

      <div className="pt-5 border-t border-gray-100 mt-auto">
        {isAvailable ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex w-2 h-2 rounded-full bg-green-500"></span>
              <span className="text-xs font-semibold text-green-700 uppercase tracking-wider">Available in Inventory</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Link href={`/shop/${laptop.inventory_model_id}`} className="block">
                <Button className="w-full bg-[#111111] hover:bg-gray-800 text-white">
                  <ShoppingCart className="w-4 h-4 mr-2" /> Buy
                </Button>
              </Link>
              <Link href={`/shop/${laptop.inventory_model_id}?action=rent`} className="block">
                <Button variant="outline" className="w-full border-gray-200">
                  <Calendar className="w-4 h-4 mr-2" /> Rent
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex w-2 h-2 rounded-full bg-orange-400"></span>
              <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider">Currently Unavailable</span>
            </div>
            <Link href={`/#find-my-laptop`} className="block">
              <Button className="w-full bg-[#00A7B5] hover:bg-[#0096a3] text-white">
                <Bell className="w-4 h-4 mr-2" /> Request Sourcing
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
