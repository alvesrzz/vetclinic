package com.fatec.vetclinic.service;

import com.fatec.vetclinic.model.Cliente;
import com.fatec.vetclinic.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository repository;

    public List<Cliente> listarTodos() {
        return repository.findAll();
    }

    public Cliente salvar(Cliente cliente) {
        return repository.save(cliente);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }

    public Cliente buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
    }

    public Cliente atualizar(Long id, Cliente cliente) {

        Cliente existente = buscarPorId(id);

        existente.setNome(cliente.getNome());
        existente.setTelefone(cliente.getTelefone());

        return repository.save(existente);
    }

}
