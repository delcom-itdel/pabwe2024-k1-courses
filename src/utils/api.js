const api = (() => {
  const BASE_URL = "https://public-api.delcom.org/api/v1";
  async function _fetchWithAuth(url, options = {}) {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
  }

  function putAccessToken(token) {
    localStorage.setItem("accessToken", token);
  }

  function getAccessToken() {
    return localStorage.getItem("accessToken");
  }

  // API Auth => https://public-api.delcom.org/docs/1.0/api-auth
  async function postAuthRegister({ name, email, password }) {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const responseJson = await response.json();
    const { success, message } = responseJson;

    if (success !== true) {
      throw new Error(message);
    }

    return message;
  }

  async function postAuthLogin({ email, password }) {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const responseJson = await response.json();
    const { success, message } = responseJson;
    if (success !== true) {
      throw new Error(message);
    }
    const {
      data: { token },
    } = responseJson;

    return token;
  }

  async function getMe() {
    const response = await _fetchWithAuth(`${BASE_URL}/users/me`);
    const responseJson = await response.json();
    const { success, message } = responseJson;

    if (success !== true) {
      throw new Error(message);
    }
    const {
      data: { user },
    } = responseJson;

    return user;
  }

  async function getAllUsers() {
    const response = await _fetchWithAuth(`${BASE_URL}/users`);
    const responseJson = await response.json();
    const { success, message } = responseJson;

    if (success !== true) {
      throw new Error(message);
    }

    const {
      data: { users },
    } = responseJson;

    return users;
  }

  async function postChangePhotoProfile({ photoFile }) {
    const formData = new FormData();
    formData.append("photo", photoFile);
    const response = await _fetchWithAuth(`${BASE_URL}/users/photo`, {
      method: "POST",
      body: formData,
    });
    const responseJson = await response.json();
    const { success, message } = responseJson;
    if (success !== true) {
      throw new Error(message);
    }
    return message;
  }

  async function postAddCourse(formData) {
    const response = await _fetchWithAuth(`${BASE_URL}/courses`, {
      method: "POST",
      body: formData,
    });

    const responseJson = await response.json();
    const { success, message } = responseJson;
    if (success !== true) {
      throw new Error(message);
    }

    const {
      data: { course_id },
    } = responseJson;

    return course_id;
  }

  async function postChangeCoverCourse({ id, cover }) {
    const formData = new FormData();
    formData.append("cover", cover);

    const response = await _fetchWithAuth(`${BASE_URL}/courses/${id}/cover`, {
      method: "POST",
      body: formData,
    });

    const responseJson = await response.json();
    const { success, message } = responseJson;
    if (success !== true) {
      throw new Error(message);
    }

    return message;
  }

  async function putUpdateCourse({ id, title, description }) {
    console.log("Updating todo:", { id, title, description });

    const response = await _fetchWithAuth(`${BASE_URL}/courses/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
      }),
    });

    const responseJson = await response.json();
    console.log("API response:", responseJson);

    const { success, message } = responseJson;
    if (success !== true) {
      throw new Error(message);
    }

    return message;
  }

  async function getAllCourses() {
    const response = await _fetchWithAuth(`${BASE_URL}/courses`);

    const responseJson = await response.json();
    const { success, message } = responseJson;
    if (success !== true) {
      throw new Error(message);
    }

    const {
      data: { courses },
    } = responseJson;

    return courses;
  }

  async function getDetailCourse(id) {
    const response = await _fetchWithAuth(`${BASE_URL}/courses/${id}`);

    const responseJson = await response.json();
    const { success, message } = responseJson;
    if (success !== true) {
      throw new Error(message);
    }

    const {
      data: { course },
    } = responseJson;

    return course;
  }

  async function deleteCourse(id) {
    const response = await _fetchWithAuth(`${BASE_URL}/courses/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseJson = await response.json();
    const { success, message } = responseJson;
    if (success !== true) {
      throw new Error(message);
    }

    return message;
  }

  async function postAddStudent({ id }) {
    const response = await _fetchWithAuth(
      `${BASE_URL}/courses/${id}/students`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const responseJson = await response.json();
    const { success, message } = responseJson;
    if (success !== true) {
      throw new Error(message);
    }

    return message;
  }

  async function deleteStudent(id) {
    const response = await _fetchWithAuth(
      `${BASE_URL}/courses/${id}/students`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const responseJson = await response.json();
    const { success, message } = responseJson;
    if (success !== true) {
      throw new Error(message);
    }

    return message;
  }

  async function putChangeStudentRatings({ id, ratings, comment }) {
    const response = await _fetchWithAuth(
      `${BASE_URL}/courses/${id}/students/ratings`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ratings,
          comment,
        }),
      }
    );

    const responseJson = await response.json();
    const { success, message } = responseJson;
    if (success !== true) {
      throw new Error(message);
    }

    return message;
  }

  async function postAddContent({ id, title, youtube }) {
    const response = await _fetchWithAuth(
      `${BASE_URL}/courses/${id}/contents`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          youtube,
        }),
      }
    );

    const responseJson = await response.json();
    const { success, message } = responseJson;
    if (success !== true) {
      throw new Error(message);
    }
    const {
      data: { content_id },
    } = responseJson;

    return content_id;
  }

  async function putUpdateContent({ id, title, youtube }) {
    const response = await _fetchWithAuth(`${BASE_URL}/courses/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        youtube,
      }),
    });

    const responseJson = await response.json();
    const { success, message } = responseJson;
    if (success !== true) {
      throw new Error(message);
    }

    return message;
  }

  async function getDetailContent(id) {
    const response = await _fetchWithAuth(
      `${BASE_URL}/courses/-/contents/${id}`
    );

    const responseJson = await response.json();
    const { success, message } = responseJson;
    if (success !== true) {
      throw new Error(message);
    }

    const {
      data: { content },
    } = responseJson;

    return content;
  }

  async function deleteContent(id) {
    const response = await _fetchWithAuth(
      `${BASE_URL}/courses/-/contents/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const responseJson = await response.json();
    const { success, message } = responseJson;
    if (success !== true) {
      throw new Error(message);
    }

    return message;
  }

  async function postChangeContentStatus({ id, status }) {
    const response = await _fetchWithAuth(
      `${BASE_URL}/courses/-/contents/${id}/learns`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
        }),
      }
    );

    const responseJson = await response.json();
    const { success, message } = responseJson;
    if (success !== true) {
      throw new Error(message);
    }

    return message;
  }

  return {
    putAccessToken,
    getAccessToken,
    postAuthRegister,
    postAuthLogin,
    getMe,
    getAllUsers,
    postChangePhotoProfile,
    postAddCourse,
    postChangeCoverCourse,
    putUpdateCourse,
    getAllCourses,
    getDetailCourse,
    deleteCourse,
    postAddStudent,
    deleteStudent,
    putChangeStudentRatings,
    postAddContent,
    putUpdateContent,
    getDetailContent,
    deleteContent,
    postChangeContentStatus,
  };
})();

export default api;
