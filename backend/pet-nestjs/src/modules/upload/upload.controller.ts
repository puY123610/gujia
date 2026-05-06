import { BadRequestException, Body, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { ok } from '../../common/result/api-response'
import { AuthenticatedUser } from '../../common/types/authenticated-user'
import { ObjectStorageService } from '../../storage/object-storage.service'
import { UploadedFile as StorageUploadedFile, UploadScene } from '../../storage/object-storage.types'

const UPLOAD_SCENES = new Set<UploadScene>(['avatar', 'pet', 'lost', 'adoption', 'community'])

@Controller('upload')
export class UploadController {
  constructor(private readonly objectStorageService: ObjectStorageService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: StorageUploadedFile | undefined,
    @Body('scene') scene: UploadScene | undefined,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    if (!file) {
      throw new BadRequestException('File is required')
    }

    const normalizedScene = scene && UPLOAD_SCENES.has(scene) ? scene : 'community'
    return ok(await this.objectStorageService.upload(file, normalizedScene, user.id))
  }
}
