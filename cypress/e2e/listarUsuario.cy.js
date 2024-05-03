import ListaUsuarioPage from '../support/pages/listaUsario.page';
const paginaListaUsuario = new ListaUsuarioPage();

describe('Testes da funcionalidade de listagem de usuário', function () {
  beforeEach(() => {
    cy.visit('');
  });

  it('Deve ser possível consultar a lista de usuários', function () {
    cy.intercept('GET', '/api/v1/users', {
      statusCode: 200,
      fixture: 'listaUsuarios.json',
    }).as('getUsers');
    cy.wait('@getUsers').then(function (consultaUsuarios) {
      const listaUsuarios = consultaUsuarios.response.body;

      listaUsuarios.forEach((usuario) => {
        cy.contains(paginaListaUsuario.labelNome, 'Nome: ' + usuario.name);
        // dario@yahoo.com -> e-mail completo
        // dario@yaho -> fragmento do e-mail que será validado com o slice(0,10)
        cy.contains(
          paginaListaUsuario.labelEmail,
          'E-mail: ' + usuario.email.slice(0, 21)
        );
      });
    });
  });

  it('Deve existir uma opção para cadastrar usuário quando não existirem usuários cadastrados', function () {
    cy.intercept('GET', '/api/v1/users', {
      statusCode: 200,
      body: [],
    }).as('getUsers');
    cy.wait('@getUsers');

    cy.contains(
      paginaListaUsuario.headerUsuarioNaoCadastro,
      'Ops! Não existe nenhum usuário para ser exibido.'
    );
    cy.contains(
      paginaListaUsuario.linkPaginaNovoUsuario,
      'Cadastre um novo usuário'
    );
  });

  it('Deve exibir a paginação se existir mais de 6 usuários cadastrados', function () {});

  it('Não deve ser possível avançar para a próxima página se não existirem usuários para serem exibidos nela', function () {});

  it.only('Deve ser possível navegar entre as páginas da lista de usuários', function () {
    cy.intercept('GET', '/api/v1/users', {
      statusCode: 200,
      fixture: 'listaUsuarioTresPaginas.json',
    }).as('getUsers');

    cy.wait('@getUsers').then((consultaUsuarios) => {
      const quantidadeUsuarios = consultaUsuarios.response.body.length;
      const quantidadePaginas = Math.floor(quantidadeUsuarios / 6);

      // utilizando laço de repetição for, que será executado até a quantidadePaginas
      for (var i = 0; i < quantidadePaginas; i++) {
        paginaListaUsuario.clickButtonProximaPagina();
      }
      // clicando a quantidade de vezes que for necessária de acordo com a fixture(manual)
      // paginaListaUsuario.clickButtonProximaPagina();
      // paginaListaUsuario.clickButtonProximaPagina();

      cy.contains(paginaListaUsuario.labelPaginacaoAtual, '3 de 3');
      cy.get(paginaListaUsuario.buttonProximaPagina).should('be.disabled');
    });
  });

  it('Devem existir opções para exibir detalhes ou excluir usuário', function () {});
});
