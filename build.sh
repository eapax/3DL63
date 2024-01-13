#!/bin/bash

# use vite to build app
npx vite build

# add extra assets missed by vite
cp ./assets/l63_hist.npy ./dist/assets/
cp ./assets/l63_point_cloud.npy ./dist/assets/
cp -r ./assets/fonts ./dist/assets/
