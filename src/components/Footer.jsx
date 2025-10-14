import { Box, Button, Container, Typography } from "@mui/material";

function Footer() {
  return (
    <Box
      sx={{
        justifyContent: "space-between",
        p: 4,
        width: "100%",
      }}
      bgcolor="blue.light"
    >
      <Typography textAlign="center" color="blue.dark">
        &copy; IvynOregano 2025. All rights reserved.
      </Typography>
      <Typography textAlign="center" color="blue.dark" sx={{ pt: 1 }}>
        This website was made possible with assistance from the Awesome Book
        Club
      </Typography>
      <Box textAlign="center" sx={{ pt: 2 }}>
        <img src="/awesome book club logo.png" width={"300rem"} />
      </Box>
    </Box>
  );
}

export default Footer;
