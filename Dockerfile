FROM node:8

VOLUME /var/www/node

# COPY . /var/www/node
WORKDIR /var/www/node

ENV NODE_ENV testing
ENV PORT 3200

# RUN npm install

CMD ["node", "server/app.js"]

EXPOSE 3200
