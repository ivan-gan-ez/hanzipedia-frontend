// this page is for adding users

import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Container,
  Typography,
  Button,
  TextField,
} from "@mui/material";

import { Link, useParams, useNavigate } from "react-router";
import { addUser } from "../utils/api_user";
import validator from "email-validator";
import { useCookies } from "react-cookie";
import { isAdmin } from "../utils/functions";
import { toast } from "sonner";

function UserPageAdd() {
  const navigate = useNavigate();

  const [cookies, setCookie, removeCookie] = useCookies(["currentuser"]);
  const { currentuser = {} } = cookies;
  const { token = "" } = currentuser;

  useEffect(() => {
    if (!isAdmin(currentuser)) {
      navigate("/unauthorised");
    }
  }, []);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");

  const handleSubmit = async () => {
    if (!name || !email || !password || !confPassword) {
      toast.error("Please fill up all the fields.");
    } else if (!validator.validate(email)) {
      toast.error("Please use a valid email address.");
    } else if (password !== confPassword) {
      toast.error("Your passwords do not match.");
    } else {
      const response = await addUser(name, email, password, token);
      navigate("/u/view/" + response._id);
    }
  };

  return (
    <>
      <Container maxWidth="md" sx={{ py: 5, minHeight: "72vh" }}>
        <Paper elevation={2} sx={{ py: 6, px: 6 }}>
          <>
            <Box
              sx={{
                mb: 5,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h4"
                  fontWeight="500"
                  display="inline"
                  sx={{ ml: 2 }}
                >
                  Add User / 添加用户
                </Typography>
              </Box>
            </Box>

            <Box>
              {/*Information table */}
              <TextField
                id="outlined-basic"
                label="Name"
                variant="outlined"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                id="outlined-basic"
                label="Email"
                variant="outlined"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                id="outlined-basic"
                label="Password"
                variant="outlined"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                id="outlined-basic"
                label="Confirm password"
                variant="outlined"
                type="password"
                value={confPassword}
                onChange={(e) => setConfPassword(e.target.value)}
                fullWidth
                sx={{ mb: 4 }}
              />
            </Box>

            <Button
              variant="contained"
              color="blue"
              fullWidth
              onClick={handleSubmit}
            >
              Add
            </Button>
          </>
        </Paper>
      </Container>
    </>
  );
}

export default UserPageAdd;
