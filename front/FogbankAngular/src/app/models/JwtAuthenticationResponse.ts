export interface JwtAuthenticationResponse {
  token: string; // Token d'accès JWT
  refreshToken: string; // Type de token (par exemple, "Bearer")
}
