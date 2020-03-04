/* eslint-disable no-bitwise */
import crypto from 'crypto';

// https://stackoverflow.com/a/40191779/1179377
export default () => crypto.randomBytes(16).toString('hex');
