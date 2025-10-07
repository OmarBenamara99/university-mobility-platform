package com.fogbank.springsecurity.Repository;

import com.fogbank.springsecurity.entities.Image;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRepository extends JpaRepository<Image,Long> {
}
