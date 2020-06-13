init: copy-assets
	npm install;

deploy: copy-assets build
	sh deploy.sh

build:
	npm run build;

download: download-full-gm download-new download-tw

download-full-gm:
	mkdir -p data;\
	wget -q --no-check-certificate --no-cache --no-cookies 'https://github.com/PokeMiners/game_masters/raw/master/latest/latest.json' -O './data/gamemaster-full.json'; \

download-new:
	mkdir -p data;\
	wget -q --no-check-certificate --no-cache --no-cookies 'https://github.com/pvpoke/pvpoke/raw/master/src/data/gamemaster.json' -O './data/gamemaster-pvpoke.json'; \

download-tw:
	mkdir -p data;\
	wget -q --no-check-certificate --no-cache --no-cookies 'https://github.com/Bruceychen/pvpoketw/raw/master/src/data/gamemaster.json' -O './data/gamemaster-pvpoketw.json'; \
# no shadow pm
# 'https://github.com/Bruceychen/pvpoketw/raw/df05d0c4b640b17a43bf56a46e751d96ef7c457d/src/data/gamemaster.json'

genGM:
	node ./task/genGM.js

copy-assets:
	mkdir -p public; \
	cp -r ./assets/* ./public/; \
	sed -i -r "s/2020-03-20T00:00:00/`date '+%FT%T'`/g" ./public/index.html; \
	cp ./public/index.html ./public/404.html

dev: copy-assets
	npm run dev
