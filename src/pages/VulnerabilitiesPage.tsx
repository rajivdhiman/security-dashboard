import {Box} from "@mui/material";
import FilterPanel from "../components/vulns/FilterPanel";
import AnalysisActionBar from "../components/vulns/AnalysisActionBar";
import VulnerabilityListShell from "../components/vulns/VulnerabilityListShell";
import SortBar from "../components/vulns/SortBar";

export default function VulnerabilitiesPage() {
    return (
        <Box>
            {/* Header */}
            {/*<Box mb={3}>
                <Typography variant="h4" fontWeight="600" color="text.primary">
                    Vulnerabilities
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={0.5}>
                    Filter, analyze, and manage security vulnerabilities
                </Typography>
            </Box>*/}

            <Box display="flex" gap={3} sx={{ flexDirection: { xs: 'column', lg: 'row' } }}>
                {/* Left Panel - Filters and Analysis */}
                <Box
                    sx={{
                        width: { xs: '100%', lg: '380px' },
                        minWidth: { lg: '380px' },
                        maxWidth: { lg: '380px' },
                        flexShrink: 0,
                    }}
                >
                    <Box
                        sx={{
                            position: { lg: 'sticky' },
                            top: { lg: 24 },
                            maxHeight: { lg: 'calc(100vh - 120px)' },
                            overflowY: { lg: 'auto' },
                            overflowX: 'hidden',
                            '&::-webkit-scrollbar': {
                                width: '8px',
                            },
                            '&::-webkit-scrollbar-track': {
                                background: 'transparent',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                background: '#bdbdbd',
                                borderRadius: '4px',
                            },
                            '&::-webkit-scrollbar-thumb:hover': {
                                background: '#9e9e9e',
                            },
                        }}
                    >
                        <Box display="flex" flexDirection="column" gap={3}>
                            <AnalysisActionBar />
                            <FilterPanel />
                        </Box>
                    </Box>
                </Box>

                {/* Right Panel - List */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box display="flex" flexDirection="column" gap={2}>
                        <SortBar />
                        <VulnerabilityListShell />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}