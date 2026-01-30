import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CaptchaService {
    private readonly logger = new Logger(CaptchaService.name);
    // Using require here as the package might not have TS types or is a CJS module
    private readonly siarashield = require('siarashield');
    private readonly PRIVATE_KEY = 'TEST-CYBERSIARA'; // Use TEST-CYBERSIARA for staging/development

    async validateToken(token: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.siarashield.validate(this.PRIVATE_KEY, token, (response, error) => {
                if (error) {
                    this.logger.error('Captcha validation error:', error);
                    return reject(error);
                }

                this.logger.log('Captcha validation response:', response);

                if (response.Message === 'Verified') {
                    resolve({ success: true, message: 'Verified', data: response });
                } else {
                    // "Token is missing", "Token expired" or other messages
                    resolve({ success: false, message: response.Message, data: response });
                }
            });
        });
    }
}
