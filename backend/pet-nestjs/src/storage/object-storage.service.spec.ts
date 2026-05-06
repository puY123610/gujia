import { ObjectStorageDriver, UploadedFile } from './object-storage.types'
import { ObjectStorageService } from './object-storage.service'

class FakeStorageDriver implements ObjectStorageDriver {
  keys: string[] = []

  async putObject(key: string) {
    this.keys.push(key)
  }

  publicUrl(key: string) {
    return `http://files.local/${key}`
  }
}

function imageFile(overrides: Partial<UploadedFile> = {}): UploadedFile {
  return {
    originalname: 'pet.png',
    mimetype: 'image/png',
    size: 1024,
    buffer: Buffer.from('image'),
    ...overrides,
  }
}

describe('ObjectStorageService', () => {
  it('rejects unsupported file types', async () => {
    const service = new ObjectStorageService(new FakeStorageDriver())

    await expect(
      service.upload(imageFile({ mimetype: 'application/pdf' }), 'pet', 'user-1'),
    ).rejects.toThrow('Only jpeg, png and webp images are supported')
  })

  it('rejects oversized files', async () => {
    const service = new ObjectStorageService(new FakeStorageDriver())

    await expect(
      service.upload(imageFile({ size: 10 * 1024 * 1024 + 1 }), 'pet', 'user-1'),
    ).rejects.toThrow('File size must be 10MB or smaller')
  })

  it('stores valid images and returns the public file shape', async () => {
    const driver = new FakeStorageDriver()
    const service = new ObjectStorageService(driver)

    const result = await service.upload(imageFile(), 'pet', 'user-1')

    expect(result.fileKey).toMatch(/^pet\/user-1\/.+\.png$/)
    expect(result.fileUrl).toBe(`http://files.local/${result.fileKey}`)
    expect(result.contentType).toBe('image/png')
    expect(driver.keys).toEqual([result.fileKey])
  })
})
