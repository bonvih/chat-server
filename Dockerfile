FROM node:14.17.6-buster
RUN mkdir $HOME/bonvih
WORKDIR $HOME/bonvih
COPY . .
EXPOSE 80
CMD ["node", "index.js"]