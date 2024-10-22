import PropTypes from "prop-types";

function StudentList({ students }) {
  return (
    <div>
      {students && students.length > 0 ? (
        <ul className="list-group">
          {students.map((student) => (
            <li className="list-group-item" key={student.id}>
              {student.name} (ID: {student.id})
            </li>
          ))}
        </ul>
      ) : (
        <p>No students enrolled yet.</p>
      )}
    </div>
  );
}

StudentList.propTypes = {
  students: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default StudentList;
