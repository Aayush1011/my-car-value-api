import {
  Controller,
  Post,
  Body,
  UseGuards,
  Patch,
  Param,
  ParseIntPipe,
  Get,
  Query,
} from '@nestjs/common';
import { AddReportDto } from './dtos/add-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '@src/guards/auth.guard';
import { CurrentUser } from '@src/users/decorators/current-user.decorator';
import { User } from '@src/users/user.entity';
import { Serialize } from '@src/interceptors/serialize.interceptor';
import { ReportDto } from './dtos/report.dto';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { AdminGuard } from '@src/guards/admin.guards';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@UseGuards(AuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Serialize(ReportDto)
  @Post()
  addReport(@CurrentUser() user: User, @Body() body: AddReportDto) {
    return this.reportsService.create(user, body);
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  approveReport(
    @Param('id', ParseIntPipe) id: number,
    @Body() { approved }: ApproveReportDto,
  ) {
    return this.reportsService.approve(id, approved);
  }

  @Get()
  getEstimate(@Query() query: GetEstimateDto) {
    return this.reportsService.estimate(query);
  }
}
