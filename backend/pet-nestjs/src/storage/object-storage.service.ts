import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { randomUUID } from 'node:crypto'
import {
  OBJECT_STORAGE_DRIVER,
  ObjectStorageDriver,
  StoredFile,
  UploadedFile,
  UploadScene,
} from './object-storage.types'

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const DEFAULT_MAX_BYTES = 10 * 1024 * 1024

@Injectable()
export class ObjectStorageService {
  constructor(
    @Inject(OBJECT_STORAGE_DRIVER)
    private readonly driver: ObjectStorageDriver,
  ) {}

  async upload(file: UploadedFile, scene: UploadScene, userId: string): Promise<StoredFile> {
    this.validate(file)

    const fileKey = this.buildFileKey(file.originalname, scene, userId)
    await this.driver.putObject(fileKey, file)

    return {
      fileUrl: this.driver.publicUrl(fileKey),
      fileKey,
      contentType: file.mimetype,
    }
  }

  private validate(file: UploadedFile) {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      throw new BadRequestException('Only jpeg, png and webp images are supported')
    }

    if (file.size > DEFAULT_MAX_BYTES) {
      throw new BadRequestException('File size must be 10MB or smaller')
    }

    if (!file.buffer || file.buffer.length === 0) {
      throw new BadRequestException('File content is empty')
    }
  }

  private buildFileKey(originalName: string, scene: UploadScene, userId: string) {
    const extension = this.safeExtension(originalName)
    return `${scene}/${userId}/${Date.now()}-${randomUUID()}${extension}`
  }

  private safeExtension(originalName: string) {
    const extension = originalName.toLowerCase().match(/\.[a-z0-9]+$/)?.[0]
    return extension || ''
  }
}
