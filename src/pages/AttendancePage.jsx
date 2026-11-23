import SemesterForm from "../components/attendance/SemesterForm";
import SubjectsPanel from "../components/attendance/SubjectsPanel";
import TimetablePanel from "../components/attendance/TimetablePanel";
import HolidaysPanel from "../components/attendance/HolidaysPanel";
import "../components/attendance/Attendance.css";

function AttendancePage({
  semester,
  subjects,
  rules,
  holidays,
  loading,
  saveSemester,
  addSubject,
  updateSubject,
  archiveSubject,
  addRule,
  deleteRule,
  addHoliday,
  deleteHoliday,
}) {
  if (loading) return <p>Loading...</p>;

  return (
    <>
      <header>
        <h1>Attendance</h1>
      </header>

      {!semester && (
        <p className="muted att-intro">
          Start by creating your semester. Then add subjects, your weekly timetable and holidays.
        </p>
      )}

      <div className="att-layout">
        <div className="att-col">
          <section className="panel">
            <h3>Semester</h3>
            <SemesterForm semester={semester} onSave={saveSemester} />
          </section>

          {semester && (
            <section className="panel">
              <h3>Subjects</h3>
              <SubjectsPanel
                subjects={subjects}
                onAdd={addSubject}
                onUpdate={updateSubject}
                onRemove={archiveSubject}
              />
            </section>
          )}
        </div>

        {semester && (
          <div className="att-col">
            <section className="panel">
              <h3>Weekly timetable</h3>
              <TimetablePanel
                subjects={subjects}
                rules={rules}
                onAdd={addRule}
                onDelete={deleteRule}
              />
            </section>

            <section className="panel">
              <h3>Holidays</h3>
              <HolidaysPanel
                holidays={holidays}
                onAdd={addHoliday}
                onDelete={deleteHoliday}
              />
            </section>
          </div>
        )}
      </div>
    </>
  );
}

export default AttendancePage;
