import axios from "axios";

import { API_URL } from "./constants";

import { isHanzi } from "./functions";

export async function getMeaningOfHanzi(hanzi) {
  if (!isHanzi(hanzi) || Array.from(hanzi).length !== 1) {
    console.log("invalid");
    return "invalid";
  } else {
    const response = await axios.get(API_URL + "meanings/" + hanzi);
    return response.data;
  }
}

export async function getMeaningById(id) {
  const response = await axios.get(API_URL + "meanings/" + id, {});
  return response.data;
}

export async function addMeaning(
  character,
  pinyin,
  type,
  meaning,
  exampleSentences,
  token
) {
  const response = await axios.post(
    API_URL + "meanings",
    {
      character,
      pinyin,
      type,
      meaning,
      exampleSentences,
    },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response.data;
}

export async function editMeaning(
  id,
  character,
  pinyin,
  type,
  meaning,
  exampleSentences,
  token
) {
  const response = await axios.put(
    API_URL + "meanings/" + id,
    {
      character,
      pinyin,
      type,
      meaning,
      exampleSentences,
    },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response.data;
}

export async function deleteMeaningsOfHanzi(id, token) {
  const response = await axios.delete(API_URL + "meanings/" + id, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
}

export async function deleteMeaningById(id, token) {
  const response = await axios.delete(API_URL + "meanings/" + id, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
}
