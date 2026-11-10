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

async function cadastrarCliente() {
  var nome = document.getElementById('cli-nome').value.trim();
  var tel = document.getElementById('cli-tel').value.trim();

  if (!nome) {
    alert('Informe o nome.');
    return;
  }

  try {
    var resposta = await fetch('/clientes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nome: nome,
        telefone: tel
      })
    });

    if (!resposta.ok) {
      throw new Error('Erro ao cadastrar cliente.');
    }

    var clienteSalvo = await resposta.json();

    clientes.push(clienteSalvo);

    alert('Cliente cadastrado com sucesso!');

    document.getElementById('cli-nome').value = '';
    document.getElementById('cli-tel').value = '';

  } catch (erro) {
    console.error(erro);
    alert('Não foi possível cadastrar o cliente.');
  }
}

async function buscarCliente() {
  var termo = document.getElementById('busca-cli').value.trim().toLowerCase();

  try {
    var resposta = await fetch('/clientes');

    if (!resposta.ok) {
      throw new Error('Erro ao buscar clientes.');
    }

    clientes = await resposta.json();

    var lista = clientes.filter(function(c) {
      return c.nome.toLowerCase().includes(termo);
    });

    if (!lista.length) {
      mostrar('<p class="vazio">Nenhum cliente encontrado.</p>');
      return;
    }

    var html = '';

    lista.forEach(function(c) {
      html += '<div class="card">';
      html += '<h4>👤 ' + c.nome + '</h4>';
      html += '<p>Tel: ' + (c.telefone || '—') + '</p>';
      html += '</div>';
    });

    mostrar(html);

  } catch (erro) {
    console.error(erro);
    alert('Não foi possível buscar os clientes.');
  }
}

// ANIMAIS

async function cadastrarAnimal() {
  var nome = document.getElementById('ani-nome').value.trim();
  var especie = document.getElementById('ani-especie').value.trim();
  var dono = document.getElementById('ani-dono').value.trim();

  if (!nome || !dono) {
    alert('Informe o nome do animal e do responsável.');
    return;
  }

  try {
    // Busca os clientes cadastrados no banco
    var respostaClientes = await fetch('/clientes');

    if (!respostaClientes.ok) {
      throw new Error('Erro ao buscar clientes.');
    }

    var listaClientes = await respostaClientes.json();

    // Localiza o responsável pelo nome
    var cliente = listaClientes.find(function(c) {
      return c.nome.toLowerCase() === dono.toLowerCase();
    });

    if (!cliente) {
      alert('Cliente não encontrado. Cadastre o cliente primeiro.');
      return;
    }

    // Salva o animal vinculado ao cliente
    var resposta = await fetch('/animais', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nome: nome,
        especie: especie,
        cliente: {
          codCliente: cliente.codCliente
        }
      })
    });

    if (!resposta.ok) {
      throw new Error('Erro ao cadastrar animal.');
    }

    alert('Animal cadastrado com sucesso!');

    document.getElementById('ani-nome').value = '';
    document.getElementById('ani-especie').value = '';
    document.getElementById('ani-dono').value = '';

  } catch (erro) {
    console.error(erro);
    alert('Não foi possível cadastrar o animal.');
  }
}

async function verAnimais() {
  var dono = document.getElementById('busca-dono').value.trim().toLowerCase();

  try {
    var resposta = await fetch('/animais');

    if (!resposta.ok) {
      throw new Error('Erro ao buscar animais.');
    }

    animais = await resposta.json();

    var lista = animais.filter(function(a) {
      var nomeDono = a.cliente ? a.cliente.nome : '';
      return nomeDono.toLowerCase().includes(dono);
    });

    if (!lista.length) {
      mostrar('<p class="vazio">Nenhum animal encontrado.</p>');
      return;
    }

    var html = '';

    lista.forEach(function(a) {
      var nomeDono = a.cliente ? a.cliente.nome : 'Não informado';

      html += '<div class="card">';
      html += '<h4>🐾 ' + a.nome + '</h4>';
      html += '<p>' + a.especie + ' — Responsável: ' + nomeDono + '</p>';
      html += '</div>';
    });

    mostrar(html);

  } catch (erro) {
    console.error(erro);
    alert('Não foi possível buscar os animais.');
  }
}

// CONSULTAS

// CONSULTAS

async function carregarDadosConsultas() {
  var respostas = await Promise.all([
    fetch('/clientes'),
    fetch('/animais'),
    fetch('/consultas')
  ]);

  if (respostas.some(function(r) { return !r.ok; })) {
    throw new Error('Erro ao carregar os dados das consultas.');
  }

  clientes = await respostas[0].json();
  animais = await respostas[1].json();
  consultas = await respostas[2].json();

  return consultas.map(function(c) {
    var animal = animais.find(function(a) {
      return a.codAnimal === c.animal.codAnimal;
    });

    var cliente = animal && animal.cliente
        ? clientes.find(function(cli) {
          return cli.codCliente === animal.cliente.codCliente;
        })
        : null;

    return {
      ...c,
      nomeAnimal: animal ? animal.nome : 'Animal não encontrado',
      nomeDono: cliente ? cliente.nome : 'Responsável não encontrado'
    };
  });
}

