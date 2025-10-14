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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  TextareaAutosize,
} from "@mui/material";

import Swal from "sweetalert2";

import { Link, useParams, useNavigate } from "react-router";
import { getPage } from "../utils/api_page";
import {
  deleteMeaningById,
  editMeaning,
  getMeaningById,
} from "../utils/api_meaning";
import { toast } from "sonner";
import { useCookies } from "react-cookie";
import { isUser } from "../utils/functions";
import { updateUser, getUserById } from "../utils/api_user";
import { addEdit } from "../utils/api_edit";

function MeaningPageEdit() {
  const navigate = useNavigate();

  const [cookies, setCookie, removeCookie] = useCookies(["currentuser"]);
  const { currentuser = {} } = cookies;
  const { token = "" } = currentuser;

  if (!isUser(currentuser)) {
    navigate("/unauthorised");
  }

  const { id } = useParams();
  const [hanzi, setHanzi] = useState({});
  const [meaning, setMeaning] = useState([]);
  const [user, setUser] = useState({});

  const [pinyins, setPinyins] = useState([]);

  const [pinyin, setPinyin] = useState("");
  const [type, setType] = useState("");
  const [definition, setDefinition] = useState("");
  const [exampleSentences, setExampleSentences] = useState("");

  useEffect(() => {
    getMeaningById(id, token)
      .then((data) => {
        if (data === "") {
          navigate("/notfound");
        } else {
          setMeaning(data);
          setPinyin(data.pinyin);
          setType(data.type);
          setDefinition(data.meaning);
          setExampleSentences(data.exampleSentences.join("||"));
          // get character using data.character
          getPage(data.character).then((data) => {
            if (data === "invalid") {
              navigate("/h/invalid");
            } else {
              setHanzi(data);
              setPinyins(data.pinyin.split(", "));
            }
          });
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

  const handleClose = (id) => {
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
          navigate("/h/edit/" + meaning.character);
        } catch (error) {
          console.log(error);
          toast.error(error.response.data.error);
        }
      }
    });
  };

  const handleMeaningSave = () => {
    if (!pinyin || !type || !definition) {
      toast.error("Please do not leave any fields empty.");
    } else {
      try {
        editMeaning(
          id,
          meaning.character,
          pinyin,
          type,
          definition,
          exampleSentences.toString().split("||"),
          token
        );
        addEdit(
          currentuser._id,
          hanzi._id,
          "Edited a definition of " + hanzi._id,
          token
        );
        console.log(user.numberOfEdits);
        updateUser(
          currentuser._id,
          currentuser.name,
          currentuser.role,
          user.numberOfEdits + 1,
          currentuser.pfp,
          token
        );
        navigate("/h/edit/" + meaning.character);
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
          deleteMeaningById(id, token);
          addEdit(
            currentuser._id,
            hanzi._id,
            "Deleted a definition of " + hanzi._id,
            token
          );
          updateUser(
            currentuser._id,
            currentuser.name,
            currentuser.role,
            user.numberOfEdits + 1,
            currentuser.pfp,
            token
          );
          navigate("/h/edit/" + hanzi._id);
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
          <TableContainer component={Paper}>
            <Box sx={{ mb: 5 }}>
              <Typography
                variant="h4"
                fontWeight="400"
                display="inline"
                sx={{ mr: 1 }}
              >
                Editing definition for
              </Typography>
              <Typography variant="h2" fontWeight="600" display="inline">
                {meaning.character}
              </Typography>
            </Box>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Pinyin</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Defintion</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow
                  key={meaning}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell component="th" scope="row">
                    <FormControl
                      sx={{ width: "10rem", mr: 3 }}
                      display="inline"
                    >
                      <InputLabel id="demo-simple-select-label">
                        Pinyin
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={pinyin}
                        label="Pinyin"
                        onChange={(e) => setPinyin(e.target.value)}
                      >
                        {pinyins
                          ? pinyins.map((p) => (
                              <MenuItem value={p}>{p}</MenuItem>
                            ))
                          : ""}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Type
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={type}
                        label="Type"
                        onChange={(e) => setType(e.target.value)}
                      >
                        <MenuItem value={"noun"}>Noun</MenuItem>
                        <MenuItem value={"verb"}>Verb</MenuItem>
                        <MenuItem value={"adjective"}>Adjective</MenuItem>
                        <MenuItem value={"other"}>Other</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <TextField
                      id="outlined-basic"
                      label="Definition"
                      variant="outlined"
                      value={definition}
                      onChange={(e) => setDefinition(e.target.value)}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Typography sx={{ mt: 3, mb: 1 }} variant="h6">
            Example Sentences
          </Typography>
          <Typography variant="caption">
            Enter example sentences in the format "chinese / english" and
            separate them with a "||", like this: "chinese1 / english1||chinese2
            / english2||chinese3 / english3"
          </Typography>
          <TextareaAutosize
            aria-label="minimum height"
            minRows={5}
            placeholder="Example sentences"
            style={{ width: "100%" }}
            value={exampleSentences}
            onChange={(e) => setExampleSentences(e.target.value)}
          />

          <Box display="flex" justifyContent="end">
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
              onClick={handleMeaningSave}
            >
              Save
            </Button>
          </Box>

          <Button
            fullWidth
            variant="contained"
            color="red"
            sx={{ mt: 4, p: 2 }}
            onClick={handleDelete}
          >
            Delete Definition
          </Button>
        </Paper>
      </Container>
    </>
  );
}

export default MeaningPageEdit;
