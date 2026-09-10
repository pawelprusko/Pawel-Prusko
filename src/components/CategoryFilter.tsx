const categories = [
  "CSS",
  "React",
  "Animation",
  "Career",
  "JavaScript",
  "SVG",
  "Next.js",
  "General"
];

export default function CategoryFilter() {
  return (
    <div className="w-full pt-10 pb-6 px-5">
      <h3 className="text-sm font-heading font-medium tracking-widest text-[#EFC88B] uppercase mb-6">
        BROWSE BY CATEGORY
      </h3>
      <div className="flex flex-wrap gap-3">
        {categories.map((cat, i) => (
          <button
            key={cat}
            className={`text-[12px] font-sans font-medium px-4 py-2.5 rounded-xl transition-all ${
              i === 0
                ? 'bg-primary text-white shadow-md'
                : 'bg-white/10 text-white hover:bg-white/15'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
