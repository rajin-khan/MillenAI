// /millen-ai/src/components/FileIcon.jsx

import {
  PhotoIcon,
  DocumentTextIcon,
  TableCellsIcon,
  CodeBracketIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/solid';

const FileIcon = ({ fileType, className = "w-5 h-5" }) => {
  switch (fileType) {
    case 'image':
      return <PhotoIcon className={`${className} text-pink-400`} />;
    case 'pdf':
      return <DocumentTextIcon className={`${className} text-red-400`} />;
    case 'docx':
      return <DocumentTextIcon className={`${className} text-blue-400`} />;
    case 'excel':
      return <TableCellsIcon className={`${className} text-green-400`} />;
    case 'csv':
      return <TableCellsIcon className={`${className} text-teal-400`} />;
    case 'text':
      return <CodeBracketIcon className={`${className} text-gray-400`} />;
    default:
      return <QuestionMarkCircleIcon className={`${className} text-yellow-400`} />;
  }
};

export default FileIcon;