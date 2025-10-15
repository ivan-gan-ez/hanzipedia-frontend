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
import Swal from "sweetalert2";

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

  const handleClose = () => {
    if (name || email || password || confPassword) {
      Swal.fire({
        title: "Are you sure?",
        text: "Your changes will not be saved!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#0d6fd7",
        cancelButtonColor: "#d70d0d",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          try {
            navigate("/u/");
          } catch (error) {
            console.log(error);
            toast.error(error.response.data.error);
          }
        }
      });
    } else {
      navigate("/u/");
    }
  };

  const handleSubmit = async () => {
    if (!name || !email || !password || !confPassword) {
      toast.error("Please fill up all the fields.");
    } else if (!validator.validate(email)) {
      toast.error("Please use a valid email address.");
    } else if (password !== confPassword) {
      toast.error("Your passwords do not match.");
    } else {
      const response = await addUser(name, email, password, token);
      toast.success("User successfully added!");
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
                  Add User
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

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                color="red"
                fullWidth
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="blue"
                fullWidth
                onClick={handleSubmit}
              >
                Add
              </Button>
            </Box>
          </>
        </Paper>
      </Container>
    </>
  );
}

export default UserPageAdd;
