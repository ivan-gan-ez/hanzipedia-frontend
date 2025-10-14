import axios from "axios";

import { API_URL } from "./constants";

export async function userSignup(name, email, password) {
  const response = await axios.post(API_URL + "users/signup", {
    name,
    email,
    password,
  });
  return response.data;
}

export async function userLogin(email, password) {
  const response = await axios.post(API_URL + "users/login", {
    email,
    password,
  });
  return response.data;
}

export async function getUsers(token) {
  const response = await axios.get(API_URL + "users", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
}

export async function getUserById(id, token) {
  const response = await axios.get(API_URL + "users/" + id, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
}

export async function addUser(name, email, password, token) {
  const response = await axios.post(
    API_URL + "users/",
    {
      name,
      email,
      password,
    },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response.data;
}

export async function updateUser(id, name, role, numberOfEdits, pfp, token) {
  console.log(numberOfEdits);

  const response = await axios.put(
    API_URL + "users/" + id,
    {
      name,
      role,
      numberOfEdits,
      pfp,
    },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response.data;
}

export async function deleteUser(id, token) {
  const response = await axios.delete(API_URL + "users/" + id, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
}
