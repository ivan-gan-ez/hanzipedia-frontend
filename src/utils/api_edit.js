import axios from "axios";

import { API_URL } from "./constants";

export async function getEdits(page, user, token) {
  const response = await axios.get(
    API_URL +
      "edits/" +
      (page ? "?page=" + page : "") +
      (user ? (page ? "&user=" + user : "?user=" + user) : ""),
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response.data;
}

export async function addEdit(user, page, desc = "", token) {
  const response = await axios.post(
    API_URL + "edits",
    {
      user,
      page,
      desc,
    },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response.data;
}
