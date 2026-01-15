import {Box, Chip, Divider, MenuItem, Stack, TextField, Typography} from "@mui/material";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import type {VulnerabilityRow} from "../../types/vuln";

const severityColors: Record<string, { bg: string; border: string; text: string }> = {
    critical: { bg: '#fce4ec', border: '#c2185b', text: '#c2185b' },
    high: { bg: '#fff3e0', border: '#f57c00', text: '#f57c00' },
    medium: { bg: '#fff9c4', border: '#f9a825', text: '#f57000' },
    low: { bg: '#e8f5e9', border: '#388e3c', text: '#388e3c' },
    unknown: { bg: '#f5f5f5', border: '#757575', text: '#757575' },
};

export default function ComparePairSelector({
                                                rows,
                                                aId,
                                                bId,
                                                onChangeA,
                                                onChangeB,
                                            }: {
    rows: VulnerabilityRow[];
    aId: string;
    bId: string;
    onChangeA: (id: string) => void;
    onChangeB: (id: string) => void;
}) {
    return (
        <Box>
            <Box display="flex" alignItems="center" gap={1} mb={3}>
                <CompareArrowsIcon color="primary" />
                <Typography variant="h6" fontWeight="600">
                    Select Comparison Pair
                </Typography>
            </Box>

            <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={2}
                alignItems={{ xs: 'stretch', md: 'center' }}
            >
                {/* Selector A */}
                <Box flex={1}>
                    <Box
                        sx={{
                            border: '2px solid #1976d2',
                            borderRadius: 2,
                            bgcolor: '#e3f2fd',
                            p: 2
                        }}
                    >
                        <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                            <Box
                                sx={{
                                    bgcolor: '#1976d2',
                                    color: '#fff',
                                    borderRadius: '50%',
                                    width: 24,
                                    height: 24,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 700,
                                    fontSize: '0.75rem'
                                }}
                            >
                                A
                            </Box>
                            <Typography variant="body2" fontWeight="600" color="#1976d2">
                                Vulnerability A
                            </Typography>
                        </Box>

                        <TextField
                            size="small"
                            select
                            fullWidth
                            value={aId}
                            onChange={(e) => onChangeA(e.target.value)}
                            sx={{
                                bgcolor: '#fff',
                                borderRadius: 1,
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: '#1976d2',
                                        borderWidth: 2,
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#1565c0',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#1976d2',
                                    },
                                },
                            }}
                        >
                            {rows.map((r) => {
                                const severity = String(r.severity).toLowerCase();
                                const colors = severityColors[severity] || severityColors.unknown;

                                return (
                                    <MenuItem key={r.id} value={r.id}>
                                        <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                                            <Typography variant="body2" fontWeight="600">
                                                {r.cve}
                                            </Typography>
                                            <Chip
                                                label={severity.toUpperCase()}
                                                size="small"
                                                sx={{
                                                    ml: 1,
                                                    bgcolor: colors.bg,
                                                    color: colors.text,
                                                    border: `1px solid ${colors.border}`,
                                                    fontWeight: 700,
                                                    fontSize: '0.65rem',
                                                    height: 20,
                                                }}
                                            />
                                        </Box>
                                    </MenuItem>
                                );
                            })}
                        </TextField>
                    </Box>
                </Box>

                {/* VS Indicator */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                    }}
                >
                    <Box
                        sx={{
                            display: { xs: 'none', md: 'flex' },
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 48,
                            height: 48,
                            borderRadius: '50%',
                            bgcolor: '#f5f5f5',
                            border: '2px solid #e0e0e0',
                        }}
                    >
                        <ArrowRightAltIcon sx={{ fontSize: 28, color: '#757575' }} />
                    </Box>

                    {/* Mobile divider */}
                    <Divider
                        sx={{
                            display: { xs: 'block', md: 'none' },
                            my: 1,
                            width: '100%'
                        }}
                    />
                </Box>

                {/* Selector B */}
                <Box flex={1}>
                    <Box
                        sx={{
                            border: '2px solid #9c27b0',
                            borderRadius: 2,
                            bgcolor: '#f3e5f5',
                            p: 2
                        }}
                    >
                        <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                            <Box
                                sx={{
                                    bgcolor: '#9c27b0',
                                    color: '#fff',
                                    borderRadius: '50%',
                                    width: 24,
                                    height: 24,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 700,
                                    fontSize: '0.75rem'
                                }}
                            >
                                B
                            </Box>
                            <Typography variant="body2" fontWeight="600" color="#9c27b0">
                                Vulnerability B
                            </Typography>
                        </Box>

                        <TextField
                            size="small"
                            select
                            fullWidth
                            value={bId}
                            onChange={(e) => onChangeB(e.target.value)}
                            sx={{
                                bgcolor: '#fff',
                                borderRadius: 1,
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: '#9c27b0',
                                        borderWidth: 2,
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#7b1fa2',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#9c27b0',
                                    },
                                },
                            }}
                        >
                            {rows.map((r) => {
                                const severity = String(r.severity).toLowerCase();
                                const colors = severityColors[severity] || severityColors.unknown;

                                return (
                                    <MenuItem key={r.id} value={r.id}>
                                        <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                                            <Typography variant="body2" fontWeight="600">
                                                {r.cve}
                                            </Typography>
                                            <Chip
                                                label={severity.toUpperCase()}
                                                size="small"
                                                sx={{
                                                    ml: 1,
                                                    bgcolor: colors.bg,
                                                    color: colors.text,
                                                    border: `1px solid ${colors.border}`,
                                                    fontWeight: 700,
                                                    fontSize: '0.65rem',
                                                    height: 20,
                                                }}
                                            />
                                        </Box>
                                    </MenuItem>
                                );
                            })}
                        </TextField>
                    </Box>
                </Box>
            </Stack>
        </Box>
    );
}
