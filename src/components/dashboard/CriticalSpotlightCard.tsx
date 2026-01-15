import {Box, Button, Card, CardContent, Chip, Divider, Stack, Typography} from "@mui/material";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import SecurityIcon from '@mui/icons-material/Security';
import PublicIcon from '@mui/icons-material/Public';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import type {VulnerabilityRow} from "../../types/vuln";

function severityWeight(sev: string) {
    switch (sev) {
        case "critical":
            return 40;
        case "high":
            return 25;
        case "medium":
            return 12;
        case "low":
            return 5;
        default:
            return 1;
    }
}

function riskScore(v: VulnerabilityRow) {
    const sev = severityWeight(String(v.severity));
    const cvss = typeof v.cvss === "number" ? v.cvss : 0;
    const exposed = v.exposed ? 8 : 0;
    const rf = (v.riskFactorKeys?.length ?? 0) * 0.8;
    return sev + cvss + exposed + rf;
}

function sevChip(sev: string) {
    const s = sev.toLowerCase();
    if (s === "critical") {
        return (
            <Chip
                size="small"
                label="CRITICAL"
                sx={{
                    bgcolor: '#d32f2f',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.75rem'
                }}
            />
        );
    }
    if (s === "high") {
        return (
            <Chip
                size="small"
                label="HIGH"
                sx={{
                    bgcolor: '#f57c00',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.75rem'
                }}
            />
        );
    }
    if (s === "medium") {
        return (
            <Chip
                size="small"
                label="MEDIUM"
                sx={{
                    bgcolor: '#fbc02d',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.75rem'
                }}
            />
        );
    }
    return (
        <Chip
            size="small"
            label={s.toUpperCase()}
            sx={{
                bgcolor: '#388e3c',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.75rem'
            }}
        />
    );
}

export default function CriticalSpotlightCard({
                                                  rows,
                                                  topN = 8,
                                                  onOpen,
                                              }: {
    rows: VulnerabilityRow[];
    topN?: number;
    onOpen?: (id: string) => void;
}) {
    const top = [...rows]
        .sort((a, b) => riskScore(b) - riskScore(a))
        .slice(0, topN);

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
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                                <WarningAmberIcon color="error" />
                                <Typography variant="h6" fontWeight="600">
                                    Critical Spotlight
                                </Typography>
                            </Box>
                            <Typography color="text.secondary" variant="body2">
                                Ranked from a sample of loaded chunks (severity + CVSS + exposed + risk factors).
                            </Typography>
                        </Box>
                        <Chip
                            size="small"
                            label={`Top ${top.length}`}
                            sx={{
                                bgcolor: '#e3f2fd',
                                color: '#1976d2',
                                fontWeight: 600
                            }}
                        />
                    </Box>

                    <Divider />

                    {top.length === 0 ? (
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                            py={4}
                        >
                            <SecurityIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                            <Typography color="text.secondary">No vulnerabilities loaded.</Typography>
                            <Typography variant="caption" color="text.secondary">
                                Data will appear here once vulnerabilities are detected.
                            </Typography>
                        </Box>
                    ) : (
                        <Stack spacing={1.5} sx={{ maxHeight: 520, overflowY: 'auto', pr: 0.5 }}>
                            {top.map((r, index) => (
                                <Box
                                    key={r.id}
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        border: "1px solid",
                                        borderColor: "divider",
                                        cursor: onOpen ? "pointer" : "default",
                                        transition: 'all 0.2s',
                                        position: 'relative',
                                        "&:hover": {
                                            bgcolor: "grey.50",
                                            borderColor: 'primary.main',
                                            boxShadow: 1
                                        },
                                    }}
                                    onClick={() => onOpen?.(r.id)}
                                >
                                    {/* Rank Badge */}
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: -8,
                                            left: 12,
                                            bgcolor: index < 3 ? '#d32f2f' : 'primary.main',
                                            color: 'white',
                                            borderRadius: '12px',
                                            px: 1,
                                            py: 0.25,
                                            fontSize: '0.7rem',
                                            fontWeight: 700,
                                            border: '2px solid white'
                                        }}
                                    >
                                        #{index + 1}
                                    </Box>

                                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                        <Stack spacing={1} flex={1}>
                                            <Box display="flex" flexWrap="wrap" gap={1} alignItems="center">
                                                <Typography variant="subtitle2" fontWeight="700" color="primary">
                                                    {r.cve || "N/A"}
                                                </Typography>
                                                {sevChip(String(r.severity))}
                                                {r.exposed && (
                                                    <Chip
                                                        size="small"
                                                        icon={<PublicIcon sx={{ fontSize: 14 }} />}
                                                        label="EXPOSED"
                                                        sx={{
                                                            bgcolor: '#388e3c',
                                                            color: 'white',
                                                            fontWeight: 600,
                                                            fontSize: '0.75rem'
                                                        }}
                                                    />
                                                )}
                                            </Box>

                                            <Typography variant="body2" color="text.secondary">
                                                <strong>Package:</strong> {r.packageName ?? "—"} {r.packageVersion ?? ""}
                                            </Typography>

                                            <Typography variant="body2" color="text.secondary">
                                                <strong>Image:</strong> {r.imageName ?? "—"}
                                            </Typography>

                                            {r.cvss !== undefined && r.cvss !== null && (
                                                <Typography variant="caption" color="text.secondary">
                                                    CVSS Score: <strong>{r.cvss}</strong>
                                                </Typography>
                                            )}

                                            {r.riskFactorKeys && r.riskFactorKeys.length > 0 && (
                                                <Box display="flex" gap={0.5} flexWrap="wrap">
                                                    {r.riskFactorKeys.slice(0, 3).map((rf, i) => (
                                                        <Chip
                                                            key={i}
                                                            size="small"
                                                            label={rf}
                                                            variant="outlined"
                                                            sx={{ fontSize: '0.7rem', height: 20 }}
                                                        />
                                                    ))}
                                                    {r.riskFactorKeys.length > 3 && (
                                                        <Chip
                                                            size="small"
                                                            label={`+${r.riskFactorKeys.length - 3} more`}
                                                            variant="outlined"
                                                            sx={{ fontSize: '0.7rem', height: 20 }}
                                                        />
                                                    )}
                                                </Box>
                                            )}
                                        </Stack>

                                        <Box display="flex" flexDirection="column" alignItems="flex-end" gap={1} ml={2}>
                                            <Chip
                                                icon={<TrendingUpIcon sx={{ fontSize: 16 }} />}
                                                size="small"
                                                label={`${riskScore(r).toFixed(1)}`}
                                                sx={{
                                                    bgcolor: '#fff3e0',
                                                    color: '#f57c00',
                                                    fontWeight: 700,
                                                    fontSize: '0.85rem'
                                                }}
                                            />
                                            {onOpen && (
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{ fontSize: '0.7rem', py: 0.25 }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onOpen(r.id);
                                                    }}
                                                >
                                                    View Details
                                                </Button>
                                            )}
                                        </Box>
                                    </Box>
                                </Box>
                            ))}
                        </Stack>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
}
