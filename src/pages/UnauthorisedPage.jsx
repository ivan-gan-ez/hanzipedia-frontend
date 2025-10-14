import { useState } from "react";
import { Box, Paper, Container, Typography } from "@mui/material";
import { Link } from "react-router";

function UnauthorisedPage() {
  return (
    <>
      <Container maxWidth="lg" sx={{ py: 5, minHeight: "72vh" }}>
        <Paper elevation={2} sx={{ py: 3, px: 6 }}>
          <Box sx={{ my: 3 }}>
            <Typography textAlign="center" variant="h4" fontWeight="600">
              Halt!
            </Typography>
          </Box>
          <Typography
            textAlign="center"
            variant="h5"
            fontWeight="400"
            sx={{ mb: 2 }}
          >
            You were trying to enter a restricted or nonexistent page.
          </Typography>
          <Typography textAlign="center" sx={{ mb: 6 }}>
            不准进去！
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <img src="/止.png" width={"200rem"} />
          </Box>
        </Paper>
      </Container>
    </>
  );
}

export default UnauthorisedPage;
