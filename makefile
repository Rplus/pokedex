deploy: copy-assets build
	sh deploy.sh

build:
	npm run build;

# 'https://github.com/Bruceychen/pvpoketw/raw/master/src/data/gamemaster.json'
# 'https://github.com/Bruceychen/pvpoketw/raw/df05d0c4b640b17a43bf56a46e751d96ef7c457d/src/data/gamemaster.json'
# 'https://github.com/PokeMiners/game_masters/raw/master/latest/latest.json'

download-full-gm:
	mkdir -p tmp;\
	wget -q --no-check-certificate --no-cache --no-cookies 'https://github.com/PokeMiners/game_masters/raw/master/latest/latest.json' -O './tmp/gamemaster_full.json'; \

download-new:
	mkdir -p tmp;\
	wget -q --no-check-certificate --no-cache --no-cookies 'https://github.com/Bruceychen/pvpoketw/raw/master/src/data/gamemaster.json' -O './tmp/gamemaster.json'; \

download:
	mkdir -p tmp;\
	wget -q --no-check-certificate --no-cache --no-cookies 'https://github.com/Bruceychen/pvpoketw/raw/df05d0c4b640b17a43bf56a46e751d96ef7c457d/src/data/gamemaster.json' -O './tmp/gamemaster.json'; \

genGM:
	node ./task/genGM.js

copy-assets:
	mkdir -p public; \
# 	mkdir -p public/pokedex; \
	cp -r ./assets/* ./public/; \
	cp ./public/index.html ./public/404.html
