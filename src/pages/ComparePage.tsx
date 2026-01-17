import {useEffect, useMemo, useState} from "react";
import Grid from '@mui/material/GridLegacy';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    IconButton,
    Skeleton,
    Stack,
    Typography
} from "@mui/material";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import BugReportIcon from "@mui/icons-material/BugReport";
import SecurityIcon from "@mui/icons-material/Security";
import ImageIcon from "@mui/icons-material/Image";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

import {useAppDispatch, useAppSelector} from "../store/hooks";
import {clearCompare, removeFromCompare} from "../store/slices/compareSlice";

import type {VulnerabilityRow} from "../types/vuln";
import {useRowsByIds} from "../data/useRowsByIds";

import CompareDetails from "../components/compare/CompareDetails";
import ComparePairSelector from "../components/compare/ComparePairSelector";
import WarningIcon from "@mui/icons-material/Warning";

const severityColors: Record<string, { bg: string; border: string; text: string }> = {
    critical: { bg: '#fce4ec', border: '#c2185b', text: '#c2185b' },
    high: { bg: '#fff3e0', border: '#f57c00', text: '#f57c00' },
    medium: { bg: '#fff9c4', border: '#f9a825', text: '#f57000' },
    low: { bg: '#e8f5e9', border: '#388e3c', text: '#388e3c' },
    unknown: { bg: '#f5f5f5', border: '#757575', text: '#757575' },
};

function CompareCard({ row, onRemove }: { row: VulnerabilityRow; onRemove: () => void }) {
    const severity = String(row.severity).toLowerCase();
    const colors = severityColors[severity] || severityColors.unknown;

    return (
        <Card
            elevation={0}
            sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                height: '100%',
                transition: 'all 0.2s',
                '&:hover': {
                    borderColor: colors.border,
                    boxShadow: `0 0 0 1px ${colors.border}`,
                }
            }}
        >
            <CardContent>
                <Stack spacing={2}>
                    {/* Header with CVE and Remove */}
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Box display="flex" alignItems="center" gap={1} flex={1}>
                            <BugReportIcon fontSize="small" sx={{ color: colors.text }} />
                            <Typography variant="h6" fontWeight="600" sx={{ wordBreak: 'break-all' }}>
                                {row.cve}
                            </Typography>
                        </Box>
                        <IconButton
                            size="small"
                            onClick={onRemove}
                            sx={{
                                ml: 1,
                                color: 'error.main',
                                '&:hover': { bgcolor: '#ffebee' }
                            }}
                        >
                            <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                    </Box>

                    <Divider />

                    {/* Severity Badge */}
                    <Box>
                        <Chip
                            icon={<SecurityIcon sx={{ fontSize: 16 }} />}
                            label={severity.toUpperCase()}
                            size="small"
                            sx={{
                                bgcolor: colors.bg,
                                color: colors.text,
                                border: `1px solid ${colors.border}`,
                                fontWeight: 700,
                                fontSize: '0.75rem',
                            }}
                        />
                        {row.cvss && (
                            <Chip
                                label={`CVSS ${row.cvss}`}
                                size="small"
                                sx={{
                                    ml: 1,
                                    bgcolor: '#f5f5f5',
                                    fontWeight: 600,
                                }}
                            />
                        )}
                    </Box>

                    {/* Package Info */}
                    <Box>
                        <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                            <LocalOfferIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary" fontWeight="600">
                                Package
                            </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ pl: 2.5 }}>
                            {row.packageName ?? "—"} {row.packageVersion ? `(${row.packageVersion})` : ""}
                        </Typography>
                    </Box>

                    {/* Image Info */}
                    <Box>
                        <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                            <ImageIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary" fontWeight="600">
                                Image
                            </Typography>
                        </Box>
                        <Typography
                            variant="body2"
                            sx={{
                                pl: 2.5,
                                wordBreak: 'break-all',
                                fontSize: '0.8rem'
                            }}
                        >
                            {row.imageName ?? "—"}
                        </Typography>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
}

function EmptyState({
                        title,
                        subtitle,
                        icon,
                        type = 'info'
                    }: {
    title: string;
    subtitle: string;
    icon?: React.ReactNode;
    type?: 'info' | 'warning' | 'error';
}) {
    const iconColor = type === 'warning' ? '#f57c00' : type === 'error' ? '#d32f2f' : '#1976d2';

    return (
        <Card
            elevation={0}
            sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2
            }}
        >
            <CardContent>
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Box sx={{ color: iconColor, mb: 2 }}>
                        {icon || <InfoOutlinedIcon sx={{ fontSize: 64 }} />}
                    </Box>
                    <Typography variant="h6" fontWeight="600" gutterBottom>
                        {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto' }}>
                        {subtitle}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
}

