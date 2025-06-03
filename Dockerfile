# Use an official Node runtime as a parent image
FROM node:20-alpine As development

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this first prevents re-running npm install on every code change.
COPY package*.json ./

# Install app dependencies
RUN npm install --verbose
RUN npm list @nestjs/swagger || npm install @nestjs/swagger --verbose

# Bundle app source
COPY . .

# Build the application
RUN npm run build

# ---- Production stage ----
FROM node:20-alpine As production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --production

# Copy the built application from the development stage
COPY --from=development /usr/src/app/dist ./dist

# Expose port 3000 (the default NestJS port)
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main"]