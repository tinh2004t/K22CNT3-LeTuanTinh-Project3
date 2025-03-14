package com.hatechno.service;
import java.util.Base64;
import java.security.SecureRandom;

public class GenerateSecretKey {
    public static void main(String[] args) {
        byte[] key = new byte[32];
        new SecureRandom().nextBytes(key);
        String secret = Base64.getEncoder().encodeToString(key);
        System.out.println("Generated Secret Key: " + secret);
    }
}