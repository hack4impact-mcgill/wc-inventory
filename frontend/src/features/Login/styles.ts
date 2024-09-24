import { Typography } from "@mui/material";
import styled from "styled-components";

export const ErrorText = styled(Typography)(({ theme }) => ({
    color: theme.palette.error.main,
    marginTop: theme.spacing(2),
    textAlign: 'center',
}));