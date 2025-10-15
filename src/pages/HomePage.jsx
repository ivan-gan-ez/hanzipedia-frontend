import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
} from "@mui/material";
import { Link } from "react-router";

import { useCookies } from "react-cookie";
import { isAdmin, isHanzi } from "../utils/functions";
import { getPages, getPage, featurePage } from "../utils/api_page";
import { toast } from "sonner";

function HomePage() {
  const [featured, setFeatured] = useState("");
  const [pages, setPages] = useState([]);
  const [change, setChange] = useState(0);

  const [cookies, setCookie, removeCookie] = useCookies(["currentuser"]);
  const { currentuser = {} } = cookies;
  const { token = "" } = currentuser;

  useEffect(() => {
    getPages("all", "", "updated", 1, true).then((data) => {
      setPages(data);
    });
  }, [change]);

  const handleFeature = () => {
    if (!featured) {
      toast.error("Featured field must not be empty.");
    } else if (!isHanzi(featured)) {
      toast.error("Featured field must consist of exactly one hanzi.");
    } else {
      getPage(featured).then((data) => {
        if (!data) {
          toast.error("Page does not exist yet.");
        } else {
          featurePage(featured, true, token);
          setChange(change + 1);
          setFeatured("");
        }
      });
    }
  };

  const handleRemove = (hanzi) => {
    featurePage(hanzi, false, token);
    setChange(change + 1);
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 5, minHeight: "72vh" }}>
        <Paper elevation={2} sx={{ py: 3, px: 6 }}>
          <Box sx={{ my: 3, mb: 5 }}>
            <Typography textAlign="center" variant="h4" fontWeight="600">
              Welcome! / 欢迎!
            </Typography>
          </Box>
          <Typography textAlign="center" fontWeight="400" sx={{ mb: 5 }}>
            汉字百科 (Hanzipedia) is a wiki for searching up (and adding)
            information about Chinese characters, also known as hanzi.
            <br />
            Learn what they're made of and their various meanings, with every
            character accompanied by an illustration (some samples below)!
            <br /> <br />
            Go to the <Link to="/about">About</Link> page to learn more!
          </Typography>
          <Paper elevation={2} sx={{ my: 3, p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography textAlign="start" variant="h5" fontWeight="600">
                Featured Hanzi
              </Typography>

              {isAdmin(currentuser) ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    value={featured}
                    onChange={(e) => setFeatured(e.target.value)}
                    sx={{ mr: 2 }}
                  ></TextField>
                  <Button
                    variant="contained"
                    color="blue"
                    onClick={handleFeature}
                  >
                    Feature
                  </Button>
                </Box>
              ) : (
                ""
              )}
            </Box>
            <Grid container spacing={3}>
              {pages && pages.length !== 0 ? (
                pages.map((page) => (
                  <Grid key={page._id} size={{ xs: 6, sm: 4, md: 3 }}>
                    <Card
                      sx={{ border: "2px solid", borderColor: "white.dark" }}
                    >
                      <CardContent>
                        <Typography
                          variant="h3"
                          component="div"
                          textAlign="center"
                        >
                          {page._id}
                        </Typography>
                      </CardContent>
                      <CardActions
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <Button
                          size="small"
                          color="blue"
                          component={Link}
                          to={"/h/" + page._id}
                        >
                          View
                        </Button>
                        {isAdmin(currentuser) && (
                          <Button
                            size="small"
                            color="red"
                            onClick={() => handleRemove(page._id)}
                          >
                            Remove
                          </Button>
                        )}
                      </CardActions>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Typography>No featured hanzi yet...</Typography>
              )}
            </Grid>
          </Paper>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 5,
            }}
          >
            <img src="/快.png" width={"25%"} />
            <Typography variant="h6" textAlign="center">
              Happy browsing!
            </Typography>
            <img src="/乐.png" width={"25%"} />
          </Box>
        </Paper>
      </Container>
    </>
  );
}

export default HomePage;
