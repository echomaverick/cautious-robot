package org.server.socialapp.controllers;

import org.server.socialapp.models.User;
import org.server.socialapp.services.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/update")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @PutMapping("/{username}")
    public User updateUser(@PathVariable String username, @RequestBody User updatedUser) {
        System.out.println("User updating the data: " + updatedUser);
        return profileService.updateProfile(username, updatedUser);
    }
}
