package com.fatec.vetclinic.model;

import jakarta.persistence.*;

@Entity
@Table(name = "animal")
public class Animal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long codAnimal;

    private String nome;
    private String especie;

    @ManyToOne
    @JoinColumn(name = "cod_cliente")
    private Cliente cliente;

    public Long getCodAnimal() {
        return codAnimal;
    }

    public void setCodAnimal(Long codAnimal) {
        this.codAnimal = codAnimal;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEspecie() {
        return especie;
    }

    public void setEspecie(String especie) {
        this.especie = especie;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }
}
