
package com.fatec.vetclinic.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "consulta")
public class Consulta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long codConsulta;

    private LocalDate data;
    private LocalTime horario;

    @ManyToOne
    @JoinColumn(name = "cod_animal")
    private Animal animal;

    @Enumerated(EnumType.STRING)
    private StatusConsulta status;

    public Long getCodConsulta() {
        return codConsulta;
    }

    public void setCodConsulta(Long codConsulta) {
        this.codConsulta = codConsulta;
    }

    public LocalDate getData() {
        return data;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }

    public LocalTime getHorario() {
        return horario;
    }

    public void setHorario(LocalTime horario) {
        this.horario = horario;
    }

    public Animal getAnimal() {
        return animal;
    }

    public void setAnimal(Animal animal) {
        this.animal = animal;
    }

    public StatusConsulta getStatus() {
        return status;
    }

    public void setStatus(StatusConsulta status) {
        this.status = status;
    }
}
