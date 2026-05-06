export type UploadScene = 'avatar' | 'pet' | 'lost' | 'adoption' | 'community'

export interface UploadedFile {
  originalname: string
  mimetype: string
  size: number
  buffer: Buffer
}

export interface StoredFile {
  fileUrl: string
  fileKey: string
  contentType: string
}

export interface ObjectStorageDriver {
  putObject(key: string, file: UploadedFile): Promise<void>
  publicUrl(key: string): string
}

export const OBJECT_STORAGE_DRIVER = Symbol('OBJECT_STORAGE_DRIVER')
