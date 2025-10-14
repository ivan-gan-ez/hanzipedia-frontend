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
import { getPage } from "../utils/api_page";
import { getMeaningOfHanzi } from "../utils/api_meaning";
import { useCookies } from "react-cookie";
import { isUser } from "../utils/functions";

function HanziPage() {
  const navigate = useNavigate();

  const [cookies, setCookie, removeCookie] = useCookies(["currentuser"]);
  const { currentuser } = cookies;

  const { id } = useParams();
  const [hanzi, setHanzi] = useState({});
  const [meanings, setMeanings] = useState([]);

  useEffect(() => {
    getPage(id)
      .then((data) => {
        if (data === "invalid") {
          navigate("/h/invalid");
        } else {
          setHanzi(data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  useEffect(() => {
    getMeaningOfHanzi(id)
      .then((data) => {
        if (data === "invalid") {
          navigate("/h/invalid");
        } else {
          setMeanings(data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 5, minHeight: "72vh" }}>
        <Paper elevation={2} sx={{ py: 6, px: 6 }}>
          {hanzi ? (
            <>
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
                      <Typography
                        variant="h2"
                        fontWeight="600"
                        display="inline"
                      >
                        {hanzi._id}
                      </Typography>
                      <Typography
                        variant="h3"
                        fontWeight="400"
                        display="inline"
                        sx={{ ml: 3 }}
                      >
                        {hanzi.pinyin}
                      </Typography>
                    </Box>
                    <Box>
                      {isUser(currentuser) ? (
                        <Box
                          display="flex"
                          flexDirection={{ sm: "column", md: "row" }}
                        >
                          <Button
                            variant="outlined"
                            sx={{ px: 2, py: 1, mb: 2 }}
                            component={Link}
                            to={"/h/edits/" + id}
                          >
                            View Edits
                          </Button>
                          <Button
                            variant="contained"
                            sx={{ px: 2, py: 1, mb: 2, ml: 2 }}
                            component={Link}
                            to={"/h/edit/" + id}
                          >
                            Edit Page
                          </Button>
                        </Box>
                      ) : (
                        ""
                      )}
                    </Box>
                  </Box>

                  {/*Information table */}
                  <Typography sx={{ mb: 1 }}>Information</Typography>
                  <TableContainer
                    component={Paper}
                    elevation={2}
                    sx={{ mb: 5 }}
                  >
                    <Table aria-label="simple table">
                      <TableBody>
                        <TableRow>
                          <TableCell>Pinyin</TableCell>
                          <TableCell>{hanzi.pinyin}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Radical</TableCell>
                          <TableCell>
                            {hanzi.radical !== hanzi.id ? (
                              <a
                                href={"/h/" + hanzi.radical}
                                style={{
                                  color: "#0d6fd7",
                                  fontWeight: "700",
                                }}
                              >
                                {hanzi.radical}
                              </a>
                            ) : (
                              hanzi.radical
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Components</TableCell>
                          <TableCell>
                            {hanzi.parts
                              ? hanzi.parts.map((part) => (
                                  <Typography
                                    key={part}
                                    display="inline"
                                    sx={{ pr: 1 }}
                                  >
                                    {part === hanzi._id ? (
                                      part
                                    ) : part === hanzi.radical ? (
                                      part === hanzi._id ? (
                                        <span style={{ fontWeight: "700" }}>
                                          {part}
                                        </span>
                                      ) : (
                                        <a
                                          href={"/h/" + part}
                                          style={{
                                            color: "#0d6fd7",
                                            fontWeight: "700",
                                          }}
                                        >
                                          {part}
                                        </a>
                                      )
                                    ) : (
                                      <a
                                        href={"/h/" + part}
                                        style={{ color: "#0d6fd7" }}
                                      >
                                        {part}
                                      </a>
                                    )}
                                  </Typography>
                                ))
                              : ""}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Traditional</TableCell>
                          <TableCell>{hanzi.traditional}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                {/*this part just has the image*/}
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
                      {hanzi.image ? (
                        <img
                          src={API_URL + hanzi.image}
                          className="hanzi_image"
                        />
                      ) : (
                        <Typography
                          variant="h1"
                          fontSize="8rem"
                          fontWeight="800"
                          textAlign="center"
                        >
                          {hanzi._id}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              {/*Defintions */}
              <Typography sx={{ mb: 1 }}>Definitions</Typography>
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
                    {meanings && meanings.length !== 0 ? (
                      meanings.map((meaning) => (
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
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5}>
                          <span sx={{ p: 3 }}>No definitions added yet...</span>
                        </TableCell>
                      </TableRow>
                    )}
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
                  <Typography variant="h2" fontWeight="600" display="inline">
                    {id}
                  </Typography>
                  <Typography
                    variant="h3"
                    fontWeight="400"
                    display="inline"
                    sx={{ ml: 3 }}
                  ></Typography>
                  <Box display="flex" justifyContent="end">
                    {isUser(currentuser) ? (
                      <Button
                        variant="contained"
                        sx={{ px: 2, py: 1, mb: 2 }}
                        component={Link}
                        to={"/h/edit/" + id}
                      >
                        Edit Page
                      </Button>
                    ) : (
                      ""
                    )}
                  </Box>
                </Box>
                <Typography>
                  This page doesn't have any information yet...
                </Typography>
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

export default HanziPage;
