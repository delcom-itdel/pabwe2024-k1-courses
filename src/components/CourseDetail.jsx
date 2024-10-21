import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { courseItemShape } from "./CourseItem";
import { postedAt } from "../utils/tools";
import { FaClock, FaPenToSquare, FaUpload } from "react-icons/fa6";
import api from "../utils/api";
import { useDispatch } from "react-redux";
import { asyncDetailCourse } from "../states/courses/action";
import { useParams } from "react-router-dom";

function CourseDetail({ course, onEditCourse }) {
  const { id } = useParams();
  const dispatch = useDispatch();

  // State variables for comments and content
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [activeTab, setActiveTab] = useState("content");
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(course?.title || "");
  const [editedDescription, setEditedDescription] = useState(
    course?.description || ""
  );
  const [previewCover, setPreviewCover] = useState(course?.cover || null);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (id) {
      dispatch(asyncDetailCourse(id)); // Fetch the current course details
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (course) {
      setEditedTitle(course.title);
      setEditedDescription(course.description);
      setPreviewCover(course.cover);
      fetchComments(); // Fetch comments on course load
    }
  }, [course]);

  // Fetch comments from the API
  const fetchComments = async () => {
    try {
      const response = await fetch(
        `https://public-api.delcom.org/api/v1/courses/${id}/comments`
      );
      const commentsData = await response.json();
      setComments(commentsData); // Assuming the API returns a list of comments
    } catch (error) {
      console.error("Failed to fetch comments:", error.message);
    }
  };

  // Post a new comment to the API
  const postComment = async () => {
    if (newComment.trim() === "") return;

    try {
      const response = await fetch(
        `https://public-api.delcom.org/api/v1/courses/${id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: newComment }),
        }
      );
      const newCommentData = await response.json();
      setComments((prevComments) => [...prevComments, newCommentData]); // Append the new comment
      setNewComment(""); // Clear the input field after submission
    } catch (error) {
      console.error("Failed to post comment:", error.message);
    }
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

  const handleSaveChanges = () => {
    onEditCourse(course.id, editedTitle, editedDescription);
    setIsEditing(false);
  };

  // Render Comments Tab
  const renderCommentsTab = () => (
    <div className="comments-tab">
      <h6>Comments</h6>
      <ul className="list-group">
        {comments.map((comment) => (
          <li key={comment.id} className="list-group-item">
            <strong>{comment.author}</strong>: {comment.content}
            <div className="text-muted">
              <small>{postedAt(comment.created_at)}</small>
            </div>
          </li>
        ))}
      </ul>
      {/* Add new comment */}
      <div className="mt-3">
        <textarea
          className="form-control"
          rows="3"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add your comment..."
        />
        <button
          className="btn btn-primary mt-2"
          onClick={postComment}
          disabled={newComment.trim() === ""}
        >
          Post Comment
        </button>
      </div>
    </div>
  );

  // Render Content Tab
  const renderContentTab = () => {
    const youtubeLink = course.youtube || ""; // Fetch from the course data
    return (
      <div className="content-tab">
        <h6>Content</h6>
        {youtubeLink ? (
          <div className="mt-3">
            <iframe
              width="560"
              height="315"
              src={youtubeLink.replace("watch?v=", "embed/")} // Adjust link for embedding
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <p>No YouTube video available.</p>
        )}
      </div>
    );
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

        {/* Course Details */}
        <div className="row align-items-center">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <h5 className="mb-0">{editedTitle}</h5>
              </div>

              <div>
                {/* Update Cover Button */}
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

                {/* "Edit" Button */}
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

        {/* Tabs for Content and Comments */}
        <div className="tabs mt-4">
          <button
            className={`btn btn-link ${
              activeTab === "content" ? "active" : ""
            }`}
            onClick={() => setActiveTab("content")}
          >
            Content
          </button>
          <button
            className={`btn btn-link ${
              activeTab === "comments" ? "active" : ""
            }`}
            onClick={() => setActiveTab("comments")}
          >
            Comments
          </button>
        </div>

        {/* Tab content */}
        {activeTab === "content" ? renderContentTab() : renderCommentsTab()}
      </div>
    </div>
  );
}

CourseDetail.propTypes = {
  course: PropTypes.shape(courseItemShape).isRequired,
  onEditCourse: PropTypes.func.isRequired,
};

export default CourseDetail;
