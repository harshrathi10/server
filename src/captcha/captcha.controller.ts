import { Controller, Post, Body, Res } from '@nestjs/common';
import { CaptchaService } from './captcha.service';
import type { Response } from 'express';

@Controller('captcha')
export class CaptchaController {
    constructor(private readonly captchaService: CaptchaService) { }

    @Post('validate')
    async validate(@Body() body: { token: string }, @Res() res: Response) {
        const { token } = body;
        if (!token) {
            return res.status(400).json({ message: 'Token is missing' });
        }

        try {
            const result = await this.captchaService.validateToken(token);
            if (result.success) {
                return res.status(200).json(result);
            } else {
                return res.status(400).json(result);
            }
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }
}
