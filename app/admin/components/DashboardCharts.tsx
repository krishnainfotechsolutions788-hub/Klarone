"use client";

import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ArrowUpRight, ArrowDownRight, ChevronDown, MoreHorizontal, ArrowUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// --- Data ---
const lineData = [
  { name: 'Jan', revenue: 15000, target: 12000 },
  { name: 'Feb', revenue: 12000, target: 14000 },
  { name: 'Mar', revenue: 16000, target: 15000 },
  { name: 'Apr', revenue: 20000, target: 17000 },
  { name: 'May', revenue: 18000, target: 20000 },
  { name: 'Jun', revenue: 16000, target: 18000 },
  { name: 'Jul', revenue: 10000, target: 15000 },
];

const barData = [
  { name: 'MacBook', value: 180 },
  { name: 'ThinkPad', value: 87 },
  { name: 'Dell XPS', value: 56 },
];

const chartConfigLine = {
  revenue: { label: "Revenue", color: "#00A7B5" },
  target: { label: "Target", color: "rgba(255,255,255,0.2)" }
};

const chartConfigBar = {
  value: { label: "Units", color: "#ffffff" }
};

const chartConfigPie = {
  sales: { label: "Sales", color: "#ffffff" }
};

export function ChannelPerformance() {
  const data = [
    { name: 'Website', value: 5782, percent: 1.8, sales: '$1,378,975', fill: '#00A7B5' },
    { name: 'Marketplace', value: 6843, percent: -2.8, sales: '$778,975', fill: 'rgba(255,255,255,0.4)' },
    { name: 'Store', value: 2123, percent: -2.8, sales: '$778,975', fill: 'rgba(255,255,255,0.15)' },
  ];

  return (
    <Card className="h-full border-white/10 shadow-xl rounded-2xl bg-[#111113]/90 backdrop-blur-md text-white">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-[18px] h-[18px] flex items-center justify-center border border-white/20 rounded-sm">
              <div className="w-2.5 h-2.5 bg-[#00A7B5] rounded-sm"></div>
            </div>
            <span className="text-[12px] font-normal text-white/60 tracking-wider uppercase">Channel Performance</span>
          </div>
          <button className="w-8 h-8 flex items-center justify-center border border-white/10 rounded-xl text-white/60 hover:bg-white/10 transition-all">
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center">
          <div className="w-[200px] h-[200px] relative">
            <ChartContainer config={chartConfigPie} className="w-full h-full">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[26px] font-medium text-white leading-none">14.7k</span>
              <span className="text-[11px] text-white/40 mt-1 font-normal">Total Traffic</span>
            </div>
          </div>

          <div className="w-full flex flex-col gap-3 mt-6">
            {data.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 border border-white/10 rounded-xl bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                  <span className="text-[13.5px] font-normal text-white">{item.name}</span>
                </div>
                <span className="text-[13.5px] font-normal text-white/80">{item.sales}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AverageSales() {
  return (
    <Card className="h-full border-white/10 shadow-xl rounded-2xl bg-[#111113]/90 backdrop-blur-md text-white">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-normal text-white/60 tracking-wider uppercase">Average Sales Trend</span>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-white/10 rounded-full text-[12px] text-white/70 hover:bg-white/10 transition-all">
            <span>2026</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-baseline gap-3 mb-6">
          <span className="text-3xl font-medium tracking-tight text-white">$108,450.00</span>
          <span className="text-xs text-[#00A7B5] font-normal flex items-center gap-1">
            <ArrowUp className="w-3.5 h-3.5" /> +14.2%
          </span>
        </div>

        <div className="flex-1 w-full min-h-[220px]">
          <ChartContainer config={chartConfigLine} className="w-full h-full max-h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="revenue" stroke="#00A7B5" strokeWidth={3} dot={{ r: 4, fill: '#00A7B5' }} />
                <Line type="monotone" dataKey="target" stroke="rgba(255,255,255,0.2)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function TopProducts() {
  return (
    <Card className="h-full border-white/10 shadow-xl rounded-2xl bg-[#111113]/90 backdrop-blur-md text-white">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <span className="text-[12px] font-normal text-white/60 tracking-wider uppercase">Top Selling Devices</span>
          <MoreHorizontal className="w-4 h-4 text-white/40" />
        </div>

        <div className="flex-1 w-full min-h-[200px]">
          <ChartContainer config={chartConfigBar} className="w-full h-full max-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical">
                <XAxis type="number" stroke="rgba(255,255,255,0.4)" fontSize={12} hide />
                <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.8)" fontSize={13} axisLine={false} tickLine={false} width={80} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="#00A7B5" radius={[0, 8, 8, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function TotalVisitor() {
  return (
    <Card className="h-full border-white/10 shadow-xl rounded-2xl bg-[#111113]/90 backdrop-blur-md text-white">
      <CardContent className="p-6 flex flex-col justify-between h-full">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-normal text-white/60 tracking-wider uppercase">Active Session Traffic</span>
          <ArrowUpRight className="w-4 h-4 text-white/40" />
        </div>

        <div className="my-6">
          <h4 className="text-3xl font-medium tracking-tight text-white mb-2">24,590</h4>
          <p className="text-xs text-white/40 font-normal">Real-time user workflow interactions on Klarone recommendation engine.</p>
        </div>

        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
          <div className="bg-[#00A7B5] h-full w-[72%] rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}
