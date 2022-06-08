FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
COPY . .
RUN npm ci --omit-dev
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "run", "production"]