import {Box, Card, CardContent, Chip, Divider, Typography} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ShieldIcon from "@mui/icons-material/Shield";

import type {VulnerabilityRow} from "../../types/vuln";

type Props = { row: VulnerabilityRow };

// Define some common risk factor categories for color coding
const riskFactorColors: Record<string, { bg: string; border: string; text: string }> = {
    // High severity risk factors
    "Remote Code Execution": { bg: "#ffebee", border: "#c62828", text: "#b71c1c" },
    "Exploit Available": { bg: "#ffebee", border: "#c62828", text: "#b71c1c" },
    "Actively Exploited": { bg: "#ffebee", border: "#c62828", text: "#b71c1c" },
    "Network Accessible": { bg: "#fff3e0", border: "#f57c00", text: "#e65100" },
    "Attack Complexity: Low": { bg: "#fff3e0", border: "#f57c00", text: "#e65100" },
    // Medium severity
    "Authentication Not Required": { bg: "#fff9c4", border: "#f9a825", text: "#f57000" },
    "Privilege Escalation": { bg: "#fff9c4", border: "#f9a825", text: "#f57000" },
    // Lower severity
    "Default": { bg: "#e3f2fd", border: "#1976d2", text: "#0d47a1" },
};

function getRiskFactorStyle(factor: string) {
    // Check if we have a specific style for this factor
    if (riskFactorColors[factor]) {
        return riskFactorColors[factor];
    }

    // Use keyword matching for common patterns
    const lowerFactor = factor.toLowerCase();
    if (
        lowerFactor.includes("exploit") ||
        lowerFactor.includes("remote") ||
        lowerFactor.includes("critical")
    ) {
        return { bg: "#ffebee", border: "#c62828", text: "#b71c1c" };
    }
    if (
        lowerFactor.includes("network") ||
        lowerFactor.includes("exposed") ||
        lowerFactor.includes("high")
    ) {
        return { bg: "#fff3e0", border: "#f57c00", text: "#e65100" };
    }
    if (lowerFactor.includes("authentication") || lowerFactor.includes("privilege")) {
        return { bg: "#fff9c4", border: "#f9a825", text: "#f57000" };
    }

    // Default style
    return riskFactorColors.Default;
}

export default function RiskFactorsPanel({ row }: Props) {
    const factors = row.riskFactorKeys ?? [];
    const hasFactors = factors.length > 0;

    return (
        <Card
            elevation={0}
            sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
            }}
        >
            <CardContent sx={{ p: 3 }}>
                {/* Header */}
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <WarningAmberIcon sx={{ color: hasFactors ? "#f57c00" : "#9e9e9e" }} />
                        <Typography variant="h6" fontWeight="600">
                            Risk Factors
                        </Typography>
                    </Box>
                    {hasFactors && (
                        <Chip
                            label={`${factors.length} factor${factors.length !== 1 ? "s" : ""}`}
                            size="small"
                            sx={{
                                bgcolor: "#fff3e0",
                                color: "#e65100",
                                border: "1px solid #f57c00",
                                fontWeight: 700,
                                fontSize: "0.75rem",
                            }}
                        />
                    )}
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Contributing factors that increase the risk level of this vulnerability
                </Typography>

                <Divider sx={{ mb: 3 }} />

                {/* Risk Factors */}
                {hasFactors ? (
                    <Box display="flex" flexWrap="wrap" gap={1.5}>
                        {factors.map((factor) => {
                            const style = getRiskFactorStyle(factor);
                            return (
                                <Chip
                                    key={factor}
                                    icon={<ErrorOutlineIcon sx={{ fontSize: 16 }} />}
                                    label={factor}
                                    sx={{
                                        bgcolor: style.bg,
                                        color: style.text,
                                        border: `1.5px solid ${style.border}`,
                                        fontWeight: 600,
                                        fontSize: "0.8rem",
                                        height: 32,
                                        "& .MuiChip-icon": {
                                            color: style.text,
                                        },
                                        transition: "all 0.2s",
                                        "&:hover": {
                                            borderWidth: "2px",
                                            boxShadow: `0 0 0 2px ${style.bg}`,
                                        },
                                    }}
                                />
                            );
                        })}
                    </Box>
                ) : (
                    <Box
                        sx={{
                            textAlign: "center",
                            py: 6,
                            px: 3,
                            borderRadius: 2,
                            bgcolor: "#f5f5f5",
                            border: "1px dashed #bdbdbd",
                        }}
                    >
                        <ShieldIcon sx={{ fontSize: 64, color: "#9e9e9e", mb: 2 }} />
                        <Typography variant="h6" fontWeight="600" color="text.secondary" gutterBottom>
                            No Risk Factors Identified
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: "auto" }}>
                            This vulnerability has no additional risk factors detected in the current analysis
                        </Typography>
                    </Box>
                )}

                {/* Info Box */}
                {hasFactors && (
                    <Box
                        sx={{
                            mt: 3,
                            p: 2,
                            borderRadius: 2,
                            bgcolor: "#e3f2fd",
                            border: "1px solid #1976d2",
                        }}
                    >
                        <Box display="flex" alignItems="flex-start" gap={1.5}>
                            <ErrorOutlineIcon sx={{ color: "#1976d2", fontSize: 20, mt: 0.2 }} />
                            <Box>
                                <Typography variant="body2" fontWeight="600" color="#0d47a1" gutterBottom>
                                    About Risk Factors
                                </Typography>
                                <Typography variant="caption" sx={{ color: "#1565c0", lineHeight: 1.5 }}>
                                    Risk factors represent additional conditions that may increase the exploitability or
                                    impact of this vulnerability. These include attack complexity, required privileges,
                                    network accessibility, and known exploits.
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}
