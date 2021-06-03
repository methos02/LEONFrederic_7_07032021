FROM node:14.17
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
RUN mkdir /app/images
RUN mkdir /app/images/avatar
RUN mkdir /app/images/post
COPY ./test/images/default_avatar.png /app/images/avatar
EXPOSE 3000
CMD ["npm", "run", "start"]
