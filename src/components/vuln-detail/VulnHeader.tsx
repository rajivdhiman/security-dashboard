import {Box, Card, CardContent, Stack, Typography} from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import BugReportIcon from "@mui/icons-material/BugReport";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const severityConfig: Record<string, { bg: string; border: string; text: string; label: string }> = {
    critical: {
        bg: '#fce4ec',
        border: '#c2185b',
        text: '#c2185b',
        label: 'CRITICAL'
    },
    high: {
        bg: '#fff3e0',
        border: '#f57c00',
        text: '#f57c00',
        label: 'HIGH'
    },
    medium: {
        bg: '#fff9c4',
        border: '#f9a825',
        text: '#f57000',
        label: 'MEDIUM'
    },
    low: {
        bg: '#e8f5e9',
        border: '#388e3c',
        text: '#388e3c',
        label: 'LOW'
    },
    unknown: {
        bg: '#f5f5f5',
        border: '#757575',
        text: '#757575',
        label: 'UNKNOWN'
    },
};

type Props = {
    cve: string;
    severity: string;
    cvss?: number;
};

export default function VulnHeader({ cve, severity, cvss }: Props) {
    const severityKey = severity.toLowerCase();
    const config = severityConfig[severityKey] || severityConfig.unknown;

    return (
        <Card
            elevation={0}
            sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                borderLeft: '6px solid',
                borderLeftColor: config.border,
                bgcolor: '#fff',
                transition: 'all 0.2s',
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Stack spacing={2.5}>
                    {/* CVE Title with Icon */}
                    <Box display="flex" alignItems="center" gap={1.5}>
                        <BugReportIcon
                            sx={{
                                fontSize: 40,
                                color: config.text,
                            }}
                        />
                        <Box flex={1}>
                            <Typography variant="caption" color="text.secondary" fontWeight="600">
                                Vulnerability ID
                            </Typography>
                            <Typography
                                variant="h4"
                                fontWeight="700"
                                sx={{
                                    wordBreak: 'break-all',
                                    color: 'text.primary'
                                }}
                            >
                                {cve}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Severity and CVSS Badges */}
                    <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                        {/* Severity Badge */}
                        <Box
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 1,
                                px: 2,
                                py: 1,
                                borderRadius: 2,
                                bgcolor: config.bg,
                                border: `2px solid ${config.border}`,
                            }}
                        >
                            <SecurityIcon
                                sx={{
                                    fontSize: 20,
                                    color: config.text
                                }}
                            />
                            <Box>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: config.text,
                                        fontWeight: 600,
                                        fontSize: '0.65rem',
                                        display: 'block',
                                        lineHeight: 1.2
                                    }}
                                >
                                    SEVERITY
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: config.text,
                                        fontWeight: 800,
                                        fontSize: '1rem',
                                        lineHeight: 1.2
                                    }}
                                >
                                    {config.label}
                                </Typography>
                            </Box>
                        </Box>

                        {/* CVSS Score Badge */}
                        {cvss !== undefined && cvss !== null && (
                            <Box
                                sx={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    px: 2,
                                    py: 1,
                                    borderRadius: 2,
                                    bgcolor: '#f5f5f5',
                                    border: '2px solid #e0e0e0',
                                }}
                            >
                                <TrendingUpIcon
                                    sx={{
                                        fontSize: 20,
                                        color: '#616161'
                                    }}
                                />
                                <Box>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: 'text.secondary',
                                            fontWeight: 600,
                                            fontSize: '0.65rem',
                                            display: 'block',
                                            lineHeight: 1.2
                                        }}
                                    >
                                        CVSS SCORE
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: 'text.primary',
                                            fontWeight: 800,
                                            fontSize: '1rem',
                                            lineHeight: 1.2
                                        }}
                                    >
                                        {cvss.toFixed(1)}
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                    </Box>

                    {/* Additional Info */}
                    <Box
                        sx={{
                            pt: 1.5,
                            borderTop: '1px solid',
                            borderColor: 'divider',
                        }}
                    >
                        <Typography variant="body2" color="text.secondary">
                            Detailed vulnerability information and risk analysis
                        </Typography>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
}
