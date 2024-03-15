import { Injectable } from '@nestjs/common'
import { writeFile, unlink } from 'fs/promises'
import * as path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { Uploads } from './entities/uploads.entity'

@Injectable()
export class UploadsService {
  async saveImages(files: Express.Multer.File[]) {
    const images = files['image']
    const destination = process.env.UPLOADS_FILE_IMAGES
    const imagesName: Uploads[] = []
    for (const i in images) {
      try {
        if (images[i].mimetype.includes('image')) {
          const fileName =
            path.parse(images[i].originalname).name.replace(/\s/g, '') +
            '-' +
            uuidv4()

          const extension = path.parse(images[i].originalname).ext
          await writeFile(
            `${destination}/${fileName}${extension}`,
            images[i].buffer,
          )

          imagesName.push({ fileName, extension })
        }
      } catch (error) {
        throw new Error('error saving image')
      }
    }
    return imagesName
  }

  async saveUserImage(file: Express.Multer.File) {
    const image = file
    const destination = process.env.UPLOADS_USERS_IMAGES
    try {
      if (image.mimetype.includes('image')) {
        const fileName =
          path.parse(image.originalname).name.replace(/\s/g, '') +
          '-' +
          uuidv4()

        const extension = path.parse(image.originalname).ext
        await writeFile(`${destination}/${fileName}${extension}`, image.buffer)

        return {
          fileName,
          extension,
        }
      }
    } catch (error) {
      console.log(error)
      throw new Error('error saving image')
    }
  }

  async deleteImages(files: Uploads[]) {
    const destination = process.env.UPLOADS_USERS_IMAGES
    for (const i in files) {
      try {
        await unlink(`${destination}/${files[i].fileName}${files[i].extension}`)
      } catch (error) {
        throw new Error('error when deleting image')
      }
    }
  }

  async deleteUserImage(file: Uploads) {
    const destination = process.env.UPLOADS_USERS_IMAGES
    try {
      await unlink(`${destination}/${file.fileName}${file.extension}`)
    } catch (error) {
      throw new Error('error when deleting image')
    }
  }
}
