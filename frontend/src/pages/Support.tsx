export default function Support() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-text-pri mb-4">Podpořte VeVit</h1>
        <p className="text-text-sec mb-8">
          Každý příspěv pomáhá udržet platformu bez reklam a zdarma pro všechny.
        </p>
        <div className="p-8 rounded-[16px] bg-bg-card border border-[var(--border-default)]">
          <a href="https://ko-fi.com/F1F41UHFTK" target="_blank" rel="noopener noreferrer">
            <img
              src="https://cdn.ko-fi.com/cdn/kofi3.png?v=3"
              alt="Support me on Ko-fi"
              className="h-12 mx-auto hover:opacity-90 transition-opacity"
            />
          </a>
        </div>
      </div>
    </div>
  )
}