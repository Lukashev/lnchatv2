import React, { useContext, useState } from 'react'
import { useSnackbar } from 'react-simple-snackbar'
import cookies from 'react-cookies'
import { StyledLogin } from '../styled'
import { Button, Card, Col, Container, Form, Row, Spinner, Modal } from 'react-bootstrap'
import validator from 'validator'
import { AppContext } from '../store'

const { isEmail, isLength, equals } = validator

const snackOptions = {
  position: 'bottom-left',
  style: {
    zIndex: 9999,
    height: 'auto'
  }
}

const Login = ({ modalVisible, handleClose }) => {

  const [formType, setFormType] = useState('login')
  const [loading, setLoading] = useState(false)
  const [open] = useSnackbar(snackOptions)

  const { state, dispatch, api } = useContext(AppContext)
  const { email, username, password, retypePassword } = state.auth

  const handleChange = ({ target: { name, value } }) => {
    dispatch({ payload: { auth: { ...state.auth, [name]: value } } })
  }

  const onSubmit = async e => {
    e.preventDefault()
    if (formType === 'signup') {
      if (!isEmail(email)) {
        open('Email is invalid', 2000)
        return
      }
      if (!isLength(password, { min: 6 })) {
        open('Password must be at least 6 characters', 2000)
        return
      }
      if (!equals(password, retypePassword)) {
        open('Passwords do not match', 2000)
        return
      }
    }
    try {
      setLoading(true)
      const { data } = await api[formType](state.auth)
      if (formType === 'login') {
        handleClose()
        dispatch({ payload: { user: data.result }, authToken: data.token })
        cookies.save('Authorization', `Bearer ${data.token}`)
      } else {
        setFormType('login')
      }
      open(data.message, 2000)
    } catch ({ response }) {
      open(response?.data?.message, 2000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <StyledLogin show={modalVisible} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Please, login to get started!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container fluid className='pr-0'>
          <Row className='mr-0'>
            <Col md={12} className='pr-0 login-card d-flex flex-column justify-content-center align-items-center'>
              <Card>
                <Card.Body>
                  <Form noValidate className='w-100' onSubmit={onSubmit}>
                    <Card.Title className='mb-3 text-center'>{formType === 'login' ? 'Login' : 'Sign Up'}</Card.Title>
                    <Form.Group controlId='emailField'>
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type='email'
                        name='email'
                        placeholder='Type email'
                        value={email}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    {formType === 'signup' && <Form.Group controlId='usernameField'>
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        type='text'
                        name='username'
                        placeholder='Type username'
                        value={username}
                        onChange={handleChange}
                      />
                    </Form.Group>}
                    <Form.Group controlId='passwordField'>
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type='password'
                        name='password'
                        placeholder='Type password'
                        value={password}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    {formType === 'signup' && (
                      <Form.Group controlId='retypePasswordField'>
                        <Form.Label>Retype Password</Form.Label>
                        <Form.Control
                          type='password'
                          name='retypePassword'
                          placeholder='Retype password'
                          value={retypePassword}
                          onChange={handleChange} />
                      </Form.Group>
                    )
                    }
                    <div className='d-flex'>
                      <Button className='mr-2' variant='primary' type='submit'>
                        {loading ? <Spinner animation='border' /> : 'Submit'}
                      </Button>
                      <Button
                        variant='link'
                        onClick={() => setFormType(formType === 'login' ? 'signup' : 'login')}
                      >
                        {formType === 'login' ? 'Sign Up' : 'Login'}
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </StyledLogin>
  )
}

export default Login
