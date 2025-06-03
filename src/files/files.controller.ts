import { Controller, Get, UseGuards } from '@nestjs/common';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Files')
@ApiBearerAuth()
@Controller('files')
export class FilesController {
    constructor(private readonly filesService: FilesService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Get all files' })
    @ApiResponse({ status: 200, description: 'List of files successfully retrieved.' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    getFiles() {
        return this.filesService.getFiles();
    }
}
