import { useEffect, useState } from "react";
import { getMemberById } from "../lib/api";

export default function MemberDetailsModal({ isOpen, onClose, memberId }) {
  const [member, setMember] = useState(null);

  useEffect(() => {
    if (isOpen && memberId) {
      getMemberById(memberId).then(setMember).catch(console.error);
    }
  }, [isOpen, memberId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        {member ? (
          <>
            <h2 className="text-xl font-bold mb-2">{member.name}</h2>
            {member.photo && (
              <img
                src={member.photo}
                alt={member.name}
                className="w-32 h-32 object-cover rounded-full mb-4 mx-auto"
              />
            )}
            <p className="mb-2">
              <strong>Relation:</strong> {member.relation}
            </p>
            {member.notes && (
              <p className="mb-2">
                <strong>Notes:</strong> {member.notes}
              </p>
            )}
            {member.immediateRelations?.length > 0 && (
              <div>
                <strong>Immediate Relations:</strong>
                <ul className="list-disc pl-5">
                  {member.immediateRelations.map((rel) => (
                    <li key={rel.id}>{rel.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}
