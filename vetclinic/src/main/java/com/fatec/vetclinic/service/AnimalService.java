package com.fatec.vetclinic.service;

import com.fatec.vetclinic.model.Animal;
import com.fatec.vetclinic.repository.AnimalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnimalService {

    @Autowired
    private AnimalRepository repository;

    public List<Animal> listarTodos() {
        return repository.findAll();
    }

    public Animal salvar(Animal animal) {
        return repository.save(animal);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}
