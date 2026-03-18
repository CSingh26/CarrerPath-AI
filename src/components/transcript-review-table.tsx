// components/transcript-review-table.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { ExtractedCourse } from "@/types/transcript";

interface TranscriptReviewTableProps {
  university: string;
  major: string;
  gpa?: number;
  courses: ExtractedCourse[];
  onUpdate?: (updatedCourses: ExtractedCourse[]) => void;
  onConfirm?: () => void;
  isEditable?: boolean;
}

export default function TranscriptReviewTable({
  university,
  major,
  gpa,
  courses,
  onUpdate,
  onConfirm,
  isEditable = true,
}: TranscriptReviewTableProps) {
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editedCourses, setEditedCourses] = useState(courses);

  const handleCellChange = (
    rowIdx: number,
    field: keyof ExtractedCourse,
    value: string | number
  ) => {
    const updated = [...editedCourses];
    updated[rowIdx] = { ...updated[rowIdx], [field]: value };
    setEditedCourses(updated);
  };

  const handleSave = () => {
    onUpdate?.(editedCourses);
    setEditingRow(null);
  };

  const handleConfirm = () => {
    handleSave();
    onConfirm?.();
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header info */}
      <div className="card p-6 bg-blue-50 border-blue-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-slate-600">University</p>
            <p className="text-lg font-semibold text-slate-900">{university}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Major</p>
            <p className="text-lg font-semibold text-slate-900">{major}</p>
          </div>
          {gpa && (
            <div>
              <p className="text-sm text-slate-600">GPA</p>
              <p className="text-lg font-semibold text-slate-900">{gpa.toFixed(2)}</p>
            </div>
          )}
        </div>
      </div>

      {/* Courses table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                  Course Code
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                  Course Title
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                  Credits
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                  Grade
                </th>
                {isEditable && (
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                    Action
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {editedCourses.map((course, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    {editingRow === idx && isEditable ? (
                      <input
                        type="text"
                        value={course.courseCode}
                        onChange={(e) =>
                          handleCellChange(idx, "courseCode", e.target.value)
                        }
                        className="input w-full"
                      />
                    ) : (
                      <span className="font-medium text-slate-900">
                        {course.courseCode}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingRow === idx && isEditable ? (
                      <input
                        type="text"
                        value={course.courseTitle}
                        onChange={(e) =>
                          handleCellChange(idx, "courseTitle", e.target.value)
                        }
                        className="input w-full"
                      />
                    ) : (
                      <span className="text-slate-700">
                        {course.courseTitle}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingRow === idx && isEditable ? (
                      <input
                        type="number"
                        value={course.credits || ""}
                        onChange={(e) =>
                          handleCellChange(
                            idx,
                            "credits",
                            e.target.value ? Number(e.target.value) : ""
                          )
                        }
                        className="input w-full"
                      />
                    ) : (
                      <span className="text-slate-700">
                        {course.credits || "-"}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingRow === idx && isEditable ? (
                      <input
                        type="text"
                        value={course.grade || ""}
                        onChange={(e) =>
                          handleCellChange(idx, "grade", e.target.value)
                        }
                        className="input w-full"
                      />
                    ) : (
                      <span className="text-slate-700">{course.grade || "-"}</span>
                    )}
                  </td>
                  {isEditable && (
                    <td className="px-4 py-3">
                      {editingRow === idx ? (
                        <button
                          onClick={() => setEditingRow(null)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Done
                        </button>
                      ) : (
                        <button
                          onClick={() => setEditingRow(idx)}
                          className="text-slate-500 hover:text-slate-700 text-sm font-medium"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action buttons */}
      {isEditable && (
        <div className="flex gap-4 justify-end">
          <button className="btn btn-secondary">Cancel</button>
          <button onClick={handleConfirm} className="btn btn-primary">
            Confirm & Continue
          </button>
        </div>
      )}
    </motion.div>
  );
}
