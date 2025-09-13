import EditableText from './EditableText';

const headingMap = {
  title: 'h1',
  sectionHeading: 'h2',
};

// Exports to EditablePanel.jsx
export default function Heading({ content, role }) {
  const Tag = headingMap[role] || 'p'; // fallback to <p> if role not found

  //   TODO: onChange
  return (
    <Tag>
      <EditableText value={content}></EditableText>
    </Tag>
  );
}
