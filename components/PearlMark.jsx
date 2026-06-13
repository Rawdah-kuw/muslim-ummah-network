/* BRAND MARK: The Pearl (اللؤلؤة)
   Open arc = the diver's shell & the seeker's path (Kuwait's pearl-diving
   heritage — Ali's roots). Center pearl = knowledge, the hidden treasure.
   Diamond at the opening = geometric counterpoint: clarity and direction. */

export default function PearlMark({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none"
      role="img" aria-label="أمة الإسلام">
      <path d="M42 24A18 18 0 1 1 24 6" stroke="#1B3B2B" strokeWidth="3.5" strokeLinecap="round" />
      <rect x="33.7" y="8.3" width="6" height="6" rx="1.2" transform="rotate(45 36.7 11.3)" fill="#4F7263" />
      <circle cx="24" cy="24" r="7.5" fill="#4F7263" />
      <circle cx="21.5" cy="21.5" r="2.2" fill="#FDFBF7" />
    </svg>
  );
}
