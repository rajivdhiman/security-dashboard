import {
    Box,
    Card,
    CardContent,
    Divider,
    FormControlLabel,
    MenuItem,
    Stack,
    Switch,
    TextField,
    Typography,
} from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import SettingsIcon from '@mui/icons-material/Settings';
import {useAppDispatch, useAppSelector} from "../../store/hooks";
import {setShowAiVsManual, setShowSpotlight, setSpotlightChunkCount} from "../../store/slices/prefsSlice";

export default function DashboardPreferences() {
    const dispatch = useAppDispatch();
    const prefs = useAppSelector((s) => s.prefs);

    return (
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
                    <SettingsIcon color="primary" />
                    <Typography variant="h6" fontWeight="600">
                        Dashboard Preferences
                    </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Customize what you see. Saved locally in your browser.
                </Typography>

                <Stack spacing={2.5}>
                    <Box>
                        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                            <VisibilityIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                            <FormControlLabel
                                sx={{
                                    m: 0,
                                    '& .MuiFormControlLabel-label': {
                                        fontSize: '0.95rem',
                                        fontWeight: 500
                                    }
                                }}
                                control={
                                    <Switch
                                        checked={prefs.showSpotlight}
                                        onChange={(e) => dispatch(setShowSpotlight(e.target.checked))}
                                        color="primary"
                                    />
                                }
                                label="Show Critical Spotlight"
                            />
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 4 }}>
                            Display critical vulnerabilities that need immediate attention
                        </Typography>
                    </Box>

                    <Divider />

                    <Box>
                        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                            <SmartToyIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                            <FormControlLabel
                                sx={{
                                    m: 0,
                                    '& .MuiFormControlLabel-label': {
                                        fontSize: '0.95rem',
                                        fontWeight: 500
                                    }
                                }}
                                control={
                                    <Switch
                                        checked={prefs.showAiVsManual}
                                        onChange={(e) => dispatch(setShowAiVsManual(e.target.checked))}
                                        color="primary"
                                    />
                                }
                                label="Show AI vs Manual Impact"
                            />
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 4 }}>
                            Compare AI-powered vs manual vulnerability detection
                        </Typography>
                    </Box>

                    <Divider />

                    <Box>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <ViewModuleIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                            <Typography variant="body2" fontWeight="500">
                                Spotlight Sample Size
                            </Typography>
                        </Box>
                        <TextField
                            select
                            size="small"
                            fullWidth
                            label="Number of chunks to display"
                            value={prefs.spotlightChunkCount}
                            onChange={(e) => dispatch(setSpotlightChunkCount(Number(e.target.value)))}
                            sx={{ ml: 4 }}
                        >
                            {[1, 2, 3, 4, 5, 6].map((n) => (
                                <MenuItem key={n} value={n}>
                                    {n} chunk{n > 1 ? "s" : ""}
                                </MenuItem>
                            ))}
                        </TextField>
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 4, mt: 0.5, display: 'block' }}>
                            Controls how many critical items appear in the spotlight section
                        </Typography>
                    </Box>
                </Stack>

                <Box
                    sx={{
                        mt: 3,
                        p: 1.5,
                        bgcolor: '#f5f5f5',
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider'
                    }}
                >
                    <Typography variant="caption" color="text.secondary">
                        💡 <strong>Tip:</strong> Your preferences are saved automatically and persist across sessions.
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
}
