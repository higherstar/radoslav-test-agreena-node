export enum ResponseStatus {
  SUCCESS = 'Success',
  FAILED = 'Failed',
  INVALID_EMAIL_PASSWORD = 'InvalidEmailOrPassword',
  EXPIRED_JWT = 'ExpiredJwt',
}

export enum CertificateStatus {
  AVAILABLE = 'AVAILABLE',
  OWNED = 'OWNED',
  TRANSFERRED = 'TRANSFERRED',
}