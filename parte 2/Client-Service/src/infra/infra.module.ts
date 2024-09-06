import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database/database.module";
import { LoginUseCase } from "src/application/use-cases/login";
import { CreateUserUseCase } from "src/application/use-cases/create";
import { UserController } from "./controllers/user";

@Module({
  imports: [DatabaseModule],
  providers: [LoginUseCase, CreateUserUseCase],
  controllers: [UserController],
})
export class InfraModule {}
