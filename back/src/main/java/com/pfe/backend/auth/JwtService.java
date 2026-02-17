package com.pfe.backend.auth;

import com.pfe.backend.user.UserEntity;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {
  @Value("${app.jwt.secret}")
  private String secret;

  @Value("${app.jwt.expiration-seconds}")
  private long expirationSeconds;

  public String generateToken(UserEntity user) {
    var now = new Date();
    var exp = new Date(System.currentTimeMillis() + expirationSeconds * 1000);
    return Jwts.builder()
      .subject(user.getUsername())
      .claim("uid", user.getId())
      .claim("role", user.getRole().name())
      .issuedAt(now)
      .expiration(exp)
      .signWith(signingKey())
      .compact();
  }

  public String extractUsername(String token) {
    return parseClaims(token).getSubject();
  }

  public boolean isTokenValid(String token, UserDetails userDetails) {
    return extractUsername(token).equals(userDetails.getUsername())
      && parseClaims(token).getExpiration().after(new Date());
  }

  private Claims parseClaims(String token) {
    return Jwts.parser().verifyWith(signingKey()).build().parseSignedClaims(token).getPayload();
  }

  private SecretKey signingKey() {
    return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
  }
}
