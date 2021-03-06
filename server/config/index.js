import configYaml from 'config-yaml'

const config = configYaml(`${__dirname}/default.yml`)

export default {
  JWT_SECRET: config.JWT_SECRET,
  DB_URL: config.DB_URL
}