// src/components/MemberDetailsModal.jsx
import { useEffect, useState } from "react";
import { getMemberById, updateMemberById } from "../lib/api";

export default function MemberDetailsModal({
  isOpen,
  onClose,
  memberId,
  onMemberUpdated, // optional callback to refresh the members list
}) {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesDraft, setNotesDraft] = useState("");
  const [isEditingDob, setIsEditingDob] = useState(false);
  const [dobDraft, setDobDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Load member when modal opens or when memberId changes
  useEffect(() => {
    const load = async () => {
      if (!isOpen || !memberId) {
        setMember(null);
        return;
      }
      setLoading(true);
      setError("");
      try {
        const data = await getMemberById(memberId);
        const m = data?.member || data;
        setMember(m);
        setNotesDraft(m?.notes || "");
        // normalize dob to YYYY-MM-DD or empty string
        setDobDraft(m?.dob ? String(m.dob).slice(0, 10) : "");
      } catch (err) {
        console.error("Failed to load member:", err);
        setError("Failed to load member details.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isOpen, memberId]);

  if (!isOpen) return null;

  const prettyDob = member?.dob ? String(member.dob).slice(0, 10) : "N/A";

  // ----- Notes editing handlers -----
  const startEditNotes = () => {
    setNotesDraft(member?.notes || "");
    setIsEditingNotes(true);
    setError("");
  };
  const cancelEditNotes = () => {
    setIsEditingNotes(false);
    setNotesDraft(member?.notes || "");
    setError("");
  };
  const saveNotes = async () => {
    setSaving(true);
    setError("");
    try {
      const payload = { notes: notesDraft };
      const res = await updateMemberById(memberId, payload);
      const updatedMember = res?.member || res;
      setMember(updatedMember);
      setIsEditingNotes(false);
      if (typeof onMemberUpdated === "function") {
        await onMemberUpdated();
      }
    } catch (err) {
      console.error("Failed to save notes:", err);
      setError("Failed to save notes. Try again.");
    } finally {
      setSaving(false);
    }
  };

  // ----- DOB editing handlers -----
  const startEditDob = () => {
    setDobDraft(member?.dob ? String(member.dob).slice(0, 10) : "");
    setIsEditingDob(true);
    setError("");
  };
  const cancelEditDob = () => {
    setIsEditingDob(false);
    setDobDraft(member?.dob ? String(member.dob).slice(0, 10) : "");
    setError("");
  };
  const saveDob = async () => {
    setSaving(true);
    setError("");
    try {
      // send dob as string (YYYY-MM-DD) or empty string -> backend will handle null
      const payload = { dob: dobDraft === "" ? "" : dobDraft };
      const res = await updateMemberById(memberId, payload);
      const updatedMember = res?.member || res;
      setMember(updatedMember);
      setIsEditingDob(false);
      if (typeof onMemberUpdated === "function") {
        await onMemberUpdated();
      }
    } catch (err) {
      console.error("Failed to save DOB:", err);
      setError("Failed to save date of birth. Try again.");
    } finally {
      setSaving(false);
    }
  };

  // Immediate relationships from backend response (fallbacks)
  const parent = member?.parent ?? null;
  const children = Array.isArray(member?.children) ? member.children : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        {loading ? (
          <p>Loading member...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : member ? (
          <>
            <h2 className="text-xl font-bold mb-2 text-center">
              {member.name || "Unnamed"}
            </h2>

            <div className="flex items-center justify-center mb-4">
              {member.photoUrl ? (
                <img
                  src={member.photoUrl}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover shadow"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                  No Photo
                </div>
              )}
            </div>

            {/* ---------- DOB section (editable) ---------- */}
            <div className=" pt-3 mb-3">
              <h3 className="font-semibold text-gray-800 mb-1">
                Date of Birth
              </h3>

              {!isEditingDob ? (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">{prettyDob}</p>
                  <button
                    onClick={startEditDob}
                    className="px-3 py-1 bg-blue-600 text-white rounded"
                  >
                    Edit
                  </button>
                </div>
              ) : (
                <div>
                  <input
                    type="date"
                    value={dobDraft}
                    onChange={(e) => setDobDraft(e.target.value)}
                    className="w-full border p-2 rounded text-sm"
                    max={new Date().toISOString().slice(0, 10)}
                  />
                  <div className="mt-3 flex justify-end gap-2">
                    <button
                      onClick={cancelEditDob}
                      className="px-3 py-1 border rounded"
                      disabled={saving}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveDob}
                      className="px-3 py-1 bg-green-600 text-white rounded"
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ---------- Notes section (editable) ---------- */}
            <div className="border-t pt-3 mb-3">
              <h3 className="font-semibold text-gray-800 mb-1">Notes</h3>

              {!isEditingNotes ? (
                <>
                  <p className="text-sm text-gray-700 whitespace-pre-line min-h-[48px]">
                    {member.notes && member.notes.length > 0
                      ? member.notes
                      : "No notes yet."}
                  </p>

                  <div className="mt-3 flex justify-end gap-2">
                    <button
                      onClick={startEditNotes}
                      className="px-3 py-1 bg-blue-600 text-white rounded"
                    >
                      {member.notes ? "Edit" : "Add Notes"}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <textarea
                    value={notesDraft}
                    onChange={(e) => setNotesDraft(e.target.value)}
                    rows={5}
                    className="w-full border p-2 rounded text-sm"
                    placeholder="Add notes / bio here..."
                  />

                  <div className="mt-3 flex justify-end gap-2">
                    <button
                      onClick={cancelEditNotes}
                      className="px-3 py-1 border rounded"
                      disabled={saving}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveNotes}
                      className="px-3 py-1 bg-green-600 text-white rounded"
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* ---------- Immediate family (view-only) ---------- */}
            <div className="border-t pt-3">
              <h3 className="font-semibold text-gray-800 mb-1">
                Immediate Family
              </h3>
              {parent ? (
                <p className="text-sm text-gray-600">
                  <strong>Parent:</strong> {parent.name}
                </p>
              ) : (
                <p className="text-sm text-gray-600">Parent: N/A</p>
              )}

              {children.length > 0 ? (
                <p className="text-sm text-gray-600">
                  <strong>Children:</strong>{" "}
                  {children.map((c) => c.name).join(", ")}
                </p>
              ) : (
                <p className="text-sm text-gray-600">Children: N/A</p>
              )}
            </div>
          </>
        ) : (
          <p>No member selected.</p>
        )}
      </div>
    </div>
  );
}
