import React from 'react'
import DOMPurify from 'isomorphic-dompurify';

interface Props {
  value: string;
}

const RichTextDisplay: React.FC<Props> = ({ value }) => {  
  const sanitizedValue = () => ({
    __html: DOMPurify.sanitize(value)
  })
  return (
    <div className='rich-text-display'>
      <span dangerouslySetInnerHTML={sanitizedValue()} className="list-disc list-inside" />
    </div>
  )
}

export default RichTextDisplay