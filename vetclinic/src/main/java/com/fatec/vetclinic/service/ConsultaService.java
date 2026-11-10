package com.fatec.vetclinic.service;

import com.fatec.vetclinic.model.Consulta;
import com.fatec.vetclinic.repository.ConsultaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConsultaService {

    @Autowired
    private ConsultaRepository repository;

    public List<Consulta> listarTodos() {
        return repository.findAll();
    }

    public Consulta salvar(Consulta consulta) {
        return repository.save(consulta);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}
