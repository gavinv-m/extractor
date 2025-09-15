import EditableText from './EditableText';

const headingMap = {
  title: 'h1',
  sectionHeading: 'h2',
};

export default function Heading({
  content,
  role,
  pageNumber,
  elementID,
  onParagraphChange,
}) {
  const Tag = headingMap[role] || 'p';

  const handleChange = (newValue) => {
    onParagraphChange(pageNumber, elementID, newValue);
  };

  return (
    <Tag>
      <EditableText value={content} onChange={handleChange}></EditableText>
    </Tag>
  );
}
