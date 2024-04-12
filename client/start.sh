#!/usr/bin/bash

NODE_DIRECTORY='node_modules'

if [ ! -d "$NODE_DIRECTORY" ]; then
  npm i
fi

npm run start