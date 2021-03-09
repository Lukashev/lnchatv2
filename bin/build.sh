rm -rf build
npm run build
cd server
rm -rf dist
npm run build
rm -rf ./dist/build
mv -v ../build ./dist
