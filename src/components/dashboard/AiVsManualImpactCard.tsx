import {Box, Card, CardContent, Chip, Divider, Skeleton, Stack, Typography} from "@mui/material";
import {Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {useAggKaiStatusCounts, useAggSeverity} from "../../data/hooks";
import {useAppSelector} from "../../store/hooks";

function sumCounts(obj?: Record<string, number>) {
    return obj ? Object.values(obj).reduce((a, b) => a + b, 0) : 0;
}

export default function AiVsManualImpactCard() {
    const { data: severityCounts, isLoading: severityLoading } = useAggSeverity();
    const { data: kaiCounts, isLoading: kaiLoading } = useAggKaiStatusCounts();

    const total = sumCounts(severityCounts);

    const manualNoRisk = kaiCounts?.["invalid - norisk"] ?? 0;
    const aiNoRisk = kaiCounts?.["ai-invalid-norisk"] ?? 0;

    const { excludeManualNoRisk, excludeAiNoRisk } = useAppSelector((s) => s.analysis);

    const removed =
        (excludeManualNoRisk ? manualNoRisk : 0) + (excludeAiNoRisk ? aiNoRisk : 0);

    const remaining = Math.max(total - removed, 0);

    const isLoading = severityLoading || kaiLoading;

    const chartData = [
        {
            name: "Vulnerabilities",
            "Manual Removed": excludeManualNoRisk ? manualNoRisk : 0,
            "AI Removed": excludeAiNoRisk ? aiNoRisk : 0,
            "Remaining": remaining,
        },
    ];

    const reductionPercent = total > 0 ? ((removed / total) * 100).toFixed(1) : 0;

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
                <Stack spacing={2}>
                    <Box>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <FilterAltIcon color="primary" />
                            <Typography variant="h6" fontWeight="600">
                                AI vs Manual Analysis Impact
                            </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                            Visualizes how filters change your working set.
                        </Typography>
                    </Box>

                    <Box display="flex" gap={1} flexWrap="wrap">
                        <Chip
                            size="small"
                            icon={<PersonIcon sx={{ fontSize: 16 }} />}
                            label={`Manual filter: ${excludeManualNoRisk ? "ON" : "OFF"}`}
                            sx={{
                                bgcolor: excludeManualNoRisk ? '#fff3e0' : '#f5f5f5',
                                color: excludeManualNoRisk ? '#f57c00' : 'text.secondary',
                                fontWeight: 600,
                                border: excludeManualNoRisk ? '1px solid #f57c00' : '1px solid #e0e0e0'
                            }}
                        />
                        <Chip
                            size="small"
                            icon={<SmartToyIcon sx={{ fontSize: 16 }} />}
                            label={`AI filter: ${excludeAiNoRisk ? "ON" : "OFF"}`}
                            sx={{
                                bgcolor: excludeAiNoRisk ? '#e3f2fd' : '#f5f5f5',
                                color: excludeAiNoRisk ? '#1976d2' : 'text.secondary',
                                fontWeight: 600,
                                border: excludeAiNoRisk ? '1px solid #1976d2' : '1px solid #e0e0e0'
                            }}
                        />
                    </Box>

                    <Divider />

                    {isLoading ? (
                        <Box>
                            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 1 }} />
                            <Box display="flex" gap={1} mt={2}>
                                <Skeleton width="25%" height={32} />
                                <Skeleton width="25%" height={32} />
                                <Skeleton width="25%" height={32} />
                                <Skeleton width="25%" height={32} />
                            </Box>
                        </Box>
                    ) : (
                        <>
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={chartData} layout="vertical">
                                    <XAxis type="number" />
                                    <YAxis type="category" dataKey="name" width={0} hide />
                                    <Tooltip
                                        formatter={(value) => [`${value}`]}
                                        contentStyle={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
                                        }}
                                    />
                                    <Legend
                                        wrapperStyle={{ paddingTop: '10px' }}
                                        iconType="rect"
                                    />
                                    <Bar
                                        dataKey="Manual Removed"
                                        stackId="a"
                                        fill="#f57c00"
                                        radius={[0, 0, 0, 0]}
                                    />
                                    <Bar
                                        dataKey="AI Removed"
                                        stackId="a"
                                        fill="#1976d2"
                                        radius={[0, 0, 0, 0]}
                                    />
                                    <Bar
                                        dataKey="Remaining"
                                        stackId="a"
                                        fill="#388e3c"
                                        radius={[0, 4, 4, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>

                            <Box display="flex" gap={1} flexWrap="wrap">
                                <Chip
                                    size="small"
                                    label={`Total: ${total.toLocaleString()}`}
                                    sx={{
                                        bgcolor: '#f5f5f5',
                                        fontWeight: 600,
                                        border: '1px solid #e0e0e0'
                                    }}
                                />
                                <Chip
                                    size="small"
                                    icon={<PersonIcon sx={{ fontSize: 14 }} />}
                                    label={`Manual: ${manualNoRisk.toLocaleString()}`}
                                    sx={{
                                        bgcolor: '#fff3e0',
                                        color: '#f57c00',
                                        fontWeight: 600,
                                        border: '1px solid #f57c00'
                                    }}
                                />
                                <Chip
                                    size="small"
                                    icon={<SmartToyIcon sx={{ fontSize: 14 }} />}
                                    label={`AI: ${aiNoRisk.toLocaleString()}`}
                                    sx={{
                                        bgcolor: '#e3f2fd',
                                        color: '#1976d2',
                                        fontWeight: 600,
                                        border: '1px solid #1976d2'
                                    }}
                                />
                                <Chip
                                    size="small"
                                    icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
                                    label={`Remaining: ${remaining.toLocaleString()}`}
                                    sx={{
                                        bgcolor: '#e8f5e9',
                                        color: '#388e3c',
                                        fontWeight: 600,
                                        border: '1px solid #388e3c'
                                    }}
                                />
                            </Box>

                            <Box
                                sx={{
                                    p: 2,
                                    bgcolor: removed > 0 ? '#e8f5e9' : '#f5f5f5',
                                    borderRadius: 1,
                                    border: '1px solid',
                                    borderColor: removed > 0 ? '#388e3c' : 'divider'
                                }}
                            >
                                <Typography variant="body2" fontWeight="600" color={removed > 0 ? '#388e3c' : 'text.secondary'}>
                                    {removed > 0 ? (
                                        <>
                                            ✓ Filters removed <strong>{removed.toLocaleString()}</strong> vulnerabilities ({reductionPercent}% reduction)
                                        </>
                                    ) : (
                                        <>
                                            No filters currently active.
                                        </>
                                    )}
                                </Typography>
                            </Box>
                        </>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
}
