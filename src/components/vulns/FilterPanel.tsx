import {
    Box,
    Card,
    CardContent,
    Checkbox,
    Chip,
    Divider,
    FormControlLabel,
    FormGroup,
    InputAdornment,
    Skeleton,
    Stack,
    Switch,
    TextField,
    Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SecurityIcon from "@mui/icons-material/Security";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import WarningIcon from "@mui/icons-material/Warning";
import PublicIcon from "@mui/icons-material/Public";
import FilterListIcon from "@mui/icons-material/FilterList";
import {useMemo} from "react";
import {useAggRiskFactors} from "../../data/hooks";
import {useAppDispatch, useAppSelector} from "../../store/hooks";
import {
    setExposedOnly,
    setPublishedFrom,
    setPublishedTo,
    setRiskFactors,
    setSearch,
    setSeverity,
} from "../../store/slices/filtersSlice";

const severityList = ["critical", "high", "medium", "low", "unknown"];

const severityColors: Record<string, { bg: string; border: string; text: string }> = {
    critical: { bg: '#fce4ec', border: '#c2185b', text: '#c2185b' },
    high: { bg: '#fff3e0', border: '#f57c00', text: '#f57c00' },
    medium: { bg: '#fff9c4', border: '#f9a825', text: '#f57000' },
    low: { bg: '#e8f5e9', border: '#388e3c', text: '#388e3c' },
    unknown: { bg: '#f5f5f5', border: '#757575', text: '#757575' },
};

export default function FilterPanel() {
    const dispatch = useAppDispatch();
    const filters = useAppSelector((s) => s.filters);

    const { data: riskCounts, isLoading: riskLoading } = useAggRiskFactors();

    // Suggestions: top 12 risk factors
    const suggestedRiskFactors = useMemo(() => {
        if (!riskCounts) return [];
        return Object.entries(riskCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 12)
            .map(([k]) => k);
    }, [riskCounts]);

    const toggleRisk = (rf: string) => {
        const set = new Set(filters.riskFactors);
        if (set.has(rf)) set.delete(rf);
        else set.add(rf);
        dispatch(setRiskFactors(Array.from(set)));
    };

    // Count active filters
    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (filters.search) count++;
        count += Object.values(filters.severities).filter(Boolean).length;
        if (filters.exposedOnly) count++;
        if (filters.publishedFrom) count++;
        if (filters.publishedTo) count++;
        count += filters.riskFactors.length;
        return count;
    }, [filters]);

    return (
        <Card
            elevation={0}
            sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                overflow: 'visible'
            }}
        >
            <CardContent>
                <Stack spacing={3}>
                    {/* Header */}
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box display="flex" alignItems="center" gap={1}>
                            <FilterListIcon color="primary" fontSize="small" />
                            <Typography variant="h6" fontWeight="600">
                                Filters
                            </Typography>
                        </Box>
                        {activeFilterCount > 0 && (
                            <Chip
                                size="small"
                                label={`${activeFilterCount} active`}
                                sx={{
                                    bgcolor: '#1976d2',
                                    color: '#fff',
                                    fontWeight: 700,
                                    fontSize: '0.7rem'
                                }}
                            />
                        )}
                    </Box>

                    <Divider />

                    {/* Search */}
                    <Box>
                        <TextField
                            size="small"
                            placeholder="Search CVE, package, image..."
                            fullWidth
                            value={filters.search}
                            onChange={(e) => dispatch(setSearch(e.target.value))}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" color="action" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                }
                            }}
                        />
                    </Box>

                    <Divider />

                    {/* Severity */}
                    <Box>
                        <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                            <SecurityIcon fontSize="small" color="action" />
                            <Typography fontWeight="600" variant="body2">
                                Severity
                            </Typography>
                        </Box>
                        <FormGroup>
                            {severityList.map((s) => {
                                const isChecked = !!filters.severities[s];
                                const colors = severityColors[s];
                                return (
                                    <FormControlLabel
                                        key={s}
                                        control={
                                            <Checkbox
                                                size="small"
                                                checked={isChecked}
                                                onChange={(e) =>
                                                    dispatch(setSeverity({ severity: s, checked: e.target.checked }))
                                                }
                                                sx={{
                                                    color: colors.border,
                                                    '&.Mui-checked': {
                                                        color: colors.border,
                                                    },
                                                }}
                                            />
                                        }
                                        label={
                                            <Box
                                                sx={{
                                                    px: 1.5,
                                                    py: 0.5,
                                                    borderRadius: 1,
                                                    bgcolor: isChecked ? colors.bg : 'transparent',
                                                    border: '1px solid',
                                                    borderColor: isChecked ? colors.border : 'transparent',
                                                    color: isChecked ? colors.text : 'text.primary',
                                                    fontWeight: isChecked ? 600 : 400,
                                                    fontSize: '0.875rem',
                                                    textTransform: 'uppercase',
                                                    transition: 'all 0.2s',
                                                }}
                                            >
                                                {s}
                                            </Box>
                                        }
                                        sx={{
                                            ml: 0,
                                            mb: 0.5,
                                            '&:hover .MuiBox-root': {
                                                bgcolor: colors.bg,
                                                borderColor: colors.border,
                                            }
                                        }}
                                    />
                                );
                            })}
                        </FormGroup>
                    </Box>

                    <Divider />

                    {/* Exposed Only */}
                    <Box>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={filters.exposedOnly}
                                    onChange={(e) => dispatch(setExposedOnly(e.target.checked))}
                                    sx={{
                                        '& .MuiSwitch-switchBase.Mui-checked': {
                                            color: '#1976d2',
                                        },
                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                            backgroundColor: '#1976d2',
                                        },
                                    }}
                                />
                            }
                            label={
                                <Box display="flex" alignItems="center" gap={1}>
                                    <PublicIcon fontSize="small" color={filters.exposedOnly ? "primary" : "action"} />
                                    <Typography
                                        variant="body2"
                                        fontWeight={filters.exposedOnly ? 600 : 400}
                                        color={filters.exposedOnly ? "primary" : "text.primary"}
                                    >
                                        Exposed images only
                                    </Typography>
                                </Box>
                            }
                        />
                    </Box>

                    <Divider />

                    {/* Published Date */}
                    <Box>
                        <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                            <CalendarMonthIcon fontSize="small" color="action" />
                            <Typography fontWeight="600" variant="body2">
                                Published Date
                            </Typography>
                        </Box>
                        <Stack spacing={1.5}>
                            <Box>
                                <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                                    From
                                </Typography>
                                <TextField
                                    size="small"
                                    type="date"
                                    fullWidth
                                    value={filters.publishedFrom ?? ""}
                                    onChange={(e) => dispatch(setPublishedFrom(e.target.value))}
                                    InputLabelProps={{ shrink: true }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                        }
                                    }}
                                />
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                                    To
                                </Typography>
                                <TextField
                                    size="small"
                                    type="date"
                                    fullWidth
                                    value={filters.publishedTo ?? ""}
                                    onChange={(e) => dispatch(setPublishedTo(e.target.value))}
                                    InputLabelProps={{ shrink: true }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                        }
                                    }}
                                />
                            </Box>
                        </Stack>
                    </Box>

                    <Divider />

                    {/* Risk Factors */}
                    <Box>
                        <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                            <WarningIcon fontSize="small" color="action" />
                            <Typography fontWeight="600" variant="body2">
                                Risk Factors
                            </Typography>
                            {filters.riskFactors.length > 0 && (
                                <Chip
                                    size="small"
                                    label={filters.riskFactors.length}
                                    sx={{
                                        height: 18,
                                        fontSize: '0.7rem',
                                        bgcolor: '#1976d2',
                                        color: '#fff',
                                        fontWeight: 700,
                                    }}
                                />
                            )}
                        </Box>

                        {riskLoading ? (
                            <Box display="flex" flexWrap="wrap" gap={1}>
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <Skeleton key={i} variant="rounded" width={80} height={32} />
                                ))}
                            </Box>
                        ) : (
                            <Box
                                sx={{
                                    height: 180,
                                    minHeight: 180,
                                    maxHeight: 180,
                                    overflow: "auto",
                                    p: 1.5,
                                    bgcolor: '#fafafa',
                                    borderRadius: 2,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    '&::-webkit-scrollbar': {
                                        width: '6px',
                                    },
                                    '&::-webkit-scrollbar-track': {
                                        background: 'transparent',
                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                        background: '#bdbdbd',
                                        borderRadius: '3px',
                                    },
                                    '&::-webkit-scrollbar-thumb:hover': {
                                        background: '#9e9e9e',
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 1,
                                        alignContent: "flex-start",
                                    }}
                                >
                                    {suggestedRiskFactors.length === 0 ? (
                                        <Typography variant="body2" color="text.secondary" sx={{ p: 1, width: '100%', textAlign: 'center' }}>
                                            No risk factors available
                                        </Typography>
                                    ) : (
                                        suggestedRiskFactors.map((rf) => {
                                            const active = filters.riskFactors.includes(rf);
                                            const count = riskCounts?.[rf] ?? 0;
                                            return (
                                                <Chip
                                                    key={rf}
                                                    label={
                                                        <Box display="flex" alignItems="center" gap={0.5}>
                                                            <span>{rf}</span>
                                                            <Box
                                                                component="span"
                                                                sx={{
                                                                    px: 0.5,
                                                                    py: 0.25,
                                                                    bgcolor: active ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.1)',
                                                                    borderRadius: 0.5,
                                                                    fontSize: '0.7rem',
                                                                    fontWeight: 700,
                                                                }}
                                                            >
                                                                {count}
                                                            </Box>
                                                        </Box>
                                                    }
                                                    size="small"
                                                    variant={active ? "filled" : "outlined"}
                                                    onClick={() => toggleRisk(rf)}
                                                    sx={{
                                                        maxWidth: "100%",
                                                        bgcolor: active ? '#1976d2' : '#fff',
                                                        color: active ? '#fff' : 'text.primary',
                                                        borderColor: active ? '#1976d2' : 'divider',
                                                        fontWeight: active ? 600 : 400,
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s',
                                                        '&:hover': {
                                                            bgcolor: active ? '#1565c0' : '#f5f5f5',
                                                            borderColor: active ? '#1565c0' : '#bdbdbd',
                                                        },
                                                        "& .MuiChip-label": {
                                                            whiteSpace: "normal",
                                                            wordBreak: "break-word",
                                                            overflowWrap: "anywhere",
                                                            px: 1,
                                                        },
                                                    }}
                                                />
                                            );
                                        })
                                    )}
                                </Box>
                            </Box>
                        )}
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
}