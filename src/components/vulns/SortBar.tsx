import {
    Button,
    Card,
    CardContent,
    MenuItem,
    Stack,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography
} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../store/hooks";
import {setSort} from "../../store/slices/filtersSlice";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import {useNavigate} from "react-router-dom";

export default function SortBar() {
    const dispatch = useAppDispatch();
    const { sortKey, sortDir } = useAppSelector((s) => s.filters);
    const navigate = useNavigate();
    const compareCount = useAppSelector((s) => s.compare.ids.length);

    return (
        <Card elevation={0} sx={{ borderRadius: 3 }}>
            <CardContent>
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                    <Typography fontWeight={800}>Sort</Typography>

                    <Stack direction="row" spacing={1} alignItems="center">
                        <TextField
                            size="small"
                            select
                            value={sortKey}
                            onChange={(e) => dispatch(setSort({ key: e.target.value as any, dir: sortDir }))}
                            sx={{ minWidth: 160 }}
                        >
                            <MenuItem value="severity">Severity</MenuItem>
                            <MenuItem value="cvss">CVSS</MenuItem>
                            <MenuItem value="published">Published</MenuItem>
                        </TextField>
                        <Button
                            size="small"
                            variant="contained"
                            startIcon={<CompareArrowsIcon />}
                            disabled={compareCount === 0}
                            onClick={() => navigate("/compare")}
                        >
                            Compare ({compareCount})
                        </Button>

                        <ToggleButtonGroup
                            size="small"
                            exclusive
                            value={sortDir}
                            onChange={(_, v) => v && dispatch(setSort({ key: sortKey, dir: v }))}
                        >
                            <ToggleButton value="desc">Desc</ToggleButton>
                            <ToggleButton value="asc">Asc</ToggleButton>
                        </ToggleButtonGroup>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
}