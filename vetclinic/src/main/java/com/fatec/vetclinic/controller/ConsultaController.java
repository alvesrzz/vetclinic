package com.fatec.vetclinic.controller;

import com.fatec.vetclinic.model.Consulta;
import com.fatec.vetclinic.service.ConsultaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/consultas")
public class ConsultaController {

    @Autowired
    private ConsultaService service;

    @GetMapping
    public List<Consulta> listarTodos() {
        return service.listarTodos();
    }

    @PostMapping
    public Consulta salvar(@RequestBody Consulta consulta) {
        return service.salvar(consulta);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }
}
