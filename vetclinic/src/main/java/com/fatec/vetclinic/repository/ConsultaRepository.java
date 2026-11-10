package com.fatec.vetclinic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.fatec.vetclinic.model.Consulta;

public interface ConsultaRepository extends JpaRepository<Consulta, Long> {

}