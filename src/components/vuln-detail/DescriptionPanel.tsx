import {Box, Card, CardContent, Divider, Link, Stack, Typography} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import FlagIcon from "@mui/icons-material/Flag";
import LinkIcon from "@mui/icons-material/Link";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import type {VulnerabilityRow} from "../../types/vuln";

type Props = { row: VulnerabilityRow };

export default function DescriptionPanel({ row }: Props) {
    const hasDesc = (row.description ?? "").trim().length > 0;
    const hasStatus = (row.status ?? "").trim().length > 0;
    const hasLink = (row.link ?? "").trim().length > 0;

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
                    <DescriptionIcon color="primary" />
                    <Typography variant="h6" fontWeight="600">
                        Vulnerability Description
                    </Typography>
                </Box>

                <Stack spacing={3} divider={<Divider />}>
                    {/* Status Section */}
                    {hasStatus && (
                        <Box>
                            <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                                <FlagIcon sx={{ fontSize: 18, color: "#388e3c" }} />
                                <Typography variant="body2" fontWeight="600" color="text.secondary">
                                    Fix Status
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor: "#e8f5e9",
                                    border: "1px solid #388e3c",
                                }}
                            >
                                <Box display="flex" alignItems="flex-start" gap={1.5}>
                                    <CheckCircleOutlineIcon sx={{ color: "#388e3c", fontSize: 20, mt: 0.2 }} />
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: "#2e7d32",
                                            lineHeight: 1.6,
                                            fontWeight: 500,
                                        }}
                                    >
                                        {row.status}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    )}

                    {/* Description Section */}
                    <Box>
                        <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                            <InfoOutlinedIcon sx={{ fontSize: 18, color: "#1976d2" }} />
                            <Typography variant="body2" fontWeight="600" color="text.secondary">
                                Description
                            </Typography>
                        </Box>
                        {hasDesc ? (
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "text.primary",
                                    lineHeight: 1.7,
                                    pl: 3.5,
                                }}
                            >
                                {row.description}
                            </Typography>
                        ) : (
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor: "#f5f5f5",
                                    border: "1px dashed #bdbdbd",
                                    textAlign: "center",
                                }}
                            >
                                <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                    No description available for this vulnerability
                                </Typography>
                            </Box>
                        )}
                    </Box>

                    {/* Advisory Link Section */}
                    {hasLink && (
                        <Box>
                            <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                                <LinkIcon sx={{ fontSize: 18, color: "#f57c00" }} />
                                <Typography variant="body2" fontWeight="600" color="text.secondary">
                                    External Advisory
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor: "#fff3e0",
                                    border: "1px solid #f57c00",
                                }}
                            >
                                <Link
                                    href={row.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    underline="hover"
                                    sx={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 0.75,
                                        color: "#e65100",
                                        fontWeight: 600,
                                        fontSize: "0.875rem",
                                        wordBreak: "break-all",
                                        "&:hover": {
                                            color: "#bf360c",
                                        },
                                    }}
                                >
                                    <OpenInNewIcon sx={{ fontSize: 16 }} />
                                    View full advisory details
                                </Link>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        display: "block",
                                        mt: 1,
                                        color: "#e65100",
                                        fontSize: "0.7rem",
                                        wordBreak: "break-all",
                                    }}
                                >
                                    {row.link}
                                </Typography>
                            </Box>
                        </Box>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
}
