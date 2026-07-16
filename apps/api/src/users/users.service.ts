import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export type UpdateUserData = {
  name?: string;
  hashedRefreshToken?: string | null;
  password?: string;
};

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: { email: string; password: string; name?: string }) {
    return this.prisma.user.create({ data });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateUserData) {
    return this.prisma.user.update({ where: { id }, data });
  }
}
