// app.js

var clientes  = [];
var animais   = [];
var consultas = [];

// LOGIN
function login() {
  var u = document.getElementById('usuario').value;
  var s = document.getElementById('senha').value;
  if (u === 'secretaria' && s === '1234') {
    document.getElementById('login').style.display = 'none';
    document.getElementById('sistema').classList.remove('oculto');
  } else {
    document.getElementById('erro').textContent = 'Usuário ou senha incorretos.';
  }
}

function sair() {
  document.getElementById('login').style.display = 'block';
  document.getElementById('sistema').classList.add('oculto');
  document.getElementById('usuario').value = '';
  document.getElementById('senha').value = '';
}

// ABAS
function aba(nome, btn) {
  var paineis = ['clientes', 'animais', 'consultas', 'agenda'];
  paineis.forEach(function(p) {
    document.getElementById('painel-' + p).classList.add('oculto');
  });
  document.getElementById('painel-' + nome).classList.remove('oculto');

  document.querySelectorAll('nav button').forEach(function(b) {
    b.classList.remove('ativo');
  });
  btn.classList.add('ativo');
  mostrar('<p class="vazio">Os resultados aparecerão aqui.</p>');
}

function mostrar(html) {
  document.getElementById('resultado').innerHTML = html;
}

// CLIENTES
function cadastrarCliente() {
  var nome = document.getElementById('cli-nome').value.trim();
  var tel  = document.getElementById('cli-tel').value.trim();
  if (!nome) { alert('Informe o nome.'); return; }
  clientes.push({ id: Date.now(), nome: nome, tel: tel });
  alert('Cliente cadastrado!');
  document.getElementById('cli-nome').value = '';
  document.getElementById('cli-tel').value  = '';
}

function buscarCliente() {
  var termo = document.getElementById('busca-cli').value.trim().toLowerCase();
  var lista = clientes.filter(function(c) {
    return c.nome.toLowerCase().includes(termo);
  });
  if (!lista.length) { mostrar('<p class="vazio">Nenhum cliente encontrado.</p>'); return; }
  var html = '';
  lista.forEach(function(c) {
    html += '<div class="card"><h4>👤 ' + c.nome + '</h4><p>Tel: ' + (c.tel || '—') + '</p></div>';
  });
  mostrar(html);
}

// ANIMAIS
function cadastrarAnimal() {
  var nome    = document.getElementById('ani-nome').value.trim();
  var especie = document.getElementById('ani-especie').value.trim();
  var dono    = document.getElementById('ani-dono').value.trim();
  if (!nome || !dono) { alert('Informe o nome do animal e do dono.'); return; }

  var existe = clientes.find(function(c) { return c.nome.toLowerCase() === dono.toLowerCase(); });
  if (!existe) { alert('Cliente não encontrado. Cadastre o cliente primeiro.'); return; }

  animais.push({ id: Date.now(), nome: nome, especie: especie, dono: dono });
  alert('Animal cadastrado!');
  document.getElementById('ani-nome').value    = '';
  document.getElementById('ani-especie').value = '';
  document.getElementById('ani-dono').value    = '';
}

function verAnimais() {
  var dono  = document.getElementById('busca-dono').value.trim().toLowerCase();
  var lista = animais.filter(function(a) { return a.dono.toLowerCase().includes(dono); });
  if (!lista.length) { mostrar('<p class="vazio">Nenhum animal encontrado.</p>'); return; }
  var html = '';
  lista.forEach(function(a) {
    html += '<div class="card"><h4>🐾 ' + a.nome + '</h4><p>' + a.especie + ' — Dono: ' + a.dono + '</p></div>';
  });
  mostrar(html);
}

// CONSULTAS
function agendarConsulta() {
  var animal = document.getElementById('con-animal').value.trim();
  var dono   = document.getElementById('con-dono').value.trim();
  var data   = document.getElementById('con-data').value;
  if (!animal || !data) { alert('Informe o animal e a data.'); return; }

  var animalOk = animais.find(function(a) {
    return a.nome.toLowerCase() === animal.toLowerCase() && a.dono.toLowerCase() === dono.toLowerCase();
  });
  if (!animalOk) { alert('Animal não encontrado para esse dono. Cadastre primeiro.'); return; }

  var conflito = consultas.find(function(c) { return c.data === data && c.status !== 'cancelada'; });
  if (conflito) { alert('Já existe uma consulta nesse horário.'); return; }

  consultas.push({ id: Date.now(), animal: animal, dono: dono, data: data, status: 'agendada' });
  alert('Consulta agendada!');
  document.getElementById('con-animal').value = '';
  document.getElementById('con-dono').value   = '';
  document.getElementById('con-data').value   = '';
}

function buscarConsulta() {
  var termo = document.getElementById('busca-con').value.trim().toLowerCase();
  var lista = consultas.filter(function(c) { return c.animal.toLowerCase().includes(termo); });
  renderConsultas(lista);
}

function filtrarAgenda() {
  var status = document.getElementById('filtro').value;
  var lista  = status ? consultas.filter(function(c) { return c.status === status; }) : consultas;
  renderConsultas(lista);
}

function renderConsultas(lista) {
  if (!lista.length) { mostrar('<p class="vazio">Nenhuma consulta encontrada.</p>'); return; }
  var html = '';
  lista.forEach(function(c) {
    var data = new Date(c.data).toLocaleString('pt-BR');
    html += '<div class="card">';
    html += '<h4>📅 ' + c.animal + ' <span class="badge badge-' + c.status + '">' + c.status + '</span></h4>';
    html += '<p>Dono: ' + c.dono + ' | ' + data + '</p>';
    html += '<div class="card-acoes">';
    if (c.status === 'agendada') {
      html += '<button class="btn-reagendar" onclick="reagendar(' + c.id + ')">Reagendar</button>';
      html += '<button class="btn-cancelar"  onclick="cancelar('  + c.id + ')">Cancelar</button>';
      html += '<button class="btn-realizada" onclick="realizada(' + c.id + ')">Realizada</button>';
    }
    html += '</div></div>';
  });
  mostrar(html);
}

function reagendar(id) {
  var novaData = prompt('Nova data/hora (AAAA-MM-DDTHH:MM):');
  if (!novaData) return;
  var conflito = consultas.find(function(c) { return c.data === novaData && c.id !== id && c.status !== 'cancelada'; });
  if (conflito) { alert('Horário indisponível.'); return; }
  var c = consultas.find(function(c) { return c.id === id; });
  c.data = novaData;
  alert('Reagendado!');
  renderConsultas(consultas);
}

function cancelar(id) {
  if (!confirm('Cancelar esta consulta?')) return;
  consultas.find(function(c) { return c.id === id; }).status = 'cancelada';
  renderConsultas(consultas);
}

function realizada(id) {
  consultas.find(function(c) { return c.id === id; }).status = 'realizada';
  renderConsultas(consultas);
}
