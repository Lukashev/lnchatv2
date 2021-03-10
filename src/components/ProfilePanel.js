import React, { useState } from 'react'
import cookies from 'react-cookies'
import { oneOf, string } from 'prop-types'
import { ListGroup } from 'react-bootstrap'
import Login from './Login'
import { useDispatch, useSelector } from 'react-redux'
import ProfileEditor from './ProfileEditor'

const defaultAvatar = 'assets/images/default-avatar.jpg'

const ProfilePanel = ({ username = 'Anonymous', avatar, status }) => {
  const [listVisible, setListVisible] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editorVisible, setEditorVisible] = useState(false)
  const state = useSelector(state => state)
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch({
      type: 'SET_MAIN_STATE',
      payload: {
        user: null,
        authToken: null,
        activeRoom: null
      }
    })
    cookies.remove('Authorization')
    state.socket?.disconnect()
  }

  const handleCloseDialog = () => {
    dispatch({
      type: 'SET_MAIN_STATE',
      payload: {
        activeRoom: null
      }
    })
  }

  return (
    <div className='profile-panel d-flex justify-content-between align-items-center'>
      {state.activeRoom && <i className='fas fa-2x fa-backward' onClick={handleCloseDialog}></i>}
      <img src={avatar || defaultAvatar} alt='' className={`profile-panel--avatar ${status}`} />
      <div className='d-flex flex-column justify-content-center'>
        <h4 className='profile-panel--name mb-0'>{username}</h4>
        <div className='profile-panel--status d-flex align-items-center justify-content-around'>
          <span className={`${username}`}></span>
          <span>{status}</span>
          <span>
            <i className='arrow down profile-panel--status--arrow'></i>
          </span>
        </div>
      </div>
      {state.user && <ProfileEditor
        modalVisible={editorVisible}
        handleClose={() => setEditorVisible(false)}
      />}
      <Login modalVisible={modalVisible} handleClose={() => setModalVisible(false)} />
      <span className='menu-btn' onClick={() => setListVisible(prev => !prev)}>
        <span className='menu-btn--item'></span>
        <span className='menu-btn--item'></span>
        <span className='menu-btn--item'></span>
        {listVisible && <ListGroup className='profile-panel--action-list'>
          {state.user ? (
            <>
              <ListGroup.Item onClick={() => setEditorVisible(true)}>Edit Profile</ListGroup.Item>
              <ListGroup.Item onClick={handleLogout}>Logout</ListGroup.Item>
            </>
          ) : (
              <ListGroup.Item onClick={() => setModalVisible(true)}>Login</ListGroup.Item>
            )}
        </ListGroup>}
      </span>
    </div>
  )
}

ProfilePanel.propTypes = {
  avatar: string,
  username: string,
  status: oneOf(['offline', 'online', 'busy', 'away'])
}

ProfilePanel.defaultProps = {
  avatar: defaultAvatar,
  username: 'Anonymous',
  status: 'offline'
}


export default ProfilePanel
