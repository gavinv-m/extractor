import EditableText from './EditableText';

// Exports to EditablePanel.jsx
export default function ParagraphElement({ content }) {
  return (
    <p>
      {/* TODO: onChange */}
      <EditableText value={content}></EditableText>
    </p>
  );
}
