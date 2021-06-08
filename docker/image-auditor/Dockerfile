# Image node 
FROM node:14.16.1

# Copy the content of src into /opt/app
COPY src /opt/app

# Change the current directory to make npm install
WORKDIR /opt/app

# Install the current project's dependencies
RUN npm install

# Command to be executed when running a container
ENTRYPOINT ["node", "/opt/app/auditor.js"]