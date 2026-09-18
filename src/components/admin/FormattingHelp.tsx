const rows: { syntax: string; result: string }[] = [
  { syntax: '# Section heading', result: 'A section heading (also builds the table of contents)' },
  { syntax: 'A line of plain text', result: 'A normal paragraph' },
  { syntax: '> A pulled quote — Name', result: 'A highlighted quote with attribution' },
  { syntax: '![Caption](https://…/photo.jpg)', result: 'A picture in the article body' },
  { syntax: '[note:Editor’s Note] Text…', result: 'A set-apart editorial note' },
]

/** Inline cheat-sheet for the article editor's plain-text formatting. */
export function FormattingHelp() {
  return (
    <details className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">
      <summary className="cursor-pointer font-medium text-slate-700">
        Formatting &amp; images — how to write the body
      </summary>
      <p className="mt-3 text-slate-500">
        Separate blocks with a blank line. Each line below turns into formatted content:
      </p>
      <ul className="mt-3 space-y-2">
        {rows.map((row) => (
          <li key={row.syntax} className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
            <code className="whitespace-pre rounded bg-white px-2 py-1 text-xs text-slate-800 shadow-sm sm:w-72 sm:shrink-0">
              {row.syntax}
            </code>
            <span className="text-slate-600">{row.result}</span>
          </li>
        ))}
      </ul>
    </details>
  )
}
