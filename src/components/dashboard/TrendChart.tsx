import {Box, Card, CardContent, Skeleton, Typography} from "@mui/material";
import {Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {useAggTrendByMonth} from "../../data/hooks";

function formatMonth(monthStr: string): string {
    // Handle different month formats: "2024-01", "Jan 2024", "January", etc.
    try {
        const date = new Date(monthStr + '-01');
        if (!isNaN(date.getTime())) {
            return date.toLocaleDateString('en-US', { month: 'short' });
        }
        // If it's already a short month name, return as is
        return monthStr.slice(0, 3);
    } catch {
        return monthStr.slice(0, 3);
    }
}

export default function TrendChart() {
    const { data, isLoading } = useAggTrendByMonth();

    const chartData = data
        ? Object.entries(data)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([month, value]) => ({
                month: formatMonth(month),
                fullMonth: month,
                value
            }))
        : [];

    return (
        <Card
            elevation={0}
            sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                height: "100%"
            }}
        >
            <CardContent>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    Vulnerabilities Over Time
                </Typography>

                {isLoading ? (
                    <Box>
                        <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 1 }} />
                    </Box>
                ) : chartData.length === 0 ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height={250}>
                        <Typography color="text.secondary">No data available</Typography>
                    </Box>
                ) : (
                    <ResponsiveContainer width="100%" height={250}>
                        <AreaChart
                            data={chartData}
                            margin={{ left: 0, right: 0, top: 10, bottom: 0 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="month"
                                tick={{ fontSize: 12 }}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 12 }}
                                tickLine={false}
                                tickFormatter={(value) => {
                                    if (value >= 1000) {
                                        return `${(value / 1000).toFixed(0)}k`;
                                    }
                                    return value.toString();
                                }}
                            />
                            <Tooltip
                                formatter={(value: number) => [value.toLocaleString(), 'Vulnerabilities']}
                                labelFormatter={(label) => {
                                    const item = chartData.find(d => d.month === label);
                                    return item?.fullMonth || label;
                                }}
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#1976d2"
                                fill="#1976d2"
                                fillOpacity={0.6}
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}

                {!isLoading && chartData.length > 0 && (
                    <Box
                        sx={{
                            mt: 2,
                            p: 2,
                            bgcolor: '#e3f2fd',
                            borderRadius: 1
                        }}
                    >
                        <Typography variant="body2" color="text.secondary">
                            <strong>Total tracked:</strong> {chartData.reduce((sum, item) => sum + item.value, 0).toLocaleString()} vulnerabilities across {chartData.length} months
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}
