import PropTypes from "prop-types"; 
import { Link } from "react-router-dom";
import { useState } from "react";
import { FaTrash } from "react-icons/fa6";
import { postedAt } from "../utils/tools"; // Import untuk fitur waktu

function CourseItem({ course, onDeleteCourse }) {
  const [isHovered, setIsHovered] = useState(false); // State untuk menentukan apakah kursor berada di area course

  const truncateDescription = (description, maxLength) => {
    const words = description.split(' ');
    if (words.length > maxLength) {
      return words.slice(0, maxLength).join(' ') + "...";
    }
    return description;
  };
  
  // Dalam JSX:
  <p className="course-description">
    {truncateDescription(course.description, 15)} {/* Batasi hingga 15 kata */}
  </p>
  
  
  return (
    <Link to={`/courses/${course.id}`} className="course-card-link">
      <div
        className="course-card"
        onMouseEnter={() => setIsHovered(true)} // Tampilkan tombol hapus saat kursor masuk
        onMouseLeave={() => setIsHovered(false)} // Sembunyikan tombol hapus saat kursor keluar
      >
        {/* Course Cover */}
        <div className="course-cover">
          <img src={course.cover} alt={course.title} />
          {isHovered && ( // Tampilkan logo hapus hanya saat kursor masuk
            <button
              className="delete-button"
              onClick={(e) => {
                e.preventDefault(); // Mencegah link membuka halaman saat tombol hapus di-klik
                onDeleteCourse(course.id);
              }}
            >
              <FaTrash />
            </button>
          )}
        </div>

        {/* Course Body */}
        <div className="course-body">
          <h5 className="course-title">{course.title}</h5>

          {/* Waktu Post */}
          <div className="course-timestamp">
            <small>Posted on: {postedAt(course.created_at)}</small>
          </div>

          {/* Deskripsi Singkat */}
          <p className="course-description">
            {truncateDescription(course.description, 100)} {/* Batasi deskripsi hingga 100 karakter */}
          </p>
        </div>
      </div>
    </Link>
  );
}

const courseItemShape = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  cover: PropTypes.string,
  description: PropTypes.string.isRequired, // Tambahkan deskripsi
  created_at: PropTypes.string.isRequired,
  updated_at: PropTypes.string.isRequired,
};

CourseItem.propTypes = {
  course: PropTypes.shape(courseItemShape).isRequired,
  onDeleteCourse: PropTypes.func.isRequired,
};

export { courseItemShape };
export default CourseItem;
