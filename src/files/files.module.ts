
import { PrismaModule } from '../prisma/prisma.module';
import {Module} from "@nestjs/common";
import {FilesService} from "./files.service";
import {FilesController} from "./files.controller";

@Module({
    imports: [
        PrismaModule,
    ],
    controllers: [FilesController],
    providers: [FilesService],
    exports: [FilesService],
})
export class FilesModule {}
