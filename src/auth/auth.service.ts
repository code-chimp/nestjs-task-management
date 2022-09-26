import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import AuthCredentialsDto from './dto/auth-credentials.dto';
import User from './entities/user.entity';

@Injectable()
export default class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser({ username, password }: AuthCredentialsDto): Promise<User> {
    try {
      const salt = await bcrypt.genSalt();
      const hashed = await bcrypt.hash(password, salt);

      const user = this.usersRepository.create({
        username,
        password: hashed,
      });

      return await this.usersRepository.save(user);
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException('username already exists');
      }

      throw new InternalServerErrorException(
        'something went wrong saving the user, please check the logs',
      );
    }
  }

  async signIn({ username, password }: AuthCredentialsDto): Promise<string> {
    const user = await this.usersRepository.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      return 'success';
    }

    throw new UnauthorizedException('please check your credentials');
  }
}
