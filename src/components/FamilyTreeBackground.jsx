// start FamilyTreeBackground
export default function FamilyTreeBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.03]"
        viewBox="0 0 800 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Tree structure with nodes and connections */}
        {/* Top level - grandparents */}
        <circle cx="200" cy="80" r="8" fill="currentColor" />
        <circle cx="300" cy="80" r="8" fill="currentColor" />
        <circle cx="500" cy="80" r="8" fill="currentColor" />
        <circle cx="600" cy="80" r="8" fill="currentColor" />

        {/* Second level - parents */}
        <circle cx="250" cy="180" r="10" fill="currentColor" />
        <circle cx="550" cy="180" r="10" fill="currentColor" />

        {/* Third level - children */}
        <circle cx="150" cy="280" r="8" fill="currentColor" />
        <circle cx="250" cy="280" r="8" fill="currentColor" />
        <circle cx="350" cy="280" r="8" fill="currentColor" />
        <circle cx="450" cy="280" r="8" fill="currentColor" />
        <circle cx="550" cy="280" r="8" fill="currentColor" />
        <circle cx="650" cy="280" r="8" fill="currentColor" />

        {/* Fourth level - grandchildren */}
        <circle cx="100" cy="380" r="6" fill="currentColor" />
        <circle cx="200" cy="380" r="6" fill="currentColor" />
        <circle cx="300" cy="380" r="6" fill="currentColor" />
        <circle cx="400" cy="380" r="6" fill="currentColor" />
        <circle cx="500" cy="380" r="6" fill="currentColor" />
        <circle cx="600" cy="380" r="6" fill="currentColor" />
        <circle cx="700" cy="380" r="6" fill="currentColor" />

        {/* Connection lines */}
        <line
          x1="200"
          y1="88"
          x2="250"
          y2="172"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="300"
          y1="88"
          x2="250"
          y2="172"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="500"
          y1="88"
          x2="550"
          y2="172"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="600"
          y1="88"
          x2="550"
          y2="172"
          stroke="currentColor"
          strokeWidth="1"
        />

        <line
          x1="250"
          y1="190"
          x2="150"
          y2="272"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="250"
          y1="190"
          x2="250"
          y2="272"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="250"
          y1="190"
          x2="350"
          y2="272"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="550"
          y1="190"
          x2="450"
          y2="272"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="550"
          y1="190"
          x2="550"
          y2="272"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="550"
          y1="190"
          x2="650"
          y2="272"
          stroke="currentColor"
          strokeWidth="1"
        />

        <line
          x1="150"
          y1="288"
          x2="100"
          y2="372"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="150"
          y1="288"
          x2="200"
          y2="372"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="250"
          y1="288"
          x2="300"
          y2="372"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="350"
          y1="288"
          x2="400"
          y2="372"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="550"
          y1="288"
          x2="500"
          y2="372"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="550"
          y1="288"
          x2="600"
          y2="372"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="650"
          y1="288"
          x2="700"
          y2="372"
          stroke="currentColor"
          strokeWidth="1"
        />

        {/* Decorative */}
        <circle cx="50" cy="200" r="4" fill="currentColor" opacity="0.5" />
        <circle cx="750" cy="150" r="4" fill="currentColor" opacity="0.5" />
        <circle cx="100" cy="500" r="4" fill="currentColor" opacity="0.5" />
        <circle cx="700" cy="500" r="4" fill="currentColor" opacity="0.5" />
      </svg>
    </div>
  );
}
// end FamilyTreeBackground
