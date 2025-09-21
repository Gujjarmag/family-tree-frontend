// src/components/MemberDetailsModal.jsx
import { useEffect, useState } from "react";
import { getMemberById, updateMemberById } from "../lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

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

  const prettyDob = member?.dob
    ? (() => {
        const [year, month, day] = String(member.dob).slice(0, 10).split("-");
        return `${day}-${month}-${year}`;
      })()
    : "N/A";

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center">
            {member?.name || "Unnamed"}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <p className="text-center text-muted-foreground">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : member ? (
          <div className="space-y-6">
            {/* Photo */}
            <div className="flex justify-center">
              {member.photoUrl ? (
                <img
                  src={member.photoUrl}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover shadow"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                  No Photo
                </div>
              )}
            </div>

            {/* DOB */}
            <div>
              <h3 className="font-medium">Date of Birth</h3>
              {!isEditingDob ? (
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm text-muted-foreground">{prettyDob}</p>
                  <Button size="sm" onClick={() => setIsEditingDob(true)}>
                    Edit
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Input
                    type="date"
                    value={dobDraft}
                    onChange={(e) => setDobDraft(e.target.value)}
                    max={new Date().toISOString().slice(0, 10)}
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditingDob(false)}
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={async () => {
                        // saveDob logic
                      }}
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Notes */}
            <div>
              <h3 className="font-medium">Notes</h3>
              {!isEditingNotes ? (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground min-h-[48px]">
                    {member.notes?.length > 0 ? member.notes : "No notes yet."}
                  </p>
                  <div className="flex justify-end mt-3">
                    <Button size="sm" onClick={() => setIsEditingNotes(true)}>
                      {member.notes ? "Edit" : "Add Notes"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <Textarea
                    rows={5}
                    value={notesDraft}
                    onChange={(e) => setNotesDraft(e.target.value)}
                    placeholder="Add notes / bio here..."
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditingNotes(false)}
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={async () => {
                        // saveNotes logic
                      }}
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Immediate Family */}
            <div>
              <h3 className="font-medium">Immediate Family</h3>
              <p className="text-sm text-muted-foreground mt-1">
                <strong>Parent:</strong> {member.parent?.name || "N/A"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                <strong>Children:</strong>{" "}
                {member.children?.length > 0
                  ? member.children.map((c) => c.name).join(", ")
                  : "N/A"}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            No member selected.
          </p>
        )}

        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
