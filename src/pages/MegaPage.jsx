import { useState, useEffect } from "react";
import {
  Button,
  Box,
  Paper,
  Container,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Link, useNavigate } from "react-router";
import { getPages } from "../utils/api_page";
import { isHanzi } from "../utils/functions";
import { toast } from "sonner";

function MegaPage() {
  const navigate = useNavigate();

  const [pages, setPages] = useState([]);
  const [radicals, setRadicals] = useState([]);
  const [radical, setRadical] = useState("all");
  const [pinyin, setPinyin] = useState("");
  const [sort, setSort] = useState("none");

  const [search, setSearch] = useState("");

  useEffect(() => {
    getPages(radical, pinyin, sort).then((data) => {
      setPages(data);
    });
  }, [radical, pinyin, sort]);

  useEffect(() => {
    getPages(radical, pinyin, sort).then((data) => {
      setRadicals([...new Set(data.map((list) => list.radical))].sort());
    });
  }, []);

  const handleSearch = () => {
    if (!search) {
      toast.error("Search input must not be empty.");
    } else if (!isHanzi(search) || Array.from(search).length !== 1) {
      toast.error("Search input can only consist of one hanzi.");
    } else {
      navigate("/h/" + search);
      setSearch("");
    }
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 5, minHeight: "72vh" }}>
        <Paper elevation={2} sx={{ py: 3, px: 6 }}>
          <Box sx={{ my: 3, mb: 5 }}>
            <Typography textAlign="center" variant="h4" fontWeight="600">
              All Hanzi / 全部汉字
            </Typography>
          </Box>
          <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between" }}>
            <Box display="flex" flexDirection={{ xs: "column", md: "row" }}>
              <FormControl sx={{ width: "10rem", mr: 3 }} display="inline">
                <InputLabel id="demo-simple-select-label">Radical</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={radical}
                  label="Radical"
                  onChange={(e) => setRadical(e.target.value)}
                >
                  <MenuItem value={"all"}>All</MenuItem>
                  {radicals
                    ? radicals.map((radical) => (
                        <MenuItem value={radical}>{radical}</MenuItem>
                      ))
                    : ""}
                </Select>
              </FormControl>

              <TextField
                sx={{ width: "10rem", mr: 3, mt: { xs: 2, md: 0 } }}
                label="Pinyin"
                value={pinyin}
                onChange={(e) => setPinyin(e.target.value)}
              ></TextField>

              <FormControl
                sx={{ width: "10rem", mt: { xs: 2, md: 0 } }}
                display="inline"
              >
                <InputLabel id="demo-simple-select-label">Sort</InputLabel>
                <Select
                  labelId="demo-simple-select5abel"
                  id="demo-simple-select"
                  value={sort}
                  label="Radical"
                  onChange={(e) => setSort(e.target.value)}
                >
                  <MenuItem value={"none"}>No Sort</MenuItem>
                  <MenuItem value={"alphabetical"}>Pinyin</MenuItem>
                  <MenuItem value={"updated"}>Last Updated</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
              }}
            >
              <TextField
                id="outlined-basic"
                label="Search"
                variant="outlined"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ mx: 2 }}
              />
              <Button variant="contained" size="medium" onClick={handleSearch}>
                Search / 搜索
              </Button>
            </Box>
          </Box>

          <Grid container spacing={2}>
            {pages && pages.length !== 0 ? (
              pages.map((page) => (
                <Grid
                  key={page._id}
                  size={{ xs: 6, sm: 4, md: 2 }}
                  sx={{ my: 1 }}
                >
                  <Typography
                    sx={{ fontSize: "1.25rem" }}
                    component={Link}
                    to={"/h/" + page._id}
                  >
                    {page._id + " [" + page.pinyin + "]"}
                  </Typography>
                </Grid>
              ))
            ) : (
              <Typography variant="h6" textAlign="center">
                No hanzi yet...
              </Typography>
            )}
          </Grid>
        </Paper>
      </Container>
    </>
  );
}

export default MegaPage;
