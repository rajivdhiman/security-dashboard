import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    LinearProgress,
    Skeleton,
    Stack,
    Typography,
} from "@mui/material";
import PsychologyIcon from "@mui/icons-material/Psychology";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import FilterListIcon from "@mui/icons-material/FilterList";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import {useByKaiStatusIndex, useMeta} from "../../data/hooks";
import {buildChunkRowSet} from "../../data/kaiIndex";
import {useAppDispatch, useAppSelector} from "../../store/hooks";
import {toggleExcludeAiNoRisk, toggleExcludeManualNoRisk,} from "../../store/slices/analysisSlice";

function countPairs(pairs?: Array<[number, number]>) {
    return pairs?.length ?? 0;
}

export default function AnalysisActionBar() {
    const dispatch = useAppDispatch();
    const { excludeManualNoRisk, excludeAiNoRisk } = useAppSelector((s) => s.analysis);

    const { data: meta, isLoading: metaLoading } = useMeta();
    const totalRows = meta?.totalRows ?? 0;

    const { data: byKaiStatus, isLoading: kaiLoading } = useByKaiStatusIndex();

    const manualPairs = byKaiStatus?.["invalid - norisk"];
    const aiPairs = byKaiStatus?.["ai-invalid-norisk"];

    const isLoading = metaLoading || kaiLoading;

    // Counts (simple)
    const manualCount = countPairs(manualPairs);
    const aiCount = countPairs(aiPairs);

    // Union count for display (avoid double counting)
    // Build sets only when needed
    let unionCount = 0;
    if (byKaiStatus) {
        const manualSet = buildChunkRowSet(manualPairs);
        const aiSet = buildChunkRowSet(aiPairs);

        const seen = new Set<string>();
        if (excludeManualNoRisk) {
            for (const [c, rows] of manualSet) for (const r of rows) seen.add(`${c}:${r}`);
        }
        if (excludeAiNoRisk) {
            for (const [c, rows] of aiSet) for (const r of rows) seen.add(`${c}:${r}`);
        }
        unionCount = seen.size;
    }

    const after = Math.max(0, totalRows - unionCount);
    const impactPct = totalRows > 0 ? (unionCount / totalRows) * 100 : 0;

    const hasActiveFilters = excludeManualNoRisk || excludeAiNoRisk;

    return (
        <Card
            elevation={0}
            sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2
            }}
        >
            <CardContent>
                <Stack spacing={2.5}>
                    {/* Header */}
                    <Box>
                        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                            <FilterListIcon color="primary" fontSize="small" />
                            <Typography variant="h6" fontWeight="600">
                                Analysis Filters
                            </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                            Toggle filters to exclude AI or manually analyzed vulnerabilities
                        </Typography>
                    </Box>

                    <Divider />

                    {isLoading ? (
                        <Stack spacing={2}>
                            <Box display="flex" gap={2}>
                                <Skeleton variant="rectangular" height={48} sx={{ flex: 1, borderRadius: 2 }} />
                                <Skeleton variant="rectangular" height={48} sx={{ flex: 1, borderRadius: 2 }} />
                            </Box>
                            <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 1 }} />
                        </Stack>
                    ) : (
                        <>
                            {/* Toggle Buttons */}
                            <Stack spacing={1.5}>
                                <Button
                                    fullWidth
                                    size="large"
                                    startIcon={excludeManualNoRisk ? <VisibilityOffIcon /> : <FactCheckIcon />}
                                    variant={excludeManualNoRisk ? "contained" : "outlined"}
                                    onClick={() => dispatch(toggleExcludeManualNoRisk())}
                                    sx={{
                                        borderRadius: 2,
                                        py: 1.5,
                                        justifyContent: 'flex-start',
                                        bgcolor: excludeManualNoRisk ? '#f57c00' : 'transparent',
                                        borderColor: excludeManualNoRisk ? '#f57c00' : 'divider',
                                        color: excludeManualNoRisk ? '#fff' : 'text.primary',
                                        fontWeight: 600,
                                        '&:hover': {
                                            bgcolor: excludeManualNoRisk ? '#ef6c00' : 'action.hover',
                                            borderColor: excludeManualNoRisk ? '#ef6c00' : 'divider',
                                        },
                                    }}
                                >
                                    <Box flex={1} display="flex" justifyContent="space-between" alignItems="center">
                                        <span>Manual Analysis Filter</span>
                                        <Chip
                                            size="small"
                                            label={excludeManualNoRisk ? "ON" : "OFF"}
                                            sx={{
                                                bgcolor: excludeManualNoRisk ? 'rgba(255,255,255,0.2)' : '#f5f5f5',
                                                color: excludeManualNoRisk ? '#fff' : 'text.secondary',
                                                fontWeight: 700,
                                                fontSize: '0.7rem'
                                            }}
                                        />
                                    </Box>
                                </Button>

                                <Button
                                    fullWidth
                                    size="large"
                                    startIcon={excludeAiNoRisk ? <VisibilityOffIcon /> : <PsychologyIcon />}
                                    variant={excludeAiNoRisk ? "contained" : "outlined"}
                                    onClick={() => dispatch(toggleExcludeAiNoRisk())}
                                    sx={{
                                        borderRadius: 2,
                                        py: 1.5,
                                        justifyContent: 'flex-start',
                                        bgcolor: excludeAiNoRisk ? '#1976d2' : 'transparent',
                                        borderColor: excludeAiNoRisk ? '#1976d2' : 'divider',
                                        color: excludeAiNoRisk ? '#fff' : 'text.primary',
                                        fontWeight: 600,
                                        '&:hover': {
                                            bgcolor: excludeAiNoRisk ? '#1565c0' : 'action.hover',
                                            borderColor: excludeAiNoRisk ? '#1565c0' : 'divider',
                                        },
                                    }}
                                >
                                    <Box flex={1} display="flex" justifyContent="space-between" alignItems="center">
                                        <span>AI Analysis Filter</span>
                                        <Chip
                                            size="small"
                                            label={excludeAiNoRisk ? "ON" : "OFF"}
                                            sx={{
                                                bgcolor: excludeAiNoRisk ? 'rgba(255,255,255,0.2)' : '#f5f5f5',
                                                color: excludeAiNoRisk ? '#fff' : 'text.secondary',
                                                fontWeight: 700,
                                                fontSize: '0.7rem'
                                            }}
                                        />
                                    </Box>
                                </Button>
                            </Stack>

                            <Divider />

                            {/* Impact Summary */}
                            <Box
                                sx={{
                                    p: 2,
                                    bgcolor: hasActiveFilters ? '#e3f2fd' : '#f5f5f5',
                                    borderRadius: 1.5,
                                    border: '1px solid',
                                    borderColor: hasActiveFilters ? '#1976d2' : 'divider'
                                }}
                            >
                                <Stack spacing={1.5}>
                                    <Box display="flex" alignItems="center" justifyContent="space-between">
                                        <Typography variant="body2" fontWeight="600" color="text.secondary">
                                            Dataset Impact
                                        </Typography>
                                        <Chip
                                            icon={<VisibilityIcon sx={{ fontSize: 14 }} />}
                                            size="small"
                                            label={`Showing ${after.toLocaleString()}`}
                                            sx={{
                                                bgcolor: hasActiveFilters ? '#1976d2' : '#757575',
                                                color: '#fff',
                                                fontWeight: 700
                                            }}
                                        />
                                    </Box>

                                    <Box>
                                        <Box display="flex" justifyContent="space-between" mb={0.5}>
                                            <Typography variant="caption" color="text.secondary">
                                                {hasActiveFilters
                                                    ? `${impactPct.toFixed(1)}% filtered out`
                                                    : 'No filters active'
                                                }
                                            </Typography>
                                            <Typography variant="caption" fontWeight="700" color={hasActiveFilters ? 'primary' : 'text.secondary'}>
                                                {unionCount.toLocaleString()} removed
                                            </Typography>
                                        </Box>

                                        <LinearProgress
                                            variant="determinate"
                                            value={impactPct}
                                            sx={{
                                                height: 8,
                                                borderRadius: 1,
                                                bgcolor: '#e0e0e0',
                                                '& .MuiLinearProgress-bar': {
                                                    bgcolor: hasActiveFilters ? '#1976d2' : '#bdbdbd',
                                                    borderRadius: 1,
                                                }
                                            }}
                                        />
                                    </Box>

                                    <Box display="flex" gap={1} flexWrap="wrap">
                                        <Chip
                                            size="small"
                                            icon={<FactCheckIcon sx={{ fontSize: 14 }} />}
                                            label={`Manual: ${manualCount.toLocaleString()}`}
                                            sx={{
                                                bgcolor: excludeManualNoRisk ? '#fff3e0' : '#fafafa',
                                                color: excludeManualNoRisk ? '#f57c00' : 'text.secondary',
                                                border: '1px solid',
                                                borderColor: excludeManualNoRisk ? '#f57c00' : '#e0e0e0',
                                                fontWeight: 600
                                            }}
                                        />
                                        <Chip
                                            size="small"
                                            icon={<PsychologyIcon sx={{ fontSize: 14 }} />}
                                            label={`AI: ${aiCount.toLocaleString()}`}
                                            sx={{
                                                bgcolor: excludeAiNoRisk ? '#e3f2fd' : '#fafafa',
                                                color: excludeAiNoRisk ? '#1976d2' : 'text.secondary',
                                                border: '1px solid',
                                                borderColor: excludeAiNoRisk ? '#1976d2' : '#e0e0e0',
                                                fontWeight: 600
                                            }}
                                        />
                                    </Box>
                                </Stack>
                            </Box>
                        </>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
}
