import configYaml from 'config-yaml'

const DEFAULT_FILE = 'default.yml', PRODUCTION_FILE = 'production.yml'
const config = configYaml(`${__dirname}/${process.env.NODE_ENV === 'production' ? PRODUCTION_FILE : DEFAULT_FILE}`)

export default {
  JWT_SECRET: config.JWT_SECRET,
  DB_URL: config.DB_URL
}