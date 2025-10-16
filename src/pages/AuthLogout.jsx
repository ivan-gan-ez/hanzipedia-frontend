import { Button, Container, Paper, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";

const LogoutPage = () => {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["currentuser"]);

  useEffect(() => {
    removeCookie("currentuser");
    toast.success("Logout successful!");
    window.location.href = "/";
  }, [cookies]);

  return (
    <>
      <Container sx={{ p: 6 }}>
        <Container maxWidth="md" sx={{ mt: 2 }}>
          <Paper
            sx={{
              p: 5,
              height: "60vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              textAlign="center"
              variant="h3"
              fontWeight="600"
              sx={{ mt: 2, mb: 4 }}
            >
              Logging out...
            </Typography>
          </Paper>
        </Container>
      </Container>
    </>
  );
};

export default LogoutPage;
