package com.fatec.vetclinic.controller;

import com.fatec.vetclinic.model.Animal;
import com.fatec.vetclinic.service.AnimalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/animais")
public class AnimalController {

    @Autowired
    private AnimalService service;

    @GetMapping
    public List<Animal> listarTodos() {
        return service.listarTodos();
    }

    @PostMapping
    public Animal salvar(@RequestBody Animal animal) {
        return service.salvar(animal);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }

    @GetMapping("/{id}")
    public Animal buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public Animal atualizar(
            @PathVariable Long id,
            @RequestBody Animal animal) {

        return service.atualizar(id, animal);
    }

}
