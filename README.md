# <Nome da Aplicação>
## Qual o objetivo da aplicação?

[Descreva o objetivo da sua aplicação]

## Quem é a equipe responsável?
### <Nome da equipe responsável>
- :mailbox_with_no_mail: email@exemple.com.br

## Quais os pré-requisitos para rodar a aplicação?

> Escreva aqui os pré-requisitos para a aplicação funcionar

### Docker
- Renomeie os *container_name* no arquivo **docker-compose.yml**;
- Executar o seguinte comando na raiz do projeto:
    ```shell
    docker-compose up --build 
    ```
- Após o build completo provavelmente aparecerá falha na conexão com o banco de dados, sendo assim é necessário executar o comando
(use como host o IP atribuido no Gateway):
    ```shell
    docker inspect <nome-da-aplicacao>
    ```
- Acesse pela seguinte URL:
[http://localhost:3000/api/v1](http://localhost:3000/api/v1) 
    - Obs.: A URL vai depender da versão da API configurada em suas rotas nas controllers

### NPM
- Primeiramente faça as instalações necessárias através do comando:
    ```shell
    npm install
    ```
- Agora execute o seguinte comando na raiz do projeto:
    ```shell
    npm run start:dev
    ```
- Acesse pela seguinte URL:
[http://localhost:3000/api](http://localhost:3000/api) 

## Como executar testes?

- Execute os testes com o seguinte comando:
  ```bash
  # unit tests
  npm run test

  # e2e tests
  npm run test:e2e

  # test coverage
  npm run test:cov
  ```