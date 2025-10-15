import {
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { useState } from "react";
import validator from "email-validator";
import { userLogin } from "../utils/api_user";
import { toast } from "sonner";
import { useCookies } from "react-cookie";
import { useNavigate, Link } from "react-router";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies(["currentuser"]);

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        toast.error("Please fill in all fields.");
      } else if (!validator.validate(email)) {
        toast.error("Please use a valid email address.");
      } else {
        const response = await userLogin(email, password);
        setCookie("currentuser", response, { maxAge: 60 * 60 * 8 });
        toast.success("Login successful!");
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <Container sx={{ p: 6 }}>
        <Container maxWidth="sm" sx={{ mt: 2 }}>
          <Paper sx={{ p: 5, mb: 15 }}>
            <Typography
              textAlign="center"
              variant="h4"
              fontWeight="600"
              sx={{ mt: 2, mb: 4 }}
            >
              Log In / 登录
            </Typography>
            <TextField
              id="outlined-basic"
              label="Email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              id="outlined-basic"
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                color="red"
                fullWidth
                component={Link}
                to="/"
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="blue"
                fullWidth
                onClick={handleLogin}
              >
                Log In / 登录
              </Button>
            </Box>

            <Typography color="blue" textAlign="center" sx={{ mt: 2 }}>
              <Link to="/signup">Don't have an account? Sign up instead</Link>
            </Typography>
          </Paper>
        </Container>
      </Container>
    </>
  );
};

export default LoginPage;
