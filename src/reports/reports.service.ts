import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { AddReportDto } from './dtos/add-report.dto';
import { User } from '@src/users/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
  ) {}

  create(user: User, reportDto: AddReportDto) {
    const report = this.reportRepository.create({ ...reportDto, user });
    return this.reportRepository.save(report);
  }

  async approve(id: number, approved: boolean) {
    const report = await this.reportRepository.findOneBy({ id });
    if (!report) {
      throw new NotFoundException('Invalid report id');
    }
    report.approved = approved;
    return this.reportRepository.save(report);
  }

  estimate({
    manufacturer,
    model,
    latitude,
    longitude,
    year,
    mileage,
  }: GetEstimateDto) {
    return this.reportRepository
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('approved IS TRUE')
      .andWhere('manufacturer = :manufacturer', { manufacturer })
      .andWhere('model = :model', { model })
      .andWhere('latitude - :latitude BETWEEN -5 AND 5', { latitude })
      .andWhere('longitude - :longitude BETWEEN -5 AND 5', { longitude })
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .orderBy(`ABS(mileage - :mileage)`, 'DESC')
      .setParameters({ mileage })
      .limit(3)
      .getRawOne();
  }
}
