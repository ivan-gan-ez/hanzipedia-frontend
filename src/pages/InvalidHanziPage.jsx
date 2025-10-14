import { useState } from "react";
import { Box, Paper, Container, Typography } from "@mui/material";
import { Link } from "react-router";

function InvalidHanziPage() {
  return (
    <>
      <Container maxWidth="lg" sx={{ py: 5, minHeight: "72vh" }}>
        <Paper elevation={2} sx={{ py: 3, px: 6 }}>
          <Box sx={{ my: 3 }}>
            <Typography textAlign="center" variant="h4" fontWeight="600">
              Oops!
            </Typography>
          </Box>
          <Typography
            textAlign="center"
            variant="h5"
            fontWeight="400"
            sx={{ mb: 2 }}
          >
            The character you were looking for isn't a valid hanzi.
          </Typography>
          <Typography textAlign="center" sx={{ mb: 6 }}>
            Only characters from the two Kangxi Radical and ten CJK
            Compatibility Ideographs Supplement Unicode blocks are considered
            valid.
            <br />
            Do contact me at thisisdefinitelynotanemail@gmail.com if you find a
            Unicode block that I missed.
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <img src="/不.png" width={"200rem"} />
          </Box>
        </Paper>
      </Container>
    </>
  );
}

export default InvalidHanziPage;
