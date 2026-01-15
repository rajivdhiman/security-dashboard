import Grid from "@mui/material/Grid";
import {Box, Card, CardContent, Chip, Stack, Typography} from "@mui/material";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import CategoryIcon from "@mui/icons-material/Category";
import ImageIcon from "@mui/icons-material/Image";
import FolderIcon from "@mui/icons-material/Folder";
import StorageIcon from "@mui/icons-material/Storage";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import type {VulnerabilityRow} from "../../types/vuln";

type Props = { row: VulnerabilityRow };

type FactConfig = {
    label: string;
    value: string;
    icon: React.ReactNode;
    color: string;
    highlight?: boolean;
};

export default function VulnFacts({ row }: Props) {
    const facts: FactConfig[] = [
        {
            label: "Package",
            value: `${row.packageName ?? "—"}@${row.packageVersion ?? "—"}`,
            icon: <LocalOfferIcon />,
            color: "#1976d2",
        },
        {
            label: "Package Type",
            value: row.packageType ?? "—",
            icon: <CategoryIcon />,
            color: "#7b1fa2",
        },
        {
            label: "Container Image",
            value: `${row.imageName ?? "—"}:${row.imageVersion ?? "—"}`,
            icon: <ImageIcon />,
            color: "#0288d1",
        },
        {
            label: "Group",
            value: row.group ?? "—",
            icon: <FolderIcon />,
            color: "#f57c00",
        },
        {
            label: "Repository",
            value: row.repo ?? "—",
            icon: <StorageIcon />,
            color: "#388e3c",
        },
        {
            label: "Exposed to Internet",
            value: row.exposed ? "Yes" : "No",
            icon: row.exposed ? <VisibilityIcon /> : <VisibilityOffIcon />,
            color: row.exposed ? "#d32f2f" : "#388e3c",
            highlight: true,
        },
    ];

    return (
        <Box>
            <Box mb={2}>
                <Typography variant="h6" fontWeight="600">
                    Vulnerability Details
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Package, image, and exposure information
                </Typography>
            </Box>

            <Grid container spacing={2}>
                {facts.map((fact) => (
                    <Grid item xs={12} sm={6} lg={4} key={fact.label}>
                        <Card
                            elevation={0}
                            sx={{
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 2,
                                height: "100%",
                                transition: "all 0.2s",
                                "&:hover": {
                                    borderColor: fact.color,
                                    boxShadow: `0 0 0 1px ${fact.color}`,
                                },
                            }}
                        >
                            <CardContent>
                                <Stack spacing={1.5}>
                                    {/* Label with Icon */}
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                width: 32,
                                                height: 32,
                                                borderRadius: 1,
                                                bgcolor: `${fact.color}15`,
                                                color: fact.color,
                                            }}
                                        >
                                            {fact.icon}
                                        </Box>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            fontWeight="600"
                                            sx={{ textTransform: "uppercase", fontSize: "0.7rem" }}
                                        >
                                            {fact.label}
                                        </Typography>
                                    </Box>

                                    {/* Value */}
                                    {fact.highlight ? (
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Chip
                                                icon={
                                                    row.exposed ? (
                                                        <CheckCircleIcon sx={{ fontSize: 16 }} />
                                                    ) : (
                                                        <CancelIcon sx={{ fontSize: 16 }} />
                                                    )
                                                }
                                                label={fact.value}
                                                size="small"
                                                sx={{
                                                    bgcolor: row.exposed ? "#ffebee" : "#e8f5e9",
                                                    color: fact.color,
                                                    border: `1px solid ${fact.color}`,
                                                    fontWeight: 700,
                                                    fontSize: "0.8rem",
                                                }}
                                            />
                                        </Box>
                                    ) : (
                                        <Typography
                                            variant="body1"
                                            fontWeight="600"
                                            sx={{
                                                wordBreak: "break-word",
                                                color: "text.primary",
                                                lineHeight: 1.4,
                                            }}
                                        >
                                            {fact.value}
                                        </Typography>
                                    )}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
