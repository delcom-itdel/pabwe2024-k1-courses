import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { courseItemShape } from "./CourseItem";
import { postedAt } from "../utils/tools";
import {
  FaClock,
  FaPenToSquare,
  FaUpload,
  FaStar,
  FaTrash,
} from "react-icons/fa6";
import api from "../utils/api";
import { useDispatch } from "react-redux";
import {
  asyncDetailCourse,
  asyncAddContent,
  asyncDeleteContent,
  asyncUpdateContent,
} from "../states/courses/action";
import { useParams } from "react-router-dom";

function CourseDetail({ course }) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(course?.title || "");
  const [editedDescription, setEditedDescription] = useState(course?.description || "");

  const [previewCover, setPreviewCover] = useState(course?.cover || null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("contents");
  const fileInputRef = useRef(null);

  const [showAddContentForm, setShowAddContentForm] = useState(false); // State to show/hide content form
  const [newContentTitle, setNewContentTitle] = useState(""); // State for new content title
  const [newContentYoutube, setNewContentYoutube] = useState("");
 
 
  const [editingContentId, setEditingContentId] = useState(null);
  const [editedContentTitle, setEditedContentTitle] = useState(""); // Edit form state
  const [editedContentYoutube, setEditedContentYoutube] = useState("");

  
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [newComment, setNewComment] = useState(""); // State for new comment input
  const [comments, setComments] = useState(course?.comments || []); // State to manage comments
  const { getAllUsers } = api;

  const getYouTubeID = (url) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|watch)\S*[\?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const matches = url.match(regex);
    return matches && matches[1] ? matches[1] : null;
  };

  useEffect(() => {
    if (id) {
      dispatch(asyncDetailCourse(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    // Function to fetch and filter students
    const fetchStudents = async () => {
      try {
        const allUsers = await getAllUsers(); // Use the imported async function
        console.log("sucess");
        // Assume `course.students` contains the list of enrolled student IDs
        const matchedStudents = allUsers.filter((user) =>
          course.students.includes(user.id)
        );
        setEnrolledStudents(matchedStudents);
      } catch (error) {
        console.error("Failed to fetch users:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    if (course) {
      setEditedTitle(course.title);
      setEditedDescription(course.description);
      setPreviewCover(course.cover);
      setComments(course.comments || []);
    }
  }, [course]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setPreviewCover(previewURL);
      handleCoverUpload(file);
    }
  };

  const handleCoverUpload = async (file) => {
    setIsUploading(true);
    try {
      const message = await api.postChangeCoverCourse({
        id: course.id,
        cover: file,
      });
      console.log("Cover updated:", message);
      dispatch(asyncDetailCourse(course.id));
    } catch (error) {
      console.error("Failed to upload cover:", error.message);
    }
    setIsUploading(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleSaveChanges = async () => {
    if (editedTitle.trim() === "" || editedDescription.trim() === "") {
      return;
    }

    // onEditCourse(course.id, editedTitle, editedDescription);
    await api.putUpdateCourse({
      id: course.id,
      title: editedTitle,
      description: editedDescription,
    });
    setIsEditing(false);
    dispatch(asyncDetailCourse(course.id));
  };

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleAddComment = async () => {
    if (newComment.trim() === "") return;

    try {
      const updatedComments = await api.postAddComment({
        id: course.id,
        comment: newComment,
      });

      setComments(updatedComments); // Update comments state with the new list
      setNewComment(""); // Clear the input field
      dispatch(asyncDetailCourse(course.id)); // Refresh course data to get the updated comments
    } catch (error) {
      console.error("Failed to add comment:", error.message);
    }
  };

  const handleAddContent = async () => {
    if (newContentTitle.trim() === "" || newContentYoutube.trim() === "")
      return;

    try {
      dispatch(
        asyncAddContent({
          id: course.id,
          title: newContentTitle,
          youtube: newContentYoutube,
        })
      );

      setNewContentTitle(""); // Clear the input fields after submission
      setNewContentYoutube("");
      setShowAddContentForm(false); // Hide the form after content is added
      dispatch(asyncDetailCourse(course.id)); // Refresh the course details to show new content
    } catch (error) {
      console.error("Failed to add content:", error.message);
    }
  };

  const handleEditContent = (content) => {
    setEditingContentId(content.id);
    setEditedContentTitle(content.title);
    setEditedContentYoutube(content.youtube);
  };

  const handleSaveContentEdit = async () => {
    if (editedContentTitle.trim() === "" || editedContentYoutube.trim() === "")
      return;

    try {
      dispatch(
        asyncUpdateContent({
          id: editingContentId,
          title: editedContentTitle,
          youtube: editedContentYoutube,
        })
      );
      setEditingContentId(null); // Exit edit mode after saving
      dispatch(asyncDetailCourse(course.id)); // Refresh the course details
    } catch (error) {
      console.log("kadkdskds")
      console.error("Failed to update content:", error.message);
    }
  };
  
  const handleDeleteContent = async (contentId) => {
    try {
      dispatch(asyncDeleteContent(contentId)); // Call the delete action
      dispatch(asyncDetailCourse(course.id)); // Refresh the course details
    } catch (error) {
      console.error("Failed to delete content:", error.message);
    }
  };

  const enrolledStudentsCount = course.students ? course.students.length : 0;

  return (
    <div className="card mt-3">
      <div className="card-body">
        {/* Cover Image */}
        <div
          style={{
            width: "300px",
            height: "300px",
            position: "relative",
            backgroundColor: "#f0f0f1",
            marginBottom: "5px",
            overflow: "hidden",
          }}
        >
          {previewCover ? (
            <img
              src={previewCover}
              alt="Cover"
              style={{
                borderRadius: "5px",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                position: "absolute",
                top: "0",
                left: "0",
              }}
            />
          ) : (
            <p>No cover image</p>
          )}
        </div>

        {/* Course Title and Description */}
        <div className="row align-items-center">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              {/* Display the title, average rating, and enrolled students count */}
              <h5 className="mb-0">
                {course.title}{" "}
                {course.avg_ratings && (
                  <span className="text-warning">
                    <FaStar /> {course.avg_ratings}
                  </span>
                )}
                <span className="text-muted">
                  {" | "}
                  {enrolledStudentsCount} students enrolled
                </span>
              </h5>
              <div>
                <button
                  className="btn btn-outline-primary me-2"
                  onClick={handleUploadClick}
                >
                  <FaUpload /> {isUploading ? "Uploading..." : "Update Cover"}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="d-none"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  onClick={() => setIsEditing((prevState) => !prevState)}
                  className="btn btn-sm btn-outline-warning"
                >
                  <FaPenToSquare /> {isEditing ? "Cancel Edit" : "Edit"}
                </button>
              </div>
            </div>

            <div className="col-12">
              <div className="text-sm op-5">
                <FaClock />
                <span className="ps-2">{postedAt(course.created_at)}</span>
              </div>
            </div>

            <hr />

            <div className="col-12 mt-3">
              {isEditing ? (
                <div>
                  <div className="mb-3">
                    <label htmlFor="editTitle" className="form-label">
                      Edit Title
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="editTitle"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editDescription" className="form-label">
                      Edit Description
                    </label>
                    <textarea
                      className="form-control"
                      id="editDescription"
                      rows="3"
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                    />
                  </div>

                  <div className="d-flex justify-content-end">
                    <button
                      className="btn btn-primary"
                      onClick={handleSaveChanges}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div>{course.description}</div>
              )}
            </div>
          </div>
        </div>

        {/* Separator between description and tabs */}
        <hr className="mt-4" />

        {/* Tabs */}
        <ul className="nav nav-tabs mt-4">
          <li className="nav-item">
            <a
              className={`nav-link ${activeTab === "contents" ? "active" : ""}`}
              onClick={() => handleTabChange("contents")}
            >
              Contents
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link ${activeTab === "students" ? "active" : ""}`}
              onClick={() => handleTabChange("students")}
            >
              Students
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link ${activeTab === "comments" ? "active" : ""}`}
              onClick={() => handleTabChange("comments")}
            >
              Comments
            </a>
          </li>
        </ul>

        {/* Tab Content */}
        <div className="tab-content mt-3">
          {activeTab === "contents" && (
            <div>
              <div className="d-flex justify-content-between mb-3">
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => setShowAddContentForm((prev) => !prev)}
                >
                  {showAddContentForm ? "Cancel" : "Add Content"}
                </button>
              </div>

              {/* Add Content Form */}
              {showAddContentForm && (
                <div className="mb-4">
                  <div className="mb-3">
                    <label htmlFor="newContentTitle" className="form-label">
                      Content Title
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="newContentTitle"
                      value={newContentTitle}
                      onChange={(e) => setNewContentTitle(e.target.value)} // Corrected to setNewContentTitle
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="newContentYoutube" className="form-label">
                      YouTube Link
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="newContentYoutube"
                      value={newContentYoutube}
                      onChange={(e) => setNewContentYoutube(e.target.value)}
                    />
                  </div>

                  <div className="d-flex justify-content-end">
                    <button
                      className="btn btn-secondary me-2"
                      onClick={() => setShowAddContentForm(false)} // Cancel button action
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={handleAddContent}
                    >
                      Submit Content
                    </button>
                  </div>
                </div>
              )}

              {course.contents.map((content) => (
                <div key={content.id} className="card mb-3">
                  <div className="card-body">
                    {editingContentId === content.id ? (
                      <div>
                        <input
                          type="text"
                          className="form-control mb-2"
                          value={editedContentTitle}
                          onChange={(e) =>
                            setEditedContentTitle(e.target.value)
                          }
                        />
                        <input
                          type="text"
                          className="form-control mb-2"
                          value={editedContentYoutube}
                          onChange={(e) =>
                            setEditedContentYoutube(e.target.value)
                          }
                        />
                        <div className="d-flex justify-content-end">
                          <button
                            className="btn btn-primary me-2"
                            onClick={handleSaveContentEdit}
                          >
                            Save
                          </button>
                          <button
                            className="btn btn-secondary"
                            onClick={() => setEditingContentId(null)} // Reset edit mode
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h5 className="card-title">{content.title}</h5>
                        {content.youtube && (
                          <iframe
                            title={content.title}
                            src={`https://www.youtube.com/embed/${getYouTubeID(
                              content.youtube
                            )}`}
                            width="100%"
                            height="315"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        )}
                        <div className="d-flex justify-content-end">
                          <button
                            className="btn btn-sm btn-warning me-2"
                            onClick={() => handleEditContent(content)}
                          >
                            <FaPenToSquare /> Edit
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeleteContent(content.id)}
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "students" && (
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Students</h5>
                {loading ? (
                  <p>Loading...</p>
                ) : enrolledStudents.length > 0 ? (
                  <ul>
                    {enrolledStudents.map((student, index) => (
                      <li key={index}>
                        {student.name} (ID: {student.id})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No students enrolled yet.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === "comments" && (
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Comments</h5>

                {course.ratings.length > 0 ? (
                  course.ratings.map((rating, index) => (
                    <div
                      key={index}
                      className="comment mb-3 p-3 rounded border"
                      style={{ backgroundColor: "#f9f9f9" }}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <strong>{rating.name}</strong>
                        <div className="text-warning">
                          {[...Array(rating.ratings)].map((_, i) => (
                            <FaStar key={i} />
                          ))}
                        </div>
                      </div>
                      <p className="card-text mt-2 mb-0">{rating.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">No comments yet.</p>
                )}

                {/* Comment input box */}
                <div className="mb-3">
                  <label htmlFor="commentInput" className="form-label">
                    Add a Comment
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="commentInput"
                    placeholder="Write your comment here..."
                    value={newComment}
                    onChange={handleCommentChange}
                  />
                </div>

                <button className="btn btn-primary" onClick={handleAddComment}>
                  Submit Comment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

CourseDetail.propTypes = {
  course: PropTypes.shape(courseItemShape).isRequired,
  onEditCourse: PropTypes.func.isRequired,
  onAddContent: PropTypes.func.isRequired,
};

export default CourseDetail;