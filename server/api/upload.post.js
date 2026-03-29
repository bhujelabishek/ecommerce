import multer from 'multer'

const storage = multer.diskStorage({
  destination: 'public/uploads',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({ storage })

export default defineEventHandler((event) => {
  return new Promise((resolve, reject) => {
    upload.single('file')(event.req, event.res, (err) => {
      if (err) return reject(err)

      resolve({
        path: `/uploads/${event.req.file.filename}`
      })
    })
  })
})
