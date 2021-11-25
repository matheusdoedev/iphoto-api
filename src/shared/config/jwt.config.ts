import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig: JwtModuleOptions = {
  secret: 'H9-UI,[sC_4<vX8rV/M^&g~SaCWBpS+9LUsCh+o^}_28*17kA^5sh6_+jHto!Ay',
  signOptions: {
    expiresIn: '99d',
  },
};
