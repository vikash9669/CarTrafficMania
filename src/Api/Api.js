import axios from "axios";

const apiUrl = "https://e5d2-122-168-138-164.ngrok-free.app/";
const guestSignInApi = async (data) => {
  console.log("guest api hit", data, apiUrl);
  const response = await axios
    .post(`${apiUrl}api/guest/guestid`, data)
    .then((res) => {
      console.log("response", res);
      return res.data;
    })
    .catch((err) => {
      throw new Error(err);
    });
  return response;
};
const emailSignInApi = async (data) => {
  console.log("email api hit", data, apiUrl);
  const response = await axios
    .post(`${apiUrl}api/auth/register`, data)
    .then((res) => {
      console.log("response", res);
      return res.data;
    })
    .catch((err) => {
      console.log("error", err);
      throw new Error(err);
    });
  return response;
};
const deleteGuestAccountApi = async (data) => {
  console.log("delete api hit", data, apiUrl);
  const response = await axios
    .delete(`${apiUrl}api/guest/deleteByGuestId/${data.guestId}`)
    .then((res) => {
      console.log("response", res);
      return res.data;
    })
    .catch((err) => {
      console.log("err", err);

      throw new Error(err);
    });
  return response;
};
const deleteEmailAccountApi = async (data) => {
  console.log("delete email api hit", data, apiUrl);
  const response = await axios
    .delete(`${apiUrl}api/auth/delete${data.guestId}`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw new Error(err);
    });
  return response;
};
const gameOverApi = async (data) => {
  console.log(" game over api hit", data, apiUrl);
  const response = await axios
    .post(`${apiUrl}api/scores`, data)
    .then((res) => {
      console.log("response", res);
      return res.data;
    })
    .catch((err) => {
      throw new Error(err);
    });
  console.log("/////////////////////////////", response);
  return response;
};
const updateGuestUserNameApi = async (data) => {
  console.log("updateGuestUserNameApi api hit", data, apiUrl);
  const response = await axios
    .put(`${apiUrl}api/guest/guest/edit`, data)
    .then((res) => {
      console.log("response", res);
      return res.data;
    })
    .catch((err) => {
      console.log("error", err);
      throw new Error(err);
    });
  return response;
};

export {
  guestSignInApi,
  emailSignInApi,
  deleteEmailAccountApi,
  deleteGuestAccountApi,
  gameOverApi,
  updateGuestUserNameApi,
};
