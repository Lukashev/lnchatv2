import React, { memo } from 'react'
import { useMediaQuery } from 'react-responsive'
import moment from 'moment'
import { string } from 'prop-types'
import { isEqual } from 'lodash'

const MessageItem = ({ text, created_at, from, authorId }) => {
  const identity = authorId === from ? 'to' : 'from'
  // check device
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 768px)' })
  const smallDevice = useMediaQuery({ query: '(max-width: 420px)' })
  const mobilePaddingStyle = identity === 'to' ? 'paddingLeft' : 'paddingRight'
  return (
    <div
      className={`messages-item--${identity} d-flex justify-content-${identity === 'to' ? 'end' : 'start'}`}>
      <div className='inner' style={{ [mobilePaddingStyle]: isTabletOrMobile ? smallDevice ? 20 : 100 : 'initial' }}>
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
