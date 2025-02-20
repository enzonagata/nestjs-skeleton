# cyber-integration

## Time mantenedor

- Squad Crédito Cobrança
- Canais no Slack:
  - #squad-credito-cobranca

## Descrição

Projeto em NestJS para integração com a Cyber Financial.

## Índice da Documentação

- [Links e Acessos](docs/links-e-acessos.md)
- [Padrões e Políticas dessa codebase](docs/padroes-e-politicas-dessa-codebase.md)
- [Endpoints e Acessos](docs/endpoints-e-acessos.md)
- [Documentação API](docs/documentacao-api.md)

## *Setup* Local

Pré requisitos:

- Certifique-se de que você tenha as tecnologias abaixo instalados localmente na sua máquina:
  - Git;
  - Docker;
  - Make;
  - npm (para eventual instalação de novas dependências no projeto).

Comece fazendo o *clone* do repositório usando o Git:

   ```
   git clone https://github.com/PRAVALER/cyber-integration
   ```

### Criando o *container* da API

1. Faça o *build* do *container* com o seguinte comando (pode ser necessário que você adicione o prefixo `sudo`, dependendo da forma como o Docker foi instalado):

   ```
   make build
   ```

2. Suba o *container* com o seguinte comando:

   ```
   make run
   ```

3. Como exemplo, acesse a rota de *healthcheck* da API através do seguinte endereço: <http://localhost:3000/v1/healthcheck>

### Executando os testes com geração do relatório de cobertura

1. Faça o *build* do *container* com o seguinte comando (pode ser necessário que você adicione o prefixo `sudo`, dependendo da forma como o Docker foi instalado):

   ```
   make build-test
   ```

2. Suba o *container* para executar os testes com o seguinte comando:

   ```
   make run-test
   ```

3. Acesse o relatório de cobertura de testes abrindo o arquivo `coverage/lcov-report/index.html` no navegador.

### Observações

- o serviço é recompilado automaticamente a cada alteração no código. Graças a essa funcionalidade que já vem com o NestJS, e ao volume que é criado localmente, é possível editar o código na máquina *host* e ter as alterações refletindo dentro do *container* logo em seguida;
- também há um volume para o diretório `coverage`, possibilitando que o relatório seja acessado fora do *container* após a execução dos testes com o comando do item 2 da subseção anterior.
