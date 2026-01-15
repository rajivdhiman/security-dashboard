import {useState} from "react";
import {Box, Button, Divider, ListItemIcon, ListItemText, Menu, MenuItem} from "@mui/material";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import DownloadIcon from "@mui/icons-material/Download";
import CodeIcon from "@mui/icons-material/Code";
import TableChartIcon from "@mui/icons-material/TableChart";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

type Props = {
    onAddToCompare?: () => void;
    onExportJson?: () => void;
    onExportCsv?: () => void;
};

export default function VulnActions({
                                        onAddToCompare,
                                        onExportJson,
                                        onExportCsv,
                                    }: Props) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const exportJson = () => {
        handleClose();
        onExportJson?.();
    };

    const exportCsv = () => {
        handleClose();
        onExportCsv?.();
    };

    return (
        <Box
            sx={{
                display: 'flex',
                gap: 2,
                flexWrap: 'wrap',
                p: 2,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: '#fafafa',
            }}
        >
            {/* Add to Compare Button */}
            <Button
                startIcon={<CompareArrowsIcon />}
                variant="outlined"
                onClick={onAddToCompare}
                sx={{
                    flex: { xs: '1 1 100%', sm: '1 1 auto' },
                    minWidth: { sm: 180 },
                    fontWeight: 600,
                    borderRadius: 2,
                    borderWidth: 2,
                    '&:hover': {
                        borderWidth: 2,
                        bgcolor: '#e3f2fd',
                    }
                }}
            >
                Add to Compare
            </Button>

            {/* Export Button */}
            <Button
                startIcon={<DownloadIcon />}
                endIcon={<KeyboardArrowDownIcon />}
                variant="contained"
                onClick={handleOpen}
                sx={{
                    flex: { xs: '1 1 100%', sm: '1 1 auto' },
                    minWidth: { sm: 180 },
                    fontWeight: 600,
                    borderRadius: 2,
                    bgcolor: '#1976d2',
                    '&:hover': {
                        bgcolor: '#1565c0',
                    }
                }}
            >
                Export Data
            </Button>

            {/* Export Menu */}
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                sx={{
                    mt: 1,
                    '& .MuiPaper-root': {
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        minWidth: 200,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    }
                }}
            >
                <Box sx={{ px: 2, py: 1.5 }}>
                    <ListItemText
                        primary="Export Format"
                        primaryTypographyProps={{
                            variant: 'caption',
                            color: 'text.secondary',
                            fontWeight: 700,
                            fontSize: '0.7rem',
                        }}
                    />
                </Box>
                <Divider />
                <MenuItem
                    onClick={exportJson}
                    sx={{
                        py: 1.5,
                        '&:hover': {
                            bgcolor: '#e3f2fd',
                        }
                    }}
                >
                    <ListItemIcon>
                        <CodeIcon sx={{ color: '#1976d2' }} />
                    </ListItemIcon>
                    <ListItemText
                        primary="Export as JSON"
                        secondary="Structured data format"
                        primaryTypographyProps={{
                            fontWeight: 600,
                        }}
                        secondaryTypographyProps={{
                            variant: 'caption',
                            fontSize: '0.7rem',
                        }}
                    />
                </MenuItem>
                <MenuItem
                    onClick={exportCsv}
                    sx={{
                        py: 1.5,
                        '&:hover': {
                            bgcolor: '#e3f2fd',
                        }
                    }}
                >
                    <ListItemIcon>
                        <TableChartIcon sx={{ color: '#388e3c' }} />
                    </ListItemIcon>
                    <ListItemText
                        primary="Export as CSV"
                        secondary="Spreadsheet format"
                        primaryTypographyProps={{
                            fontWeight: 600,
                        }}
                        secondaryTypographyProps={{
                            variant: 'caption',
                            fontSize: '0.7rem',
                        }}
                    />
                </MenuItem>
            </Menu>
        </Box>
    );
}
