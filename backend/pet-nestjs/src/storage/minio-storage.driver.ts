import { ConfigService } from '@nestjs/config'
import { Client } from 'minio'
import { ObjectStorageDriver, UploadedFile } from './object-storage.types'

export class MinioStorageDriver implements ObjectStorageDriver {
  private readonly client: Client
  private readonly bucket: string
  private readonly endpoint: string
  private readonly port: number
  private readonly useSsl: boolean

  constructor(private readonly configService: ConfigService) {
    this.endpoint = this.configService.get<string>('MINIO_ENDPOINT') || 'localhost'
    this.port = Number(this.configService.get<string>('MINIO_PORT') || 9000)
    this.useSsl = this.configService.get<string>('MINIO_USE_SSL') === 'true'
    this.bucket = this.configService.get<string>('MINIO_BUCKET') || 'pet-platform'

    this.client = new Client({
      endPoint: this.endpoint,
      port: this.port,
      useSSL: this.useSsl,
      accessKey: this.configService.get<string>('MINIO_ACCESS_KEY') || 'minioadmin',
      secretKey: this.configService.get<string>('MINIO_SECRET_KEY') || 'minioadmin',
    })
  }

  async putObject(key: string, file: UploadedFile) {
    await this.ensureBucket()
    await this.client.putObject(this.bucket, key, file.buffer, file.size, {
      'Content-Type': file.mimetype,
    })
  }

  publicUrl(key: string) {
    const configuredBaseUrl = this.configService.get<string>('PUBLIC_FILE_BASE_URL')
    if (configuredBaseUrl) {
      return `${configuredBaseUrl.replace(/\/$/, '')}/${key}`
    }

    const protocol = this.useSsl ? 'https' : 'http'
    return `${protocol}://${this.endpoint}:${this.port}/${this.bucket}/${key}`
  }

  private async ensureBucket() {
    const exists = await this.client.bucketExists(this.bucket).catch(() => false)
    if (!exists) {
      await this.client.makeBucket(this.bucket)
    }
  }
}
