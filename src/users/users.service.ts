import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hash } from 'bcrypt';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto) {
    const createdUser = new this.userModel(createUserDto);
    createdUser.password = await hash(createdUser.password, 10);
    try {
      const user = await createdUser.save();
      return {
        id: user._id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        profileImage: user.profileImage,
      };
    } catch (error) {
      throw new UnprocessableEntityException();
    }
  }

  async findAll() {
    const users = await this.userModel.find().exec();
    return users.map((user) => ({
      id: user._id,
      email: user.email,
      phone: user.phone,
      name: user.name,
    }));
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException();
    return {
      id: user._id,
      email: user.email,
      phone: user.phone,
      name: user.name,
      profileImage: user.profileImage,
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException();
    const updateUser = new this.userModel(updateUserDto);
    try {
      updateUser.password = await hash(updateUser.password, 10);
      user.email = updateUser.email;
      user.phone = updateUser.phone;
      user.password = updateUser.password;
      user.name = updateUser.name;
      await user.save();
      return {
        id: user._id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        profileImage: user.profileImage,
      };
    } catch (error) {
      throw new UnprocessableEntityException();
    }
  }

  async remove(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException();
    try {
      await this.userModel.deleteOne({ _id: id });
    } catch (error) {
      throw new UnprocessableEntityException();
    }
  }

  async uploadImage(file: Express.Multer.File, id: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException();
    try {
      user.profileImage = {
        name: file.originalname,
        data: file.buffer.toString('base64'),
      };
      await user.save();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
