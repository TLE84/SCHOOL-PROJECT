/** Bundled campus images an editor can pick without uploading anything. */
const suggestions = [
  '/images/pti_students_lab.jpg',
  '/images/pti_innovation_hub.jpg',
]

export function FeaturedImageField({ defaultValue }: { defaultValue?: string }) {
  return (
    <div className="space-y-2">
      <label htmlFor="featuredImage" className="text-sm font-medium text-slate-700">
        Featured image
      </label>
      <input
        id="featuredImage"
        name="featuredImage"
        type="text"
        list="featured-image-suggestions"
        defaultValue={defaultValue}
        placeholder="/images/pti_students_lab.jpg  or  https://…/photo.jpg"
        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
      />
      <datalist id="featured-image-suggestions">
        {suggestions.map((src) => (
          <option key={src} value={src} />
        ))}
      </datalist>
      <p className="text-xs text-slate-500">
        Paste an image URL, or pick a bundled campus image. Leave blank for no header image.
      </p>
    </div>
  )
}
