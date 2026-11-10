package com.fatec.vetclinic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.fatec.vetclinic.model.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {

}
