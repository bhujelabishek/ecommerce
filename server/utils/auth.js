import jwt from 'jsonwebtoken'

const SECRET = 'MY_SECRET_KEY'

// Generate JWT token
export const generateToken = (user) => {
    console.log('GENERATING TOKEN FOR:', user.id)
 return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role  
    },
    SECRET,
    { expiresIn: '7d' }
  )
}

// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET)
  } catch (err) {
    throw new Error('Invalid Token')
  }
}