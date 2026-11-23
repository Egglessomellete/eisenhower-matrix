import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

function friendly(error) {
  if (error.code === "23505") return "That entry already exists.";
  if (error.code === "23514") return "Some values are not allowed. Check the dates and times.";
  return error.message;
}

// Loads the user's latest semester with its subjects, weekly timetable and holidays.
// Every mutation returns an error message (string) or null on success.
export function useSemester(session) {
  const [semester, setSemester] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [rules, setRules] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(
    function () {
      if (!session) {
        setSemester(null);
        setSubjects([]);
        setRules([]);
        setHolidays([]);
        return;
      }

      async function load() {
        setLoading(true);
        const { data: sem, error } = await supabase
          .from("semesters")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (error) console.error(error.message);
        setSemester(sem ?? null);

        if (sem) {
          const [subs, rls, hols] = await Promise.all([
            supabase
              .from("subjects")
              .select("*")
              .eq("semester_id", sem.id)
              .eq("archived", false)
              .order("created_at"),
            supabase
              .from("timetable_rules")
              .select("*")
              .order("day_of_week")
              .order("start_time"),
            supabase.from("holidays").select("*").order("date"),
          ]);
          if (subs.data) setSubjects(subs.data);
          if (rls.data) setRules(rls.data);
          if (hols.data) setHolidays(hols.data);
        }
        setLoading(false);
      }
      load();
    },
    [session],
  );

  async function saveSemester(values) {
    const query = semester
      ? supabase.from("semesters").update(values).eq("id", semester.id)
      : supabase.from("semesters").insert(values);
    const { data, error } = await query.select().single();
    if (error) return friendly(error);
    setSemester(data);
    return null;
  }

  async function addSubject(values) {
    const { data, error } = await supabase
      .from("subjects")
      .insert({ ...values, semester_id: semester.id })
      .select()
      .single();
    if (error) return friendly(error);
    setSubjects((s) => [...s, data]);
    return null;
  }

  async function updateSubject(id, values) {
    const { data, error } = await supabase
      .from("subjects")
      .update(values)
      .eq("id", id)
      .select()
      .single();
    if (error) return friendly(error);
    setSubjects((s) => s.map((x) => (x.id === id ? data : x)));
    return null;
  }

  // "Remove" archives the subject, so its attendance history is never lost.
  async function archiveSubject(id) {
    const { error } = await supabase
      .from("subjects")
      .update({ archived: true })
      .eq("id", id);
    if (error) return friendly(error);
    setSubjects((s) => s.filter((x) => x.id !== id));
    return null;
  }

  async function addRule(values) {
    const { data, error } = await supabase
      .from("timetable_rules")
      .insert(values)
      .select()
      .single();
    if (error) return friendly(error);
    setRules((r) =>
      [...r, data].sort(
        (a, b) =>
          a.day_of_week - b.day_of_week || a.start_time.localeCompare(b.start_time),
      ),
    );
    return null;
  }

  async function deleteRule(id) {
    const { error } = await supabase.from("timetable_rules").delete().eq("id", id);
    if (error) return friendly(error);
    setRules((r) => r.filter((x) => x.id !== id));
    return null;
  }

  async function addHoliday(values) {
    const { data, error } = await supabase
      .from("holidays")
      .insert(values)
      .select()
      .single();
    if (error) return friendly(error);
    setHolidays((h) => [...h, data].sort((a, b) => a.date.localeCompare(b.date)));
    return null;
  }

  async function deleteHoliday(id) {
    const { error } = await supabase.from("holidays").delete().eq("id", id);
    if (error) return friendly(error);
    setHolidays((h) => h.filter((x) => x.id !== id));
    return null;
  }

  // Hide timetable rules that belong to archived subjects.
  const activeRules = rules.filter((r) => subjects.some((s) => s.id === r.subject_id));

  return {
    semester,
    subjects,
    rules: activeRules,
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
  };
}
