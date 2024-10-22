import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import CourseList from "../components/CourseList";
import {
  asyncGetCourses,
  asyncDeleteCourse,
  deleteCourseActionCreator,
} from "../states/courses/action";

// Image array for the top section (replace with your actual image paths)
const sliderImages = [
  "/assets/vendor/pic1.png", // Add correct image paths here
  "/assets/vendor/pic2.png",
  "/assets/vendor/pic3.png",
];

// Single image for the FAQ section
const singleImage = "/assets/vendor/pic1.png"; // Add the correct image path

// Custom icons for dropdown (replace these paths with your actual image paths)
const dropdownOpenIcon = "/path-to-open-icon.png"; // Icon for open dropdown
const dropdownCloseIcon = "/path-to-close-icon.png"; // Icon for closed dropdown

function HomePage() {
  const { courses = [], isDeleteCourse = false } = useSelector(
    (states) => states
  );
  const dispatch = useDispatch();

  // State for the image slider at the top of the page
  const [currentSlide, setCurrentSlide] = useState(0);

  // State for showing limited or all courses
  const [showAllCourses, setShowAllCourses] = useState(false);

  // State to control dropdown visibility for each item
  const [dropdownVisibility, setDropdownVisibility] = useState([false, false, false]);

  // Function to toggle dropdowns
  const toggleDropdown = (index) => {
    const updatedVisibility = [...dropdownVisibility];
    updatedVisibility[index] = !updatedVisibility[index];
    setDropdownVisibility(updatedVisibility);
  };

  // Function to handle automatic sliding in the top image section
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prevSlide) =>
        prevSlide === sliderImages.length - 1 ? 0 : prevSlide + 1
      );
    }, 3000); // Change every 3 seconds

    return () => clearInterval(slideInterval); // Cleanup interval on unmount
  }, []);

  // Fetch courses and handle course deletion
  useEffect(() => {
    if (isDeleteCourse) {
      Swal.fire({
        icon: "success",
        title: "Course berhasil dihapus!",
        showConfirmButton: false,
        timer: 700,
      });
      dispatch(deleteCourseActionCreator(false));
    }
    dispatch(asyncGetCourses());
  }, [dispatch, isDeleteCourse]);

  const onDeleteCourse = (id) => {
    dispatch(asyncDeleteCourse(id));
  };

  // Function to show either 8 courses or all of them
  const displayedCourses = showAllCourses ? courses : courses.slice(0, 8);

  // Scroll Animation Function
  const handleScroll = () => {
    const sections = document.querySelectorAll(".why-us-section, .instructor-section, .team-section, .faq-section");
    sections.forEach(section => {
      const sectionTop = section.getBoundingClientRect().top;
      if (sectionTop < window.innerHeight - 100) {
        section.classList.add("scrolled");
      }
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section>
      <div className="container pt-1">
        {/* Image Slider Section */}
        <div className="slider-container">
          <img
            src={sliderImages[currentSlide]}
            alt="Slide"
            className="slider-image"
          />
        </div>

        {/* Welcome Text */}
        <div className="welcome-text">
          <p>
            Selamat datang di situs pembelajaran yang dibangun dengan penuh dedikasi untuk masa depan yang lebih baik. Kami percaya bahwa belajar adalah kunci untuk mengubah dunia, dan dengan tujuan mulia ini, kami mengundang Anda untuk bergabung dalam perjalanan penuh pengetahuan. Di sini, Anda akan menemukan berbagai materi yang dirancang untuk membantu meningkatkan kemampuan Anda, kapan pun dan di mana pun Anda berada. Bersama-sama, kita akan melangkah menuju dunia yang lebih cerdas, kreatif, dan penuh inspirasi. Mari belajar, berkembang, dan berkontribusi bersama!
          </p>
        </div>

        {/* Subheading with "See All" */}
        <div className="courses-header">
          <h2>All Courses</h2>
          <span
            onClick={() => setShowAllCourses(!showAllCourses)}
            className="see-all"
          >
            {showAllCourses ? "Less" : "See All"}
          </span>
        </div>

        {/* Course List Section */}
        <CourseList
          courses={displayedCourses}
          onDeleteCourse={onDeleteCourse}
        ></CourseList>

        {/* Why Us Section */}
        <div className="why-us-section">
          <h2>Why Us?</h2>
          <div className="why-us-grid">
            <div className="why-us-card">
              <div className="why-us-image">
                <img src="/assets/vendor/ardell.jpeg" alt="Gambar" />
              </div>
              <h3>Judul</h3>
              <p>deskripsi deskripsi deskripsi</p>
            </div>
            <div className="why-us-card">
              <div className="why-us-image">
                <img src="/assets/vendor/ardell.jpeg" alt="Gambar" />
              </div>
              <h3>Judul</h3>
              <p>deskripsi deskripsi deskripsi</p>
            </div>
            <div className="why-us-card">
              <div className="why-us-image">
                <img src="/assets/vendor/ardell.jpeg" alt="Gambar" />
              </div>
              <h3>Judul</h3>
              <p>deskripsi deskripsi deskripsi</p>
            </div>
          </div>
        </div>
        
        {/* Instructors Section */}
        <div className="instructor-section">
          <h2>Our Instructor</h2>
          <p>Kami menyediakan instruktur-instruktur yang berpengalaman di bidangnya</p>
          <div className="profile-grid">
            <div className="profile-card">
              <img src="/assets/vendor/profImg1.png" alt="Instructor" className="profile-image" />
              <h3>Nama Instructor</h3>
              <p>Deskripsi instruktur</p>
            </div>
            <div className="profile-card">
              <img src="/assets/vendor/profImg2.png" alt="Instructor" className="profile-image" />
              <h3>Nama Instructor</h3>
              <p>Deskripsi instruktur</p>
            </div>
            <div className="profile-card">
              <img src="/assets/vendor/profImg3.png" alt="Instructor" className="profile-image" />
              <h3>Nama Instructor</h3>
              <p>Deskripsi instruktur</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <div className="faq-container">
            <div className="left-image-fixed">
              <img src={singleImage} alt="FAQ related image" className="single-image" />
            </div>
            <div className="right-content">
              <div className="dropdown-item">
                <div className="dropdown-header" onClick={() => toggleDropdown(0)}>
                  teks sub judul{" "}
                  <img
                    src={dropdownVisibility[0] ? dropdownOpenIcon : dropdownCloseIcon}
                    alt="Dropdown Icon"
                    className="dropdown-icon"
                  />
                </div>
                {dropdownVisibility[0] && (
                  <div className="dropdown-body">
                    teks yang muncul jika dropdown button diklik
                  </div>
                )}
              </div>
              <div className="dropdown-item">
                <div className="dropdown-header" onClick={() => toggleDropdown(1)}>
                  teks sub judul{" "}
                  <img
                    src={dropdownVisibility[1] ? dropdownOpenIcon : dropdownCloseIcon}
                    alt="Dropdown Icon"
                  />
                </div>
                {dropdownVisibility[1] && (
                  <div className="dropdown-body">
                    teks yang muncul jika dropdown button diklik
                  </div>
                )}
              </div>
              <div className="dropdown-item">
                <div className="dropdown-header" onClick={() => toggleDropdown(2)}>
                  teks sub judul{" "}
                  <img
                    src={dropdownVisibility[2] ? dropdownOpenIcon : dropdownCloseIcon}
                    alt="Dropdown Icon"
                  />
                </div>
                {dropdownVisibility[2] && (
                  <div className="dropdown-body">
                    teks yang muncul jika dropdown button diklik
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="team-section">
          <h2>Our Team</h2>
          <p>Tim kami menyediakan platform bagi orang-orang yang ingin belajar meningkatkan pengetahuan mereka</p>
          <div className="profile-grid">
            <div className="profile-card">
              <img src="/assets/vendor/ardell.jpeg" alt="Team Member" className="profile-image" />
              <h3>Nama Team Member</h3>
              <p>Deskripsi team member</p>
            </div>
            <div className="profile-card">
              <img src="/assets/vendor/ardell.jpeg" alt="Team Member" className="profile-image" />
              <h3>Nama Team Member</h3>
              <p>Deskripsi team member</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="footer">
        <div className="footer-container">
          <div className="footer-left">
            <h3>Nama WEB</h3>
          </div>
          <div className="footer-middle">
            <h4>Follow Us:</h4>
            <ul>
              <li>
                <img src="/path-to-instagram-logo" alt="Instagram Logo" /> Instagram
              </li>
              <li>
                <img src="/path-to-github-logo" alt="Github Logo" /> Github
              </li>
              <li>
                <img src="/path-to-linkedin-logo" alt="LinkedIn Logo" /> LinkedIn
              </li>
            </ul>
          </div>
          <div className="footer-right">
            <h4>Contact:</h4>
            <ul>
              <li>
                <img src="/path-to-phone-logo" alt="Phone Icon" /> Nomor Telepon
              </li>
              <li>
                <img src="/path-to-email-logo" alt="Email Icon" /> Alamat Email
              </li>
            </ul>
          </div>
          <div className="footer-address">
            <h4>Address:</h4>
            <p>Address, City, Number</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomePage;
