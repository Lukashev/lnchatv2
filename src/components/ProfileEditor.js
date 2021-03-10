import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useSnackbar } from 'react-simple-snackbar'
import { Button, Form, Modal, Spinner } from 'react-bootstrap'
import { SpinnerOverlay, StyledEditor } from '../styled'

const snackOptions = {
  position: 'bottom-center',
  style: {
    zIndex: 9999
  }
}
const defaultAvatar = 'assets/images/default-avatar.jpg'

const ProfileEditor = ({
  modalVisible = false,
  handleClose = () => { },
}) => {

  const { user, api } = useSelector(state => state)
  const [{ username, avatar, email, _id }, setUser] = useState(user)
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [open] = useSnackbar(snackOptions)

  const handleChange = ({ target: { name, value } }) => {
    setUser(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleAvatar = (e) => {
    const currentFile = e.target.files[0]
    setFile(currentFile)
  }

  const handleConfirm = async () => {
    try {
      setLoading(true)
      const formData = new FormData()
      if (file) {
        formData.append('avatar', file)
      }
      const payload = { email, username, _id }
      for (let key in payload) {
        formData.append(key, payload[key])
      }
      const { data } = await api.updateUser(formData)
      setUser(prevState => ({
        ...prevState,
        ...data.result
      }))
      open(`${data.message}. NOTE: Google cache changed images!`, 2000)
    } catch ({ response }) {
      open(String(response?.data), 2000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <StyledEditor
      show={modalVisible}
      onHide={handleClose}
      backdrop='static'
    >
      {loading && <SpinnerOverlay style={{ height: '100%' }}>
        <Spinner animation='border' role='status' />
      </SpinnerOverlay>}
      <Modal.Header closeButton>
        <Modal.Title>Edit Profile</Modal.Title>
      </Modal.Header>
      <img src={avatar || defaultAvatar} width={200} alt={`${username}'s avatar`} />
      <Modal.Body>
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type='email'
            name='email'
            placeholder='Type email'
            value={email}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control
            type='text'
            name='username'
            placeholder='Type username'
            value={username}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Upload avatar</Form.Label>
          <Form.Control
            type='file'
            name='avatar'
            placeholder='Choose avatar'
            onChange={handleAvatar}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant='secondary'
          onClick={handleClose}
        >
          Close
          </Button>
        <Button
          variant='primary'
          onClick={handleConfirm}
        >
          Confirm
          </Button>
      </Modal.Footer>
    </StyledEditor>
  )
}

export default ProfileEditor