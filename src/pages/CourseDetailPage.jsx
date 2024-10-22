import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  asyncAddContent,
  asyncDetailCourse,
  asyncUpdateCourse,
} from "../states/courses/action";
import CourseDetail from "../components/CourseDetail";

function CourseDetailPage() {
  const { id } = useParams();

  const { detailCourse } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      dispatch(asyncDetailCourse(id));
    }
  }, [id, dispatch]);

  const handleEditCourse = (id, title, description) => {
    dispatch(asyncUpdateCourse(id, title, description));

    Swal.fire({
      icon: "success",
      title: "Berhasil mengedit course!",
      showConfirmButton: false,
      timer: 1200,
    });
  };

  const handleAddContent = (id, title, youtube) => {
    dispatch(asyncAddContent(id, title, youtube));

    Swal.fire({
      icon: "success",
      title: "Content baru berhasil ditambahkan!",
      showConfirmButton: false,
      timer: 1200,
    });
  };

  return (
    <section>
      <div className="container pt-1">
        {detailCourse != null ? (
          <CourseDetail
            course={detailCourse}
            onEditCourse={handleEditCourse}
            onAddContent={handleAddContent}
          />
        ) : null}
      </div>
    </section>
  );
}

export default CourseDetailPage;
