import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MinioStorageDriver } from './minio-storage.driver'
import { OBJECT_STORAGE_DRIVER } from './object-storage.types'
import { ObjectStorageService } from './object-storage.service'

@Module({
  providers: [
    ObjectStorageService,
    {
      provide: OBJECT_STORAGE_DRIVER,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const driver = configService.get<string>('STORAGE_DRIVER') || 'minio'
        if (driver === 'minio') {
          return new MinioStorageDriver(configService)
        }

        throw new Error(`Storage driver '${driver}' is reserved but not implemented in MVP`)
      },
    },
  ],
  exports: [ObjectStorageService],
})
export class StorageModule {}
