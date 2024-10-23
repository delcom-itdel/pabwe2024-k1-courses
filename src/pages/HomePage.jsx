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
  "/1.png", // Add correct image paths here
  "/3.png",
  "/2.png",
  
];

// Single image for the FAQ section
const singleImage = "/FAQ.png"; // Add the correct image path

// Custom icons for dropdown (replace these paths with your actual image paths)
const dropdownOpenIcon = "/down-hover.png"; // Icon for open dropdown
const dropdownCloseIcon = "/down.png"; // Icon for closed dropdown

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
  const [dropdownVisibility, setDropdownVisibility] = useState([
    false,
    false,
    false,
  ]);

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
    const sections = document.querySelectorAll(
      ".why-us-section, .instructor-section, .team-section, .faq-section"
    );
    sections.forEach((section) => {
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
            Welcome to <strong>Delta Courses</strong>, where learning meets
            convenience! We know that in today’s fast-paced world, time is one
            of your most valuable resources. That's why we've crafted a platform
            for people just like you—busy, ambitious, and eager to grow, but
            with limited time on your hands. At Delta Courses, we specialize in{" "}
            <strong>free, concise courses</strong> that give you exactly what
            you need—no unnecessary filler, just pure, practical knowledge.
            Whether you're looking to sharpen your skills, explore a new topic,
            or enhance your career, our courses are designed to fit into your
            lifestyle. Each course is <strong>streamlined and targeted</strong>,
            allowing you to learn valuable insights in the shortest time
            possible.
          </p>
          <p>
            And the best part? You don’t have to pay a dime! Our mission is to
            make high-quality education accessible to everyone, so all of our
            core content is completely <strong>free</strong>. Plus, as you
            progress, you'll have the opportunity to upgrade to unlock exclusive
            content, but that’s entirely up to you! With{" "}
            <strong>expert-led courses</strong> spanning business, technology,
            personal development, and more, there's something for everyone.
            Whether you have an hour, a day, or a week, we've got the perfect
            course to fit your schedule and empower your future.
          </p>
          <p>
            Join our growing community of learners today, and start leveling up
            your knowledge, all at your own pace. Learning has never been this
            easy, accessible, or rewarding!
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
          <h2>Unlock Your Potential with Us</h2>
          <div className="why-us-grid">
            <div className="why-us-card glow-effect">
              <div className="why-us-image">
                <img src="/book.png" alt="Gambar" />
              </div>
              <h3>Structured Curriculum</h3>
              <p>
                Each course is designed with a clear, step-by-step curriculum to
                ensure you learn efficiently, progressing from basics to
                advanced topics seamlessly.
              </p>
            </div>
            <div className="why-us-card glow-effect">
              <div className="why-us-image">
                <img src="/laptop.jpg" alt="Gambar" />
              </div>
              <h3>Interactive Learning Experience</h3>
              <p>
                Engage with interactive features like video lessons, quizzes,
                and discussions that keep you involved and help you apply what
                you’ve learned right away.
              </p>
            </div>
            <div className="why-us-card glow-effect">
              <div className="why-us-image">
                <img src="/certif.png" alt="Gambar" />
              </div>
              <h3>Recognized Certificates</h3>
              <p>
                Earn certificates upon course completion to enhance your
                professional profile, boost your resume, or unlock new career
                opportunities.
              </p>
            </div>
          </div>
        </div>

        {/* Instructors Section */}
        <div className="instructor-section">
          <h2>Learn from Industry Leaders</h2>
          <p>
            Our team of instructors is made up of leaders and innovators in
            their industries. With their expert guidance, you'll gain valuable
            skills and knowledge to stay ahead.
          </p>
          <div className="profile-grid">
            <div className="profile-card">
              <img
                src="/public/face9.jpeg"
                alt="Instructor"
                className="profile-image"
              />
              <h3>Emily Zhang</h3>
              <p>Cybersecurity Consultant</p>
              <p>-SecureNet Solutions-</p>
            </div>
            <div className="profile-card">
              <img
                src="/public/face8.jpeg"
                alt="Instructor"
                className="profile-image"
              />
              <h3>David Thompson</h3>
              <p>Cloud Infrastructure Specialist</p>
              <p>-TechHub Global-</p>
            </div>
            <div className="profile-card">
              <img
                src="/public/face7.jpeg"
                alt="Instructor"
                className="profile-image"
              />
              <h3>Michael Rivera</h3>
              <p>Full-Stack Developer</p>
              <p>-CodeWave Innovations-</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <div className="faq-container">
            <div className="left-image-fixed">
              <img
                src={singleImage}
                alt="FAQ related image"
                className="single-image"
              />
            </div>
            <div className="right-content">
              <div className="dropdown-item">
                <div
                  className="dropdown-header"
                  onClick={() => toggleDropdown(0)}
                >
                  Is this course really free?{" "}
                  <img
                    src={
                      dropdownVisibility[0]
                        ? dropdownOpenIcon
                        : dropdownCloseIcon
                    }
                    alt="Dropdown Icon"
                    className="dropdown-icon"
                  />
                </div>
                {dropdownVisibility[0] && (
                  <div className="dropdown-body">
                    Absolutely! This course is 100% free—no hidden costs or
                    surprises. We believe in providing high-quality learning
                    experiences accessible to everyone, regardless of budget.
                    You can start learning today without paying a single penny.
                    If you wish to enhance your experience with extra perks like
                    certificates, you’ll have the option to upgrade, but the
                    core content is entirely free!
                  </div>
                )}
              </div>
              <div className="dropdown-item">
                <div
                  className="dropdown-header"
                  onClick={() => toggleDropdown(1)}
                >
                  How long will I have access to the course?{" "}
                  <img
                    src={
                      dropdownVisibility[1]
                        ? dropdownOpenIcon
                        : dropdownCloseIcon
                    }
                    alt="Dropdown Icon"
                    className="dropdown-icon"
                  />
                </div>
                {dropdownVisibility[1] && (
                  <div className="dropdown-body">
                    Once enrolled, you’ll enjoy lifetime access to the course
                    materials! This means you can learn at your own pace,
                    revisit topics whenever you need a refresher, and never
                    worry about a time limit. Whether you want to complete the
                    course in one week or one year, the flexibility is yours!
                  </div>
                )}
              </div>

              <div className="dropdown-item">
                <div
                  className="dropdown-header"
                  onClick={() => toggleDropdown(1)}
                >
                  Will I receive updates or additional content in the future?{" "}
                  <img
                    src={
                      dropdownVisibility[1]
                        ? dropdownOpenIcon
                        : dropdownCloseIcon
                    }
                    alt="Dropdown Icon"
                    className="dropdown-icon"
                  />
                </div>
                {dropdownVisibility[1] && (
                  <div className="dropdown-body">
                    Absolutely! We are committed to keeping our courses
                    up-to-date with the latest information and trends. As we
                    release new content, such as additional lessons, resources,
                    or even new course modules, you'll have access to them
                    without any extra charge. Once you enroll, you're in for the
                    long haul—every update or improvement we make will be
                    available to you, ensuring you stay current and get the most
                    out of your learning experience!
                  </div>
                )}
              </div>

              <div className="dropdown-item">
                <div
                  className="dropdown-header"
                  onClick={() => toggleDropdown(2)}
                >
                  How can I interact with other learners or the instructor?{" "}
                  <img
                    src={
                      dropdownVisibility[2]
                        ? dropdownOpenIcon
                        : dropdownCloseIcon
                    }
                    alt="Dropdown Icon"
                    className="dropdown-icon"
                  />
                </div>
                {dropdownVisibility[2] && (
                  <div className="dropdown-body">
                    Engaging with a community of learners is a huge part of the
                    experience! You’ll have access to interactive discussion
                    forums where you can share insights, ask questions, and
                    network with peers from around the world. Plus, our
                    instructors are active in these forums, so you can get
                    direct feedback and support. Learning has never been more
                    connected!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="team-section">
          <h2>Meet Our Team</h2>
          <p>
            Behind every great course is a passionate team. Our dedicated
            professionals work tirelessly to create, curate, and support your
            learning journey, ensuring you have the best experience possible.
          </p>
          <div className="profile-grid">
            <div className="profile-card">
              <img
                src="/public/face6.jpeg"
                alt="Team Member"
                className="profile-image"
              />
              <h3>Mario Sijabat</h3>
              <p>Del Institute of Technology</p>
            </div>
            <div className="profile-card">
              <img
                src="/public/face5.jpeg"
                alt="Team Member"
                className="profile-image"
              />
              <h3>Yessi Sitanggang</h3>
              <p>Del Institute of Technology</p>
            </div>
            <div className="profile-card">
              <img
                src="/public/face4.jpeg"
                alt="Team Member"
                className="profile-image"
              />
              <h3>Febiola Tampubolon</h3>
              <p>Del Institute of Technology</p>
            </div>
            <div className="profile-card">
              <img
                src="/public/face3.jpeg"
                alt="Team Member"
                className="profile-image"
              />
              <h3>Roy Hutajulu</h3>
              <p>Del Institute of Technology</p>
            </div>
            <div className="profile-card">
              <img
                src="/public/ardell.jpeg"
                alt="Team Member"
                className="profile-image"
              />
              <h3>William Napitupulu</h3>
              <p>Del Institute of Technology</p>
            </div>
            <div className="profile-card">
              <img
                src="/public/face1.jpeg"
                alt="Team Member"
                className="profile-image"
              />
              <h3>Ferdinand Sihombing</h3>
              <p>Del Institute of Technology</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="footer">
        <div className="footer-container">
          <div className="footer-middle">
            <h4>Follow Us:</h4>
            <ul>
              <li>
                <img src="/instagram.png" alt="Instagram Logo" />
                <a
                  href="https://www.instagram.com/huaweimobileid/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "black", textDecoration: "none" }}
                >
                  Instagram
                </a>
              </li>
              <li>
                <img src="/github.png" alt="Github Logo" />
                <a
                  href="https://github.com/MarioSijabat"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "black", textDecoration: "none" }}
                >
                  Github
                </a>
              </li>
              <li>
                <img src="/linkedin.png" alt="LinkedIn Logo" />
                <a
                  href="https://www.linkedin.com/company/huawei/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "black", textDecoration: "none" }}
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-right">
            <h4>Contact:</h4>
            <ul>
              <li>
                <img src="/phone.png" alt="Phone Icon" />
                <a
                  href="tel:+6281326633260"
                  style={{ color: "black", textDecoration: "none" }}
                >
                  +6281326633260
                </a>
              </li>
              <li>
                <img src="/phone.png" alt="Phone Icon" />
                <a
                  href="tel:+6282165626034"
                  style={{ color: "black", textDecoration: "none" }}
                >
                  +6282165626034
                </a>
              </li>
              <li>
                <img src="/email.png" alt="Email Icon" />
                <a
                  href="mailto:mariojabat07@gmail.com"
                  style={{ color: "black", textDecoration: "none" }}
                >
                  mariojabat07@gmail.com
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-address">
            <h4>Address:</h4>
            <ul>
              <li>
                <img src="/log.png" alt="Email Icon" />
                <p style={{ color: "black", textDecoration: "none" }}>
                  Gedung wisma mulia 2 Lt.37 Jl. Gatot Subroto, jakarta,
                  Indonesia
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomePage;
