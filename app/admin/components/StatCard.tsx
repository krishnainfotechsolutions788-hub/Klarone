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
    <Card onClick={onClick} className="h-full flex flex-col border-white/10 shadow-xl rounded-2xl bg-[#111113]/90 backdrop-blur-md group cursor-pointer transition-all hover:border-white/20 hover:bg-[#161619]">
      <CardContent className="p-5 flex flex-col justify-between flex-1 gap-4">
        
        {/* Header Row */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all bg-white/5 border border-white/10 group-hover:bg-[#00A7B5] group-hover:border-[#00A7B5] group-hover:shadow-[0_0_15px_rgba(0,167,181,0.3)]">
            <Icon className="w-4 h-4 text-white/50 group-hover:text-black transition-colors" />
          </div>
          <span className="font-normal text-[14px] text-white/90">{title}</span>
        </div>
        
        {/* Divider */}
        <div className="h-[1px] w-full bg-white/10" />
        
        {/* Metrics Row */}
        <div className="flex items-center">
          <div className="flex-1 flex flex-col gap-1">
            <span className="text-[22px] font-medium text-white leading-none tracking-tight">{primaryValue}</span>
            <span className="text-[12px] text-white/40 font-normal">{primaryLabel}</span>
          </div>
          
          {secondaryValue !== undefined && secondaryLabel !== undefined && (
            <div className="flex-1 flex flex-col gap-1 pl-4 border-l border-white/10">
              <span className="text-[22px] font-medium text-white leading-none tracking-tight">{secondaryValue}</span>
              <span className="text-[12px] text-white/40 font-normal">{secondaryLabel}</span>
            </div>
          )}
        </div>
        
      </CardContent>
    </Card>
  );
}
