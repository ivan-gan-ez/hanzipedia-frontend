import axios from "axios";
import { API_URL } from "./constants";

export const uploadImage = async (image, token) => {
  // create new form data
  const formData = new FormData();
  formData.append("image", image);
  const response = await axios.post(API_URL + "image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
};
