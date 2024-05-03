export default class ListaUsuarioPage {
  labelEmail = '[data-test="userDataEmail"]';
  labelNome = '[data-test="userDataName"]';

  linkPaginaNovoUsuario = '[href="/users/novo"]';
  headerUsuarioNaoCadastro = 'h3';

  buttonProximaPagina = '#paginacaoProximo';
  labelPaginacaoAtual = '#paginacaoAtual';

  clickButtonProximaPagina() {
    cy.get(this.buttonProximaPagina).click();
  }
}
