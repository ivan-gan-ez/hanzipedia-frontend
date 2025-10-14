// this page shows all the users

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
} from "@mui/material";

import { API_URL } from "../utils/constants";

import { Link, useParams, useNavigate } from "react-router";
import { getUsers } from "../utils/api_user";
import { useCookies } from "react-cookie";
import { isUser, isAdmin, isOwner } from "../utils/functions";

function UserboardPage() {
  const navigate = useNavigate();

  const [cookies, setCookie, removeCookie] = useCookies(["currentuser"]);
  const { currentuser = {} } = cookies;
  const { token = "" } = currentuser;

  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers(token)
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.log(error);
        navigate("/unauthorised");
      });
  }, [token]);

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 5, minHeight: "72vh" }}>
        <Paper elevation={2} sx={{ py: 6, px: 6 }}>
          {users ? (
            <>
              <Box
                sx={{
                  mb: 5,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography variant="h3" fontWeight="600" display="inline">
                    All Users / 全部用户
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="end">
                  <Button
                    variant="contained"
                    sx={{ px: 2, py: 1, mb: 2 }}
                    component={Link}
                    to={"/u/add"}
                  >
                    Add User
                  </Button>
                </Box>
              </Box>

              {/*Users */}
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell align="right">Number of edits</TableCell>
                      <TableCell align="right"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users
                      ? users.map((user) => (
                          <TableRow
                            key={user._id}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              <Typography fontSize="0.8em">
                                {user._id}
                              </Typography>
                            </TableCell>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell align="right">
                              {user.numberOfEdits}
                            </TableCell>
                            <TableCell align="right" size="small">
                              <Box
                                display={{ sm: "flex", lg: "inline" }}
                                flexDirection="column"
                              >
                                <Button
                                  variant="outlined"
                                  color="blue"
                                  component={Link}
                                  to={"/u/view/" + user._id}
                                >
                                  View
                                </Button>
                                {!isAdmin(user) ||
                                (isAdmin(user) &&
                                  !isOwner(user) &&
                                  currentuser.role === "owner") ? (
                                  <Button
                                    variant="contained"
                                    color="blue"
                                    component={Link}
                                    to={"/u/edit/" + user._id}
                                    sx={{
                                      ml: { sm: 0, lg: 1.5 },
                                      mt: { sm: 1, lg: 0 },
                                    }}
                                  >
                                    Edit
                                  </Button>
                                ) : (
                                  ""
                                )}
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))
                      : ""}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          ) : (
            <Grid container spacing={2}>
              <Grid size={{ sm: 12, md: 8 }}>
                <Box
                  sx={{
                    mb: 5,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography variant="h3" fontWeight="600" display="inline">
                      All Users / 全部用户
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="end">
                    <Button
                      variant="contained"
                      sx={{ px: 2, py: 1, mb: 2 }}
                      component={Link}
                      to={"/u/add/"}
                    >
                      Add User
                    </Button>
                  </Box>
                </Box>
                <Typography>No users yet... </Typography>
              </Grid>

              <Grid
                size={{ sm: 12, md: 4 }}
                display="flex"
                justifyContent="end"
              >
                <Box>
                  <Box
                    bgcolor="#ddd"
                    border="3px solid"
                    borderColor="#888"
                    borderRadius="10px"
                    width="15rem"
                    height="15rem"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Typography
                      variant="h1"
                      fontSize="8rem"
                      fontWeight="800"
                      textAlign="center"
                    >
                      {id}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          )}
        </Paper>
      </Container>
    </>
  );
}

export default UserboardPage;
