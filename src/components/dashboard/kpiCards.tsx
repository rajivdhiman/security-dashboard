import Grid from "@mui/material/Grid";
import {Box, Card, CardContent, Skeleton, Typography} from "@mui/material";
import BugReportIcon from '@mui/icons-material/BugReport';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import {useAggSeverity} from "../../data/hooks";

function getNumber(map: Record<string, number> | undefined, key: string) {
    return map?.[key] ?? map?.[key.toLowerCase()] ?? 0;
}

export default function KpiCards() {
    const { data: severityCounts, isLoading } = useAggSeverity();

    const total =
        severityCounts
            ? Object.values(severityCounts).reduce((a, b) => a + b, 0)
            : 0;

    const critical = getNumber(severityCounts, "critical");
    const high = getNumber(severityCounts, "high");

    const KPIS = [
        {
            label: "Total Vulnerabilities",
            value: isLoading ? "—" : total.toLocaleString(),
            icon: <BugReportIcon sx={{ fontSize: 40 }} />,
            color: '#1976d2',
            bgColor: '#e3f2fd',
        },
        {
            label: "Critical",
            value: isLoading ? "—" : critical.toLocaleString(),
            icon: <ErrorIcon sx={{ fontSize: 40 }} />,
            color: '#d32f2f',
            bgColor: '#ffebee',
        },
        {
            label: "High",
            value: isLoading ? "—" : high.toLocaleString(),
            icon: <WarningIcon sx={{ fontSize: 40 }} />,
            color: '#f57c00',
            bgColor: '#fff3e0',
        },
        {
            label: "Medium+Low",
            value: isLoading ? "—" : (total - critical - high).toLocaleString(),
            icon: <InfoIcon sx={{ fontSize: 40 }} />,
            color: '#388e3c',
            bgColor: '#e8f5e9',
        },
    ];

    return (
        <Grid container spacing={3}>
            {KPIS.map((kpi) => (
                <Grid item xs={12} sm={6} md={3} key={kpi.label}>
                    <Card
                        elevation={0}
                        sx={{
                            height: '100%',
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 2,
                            transition: 'all 0.3s',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: 3,
                            },
                        }}
                    >
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                <Box>
                                    <Typography color="text.secondary" variant="body2" gutterBottom>
                                        {kpi.label}
                                    </Typography>
                                    {isLoading ? (
                                        <Skeleton width={120} height={48} />
                                    ) : (
                                        <Typography variant="h4" fontWeight="700" color="text.primary">
                                            {kpi.value}
                                        </Typography>
                                    )}
                                </Box>
                                <Box
                                    sx={{
                                        bgcolor: kpi.bgColor,
                                        color: kpi.color,
                                        borderRadius: 2,
                                        p: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {kpi.icon}
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}
