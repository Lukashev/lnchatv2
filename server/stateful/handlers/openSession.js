import actions from '@root/api/actions'

export default async function(status = 'online') {
  try {
    const updatedUser = await actions.update({ 
      sessionId: this.socket.id, 
      status,
      _id: this.socket.request.user.id 
    }, 
    'User')
    this.io.emit('user_status', { userId: updatedUser._id, status: updatedUser.status })
  } catch (e) {
    throw new Error(e)
  }
}