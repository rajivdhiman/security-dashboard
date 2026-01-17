import Grid from '@mui/material/GridLegacy';
import {Box, Card, CardContent, Chip, Divider, Link, Stack, Typography,} from "@mui/material";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import SecurityIcon from "@mui/icons-material/Security";
import LinkIcon from "@mui/icons-material/Link";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PackageIcon from "@mui/icons-material/LocalOffer";
import ImageIcon from "@mui/icons-material/Image";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FlagIcon from "@mui/icons-material/Flag";

import type {VulnerabilityRow} from "../../types/vuln";

function dateOnly(v?: string) {
    return v ? v.slice(0, 10) : "—";
}

function fmt(v: unknown) {
    if (v === null || v === undefined || v === "") return "—";
    return String(v);
}

function DiffLine({
                      label,
                      left,
                      right,
                      icon,
                  }: {
    label: string;
    left: string;
    right: string;
    icon?: React.ReactNode;
}) {
    const different = left !== right;

    return (
        <Box sx={{ py: 1.5 }}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
                {icon && <Box sx={{ color: 'text.secondary', display: 'flex' }}>{icon}</Box>}
                <Typography variant="body2" fontWeight="600" color="text.secondary">
                    {label}
                </Typography>
            </Box>

            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Box
                        sx={{
                            px: 2,
                            py: 1.5,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: different ? '#f57c00' : 'divider',
                            bgcolor: different ? '#fff3e0' : '#fafafa',
                            transition: 'all 0.2s',
                            '&:hover': {
                                borderColor: different ? '#ef6c00' : '#bdbdbd',
                            }
                        }}
                    >
                        <Typography
                            variant="body2"
                            fontWeight={different ? "700" : "500"}
                            sx={{
                                wordBreak: 'break-word',
                                color: different ? '#e65100' : 'text.primary'
                            }}
                        >
                            {left}
                        </Typography>
                    </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Box
                        sx={{
                            px: 2,
                            py: 1.5,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: different ? '#f57c00' : 'divider',
                            bgcolor: different ? '#fff3e0' : '#fafafa',
                            transition: 'all 0.2s',
                            '&:hover': {
                                borderColor: different ? '#ef6c00' : '#bdbdbd',
                            }
                        }}
                    >
                        <Typography
                            variant="body2"
                            fontWeight={different ? "700" : "500"}
                            sx={{
                                wordBreak: 'break-word',
                                color: different ? '#e65100' : 'text.primary'
                            }}
                        >
                            {right}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}

export default function CompareDetails({
                                           left,
                                           right,
                                       }: {
    left: VulnerabilityRow;
    right: VulnerabilityRow;
}) {
    const leftRF = new Set(left.riskFactorKeys ?? []);
    const rightRF = new Set(right.riskFactorKeys ?? []);

    const common: string[] = [];
    const onlyA: string[] = [];
    const onlyB: string[] = [];

    for (const x of leftRF) (rightRF.has(x) ? common : onlyA).push(x);
    for (const x of rightRF) if (!leftRF.has(x)) onlyB.push(x);

    return (
        <Stack spacing={3}>
            {/* Header Cards for A and B */}
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Card
                        elevation={0}
                        sx={{
                            border: '2px solid #1976d2',
                            borderRadius: 2,
                            bgcolor: '#e3f2fd'
                        }}
                    >
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={1}>
                                <Box
                                    sx={{
                                        bgcolor: '#1976d2',
                                        color: '#fff',
                                        borderRadius: '50%',
                                        width: 32,
                                        height: 32,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 700,
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    A
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" fontWeight="600">
                                        Vulnerability A
                                    </Typography>
                                    <Typography variant="body1" fontWeight="700" color="#1976d2">
                                        {left.cve}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card
                        elevation={0}
                        sx={{
                            border: '2px solid #9c27b0',
                            borderRadius: 2,
                            bgcolor: '#f3e5f5'
                        }}
                    >
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={1}>
                                <Box
                                    sx={{
                                        bgcolor: '#9c27b0',
                                        color: '#fff',
                                        borderRadius: '50%',
                                        width: 32,
                                        height: 32,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 700,
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    B
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" fontWeight="600">
                                        Vulnerability B
                                    </Typography>
                                    <Typography variant="body1" fontWeight="700" color="#9c27b0">
                                        {right.cve}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Comparison Details */}
            <Card
                elevation={0}
                sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2
                }}
            >
                <CardContent>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <CompareArrowsIcon color="primary" />
                        <Typography variant="h6" fontWeight="600">
                            Side-by-Side Comparison
                        </Typography>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    <Stack spacing={0.5} divider={<Divider />}>
                        <DiffLine
                            label="Severity"
                            left={fmt(left.severity).toUpperCase()}
                            right={fmt(right.severity).toUpperCase()}
                            icon={<SecurityIcon fontSize="small" />}
                        />
                        <DiffLine
                            label="CVSS Score"
                            left={fmt(left.cvss)}
                            right={fmt(right.cvss)}
                            icon={<TrendingUpIcon fontSize="small" />}
                        />
                        <DiffLine
                            label="Published Date"
                            left={dateOnly(left.published)}
                            right={dateOnly(right.published)}
                            icon={<CalendarTodayIcon fontSize="small" />}
                        />
                        <DiffLine
                            label="Fix Available Date"
                            left={dateOnly(left.fixDate)}
                            right={dateOnly(right.fixDate)}
                            icon={<CheckCircleIcon fontSize="small" />}
                        />
                        <DiffLine
                            label="Package"
                            left={`${fmt(left.packageName)}@${fmt(left.packageVersion)}`}
                            right={`${fmt(right.packageName)}@${fmt(right.packageVersion)}`}
                            icon={<PackageIcon fontSize="small" />}
                        />
                        <DiffLine
                            label="Container Image"
                            left={`${fmt(left.imageName)}:${fmt(left.imageVersion)}`}
                            right={`${fmt(right.imageName)}:${fmt(right.imageVersion)}`}
                            icon={<ImageIcon fontSize="small" />}
                        />
                        <DiffLine
                            label="Exposed to Internet"
                            left={left.exposed ? "Yes" : "No"}
                            right={right.exposed ? "Yes" : "No"}
                            icon={<VisibilityIcon fontSize="small" />}
                        />
                        <DiffLine
                            label="Status"
                            left={fmt(left.status)}
                            right={fmt(right.status)}
                            icon={<FlagIcon fontSize="small" />}
                        />
                    </Stack>
                </CardContent>
            </Card>

            {/* Risk Factor Overlap */}
            <Card
                elevation={0}
                sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2
                }}
            >
                <CardContent>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <WarningIcon color="warning" />
                        <Typography variant="h6" fontWeight="600">
                            Risk Factor Analysis
                        </Typography>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <Card
                                elevation={0}
                                sx={{
                                    border: '2px solid #388e3c',
                                    borderRadius: 2,
                                    bgcolor: '#f1f8f4',
                                    height: '100%'
                                }}
                            >
                                <CardContent>
                                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                                        <CheckCircleIcon sx={{ color: '#388e3c', fontSize: 20 }} />
                                        <Box>
                                            <Typography variant="body2" fontWeight="600" color="#388e3c">
                                                Common Risks
                                            </Typography>
                                            <Typography variant="h5" fontWeight="700" color="#388e3c">
                                                {common.length}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                                        {common.length > 0 ? (
                                            common.map((f) => (
                                                <Chip
                                                    key={f}
                                                    label={f}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: '#fff',
                                                        border: '1px solid #388e3c',
                                                        fontWeight: 600,
                                                        fontSize: '0.7rem'
                                                    }}
                                                />
                                            ))
                                        ) : (
                                            <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                                No common risk factors
                                            </Typography>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Card
                                elevation={0}
                                sx={{
                                    border: '2px solid #1976d2',
                                    borderRadius: 2,
                                    bgcolor: '#e3f2fd',
                                    height: '100%'
                                }}
                            >
                                <CardContent>
                                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                                        <InfoIcon sx={{ color: '#1976d2', fontSize: 20 }} />
                                        <Box>
                                            <Typography variant="body2" fontWeight="600" color="#1976d2">
                                                Only in A
                                            </Typography>
                                            <Typography variant="h5" fontWeight="700" color="#1976d2">
                                                {onlyA.length}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                                        {onlyA.length > 0 ? (
                                            onlyA.map((f) => (
                                                <Chip
                                                    key={f}
                                                    label={f}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: '#fff',
                                                        border: '1px solid #1976d2',
                                                        fontWeight: 600,
                                                        fontSize: '0.7rem'
                                                    }}
                                                />
                                            ))
                                        ) : (
                                            <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                                No unique risk factors
                                            </Typography>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Card
                                elevation={0}
                                sx={{
                                    border: '2px solid #9c27b0',
                                    borderRadius: 2,
                                    bgcolor: '#f3e5f5',
                                    height: '100%'
                                }}
                            >
                                <CardContent>
                                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                                        <InfoIcon sx={{ color: '#9c27b0', fontSize: 20 }} />
                                        <Box>
                                            <Typography variant="body2" fontWeight="600" color="#9c27b0">
                                                Only in B
                                            </Typography>
                                            <Typography variant="h5" fontWeight="700" color="#9c27b0">
                                                {onlyB.length}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                                        {onlyB.length > 0 ? (
                                            onlyB.map((f) => (
                                                <Chip
                                                    key={f}
                                                    label={f}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: '#fff',
                                                        border: '1px solid #9c27b0',
                                                        fontWeight: 600,
                                                        fontSize: '0.7rem'
                                                    }}
                                                />
                                            ))
                                        ) : (
                                            <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                                No unique risk factors
                                            </Typography>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Advisory Links */}
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Card
                        elevation={0}
                        sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 2,
                            height: '100%'
                        }}
                    >
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={1} mb={2}>
                                <LinkIcon color="primary" fontSize="small" />
                                <Typography variant="body1" fontWeight="600">
                                    Advisory Link (A)
                                </Typography>
                            </Box>
                            {left.link ? (
                                <Link
                                    href={left.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    underline="hover"
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                        color: '#1976d2',
                                        fontWeight: 500,
                                        wordBreak: 'break-all',
                                        '&:hover': {
                                            color: '#1565c0'
                                        }
                                    }}
                                >
                                    {left.link}
                                    <OpenInNewIcon fontSize="small" />
                                </Link>
                            ) : (
                                <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                    No advisory link available
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card
                        elevation={0}
                        sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 2,
                            height: '100%'
                        }}
                    >
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={1} mb={2}>
                                <LinkIcon color="primary" fontSize="small" />
                                <Typography variant="body1" fontWeight="600">
                                    Advisory Link (B)
                                </Typography>
                            </Box>
                            {right.link ? (
                                <Link
                                    href={right.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    underline="hover"
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                        color: '#1976d2',
                                        fontWeight: 500,
                                        wordBreak: 'break-all',
                                        '&:hover': {
                                            color: '#1565c0'
                                        }
                                    }}
                                >
                                    {right.link}
                                    <OpenInNewIcon fontSize="small" />
                                </Link>
                            ) : (
                                <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                    No advisory link available
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Stack>
    );
}
