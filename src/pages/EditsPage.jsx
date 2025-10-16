// this page shows all the edits made on a particular page
import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Button,
} from "@mui/material";

import { Link, useParams, useNavigate } from "react-router";
import { getPage } from "../utils/api_page";
import { useCookies } from "react-cookie";
import { isUser } from "../utils/functions";
import { getEdits } from "../utils/api_edit";

function EditsPage() {
  const navigate = useNavigate();

  const [cookies, setCookie, removeCookie] = useCookies(["currentuser"]);
  const { currentuser = {} } = cookies;
  const { token = "" } = currentuser;

  useEffect(() => {
    if (!isUser(currentuser)) {
      navigate("/unauthorised");
    }
  }, []);

  const { id } = useParams();
  const [hanzi, setHanzi] = useState({});
  const [edits, setEdits] = useState([]);

  useEffect(() => {
    getPage(id)
      .then((data) => {
        if (data === "invalid") {
          navigate("/h/invalid");
        } else if (!data) {
          navigate("/notfound");
        } else {
          setHanzi(data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  useEffect(() => {
    getEdits(hanzi._id, "", token)
      .then((data) => {
        setEdits(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [hanzi]);

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 5, minHeight: "72vh" }}>
        <Paper elevation={2} sx={{ py: 6, px: 6 }}>
          <Box
            sx={{
              mb: 5,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography
                variant="h4"
                fontWeight="400"
                display="inline"
                sx={{ mr: 1 }}
              >
                Edit log of{" "}
              </Typography>
              <Typography variant="h2" fontWeight="600" display="inline">
                {hanzi._id}
              </Typography>
            </Box>
            <Box>
              <Button
                variant="outlined"
                color="blue"
                sx={{ px: 2, py: 1, mb: 2, mr: 2 }}
                onClick={() => navigate("/h/" + hanzi._id)}
              >
                Back
              </Button>
            </Box>
          </Box>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Time</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Page</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {edits && edits.length !== 0 ? (
                  edits.map((edit) => (
                    <TableRow
                      key={edit._id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {edit.time}
                      </TableCell>
                      <TableCell>
                        {edit.user ? (
                          <Typography
                            component={Link}
                            to={"/u/view/" + edit.user._id}
                            color="blue.main"
                          >
                            {edit.user.name}
                          </Typography>
                        ) : (
                          <i style={{ color: "#aaa" }}>deleted user</i>
                        )}
                      </TableCell>
                      <TableCell>{edit.page}</TableCell>
                      <TableCell>
                        {edit.desc ? (
                          <span>{edit.desc}</span>
                        ) : (
                          <i style={{ color: "#aaa" }}>
                            No description provided.
                          </i>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <span sx={{ p: 3 }}>No edits... yet</span>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </>
  );
}

export default EditsPage;
