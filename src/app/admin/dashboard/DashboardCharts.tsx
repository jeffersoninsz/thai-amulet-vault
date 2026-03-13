"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PackageSearch } from 'lucide-react';

export function DashboardCharts({ data, alerts }: { data: any[], alerts: any[] }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-[#1a1814]/80 p-6 rounded-xl border border-[#c4a265]/20 shadow-xl">
                <h3 className="text-[#a39783] text-sm uppercase tracking-widest font-mono mb-6">Revenue Trajectory (Last 7 Days)</h3>
                <div className="h-72">
                    {data.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#c4a265" opacity={0.1} />
                                <XAxis dataKey="date" stroke="#8c8273" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#8c8273" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                <Tooltip
                                    cursor={{ fill: '#c4a265', opacity: 0.1 }}
                                    contentStyle={{ backgroundColor: '#0a0908', border: '1px solid rgba(196, 162, 101, 0.2)', borderRadius: '8px' }}
                                    itemStyle={{ color: '#c4a265', fontWeight: 'bold' }}
                                />
                                <Bar dataKey="revenue" fill="#c4a265" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-[#8c8273] font-mono text-sm border border-dashed border-[#c4a265]/20 rounded-lg">
                            Insufficient Data Vectors
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-[#1a1814]/80 p-6 rounded-xl border border-[#c4a265]/20 shadow-xl flex flex-col">
                <div className="flex items-center justify-between border-b border-[#c4a265]/10 pb-4 mb-4">
                    <h3 className="text-[#f5ebd7] text-lg font-serif">Action Required</h3>
                    <span className="bg-red-900/40 text-red-500 px-2 py-0.5 rounded font-mono text-xs animate-pulse">Critical</span>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {alerts.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-[#8c8273] opacity-50">
                            <PackageSearch className="w-8 h-8 mb-2" />
                            <span className="text-xs uppercase tracking-widest font-mono">No Pending Operations</span>
                        </div>
                    ) : (
                        <ul className="space-y-3">
                            {alerts.map(alert => (
                                <li key={alert.id} className="bg-[#0a0908] p-3 rounded border border-red-500/20 fle">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-red-400 font-bold text-xs uppercase tracking-widest">{alert.status}</span>
                                        <span className="text-[#a39783] text-[10px] font-mono">{new Date(alert.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-[#d4c5b0] text-sm truncate">Order: {alert.id}</p>
                                    <p className="text-[#c4a265] text-xs font-mono mt-1">${alert.total.toFixed(2)}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    )
}
