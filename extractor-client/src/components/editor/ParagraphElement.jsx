import EditableText from './EditableText';

// Exports to EditablePanel.jsx
export default function ParagraphElement({
  content,
  pageNumber,
  elementID,
  onParagraphChange,
}) {
  const handleChange = (newValue) => {
    onParagraphChange(pageNumber, elementID, newValue);
  };

  return (
    <p>
      {/* TODO: onChange */}
      <EditableText value={content} onChange={handleChange}></EditableText>
    </p>
  );
}
