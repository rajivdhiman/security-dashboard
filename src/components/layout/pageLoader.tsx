import {Box, CircularProgress} from "@mui/material";

export function PageLoader() {
    return (
        <Box sx={{height: "60vh", display: "grid", placeItems: "center"}}>
            <CircularProgress/>
        </Box>
    );
}