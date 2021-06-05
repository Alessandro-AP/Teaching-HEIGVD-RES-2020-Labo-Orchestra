# Image node 
FROM node:14.16.1

# Copy the content of src into /opt/app
COPY src /opt/app

# Initialize npm project with default values
RUN npm init -y

# Install the current project's dependencies
RUN npm install uuid

# Command to be executed when running a container
ENTRYPOINT ["node", "/opt/app/musician.js"]