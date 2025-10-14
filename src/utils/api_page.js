import axios from "axios";

import { API_URL } from "./constants";

import { isHanzi } from "./functions";

export async function getPages(
  radical,
  pinyin,
  sort,
  page = 1,
  featured = false
) {
  const response = await axios.get(
    API_URL +
      "pages?page=" +
      page +
      (radical === "all" ? "" : "&radical=" + radical) +
      (pinyin === "" ? "" : "&pinyin=" + pinyin) +
      (sort === "none" ? "" : "&sort=" + sort) +
      (featured ? "&featured=true" : "")
  );
  return response.data;
}

export async function getPage(hanzi) {
  if (!isHanzi(hanzi) || Array.from(hanzi).length !== 1) {
    console.log("invalid");
    return "invalid";
  } else {
    const response = await axios.get(API_URL + "pages/" + hanzi);
    return response.data;
  }
}

export async function addPage(
  hanzi,
  pinyin,
  radical,
  traditional,
  parts,
  image,
  token
) {
  const response = await axios.post(
    API_URL + "pages",
    {
      hanzi,
      pinyin,
      radical,
      traditional,
      parts,
      image,
    },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response.data;
}

export async function editPage(
  hanzi,
  pinyin,
  radical,
  traditional,
  parts,
  image,
  token
) {
  const response = await axios.put(
    API_URL + "pages/" + hanzi,
    {
      hanzi,
      pinyin,
      radical,
      traditional,
      parts,
      image,
    },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response.data;
}

export async function deletePage(id, token) {
  const response = await axios.delete(API_URL + "pages/" + id, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
}

export async function featurePage(hanzi, featured, token) {
  const response = await axios.put(
    API_URL + "pages/feature/" + hanzi,
    {
      featured,
    },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response.data;
}
