export default function CourseCard({ course }) {
  return (
    <div className="card">
      <div className="card-top">{course.icon || "📘"}</div>
      <div className="card-body">
        <span className="badge">{course.category}</span>
        <h3>{course.title}</h3>
        <p>{course.description}</p>
      </div>
    </div>
  );
}
