import Grid from '@mui/material/GridLegacy';
import {Box} from "@mui/material";
import KpiCards from "../components/dashboard/kpiCards.tsx";
import SeverityChart from "../components/dashboard/SeverityChart";
import RiskFactorsChart from "../components/dashboard/RiskFactorsChart";
import TrendChart from "../components/dashboard/TrendChart";
import AiVsManualImpactCard from "../components/dashboard/AiVsManualImpactCard";

import {useNavigate} from "react-router-dom";
import {useChunkSample} from "../data/useChunkSample";
import {useAppSelector} from "../store/hooks";
import {applyAnalysisToggles} from "../data/applyAnalysisToggles";

import CriticalSpotlightCard from "../components/dashboard/CriticalSpotlightCard";
import DashboardPreferences from "../components/dashboard/DashboardPreferences.tsx";

export default function DashboardPage() {
    const navigate = useNavigate();
    const { excludeManualNoRisk, excludeAiNoRisk } = useAppSelector((s) => s.analysis);

    const prefs = useAppSelector((s) => s.prefs);
    const { rows: sampleRows } = useChunkSample(prefs.spotlightChunkCount);

    const filteredSample = applyAnalysisToggles(sampleRows, excludeManualNoRisk, excludeAiNoRisk);

    // Determine layout based on preferences
    const showBothCards = prefs.showSpotlight && prefs.showAiVsManual;
    const showOnlySpotlight = prefs.showSpotlight && !prefs.showAiVsManual;
    const showOnlyAiVsManual = !prefs.showSpotlight && prefs.showAiVsManual;

    return (
        <Box>
            {/* Header */}
            {/*<Box mb={3}>
                <Typography variant="h4" fontWeight="600" color="text.primary">
                    Overview
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={0.5}>
                    Security vulnerability analytics and insights dashboard
                </Typography>
            </Box>*/}

            {/* KPI Cards */}
            <Box mb={3}>
                <KpiCards />
            </Box>

            {/* Charts Row */}
            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={4}>
                    <SeverityChart />
                </Grid>
                <Grid item xs={12} md={4}>
                    <RiskFactorsChart />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TrendChart />
                </Grid>
            </Grid>

            {/* Bottom Section - Conditional Layout */}
            <Grid container spacing={3}>
                {/* Both cards shown: 2 columns layout with preferences on the side */}
                {showBothCards && (
                    <>
                        <Grid item xs={12} lg={4} >
                            <DashboardPreferences />
                        </Grid>
                        <Grid item xs={12} lg={4}>
                            <CriticalSpotlightCard
                                rows={filteredSample}
                                onOpen={(id) => navigate(`/vulnerabilities/${encodeURIComponent(id)}`)}
                            />
                        </Grid>
                        <Grid item xs={12} lg={4}>
                            <AiVsManualImpactCard />
                        </Grid>
                    </>
                )}

                {/* Only Spotlight shown */}
                {showOnlySpotlight && (
                    <>
                        <Grid item xs={12} md={4}>
                            <DashboardPreferences />
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <CriticalSpotlightCard
                                rows={filteredSample}
                                onOpen={(id) => navigate(`/vulnerabilities/${encodeURIComponent(id)}`)}
                            />
                        </Grid>
                    </>
                )}

                {/* Only AI vs Manual shown */}
                {showOnlyAiVsManual && (
                    <>
                        <Grid item xs={12} md={4}>
                            <DashboardPreferences />
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <AiVsManualImpactCard />
                        </Grid>
                    </>
                )}

                {/* Neither card shown - just preferences */}
                {!prefs.showSpotlight && !prefs.showAiVsManual && (
                    <Grid item xs={12} md={6} lg={4}>
                        <DashboardPreferences />
                    </Grid>
                )}
            </Grid>
        </Box>
    );
}
