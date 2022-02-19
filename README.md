# HorwangSchoolRegister
contribute student registration solution for Horwang School by Dakok's software development team

## installation
1. backend
   - copy `.env.example` to `.env` and update configuration
   - change directory to backend directory with `cd backend`
   - install dependencies with `npm i`
   - run compile with `tsc`
   - run app with `node dist` or `pm2 start dist/index.js -i {cluster} --name {process label}`
2. frontend
   - copy `.env.example` to `.env` and update configuration
   - change directory to backend directory with `cd frontend`
   - install dependencies with `yarn install`
   - run compile with `yarn build`
   - run app with `serve dist` or `pm2 serve dist --name {process label}`
