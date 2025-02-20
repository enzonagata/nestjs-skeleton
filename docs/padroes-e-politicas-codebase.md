# Padrões e Políticas dessa CodeBase

- Colocar todas as informações sobre:
  - Padrões de código que esse código vai seguir
  - Decisões técnicas gerais que o time/squad tomou anteriormente
  - Políticas de Code Review, nome de PR, Merge, Reverts, Deploys, etc
  - Acordos de desenvolvimento para manter esse código saudável

### Exemplo

- <b>Breaking Changes</b>
  - Esse código é utilizada por outras aplicações, portanto, esse código não deve quebrar de forma alguma.
  - Para isso, é importante que ao implementar uma nova feature, façacamos de forma que o código continue funcionando para os clientes que já estão utilizando
- <b>Nomes</b>
  - Ao longo da aplicação é esperado que sigamos a convenção camelCase para nomes de variáveis, métodos, arquivos e diretórios
  - Para classes é esperado que sigamos a convenção PascalCase. (nomes de arquivos arquivos que exportam essas classes como default também manter em padrão PascalCase)
- <b>package.json</b>
  - Não remover as informações do package.json: "name", "description", "main", "author", "license", "homepage", "private"
    - Qualquer mudança brusca nessas informações deve ser avisada/debatida com o tech-lead e/ou time antes.
  - Atualizações de pacotes do package.json deve seguir a política:
    - As novas versões dos pacotes NÃO DEVE de forma alguma quebrar o código em produção.
    - É preferível que os pacotes sejam atualizadas somente quando ocorrem bugs no código existente já funcionando ou quando recebem atualizações de segurança importantes
    - Caso queira atualizar para uma versão MAJOR (versão 3.x.x por exemplo), verifique e debata com o tech-lead e/ou time antes se as mudanças serão significativas para esse projeto
    - Sempre verifique e teste o código antes com as novas versões dos pacote, para ver se tudo continua funcionando adequadamente.
- <b>Tipagem</b>
  - Se possível, jamais use `any` como tipagem no typescript, e caso for refatorar uma task que tenha `any`, substitui-lo
  - É bastante aconselhavél que todo novo código seja fortemente tipado, para evitar bugs não previstos
- <b>Acessos Diversos</b>
  - Todas as vezes que você for documentar algum processo ou execução de alguma parte desse código, verifique se o desenvolvedor vai precisar de algum acesso específico. Exemplos:
    - Para executar algum script, o desenvolvedor precisará estar conectado ao MongoDB com VPN ligada -> lembre-se de deixar isso explicíto na nova documentação
- <b>Pull Requests</b>
  - Nomes das PRs precisam ser específicas e auto explicativas para serem facilmente identificadas no GitHub. Também é aconselhável usar o id da task do card no JIRA na PR.
    - Exemplo: FEAT CER-885: Verifica se aluno é maior de idade (possui 18 anos ou mais)
  - É recomendado fazer PRs pequenas e singulares para resolver um problema/task em específico.
    - Exemplo: não é recomendado atualizar dependências ou códigos de outro contexto em uma PR de uma task, para não causar problemas de debug caso seja necessário reverter alguma PR.
- <b>Qualidade de Código</b>
  - É utilizado as extensões do Prettier e ESLint para checar o linter desse código.
  - Importante verificar se os plugins do Prettier e ESLint se encontram habilitados no VSCode, ao menos para esse projeto
  - Também importante configurar o VSCode para que as settings locais, contidas no `.vscode/settings.json` sejam prioritárias em relação a outras configurações
- <b>Deploys</b>
  - Não é recomendável fazer deploys na sexta-feira, exceto em alguns casos específicos como hotfix, ou bugs urgentes que precisam ser arrumados.
- <b>Documentação</b>
  - Caso você perceba que alguma parte dessa ou outra documentação esteja errada, desatualizada ou faltando alguma informação importante, por favor, envie uma PR para atualizá-la.
