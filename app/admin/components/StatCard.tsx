import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  icon: LucideIcon;
  primaryValue: string | number;
  primaryLabel: string;
  secondaryValue?: string | number;
  secondaryLabel?: string;
  onClick?: () => void;
}

export default function StatCard({ 
  title, 
  icon: Icon, 
  primaryValue, 
  primaryLabel, 
  secondaryValue, 
  secondaryLabel,
  onClick
}: StatCardProps) {
  return (
    <Card onClick={onClick} className="h-full flex flex-col border-[#eaeaea] shadow-sm rounded-[12px] bg-white group cursor-pointer transition-all hover:shadow-md">
      <CardContent className="p-5 flex flex-col justify-between flex-1 gap-4">
        
        {/* Header Row */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all bg-white border border-[#eaeaea] group-hover:bg-[#1877f2] group-hover:border-[#1877f2] group-hover:shadow-[0_4px_12px_rgba(24,119,242,0.3)]">
            <Icon className="w-4 h-4 text-[#a0aab4] group-hover:text-white transition-colors" />
          </div>
          <span className="font-semibold text-[14px] text-[#111111]">{title}</span>
        </div>
        
        {/* Divider */}
        <div className="h-[1px] w-full bg-[#f0f2f5]" />
        
        {/* Metrics Row */}
        <div className="flex items-center">
          <div className="flex-1 flex flex-col gap-0.5">
            <span className="text-[20px] font-bold text-[#111111] leading-none">{primaryValue}</span>
            <span className="text-[12px] text-[#9ca3af] font-medium">{primaryLabel}</span>
          </div>
          
          {secondaryValue !== undefined && secondaryLabel !== undefined && (
            <div className="flex-1 flex flex-col gap-0.5 pl-4">
              <span className="text-[20px] font-bold text-[#111111] leading-none">{secondaryValue}</span>
              <span className="text-[12px] text-[#9ca3af] font-medium">{secondaryLabel}</span>
            </div>
          )}
        </div>
        
      </CardContent>
    </Card>
  );
}
