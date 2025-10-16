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
} from "@mui/material";

import { Link, useParams, useNavigate } from "react-router";
import { getUserById } from "../utils/api_user";
import { useCookies } from "react-cookie";
import { isUser, isAdmin, isOwner } from "../utils/functions";

import { API_URL } from "../utils/constants";

function UserPage() {
  const navigate = useNavigate();

  const [cookies, setCookie, removeCookie] = useCookies(["currentuser"]);
  const { currentuser = {} } = cookies;
  const { token = "" } = currentuser;

  const [user, setUser] = useState({});

  const { id } = useParams();

  useEffect(() => {
    getUserById(id, token)
      .then((data) => {
        if (!data) {
          navigate("/u/notfound");
        } else {
          setUser(data);
        }
      })
      .catch((error) => {
        console.log(error);
        navigate("/unauthorised");
      });
  }, [id, token]);

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
                  alignItems: "center",
                }}
              >
                <Box display="inline">
                  {user.pfp ? (
                    <img src={API_URL + user.pfp} className="user_pfp" />
                  ) : (
                    <img src="/placeholder_pfp.png" className="user_pfp" />
                  )}
                </Box>
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
                  variant="outlined"
                  sx={{ px: 2, py: 1, mb: 2 }}
                  component={Link}
                  to={"/u/edits/" + id}
                  size="small"
                >
                  View Edits
                </Button>
                {currentuser ? (
                  (isAdmin(currentuser) &&
                    user.role !== "admin" &&
                    user.role !== "owner") ||
                  user._id === currentuser._id ||
                  isOwner(currentuser) ? (
                    <Button
                      variant="contained"
                      sx={{ px: 2, py: 1, mb: 2, ml: 2 }}
                      component={Link}
                      to={"/u/edit/" + id}
                      size="small"
                    >
                      Edit User
                    </Button>
                  ) : (
                    ""
                  )
                ) : null}
              </Box>
            </Box>

            {/*Information table */}
            <Typography sx={{ mb: 1 }}>Information</Typography>
            <TableContainer component={Paper} elevation={2} sx={{ mb: 5 }}>
              <Table aria-label="simple table">
                <TableBody>
                  <TableRow>
                    <TableCell>Email</TableCell>
                    <TableCell>{user.email}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Role</TableCell>
                    <TableCell>{user.role}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Number of edits</TableCell>
                    <TableCell>{user.numberOfEdits}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            {/*Edits */}
            {/* <Typography sx={{ mb: 1 }}>Definitions</Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Pinyin</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Defintion</TableCell>
                    <TableCell>Example sentences</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {meanings
                    ? meanings.map((meaning) => (
                        <TableRow
                          key={meaning}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {meaning.pinyin}
                          </TableCell>
                          <TableCell>{meaning.type}</TableCell>
                          <TableCell>{meaning.meaning}</TableCell>
                          <TableCell>
                            {meaning.exampleSentences.map((sentence) => (
                              <Typography key={sentence}>{sentence}</Typography>
                            ))}
                          </TableCell>
                        </TableRow>
                      ))
                    : ""}
                </TableBody>
              </Table>
            </TableContainer> */}
          </>
        </Paper>
      </Container>
    </>
  );
}

export default UserPage;
