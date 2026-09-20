import type { Department } from '@/lib/content/types'

interface DepartmentSelectProps {
  departments: Department[]
  /** Currently saved department name, if any. */
  defaultValue?: string
  label?: string
  /** Sign-up requires one; on the profile form it can be cleared. */
  required?: boolean
}

/**
 * Department picker, shared by sign-up and the profile settings form.
 *
 * The department NAME is submitted (not an id), because that is what a session
 * carries and what the profile shows — and it keeps working whether the list
 * came from the database or the built-in seed data.
 */
export function DepartmentSelect({
  departments,
  defaultValue,
  label = 'Department',
  required = false,
}: DepartmentSelectProps) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="department">
        {label}
        {!required && <span className="ml-1 font-normal text-slate-400">(optional)</span>}
      </label>
      <select
        id="department"
        name="department"
        required={required}
        defaultValue={defaultValue ?? ''}
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 outline-none transition-colors focus:border-green-600 focus:ring-2 focus:ring-green-600"
      >
        <option value="">{required ? 'Select your department' : 'No department'}</option>
        {departments.map((department) => (
          <option key={department.slug} value={department.name}>
            {department.name}
            {department.abbreviation ? ` (${department.abbreviation})` : ''}
          </option>
        ))}
        {/* A saved department that is no longer in the list stays selectable. */}
        {defaultValue && !departments.some((department) => department.name === defaultValue) && (
          <option value={defaultValue}>{defaultValue}</option>
        )}
      </select>
    </div>
  )
}
