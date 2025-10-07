package com.fogbank.springsecurity.controller;


import com.fogbank.springsecurity.Repository.ImageRepository;
import com.fogbank.springsecurity.entities.Image;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/images")
public class ImageController {
    @Autowired
    private ImageRepository imageRepository;
    @PostMapping
    public ResponseEntity<?> uploadImage(@RequestBody byte[] imageData) {
        Image image = new Image();
        image.setData(imageData);
        imageRepository.save(image);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<byte[]> getImage(@PathVariable Long id) {
        Optional<Image> imageOptional = imageRepository.findById(id);
        if (imageOptional.isPresent()) {
            Image image = imageOptional.get();
            return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(image.getData());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
