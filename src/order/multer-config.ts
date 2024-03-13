import { BadRequestException } from '@nestjs/common'
import { diskStorage } from 'multer'
import * as path from 'path'
import { v4 as uuidv4 } from 'uuid'

const multerConfig = {
  storage: diskStorage({
    destination: './uploads/files/orderservices',
    filename: (req, file, cb) => {
      if (file.mimetype.includes('image')) {
        const fileName =
          path.parse(file.originalname).name.replace(/\s/g, '') + '-' + uuidv4()
        const extension = path.parse(file.originalname).ext
        cb(null, `${fileName}${extension}`)
      } else {
        cb(new BadRequestException('Only images are allowed!'), '')
      }
    },
  }),
}

export default multerConfig
