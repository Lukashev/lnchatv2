import { isEqual } from 'lodash'
import moment from 'moment'
import { string, array, object, bool, func } from 'prop-types'
import React, { memo } from 'react'

const ChatItem = ({
  chat_guest: { status, avatar, username },
  messages = [],
  created_at,
  focused,
  handleClick,
  _id
}) => {
  return (
    <div
    onClick={() => handleClick(_id)}
    className={`chat-list--item d-flex align-items-center ${status} ${focused ? 'focused' : ''}`}>
      <img
        src={avatar || 'assets/images/default-avatar.jpg'}
        alt={`${username} avatar`}
        className="chat-list--avatar"
      />
      <div className="chat-list--info d-flex flex-column">
        <div className="chat-list--info--header d-flex align-items-center justify-content-between">
          <h4 className="chat-list--info-title mb-0">
            {username}
          </h4>
          <span className="chat-list--info-date">
            {created_at ? moment(created_at).format('ll') : 'N/A'}
          </span>
        </div>
        <div className="d-flex justify-content-between">
          <span className="chat-list--msg">
            {messages.length ? messages[messages.length - 1] : 'Write the first message...'}
        </span>
        </div>
      </div>
    </div>
  )
}

ChatItem.propTypes = {
  messages: array,
  chat_guest: object.isRequired,
  chat_owner: object.isRequired,
  created_at: string,
  focused: bool.isRequired,
  handleClick: func
}

ChatItem.defaultProps = {
  chat_guest: {},
  chat_owner: {},
  handleClick: () => {}
}

export default memo(ChatItem, (prevProps, nextProps) => {
  return isEqual(prevProps, nextProps)
})
