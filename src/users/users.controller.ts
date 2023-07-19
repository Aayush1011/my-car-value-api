import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  Delete,
  NotFoundException,
  ParseIntPipe,
  Session,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { SignUpUserDto } from './dtos/signup-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from 'src/users/dtos/user.dto';
import { AuthService } from './auth.service';
import { SignInUserDto } from './dtos/signin-user.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from 'src/guards/auth.guard';

@Serialize(UserDto)
@Controller('auth')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  async signUpUser(
    @Body() { email, password }: SignUpUserDto,
    @Session() session: any,
  ) {
    const user = await this.authService.signUp(email, password);
    session.userId = user.id;
    return user;
  }

  @Post('signin')
  async signInUser(
    @Body() { email, password }: SignInUserDto,
    @Session() session: any,
  ) {
    const user = await this.authService.signIn(email, password);
    session.userId = user.id;
    return user;
  }

  @Post('signout')
  async signOutUser(@Session() session: any) {
    session.userId = null;
  }

  @UseGuards(AuthGuard)
  @Get('whoami')
  whoami(@CurrentUser() user: User) {
    return user;
  }

  @Get()
  findAllUsers() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ) {
    return this.usersService.update(id, body);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.delete(id);
  }
}
