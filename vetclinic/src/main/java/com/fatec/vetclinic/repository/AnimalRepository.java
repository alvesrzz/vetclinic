package com.fatec.vetclinic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.fatec.vetclinic.model.Animal;

public interface AnimalRepository extends JpaRepository<Animal, Long> {

}
