# Leiturama Escola Web
Repositório para publicar parte web do projeto [Leiturama Escola](https://github.com/acsantosabino/leiturama)

## Configuração
Para fazer o deploy sigas os seguintes passos:

1. Adicionar remote com codigo fonte:
```
git remote add source-code https://github.com/acsantosabino/leiturama.git
```

2. Fazer o checkout da master:
```
git checkout source-code/master -b src_master
```

3. Instalar e fazer o deploy:
```
cd web
npm install
npm run deploy
```