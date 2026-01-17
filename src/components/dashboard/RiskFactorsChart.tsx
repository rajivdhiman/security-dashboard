import {Box, Card, CardContent, Skeleton, Typography} from "@mui/material";
import {Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {useAggRiskFactors} from "../../data/hooks";

const BAR_COLORS = [
    '#1976d2', '#1565c0', '#0d47a1', '#42a5f5', '#1e88e5',
    '#2196f3', '#64b5f6', '#90caf9', '#5c6bc0', '#3949ab'
];

export default function RiskFactorsChart() {
    const { data, isLoading } = useAggRiskFactors();

    const chartData = data
        ? Object.entries(data)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([name, value]) => ({ name, value }))
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
                    Risk Factors Frequency (Top 10)
                </Typography>

                {isLoading ? (
                    <Box>
                        {[...Array(5)].map((_, i) => (
                            <Skeleton
                                key={i}
                                variant="rectangular"
                                height={30}
                                sx={{ mb: 1, borderRadius: 1 }}
                            />
                        ))}
                    </Box>
                ) : chartData.length === 0 ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height={250}>
                        <Typography color="text.secondary">No data available</Typography>
                    </Box>
                ) : (
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart
                            data={chartData}
                            layout="vertical"
                            margin={{ left: 10, right: 10, top: 5, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" />
                            <YAxis
                                type="category"
                                dataKey="name"
                                width={0}
                                hide
                            />
                            <Tooltip
                                formatter={(value) => [`${value?.toLocaleString()}`]}
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                }}
                                labelStyle={{ fontWeight: 600 }}
                            />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                {chartData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}

                {!isLoading && chartData.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                        {chartData.slice(0, 5).map((item, index) => (
                            <Box
                                key={item.name}
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                sx={{
                                    py: 0.5,
                                    borderBottom: index < 4 ? '1px solid' : 'none',
                                    borderColor: 'divider'
                                }}
                            >
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Box
                                        sx={{
                                            width: 12,
                                            height: 12,
                                            borderRadius: 1,
                                            bgcolor: BAR_COLORS[index],
                                            flexShrink: 0
                                        }}
                                    />
                                    <Typography variant="body2" color="text.secondary" noWrap>
                                        {item.name}
                                    </Typography>
                                </Box>
                                <Typography variant="body2" fontWeight="600">
                                    {item.value.toLocaleString()}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}
