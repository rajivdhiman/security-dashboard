import {Box, Card, CardContent, Skeleton, Typography} from "@mui/material";
import {Cell, Pie, PieChart, ResponsiveContainer, Tooltip} from "recharts";
import {useAggSeverity} from "../../data/hooks";

const SEVERITY_COLORS: Record<string, string> = {
    critical: '#d32f2f',
    high: '#f57c00',
    medium: '#fbc02d',
    low: '#388e3c',
    info: '#1976d2',
};

function getSeverityColor(name: string): string {
    const key = name.toLowerCase();
    return SEVERITY_COLORS[key] || '#757575';
}

export default function SeverityChart() {
    const { data, isLoading } = useAggSeverity();

    const chartData = data
        ? Object.entries(data).map(([name, value]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value,
            color: getSeverityColor(name)
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
                    Vulnerability Severity Distribution
                </Typography>

                {isLoading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height={250}>
                        <Skeleton variant="circular" width={180} height={180} />
                    </Box>
                ) : chartData.length === 0 ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height={250}>
                        <Typography color="text.secondary">No data available</Typography>
                    </Box>
                ) : (
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={2}
                                dataKey="value"
                                label={({ name, percent=0 }) =>
                                    `${name} ${(percent * 100).toFixed(0)}%`
                                }
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value) => [`${value?.toLocaleString()}`]}
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}
