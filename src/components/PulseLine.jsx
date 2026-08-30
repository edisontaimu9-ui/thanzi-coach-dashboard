export default function PulseLine({ active }) {
  return (
    <svg viewBox="0 0 300 40" className="w-full h-10" preserveAspectRatio="none">
      <polyline
        points="0,20 40,20 55,6 70,34 85,20 130,20 145,10 160,30 175,20 300,20"
        fill="none"
        stroke="#3ECF8E"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        className={active ? "pulse-anim" : ""}
        style={{ opacity: active ? 1 : 0.35 }}
      />
    </svg>
  );
}
