import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { Files } from './entities/files.entity';
import { ClassModule } from './class/class.module';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from './chat/chat.module';
import { EventModule } from './event/event.module';
import { QAModule } from './Q&A/Q&A.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 8800,
      username: 'root',
      password: 'root',
      database: 'startup',
      synchronize: true,
      entities: ['dist/**/*/*.entity{.ts,.js}'],
    }),
    TypeOrmModule.forFeature([Files]),
    ServeStaticModule.forRoot({
      rootPath: 'files',
      serveRoot: '/files',
    }),
    ConfigModule.forRoot(),
    AuthModule,
    UserModule,
    ClassModule,
    ChatModule,
    EventModule,
    QAModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
