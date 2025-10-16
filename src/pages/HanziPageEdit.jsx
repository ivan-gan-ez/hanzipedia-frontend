// this page is for adding and editing hanzi pages
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
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import Swal from "sweetalert2";
import { API_URL } from "../utils/constants";

import { Link, useParams, useNavigate } from "react-router";
import { getPage, addPage, editPage, deletePage } from "../utils/api_page";
import { uploadImage } from "../utils/api_image";
import { deleteMeaningsOfHanzi, getMeaningOfHanzi } from "../utils/api_meaning";
import { isHanzi } from "../utils/functions";
import { toast } from "sonner";
import { isUser } from "../utils/functions";
import { useCookies } from "react-cookie";
import { addEdit } from "../utils/api_edit";
import { getUserById, updateUser } from "../utils/api_user";

function HanziPageEdit() {
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
  const [meanings, setMeanings] = useState([]);
  const [pageExists, setPageExists] = useState(false);
  const [user, setUser] = useState({});

  const [editDesc, setEditDesc] = useState("");

  const [pinyin, setPinyin] = useState("");
  const [radical, setRadical] = useState("");
  const [components, setComponents] = useState([]);
  const [trad, setTrad] = useState("");
  const [image, setImage] = useState(null);

  const [errors, setErrors] = useState("");

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

  const isHanziList = (list) => {
    if (
      list.toString().match(/[^\p{Ideographic}\u2f00-\u2fd5\u2e80-\u2fd5,]/gu)
    ) {
      return false;
    } else {
      return true;
    }
  };

  const isHanziListWithSpaces = (list) => {
    if (
      list.toString().match(/[^\p{Ideographic}\u2f00-\u2fd5\u2e80-\u2fd5, ]/gu)
    ) {
      return false;
    } else {
      return true;
    }
  };

  useEffect(() => {
    getPage(id)
      .then((data) => {
        if (data === "invalid") {
          navigate("/h/invalid");
        } else {
          setHanzi(data);
          setPinyin(data.pinyin);
          setRadical(data.radical);
          setComponents(data.parts);
          setTrad(data.traditional);
          setImage(data.image);
          if (data !== "") {
            setPageExists(true);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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

  useEffect(() => {
    getUserById(currentuser._id, token)
      .then((data) => {
        setUser(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const hasChange = () => {
    return (
      pinyin !== hanzi.pinyin ||
      radical !== hanzi.radical ||
      components !== hanzi.parts ||
      trad !== hanzi.traditional ||
      image !== hanzi.image
    );
  };

  const handleEditSave = (route) => {
    if (!pinyin || !radical || !components || !trad) {
      toast.error("Please do not leave any fields empty.");
    } else if (!isHanzi(radical) || Array.from(radical).length !== 1) {
      toast.error("The Radical field must consist of exactly one hanzi.");
    } else if (!isHanziList(components)) {
      toast.error(
        "The Components field must consist of only hanzi and commas."
      );
    } else if (!isHanziListWithSpaces(trad)) {
      toast.error(
        "The Traditional field must consist of hanzi, commas and spaces."
      );
    } else {
      try {
        if (pageExists) {
          if (hasChange()) {
            editPage(
              hanzi._id,
              pinyin,
              radical,
              trad,
              components.toString().split(","),
              image,
              token
            );
            addEdit(currentuser._id, hanzi._id, editDesc, token);
          }
        } else {
          addPage(
            id,
            pinyin,
            radical,
            trad,
            components.toString().split(","),
            image,
            token
          );
          addEdit(currentuser._id, id, editDesc, token);
        }

        if (hasChange()) {
          updateUser(
            user._id,
            user.name,
            user.role,
            user.numberOfEdits + 1,
            user.pfp,
            token
          );
        }
        setEditDesc("");
        navigate(route);
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.error);
      }
    }
  };

  const confirmMeaningRedir = (route) => {
    if (hasChange()) {
      Swal.fire({
        title: "Warning",
        text: "Redirecting you to the definition editing page will autosave your current changes. Do you want to proceed?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#0d6fd7",
        cancelButtonColor: "#d70d0d",
        confirmButtonText: "OK",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            handleEditSave(route);
          } catch (error) {
            console.log(error);
            toast.error(error.response.data.error);
          }
        }
      });
    } else {
      navigate(route);
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
          addEdit(currentuser._id, id, "Deleted " + id, token);
          deleteMeaningsOfHanzi(id, token);
          deletePage(id, token);
          navigate("/");
        } catch (error) {
          console.log(error);
          toast.error(error.response.data.error);
        }
      }
    });
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
            navigate(pageExists ? "/h/" + hanzi._id : "/h/" + id);
          } catch (error) {
            console.log(error);
            toast.error(error.response.data.error);
          }
        }
      });
    } else {
      navigate(pageExists ? "/h/" + hanzi._id : "/h/" + id);
    }
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 5, minHeight: "72vh" }}>
        <Paper elevation={2} sx={{ py: 6, px: 6 }}>
          {
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
                        variant="h4"
                        fontWeight="400"
                        display="inline"
                        sx={{ mr: 1 }}
                      >
                        Editing
                      </Typography>
                      <Typography
                        variant="h2"
                        fontWeight="600"
                        display="inline"
                      >
                        {hanzi._id ? hanzi._id : id}
                      </Typography>
                    </Box>
                    <Box>
                      <Button
                        variant="contained"
                        color="red"
                        sx={{ px: 2, py: 1, mb: 2, mr: 2 }}
                        onClick={handleClose}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        color="blue"
                        sx={{ px: 2, py: 1, mb: 2 }}
                        onClick={() => {
                          handleEditSave(
                            pageExists ? "/h/" + hanzi._id : "/h/" + id
                          );
                        }}
                      >
                        Save
                      </Button>
                    </Box>
                  </Box>

                  <Box sx={{ my: 2 }}>
                    <TextField
                      id="outlined-basic"
                      label="Description"
                      variant="outlined"
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      fullWidth
                    />
                    <Typography
                      variant="caption"
                      display="block"
                      sx={{ mt: 0.5 }}
                    >
                      Enter a short description of the edit.
                    </Typography>
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
                          <TableCell>
                            <TextField
                              id="outlined-basic"
                              label="Pinyin"
                              variant="outlined"
                              value={pinyin}
                              onChange={(e) => setPinyin(e.target.value)}
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Radical</TableCell>
                          <TableCell>
                            <TextField
                              id="outlined-basic"
                              label="Radical"
                              variant="outlined"
                              value={radical}
                              onChange={(e) => setRadical(e.target.value)}
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Components</TableCell>
                          <TableCell>
                            <TextField
                              id="outlined-basic"
                              label="Components"
                              variant="outlined"
                              value={components}
                              onChange={(e) => setComponents(e.target.value)}
                            />
                            <Typography
                              variant="caption"
                              display="block"
                              sx={{ mt: 0.5 }}
                            >
                              Enter a set of characters separated by commas and
                              nothing else.
                            </Typography>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Traditional</TableCell>
                          <TableCell>
                            <TextField
                              id="outlined-basic"
                              label="Outlined"
                              variant="outlined"
                              value={trad}
                              onChange={(e) => setTrad(e.target.value)}
                            />
                            <Typography
                              variant="caption"
                              display="block"
                              sx={{ mt: 0.5 }}
                            >
                              Enter a set of characters separated by commas with
                              spaces and nothing else.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                {/*this part just has the image and the edit button */}
                <Grid
                  size={{ sm: 12, md: 4 }}
                  display="flex"
                  justifyContent="end"
                >
                  <Box>
                    {image ? (
                      <>
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
                          <img src={API_URL + image} className="hanzi_image" />
                        </Box>
                        <Button
                          color="red"
                          variant="contained"
                          onClick={() => setImage(null)}
                          sx={{ mt: 1.5 }}
                        >
                          Remove image
                        </Button>
                      </>
                    ) : (
                      <>
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
                        ></Box>
                        <Button
                          component="label"
                          role={undefined}
                          variant="contained"
                          tabIndex={-1}
                          sx={{ mt: 1.5 }}
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
                              setImage(data.image_url);
                            }}
                            accept="image/*"
                          />
                        </Button>
                      </>
                    )}
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
                      <TableCell>
                        {pinyin && radical && components && trad ? (
                          <Button
                            variant="contained"
                            color="blue"
                            onClick={() => {
                              confirmMeaningRedir(
                                pageExists
                                  ? "/m/add/" + hanzi._id
                                  : "/m/add/" + id
                              );
                            }}
                          >
                            Add
                          </Button>
                        ) : (
                          ""
                        )}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {meanings.length !== 0 ? (
                      meanings.map((meaning, index) => (
                        <TableRow
                          key={meaning._id}
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
                              <span sx={{ display: "block" }} key={sentence}>
                                {sentence}
                              </span>
                            ))}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              color="blue"
                              onClick={() => {
                                confirmMeaningRedir("/m/edit/" + meaning._id);
                              }}
                            >
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5}>
                          {pinyin && radical && components && trad ? (
                            <span sx={{ p: 3 }}>
                              No definitions added yet...
                            </span>
                          ) : (
                            <span sx={{ p: 3 }}>
                              You must fill in all the fields above before you
                              can add definitions.
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          }
          {pageExists ? (
            <Button
              fullWidth
              variant="contained"
              color="red"
              sx={{ mt: 4, p: 2 }}
              onClick={handleDelete}
            >
              Clear All Information
            </Button>
          ) : (
            ""
          )}
        </Paper>
      </Container>
    </>
  );
}

export default HanziPageEdit;
