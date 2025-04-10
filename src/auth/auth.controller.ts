import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // // User signup
  // @Post('signup')
  // async signup(@Body() body: any, @Res() res: Response) {
  //   const result = signupSchema.safeParse(body);
  //   if (!result.success)
  //     throw new HttpException('Validation failed', HttpStatus.BAD_REQUEST);

  //   const existing = await UserModel.findOne({ email: body.email });
  //   if (existing)
  //     throw new HttpException('User exists', HttpStatus.BAD_REQUEST);

  //   const hashed = await this.authService.hashPassword(body.password);
  //   const user = await UserModel.create({ ...body, password: hashed });
  //   const sessionId = new mongoose.Types.ObjectId().toString();
  //   user.sessions.push({ id: sessionId, createdAt: new Date() });
  //   await user.save();

  //   // Generate encrypted "token"
  //   const token = this.authService.generateToken(user._id.toString());

  //   res.json({ sessionId, token });
  // }

  // // User signin
  // @Post('signin')
  // async signin(@Body() body: any, @Res() res: Response) {
  //   const result = signinSchema.safeParse(body);
  //   if (!result.success)
  //     throw new HttpException('Validation failed', HttpStatus.BAD_REQUEST);

  //   const user = await UserModel.findOne({ email: body.email });
  //   if (
  //     !user ||
  //     !(await this.authService.validatePassword(body.password, user.password))
  //   ) {
  //     throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
  //   }

  //   const sessionId = new mongoose.Types.ObjectId().toString();
  //   user.sessions.push({ id: sessionId, createdAt: new Date() });
  //   await user.save();

  //   // Generate encrypted "token"
  //   const token = this.authService.generateToken(user._id.toString());

  //   res.json({ sessionId, token });
  // }

  // Validate session
  // @Get('session/:id')
  // async validateSession(@Param('id') id: string) {
  //   const user = await UserModel.findOne({ 'sessions.id': id });
  //   if (!user) return { valid: false };
  //   const session = user.sessions.find((s) => s.id === id);
  //   const expired =
  //     new Date(session.createdAt).getTime() + 3600000 < Date.now();
  //   return { valid: !expired };
  // }

  // // Logout
  // @Delete('session/:id')
  // async logout(@Param('id') id: string) {
  //   const user = await UserModel.findOne({ 'sessions.id': id });
  //   if (!user) return { success: false };
  //   user.sessions = user.sessions.filter((s) => s.id !== id);
  //   await user.save();
  //   return { success: true };
  // }
}