function LoadingCards({ count }: { count: number }) {
    return (
        <Grid container spacing={3}>
            {Array.from({ length: count }).map((_, i) => (
                <Grid item xs={12} md={6} lg={4} key={i}>
                    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                        <CardContent>
                            <Stack spacing={2}>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Skeleton width="60%" height={32} />
                                    <Skeleton variant="circular" width={32} height={32} />
                                </Box>
                                <Divider />
                                <Skeleton width="40%" height={28} />
                                <Skeleton width="100%" height={20} />
                                <Skeleton width="80%" height={20} />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}

export default function ComparePage() {
    const dispatch = useAppDispatch();
    const ids = useAppSelector((s) => s.compare.ids);

    const { rows, isLoading, isError } = useRowsByIds(ids);

    // Pair selector state (A vs B)
    const [aId, setAId] = useState<string>("");
    const [bId, setBId] = useState<string>("");

    // Initialize A/B when rows become available
    useEffect(() => {
        if (rows.length >= 2) {
            setAId((prev) => prev || rows[0].id);
            setBId((prev) => prev || rows[1].id);
        } else if (rows.length === 1) {
            setAId(rows[0].id);
            setBId("");
        } else {
            setAId("");
            setBId("");
        }
    }, [rows]);

    // Keep A and B different (when possible)
    useEffect(() => {
        if (!aId || !bId) return;
        if (aId !== bId) return;

        const alt = rows.find((r) => r.id !== aId);
        if (alt) setBId(alt.id);
    }, [aId, bId, rows]);

    const a = useMemo(() => rows.find((r) => r.id === aId) ?? null, [rows, aId]);
    const b = useMemo(() => rows.find((r) => r.id === bId) ?? null, [rows, bId]);

    // --- Header ---
    const header = (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Box display="flex" alignItems="center" gap={1.5}>
                    <CompareArrowsIcon color="primary" sx={{ fontSize: 32 }} />
                    <Box>
                        <Typography variant="h4" fontWeight="600">
                            Compare Vulnerabilities
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mt={0.5}>
                            Side-by-side vulnerability comparison
                        </Typography>
                    </Box>
                </Box>

                <Box display="flex" gap={1}>
                    {ids.length > 0 && (
                        <Chip
                            label={`${ids.length} selected`}
                            size="small"
                            sx={{
                                bgcolor: '#1976d2',
                                color: '#fff',
                                fontWeight: 700,
                            }}
                        />
                    )}
                    <Button
                        variant="outlined"
                        startIcon={<ClearAllIcon />}
                        onClick={() => dispatch(clearCompare())}
                        disabled={ids.length === 0}
                        sx={{
                            borderRadius: 2,
                            fontWeight: 600,
                        }}
                    >
                        Clear All
                    </Button>
                </Box>
            </Box>
        </Box>
    );

    // --- Simple readable render flow (early returns) ---
    if (ids.length === 0) {
        return (
            <Box>
                {header}
                <Box mt={3}>
                    <EmptyState
                        title="No vulnerabilities selected for comparison"
                        subtitle="Navigate to the Vulnerabilities page and click the compare icon on vulnerability rows to add them here for side-by-side analysis."
                        icon={<CompareArrowsIcon sx={{ fontSize: 64 }} />}
                        type="info"
                    />
                </Box>
            </Box>
        );
    }

    if (isLoading) {
        return (
            <Box>
                {header}
                <Box mt={3}>
                    <Alert severity="info" icon={<CircularProgress size={20} />} sx={{ mb: 3 }}>
                        Loading vulnerability data...
                    </Alert>
                    <LoadingCards count={Math.min(ids.length, 3)} />
                </Box>
            </Box>
        );
    }

    if (isError || rows.length === 0) {
        return (
            <Box>
                {header}
                <Box mt={3}>
                    <EmptyState
                        title="Could not load selected vulnerabilities"
                        subtitle="The selected vulnerability IDs were not found in the dataset. This may happen if the data has been updated. Please try selecting vulnerabilities again."
                        icon={<WarningIcon sx={{ fontSize: 64 }} />}
                        type="error"
                    />
                </Box>
            </Box>
        );
    }

    return (
        <Box>
            {header}

            <Box mt={3}>
                {/* Info Alert */}
                {rows.length >= 1 && rows.length < 2 && (
                    <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                        <Typography variant="body2" fontWeight="600">
                            Add one more vulnerability to enable comparison
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            Go to the Vulnerabilities page and click the compare icon on another row.
                        </Typography>
                    </Alert>
                )}

                {/* Selected Vulnerability Cards */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    {rows.map((r) => (
                        <Grid item xs={12} md={6} lg={4} key={r.id}>
                            <CompareCard row={r} onRemove={() => dispatch(removeFromCompare(r.id))} />
                        </Grid>
                    ))}
                </Grid>

                {/* Compare Details */}
                {rows.length >= 2 ? (
                    <Box>
                        <Card
                            elevation={0}
                            sx={{
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 2,
                                mb: 3
                            }}
                        >
                            <CardContent>
                                <ComparePairSelector
                                    rows={rows}
                                    aId={aId}
                                    bId={bId}
                                    onChangeA={setAId}
                                    onChangeB={setBId}
                                />
                            </CardContent>
                        </Card>
                        {a && b ? <CompareDetails left={a} right={b} /> : null}
                    </Box>
                ) : null}
            </Box>
        </Box>
    );
}
