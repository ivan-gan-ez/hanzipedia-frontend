import { useState } from "react";
import { Box, Paper, Container, Typography } from "@mui/material";
import { red } from "@mui/material/colors";

function RulesPage() {
  return (
    <>
      <Container maxWidth="lg" sx={{ py: 5, minHeight: "72vh" }}>
        <Paper elevation={2} sx={{ p: 3 }}>
          <Box sx={{ my: 3 }}>
            <Typography textAlign="center" variant="h4" fontWeight="600">
              Rules / 规则
            </Typography>
          </Box>
          <ol className="ruleslist">
            <li>
              Vandalism is <em>strictly prohibited.</em> This includes:
              <ul>
                <li>intentionally adding false information to pages.</li>
                <li>
                  using the pages as a way to communicate hate speech, promote
                  any unethical beliefs or send violent threats.
                </li>
                <li>
                  filling up the pages with junk and irrelevant information.
                </li>
                <li>
                  replacing images or text with stuff deemed inappropriate.
                </li>
              </ul>
            </li>
            <li>
              Admins should use their powers wisely.
              <ul>
                <li>
                  If you spot any cases of admin abuse, send an email to{" "}
                  <span
                    style={{
                      wordWrap: "break-word",
                      color: "#0d6fd7",
                      fontWeight: 600,
                    }}
                  >
                    thisisdefinitelynotanemail@gmail.com.
                  </span>
                </li>
              </ul>
            </li>
            <li>
              Preferrably, keep the formatting of every page the same. If you're
              new to this wiki and want to contribute, I recommend checking out
              a few pages to get an idea as to how the layout works.
            </li>
          </ol>
          <Box sx={{ mt: 2 }}>
            Failure to abide by the above rules may result in your account
            getting{" "}
            <span style={{ color: "#d70d0d", fontWeight: 600 }}>deleted</span>.
          </Box>
        </Paper>
      </Container>
    </>
  );
}

export default RulesPage;
