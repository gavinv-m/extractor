// Exports to ParagraphElement & TableElement
export default function EditableText({ value, onChange }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
    ></textarea>
  );
}
