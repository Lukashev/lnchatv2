import actions from '@root/api/actions'

export default async function() {
  try {
    const updatedUser = await actions.update({ 
      sessionId: null, 
      status: 'offline',
      _id: this.socket.request.user?.id 
    }, 
    'User')
    this.io.emit('user_status', { userId: updatedUser._id, status: updatedUser.status })
  } catch (e) {
    console.log(e)
    throw new Error(e)
  }
}