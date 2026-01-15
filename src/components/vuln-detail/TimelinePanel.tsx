import {Box, Card, CardContent, Typography} from "@mui/material";
import ScheduleIcon from "@mui/icons-material/Schedule";
import PublishIcon from "@mui/icons-material/Publish";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

import type {VulnerabilityRow} from "../../types/vuln";

type Props = { row: VulnerabilityRow };

function formatDate(v?: string) {
    if (!v) return null;

    const dateStr = v.slice(0, 10);

    try {
        const date = new Date(dateStr);
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        };
        return {
            formatted: date.toLocaleDateString('en-US', options),
            raw: dateStr,
        };
    } catch {
        return { formatted: dateStr, raw: dateStr };
    }
}

function calculateDaysSince(dateStr?: string): number | null {
    if (!dateStr) return null;

    try {
        const date = new Date(dateStr.slice(0, 10));
        const now = new Date();
        const diffTime = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    } catch {
        return null;
    }
}

export default function TimelinePanel({ row }: Props) {
    const publishedDate = formatDate(row.published);
    const fixDate = formatDate(row.fixDate);
    const daysSincePublished = calculateDaysSince(row.published);
    const hasFixDate = !!fixDate;

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
                <Box display="flex" alignItems="center" gap={1} mb={3}>
                    <ScheduleIcon color="primary" />
                    <Typography variant="h6" fontWeight="600">
                        Vulnerability Timeline
                    </Typography>
                </Box>

                {/* Timeline */}
                <Box position="relative">
                    {/* Vertical Line */}
                    <Box
                        sx={{
                            position: "absolute",
                            left: 19,
                            top: 24,
                            bottom: hasFixDate ? 24 : 0,
                            width: 2,
                            bgcolor: hasFixDate ? "#1976d2" : "#e0e0e0",
                            borderRadius: 1,
                        }}
                    />

                    <Box display="flex" flexDirection="column" gap={3}>
                        {/* Published Date */}
                        <Box display="flex" gap={2}>
                            <Box
                                sx={{
                                    flexShrink: 0,
                                    width: 40,
                                    height: 40,
                                    borderRadius: "50%",
                                    bgcolor: "#e3f2fd",
                                    border: "2px solid #1976d2",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    zIndex: 1,
                                }}
                            >
                                <PublishIcon sx={{ fontSize: 20, color: "#1976d2" }} />
                            </Box>
                            <Box flex={1}>
                                <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                                    <Typography variant="body2" fontWeight="600" color="text.primary">
                                        Vulnerability Published
                                    </Typography>
                                </Box>
                                {publishedDate ? (
                                    <>
                                        <Typography variant="h6" fontWeight="700" color="#1976d2" sx={{ mb: 0.5 }}>
                                            {publishedDate.formatted}
                                        </Typography>
                                        {daysSincePublished !== null && (
                                            <Typography variant="caption" color="text.secondary">
                                                {daysSincePublished} day{daysSincePublished !== 1 ? "s" : ""} ago
                                            </Typography>
                                        )}
                                    </>
                                ) : (
                                    <Box
                                        sx={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: 0.5,
                                            px: 1.5,
                                            py: 0.5,
                                            borderRadius: 1,
                                            bgcolor: "#f5f5f5",
                                            border: "1px dashed #bdbdbd",
                                        }}
                                    >
                                        <RemoveCircleOutlineIcon sx={{ fontSize: 14, color: "#9e9e9e" }} />
                                        <Typography variant="caption" color="text.secondary">
                                            Not available
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Box>

                        {/* Fix Date */}
                        <Box display="flex" gap={2}>
                            <Box
                                sx={{
                                    flexShrink: 0,
                                    width: 40,
                                    height: 40,
                                    borderRadius: "50%",
                                    bgcolor: hasFixDate ? "#e8f5e9" : "#f5f5f5",
                                    border: `2px solid ${hasFixDate ? "#388e3c" : "#bdbdbd"}`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    zIndex: 1,
                                }}
                            >
                                {hasFixDate ? (
                                    <CheckCircleIcon sx={{ fontSize: 20, color: "#388e3c" }} />
                                ) : (
                                    <BuildCircleIcon sx={{ fontSize: 20, color: "#9e9e9e" }} />
                                )}
                            </Box>
                            <Box flex={1}>
                                <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                                    <Typography variant="body2" fontWeight="600" color="text.primary">
                                        Fix Available
                                    </Typography>
                                </Box>
                                {hasFixDate ? (
                                    <>
                                        <Typography variant="h6" fontWeight="700" color="#388e3c" sx={{ mb: 0.5 }}>
                                            {fixDate.formatted}
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: 0.5,
                                                px: 1.5,
                                                py: 0.5,
                                                borderRadius: 1,
                                                bgcolor: "#e8f5e9",
                                                border: "1px solid #388e3c",
                                            }}
                                        >
                                            <CheckCircleIcon sx={{ fontSize: 14, color: "#388e3c" }} />
                                            <Typography variant="caption" fontWeight="600" sx={{ color: "#2e7d32" }}>
                                                Patch released
                                            </Typography>
                                        </Box>
                                    </>
                                ) : (
                                    <>
                                        <Box
                                            sx={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: 0.5,
                                                px: 1.5,
                                                py: 0.5,
                                                borderRadius: 1,
                                                bgcolor: "#fff3e0",
                                                border: "1px solid #f57c00",
                                                mb: 0.5,
                                            }}
                                        >
                                            <BuildCircleIcon sx={{ fontSize: 14, color: "#f57c00" }} />
                                            <Typography variant="caption" fontWeight="600" sx={{ color: "#e65100" }}>
                                                No fix available yet
                                            </Typography>
                                        </Box>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            Waiting for vendor patch or mitigation
                                        </Typography>
                                    </>
                                )}
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {/* Info Box */}
                {publishedDate && hasFixDate && (
                    <Box
                        sx={{
                            mt: 3,
                            p: 2,
                            borderRadius: 2,
                            bgcolor: "#f5f5f5",
                            border: "1px solid #e0e0e0",
                        }}
                    >
                        <Box display="flex" alignItems="center" gap={1.5}>
                            <CalendarTodayIcon sx={{ fontSize: 18, color: "#616161" }} />
                            <Typography variant="caption" color="text.secondary">
                                Fix was released{" "}
                                <strong>
                                    {Math.abs(
                                        Math.floor(
                                            (new Date(fixDate.raw).getTime() -
                                                new Date(publishedDate.raw).getTime()) /
                                            (1000 * 60 * 60 * 24)
                                        )
                                    )}{" "}
                                    days
                                </strong>{" "}
                                after vulnerability disclosure
                            </Typography>
                        </Box>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}
