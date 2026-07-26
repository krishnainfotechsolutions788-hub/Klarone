import { Clock, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function RecentActivity() {
  return (
    <Card className="h-full border-white/10 shadow-xl rounded-2xl bg-[#111113]/90 backdrop-blur-md text-white">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Clock className="w-[18px] h-[18px] text-[#00A7B5]" />
            <span className="text-[12px] font-normal text-white/60 tracking-wider uppercase">Recent Activity</span>
          </div>
          <button className="w-8 h-8 flex items-center justify-center border border-white/10 rounded-xl text-white/60 hover:bg-white/10 transition-all">
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 flex flex-col gap-6">
          <div>
            <span className="text-[13.5px] text-white/50 mb-3 block font-normal">Outgoing Recommendations</span>
            <div className="flex items-center justify-between p-3.5 border border-white/10 rounded-xl bg-white/5">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-lg bg-[#060608] border border-white/5 flex items-center justify-center p-1.5">
                  <img src="/top/top1.webp" alt="ThinkPad X1" className="w-full h-full object-contain brightness-90" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[14px] font-normal text-white">Lenovo ThinkPad X1</span>
                  <div className="flex items-center gap-2 text-[12.5px] text-white/40">
                    <span>Developer Tier</span>
                    <span className="text-[#00A7B5]">· 5 min ago</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[14px] font-medium text-white">₹145,000</span>
              </div>
            </div>
          </div>

          <div>
            <span className="text-[13.5px] text-white/50 mb-3 block font-normal">Incoming Inventory Units</span>
            <div className="flex items-center justify-between p-3.5 border border-white/10 rounded-xl bg-white/5">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-lg bg-[#060608] border border-white/5 flex items-center justify-center p-1.5">
                  <img src="/top/top2.webp" alt="Dell XPS 14" className="w-full h-full object-contain brightness-90" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[14px] font-normal text-white">Dell XPS 14 OLED</span>
                  <div className="flex items-center gap-2 text-[12.5px] text-white/40">
                    <span>Qty: 5</span>
                    <span>· 1 hour ago</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[14px] font-medium text-white">₹169,990</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
