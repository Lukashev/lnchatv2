import React, { memo } from 'react'
import moment from 'moment'
import { string } from 'prop-types'
import { isEqual } from 'lodash'

const MessageItem = ({ text, created_at, from, authorId }) => {
  const identity = authorId === from ? 'to' : 'from'
  return (
    <div
      className={`messages-item--${identity} d-flex justify-content-${identity === 'to' ? 'end' : 'start'}`}>
      <div className='inner'>
        <div className={`messages-item--${identity}-item d-flex flex-column`}>
          <span>{text}</span>
          <span>{moment(created_at).format('LT')}</span>
        </div>
      </div>
    </div>
  )
}

MessageItem.propTypes = {
  text: string.isRequired,
  created_at: string.isRequired,
  from: string.isRequired,
  to: string.isRequired,
  authorId: string.isRequired
}

export default memo(MessageItem, (prevProps, nextProps) => {
  return isEqual(prevProps, nextProps)
})
