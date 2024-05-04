export default class ListaUsuarioPage {
  labelEmail = '[data-test="userDataEmail"]';
  labelNome = '[data-test="userDataName"]';

  linkPaginaNovoUsuario = '[href="/users/novo"]';
  headerUsuarioNaoCadastro = 'h3';

  buttonVoltarPagina = '#paginacaoVoltar';
  buttonProximaPagina = '#paginacaoProximo';
  labelPaginacaoAtual = '#paginacaoAtual';

  buttonDeletarUsuario = '[data-test="userDataDelete"]';
  buttonVerDetalhesUsuario = '#userDataDetalhe';

  componenteTodosUsuarios = '#listaUsuarios #userData';

  clickButtonProximaPagina() {
    cy.get(this.buttonProximaPagina).click();
  }

  clickButtonVoltarPagina() {
    cy.get(this.buttonVoltarPagina).click();
  }

  getComponenteTodosUsuarios() {
    return cy.get(this.componenteTodosUsuarios);
  }
}
