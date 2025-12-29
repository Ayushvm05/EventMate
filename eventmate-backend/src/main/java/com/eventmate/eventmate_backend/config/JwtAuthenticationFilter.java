package com.eventmate.eventmate_backend.config;

import com.eventmate.eventmate_backend.service.JwtService;
import com.eventmate.eventmate_backend.service.impl.MyUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    // ✅ KEPT: Specific implementation injection (Matches your old code to prevent crash)
    @Autowired
    private MyUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String token;
        final String username;

        // ✅ NEW LOGIC: SILENT CHECK 
        // If no header or invalid format, just continue chain without logging spammy warnings.
        // This allows public pages (Events, Seat Maps) to load without console errors.
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Extract Token
        token = authHeader.substring(7);
        
        try {
            // 1. Extract Username
            username = jwtService.extractUsername(token);

            // 2. Check if user is not already authenticated
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                
                // 3. Load User Details
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

                // 4. Validate Token (Matches your JwtService method name 'validateToken')
                if (jwtService.validateToken(token, userDetails)) {
                    
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, 
                            null, 
                            userDetails.getAuthorities()
                    );
                    
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    
                    // 5. Set Security Context
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            // Keep silent on errors to avoid clogging logs
        }

        // Continue the filter chain
        filterChain.doFilter(request, response);
    }
}