async function agendarConsulta() {
  var nomeAnimal = document.getElementById('con-animal').value.trim();
  var nomeDono = document.getElementById('con-dono').value.trim();
  var dataHora = document.getElementById('con-data').value;

  if (!nomeAnimal || !nomeDono || !dataHora) {
    alert('Informe o animal, o responsável e a data e horário.');
    return;
  }

  try {
    await carregarDadosConsultas();

    var animalEncontrado = animais.find(function(a) {
      var cliente = a.cliente
          ? clientes.find(function(c) {
            return c.codCliente === a.cliente.codCliente;
          })
          : null;

      return a.nome.toLowerCase() === nomeAnimal.toLowerCase()
          && cliente
          && cliente.nome.toLowerCase() === nomeDono.toLowerCase();
    });

    if (!animalEncontrado) {
      alert('Animal não encontrado para esse responsável.');
      return;
    }

    var partes = dataHora.split('T');
    var data = partes[0];
    var horario = partes[1];

    if (horario.length === 5) {
      horario += ':00';
    }

    var conflito = consultas.find(function(c) {
      return c.data === data
          && c.horario === horario
          && c.status !== 'CANCELADA';
    });

    if (conflito) {
      alert('Já existe uma consulta nesse horário.');
      return;
    }

    var resposta = await fetch('/consultas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: data,
        horario: horario,
        status: 'AGENDADA',
        animal: {
          codAnimal: animalEncontrado.codAnimal
        }
      })
    });

    if (!resposta.ok) {
      throw new Error('Erro ao agendar consulta.');
    }

    alert('Consulta agendada com sucesso!');

    document.getElementById('con-animal').value = '';
    document.getElementById('con-dono').value = '';
    document.getElementById('con-data').value = '';

  } catch (erro) {
    console.error(erro);
    alert('Não foi possível agendar a consulta.');
  }
}

async function buscarConsulta() {
  var termo = document.getElementById('busca-con').value.trim().toLowerCase();

  try {
    var lista = await carregarDadosConsultas();

    lista = lista.filter(function(c) {
      return c.nomeAnimal.toLowerCase().includes(termo);
    });

    renderConsultas(lista);

  } catch (erro) {
    console.error(erro);
    alert('Não foi possível buscar as consultas.');
  }
}

async function filtrarAgenda() {
  var status = document.getElementById('filtro').value;

  try {
    var lista = await carregarDadosConsultas();

    if (status) {
      lista = lista.filter(function(c) {
        return c.status.toLowerCase() === status;
      });
    }

    renderConsultas(lista);

  } catch (erro) {
    console.error(erro);
    alert('Não foi possível carregar a agenda.');
  }
}

function renderConsultas(lista) {
  if (!lista.length) {
    mostrar('<p class="vazio">Nenhuma consulta encontrada.</p>');
    return;
  }

  var html = '';

  lista.forEach(function(c) {
    var status = c.status.toLowerCase();
    var dataFormatada = c.data.split('-').reverse().join('/');

    html += '<div class="card">';
    html += '<h4>📅 ' + c.nomeAnimal;
    html += ' <span class="badge badge-' + status + '">' + status + '</span></h4>';
    html += '<p>Responsável: ' + c.nomeDono + '</p>';
    html += '<p>Data: ' + dataFormatada + ' às ' + c.horario + '</p>';
    html += '<div class="card-acoes">';

    if (c.status === 'AGENDADA') {
      html += '<button class="btn-reagendar" onclick="reagendar(' + c.codConsulta + ')">Reagendar</button>';
      html += '<button class="btn-cancelar" onclick="cancelar(' + c.codConsulta + ')">Cancelar</button>';
      html += '<button class="btn-realizada" onclick="realizada(' + c.codConsulta + ')">Realizada</button>';
    }

    html += '</div></div>';
  });

  mostrar(html);
}

async function atualizarConsulta(id, novaData, novoHorario, novoStatus) {
  var lista = await carregarDadosConsultas();

  var consulta = lista.find(function(c) {
    return c.codConsulta === id;
  });

  if (!consulta) {
    throw new Error('Consulta não encontrada.');
  }

  var resposta = await fetch('/consultas/' + id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      data: novaData || consulta.data,
      horario: novoHorario || consulta.horario,
      status: novoStatus || consulta.status,
      animal: {
        codAnimal: consulta.animal.codAnimal
      }
    })
  });

  if (!resposta.ok) {
    throw new Error('Erro ao atualizar consulta.');
  }

  return carregarDadosConsultas();
}

async function reagendar(id) {
  var novaDataHora = prompt('Nova data e horário (AAAA-MM-DDTHH:MM):');

  if (!novaDataHora) return;

  var partes = novaDataHora.split('T');

  if (partes.length !== 2) {
    alert('Formato inválido. Utilize AAAA-MM-DDTHH:MM.');
    return;
  }

  var data = partes[0];
  var horario = partes[1].length === 5
      ? partes[1] + ':00'
      : partes[1];

  try {
    var lista = await carregarDadosConsultas();

    var conflito = lista.find(function(c) {
      return c.data === data
          && c.horario === horario
          && c.codConsulta !== id
          && c.status !== 'CANCELADA';
    });

    if (conflito) {
      alert('Horário indisponível.');
      return;
    }

    var atualizada = await atualizarConsulta(id, data, horario, 'AGENDADA');

    alert('Consulta reagendada!');
    renderConsultas(atualizada);

  } catch (erro) {
    console.error(erro);
    alert('Não foi possível reagendar a consulta.');
  }
}

async function cancelar(id) {
  if (!confirm('Cancelar esta consulta?')) return;

  try {
    var lista = await atualizarConsulta(id, null, null, 'CANCELADA');

    alert('Consulta cancelada!');
    renderConsultas(lista);

  } catch (erro) {
    console.error(erro);
    alert('Não foi possível cancelar a consulta.');
  }
}

async function realizada(id) {
  try {
    var lista = await atualizarConsulta(id, null, null, 'REALIZADA');

    alert('Consulta marcada como realizada!');
    renderConsultas(lista);

  } catch (erro) {
    console.error(erro);
    alert('Não foi possível atualizar a consulta.');
  }
}

