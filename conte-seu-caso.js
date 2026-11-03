/* "Conte seu caso" (página Sobre): monta a mensagem e abre o WhatsApp do
   escritório. Nada é gravado no site; quem envia é a própria pessoa. */
(function () {
  var WHATSAPP = '5567998325997';
  var form = document.getElementById('conte-seu-caso');
  if (!form) return;
  var erro = document.getElementById('caso-erro');
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var d = {};
    ['nome', 'cidade', 'assunto', 'relato'].forEach(function (k) { d[k] = (form.elements[k].value || '').trim(); });
    var falta = ['nome', 'cidade', 'assunto', 'relato'].filter(function (k) { return !d[k]; });
    if (falta.length) {
      erro.textContent = 'Preencha todos os campos para enviar.';
      form.elements[falta[0]].focus();
      return;
    }
    erro.textContent = '';
    var texto = 'Olá, Dr. Jocsan. Gostaria de uma análise.\n\n' +
      'Nome: ' + d.nome + '\nCidade: ' + d.cidade + '\nAssunto: ' + d.assunto + '\n\n' + d.relato;
    if (window.umami && umami.track) umami.track('conte seu caso: enviou', { assunto: d.assunto });
    window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(texto), '_blank', 'noopener');
  });
})();
