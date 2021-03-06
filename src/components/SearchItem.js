import { Button } from 'react-bootstrap'
import { string, func, oneOf } from 'prop-types'
import { isEqual } from 'lodash'
import React, { memo } from 'react'
import { StyledSearchItem } from '../styled'

const defaultAvatar = 'assets/images/default-avatar.jpg'

const SearchItem = ({ username, avatar, _id, status = 'offline', handleChatStart }) => {
  return (
    <StyledSearchItem className={`d-flex border-bottom my-3 pt-2 pb-2 chat-list--item d-flex align-items-center ${status}`}>
      <div className='info-block'>
        <img src={avatar || defaultAvatar} alt={`${username} avatar`}  className='info-block--avatar' />
        <strong>{username}</strong>
      </div>
      <div className='action-block text-right'>
        <Button variant='primary' onClick={() => handleChatStart({ username, avatar, _id })}>
          Start chat
        </Button>
      </div>
    </StyledSearchItem>
  )
}

SearchItem.propTypes = {
  _id: string.isRequired,
  username: string.isRequired,
  avatar: string,
  status: oneOf(['offline', 'online', 'busy', 'away']),
  handleChatStart: func.isRequired
}

SearchItem.defaultProps = {
  handleChatStart: () => {}
}

export default memo(SearchItem, (prevProps, nextProps) => {
  return isEqual(prevProps, nextProps)
})