import { createLogger, format, transports, transport } from 'winston';
import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';
import config from '@/config';

const transportation: transport[] = [];

if (!config.LOGTAIL_SOURCE_TOKEN || !config.LOGTAIL_INGESTING_HOST) {
  throw new Error('Logtail Source Token or Ingesting Host is missing!');
}

const logtail = new Logtail(config.LOGTAIL_SOURCE_TOKEN, {
  endpoint: config.LOGTAIL_INGESTING_HOST,
});

if (config.NODE_ENV === 'production') {
  transportation.push(new LogtailTransport(logtail));
}

const { colorize, combine, timestamp, label, printf } = format;

if (config.NODE_ENV === 'development') {
  transportation.push(
    new transports.Console({
      format: combine(
        colorize({ all: true }),
        label(),
        timestamp({ format: 'DD MMMM hh:mm:ss A' }),
        printf(({ level, message, timestamp }) => {
          return `${timestamp}[${level}]: ${message}`;
        }),
      ),
    }),
  );
}

const logger = createLogger({
  transports: transportation,
});

export { logtail, logger };
