import {
  Controller,
  Post,
  Body,
  UseGuards,
  ValidationPipe,
  Req, // Import Req to access the request object
} from '@nestjs/common';
import { FarmsService } from './farms.service';
import { CreateFarmDto } from './dto/create-farm.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

// This is a placeholder for a real authentication guard (e.g., from @nestjs/passport)
import { AuthGuard } from '../auth/auth.guard'; // Assuming you have a general AuthGuard

@Controller('farms')
export class FarmsController {
  constructor(private readonly farmsService: FarmsService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard) // First check if user is authenticated, then check role
  @Roles('farmer') // Only users with the 'farmer' role can access this
  create(
    @Body(new ValidationPipe()) createFarmDto: CreateFarmDto,
    @Req() req, // Get the whole request object
  ) {
    // In a real app, the user object would be reliably attached by your AuthGuard.
    // e.g., const user = req.user;
    // For this example, we'll use a mock or a placeholder ID.
    const mockUserId = req.user?.id || 'user-farmer-123';

    return this.farmsService.create(createFarmDto, mockUserId);
  }
}
