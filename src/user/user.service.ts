// user.service.ts
import { Injectable, BadRequestException, HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { User } from './user.entity';
import { RegisterDto } from './dto/request.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectQueue('user')
    private readonly userQueue: Queue,
  ) {}
  async isEmailUnique(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email } });
    return !user;
  }

  async createUser(createUserDto: RegisterDto): Promise<User> {
    const { name, email, password } = createUserDto;

    const isUnique = await this.isEmailUnique(email);
    if (!isUnique) {
      throw new HttpException('ERR_USER_EMAIL_EXISTS', 400);
    }

    const user = await this.userRepository.save(
      this.userRepository.create({
        name,
        email,
        password: password,
        status: false,
      }),
    );

    await this.userQueue.add('status', { userId: user.id }, { delay: 10000 });

    return user;
  }
  async getUserById(userId: number): Promise<User> {
    const key = `user:${userId}`;
    const redisClient = this.userQueue.client;

    const cachedUser = await redisClient.get(key);
    if (cachedUser) {
      return JSON.parse(cachedUser);
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('ERR_USER_NOT_FOUND', 400);
    }

    await redisClient.set(key, JSON.stringify(user), 'EX', 1800);

    return user;
  }
  async changeStatus(userId: number, status: boolean): Promise<void> {
    const result = await this.userRepository.update(userId, { status: status });
  }
}
