import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { courseItemShape } from "./CourseItem";
import { postedAt } from "../utils/tools";
import { FaClock, FaPenToSquare, FaUpload, FaStar } from "react-icons/fa6"; // Added FaStar for the ratings
import api from "../utils/api";
import { useDispatch } from "react-redux";
import { asyncDetailCourse } from "../states/courses/action";
import { useParams } from "react-router-dom";

function CourseDetail({ course }) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(course?.title || "");
  const [editedDescription, setEditedDescription] = useState(
    course?.description || ""
  );
  const [previewCover, setPreviewCover] = useState(course?.cover || null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("contents"); // State to manage active tab
  const fileInputRef = useRef(null);
  const [newComment, setNewComment] = useState(""); // State for new comment input
  const [comments, setComments] = useState(course.comments || []); // State to manage comments

  useEffect(() => {
    if (id) {
      dispatch(asyncDetailCourse(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (course) {
      setEditedTitle(course.title);
      setEditedDescription(course.description);
      setPreviewCover(course.cover);
      setComments(course.comments || []); // Set comments from course data
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
      // Handle error without Swal
      return;
    }

    try {
      await api.putUpdateCourse({
        id: course.id,
        title: editedTitle,
        description: editedDescription,
      });
      setIsEditing(false);
      dispatch(asyncDetailCourse(course.id)); // Refresh the course details
    } catch (error) {
      // Handle error without Swal
    }
  };

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleAddComment = async () => {
    if (newComment.trim() === "") return;

    try {
      // Assume an API call for adding a comment exists
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
              <h5 className="mb-0">
                {course.title}{" "}
                {course.avg_ratings && (
                  <span className="text-warning">
                    <FaStar /> {course.avg_ratings}
                  </span>
                )}
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
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Contents</h5>
                <p className="card-text">Placeholder...</p>
              </div>
            </div>
          )}

          {activeTab === "students" && (
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Students</h5>
                <p className="card-text">List of enrolled students:</p>

                {/* Check if there are students to display */}
                {students.length > 0 ? (
                  <ul className="list-group">
                    {students.map((student, index) => (
                      <li key={index} className="list-group-item">
                        {student.name} ({student.email})
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

                <button
                  className="btn btn-primary"
                  onClick={handleAddComment}
                >
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
};

export default CourseDetail;
