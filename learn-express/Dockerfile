FROM node:latest
WORKDIR /learn-express
COPY . .
ENV PORT=3000
RUN npm i
EXPOSE $PORT
ENTRYPOINT [ "npm", "start" ]