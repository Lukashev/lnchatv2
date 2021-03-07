import React from 'react'
import { string } from 'prop-types'

const MessageSection = ({ children, date }) => {
  return (
    <div className='messages-item'>
      <span className='messages-item--date'>{date}</span>
      {children}
    </div>
  )
}

MessageSection.propTypes = {
  date: string.isRequired
}

export default MessageSection
