import { faker } from '@faker-js/faker';
import ListaUsuarioPage from '../support/pages/listaUsario.page';
const paginaListaUsuario = new ListaUsuarioPage();

describe('Testes da funcionalidade de listagem de usuário', function () {
  before(() => {
    cy.request('https://rarocrud-80bf38b38f1f.herokuapp.com/api/v1/users').then(
      (response) => {
        if (response.body.length <= 0) {
          cy.request(
            'POST',
            'https://rarocrud-80bf38b38f1f.herokuapp.com/api/v1/users',
            {
              name: faker.person.fullName(),
              email: faker.internet.email(),
            }
          );
        }
      }
    );
  });

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

  it('Deve exibir a paginação se existir mais de 6 usuários cadastrados', function () {
    cy.intercept('GET', '/api/v1/users', {
      statusCode: 200,
      fixture: 'listaSeteUsuarios.json',
    }).as('getUsers');

    cy.wait('@getUsers');

    cy.get(paginaListaUsuario.labelPaginacaoAtual)
      .contains('1 de 2')
      .and('be.visible');

    // cy.get(paginaListaUsuario.buttonProximaPagina).should('not.be.disabled');
    cy.get(paginaListaUsuario.buttonProximaPagina).should('be.enabled');
    cy.get(paginaListaUsuario.buttonVoltarPagina).should('be.disabled');
  });

  it('Não deve ser possível avançar para a próxima página se não existirem usuários para serem exibidos nela', function () {
    cy.intercept('GET', '/api/v1/users', {
      statusCode: 200,
      fixture: 'listaUsuarios.json',
    }).as('getUsers');

    cy.wait('@getUsers');
    cy.get(paginaListaUsuario.buttonProximaPagina)
      .should('be.disabled')
      .and('be.visible');
    cy.get(paginaListaUsuario.buttonVoltarPagina)
      .should('be.disabled')
      .and('be.visible');
    cy.get(paginaListaUsuario.labelPaginacaoAtual)
      .contains('1 de 1')
      .and('be.visible');
  });

  it('Deve ser possível avançar entre as páginas da lista de usuários', function () {
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
      cy.get(paginaListaUsuario.buttonVoltarPagina).should('be.enabled');
    });
  });

  it('Deve ser possível voltar para a página anterior', function () {
    cy.intercept('GET', '/api/v1/users', {
      statusCode: 200,
      fixture: 'listaUsuarioTresPaginas.json',
    }).as('getUsers');

    cy.wait('@getUsers').then((consultaUsuarios) => {
      const quantidadeUsuarios = consultaUsuarios.response.body.length;
      const quantidadePaginas = Math.floor(quantidadeUsuarios / 6);

      for (var i = 0; i < quantidadePaginas; i++) {
        paginaListaUsuario.clickButtonProximaPagina();
      }

      for (var i = 0; i < quantidadePaginas; i++) {
        paginaListaUsuario.clickButtonVoltarPagina();
      }

      cy.contains(paginaListaUsuario.labelPaginacaoAtual, '1 de 3');
      cy.get(paginaListaUsuario.buttonProximaPagina).should('be.enabled');
      cy.get(paginaListaUsuario.buttonVoltarPagina).should('be.disabled');
    });
  });

  it('Devem existir opções para exibir detalhes ou excluir usuário', function () {
    cy.intercept('GET', '/api/v1/users', {
      statusCode: 200,
      fixture: 'listaUsuarios.json',
    }).as('getUsers');

    cy.wait('@getUsers');

    paginaListaUsuario
      .getComponenteTodosUsuarios()
      .each((componenteUsuario) => {
        cy.wrap(componenteUsuario)
          .find(paginaListaUsuario.buttonDeletarUsuario)
          .should('be.visible');
        cy.wrap(componenteUsuario)
          .find(paginaListaUsuario.buttonVerDetalhesUsuario)
          .should('be.visible');
      });
  });

  it('Cenário de teste de exemplo de intercept com times', function () {
    cy.intercept(
      {
        method: 'GET',
        url: '/api/v1/users',
        times: 1,
      },
      { statusCode: 200, body: [] }
    ).as('getUsers');

    cy.wait('@getUsers');

    cy.wait(1000);

    cy.visit('');

    cy.intercept('GET', '/api/v1/users').as('getUsers');
    cy.wait('@getUsers');
  });
});
