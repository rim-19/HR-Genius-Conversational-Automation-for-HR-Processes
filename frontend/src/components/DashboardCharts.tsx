import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { useTheme } from '../context/ThemeContext';

const data = [
    { name: 'Engineering', value: 45 },
    { name: 'HR', value: 15 },
    { name: 'Marketing', value: 20 },
    { name: 'Sales', value: 25 },
    { name: 'Finance', value: 10 },
];

const COLORS = ['#0ea5e9', '#ec4899', '#8b5cf6', '#10b981', '#f59e0b'];

const DashboardCharts: React.FC = () => {
    // Recharts dessine en SVG avec des couleurs en dur — on les adapte au thème
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const gridStroke = isDark ? '#374151' : '#f1f5f9';
    const tickFill = isDark ? '#9ca3af' : '#64748b';
    const cursorFill = isDark ? '#1f2937' : '#f8fafc';
    const tooltipStyle = {
        borderRadius: '8px',
        border: 'none',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        color: isDark ? '#f3f4f6' : '#111827',
    };

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            {/* Department Distribution (Pie) */}
            <div className="card glass">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Department Distribution</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={tooltipStyle}
                                itemStyle={{ color: tooltipStyle.color }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {data.map((item, index) => (
                        <div key={item.name} className="flex items-center space-x-2">
                            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                            <span className="text-xs text-gray-600 dark:text-gray-400">{item.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Hiring Growth (Bar) */}
            <div className="card glass">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Hiring Growth (2026)</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                            { month: 'Jan', count: 4 },
                            { month: 'Feb', count: 7 },
                            { month: 'Mar', count: 5 },
                            { month: 'Apr', count: 12 },
                            { month: 'May', count: 8 },
                            { month: 'Jun', count: 15 },
                        ]}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: tickFill }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: tickFill }} />
                            <Tooltip
                                cursor={{ fill: cursorFill }}
                                contentStyle={tooltipStyle}
                                itemStyle={{ color: tooltipStyle.color }}
                            />
                            <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={30} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default DashboardCharts;
