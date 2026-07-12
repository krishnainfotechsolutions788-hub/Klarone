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
  { name: 'Shoes', value: 180 },
  { name: 'Jacket', value: 87 },
  { name: 'T-shirt', value: 56 },
];

const chartConfigLine = {
  revenue: { label: "Revenue", color: "#1b61c9" },
  target: { label: "Target", color: "#e0e0e0" }
};

const chartConfigBar = {
  value: { label: "Units", color: "#111111" }
};

const chartConfigPie = {
  sales: { label: "Sales", color: "#111111" }
};

export function ChannelPerformance() {
  const data = [
    { name: 'Website', value: 5782, percent: 1.8, sales: '$1,378,975', fill: '#111111' },
    { name: 'Marketplace', value: 6843, percent: -2.8, sales: '$778,975', fill: '#dddddd' },
    { name: 'Store', value: 2123, percent: -2.8, sales: '$778,975', fill: '#f3f4f6' },
  ];

  return (
    <Card className="h-full border-[#dddddd] shadow-none rounded-[10px]">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-[18px] h-[18px] flex items-center justify-center border border-[#9297a0] rounded-sm">
              <div className="w-2.5 h-2.5 bg-[#9297a0] rounded-sm"></div>
            </div>
            <span className="text-[12px] font-medium text-[#41454d] tracking-wider uppercase">Channel Performance</span>
          </div>
          <button className="w-8 h-8 flex items-center justify-center border border-[#dddddd] rounded-[6px] text-[#41454d] hover:bg-[#f8fafc]">
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center">
          <div className="h-[180px] w-full relative mb-8">
            <ChartContainer config={chartConfigPie} className="w-full h-full">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="100%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={100}
                  outerRadius={140}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                />
              </PieChart>
            </ChartContainer>
            <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center text-center">
              <span className="text-[32px] font-medium text-[#181d26] leading-none mb-1">16,432</span>
              <span className="text-[12px] text-[#41454d]">Product Sales</span>
            </div>
          </div>

          <div className="w-full space-y-4">
            {data.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill }}></div>
                    <span className="text-[14px] font-medium text-[#181d26]">{item.name}</span>
                  </div>
                  <span className="text-[14px] font-medium text-[#181d26]">{item.sales}</span>
                </div>
                <div className="flex items-center gap-4 pl-4">
                  <span className="text-[12px] text-[#41454d]">{item.value.toLocaleString()} Product Sold</span>
                  <span className={`text-[12px] font-medium ${item.percent > 0 ? 'text-[#137333]' : 'text-[#c5221f]'}`}>
                    {item.percent > 0 ? '+' : ''}{item.percent}%
                  </span>
                </div>
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
    <Card className="h-full border-[#dddddd] shadow-none rounded-[10px] col-span-1 lg:col-span-2">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <ArrowUpRight className="w-[18px] h-[18px] text-[#41454d]" />
              <span className="text-[12px] font-medium text-[#41454d] tracking-wider uppercase">Average Sales</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[24px] font-medium text-[#181d26]">$1,389.652</span>
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-[6px] bg-[#e6f4ea] text-[#137333] font-medium text-[11px]">
                <ArrowUpRight className="w-3 h-3" />
                1.8%
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-[#dddddd] rounded-[6px] text-[12px] font-medium text-[#181d26] hover:bg-[#f8fafc]">
              All Product <ChevronDown className="w-3.5 h-3.5 text-[#9297a0]" />
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-[#dddddd] rounded-[6px] text-[12px] font-medium text-[#181d26] hover:bg-[#f8fafc]">
              All Categories <ChevronDown className="w-3.5 h-3.5 text-[#9297a0]" />
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-[#dddddd] rounded-[6px] text-[12px] font-medium text-[#181d26] hover:bg-[#f8fafc]">
              2025 <ChevronDown className="w-3.5 h-3.5 text-[#9297a0]" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center border border-[#dddddd] rounded-[6px] text-[#41454d] hover:bg-[#f8fafc]">
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4 text-[12px] font-medium text-[#41454d]">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#1b61c9]"></div> Revenue</div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#e0e0e0]"></div> Target</div>
          </div>
          <div className="flex items-center gap-2 text-[#181d26]">
            Net Sales : <span className="font-medium">$800.67</span>
            <ArrowUp className="w-3 h-3 text-[#137333]" />
          </div>
        </div>

        <div className="flex-1 min-h-[220px]">
          <ChartContainer config={chartConfigLine} className="w-full h-full">
            <LineChart data={lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} tickFormatter={(val) => `$${val/1000}k`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="target" stroke="var(--color-target)" strokeWidth={2} dot={{ r: 4, fill: '#fff', stroke: '#e0e0e0' }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} dot={{ r: 4, fill: '#fff', stroke: '#1b61c9' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function TopProducts() {
  return (
    <Card className="h-full border-[#dddddd] shadow-none rounded-[10px]">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ArrowUpRight className="w-[18px] h-[18px] text-[#41454d]" />
            <span className="text-[12px] font-medium text-[#41454d] tracking-wider uppercase">Top 3 Product</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-[#dddddd] rounded-[6px] text-[12px] font-medium text-[#181d26] hover:bg-[#f8fafc]">
              Daily <ChevronDown className="w-3.5 h-3.5 text-[#9297a0]" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center border border-[#dddddd] rounded-[6px] text-[#41454d] hover:bg-[#f8fafc]">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <span className="text-[13px] text-[#41454d]">Today's Total Sales :</span>
          <span className="text-[13px] font-medium text-[#181d26] flex items-center gap-1">
            318 units <div className="w-3 h-3 rounded-full bg-[#137333] flex items-center justify-center"><ArrowUp className="w-2 h-2 text-white" /></div>
          </span>
        </div>

        <div className="flex-1 min-h-[180px]">
          <ChartContainer config={chartConfigBar} className="w-full h-full">
            <BarChart data={barData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
              <ChartTooltip cursor={{ fill: 'transparent' }} content={<ChartTooltipContent />} />
              <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#181d26' : '#dddddd'} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function TotalVisitor() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  // Using a deterministic pattern instead of Math.random() to prevent React Hydration errors
  const grid = Array.from({ length: 15 }).map((_, i) => (i * 7) % 3 !== 0);

  return (
    <Card className="h-full border-[#dddddd] shadow-none rounded-[10px]">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ArrowUpRight className="w-[18px] h-[18px] text-[#41454d]" />
            <span className="text-[12px] font-medium text-[#41454d] tracking-wider uppercase">Total Visitor</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-[#dddddd] rounded-[6px] text-[12px] font-medium text-[#181d26] hover:bg-[#f8fafc]">
              Daily <ChevronDown className="w-3.5 h-3.5 text-[#9297a0]" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center border border-[#dddddd] rounded-[6px] text-[#41454d] hover:bg-[#f8fafc]">
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <span className="text-[28px] font-medium text-[#181d26] leading-none">3,247</span>
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-[6px] bg-[#e6f4ea] text-[#137333] font-medium text-[11px]">
            <ArrowUpRight className="w-3 h-3" />
            1.8%
          </div>
          <span className="text-[12px] text-[#9297a0]">Visitor</span>
        </div>

        <div className="space-y-3 mb-8">
          {[
            { label: 'Marketplace', value: '300 people', color: '#ff4d4f' },
            { label: 'Website', value: '250 people', color: '#137333' },
            { label: 'Store', value: '400 people', color: '#137333' }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-[13px]">
              <span className="text-[#41454d]">{item.label} :</span>
              <div className="flex items-center gap-2">
                <span className="font-medium text-[#181d26]">{item.value}</span>
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-auto">
          <div className="flex justify-between text-[10px] text-[#9297a0] mb-2 font-medium">
            <div className="w-16"></div>
            {days.map(d => <div key={d} className="flex-1 text-center">{d}</div>)}
          </div>
          {[
            { time: '09.00 - 12.00', offset: 0 },
            { time: '12.00 - 15.00', offset: 5 },
            { time: '15.00 - 18.00', offset: 10 }
          ].map((row, rIdx) => (
            <div key={rIdx} className="flex justify-between items-center mb-1">
              <div className="w-16 text-[10px] text-[#9297a0] font-medium">{row.time}</div>
              {days.map((_, cIdx) => {
                const active = grid[row.offset + cIdx];
                return (
                  <div key={cIdx} className="flex-1 flex justify-center">
                    <div className={`w-full max-w-[24px] h-[24px] rounded-sm ${active ? 'bg-[#181d26]' : 'bg-[#e0e2e6]'}`}></div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
