import { useState } from "react";
import { Box, Paper, Container, Typography } from "@mui/material";

function AboutPage() {
  return (
    <>
      <Container maxWidth="lg" sx={{ py: 5, minHeight: "72vh" }}>
        <Paper elevation={2} sx={{ py: 3, px: 6, pb: 8 }}>
          <Box sx={{ my: 3, mb: 5 }}>
            <Typography textAlign="center" variant="h4" fontWeight="600">
              About / 关于
            </Typography>
          </Box>
          <Typography>
            Hanzipedia is a wiki about Chinese characters.
          </Typography>

          <Typography variant="h5" sx={{ my: 2 }}>
            Main pages
          </Typography>
          <Box>
            These are the pages that you can only access via the navbar above.
            Unlike the other pages, they aren't about singular hanzi.
            <ul className="aboutlist">
              <li>A homepage</li>
              <li>A rules page</li>
              <li>
                A page containing information about the website (this one!)
              </li>
              <li>
                A page containing a list of all existing pages that you can
                search through
              </li>
            </ul>
          </Box>

          <Typography variant="h5" sx={{ my: 2 }}>
            Page structure
          </Typography>
          <Box>
            The hanzi pages contain the following:
            <ul className="aboutlist">
              <li>The hanzi itself</li>
              <li>An image of the hanzi- more on that below!</li>
              <li>
                Pinyin (Note: The numbers 1, 2, 3 and 4 are used instead of
                diacritics for tones because they're more keyboard-accessible.)
              </li>
              <li>Radicals and components</li>
              <li>Meanings</li>
            </ul>
          </Box>

          <Typography variant="h5" sx={{ my: 2 }}>
            Images
          </Typography>
          <Box>
            Every hanzi here has an image where you can insert a character
            design for every hanzi.
            <br />
            I, the owner of this website, have pre-made about eighty or so (and
            will add more), but you can help contribute by adding your own!
            <br />
            Of course, don't replace other people's art without their
            permission.
            <br />
            <br />
            If a hanzi does not have an image, it will simply show up as regular
            text.
          </Box>

          <Typography variant="h5" sx={{ my: 2 }}>
            User roles
          </Typography>
          <Box>
            There are three roles on this website.
            <ul className="aboutlist">
              <li>Users can view, search for and edit pages.</li>
              <li>Admins can manage (create, update and delete) users.</li>
              <li>
                The owner (me) oversees everything and can promote users to
                admins.
              </li>
            </ul>
            A logged-out user would only be able to view and search for pages.
            No editing.
          </Box>
        </Paper>
      </Container>
    </>
  );
}

export default AboutPage;
