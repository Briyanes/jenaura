export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 mx-auto mb-4 border-2 border-jena-gold border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-jena-charcoal/50">Memuat...</p>
      </div>
    </div>
  )
}