deploy: copy-assets build
	sh deploy.sh

build:
	npm run build;

# 'https://github.com/Bruceychen/pvpoketw/raw/master/src/data/gamemaster.json'
# 'https://github.com/Bruceychen/pvpoketw/raw/df05d0c4b640b17a43bf56a46e751d96ef7c457d/src/data/gamemaster.json'
genGM:
	mkdir -p tmp;\
	wget -q --no-check-certificate --no-cache --no-cookies 'https://github.com/Bruceychen/pvpoketw/raw/df05d0c4b640b17a43bf56a46e751d96ef7c457d/src/data/gamemaster.json' -O './tmp/gamemaster.json'; \
	node ./task/genGM.js

copy-assets:
	mkdir -p public; \
# 	mkdir -p public/pokedex; \
	cp -r ./assets/* ./public/; \
	cp ./public/index.html ./public/404.html
