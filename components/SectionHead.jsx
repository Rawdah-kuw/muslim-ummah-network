export default function SectionHead({ icon: Icon, kicker, title, desc }) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-9 h-9 rounded-xl flex items-center justify-center bg-sage-100">
          <Icon size={18} className="text-sage-600" />
        </span>
        <span className="text-sm font-medium tracking-wide text-sage-600">{kicker}</span>
      </div>
      <h2 className="text-3xl md:text-4xl font-bold mb-2 text-pine-800">{title}</h2>
      {desc && <p className="text-base md:text-lg text-slate-500 max-w-2xl leading-relaxed">{desc}</p>}
    </div>
  );
}
