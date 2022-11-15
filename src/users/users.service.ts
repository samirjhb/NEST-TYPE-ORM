import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Profile } from './entities/profile.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
  ) {}

  //Crear User
  async create(createUserDto: CreateUserDto) {
    const userFound = await this.userRepository.findOne({
      where: {
        username: createUserDto.username,
      },
    });
    if (userFound) {
      return new HttpException('User Already exists', HttpStatus.CONFLICT);
    }

    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  findAll() {
    return this.userRepository.find({
      relations: ['posts', 'profile'],
    });
  }

  async getUser(id: number) {
    const userFound = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: ['posts'],
    });

    if (!userFound) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return userFound;
  }

  //Actualizar data User
  async update(id: number, updateUserDto: UpdateUserDto) {
    const userFound = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!userFound) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const updateUser = Object.assign(userFound, updateUserDto);
    return this.userRepository.save(updateUser);

    //return this.userRepository.update(id, updateUserDto);
  }

  //Eliminar Usuario
  async remove(id: number) {
    const result = await this.userRepository.delete({ id });
    if (result.affected === 0) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  async createProfile(id: number, profile: CreateProfileDto) {
    //buscando el usuario
    const userFound = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!userFound) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const newProfile = this.profileRepository.create(profile); //Creo  el nuevo perfil
    const savedProfile = await this.profileRepository.save(newProfile); // Guardo perfil
    userFound.profile = savedProfile; //Relacion con la otra tabla de user
    return this.userRepository.save(userFound); //Guardar en la tabla de user
  }
}
