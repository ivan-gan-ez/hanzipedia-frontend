// this page is for editing users

// this page is a userpage

import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Container,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { API_URL } from "../utils/constants";

import { Link, useParams, useNavigate } from "react-router";
import { getUserById, updateUser, deleteUser } from "../utils/api_user";
import { useCookies } from "react-cookie";
import { isUser, isAdmin, isOwner } from "../utils/functions";
import Swal from "sweetalert2";
import { uploadImage } from "../utils/api_image";

function UserPageEdit() {
  const navigate = useNavigate();

  const [cookies, setCookie, removeCookie] = useCookies(["currentuser"]);
  const { currentuser = {} } = cookies;
  const { token = "" } = currentuser;

  const [user, setUser] = useState({});

  const [name, setName] = useState("");
  const [role, setRole] = useState("user");
  const [numberOfEdits, setNumberOfEdits] = useState(0);
  const [pfp, setPfp] = useState(null);

  const { id } = useParams();

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  useEffect(() => {
    getUserById(id, token)
      .then((data) => {
        setUser(data);
        setName(data.name);
        setNumberOfEdits(data.numberOfEdits);
        setRole(data.role);
        setPfp(data.pfp);
      })
      .catch((error) => {
        console.log(error);
        navigate("/unauthorised");
      });
  }, [id, token]);

  if (!isUser(currentuser)) {
    navigate("/unauthorised");
  } else if (
    (!isAdmin(currentuser) && user._id !== currentuser._id) ||
    (isAdmin(currentuser) &&
      !isOwner(currentuser) &&
      (user.role === "admin" || user.role === "owner"))
  ) {
    navigate("/unauthorised");
  }

  if (!user) {
    navigate("/u/notfound");
  }

  const hasChange = () => {
    return name !== user.name || role !== user.role || pfp !== user.pfp;
  };

  const handleClose = () => {
    if (hasChange()) {
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
            navigate("/u/view/" + user._id);
          } catch (error) {
            console.log(error);
            toast.error(error.response.data.error);
          }
        }
      });
    } else {
      navigate("/u/view/" + user._id);
    }
  };

  const handleSubmit = () => {
    if (!name || !role) {
      toast.error("Name and role fields must not be empty.");
    } else {
      try {
        updateUser(id, name, role, numberOfEdits, pfp, token);
        if (currentuser._id === id) {
          navigate("/u/view/" + id);
        } else {
          navigate("/u/");
        }
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.error);
      }
    }
  };

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0d6fd7",
      cancelButtonColor: "#d70d0d",
      confirmButtonText: "OK",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          deleteUser(id, token);
          if (currentuser._id === id) {
            navigate("/logout");
          } else {
            navigate("/u/");
          }
        } catch (error) {
          console.log(error);
          toast.error(error.response.data.error);
        }
      }
    });
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 5, minHeight: "72vh" }}>
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
                  alignItems: "end",
                }}
              >
                <Typography variant="h4" fontWeight="400" display="inline">
                  Editing
                </Typography>
                <Typography
                  variant="h3"
                  fontWeight="500"
                  display="inline"
                  sx={{ ml: 2 }}
                >
                  {user.name}
                </Typography>
              </Box>
              <Box>
                <Button
                  variant="contained"
                  sx={{ px: 2, py: 1, mb: 2, mr: 2 }}
                  color="red"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  sx={{ px: 2, py: 1, mb: 2 }}
                  color="blue"
                  onClick={handleSubmit}
                >
                  Save
                </Button>
              </Box>
            </Box>

            {/*Information table */}
            <Typography sx={{ mb: 1 }}>Information</Typography>
            <TableContainer component={Paper} elevation={2} sx={{ mb: 5 }}>
              <Table aria-label="simple table">
                <TableBody>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>
                      <TextField
                        id="outlined-basic"
                        label="Name"
                        variant="outlined"
                        type="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Email</TableCell>
                    <TableCell>{user.email}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>Role</TableCell>
                    <TableCell>
                      {isOwner(currentuser) && user.role !== "owner" ? (
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            Role
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={role}
                            label="Role"
                            onChange={(e) => setRole(e.target.value)}
                          >
                            <MenuItem value={"user"}>user</MenuItem>
                            <MenuItem value={"admin"}>admin</MenuItem>
                          </Select>
                        </FormControl>
                      ) : (
                        <span>{user.role}</span>
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Number of edits</TableCell>
                    <TableCell>{user.numberOfEdits}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Profile Picture</TableCell>
                    <TableCell sx={{ display: "flex", alignItems: "center" }}>
                      <Box display="inline">
                        {pfp ? (
                          <img src={API_URL + pfp} className="user_pfp" />
                        ) : (
                          <img
                            src="/placeholder_pfp.png"
                            className="user_pfp"
                          />
                        )}
                      </Box>
                      <Box>
                        {pfp ? (
                          <Button
                            color="red"
                            variant="contained"
                            onClick={() => setPfp(null)}
                            sx={{ ml: 2 }}
                          >
                            Remove image
                          </Button>
                        ) : (
                          <Button
                            component="label"
                            role={undefined}
                            variant="contained"
                            tabIndex={-1}
                            sx={{ ml: 2 }}
                          >
                            Upload file
                            <VisuallyHiddenInput
                              type="file"
                              onChange={async (event) => {
                                const data = await uploadImage(
                                  event.target.files[0],
                                  token
                                );
                                // { image_url: "uploads/image.png" }
                                setPfp(data.image_url);
                              }}
                              accept="image/*"
                            />
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            {!(isOwner(currentuser) && role === "owner") ? (
              <Button
                fullWidth
                variant="contained"
                color="red"
                sx={{ mt: 4, p: 2 }}
                onClick={handleDelete}
              >
                Delete Account
              </Button>
            ) : null}
          </>
        </Paper>
      </Container>
    </>
  );
}

export default UserPageEdit;
