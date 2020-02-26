deploy: copy-assets build
	sh deploy.sh

build:
	npm run build;

genGM:
	mkdir -p tmp;\
	wget -q --no-check-certificate --no-cache --no-cookies 'https://github.com/Bruceychen/pvpoketw/raw/master/src/data/gamemaster.json' -O './tmp/gamemaster.json'; \
	node ./task/genGM.js

copy-assets:
	mkdir -p public; \
# 	mkdir -p public/pokedex; \
	cp -r ./assets/* ./public/
