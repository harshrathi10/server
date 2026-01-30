import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CaptchaService {
    private readonly logger = new Logger(CaptchaService.name);
    // Using require here as the package might not have TS types or is a CJS module
    private readonly siarashield = require('siarashield');
    private readonly PRIVATE_KEY = process.env.CYBERSIARA_PRIVATE_KEY || 'TEST-CYBERSIARA';

    async validateToken(token: string): Promise<any> {
        this.logger.log(`Validating token. Private Key: ${this.PRIVATE_KEY.substring(0, 5)}...`);
        this.logger.log(`Token received (length ${token.length}): ${token.substring(0, 10)}...`);

        return new Promise((resolve, reject) => {
            if (!this.PRIVATE_KEY) {
                this.logger.error('CYBERSIARA_PRIVATE_KEY is missing!');
                return reject(new Error('Server configuration error: Private Key missing'));
            }

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
